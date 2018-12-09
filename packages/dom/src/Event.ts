import { DOMElement } from "./Dom";

// tslint:disable-next-line:no-namespace
export namespace DOMEvent {
    /**
     * Given an Event (usually a mouse or a touch event) this function
     * will return either the `Event.target` or if `Event.target` has its
     * reference set to `..` it will return the referenced element.
     *
     * @export
     * @param {(MouseEvent | TouchEvent)} event
     * @returns {HTMLElement}
     */
    export function getReferencedTarget(event: MouseEvent | TouchEvent): DOMElement {
        const targetEl: HTMLElement = (event.target as HTMLElement) || null,
            currentEl: HTMLElement = (event.currentTarget as HTMLElement) || null;
        if (targetEl === currentEl) {
            return DOMElement.getElement(currentEl);
        } else {
            const $el = DOMElement.getElement(targetEl);
            return $el.getReferencedParent() || DOMElement.getElement(currentEl);
        }
    }
}
