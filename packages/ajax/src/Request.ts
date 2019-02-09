// tslint:disable:no-console
import { Blend } from "@blendsdk/core";
import { IMVCComponentConfig, MVCComponent, TComponentEvent } from "@blendsdk/mvc";

enum eAjaxRequestEvents {
    onSuccess = "onSuccess",
    onError = "onError",
    onFinished = "onFinished",
    onBeforeStart = "onBeforeStart",
    onProgress = "onProgress"
}

// TODO:1068 Create POST tests
// TODO:1069 Create PUT tests
// TODO:1070 Create PATCH tests
// TODO:1071 Create DELETE tests
// TODO:1072 Create progress tests
// TODO:1073 Implement upload functionality.
export interface IAjaxRequestConfig extends IMVCComponentConfig {
    /**
     * Option to configure an endpoint for making the ajax request
     *
     * @type {string}
     * @memberof IAjaxRequestConfig
     */
    url?: string;
    /**
     * Option to configure a request type.
     * This defaults to GET
     *
     * @type {('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')}
     * @memberof IAjaxRequestConfig
     */
    type?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    /**
     * Dispatches before the request is sent
     *
     * @type {TComponentEvent}
     * @memberof IAjaxRequestConfig
     */
    onBeforeSend?: TComponentEvent;
    /**
     * Dispatches when the request is successful
     *
     * @type {TComponentEvent}
     * @memberof IAjaxRequestConfig
     */
    onSuccess?: TComponentEvent;
    /**
     * Dispatches when something goes wrong with the request
     * or the request responds with a 500 error.
     *
     * @type {TComponentEvent}
     * @memberof IAjaxRequestConfig
     */
    onError?: TComponentEvent;
    /**
     * Dispatches when the request is in progress
     *
     * @type {TComponentEvent}
     * @memberof IAjaxRequestConfig
     */
    onProgress?: TComponentEvent;
    /**
     * Dispatches when the request is finished regardless of
     * response status.
     *
     * @type {TComponentEvent}
     * @memberof IAjaxRequestConfig
     */
    onFinished?: TComponentEvent;
}
/**
 * // TODO:1067 Provide a class description
 *
 * @export
 * @class Request
 * @extends {Blend.mvc.Component}
 */
export class AjaxRequest extends MVCComponent<IAjaxRequestConfig> {
    /**
     * Create a simple get request
     *
     * @export
     * @param {string} url
     * @param {IAjaxRequestConfig} [options]
     */
    public static get(url: string, options?: IAjaxRequestConfig) {
        options = Blend.apply(options || {}, {} as IAjaxRequestConfig);
        options.url = url;
        const req = new AjaxRequest(options);
        req.send();
    }

    /**
     * Creates an instance of Request.
     * @param {IAjaxRequestConfig} [config]
     * @memberof Request
     */
    constructor(config?: IAjaxRequestConfig) {
        super(config);
        this.configDefaults({
            type: "GET"
        });
    }

    /**
     * Sends the request.
     *
     * @memberof Request
     */
    public send() {
        const me = this,
            xhr = new XMLHttpRequest();
        xhr.open(me.config.type, me.config.url);
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                me.dispatchEvent(eAjaxRequestEvents.onSuccess, [xhr]);
            } else if (xhr.status >= 300 && xhr.status < 400) {
                console.warn(`XHR responded with ${xhr.status}. which is not supported for now!`);
                me.dispatchEvent(eAjaxRequestEvents.onSuccess, [xhr]);
            } else if (xhr.status >= 400 && xhr.status <= 500) {
                console.log(`XHR responded with client error: ${xhr.status}`);
                me.dispatchEvent(eAjaxRequestEvents.onError, [xhr]);
            } else if (xhr.status >= 500) {
                console.log(`XHR responded with server error: ${xhr.status}`);
                me.dispatchEvent(eAjaxRequestEvents.onError, [xhr]);
            }
        });
        xhr.addEventListener("progress", () => {
            me.dispatchEvent(eAjaxRequestEvents.onProgress, [xhr]);
        });
        xhr.addEventListener("error", () => {
            me.dispatchEvent(eAjaxRequestEvents.onError, [xhr]);
        });
        xhr.addEventListener("loadend", () => {
            me.dispatchEvent(eAjaxRequestEvents.onFinished, [xhr]);
        });
        me.dispatchEvent(eAjaxRequestEvents.onBeforeStart, [xhr], true);
        xhr.send();
    }
}
