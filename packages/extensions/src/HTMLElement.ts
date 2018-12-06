/**
 * Override the appendChild method so we can append
 * UIComponent without explicitly calling the getElement()
 * method.
 *
 */
if (HTMLElement) {
    var orgAppendChild = HTMLElement.prototype.appendChild;
    (<any>HTMLElement.prototype).appendChild = function(child: any) {
        orgAppendChild.apply(this, [(<any>child).getElement ? (<any>child).getElement() : child]);
    };
}
