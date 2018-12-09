import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import "@blendsdk/extensions";

export default function(t: IDescribeProvider) {
    t.describe("Extensions Library", (t: ITestDescription) => {
        t.it("usFirst Should Work", (t: IAssertionProvider) => {
            if (t.assertExists("".ucFirst)) {
                t.assertEqual("hello".ucFirst(), "Hello");
            }
            t.done();
        });
    });
}
