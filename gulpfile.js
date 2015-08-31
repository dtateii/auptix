var browserify = require('browserify'),
  watchify = require('watchify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  notify = require('gulp-notify'),
  sourceDir = './js/',
  sourceFile = 'app.js',
  destFolder = './web/js/',
  destFile = 'auptix.js';

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {

  var props = {
    entries: [sourceDir + file],
    debug : true
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  }

  // listen for an update and run rebundle
  bundler.on('update', function () {
    rebundle();
  });

  // run it once the first time buildScript is called
  return rebundle();
}


// run once
gulp.task('scripts', function () {
  return buildScript(sourceFile, false);
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['scripts'], function () {
  return buildScript(sourceFile, true);
});