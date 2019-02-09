/**
 * A decorator function that can be used to annotate
 * controller methods as actions
 *
 * @param {*} target
 * @param {string} property
 * @param {*} description
 */
export function ControllerAction(target: any, propertyName: string, description: any) {
    target[propertyName].getMethodName = () => {
        return propertyName;
    };
}
