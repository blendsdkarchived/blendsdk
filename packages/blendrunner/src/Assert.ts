import { Core } from './Core';
/**
 * Abstract class implementing an assert utility
 *
 * @export
 * @abstract
 * @class Assert
 * @extends {Core}
 */
export abstract class Assert extends Core {
    /**
     * Updates the values passed down from the actual assertion methods.
     *
     * @protected
     * @param {string} status
     * @param {*} actual
     * @param {*} expected
     * @param {string} [log]
     *
     * @memberOf BlendRunner
     */
    protected abstract assert(status: string, actual: any, expected: any, log?: string): any;

    /**
     * Mark a test as passed.
     *
     * @protected
     * @param {*} actual
     * @param {*} expected
     * @param {string} [log]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    protected pass(actual: any, expected: any, log?: string): boolean {
        var me = this;
        me.assert('pass', actual, expected, log);
        return true;
    }

    /**
     * Mark a test as failed.
     *
     * @protected
     * @param {*} actual
     * @param {*} expected
     * @param {string} log
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    protected fail(actual: any, expected: any, log: string): boolean {
        var me = this;
        me.assert('fail', actual, expected, log);
        return false;
    }

    protected timedout(): boolean {
        var me = this;
        me.assert('timeout', null, null, 'Test timed out');
        return false;
    }

    /**
     * Runs the given callback after given milliseconds.
     * This function is a wrapper around setTimeout
     *
     * @param {number} ms
     * @param {Function} callback
     * @param {*} [scope]
     */
    delay(ms: number, callback: Function, scope?: any): void {
        scope = scope || window;
        setTimeout(function() {
            callback.apply(scope, []);
        }, ms);
    }

    /**
     * Assert the actual value to be false.
     *
     * @param {*} actual
     * @param {string} [description]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    assertFalse(actual: any, description?: string): boolean {
        var me = this;
        if (actual === false) {
            return me.pass(actual, true, description);
        } else {
            return me.fail(
                actual,
                true,
                `Failed to assert that [${me.fixLogValue(actual)}] is [false]${me.fixDescription(description)}.`
            );
        }
    }

    /**
     * Assert the actual value not to be null or undefined.
     *
     * @param {*} actual
     * @param {string} [description]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    assertExists(actual: any, description?: string): boolean {
        var me = this;
        if (actual !== null && actual !== undefined) {
            me.pass(actual, 'NOT NULL', description);
            return true;
        } else {
            me.fail(
                actual,
                'NOT NULL',
                `Failed to assert that [${me.fixLogValue(actual)}] is [NOT NULL OR UNDEFINED]${me.fixDescription(
                    description
                )}.`
            );
            return false;
        }
    }

    /**
     * Assert the actual value to be null or undefined
     *
     * @param {*} actual
     * @param {string} [description]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    assertNotExists(actual: any, description?: string): boolean {
        var me = this;
        if (actual === null || actual === undefined) {
            return me.pass(actual, 'IS NULL', description);
        } else {
            return me.fail(
                actual,
                'IS NULL',
                `Failed to assert that [${me.fixLogValue(actual)}] is [NULL OR UNDEFINED]${me.fixDescription(
                    description
                )}.`
            );
        }
    }

    /**
     * Assert the actual value to equal the expected value.
     *
     * @param {*} actual
     * @param {*} expected
     * @param {string} [description]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    assertEqual(actual: any, expected: any, description?: string): boolean {
        var me = this;
        if (me._equal(actual, expected)) {
            return me.pass(actual, expected, description);
        } else {
            return me.fail(
                actual,
                expected,
                `Failed to assert that [${me.fixLogValue(actual)}] equals to [${me.fixLogValue(
                    expected
                )}]${me.fixDescription(description)}.`
            );
        }
    }

    /**
     * Assert the actual value to not to equal to the expected value.
     *
     * @param {*} actual
     * @param {*} expected
     * @param {string} [description]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    assertNotEqual(actual: any, expected: any, description?: string): boolean {
        var me = this;
        if (!me._equal(actual, expected)) {
            return me.pass(actual, expected, description);
        } else {
            return me.fail(
                actual,
                expected,
                `Failed to assert that [${me.fixLogValue(actual)}] NOT equals to [${me.fixLogValue(
                    expected
                )}]${me.fixDescription(description)}.`
            );
        }
    }

    /**
     * Assert the actual value to be true.
     *
     * @param {*} actual
     * @param {string} [description]
     * @returns {boolean}
     *
     * @memberOf BlendRunner
     */
    assertTrue(actual: any, description?: string): boolean {
        var me = this;
        if (actual === true) {
            return me.pass(actual, true, description);
        } else {
            return me.fail(
                actual,
                true,
                `Failed to assert that [${me.fixLogValue(actual)}] is [true]${me.fixDescription(description)}.`
            );
        }
    }
    /**
     * Assert the action to throw an exception. The criteria callback can be used
     * to the for an specific Error condition.
     *
     * @param {Function} action
     * @param {(err: Error) => boolean} [criteria]
     * @param {string} [description]
     *
     * @memberOf BlendRunner
     */
    assertThrows(action: Function, criteria?: (err: Error) => boolean, description?: string): boolean {
        var me = this,
            err: Error = null,
            pass: boolean;
        try {
            action();
            pass = false;
        } catch (e) {
            err = e;
            if (console && console.log) {
                console.log('Assert Throws: ' + e.message);
            }
            if (criteria) {
                pass = criteria(e);
            } else {
                pass = true;
            }
        }

        if (pass) {
            return me.pass(action.toString(), err, description);
        } else {
            return me.fail(
                action.toString(),
                'No Exception',
                `Failed to assert that the [action] throws an [Exception]${me.fixDescription(description)}.`
            );
        }
    }

    /**
     * Fix the assertion description.
     *
     * @protected
     * @param {string} description
     * @returns
     *
     * @memberOf BlendRunner
     */
    protected fixDescription(description: string) {
        return (description = description ? ' in assertion: [' + description + ']' : '');
    }

    /**
     * Corrects the value for log output.
     *
     * @protected
     * @param {*} value
     * @returns
     *
     * @memberOf BlendRunner
     */
    protected fixLogValue(value: any) {
        var me = this;
        if (me.is_object(value) || me.is_array(value)) {
            return JSON.stringify(value, null, 2);
        } else {
            return value;
        }
    }

    /**
     * Internally check if two object are equal.
     * This function is equivalent to to deep equal
     *
     * @protected
     * @param {*} actual
     * @param {*} expected
     * @returns
     *
     * @memberOf BlendRunner
     */
    protected _equal(actual: any, expected: any) {
        var me = this;
        var check = function(a: any, b: any): boolean {
            if (me.get_obj_type(a) === me.get_obj_type(b)) {
                if (me.is_array(a)) {
                    if (a.length === b.length) {
                        for (var i = 0; i !== a.length; i++) {
                            if (!check(a[i], b[i])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else if (me.is_object(a)) {
                    var aKeys = Object.keys(a),
                        bKeys = Object.keys(b);
                    if (aKeys.length === bKeys.length) {
                        for (var k in a) {
                            if (!check(a[k], b[k])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else if (me.is_function(a)) {
                    return a.length === b.length;
                } else if (me.is_regexp(a)) {
                    throw new Error("Don't know how to compare RegExp!");
                } else {
                    return a === b;
                }
            } else {
                return false;
            }
        };
        return check(actual, expected);
    }
}
