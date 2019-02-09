import { Application } from "@blendsdk/application";
import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { Placeholder } from "@blendsdk/ui";
import { UIStack } from "@blendsdk/uistack";

export default function(t: IAssertionProvider) {
    const stack = new UIStack({
        items: [
            new Placeholder({ caption: "Item 1" }),
            new Placeholder({ id: "item2", caption: "Item 2" }),
            new Placeholder({ caption: "Item 3" })
        ]
    });
    const app = new Application({
        mainView: stack,
        size: {
            width: Blend.toPx(300),
            height: Blend.toPx(300)
        },
        onApplicationReady: () => {
            t.assertEqual(stack.getActiveView<Placeholder>().getCaption(), "Item 1");
            t.assertEqual(stack.getElement().children.length, 1);
            t.delay(300, () => {
                stack.pushView(2);
                t.assertEqual(stack.getActiveView<Placeholder>().getCaption(), "Item 3");
                t.delay(300, () => {
                    stack.pushView("item2");
                    t.assertEqual(stack.getActiveView<Placeholder>().getCaption(), "Item 2");
                    t.delay(300, () => {
                        stack.pushView(-1); // should not break
                        t.delay(300, () => {
                            t.assertThrows(() => {
                                stack.pushView(5); // should break
                            });
                            t.delay(300, () => {
                                t.done();
                            });
                        });
                    });
                });
            });
        }
    });
}
