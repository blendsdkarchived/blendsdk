/**
 * Checks if the given value is an array.
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function isArray(value: any): boolean {
	return Object.prototype.toString.apply(value) === "[object Array]";
}
