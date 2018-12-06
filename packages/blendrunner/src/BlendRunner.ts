import { Assert } from './Assert';
import {
    eStatus,
    IAssertionProvider,
    IAssertStatus,
    ICallable,
    IEventDictionary,
    IExecutionStageStatus,
    IFinishable,
    IProgress,
    ISpecDictionary,
    ITestDescription,
    ITestQueue,
    ITestSpecification
} from './Types';
import { showPlash } from './Welcome';

export class BlendRunner extends Assert {
    /**
     * Cache of the internal ID counter
     *
     * @protected
     * @type {number}
     * @memberof BlendRunner
     */
    protected ID: number;

    /**
     * A dictionary database of specs
     *
     * @protected
     * @type {ITestSpecDatabase}
     * @memberof BlendRunner
     */
    protected specs: ISpecDictionary;

    /**
     * A dictionary of queued tests
     *
     * @protected
     * @type {ITestQueue}
     * @memberof BlendRunner
     */
    protected testQueue: ITestQueue;

    /**
     * Reference to the currently running specification
     *
     * @protected
     * @type {ITestSpecification}
     * @memberof BlendRunner
     */
    protected currentSpec: ITestSpecification;

    /**
     * The index id of the current specification
     *
     * @protected
     * @type {string}
     * @memberof BlendRunner
     */
    protected currentSpecId: string;

    /**
     * Reference to the current progression stage.
     *
     * @protected
     * @type {TProgress}
     * @memberof BlendRunner
     */
    protected currentProgress: IProgress;

    /**
     * The index id of the current running test
     *
     * @protected
     * @type {string}
     * @memberof BlendRunner
     */
    protected currentTestId: string;

    /**
     * Cache of the registered event handlers.
     *
     * @type {IEventDictionary}
     * @memberof BlendRunner
     */
    public events: IEventDictionary;

    /**
     * Reference to the dynamically assigned done function.
     * This function is changed during the execution of all
     * test specifications.
     *
     * @type {Function}
     * @memberof BlendRunner
     */
    public done: Function;

    /**
     * Reference to the dynamically assigned setTimeout function.
     * This function is changed during the execution of all
     * test specifications.
     *
     * @memberof BlendRunner
     */
    public setTimeout: (value: number) => any;

    /**
     * Creates an instance of BlendRunner.
     * @memberof BlendRunner
     */
    public constructor() {
        super();
        const me = this;
        me.ID = 1000;
        me.currentProgress = {};
        me.clearQueue();
        me.events = {};
        me.specs = {};
        me.ID = 0;
    }

    /**
     * Returns the collection of specs.
     *
     * @returns {ISpecDictionary}
     * @memberof BlendRunner
     */
    public getSpecs(): ISpecDictionary {
        var me = this;
        return me.specs;
    }

    /**
     * Returns a dictionary of queued tests
     *
     * @returns {ITestQueue}
     * @memberof BlendRunner
     */
    public getQueuedTests(): ITestQueue {
        var me = this;
        return me.testQueue;
    }

    /**
     * Updates the values passed down from the actual assertion methods.
     *
     * @protected
     * @param {string} status
     * @param {*} actual
     * @param {*} expected
     * @param {string} [log]
     *
     * @memberOf BlendRunner
     */
    protected assert(status: string, actual: any, expected: any, log?: string) {
        var me = this;
        if (me.currentTestId) {
            log += ' [Assert: ' + (me.specs[me.currentSpecId].testSpecs[me.currentTestId].numAsserts + 1) + ']';
            if (status === 'pass') {
                me.specs[me.currentSpecId].testSpecs[me.currentTestId].numAsserts += 1;
                me.specs[me.currentSpecId].testSpecs[me.currentTestId].numPassed += 1;
                me.specs[me.currentSpecId].numAssertsPassed += 1;
                me.specs[me.currentSpecId].numAsserts + 1;
            } else if (status === 'fail') {
                me.specs[me.currentSpecId].testSpecs[me.currentTestId].numAsserts += 1;
                me.specs[me.currentSpecId].testSpecs[me.currentTestId].numFailed += 1;
                me.specs[me.currentSpecId].numAssertsFailed += 1;
                me.specs[me.currentSpecId].numAsserts + 1;
            } else {
                me.specs[me.currentSpecId].testSpecs[me.currentTestId].numFailed += 1;
                me.specs[me.currentSpecId].numAssertsFailed += 1;
            }

            me.specs[me.currentSpecId].testSpecs[me.currentTestId].assertLog.push({
                status: status,
                actual: actual,
                expected: expected,
                log: log
            });
            if (status !== 'timeout') {
                me.notifyAssertionStatus('assert', me.currentSpecId, me.currentTestId);
            }
        }
    }

