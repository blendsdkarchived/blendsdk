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
     * Attaches a Sheet to the browser DOM.
     *
     * @param {Sheet} sheet
     * @memberof StyleSheetsSingleton
     */
    public attach(sheet: Sheet) {
        const el = document.createElement("style");
        el.innerHTML = this.render(sheet);
        document.head.appendChild(el);
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
                const hash = item.selector.hash();
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
