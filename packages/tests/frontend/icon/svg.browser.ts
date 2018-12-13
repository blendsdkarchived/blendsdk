import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { ImageIcon, SVGIcon } from "@blendsdk/icon";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        const icon = new SVGIcon({
            url: "/assets/bus.svg?v=" + new Date().getTime(),
            size: 64,
            color: "red"
        }).getElement();

        document.body.append(icon);

        Blend.raf(() => {
            t.assertImage(icon, "/assets/icon/red-bus-64x64.png?v=" + new Date().getTime(), t.done);
        });
    }).start();
}
