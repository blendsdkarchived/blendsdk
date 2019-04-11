import { Blend } from "./Blend";
import { Component } from "./Component";
import { IComponentConfig } from "./Types";

/**
 * Interface for configuring environment variables
 *
 * @export
 * @interface IEnvironmentConfig
 * @extends {IComponentConfig}
 */
export interface IEnvironmentConfig extends IComponentConfig {
    /**
     * Option to configure the base url for the fonts
     *
     * @type {string}
     * @memberof IEnvironmentConfig
     */
	fontsBaseURL?: string;
    /**
     * Option to configure the base url for images and icons
     *
     * @type {string}
     * @memberof IEnvironmentConfig
     */
	imagesBaseURL?: string;
}

/**
 * This class provides a simple way to create and manage environment variables.
 *
 * @export
 * @class Environment
 * @extends {Component<IEnvironmentConfig>}
 */
export class Environment extends Component {
    /**
     * @override
     * @protected
     * @type {IEnvironmentConfig}
     * @memberof Environment
     */
	protected config: IEnvironmentConfig;

    /**
     * Creates an instance of Environment.
     * @param {IEnvironmentConfig} [config]
     * @memberof Environment
     */
	public constructor(config?: IEnvironmentConfig) {
		super(config);
		this.configDefaults({
			fontsBaseURL: "/fonts",
			imagesBaseURL: "/images"
		} as IEnvironmentConfig);
	}

    /**
     * Set  configuration variables.
     *
     * @param {IEnvironmentConfig} config
     * @memberof Environment
     */
	public configure(config: IEnvironmentConfig) {
		const me = this;
		Blend.apply(me.config, config, { overwrite: true });
	}

    /**
     * This method will map an image with the configured imagesBaseURL.
     *
     * @protected
     * @param {string} partialURL
     * @returns
     * @memberof Environment
     */
	protected mapImage(partialURL: string) {
		return `${this.config.imagesBaseURL}${{ partialURL }}`;
	}

    /**
     * This method will map a font with the configured fontsBaseURL.
     *
     * @protected
     * @param {string} partialURL
     * @returns
     * @memberof Environment
     */
	protected mapFont(partialURL: string) {
		return `${this.config.fontsBaseURL}${partialURL}`;
	}
}
