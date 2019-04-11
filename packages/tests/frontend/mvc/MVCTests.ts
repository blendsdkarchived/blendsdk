import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { Assets } from "./Assets";

export default function (t: IDescribeProvider) {
	t.describe("MVC Tests", (t: ITestDescription) => {
		t.it("Should handle multiple handlers", (t: IAssertionProvider) => {
			const ctrl = new Assets.CounterController();

			const ticker = new Assets.Ticker({
				onTick: [ctrl.createAction(ctrl.onCount), ctrl.createAction(ctrl.onCount)]
			});

			ticker.tick();
			ticker.tick();

			t.delay(200, () => {
				t.assertEqual(ctrl.Count, 4);
				t.done();
			});
		});

		t.it("Should handle event cycle", (t: IAssertionProvider) => {
			const ctrl = new Assets.ControllerOne();

			const cmp = new Assets.ComponentOne({
				someNumber: 100,
				onNumberSet: ctrl.createAction(ctrl.doWork)
			});

			t.assertEqual(cmp.someNumber, 100);
			t.assertNotExists(cmp.someNumberMirror);

			cmp.someNumber = 50;
			t.delay(50, () => {
				t.assertEqual(cmp.someNumber, 50);
				t.assertEqual(cmp.bothNumbers, "50-50");
				t.done();
			});
		});
	});
}
