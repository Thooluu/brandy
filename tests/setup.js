var path = require('path');

/**
 * Global test common library.
 *
 * @type {Object}
 */
var TestCommon = {};

/**
 * Project require. Requires from source first, if fails fall back to normal requrie.
 *
 * @param  {!String} file
 * @return {?T}
 */
TestCommon.require = function (file) {
  var result = null;

  try {
    result = require(path.join(this.root, 'source', file));
  } catch (e) {
    result = require(file);
  }

  return result;
};

/**
 * Project root path.
 *
 * @type {String}
 */
TestCommon.root = path.join(__dirname, '..');

global.TestCommon = TestCommon;
