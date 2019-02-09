import { Blend, IDictionary } from "@blendsdk/core";

// @todo add tests

/**
 * Regex to check for an event name. eg. onClick
 */
const eventRe = new RegExp("^on\\w+", "gi");

/**
 * JSX/TSX helper function.
 *
 * @export
 * @param {string} tag
 * @param {IDictionary} attrs
 * @param {...any[]} children
 * @returns
 */
export function tsx(tag: string, attrs: IDictionary, ...children: any[]) {
    const config: IDictionary = {
        tag,
        listeners: {},
        children
    };
    Blend.forEach(attrs || {}, (value: any, key: string) => {
        key = key.toLocaleLowerCase();
        if (key === "reference") {
            config[key] = value;
            attrs[key] = null;
        } else if (eventRe.test(key)) {
            config.listeners[key.replace("on", "")] = value;
            attrs[key] = null;
        } else if (key === "textcontent") {
            config.textContent = value;
            attrs[key] = null;
        } else if (key === "htmlcontent") {
            config.htmlContent = value;
            attrs[key] = null;
        } else if (key === "data") {
            config.data = value;
            attrs[key] = null;
        } else if (key === "css") {
            config.css = value;
            attrs[key] = null;
        }
    });
    config.attrs = attrs;
    return config;
}
