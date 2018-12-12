/**
 * Type describing a type of generic function
 * @type
 */
export type TFunction = (...args) => any;

/**
 * Interface for configuring an InBrowser Window
 *
 * @export
 * @interface IBrowserWindowConfig
 */
export interface IBrowserWindowConfig {
    width?: number;
    height?: number;
    center?: boolean;
    top?: number;
    left?: number;
}

/**
 * Interface for exposing the log method
 *
 * @export
 * @interface ILogProvider
 */
export interface ILogProvider {
    log(message?: any, ...optionalParams: any[]): any;
}

export interface IDescribeProvider extends ILogProvider {
    describe(specName: string, specTFunction: (t: ITestDescription) => any): any;
    before(callable: (t: IFinishable) => any): any;
    after(callable: (t: IFinishable) => any): any;
    afterEach(callable: (t: IFinishable) => any): any;
    beforeEach(callable: (t: IFinishable) => any): any;
}

/**
 * Interface for implementing a set of BDD utility provider.
 *
 * @interface ITestDescription
 */
export interface ITestDescription {
    it(testName: string, testFn: (t: IAssertionProvider) => any): any;
    inBrowser(
        name: string,
        url: string,
        remoteGlobalTFunction?: string | TFunction,
        windowConfig?: IBrowserWindowConfig
    ): any;
    before(beforeFn: (t: IFinishable) => any): any;
    after(afterFn: (t: IFinishable) => any): any;
    beforeEach(beforeEachFn: (t: IFinishable) => any): any;
    afterEach(afterEachFn: (t: IFinishable) => any): any;
}

/**
 * Interface for implementing a set of utility functions to steer the test
 * runner.
 *
 * @interface IFinishable
 */
export interface IFinishable extends ILogProvider {
    done(): any;
    setTimeout(about: number): any;
}

/**
 * Interface for implementing an Assertion provider
 *
 * @interface IAssertionProvider
 */
export interface IAssertionProvider extends IFinishable {
    assertTrue(actual: any, description?: string): boolean;
    assertFalse(actual: any, description?: string): boolean;
    assertExists(actual: any, description?: string): boolean;
    assertNotExists(actual: any, description?: string): boolean;
    assertEqual(actual: any, expected: any, description?: string): boolean;
    assertNotEqual(actual: any, expected: any, description?: string): boolean;
    assertThrows(action: TFunction, criteria?: TFunction, description?: string): boolean;
    delay(ms: number, callback: TFunction, scope?: any): void;
}

/**
 * Interface for implementing an assertion log.
 *
 * @interface IAssertLog
 */
export interface IAssertLog {
    name?: string;
    actual: any;
    expected: any;
    status: string;
    log: string;
}
/**
 * Interface for configuring a key/value dictionary
 *
 * @interface IDictionary
 */
export interface IDictionary {
    [key: string]: any;
}

/**
 * Interface for implementing a callable test.
 *
 * @interface ICallable
 */
export interface ICallable {
    name: string;
    fn: (t: IFinishable) => any;
    duration?: number;
    numAsserts?: number;
    numPassed?: number;
    numFailed?: number;
    assertLog?: IAssertLog[];
}

/**
 * Interface for implementing a test specification.
 *
 * @interface ITestSpecification
 */
export interface ITestSpecification {
    name: string;
    beforeFn: ICallable;
    beforeStatus?: string;
    afterStatus?: string;
    afterFn: ICallable;
    beforeEachFn: ICallable;
    afterEachFn: ICallable;
    beforeEachStatus?: string;
    afterEachStatus?: string;
    testSpecs: ITestSpecDictionary;
    duration?: number;
    numAsserts?: number;
    numAssertsPassed?: number;
    numAssertsFailed?: number;
    numTests?: number;
    numTestsPassed?: number;
    numTestsFailed?: number;
}

/**
 * Interface for implementing a test specification dictionary.
 *
 * @interface ITestSpecDatabase
 */
export interface ITestSpecDictionary {
    [id: string]: ICallable;
}

/**
 * Interface describing dictionary of events
 *
 * @interface IEventDictionary
 */
export interface IEventDictionary {
    [name: string]: Array<{ scope: any; fn: TFunction }>;
}

