import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Placeholder } from "@blendsdk/ui";
import { Assets } from "./Assets";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        const list = new Assets.ui.List();
        document.body.appendChild(list);
        list.performLayout();
        Blend.raf(() => {
            list.strAdd("ABCDE");
            Blend.raf(() => {
                list.strFilter("BD");
                Blend.raf(() => {
                    list.insertAt(1, new Placeholder({ caption: "X" }));
                    Blend.raf(() => {
                        t.assertEqual(list.getText(), "BXD");
                        Blend.raf(() => {
                            list.clearFilter();
                            Blend.raf(() => {
                                t.assertEqual(list.getText(), "ABCXDE");
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
}
