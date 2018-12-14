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

        t.it("Should set classList correctly", (t: IAssertionProvider) => {
            enum CSS {
                five = "five",
                seven = "seven"
            }

            const el = document.createElement("div");
            document.body.appendChild(el);
            el.classList.set("one", true);
            el.classList.set("two", true);
            el.classList.set("six", true);
            t.assertEqual(el.getAttribute("class"), "one two six");
            el.classList.set(["six", "one"], false);
            el.classList.set(["six", "one"], false);
            el.classList.set(CSS, true);
            t.assertEqual(el.getAttribute("class"), "two five seven");
            t.done();
        });
    });
}
