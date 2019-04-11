import { Component, IComponentConfig } from "@blendsdk/core";
import { Field } from "./Field";

/**
 * Interface for describing a Field validation result.
 *
 * @export
 * @interface IValidationResult
 */
export interface IValidationResult {
	error: boolean;
	errorMessage: string;
	validator: FieldValidator;
}

/**
 * Validation task function signature.
 */
export type TValidationTask = (done: (result: IValidationResult) => any) => any;

/**
 * Interface form configuring a field validator
 *
 * @interface IFieldValidatorConfig
 * @extends {ICoreComponentConfig}
 */
export interface IFieldValidatorConfig extends IComponentConfig {
    /**
     * Option to configure the form-field to validate.
     *
     * @type {Field}
     * @memberof IFieldValidatorConfig
     */
	formComponent?: Field;
    /**
     * Error message to provide if the validation has failed.
     *
     * @type {string}
     * @memberof IFieldValidatorConfig
     */
	errorMessage?: string;
}

/**
 * Base class for implementing a field validator
 *
 * @export
 * @abstract
 * @class FieldValidator
 * @extends {Blend.core.Component}
 */
export abstract class FieldValidator extends Component {
    /**
     * @override
     * @protected
     * @type {IFieldValidatorConfig}
     * @memberof FieldValidator
     */
	protected config: IFieldValidatorConfig;
    /**
     * Reference to the form field that is being validated.
     *
     * @protected
     * @type {Field}
     * @memberof FieldValidator
     */
	protected formComponent: Field;
    /**
     * Abstract method that is going to provide the actual validation task.
     *
     * @abstract
     * @returns {TTask}
     * @memberof FieldValidator
     */
	public abstract getValidationTask(): TValidationTask;

    /**
     * Creates an instance of Validation.
     * @param {IFieldValidatorConfig} [config]
     * @memberof FieldValidator
     */
	public constructor(config?: IFieldValidatorConfig) {
		super(config);
		const me = this;
		me.setFieldComponent(me.config.formComponent || null);
	}

    /**
     * Sets a validation error.
     *
     * @param {IValidationResult} error
     * @memberof FieldValidator
     */
	public setError(error: IValidationResult) {
		const me = this;
		me.formComponent.setError(error);
	}

    /**
     * Clear the validation errors.
     *
     * @memberof FieldValidator
     */
	public clearError() {
		const me = this;
		me.formComponent.clearErrors();
	}

    /**
     * Sets the form component to is going to be validated.
     *
     * @param {Blend.form.Field<any>} field
     * @memberof FieldValidator
     */
	public setFieldComponent(field: Field) {
		const me = this;
		me.formComponent = field;
	}
}
