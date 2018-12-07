import { ITestDescription, IAssertionProvider, IDescribeProvider } from '@blendsdk/blendrunner';
import { Assets } from './Assets';
import { IDeviceInfo } from '@blendsdk/deviceinfo';
import { Blend } from '@blendsdk/core';
import { deviceInfoTests, IDeviceInfoTest } from './DeviceInfoSpecs';

export default function(t: IDescribeProvider) {
    t.describe('DeviceInfo Tests', (t: ITestDescription) => {
        var currentTest = 0;

        var builder = function(testCase: IDeviceInfoTest, userAgent: string, index: number) {
            t.it(userAgent || testCase.name, (t: IAssertionProvider) => {
                /**
                 * Mock window.cordova when Cordova is expected
                 */
                if (testCase.expected.Cordova) {
                    (<any>window).cordova = true;
                }
                var deviceInfo = new Assets.DeviceInfo(userAgent),
                    actual = deviceInfo.getInformation(),
                    expected: IDeviceInfo = {
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
                    var diff = {};
                    Blend.forEach(actual, function(value: boolean, key: string) {
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
                    delete (<any>window).cordova;
                }

                t.done();
            });
        };

        Blend.forEach(deviceInfoTests, function(test: IDeviceInfoTest, index: number) {
            var userAgents = Blend.wrapInArray(test.userAgent);
            Blend.forEach(userAgents, function(userAgent: string, index: number) {
                builder(test, userAgent, index);
            });
        });
    });
}
