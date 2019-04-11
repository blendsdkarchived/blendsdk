// tslint:disable-next-line:no-namespace
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
		(window as any)[key] = obj;
	}
}
