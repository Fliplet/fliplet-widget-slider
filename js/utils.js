/**
 * Native JavaScript utilities to replace lodash methods
 * These functions provide equivalent functionality to commonly used lodash methods
 */

window.FlipletSliderUtils = {
  /**
   * Safely get a nested property from an object
   * Replacement for _.get()
   * @param {Object} obj - The object to query
   * @param {string|Array} path - The path to the property (dot notation string or array of keys)
   * @param {*} [defaultValue] - The value returned if the path is not found
   * @returns {*} The resolved value or defaultValue
   * @description Safely retrieves a nested property value from an object using dot notation or array path
   * @example
   * FlipletSliderUtils.get({a: {b: 2}}, 'a.b'); // 2
   * FlipletSliderUtils.get({a: {b: 2}}, ['a', 'b']); // 2
   * FlipletSliderUtils.get({a: {b: 2}}, 'a.c', 'default'); // 'default'
   */
  get: function(obj, path, defaultValue) {
    if (obj == null) return defaultValue;
    var keys = Array.isArray(path) ? path : String(path).split('.');
    var result = obj;
    for (var i = 0; i < keys.length; i++) {
      if (result == null) return defaultValue;
      result = result[keys[i]];
    }
    return result === undefined ? defaultValue : result;
  },

  /**
   * Iterate over collection
   * Replacement for _.forEach()
   * @param {Array|Object} collection - The collection to iterate over
   * @param {Function} iteratee - The function to call for each element
   * @returns {void}
   * @description Iterates over elements of a collection and calls the iteratee for each element
   * @example
   * FlipletSliderUtils.forEach([1, 2, 3], x => console.log(x)); // logs 1, 2, 3
   * FlipletSliderUtils.forEach({a: 1, b: 2}, (value, key) => console.log(key, value)); // logs 'a 1', 'b 2'
   */
  forEach: function(collection, iteratee) {
    if (collection == null) return;
    var isArrayLike = (typeof collection !== 'function') && typeof collection.length === 'number';
    if (Array.isArray(collection) || isArrayLike) {
      for (var i = 0; i < collection.length; i++) {
        iteratee(collection[i], i, collection);
      }
      return;
    }
    var keys = Object.keys(collection);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      iteratee(collection[key], key, collection);
    }
  },

  /**
   * Check if any element matches predicate
   * Replacement for _.some()
   * @param {Array|Object} collection - The collection to check
   * @param {Function} predicate - The function to test each element
   * @returns {boolean}
   */
  some: function(collection, predicate) {
    if (collection == null) return false;
    var isArrayLike = (typeof collection !== 'function') && typeof collection.length === 'number';
    if (Array.isArray(collection) || isArrayLike) {
      for (var i = 0; i < collection.length; i++) {
        if (predicate(collection[i], i, collection)) return true;
      }
      return false;
    }
    var keys = Object.keys(collection);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      if (predicate(collection[key], key, collection)) return true;
    }
    return false;
  },

  /**
   * Assign properties from source into target (shallow)
   * Replacement for _.assign()
   */
  assign: function(target, source) {
    if (target == null) throw new TypeError('FlipletSliderUtils.assign: target cannot be null or undefined');
    target = Object(target);
    if (source != null) {
      var keys = Object.keys(Object(source));
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        target[key] = source[key];
      }
    }
    return target;
  },

  /**
   * Check if value is empty
   * Replacement for _.isEmpty()
   * @param {*} value - The value to check
   * @returns {boolean} True if the value is empty, false otherwise
   * @description Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
   * @example
   * FlipletSliderUtils.isEmpty(null); // true
   * FlipletSliderUtils.isEmpty([]); // true
   * FlipletSliderUtils.isEmpty({}); // true
   * FlipletSliderUtils.isEmpty(''); // true
   * FlipletSliderUtils.isEmpty([1, 2, 3]); // false
   */
  isEmpty: function(value) {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  /**
   * Find first element matching predicate
   * Replacement for _.find()
   * @param {Array} array - The array to search
   * @param {Function|Object|*} predicate - The function, object, or value to test each element
   * @returns {*} The first matching element or undefined
   * @description Finds the first element in an array that matches the predicate
   * @example
   * FlipletSliderUtils.find([1, 2, 3], x => x > 1); // 2
   * FlipletSliderUtils.find([{a: 1}, {a: 2}], {a: 2}); // {a: 2}
   * FlipletSliderUtils.find([1, 2, 3], 2); // 2
   */
  find: function(array, predicate) {
    if (typeof predicate === 'function') {
      return array.find(predicate);
    }
    if (typeof predicate === 'object') {
      return array.find(function(item) {
        var keys = Object.keys(predicate);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (item == null || item[key] !== predicate[key]) return false;
        }
        return true;
      });
    }
    return array.find(function(item) { return item === predicate; });
  },

  /**
   * Simple debounce implementation
   * Replacement for _.debounce()
   * @param {Function} func - The function to debounce
   * @param {number} wait - The number of milliseconds to delay
   * @returns {Function} The debounced function
   * @description Creates a debounced function that delays invoking func until after wait milliseconds
   * @example
   * const debouncedFn = FlipletSliderUtils.debounce(() => console.log('called'), 100);
   * debouncedFn(); // Will be called after 100ms if not called again
   */
  debounce: function(func, wait) {
    let timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() { func.apply(context, args); }, wait);
    };
  },

  /**
   * Check if value is an object
   * Replacement for _.isObject()
   * @param {*} value - The value to check
   * @returns {boolean} True if the value is an object, false otherwise
   * @description Checks if a value is an object (including arrays)
   * @example
   * FlipletSliderUtils.isObject({}); // true
   * FlipletSliderUtils.isObject([]); // true
   * FlipletSliderUtils.isObject('string'); // false
   */
  isObject: function(value) {
    return value != null && (typeof value === 'object' || typeof value === 'function');
  },

  /**
   * Sort array by property or function
   * Replacement for _.sortBy()
   * @param {Array} array - The array to sort
   * @param {Function|string} iteratee - The iteratee function or property path
   * @returns {Array} A new sorted array
   * @description Creates a new array sorted by the result of the iteratee
   * @example
   * FlipletSliderUtils.sortBy([{a: 3}, {a: 1}, {a: 2}], 'a'); // [{a: 1}, {a: 2}, {a: 3}]
   * FlipletSliderUtils.sortBy([3, 1, 2], x => x); // [1, 2, 3]
   */
  sortBy: function(array, iteratee) {
    var getKey = typeof iteratee === 'function' ? iteratee : function(item) { return window.FlipletSliderUtils.get(item, iteratee); };
    return array.slice().sort(function(a, b) {
      var valueA = getKey(a);
      var valueB = getKey(b);
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  },

  /**
   * Find index of element
   * Replacement for _.findIndex()
   * Supports function, [key, value] pair, or object matcher
   */
  findIndex: function(array, predicate) {
    if (!array || !array.length) return -1;
    if (typeof predicate === 'function') {
      for (var i = 0; i < array.length; i++) {
        if (predicate(array[i], i, array)) return i;
      }
      return -1;
    }
    if (Array.isArray(predicate) && predicate.length === 2) {
      var key = predicate[0];
      var val = predicate[1];
      for (var j = 0; j < array.length; j++) {
        if (array[j] && array[j][key] === val) return j;
      }
      return -1;
    }
    if (predicate && typeof predicate === 'object') {
      var keys = Object.keys(predicate);
      for (var k = 0; k < array.length; k++) {
        var match = true;
        for (var m = 0; m < keys.length; m++) {
          var prop = keys[m];
          if (array[k] == null || array[k][prop] !== predicate[prop]) { match = false; break; }
        }
        if (match) return k;
      }
    }
    return -1;
  },

  /**
   * Remove elements from array that match predicate, [key, value] pair or object matcher
   * Replacement for _.remove()
   */
  remove: function(array, predicate) {
    if (!Array.isArray(array)) return [];
    var removed = [];
    for (var i = array.length - 1; i >= 0; i--) {
      var item = array[i];
      var shouldRemove = false;
      if (typeof predicate === 'function') {
        shouldRemove = predicate(item, i, array);
      } else if (Array.isArray(predicate) && predicate.length === 2) {
        shouldRemove = item && item[predicate[0]] === predicate[1];
      } else if (predicate && typeof predicate === 'object') {
        var keys = Object.keys(predicate);
        shouldRemove = true;
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];
          if (item == null || item[key] !== predicate[key]) { shouldRemove = false; break; }
        }
      }
      if (shouldRemove) {
        removed.push(array[i]);
        array.splice(i, 1);
      }
    }
    return removed;
  }
}; 