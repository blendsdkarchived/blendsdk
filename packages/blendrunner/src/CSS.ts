// tslint:disable-next-line:max-classes-per-file

import { ICSSStyles } from "./CSSStyles";
import { Selector } from "./Selector";

/**
 * Interface that is used to call the protected
 * methods of the Sheet class
 *
 * @interface IAddSelector
 */
export interface ISheetProvider {
    addSelector(selector: Selector): any;
}

/**
 * Interface for declaring variables of a Sheet
 *
 * @export
 * @interface ISheetVariables
 */
export interface ISheetVariables {
    [name: string]: any;
}

/**
 * This class Represents a stylesheet `<STYLE></STYLE>`
 *
 * @export
 * @class Sheet
 */
export class Sheet {
    /**
     * Array of selectors in this Sheet
     *
     * @protected
     * @type {Array<Selector>}
     * @memberof Sheet
     */
    protected selectors: Selector[];
    /**
     * A dictionary of variables of this Sheet.
     *
     * @protected
     * @type {ISheetVariables}
     * @memberof Sheet
     */
    protected variables: ISheetVariables;

    /**
     * Creates an instance of Sheet.
     * @memberof Sheet
     */
    public constructor(variables?: ISheetVariables) {
        const me = this;
        me.selectors = [];
        me.variables = variables || {};
    }

    /**
     * Set variable on this Sheet.
     *
     * @param {string} variable
     * @param {*} value
     * @memberof Sheet
     */
    public set(variable: string, value: any) {
        const me = this;
        me.variables[variable] = value;
    }

    /**
     * Get the value of a variable from this Sheet.
     * If the variable is not defined then the requested
     * key is returned as value.
     *
     * @param {string} variable
     * @returns {*}
     * @memberof Sheet
     */
    public get(variable: string): any {
        const me = this;
        return me.variables[variable] || variable;
    }

    /**
     * Adds a selector to this Sheet
     *
     * @param {string} selector
     * @param {ICSSStyles} styles
     * @returns {Selector}
     * @memberof Sheet
     */
    public rule(selector: string, styles?: ICSSStyles): Selector {
        const me = this;
        return new Selector(selector, me, styles);
    }

    /**
     * Renders the sheet into a `STYLE` tag
     *
     * @memberof Sheet
     */
    public render() {
        const me = this,
            rules: string[] = [];
        me.selectors.forEach((sel: Selector) => {
            rules.push(sel.render());
        });
        const styleEl = document.createElement("STYLE");
        styleEl.innerHTML = rules.join("");
        document.head.appendChild(styleEl);
    }

    /**
     * Adds a selector to the list of selectors in this Sheet
     *
     * @protected
     * @param {Selector} selector
     * @memberof Sheet
     */
    protected addSelector(selector: Selector) {
        const me = this;
        me.selectors.push(selector);
    }
}
