import { Blend } from "./Blend";
import { IAbstractComponent, IComponentConfig } from "./Types";

/**
 * Base class of all configurable components within Blend.
 *
 * @export
 * @abstract
 * @class Component
 * @implements {IAbstractComponent}
 */
export abstract class Component implements IAbstractComponent {
    /**
     * Key to identify the unique identifer of this component.
     * This key is used on a DOM component
     *
     * @export
     */
	public static KEY_UID = "_uid";

    /**
     * references the unique for this component.
     *
     * @protected
     * @type {string}
     * @memberof Component
     */
	protected uid: string;

    /**
     * The configuration object
     *
     * @protected
     * @type {IDictionary}
     * @memberOf Component
     */
	protected config: IComponentConfig;

    /**
     * Creates an instance of Component.
     * @param {IDictionary} [config]
     *
     * @memberOf Component
     */
	public constructor(config?: IComponentConfig) {
		const me = this;
		me.config = config || ({} as IComponentConfig);
		me.configDefaults({
			id: null,
			userData: {}
		} as IComponentConfig);
		me.uid = Blend.ID().toString(16);
	}

    /**
     * Sets a custom data value in this component.
     * This method also accepts an object which will replace the entire
     * collection.
     *
     * @param {(string | object)} key
     * @param {*} [value]
     * @returns {this}
     * @memberof Component
     */
	public setUserData(key: string | object, value?: any): this {
		const me = this;
		value = value || undefined;
		if (Blend.isObject(key)) {
			me.config.userData = key as any;
		} else if (Blend.isString(key)) {
			me.config.userData[key as string] = value;
		}
		return me;
	}

    /**
     * Gets custom date value from this component.
     * If the key is not provided then the entire collection is returned.
     *
     * @template R
     * @param {string} [key]
     * @param {R} [defaultValue]
     * @returns {R}
     * @memberof Component
     */
	public getUserData<R>(key?: string, defaultValue?: R): R {
		const me = this;
		key = key || null;
		if (key === null) {
			return (me.config.userData || {}) as R;
		} else if (Blend.isString(key)) {
			return me.config.userData[key as string] || defaultValue || undefined;
		}
	}

    /**
     * Gets the unique internal identifier of this component.
     * This value is auto-generated and only used internally.
     *
     * If you need a custom identifer, then use the `id` configuration
     * option next to the `getID()` method.
     *
     * @returns
     * @memberof Component
     */
	public getUID(): string {
		return this.uid;
	}

    /**
     * Returns component identifier that was provided as config time
     * or `null` when no identifer is configured.
     *
     * @memberof Component
     */
	public getId() {
		return this.config.id || null;
	}

    /**
     * A utility function for exposing internal component
     * methods. This function should be used with great care.
     *
     * @template T
     * @param {string} methodName
     * @param {Array<any>} [arg]
     * @returns {ConfigType}
     * @memberof Component
     */
	public applyMethod<R>(methodName: string, arg?: any[]): R {
		const fn: () => any = (this as any)[methodName] as (() => any);
		if (fn) {
			return fn.apply(this, arg || []) as R;
		} else {
			// tslint:disable-next-line:no-console
			if (console && console.trace) {
				// tslint:disable-next-line:no-console
				console.trace(`${this} does not implement ${methodName}`);
			}
			return undefined as R;
		}
	}
    /**
     * Destroys this component by freeing retained properties.
     *
     * @memberOf Component
     */
	public destroy() {
		const me: any = this;
		if (me.setParent) {
			me.setParent(null);
		}
        /**
         * Delete/Release all properties of this component.
         * If the property has a `destroy` function then
         * we call it before removing the property
         */
		Object.keys(me).forEach(prop => {
			me[prop] = null;
			delete me[prop];
		});
		delete me.config;
	}

    /**
     * Apply default values to the class configuration object.
     *
     * @protected
     * @param {IComponentConfig} defaults
     * @memberof Component
     */
	protected configDefaults(defaults: IComponentConfig) {
		const me = this;
		Blend.apply(me.config, defaults || {});
	}

    /**
     * Initializes this component.
     *
     * @protected
     * @memberof Component
     */
	// tslint:disable-next-line:no-empty
	protected initComponent() { }
}
