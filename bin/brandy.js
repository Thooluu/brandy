/**!
 * brandy v0.0.0
 * http://www.github.com/rstone770/brandy
 *
 * Release under the MIT license.
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Brandy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Lifecycle = require('./lifecycle');

/**
 * Constructs a new object of type T with a set of parameters.
 *
 * @param  {T} T
 * @param  {Array} params
 * @return {T}
 */
var construct = function (T, params) {
  return new (Function.bind.apply(T, [null].concat(params)));
};

/**
 * Creates a container compatible factory from a constructor of type T.
 *
 * @param  {T} T
 * @param  {Array} dependencies
 * @return {Function}
 */
var asFactory = function (T, dependencies) {
  return function (container) {
    return construct(T, dependencies.map(function (dependency) {
      return container.instance(dependency);
    }));
  };
};

/**
 * @param {Registry} cache
 * @param {Registry} registry
 */
var Container = function (cache, registry) {
  if (cache == null) {
    throw new Error('cache must be provided.');
  }

  if (registry == null) {
    throw new Error('registry must be provided.');
  }

  this._cache = cache;
  this._registry = registry;
  this._pending = {};
};

/**
 * Binds an implementation to T.
 *
 * @param  {T} T
 * @param  {U} implementation
 * @param  {Lifecycle=} lifecycle
 * @param  {Array=} dependencies
 * @return {Container}
 */
Container.prototype.bind = function (T, implementation, lifecycle, dependencies) {
  if (Array.isArray(lifecycle) && arguments.length == 3) {
    dependencies = lifecycle;
    lifecycle = null;
  }

  if (T == null) {
    throw new Error('T must be provided.');
  }

  if (typeof implementation == null) {
    throw new Error('implementation must be provided.');
  }

  if (dependencies != null && !Array.isArray(dependencies)) {
    throw new Error('dependencies must be an array.');
  }

  return this.factory(T, asFactory(implementation, dependencies || []), lifecycle);
};

/**
 * Binds a factory to T.
 *
 * @param  {T} T
 * @param  {Function} factory
 * @param  {Lifecycle=} lifecycle
 * @return {Container}
 */
Container.prototype.factory = function (T, factory, lifecycle) {
  if (T == null) {
    throw new Error('T must be provided.');
  }

  if (typeof factory !== 'function') {
    throw new Error('factory must be callable.');
  }

  this._registry.set(T, {
    factory: factory,
    lifecycle: Lifecycle.parse(lifecycle || Lifecycle.SINGLETON),
    type: T
  });

  return this;
};

/**
 * Produces an instance registered to T.
 *
 * @throws {Error} If T has not been registered.
 * @throws {Error} If instance cannot be produced.
 *
 * @param  {T} T
 * @return {U}
 */
Container.prototype.instance = function (T) {
  var error = null,
      instance = null;

  if (T != null) {
    var descriptor = this._registry.get(T);

    if (descriptor != null) {
      if (typeof this._pending[descriptor.type] === 'undefined') {
        this._pending[descriptor.type] = true;

        if (descriptor.lifecycle === Lifecycle.SINGLETON) {
          instance = this._resolveSingleton(descriptor);
        } else if (descriptor.lifecycle === Lifecycle.TRANSIENT) {
          instance = this._resolveTransient(descriptor);
        } else {
          error = new Error('Unsupported lifecycle ' + descriptor.lifecycle + '.');
        }

        delete this._pending[descriptor.type];
      } else {
        error = new Error('Circular dependency detected while resolving ' + descriptor.type + '.');
      }
    } else {
      error = new Error(T + ' has not been registered.');
    }
  } else {
    error = new Error('T must be provided.');
  }

  if (error != null) {
    this._pending = {};

    throw error;
  }

  return instance;
};

/**
 * Enumerates the container and returns a list of registered values.
 *
 * @return {Array<Object>}
 */
Container.prototype.enumerate = function () {
  var registry = this._registry,
      keys = registry.keys();

  return keys.map(function (key) {
    var value = registry.get(key),
        item = {
          factory: value.factory,
          lifecycle: value.lifecycle,
          type: value.type
        };

    return item;
  });
};

/**
 * Creates a singleton instance from descriptor.
 *
 * @param  {Object} descriptor
 * @return {U}
 */
Container.prototype._resolveSingleton = function (descriptor) {
  var instance = this._cache.get(descriptor.type);

  if (instance == null) {
    this._cache.set(descriptor.type, instance = this._resolveTransient(descriptor));
  }

  return instance;
};

/**
 * Crates a transient instance from descriptor.
 *
 * @param  {Object} descriptor
 * @return {U}
 */
Container.prototype._resolveTransient = function (descriptor) {
  return descriptor.factory(this);
};

module.exports = Container;

},{"./lifecycle":3}],2:[function(require,module,exports){
var Container = require('./container'),
    Registry = require('./registry');

/**
 * Main module entry point.
 *
 * @return {!Container}
 */
var factory = function () {
  var cache = Registry.create(),
      registry = Registry.create();

  return new Container(cache, registry);
};

module.exports = factory;
module.exports.Container = Container;
module.exports.version = '0.0.0';

},{"./container":1,"./registry":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

  return this._registry[key] || null;
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

},{}]},{},[2])(2)
});