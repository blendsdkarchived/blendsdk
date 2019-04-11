if (!(Array.prototype as any).intersect) {
	// TODO:1115 Create test for `array intersect(....)`
	(Array.prototype as any).intersect = function (ar: any[]) {
		return this.filter((el: any) => {
			return ar.indexOf(el) !== -1;
		});
	};
}

if (!(Array.prototype as any).random) {
	(Array.prototype as any).random = function () {
		return this[Math.floor(Math.random() * this.length + 0)];
	};
}

if (!(Array.prototype as any).unique) {
	(Array.prototype as any).unique = function () {
		return this.filter((item: any, i: any, allItems: any) => {
			return i === allItems.indexOf(item);
		});
	};
}

if (!(Array.prototype as any).removeAt) {
	(Array.prototype as any).removeAt = function (index: number): any {
		const removed: any[] = this.splice(index, 1);
		return removed.length > 0 ? removed[0] : null;
	};
}

if (!(Array.prototype as any).insertAt) {
	(Array.prototype as any).insertAt = function (index: number, item: any): any[] {
		this.splice(index, 0, item);
		return this;
	};
}

export { };
