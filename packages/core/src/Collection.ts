import { Blend } from "./Blend";
import { Component, TComponent } from "./Component";
import { IComponentConfig } from "./Types";

/**
 * Interface for configuring a generic collection
 *
 * @interface ICollection
 * @template T
 */
interface ICollectionConfig<T extends TComponent> extends IComponentConfig {
    /**
     * Option provide initial items to the collection.
     *
     * PLEASE NOTE: This configuration property
     * will be set to null once all the items are
     * loaded into the collection.
     *
     * @type {(T|Array<T>)}
     * @memberof ICollectionConfig
     */
    items?: T[] | ArrayLike<T>;
    /**
     * Called when an item is added to the collection.
     *
     * @memberof ICollectionConfig
     */
    onAdd?: (item: T, index: number) => void;
    /**
     * Called when an item is removed from the collection.
     *
     * @memberof ICollectionConfig
     */
    onRemove?: (item: T, index: number) => void;
    /**
     * Called when the filter state of the collection is changed.
     *
     * @memberof ICollectionConfig
     */
    onFilterState?: (filter: boolean) => void;

    /**
     * Called when an item is inserted into a specific location
     * in the collection.
     *
     * @memberof ICollectionConfig
     */
    onInsertAt?: (item: T, index: number) => void;

    /**
     * Called when the location of an item is swapped with the
     * location of another item within the collection.
     *
     * @memberof ICollectionConfig
     */
    onSwap?: (itemA: T, itemAIndex: number, itemB: T, itemBIndex: number) => void;

    /**
     * Called when an item is moved to a different location within
     * the collection.
     *
     * @memberof ICollectionConfig
     */
    onMoveTo?: (item: T, index: number) => void;

    /**
     * Called when the collection is truncated.
     *
     * @memberof ICollectionConfig
     */
    onTruncate?: () => void;

    /**
     * Called when the collection is sorted.
     *
     * @memberof ICollectionConfig
     */
    onSort?: () => void;
}

/**
 * Base class for implementing a generic collection.
 *
 * This class provides functionality for adding, removing,
 * swapping, repositioning, sorting, and filtering of
 * the items contained within the collection.
 *
 * @export
 * @class Collection
 * @extends {Blend.core.Component}
 * @template T
 */
export class Collection<T extends TComponent> extends Component<ICollectionConfig<T>> {
    /**
     * Flag for indicating whether the internal
     * events are enabled or disabled.
     *
     * @protected
     * @type {boolean}
     * @memberof Collection
     */
    protected eventsEnabled: boolean;
    /**
     * Holds all items in the collection
     *
     * @protected
     * @type {Array<T>}
     * @memberof Collection
     */
    protected pItems: T[];
    /**
     * Holds the filtered items from the collection
     *
     * @protected
     * @type {Array<T>}
     * @memberof Collection
     */
    protected pView: T[];
    /**
     * Flag to indicate whether this collection is filtered
     *
     * @protected
     * @type {boolean}
     * @memberof Collection
     */
    private filtered: boolean;

    /**
     * Creates an instance of Collection.
     * @param {ICollectionConfig<T>} [config]
     * @memberof Collection
     */
    public constructor(config?: ICollectionConfig<T>) {
        super(config);
        const me = this,
            noOp = () => {};
        me.pItems = [];
        me.pView = [];
        me.filtered = false;
        me.eventsEnabled = true;
        me.configDefaults({
            items: [],
            onAdd: noOp,
            onFilterState: noOp,
            onInsertAt: noOp,
            onMoveTo: noOp,
            onRemove: noOp,
            onSort: noOp,
            onSwap: noOp,
            onTruncate: noOp
        });
        me.withEventsDisabled(() => {
            me.addMany(me.config.items);
            me.config.items = null;
        });
    }

    /**
     * Indicates whether this container has an
     * active filter
     *
     * @returns {boolean}
     * @memberof Collection
     */
    protected isFilterActive(): boolean {
        return this.filtered;
    }

    /**
     * Check if an item is part of the current filter.
     * This method does not check if we actually have a filter set
     *
     * Use this method in combination with `isFilterActive`
     *
     * @protected
     * @param {T} item
     * @returns
     * @memberof Collection
     */
    protected isFiltered(item: T) {
        return this.pView.indexOf(item) !== -1;
    }

    /**
     * Performs an operation with the internal events disabled.
     * After the operation is completed, the notification state
     * will be set to the state before calling this function.
     *
     * @param {() => void} work
     * @returns {this}
     * @memberof Collection
     */
    public withEventsDisabled(work: () => void): this {
        const me = this,
            cur = me.eventsEnabled;
        me.eventsEnabled = false;
        work();
        me.eventsEnabled = cur;
        return me;
    }

