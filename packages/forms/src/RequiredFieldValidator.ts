import { Blend } from "@blendsdk/core";
import { FieldValidator, IValidationResult, TValidationTask } from "./FieldValidator";

/**
 * This class implements a validator that checks whether the
 * Field has a value or it is empty.
 *
 * @export
 * @class RequiredFieldValidator
 * @extends {FieldValidator}
 */
export class RequiredFieldValidator extends FieldValidator {
    /**
     * @override
     * @returns {TValidationTask}
     * @memberof RequiredValidator
     */
	public getValidationTask(): TValidationTask {
		const me = this,
			value = me.formComponent.getValue();
		// FIXME: Add Blend.t for translations!
		return (done: (result: IValidationResult) => any) => {
			done({
				validator: me,
				error: Blend.isNullOrUndef(value) || `${value}`.trim().length === 0,
				errorMessage: me.config.errorMessage || `${me.formComponent.getLabel()} is required!`
			});
		};
	}
}
