var path = require('path'),
    rename = require('gulp-rename');

/**
 * Create a renaming transform.
 *
 * @param  {String} name
 * @param  {Boolean} minified
 * @return {Stream}
 */
var create = (name, minified) => {
  var extension = minified ? '.js' : '.min.js',
      as = (name || 'bundle') + extension;

  return rename(as.toLowerCase());
};

module.exports = create;
