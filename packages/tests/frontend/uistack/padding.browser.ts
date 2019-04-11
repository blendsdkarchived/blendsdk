import { Application } from "@blendsdk/application";
import { IAssertionProvider } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { Placeholder } from "@blendsdk/ui";
import { UIStack } from "@blendsdk/uistack";

export default function (t: IAssertionProvider) {
	const stack = new UIStack({
		activeView: "item2",
		styles: {
			padding: Blend.toPx(20),
			backgroundColor: "#EDEDED"
		},
		items: [
			new Placeholder({
				caption: "Item 1"
			}),
			new Placeholder({
				id: "item2",
				caption: "Item 2"
			}),
			new Placeholder({
				caption: "Item 3"
			})
		]
	});

	const app = new Application({
		mainView: stack,
		size: {
			width: Blend.toPx(300),
			height: Blend.toPx(300)
		},
		onApplicationReady: () => {
			t.assertEqual(stack.getActiveView().getId(), "item2");
			t.delay(300, () => {
				stack.setActiveView(0);
				const r1 = stack
					.getActiveView()
					.getElement()
					.getBoundingClientRect();
				t.assertEqual(r1.width, 260);
				t.assertEqual(r1.height, 260);
				t.delay(300, () => {
					stack.setActiveView(1);
					const r2 = stack
						.getActiveView()
						.getElement()
						.getBoundingClientRect();
					t.assertEqual(r2.width, 260);
					t.assertEqual(r2.height, 260);
					t.delay(300, () => {
						stack.setActiveView(2);
						const r3 = stack
							.getActiveView()
							.getElement()
							.getBoundingClientRect();
						t.assertEqual(r3.width, 260);
						t.assertEqual(r3.height, 260);
						t.delay(300, () => {
							t.done();
						});
					});
				});
			});
		}
	});
}
