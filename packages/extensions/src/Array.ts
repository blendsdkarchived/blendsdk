if (!(<any>Array.prototype).intersect) {
    // TODO:1115 Create test for `array intersect(....)`
    (<any>Array.prototype).intersect = function(ar: Array<any>) {
        return this.filter(function(el: any) {
            return ar.indexOf(el) !== -1;
        });
    };
}

if (!(<any>Array.prototype).random) {
    (<any>Array.prototype).random = function() {
        return this[Math.floor(Math.random() * this.length + 0)];
    };
}

if (!(<any>Array.prototype).unique) {
    (<any>Array.prototype).unique = function() {
        return this.filter(function(item: any, i: any, allItems: any) {
            return i === allItems.indexOf(item);
        });
    };
}

if (!(<any>Array.prototype).removeAt) {
    (<any>Array.prototype).removeAt = function(index: number): any {
        var removed: Array<any> = this.splice(index, 1);
        return removed.length > 0 ? removed[0] : null;
    };
}

if (!(<any>Array.prototype).insertAt) {
    (<any>Array.prototype).insertAt = function(index: number, item: any): Array<any> {
        this.splice(index, 0, item);
        return this;
    };
}

export {};
