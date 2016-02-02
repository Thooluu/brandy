var expect = require('chai').expect;

describe('Brandy', function () {
  var Brandy = TestCommon.require('index'),
      Container = TestCommon.require('container');

  it('should create a new container through invocation.', function () {
    expect(Brandy()).to.be.instanceOf(Container);
  });

  it('should create a new container with new operator.', function () {
    expect(new Brandy()).to.be.instanceOf(Container);
  });

  it('should expose Container.', function () {
    expect(Brandy.Container).to.equal(Container);
  });

  it('should expose version.', function () {
    expect(Brandy.version).to.be.a('string');
  });
});
