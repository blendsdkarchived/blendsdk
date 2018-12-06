export namespace Debug {
    /**
     * Makes a given object available to be accessed on the `window`
     * object from the browser console.
     *
     * @export
     * @param {string} key
     * @param {*} obj
     */
    export function makePublic(key: string, obj: any) {
        (<any>window)[key] = obj;
    }
}
