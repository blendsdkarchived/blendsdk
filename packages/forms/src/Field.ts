import { Blend } from "@blendsdk/core";
import { IUIComponentConfig, UIComponent } from "@blendsdk/ui";
import { FieldValidator, IValidationResult } from "./FieldValidator";

/**
 * Field:
 * 		- set value
 * 		- get value
 * 		- validate the value
 * 		- get validation errors
 * 		- participate in a form
 * 		- enable/disable
 * 		- parse the given value to the internal HTML UI
 * 		- get the given value from the internal HTML UI
 * 		- set a label
 * 		- get a label
 * 		- does the validation both by setting the value programmatically and by the user interaction
 * 		- has API to perform validation
 */

/**
 * Interface for configuring a Field instance.
 *
 * @export
 * @interface IUIFieldConfig
 * @extends {IUIComponentConfig}
 */
export interface IUIFieldConfig extends IUIComponentConfig {
    /**
     * Option to configure the name of the component.
     * This corresponds to the name value of the HTML input element.
     *
     * @type {string}
     * @memberof IUIFormFieldConfig
     */
	name?: string;
    /**
     * Option to configure the value of a form Field.
     *
     * @type {any}
     * @memberof IUIFormFieldConfig
     */
	value?: any;
    /**
     * Option to configure the text label of a form Field.
     *
     * @type {string}
     * @memberof IUIFormFieldConfig
     */
	label?: string;
    /**
     * Option to configure an help text for this field.
     *
     * Please note: This option is not implemented on every form
     * component.
     *
     * @type {string}
     * @memberof IUIFieldConfig
     */
	helpText?: string;
    /**
     * Option to configure the validators for this form Field.
     *
     * @type {(FieldValidator | FieldValidator[])}
     * @memberof IUIFieldConfig
     */
	validators?: FieldValidator | FieldValidator[];
}

/**
 * Form field CSS rules
 *
 * @enum {number}
 */
export enum eFormFieldCSS {
	ST_HAS_LABEL = "b-has-label",
	ST_HAS_VALUE = "b-has-value",
	EL_ACTIVE = "b-active",
	EL_FORM_FIELD = "b-form-field",
	ST_ANIMATIONS = "b-anim",
	ST_INVALID = "b-invalid"
}

/**
 * TODO:1092 Provide class description for Field
 *
 * @export
 * @abstract
 * @class Field
 * @extends {Blend.ui.Component}
 */
export abstract class Field extends UIComponent {
    /**
     * @override
     * @protected
     * @type {IUIFieldConfig}
     * @memberof Field
     */
	protected config: IUIFieldConfig;
    /**
     * Reference to the input element used in this component.
     *
     * @protected
     * @type {HTMLInputElement}
     * @memberof Field
     */
	protected inputElement: HTMLInputElement = null;
    /**
     * References to an element holding help/informational text
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Field
     */
	protected helpElement: HTMLElement;
    /**
     * References to an element holding the error message(s)
     * for this field.
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Field
     */
	protected errorElement: HTMLElement;
    /**
     * Reference to the label element.
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Field
     */
	protected labelElement: HTMLElement = null;
    /**
     * A collection of instantiated validators fro the Field
     * component.
     *
     * @protected
     * @type {FieldValidator[]}
     * @memberof Field
     */
	protected validators: FieldValidator[];
    /**
     * Reference to the current validation state.
     *
     * @protected
     * @type {boolean}
     * @memberof Field
     */
	protected validationState: boolean;

    /**
     * Sets the error validation result on this Field.
     *
     * @param {IValidationResult} result
     * @memberof Field
     */
	public setError(result: IValidationResult) {
		throw new Error("Not Implemented Yet");
	}

    /**
     * Clears the current validation errors from this Field.
     *
     * @memberof Field
     */
	public clearErrors() {
		throw new Error("Not Implemented Yet");
	}

    /**
     * Creates an instance of Field.
     * @param {IUIFieldConfig} [config]
     * @memberof Field
     */
	public constructor(config?: IUIFieldConfig) {
		super(config);
		const me = this;
		me.configDefaults({
			value: null,
			label: "",
			name: null,
			validators: []
		} as IUIFieldConfig);
		me.validators = [];
	}

