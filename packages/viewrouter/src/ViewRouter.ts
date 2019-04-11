// tslint:disable:no-console

import { Blend, IDictionary } from "@blendsdk/core";
import { IRouteItemConfig, IRouterConfig, Router } from "@blendsdk/router";
import { IUIComponentConfig, IUIComponentStyles, UIComponent } from "@blendsdk/ui";
import { UIStack } from "@blendsdk/uistack";

/**
 * Enum providing the ViewRouter event names.
 *
 * @export
 * @enum {number}
 */
export enum eViewRouterEvents {
	onRouteChanged = "onRouteChanged"
}

/**
 * Helper enum for getting the route information from a view within a
 * ViewRouter.  `view.getUserData(eViewRouterData.routeParams)`
 *
 * @export
 * @enum {number}
 */
export enum eViewRouterData {
	routeParams = "routeParams",
	route = "route"
}

/**
 * Interface for configuring a Route and a View for
 * the ViewRouter component
 *
 * @export
 * @interface IViewRouterRouteConfig
 */
export interface IViewRouterRouteConfig {
    /**
     * The route path
     *
     * @type {string}
     * @memberof IViewRouterRouteConfig
     */
	path: string;
    /**
     * The view/UIComponent to be visible when this
     * path is selected.
     *
     * @type {UIComponent}
     * @memberof IViewRouterRouteConfig
     */
	view: UIComponent;
    /**
     * The route name/identifer
     *
     * @type {string}
     * @memberof IViewRouterRouteConfig
     */
	name: string;
    /**
     * Default vales for the route parameters.
     *
     * @type {IDictionary}
     * @memberof IViewRouterRouteConfig
     */
	defaults?: IDictionary;
    /**
     * Option to configure this route as the default route
     *
     * @type {boolean}
     * @memberof IViewRouterRouteConfig
     */
	isDefault?: boolean;
}

/**
 * Interface for configuring a ViewRouter
 *
 * @export
 * @interface IViewRouterConfig
 * @extends {IRouterConfig}
 * @extends {IUIComponentConfig<IUIComponentStyles>}
 */
export interface IViewRouterConfig extends IRouterConfig, IUIComponentConfig {
    /**
     * Option to configure the Routes
     *
     * @type {IViewRouterRouteConfig[]}
     * @memberof IViewRouterConfig
     */
	routes?: IViewRouterRouteConfig[];
}

/**
 * @TODO
 *
 * @export
 * @class ViewRouter
 * @extends {UIComponent<IUIComponentStyles, IViewRouterConfig>}
 */
export class ViewRouter extends UIComponent {
    /**
     * @override
     * @protected
     * @type {IViewRouterConfig}
     * @memberof ViewRouter
     */
	protected config: IViewRouterConfig;
    /**
     * Reference to the internal UIStack instance
     *
     * @protected
     * @type {UIStack}
     * @memberof IViewRouter
     */
	protected uiStack: UIStack;
    /**
     * Reference to the internal Router instance
     *
     * @protected
     * @type {Router}
     * @memberof IViewRouter
     */
	protected router: Router;

    /**
     * Creates an instance of IViewRouter.
     * @param {IViewRouterConfig} [config]
     * @memberof IViewRouter
     */
	public constructor(config?: IViewRouterConfig) {
		super(config);
		this.configDefaults({
			routes: []
		} as IViewRouterConfig);

		const me = this;
		me.router = new Router({
			onRouteChanged: (sender: any, params: any, route: IRouteItemConfig) => {
				me.uiStack.forEach(item => {
					if (item.getUserData(eViewRouterData.route) === route.name) {
						item.setUserData(eViewRouterData.routeParams, params);
						me.uiStack.setActiveView(item);
						me.dispatchOnRouteChanged(item, params, route);
					}
				});
			}
		});
		me.router.initComponent();
	}

    /**
     * Dispatches the onRouteChanged event.
     *
     * @protected
     * @param {UIComponent} view
     * @param {IDictionary} params
     * @param {IRouteItemConfig} route
     * @memberof ViewRouter
     */
	protected dispatchOnRouteChanged(view: UIComponent, params: IDictionary, route: IRouteItemConfig) {
		this.dispatchEvent(eViewRouterEvents.onRouteChanged, [view, params, route]);
	}

    /**
     * Causes the browser to navigate to a new url using a given
     * route configuration.
     *
     * @param {string} routeName
     * @param {IDictionary} params
     * @memberof ViewRouter
     */
	public navigateTo(routeName: string, params: IDictionary) {
		this.router.navigateTo(routeName, params);
	}

    /**
     * Generates a URL based on a given route name.
     *
     * @param {string} routeName
     * @param {IDictionary} params
     * @returns {string}
     * @memberof ViewRouter
     */
	public generateUrl(routeName: string, params: IDictionary): string {
		return this.router.generateUrl(routeName, params);
	}

    /**
     * Adds one or more view routes to this component.
     *
     * @param {(IViewRouterRouteConfig | IViewRouterRouteConfig[])} route
     * @memberof ViewRouter
     */
	public addRoute(route: IViewRouterRouteConfig | IViewRouterRouteConfig[]) {
		const me = this;
		Blend.wrapInArray<IViewRouterRouteConfig>(route).forEach(item => {
			if (me.isRendered) {
				me.router.addRoute({
					path: item.path,
					defaults: item.defaults,
					name: item.name
				});
				item.view.setUserData(eViewRouterData.route, item.name);
				me.uiStack.add(item.view);
				if (item.isDefault) {
					me.router.setDefaultRoute(item.name);
				}
			} else {
				me.config.routes.push(item);
			}
		});
	}

    /**
     * @override
     * @protected
     * @memberof ViewRouter
     */
	protected finalizeRender() {
		super.finalizeRender();
		this.addRoute(this.config.routes);
	}

    /**
     * @override
     * @protected
     * @memberof ViewRouter
     */
	protected initComponent() {
		super.initComponent();
		const me = this;
		me.uiStack = new UIStack({
			skipInitialView: true
		});
		me.addRoute(me.config.routes || []);
	}

    /**
     * @override
     * @protected
     * @returns {HTMLElement}
     * @memberof ViewRouter
     */
	protected render(): HTMLElement {
		const me = this;
		return me.uiStack.getElement();
	}

    /**
     * @override
     * @protected
     * @param {boolean} [isInitial]
     * @memberof ViewRouter
     */
	protected doLayout(isInitial?: boolean): void {
		const me = this;
		me.uiStack.performLayout();
	}
}
