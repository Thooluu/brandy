require('colors');

var glob = require('glob'),
    gutil = require('gulp-util'),
    path = require('path');

/**
 * Task api that configures and loads gulp tasks.
 *
 * @param {!Gulp} gulp
 * @param {Object=} config
 * @param {String=} cwd
 */
var Taskman = function (gulp, config, cwd) {
  if (typeof gulp === 'undefined') {
    throw 'gulp must be defined.';
  }

  /**
   * Configuration options that will be injected into every gulp task.
   *
   * @type {Object}
   */
  this._config = config || {};

  /**
   * Current working directory that path calculations should be relative to.
   *
   * @type {String}
   */
  this._cwd = cwd || __dirname;

  /**
   * Actual path of this file relative to the defined working directory.
   *
   * @type {String}
   */
  this._root = path.relative(this._cwd, __dirname);

  /**
   * Gulp instance. All tasks get injected the same gulp instances.
   *
   * @type {Gulp}
   */
  this._gulp = gulp;
};

/**
 * Taskman factory.
 *
 * @param {Object=} config
 * @param {String=} cwd
 * @return {!Taskman}
 */
Taskman.create = function (gulp, config, cwd) {
  return new this(gulp, config, cwd);
};

/**
 * Loads a task or tasks, injecting a configuration.
 *
 * @throws Error if path is not a string.
 *
 * @param  {!String} path
 * @return {!Taskman}
 */
Taskman.prototype.load = function (path) {
  if (typeof path !== 'string') {
    throw new Error('path must be a string.');
  }

  gutil.log('Scanning ' + path.magenta + ' for tasks.');

  glob.sync(path, {
    cwd: this._cwd
  }).forEach(file => this._load(file));

  return this;
};

/**
 * Loads a single task from a fully quilified path.
 *
 * @param  {!String} task
 */
Taskman.prototype._load = function (task) {
  gutil.log('Found task ' + task.magenta);

  var module = require('./' + path.relative(this._root, task));

  if (typeof module === 'function') {
    module(this._gulp, this._config);
  } else {
    gutil.log('Could not mount task '.red + task.red);
  }
};

module.exports = Taskman;
