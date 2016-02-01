var gutil = require('gulp-util'),
    path = require('path'),
    Environment = require('./tasks/Environment'),
    pkg = require('./package.json');

var config = {

  /**
   * Built javascript files relative to bin path.
   *
   * @type {Object<String, String>}
   */
  artifacts: {
    debug: 'brandy.js',
    release: 'brandy.min.js'
  },

  /**
   * Entry point relative to source path.
   *
   * @type {String}
   */
  entry: 'index.js',

  /**
   * Environment helper.
   *
   * @type {tasks/Environment}
   */
  environment: new Environment(gutil.env.target),

  /**
   * Symbol that should be be exported under the `expose` module.
   *
   * @type {String}
   */
  module: 'Brandy',

  /**
   * Package.json contents.
   *
   * @type {Object}
   */
  package: pkg,

  /**
   * Notable project paths.
   *
   * @type {Object}
   */
  paths: {
    bin: path.join(__dirname, './bin'),
    source: path.join(__dirname, './source'),
    tasks: path.join(__dirname, './tasks'),
    tests: path.join(__dirname, './tests'),

    /**
     * Returns a list of paths that are not related to build artifacts.
     *
     * @return {Array<String>}
     */
    project: function () {
      return [
        this.source,
        this.tasks,
        this.tests
      ];
    }
  },

  /**
   * Project root path.
   *
   * @type {String}
   */
  root: __dirname
};

module.exports = config;
