if (!(<any>(<any>String.prototype)).ellipsis) {
    // TODO:10106 Test this function, remove if not used.
    (<any>String.prototype).ellipsis = function(maxChars: number, html?: boolean) {
        return this.length > maxChars ? this.substr(0, maxChars - 1) + (html === true ? '&hellip;' : '...') : this;
    };
}

if (!(<any>String.prototype).isEmpty) {
    (<any>String.prototype).isEmpty = function() {
        return this.toString() === '';
    };
}

if (!(<any>String.prototype).ucFirst) {
    (<any>String.prototype).ucFirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

if (!(<any>String.prototype).repeat) {
    (<any>String.prototype).repeat = function(counts: number) {
        return new Array(counts + 1).join(this);
    };
}

if (!(<any>String.prototype).startsWith) {
    (<any>String.prototype).startsWith = function(searchString: string, position: number = 0) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!(<any>String.prototype).inArray) {
    (<any>String.prototype).inArray = function(list: string[] | Array<string> = []): boolean {
        var result: boolean = false,
            thisValue = this.toString();
        for (var i = 0; i !== list.length; i++) {
            if (list[i] === thisValue) {
                result = true;
                break;
            }
        }
        return result;
    };
}

if (!(<any>String.prototype).trim) {
    (<any>String.prototype).trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!(<any>String.prototype).hash) {
    (<any>String.prototype).hash = function() {
        // Original source:
        // https://github.com/darkskyapp/string-hash/blob/master/index.js

        var hash: number = 5381,
            i = this.length;

        while (i) {
            hash = (hash * 33) ^ this.charCodeAt(--i);
        }

        /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
         * integers. Since we want the results to be always positive, convert the
         * signed int to an unsigned by doing an unsigned bitshift. */
        return (hash >>> 0).toString(36);
    };
}

export {};
