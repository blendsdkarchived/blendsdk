import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { CssClass, Dom } from "@blendsdk/dom";

export default function (t: IAssertionProvider) {
	const el = Dom.createElement({
		css: ["b-rule1", "b-rule2"]
	});

	const ruleSet = CssClass.create([], el);

	document.body.appendChild(el);

	Blend.raf(() => {
		ruleSet.serialize();
		t.assertEqual(el.getAttribute("class"), "b-rule1 b-rule2");
		t.done();
	});
}
