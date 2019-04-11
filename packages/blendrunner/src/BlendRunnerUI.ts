// tslint:disable:max-line-length
import { BlendRunner } from "./BlendRunner";
import { BlendRunnerUIStyles } from "./BlendRunnerUIStyles";
import { Core } from "./Core";
import { Sheet } from "./CSS";
import { Dom } from "./Dom";
import {
	ClockIcon,
	FailIcon,
	PassIcon,
	SmallClipBoardIcon,
	SmallFailIcon,
	SmallPassIcon,
	SmallWatchIcon,
	ZoomInIcon
} from "./Icons";
import { imageDataToCanvas } from "./ImageDiff";
import { RotationCSS } from "./Rotating";
import { IAssertLog, IAssertStatus, ICallable, ICreateElementConfig, ITestSpecification, TFunction } from "./Types";

interface IURLSelection {
	suite: string;
	test: string;
}

export interface IBlendRunnerUIOptions {
	hidePassed?: boolean;
}

/**
 * Implements a Simple UI for running tests
 *
 * @export
 * @class BlendRunnerUI
 */
export class BlendRunnerUI extends Core {
    /**
     * Reference to BlendRunner
     *
     * @protected
     * @type {BlendRunner}
     * @memberof BlendRunnerUI
     */
	protected runner: BlendRunner;
    /**
     * Start check flag
     *
     * @protected
     * @type {boolean}
     * @memberof BlendRunnerUI
     */
	protected isStarted: boolean;

	protected totalPendingElement: HTMLElement;
	protected totalPassedElement: HTMLElement;
	protected totalFailedElement: HTMLElement;
	protected totalPending: number;
	protected totalPassed: number;
	protected totalFailed: number;
	protected options: IBlendRunnerUIOptions;

    /**
     * Creates an instance of BlendRunnerUI.
     * @param {BlendRunner} runner
     * @memberof BlendRunnerUI
     */
	public constructor(runner: BlendRunner) {
		super();
		const me = this;
		me.runner = runner;
		me.isStarted = false;
		me.totalPassed = me.totalFailed = me.totalPending = 0;
	}

    /**
     * Start testing
     *
     * @memberof BlendRunnerUI
     */
	public start(options?: IBlendRunnerUIOptions) {
		const me = this,
			documentReadyHandler = () => {
				if (!me.isStarted) {
					me.isStarted = true;
					me.loadHTML2CanvasLIb((screenshotStatus: boolean) => {
						me.runner.canMakeScreenshots(screenshotStatus);
						me.iniUI();
						me.queueTests();
						me.runner.onAssertStatus((status: IAssertStatus) => {
							window.requestAnimationFrame(() => {
								me.setTestSuiteStatus(status);
								me.setTestStatus(status);
							});
						});
						me.runner.run(() => {
							setTimeout(() => {
								window.scrollTo(0, document.body.scrollHeight);
								me.createHideOnPassCSS();
							}, 300);
						});
					});
				}
			};

		me.options = options || {
			hidePassed: false
		};

		if (window.document.readyState === "complete") {
			documentReadyHandler.apply(me, []);
		} else {
			window.addEventListener("load", documentReadyHandler);
		}
	}

    /**
     * Renders CSS that os used to hide the passed tests.
     * This needs to be done at the end to prevent scroll-jumping
     *
     * @protected
     * @memberof BlendRunnerUI
     */
	protected createHideOnPassCSS() {
		const me = this;
		if (me.options.hidePassed) {
			const sheet = new Sheet();
			sheet.rule(".x-hide-passed", {}).nest(".x-pass", {
				display: "none"
			});
			sheet.render();
		}
	}

	protected loadHTML2CanvasLIb(done: (status: boolean) => any) {
		document.head.appendChild(
			Dom.createElement({
				tag: "script",
				attrs: {
					src: "https://unpkg.com/html2canvas@latest/dist/html2canvas.min.js"
				}
			})
		);
		let timeout = 0;
		const checker = setInterval(() => {
			if ((window as any).html2canvas) {
				clearInterval(checker);
				done(true);
			} else if (timeout > 50) {
				clearInterval(checker);
				done(false);
			} else {
				timeout += 1;
			}
		}, 100);
	}

    /**
     * Adds the roboto font from Google's font services
     *
     * @protected
     * @memberof BlendRunnerUI
     */
	protected loadRobotoFonts() {
		const linkEl = Dom.createElement({
			tag: "link",
			attrs: {
				href:
					"http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900",
				rel: "stylesheet",
				type: "text/css"
			}
		});
		const rotating = document.createElement("style");
		rotating.textContent = RotationCSS();
		document.head.appendChild(linkEl);
		document.head.appendChild(rotating);
	}

