import { Blend } from "./Blend";
import { IDictionary, TFunction } from "./Types";

/**
 * This class provides registering and dispatching system-wide events.
 *
 * @export
 * @class SystemEvent
 */
export class SystemEventSingleton {
    /**
     * Dictionary of system-wide events
     */
	protected registry: {
		[eventName: string]: {
			[componentId: string]: TFunction;
		};
	};

    /**
     * Creates an instance of SystemEvent.
     * @memberof SystemEvent
     */
	public constructor() {
		const me = this;
		me.registry = {};
	}

    /**
     * Checks if we have a system-wide event by the given eventName.
     *
     * @param {string} eventName
     * @returns {boolean}
     * @memberof SystemEvent
     */
	public isDefined(eventName: string): boolean {
		const me = this,
			check = me.registry[eventName];
		return !Blend.isNullOrUndef(check) && Blend.isObject(check);
	}

    /**
     * API for defining system-wide events. This functionality
     * is used to create events that functionally apply to
     * your business logic.
     *
     * @param {(string | Array<string>)} eventName
     * @memberof SystemEvent
     */
	public defineEvent(eventName: string | string[] | IDictionary) {
		const me = this,
			names = Blend.isObject(eventName) ? Object.keys(eventName) : eventName || [];

		Blend.wrapInArray(names || []).forEach((item: string) => {
			if (Blend.isEventName(item) && !me.isDefined(item)) {
				me.registry[item] = {};
			}
		});
	}

    /**
     * Removes a system-wide event handler.
     *
     * @param {string} eventName
     * @param {number} id
     * @memberof SystemEvent
     */
	public removeEventHandler(eventName: string, id: string) {
		const me = this;
		if (me.registry[eventName] && me.registry[eventName][id]) {
			delete me.registry[eventName][id];
		}
	}

    /**
     * Removes all registered event handlers for a given component
     *
     * @param {string} id
     * @memberof SystemEvent
     */
	public removeAllEventHandlers(id: string) {
		const me = this;
		Blend.forEach(me.registry, (handler: IDictionary, eventName: string) => {
			if (!Blend.isNullOrUndef(handler[id])) {
				me.removeEventHandler(eventName, id);
			}
		});
	}

    /**
     * Adds a handler for a given system-wide event.
     *
     * @param {string} id
     * @param {string} eventName
     * @param {Function} handler
     * @memberof SystemEvent
     */
	public addEventListener(id: string, eventName: string, handler: TFunction) {
		const me = this;
		if (Blend.isEventName(eventName)) {
			me.defineEvent(eventName);
			me.registry[eventName][id] = handler; // this will overwrite the old one
		} else {
			throw new Error("Invalid event name: " + eventName);
		}
	}

    /**
     * Dispatches a system-wide event.
     *
     * @param {string} eventName
     * @param {Array<any>} args
     * @memberof SystemEvent
     */
	public dispatchEvent(eventName: string, args?: any[]) {
		const me = this,
			handlers = me.registry[eventName] || {};
		Blend.forEach(handlers, (handler: TFunction) => {
			if (handler) {
				Blend.delay(10, () => {
					handler.apply(handler, args || []);
				});
			}
		});
	}
}

export const SystemEvents: SystemEventSingleton = new SystemEventSingleton();
