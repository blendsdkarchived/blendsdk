import { Component } from "./Component";

/**
 * Type describing a type of generic function
 * @type
 */
export type TFunction = (...args) => any;

/**
 * Interface for implementing a Component
 *
 * @export
 * @interface IAbstractComponent
 */
export interface IAbstractComponent {
	getUID(): string;
}

/**
 * Interface for configuring a core Component in Blend
 * @exports
 * @interface ICoreComponentConfig
 */
export interface IComponentConfig {
    /**
     * Option to configure an identifier for this component.
     *
     * @type {string}
     * @memberof IMVCComponentConfig
     */
	id?: string;
    /**
     * Option to configure a dictionary holding user specific data.
     *
     * @type {IDictionary}
     * @memberof ICoreComponentConfig
     */
	userData?: IDictionary;
}

/**
 * Interface for providing information about the current screen
 * information. This interface is used for second parameters of
 * an onResponsiveChange event;
 *
 * @interface IScreenInformation
 */
export interface IScreenInformation {
    /**
     * Provides information about the screen orientation.
     * The values are `portrait` and `landscape`
     *
     * @type {string}
     * @memberof IScreenInformation
     */
	orientation: string;
    /**
     * Provides information about the display size.
     * The values are `xsmall`, `small`, `medium`, `large`, and `xlarge`
     *
     * @type {string}
     * @memberof IScreenInformation
     */
	display: string;
}

/**
 * Typeof a configurable class
 */
export declare type TConfigurableClass = new (config?: { [key: string]: any }) => any;

/**
 * Interface for configuring a key/value dictionary
 *
 * @interface IDictionary
 */
export interface IDictionary {
	[key: string]: any;
}

/**
 * Base interface for implementing a layout
 * configuration interface for a UI component
 *
 * @interface IUILayoutConfig
 * @extends {IDictionary}
 */
// tslint:disable-next-line:no-empty-interface
export interface IUILayoutConfig { }

/**
 * Interface for configuring an Element size
 *
 * @interface IElementSize
 */
export interface IElementSize {
    /**
     * Option to configure the width of the Element.
     *
     * @type {(number|string)}
     * @memberof IElementSize
     */
	width?: number | string;
    /**
     * Option to configure the height of the Element.
     *
     * @type {(number|string)}
     * @memberof IElementSize
     */
	height?: number | string;
}

/**
 * Interface for configuring the margins of an Element
 *
 * @interface IElementMargin
 */
export interface IElementMargin {
    /**
     * Option to configure the top margin of an Element
     *
     * @type {(number | string)}
     * @memberof IElementMargin
     */
	top?: number | string;
    /**
     * Option to configure the right margin of an Element
     *
     * @type {(number | string)}
     * @memberof IElementMargin
     */
	right?: number | string;
    /**
     * Option to configure the bottom margin of an Element
     *
     * @type {(number | string)}
     * @memberof IElementMargin
     */
	bottom?: number | string;
    /**
     * Option to configure the left margin of an Element
     *
     * @type {(number | string)}
     * @memberof IElementMargin
     */
	left?: number | string;
}
