import { CSSRule } from "./CSSRule";
import { IStyleSet } from "./Types";

// tslint:disable-next-line:no-namespace
export namespace BEM {
    /**
     * Creates a CSS rule for a BEM modifier selector.
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
	export function modifier(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
		return new CSSRule(
			`--${selector}`,
			styles,
			(parent: string, current: string): string => {
				return `${parent}${current}`;
			}
		);
	}

    /**
     * Creates a CSS rule for a BEM element selector.
     *
     * @export
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @returns
     */
	export function element(selector: string, styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>) {
		return new CSSRule(
			`__${selector}`,
			styles,
			(parent: string, current: string): string => {
				return `${parent}${current}`;
			}
		);
	}

    /**
     * Creates a CSS rule for a BEM block selector.
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
