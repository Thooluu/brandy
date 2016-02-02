var expect = require('chai').expect;

describe('Registry', function () {
  var Registry = TestCommon.require('registry');

  describe('@create', function () {
    it('should create a new instance of Registry.', function () {
      var registry = Registry.create();

      expect(registry).to.be.instanceOf(Registry);
    });
  });

  describe('set and get', function () {
    it('should be able to set and get values.', function () {
      var registry = new Registry();

      registry.set('key', 'value');
      expect(registry.get('key')).to.equal('value');
    });

    it('should be chainable.', function () {
      var registry = new Registry();

      expect(registry.set('key', 'value')).to.equal(registry);
    });
  });

  describe('keys', function () {
    it('should return all registered keys.', function () {
      var registry = new Registry(),
          keys = registry
            .set('key', 'value')
            .set('foo', 'bar')
            .keys();

      expect(keys).to.contain('key');
      expect(keys).to.contain('foo');
    });
  });
});
