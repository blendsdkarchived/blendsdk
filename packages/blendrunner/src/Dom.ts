import { Core } from "./Core";
import { ICreateElementConfig, IDictionary } from "./Types";

class DomSingleton extends Core {
    /**
     * Utility function for creating en `HTMLElement`.
     * The reference callback function `refCallback` can be used
     * to assign child elements which have a `reference` to class
     * properties.
     *
     * The windows parameters `win` can be used to create the element from
     * a specific `Window` context
     *
     * @export
     * @template T
     * @param {(ICreateElementConfig | ICreateElementConfigFunction)} [conf]
     * @param {(reference: string, element: HTMLElement) => any} [refCallback]
     * @param {Window} [win]
     * @returns {T}
     */
	public createElement<T extends HTMLElement>(
		conf?: HTMLElement | ICreateElementConfig,
		refCallback?: (reference: string, element: HTMLElement) => any
	): T {
		const me = this;
		if (conf instanceof HTMLElement || conf instanceof Node) {
			// TODO:1110 Check if there is a better way!
			// Node to skip(fix for) SVGElement

			return conf as T;
		} else {
			let config: ICreateElementConfig = conf as any;
            /**
             * Normalize the config for processing
             */
			config = config || {};
			config.tag = config.tag || "DIV";
			refCallback = refCallback || null;

			let el: HTMLElement;

			if (config.tag.toLowerCase() === "svg" || config.isSVG === true) {
				el = window.document.createElementNS("http://www.w3.org/2000/svg", config.tag) as any;
				config.isSVG = true;
			} else {
				el = window.document.createElement(config.tag);
			}

            /**
             * Internal function to parse the data-* values
             */
			const parseData = (value: any) => {
				if (me.is_null(value)) {
					value = "null";
				}
				if (me.is_object(value) || me.is_array(value)) {
					return JSON.stringify(value);
				} else {
					return value;
				}
			};

			if (config.id) {
				el.id = config.id;
			}

			if (!me.is_null(config.textContent)) {
				if (config.isSVG) {
					el.textContent = config.textContent;
				} else {
					el.innerText = config.textContent;
				}
			}

			if (config.htmlContent) {
				el.innerHTML = config.htmlContent;
			}

			if (config.data) {
				me.forEach(config.data, (item: any, key: string) => {
					el.setAttribute("data-" + key, parseData(item));
				});
			}

			if (config.attrs) {
				me.forEach(config.attrs, (item: any, key: string) => {
					if (item !== undefined) {
						el.setAttribute(key, parseData(item));
					}
				});
			}

			if (config.listeners) {
				me.forEach(config.listeners, (item: EventListenerOrEventListenerObject, key: string) => {
					if (!me.is_null(item)) {
						el.addEventListener(key, item, false);
					}
				});
			}

			if (config.css) {
				el.setAttribute(
					"class",
					me
						.wrap_in_array(config.css)
						.join(" ")
						.replace(/\s\s+/g, " ")
				);
			}

			if (config.style) {
				const styles: string[] = [];
				me.forEach(config.style, (rule: string, key: string) => {
					if (rule) {
						key = key.replace(/_/m, "-");
						styles.push(`${key}:${rule}`);
					}
				});
				const t = styles.join(";");
				if (t.length !== 0) {
					el.setAttribute("style", t);
				}
			}

            /**
             * The children accepts either a function or string/item/items[]
             */
			if (config.children) {
				me.wrap_in_array(config.children).forEach((item: any) => {
					if (me.is_string(item)) {
						el.appendChild(window.document.createTextNode(item));
					} else if (me.is_instance_of(item, HTMLElement) || me.is_instance_of(item, SVGElement)) {
						el.appendChild(item as HTMLElement);
					} else {
						(item as ICreateElementConfig).isSVG = config.isSVG || false;
						el.appendChild(me.createElement(item as ICreateElementConfig, refCallback));
					}
				});
			}

			if (config.reference) {
				if (!el.$blend) {
					el.$blend = {};
				}
				el.$blend.reference = config.reference;
				if (refCallback) {
					refCallback(config.reference, el);
				}
			}
			return el as T;
		}
	}
}

export const Dom: DomSingleton = new DomSingleton();
