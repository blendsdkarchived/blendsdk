import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";

export default function(t: IDescribeProvider) {
    t.describe("UIStack Tests", (t: ITestDescription) => {
        t.inBrowser("Should do padding", "/browser/uistack_padding.html");
        t.inBrowser("Should start correctly", "/browser/uistack_start.html");
        t.inBrowser("Should start correctly not fitted", "/browser/uistack_nofit.html");
    });
}
