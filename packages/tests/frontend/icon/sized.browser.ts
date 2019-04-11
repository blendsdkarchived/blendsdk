import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { ImageIcon } from "@blendsdk/icon";

export default function (t: IAssertionProvider) {
	Browser.ready(() => {
		const icon = new ImageIcon({
			src: "/assets/metro-mouse.png",
			round: true,
			size: 48
		}).getElement();

		document.body.append(icon);

		Blend.raf(() => {
			t.assertImage(icon, "/assets/icon/sized.png", t.done);
		});
	});
}
