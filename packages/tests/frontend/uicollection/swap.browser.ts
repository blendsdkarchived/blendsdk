import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Assets } from "./Assets";

export default function (t: IAssertionProvider) {
	Browser.ready(() => {
		const list = new Assets.ui.List();
		document.body.appendChild(list);
		list.performLayout();
		Blend.raf(() => {
			list.strAdd("ABCDE");
			Blend.raf(() => {
				list.swap(list.getAt(1), list.getAt(-2));
				Blend.raf(() => {
					t.assertEqual(list.getText(), "ADCBE");
					t.done();
				});
			});
		});
	});
}
