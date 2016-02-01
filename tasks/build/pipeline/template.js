var fs = require('fs'),
    render = require('gulp-template');

/**
 * Creates a transform that will render the current stream as a template.
 *
 * @param  {!Object} model
 * @return {!Stream}
 */
var create = (model) => {
  return render(model);
};

module.exports = create;
