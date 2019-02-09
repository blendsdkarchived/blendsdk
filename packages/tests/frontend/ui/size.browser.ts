import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { TUIComponent } from "@blendsdk/ui";
import { Assets } from "./Assets";

export default function(t: IAssertionProvider) {
    const uis = {
        ui1: new Assets.Rect({
            size: {
                width: 100,
                height: 100
            }
        }),
        ui2: new Assets.Rect({
            flexSize: 1
        })
    };

    Blend.forEach<TUIComponent>(uis, item => {
        document.body.appendChild(item);
    });

    t.delay(250, () => {
        const size1 = uis.ui1.getSize();
        t.assertEqual(size1.width, 100);
        t.assertEqual(size1.height, 100);

        t.assertEqual(uis.ui2.getFlexSize(), 1);

        uis.ui1.setHidden(true);

        t.assertTrue(uis.ui1.isHidden());

        t.done();
    });
}
