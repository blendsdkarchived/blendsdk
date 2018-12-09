import { IAssertionProvider, IDescribeProvider, IFinishable, ITestDescription } from "@blendsdk/blendrunner";
import { BEM, stylesheet, StyleSheets } from "@blendsdk/css";

export default function(t: IDescribeProvider) {
    t.describe("BEM StyleSheets Test", (t: ITestDescription) => {
        /**
         * Clear the cache after each tests so we can start again
         */
        t.afterEach((t: IFinishable) => {
            (StyleSheets as any).cache = {};
            t.done();
        });

        t.it("Should render modifier", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(
                    BEM.block(".sel1", [
                        { color: "red" },
                        BEM.element("element", [{ color: "red" }, BEM.modifier("disabled", { color: "gray" })])
                    ])
                )
            );
            t.assertEqual(
                result,
                ".sel1 {color:red;}\n.sel1__element {color:red;}\n.sel1__element--disabled {color:gray;}"
            );
            t.done();
        });

        t.it("Should render element", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(BEM.block(".sel1", [{ color: "red" }, BEM.element("element", { color: "red" })]))
            );
            t.assertEqual(result, ".sel1 {color:red;}\n.sel1__element {color:red;}");
            t.done();
        });

        t.it("Should render block selector", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(stylesheet([BEM.block(".sel1", { color: "blue" })]));
            t.assertEqual(result, ".sel1 {color:blue;}");
            t.done();
        });
    });
}
