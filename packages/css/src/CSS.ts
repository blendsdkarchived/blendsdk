import { Blend } from "@blendsdk/core";
import { CSSRule } from "./CSSRule";
import { Sheet } from "./Sheet";
import { IStyleSet } from "./Types";

/**
 * Option for configuring animationFunction of a
 * CSS transition animation.
 *
 * @export
 * @enum {number}
 */
export enum eTransitionFunction {
    StandardEasing = "cubic-bezier(0.4, 0.0, 0.2, 1)",
    DecelerateEasing = "cubic-bezier(0.0, 0.0, 0.2, 1)",
    AccelerateEasing = "cubic-bezier(0.4, 0.0, 1, 1)"
}

/**
 * Interface for describing a CSS transition
 *
 * @export
 * @interface ICSSTransition
 */
export interface ICSSTransition {
    /**
     * The property that is going to be animated.
     *
     * @type {string}
     * @memberof ICSSTransition
     */
    property?: string;
    /**
     * Duration in seconds.
     *
     * @type {number}
     * @memberof ICSSTransition
     */
    durationInSeconds?: number;
    /**
     * The animation function.
     *
     * @type {(string | eTransitionFunction)}
     * @memberof ICSSTransition
     */
    animationFunction?: string | eTransitionFunction;
    /**
     * Animation start timeout.
     *
     * @type {number}
     * @memberof ICSSTransition
     */
    animationTimeout?: number;
}

/**
 * Interface for creating a `transform` CSS rule
 *
 * @interface ICSSTransformation
 */
interface ICSSTransformation {
    scale?: any;
    translate?: any;
    translateX?: any;
    translateY?: any;
    translateZ?: any;
    [key: string]: any;
}

// tslint:disable-next-line:no-namespace
export namespace CSS {
    /**
     * Returns a calculated letter-spacing value
     *
     * @export
     * @param {number} tracking
     * @param {number} fontSize
     * @returns {string}
     */
    export function letterSpacing(tracking: number, fontSize: number): string {
        const t = tracking / (fontSize * Blend.BASE_FONT_SIZE);
        return `${Math.round(t * 1000) / 1000}em`;
    }

    /**
     * CSS rules to make an element selectable.
     *
     * @export
     * @param {(boolean | any)} value
     * @returns {IStyleSet}
     */
    export function selectable(value: boolean | any): IStyleSet {
        value = value === false ? "none" : value;
        return {
            "-webkit-user-select": value,
            "-moz-user-select": value,
            "-ms-user-select": value,
            "user-select": value
        };
    }

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
     * Creates a CSS rule representing a `(.b-disabled) selector`
     *
     * @export
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function andDisabled(styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return and(".b-disabled", styles);
    }

    /**
     * Creates a CSS rule representing a `:not(.b-disabled) selector`
     *
     * @export
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function notDisabled(styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return andNot("b-disabled", styles);
    }

    /**
     * Creates a CSS rule representing a `:not() selector`
     *
     * @export
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
    export function andNot(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return and(`:not(.${selector})`, styles);
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
     * Creates a CSS rules representing `::hover`
     *
     * @export
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     */
    export function hover(styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
        return and(":hover", styles);
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
     * Creates a CSS transformation rule
     *
     * @export
     * @param {ICSSTransformation} transformation
     * @returns {IStyleSet}
     */
    export function transform(transformation: ICSSTransformation): IStyleSet {
        const v: string[] = [];
        Blend.forEach(transformation, (value: string, key: string) => {
            v.push(`${key}(${value})`);
        });
        return {
            transform: v.join(" ")
        };
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
    export function animationEnter(value: ICSSTransition): ICSSTransition {
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
    export function animationExit(value: ICSSTransition): ICSSTransition {
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
