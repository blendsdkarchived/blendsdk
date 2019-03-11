import { Component, IComponentConfig } from "@blendsdk/core";
import { TTask } from "@blendsdk/task";
import { UIComponent } from "@blendsdk/ui";

/**
 * Interface form configuring a form and a form-field validator.
 *
 * @interface IFormValidatorConfig
 * @extends {ICoreComponentConfig}
 */
export interface IFormValidatorConfig extends IComponentConfig {
    /**
     * Option to configure the form-field to validate.
     *
     * @type {UIComponent}
     * @memberof IFormValidatorConfig
     */
    formComponent?: UIComponent;
}

/**
 * Base class for implementing a form or a form-field Validator.
 *
 * @export
 * @abstract
 * @class Validator
 * @extends {Blend.core.Component}
 */
export abstract class Validator extends Component {
    /**
     * @override
     * @protected
     * @type {IFormValidatorConfig}
     * @memberof Validator
     */
    protected config: IFormValidatorConfig;
    /**
     * Reference to the form field that is being validated.
     *
     * @protected
     * @type {UIComponent}
     * @memberof Validator
     */
    protected formComponent: UIComponent;
    /**
     * Abstract method that is going to provide the actual validation task.
     *
     * @abstract
     * @returns {TTask}
     * @memberof Validator
     */
    public abstract getValidationTask(): TTask;

    /**
     * Creates an instance of Validation.
     * @param {IFormValidatorConfig} [config]
     * @memberof Validator
     */
    public constructor(config?: IFormValidatorConfig) {
        super(config);
        const me = this;
        me.setFieldComponent(me.config.formComponent || null);
    }

    /**
     * Sets the form component to is going to be validated.
     *
     * @param {Blend.form.Field<any>} field
     * @memberof Validator
     */
    public setFieldComponent(field: UIComponent) {
        const me = this;
        me.formComponent = field;
    }
}
