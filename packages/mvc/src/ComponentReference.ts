// tslint:disable:object-literal-shorthand
/**
 * Decorator to annotate a class property as a component reference
 *
 * @param {*} target
 * @param {string} propertyName
 */
export function ComponentReference(target: any, propertyName: string) {
    ((name: string) => {
        name = "_$" + name;
        Object.defineProperty(target, propertyName, {
            get: function() {
                return this[name] === undefined ? name : this[name];
            },
            set: function(value: any) {
                this[name] = value;
            },
            enumerable: true,
            configurable: true
        });
    })(propertyName);
}
