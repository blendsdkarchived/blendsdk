import { Blend, Component } from "@blendsdk/core";
import { ICreateElementConfig, ICssClassDictionary, IHTMLElementProvider } from "./Types";

// tslint:disable-next-line:no-namespace
export namespace Dom {
    /**
     * Finds an element using a CSS selector. This method internally uses querySelector.
     *
     * @export
     * @template T
     * @param {string} selector
     * @param {HTMLElement} [fromRoot]
     * @returns {(T | null)}
     */
    export function findElement<T extends HTMLElement>(selector: string, fromRoot?: HTMLElement | Document): T | null {
        return (fromRoot || document).querySelector(selector) as T;
    }

    /**
     * Clears the contents of an element
     *
     * @export
     * @param {HTMLElement} el
     */
    export function clearElement(el: HTMLElement) {
        if (el) {
            while (el.childNodes.length !== 0) {
                el.children[0].parentElement.removeChild(el.children[0]);
            }
            // perhaps overkill!
            el.textContent = "";
            el.innerHTML = "";
        }
    }

    /**
     * Finds a list of elements using a CSS selector. This method internally uses querySelectorAll.
     *
     * @export
     * @template T
     * @param {string} selector
     * @param {HTMLElement} [fromRoot]
     * @returns {NodeListOf<T>}
     */
    export function findElements<T extends HTMLElement & Node>(
        selector: string,
        fromRoot?: HTMLElement | Document
    ): NodeListOf<T> {
        return (fromRoot || document).querySelectorAll(selector) as NodeListOf<T>;
    }

    /**
     * Utility function for creating en `HTMLElement`.
     * The reference callback function `refCallback` can be used
     * to assign child elements which have a `reference` to class
     * properties.
     *
     * The windows parameters `win` can be used to create the element from
     * a specific `Window` context
     *
     * @export
     * @template T
     * @param {(ICreateElementConfig | ICreateElementConfigFunction)} [conf]
     * @param {(reference: string, element: HTMLElement) => any} [refCallback]
     * @param {Window} [win]
     * @returns {T}
     */
    export function createElement<T extends HTMLElement>(
        conf?: HTMLElement | ICreateElementConfig,
        refCallback?: (reference: string, element: HTMLElement) => any,
        defaultEventTarget?: EventListenerObject
    ): T {
        if (conf instanceof HTMLElement || conf instanceof Node) {
            // TODO:1110 Check if there is a better way!
            // Node to skip(fix for) SVGElement

            return conf as T;
        } else {
            let config: ICreateElementConfig = conf as any;
            /**
             * Normalize the config for processing
             */
            config = config || {};
            config.tag = config.tag || "DIV";
            refCallback = refCallback || null;

            let el: HTMLElement;

            if (config.tag.toLowerCase() === "svg" || config.isSVG === true) {
                el = window.document.createElementNS("http://www.w3.org/2000/svg", config.tag) as any;
                config.isSVG = true;
            } else {
                el = window.document.createElement(config.tag);
            }

            /**
             * Internal function to parse the data-* values
             */
            const parseData = (value: any) => {
                if (Blend.isNullOrUndef(value)) {
                    value = "null";
                }
                if (Blend.isObject(value) || Blend.isArray(value)) {
                    return JSON.stringify(value);
                } else {
                    return value;
                }
            };

            if (config.id) {
                el.id = config.id;
            }

            if (config.textContent) {
                if (config.isSVG) {
                    el.textContent = config.textContent;
                } else {
                    el.innerText = config.textContent;
                }
            }

            if (config.htmlContent) {
                el.innerHTML = config.htmlContent;
            }

            if (config.data) {
                Blend.forEach(config.data, (item: any, key: string) => {
                    el.setAttribute("data-" + key, parseData(item));
                });
            }

            if (config.attrs) {
                Blend.forEach(config.attrs, (item: any, key: string) => {
                    if (item !== undefined) {
                        el.setAttribute(key, parseData(item));
                    }
                });
            }

            if (config.listeners) {
                Blend.forEach(config.listeners, (item: EventListenerOrEventListenerObject, key: string) => {
                    if (!Blend.isNullOrUndef(item)) {
                        item = (((item as any) === true ? defaultEventTarget : item) ||
                            new Function(item as any)) as any;
                        el.addEventListener(key, item, false);
                    }
                });
            }

            if (config.css) {
                el.setAttribute(
                    "class",
                    Blend.wrapInArray(config.css)
                        .join(" ")
                        .replace(/\s\s+/g, " ")
                );
            }

            if (config.style) {
                const styles: string[] = [];
                Blend.forEach(config.style, (rule: string, key: string) => {
                    if (rule) {
                        styles.push(`${Blend.dashedCase(key)}:${rule}`);
                    }
                });
                const t = styles.join(";");
                if (t.length !== 0) {
                    el.setAttribute("style", t);
                }
            }

            /**
             * The children accepts either a function or string/item/items[]
             */
            if (config.children) {
                // if (Blend.isInstanceOf(config.children, Blend.ui.Collection)) {
                //     (<Blend.ui.Collection<Blend.dom.Component>>(<any>config).children).renderTo(el);
                // } else {
                Blend.wrapInArray(config.children).forEach((item: any) => {
                    if (Blend.isString(item)) {
                        el.appendChild(window.document.createTextNode(item));
                    } else if (Blend.isInstanceOf(item, HTMLElement) || Blend.isInstanceOf(item, SVGElement)) {
                        el.appendChild(item as HTMLElement);
                        const $el = DOMElement.getElement(item as HTMLElement);
                        if ($el.getReference() && refCallback) {
                            refCallback($el.getReference(), item);
                        }
                    } else if (!Blend.isNullOrUndef(item)) {
                        if ((item as IHTMLElementProvider).getElement) {
                            el.appendChild(item.getElement());
                        } else {
                            (item as ICreateElementConfig).isSVG = config.isSVG || false;
                            el.appendChild(
                                Dom.createElement(item as ICreateElementConfig, refCallback, defaultEventTarget)
                            );
                        }
                    }
                });
                // }
            }

            if (config.reference) {
                if (!el.$blend) {
                    el.$blend = {};
                }
                el.$blend.reference = config.reference;
                if (refCallback) {
                    refCallback(config.reference, el);
                }
            }
            return el as T;
        }
    }
}

