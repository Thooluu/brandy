var Container = require('./container'),
    Registry = require('./registry');

/**
 * Main module entry point.
 *
 * @return {Container}
 */
var factory = function () {
  var cache = Registry.create(),
      registry = Registry.create();

  return new Container(cache, registry);
};

module.exports = factory;
module.exports.Container = Container;
module.exports.version = '<%= version %>';
