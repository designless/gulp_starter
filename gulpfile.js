var gulp = require("gulp");
var sass = require("gulp-sass");
var jade = require("gulp-jade");
var runSequence = require('run-sequence');
var pleeease = require('gulp-pleeease');
var plumber = require("gulp-plumber");
var browser = require("browser-sync");
var uglifyAll = require("gulp-uglifyjs");
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var order = require("gulp-order");

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('bower',function(){
  gulp.src('./bower_components/foundation/scss/foundation/**/*')
  .pipe(gulp.dest('./source/stylesheets/foundation/'));
  gulp.src('./bower_components/fontawesome/scss/*')
  .pipe(gulp.dest('./source/stylesheets/fontawesome/'));
  gulp.src('./bower_components/fastclick/lib/fastclick.js')
  .pipe(gulp.dest('./source/javascripts/'));
  gulp.src('./bower_components/jquery-smooth-scroll/jquery.smooth-scroll.min.js')
  .pipe(gulp.dest('./source/javascripts/'));
  gulp.src('./bower_components/fontawesome/fonts/*')
  .pipe(gulp.dest('./build/fonts/'));

});

gulp.task("js", function() {
    gulp.src(["./source/javascripts/**/*.js", "!./source/javascripts/html5shiv.js"])
    .pipe(plumber())
    .pipe(order([
      "source/javascripts/ga.js",
      "source/javascripts/jquery-1.11.1.min.js",
      "source/javascripts/fastclick.js",
      "source/javascripts/jquery.easing-1.3.pack.js",
      "source/javascripts/jquery.biggerlink.min.js",
      "source/javascripts/jquery.heightLine.js",
      "source/javascripts/jquery.smooth-scroll.min.js"
    ]))
    .pipe(concat("app.js"))
    // .pipe(uglifyAll('app.js',{comments: true}))
    .pipe(uglify({preserveComments:'some'}))
    .pipe(gulp.dest("./build"))
    .pipe(browser.reload({stream:true}))
});

gulp.task('sass', function(){
  gulp.src(['./source/stylesheets/app.scss','bower_components/foundation/scss'])
  .pipe(plumber())
  .pipe(sass())
  .pipe(pleeease({
        fallbacks: {
            autoprefixer: ['last 4 versions'] //ベンダープレフィックス
        }
    }))
  .pipe(gulp.dest('./build'))
  .pipe(browser.reload({stream:true}))
})

gulp.task('jade', function () {
  gulp.src(['./source/**/*.jade', '!./source/partials/*.jade', '!./source/layouts/*.jade'])
  .pipe(plumber())
  .pipe(jade())
  .pipe(gulp.dest('./build/'))
  .pipe(browser.reload({stream:true}))
});

gulp.task('watch', function(){
  runSequence('build','server');
  gulp.watch('./source/stylesheets/**/*.scss', ['sass']);
  gulp.watch('./source/javascripts/**/*.js', ['js']);
  gulp.watch("./source/**/*.jade",["jade"]);
});

gulp.task('build', ['jade', 'sass', 'js'])

gulp.task('default', ['build'])
