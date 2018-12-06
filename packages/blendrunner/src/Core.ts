/**
 * Base class containing core utility functions.
 *
 * @export
 * @abstract
 * @class Core
 */
export abstract class Core {
    /**
     * Gets the type of an object.
     *
     * @protected
     * @param {*} obj
     * @returns {string}
     *
     * @memberOf Core
     */
    protected get_obj_type(obj: any): string {
        var me = this;
        if (me.is_string(obj)) {
            return 'string';
        } else if (me.is_array(obj)) {
            return 'array';
        } else if (me.is_number(obj)) {
            return 'number';
        } else if (me.is_object(obj)) {
            return 'object';
        } else if (me.is_function(obj)) {
            return 'function';
        } else if (me.is_null(obj)) {
            return 'null';
        } else if (me.is_regexp(obj)) {
            return 'regexp';
        }
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
    protected forEach<T>(
        obj: any,
        callback: (item: T, index: number | string, scope: any) => any | boolean,
        scope?: any
    ) {
        var me = this,
            key: any,
            isHTMLCollection = function(obj: any): boolean {
                return (
                    (obj.constructor && obj.constructor.name && obj.constructor.name === 'HTMLCollection') ||
                    obj.toString() == '[object HTMLCollection]'
                );
            };
        if (obj) {
            if (me.is_function(obj)) {
                return;
            } else if (me.is_array(obj)) {
                var length: number = obj.length;
                for (key = 0; key < length; key++) {
                    if (callback.call(scope, obj[key], key, obj) === false) {
                        break;
                    }
                }
            } else if (isHTMLCollection(obj) || me.is_instance_of(obj, NodeList)) {
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
     * Tests whether the given value is an instance of another class/function
     * in an optional scope. The scope defaults to `window`
     *
     * @export
     * @param {*} obj
     * @param {*} clazz
     * @param {*} [scope]
     * @returns {boolean}
     */
    protected is_instance_of(obj: any, clazz: any): boolean {
        if (obj === null || obj === undefined) {
            return false;
        }

        var me = this,
            hc = '[object HTMLCollection]';
        if (obj.toString() === hc && clazz === 'HTMLCollection') {
            return true;
        } else {
            if (me.is_string(clazz)) {
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
     * Check if the value is a string.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_string(value: any): boolean {
        return typeof value === 'string';
    }

    /**
     * Wraps the given value in an array if it is not an array itself
     *
     * @export
     * @template T
     * @param {*} obj
     * @returns {Array<T>}
     */
    protected wrap_in_array<T>(obj: any): Array<T> {
        var me = this;
        return me.is_array(obj) ? obj : me.is_null(obj) ? [] : [obj];
    }

    /**
     * Check if the value is a number.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_number(value: any): boolean {
        // Original source: JQuery
        return value - parseFloat(value) >= 0;
    }

    /**
     * Check if the value is an array.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_array(value: any): boolean {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }
    /**
     * Check if the value is an object.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_object(value: any): boolean {
        var me = this;
        return (
            typeof value === 'object' &&
            !me.is_array(value) &&
            !me.is_function(value) &&
            !me.is_null(value) &&
            !me.is_string(value)
        );
    }
    /**
     * Check if the value is null.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_null(value: any): boolean {
        return value === null || value === undefined;
    }

    /**
     * Check if the value is regexp.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_regexp(value: any): boolean {
        return value instanceof RegExp;
    }

    /**
     * Check if the value is a function.
     *
     * @protected
     * @param {*} value
     * @returns {boolean}
     *
     * @memberOf Core
     */
    protected is_function(value: any): boolean {
        return typeof value === 'function';
    }

    /**
     * A console.log wrapper to log messages in the main runner window
     *
     * @param {*} [message]
     * @param {...any[]} optionalParams
     * @memberof Core
     */
    public log(message?: any, ...optionalParams: any[]) {
        console.log.apply(window, arguments);
    }
}
