import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Assets } from "./Assets";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        const list = new Assets.ui.List();
        document.body.appendChild(list);
        list.performLayout();
        Blend.raf(() => {
            list.strAdd("ABCDEFG");
            Blend.raf(() => {
                list.strFilter("ADG");
                Blend.raf(() => {
                    list.removeAt(1);
                    Blend.raf(() => {
                        t.assertEqual(list.getText(), "AG");
                        Blend.raf(() => {
                            list.clearFilter();
                            Blend.raf(() => {
                                t.assertEqual(list.getText(), "ABCEFG");
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
