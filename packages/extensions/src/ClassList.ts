(function() {
    var BlendDOMException = function(type: string, message: string) {
        this.name = type;
        this.code = (<any>DOMException)[type];
        this.message = message;
    };

    /**
     * Make the DOMx inherit from Error
     */
    BlendDOMException.prototype = (<any>Error).prototype;

    /**
     * Checks the token and gets its index if possible.
     * This function will throw an Error if the token
     * has an invalid syntax
     * @param classList
     * @param token
     */
    var checkTokenAndGetIndex = function(classList: Array<string>, token: string) {
        if (token === '') {
            throw new (<any>BlendDOMException('SYNTAX_ERR', 'An invalid or illegal string was specified'))();
        }
        if (/\s/.test(token)) {
            throw new (<any>BlendDOMException('INVALID_CHARACTER_ERR', 'String contains an invalid character'))();
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
    var ClassList = function(el: Element) {
        var me = this;

        me.$refresh = function() {
            var trimmed = (el.getAttribute('class') || '').trim() || '',
                classes = trimmed ? trimmed.split(/\s+/) : [];
            classes.forEach(function(item) {
                (<any>me).push(item);
            });
        };

        /**
         * Instance function
         */
        me.sync = function() {
            el.setAttribute('class', this.toString());
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
        return (<any>this).join(' ');
    };

    // TODO:1109 Test this function
    /**
     * Adds or removes a class name
     */
    ClassList.prototype.set = function(className: string, addRemove: boolean) {
        var me = this;
        addRemove = addRemove === undefined ? true : addRemove;
        if (addRemove) {
            me.add(className);
        } else {
            me.remove(className);
        }
    };

    /**
     * Adds one or more tokens
     */
    ClassList.prototype.add = function() {
        var me = this,
            updated = false,
            item;
        for (var i = 0; i !== arguments.length; i++) {
            item = (arguments[i] + '').trim();
            if (checkTokenAndGetIndex(me, item) === -1) {
                (<any>me).push(item);
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
    ClassList.prototype.remove = function() {
        var me = this,
            updated = false,
            item,
            index;
        for (var i = 0; i !== arguments.length; i++) {
            item = (arguments[i] + '').trim();
            index = checkTokenAndGetIndex(me, item);
            if (index !== -1) {
                (<any>me).splice(index, 1);
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
    ClassList.prototype.contains = function(value: string) {
        return checkTokenAndGetIndex(this, value + '') !== -1;
    };

    /**
     * Toggles a token
     */
    ClassList.prototype.toggle = function(value: any, force?: boolean) {
        value = (value + '').trim();
        if (this.contains(value)) {
            return force === true || (this.remove(value), false);
        } else {
            return force === false ? false : (this.add(value), true);
        }
    };

    /**
     * Replaces one token with another
     */
    ClassList.prototype.replace = function(oldClass: string, newClass: string): boolean {
        var me = this,
            index = checkTokenAndGetIndex(this, oldClass);
        if (index !== -1) {
            (<any>me).splice(index, 1, newClass);
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
    var classListBuilder = function() {
        return new (<any>ClassList)(this);
    };

    /**
     * Overwrite the default classList by ours
     */
    Object.defineProperty(Element.prototype, 'classList', {
        get: classListBuilder,
        enumerable: true,
        configurable: true
    });

    /**
     * Force overwrite the IE11 behavior. IE11 Does not allow overwriting of the
     * Element.prototype.classList upon testing. The solution for this problem
     * was to overwrite the HTMLElement.prototype.classList
     */
    var el = window.document.createElement('_');
    if (el.classList.remove !== ClassList.prototype.remove) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: classListBuilder,
            enumerable: true,
            configurable: true
        });
    }
})();

export {};
