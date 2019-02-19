import { Blend, Collection, ICollectionConfig, IDictionary } from "@blendsdk/core";
import { DOMElement } from "@blendsdk/dom";
import { TComponentEvent } from "@blendsdk/mvc";
import { IUIComponentConfig, UIComponent } from "./UIComponent";

/**
 * Enum describing UICollection events.
 *
 * @enum {number}
 */
enum eUICollectionEvents {
    onFilter = "onFilter",
    onItemRemove = "onItemRemove",
    onTruncate = "onTruncate",
    onItemAdd = "onItemAdd",
    onItemMove = "onItemMove",
    onSort = "onSort"
}

// TODO:1040 Test Component for applying the assignFirstVisible
/**
 * Interface for configuring a Collection instance.
 *
 * @export
 * @interface IUICollectionConfig
 * @extends {IUIComponentConfig<ComponentStylesType>}
 * @template ComponentStylesType
 * @template ChildComponentType
 */
export interface IUICollectionConfig<ChildComponentType extends UIComponent> extends IUIComponentConfig {
    /**
     * Option to provide initial items to the UI collection.
     *
     * PLEASE NOTE: This configuration item will be set to null once
     * the items are loaded into the UI Collection.
     *
     * @type {Array<ChildComponentType>}
     * @memberof IUICollectionConfig
     */
    items?: ChildComponentType[];
    /**
     * Dispatched when an item is added to the collection
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionConfig
     */
    onItemAdd?: TComponentEvent;
    /**
     * Dispatched when an item is removed from the collection.
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionEvents
     */
    onItemRemove?: TComponentEvent;
    /**
     * Dispatched when an item is swapped with another item
     * within the collection.
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionEvents
     */
    onItemSwap?: TComponentEvent;
    /**
     * Dispatched when an item is moved from one index to another
     * index within the collection.
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionEvents
     */
    onItemMove?: TComponentEvent;
    /**
     * Dispatched when the collection is sorted.
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionEvents
     */
    onSort?: TComponentEvent;
    /**
     * Dispatched when the collection is filtered.
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionEvents
     */
    onFilter?: TComponentEvent;
    /**
     * Dispatched when the collection is truncated.
     *
     * @type {TComponentEvent}
     * @memberof IUICollectionConfig
     */
    onTruncate?: TComponentEvent;
    /**
     * If set to true then upon `performLayout` an additional
     * css rules `.b-first-visible` is calculated and set to the
     * first visible element.
     *
     * By default this option is set to false.
     *
     * @type {boolean}
     * @memberof IUICollectionConfig
     */
    assignFirstVisible?: boolean;
}

/**
 * This class provides a basis for any component that is a container
 * of other UI components.
 *
 * @export
 * @abstract
 * @class UICollection
 * @extends {UIComponent}
 * @template ChildComponentType
 * @template CollectionConfigType
 */
export abstract class UICollection<ChildComponentType extends UIComponent> extends UIComponent {
    /**
     * @override
     * @protected
     * @type {IUICollectionConfig<UIComponent>}
     * @memberof UICollection
     */
    protected config: IUICollectionConfig<ChildComponentType>;
    /**
     * An index of component to position inside the items array
     *
     * @protected
     * @type {INumberIDictionary}
     * @memberof Collection
     */
    protected index: IDictionary;
    /**
     * Internal flag tracking the state of component index
     *
     * @protected
     * @type {boolean}
     * @memberof Collection
     */
    protected indexSynced: boolean;
    /**
     * Internal collection of the elements
     *
     * @protected
     * @type {Blend.core.Collection<ChildComponentType>}
     * @memberof Collection
     */
    protected pCollection: Collection<ChildComponentType>;
    /**
     * Holds a reference to the container holding child components
     *
     * @protected
     * @type {HTMLElement}
     * @memberof Collection
     */
    protected containerElement: HTMLElement;
    /**
     * A DocumentFragment object te temporarily hold
     * each item's HTMLElement
     *
     * @protected
     * @type {DocumentFragment}
     * @memberof Collection
     */
    protected stash: DocumentFragment;
    /**
     * Abstract method which is needed to render/convert a component to an
     * (or a combination of) HTMLElement
     *
     * @protected
     * @abstract
     * @param {ChildComponentType} item
     * @returns {HTMLElement}
     * @memberof Collection
     */
    protected abstract renderItem(item: ChildComponentType): HTMLElement;
    /**
     * Remove the component's HTMLElement (or the wrapper of) from the
     * containerElement
     *
     * @protected
     * @abstract
     * @param {ChildComponentType} item
     * @memberof Collection
     */
    protected abstract removeElement(item: ChildComponentType): void;
    /**
     * Given a component, this method returns either the component's
     * HTMLElement or it wrapper HTMLElement
     *
     * @protected
     * @abstract
     * @param {ChildComponentType} item
     * @returns {HTMLElement}
     * @memberof Collection
     */
    protected abstract getWrapperOf(item: ChildComponentType): HTMLElement;