    /**
     * Automatically add all the tests to the queue is the queue is empty.
     *
     * @protected
     * @memberof BlendRunner
     */
    protected autoQueue() {
        var me = this;
        if (Object.keys(me.testQueue).length === 0) {
            me.queueAllTests();
        }
    }

    /**
     * Resets counts on a given test
     *
     * @protected
     * @param {ICallable} test
     *
     * @memberOf BlendRunner
     */
    protected resetTestCounts(test: ICallable) {
        test.duration = 0;
        test.numAsserts = 0;
        test.numFailed = 0;
        test.numPassed = 0;
    }

    /**
     * Creates an assertion status notification.
     *
     * @protected
     * @param {string} stage
     * @param {string} specId
     * @param {string} testId
     *
     * @memberOf BlendRunner
     */
    protected notifyAssertionStatus(stage: string, specId: string, testId: string) {
        var me = this,
            spec = me.specs[specId],
            test = me.specs[specId].testSpecs[testId] || null;
        me.notify(eStatus.EVENT_ASSERT_STATUS, {
            stage: stage,
            spec: spec,
            test: test,
            testId: testId,
            specId: specId
        });
    }

    /**
     * Resets a specification values
     *
     * @protected
     * @param {ITestSpecification} spec
     *
     * @memberOf BlendRunner
     */
    protected resetSpecificationCounts(spec: ITestSpecification) {
        spec.duration = 0;
        spec.numAsserts = 0;
        spec.numTests = 0;
        spec.numAssertsFailed = 0;
        spec.numAssertsPassed = 0;
        spec.numTestsFailed = 0;
        spec.numTestsPassed = 0;
        spec.beforeStatus = null;
        spec.afterStatus = null;
        spec.beforeEachStatus = null;
        spec.afterEachStatus = null;
    }

    /**
     * Creates execution planner functions for measuring durations
     *
     * @protected
     * @param {string} stage
     * @param {string} specId
     * @param {string} testId
     * @returns
     *
     * @memberOf BlendRunner
     */
    protected processDuration(stage: string, specId: string, testId: string) {
        var me = this;
        return function(t: IFinishable) {
            var spec = me.specs[specId];
            var test = spec.testSpecs[testId] || null;
            me.currentSpecId = null;
            me.currentTestId = null;
            if (test) {
                me.currentSpecId = specId;
                me.currentTestId = testId;
                if (stage === 'start') {
                    me.resetTestCounts(test);
                    me.notifyAssertionStatus(stage, specId, testId);
                    test.duration = new Date().getTime();
                } else {
                    test.duration = new Date().getTime() - test.duration;
                    me.notifyAssertionStatus(stage, specId, testId);
                }
            } else {
                me.currentSpecId = specId;
                if (stage === 'start') {
                    me.resetSpecificationCounts(spec);
                    me.notifyAssertionStatus(stage, specId, testId);
                    spec.duration = new Date().getTime();
                } else {
                    spec.duration = new Date().getTime() - spec.duration;
                    for (var i in spec.testSpecs) {
                        var tst = spec.testSpecs[i];
                        if (tst.numFailed !== 0) {
                            spec.numTestsFailed += 1;
                        } else {
                            spec.numTestsPassed += 1;
                        }
                    }
                    me.notifyAssertionStatus(stage, specId, testId);
                }
            }
            t.done();
        };
    }

