import { Blend, IDictionary, IScreenInformation, SystemEvents, TFunction } from "@blendsdk/core";
import { StyleSheets } from "@blendsdk/css";
import { Dom } from "@blendsdk/dom";
import { Sheet } from "../../css/dist/Sheet";
import { SystemStyles } from "./SystemStyles";

/**
 * This class provides functionality for getting the browser environment
 * ready for running a Blend application.
 *
 * @class Browser
 * @extends {Blend.core.Component}
 */
class BrowserSingleton {
    /**
     * Collection of read functions
     *
     * @protected
     * @type {Array<TFunction>}
     * @memberof Browser
     */
    protected readyQueue: TFunction[];
    /**
     * Indicates if the system is started
     *
     * @protected
     * @type {boolean}
     * @memberof Browser
     */
    protected isStarted: boolean;
    /**
     * Indicates if the ready queue has been processed
     *
     * @protected
     * @type {boolean}
     * @memberof Browser
     */
    protected isQueueComplete: boolean;
    /**
     * Indicates if the browser is ready and
     * and all the initial processing and preparation is completed.
     *
     * @protected
     * @type {boolean}
     * @memberof Browser
     */
    protected isBrowserReady: boolean;
    /**
     * A dictionary containing screen information provided
     * from the browser's CSS engine.
     *
     * @protected
     * @type {IDictionary}
     * @memberof Browser
     */
    protected screenInfo: IDictionary;
    /**
     * Queue of styles sheets waiting to be attached to the document.
     *
     * @protected
     * @type {Sheet[]}
     * @memberof BrowserSingleton
     */
    protected sheetQueue: Sheet[];

    /**
     * Creates an instance of Browser.
     * @param {ICoreComponentConfig} [config]
     * @memberof Browser
     */
    public constructor() {
        const me = this;
        me.isQueueComplete = false;
        me.isStarted = false;
        me.isBrowserReady = false;
        me.readyQueue = [];
        me.sheetQueue = [];
    }

    /**
     * Attaches a style sheet to the document.
     *
     * @param {Sheet} sheet
     * @memberof BrowserSingleton
     */
    public attachStyleSheet(sheet: Sheet) {
        const me = this;
        if (me.isBrowserReady) {
            StyleSheets.attach(sheet);
        } else {
            me.sheetQueue.push(sheet);
        }
    }

    /**
     * Check if we have a small display so we can handle the
     * `tryCloseOnItemClick` property correctly.
     *
     * @returns {boolean}
     * @memberof Browser
     */
    public isDisplaySmall(): boolean {
        const me = this;
        switch (me.getScreenInformation<IScreenInformation>().display) {
            case "xsmall":
            case "small":
                return true;
            default:
                return false;
        }
    }

    /**
     * Check if the runtime can handle touch events.
     *
     * @returns {boolean}
     * @memberof Runtime
     */
    public get hasTouchEvents(): boolean {
        return "ontouchstart" in window;
    }

    /**
     * Adds a callback handler to the `ready(...)` queue if the runtime
     * environment is not ready yet. Otherwise it will run the handler
     * immediately.
     *
     * @param {TFunction} handler
     * @param {*} [scope]
     * @returns {this}
     *
     * @memberof Runtime
     */
    public ready(handler: TFunction, scope?: any): this {
        const me = this;
        scope = scope || window;
        if (!me.isBrowserReady) {
            me.readyQueue.push(handler);
        } else {
            handler();
        }
        return me;
    }

    /**
     * Indicates if the system is in RTL mode.
     *
     * @returns {boolean}
     * @memberof Browser
     */
    public isRTL(): boolean {
        // TODO:50001  Implement RTL.
        return false;
    }

    /**
     * Gets the screen information provided by CSS. The available information is
     * provided by CSS and `setupScreenInfo`
     *
     * @template T
     * @returns {T}
     *
     * @memberof Browser
     */
    public getScreenInformation<T extends IDictionary>(reset?: boolean): T {
        const me = this;
        let key, styles, value;
        if (reset === true) {
            me.screenInfo = null;
        }
        if (!me.screenInfo) {
            const elements = Dom.findElements(".__screeninfo__"),
                result: IDictionary = {};
            Blend.forEach<HTMLElement>(elements, element => {
                key = element
                    .getAttribute("class")
                    .replace(/__screeninfo__/gim, "")
                    .trim();
                styles = window.getComputedStyle(element, ":after");
                value = new Function(`return "${styles.content.replace(/[\"]/gim, "")}";`)();
                result[key] = isNaN(parseFloat(value)) ? value : parseFloat(value);
            });
            me.screenInfo = result;
        }
        return me.screenInfo as T;
    }

