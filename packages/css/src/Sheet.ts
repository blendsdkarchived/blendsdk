import { Blend } from "@blendsdk/core";
import { CSSRule } from "./CSSRule";
import { IRenderedCSSRule } from "./Types";

export class Sheet {
    protected rules: CSSRule[];

    public constructor(rules: CSSRule | CSSRule[]) {
        this.rules = Blend.wrapInArray(rules);
    }

    public addRule(rule: CSSRule | CSSRule[]) {
        const me = this;
        me.rules = me.rules.concat(Blend.wrapInArray(rule));
    }

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
