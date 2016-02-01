/**
 * Register the top level build task.
 *
 * @param  {!Gulp} gulp
 * @param  {!Object} config
 */
var register = (gulp, config) => {
  gulp.task('build', ['codestyle', 'build/javascript']);
};

module.exports = register;
