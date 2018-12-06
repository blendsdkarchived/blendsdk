import { ICreateElementConfig, IDictionary } from './Types';
import { Core } from './Core';

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
        var me = this;
        if (conf instanceof HTMLElement || conf instanceof Node) {
            // TODO:1110 Check if there is a better way!
            // Node to skip(fix for) SVGElement

            return <T>conf;
        } else {
            var config: ICreateElementConfig = <any>conf;
            /**
             * Normalize the config for processing
             */
            config = config || {};
            config.tag = config.tag || 'DIV';
            refCallback = refCallback || null;

            var el: HTMLElement;

            if (config.tag.toLowerCase() === 'svg' || config.isSVG === true) {
                el = <any>window.document.createElementNS('http://www.w3.org/2000/svg', config.tag);
                config.isSVG = true;
            } else {
                el = window.document.createElement(config.tag);
            }

            /**
             * Internal function to parse the data-* values
             */
            var parseData = function(value: any) {
                if (me.is_null(value)) {
                    value = 'null';
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
                me.forEach(config.data, function(item: any, key: string) {
                    el.setAttribute('data-' + key, parseData(item));
                });
            }

            if (config.attrs) {
                me.forEach(config.attrs, function(item: any, key: string) {
                    if (item !== undefined) {
                        el.setAttribute(key, parseData(item));
                    }
                });
            }

            if (config.listeners) {
                me.forEach(config.listeners, function(item: EventListenerOrEventListenerObject, key: string) {
                    if (!me.is_null(item)) {
                        el.addEventListener(key, item, false);
                    }
                });
            }

            if (config.css) {
                el.setAttribute(
                    'class',
                    me
                        .wrap_in_array(config.css)
                        .join(' ')
                        .replace(/\s\s+/g, ' ')
                );
            }

            if (config.style) {
                var styles: Array<string> = [];
                me.forEach(config.style, function(rule: string, key: string) {
                    if (rule) {
                        key = key.replace(/_/m, '-');
                        styles.push(`${key}:${rule}`);
                    }
                });
                var t = styles.join(';');
                if (t.length !== 0) {
                    el.setAttribute('style', t);
                }
            }

            /**
             * The children accepts either a function or string/item/items[]
             */
            if (config.children) {
                me.wrap_in_array(config.children).forEach(function(item: any) {
                    if (me.is_string(item)) {
                        el.appendChild(window.document.createTextNode(item));
                    } else if (me.is_instance_of(item, HTMLElement) || me.is_instance_of(item, SVGElement)) {
                        el.appendChild(<HTMLElement>item);
                    } else {
                        (<ICreateElementConfig>item).isSVG = config.isSVG || false;
                        el.appendChild(me.createElement(<ICreateElementConfig>item, refCallback));
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
            return <T>el;
        }
    }
}

export const Dom: DomSingleton = new DomSingleton();