    /**
     * Prepares and creates a function that will invoke the a BDD function.
     * The result of this function is used by the plan executor.
     *
     * @protected
     * @param {string} specId
     * @param {string} testId
     * @param {string} stage
     * @param {ICallable} c
     * @returns {Function}
     *
     * @memberOf BlendRunner
     */
    protected createInvoker(specId: string, testId: string, stage: string, c: ICallable): Function {
        var me = this;
        return function(t: IFinishable) {
            me.currentProgress.pct = 0;
            me.currentProgress.current = 0;
            me.currentProgress.total = 0;
            me.currentProgress.specId = specId || null;
            me.currentProgress.testId = testId || null;
            me.currentProgress.stage = stage || null;
            me.currentProgress.description = c.name || null;
            c.fn.apply(me, [t]);
        };
    }

    /**
     * Creates an execution plan based on the items provided in the spec queue.
     *
     * @protected
     * @returns {Array<Function>}
     *
     * @memberOf BlendRunner
     */
    protected createExecutionPlan(): Array<Function> {
        var me = this,
            ep: Array<Function> = [];

        me.autoQueue();

        for (var specId in me.testQueue) {
            var spec = me.specs[specId];

            // set startup time spec
            ep.push(me.processDuration('start', specId, null));

            // invoke the spec before
            if (spec.beforeFn) {
                ep.push(me.createInvoker(specId, null, 'before', spec.beforeFn));
            }

            me.testQueue[specId].forEach(function(testId: string) {
                var testSpec: ICallable = me.specs[specId].testSpecs[testId];

                // set the startup time of the test
                ep.push(me.processDuration('start', specId, testId));

                // set the before each of the test
                if (spec.beforeEachFn) {
                    ep.push(me.createInvoker(specId, testId, 'before-each', spec.beforeEachFn));
                }

                // set the test
                ep.push(me.createInvoker(specId, testId, 'test', testSpec));

                // set the after each of the test
                if (spec.afterEachFn) {
                    ep.push(me.createInvoker(specId, testId, 'after-each', spec.afterEachFn));
                }

                // set the end time of the test
                ep.push(me.processDuration('end', specId, testId));
            });

            // set the after of the spec
            if (spec.afterFn) {
                ep.push(me.createInvoker(specId, null, 'after', spec.afterFn));
            }

            // set the after time of the spec
            ep.push(me.processDuration('end', specId, null));
        }
        return ep;
    }

    /**
     * Creates a progress notification event by getting the progress information
     * from the executor and augmenting it with the currently running TSpecification
     * stage.
     *
     * @protected
     * @param {number} pct
     * @param {number} current
     * @param {number} total
     *
     * @memberOf BlendRunner
     */
    protected notifyProgress(pct: number, current: number, total: number) {
        var me = this,
            mkStage = function(
                pct: number,
                current: number,
                total: number,
                specId: string,
                testId: string,
                stage: string,
                description: string
            ): IProgress {
                return {
                    total: total || 0,
                    pct: Math.round(pct || 0),
                    current: current || 0,
                    specId: specId || null,
                    testId: testId || null,
                    stage: stage || null,
                    description: description || null
                };
            };

        me.currentProgress.pct = Math.round(pct); // round the numbers
        me.currentProgress.current = current;
        me.currentProgress.total = total;
        me.notify(
            eStatus.EVENT_PROGRESS,
            mkStage(
                pct,
                current,
                total,
                me.currentProgress.specId,
                me.currentProgress.testId,
                me.currentProgress.stage,
                me.currentProgress.description
            )
        );
    }

