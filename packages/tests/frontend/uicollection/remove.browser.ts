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
				list.remove(list.getAt(1));
				Blend.raf(() => {
					t.assertEqual(list.getText(), "ACDE");
					Blend.raf(() => {
						list.remove(list.getFirst());
						Blend.raf(() => {
							t.assertEqual(list.getText(), "CDE");
							Blend.raf(() => {
								list.remove(list.getLast());
								Blend.raf(() => {
									t.assertEqual(list.getText(), "CD");
									Blend.raf(() => {
										list.remove(list.getFirst());
										Blend.raf(() => {
											t.assertEqual(list.getText(), "D");
											Blend.raf(() => {
												t.done();
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}
