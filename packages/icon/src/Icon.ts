import { Component, IComponentConfig } from "@blendsdk/core";

/**
 * Interface for configuring an icon
 *
 * @interface IIconConfig
 * @extends {ICoreComponentConfig}
 */
export interface IIconConfig extends IComponentConfig { }

/**
 * Abstract class
 *
 * @export
 * @abstract
 * @class Icon
 * @extends {Blend.core.Component}
 */
export abstract class Icon extends Component {
    /**
     * @override
     * @protected
     * @type {IIconConfig}
     * @memberof Icon
     */
	protected config: IIconConfig;
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
     * The CSS selector for this icon.
     *
     * @protected
     * @type {string}
     * @memberof Icon
     */
	protected selectorId: string;

    /**
     * Creates an instance of Icon.
     * @param {IIconConfig} [config]
     * @memberof Icon
     */
	public constructor(config?: IIconConfig) {
		super(config);
		const me = this;
		me.isRendered = false;
		me.selectorId = `c${me.getUID()}`;
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
	protected finalizeRender() { }
}