    /**
     * Run the specified tests.
     *
     * @param {Function} [done]
     * @param {number} [defaultTimeout]
     * @memberof BlendRunner
     */
    public run(done?: Function, defaultTimeout?: number) {
        var me = this,
            nextItem = 0,
            currentItem = -1,
            step: number,
            timeoutChecker: any,
            timeoutAmount: number,
            currentPct: number = 0,
            plan: Array<Function> = me.createExecutionPlan();

        defaultTimeout = defaultTimeout || 5000; // 10 seconds!
        timeoutAmount = defaultTimeout;
        step = plan.length / 100;

        /**
         * Setup the done function
         */
        me.done = function() {
            currentPct += step;
            nextItem++;
            me.notifyProgress(currentPct, nextItem, plan.length);
            setTimeout(function() {
                runNext();
            }, 1);
        };

        /**
         * Setup the setTimeout utility function to act inside test test context
         */
        me.setTimeout = function(value: number) {
            timeoutAmount = value;
        };

        var runNext = function() {
            var exeItem = plan[nextItem] || null;
            if (exeItem) {
                me.notifyProgress(currentPct, nextItem, plan.length);
                if (currentItem !== nextItem) {
                    currentItem = nextItem;
                    if (timeoutChecker) {
                        clearTimeout(timeoutChecker);
                    }
                    timeoutChecker = setTimeout(function() {
                        var spec: ICallable = me.specs[me.currentSpecId].testSpecs[me.currentTestId];
                        me.timedout();
                        clearTimeout(timeoutChecker);
                        me.done();
                    }, timeoutAmount);
                    exeItem.apply(me, [me]);
                }
            } else {
                clearTimeout(timeoutChecker);
                if (me.is_function(done)) {
                    done();
                } else {
                    console.log('All done');
                }
            }
        };

        // kick-off the current run
        showPlash();
        runNext();
    }

    /**
     * Clear the current test queue.
     *
     * @memberOf BlendRunner
     */
    public clearQueue() {
        var me = this;
        me.testQueue = {};
    }

    /**
     * Gets a new ID
     *
     * @protected
     * @returns {number}
     * @memberof BlendRunner
     */
    protected newID(): number {
        return ++this.ID;
    }

    /**
     * Queues all the test in the specs.
     *
     * @memberOf BlendRunner
     */
    public queueAllTests() {
        var me = this,
            specs = Object.keys(me.specs);
        specs.forEach(function(specId: string) {
            var tests = Object.keys(me.specs[specId].testSpecs);
            if (tests.length > 0) {
                tests.forEach(function(testId: string) {
                    me.queueTest(specId, testId);
                });
            }
        });
    }

    /**
     * Added a single test to the queue.
     *
     * @param {string} specId
     * @param {string} testId
     *
     * @memberOf BlendRunner
     */
    public queueTest(specId: string, testId: string) {
        var me = this,
            spec: ITestSpecification,
            test: ICallable;

        spec = me.specs[specId] || null;
        if (spec) {
            test = spec.testSpecs[testId] || null;
            if (test) {
                if (!me.testQueue[specId]) {
                    me.testQueue[specId] = [];
                }
                me.testQueue[specId].push(testId);
            }
        }
    }

    /**
     * Resets the counters and empties the logs of the test specifications.
     *
     * @memberof BlendRunner
     */
    public reset() {
        var me = this;
        for (var specId in me.specs) {
            var spec = me.specs[specId];
            spec.numAsserts = 0;
            spec.numAssertsFailed = 0;
            spec.numAssertsPassed = 0;
            spec.numTests = 0;
            spec.numTestsFailed = 0;
            spec.numTestsPassed = 0;
            for (var testId in spec.testSpecs) {
                var test = spec.testSpecs[testId];
                test.assertLog = [];
                test.numAsserts = 0;
                test.numFailed = 0;
                test.numPassed = 0;
            }
        }
    }

    /**
     * General event consumer registration function.
     *
     * @protected
     * @param {string} eventName
     * @param {Function} handler
     * @param {*} scope
     *
     * @memberOf BlendRunner
     */
    protected on(eventName: string, handler: Function, scope: any) {
        var me = this;
        if (!me.events[eventName]) {
            me.events[eventName] = [];
        }
        me.events[eventName].push({
            scope: scope,
            fn: handler
        });
    }

    /**
     * Checks if a given status is at starting point of a test definition
     *
     * @param {IAssertStatus} status
     * @returns {boolean}
     * @memberof BlendRunner
     */
    public isTestSuiteStart(status: IAssertStatus): boolean {
        var me = this;
        return status.stage === 'start' && !me.is_null(status.specId) && me.is_null(status.test);
    }

    /**
     * Checks if a given status is at ending point of a test definition
     *
     * @param {IAssertStatus} status
     * @returns {boolean}
     * @memberof BlendRunner
     */
    public isTestSuiteEnd(status: IAssertStatus): boolean {
        var me = this;
        return status.stage === 'end' && !me.is_null(status.specId) && me.is_null(status.test);
    }

