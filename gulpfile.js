var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	scsso = require('gulp-csso'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	ngmin = require('gulp-ngmin'),
	uglify = require('gulp-uglify'),
	spritesmith = require('gulp.spritesmith'),
	merge = require('merge-stream');


gulp.task('styles', function(){
	return gulp.src('sass/*.scss')
		.pipe(sass({sourcemap:true}).on('error',sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./assets/css'))
		.pipe(scsso(true))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('./assets/css'))

});

gulp.task('styles:watch', function(){
	gulp.watch("./sass/**/*", ['styles'])
})

gulp.task('sprite', function(){

	var spriteData = gulp.src('./assets/img/*.png').pipe(spritesmith({
		imgName: 'icons.png',
		cssName: 'icons.min.css',
		imgPath: '../img/sprites/icons.png'
	}))
	
	var imgStream = spriteData.img
		.pipe(gulp.dest('assets/img/sprites'));

	var cssStream = spriteData.css
		.pipe(scsso())
		.pipe(gulp.dest('assets/css'));

	return merge(imgStream, cssStream);
	
})

gulp.task('scripts', ['styles'], function(){
	return gulp.src('./services/*.js')
		.pipe(ngmin())
		.pipe(concat('services.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('services'))

})

gulp.task('build', ['styles', 'scripts', 'sprite']);
