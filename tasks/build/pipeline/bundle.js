var browserify = require('browserify'),
    buffer = require('gulp-buffer'),
    source = require('vinyl-source-stream');

/**
 * Creates a browserify stream.
 *
 * @param  {!String} entry
 * @return {!Stream}
 */
var create = function (entry, module) {
  var options = module ? {
    standalone: module
  } : {};

  var transform = browserify(entry, options)
    .bundle()
    .pipe(source(entry))
    .pipe(buffer());

  return transform;
};

module.exports = create;
