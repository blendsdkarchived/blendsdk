import { IAbstractComponent, IDictionary, TConfigurableClass, TFunction } from "./Types";
import { BLEND_VERSION } from "./Version";

// tslint:disable-next-line:no-namespace
export namespace Blend {
    /**
     * The identifier for the {Blend.ID} method
     * @private
     */
    let _ID = 1000 + new Date().getSeconds();
    /**
     * Contains the current Blend version
     */
    export const VERSION = BLEND_VERSION;
    /**
     * Configuration property for placing the framework a debugging state
     */
    export let DEBUG: boolean = false;
    /**
     * The base font size that is used in all rem calculation
     */
    export let BASE_FONT_SIZE = 16;

    /**
     * Converts a camelCase string to dashed case.
     * For example backgroundColor will be background-color
     *
     * @export
     * @param {string} value
     * @returns {string}
     */
    export function dashedCase(value: string): string {
        return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }

    /**
     * The Blend.requestAnimationFrame() method tells the browser that you wish to perform
     * an animation and requests that the browser call a specified function to update an
     * animation before the next repaint. The method takes a callback as an argument
     * to be invoked before the repaint.
     *
     * @export
     * @param {FrameRequestCallback} callback
     */
    export function raf(callback: FrameRequestCallback) {
        window.requestAnimationFrame(callback);
    }

    /**
     * Determines of the system is in RTL mode
     *
     * @export
     * @returns
     */
    export function isRTL() {
        return false;
    }

    /**
     * Checks if the given value qualifies for an event name.
     *
     * @export
     * @param {string} value
     * @returns
     */
    export function isEventName(value: string) {
        return Blend.isString(value) && value.indexOf("on") === 0 && value !== "on";
    }

    /**
     * Converts the function arguments to an array.
     *
     * @export
     * @param {IArguments} args
     * @returns {Array<any>}
     */
    export function argumentsToArray(args: IArguments): any[] {
        const result: any[] = [];
        Blend.forEach(args, (item: any) => {
            result.push(item);
        });
        return result;
    }

    /**
     * Makes a shallow clone of an object by copying the
     * properties from one object to another.
     * ONLY USE THIS FUNCTION WITH OBJECTS HAVING NON-OBJECT AND
     * NON-ARRAY PROPERTIES
     *
     * @protected
     * @param {*} src
     * @returns {*}
     * @memberof ScrollableContainer
     */
    export function shallowClone(src: any): any {
        const dst: any = {};
        for (const k in src) {
            if (Blend.isArray(src[k])) {
                dst[k] = [];
                src[k].forEach((i: any) => {
                    dst[k].push(i);
                });
            } else {
                dst[k] = src[k];
            }
        }
        return dst;
    }

    /**
     * Returns a random number between min and max.
     *
     * @export
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    export function random(min: number, max: number): number {
        return Math.floor(Math.random() * max + min);
    }

    /**
     * Calculates rem value from pixels
     *
     * @param {number} pixels
     * @returns {string}
     * @memberof Sheet
     */
    export function remCalc(pixels: number, baseFontSize?: number): string {
        return `${pixels / (baseFontSize || Blend.BASE_FONT_SIZE)}rem`;
    }

    /**
     * Formats a given number to a string with `px` postfix
     *
     * @export
     * @param {number} value
     * @returns @returns {string}
     */
    export function toPx(value: number): string {
        return `${value}px`;
    }

    /**
     * Formats a given number to a string with `px` postfix
     * only of the value is numeric
     *
     * @export
     * @param {*} value
     * @returns {string}
     */
    export function toPxIf(value: any): string {
        return Blend.isNumeric(value) ? Blend.toPx(value) : value;
    }

    /**
     * Formats a given number to a string with `%` postfix
     *
     * @export
     * @param {number} value
     * @returns @returns {string}
     */
    export function toPct(value: number): string {
        return `${value}%`;
    }

    /**
     * Generates a new identifier.
     *
     * @export
     * @returns {number}
     */
    export function ID(): number {
        return (a => {
            const r = a;
            return r;
        })(_ID++);
    }

