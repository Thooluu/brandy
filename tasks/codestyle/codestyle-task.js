var _ = require('lodash'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    path = require('path');

/**
 * Registers the code style task.
 *
 * @param  {!Gulp} gulp
 * @param  {!Object} config
 */
var register = function (gulp, config) {
  var paths = config.paths.project()
    .map(function (value) {
      return path.join(value, '**/*.js');
    });

  gulp.task('codestyle', function () {
    return gulp.src(paths)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jshint());
  });
};

module.exports = register;
