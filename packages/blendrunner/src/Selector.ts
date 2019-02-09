import { ISheetProvider, Sheet } from "./CSS";
import { ICSSStyles } from "./CSSStyles";

/**
 * This class represents a CSS selector.
 *
 * @class Selector
 */
export class Selector {
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
        const me = this;
        me.selector = selector;
        me.sheet = sheet;
        me.styles = styles || {};
        ((sheet as any) as ISheetProvider).addSelector(me);
    }
    /**
     * Renders the selector into a string.
     *
     * @returns {string}
     * @memberof Selector
     */
    public render(): string {
        const me = this,
            result: string[] = [];
        // tslint:disable-next-line:forin
        for (const key in me.styles) {
            const rule = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
            const value = me.sheet.get(me.styles[key]);
            result.push(`${rule}:${value}`);
        }
        return `${me.selector}{${result.join(";")}}`;
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
        const me = this;
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
        const me = this;
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
        const me = this;
        return new Selector(`${me.selector}${selector}`, me.sheet, styles);
    }
}
