# Brandy IoC
Brandy is a small, no hassle, isomorphic IoC library with no external dependencies and no opinions.

## Why brandy?
There are many IoC solutions available for javascript ranging from complete libraries/framework from some all-in-one solutions like [bottlejs](https://www.npmjs.com/package/bottlejs), [wire](https://github.com/cujojs/wire), [angular-di](https://github.com/angular/di.js/) to dozens of 'lite', niche, or domain specific implementations. Brandy was designed with three considerations; simplicity, size, and power. Brandy is simple to install, configure, and use. The entire api contains only 3 methods. With this simplicity comes freedom. Brandy has no opinions on project or module structure so you are free to write code the way you want. Brandy is small. It has no external dependencies, when minimized and gzipped the entire library weighs ~1.4k. Brandy is powerful sporting professional features such as implementation and factory binding, lifecycle support, lazy resolution, and cycle detection.

### Features
* Both implementation and factory binding.
* Constructor injection. Setter injection can be accomplished using factories.
* Lifecycles. Register bindings as transitive or singletons.
* Container registry can be swapped for custom implementations.
* Lazy. Dependencies are resolved and cached as needed. Don't worry about order of registration.
* Explicit. There is no magic. No function argument name reflections, no annotations, no monkey patching properties.

## Installation
```bash
npm install brandy --save
```

## Usage
Include, register, and enjoy.

```javascript
var Brandy = require('brandy'),
    container = new Brandy();

var Foo = function (bar) {
  this.bar = bar;
};

var Bar = function () {};

// we are binding a type to a specific implementation (constructor).
container.bind('Foo', Foo, ['Bar']);
container.bind('Bar', Bar);

var foo = container.instance('Foo');
```

## Api
### Brandy
When called with either new or directly invoked, a preconfigured Container instance is returned. The default registry and
cache only support string names.

```javascript
var newBrandy = new Brandy(); // using default a string to Function type registry.
var brandy = Brandy();
```

#### Container<T>(cache: T, registry: T)
Creates a new instance of a container using a specific implementation of cache and registry.

```javascript
var createMapRegistry = function() {
  var map = new Map();

  var keys = function () {
    return Array.from(map.keys());
  };

  var get = function (key) {
    return map.get(key);
  };

  var set = function (key, value) {
    map.set(key, value);
  };

  return {
    get: get,
    keys: keys,
    set: set
  };
};

var brandy = new Brandy.Container(createMapRegistry(), createMapRegistry()); // we can now use arbitary type keys!
brandy.bind(Foo, FooStub, [Bar, Baz]);
brandy.bind(Bar, Bar);
brandy.bind(Baz, BazStub);
```

#### version: String
A string describing the current work version of Brandy.

### Container
The container is the backbone of Brandy. It handles registration and resolving of bindings.

#### bind(type: T, implementation: Function [, lifecycle: Lifecycle] [, dependencies: Array<T>]): Container
Binds a constructor to some type. T can be any type supported by the underlying registry. By default this is a string.

```javascript
brandy.bind('Foo', Foo); // just bind foo with the default lifecycle and no deps.
brandy.bind('Bar', Bar, 'transient'); // bind bar with a transient lifecycle.
brandy.bind('Baz', Baz, 'singleton', ['Bar', 'Foo']); // bind baz explicity as a singleton with Bar and Foo dependencies.
```

#### factory(type: T, factory: Function(container: Container) [, lifecycle: Lifecycle]): Container
Binds a factory to a type. Unlike the implementation bindings, factories are invoked without a new operator and get passed in a instances of
the current container to resolve dependencies they may need manualy. T can be any type supported by the underlying registry.

```javascript
// Create a new foo with the default lifecycle and property injection of bar.
brandy.factory('Foo', function (container) {
  var foo = new Foo();
  foo.bar = container.instance('Bar');

  return foo;
});

// Return a literal as a transient object.
brandy.factory('Bar', function (container) {
  return {
    name: 'bar'
  };
}, 'transient');
```

#### instance(type: T): U
Returns an instance bound to type. All relevant dependencies get computed and resolved on instance request.

```javascript
brandy.bind('Foo', Foo, 'transient', ['Bar'])
brandy.bind('Bar', Bar, 'singleton');

var foo1 = brandy.instance('Foo'),
    foo2 = brandy.instance('Foo'),
    bar1 = brandy.instance('Bar'),
    bar2 = brandy.instance('Bar');

foo1 === foo2 // false
foo1.bar == foo2.bar // true
bar1 === bar2 // true
```

### Lifecycle
Lifecycles can be one of two values case invariant values; __transient__ and __singleton__(default). Any other value will throw an exception.

```javascript
brandy.bind('Foo', Foo, 'transient');
brandy.bind('Bar', Bar); // singleton
brandy.bind('Baz', Baz, 'singleton');
brandy.bind('Quix', Quix, 'boom'); // explode
```

## License
[MIT](LICENSE)
