import { Blend } from "@blendsdk/core";
import { CSS, stylesheet } from "@blendsdk/css";
import { IUIComponentConfig, IUIComponentStyles, UIComponent } from "../UIComponent";

export interface IPlaceholderStyle extends IUIComponentStyles {
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
 * Interface for configuring a Placeholder instance.
 *
 * @interface IPlaceholderConfig
 * @extends {IUIComponentConfig}
 * @extends {IThemeableComponent<IPlaceholderThemeConfig>}
 */
export interface IPlaceholderConfig extends IUIComponentConfig<IPlaceholderStyle> {
    /**
     * Option to configure a caption for the Placeholder component.
     *
     * @type {string}
     * @memberof IPlaceholderConfig
     */
    caption?: string;
}

/**
 * TODO:1019 Provide class description for Placeholder
 *
 * @export
 * @class Placeholder
 * @extends {Component}
 */
export class Placeholder extends UIComponent<IPlaceholderStyle, IPlaceholderConfig> {
    protected styleDefaults(styles: IPlaceholderStyle): IPlaceholderStyle {
        return {
            backgroundColor: styles.backgroundColor || "#" + Math.floor(Math.random() * 16777215).toString(16),
            color: styles.color || "rgba(255,255,255,.88)"
        };
    }

    protected createStyles(styles: IPlaceholderStyle, selectorUid: string) {
        this.attachStyleSheet(
            stylesheet([
                // For all placeholders
                CSS.block(".placeholder", {
                    width: Blend.toPx(128),
                    height: Blend.toPx(128),
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "box-sizing": "border-box"
                }),
                // Specific for this Placeholder
                CSS.block(selectorUid, {
                    backgroundColor: styles.backgroundColor,
                    color: styles.color
                })
            ])
        );
    }

    /**
     * Creates an instance of Placeholder.
     * @param {IPlaceholderConfig} [config]
     * @memberof Placeholder
     */
    public constructor(config?: IPlaceholderConfig) {
        super(config);
        const me = this;
        me.configDefaults({
            caption: "Placeholder: " + me.getUID()
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
            css: "placeholder"
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
