import { IDictionary } from "@blendsdk/core";

/**
 * JSX/TSX helper function.
 *
 * @export
 * @param {string} tag
 * @param {IDictionary} attrs
 * @param {...any[]} children
 * @returns
 */
export function tsx(tag: string, attrs: IDictionary, ...children: any[]) {
    return {
        tag,
        attrs,
        children
    };
}
