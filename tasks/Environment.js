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
 * Determines if this environment is a target.
 *
 * @param  {!String}  target
 * @return {Boolean}
 */
Environment.prototype.is = function (target) {
  return Environment.is(this._current, target);
};

module.exports = Environment;
