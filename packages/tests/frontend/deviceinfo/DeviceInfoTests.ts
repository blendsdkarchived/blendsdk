import { IAssertionProvider, IDescribeProvider, ITestDescription } from "@blendsdk/blendrunner";
import { Blend } from "@blendsdk/core";
import { IDeviceInfo } from "@blendsdk/deviceinfo";
import { Assets } from "./Assets";
import { deviceInfoTests, IDeviceInfoTest } from "./DeviceInfoSpecs";

export default function (t: IDescribeProvider) {
	t.describe("DeviceInfo Tests", (t: ITestDescription) => {
		const currentTest = 0;

		const builder = (testCase: IDeviceInfoTest, userAgent: string, index: number) => {
			t.it(userAgent || testCase.name, (t: IAssertionProvider) => {
                /**
                 * Mock window.cordova when Cordova is expected
                 */
				if (testCase.expected.Cordova) {
					(window as any).cordova = true;
				}
				const deviceInfo = new Assets.DeviceInfo(userAgent),
					actual = deviceInfo.getInformation();
				let expected: IDeviceInfo = {
					iOS: false,
					AndroidOS: false,
					AndroidStock: false,
					IEMobile: false,
					Chrome: false,
					Safari: false,
					Firefox: false,
					Opera: false,
					Yandex: false,
					UCBrowser: false,
					Cordova: false,
					Electron: false,
					Windows: false,
					Linux: false,
					OSX: false,
					iPhone: false,
					iPad: false,
					iPod: false,
					Edge: false,
					IE: false,
					Unsupported: false,
					Device: false,
					Desktop: true
				};

				expected = Blend.apply(expected, testCase.expected, {
					overwrite: true
				});

				if (!t.assertEqual(actual, expected, testCase.name)) {
					const diff = {};
					Blend.forEach(actual, (value: boolean, key: string) => {
						if (actual[key] !== expected[key]) {
							diff[key] = value;
						}
					});
					console.log(`=====${testCase.name}[${index}]:`);
					console.log(`DIFF: ${JSON.stringify(diff)}`);
					console.log(`EXPE: ${JSON.stringify(testCase.expected)}`);
					console.log(`AGNT: ${userAgent}`);
				}

                /**
                 * Cleanup cordova tests
                 */
				if (testCase.expected.Cordova) {
					delete (window as any).cordova;
				}

				t.done();
			});
		};

		Blend.forEach(deviceInfoTests, (test: IDeviceInfoTest, index: number) => {
			const userAgents = Blend.wrapInArray(test.userAgent);
			Blend.forEach(userAgents, (userAgent: string, index: number) => {
				builder(test, userAgent, index);
			});
		});
	});
}