/**
 * Utility class providing various functions to manipulate or
 * get information from an HTMLElement|SVGElement this class
 * also can be used to create lightweight "components"
 *
 * @usage
 * Use $e() for convenience
 *
 * @export
 * @class DOMElement
 * @implements {IHTMLElementProvider}
 */
export class DOMElement implements IHTMLElementProvider {
    /**
     * Wraps an HTMLElement within a Blend.dom.Element for easy manipulation
     *
     * @export
     * @param {HTMLElement} el
     * @returns {Blend.dom.Element}
     */
    public static getElement(el: HTMLElement): DOMElement {
        return new DOMElement(el);
    }
    /**
     * Internal reference to the HTMLElement
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Element
     */
    protected el: HTMLElement;

    /**
     * Creates an instance of Element.
     * @param {(HTMLElement | string | ICreateElementConfig)} [el]
     * @memberof Element
     */
    public constructor(el?: HTMLElement | string | ICreateElementConfig) {
        const me = this;
        me.el = me.renderElement(el);
    }

    /**
     * Internal method that is used to parse and render the HTMLElement.
     *
     * @protected
     * @param {(HTMLElement | string | ICreateElementConfig)} [el]
     * @returns {HTMLElement}
     * @memberof DOMElement
     */
    protected renderElement(el?: HTMLElement | string | ICreateElementConfig): HTMLElement {
        const me = this;
        return Dom.createElement(
            Blend.isString(el) ? { tag: el as any } : Blend.isNullOrUndef(el) ? {} : (el as any),
            (ref: string, elem: HTMLElement) => {
                if (ref !== "..") {
                    (me as any)[ref] = elem;
                }
            }
        );
    }

    /**
     * Checks if the element is of a given type.
     *
     * @param {string} tag
     * @returns {boolean}
     * @memberof Element
     */
    public isTypeOf(tag: string): boolean {
        const me = this;
        return tag.toLowerCase() === me.el.tagName.toLowerCase();
    }

    /**
     * Checks if the element contains a given css class.
     *
     * @param {string} className
     * @returns {boolean}
     * @memberof Element
     */
    public hasClass(className: string): boolean {
        const me = this;
        if (me.el) {
            return me.el.classList.contains(className);
        } else {
            return false;
        }
    }

    /**
     * Renders this Element into a container HTMLElement.
     *
     * @param {HTMLElement} container
     * @memberof Element
     */
    public renderTo(container: HTMLElement) {
        if (container) {
            container.appendChild(this.el);
        }
    }

