import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";

export default function(t: IDescribeProvider) {
    t.describe("Browser Tests", (t: ITestDescription) => {});
}
