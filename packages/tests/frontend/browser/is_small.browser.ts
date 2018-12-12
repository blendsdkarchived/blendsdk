import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";
import { IScreenInformation } from "@blendsdk/core";
import { Dom } from "@blendsdk/dom";

export default function(t: IAssertionProvider) {
    Browser.ready(() => {
        t.delay(300, () => {
            document.body.appendChild(
                Dom.createElement({
                    textContent: Browser.getScreenInformation<IScreenInformation>().display
                })
            );
            t.assertTrue(Browser.isDisplaySmall(), Browser.getScreenInformation<IScreenInformation>().display);
            t.done();
        });
    }).start();
}
