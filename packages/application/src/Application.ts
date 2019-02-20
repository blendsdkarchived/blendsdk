import { Browser, eBrowserEvents } from "@blendsdk/browser";
import { Blend, SystemEvents } from "@blendsdk/core";
import { BEM, CSS, IStyleSet, stylesheet } from "@blendsdk/css";
import { Router } from "@blendsdk/router";
import { UIComponent } from "@blendsdk/ui";
import { IApplicationConfig, IApplicationStyles } from "./Types";

export class Application extends UIComponent {
    /**
     * @override
     * @protected
     * @type {IApplicationConfig}
     * @memberof Application
     */
    protected config: IApplicationConfig;
    /**
     * Reference to the mainView object provided at config time
     *
     * @protected
     * @type {Blend.ui.Component}
     * @memberof Application
     */
    protected mainView: UIComponent;
    /**
     * Indicates if the application is ready and everything is rended
     * as it should.
     *
     * @protected
     * @type {boolean}
     * @memberof Application
     */
    protected isReady: boolean;

    /**
     * Creates an instance of Application.
     * @param {IApplicationConfig} [config]
     * @memberof Application
     */
    public constructor(config?: IApplicationConfig) {
        super(config);
        const me = this;
        me.configDefaults({
            fitToWindow: true
        } as IApplicationConfig);
        me.autoStart();
    }

    /**
     * @override
     * @protected
     * @param {IApplicationStyles} styles
     * @param {string} selectorUid
     * @memberof Application
     */
    protected createStyles(styles: IApplicationStyles, selectorUid: string) {
        // Blend.apply(styles, {
        //     backgroundColor: "#fff"
        // });
        const reset: IStyleSet = {
            padding: 0,
            margin: 0,
            boxSizing: "border-box"
        };
        const sheet = stylesheet([
            BEM.block("b-viewport", [
                reset,
                CSS.makeFit(),
                // the body element
                BEM.element("body", [reset, CSS.makeFit()])
            ]),
            BEM.block("b-app", [
                {
                    opacity: 0.01
                },
                CSS.transition([
                    CSS.animationEnterTransition({
                        property: "opacity",
                        durationInSeconds: 0.5
                    })
                ]),
                reset,
                CSS.makeFit(),
                BEM.modifier("ready", {
                    opacity: 1
                }),
                BEM.element("mainview", [reset, CSS.makeFit()]),
                CSS.block(selectorUid, {
                    backgroundColor: styles.backgroundColor
                })
            ])
        ]);
        this.attachStyleSheet(sheet);
    }

    /**
     * Gets reference to the main view
     *
     * @template T
     * @returns {T}
     * @memberof Application
     */
    public getMainView<T extends UIComponent>(): T {
        return this.mainView as T;
    }

    /**
     * Returns the instance of the Blend.router.Router component if
     * it was provided at the application configuration.
     *
     * It returns `null` when no Router was configured.
     *
     * @returns {Blend.router.Router}
     * @memberof Application
     */
    public getRouter(): Router {
        return this.config.router || null;
    }

    /**
     * @override
     * @protected
     * @memberof Application
     */
    protected initComponent() {
        const me = this,
            router = me.getRouter();

        if (router) {
            router.initComponent();
        }

        if (me.config.mainView) {
            me.mainView = Blend.createComponent(me.config.mainView);
        }

        if (Blend.isInstanceOf(me.mainView, UIComponent)) {
            me.mainView.setParent(me);
        } else {
            throw new Error("Missing or invalid mainView configuration!");
        }
        super.initComponent();
    }

    /**
     * Dispatches the application ready event.
     *
     * @protected
     * @memberof Application
     */
    protected dispatchOnApplicationReady() {
        SystemEvents.dispatchEvent(eBrowserEvents.onApplicationReady);
    }

    /**
     * Auto starts this Application once the browser is ready
     *
     * @protected
     * @memberof Application
     */
    protected autoStart() {
        const me = this;
        // This also does the first layout since it is initiated from Browse:documentReadyHandler
        SystemEvents.addEventHandler(me.getUID(), eBrowserEvents.onWindowResized, () => {
            window.requestAnimationFrame(() => {
                me.performLayout();
                if (!me.isReady) {
                    me.isReady = true;
                    me.el.classList.add("b-app--ready");
                    me.dispatchOnApplicationReady();
                }
            });
        });
        Browser.ready(() => {
            window.document.body.appendChild(me);
            Blend.raf(() => {
                me.performLayout();
            });
        });
    }

    /**
     * @override
     * @protected
     * @memberof Application
     */
    protected finalizeRender() {
        super.finalizeRender();
        const me = this;
        me.el.appendChild(me.mainView);
        me.mainView.getElement().classList.add("b-app__mainview");
    }

    /**
     * override
     * @protected
     * @returns {HTMLElement}
     * @memberof Application
     */
    protected render(): HTMLElement {
        return this.createElement({
            css: ["b-app"]
        });
    }

    /**
     * override
     * @protected
     * @param {boolean} [isInitial]
     * @memberof Application
     */
    protected doLayout(isInitial?: boolean): void {
        const me = this;
        if (me.config.fitToWindow) {
            document.documentElement.classList.add("b-viewport");
            document.body.classList.add("b-viewport__body");
        }
        this.mainView.performLayout();
    }

    /**
     * @override
     * @memberof Application
     */
    public destroy() {
        // remove the window resize listener is possible
        SystemEvents.removeEventHandler(eBrowserEvents.onWindowResized, this.getUID());
        super.destroy();
    }
}
