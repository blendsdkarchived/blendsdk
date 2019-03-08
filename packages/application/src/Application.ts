import { Browser, eBrowserEvents } from "@blendsdk/browser";
import { Blend, SystemEvents, TConfigurableClass } from "@blendsdk/core";
import { CSS, IStyleSet, Sheet } from "@blendsdk/css";
import { IUIComponentConfig, IUIComponentStyles, UIComponent } from "@blendsdk/ui";

/**
 * Interface for configuring theme variables for a Application instance.
 *
 * @interface IApplicationStyles
 * @extends {IUIComponentStyles}
 */
export interface IApplicationStyles extends IUIComponentStyles {
    /**
     * Option to configure a background color for this Application
     *
     * @type {string}
     * @memberof IApplicationThemeConfig
     */
    backgroundColor?: string;
}

export interface IApplicationConfig extends IUIComponentConfig {
    /**
     * Required configuration for providing a main view to
     * an application.
     *
     * @type {(TConfigurableClass | Blend.ui.Component)}
     * @memberof IApplicationConfig
     */
    mainView?: TConfigurableClass | UIComponent;
}

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
    protected createStyles(sheet: Sheet, styles: IApplicationStyles, selectorUid: string) {
        const borderBoxSettings: IStyleSet = {
            padding: 0,
            margin: 0,
            boxSizing: "border-box"
        };

        // defaults
        Blend.apply(styles, {
            backgroundColor: "#FFFFFF"
        });

        sheet.addRule([
            CSS.block("b-viewport", [
                borderBoxSettings,
                // sizing
                CSS.makeFit()
            ]),
            CSS.block("b-application", [
                borderBoxSettings,
                {
                    opacity: 0
                },
                CSS.makeFit(),
                CSS.transition([
                    CSS.animationEnter({
                        property: "opacity",
                        durationInSeconds: 0.5
                    })
                ]),
                CSS.and("b-ready", {
                    opacity: 1
                }),
                CSS.child("b-mainview", CSS.makeFit())
            ]),
            CSS.block(selectorUid, {
                backgroundColor: styles.backgroundColor
            })
        ]);
        sheet.pushToTop();
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
     * @override
     * @protected
     * @memberof Application
     */
    protected initComponent() {
        const me = this;

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
                    me.el.classList.add("b-ready");
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
        me.mainView.getElement().classList.add("b-mainview");
    }

    /**
     * override
     * @protected
     * @returns {HTMLElement}
     * @memberof Application
     */
    protected render(): HTMLElement {
        return this.createElement({
            css: ["b-application"]
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
        if (isInitial) {
            document.body.classList.add("b-viewport");
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
