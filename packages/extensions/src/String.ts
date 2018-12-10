if (!(String.prototype as any).ellipsis) {
    // TODO:10106 Test this function, remove if not used.
    (String.prototype as any).ellipsis = function(maxChars: number, html?: boolean) {
        return this.length > maxChars ? this.substr(0, maxChars - 1) + (html === true ? "&hellip;" : "...") : this;
    };
}

if (!(String.prototype as any).isEmpty) {
    (String.prototype as any).isEmpty = function() {
        return this.toString() === "";
    };
}

if (!(String.prototype as any).ucFirst) {
    (String.prototype as any).ucFirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

if (!(String.prototype as any).repeat) {
    (String.prototype as any).repeat = function(counts: number) {
        return new Array(counts + 1).join(this);
    };
}

if (!(String.prototype as any).startsWith) {
    (String.prototype as any).startsWith = function(searchString: string, position: number = 0) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!(String.prototype as any).inArray) {
    (String.prototype as any).inArray = function(list: string[] | string[] = []): boolean {
        let result: boolean = false;
        const thisValue = this.toString();
        for (let i = 0; i !== list.length; i++) {
            if (list[i] === thisValue) {
                result = true;
                break;
            }
        }
        return result;
    };
}

if (!(String.prototype as any).trim) {
    (String.prototype as any).trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}

if (!(String.prototype as any).hash) {
    (String.prototype as any).hash = function() {
        // Original source:
        // https://github.com/darkskyapp/string-hash/blob/master/index.js

        let hash: number = 5381,
            i = this.length;

        while (i) {
            // tslint:disable-next-line:no-bitwise
            hash = (hash * 33) ^ this.charCodeAt(--i);
        }

        /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
         * integers. Since we want the results to be always positive, convert the
         * signed int to an unsigned by doing an unsigned bitshift. */
        // tslint:disable-next-line:no-bitwise
        return (hash >>> 0).toString(36);
    };
}

export {};
