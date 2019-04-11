import { CSS, Sheet } from "@blendsdk/css";
import { CSSRule } from "@blendsdk/css/dist/CSSRule";
import { IStyleSet } from "@blendsdk/css/dist/Types";

/**
 * This class creates a minimal set of CSS styles required
 * to get the display orientation changes and display information
 * available in Blend's Browser package.
 *
 * @export
 * @class SystemStyles
 */
export class SystemStyles extends Sheet {
    /**
     * Creates an instance of SystemStyles.
     * @memberof SystemStyles
     */
	public constructor() {
		super();
		const me = this;
		me.pushToTop();
		me.createScreenInfo();
		me.createDirection();
		me.createResponsiveTriggers();
	}

    /**
     * Creates CSS rules for the __screeninfo__ trigger.
     *
     * @protected
     * @memberof SystemStyles
     */
	protected createScreenInfo() {
		const me = this,
			invisible: IStyleSet = {
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: 999999,
				width: "1px",
				height: "1px",
				visibility: "hidden",
				color: "transparent",
				backgroundColor: "transparent",
				border: 0,
				margin: 0,
				padding: 0,
				lineHeight: 0
			};
		me.addRule(CSS.block("__screeninfo__", invisible));
	}

    /**
     * create RTL and LTR rules
     *
     * @protected
     * @memberof SystemStyles
     */
	protected createDirection() {
		this.addRule([CSS.and("b-rtl", { direction: "rtl" }), CSS.and("b-ltr", { direction: "ltr" })]);
	}

    /**
     * Installs CSS providers for handling screen size changes.
     *
     * @protected
     * @memberof System
     */
	protected createResponsiveTriggers() {
		const me = this,
			breakpoints: any = {
				xsmall: {
					"min-width": 1,
					"max-width": 360
				},
				small: {
					"min-width": 360,
					"max-width": 840
				},
				medium: {
					"min-width": 840,
					"max-width": 1280
				},
				large: {
					"min-width": 1280,
					"max-width": 1920
				},
				xlarge: {
					"min-width": 1920,
					"max-width": null as null
				}
			},
			rules: CSSRule[] = [
				CSS.mediaQuery("screen and (orientation:portrait)", me.createDisplayInfo("orientation", "portrait")),
				CSS.mediaQuery("screen and (orientation:landscape)", me.createDisplayInfo("orientation", "landscape"))
			];

		Object.keys(breakpoints).forEach((screen: string) => {
			const size: any = breakpoints[screen],
				minWidth = `all and (min-width: ${size["min-width"] - 1}px)`,
				maxWidth = size["max-width"] ? ` and (max-width: ${size["max-width"]}px)` : "";
			rules.push(CSS.mediaQuery(`${minWidth}${maxWidth}`, me.createDisplayInfo("display", screen)));
		});

		me.addRule(rules);
	}

    /**
     * Install a new display information provider.
     *
     * @protected
     * @param {string} name
     * @param {*} data
     * @returns {this}
     * @memberof System
     */
	protected createDisplayInfo(name: string, data: any): CSSRule {
		return CSS.block("__screeninfo__", CSS.and(`.${name}`, CSS.after({ content: `"${data}"` })));
	}
}