    /**
     * Checks if a given status is at the starting point of a test
     *
     * @param {IAssertStatus} status
     * @returns {boolean}
     * @memberof BlendRunner
     */
    public isTestStart(status: IAssertStatus): boolean {
        var me = this;
        return status.stage === 'start' && !me.is_null(status.test) && !me.is_null(status.test);
    }

    /**
     * Checks if a given status is at the starting point of a test
     *
     * @param {IAssertStatus} status
     * @returns {boolean}
     * @memberof BlendRunner
     */
    public isTestEnd(status: IAssertStatus): boolean {
        var me = this;
        return (
            (status.stage === 'end' || status.stage === 'timeout') &&
            !me.is_null(status.test) &&
            !me.is_null(status.test)
        );
    }

    /**
     * Provides a hook to receive progress event notification
     *
     * @param {(stage: IProgress) => any} handler
     * @param {*} [scope]
     *
     * @memberOf BlendRunner
     */
    public onProgress(handler: (stage: IProgress) => any, scope?: any) {
        var me = this;
        me.on(eStatus.EVENT_PROGRESS, handler, scope || me);
    }

    /**
     * Provides a hook to receive stage execution information.
     * This event can be used to see if the before/beforeEach/afterEach/after stages did run without
     * error.
     *
     * @param {(status: TExecutionStageStatus) => any} handler
     * @param {*} scope
     *
     * @memberOf BlendRunner
     */
    public onExecutionStageStatus(handler: (status: IExecutionStageStatus) => any, scope?: any) {
        var me = this;
        me.on(eStatus.EVENT_EXECUTION_STAGE_STATUS, handler, scope || me);
    }

    /**
     * Provides a hook to receive assertion progress information.
     *
     * @param {(status: tAssertStatus) => any} handler
     * @param {*} [scope]
     *
     * @memberOf BlendRunner
     */
    public onAssertStatus(handler: (status: IAssertStatus) => any, scope?: any) {
        var me = this;
        me.on(eStatus.EVENT_ASSERT_STATUS, handler, scope || me);
    }

    /**
     * General event notification function.
     *
     * @protected
     * @param {string} eventName
     * @param {...Array<any>} args
     *
     * @memberOf BlendRunner
     */
    protected notify(eventName: string, ...args: Array<any>) {
        var me = this;
        if (me.events[eventName]) {
            me.events[eventName].forEach(function(handler: { scope: any; fn: Function }) {
                window.requestAnimationFrame(function() {
                    handler.fn.apply(handler.scope, args);
                });
            });
        }
    }

    /**
     * Creates an execution stage status event.
     *
     * @protected
     * @param {string} stage
     * @param {string} specId
     * @param {string} testId
     *
     * @memberOf BlendRunner
     */
    protected notifyExecutionStageStatus(stage: string, error: Error, status: string, specId: string, testId: string) {
        var me = this,
            spec = me.specs[specId],
            test = me.specs[specId].testSpecs[testId] || null;
        me.notify(eStatus.EVENT_EXECUTION_STAGE_STATUS, {
            error: error,
            status: status,
            stage: stage,
            spec: spec,
            test: test,
            testId: testId,
            specId: specId
        });
    }

    /**
     * Opens a URL and tries to execute a remote function that
     * should run tests. The remote function is called using BlendRunner
     * as the `t` parameter.
     *
     * The `remoteGlobalFunction`, `app`, `test`, or #<name>
     * are names of the potential functions that is going to be called.
     *
     * @param {string} url
     * @param {string} [remoteGlobalFunction]
     * @memberof BlendRunner
     */
    public itRemote(testName: string, url: string, remoteGlobalFunction?: string) {
        var me = this;
        me.openUrl(
            url,
            (t: IAssertionProvider, win: Window) => {
                /**
                 * Try to find an exported function named `remoteGlobalFunction` or the #hash.
                 * Otherwise an exported object either called (app|test|bundle) containing
                 * a function called `remoteGlobalFunction` or the #hash
                 */
                var ctx: any = win,
                    hash = win.location.hash.replace('#', ''),
                    fn = ctx[remoteGlobalFunction] || ctx['app'] || ctx['test'] || ctx['bundle'] || ctx[hash] || null;
                if (me.is_function(fn)) {
                    fn.apply(ctx, [t]);
                } else if (me.is_object(fn) && me.is_function(fn[hash])) {
                    fn[hash].apply(ctx, [t]);
                }
            },
            testName
        );
    }

