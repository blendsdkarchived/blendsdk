import { IDictionary, TConfigurableClass, IAbstractComponent } from './Types';
import { BLEND_VERSION } from './Version';

export namespace Blend {
    /**
     * The identifier for the {Blend.ID} method
     * @private
     */
    var _ID = 1000;
    /**
     * Contains the current Blend version
     */
    export const VERSION = BLEND_VERSION;
    /**
     * Configuration property for placing the framework a debugging state
     */
    export var DEBUG: boolean = false;
    /**
     * The base font size that is used in all rem calculation
     */
    export var BASE_FONT_SIZE = 16;
    /**
     * The base URL of BlendSDK. This should be a static map to the
     * node_modules/@blend
     */
    export var BASE_URL = '/blendsdk';
    /**
     * A dictionary of color names and color values.
     */
    var colorPalette: IDictionary;

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
        return Blend.isString(value) && value.indexOf('on') === 0 && value != 'on';
    }

    /**
     * Converts the function arguments to an array.
     *
     * @export
     * @param {IArguments} args
     * @returns {Array<any>}
     */
    export function argumentsToArray(args: IArguments): Array<any> {
        var result: Array<any> = [];
        Blend.forEach(args, (item: any) => {
            result.push(item);
        });
        return result;
    }

    /**
     * Runs a function in parallel.
     *
     * @export
     * @param {Function} work
     * @param {Function} doneCallback
     */
    export function runAsync(work: Function, doneCallback?: Function) {
        setTimeout(function() {
            work(doneCallback);
        }, 1);
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
        var dst: any = {};
        for (var k in src) {
            if (Blend.isArray(src[k])) {
                dst[k] = [];
                src[k].forEach(function(i: any) {
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
        return (function(a) {
            var r = a;
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
                return new (<any>clazz)(config || {});
            } else {
                if (Blend.DEBUG && (!Blend.isObject(clazz) || !(<IAbstractComponent>clazz).getUID)) {
                    console.warn(
                        'The provided clazz parameter seems not to be an Object or an instance of Blend.core.Component!'
                    );
                }
                return <any>clazz;
            }
        } else {
            throw new Error('Unable to create a component based on the given class: ' + clazz);
        }
    }

    /**
     * Gets a class' base hierarchy. For example `Component/Layout/HBox`
     *
     * @export
     * @param {TConfigurableClass} clazz
     * @returns {string}
     */
    export function getClassPath(clazz: TConfigurableClass): string {
        var nameExtract = /^function\s?([^\s(]*)/,
            parts: Array<any> = [clazz.toString().match(nameExtract)[1]],
            p: any,
            r: any;
        while ((p = Object.getPrototypeOf(clazz)) !== null) {
            r = p.toString().match(nameExtract);
            if (r && r[1] && r[1].trim() !== '') {
                parts.push(r[1]);
            }
            clazz = p;
        }
        return parts.reverse().join('/');
    }

    /**
     * Gets the class name of an object.
     *
     * @export
     * @param {*} obj
     * @returns {string}
     */
    export function getClassName(obj: any): string {
        var result = null;
        if (Blend.isObject(obj) && !Blend.isNullOrUndef(obj.constructor)) {
            result = obj.constructor.name || null;
            if (result === null) {
                // try the hard way
                var str = obj.constructor.toString().trim();
                if (str !== '') {
                    str = str.substr(9); // function and space
                    result = str.substr(0, str.indexOf('('));
                }
            }
        }
        return result;
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
    export function debounce<T>(delay: number, callback: Function, scope?: any, immediate?: boolean): T {
        var timeout: number;
        immediate = immediate || false;
        return <any>function() {
            scope = scope || me;
            var me = this,
                args = arguments,
                later = function() {
                    timeout = null;
                    if (!immediate) {
                        callback.apply(scope, args);
                    }
                },
                callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = <any>setTimeout(later, delay);
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
    export function delay(ms: number, callback: Function, scope?: any) {
        scope = scope || window;
        setTimeout(function() {
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
        var key: any,
            targetKeys = Object.keys(target || {}),
            targetHasKey = function(key: string): boolean {
                return targetKeys.indexOf(key) !== -1;
            };
        options = options || {
            overwrite: false,
            mergeArrays: false
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
        return <T>target;
    }

    /**
     * Wraps the given value in an array if it is not an array itself
     *
     * @export
     * @template T
     * @param {*} obj
     * @returns {Array<T>}
     */
    export function wrapInArray<T>(obj: any): Array<T> {
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
        var key: any,
            isHTMLCollection = function(obj: any): boolean {
                return (
                    (obj.constructor && obj.constructor.name && obj.constructor.name === 'HTMLCollection') ||
                    obj.toString() == '[object HTMLCollection]'
                );
            };
        if (obj) {
            if (Blend.isFunction(obj)) {
                return;
            } else if (Blend.isArray(obj)) {
                var length: number = obj.length;
                for (key = 0; key < length; key++) {
                    if (callback.call(scope, obj[key], key, obj) === false) {
                        break;
                    }
                }
            } else if (isHTMLCollection(obj) || Blend.isInstanceOf(obj, NodeList)) {
                var length: number = obj.length,
                    el: HTMLElement;
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
        return Object.prototype.toString.apply(value) === '[object Date]';
    }

    /**
     * Tests whether the given value is a number.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isNumeric(value: any): boolean {
        return Object.prototype.toString.apply(value) === '[object Number]';
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

        var hc = '[object HTMLCollection]';
        if (obj.toString() === hc && clazz === 'HTMLCollection') {
            return true;
        } else {
            if (Blend.isString(clazz)) {
                var fn = new Function(
                    '',
                    ' try { return ' +
                        clazz +
                        ' } catch(e) { if(console && console.log) {console.log(e);};  return null };'
                );
                clazz = fn();
            }
            try {
                var res = obj instanceof clazz;
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
        return typeof value === 'boolean';
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
            typeof value === 'object' &&
            (typeof value !== 'function' &&
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
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    /**
     * Tests whether the given value is a string.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isString(value: any): boolean {
        return typeof value === 'string';
    }

    /**
     * Tests whether the given value is a function.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isFunction(value: any): boolean {
        return typeof value === 'function';
    }

    /**
     * Tests whether the given value is null or undefined.
     *
     * @export
     * @param {*} value
     * @returns {boolean}
     */
    export function isNullOrUndef(value: any): boolean {
        return value === null || value === undefined || value === 'undefined';
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
            Blend.isObject((<any>clazz).prototype) &&
            Blend.isFunction((<any>clazz.prototype).constructor)
        );
    }
}
