var gulp = require('gulp');
var uglify = require("gulp-uglify");
var rename = require('gulp-rename');
var uglifycss = require("gulp-uglifycss");

gulp.task('default', function(done) {
    gulp.src('src/tinymodal.js')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('tinymodal.min.js'))
        .pipe(gulp.dest('./dist/'));
    gulp.src('src/tinymodal.css')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglifycss())
        .pipe(rename('tinymodal.min.css'))
        .pipe(gulp.dest('./dist/'));
    done()
});