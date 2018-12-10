import { Blend } from "@blendsdk/core";
import { CSSRule } from "./CSSRule";
import { IRenderedCSSRule } from "./Types";

/**
 * This class represents a style sheet capable of handling
 * CSSRule objects. An instance of a Sheet needs to be fed to
 * the StyleSheets global object to be rendered and attached to the browser DOM.
 *
 * @export
 * @class Sheet
 */
export class Sheet {
    protected rules: CSSRule[];

    /**
     * Creates an instance of Sheet.
     * @param {(CSSRule | CSSRule[])} rules
     * @memberof Sheet
     */
    public constructor(rules: CSSRule | CSSRule[]) {
        this.rules = Blend.wrapInArray(rules);
    }

    /**
     * Adds one or more rules to this Sheet
     *
     * @param {(CSSRule | CSSRule[])} rule
     * @memberof Sheet
     */
    public addRule(rule: CSSRule | CSSRule[]) {
        const me = this;
        me.rules = me.rules.concat(Blend.wrapInArray(rule));
    }

    /**
     * Renders the rules within in Sheet to an array of
     * `IRenderedCSSRule`
     *
     * @returns {IRenderedCSSRule[]}
     * @memberof Sheet
     */
    public render(): IRenderedCSSRule[] {
        const me = this;
        let rules: IRenderedCSSRule[] = [];

        me.rules.forEach(rule => {
            rule.flatten().forEach(renderer => {
                rules = rules.concat(renderer());
            });
        });
        return rules;
    }
}