    /**
     * Indicates if the browser is ready.
     *
     * @returns {boolean}
     * @memberof Browser
     */
    public isReady(): boolean {
        return this.isBrowserReady;
    }

    /**
     * Starts the Browser session
     *
     * @memberof Browser
     */
    public start() {
        const me = this,
            win: any = window,
            documentReadyHandler = () => {
                if (me.isQueueComplete !== true) {
                    me.initViewport(() => {
                        me.installScreenInfoKeys(() => {
                            me.installSystemStyles();
                            me.runReadyQueue();
                            me.processSheetQueue();
                            window.requestAnimationFrame(() => {
                                me.installWindowResizeHandler();
                                me.updateScreenInformation();
                                me.readyQueue = [];
                                me.isBrowserReady = me.isQueueComplete = true;
                            });
                        });
                    });
                }
            };
        if (!me.isStarted) {
            me.isStarted = true;
            if (window.document.readyState === "complete") {
                documentReadyHandler.apply(me, []);
            } else {
                window.addEventListener("load", documentReadyHandler);
            }
        }
    }

    /**
     * Attaches all queue styles sheets to the document and
     * empties the queue.
     *
     * @protected
     * @memberof BrowserSingleton
     */
    protected processSheetQueue() {
        const me = this;
        me.sheetQueue.forEach(sheet => {
            StyleSheets.attach(sheet);
        });
        // clear the sheets queue, since everything is rendered now.
        me.sheetQueue = null;
    }

    /**
     * Installs the screen information keys for passing
     * data from css to js.
     *
     * @protected
     * @param {TFunction} doneCallback
     * @memberof Browser
     */
    protected installScreenInfoKeys(doneCallback: TFunction) {
        const docFrag = document.createDocumentFragment();
        ["scrollbarSize", "orientation", "display"].forEach(key => {
            docFrag.appendChild(
                Dom.createElement({
                    css: ["__screeninfo__", key]
                })
            );
        });
        window.document.body.appendChild(docFrag);
        setTimeout(() => {
            doneCallback();
        }, 100);
    }

    /**
     * Run the queued ready functions
     *
     * @protected
     * @memberof Browser
     */
    protected runReadyQueue() {
        const me = this;
        me.readyQueue.forEach((readyFn: TFunction) => {
            readyFn();
        });
    }

    /**
     * Updates the screen information CSS rules if possible
     *
     * @protected
     * @memberof Browser
     */
    protected updateScreenInformation() {
        const me = this;
        if (me.screenInfo) {
            // remove the current screen info css rules if possible.
            Blend.forEach(me.screenInfo, (value, key) => {
                window.document.documentElement.classList.remove(`b-${value}`);
            });
        }
        // Reset and load the screenInformation again
        me.getScreenInformation(true);
        // Update the screen information css rules with the new values
        Blend.forEach(me.screenInfo, (value, key) => {
            if (key !== "scrollbarSize") {
                window.document.documentElement.classList.add(`b-${value}`);
            }
        });
    }

    /**
     * Event handler for when the window is resized.
     *
     * @protected
     * @memberof Browser
     */
    protected windowResizeHandler() {
        const me = this;
        me.updateScreenInformation();
        if (me.isBrowserReady) {
            SystemEvents.dispatchEvent("onWindowResized");
            SystemEvents.dispatchEvent("onResponsiveChange", [me.getScreenInformation()]);
        }
    }

    /**
     * Installs a handler for when the browser window is resized.
     *
     * @protected
     * @memberof Browser
     */
    protected installWindowResizeHandler() {
        const me = this;
        window.addEventListener("resize", Blend.debounce(300, me.windowResizeHandler.bind(me)));
    }

    /**
     * Install the system styles
     *
     * @protected
     * @memberof Browser
     */
    protected installSystemStyles() {
        const me = this;
        me.attachStyleSheet(new SystemStyles());
        window.document.documentElement.classList.add(me.isRTL() ? "b-rtl" : "b-ltr");
    }

    /**
     * Initializes the browser viewport.
     *
     * @protected
     * @memberof Browser
     */
    protected initViewport(doneCallback: TFunction) {
        const me = this;
        const viewport = window.document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            window.document.head.appendChild(
                Dom.createElement({
                    attrs: {
                        content: "width=device-width, initial-scale=1.0",
                        name: "viewport"
                    },
                    tag: "meta"
                })
            );
            Blend.delay(100, () => {
                doneCallback();
            });
        } else {
            doneCallback();
        }
    }
}

export const Browser: BrowserSingleton = new BrowserSingleton();