    /**
     * @override
     * @protected
     * @memberof Field
     */
	protected initComponent() {
		const me = this;
		super.initComponent();
		Blend.wrapInArray(me.config.validators || []).forEach((validator: FieldValidator) => {
			if (!Blend.isInstanceOf(validator, FieldValidator)) {
				throw new Error(`${validator} is not a valid Validator component!`);
			} else {
				validator.setFieldComponent(me);
				me.validators.push(validator);
			}
		});
	}

    /**
     * Gets an array of current validators of this Component.
     *
     * @returns {FieldValidator[]}
     * @memberof Field
     */
	public getValidators(): FieldValidator[] {
		return this.isDisabled ? [] : this.validators || [];
	}

    /**
     * Gets the help text of this Component.
     *
     * @returns {string}
     * @memberof Field
     */
	public getHelpText(): string {
		return this.config.helpText;
	}

    /**
     * Sets the help text of this Component.
     *
     * @param {string} value
     * @memberof Field
     */
	public setHelpText(value: string) {
		const me = this;
		me.config.helpText = value;
		if (me.isRendered && me.helpElement) {
			me.helpElement.textContent = value;
		}
	}

    /**
     * Set the label value of this Field.
     *
     * @param {string} value
     * @memberof Field
     */
	public setLabel(value: string) {
		const me = this;
		me.config.label = value;
		if (me.isRendered && me.labelElement) {
			me.labelElement.textContent = value || "";
			me.el.classList.set(eFormFieldCSS.ST_HAS_LABEL, value ? true : false);
		}
	}

    /**
     * Gets the label of this Field.
     *
     * @returns {string}
     * @memberof Field
     */
	public getLabel(): string {
		return this.config.label;
	}

    /**
     * Internal method for assigning the provided value
     * to the internal `inputElement`
     *
     * @protected
     * @param {*} value
     * @memberof Field
     */
	protected setValueInternal(value: any) {
		const me = this;
		me.inputElement.value = value;
		me.el.classList.set(eFormFieldCSS.ST_HAS_VALUE, me.hasValue());
	}

    /**
     * Sets the value of this Field.
     *
     * @param {*} value
     * @memberof Field
     */
	public setValue(value: any) {
		const me = this;
		me.config.value = value;
		if (me.isRendered) {
			me.setValueInternal(value);
		}
	}

    /**
     * Internal method for preparing the value
     * for `getValue(...)`
     *
     * @protected
     * @returns {*}
     * @memberof Field
     */
	protected getValueInternal(): any {
		const me = this;
		return me.inputElement.value;
	}

    /**
     * Check if this field has a value.
     *
     * @returns {boolean}
     * @memberof Field
     */
	public hasValue(): boolean {
		const me = this;
		if (me.inputElement) {
			return Blend.isNullOrUndef(me.inputElement.value) || me.inputElement.value === "" ? false : true;
		} else {
			return false;
		}
	}

    /**
     * Gets the value of the Field
     *
     * @template T
     * @returns {T}
     * @memberof Field
     */
	public getValue<T>(): T {
		const me = this;
		if (me.isRendered) {
			return me.getValueInternal() as T;
		} else {
			return me.config.value as T;
		}
	}

    /**
     * @override
     * @protected
     * @param {boolean} value
     * @memberof Field
     */
	protected setDisabledInternal(value: boolean) {
		const me = this;
		super.setDisabledInternal(value);
		if (value === true) {
			me.inputElement.setAttribute("disabled", "true");
		} else {
			me.inputElement.removeAttribute("disabled");
		}
	}

    /**
     * @override
     * @protected
     * @memberof Field
     */
	protected finalizeRender() {
		const me = this;
		super.finalizeRender();
		me.el.classList.add(eFormFieldCSS.EL_FORM_FIELD);
		me.setLabel(me.config.label);
		me.setValue(me.config.value);
		me.setHelpText(me.config.helpText);
		me.inputElement.setAttribute("name", me.config.name);
	}

    /**
     * @override
     * @protected
     * @param {boolean} [isInitial]
     * @memberof Field
     */
	protected doLayout(isInitial?: boolean): void {
		const me = this;
		me.el.classList.set(eFormFieldCSS.ST_HAS_LABEL, me.labelElement && me.labelElement.textContent !== "");
	}
}
