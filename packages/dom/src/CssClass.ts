import { Blend, IDictionary } from "@blendsdk/core";

/**
 * Type for defining a CssClass function. This
 * type is used in conjunction with {ICssClass}
 * @type
 */
export type TCssClass<T> = (state?: boolean | -1) => T;

/**
 * Interface for defining a rule-set for a CssClass instance.
 *
 * @interface ICssClass
 */
export interface ICssClass<T> {
    /**
     * Serializes the css rule into an HTMLElement
     *
     * @param {HTMLElement} [el]
     * @returns {T}
     * @memberof ICssClass
     */
    serialize(el?: HTMLElement): T;
    /**
     * Sets all the rules to the given value
     *
     * @param {(boolean | -1)} state
     * @returns {T}
     * @memberof ICssClass
     */
    setAll(state: boolean | -1): T;
    /**
     * Sets a single rule to the given value
     *
     * @param {string} key
     * @param {(boolean | -1)} state
     * @returns {T}
     * @memberof ICssClass
     */
    set(key: string, state: boolean | -1): T;
    /**
     * Adds one or more rules to the rule-set
     *
     * @param {(string | Array<string>)} rules
     * @returns {T}
     * @memberof ICssClass
     */
    addRule(rules: string | string[]): T;
}

/**
 * This class provides a convenient way to add, remove, and toggle
 * css rules on an HTMLElement.
 *
 * The constructor requires an array of css rules (strings). Each rule
 * provided to the constructor becomes a camelCase function that can be
 * used to add, remove, and toggle the rule on an HTMLElement. The rule
 * function are created dynamically in runtime. To get a typed access to
 * the rule functions, you need to use the {CssClass} utility
 * to create an instance of {CssClass}, and provide a custom interface
 * that is extended from.
 *
 *
 * @export
 * @class CssClass
 * @implements {ICssClass<any>}
 */
export class CssClass implements ICssClass<any> {
    /**
     * Creates an instance of {Blend.dom.CssClass} type casted to
     * an interface of T
     *
     * @export
     * @template T
     * @param {Array<string>} cssKeys
     * @param {HTMLElement} [el]
     * @returns {T}
     */
    public static create<T extends ICssClass<T>>(cssKeys: string[], el?: HTMLElement): T {
        return (new CssClass(cssKeys, el) as any) as T;
    }
    /**
     * Reference to the HTMLElement
     * on which this class operates
     *
     * @protected
     * @type {HTMLElement}
     * @memberof CssClass
     */
    protected el: HTMLElement;
    /**
     * Internal collection of CSS rules
     *
     * @protected
     * @type {IDictionary}
     * @memberof CssClass
     */
    protected cssKeys: IDictionary;
    /**
     * A cache for keeping the css rules names
     * to be used to the builder.
     *
     * This is introduced to be able to
     * dynamically add rules to the rule-set.
     *
     * @protected
     * @type {Array<string>}
     * @memberof CssClass
     */
    protected cssKeysCache: string[];
    /**
     * A prefix to be removed from the css rules.
     *
     * @protected
     * @type {string}
     * @memberof CssClass
     */
    protected removePrefix: string;
    /**
     * RegExp for cleaning up the css rules
     *
     * @protected
     * @type {RegExp}
     * @memberof CssClass
     */
    protected re: RegExp;
    /**
     * Check if the current state is synched with the class attribute
     * value.
     *
     * @protected
     * @type {boolean}
     * @memberof CssClass
     */
    protected synced: boolean;

    /**
     * Creates an instance of CssClass.
     * @param {Array<string>} cssKeys
     * @param {HTMLElement} [el]
     * @param {string} [removePrefix]
     * @memberof CssClass
     */
    public constructor(cssKeys: string[], el?: HTMLElement, removePrefix?: string) {
        const me = this;
        me.el = el;
        me.cssKeysCache = cssKeys;
        me.cssKeys = {};
        me.removePrefix = removePrefix || "b-";
        me.buildSetters();
        me.synced = false;
    }

