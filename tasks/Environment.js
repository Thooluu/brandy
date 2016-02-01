/**
 * Environment enum and helpers.
 *
 * @type {Object}
 */
var Environment = function (current) {
  this._current = Environment.parseTarget(current);
};

/**
 * Environments enum.
 *
 * @enum
 */
Environment.targets = {
  debug: 'debug',
  release: 'release'
};

/**
 * Determines if a provided value is equal to the target.
 *
 * @param  {!String}  target
 * @param  {!String}  value
 * @return {!Boolean}
 */
Environment.is = function (target, value) {
  return Environment.parseTarget(target) === value;
};

/**
 * Parses a value to determine which environment a value represents. If the
 * value cannot be parsed, 'debug' is returned.
 *
 * @param  {*} value
 * @return {!String}
 */
Environment.parseTarget = function (value) {
  return Environment.tryParseTarget(value) || this.targets.debug;
};

/**
 * Trys to parse a value to determine which environment a value represents.
 * If the value cannot be parsed, null is returned.
 *
 * @param  {*} value
 * @return {?String}
 */
Environment.tryParseTarget = function (value) {
  var environment = null;

  if (typeof value === 'string') {
    environment = Environment.targets[value.toLowerCase()];
  }

  return environment;
};

/**
 * Returns current environment.
 *
 * @return {!String}
 */
Environment.prototype.getCurrent = function () {
  return this._current;
};

/**
 * Returns a value from a kv object keyed by environment.
 *
 * @param  {!Object<String, *>} values
 * @param  {String=} target If a target is not provided, current is used.
 * @return {?*}
 */
Environment.prototype.getEnvironmentValue = function (values, target) {
  if (values === 'undefined') {
    return null;
  }

  var environment = Environment.tryParseTarget(target) || this._current,
      result = values.debug;

  if (typeof values[environment] !== 'undefined') {
    result = values[environment];
  }

  return result;
};

/**
 * Determines if this environment is a target.
 *
 * @param  {!String}  target
 * @return {Boolean}
 */
Environment.prototype.is = function (target) {
  return Environment.is(this._current, target);
};

module.exports = Environment;
