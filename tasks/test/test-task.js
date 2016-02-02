var mocha = require('gulp-mocha'),
    path = require('path'),
    RcLoader = require('rcloader');

/**
 * Runtime config loader.
 *
 * @type {RcLoader}
 */
var loader = new RcLoader('.mocharc');

/**
 * Mocha runtime config loader.
 *
 * @param  {!String} path
 * @return {!Object}
 */
var rc = function (path) {
  return loader.for(path);
};

/**
 * Register the testing task. Mocha configuration can be found in the .mocharc
 * in the root of the project.
 *
 * @param {!Gulp} gulp
 * @param {!Object} config
 */
var register = function (gulp, config) {
  var tests = path.join(config.paths.tests, '**/*-tests.js'),
      mochaConfig = rc(config.paths.tests);

  gulp.task('test', function () {
    return gulp.src(tests)
      .pipe(mocha(mochaConfig));
  });
};

module.exports = register;
