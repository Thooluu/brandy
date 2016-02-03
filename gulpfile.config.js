var gutil = require('gulp-util'),
    path = require('path'),
    Environment = require('./tasks/Environment'),
    pkg = require('./package.json');

var config = {

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
    examples: path.join(__dirname, './examples'),
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
        this.examples,
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
