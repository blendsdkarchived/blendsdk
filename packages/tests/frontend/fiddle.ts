import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { ImageIcon, SVGIcon } from "@blendsdk/icon";

Browser.ready(() => {
    const icon = new SVGIcon({
        url: "/assets/bus.svg?v=" + new Date().getTime(),
        size: 64,
        color: "red"
    }).getElement();

    document.body.append(icon);
});
