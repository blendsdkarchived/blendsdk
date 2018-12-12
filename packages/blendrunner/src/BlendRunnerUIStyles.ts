import { Sheet } from "./CSS";

const BASE_FONT_SIZE = 10;
const DEF_PADDING = 16;

const px = (value: number): string => {
    return `${value}px`;
};

const pct = (value: number): string => {
    return `${value}%`;
};

const rem = (value: number): string => {
    return `${value / BASE_FONT_SIZE}rem`;
};

/**
 * Implements the CSS Styles of the BlendRunnerUI class
 *
 * @class BlendRunnerUIStyles
 */
export class BlendRunnerUIStyles {
    /**
     * Provides a singleton instance of BlendRunnerUIStyles
     *
     * @static
     * @returns {BlendRunnerUIStyles}
     * @memberof BlendRunnerUIStyles
     */
    public static instance(): BlendRunnerUIStyles {
        return new BlendRunnerUIStyles();
    }
    /**
     * Reference to the Sheet component.
     *
     * @protected
     * @type {Sheet}
     * @memberof BlendRunnerUIStyles
     */
    protected sheet: Sheet;

    /**
     * Creates an instance of BlendRunnerUIStyles.
     * @memberof BlendRunnerUIStyles
     */
    public constructor() {
        const me = this;
        me.sheet = new Sheet({
            "%body-background-color%": "#F5F5F5",
            "%toolbar-background-color%": "#5D4037",
            "%toolbar-title-color%": "#FFFFFF",
            "%value-color%": "rgba(0,0,0,0.60)",
            "%color-pass%": "#43A047",
            "%color-fail%": "#E53935",
            "%color-clock%": "#90CAF9",
            "%color-actual%": "#DD2C00",
            "%color-expected%": "#01579B",
            "%color-log%": "#DD2C00",
            "%assert-background%": "#F5F5F5",
            "%active-test-color%": "#90CAF9"
        });
    }

    /**
     * Renders the styles into the document
     *
     * @memberof BlendRunnerUIStyles
     */
    public render() {
        const me = this;
        me.renderInitial();
        me.renderHeader();
        me.renderUtils();
        me.renderIcons();
        me.renderCards();
        me.sheet.render();
    }

