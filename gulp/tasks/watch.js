var gulp = require('gulp'),
  config = require('../config').main;

gulp.task('watch', ['browserify'], function () {
  gulp.watch(config.src + '/scss/*.scss', ['sass']);
});