    /**
     * Initialize and create the UI element;
     *
     * @protected
     * @memberof BlendRunnerUI
     */
	protected iniUI() {
		const me = this;
		me.loadRobotoFonts();
		BlendRunnerUIStyles.instance().render();
		const headerElement = Dom.createElement(
			{
				css: ["x-header", "x-scrolling"],
				children: [
					{
						css: "x-pctbar",
						children: [
							{
								css: "x-pct-pass",
								reference: "totalPassedElement"
							},
							{
								css: "x-pct-fail",
								reference: "totalFailedElement"
							},
							{
								css: "x-pct-pending",
								reference: "totalPendingElement"
							}
						]
					},
					{
						css: "x-toolbar",
						children: [
							{
								css: "x-title",
								textContent: document.title
							}
						]
					}
				]
			},
			(ref: string, element: HTMLElement) => {
				(me as any)[ref] = element;
			}
		);
		document.body.appendChild(headerElement);
	}

    /**
     * Parse the URL hash so we can filter a test suite and a test
     * in order to not to run everything.
     *
     * @protected
     * @returns {IURLSelection}
     * @memberof BlendRunnerUI
     */
	protected parseHash(): IURLSelection {
		const me = this,
			result: IURLSelection = {
				suite: null,
				test: null
			},
			hash = (window.location.hash.replace(/#/gi, "") || "").split("/");
		if (me.is_array(hash)) {
			result.suite = hash[0] ? decodeURIComponent(hash[0]) : null;
			result.test = hash[1] ? decodeURIComponent(hash[1]) : null;
		}
		return result;
	}

	protected createCards() {
		const me = this,
			specs = me.runner.getSpecs(),
			queued = me.runner.getQueuedTests();
		me.totalFailed = 0;
		me.totalPassed = 0;
		me.forEach(queued, (testDefIds: string[], testSpecId: string) => {
			const testSpec = specs[testSpecId];
			const tests: ICreateElementConfig[] = [];

			testDefIds.forEach((defId: string) => {
				const testDef = testSpec.testSpecs[defId];
				me.totalPending += 1;
				tests.push({
					css: ["x-test"],
					data: {
						test: `t${testSpecId}-${defId}`
					},
					children: [
						{
							css: ["x-ui", "x-row"],
							children: [
								ClockIcon(),
								FailIcon(),
								PassIcon(),
								{
									css: "x-title",
									textContent: testDef.name
								},
								{
									css: "x-spacer"
								},
								{
									css: ["x-row", "x-duration", "x-part"],
									children: [
										SmallWatchIcon(),
										{
											css: "x-value",
											textContent: 0 + "ms",
											data: {
												duration: `t${testSpecId}-${defId}`
											}
										}
									]
								},
								{
									css: "x-isolate",
									tag: "A",
									attrs: {
										target: "_blank",
										href: `${location.href.replace(location.hash, "")}#${encodeURIComponent(
											testSpec.name
										)}/${encodeURIComponent(testDef.name)}`
									},
									children: [ZoomInIcon()]
								}
							]
						},
						{
							css: "x-result",
							data: {
								result: `t${testSpecId}-${defId}`
							}
						}
					]
				});
			});

			const card = Dom.createElement({
				css: "x-card",
				data: {
					spec: `d${testSpecId}`
				},
				children: [
					{
						css: "x-card-header",
						children: [
							{
								css: "x-title",
								textContent: testSpec.name
							},
							{
								css: ["x-stats", "x-row"],
								children: [
									{
										css: ["x-row", "x-duration", "x-part"],
										children: [
											SmallWatchIcon(),
											{
												css: "x-value",
												textContent: 0 + "ms",
												data: {
													duration: `d${testSpecId}`
												}
											}
										]
									},
									{
										css: ["x-row", "x-num-tests", "x-part"],
										children: [
											SmallClipBoardIcon(),
											{
												css: "x-value",
												textContent: tests.length
											}
										]
									},
									{
										css: ["x-row", "x-passed", "x-part"],
										children: [
											SmallPassIcon(),
											{
												css: "x-value",
												textContent: 0,
												data: {
													passes: `d${testSpecId}`
												}
											}
										]
									},
									{
										css: ["x-row", "x-failed", "x-part"],
										children: [
											SmallFailIcon(),
											{
												css: "x-value",
												textContent: 0,
												data: {
													fails: `d${testSpecId}`
												}
											}
										]
									},
									{
										css: "x-spacer"
									},
									{
										css: "x-isolate",
										tag: "A",
										attrs: {
											target: "_blank",
											href: `${location.href.replace(location.hash, "")}#${encodeURIComponent(
												testSpec.name
											)}`
										},
										children: [ZoomInIcon()]
									}
								]
							}
						]
					}
				].concat(tests as any) as ICreateElementConfig[]
			});
			document.body.appendChild(card);
			me.setTotalCounts();
		});
	}

	protected setTotalCounts() {
		const me = this;
		window.requestAnimationFrame(() => {
			me.totalPendingElement.style.flex = me.totalPending.toString();
			me.totalPassedElement.style.flex = me.totalPassed.toString();
			me.totalFailedElement.style.flex = me.totalFailed.toString();
		});
	}

    /**
     * Queue the tests by looking to the URL hash.
     *
     * @protected
     * @memberof BlendRunnerUI
     */
	protected queueTests() {
		const me = this,
			specs = me.runner.getSpecs(),
			search = me.parseHash();
		if (search.suite) {
			me.forEach(specs, (testSpec: ITestSpecification, testSpecId: string) => {
				if (testSpec.name === search.suite) {
					me.forEach(testSpec.testSpecs, (testDef: ICallable, testId: string) => {
						const test = me.is_null(search.test) ? testDef.name : search.test;
						if (test === testDef.name) {
							((pTestSpecId: string, pTestId: string) => {
								me.runner.queueTest(pTestSpecId, pTestId);
							})(testSpecId, testId);
						}
					});
				}
			});
		} else {
			me.runner.queueAllTests();
		}
		me.createCards();
	}

	protected calcDuration(value: number): string {
		if (value < 1000) {
			return `${value}ms`;
		} else if (value >= 1000 && value < 60000) {
			return `${value / 1000}s`;
		} else {
			return `${value / 60000}m`;
		}
	}

	protected setTestSuiteData(id: string, duration: number, totalPassed: number, totalFails: number) {
		const me = this;
		const durationElement = document.querySelector(`[data-duration="d${id}"]`);
		if (durationElement) {
			durationElement.textContent = me.calcDuration(duration);
		}
		const passesElement = document.querySelector(`[data-passes="d${id}"]`);
		if (passesElement) {
			passesElement.textContent = `${totalPassed}`;
		}
		const failsElement = document.querySelector(`[data-fails="d${id}"]`);
		if (failsElement) {
			failsElement.textContent = `${totalFails}`;
		}
	}

	protected setTestSuiteStatus(status: IAssertStatus) {
		const me = this;
		const specElement: HTMLElement = document.querySelector(`[data-spec="d${status.specId}"]`);
		if (specElement) {
			specElement.scrollIntoView(false);
			if (me.runner.isTestSuiteStart(status)) {
				specElement.classList.add("x-testing");
				me.setTestSuiteData(status.specId, 0, 0, 0);
			} else if (me.runner.isTestSuiteEnd(status)) {
				specElement.classList.remove("x-testing");
				if (me.options.hidePassed) {
					specElement.classList.add("x-hide-passed");
				}
				me.setTestSuiteData(
					status.specId,
					status.spec.duration,
					status.spec.numTestsPassed,
					status.spec.numTestsFailed
				);
			}
		}
	}

	protected setTestStatusData(specId: string, id: string, duration: number) {
		const me = this;
		const durationElement = document.querySelector(`[data-duration="t${specId}-${id}"]`);
		if (durationElement) {
			durationElement.textContent = me.calcDuration(duration);
		}
	}

	protected setTestResult(specId: string, id: string, test: ICallable) {
		const me = this;
		const resultElement = document.querySelector(`[data-result="t${specId}-${id}"]`);
		const parseValue = (value: any): ICreateElementConfig => {
			return {
				tag: "pre",
				textContent: me.is_object(value) || me.is_array(value) ? JSON.stringify(value, null, 2) : value
			};
		};
		if (resultElement) {
			test.assertLog.forEach((log: IAssertLog) => {
				if (log.status !== "pass") {
					let imageDiff: any = {} as ICreateElementConfig;
					if (log.imageDiff !== null) {
						imageDiff = Dom.createElement({
							css: "x-image-diff"
						});
						[
							{ text: "Diff", image: log.imageDiff.diffImageData },
							{ text: "Actual", image: log.imageDiff.imageDataA },
							{ text: "Expected", image: log.imageDiff.imageDataB }
						].forEach(item => {
							imageDiff.appendChild(
								Dom.createElement({
									css: "x-img-sep",
									children: [
										{
											textContent: item.text
										},
										imageDataToCanvas(
											item.image.imageData,
											item.image.size.width,
											item.image.size.height
										)
									]
								})
							);
						});
					}
					resultElement.appendChild(
						Dom.createElement({
							css: ["x-assert", "x-row"],
							children: [
								{
									tag: "pre",
									css: "x-log",
									textContent: log.log
								},
								{
									css: "x-actual",
									children: [parseValue(log.actual)]
								},
								{
									css: "x-expected",
									children: [parseValue(log.expected)]
								},
								imageDiff
							]
						})
					);
				}
			});
		}
	}

	protected setTestStatus(status: IAssertStatus) {
		const me = this;
		const testElement: HTMLElement = document.querySelector(`[data-test="t${status.specId}-${status.testId}"]`);
		if (testElement !== null) {
			testElement.scrollIntoView(false);
			testElement.classList.remove("x-pass");
			testElement.classList.remove("x-fail");
			if (me.runner.isTestStart(status)) {
				me.setTestStatusData(status.specId, status.testId, 0);
				testElement.classList.add("x-testing");
				testElement.classList.add("x-waiting");
			} else if (me.runner.isTestEnd(status)) {
				testElement.classList.remove("x-testing");
				testElement.classList.remove("x-waiting");
				me.setTestStatusData(status.specId, status.testId, status.test.duration);
				if (status.test.numFailed === 0) {
					testElement.classList.add("x-pass");
					me.totalPassed += 1;
					me.totalPending -= 1;
				} else {
					testElement.classList.add("x-fail");
					me.totalFailed += 1;
					me.totalPending -= 1;
					me.setTestResult(status.specId, status.testId, status.test);
				}
			}
		}
		me.setTotalCounts();
	}
}
