import { AjaxRequest } from "@blendsdk/ajax";
import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";

export default function (t: IDescribeProvider) {
	t.describe("AjaxRequest Tests", (t: ITestDescription) => {
		t.it("Error Request", (t: IAssertionProvider) => {
			const req = new AjaxRequest({
				url: "http://localhost:3000/error",
				onSuccess: (sender: any, xhr: XMLHttpRequest) => {
					t.assertFalse(true); // should not come to this point
				},
				onError: (send: any, xhr: XMLHttpRequest) => {
					t.assertEqual(xhr.status, 500);
					t.done();
				}
			}).send();
		});

		t.it("Get Request", (t: IAssertionProvider) => {
			const req = new AjaxRequest({
				url: "http://localhost:3000/ping",
				onSuccess: (sender: any, xhr: XMLHttpRequest) => {
					t.assertEqual(xhr.responseText, "pong");
				},
				onFinished: (sender: any, xhr: XMLHttpRequest) => {
					t.assertEqual(200, xhr.status, xhr.status.toString());
					t.done();
				}
			}).send();
		});
	});
}
