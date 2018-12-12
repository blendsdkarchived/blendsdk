import { IAssertionProvider, IDescribeProvider, IFinishable, ITestDescription } from "@blendsdk/blendrunner";
import { CSS, stylesheet, StyleSheets } from "@blendsdk/css";

export default function(t: IDescribeProvider) {
    t.describe("StyleSheets Test", (t: ITestDescription) => {
        /**
         * Clear the cache after each tests so we can start again
         */
        t.afterEach((t: IFinishable) => {
            (StyleSheets as any).cache = {};
            t.done();
        });

        t.it("Should create media query", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.mediaQuery("print", CSS.block(".sel", [CSS.before({ color: "blue" })])))
            );
            t.assertEqual(result, "@media print {.sel::before {color:blue;}}");
            t.done();
        });

        t.it("Should create ::before", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(stylesheet(CSS.block(".sel", [CSS.before({ color: "blue" })])));
            t.assertEqual(result, ".sel::before {color:blue;}");
            t.done();
        });

        t.it("Should create ::after", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(stylesheet(CSS.block(".sel", [CSS.after({ color: "red" })])));
            t.assertEqual(result, ".sel::after {color:red;}");
            t.done();
        });

        t.it("Should create composed", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(stylesheet(CSS.block("html", { color: "red" }).compose("body")));
            t.assertEqual(result, "html,body {color:red;}");
            t.done();
        });

        t.inBrowser("Should render", "/browser/css_render.html");

        t.it("Should render precededBy", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.block(".foo", [{ zIndex: 1 }, CSS.precededBy(".bar", { zIndex: 2 })]))
            );
            t.assertEqual(result, ".foo {z-index:1;}\n.foo ~ .bar {z-index:2;}");
            t.done();
        });

        t.it("Should render immediatelyAfter", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.block(".foo", [{ zIndex: 1 }, CSS.immediatelyAfter(".bar", { zIndex: 2 })]))
            );
            t.assertEqual(result, ".foo {z-index:1;}\n.foo + .bar {z-index:2;}");
            t.done();
        });

        t.it("Should render composed", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.block(".foo", [{ zIndex: 1 }, CSS.and(".bar", { zIndex: 2 })]))
            );
            t.assertEqual(result, ".foo {z-index:1;}\n.foo.bar {z-index:2;}");
            t.done();
        });

        t.it("Should render child", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.block("patent", [{ zIndex: 1 }, CSS.child("child", { zIndex: 2 })]))
            );
            t.assertEqual(result, "patent {z-index:1;}\npatent > child {z-index:2;}");
            t.done();
        });

        t.it("Should render nested", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.block("patent", [{ zIndex: 1 }, CSS.nest("child", { zIndex: 2 })]))
            );
            t.assertEqual(result, "patent {z-index:1;}\npatent child {z-index:2;}");
            t.done();
        });

        t.it("Should not render nested", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet(CSS.block("a", [{ color: "blue" }, CSS.block("x", { color: "yellow" })]))
            );
            t.assertEqual(result, "a {color:blue;}\nx {color:yellow;}");
            t.done();
        });

        t.it("Should not render already rendered", (t: IAssertionProvider) => {
            let result = (StyleSheets as any).render(stylesheet(CSS.block("a", { color: "blue" })));
            t.assertEqual(result, "a {color:blue;}");

            result = (StyleSheets as any).render(stylesheet(CSS.block("b", { color: "red" })));
            t.assertEqual(result, "b {color:red;}");
            t.done();
        });

        t.it("Should render single", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(stylesheet(CSS.block(".sel1", { color: "blue" })));
            t.assertEqual(result, ".sel1 {color:blue;}");
            t.done();
        });

        t.it("Should render multiple", (t: IAssertionProvider) => {
            const result = (StyleSheets as any).render(
                stylesheet([CSS.block(".sel1", { color: "blue" }), CSS.block(".sel2", { color: "red" })])
            );
            t.assertEqual(result, ".sel1 {color:blue;}\n.sel2 {color:red;}");
            t.done();
        });
    });
}
