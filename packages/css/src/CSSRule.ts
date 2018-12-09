import { Blend } from "@blendsdk/core";
import {
	ICssFlattenProvider,
	IRenderedCSSRule,
	IStyleSet,
	TCssRenderer
	} from "./Types";

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
        this.selector = selector;
        this.styles = Blend.wrapInArray(styles || []);
        this.relHandler =
            relHandler ||
            ((parent: string, current: string) => {
                return current;
            });
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
     * Configure the parent to child relationship.
     *
     * @param {string} selector
     * @memberof CSSRule
     */
    public relateTo(selector: string) {
        this.selector = this.relHandler(selector, this.selector);
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
                /**
                 * Convert the camelCase keys to real css keys: borderWidth => border-width
                 */
                key = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
                if (!Blend.isNullOrUndef(value)) {
                    styles.push(`${key}:${value}`);
                }
            });
            styles.push("");
            return {
                css: `${me.selector} {${styles.join(";")}}`,
                selector: me.selector
            };
        };
    }
}
