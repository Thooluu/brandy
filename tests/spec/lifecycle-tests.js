var expect = require('chai').expect;

describe('Lifecycle', function () {
  var Lifecycle = TestCommon.require('lifecycle');

  describe('parse', function () {
    it('should parse valid values.', function () {
      expect(Lifecycle.parse('tRanSient')).to.equal(Lifecycle.TRANSIENT);
      expect(Lifecycle.parse('SingleTON')).to.equal(Lifecycle.SINGLETON);
    });

    it('should throw on invalid valid values.', function () {
      var throwMe = function () {
        Lifecycle.parse('cupcake');
      };

      expect(throwMe).to.throw();
    });
  });
});
