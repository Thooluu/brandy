var path = require('path'),
    rename = require('gulp-rename'),
    bundle = require('./pipeline/bundle'),
    header = require('./pipeline/header'),
    template = require('./pipeline/template'),
    uglify = require('./pipeline/uglify');

/**
 * Register the top level build task.
 *
 * @param  {!Gulp} gulp
 * @param  {!Object} config
 */
var register = (gulp, config) => {
  var entry = path.join(config.paths.source, config.entry),
      debugArtifact = config.environment.getEnvironmentValue(config.artifacts, 'debug'),
      releaseArtifact = config.environment.getEnvironmentValue(config.artifacts, 'release');

  gulp.task('build/javascript', () => {
    var stream = bundle(entry, config.module)
      .pipe(header('./header.tmpl', __dirname))
      .pipe(template(config.package))
      .pipe(rename(debugArtifact))
      .pipe(gulp.dest(config.paths.bin));

    if (config.environment.is('release')) {
      stream
        .pipe(uglify())
        .pipe(rename(releaseArtifact))
        .pipe(gulp.dest(config.paths.bin));
    }

    return stream;
  });
};

module.exports = register;
