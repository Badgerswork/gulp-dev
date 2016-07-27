
/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-compass gulp-plumber gulp-autoprefixer gulp-cssnano gulp-jshint gulp-uglify gulp-imagemin gulp-rename gulp-concat gulp-kss gulp-notify gulp-cache gulp-livereload gulp-connect gulp-clean del --save-dev

 */

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpkss = require('gulp-kss'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    del = require('del');

    gulp.task('webserver', function() {
      connect.server({
          livereload: true
      });
    });

    gulp.task('styles', function() {
        return gulp.src('./scss/*.scss')

        .pipe(plumber({ errorHandler: function (error) {console.log(error.message); this.emit('end');}}))
        .pipe(compass({css: 'app/assets/css', sass: 'app/assets/scss', image: 'app/assets/images', require: ['susy'] }))
        .on('error', function(err) {
          // Would like to catch the error here
        })

        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'Styles task complete' }));

    });

    gulp.task('scripts', function() {
        return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
    });

    gulp.task('images', function() {
        return gulp.src('../app/assets/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images task complete' }));
    });


    // Clean
    gulp.task('clean', function() {
      return del(['dist/styles', 'dist/scripts', 'dist/images']);
    });


    //KSS
    var themeFolder = __dirname + '/app/assets/styleguide/';
    var templateFolder = __dirname + '/dist/assets/styleguide/template/';
    gulp.task('styleguide', function () {
        gulp.src(templateFolder)
        .pipe(gulpkss({
            overview: themeFolder + 'styleguide.md',
            templateDirectory: templateFolder
        }))
        .pipe(gulp.dest('/dist/assets/styleguide/'));

        // Concat and compile all your styles for correct rendering of the styleguide.
        gulp.src( themeFolder +'**/*.scss')
            .pipe(compass({css: 'dist/assets/styleguide/public/', sass: 'app/assets/styleguide/scss', require: ['susy'] }))
    });

    // Default task
    gulp.task('default',['webserver', 'clean'],  function() {
      gulp.start('styles', 'scripts', 'images', 'styleguide');
    });

    // Watch
    gulp.task('watch', function() {

      // Watch .scss files
      gulp.watch('app/assets/scss/**/*.scss', ['styles']);

      // Watch .js files
      gulp.watch('app/assets/scripts/**/*.js', ['scripts']);

      // Watch image files
      gulp.watch('app/assets/images/**/*', ['images']);

      // Create LiveReload server
      livereload.listen();

      // Watch any files in dist/, reload on change
      gulp.watch(['app/assets/**']).on('change', livereload.changed);

    });
