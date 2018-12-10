/**
 * Override the appendChild method so we can append
 * UIComponent without explicitly calling the getElement()
 * method.
 *
 */
if (HTMLElement) {
    const orgAppendChild = HTMLElement.prototype.appendChild;
    (HTMLElement.prototype as any).appendChild = function(child: any) {
        orgAppendChild.apply(this, [(child as any).getElement ? (child as any).getElement() : child]);
    };
}
