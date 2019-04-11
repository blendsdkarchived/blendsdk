import { Blend, Component, IComponentConfig } from "@blendsdk/core";
import { TaskRunner } from "@blendsdk/task";
import { Field } from "./Field";
import { FieldValidator, IValidationResult } from "./FieldValidator";

/**
 * Interface for configuring a form validator instance.
 *
 * @interface IFormValidator
 * @extends {IComponentConfig}
 */
interface IFormValidator extends IComponentConfig {
	items?: Field | FieldValidator | Array<Field | FieldValidator>;
}

/**
 * This class provides a method for validating form fields.
 *
 * @export
 * @class FormValidator
 * @extends {Component}
 */
export class FormValidator extends Component {
    /**
     * @override
     * @protected
     * @type {IFormValidator}
     * @memberof FormValidator
     */
	protected config: IFormValidator;
    /**
     * Array of validators.
     *
     * @protected
     * @type {FieldValidator[]}
     * @memberof FormValidator
     */
	protected validators: FieldValidator[];

    /**
     * Creates an instance of FormValidator.
     * @param {IFormValidator} [config]
     * @memberof FormValidator
     */
	public constructor(config?: IFormValidator) {
		super(config);
		const me = this;
		me.validators = [];
		me.addValidator(me.config.items);
	}

    /**
     * Adds a field validator to this FormValidator instance.
     *
     * @param {(Field | FieldValidator | Array<Field | FieldValidator>)} validator
     * @memberof FormValidator
     */
	public addValidator(validator: Field | FieldValidator | Array<Field | FieldValidator>) {
		const me = this,
			items = Blend.wrapInArray(validator || []);
		items.forEach(item => {
			if (Blend.isInstanceOf(item, Field)) {
				(item as Field).getValidators().forEach(v => {
					me.validators.push(v);
				});
			} else if (Blend.isInstanceOf(item, FieldValidator)) {
				me.validators.push(item as FieldValidator);
			} else {
				throw Error("Invalid validator!");
			}
		});
	}

    /**
     * Clears the current errors from all the validators.
     *
     * @memberof FormValidator
     */
	public clearErrors() {
		const me = this;
		me.validators.forEach(item => {
			item.clearError();
		});
	}

    /**
     * Initiates a validation task.
     *
     * @param {(result: IValidationResult[]) => any} done
     * @memberof FormValidator
     */
	public validate(done: (result: IValidationResult[]) => any) {
		const me = this,
			taskRunner = new TaskRunner(),
			res: IValidationResult[] = [];
		me.validators.forEach((item: FieldValidator) => {
			taskRunner.addTask((taskDone: (stop: boolean) => any) => {
				const task = item.getValidationTask();

				task((result: IValidationResult) => {
					if (result.error) {
						result.validator.setError(result);
						res.push(result);
						taskDone(true);
					} else {
						taskDone(false);
					}
				});
			});
		});
		taskRunner.run(() => {
			done(res);
		});
	}
}