    /**
     * Creates an instance of Collection.
     * @param {IUICollectionConfig} [config]
     * @memberof Collection
     */
    public constructor(config?: IUICollectionConfig<ChildComponentType>) {
        super(config);
        const me = this;
        me.stash = window.document.createDocumentFragment();
        me.configDefaults({
            items: []
        } as IUICollectionConfig<ChildComponentType>);
        // Events are disabled by the super class!
        me.pCollection = new Collection({
            items: me.config.items,
            onAdd: me.onAdd.bind(me),
            onInsertAt: me.onInsertAt.bind(me),
            onSort: me.onSort.bind(me),
            onMoveTo: me.onMoveTo.bind(me),
            onSwap: me.onSwap.bind(me),
            onRemove: me.onRemove.bind(me),
            onTruncate: me.onTruncate.bind(me),
            onFilterState: me.onFilterState.bind(me)
        } as ICollectionConfig<ChildComponentType>);
        // free memory
        me.config.items = null;
    }

    /**
     * Internally check if the item container exists and if so
     * it starts a layout process.
     *
     * @protected
     * @memberof Collection
     */
    protected doLayoutItems() {
        const me = this;
        me.shouldReIndex();
        me.forEach((item: ChildComponentType) => {
            me.activateItem(item);
            item.performLayout();
        });
        me.assignFirstVisible();
    }

    /**
     * Internal method for retrieving items from the collection
     *
     * @protected
     * @returns {Array<ChildComponentType>}
     * @memberof Collection
     */
    protected items(): ChildComponentType[] {
        const me = this;
        return me.pCollection.items();
    }

    /**
     * Assign the `b-first-visible` css rule to the first visible
     * child element.
     *
     * @protected
     * @memberof Collection
     */
    protected assignFirstVisible() {
        const me = this;
        if (me.containerElement && me.config.assignFirstVisible === true) {
            window.requestAnimationFrame(() => {
                const els = me.containerElement.querySelectorAll(".b-uc-item");
                let found = false;
                Blend.forEach(els, (el: HTMLElement) => {
                    const css = window.getComputedStyle(el);
                    if (!found && css.display !== "none") {
                        found = true;
                        el.classList.add("b-first-visible");
                    } else {
                        el.classList.remove("b-first-visible");
                    }
                });
            });
        }
    }

    /**
     * Removes an item from the collection.
     *
     * @param {ChildComponentType} item
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public remove(item: ChildComponentType): ChildComponentType {
        return this.pCollection.remove(item);
    }

    /**
     * Removes an item from the collection and returns the
     * removed item. Returns `undefined` when no item was
     * found to be removed.
     *
     * @param {number} index
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public removeAt(index: number): ChildComponentType {
        return this.pCollection.removeAt(index);
    }

    /**
     * Truncates all the items in this collection at once.
     *
     * @memberof Collection
     */
    public truncate() {
        // TODO:1116 Create tests for `UI truncate`
        this.pCollection.truncate();
    }

    /**
     * Activates a given item by appending its HTMLElement
     * into the element's parent container
     *
     * @protected
     * @param {ChildComponentType} item
     * @memberof Collection
     */
    protected activateItem(item: ChildComponentType) {
        const me = this;
        me.activateElement(me.getWrapperOf(item));
    }

    /**
     * Deactivates an element by stashing it away
     *
     * @protected
     * @param {ChildComponentType} item
     * @memberof Collection
     */
    protected deActivateItem(item: ChildComponentType) {
        const me = this;
        me.stashElement(me.getWrapperOf(item));
    }

    /**
     * Activates a given HTMLElement by appending it to the
     * element's parent container
     *
     * @protected
     * @param {HTMLElement} el
     * @memberof Collection
     */
    protected activateElement(el: HTMLElement) {
        const me = this;
        if (el !== me.containerElement) {
            me.containerElement.appendChild(el);
        }
    }

    /**
     * Loops through the items and calls a callback on each item, optionally
     * ignoring the filter
     *
     * @param {(item: ChildComponentType, index: number) => void} callback
     * @param {boolean} [ignoreFilter]
     * @memberof Collection
     */
    public forEach(callback: (item: ChildComponentType, index: number) => void, ignoreFilter?: boolean) {
        const me = this;
        me.pCollection.forEach(callback, ignoreFilter);
    }

