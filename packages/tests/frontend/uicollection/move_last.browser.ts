import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Assets } from "./Assets";

export default function (t: IAssertionProvider) {
	Browser.ready(() => {
		const list = new Assets.ui.List();
		list.strAdd("ABCDEFG");

		document.body.appendChild(list);
		list.performLayout();
		Blend.raf(() => {
			t.assertEqual(list.getAt(1).getCaption(), "B");
			Blend.raf(() => {
				list.moveLast(list.getAt(1));
				Blend.raf(() => {
					t.assertEqual(list.getText(), "ACDEFGB");
					Blend.raf(() => {
						t.done();
					});
				});
			});
		});
	});
}
