import { IAssertionProvider } from '@blendsdk/blendrunner';
import { ICssClass, TCssClass, Dom, CssClass } from '@blendsdk/dom';
import { Blend } from '@blendsdk/core';

interface IADDCssClass extends ICssClass<IADDCssClass> {
    ruleA: TCssClass<IADDCssClass>;
    ruleB: TCssClass<IADDCssClass>;
    ruleX: TCssClass<IADDCssClass>;
    ruleY: TCssClass<IADDCssClass>;
}

export default function(t: IAssertionProvider) {
    var el = Dom.createElement({
        css: ['b-rule1', 'b-rule2']
    });

    var ruleset: IADDCssClass = CssClass.create(['b-rule-a', 'rule-b'], el);

    document.body.appendChild(el);

    Blend.raf(function() {
        ruleset.ruleA(true);
        ruleset.ruleB(true);

        ruleset.addRule(['b-rule-x', 'b-rule-y']);
        ruleset.serialize();

        ruleset.ruleX();
        ruleset.ruleY();

        ruleset.serialize();

        t.assertEqual(el.getAttribute('class'), 'b-rule1 b-rule2 b-rule-a rule-b b-rule-x b-rule-y');
        t.done();
    });
}
