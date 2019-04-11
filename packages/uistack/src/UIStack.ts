import { Blend, TConfigurableClass, TFunction } from "@blendsdk/core";
import { CSS, Sheet } from "@blendsdk/css";
import { TComponentEvent } from "@blendsdk/mvc";
import { IStylableUIComponent, IUICollectionConfig, IUIComponentStyles, UICollection, UIComponent } from "@blendsdk/ui";

import {
	DefaultTransitionProvider,
	IStackTransitionConfig,
	IStackTransitionOptions,
	TransitionProvider
} from "./TransitionProvider";

/**
 * Enum providing ui stack events.
 *
 * @enum {number}
 */
enum eUIStackEvents {
	onViewDismissed = "onViewDismissed",
	onViewPushed = "onViewPushed",
	onViewDeactivated = "onViewDeactivated",
	onViewActivated = "onViewActivated"
}

/**
 * Helper interface that is used to manage
 * the push and dismiss cycle of a UI component
 * within a Stack.
 *
 * This interface can be implemented to handle
 * a component's internal state complementary to the
 * `viewPushed` and the `viewDismissed` events.
 *
 * @interface IActivatableUIComponent
 */
export interface IActivatableUIComponent {
    /**
     * Called when this UI Component is activated
     * (pushed) by a Stack view
     *
     * @memberof IActivatableUIComponent
     */
	onViewActivated: TComponentEvent;
    /**
     * Called when this UI Component is deactivated
     * (dismissed)  by a Stack view
     *
     * @memberof IActivatableUIComponent
     */
	onViewDeactivated: TComponentEvent;
}

/**
 * Interface for configuring theme variables for a Stack instance.
 *
 * @interface IUIStackThemeConfig
 * @extends {IThemeConfig}
 */
export interface IUIStackStyles extends IUIComponentStyles {
    /**
     * Option to configure a padding to for the Stack
     *
     * @type {number}
     * @memberof IUIStackThemeConfig
     */
	padding?: number | string;
    /**
     * Option to configure a background color for the Stack
     *
     * @type {string}
     * @memberof IUIStackThemeConfig
     */
	backgroundColor?: string;
}

/**
 * Interface for configuring a Stack instance.
 *
 * @interface IUIStackConfig
 * @extends {IUIComponentConfig}
 * @extends {IUICollectionConfig<UIComponent>}
 * @extends {IThemeableComponent<IUIStackThemeConfig>}
 */
export interface IUIStackConfig extends IUICollectionConfig<UIComponent>, IStylableUIComponent<IUIStackStyles> {
    /**
     * Dispatches when a view is pushed into the visible area of the
     * Stack
     *
     * @type {TComponentEvent}
     * @memberof IUIStackConfig
     */
	onViewPushed?: TComponentEvent;
    /**
     * Dispatches when a view is pushed out fo the visible area of the
     * Stack
     *
     * @type {TComponentEvent}
     * @memberof IUIStackConfig
     */
	onViewDismissed?: TComponentEvent;
    /**
     * The index or the id, or the instance of the view that is going to be activated at startup.
     * If non provided, then the first view will be the active view.
     *
     * @type {(number | string | UIComponent)}
     * @memberof IUIStackConfig
     */
	activeView?: number | string | UIComponent;
    /**
     * Option to configure a transition provider for
     * when pushing and dismissing views within a Blend.Stack
     *
     * @type {(Blend.stack.TransitionProvider | TConfigurableClass)}
     * @memberof IUIStackConfig
     */
	transitionProvider?: TransitionProvider | TConfigurableClass;
    /**
     * Option to skip pushing the first view when no activeView is configured
     * on initialization time. This will result the UIStack to be empty on
     * startup.
     *
     * @type {boolean}
     * @memberof IUIStackConfig
     */
	skipInitialView?: boolean;
    /**
     * Option to configure to skip the item fitting.
     * This is only useful if the UIStack is used as
     * part of a composite component.
     *
     * @type {boolean}
     * @memberof IUIStackConfig
     */
	skipFittingViews?: boolean;
}

/**
 * TODO:1041 Provide class description for Stack
 *
 * @export
 * @class Stack
 * @extends {Blend.ui.Collection<UIComponent>}
 */
export class UIStack extends UICollection<UIComponent> {
    /**
     * @override
     * @protected
     * @type {IUIStackConfig}
     * @memberof UIStack
     */
	protected config: IUIStackConfig;

    /**
     * @override
     * @protected
     * @param {IUIStackStyles} styles
     * @param {string} selectorUid
     * @memberof UIStack
     */
	protected createStyles(sheet: Sheet, styles: IUIStackStyles, selectorUid: string) {
		Blend.apply(styles, {
			backgroundColor: styles.backgroundColor || "transparent",
			padding: styles.padding || 0
		});

		const me = this;
		sheet.addRule([
			CSS.block("b-stack", [
				{
					backgroundColor: styles.backgroundColor
				}
			])
		]);

		if (me.config.skipFittingViews !== true) {
			sheet.addRule([
				CSS.block(selectorUid, [
					{
						padding: styles.padding || 0
					},
					CSS.child("b-uc-item", [
						{
							top: 0,
							left: 0,
							position: styles.padding === 0 ? null : "relative"
						},
						CSS.makeFit(styles.padding === 0)
					])
				])
			]);
		}
		me.attachStyleSheet(sheet);
	}
    /**
     * Reference to the current active view
     *
     * @protected
     * @type {UIComponent}
     * @memberof Stack
     */
	protected currentView: UIComponent;
    /**
     * Reference to the transition provider
     *
     * @protected
     * @type {Blend.stack.TransitionProvider}
     * @memberof Stack
     */
	protected transitionProvider: TransitionProvider;

