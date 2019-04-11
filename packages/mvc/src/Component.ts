import { Blend, Component, IComponentConfig, IDictionary, SystemEvents, TFunction } from "@blendsdk/core";
import { Controller } from "./Controller";
import { TComponentEventHandler, TComponentReference } from "./Types";

/**
 * Interface for configuring an MVC Component
 *
 * @interface IMVCComponentConfig
 * @extends {ICoreComponentConfig}
 */
export interface IMVCComponentConfig extends IComponentConfig {
    /**
     * Option to configure a reference to this component
     * within a Controller.
     *
     * @type {(Function | Array<Function>)}
     * @memberof IMVCComponentConfig
     */
	reference?: TComponentReference | TComponentReference[];
    /**
     * This event is dispatched all components within the application
     * are instantiated and are ready to go.
     *
     * PLEASE NOTE:
     * This event is only dispatched if you make use of
     * a `Blend.application.Application` component.
     *
     * @type {TComponentEvent}
     * @memberof IMVCComponentConfig
     */
	onApplicationReady?: TComponentEvent;
}

/**
 * Property signature for defining an event on a component:
 * For example:
 *
 * {
 * 		onMessage: TComponentEvent
 * }
 *
 */
export type TComponentEvent = TComponentEventHandler | TComponentEventHandler[];

/**
 * Base class for implementing and MVC Component.
 *
 * @export
 * @abstract
 * @class Component
 * @extends {Blend.core.Component}
 */
export abstract class MVCComponent extends Component {
    /**
     * @override
     * @protected
     * @type {IMVCComponentConfig}
     * @memberof MVCComponent
     */
	protected config: IMVCComponentConfig;
    /**
     * Indicates if the event handling is enabled.
     *
     * @protected
     * @type {boolean}
     * @memberof Component
     */
	protected eventsEnabled: boolean;
    /**
     * Creates an instance of Component.
     * @param {IMVCComponentConfig} [config]
     * @memberof Component
     */
	public constructor(config?: IMVCComponentConfig) {
		super(config);
		const me = this;
		me.configDefaults({
			reference: []
		} as IMVCComponentConfig);
		me.eventsEnabled = true;
		// Make array anyway to make the dereferencing easier.
		me.config.reference = Blend.wrapInArray(me.config.reference);
	}

    /**
     * API for creating a reference within a controller. This function can be used
     * to create controller references after this component is instantiated.
     *
     * @param {string} propertyName
     * @param {Blend.mvc.Controller} controller
     * @memberof Component
     */
	public addReference(propertyName: string, controller: Controller) {
		const me = this,
			refFn = controller.createReference(propertyName),
			refs: TFunction[] = me.config.reference as any;
		refs.push(refFn);
		refFn(this);
	}

    /**
     * API for adding an event handler for a given event on this Component.
     *
     * @param {string} eventName
     * @param {TComponentEvent} handler
     * @memberof Component
     */
	public addEventListener(eventName: string, handler: TComponentEventHandler) {
		const me = this,
			config: any = me.config;
		if (Blend.isFunction(handler) && Blend.isEventName(eventName)) {
			config[eventName] = Blend.wrapInArray(config[eventName] || []); // create if not exists
			config[eventName].push(handler);
			me.checkInitSystemEvent(eventName);
		} else {
			throw new Error("Invalid event handler or event name: " + eventName);
		}
	}

    /**
     * @override
     * @memberof Component
     */
	public destroy() {
		const me = this;
		// Remove SystemEvent subscriptions
		SystemEvents.removeAllEventHandlers(me.getUID());
		// Dereference
		Blend.forEach(me.config.reference || [], (refFn: TFunction) => {
			refFn(null);
		});
		super.destroy();
	}

    /**
     * Enables or disabled the event handling and dispatching
     * process
     *
     * @protected
     * @param {boolean} state
     * @memberof Component
     */
	protected enableEvents(state: boolean) {
		this.eventsEnabled = state;
	}

    /**
     * Checks if a given eventName is consumed by the user.
     *
     * @protected
     * @param {string} eventName
     * @returns {boolean}
     * @memberof Component
     */
	protected isEventConsumed(eventName: string): boolean {
		const config: any = this.config;
		return Blend.isEventName(eventName) && !Blend.isNullOrUndef(config[eventName]);
	}

    /**
     * Dispatches an event to the registered event handlers.
     *
     * @protected
     * @param {string} eventName
     * @param {Array<any>} [args]
     * @param {boolean} [synchronous]
     * @memberof Component
     */
	protected dispatchEvent(eventName: string, args?: any[], synchronous?: boolean) {
		const me = this,
			config: any = me.config;
		synchronous = synchronous === true ? true : false;
		if (me.eventsEnabled && me.isEventConsumed(eventName)) {
			const handlers: TFunction[] = config[eventName];
			Blend.wrapInArray(handlers).forEach((handler: TFunction) => {
				if (Blend.isFunction(handler)) {
					if (synchronous === true) {
						handler.apply(handler, [me].concat(args || []));
					} else {
						setTimeout(() => {
							handler.apply(handler, [me].concat(args || []));
						}, 1);
					}
				}
			});
		}
	}

    /**
     * @override
     * @protected
     * @memberof Component
     */
	protected initComponent() {
		super.initComponent();
		const me = this;
        /**
         * Calls the reference function and assigns self to the controller
         */
		Blend.wrapInArray(me.config.reference).forEach((refFn: TFunction) => {
			refFn(me);
		});
		Blend.forEach(me.config, (property: any, eventName: string) => {
			me.checkInitSystemEvent(eventName);
		});
	}

    /**
     * Checks if we need to register a system event handler for
     * the given eventName
     *
     * @protected
     * @param {string} eventName
     * @memberof Component
     */
	protected checkInitSystemEvent(eventName: string) {
		const me = this,
			config: IDictionary = me.config;
		if (SystemEvents.isDefined(eventName)) {
			// tslint:disable-next-line:only-arrow-functions
			SystemEvents.addEventListener(me.getUID(), eventName, function () {
				me.dispatchEvent(eventName, Blend.argumentsToArray(arguments));
			});
		}
	}
}
