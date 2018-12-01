const gulp = require('gulp')

const eslint = require('gulp-eslint')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
// const watch = require('gulp-watch')
const responsive = require('gulp-responsive')
const imagemin = require('gulp-imagemin')
const babel = require('gulp-babel')
const imageminPngquant = require('imagemin-pngquant')
gulp.task('default', ['styles', 'lint'], () => {
	// code for your default task goes here
	gulp.watch('src/sass/**/*.scss', ['styles'])
	gulp.watch('js/**/*.js', ['lint'])
	gulp.watch('./index.html').on('change', browserSync.reload)
  
	browserSync.init({
		server: './'
	})
})

gulp.task('lint', function() {
	return (
		gulp.src(['js/**/*.js'])
			.pipe(babel())
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failOnError())
	)
})

gulp.task('styles', () => {
	gulp.src('src/sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
		.pipe(gulp.dest('./dest/css'))
		.pipe(browserSync.stream())
})

//image compress task
gulp.task('imagemin', () => {
	gulp.src('src/img/*')
		.pipe(imagemin(
			{
				progressive: true,
			    use: [imageminPngquant()]
			}
		))
		.pipe(gulp.dest('dest/images'))
})

//images generation task, not working
gulp.task('images', function() { 
	gulp.src(['src/img/*'])
		.pipe(responsive({
			'*.jpg': [{
				width: 300,
				rename: {
					suffix: '-300px',
					extname: '.jpg'
				}}, {
				width: 600,
				rename: {
					suffix: '-600px',
					extname: '.jpg'
				}}, {
				width: 1900,
				rename: {
					suffix: '-1900px',
					extname: '.jpg'
				},
				withoutEnlargement: true
			}],
		}, {
			//global configuration for all images
			quality: 80,
			errorOnEnlargement: false
		}
		).on('error', responsive.logError))
		.pipe(gulp.dest('dist'))
})


