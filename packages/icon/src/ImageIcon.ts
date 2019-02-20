import { Browser } from "@blendsdk/browser";
import { Blend } from "@blendsdk/core";
import { BEM, CSS, stylesheet } from "@blendsdk/css";
import { Dom } from "@blendsdk/dom";
import { Icon, IIconConfig } from "./Icon";

export interface IImageIconConfig extends IIconConfig {
    /**
     * The URL or the source of the image.
     *
     * @type {string}
     * @memberof IImageIconConfig
     */
    src: string;
    /**
     * The size of the icon.
     * If number is provided it will be converted to pixels
     *
     * @type {(number | string)}
     * @memberof IImageIconConfig
     */
    size?: number | string;
    /**
     * Indicates if this icon is round
     *
     * @type {boolean}
     * @memberof IImageIconConfig
     */
    round?: boolean;
}

/**
 * Implements an icon containing an image
 *
 * @export
 * @class ImageIcon
 * @extends {Blend.icon.Icon}
 */
export class ImageIcon extends Icon {
    /**
     * @override
     * @protected
     * @type {IImageIconConfig}
     * @memberof ImageIcon
     */
    protected config: IImageIconConfig;
    /**
     * Creates an instance of ImageIcon.
     * @param {IImageIconConfig} [config]
     * @memberof ImageIcon
     */
    public constructor(config?: IImageIconConfig) {
        super(config);
        this.configDefaults({} as IImageIconConfig);
    }

    protected finalizeRender() {
        super.finalizeRender();
        const me = this,
            sheet = stylesheet(
                BEM.block("b-image-icon", [
                    BEM.modifier("round", {
                        borderRadius: Blend.toPct(100)
                    })
                ])
            );

        if (me.config.size) {
            sheet.addRule(
                CSS.block(me.selectorId, {
                    width: Blend.toPxIf(me.config.size),
                    height: Blend.toPxIf(me.config.size)
                })
            );
        }
        Browser.attachStyleSheet(sheet);
    }

    /**
     * @override
     * @protected
     * @returns {HTMLElement}
     * @memberof ImageIcon
     */
    protected render(): HTMLElement {
        const me = this;
        return Dom.createElement({
            tag: "img",
            css: [
                "b-icon",
                "b-image-icon",
                me.config.round === true ? "b-image-icon--round" : null,
                me.config.size ? me.selectorId : null
            ],
            attrs: {
                src: me.config.src
            }
        });
    }
}
