// import { Browser } from "@blendsdk/browser";
// import { Button } from "@blendsdk/ui";

// Browser.ready(() => {
//     const btn = new Button({
//         text: "hello",
//         onClick: sender => {
//             console.log(sender);
//         }
//     } as any);
//     document.body.appendChild(btn);
//     btn.performLayout();
// });

import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { CSS, IStyleSet, Sheet, StyleSheets } from "@blendsdk/css";
import { Dom } from "@blendsdk/dom";

const inlineStyle = (name: string, styles: IStyleSet): Sheet => {
    const sheet = StyleSheets.create();
    sheet.pushToTop();
    sheet.addRule(CSS.block(name, styles));
    return sheet;
};

Browser.ready(() => {
    Browser.attachStyleSheet(
        inlineStyle("x-div", {
            height: Blend.toPx(100),
            margin: Blend.toPx(10),
            border: `5px solid red`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        })
    );

    Browser.attachStyleSheet(
        inlineStyle("x-cyan", {
            backgroundColor: "cyan"
        })
    );

    Browser.attachStyleSheet(
        inlineStyle("x-bold", {
            backgroundColor: "cyan"
        })
    );

    for (let a = 1; a !== 7; a++) {
        Browser.attachStyleSheet(
            inlineStyle("x-head-" + a, {
                fontSize: Blend.toPx(10 + a * 2)
            })
        );
    }

    for (let a = 0; a !== 100; a++) {
        document.body.appendChild(
            Dom.createElement({
                textContent: `DIV ${a}`,
                css: "x-div"
            })
        );
    }
});

// import { Application } from "@blendsdk/application";
// import { Blend } from "@blendsdk/core";
// import { Placeholder } from "@blendsdk/ui";
// import { UIStack } from "@blendsdk/uistack";

// const stack = new UIStack({
//     activeView: "item2",
//     styles: {
//         padding: Blend.toPx(20),
//         backgroundColor: "#EDEDED"
//     },
//     items: [
//         new Placeholder({
//             caption: "Item 1"
//         }),
//         new Placeholder({
//             id: "item2",
//             caption: "Item 2"
//         }),
//         new Placeholder({
//             caption: "Item 3"
//         })
//     ]
// });

// const app = new Application({
//     mainView: stack,
//     size: {
//         width: Blend.toPx(300),
//         height: Blend.toPx(300)
//     }
// });
