var expect = require('chai').expect;

var Foo = function (bar, baz) {
  this.bar = bar;
  this.baz = baz;
};
var Bar = function (qux) {
  this.qux = qux;
};
var Baz = function () {};
var Qux = function () {};

describe('Container', function () {
  var Container = TestCommon.require('container'),
      Registry = TestCommon.require('registry');

  var container;

  beforeEach(function () {
    container = new Container(Registry.create(), Registry.create());
  });

  describe('instance from bind', function () {
    it('should be chainable.', function () {
      expect(container.bind('Foo', Foo)).to.equal(container);
    });

    it('should create new instance.', function () {
      expect(container.bind('Foo', Foo).instance('Foo')).to.be.instanceOf(Foo);
    });

    it('should take an array of dependencies and inject them into instance on creation.', function () {
      container.bind('Foo', Foo, ['Bar', 'Baz']);
      container.bind('Bar', Bar, ['Qux']);
      container.bind('Baz', Baz);
      container.bind('Qux', Qux);

      var foo = container.instance('Foo');

      expect(foo.bar).to.be.instanceOf(Bar);
      expect(foo.baz).to.be.instanceOf(Baz);
      expect(foo.bar.qux).to.be.instanceOf(Qux);
    });
  });

  describe('instance from factory', function () {
    it('should be chainable.', function () {
      expect(container.factory('Foo', function () {})).to.equal(container);
    });

    it('should return factory created instance.', function () {
      var factory = function () {
        return new Foo();
      };

      expect(container.factory('Foo', factory).instance('Foo')).to.be.instanceOf(Foo);
    });

    it('should pass container into factory.', function (done) {
      var factory = function ($c) {
        expect($c).to.equal($c);
        done();

        return {};
      };

      container.factory('Foo', factory).instance('Foo');
    });
  });

  describe('instance', function () {
    it('should explode on circular dependencies.', function () {
      container.bind('Foo', Foo, ['Bar']);
      container.bind('Bar', Bar, ['Foo']);

      var throwMe = function () {
        container.instance('Foo');
      };

      expect(throwMe).to.throw();
    });
  });

  describe('instance lifecycles', function () {
    it('should create new instances if registered with Transient.', function () {
      var factory = function () {
        return new Bar();
      };

      container.bind('Foo', Foo, 'transient');
      container.bind('Bar', factory, 'transient');
      expect(container.instance('Foo')).to.not.equal(container.instance('Foo'));
      expect(container.instance('Bar')).to.not.equal(container.instance('Bar'));
    });

    it('should return single instance if registered with Singleton.', function () {
      var factory = function () {
        return new Bar();
      };

      container.bind('Foo', Foo, 'singleton');
      container.bind('Bar', Bar, 'singleton');
      expect(container.instance('Foo')).to.equal(container.instance('Foo'));
      expect(container.instance('Bar')).to.equal(container.instance('Bar'));
    });

    it('should use singleton by default.', function () {
      container.bind('Foo', Foo);
      expect(container.instance('Foo')).to.equal(container.instance('Foo'));
    });
  });
});
