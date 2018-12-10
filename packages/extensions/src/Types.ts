declare global {
    /**
     * Extension to the build-in Array type
     *
     * @interface Array
     * @template T
     */
    // tslint:disable-next-line:interface-name
    interface Array<T> {
        /**
         * Removes duplicate values from an array.
         *
         * @returns {Array<T>}
         *
         * @memberOf Array
         */
        unique(): T[];
        /**
         * Removes an element at a given index and returns the removed element
         * if the element is actually removed from the array.
         *
         * @template T
         * @param {number} index
         * @returns {(T | null)}
         *
         * @memberOf Array
         */
        removeAt<T>(index: number): T | null;
        /**
         * Inserts an element into a given index within this Array.
         *
         * @param {number} index
         * @param {*} item
         * @returns {Array<any>}
         * @memberof Array
         */
        insertAt(index: number, item: any): any[];
        /**
         * Gets a random item from this Array.
         *
         * @returns {*}
         * @memberof Array
         */
        random(): any;
        /**
         * Computes the intersection of an array, optionally
         * taking an argument to compare the elements
         *
         * @param {Array<any>} ar
         * @param {(a: any, b: any) => boolean} [compare]
         * @returns {Array<any>}
         * @memberof Array
         */
        intersect(ar: any[]): any[];
    }

    /**
     * Extension to the built-in String type
     *
     * @interface String
     */
    // tslint:disable-next-line:interface-name
    export interface String {
        /**
         * Uppercase the first character of this string.
         *
         * @returns {string}
         *
         * @memberOf String
         */
        ucFirst(): string;
        /**
         * Repeats this string by the number of provided counts.
         *
         * @param {number} counts
         * @returns {string}
         *
         * @memberOf String
         */
        repeat(counts: number): string;
        /**
         *  Determines whether this string begins with the characters of
         * a specified string.
         *
         * @param {string} searchString
         * @param {number} [position]
         * @returns {boolean}
         *
         * @memberOf String
         */
        startsWith(searchString: string, position?: number): boolean;
        /**
         * Tests if this string exists in a given array.
         *
         * @param {Array<string>} list
         * @returns {boolean}
         *
         * @memberOf String
         */
        inArray(list: string[]): boolean;
        /**
         * Removes whitespace from both ends of a string.
         *
         * @returns {string}
         *
         * @memberOf String
         */
        trim(): string;
        /**
         * Determines whether this string is empty.
         *
         * @type {boolean}
         * @memberOf String
         */
        isEmpty(): boolean;
        /**
         * Creates a weak hash from this string.
         *
         * @returns {string}
         * @memberof String
         */
        hash(): string;
        /**
         * Cuts the string to given lengths and adds "&hellip;" (...) at the end.
         *
         * @param {number} maxChars
         * @param {boolean} [html]
         * @returns {string}
         * @memberof String
         */
        ellipsis(maxChars: number, html?: boolean): string;
    }

    /**
     * Extension to the built-in ClassList
     *
     * @interface DOMTokenList
     */
    // tslint:disable-next-line:interface-name
    export interface DOMTokenList {
        /**
         * Replaces a css class with another on the space position.
         *
         * @memberof DOMTokenList
         */
        replace: (oldClass: string, newClass: string) => void;
        /**
         * Sets or removes a class from the element.
         * This function is not standard DOM and it is augmented
         * by Blend
         *
         * @memberof DOMTokenList
         */
        set: (className: string, addRemove: boolean) => void;
    }

    /**
     * Extension interface for adding extra functionality
     * to the native HTMLElement element.
     *
     * @interface HTMLElement
     */

    // tslint:disable-next-line:interface-name
    interface HTMLElement {
        /**
         * @internal
         * Internal property used to hold arbitrary data
         */
        $blend: any;
    }
}

export {};
