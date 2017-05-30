var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();

var paths = {
    pages: ['src/**/*.html'],
    css: ['src/**/*.css']
};

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['js', 'copy-html', 'copy-css'], function() {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/**/*.ts", ['js-watch']);
    gulp.watch("src/**/*.html", ['js-watch']);
});

gulp.task("js", function() {
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle().on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-html", function() {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-css", function() {
    return gulp.src(paths.css)
        .pipe(gulp.dest("dist"));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js', 'copy-html', 'copy-css'], function(done) {
    browserSync.reload();
    done();
});