    /**
     * Dispatches an onSort event.
     *
     * @protected
     * @memberof Collection
     */
    protected dispatchOnSort() {
        const me = this;
        if (me.eventsEnabled) {
            me.config.onSort();
        }
    }

    /**
     * Dispatches an onMoveTo event.
     *
     * @protected
     * @param {T} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchOnMoveTo(item: T, index: number) {
        const me = this;
        if (me.eventsEnabled) {
            me.config.onMoveTo(item, index);
        }
    }

    /**
     * Dispatches an onSwap event.
     *
     * @protected
     * @param {T} itemA
     * @param {number} itemAIndex
     * @param {T} itemB
     * @param {number} itemBIndex
     * @memberof Collection
     */
    protected dispatchOnSwap(itemA: T, itemAIndex: number, itemB: T, itemBIndex: number) {
        const me = this;
        if (me.eventsEnabled) {
            me.config.onSwap(itemA, itemAIndex, itemB, itemBIndex);
        }
    }

    /**
     * Dispatches an onRemove event.
     *
     * @protected
     * @param {T} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchRemove(item: T, index: number) {
        const me = this;
        if (me.eventsEnabled === true) {
            me.config.onRemove(item, index);
        }
    }

    /**
     * Dispatches an onFilterState event.
     *
     * @protected
     * @memberof Collection
     */
    protected dispatchOnFilterState() {
        const me = this;
        if (me.eventsEnabled === true) {
            me.config.onFilterState(me.filtered);
        }
    }

    /**
     * Dispatches an onInsertAt event.
     *
     * @protected
     * @param {T} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchInsertAt(item: T, index: number) {
        const me = this;
        if (me.eventsEnabled === true) {
            const lastIndex = (me.filtered ? me.pView.length : me.pItems.length) - 1;
            if (index >= lastIndex) {
                // overflow
                me.dispatchAdd(item, lastIndex);
            } else {
                me.config.onInsertAt(item, me.normalizeIndex(index, lastIndex));
            }
        }
    }

    /**
     * Dispatches an onAdd event.
     *
     * @protected
     * @param {T} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchAdd(item: T, index: number) {
        const me = this;
        if (me.eventsEnabled === true) {
            me.config.onAdd(item, index);
        }
    }

    /**
     * Asserts if the operation is being is being performed on
     * an actual member of the collection
     *
     * @protected
     * @param {T} item
     * @memberof Collection
     */
    protected assert(item: T) {
        const me = this;
        if ((me.filtered ? me.pView.indexOf(item) : me.pItems.indexOf(item)) < 0) {
            throw new Error("Performing operation on a non-member!");
        }
    }

    /**
     * Translates an index from pView ot _items
     *
     * @protected
     * @param {number} index
     * @memberof Collection
     */
    protected translateIndex(index: number): number {
        const me = this,
            view = me.pView,
            items = me.pItems;

        if (index < 0) {
            index = view.length + index; // count reverse
        }

        if (view[index]) {
            return items.indexOf(view[index]);
        } else {
            if (index < 0) {
                return items.indexOf(view[0]); // still to far
            } else {
                return items.indexOf(view[view.length - 1]) + 1;
            }
        }
    }

    /**
     * Clears the current filter
     *
     * @protected
     * @memberof Collection
     */
    public clearFilter() {
        const me = this;
        me.pView = [];
        me.filtered = false;
        me.dispatchOnFilterState();
    }

    /**
     * Applies a filter on the current items of the collection
     * If the collection is already filtered then the filter
     * will be applied to the already filtered list of items
     * otherwise the filter will be applied to the entire collection
     *
     * @param {(item: T) => boolean} filterFunction
     * @returns {this}
     * @memberof Collection
     */
    public filter(filterFunction: (item: T, index?: number) => boolean): this {
        const me = this,
            tmp: T[] = [],
            items: T[] = me.items();
        items.forEach((item, index) => {
            if (filterFunction(item, index)) {
                tmp.push(item);
            }
        });
        me.pView = tmp;
        me.filtered = true;
        me.dispatchOnFilterState();
        return this;
    }

    /**
     * Sorts the entire collection in-place.
     *
     * The sort operation will only be performed is there
     * are actually items in the current state of the collection.
     *
     * For example if the collection is filtered and there are
     * no items in the filter the nothing will be sorted.
     *
     * The compareFunction should return:
     * -1: if a is less than b by some ordering criterion
     * 0 : if a and b are equal
     * 1 : if a is greater than b by the ordering criterion
     *
     * @param {(a: T, b: T) => number} compareFunction
     * @returns {this}
     * @memberof Collection
     */
    public sort(compareFunction: (a: T, b: T) => number): this {
        const me = this;
        if (me.count() !== 0) {
            if (me.filtered) {
                me.pView = me.pView.sort(compareFunction);
            }
            me.pItems = me.pItems.sort(compareFunction);
        }
        me.dispatchOnSort();
        return this;
    }

