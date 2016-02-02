/**
 * Determines if object contains a property.
 *
 * @param {String} key
 * @return {Boolean}
 */
var has = Object.prototype.hasOwnProperty;

/**
 * Key value storage.
 */
var Registry = function () {
  this._registry = {};
};

/**
 * Creates a Registry instance.
 *
 * @return {Registry}
 */
Registry.create = function () {
  return new Registry();
};

/**
 * Attempts to retrieve a value by key.
 *
 * @param  {String} key
 * @return {Object}
 */
Registry.prototype.get = function (key) {
  if (typeof key !== 'string') {
    throw new Error('key must be a string.');
  }

  var value = null;

  if (has.call(this._registry, key)){
    value = this._registry[key];
  }

  return value;
};

/**
 * Returns all keys in registry.
 *
 * @return {Array<String>}
 */
Registry.prototype.keys = function () {
  return Object.keys(this._registry);
};

/**
 * Sets a value to a key.
 *
 * @param {!String} key
 * @param {!Object} value
 * @return {Registry}
 */
Registry.prototype.set = function (key, value) {
  if (typeof key !== 'string') {
    throw new Error('key must be a string.');
  }

  if (value == null) {
    throw new Error('value must be provided.');
  }

  this._registry[key] = value;

  return this;
};

module.exports = Registry;
