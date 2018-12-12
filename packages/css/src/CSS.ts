import { CSSRule } from "./CSSRule";
import { Sheet } from "./Sheet";
import { IStyleSet } from "./Types";

// tslint:disable-next-line:no-namespace
export namespace CSS {
    /**
     * Creates a CSS rules representing a selector that is preceded by
     * its parent selector.
     *
     * For example `.A ~ .B`
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function precededBy(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return new CSSRule(selector, styles, (parent: string, current: string) => {
            return `${parent} ~ ${current}`;
        });
    }

    /**
     * Creates a CSS rules representing a selector that is placed immediately after
     * its parent selector.
     *
     * For example `.A + .B`
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function immediatelyAfter(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return new CSSRule(selector, styles, (parent: string, current: string) => {
            return `${parent} + ${current}`;
        });
    }

    /**
     * Creates a CSS rules representing `::before`
     *
     * @export
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     */
    export function before(styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return and("::before", styles);
    }

    /**
     * Creates a CSS rules representing `::after`
     *
     * @export
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     */
    export function after(styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return and("::after", styles);
    }

    /**
     * Creates a CSS rules representing a composed selector.
     * For example `.A.B`
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function and(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return new CSSRule(selector, styles, (parent: string, current: string) => {
            return `${parent}${current}`;
        });
    }

    /**
     * Creates a CSS rules representing a child selector.
     * For example `.A > .B`
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function child(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return new CSSRule(selector, styles, (parent: string, current: string) => {
            return `${parent} > ${current}`;
        });
    }

    /**
     * Creates a CSS rules representing a nested selector.
     * For example: `.A .B`
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function nest(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return new CSSRule(selector, styles, (parent: string, current: string) => {
            return `${parent} ${current}`;
        });
    }

    /**
     * Creates a CSS rule for a block level element or a selector.
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function block(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return new CSSRule(selector, styles);
    }
}

/**
 * Creates a Sheet object containing one or more css rules.
 *
 * @export
 * @param {(Sheet | Sheet[])} sheet
 * @param {(CSSRule | CSSRule[])} rules
 * @returns
 */
export function stylesheet(rules: CSSRule | CSSRule[]) {
    return new Sheet(rules);
}
