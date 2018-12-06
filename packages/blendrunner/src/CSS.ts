import { ICSSStyles } from './CSSStyles';

/**
 * Interface that is used to call the protected
 * methods of the Sheet class
 *
 * @interface IAddSelector
 */
interface ISheetProvider {
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
    protected selectors: Array<Selector>;
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
        var me = this;
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
        var me = this;
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
        var me = this;
        return me.variables[variable] || variable;
    }

    /**
     * Adds a selector to the list of selectors in this Sheet
     *
     * @protected
     * @param {Selector} selector
     * @memberof Sheet
     */
    protected addSelector(selector: Selector) {
        var me = this;
        me.selectors.push(selector);
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
        var me = this;
        return new Selector(selector, me, styles);
    }

    /**
     * Renders the sheet into a `STYLE` tag
     *
     * @memberof Sheet
     */
    public render() {
        var me = this,
            rules: Array<string> = [];
        me.selectors.forEach((sel: Selector) => {
            rules.push(sel.render());
        });
        var styleEl = document.createElement('STYLE');
        styleEl.innerHTML = rules.join('');
        document.head.appendChild(styleEl);
    }
}

/**
 * This class represents a CSS selector.
 *
 * @class Selector
 */
class Selector {
    /**
     * The CSS selector key
     *
     * @protected
     * @type {string}
     * @memberof Selector
     */
    protected selector: string;
    /**
     * Reference to the parent Sheet
     *
     * @protected
     * @type {Sheet}
     * @memberof Selector
     */
    protected sheet: Sheet;
    /**
     * A dictionary of the CSS styles.
     *
     * @protected
     * @type {ICSSStyles}
     * @memberof Selector
     */
    protected styles: ICSSStyles;

    /**
     * Creates an instance of Selector.
     * @param {string} selector
     * @param {Sheet} sheet
     * @param {ICSSStyles} [styles]
     * @memberof Selector
     */
    public constructor(selector: string, sheet: Sheet, styles?: ICSSStyles) {
        var me = this;
        me.selector = selector;
        me.sheet = sheet;
        me.styles = styles || {};
        (<ISheetProvider>(<any>sheet)).addSelector(me);
    }
    /**
     * Renders the selector into a string.
     *
     * @returns {string}
     * @memberof Selector
     */
    public render(): string {
        var me = this,
            result: Array<string> = [];
        for (var key in me.styles) {
            var rule = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
            var value = me.sheet.get(me.styles[key]);
            result.push(`${rule}:${value}`);
        }
        return `${me.selector}{${result.join(';')}}`;
    }

    /**
     * Creates a child selector `.parent > .child`
     *
     * @param {string} selector
     * @param {ICSSStyles} [styles]
     * @returns {Selector}
     * @memberof Selector
     */
    public child(selector: string, styles?: ICSSStyles): Selector {
        var me = this;
        return new Selector(`${me.selector} > ${selector}`, me.sheet, styles);
    }

    /**
     * Creates a nested selector `.parent .nested`
     *
     * @param {string} selector
     * @param {ICSSStyles} [styles]
     * @returns {Selector}
     * @memberof Selector
     */
    public nest(selector: string, styles?: ICSSStyles): Selector {
        var me = this;
        return new Selector(`${me.selector} ${selector}`, me.sheet, styles);
    }

    /**
     * Creates a complemented selector `.selector1.selector2`
     *
     * @param {string} selector
     * @param {ICSSStyles} [styles]
     * @returns {Selector}
     * @memberof Selector
     */
    public and(selector: string, styles?: ICSSStyles): Selector {
        var me = this;
        return new Selector(`${me.selector}${selector}`, me.sheet, styles);
    }
}
