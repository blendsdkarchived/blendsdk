import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Placeholder } from "@blendsdk/ui";
import { Assets } from "./Assets";

export default function (t: IAssertionProvider) {
	Browser.ready(() => {
		const list = new Assets.ui.List();
		list.strAdd("ABCDE");

		document.body.appendChild(list);
		list.performLayout();
		Blend.raf(() => {
			Blend.raf(() => {
				list.insertAt(100, new Placeholder({ caption: "X" }));
				Blend.raf(() => {
					t.assertEqual(list.getText(), "ABCDEX");
					Blend.raf(() => {
						t.done();
					});
				});
			});
		});
	});
}
