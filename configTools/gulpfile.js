var gulp = require('gulp');
var terser = require('gulp-terser');
var concat = require('gulp-concat');

gulp.task('minifyTask',function () {
  return gulp.src([
    '../js/ohui-common.js',
    '../js/ohui-form.js',
    '../js/ohui-notice.js',
    '../js/ohui-navigation.js',
    '../js/ohui-sidebar-menu.js',
    '../js/ohui-district-pick.js'
  ])
    .pipe(concat('ohui-all.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('../js'));
});