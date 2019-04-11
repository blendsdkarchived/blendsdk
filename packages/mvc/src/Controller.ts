import { Blend, IDictionary, TFunction } from "@blendsdk/core";
import { IReferenceContainerConfig, ReferenceContainer } from "./ReferenceContainer";
import { TComponentEventHandler } from "./Types";

/**
 * Interface for configuring an MVC Controller instance
 *
 * @interface IControllerConfig
 * @extends {ICoreComponentConfig}
 */
export interface IControllerConfig extends IReferenceContainerConfig {
    /**
     * Option to register a Controller with a global ID so
     * it can be used to retrieve the instance of an MVC Controller
     *
     * @type {string}
     * @memberof IController
     */
	globalID?: string;
}

// tslint:disable-next-line:no-namespace
export namespace Mvc {
    /**
     * Dictionary of global controllers
     */
	const globalControllers: IDictionary = {};
    /**
     * Register a controller to it can be retrieved globally by an ID
     *
     * @export
     * @param {string} id
     * @param {Blend.mvc.Controller} controller
     */
	export function registerController(id: string, controller: Controller) {
		if (globalControllers[id] === undefined) {
			globalControllers[id] = controller;
		} else {
			throw new Error(id + " controller is already registered globally!");
		}
	}

    /**
     * Retrieved a global controller by its ID.
     *
     * @export
     * @template T
     * @param {string} id
     * @returns {T}
     */
	export function getController<T extends Controller>(id: string): T {
		return globalControllers[id] || null;
	}
}

/**
 * Base class for implementing an MVC Controller
 *
 * @export
 * @abstract
 * @class Controller
 * @extends {Blend.core.Component}
 */
export abstract class Controller extends ReferenceContainer {
    /**
     * @override
     * @protected
     * @type {IMVCComponentConfig}
     * @memberof Controller
     */
	protected config: IControllerConfig;

    /**
     * Creates an instance of Controller.
     * @param {IControllerConfig} [config]
     * @memberof Controller
     */
	public constructor(config?: IControllerConfig) {
		super(config);
		const me = this;
		me.configDefaults({
			globalID: null
		} as IControllerConfig);
		if (me.config.globalID) {
			Mvc.registerController(me.config.globalID, me);
		}
	}

    /**
     * Creates an action outlet for this controller.
     *
     * @param {string} actionName
     * @returns {Function}
     * @memberof Controller
     */
	public createAction(action: string | TFunction): TComponentEventHandler {
		const me = this;
		let actionName: string;

		if (Blend.isString(action)) {
			actionName = action as string;
		} else if (Blend.isFunction(action) && Blend.isFunction((action as any).getMethodName)) {
			actionName = (action as any).getMethodName();
		}

		action = (me as any)[actionName] || null;
		if (action && Blend.isFunction(action)) {
			// tslint:disable-next-line:only-arrow-functions
			return function () {
				me.applyMethod(actionName, Blend.argumentsToArray(arguments));
			};
		} else {
			throw new Error(
				"This controller does not implement the action: " +
				actionName +
				// tslint:disable-next-line:max-line-length
				"\nDoes the function exist? Did you forget to annotate it with @controllerAction and make it public?"
			);
		}
	}
}
