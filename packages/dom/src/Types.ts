import { IDictionary } from "@blendsdk/core";

/**
 * Interface for configuring an object that can be converted to a css class attribute
 *
 * @interface ICssRuleDictionary
 */
export interface ICssClassDictionary {
    [selector: string]: true | false | null | undefined;
}

/**
 * Interface for implementing a component that can provide a
 * HTMLElement
 *
 * @export
 * @interface IHTMLElementProvider
 */
export interface IHTMLElementProvider {
    getElement(): HTMLElement;
}

/**
 * Extension interface for adding extra functionality
 * to the native HTMLElement element.
 *
 * @interface HTMLElement
 */
export interface HTMLElement {
    /**
     * @internal
     * Internal property used to hold arbitrary data
     */
    $blend: IDictionary;
}

/**
 * Interface for passing element creation configuration to
 *  the `Blend.com.createElement`
 *
 * @interface ICreateElementConfig
 */
export interface ICreateElementConfig {
    /**
     * The tagName of the element. Defaults to `DIV` if not provided.
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    tag?: string;
    /**
     * The id if the element .
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    id?: string;
    /**
     * The reference id of the element .
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    reference?: string;
    /**
     * The text content (innerText) of the element .
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    textContent?: string;
    /**
     * Utility method for adding, removing, and toggling CSS
     * classes on an HTMLElement.
     *
     * The `rules` parameter is a dictionary. Its keys are translated to
     * CSS rules and the values are translates to:
     *
     * `true` for adding the CSS rule
     * `false` for removing the CSS rule
     * `null` to toggle a rule (remove is exists, add if not exists)
     *
     * If a `prefix` is provided the the keys are going to be prefixed as:
     * `prefix + '-' + key`
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    htmlContent?: string;
    /**
     * The css class(es) of the element.
     *
     * @type {(string | Array<string>)}
     * @memberof ICreateElementConfig
     */
    css?: string | string[];
    /**
     * The inline styles of the element.
     *
     * @type {ICssInlineStyleRules}
     * @memberOf ICreateElementConfig
     */
    style?: IDictionary;
    /**
     * The data attributes of the element.
     *
     * @type {{
     *         [key: string]: any;
     *     }}
     * @memberOf ICreateElementConfig
     */
    data?: {
        [key: string]: any;
    };
    /**
     * The attributes of the element.
     *
     * @type {{
     *         [key: string]: any;
     *     }}
     * @memberOf ICreateElementConfig
     */
    attrs?: {
        [key: string]: any;
    };
    /**
     * The element listeners of the element.
     *
     *
     * @memberOf ICreateElementConfig
     */
    listeners?: {
        [name: string]: EventListenerOrEventListenerObject;
    };
    /**
     * The children of the element. The `children` property
     * either accepts a single item or an array of items.
     * You also can provide a function returning an array of ICreateElementConfig
     *
     * @type {(UICollection<any>
     *         | string
     *         | ICreateElementConfig
     *         | HTMLElement
     *         | Blend.ui.Component
     *         | Array<Blend.ui.Collection<any> | string | ICreateElementConfig | HTMLElement | Blend.ui.Component>)}
     * @memberof ICreateElementConfig
     */
    children?:
        | string
        | ICreateElementConfig
        | HTMLElement
        | IHTMLElementProvider
        | Array<string | ICreateElementConfig | HTMLElement | IHTMLElementProvider>;
    /**
     * Indicates whether this configuration is an svg element
     *
     * @type {boolean}
     * @memberof ICreateElementConfig
     */
    isSVG?: boolean;
}
