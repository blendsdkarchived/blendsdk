import { Blend } from "@blendsdk/core";
import { CSSRule } from "./CSSRule";
import { Sheet } from "./Sheet";
import { IStyleSet } from "./Types";

/**
 * Interface for describing a CSS transition
 *
 * @export
 * @interface ICSSTransition
 */
export interface ICSSTransition {
    property?: string;
    durationInSeconds?: number;
    animationFunction?: string;
    animationTimeout?: number;
}

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

    /**
     * Creates a `@media query` CSS rule.
     *
     * @export
     * @param {string} query
     * @param {(CSSRule | CSSRule[])} rules
     * @returns
     */
    export function mediaQuery(query: string, rules: CSSRule | CSSRule[]) {
        const sheet = stylesheet(rules),
            content: string[] = [];
        sheet.render().forEach(item => {
            if (item.selector !== "") {
                content.push(item.css);
            }
        });
        return block(`@media ${query}`, { rawContent: content.join("\n") });
    }

    /**
     * Creates one or more transition animation.
     *
     * @export
     * @param {(ICSSTransition | ICSSTransition[])} value
     * @returns {IStyleSet}
     */
    export function transition(value: ICSSTransition | ICSSTransition[]): IStyleSet {
        const values = Blend.wrapInArray<ICSSTransition>(value),
            css: string[] = [];
        values.forEach(item => {
            if (value) {
                css.push(
                    `${item.property || "all"}  ${item.durationInSeconds || 0}s ${item.animationFunction ||
                        "linear"} ${item.animationTimeout || 0}s`
                );
            }
        });
        if (values.length !== 0) {
            return {
                transition: css.join(", ")
            };
        } else {
            return {};
        }
    }

    /**
     * Creates an entry transition animation.
     *
     * @export
     * @param {ICSSTransition} value
     * @returns {ICSSTransition}
     */
    export function animationEnterTransition(value: ICSSTransition): ICSSTransition {
        value = value || {};
        value.animationFunction = "cubic-bezier(0, 0, .2, 1)";
        return value;
    }

    /**
     * Creates an exit transition animation.
     *
     * @export
     * @param {ICSSTransition} value
     * @returns {ICSSTransition}
     */
    export function animationExitTemporary(value: ICSSTransition): ICSSTransition {
        value = value || {};
        value.animationFunction = "cubic-bezier(.4, 0, .6, 1)";
        return value;
    }

    /**
     * CSS Rules to fit the element into its parent element.
     *
     * @export
     * @param {boolean} [absolute]
     * @param {boolean} [stretch]
     * @returns {IStyleSet}
     */
    export function makeFit(absolute?: boolean, stretch?: boolean): IStyleSet {
        const size: string = stretch === false ? null : "100%";
        return {
            position: absolute === false ? null : "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: size,
            height: size
        };
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