    /**
     * Adds one or more rule to the rule-set
     *
     * @param {(string | string[])} rules
     * @memberof CssClass
     */
    public addRule(rules: string | string[]) {
        const me = this;
        me.cssKeysCache = me.cssKeysCache.concat(Blend.wrapInArray(rules));
        me.re = null;
        me.buildSetters();
    }

    /**
     * Serializes the current CSS rules to a an optional {HTMLElement}
     * or the one that was provided to the constructor.
     *
     * @param {HTMLElement} [el]
     * @returns {this}
     * @memberof CssClass
     */
    public serialize(el?: HTMLElement): this {
        const me = this,
            element: HTMLElement = el || me.el;
        let list: string[], current: string;

        if (element && !me.synced) {
            current = element.getAttribute("class") || "";
            list = current
                .replace(me.re, "")
                .trim()
                .split(" ");
            list = list.length === 1 && list[0] === "" ? [] : list;
            Blend.forEach(me.cssKeys, (val: true | false, key: string) => {
                if (val === true) {
                    list.push(key);
                }
            });
            if (list.length !== 0) {
                const value = list
                    .unique()
                    .join(" ")
                    .trim();
                if (value !== current) {
                    element.setAttribute("class", list.join(" ").trim());
                }
            } else {
                element.removeAttribute("class");
            }
            me.synced = true;
        }
        return this;
    }

    /**
     * Sets all the values at once
     *
     * @param {(boolean | -1)} state
     * @returns {this}
     * @memberof CssClass
     */
    public setAll(state: boolean | -1): this {
        const me = this;
        Blend.forEach(me.cssKeys, (value: true | false, key: string) => {
            me.set(key, state);
        });
        return me;
    }

    /**
     * Sets a state to a css rule
     *
     * @protected
     * @param {string} key
     * @param {(boolean | -1)} state
     * @memberof CssClass
     */
    public set(key: string, state: boolean | -1): this {
        const me = this;
        if (state === undefined) {
            state = true;
        }
        if (state === -1) {
            me.cssKeys[key] = me.cssKeys[key] === true ? false : true;
        } else {
            me.cssKeys[key] = state;
        }
        me.synced = false;
        return me;
    }

    /**
     * Create a camelCase function name from a css rule name.
     *
     * @protected
     * @param {string} key
     * @returns
     * @memberof CssClass
     */
    protected createSetterName(key: string, removeMethodPrefix: string) {
        const ar = key
            .trim()
            .replace(removeMethodPrefix || "", "")
            .split("-");
        ar.forEach((part: string, index: number) => {
            ar[index] = index === 0 ? part.toLocaleLowerCase() : part.ucFirst();
        });
        return ar.join("");
    }

    /**
     * Creates a RegEx object for splitting and tokenizing the css class value.
     *
     * @protected
     * @param {Array<string>} cssKeys
     * @memberof CssClass
     */
    protected createSplitterRegExp() {
        const me = this,
            result: string[] = [];
        me.cssKeysCache.forEach((key: string) => {
            result.push(`\\b${key}\\b(\\s|$)`);
        });
        me.re = new RegExp(result.join("|"), "gi");
    }

    /**
     * Build the setter functions for this class
     *
     * @protected
     * @param {Array<string>} keys
     * @memberof CssClass
     */
    protected buildSetters() {
        const host: any = this,
            me = this;

        let setterName: string;

        if (!me.re) {
            me.createSplitterRegExp();
        }

        me.cssKeysCache.forEach((item: string) => {
            setterName = me.createSetterName(item, me.removePrefix);
            if (!host[setterName]) {
                me.cssKeys[item] = undefined; // reset the key set to undefined
                host[setterName] = (itm => {
                    return function(state: boolean | -1) {
                        me.set(itm, state);
                        return this;
                    };
                })(item);
            }
        });
    }
}
