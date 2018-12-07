import { DOMElement } from './Dom';

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
        var targetEl: HTMLElement = <HTMLElement>event.target || null;
        var currentEl: HTMLElement = <HTMLElement>event.currentTarget || null;
        if (targetEl === currentEl) {
            return DOMElement.getElement(currentEl);
        } else {
            var $el = DOMElement.getElement(targetEl);
            return $el.getReferencedParent() || DOMElement.getElement(currentEl);
        }
    }
}
