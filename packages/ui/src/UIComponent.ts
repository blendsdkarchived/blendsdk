import { Browser } from "@blendsdk/browser";
import { Blend, IElementSize, IUILayoutConfig, TFunction } from "@blendsdk/core";
import { Sheet, StyleSheets } from "@blendsdk/css";
import { Dom, DOMElement, DOMEvent, ICreateElementConfig, IHTMLElementProvider } from "@blendsdk/dom";
import { IMVCComponentConfig, MVCComponent, TComponentEvent } from "@blendsdk/mvc";

export interface IUIComponentStyles {
    /**
     * Name of the theme of the color palette to be used
     * to automatically fill in color values for this component style.
     *
     * @type {string}
     */
	theme?: string;
}

export interface IStylableUIComponent<ComponentStylesType extends IUIComponentStyles> {
    /**
     * Option for configuring styles for this component.
     *
     * @type {ComponentStylesType}
     * @memberof IUIComponentConfig
     */
	styles?: ComponentStylesType;
}

/**
 * Interface for implementing a dom component that has a global event listener
 *
 * @interface IEventListenerComponent
 */
export interface IEventListenerComponent {
    /**
     * Handler function for handling all events from a DOM Element.
     * Use a control structure to distinguish between event types.
     *
     * @param {string} eventType
     * @param {Blend.dom.Element} element
     * @param {Event} event
     * @memberof IEventListenerComponent
     */
	handleComponentEvent(eventType: string, element: DOMElement, event: Event): void;
}

/**
 * Enum describing common UI events
 *
 * @enum {number}
 */
enum eUIComponentEvents {
	onDisabled = "onDisabled"
}

/**
 * Interface for configuring a UI Component
 *
 * @export
 * @interface IUIComponentConfig
 * @extends {IMVCComponentConfig}
 * @template ComponentStylesType
 */
export interface IUIComponentConfig extends IMVCComponentConfig {
    /**
     * This event is dispatched when the browser window is resized.
     *
     * @type {TComponentEvent}
     * @memberof IUIComponentConfig
     */
	onWindowResized?: TComponentEvent;
    /**
     * This event is dispatched when the browser window is resized.
     *
     * This event is similar to windowResized event
     * except it provides display and device information
     * for helping set the desired state to the component
     * listening to this event.
     *
     * @type {TComponentEvent}
     * @memberof IUIComponentConfig
     */
	onResponsiveChange?: TComponentEvent;
    /**
     * This event is dispatched when the disabled state of this UI
     * component is changed.
     *
     * @type {TComponentEvent}
     * @memberof IUIComponentConfig
     */
	onDisabled?: TComponentEvent;
    /**
     * Option to configure information
     * that is going to be used to layout
     * this ui component.
     *
     * @type {IUILayoutConfig}
     * @memberof IUIComponentConfig
     */
	layoutConfig?: IUILayoutConfig;
    /**
     * Option set the disabled state of the component at
     * configuration time. By default this option is set to `null`
     *
     * @type {boolean}
     * @memberof IUIComponentConfig
     */
	disabled?: boolean;
    /**
     * Option to configure the flex unit of this UI component.
     * This configuration is only going to take effect if the component
     * is placed withing (Dom) container with flex layout.
     *
     * @type {number}
     * @memberof IUIComponentConfig
     */
	flexSize?: number;
    /**
     * Option to configure the visibility of this UI Component
     *
     * @type {boolean}
     * @memberof IUIComponentConfig
     */
	hidden?: boolean;
    /**
     * Option to configure the initial size of a UI component.
     * Please Note: This option should only be used for static sizing.
     *
     * @type {IElementSize}
     * @memberof IUIComponentConfig
     */
	size?: IElementSize;
    /**
     * Option to configure one or more CSS rules when creating this component.
     *
     * @type {(string | string[])}
     * @memberof IUIComponentConfig
     */
	cssClass?: string | string[];
}

/**
 * Base class for implementing a UI Component.
 *
 * @export
 * @abstract
 * @class Component
 * @extends {Blend.mvc.Component}
 * @implements {EventListenerObject}
 */
