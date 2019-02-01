import { eBrowserEvents } from "@blendsdk/browser";
import { Blend, Component, IComponentConfig, IDictionary, SystemEvents } from "@blendsdk/core";
import { IMVCComponentConfig, MVCComponent, TComponentEvent } from "@blendsdk/mvc";
import { RouterPath } from "./Path";

/**
 * Enum providing the system-wide router event names.
 *
 * @export
 * @enum {number}
 */
export enum eRouterEvents {
    onRouteChanged = "onRouteChanged",
    hashchange = "hashchange"
}

/**
 * Interface for augmenting RouterEvents to the event
 * collection of a component.
 *
 * @export
 * @interface IRouterEvents
 */
export interface IRouterEvents {
    /**
     * Dispatches when the window's hash path was changed
     *
     * @type {TComponentEvent}
     * @memberof IRouterEvents
     */
    onRouteChanged?: TComponentEvent;
}

/**
 * Interface for configuring a route for a
 * Blend.router.Router instance.
 *
 * @interface IRouteItemConfig
 */
export interface IRouteItemConfig {
    /**
     * Option for configure a path template (/user/:id)
     *
     * @type {(string | Blend.router.Path)}
     * @memberof IRouteItemConfig
     */
    path: string | RouterPath;
    /**
     * Option to configure a name for the route.
     *
     * @type {string}
     * @memberof IRouteItemConfig
     */
    name?: string;
    /**
     *  TODO:1112 Document this config option.
     *
     * @type {(string | Array<string>)}
     * @memberof IRouteItemConfig
     */
    dispatch?: string | string[];
    /**
     * Option to configure default values for this route.
     *
     * @type {IDictionary}
     * @memberof IRouteItemConfig
     */
    defaults?: IDictionary;
}

/**
 * Interface for configuring a Blend.router.Router instance
 *
 * @interface IRouterConfig
 * @extends {IMVCComponentConfig}
 */
export interface IRouterConfig extends IMVCComponentConfig, IRouterEvents {
    /**
     * Option to configure a collection of routes.
     *
     * @type {(IRouteItemConfig | Array<IRouteItemConfig>)}
     * @memberof IRouterConfig
     */
    routes?: IRouteItemConfig | IRouteItemConfig[];
}

/**
 *  TODO:1111 Provide class description
 *
 * @export
 * @class Router
 * @extends {Blend.mvc.Component}
 */
export class Router extends MVCComponent<IRouterConfig> {
    /**
     * @override
     * @protected
     * @type {IRouterConfig}
     * @memberof Router
     */
    protected config: IRouterConfig;
    /**
     * Internal collection of routes withing this Router.
     *
     * @protected
     * @type {Array<Blend.router.Path>}
     * @memberof Router
     */
    protected routes: IRouteItemConfig[];
    /**
     * Reference to the parameters of the current route.
     *
     * @protected
     * @type {IDictionary}
     * @memberof Path
     */
    protected currentRouteParams: IDictionary;

    /**
     * Creates an instance of Router.
     * @param {IRouterConfig} [config]
     * @memberof Router
     */
    public constructor(config?: IRouterConfig) {
        super(config);
        const me = this;
        me.configDefaults({} as IRouterConfig);
        me.routes = [];
    }

    /**
     * Returns the parameters of the currently matched Path.
     *
     * @template T
     * @returns {T}
     * @memberof Path
     */
    public getCurrentParameters<T extends IDictionary>(): T {
        return (this.currentRouteParams || {}) as T;
    }

    /**
     * @override
     * @memberof Router
     */
    public initComponent() {
        const me = this;
        me.addRoute(me.config.routes);
        me.config.routes = null; // free some memory
        SystemEvents.defineEvent(eRouterEvents.onRouteChanged);
        window.addEventListener(eRouterEvents.hashchange, () => {
            me.doRoute(me.getHash());
        });
        me.addEventHandler(eBrowserEvents.onApplicationReady, (sender: any) => {
            me.doRoute(me.getHash());
        });
        super.initComponent();
    }

