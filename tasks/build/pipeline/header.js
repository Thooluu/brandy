var fs = require('fs'),
    header = require('gulp-header'),
    path = require('path');

/**
 * Creates a transform stream that appends a header to the stream.
 *
 * @param  {String=} file
 * @return {!Stream}
 */
var create = (file, cwd) => {
  var absolutePath = path.resolve(cwd || __dirname, file),
      content = fs.readFileSync(absolutePath, 'utf8');

  return header(content, false);
};

module.exports = create;
