var gulp = require('gulp');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

var src = {
	coffee: './src/*.coffee'
};

gulp.task('default', ['coffee', 'watch']);

gulp.task('watch', function() {
	gulp.watch(src.coffee, ['coffee']);
});

gulp.task('coffee', function() {
	gulp.src(src.coffee)
		.pipe(plumber())
		.pipe(coffee())
		.pipe(rename({
			extname: '.js'
		}))
		.pipe(gulp.dest('./dist/'));
});