    /**
     * Finds a view by its index, id, or instance within the collection.
     * Returns null of not found.
     *
     * @protected
     * @param {(number | string | UIComponent)} item
     * @returns {UIComponent}
     * @memberof Stack
     */
    protected find(item: number | string | UIComponent): ChildComponentType {
        const me = this;
        let result: ChildComponentType = null;
        if (Blend.isNumeric(item)) {
            result = me.getAt(item as number);
        } else if (Blend.isString(item)) {
            me.forEach((itm: UIComponent) => {
                if (result === null && itm.getId() === item) {
                    result = itm as ChildComponentType;
                }
            });
        } else {
            result = (me.contains(item as ChildComponentType) ? item : null) as ChildComponentType;
        }
        return result;
    }

    /**
     * Handles the onFilterState event by starting
     * a layout process.
     *
     * @protected
     * @param {boolean} filter
     * @memberof Collection
     */
    protected onFilterState(filter: boolean) {
        const me = this;
        if (me.isRendered && me.containerElement) {
            // TODO:1039 Should stash the filtered element
            me.stashAll();
            me.performLayout();
        }
        me.dispatchOnFilter(filter);
    }

    /**
     * Temporary stashes away all the container elements.
     *
     * @protected
     * @memberof Collection
     */
    protected stashAll() {
        const me = this;
        me.forEach((item: ChildComponentType) => {
            me.stash.appendChild(me.getWrapperOf(item));
        }, true);
    }

    /**
     * Handles the onTruncate event.
     *
     * @protected
     * @memberof Collection
     */
    protected onTruncate() {
        const me = this;
        if (me.isRendered && me.containerElement) {
            while (me.pCollection.count() !== 0) {
                me.removeAt(0);
            }
            me.shouldReIndex();
        }
        me.dispatchTruncateEvent();
    }

    /**
     * Handles the onRemove event by removing an item's HTMLElement
     * from the container.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected onRemove(item: ChildComponentType, index: number) {
        const me = this;
        if (me.isRendered && me.containerElement) {
            me.removeElement(item);
            me.shouldReIndex();
        }
        me.dispatchItemRemoveEvent(item, index);
    }

    /**
     * Handles the onSwap event by swapping the HTMLElement of one
     * item with another.
     *
     * @protected
     * @param {ChildComponentType} itemA
     * @param {number} itemAIndex
     * @param {ChildComponentType} itemB
     * @param {number} itemBIndex
     * @memberof Collection
     */
    protected onSwap(itemA: ChildComponentType, itemAIndex: number, itemB: ChildComponentType, itemBIndex: number) {
        const me = this;
        if (me.isRendered && me.containerElement) {
            const wrpA = me.getWrapperOf(itemA),
                wrpB = me.getWrapperOf(itemB),
                // create marker element and insert it where wrpA is
                tmp = window.document.createElement("DIV");
            wrpA.parentNode.insertBefore(tmp, wrpA);
            // move wrpA to right before wapB
            wrpB.parentNode.insertBefore(wrpA, wrpB);
            // move wrpB to right before where wrpA used to be
            tmp.parentNode.insertBefore(wrpB, tmp);
            // remove temporary marker node
            tmp.parentNode.removeChild(tmp);
            me.shouldReIndex();
        }
        me.dispatchItemSwap(itemA, itemAIndex, itemB, itemBIndex);
    }

    /**
     * Handles the onMove event for moving an item's HTMLElement
     * the given location into the container.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected onMoveTo(item: ChildComponentType, index: number) {
        const me = this,
            next: number = index + 1;
        let elAtIndex: HTMLElement;
        if (me.isRendered && me.containerElement) {
            // check and handle overflow by adding after the last element
            if (me.pCollection.count() > next) {
                elAtIndex = me.getWrapperOf(me.pCollection.getAt(next));
                me.containerElement.insertBefore(me.getWrapperOf(item), elAtIndex);
            } else {
                me.containerElement.appendChild(me.getWrapperOf(item));
            }
            me.shouldReIndex();
        }
        me.dispatchItemMoveEvent(item, index);
    }

    /**
     * Handles the onAdd by event by appending an item's
     * HTMLElement at the end of the container.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected onAdd(item: ChildComponentType, index: number) {
        const me = this;
        if (me.containerElement && me.isRendered) {
            me.containerElement.appendChild(me.renderItemInternal(item));
            me.shouldReIndex();
        }
        me.dispatchItemAddEvent(item, index);
    }

    /**
     * State that the component index should be reindexed on next use
     *
     * @protected
     * @memberof Collection
     */
    protected shouldReIndex() {
        this.indexSynced = false;
    }