    /**
     * Get the current hash
     *
     * @protected
     * @returns {string}
     * @memberof Router
     */
    protected getHash(): string {
        return window.location.hash.substring(1);
    }

    /**
     * Applies default values to the matched parameters.
     *
     * @protected
     * @param {IDictionary} match
     * @param {IDictionary} defaults
     * @returns
     * @memberof Router
     */
    protected applyDefaults(match: IDictionary, defaults: IDictionary) {
        // TODO:1113 Add the `lang`
        return Blend.apply(match, defaults || {});
    }

    /**
     * Perform a route operation and dispatches the `onRouteChanged` or the
     * custom event name provided at config time.
     *
     * @protected
     * @param {string} hash
     * @memberof Router
     */
    protected doRoute(hash: string) {
        const me = this;
        let routed: boolean = false;
        me.routes.forEach((route: IRouteItemConfig) => {
            if (!routed) {
                let match: IDictionary = (route.path as RouterPath).match(hash);
                if (match) {
                    match = me.applyDefaults(match, route.defaults);
                    routed = true;
                    me.currentRouteParams = match;
                    Blend.wrapInArray(route.dispatch || eRouterEvents.onRouteChanged).forEach(handler => {
                        me.dispatchHashChange(handler as string, match, route);
                    });
                }
            }
        });
    }

    /**
     * Finds a route by its name.
     *
     * @protected
     * @param {string} name
     * @returns {IRouteItemConfig}
     * @memberof Router
     */
    protected findRouteByName(name: string): IRouteItemConfig {
        const me = this;
        let result: IRouteItemConfig = null;
        me.routes.forEach((route: IRouteItemConfig) => {
            if (result === null && name.toLocaleLowerCase() === route.name.toLocaleLowerCase()) {
                result = route;
            }
        });
        return result;
    }

    /**
     * Generates a URL based on a given route name.
     *
     * @param {string} routeName
     * @param {IDictionary} params
     * @returns {string}
     * @memberof Router
     */
    public generateUrl(routeName: string, params: IDictionary): string {
        const me = this,
            route = me.findRouteByName(routeName);
        if (route) {
            const path = (route.path as RouterPath).generate(params);
            return `${window.location.href.split("#")[0]}#${path}`;
        } else {
            return null;
        }
    }

    /**
     * Cause the browser to navigate to a new url using a given
     * route configuration.
     *
     * @param {string} routeName
     * @param {IDictionary} params
     * @memberof Router
     */
    public navigateTo(routeName: string, params: IDictionary) {
        const me = this,
            url = me.generateUrl(routeName, params);
        if (url) {
            window.location.href = url;
        }
    }

    /**
     * Dispatches a given event when the window location hash is changed.
     *
     * @protected
     * @param {string} eventName
     * @param {*} params
     * @memberof Router
     */
    protected dispatchHashChange(eventName: string, params: any, routeConfig: IRouteItemConfig) {
        SystemEvents.dispatchEvent(eventName, [params, routeConfig]);
    }

    /**
     * Adds a route to this router
     *
     * @param {(IRouteItemConfig | Array<IRouteItemConfig>)} path
     * @memberof Router
     */
    public addRoute(path: IRouteItemConfig | IRouteItemConfig[]) {
        const me = this;
        Blend.wrapInArray(path).forEach((pItem: IRouteItemConfig) => {
            if (Blend.isString(pItem.path)) {
                let pt: string = ((pItem.path || "") as any).trim();
                if (pt === "") {
                    pt = "/";
                }
                pItem.path = new RouterPath({ path: pt });
            }
            Blend.wrapInArray(pItem.dispatch || []).forEach((dpItem: string) => {
                if (Blend.isString(dpItem)) {
                    SystemEvents.defineEvent(dpItem);
                }
            });
            me.routes.push(pItem);
        });
    }
}
