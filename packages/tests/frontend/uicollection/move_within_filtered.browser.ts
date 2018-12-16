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
            t.assertEqual(list.getAt(5).getCaption(), "F");
            list.strFilter("BDF");
            list.moveTo(0, list.getLast());
            Blend.raf(() => {
                t.assertEqual(list.getText(), "FBD");
                Blend.raf(() => {
                    list.clearFilter();
                    Blend.raf(() => {
                        t.assertEqual(list.getText(), "AFBCDEG");
                        t.done();
                    });
                });
            });
        });
    });
}
