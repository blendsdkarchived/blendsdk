import { Component, IComponentConfig, TFunction } from "@blendsdk/core";

/**
 * Describes a task function type to be used in
 * Blend.task.TaskRunner
 * @type
 */
export type TTask = (taskDone: (stop?: boolean) => any) => any;

/**
 * Interface for configuring a TaskRunner
 *
 * @interface ITaskRunnerConfig
 * @extends {ICoreComponentConfig}
 */
export interface ITaskRunnerConfig extends IComponentConfig {
    /**
     * Option to configure the task runner to stop
     * when a task returns false. This is false by
     * default
     *
     * @type {boolean}
     * @memberof ITaskRunnerConfig
     */
    stopAtErrors: boolean;
}

/**
 * A simple sequential task runner component.
 *
 * @export
 * @class TaskRunner
 * @extends {Component<ITaskRunnerConfig>}
 */
export class TaskRunner extends Component {
    /**
     * @override
     * @protected
     * @type {ITaskRunnerConfig}
     * @memberof TaskRunner
     */
    protected config: ITaskRunnerConfig;
    /**
     * A queue/list of task to be run.
     *
     * @protected
     * @type {Array<TFunction>}
     * @memberof TaskRunner
     */
    protected taskQueue: TFunction[] = [];

    /**
     * Creates an instance of TaskRunner.
     * @param {ITaskRunnerConfig} [config]
     * @memberof TaskRunner
     */
    public constructor(config?: ITaskRunnerConfig) {
        super(config);
        this.configDefaults({
            stopAtErrors: false
        } as ITaskRunnerConfig);
    }

    /**
     * Adds a task to the tasks queue.
     *
     * @param {TTask} task
     * @returns {this}
     * @memberof TaskRunner
     */
    public addTask(task: TTask): this {
        const me = this;
        me.taskQueue.push((done: (stop: boolean) => void) => {
            task(done);
        });
        return me;
    }

    /**
     * Creates a sequential chain of functions containing
     * each task in a call segment.
     *
     * @protected
     * @param {TTask} task
     * @param {TFunction} chain
     * @returns {TFunction}
     * @memberof TaskRunner
     */
    protected chainTask(task: TTask, chain: (stop: boolean) => void): TFunction {
        const me = this;
        return (stopChain: boolean) => {
            if (me.config.stopAtErrors) {
                if (stopChain !== true) {
                    task(chain);
                } else {
                    chain(stopChain);
                }
            } else {
                task(chain);
            }
        };
    }

    /**
     * Runs a tasks queue and finally calls the `done` callback
     *
     * @param {TFunction} [done]
     * @memberof TaskRunner
     */

    public run(done?: TFunction) {
        const me = this;
        done = done || (() => {});

        let chain: TFunction = () => {
            done();
        };

        // Adds the `done` function as the last task
        me.addTask((doneTask: TFunction) => {
            doneTask();
        });

        // creates a method chain
        me.taskQueue.reverse().forEach((item: TTask) => {
            chain = me.chainTask(item, chain as any);
        });

        // run the chain
        chain();
    }
}
