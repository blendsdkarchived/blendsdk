import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Placeholder } from "@blendsdk/ui";
import { Assets } from "./Assets";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        const list = new Assets.ui.List({
            items: [
                new Placeholder({ caption: "X" }),
                new Placeholder({ caption: "Y" }),
                new Placeholder({ caption: "Z" })
            ]
        });

        document.body.appendChild(list);
        list.performLayout();
        Blend.raf(() => {
            t.assertEqual(list.getText(), "XYZ");
            list.insertAt(0, new Placeholder({ caption: "#" }));
            Blend.raf(() => {
                t.assertEqual(list.getText(), "#XYZ");
                Blend.raf(() => {
                    t.done();
                });
            });
        });
    });
}
