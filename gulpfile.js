var gulp = require('gulp');
var uglify = require("gulp-uglify");
var rename = require('gulp-rename');
var uglifycss = require("gulp-uglifycss");

gulp.task('default', function(done) {
    gulp.src('src/m1k.js')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('m1k.min.js'))
        .pipe(gulp.dest('./dist/'));
    gulp.src('src/m1k.css')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglifycss())
        .pipe(rename('m1k.min.css'))
        .pipe(gulp.dest('./dist/'));
    done()
});