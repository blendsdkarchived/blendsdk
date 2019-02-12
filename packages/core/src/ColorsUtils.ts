// tslint:disable:no-bitwise

/**
 * Interface describing an RGB color
 *
 * @interface IRGB
 */
interface IRGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Color option providing color tones
 *
 * @export
 * @enum {number}
 */
export enum eColorTone {
    dark = "dark",
    light = "light"
}

/**
 * Utility for working with colors.
 * The functionality of this class is ported from:
 * https://github.com/material-components/material-components-web/blob/master/packages/mdc-theme/_functions.scss
 *
 * @class ColorUtilsSingleTon
 */
class ColorUtilsSingleTon {
    /**
     * Applies an alpha channel to a given color.
     *
     * @param {string} color
     * @param {number} alpha
     * @returns {string}
     * @memberof ColorUtilsSingleTon
     */
    public RGBA(color: string, alpha: number): string {
        const c = this.hexToRGB(color);
        alpha = Math.abs(alpha);
        return `rgba(${c.r}, ${c.g}, ${c.b},${alpha > 1 ? alpha / 100 : alpha})`;
    }

    /**
     * Calculate the luminance for a color.
     * See https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
     *
     * @param {string} color
     * @returns {number}
     * @memberof ColorUtilsSingleTon
     */
    public luminance(color: string): number {
        const me = this,
            rgb = this.hexToRGB(color),
            r = me.channel(rgb.r),
            g = me.channel(rgb.g),
            b = me.channel(rgb.b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Calculates the color tone contrast
     *
     * @param {string} color
     * @returns
     * @memberof ColorUtilsSingleTon
     */
    public contrastTone(color: string): eColorTone {
        return this.tone(color) === eColorTone.dark ? eColorTone.light : eColorTone.dark;
    }

    /**
     * Calculates the color tone
     *
     * @param {string} color
     * @returns {eColorTone}
     * @memberof ColorUtilsSingleTon
     */
    public tone(color: string): eColorTone {
        const me = this,
            minimumContrast = 3.1,
            lightContrast = me.contrast(color, "#ffffff"),
            darkContrast = me.contrast(color, "#000000");

        if (color === eColorTone.dark || color === eColorTone.light) {
            return color;
        }

        return lightContrast < minimumContrast && darkContrast > lightContrast ? eColorTone.light : eColorTone.dark;
    }

    /**
     * Check if the color tone is a light tone.
     *
     * @param {(string | eColorTone)} color
     * @returns {boolean}
     * @memberof ColorUtilsSingleTon
     */
    public isDark(color: string | eColorTone): boolean {
        return this.tone(color) === eColorTone.dark;
    }

    /**
     * Check if the color tone is a light tone.
     *
     * @param {(string | eColorTone)} color
     * @returns {boolean}
     * @memberof ColorUtilsSingleTon
     */
    public isLight(color: string | eColorTone): boolean {
        return this.tone(color) === eColorTone.light;
    }

    /**
     * Calculates the contrast ratio
     *
     * @param {string} back
     * @param {string} front
     * @returns
     * @memberof ColorUtilsSingleTon
     */
    protected contrast(back: string, front: string) {
        const backLum = this.luminance(back) + 0.05,
            foreLum = this.luminance(front) + 0.05;
        return Math.max(backLum, foreLum) / Math.min(backLum, foreLum);
    }

    /**
     * Converts HEX to RGB
     *
     * @param {string} color
     * @returns {IRGB}
     * @memberof ColorUtilsSingleTon
     */
    public hexToRGB(color: string): IRGB {
        const hex: number = parseInt(this.normalize(color), 16);
        return {
            r: hex >> 16,
            g: (hex >> 8) & 0xff,
            b: hex & 0xff
        };
    }

    /**
     * Converts RGB value to HEX
     *
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @returns
     * @memberof ColorUtilsSingleTon
     */
    public RGBToHex(r: number, g: number, b: number) {
        const bin = (r << 16) | (g << 8) | b;
        return `#${(h => {
            return new Array(7 - h.length).join("0") + h;
        })(bin.toString(16).toUpperCase())}`;
    }

    /**
     * Normalizes the hex color.
     *
     * @param {string} color
     * @returns
     * @memberof ColorUtilsSingleTon
     */
    public normalize(color: string) {
        let error: boolean = false;
        if (color.charAt(0) !== "#" || (color.length !== 4 && color.length !== 7)) {
            error = true;
        } else {
            color = color.replace("#", "");
        }
        if (color.length === 3) {
            const parts = color.split("");
            for (let a = 0; a !== 3; a++) {
                parts[a] += parts[a];
            }
            color = "#" + parts.join("");
        }
        if (error === true) {
            throw new Error(`${color} is not a hex color!`);
        }
        return color;
    }

    /**
     * Calculates the color channel for use in contrast calculations.
     *
     * @protected
     * @param {number} color
     * @returns
     * @memberof ColorUtilsSingleTon
     */
    protected channel(color: number) {
        const c = color / 255;
        return c < 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
}

const ColorUtils = new ColorUtilsSingleTon();

export { ColorUtils };