    /**
     * Moves an item to the last position within the collection
     *
     * @param {T} item
     * @returns {this}
     * @memberof Collection
     */
    public moveLast(item: T): this {
        const me = this;
        me.moveTo(me.items().length - 1, item);
        return this;
    }

    /**
     * Moves an item to the first position within the collection
     *
     * @param {T} item
     * @memberof Collection
     */
    public moveFirst(item: T) {
        const me = this;
        me.moveTo(0, item);
    }

    /**
     * Normalizes an index to limit it within the collection.
     *
     * @protected
     * @param {number} index
     * @param {number} lastIndex
     * @returns {number}
     * @memberof Collection
     */
    protected normalizeIndex(index: number, lastIndex: number): number {
        // last index cannot be negative
        lastIndex = lastIndex < 0 ? 0 : lastIndex;
        // count backwards
        if (index < 0) {
            // translate backwards
            index = lastIndex + index;
        }
        // still underflow
        if (index < 0) {
            index = 0;
        }
        // overflow (if not already taken care of the dispatchInsertAt)
        if (index > lastIndex) {
            index = lastIndex;
        }
        return index;
    }

    /**
     * Moves an item to a given index within the collection.
     *
     * @param {number} index
     * @param {T} item
     * @returns {this}
     * @memberof Collection
     */
    public moveTo(index: number, item: T): this {
        const me = this,
            pView = me.pView,
            pItems = me.pItems;
        let mapping: number;

        me.assert(item);

        if (me.filtered) {
            index = me.normalizeIndex(index, pView.length - 1);
            mapping = me.translateIndex(index);
            pView.splice(index, 0, pView.splice(pView.indexOf(item), 1)[0]);
        } else {
            index = me.normalizeIndex(index, pItems.length - 1);
        }

        pItems.splice(mapping ? mapping : index, 0, pItems.splice(pItems.indexOf(item), 1)[0]);
        me.dispatchOnMoveTo(item, index);
        return this;
    }

    /**
     * Swaps two items within a given list.
     *
     * @protected
     * @param {T} itemA
     * @param {T} itemB
     * @param {Array<T>} list
     * @returns {Array<number>}
     * @memberof Collection
     */
    protected swapInternal(itemA: T, itemB: T, list: T[]): number[] {
        const me = this,
            indexA: number = list.indexOf(itemA),
            indexB: number = list.indexOf(itemB);

        let temp: T;

        temp = itemA;
        list[indexA] = itemB;
        list[indexB] = temp;
        return [indexA, indexB];
    }

    /**
     * Swaps an item with another item within the collection.
     *
     * @param {T} itemA
     * @param {T} itemB
     * @returns {this}
     * @memberof Collection
     */
    public swap(itemA: T, itemB: T): this {
        const me = this;
        let indexes: number[] = null,
            mapping: number[] = null;

        me.assert(itemA);
        me.assert(itemB);

        if (me.filtered) {
            indexes = me.swapInternal(itemA, itemB, me.pView);
        }
        mapping = me.swapInternal(itemA, itemB, me.pItems);
        if (indexes === null) {
            indexes = mapping;
        }
        me.dispatchOnSwap(itemA, indexes[0], itemB, indexes[1]);
        return this;
    }

    /**
     * Removes the last item from the collection.
     *
     * @returns {T}
     * @memberof Collection
     */
    public removeLast(): T {
        return this.removeAt(this.count() - 1);
    }

    /**
     * Removes the first item from the collection.
     *
     * @returns {T}
     * @memberof Collection
     */
    public removeFirst(): T {
        return this.removeAt(0);
    }

    /**
     * Removes an item from the collection and returns the
     * removed item. Returns `undefined` when no item was
     * found to be removed.
     *
     * @param {number} index
     * @returns {T}
     * @memberof Collection
     */
    public removeAt(index: number): T {
        const me = this,
            item = me.getAt(index);
        if (item) {
            return me.remove(item);
        } else {
            return undefined;
        }
    }

    /**
     * Removes all the items at once without taking the filter into account
     *
     *
     * @returns {this}
     * @memberof Collection
     */
    public truncate(): this {
        // TODO:1114 Create test for `collection truncate(...)`
        const me = this;
        me.dispatchOnTruncate();
        me.pItems = [];
        me.pView = [];
        return me;
    }

