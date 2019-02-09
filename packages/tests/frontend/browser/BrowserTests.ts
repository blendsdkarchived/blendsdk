import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { IScreenInformation } from "@blendsdk/core";

export default function(t: IDescribeProvider) {
    t.describe("Browser Tests", (t: ITestDescription) => {
        t.inBrowser(
            "Should trigger resize events",
            "/browser/browser_resize.html",
            (t: IAssertionProvider, win: Window) => {
                t.delay(500, () => {
                    win.resizeTo(320, 580);
                    t.delay(500, () => {
                        let info = (win as any).screenInfo as IScreenInformation;
                        t.assertEqual(info.display, "xsmall");
                        t.assertEqual(info.orientation, "portrait");
                        win.resizeTo(1024, 768);
                        t.delay(500, () => {
                            info = (win as any).screenInfo as IScreenInformation;
                            t.assertEqual(info.display, "medium");
                            t.assertEqual(info.orientation, "landscape");
                            t.assertEqual((win as any).onResponsiveChangeCount, 3);
                            t.done();
                        });
                    });
                });
            }
        );
        t.inBrowser("Should attach stylesheet", "/browser/browser_attachstyles.html");
        t.inBrowser("Should check display small", "/browser/browser_is_small.html", null, {
            width: 320,
            height: 568,
            center: true
        });
        t.inBrowser("Should run ready", "/browser/browser_ready.html");
    });
}
