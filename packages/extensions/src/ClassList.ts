// tslint:disable:no-shadowed-variable
// tslint:disable:no-var-keyword
// tslint:disable:only-arrow-functions
// tslint:disable:variable-name
(function() {
    const is_string = (value: any): boolean => {
        return typeof value === "string";
    };

    const is_object = (value: any): boolean => {
        return typeof value === "object";
    };

    function BlendDOMException(type: string, message: string) {
        this.name = type;
        this.code = (DOMException as any)[type];
        this.message = message;
    }

    /**
     * Make the DOMx inherit from Error
     */
    BlendDOMException.prototype = (Error as any).prototype;

    /**
     * Checks the token and gets its index if possible.
     * This function will throw an Error if the token
     * has an invalid syntax
     * @param classList
     * @param token
     */
    const checkTokenAndGetIndex = (classList: string[], token: string) => {
        if (token === "") {
            throw new BlendDOMException("SYNTAX_ERR", "An invalid or illegal string was specified");
        }
        if (/\s/.test(token)) {
            throw new BlendDOMException("INVALID_CHARACTER_ERR", "String contains an invalid character");
        }
        return classList.indexOf(token);
    };

    /**
     * Have have our custom classList implementation mainly because of
     * IE11's incomplete implementation compared to other browser.
     *
     * This custom implementation is by definition slower than the native
     * DOMTokenList but the performance and memory penalty is negligible
     * due the speed to new browsers.
     *
     * Once the support for IE11 has been propped then this polyfill
     * can be removed from Blend.
     */
    const ClassList = function(el: Element) {
        const me = this;

        me.$refresh = () => {
            const trimmed = (el.getAttribute("class") || "").trim() || "",
                classes = trimmed ? trimmed.split(/\s+/) : [];
            classes.forEach(item => {
                (me as any).push(item);
            });
        };

        /**
         * Instance function
         */
        me.sync = function() {
            el.setAttribute("class", this.toString());
        };

        me.$refresh();
    };

    /**
     * Make the classList effectively extend from am array
     */
    ClassList.prototype = [];

    /**
     * Convert the token to a string
     */
    ClassList.prototype.toString = function() {
        return (this as any).join(" ");
    };

    // TODO:1109 Test this function
    /**
     * Adds or removes a class name
     */
    (ClassList.prototype as any).set = function(
        className: string | object | string[] | Array<[]>,
        addRemove?: boolean
    ) {
        const me = this;
        let css = is_string(className)
            ? [className as string]
            : is_object(className)
            ? Object.keys(className as object).map(key => className[key])
            : (className as string[]);
        addRemove = addRemove === undefined ? true : addRemove;

        // make sure we have an array to continue with.
        css = css || [];

        css.forEach(item => {
            if (item.length && item.length === 2) {
                if (item[1] === true) {
                    me.add(item[0]);
                } else {
                    me.remove(item[0]);
                }
            } else {
                if (item !== "") {
                    if (addRemove) {
                        me.add(item);
                    } else {
                        me.remove(item);
                    }
                }
            }
        });
    };

    /**
     * Adds one or more tokens
     */
    (ClassList.prototype as any).add = function() {
        const me = this;
        let updated = false,
            item;
        for (let i = 0; i !== arguments.length; i++) {
            item = (arguments[i] + "").trim();
            if (checkTokenAndGetIndex(me, item) === -1) {
                (me as any).push(item);
                updated = true;
            }
        }
        if (updated) {
            me.sync();
        }
    };

    /**
     * Remove or one more tokens
     */
    (ClassList.prototype as any).remove = function() {
        const me = this;
        let updated = false,
            item,
            index;
        for (let i = 0; i !== arguments.length; i++) {
            item = (arguments[i] + "").trim();
            index = checkTokenAndGetIndex(me, item);
            if (index !== -1) {
                (me as any).splice(index, 1);
                updated = true;
            }
        }
        if (updated) {
            me.sync();
        }
    };

    /**
     * Checks if an token contains in the list
     */
    (ClassList.prototype as any).contains = function(value: string) {
        return checkTokenAndGetIndex(this, value + "") !== -1;
    };

    /**
     * Toggles a token
     */
    (ClassList.prototype as any).toggle = function(value: any, force?: boolean) {
        value = (value + "").trim();
        if (this.contains(value)) {
            return force === true || (this.remove(value), false);
        } else {
            return force === false ? false : (this.add(value), true);
        }
    };

    /**
     * Replaces one token with another
     */
    (ClassList.prototype as any).replace = function(oldClass: string, newClass: string): boolean {
        const me = this,
            index = checkTokenAndGetIndex(this, oldClass);
        if (index !== -1) {
            (me as any).splice(index, 1, newClass);
            me.sync();
            return true;
        } else {
            return false;
        }
    };

    /**
     * Function that is used to create a new instance of ClassList
     * for en Element instance
     */
    const classListBuilder = function() {
        return new (ClassList as any)(this);
    };

    /**
     * Overwrite the default classList by ours
     */
    Object.defineProperty(Element.prototype, "classList", {
        get: classListBuilder,
        // tslint:disable-next-line:object-literal-sort-keys
        configurable: true,
        enumerable: true
    });

    /**
     * Force overwrite the IE11 behavior. IE11 Does not allow overwriting of the
     * Element.prototype.classList upon testing. The solution for this problem
     * was to overwrite the HTMLElement.prototype.classList
     */
    const el = window.document.createElement("_");
    if (el.classList.remove !== (ClassList.prototype as any).remove) {
        Object.defineProperty(HTMLElement.prototype, "classList", {
            get: classListBuilder,
            // tslint:disable-next-line:object-literal-sort-keys
            enumerable: true,
            configurable: true
        });
    }
})();

export {};
