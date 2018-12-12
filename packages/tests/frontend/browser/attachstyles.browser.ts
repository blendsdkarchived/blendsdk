import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { CSS, stylesheet } from "@blendsdk/css";
import { Dom } from "@blendsdk/dom";

export default function(t: IAssertionProvider) {
    const sheet = stylesheet(
        CSS.block(".big", {
            fontSize: "128px"
        })
    );
    Browser.attachStyleSheet(sheet);

    Browser.ready(() => {
        const el = Dom.createElement({
            css: "big",
            textContent: "Big Text"
        });

        document.body.appendChild(el);
        t.delay(100, () => {
            const values = window.getComputedStyle(el);
            t.assertEqual(values.fontSize, "128px");
            t.done();
        });
    }).start();
}
