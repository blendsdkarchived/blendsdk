import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Browser } from "@blendsdk/browser";

export default function(t: IAssertionProvider) {
    let count = 0;
    t.assertFalse((Browser as any).isBrowserReady);

    Browser.ready(() => {
        count += 1;
    });

    Browser.ready(() => {
        count += 1;
    });

    t.delay(300, () => {
        t.assertEqual(count, 2);
        t.done();
    });
}
