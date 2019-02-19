import { TConfigurableClass } from "@blendsdk/core";
import { Router } from "@blendsdk/router";
import { IUIComponentConfig, IUIComponentStyles, UIComponent } from "@blendsdk/ui";
/**
 * Interface for configuring theme variables for a Application instance.
 *
 * @interface IApplicationStyles
 * @extends {IUIComponentStyles}
 */
export interface IApplicationStyles extends IUIComponentStyles {
    /**
     * Option to configure a background color for this Application
     *
     * @type {string}
     * @memberof IApplicationThemeConfig
     */
    backgroundColor?: string;
}

export interface IApplicationConfig extends IUIComponentConfig {
    /**
     * Required configuration for providing a main view to
     * an application.
     *
     * @type {(TConfigurableClass | Blend.ui.Component)}
     * @memberof IApplicationConfig
     */
    mainView?: TConfigurableClass | UIComponent;
    /**
     * Option to configure a router for the Application component.
     *
     * @type {Blend.router.Router}
     * @memberof IApplicationConfig
     */
    router?: Router;
    /**
     * Option to fit the application component within the
     * body element. It will automatically disable the scrolling on the BODY and the HTML elements.
     * This option is set to true by default.
     *
     * @type {boolean}
     * @memberof IApplicationConfig
     */
    fitToWindow?: boolean;
}
