/**
 * Created by xyaalinxsc on 19/04/15.
 */
/**
 * Class for a manage array of
 * objects from a database MongoDB
 *
 * @param length
 *
 * @method splice
 * @constructor
 */
var SuperArray = function (length) {
    /**
     * Constructor of array
     */
    if (arguments.length === 1 && typeof length === 'number') {
        this.length = (length > -1) && (length === parseInt(length)) ? length : this.push(length);
    } else if (arguments.length === 1 && typeof length === 'object' && length.constructor.toString().indexOf('Array') > -1) {
        for (var i = 0; i < length.length; i++) {
            this.push(length[i]);
        }
    } else if (arguments.length) {
        this.push.apply(this, arguments);
    }

    /**
     * Max depths for compare object
     * @type {number}
     */
    this.depth = -1;

    /**
     * Setter for depth attribute
     *
     * @param depth
     */
    this.setDepth = function (depth) {
        this.depth = depth === undefined ? -1 : depth;
    };

    /**
     * Get object by _id
     *
     * @param id identifier to search
     *
     * @returns {Object|null} Return object found or null otherwise
     */
    this.getById = function(id) {
        return this.getBy('_id', id);
    };

    /**
     * Get object by key in the object
     *
     * @param key   name of attribute
     * @param value value to search
     *
     * @returns {Object|null} Return object found or null otherwise
     */
    this.getBy = function(key, value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i][key] === value) {
                return this[i];
            }
        }
        return null;
    };

    /**
     * Get object with his index by key in the array
     *
     * @param key   name of attribute
     * @param value value to search
     * @returns {{
     *      index: int,
     *      el: Object
     * }|null}
     */
    this.getIndexElementBy = function (key, value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i][key] === value) {
                return {
                    index: i,
                    el: this[i]
                };
            }
        }
        return null;
    };

    /**
     * Get object with his index by key in the array
     *
     * @param id identifier to search
     * @returns {{
     *      index: int,
     *      el: Object
     * }}
     */
    this.getIndexElementById = function (id) {
        return this.getIndexElementBy('_id', id);
    };

    /**
     * Get array of objects by key in the array
     *
     * @param key   name of attribute use to filter
     * @param value value to search
     * @returns {Array} Return array of object or empty array
     */
    this.getAllBy = function (key, value) {
        var objects = [];
        for (var i=0; i < this.length; i++) {
            if (this[i][key] === value) {
                objects.push(this[i]);
            }
        }
        return objects;
    };

    /**
     * Remove object by key
     *
     * @param key   name of attribute
     * @param value value to search
     *
     * @returns {Object|null} object removed or null if not exist
     */
    this.removeBy = function (key, value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i][key] === value) {
                var obj = this[i];
                /** @noinspection JSUnresolvedFunctionInspection */
                this.splice(i, 1);
                return obj;
            }
        }
        return null;
    };

    /**
     * Remove object by _id
     *
     * @param id identifier of the object
     *
     * @returns {Object|null} object removed or null if not exist
     */
    this.removeById = function (id) {
        return this.removeBy('_id', id);
    };

    /**
     * Remove value in array
     *
     * @param value object to remove
     *
     * @returns {boolean} True if removed, false otherwise
     */
    this.remove = function(value) {
        if (typeof value === "object") {
            throw new Error("value is an object !");
        }

        var ind = this.indexOf(value);
        if (ind !== -1) {
            this.splice(ind, 1);
            return true;
        }
        return false;
    };

    /**
     * Check if obj exist in array with JSON.stringify or custom function
     *
     * @param obj Object to search
     * @param compare Function to compare
     * @param ignoreId If you want not check '_id' attribute (object MongoDB)
     */
    this.exist = function (obj, compare, ignoreId) {
        if (typeof compare === "boolean") {
            ignoreId = compare;
            compare = compareTo;
        } else if (typeof compare !== "function") {
            compare = compareTo;
        }
        if (ignoreId === undefined) {
            ignoreId = false;
        }

        for (var i = 0; i < this.length; i++) {
            depth = -1;
            if (compare(this[i], obj, ignoreId)) {
                return true;
            }
        }

        return false;
    };


    var that = this;
    var depth = -1;
    /**
     * Compare all attribute of objects
     *
     * @param obj1 Object 1
     * @param obj2 Object 2
     * @param ignoreId Not check id mongoDB
     * @returns {boolean}
     */
    var compareTo = function (obj1, obj2, ignoreId) {
        depth++;
        if (that.depth !== -1 && depth > that.depth) {
            return true;
        }
        for (var key in obj1) {
            if (ignoreId && key === '_id') {
                break;
            }

            if (!obj1.hasOwnProperty(key) || !obj2.hasOwnProperty(key)) {
                return false;
            }

            switch (typeof obj1[key]) {
                case 'object':
                    if (!compareTo(obj1[key], obj2[key], ignoreId)) {
                        return false;
                    }
                    break;
                default:
                    if (obj1[key] !== obj2[key]) {
                        return false;
                    }
            }
        }
        return true;
    };

    /**
     * Add definitions of functions inherited
     */
    this.splice  = [].splice;
    this.indexOf = [].indexOf;
    this.push    = [].push;
};

SuperArray.prototype = [];