    /**
     * Renders and prepares the item to be added or inserted into the collection
     *
     * @protected
     * @param {ChildComponentType} item
     * @returns {HTMLElement}
     * @memberof Collection
     */
    protected renderItemInternal(item: ChildComponentType): HTMLElement {
        /**
         * We will automatically set the item's UID to the wrapper's
         * UID if it is needed.
         */
        const me = this,
            el = me.renderItem(item),
            $el = DOMElement.getElement(el),
            uid = $el.getUID();
        item.setParent(me);
        window.requestAnimationFrame(() => {
            el.classList.add("b-uc-item", "b-uc-" + me.getUID());
        });
        if (!uid) {
            $el.setUID(item.getUID());
        }
        return el;
    }

    /**
     * Checks if a given item exists withing this collection.
     *
     * @param {ChildComponentType} item
     * @returns {boolean}
     * @memberof Collection
     */
    public contains(item: ChildComponentType): boolean {
        /**
         * TODO:10023 create a test for ui.collection `contains` method.
         */
        const me = this,
            uid = item.getUID();

        let result = false;

        me.pCollection.forEach(itm => {
            if (uid === itm.getUID()) {
                result = true;
                return false; // break the loop
            }
        });
        return result;
    }

    /**
     * Moves an item to a given index within the collection.
     *
     * @param {number} index
     * @param {ChildComponentType} item
     * @memberof Collection
     */
    public moveTo(index: number, item: ChildComponentType) {
        this.pCollection.moveTo(index, item);
    }

    /**
     * Adds a item to the collection.
     *
     * @param {ChildComponentType} item
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public add(item: ChildComponentType): ChildComponentType {
        return this.pCollection.add(item);
    }

    /**
     * Clears the current filter
     *
     * @protected
     * @memberof Collection
     */
    public clearFilter() {
        this.pCollection.clearFilter();
    }

    /**
     * Gets an item at a given index from the collection.
     *
     * @param {number} index
     * @returns
     * @memberof Collection
     */
    public getAt(index: number): ChildComponentType {
        return this.pCollection.getAt(index);
    }

    /**
     * Swaps an item with another item within the collection.
     *
     * @param {ChildComponentType} itemA
     * @param {ChildComponentType} itemB
     * @memberof Collection
     */
    public swap(itemA: ChildComponentType, itemB: ChildComponentType) {
        this.pCollection.swap(itemA, itemB);
    }

    /**
     * Gets the last item from the collection.
     *
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public getLast(): ChildComponentType {
        return this.pCollection.getLast();
    }

    /**
     * Gets the first item from the collection.
     *
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public getFirst(): ChildComponentType {
        return this.pCollection.getFirst();
    }

    /**
     * Moves an item to the last position within the collection
     *
     * @param {ChildComponentType} item
     *
     * @memberof Collection
     */
    public moveLast(item: ChildComponentType) {
        this.pCollection.moveLast(item);
    }

    /**
     * Applies a filter on the current items of the collection
     * If the collection is already filtered then the filter
     * will be applied to the already filtered list of items
     * otherwise the filter will be applied to the entire collection
     *
     * @param {(item: ChildComponentType) => boolean} filterFunction
     * @memberof Collection
     */
    public filter(filterFunction: (item: ChildComponentType, index?: number) => boolean) {
        this.pCollection.filter(filterFunction);
    }

    /**
     * Inserts an item into specific position in the collection.
     *
     * @param {number} index
     * @param {ChildComponentType} item
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public insertAt(index: number, item: ChildComponentType): ChildComponentType {
        return this.pCollection.insertAt(index, item);
    }

    /**
     * Handles the onInsertAt event by inserting an item's
     * HTMLElement into the given location in the container.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected onInsertAt(item: ChildComponentType, index: number) {
        const me = this;
        if (me.isRendered && me.containerElement) {
            // need to add one be cause the number of items is already increased
            me.containerElement.insertBefore(
                me.renderItemInternal(item),
                me.getWrapperOf(me.pCollection.getAt(index + 1))
            );
            me.shouldReIndex();
        }
    }

    /**
     * Handles the onSort event by starting a layout process.
     *
     * @protected
     * @memberof Collection
     */
    protected onSort() {
        this.dispatchSortEvent();
    }

    /**
     * Reindexes the collection if it is needed
     *
     * @protected
     * @memberof Collection
     */
    protected reIndex() {
        const me = this;
        if (!me.indexSynced) {
            me.index = {};
            me.pCollection.forEach((item: ChildComponentType, index: number) => {
                me.index[item.getUID()] = index;
            });
            me.indexSynced = true;
        }
    }

