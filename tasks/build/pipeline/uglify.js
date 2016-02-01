var uglify = require('gulp-uglify');

/**
 * Determines if a ast node is a `/**!` type comment.
 *
 * @param  {!Object} node
 * @param  {!String} comment
 * @return {!Boolean}
 */
var isBangComment = (node, comment) => /^\*\!/.test(comment.value);

/**
 * Creates a minify transform stream.
 *
 * @return {!Stream}
 */
var create = () => {
  return uglify({
    preserveComments: isBangComment
  });
};

module.exports = create;