    /**
     * Dispatches the truncate event.
     *
     * @protected
     * @memberof Collection
     */
    protected dispatchOnTruncate() {
        const me = this;
        if (me.eventsEnabled) {
            me.config.onTruncate();
        }
    }

    /**
     * Removes an item from the collection.
     *
     * @param {T} item
     * @returns {T}
     * @memberof Collection
     */
    public remove(item: T): T {
        const me = this;

        let index: number;
        let mapping: number;

        me.assert(item);

        if (me.filtered) {
            index = me.pView.indexOf(item);
            me.pView.splice(index, 1);
        }
        mapping = me.pItems.indexOf(item);
        me.pItems.splice(mapping, 1);
        me.dispatchRemove(item, index ? index : mapping);
        return item;
    }

    /**
     * Adds many items to the collection
     *
     * @param {Array<T>} items
     * @returns {this}
     * @memberof Collection
     */
    public addMany(items: T[] | ArrayLike<T>): this {
        const me = this;
        Blend.forEach(items, (item: T) => {
            me.add(item);
        });
        return this;
    }

    /**
     * Inserts an item at a given index into the collection.
     *
     * @param {number} index
     * @param {T} item
     * @returns {T}
     * @memberof Collection
     */
    public insertAt(index: number, item: T): T {
        const me = this;
        let mapping;
        if (!item) {
            throw new Error("Cannot insert null or undefined object to the collection");
        }
        if (me.filtered) {
            mapping = me.translateIndex(index);
            me.pView.splice(index, 0, item);
        }
        me.pItems.splice(mapping ? mapping : index, 0, item);
        me.dispatchInsertAt(item, index);
        return item;
    }

    /**
     * Adds an item to the collection.
     *
     * @param {T} item
     * @returns {T}
     * @memberof Collection
     */
    public add(item: T): T {
        const me = this;
        if (!item) {
            throw new Error("Cannot add null or undefined object to the collection");
        }

        // add to the items first then figure out the filter and notification
        // Here we don't have an index translation.
        me.pItems.push(item);

        if (me.filtered) {
            me.pView.push(item);
            me.dispatchAdd(item, me.pView.length - 1);
        } else {
            me.dispatchAdd(item, me.pItems.length - 1);
        }
        return item;
    }

    /**
     * Gets the last item from the collection.
     *
     * @returns {T}
     * @memberof Collection
     */
    public getLast(): T {
        return this.getAt(this.count() - 1);
    }

    /**
     * Gets the first item from the collection.
     *
     * @returns {T}
     * @memberof Collection
     */
    public getFirst(): T {
        return this.getAt(0);
    }

    /**
     * Gets an item at a given index from the collection.
     *
     * @param {number} index
     * @returns
     * @memberof Collection
     */
    public getAt(index: number): T {
        const me = this,
            count: number = me.count();
        if (index < 0) {
            index = count + index;
        }
        if (index < 0) {
            index = 0;
        }
        return this.items()[index] || undefined;
    }

    /**
     * Removes all the items from the collection.
     *
     * @returns {this}
     * @memberof Collection
     */
    public clear(clearFilter?: boolean): this {
        const me = this;
        let items: T[];

        if (clearFilter) {
            me.withEventsDisabled(() => {
                me.clearFilter();
            });
        }

        items = me.items();
        while (items.length !== 0) {
            me.removeAt(0);
        }
        return this;
    }

    /**
     * Counts the items within the collection optionally taking
     * a filter function to only count certain objects.
     *
     * The filter function must return `true` if the item needs
     * to be added to the count
     *
     * @param {(item: T) => boolean} filterFunction
     * @returns {number}
     * @memberof Collection
     */
    public count(filterFunction?: (item: T, index?: number) => boolean): number {
        if (filterFunction) {
            const me = this;
            let c = 0;
            me.forEach((item: T, index: number) => {
                if (filterFunction(item, index) === true) {
                    c++;
                }
            });
            return c;
        } else {
            return this.items().length;
        }
    }

    /**
     * Method for retrieving items from the collection.
     *
     * @returns {Array<T>}
     * @memberof Collection
     */
    public items(): T[] {
        const me = this;
        return me.filtered ? me.pView : me.pItems;
    }

    /**
     * Loops through the items and calls a callback on each item, optionally
     * ignoring the filter
     *
     *
     * @param {(item: T, index: number) => void} callback
     * @returns {this}
     * @memberof Collection
     */
    public forEach(callback: (item: T, index: number) => void, ignoreFilter?: boolean): this {
        const me = this;
        if (ignoreFilter === true) {
            me.pItems.forEach(callback);
        } else {
            const items = me.items();
            items.forEach(callback);
        }
        return this;
    }
}
