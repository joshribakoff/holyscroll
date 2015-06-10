var gulp = require('gulp');
var karma = require('karma').server;

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var path = {
    src: './src/*.js',
    tests: './tests/*.js'
};
gulp.task('test:unit', function() {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });
});

gulp.task('test', ['test:unit']);

gulp.task('jshint', function() {
    gulp.src([path.src, path.tests])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
