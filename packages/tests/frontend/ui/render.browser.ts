import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Assets } from "./Assets";

export default function (t: IAssertionProvider) {
	document.body.appendChild(new Assets.RenderOnly());
	t.delay(150, () => {
		t.assertEqual(Array.from(document.querySelectorAll(".ui-render-only")).length, 1);
		t.done();
	});
}
