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
			list.strFilter("BCF");
			Blend.raf(() => {
				list.swap(list.getFirst(), list.getLast());
				Blend.raf(() => {
					t.assertEqual(list.getText(), "FCB");
					Blend.raf(() => {
						list.clearFilter();
						Blend.raf(() => {
							t.assertEqual(list.getText(), "AFCDEBG");
							Blend.raf(() => {
								t.done();
							});
						});
					});
				});
			});
		});
	});
}
