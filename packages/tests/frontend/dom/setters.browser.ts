import { IAssertionProvider } from '@blendsdk/blendrunner';
import { CssClass, TCssClass, Dom, ICssClass } from '@blendsdk/dom';
import { Blend } from '@blendsdk/core';

interface ITestCssClass extends ICssClass<ITestCssClass> {
    ruleA: TCssClass<ITestCssClass>;
    ruleB: TCssClass<ITestCssClass>;
}

export default function(t: IAssertionProvider) {
    var el = Dom.createElement({
        css: ['b-rule1', 'b-rule2']
    });

    var ruleSet: ITestCssClass = CssClass.create(['b-rule-a', 'rule-b'], el);

    document.body.appendChild(el);

    Blend.raf(function() {
        ruleSet.ruleA(true);
        ruleSet.ruleB(true);
        ruleSet.serialize();
        t.assertEqual(el.getAttribute('class'), 'b-rule1 b-rule2 b-rule-a rule-b');
        t.done();
    });
}