    /**
     * Sets one or more css classes to this Element
     * This function also accepts a dictionary.
     *
     * If the dictionary keys are camel/pascal case, they will be
     * converted to dashes and optionally prefixed with the `prefix`
     * parameter.
     *
     * The dictionary values can be:
     * - `true` which adds the css rule
     * - `false` which removes the css rule
     * - `null` or `undefined` which toggles the css rule
     * ```
     * For example:
     * var rules = {
     * 	fooBar:true,
     *  barBaz:false,
     *  nunChuck:null
     * }
     *
     * element.setCssClass(rules,'b')
     * ```
     *
     * Will result:
     * before:
     * `class="b-bar-baz"`
     * after:
     * `class="b-foo-bar b-nun-chuck"`
     *
     * @param {(string | Array<string>)} css
     * @memberof Element
     */
    public setCssClass(css: string | string[] | ICssClassDictionary, prefix?: string) {
        const me = this,
            selector = (key: string): string => {
                const parts = [prefix || "b"].concat((key.replace(/([A-Z])/g, " $1") || "").split(" "));
                parts.forEach((part: string, index: number) => {
                    parts[index] = part.trim().toLocaleLowerCase();
                });
                return parts.join("-").trim();
            };
        if (Blend.isObject(css)) {
            const rules: ICssClassDictionary = css as any;
            Blend.forEach(rules, (value: true | false | null | undefined, key: string) => {
                const sel = selector(key);
                if (value === true && !me.el.classList.contains(sel)) {
                    me.el.classList.add(sel);
                } else if (value === false) {
                    me.el.classList.remove(sel);
                } else if (value === null || value === undefined) {
                    if (me.el.classList.contains(sel)) {
                        me.el.classList.remove(sel);
                    } else {
                        me.el.classList.add(sel);
                    }
                }
            });
        } else {
            Blend.wrapInArray(css).forEach((item: string) => {
                if (!me.el.classList.contains(item)) {
                    me.el.classList.add(item);
                }
            });
        }
    }

    /**
     * Gets the size and the window location of this element.
     *
     * @returns {ClientRect}
     * @memberof Element
     */
    public getBounds(): ClientRect {
        return this.el.getBoundingClientRect();
    }

    /**
     * Returns a reference to the internal HTMLElement
     *
     * @returns {(HTMLElement | null)}
     * @memberof Element
     */
    public getElement<T extends HTMLElement>(): T | null {
        return this.el as T;
    }

    /**
     * Sets a reference key to be used internally for resolving event event targets
     *
     * @param {string} value
     * @returns {this}
     * @memberof Element
     */
    public setReference(value: string): this {
        this.setData("reference", value);
        return this;
    }

    /**
     * Utility method to check whether the element
     * has/is of a certain reference
     *
     * @param {string} value
     * @returns {boolean}
     * @memberof Element
     */
    public isReference(value: string): boolean {
        return this.getReference() === value;
    }

    /**
     * Utility method that is used for getting a parent element
     * should the current element's $reference have the value of '..'
     * This function is used in the event handling system.
     *
     * @returns {(Blend.dom.Element | null)}
     * @memberof Element
     */
    public getReferencedParent(): DOMElement | null {
        const me = this,
            ref = me.getReference();
        if (ref) {
            if (ref === ".." && me.el.parentElement) {
                return DOMElement.getElement(me.el.parentElement).getReferencedParent();
            } else {
                return DOMElement.getElement(me.el);
            }
        } else {
            return null;
        }
    }

    /**
     * Finds the first parent element containing the given class name
     * or the element itself with the class name.
     *
     * @param {string} cssClass
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     * @memberof Element
     */
    public findParentByClass(cssClass: string): HTMLElement {
        const me = this;
        let result: HTMLElement = null,
            search = me.el;
        while (search !== null) {
            if (search.classList.contains(cssClass)) {
                result = search;
                search = null;
            } else {
                search = search.parentElement;
            }
        }
        return result;
    }

    /**
     * Gets the event target reference key
     *
     * @returns {string}
     * @memberof Element
     */
    public getReference(): string {
        return this.getData<string>("reference");
    }

    /**
     * Gets an arbitrary data from the HTMLElement
     *
     * @template T
     * @param {string} key
     * @param {T} [defaultValue]
     * @returns {T}
     * @memberof Element
     */
    public getData<T>(key: string, defaultValue?: T): T {
        const me = this;
        if (me.el && me.el.$blend) {
            return me.el.$blend[key] || defaultValue;
        } else {
            return defaultValue;
        }
    }

    /**
     * Sets an arbitrary data to the HTMLElement
     *
     * @param {string} key
     * @param {*} value
     * @returns {this}
     * @memberof Element
     */
    public setData(key: string, value: any): this {
        const me = this;
        if (me.el) {
            if (!me.el.$blend) {
                me.el.$blend = {};
            }
            me.el.$blend[key] = value;
        }
        return this;
    }

    /**
     * Set a UID (unique component id) value for this element
     * which can be used to identify this element to a {{Blend.core.Component}}
     *
     * if no id is provided a automatic id will be generated for this element.
     *
     * @param {string} [id]
     * @returns {this}
     * @memberof Element
     */
    public setUID(id?: string): this {
        const me = this;
        me.setData(Component.KEY_UID, id || Blend.ID());
        return me;
    }

    /**
     * Gets the UID (unique component id) value that was previously set
     * on this element
     *
     * @returns {string}
     * @memberof Element
     */
    public getUID(): string {
        const me = this;
        return me.getData(Component.KEY_UID);
    }
}
