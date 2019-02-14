import { IDictionary } from "@blendsdk/core";
import { Sheet } from "./Sheet";

/**
 * StyleSheetsSingleton renders and attaches a stylesheet object to the
 * Browser DOM. It automatically caches selectors and skips styles that
 * are already have been added.
 *
 * @class CSSOMSingleton
 */
class StyleSheetsSingleton {
    protected cache: IDictionary;

    /**
     * Creates an instance of CSSOMSingleton.
     * @memberof CSSOMSingleton
     */
    public constructor() {
        this.cache = {};
    }

    /**
     * Creates and returns new Sheet object
     *
     * @returns {Sheet}
     * @memberof StyleSheetsSingleton
     */
    public create(): Sheet {
        return new Sheet();
    }

    /**
     * Attaches a Sheet to the browser DOM.
     *
     * @param {Sheet} sheet
     * @memberof StyleSheetsSingleton
     */
    public attach(sheet: Sheet) {
        const styles = this.render(sheet).trim();
        if (styles.length !== 0) {
            const el = document.createElement("style");
            el.innerHTML = styles;
            document.head.appendChild(el);
        }
    }

    /**
     * Renders the selectors to text.
     *
     * @protected
     * @param {Sheet} sheet
     * @returns {string}
     * @memberof StyleSheetsSingleton
     */
    protected render(sheet: Sheet): string {
        const me = this,
            items = sheet.render(),
            result: string[] = [];
        items.forEach(item => {
            if (item.selector !== "") {
                const hash = item.css.hash();
                if (!me.cache[hash]) {
                    me.cache[hash] = true;
                    result.push(item.css);
                }
            }
        });
        return result.join("\n");
    }
}

/**
 * Exported instance to be used globally.
 */
const StyleSheets: StyleSheetsSingleton = new StyleSheetsSingleton();
export { StyleSheets };
