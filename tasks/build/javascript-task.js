var path = require('path'),
    bundle = require('./pipeline/bundle'),
    header = require('./pipeline/header'),
    rename = require('./pipeline/rename'),
    template = require('./pipeline/template'),
    uglify = require('./pipeline/uglify');

/**
 * Register the top level build task.
 *
 * @param  {!Gulp} gulp
 * @param  {!Object} config
 */
var register = (gulp, config) => {
  var entry = path.join(config.paths.source, config.entry);

  gulp.task('build/javascript', () => {
    var stream = bundle(entry, config.module)
      .pipe(header('./header.tmpl', __dirname))
      .pipe(template(config.package))
      .pipe(rename(config.module, false))
      .pipe(gulp.dest(config.paths.bin));

    if (config.environment.is('release')) {
      stream
        .pipe(uglify())
        .pipe(rename(config.module, true))
        .pipe(gulp.dest(config.paths.bin));
    }

    return stream;
  });
};

module.exports = register;
