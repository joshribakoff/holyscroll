var gulp = require('gulp');
var karma = require('karma').server;
var runSequence = require('run-sequence');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var path = {
    src: './src/*.js',
    tests: './tests/*.js'
};

gulp.task('test:unit', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('test', ['test:unit']);

gulp.task('jshint', function() {
    gulp.src([path.src, path.tests])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('build', ['jshint'], function(done) {
    return runSequence(
        'test',
        done);
});