export abstract class UIComponent extends MVCComponent implements EventListenerObject, IHTMLElementProvider {
    /**
     * @override
     * @protected
     * @type {IUIComponentConfig}
     * @memberof UIComponent
     */
	protected config: IUIComponentConfig;
    /**
     * Hold a cache of getBoundingClientRect(...) data
     * to be used in various layout scenarios.
     *
     * @protected
     * @type {ClientRect}
     * @memberof Component
     */
	protected componentBounds: ClientRect;
    /**
     * Indicates if the layout sub-system is active.
     *
     * @protected
     * @type {boolean}
     * @memberof Component
     */
	protected canLayout: boolean;
    /**
     * @override
     *
     * @protected
     * @type {UIComponent}
     * @memberof Component
     */
	protected parentCmp: UIComponent;
    /**
     * The internal HTMLElement containing the structure of the Component
     *
     * @protected
     * @type {HTMLElement}
     * @memberOf Component
     */
	protected el: HTMLElement;
    /**
     * Initial layout cycle indicator
     *
     * @protected
     * @type {boolean}
     * @memberof Component
     */
	protected didInitialLayout: boolean;
    /**
     * Indicates whether this component is rendered.
     *
     * @protected
     * @type {boolean}
     * @memberOf Component
     */
	protected isRendered: boolean;

    /**
     * This method should render the DOM structure of this Component and must
     * return a single HTMLElement.
     *
     * @protected
     * @abstract
     * @returns {HTMLElement}
     *
     * @memberOf Component
     */
	protected abstract render(): HTMLElement;
    /**
     * Method that need to be implemented to take care of the component layout
     *
     * @protected
     * @abstract
     * @param {boolean} isInitial
     * @memberof Component
     */
	protected abstract doLayout(isInitial?: boolean): void;

    /**
     * Creates an instance of Component.
     * @param {IDomComponentConfig} [config]
     *
     * @memberOf Component
     */
	public constructor(config?: IUIComponentConfig) {
		super(config);
		const me = this;
		me.isRendered = false;
		me.enableEvents(false);
		me.didInitialLayout = false;
		me.canLayout = true;
	}

    /**
     * Attach a stylesheet to the browser.
     *
     * @protected
     * @param {Sheet} sheet
     * @param {boolean} [pushTop]
     * @memberof UIComponent
     */
	protected attachStyleSheet(sheet: Sheet) {
		Browser.attachStyleSheet(sheet);
	}

    /**
     * Returns the parent of this Component
     *
     * @template T
     * @returns {ConfigType}
     * @memberof Component
     */
	public getParent<P extends UIComponent>(): P {
		return this.parentCmp as P;
	}

    /**
     * Sets the parent of this component.
     *
     * @param {UIComponent} parent
     * @memberof Component
     */
	public setParent(value: UIComponent) {
		this.parentCmp = value;
	}

    /**
     * Tries to find a parent component of a given type.
     * If the type is not found then this function will
     * return `null`
     *
     * @template T
     * @param {*} clazz
     * @returns {ConfigType}
     * @memberof Component
     */
	public findParentOfType<P extends UIComponent>(clazz: any): P {
		let cmp: UIComponent = this,
			parent: UIComponent = null;

		// tslint:disable-next-line:no-conditional-assignment
		while ((parent = cmp.getParent()) !== null) {
			if (Blend.isInstanceOf(parent, clazz)) {
				break;
			} else {
				cmp = parent;
			}
		}
		return parent as P;
	}

    /**
     * Returns the current layout configuration to be used by a
     * layout provider.
     *
     * @template T
     * @returns {ConfigType}
     * @memberof Component
     */
	public getLayoutConfig<L extends IUILayoutConfig>(): L {
		return (this.config.layoutConfig || {}) as L;
	}

    /**
     * Sets the componentBounds property to null
     * to be refreshed later.
     *
     * @protected
     * @memberof Component
     */
	protected clearBoundsCache() {
		this.componentBounds = null;
	}

    /**
     * Refreshed the componentBounds property if
     * it was cleared before
     *
     * @protected
     * @memberof Component
     */
	protected refreshBoundsCache() {
		const me = this;
		if (!me.componentBounds) {
			me.componentBounds = me.el.getBoundingClientRect();
		}
	}

    /**
     * Hook method that is used to enable/disable this ui component
     * internally.
     *
     * @protected
     * @param {boolean} value
     * @returns
     * @memberof UIComponent
     */
	protected setDisabledInternal(value: boolean) {
		return;
	}

    /**
     * Sets enabled or disabled state of this ui component
     *
     * @param {boolean} value
     * @memberof Component
     */
	public setDisabled(value: boolean) {
		const me = this;
		me.config.disabled = value;
		if (me.isRendered && !Blend.isNullOrUndef(value)) {
			me.el.classList.set("b-disabled", value === true);
			if (value === true) {
				me.el.setAttribute("disabled", "");
			} else {
				me.el.removeAttribute("disabled");
			}
			me.setDisabledInternal(value);
			me.dispatchDisabled(value);
			me.performLayoutIf();
		}
	}

