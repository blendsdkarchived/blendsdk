import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";

export default function(t: IDescribeProvider) {
    t.describe("Icon Tests", (t: ITestDescription) => {
        t.inBrowser("Should render sized", "/browser/icon_sized.html");
        t.inBrowser("Should render svg", "/browser/icon_svg.html");
    });
}
