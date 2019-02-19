import { Blend } from "@blendsdk/core";
import { IUIComponentConfig, IUIComponentStyles, UIComponent } from "../UIComponent";

/**
 * Interface for configuring a ToolbarSpacer
 *
 * @interface IToolbarSpacerConfig
 * @extends {IUIComponentConfig}
 */
export interface IToolbarSpacerConfig extends IUIComponentConfig {}

/**
 * A UI component that can be used to place a distance between
 * other UI components on a ToolbarStrip
 *
 * This component either accepts a `flexSize` or a `size.width` value.
 *
 * @export
 * @class ToolbarSpacer
 * @extends {Blend.ui.Component}
 */
export class ToolbarSpacer extends UIComponent {
    /**
     * Creates an instance of ToolbarSpacer.
     * @param {IToolbarSpacerConfig} [config]
     * @memberof ToolbarSpacer
     */
    public constructor(config?: IToolbarSpacerConfig) {
        super(config);
        const me = this;
        me.configDefaults({
            size: { width: null },
            flexSize: null
        } as IToolbarSpacerConfig);
        if (!me.config.size) {
            me.config.size = {};
        }
        me.config.flexSize = Blend.isNullOrUndef(me.config.size.width) ? 1 : me.config.flexSize;
        me.config.size.height = "auto";
    }

    /**
     * @override
     * @protected
     * @returns {HTMLElement}
     * @memberof ToolbarSpacer
     */
    protected render(): HTMLElement {
        const me = this;
        return me.createElement({
            css: ["b-tb-spacer"]
        });
    }

    /**
     * @override
     * @protected
     * @param {boolean} [isInitial]
     * @returns {void}
     * @memberof ToolbarSpacer
     */
    protected doLayout(isInitial?: boolean): void {
        return;
    }
}
