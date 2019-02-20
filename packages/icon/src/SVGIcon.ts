import { AjaxRequest } from "@blendsdk/ajax";
import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { CSS, stylesheet } from "@blendsdk/css";
import { Dom } from "@blendsdk/dom";
import { Icon, IIconConfig } from "./Icon";

export interface ISVGIconConfig extends IIconConfig {
    /**
     * Option configure and URL
     *
     * @type {string}
     * @memberof ISVGIconConfig
     */
    url?: string;
    /**
     * Option to configure the size of the SVG icon.
     *
     * @type {number}
     * @memberof ISVGIconConfig
     */
    size: number;
    /**
     * Option to configure a fill color for the SCG icon
     *
     * @type {string}
     * @memberof ISVGIconConfig
     */
    color?: string;
}

/**
 * TODO:1076 Give this class a description
 *
 * @export
 * @class SVGIcon
 * @extends {Blend.icon.Icon}
 */
export class SVGIcon extends Icon {
    /**
     * @override
     * @protected
     * @type {ISVGIconConfig}
     * @memberof SVGIcon
     */
    protected config: ISVGIconConfig;
    /**
     * Creates an instance of SVGIcon.
     * @param {ISVGIconConfig} [config]
     * @memberof SVGIcon
     */
    public constructor(config?: ISVGIconConfig) {
        super(config);
        this.configDefaults({
            size: 24,
            color: null
        } as ISVGIconConfig);
    }

    protected createStyles() {
        const me = this,
            sheet = stylesheet(
                CSS.block("b-svg-icon", [
                    CSS.and("b-size-" + me.config.size, {
                        width: Blend.remCalc(me.config.size),
                        height: Blend.remCalc(me.config.size),
                        minWidth: Blend.remCalc(me.config.size),
                        minHeight: Blend.remCalc(me.config.size)
                    })
                ])
            );
        if (me.config.color) {
            /**
             * ONLY THIS PART IS NOT BEM
             */
            sheet.addRule(CSS.block(me.selectorId, [CSS.child("svg", { fill: me.config.color })]));
        }
        Browser.attachStyleSheet(sheet);
    }

    protected downloadSVGFromURL() {
        const me = this;
        let cached = null;
        if (localStorage && !Blend.isNullOrUndef((cached = localStorage.getItem(me.config.url.hash())))) {
            const parser = new DOMParser(),
                svgEl: Document = parser.parseFromString(cached, "image/svg+xml");
            me.el.appendChild(svgEl.documentElement);
        } else {
            const req = new AjaxRequest({
                url: me.config.url,
                onSuccess: (sender: any, xhr: XMLHttpRequest) => {
                    if (xhr.responseXML) {
                        const svg = xhr.responseXML.querySelector("SVG") || xhr.responseXML.querySelector("svg");
                        if (svg) {
                            /**
                             * Here we remove the common SVG attributes so we can manipulate them
                             * using the StyleSheet sub-system.
                             */
                            ["width", "height", "class", "id", "style"].forEach((attr: string) => {
                                svg.removeAttribute(attr);
                            });
                            me.el.appendChild(svg);
                            if (localStorage) {
                                localStorage.setItem(me.config.url.hash(), svg.outerHTML);
                            }
                        }
                    }
                }
            });
            req.send();
        }
    }

    protected renderSVG() {
        return;
    }

    /**
     * @override
     * @protected
     * @returns {HTMLElement}
     * @memberof SVGIcon
     */
    protected render(): HTMLElement {
        const me = this;
        me.createStyles();

        me.el = Dom.createElement({
            css: ["b-icon", "b-svg-icon", "b-size-" + me.config.size, me.selectorId]
        });

        if (me.config.url) {
            if (Browser.isReady) {
                Blend.delay(1, me.downloadSVGFromURL.bind(me));
            } else {
                Browser.ready(me.downloadSVGFromURL.bind(me));
            }
        } else {
            me.renderSVG();
        }

        return me.el;
    }
}