    /**
     * Opens a URL in a new tab and passed the window content of the url
     *
     * @param {string} url
     * @param {(t: IAssertionProvider, win: Window) => any} callable
     * @memberof BlendRunner
     */
    public openUrl(url: string, callable: (t: IAssertionProvider, win: Window) => any, testName?: string) {
        var me = this,
            windowHasErrors: boolean = false;
        me.it(testName || url, function(t: IAssertionProvider) {
            url = url || 'about:blank';
            var orgDone = t.done;
            var win = window.open(url, '_blank');
            win.addEventListener('error', function(evt: ErrorEvent) {
                t.assertEqual(
                    JSON.stringify(
                        {
                            message: evt.message,
                            fileName: evt.filename,
                            LineNumber: evt.lineno,
                            ColumnNumber: evt.colno,
                            Error: evt.error
                        },
                        null,
                        2
                    ),
                    ''
                );
                windowHasErrors = true;
                t.done();
                return false;
            });
            t.assertExists(win, `${url} was not blocked.`);
            t.done = function() {
                setTimeout(function() {
                    if (win && !windowHasErrors) {
                        win.close();
                        win = null;
                    }
                    t.done = orgDone;
                    orgDone.apply(t, []);
                }, 300);
            };
            if (url === 'about:blank') {
                callable(t, win);
            } else {
                win.addEventListener('load', function() {
                    callable(t, win);
                });
            }
        });
    }

    /**
     * The BDD "it should" describer function. Use this function to perform actual tests.
     *
     * @param {string} testName
     * @param {((t: IFinishable & TAssertionProvider) => any)} callable
     *
     * @memberOf BlendRunner
     */
    public it(testName: string, callable: (t: IAssertionProvider) => any) {
        var me = this;
        me.currentSpec.testSpecs[me.newID()] = {
            name: testName,
            fn: function(t: IAssertionProvider) {
                var spec = me.specs[me.currentSpecId];
                var test = me.specs[me.currentSpecId].testSpecs[me.currentTestId];
                try {
                    if (spec.beforeEachStatus === 'error') {
                        throw new Error(
                            `The "test" stage of [${test.name}] will not run because the "before each" stage of [${
                                test.name
                            }] did not finish successfully!`
                        );
                    } else {
                        callable(t);
                        me.notifyExecutionStageStatus('test', null, 'ok', me.currentSpecId, me.currentTestId);
                    }
                } catch (e) {
                    me.notifyExecutionStageStatus('test', e, 'error', me.currentSpecId, me.currentTestId);
                    me.done();
                }
            },
            assertLog: [],
            numAsserts: 0,
            numFailed: 0,
            numPassed: 0
        };
    }

    /**
     * The BDD before each function. The callable provided here will be called before each test.
     *
     * @param {(t: IFinishable) => any} callable
     *
     * @memberOf BlendRunner
     */
    public beforeEach(callable: (t: IFinishable) => any) {
        var me = this;
        me.currentSpec.beforeEachFn = {
            name: 'before each',
            fn: function(t: IFinishable) {
                var spec = me.specs[me.currentSpecId];
                var test = me.specs[me.currentSpecId].testSpecs[me.currentTestId];
                try {
                    if (spec.beforeStatus === 'error') {
                        throw new Error(
                            `The "before each" stage of [${test.name}] will not run because the "before" stage of [${
                                spec.name
                            }] did not finish successfully!`
                        );
                    } else {
                        callable(t);
                        spec.beforeEachStatus = 'ok';
                        me.notifyExecutionStageStatus(
                            'before-each',
                            null,
                            spec.beforeEachStatus,
                            me.currentSpecId,
                            me.currentTestId
                        );
                    }
                } catch (e) {
                    spec.beforeEachStatus = 'error';
                    me.notifyExecutionStageStatus(
                        'before-each',
                        e,
                        spec.beforeEachStatus,
                        me.currentSpecId,
                        me.currentTestId
                    );
                    me.done();
                }
            }
        };
    }

