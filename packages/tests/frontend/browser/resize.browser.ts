import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { Blend, SystemEvents } from "@blendsdk/core";
import { Dom } from "@blendsdk/dom";

Browser.ready(() => {
    (window as any).onResponsiveChangeCount = 0;

    const sizeElement = Dom.createElement({
        tag: "pre",
        textContent: ""
    });

    document.body.appendChild(sizeElement);

    SystemEvents.addEventListener(Blend.ID().toString(), "onWindowResized", () => {
        sizeElement.innerHTML = JSON.stringify(Browser.getScreenInformation(), null, 2);
        (window as any).screenInfo = Blend.shallowClone(Browser.getScreenInformation());
    });

    SystemEvents.addEventListener(Blend.ID().toString(), "onResponsiveChange", () => {
        (window as any).onResponsiveChangeCount += 1;
    });
});