    /**
     * Creates an instance of Stack.
     * @param {IUIStackConfig} [config]
     * @memberof Stack
     */
	public constructor(config?: IUIStackConfig) {
		super(config);
		const me = this;
		me.configDefaults({
			activeView: 0,
			skipInitialView: false,
			skipFittingViews: false,
			transitionProvider: DefaultTransitionProvider
		} as IUIStackConfig);
	}

    /**
     * Dispatches a `onViewDismissed` event.
     *
     * @protected
     * @param {UIComponent} view
     * @memberof Stack
     */
	protected dispatchViewDismissed(view: UIComponent) {
		const me = this;
		me.dispatchEvent(eUIStackEvents.onViewDismissed, [view]);
		view.applyMethod("dispatchEvent", [eUIStackEvents.onViewDeactivated, [me]]);
	}

    /**
     * Dispatches a `onViewPushed` event.
     *
     * @protected
     * @param {UIComponent} view
     * @memberof Stack
     */
	protected dispatchViewPushed(view: UIComponent) {
		const me = this;
		me.dispatchEvent(eUIStackEvents.onViewPushed, [view]);
		view.applyMethod("dispatchEvent", [eUIStackEvents.onViewActivated, [me]]);
	}

    /**
     * Pushes/Activates a given view within the Stack
     *
     * @param {(number | string | UIComponent)} view
     * @param {IStackTransitionOptions} [transitionOptions]
     * @param {Function} [doneCallback]
     * @memberof Stack
     */
	public pushView(
		newView: number | string | UIComponent,
		transitionOptions?: IStackTransitionOptions,
		doneCallback?: TFunction
	) {
		const me = this,
			vw: UIComponent = me.find(newView);
		if (vw && me.contains(vw)) {
			if (me.currentView !== vw) {
				Blend.apply(transitionOptions || {}, { animate: true });
				me.transitionProvider.pushView(vw, transitionOptions, (view: UIComponent, pushed?: boolean) => {
					if (pushed) {
						me.currentView = view;
						view.performLayout();
						me.dispatchViewPushed(view);
						if (doneCallback) {
							doneCallback();
						}
					} else {
						me.dispatchViewDismissed(view);
					}
				});
			}
		} else {
			throw new Error(
				`The provided view (${newView}) is not part of
				the items of the component. Did you forget to added it first?`
			);
		}
	}

    /**
     * Sets the current active view either by index if ID
     *
     * @param {(number | string | UIComponent)} view
     * @memberof Stack
     */
	public setActiveView(view: number | string | UIComponent) {
		const me = this;
		if (me.isRendered && me.items().length !== 0) {
			me.pushView(view);
		} else {
			me.config.activeView = view;
		}
	}

    /**
     * Get the current active view within the Stack
     *
     * @template T
     * @returns {T}
     * @memberof Stack
     */
	public getActiveView<T extends UIComponent>(): T {
		const me = this;
		if (me.isRendered) {
			return (this.currentView || null) as T;
		} else {
			return me.find(me.config.activeView) as T;
		}
	}

    /**
     * @override
     * @protected
     * @param {UIComponent} item
     * @returns {HTMLElement}
     * @memberof My
     */
	protected getWrapperOf(item: UIComponent): HTMLElement {
		return item.getElement();
	}

    /**
     * @override
     * @protected
     * @param {UIComponent} item
     * @returns {HTMLElement}
     * @memberof Stack
     */
	protected renderItem(item: UIComponent): HTMLElement {
		return item.getElement();
	}

    /**
     * @override
     * @protected
     * @param {UIComponent} item
     * @memberof Stack
     */
	protected removeElement(item: UIComponent): void {
		const parent = item.getElement().parentElement || item.getElement().parentNode;
		if (parent) {
			parent.removeChild(item.getElement());
		}
	}

    /**
     * @override
     * @protected
     * @memberof Stack
     */
	protected finalizeRender() {
		super.finalizeRender();
		const me = this;
		me.transitionProvider = Blend.createComponent<TransitionProvider>(me.config.transitionProvider, {
			containerElement: me.containerElement
		} as IStackTransitionConfig);
		me.stashAll();
		if (!me.config.skipInitialView) {
			me.setActiveView(me.config.activeView);
		}
	}

    /**
     * override
     * @protected
     * @returns {HTMLElement}
     * @memberof Stack
     */
	protected render(): HTMLElement {
		const me = this;
		return me.createElement({
			css: ["b-stack"],
			reference: "containerElement"
		});
	}

    /**
     * override
     * @protected
     * @param {boolean} [isInitial]
     * @memberof Stack
     */
	protected doLayout(isInitial?: boolean): void {
		const me = this;
		me.doLayoutItems();
	}

    /**
     * @override
     * @protected
     * @memberof Stack
     */
	protected doLayoutItems() {
		const me = this;
		me.shouldReIndex();
		me.forEach((item: UIComponent) => {
			if (item === me.currentView) {
				me.activateItem(item);
				item.performLayout();
			} else {
				me.deActivateItem(item);
			}
		});
		me.assignFirstVisible();
	}
}