    /**
     * Returns true if this component is disabled otherwise
     * it returns false.
     *
     * @returns {boolean}
     * @memberof Component
     */
	public get isDisabled(): boolean {
		return this.config.disabled;
	}

    /**
     * Dispatches a disabled event when the state is changed from
     * enabled to disabled or vice versa.
     *
     * @protected
     * @param {boolean} state
     * @memberof Component
     */
	protected dispatchDisabled(state: boolean) {
		this.dispatchEvent(eUIComponentEvents.onDisabled, [state]);
	}

    /**
     * Sets the flex unit of this component.
     *
     * NOTE:
     * This is only going to take effect if the UI component
     * is placed inside a container that lays out its child
     * components using the flexbox layout provider.
     *
     * @param {number} value
     * @memberof Component
     */
	public setFlexSize(value: number) {
		const me = this;
		me.config.flexSize = value;
		if (me.isRendered) {
			me.el.style.flex = value as any;
			me.performLayoutIf();
		}
	}

    /**
     * Returns the flexSize if it was set before, otherwise
     * returns `null`'
     *
     * @returns {(number | null)}
     * @memberof Component
     */
	public getFlexSize(): number | null {
		return this.config.flexSize;
	}

    /**
     * Set the visibility state of this component.
     *
     * @param {boolean} value
     * @memberof Component
     */
	public setHidden(value: boolean) {
		const me = this;
		me.config.hidden = value;
		if (me.isRendered && !Blend.isNullOrUndef(value)) {
			me.el.style.display = value === true ? "none" : null;
			if (value === false) {
				me.performLayoutIf();
			}
		}
	}

    /**
     * Returns the visibility state of this UI component.
     *
     * @returns {boolean}
     * @memberof Component
     */
	public isHidden(): boolean {
		return this.config.hidden;
	}

    /**
     * Sets the size of the Component using the IElementSize interface.
     * The width/height will be reset if the values are set to `null`
     *
     * //TODO:1062 Test ths function
     *
     * @param {IElementSize} size
     * @memberof Element
     */
	public setSize(size: IElementSize) {
		const me = this;
		me.config.size = size;
		if (me.isRendered) {
			if (size == null) {
				me.el.style.width = null;
				me.el.style.height = null;
			} else {
				if (size.width !== undefined) {
					me.el.style.width = size.width ? Blend.toPxIf(size.width) : null;
				}
				if (size.height !== undefined) {
					me.el.style.height = size.height ? Blend.toPxIf(size.height) : null;
				}
			}
			me.clearBoundsCache();
			me.performLayoutIf();
		}
	}

    /**
     * Returns the exact size of this component is pixels.
     *
     * @readonly
     * @type {IElementSize}
     * @memberof UIComponent
     */
	public getSize(): IElementSize {
		const me = this;
		// normally we would have returned the config.size!
		me.refreshBoundsCache();
		return me.componentBounds as IElementSize;
	}

    /**
     * Gets the HTMLElement of this component. This function will internally
     * kickstart the render cycle of all the child elements if possible. The
     * render process will run only once
     *
     * @returns {HTMLElement}
     *
     * @memberOf Component
     */
	public getElement(): HTMLElement {
		const me = this;
		me.renderInternal();
		return me.el;
	}

    /**
     * A hook function to be able to do work before the element is rendered.
     *
     * @protected
     *
     * @memberof Component
     */
	protected finalizeRender() {
		const me = this;
		me.setDisabled(me.config.disabled);
		me.setFlexSize(me.config.flexSize);
		me.setHidden(me.config.hidden);
		me.setSize(me.config.size);
		me.setCssClass(me.config.cssClass, true);
	}

    /**
     * Sets the CSS classes on this component.
     *
     * @param {(string | string[])} value
     * @memberof UIComponent
     */
	public setCssClass(className: string | object | string[] | Array<[]>, addOrRemove?: boolean) {
		const me = this;
		if (me.isRendered) {
			me.el.classList.set(className, addOrRemove);
		}
	}

    /**
     * Abstract method that can be used to create and attach stylesheet and CSSRules
     * for this UI component.
     *
     * @protected
     * @param {IUIComponentStyles} styles
     * @param {string} selectorUid
     * @memberof UIComponent
     */
	protected createStyles(sheet: Sheet, styles: IUIComponentStyles, selectorUid: string): any {
		return false;
	}

