import { Blend } from "@blendsdk/core";
import { HTML_TAGS } from "./Tags";
import { ICssFlattenProvider, IRenderedCSSRule, IStyleSet, TCssRenderer } from "./Types";

const atStartRe = new RegExp("^(\\[|\\.|_+|-+|:+|@|\\[|\\*)", "gmi");
const tagRe = new RegExp(
	Object.keys(HTML_TAGS)
		.map(t => {
			return "\\b" + t + "\\b";
		})
		.join("|"),
	"gmi"
);

/**
 * CSSRule provides a tree like structure optionally representing
 * nested css rules.
 *
 * The tree structure gets flattened upon rendering so it can be added as
 * css content to the browser DOM.
 *
 * @export
 * @class CSSRule
 * @implements {ICssFlattenProvider}
 */
export class CSSRule implements ICssFlattenProvider {
    /**
     * Contains the provided selector.
     *
     * @protected
     * @type {string}
     * @memberof CSSRule
     */
	protected selector: string;
    /**
     * Collection of css styles configured for in this class.
     *
     * @protected
     * @type {(Array<IStyleSet | CSSRule>)}
     * @memberof CSSRule
     */
	protected styles: Array<IStyleSet | CSSRule>;
    /**
     * Handler for parent to child relationship.
     *
     * @protected
     * @memberof CSSRule
     */
	protected relHandler: (parent: string, current: string) => string;
    /**
     * List of composed selectors to be added in the final render.
     *
     * @protected
     * @type {string[]}
     * @memberof CSSRule
     */
	protected composed: string[];

    /**
     * Creates an instance of CSSRule.
     * @param {string} selector
     * @param {(IStyleSet | CSSRule | Array<IStyleSet | CSSRule>)} styles
     * @param {(parent: string, current: string) => string} [relHandler]
     * @memberof CSSRule
     */
	constructor(
		selector: string,
		styles: IStyleSet | CSSRule | Array<IStyleSet | CSSRule>,
		relHandler?: (parent: string, current: string) => string
	) {
		const me = this;
		me.selector = me.parseSelector(selector);
		me.composed = [];
		me.styles = Blend.wrapInArray(styles || []);
		me.relHandler =
			relHandler ||
			((parent: string, current: string) => {
				return current;
			});
	}

    /**
     * Try to automatically parse and prefix the selector with a dot (.)
     *
     * @protected
     * @param {string} selector
     * @returns
     * @memberof CSSRule
     */
	protected parseSelector(selector: string) {
		const me = this,
			hasDash = selector.indexOf("-") !== -1,
			sel = selector.trim();

		atStartRe.lastIndex = 0;
		tagRe.lastIndex = 0;

		if (atStartRe.test(sel) && sel !== "__screeninfo__") {
			return sel;
		} else if (tagRe.test(sel) && !hasDash) {
			return sel;
		} else {
			return `.${sel}`;
		}
	}

    /**
     * Flattens the recursive structure of the CSSRule of a single array
     * containing renderer functions. These function can be invoked to generate
     * the actual css content which can be processed further into the browser
     * DOM structure.
     *
     * @returns {Array<TCssRenderer>}
     * @memberof CSSRule
     */
	public flatten(): TCssRenderer[] {
		const me = this;
		let result: TCssRenderer[] = [];
		let styles: IStyleSet = {};
		me.styles.forEach(item => {
			if ((item as ICssFlattenProvider).flatten) {
				item.relateTo(me.selector);
				result = result.concat(item.flatten());
			} else {
				styles = Blend.apply(styles, item);
			}
		});
		return ([me.createRenderer(styles)] as TCssRenderer[]).concat(result);
	}

    /**
     * One or more selectors that is used to make a composition style.
     * The final render would look like: `.this-selector , .compose1 , .compose2`
     *
     * @param {string} selector
     * @memberof CSSRule
     */
	public compose(selector: string | string[]): this {
		const me = this;
		me.composed = this.composed.concat(
			Blend.wrapInArray<string>(selector).map(s => {
				return (a => {
					return me.parseSelector(a);
				})(s);
			})
		);
		return me;
	}

    /**
     * Configure the parent to child relationship.
     *
     * @param {string} selector
     * @memberof CSSRule
     */
	public relateTo(selector: string) {
		this.selector = this.relHandler(selector, this.selector);
	}

    /**
     * Renders the composed selector.
     *
     * @protected
     * @returns {string}
     * @memberof CSSRule
     */
	protected renderSelector(): string {
		const me = this,
			res = [me.selector].concat(me.composed);
		return res.join(",");
	}

    /**
     * Creates a TCssRenderer function.
     *
     * @protected
     * @param {IStyleSet} result
     * @returns {TCssRenderer}
     * @memberof CSSRule
     */
	protected createRenderer(result: IStyleSet): TCssRenderer {
		const me = this;
		return (): IRenderedCSSRule => {
			const styles = [];
			Blend.forEach(result, (value: any, key: string) => {
				if (key === "rawContent") {
					styles.push(value);
				} else {
					const k = Blend.dashedCase(key);
					if (Blend.isArray(value)) {
						switch (k) {
							case "content":
								(value as string[]).forEach(v => {
									styles.push(`${k}:${v};`);
								});
								break;
							default:
								styles.push(`${k}:${value.join(", ")};`);
						}
					} else {
						if (!Blend.isNullOrUndef(value)) {
							styles.push(`${k}:${value};`);
						}
					}
				}
			});
			return {
				css: `${me.renderSelector()} {${styles.join("")}}`,
				selector: styles.length !== 0 ? me.selector : "" // skips the empty selectors
			};
		};
	}
}
