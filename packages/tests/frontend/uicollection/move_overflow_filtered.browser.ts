import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { Assets } from "./Assets";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        const list = new Assets.ui.List();
        list.strAdd("ABCDEFG");

        document.body.appendChild(list);
        list.performLayout();
        Blend.raf(() => {
            list.strFilter("BDFG");
            t.assertEqual(list.getAt(1).getCaption(), "D");
            list.moveTo(4, list.getAt(1));
            Blend.raf(() => {
                t.assertEqual(list.getText(), "BFGD");
                list.clearFilter();
                Blend.raf(() => {
                    t.assertEqual(list.getText(), "ABCEFGD");
                    Blend.raf(() => {
                        t.done();
                    });
                });
            });
        });
    });
}
