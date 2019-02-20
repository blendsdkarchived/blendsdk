import { Application } from "@blendsdk/application";
import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { Placeholder } from "@blendsdk/ui";
import { UIStack } from "@blendsdk/uistack";

const stack = new UIStack({
    activeView: "item2",
    styles: {
        padding: Blend.toPx(20),
        backgroundColor: "#EDEDED"
    },
    items: [
        new Placeholder({
            caption: "Item 1"
        }),
        new Placeholder({
            id: "item2",
            caption: "Item 2"
        }),
        new Placeholder({
            caption: "Item 3"
        })
    ]
});

const app = new Application({
    mainView: stack,
    size: {
        width: Blend.toPx(300),
        height: Blend.toPx(300)
    }
});
