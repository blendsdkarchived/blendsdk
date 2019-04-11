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
			list.strFilter("BDFG");
			Blend.raf(() => {
				t.assertEqual(list.getAt(1).getCaption(), "D", "The D");
				Blend.raf(() => {
					list.moveTo(-1, list.getAt(1));
					t.assertEqual(list.getText(), "BFDG", "The BFDG");
					list.clearFilter();
					Blend.raf(() => {
						t.assertEqual(list.getText(), "ABCEFDG", "The All");
						t.done();
					});
				});
			});
		});
	});
}
