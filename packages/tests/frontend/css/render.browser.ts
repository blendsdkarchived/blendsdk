import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { CSS, stylesheet, StyleSheets } from "@blendsdk/css";
import { Dom } from "@blendsdk/dom";

export default function(t: IAssertionProvider) {
    const sheet = stylesheet([
            CSS.block("component", {
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "200px",
                height: "200px",
                backgroundColor: "cyan"
            })
        ]),
        el = Dom.createElement({
            css: "component"
        });

    Blend.delay(100, () => {
        StyleSheets.attach(sheet);
        document.body.appendChild(el);
        Blend.delay(100, () => {
            const rect = el.getBoundingClientRect();
            const styles = window.getComputedStyle(el);
            t.assertEqual(rect.top, 10, "top");
            t.assertEqual(rect.left, 10, "left");
            t.assertEqual(rect.width, 200, "width");
            t.assertEqual(rect.height, 200, "height");
            t.assertEqual(styles.backgroundColor.toString().replace(/\s/gi, ""), "rgb(0,255,255)");
            t.done();
        });
    });
}
