import { Blend } from "@blendsdk/core";
import { ICssFlattenProvider, IRenderedCSSRule, IStyleSet, TCssRenderer } from "./Types";

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
        this.selector = selector;
        this.composed = [];
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
     * One or more selectors that is used to make a composition style.
     * The final render would look like: `.this-selector , .compose1 , .compose2`
     *
     * @param {string} selector
     * @memberof CSSRule
     */
    public compose(selector: string | string[]): this {
        this.composed = this.composed.concat(Blend.wrapInArray(selector));
        return this;
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
                /**
                 * Convert the camelCase keys to real css keys: borderWidth => border-width
                 */
                key = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
                if (!Blend.isNullOrUndef(value)) {
                    styles.push(`${key}:${value}`);
                }
            });
            if (styles.length !== 0) {
                styles.push("");
            }
            return {
                css: `${me.renderSelector()} {${styles.join(";")}}`,
                selector: styles.length !== 0 ? me.selector : "" // skips the empty selectors
            };
        };
    }
}