    /**
     * The BDD after each function. The callable provided here will be called after each test.
     *
     * @param {(t: IFinishable) => any} callable
     *
     * @memberOf BlendRunner
     */
    public afterEach(callable: (t: IFinishable) => any) {
        var me = this;
        me.currentSpec.afterEachFn = {
            name: 'after each',
            fn: function(t: IFinishable) {
                var spec = me.specs[me.currentSpecId];
                var test = me.specs[me.currentSpecId].testSpecs[me.currentTestId];
                try {
                    if (spec.beforeEachStatus === 'error') {
                        throw new Error(
                            `The "after each" stage of [${
                                test.name
                            }] will not run because the "before each" stage of [${
                                test.name
                            }] did not finish successfully!`
                        );
                    } else {
                        callable(t);
                        spec.afterEachStatus = 'ok';
                        me.notifyExecutionStageStatus(
                            'after-each',
                            null,
                            spec.afterEachStatus,
                            me.currentSpecId,
                            me.currentTestId
                        );
                    }
                } catch (e) {
                    spec.afterEachStatus = 'error';
                    me.notifyExecutionStageStatus(
                        'after-each',
                        e,
                        spec.afterEachStatus,
                        me.currentSpecId,
                        me.currentTestId
                    );
                    me.done();
                }
            }
        };
    }

    /**
     * The DBB after function. The callable provided here will be called after all the tests.
     *
     * @param {(t: IFinishable) => any} callable
     *
     * @memberOf BlendRunner
     */
    public after(callable: (t: IFinishable) => any) {
        var me = this;
        me.currentSpec.afterFn = {
            name: 'after',
            fn: function(t: IFinishable) {
                var spec = me.specs[me.currentSpecId];
                try {
                    if (spec.beforeStatus === 'error') {
                        throw new Error(
                            `The "after" stage of [${spec.name}] will not run because the "before" stage of [${
                                spec.name
                            }] did not finish successfully!`
                        );
                    } else {
                        callable(t);
                        spec.afterStatus = 'ok';
                        me.notifyExecutionStageStatus(
                            'after',
                            null,
                            spec.afterStatus,
                            me.currentSpecId,
                            me.currentTestId
                        );
                    }
                } catch (e) {
                    spec.afterStatus = 'error';
                    me.notifyExecutionStageStatus('after', e, spec.afterStatus, me.currentSpecId, me.currentTestId);
                    me.done();
                }
            }
        };
    }

    /**
     * The BDD before function. The callable provided to here will be ran before every test.
     *
     * @param {(t: IFinishable) => any} callable
     *
     * @memberOf BlendRunner
     */
    public before(callable: (t: IFinishable) => any) {
        var me = this;
        me.currentSpec.beforeFn = {
            name: 'before',
            fn: function(t: IFinishable) {
                var spec = me.specs[me.currentSpecId];
                try {
                    callable(t);
                    spec.beforeStatus = 'ok';
                    me.notifyExecutionStageStatus(
                        'before',
                        null,
                        spec.beforeStatus,
                        me.currentSpecId,
                        me.currentTestId
                    );
                } catch (e) {
                    spec.beforeStatus = 'error';
                    me.notifyExecutionStageStatus('before', e, spec.beforeStatus, me.currentSpecId, me.currentTestId);
                    me.done();
                }
            }
        };
    }

    /**
     * The BDD describe function. The specFunction provided here can be used to invoke the
     * it, before, after, beforeEach, and afterEach BDD functions
     *
     * @param {string} specName
     * @param {(t: TBddProvider) => any} specFunction
     *
     * @memberOf BlendRunner
     */
    public describe(specName: string, specFunction: (t: ITestDescription) => any): any {
        var me = this,
            testSpec: ITestSpecification = {
                name: specName,
                beforeFn: null,
                afterFn: null,
                beforeEachFn: null,
                afterEachFn: null,
                testSpecs: {}
            };

        me.currentSpec = testSpec;
        specFunction.apply(me, [me]);
        me.specs[me.newID()] = testSpec;
        me.currentSpec = null;
    }
}
