import { Blend, ColorUtils } from "@blendsdk/core";
import { CSS } from "./CSS";
import { Sheet } from "./Sheet";
import { HTML_TAGS } from "./Tags";

/**
 * Provides functionality to reset the system CSS styles.
 * This class tries to reset everything. The box sizing is
 * set to border-box.
 *
 * @export
 * @class Reset
 * @extends {Sheet}
 */
export class Reset extends Sheet {
    /**
     * Creates an instance of Reset.
     * @memberof Reset
     */
    public constructor() {
        super();
        const me = this;
        me.pushToTop();
        me.common();
        me.paddingAndMargins();
        me.displayBlock();
        me.lists();
        me.quotes();
        me.tables();
        me.touch();
    }

    /**
     * Reset the touch styles
     *
     * @protected
     * @memberof Reset
     */
    protected touch() {
        const aTag = CSS.block("a", { "-webkit-tap-highlight-color": ColorUtils.RGBA("#000", 0) });
        this.addRule([CSS.block("a", { touchAction: "manipulation" }).compose("button"), aTag]);
        ["input", "textarea", "button", "select"].forEach(item => {
            aTag.compose(item);
        });
    }

    /**
     * Reset tables
     *
     * @protected
     * @memberof Reset
     */
    protected tables() {
        this.addRule(
            CSS.block("table", {
                borderCollapse: "collapse",
                borderSpacing: 0
            })
        );
    }

    /**
     * Reset the lists
     *
     * @protected
     * @memberof Reset
     */
    protected lists() {
        this.addRule(CSS.block("ol", { listStyle: "none" }).compose("ul"));
    }

    /**
     * Reset the quotes
     *
     * @protected
     * @memberof Reset
     */
    protected quotes() {
        this.addRule(CSS.block("blockquote", { quotes: "none" }).compose("q"));
        this.addRule(CSS.block("blockquote", { quotes: "none" }).compose("q"));
    }

    /**
     * Reset the block elements
     *
     * @protected
     * @memberof Reset
     */
    protected displayBlock() {
        const list = [
                "aside",
                "details",
                "figcaption",
                "figure",
                "footer",
                "header",
                "hgroup",
                "menu",
                "nav",
                "section",
                "article"
            ],
            sty = CSS.block("nav", { display: "block" });
        list.forEach(item => {
            sty.compose(item);
        });
        this.addRule(sty);
    }

    /**
     * Reset the common styles
     *
     * @protected
     * @memberof Reset
     */
    protected common() {
        const me = this;
        me.addRule([
            CSS.block("html", {
                fontSize: Blend.toPx(Blend.BASE_FONT_SIZE)
            }),
            CSS.block("b-rtl", { direction: "rtl" }),
            CSS.block("b-ltr", { direction: "ltr" }),
            CSS.block("*", {
                boxSizing: "border-box",
                "-webkit-font-smoothing": "antialiased",
                "-webkit-tap-highlight-color": "transparent"
            })
                .compose("*::after")
                .compose("*::before")
        ]);
        me.addRule(CSS.block("*", [CSS.before({ content: "none" })]));
        me.addRule(CSS.block("*", [CSS.after({ content: "none" })]));
        me.addRule(CSS.block("*", [CSS.before({ content: "''" })]));
        me.addRule(CSS.block("*", [CSS.after({ content: "''" })]));
    }

    /**
     * Reset paddings and margins
     *
     * @protected
     * @memberof Reset
     */
    protected paddingAndMargins() {
        const html = CSS.block("html", {
            padding: 0,
            margin: 0,
            verticalAlign: "baseline"
        });
        Object.keys(HTML_TAGS).forEach(tag => {
            html.compose(tag);
        });
        this.addRule(html);
    }
}
