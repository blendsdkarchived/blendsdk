import { Component, IComponentConfig } from "@blendsdk/core";

/**
 * Helper type for describing an Icon
 */
export type TIcon = Icon<IIconConfig>;

/**
 * Interface for configuring an icon
 *
 * @interface IIconConfig
 * @extends {ICoreComponentConfig}
 */
export interface IIconConfig extends IComponentConfig {}

/**
 * Abstract class
 *
 * @export
 * @abstract
 * @class Icon
 * @extends {Blend.core.Component}
 */
export abstract class Icon<T extends IIconConfig> extends Component<T> {
    /**
     * The element containing the icon
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Icon
     */
    protected el: HTMLElement;
    /**
     * Indicates if the icon is rendered
     *
     * @protected
     * @type {boolean}
     * @memberof Icon
     */
    protected isRendered: boolean;

    /**
     * Creates an instance of Icon.
     * @param {IIconConfig} [config]
     * @memberof Icon
     */
    public constructor(config?: T) {
        super(config);
        this.isRendered = false;
    }

    /**
     * Gets the HTMLElement of the icon.
     *
     * @returns {HTMLElement}
     * @memberof Icon
     */
    public getElement(): HTMLElement {
        const me = this;
        if (!me.isRendered) {
            me.el = me.render();
            me.isRendered = true;
            me.finalizeRender();
        }
        return me.el;
    }

    /**
     * Abstract method that renders the Icon element.
     *
     * @protected
     * @abstract
     * @returns {HTMLElement}
     * @memberof Icon
     */
    protected abstract render(): HTMLElement;

    /**
     * Hook method that can be overridden to finalize the
     * element configuration.
     *
     * @protected
     * @memberof Icon
     */
    protected finalizeRender() {}
}