    protected renderInitial() {
        const me = this;
        me.sheet.rule("html", {
            fontSize: px(BASE_FONT_SIZE),
            fontFamily: "Roboto",
            padding: px(0)
        });
        me.sheet.rule("*", {
            boxSizing: "border-box"
        });
        me.sheet.rule("body", {
            backgroundColor: "%body-background-color%",
            paddingTop: rem(86),
            paddingLeft: px(0),
            paddingRight: px(0)
        });

        me.sheet.rule("pre", {
            fontFamily: `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
            fontSize: rem(13),
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "400",
            lineHeight: rem(18.5714),
            textOverflow: "ellipsis",
            overflow: "auto"
        });
    }

    protected renderUtils() {
        const me = this;
        me.sheet.rule(".x-part", {
            marginLeft: rem(3),
            marginRight: rem(DEF_PADDING / 3)
        });
        me.sheet.rule(".x-value", {
            color: "%value-color%",
            marginLeft: rem(DEF_PADDING / 3),
            marginRight: rem(DEF_PADDING / 3),
            fontSize: "0.9rem"
        });

        me.sheet.rule(".x-duration").child(".x-value", {
            minWidth: rem(32)
        });

        me.sheet.rule(".x-spacer", {
            flex: 1
        });

        me.sheet.rule(".x-row", {
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        });
    }

    protected renderIcons() {
        const me = this;
        me.sheet.rule(".x-value-icon").child("path", {
            fill: "%value-color%"
        });

        me.sheet.rule(".x-pass-icon").child("path", {
            fill: "%color-pass%"
        });

        me.sheet.rule(".x-fail-icon").child("path", {
            fill: "%color-fail%"
        });

        me.sheet.rule(".x-clock-icon").child("path", {
            fill: "%color-clock%"
        });

        me.sheet.rule(".x-small-icon", {
            width: rem(24),
            height: rem(24)
        });

        me.sheet.rule(".x-large-icon", {
            width: rem(32),
            height: rem(32)
        });
    }

    protected renderCards() {
        const me = this;
        const card = me.sheet.rule(".x-card", {
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFF",
            margin: rem(24)
        });

        card.and(".x-testing", {
            borderColor: "%active-test-color%",
            borderStyle: "solid",
            borderWidth: rem(1)
        });

        const cardHeader = card.child(".x-card-header", {
            paddingBottom: rem(16),
            paddingRight: rem(24),
            paddingLeft: rem(24)
        });

        cardHeader.child(".x-title", {
            paddingTop: rem(24),
            paddingBottom: rem(24),
            fontSize: rem(24)
        });

        const test = card.child(".x-test", {
            paddingTop: rem(DEF_PADDING / 2),
            paddingBottom: rem(DEF_PADDING / 2),
            borderTop: "1px solid #EEEEEE",
            paddingRight: rem(24),
            paddingLeft: rem(24)
        });

        test.and(".x-testing", {
            borderColor: "%active-test-color%",
            borderStyle: "solid",
            borderWidth: rem(1),
            borderLeft: 0,
            borderRight: 0
        });

        const ui = test.child(".x-ui");
        const assert = test.child(".x-result").child(".x-assert", {
            marginTop: rem(DEF_PADDING / 4),
            marginBottom: rem(DEF_PADDING / 4),
            backgroundColor: "%assert-background%",
            border: `${rem(1)} solid #e0e0e0`,
            borderRadius: rem(2),
            flexWrap: "wrap"
        });

        assert.child(".x-actual", {
            color: "%color-actual%",
            flex: 1,
            padding: rem(DEF_PADDING / 4),
            margin: rem(DEF_PADDING / 4)
        });

        assert.child(".x-expected", {
            color: "%color-expected%",
            flex: 1,
            padding: rem(DEF_PADDING / 4),
            margin: rem(DEF_PADDING / 4)
        });

        assert.child(".x-log", {
            color: "%color-log%",
            flex: 2,
            padding: rem(DEF_PADDING / 4),
            margin: rem(DEF_PADDING / 4)
        });

        ui.child(".x-fail-icon", {
            display: "none"
        });

        ui.child(".x-pass-icon", {
            display: "none"
        });

        const failedTest = test.and(".x-fail").child(".x-ui");
        failedTest.child(".x-fail-icon", {
            display: "block"
        });
        failedTest.child(".x-clock-icon", {
            display: "none"
        });

        const passedTest = test.and(".x-pass").child(".x-ui");
        passedTest.child(".x-pass-icon", {
            display: "block"
        });
        passedTest.child(".x-clock-icon", {
            display: "none"
        });

        ui.child(".x-title", {
            marginLeft: rem(DEF_PADDING / 2)
        });
    }

    protected renderHeader() {
        const me = this;
        const header = me.sheet.rule(".x-header", {
            position: "fixed",
            width: pct(100),
            height: "auto",
            top: px(0),
            left: px(0),
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        });

        header.and(".x-scrolling", {
            boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
        });

        const toolbar = header.child(".x-toolbar", {
            width: pct(100),
            height: rem(64),
            backgroundColor: "%toolbar-background-color%",
            paddingLeft: rem(DEF_PADDING),
            paddingRight: rem(DEF_PADDING),
            display: "flex",
            alignItems: "center"
        });

        toolbar.child(".x-title", {
            color: "%toolbar-title-color%",
            fontSize: rem(20)
        });

        const pctbar = header.child(".x-pctbar", {
            width: pct(100),
            height: rem(8),
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        });

        pctbar.child(".x-pct-pass", {
            height: pct(100),
            background: "%color-pass%"
        });

        pctbar.child(".x-pct-fail", {
            height: pct(100),
            background: "%color-fail%"
        });

        pctbar.child(".x-pct-pending", {
            height: pct(100),
            background: "%color-clock%"
        });
    }
}