    /**
     * Automatically instantiates a component with a configuration
     * is provided.
     *
     * This function will return the clazz parameter if it is not of a
     * TConfigurableClass type or when the clazz parameter is already
     * instantiated.
     *
     * @export
     * @template T
     * @param {TConfigurableClass} clazz
     * @param {IDictionary} [config]
     * @returns {T}
     */
    export function createComponent<T extends IAbstractComponent>(
        clazz: TConfigurableClass | T,
        config?: IDictionary
    ): T {
        if (!Blend.isNullOrUndef(clazz)) {
            if (Blend.isClass(clazz)) {
                return new (clazz as any)(config || {});
            } else {
                if (Blend.DEBUG && (!Blend.isObject(clazz) || !(clazz as IAbstractComponent).getUID)) {
                    // tslint:disable-next-line:no-console
                    console.warn(
                        "The provided clazz parameter seems not to be an Object or an instance of Blend.core.Component!"
                    );
                }
                return clazz as any;
            }
        } else {
            throw new Error("Unable to create a component based on the given class: " + clazz);
        }
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * `delay` number of milliseconds. If `immediate` is passed, trigger the function
     * on the leading edge, instead of the trailing.
     *
     * @copyright This function ir originally ported from the underscore.js library and it copyrighted in MIT
     * @export
     * @param {number} delay
     * @param {Function} callback
     * @param {*} scope
     * @param {boolean} immediate
     * @returns {Function}
     */
    // tslint:disable-next-line:no-shadowed-variable
    export function debounce(delay: number, callback: TFunction, scope?: any, immediate?: boolean): TFunction {
        let timeout: any;
        immediate = immediate || false;
        return function() {
            const me = this;
            scope = scope || me;
            const args = arguments;
            const later = () => {
                    timeout = null;
                    if (!immediate) {
                        callback.apply(scope, args);
                    }
                },
                callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
            if (callNow) {
                callback.apply(scope, args);
            }
        };
    }

    /**
     * Ensures that the given value is a boolean
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function ensureBoolean(value: any): boolean {
        return value === true ? true : false;
    }

    /**
     * Runs the given callback after given milliseconds.
     * This function is a wrapper around setTimeout
     *
     * @export
     * @param {number} ms
     * @param {Function} callback
     * @param {*} [scope]
     */
    export function delay(ms: number, callback: TFunction, scope?: any) {
        scope = scope || window;
        setTimeout(() => {
            callback.apply(scope, []);
        }, ms);
    }

    /**
     * Copies keys and values from one object to another.
     * This function can optionally merge arrays and overwrite objects
     * in the target parameters from the source parameter.
     *
     * @export
     * @param {*} target
     * @param {*} source
     * @param {{ overwrite?: boolean, mergeArrays?: boolean }} [options]
     * @returns {*}
     */
    export function apply<T>(target: any, source: any, options?: { overwrite?: boolean; mergeArrays?: boolean }): any {
        let key: any;
        const targetKeys = Object.keys(target || {}),
            targetHasKey = (k: string): boolean => {
                return targetKeys.indexOf(k) !== -1;
            };
        options = options || {
            mergeArrays: false,
            overwrite: false
        };

        if (!Blend.isNullOrUndef(target) && !Blend.isNullOrUndef(source)) {
            if (Blend.isArray(target) && !Blend.isArray(source)) {
                target.push(source);
            } else {
                for (key in source) {
                    if (key && source.hasOwnProperty(key)) {
                        if (targetHasKey(key) && Blend.isObject(target[key])) {
                            if (options.overwrite === true) {
                                target[key] = source[key];
                            } else {
                                Blend.apply(target[key], source[key]);
                            }
                        } else if (targetHasKey(key) && Blend.isArray(target[key]) && options.mergeArrays === true) {
                            target[key] = target[key].concat(Blend.wrapInArray(source[key]));
                        } else if (targetHasKey(key) && options.overwrite === true) {
                            target[key] = source[key];
                        } else if (Blend.isNullOrUndef(target[key])) {
                            target[key] = source[key];
                        }
                    }
                }
            }
        }
        return target as T;
    }

    /**
     * Wraps the given value in an array if it is not an array itself
     *
     * @export
     * @template T
     * @param {*} obj
     * @returns {Array<T>}
     */
    export function wrapInArray<T>(obj: any): T[] {
        return Blend.isArray(obj) ? obj : Blend.isNullOrUndef(obj) ? [] : [obj];
    }

    /**
     * Loops though the given object (array, dictionary, NodeList, HTMLCollection) and runs
     * a callback on each item.
     * The callback loop will break when the callback function returns "false" explicitly!
     *
     * @export
     * @template T
     * @param {*} obj
     * @param {((item: T, index: number | string, scope: any) => any | boolean)} callback
     * @param {*} [scope]
     * @returns
     */
    export function forEach<T>(
        obj: any,
        callback: (item: T, index: number | string, scope: any) => any | boolean,
        scope?: any
    ) {
        let key: any;
        const isHTMLCollection = (elObj: any): boolean => {
            return (
                (elObj.constructor && elObj.constructor.name && elObj.constructor.name === "HTMLCollection") ||
                elObj.toString() === "[object HTMLCollection]"
            );
        };
        if (obj) {
            if (Blend.isFunction(obj)) {
                return;
            } else if (Blend.isArray(obj)) {
                // tslint:disable-next-line:no-shadowed-variable
                const length: number = obj.length;
                for (key = 0; key < length; key++) {
                    if (callback.call(scope, obj[key], key, obj) === false) {
                        break;
                    }
                }
            } else if (isHTMLCollection(obj) || Blend.isInstanceOf(obj, NodeList)) {
                const length: number = obj.length;
                let el: HTMLElement;
                for (key = 0; key !== length; key++) {
                    el = obj.item(key);
                    if (callback.call(scope, el, key, obj) === false) {
                        break;
                    }
                }
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (callback.call(scope, obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Tests whether the given value is a Date object.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isDate(value: any): boolean {
        return Object.prototype.toString.apply(value) === "[object Date]";
    }

    /**
     * Tests whether the given value is a number.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isNumeric(value: any): boolean {
        return Object.prototype.toString.apply(value) === "[object Number]";
    }

    /**
     * Tests whether the given value is an instance of another class/function
     * in an optional scope. The scope defaults to `window`
     *
     * @export
     * @param {*} obj
     * @param {*} clazz
     * @param {*} [scope]
     * @returns {boolean}
     */
    export function isInstanceOf(obj: any, clazz: any): boolean {
        if (obj === null || obj === undefined) {
            return false;
        }

        const hc = "[object HTMLCollection]";
        if (obj.toString() === hc && clazz === "HTMLCollection") {
            return true;
        } else {
            if (Blend.isString(clazz)) {
                const fn = new Function(
                    "",
                    " try { return " +
                        clazz +
                        " } catch(e) { if(console && console.log) {console.log(e);};  return null };"
                );
                clazz = fn();
            }
            try {
                const res = obj instanceof clazz;
                return res;
            } catch (e) {
                return false;
            }
        }
    }

    /**
     * Tests whether the given value is a boolean.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isBoolean(value: any): boolean {
        return typeof value === "boolean";
    }

    /**
     * Tests whether the given value is an object.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isObject(value: any): boolean {
        return (
            typeof value === "object" &&
            (typeof value !== "function" &&
                value !== null &&
                value !== undefined &&
                !Blend.isRegExp(value) &&
                !Blend.isClass(value) &&
                !Blend.isArray(value))
        );
    }

    /**
     * Tests whether the given value is instance of RegExp
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isRegExp(value: any): boolean {
        return value instanceof RegExp;
    }

    /**
     * Tests whether the given value is an array.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isArray(value: any): boolean {
        return Object.prototype.toString.apply(value) === "[object Array]";
    }

    /**
     * Tests whether the given value is a string.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isString(value: any): boolean {
        return typeof value === "string";
    }

    /**
     * Tests whether the given value is a function.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isFunction(value: any): boolean {
        return typeof value === "function";
    }

    /**
     * Tests whether the given value is null or undefined.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isNullOrUndef(value: any): boolean {
        return value === null || value === undefined || value === "undefined";
    }

    /**
     * Tests whether the give value is class
     *
     * @export
     * @param {*} clazz
     * @returns {boolean}
     */
    export function isClass(clazz: any): boolean {
        return (
            Blend.isFunction(clazz) &&
            Blend.isObject((clazz as any).prototype) &&
            Blend.isFunction((clazz.prototype as any).constructor)
        );
    }
}
