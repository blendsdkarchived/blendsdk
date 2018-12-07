import { Blend } from './Blend';
import { IAbstractComponent, IComponentConfig } from './Types';

/**
 * Type describing a Component with its minimal configuration type.
 */
export type TComponent = Component<IComponentConfig>;

/**
 * Base class of all configurable components within Blend.
 *
 * @export
 * @abstract
 * @class Component
 * @implements {IAbstractComponent}
 * @template T
 */
export abstract class Component<T extends IComponentConfig> implements IAbstractComponent {
    /**
     * Key to identify the unique identifer of this component.
     * This key is used on a DOM component
     *
     * @export
     */
    static KEY_UID = '_uid';

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
    protected config: T;

    /**
     * Creates an instance of Component.
     * @param {IDictionary} [config]
     *
     * @memberOf Component
     */
    public constructor(config?: T) {
        var me = this;
        me.config = config || <T>{};
        me.configDefaults(<IComponentConfig>{
            userData: {},
            id: null
        });
        me.uid = Blend.ID().toString();
    }

    /**
     * Apply default values to the class configuration object.
     *
     * @protected
     * @param {IComponentConfig} defaults
     * @memberof Component
     */
    protected configDefaults(defaults: IComponentConfig) {
        var me = this;
        Blend.apply(me.config, defaults || {});
    }

    /**
     * Initializes this component.
     *
     * @protected
     * @memberof Component
     */
    protected initComponent() {}

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
        var me = this,
            value = value || undefined;
        if (Blend.isObject(key)) {
            me.config.userData = <any>key;
        } else if (Blend.isString(key)) {
            me.config.userData[<string>key] = value;
        }
        return me;
    }

    /**
     * Gets custom date value from this component.
     * If the key is not provided then the entire collection is returned.
     *
     * @template T
     * @param {string} [key]
     * @param {T} [defaultValue]
     * @returns {T}
     * @memberof Component
     */
    public getUserData<T>(key?: string, defaultValue?: T): T {
        var me = this,
            key = key || null;
        if (key === null) {
            return <T>(me.config.userData || {});
        } else if (Blend.isString(key)) {
            return me.config.userData[<string>key] || defaultValue || undefined;
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
     * @returns {T}
     * @memberof Component
     */
    public applyMethod<T>(methodName: string, arg?: Array<any>): T {
        var fn: Function = <Function>(<any>this)[methodName];
        if (fn) {
            return <T>fn.apply(this, arg || []);
        } else {
            if (console && console.trace) {
                console.trace(`${this} does not implement ${methodName}`);
            }
            return <T>undefined;
        }
    }
    /**
     * Destroys this component by freeing retained properties.
     *
     * @memberOf Component
     */
    public destroy() {
        var me: any = this;
        if (me.setParent) {
            me.setParent(null);
        }
        /**
         * Delete/Release all properties of this component.
         * If the property has a `destroy` function then
         * we call it before removing the property
         */
        Object.keys(me).forEach(function(prop) {
            me[prop] = null;
            delete me[prop];
        });
        delete me.config;
    }
}
