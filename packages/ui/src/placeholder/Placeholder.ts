import { Blend } from "@blendsdk/core";
import { IUIComponentConfig, UIComponent } from "../UIComponent";

/**
 * Interface for configuring a Placeholder instance.
 *
 * @interface IPlaceholderConfig
 * @extends {IUIComponentConfig}
 * @extends {IThemeableComponent<IPlaceholderThemeConfig>}
 */
export interface IPlaceholderConfig extends IUIComponentConfig {
    /**
     * Option to configure a caption for the Placeholder component.
     *
     * @type {string}
     * @memberof IPlaceholderConfig
     */
    caption?: string;
    /**
     * Option to configure the background color.
     *
     * @type {string}
     * @memberof IPlaceholderConfig
     */
    backgroundColor?: string;
    /**
     * Option to configure the text color.
     *
     * @type {string}
     * @memberof IPlaceholderConfig
     */
    color?: string;
}

/**
 * TODO:1019 Provide class description for Placeholder
 *
 * @export
 * @class Placeholder
 * @extends {Component}
 */
export class Placeholder extends UIComponent<IPlaceholderConfig> {
    /**
     * Creates an instance of Placeholder.
     * @param {IPlaceholderConfig} [config]
     * @memberof Placeholder
     */
    public constructor(config?: IPlaceholderConfig) {
        super(config);
        const me = this;
        me.configDefaults({
            caption: "Placeholder: " + me.getUID(),
            backgroundColor: "#1976D2",
            color: "rgba(255,255,255,.88)",
            size: { width: 64, height: 64 }
        });
    }

    /**
     * Returns the configured caption of this component.
     *
     * @returns {string}
     * @memberof Placeholder
     */
    public getCaption(): string {
        return this.config.caption;
    }

    /**
     * Sets the caption of this Placeholder.
     *
     * @param {*} value
     * @memberof Placeholder
     */
    public setCaption(value: any) {
        const me = this;
        me.config.caption = value;
        if (me.isRendered) {
            me.el.textContent = value + "";
        }
    }

    /**
     * @override
     * @protected
     * @memberof Placeholder
     */
    protected finalizeRender() {
        super.finalizeRender();
        const me = this;
        me.setCaption(me.config.caption);
    }

    /**
     * override
     * @protected
     * @returns {HTMLElement}
     * @memberof Placeholder
     */
    protected render(): HTMLElement {
        const me = this;
        return me.createElement({
            style: {
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "background-color": me.config.backgroundColor,
                color: me.config.color,
                "box-sizing": "border-box"
            }
        });
    }

    /**
     * override
     * @protected
     * @param {boolean} [isInitial]
     * @memberof Placeholder
     */
    protected doLayout(isInitial?: boolean): void {}
}
