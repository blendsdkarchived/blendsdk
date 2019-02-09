import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { CssClass, Dom, ICssClass, TCssClass } from "@blendsdk/dom";

interface ITestCssClass extends ICssClass<ITestCssClass> {
    ruleA: TCssClass<ITestCssClass>;
    ruleB: TCssClass<ITestCssClass>;
}

export default function(t: IAssertionProvider) {
    const el = Dom.createElement({
        css: ["b-rule1", "b-rule2"]
    });

    const ruleSet: ITestCssClass = CssClass.create(["b-rule-a", "rule-b"], el);

    document.body.appendChild(el);

    Blend.raf(() => {
        ruleSet.ruleA(true);
        ruleSet.ruleB(true);
        ruleSet.serialize();
        t.assertEqual(el.getAttribute("class"), "b-rule1 b-rule2 b-rule-a rule-b");
        t.done();
    });
}
