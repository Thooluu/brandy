var gulp = require('gulp'),
    Taskman = require('./tasks/Taskman'),
    config = require('./gulpfile.config');

Taskman.create(gulp, config, __dirname).load('./tasks/**/*-task.js');