/**
 * Interface describing a test queue.
 * This is an array of test specification ids
 *
 * @interface ITestQueue
 */
export interface ITestQueue {
    [specId: string]: string[];
}

export enum eStatus {
    EVENT_PROGRESS = "progress",
    EVENT_ASSERT_STATUS = "assert_status",
    EVENT_EXECUTION_STAGE_STATUS = "exe_stage_status"
}

/**
 * Interface for implementing a specification dictionary.
 *
 * @interface TSpecDatabase
 */
export interface ISpecDictionary {
    [id: string]: ITestSpecification;
}

/**
 * Interface for describing an assertion status.
 *
 * @interface TAssertStatus
 */
export interface IAssertStatus {
    stage: string;
    spec: ITestSpecification;
    test: ICallable;
    testId: string;
    specId: string;
}

/**
 * Interface describing the current execution status
 *
 * @export
 * @interface TExecutionStageStatus
 * @extends {IAssertStatus}
 */
export interface IExecutionStageStatus extends IAssertStatus {
    status?: string;
    error: Error;
}

/**
 * Interface for describing a test execution progress.
 *
 * @interface IProgress
 */
export interface IProgress {
    description?: string;
    pct?: number;
    current?: number;
    total?: number;
    specId?: string;
    testId?: string;
    stage?: string;
}

/**
 * Interface for passing element creation configuration to
 *  the `Blend.com.createElement`
 *
 * @interface ICreateElementConfig
 */
export interface ICreateElementConfig {
    /**
     * The tagName of the element. Defaults to `DIV` if not provided.
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    tag?: string;
    /**
     * The id if the element .
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    id?: string;
    /**
     * The reference id of the element .
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    reference?: string;
    /**
     * The text content (innerText) of the element .
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    textContent?: string;
    /**
     * Utility method for adding, removing, and toggling CSS
     * classes on an HTMLElement.
     *
     * The `rules` parameter is a dictionary. Its keys are translated to
     * CSS rules and the values are translates to:
     *
     * `true` for adding the CSS rule
     * `false` for removing the CSS rule
     * `null` to toggle a rule (remove is exists, add if not exists)
     *
     * If a `prefix` is provided the the keys are going to be prefixed as:
     * `prefix + '-' + key`
     *
     * @type {string}
     * @memberOf ICreateElementConfig
     */
    htmlContent?: string;
    /**
     * The css class(es) of the element.
     *
     * @type {(string | Array<string>)}
     * @memberof ICreateElementConfig
     */
    css?: string | string[];
    /**
     * The inline styles of the element.
     *
     * @type {ICssInlineStyleRules}
     * @memberOf ICreateElementConfig
     */
    style?: IDictionary;
    /**
     * The data attributes of the element.
     *
     * @type {{
     *         [key: string]: any;
     *     }}
     * @memberOf ICreateElementConfig
     */
    data?: {
        [key: string]: any;
    };
    /**
     * The attributes of the element.
     *
     * @type {{
     *         [key: string]: any;
     *     }}
     * @memberOf ICreateElementConfig
     */
    attrs?: {
        [key: string]: any;
    };
    /**
     * The element listeners of the element.
     *
     *
     * @memberOf ICreateElementConfig
     */
    listeners?: {
        [name: string]: EventListenerOrEventListenerObject;
    };
    /**
     * The children of the element. The `children` property
     * either accepts a single item or an array of items.
     * You also can provide a function returning an array of ICreateElementConfig
     *
     * @type
     *         | string
     *         | ICreateElementConfig
     *         | HTMLElement
     *         | Blend.ui.Component
     *         | Array<Blend.ui.Collection<any> | string | ICreateElementConfig | HTMLElement | Blend.ui.Component>)}
     * @memberof ICreateElementConfig
     */
    children?: string | ICreateElementConfig | HTMLElement | Array<string | ICreateElementConfig | HTMLElement>;
    /**
     * Indicates whether this configuration is an svg element
     *
     * @type {boolean}
     * @memberof ICreateElementConfig
     */
    isSVG?: boolean;
}

declare global {
    // tslint:disable-next-line:interface-name
    interface HTMLElement {
        /**
         * @internal
         * Internal property used to hold arbitrary data
         */
        $blend: any;
    }
}
