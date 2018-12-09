import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { Assets } from "../core/Assets";

export default function(t: IDescribeProvider) {
    t.describe("Core Component Tests", (t: ITestDescription) => {
        t.it("UserData", (t: IAssertionProvider) => {
            const cmp = new Assets.TestComponent({
                userData: {
                    a: 100,
                    b: true
                }
            });

            t.assertEqual(cmp.getUserData("a"), 100);
            t.assertEqual(cmp.getUserData("b"), true);

            const ud = JSON.stringify(cmp.getUserData());
            const ex = JSON.stringify({ a: 100, b: true });
            t.assertEqual(ud, ex);

            t.done();
        });

        t.it("applyMethod", (t: IAssertionProvider) => {
            const g = new Assets.Greeter(),
                r = g.applyMethod("sayHello", ["Blend"]),
                x = g.applyMethod("sayHello");

            t.assertEqual(r, "Hello Blend");
            t.assertEqual(x, "Hello ");
            t.done();
        });
    });
}