    /**
     * Prepare and render the styles for this UI component.
     *
     * @protected
     * @memberof UIComponent
     */
	protected renderStyles() {
		const me = this,
			selectorUid = `c${me.getUID()}`;
		const styles = Blend.shallowClone((me.config as IStylableUIComponent<any>).styles || {}),
			sheet = StyleSheets.create();
		if (me.createStyles(sheet, styles, selectorUid) !== false) {
			me.el.classList.add(selectorUid);
			me.attachStyleSheet(sheet);
		}
	}

    /**
     * Internally renders the element and prepares it to be added
     * to the DOM tree
     *
     * @protected
     * @memberof Component
     */
	protected renderInternal() {
		const me = this;
		if (!me.isRendered) {
			me.enableEvents(false);
			me.initComponent();
			me.el = me.render();
			me.isRendered = true;
			me.finalizeRender();
			me.renderStyles();
			DOMElement.getElement(me.el).setUID(me.getUID());
			me.enableEvents(true);
		}
	}

    /**
     * Gets the computed styles of the component
     *
     * @protected
     * @template C
     * @param {string[]} [keys]
     * @param {string} [pseudo]
     * @returns {C}
     *
     * @memberof Component
     */
	protected getComputedStyle<C>(pseudo?: string): C {
		return window.getComputedStyle(this.el, pseudo) as any;
	}

    /**
     * Utility function for creating en `HTMLElement`.
     * The reference callback function `refCallback` can be used
     * to assign child elements which have a `reference` to class
     * properties.
     *
     * This function uses the protected function `{Blend.dom.Component.referenceHTMLElement}`
     * for assigning elements having the `reference` property to a property
     * in this class. In order to make the `referenceHTMLElement` method work, you need
     * to create an HTMLElement property in you class and assign it's value to `null`
     *
     *
     * @protected
     * @template H
     * @param {(ICreateElementConfig | ICreateElementConfigFunction | Blend.dom.ElementBuilder)} [conf]
     * @returns {H}
     * @memberof Component
     */
	protected createElement<H extends HTMLElement>(conf?: ICreateElementConfig): H {
		const me = this;
		return Dom.createElement(conf, me.referenceHTMLElement.bind(me), me as any);
	}

    /**
     * Perform a layout cycle if the initial layout cycle is done.
     *
     * @protected
     * @returns {this}
     * @memberof Component
     */
	protected performLayoutIf(): this {
		const me = this;
		if (me.didInitialLayout === true) {
			me.performLayout();
		}
		return me;
	}

    /**
     * Initiates a layout process
     *
     * @returns {this}
     * @memberof Component
     */
	public performLayout(): this {
		const me = this;
		if (me.isRendered && me.canLayout) {
			me.doLayout(me.didInitialLayout === false);
			me.didInitialLayout = true;
		}
		return me;
	}

    /**
     * Performs an operation on this component with the layout
     * sub-system disabled.
     *
     * The component will `performLayout` after the callback has returned
     *
     * @param {Function} callback
     * @memberof Component
     */
	public withLayoutDisabled(callback: (done: TFunction) => void) {
		const me = this;
		me.canLayout = false;
		callback(() => {
			me.canLayout = true;
			me.performLayoutIf();
		});
	}

    /**
     * Automatically assigns an HTMLElement from the `createElement` to a
     * property on this class.
     *
     * @protected
     * @param {string} ref
     * @param {HTMLElement} el
     * @memberof Component
     */
	protected referenceHTMLElement(ref: string, el: HTMLElement) {
		const me: any = this;
		if (ref !== "..") {
			me[ref] = el;
			DOMElement.getElement(el).setUID(me.getUID());
		}
	}

    /**
     * Global event handler for this component required by the EventListenerObject interface
     *
     * @param {Event} evt
     * @memberof Component
     */
	public handleEvent(evt: Event): void {
		const me: any = this,
			refEl = DOMEvent.getReferencedTarget(evt as any),
			handleComponentEvent = (me as any).handleComponentEvent;
		if (handleComponentEvent && Blend.isFunction(handleComponentEvent)) {
			handleComponentEvent.apply(me, [evt.type, refEl, evt]);
		}
	}

    /**
     * @override
     * @memberOf Component
     */
	public destroy() {
		const me = this;
		if (me.isRendered) {
			if (me.el) {
				if (me.el.parentElement) {
					me.el.parentElement.removeChild(me.el);
				}
			}
			delete me.el;
		}
		super.destroy();
	}
}
