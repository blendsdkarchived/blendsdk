import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { ImageIcon } from "@blendsdk/icon";

Browser.ready(() => {
    const icon = new ImageIcon({
        src: "/assets/metro-mouse.png",
        round: true,
        size: 48
    }).getElement();

    document.body.append(icon);
});
