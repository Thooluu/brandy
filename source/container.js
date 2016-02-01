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
  if (T == null) {
    throw new Error('T must be provided.');
  }

  var descriptor = this._registry.get(T);

  if (descriptor == null) {
    throw new Error(T + ' has not been registered.');
  }

  var instance = null;

  switch (descriptor.lifecycle) {
    case Lifecycle.SINGLETON:
      instance = this._resolveSingleton(descriptor);
      break;
    case Lifecycle.TRANSIENT:
      instance = this._resolveTransient(descriptor);
      break;
    default:
      throw new Error('Unsupported lifecycle ' + descriptor.lifecycle + '.');
  }

  if (instance == null) {
    throw new Error('An instance for ' + T + ' could not be constructed.');
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