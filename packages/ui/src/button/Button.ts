import { Browser } from "@blendsdk/browser";
import { Icon } from "@blendsdk/icon";
import { TComponentEvent } from "@blendsdk/mvc";
import { IUIComponentConfig, IUIComponentStyles, UIComponent } from "../UIComponent";

/**
 * Interface for configuring the text of a Button
 *
 * @export
 * @interface IUIButtonText
 */
export interface IUIButtonText {
    /**
     * Option to configure the text of a UI Button.
     *
     * @type {string}
     * @memberof IUIButtonText
     */
    text?: string;
}

/**
 * Interface for configuring the icon image of a Button
 *
 * @export
 * @interface IUIButtonIcon
 */
export interface IUIButtonIcon {
    /**
     * An Icon class instance
     *
     * @type {TIcon}
     * @memberof IUIButtonIcon
     */
    icon?: Icon;
}

/**
 * Interface for configuring a generic Button
 *
 * @export
 * @interface IUIButtonConfig
 * @extends {IUIComponentConfig<ComponentStylesType>}
 * @template ComponentStylesType
 */
export interface IUIButtonConfig extends IUIComponentConfig {
    /**
     * Option to make the button as a submit button;
     *
     * @type {boolean}
     * @memberof IUIButtonText
     */
    submit?: boolean;
    /**
     * Dispatches when the button is clicked.
     *
     * @type {TComponentEvent}
     * @memberof IUIButtonConfig
     */
    onClick?: TComponentEvent;
}

/**
 * Base class for implementing a clickable Button
 *
 * @export
 * @abstract
 * @class Button
 * @extends {Blend.ui.Component}
 */
export abstract class Button extends UIComponent {
    /**
     * @override
     * @protected
     * @type {IUIButtonConfig}
     * @memberof Button
     */
    protected config: IUIButtonConfig;
    /**
     * Reference to the text element.
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Button
     */
    protected textElement: HTMLElement = null;
    /**
     * Reference to the image element.
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Button
     */
    protected imageElement: HTMLElement = null;
    /**
     * Reference to the wrapper element.
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Button
     */
    protected wrapperElement: HTMLElement = null;

    /**
     * Sets the text of the Button
     *
     * @param {string} value
     * @memberof Button
     */
    public setText(value: string) {
        const me = this;
        (me.config as IUIButtonText).text = value;
        if (me.isRendered) {
            me.textElement.innerText = value || "";
            me.performLayoutIf();
        }
    }

    /**
     * Returns the text value of this Button
     *
     * @returns {string}
     * @memberof Button
     */
    public getText(): string {
        return (this.config as IUIButtonText).text;
    }

    /**
     * Sets the icon of the Button
     *
     * @param {string} value
     * @memberof Button
     */
    public setIcon(icon: Icon) {
        const me = this;
        (me.config as IUIButtonIcon).icon = icon;
        if (icon) {
            if (me.isRendered) {
                while (me.imageElement.children.length !== 0) {
                    me.imageElement.children.item(0).parentElement.removeChild(me.imageElement.children.item(0));
                }
                me.imageElement.appendChild(icon.getElement());
                me.performLayoutIf();
            }
        }
    }

    /**
     * Returns the Icon instance configured for this button.
     *
     * @returns {TIcon}
     * @memberof Button
     */
    public getIcon(): Icon {
        return (this.config as IUIButtonIcon).icon || undefined;
    }

    /**
     * Dispatches a click event when the button is clicked.
     * @event
     * @protected
     * @memberof Button
     */
    protected dispatchClickEvent() {
        this.dispatchEvent("onClick");
    }

    /**
     * @override
     * @protected
     * @memberof Button
     */
    protected finalizeRender() {
        super.finalizeRender();
        const me = this;
        me.setText((me.config as IUIButtonText).text);
        me.setIcon((me.config as IUIButtonIcon).icon);
    }

    /**
     * @override
     * @protected
     * @returns {HTMLElement}
     * @memberof Button
     */
    protected render(): HTMLElement {
        const me = this,
            el = me.createElement({
                tag: "button",
                css: ["b-button"],
                attrs: {
                    type: me.config.submit ? "submit" : "button"
                },
                children: [
                    {
                        css: "b-button__icon",
                        reference: "imageElement"
                    },
                    {
                        css: "b-button__text",
                        reference: "textElement",
                        textContent: (me.config as IUIButtonText).text || ""
                    }
                ]
            });
        return el;
    }

    /**
     * @override
     * @protected
     * @param {boolean} [isInitial]
     * @memberof Button
     */
    protected doLayout(isInitial?: boolean): void {
        const me = this;
        if (isInitial) {
            /**c
             * We bind the events t first layout cycle.
             */
            me.bindEvents(Browser.hasTouchEvents);
        }
    }

    /**
     * Bind events for this button.
     *
     * @protected
     * @param {boolean} hasTouch
     * @memberof Button
     */
    protected bindEvents(hasTouch: boolean) {
        const me = this;
        // TODO:1078 Implement the `hasTouch` or remove the parameter. Also in `doLayout`
        me.el.addEventListener("click", me);
    }

    /**
     * Check if the current click event was generated by the SPACE or the ENTER key.
     *
     * @protected
     * @param {MouseEvent} e
     * @returns
     * @memberof Button
     */
    protected isClickByKeyboard(e: MouseEvent) {
        return (
            e.type === "click" &&
            e.screenX === e.screenY &&
            e.clientX === e.clientY &&
            e.screenX === 0 &&
            e.clientY === 0
        );
    }

    /**
     * @override
     * @param {string} eventType
     * @param {dom.Element} element
     * @param {Event} event
     * @memberof Button
     */
    public handleComponentEvent(eventType: string, element: Element, event: Event): void {
        const me = this;
        if (eventType === "click") {
            me.dispatchClickEvent();
        }
    }
}
