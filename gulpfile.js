var gulp = require('gulp');
var karma = require('karma').server;
var runSequence = require('run-sequence');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate')
var rename = require('gulp-rename');
var del = require('del');
var vinylPaths = require('vinyl-paths');

var path = {
    src: './src/*.js',
    tests: './tests/*.js',
    output: 'dist'
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
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));

});

gulp.task('clean', function() {
    return gulp.src([path.output])
        .pipe(vinylPaths(del));
});

gulp.task('build:src:min', function() {
    gulp.src(path.src)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(path.output));
});

gulp.task('build:src', ['build:src:min'], function() {
    gulp.src(path.src)
        .pipe(gulp.dest(path.output));
});

gulp.task('build', ['jshint'], function(done) {
    return runSequence(
        'clean',
        'test',
        'build:src',
        done);
});
