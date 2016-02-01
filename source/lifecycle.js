/**
 * Describes possible object lifecycles.
 *
 * @enum {String}
 */
var Lifecycle = {
  TRANSIENT: 'TRANSIENT',
  SINGLETON: 'SINGLETON',

  /**
   * Parses a value to a valid enum type.
   *
   * @throws {Error} If unable to parse.
   *
   * @param  {String} value
   * @return {String}
   */
  parse: function (value) {
    var result = null;

    if (typeof value == 'string') {
      var name = value.toUpperCase();

      if (this[name] == name) {
        result = this[name];
      }
    }

    if (result == null) {
      throw new Error('Unable to parse ' + value + ' as Lifecycle.');
    }

    return result;
  }
};

module.exports = Lifecycle;
