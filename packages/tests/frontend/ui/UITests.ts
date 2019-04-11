import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";

export default function (t: IDescribeProvider) {
	t.describe("UI Component Tests", (t: ITestDescription) => {
		t.inBrowser("Should render UI correctly", "/browser/ui_render.html");
		t.inBrowser("Should render UI size correctly", "/browser/ui_size.html");
	});
}