    /**
     * Given an HTMLElement it returns the corresponding item from
     * the collection.
     *
     * The HTMLElement must have a valid UID set before.
     *
     * @param {HTMLElement} el
     * @returns {ChildComponentType}
     * @memberof Collection
     */
    public getByElement(el: HTMLElement): ChildComponentType {
        const me = this;
        return me.getByIndex(DOMElement.getElement(el).getUID() || "") || null;
    }

    /**
     * Returns a List Item by "clicked" item
     *
     * @protected
     * @param {Event} event
     * @returns {UIComponent}
     * @memberof Collection
     */
    protected getElementByEventTarget(event: Event): UIComponent {
        const me = this,
            cssKey = "b-uc-" + me.getUID();

        let element = DOMElement.getElement(event.currentTarget as any),
            item = me.getByElement(element.findParentByClass(cssKey));
        if (!item) {
            element = DOMElement.getElement(event.target as any);
            item = me.getByElement(element.findParentByClass(cssKey));
        }
        return item;
    }

    /**
     * Returns an item by its unique index;
     *
     * @param {string} index
     * @returns {ChildComponentType}
     * @protected
     * @memberof Collection
     */
    protected getByIndex(index: string): ChildComponentType {
        const me = this;
        me.reIndex();
        return me.pCollection.getAt(me.index[index]);
    }

    /**
     * Dispatches an itemSwap event to the registered controllers
     *
     * @protected
     * @param {ChildComponentType} itemA
     * @param {number} itemAIndex
     * @param {ChildComponentType} itemB
     * @param {number} itemBIndex
     * @memberof Collection
     */
    protected dispatchItemSwap(
        itemA: ChildComponentType,
        itemAIndex: number,
        itemB: ChildComponentType,
        itemBIndex: number
    ) {
        const me = this;
        me.performLayout();
        me.dispatchEvent("onItemSwap", [itemA, itemAIndex, itemB, itemBIndex]);
    }

    /**
     * Dispatches an itemRemove event to the registered controllers.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchItemRemoveEvent(item: ChildComponentType, index: number) {
        const me = this;
        me.performLayout();
        me.dispatchEvent(eUICollectionEvents.onItemRemove, [item, index]);
    }

    /**
     * Dispatches the onTruncate event.
     *
     * @protected
     * @memberof Collection
     */
    protected dispatchTruncateEvent() {
        const me = this;
        me.performLayout();
        me.dispatchEvent(eUICollectionEvents.onTruncate);
    }

    /**
     * Dispatches an itemAdd event to the registered controllers.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchItemAddEvent(item: ChildComponentType, index: number) {
        const me = this;
        me.performLayout();
        me.dispatchEvent(eUICollectionEvents.onItemAdd, [item, index]);
    }

    /**
     * Dispatches an itemMove event to the registered controllers.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchItemMoveEvent(item: ChildComponentType, index: number) {
        const me = this;
        me.performLayout();
        me.dispatchEvent(eUICollectionEvents.onItemMove, [item, index]);
    }

    /**
     * Dispatches a sort event to the registered controllers.
     *
     * @protected
     * @param {ChildComponentType} item
     * @param {number} index
     * @memberof Collection
     */
    protected dispatchSortEvent() {
        const me = this;
        me.performLayout();
        me.dispatchEvent(eUICollectionEvents.onSort);
    }

    /**
     * Dispatches a filter event to the registered controllers.
     *
     * @protected
     * @param {boolean} filterState
     * @memberof Collection
     */
    protected dispatchOnFilter(filterState: boolean) {
        const me = this;
        if (me.isRendered && me.containerElement) {
            me.performLayout();
        }
        me.dispatchEvent(eUICollectionEvents.onFilter, [filterState]);
    }

    /**
     * Renders the items and puts them into the stash to be activated
     * on performLayout.
     *
     *
     * @protected
     * @memberof Collection
     */
    protected renderElements() {
        const me = this;
        me.forEach(item => {
            me.stashElement(me.renderItemInternal(item));
        }, true);
    }

    /**
     * Temporarily hold an HTMLElement for later use
     *
     * @protected
     * @param {HTMLElement} e
     * @memberof Collection
     */
    protected stashElement(el: HTMLElement) {
        this.stash.appendChild(el);
    }

    /**
     * @override
     * @protected
     * @memberof Collection
     */
    protected finalizeRender() {
        super.finalizeRender();
        this.renderElements();
    }
}
