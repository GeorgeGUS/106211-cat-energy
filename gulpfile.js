"use strict";

var gulp = require("gulp");
var del = require("del");
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");

var plumber = require("gulp-plumber");
var pump = require('pump');

var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csscomb = require("gulp-csscomb");
var csso = require("gulp-csso");

var concat = require('gulp-concat');
var uglify = require("gulp-uglify");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require('gulp-htmlmin');

var webp = require("gulp-webp");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require('gulp-svgmin');

var run = require("run-sequence");
var server = require("browser-sync").create();
var ghpages = require('gh-pages');

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(posthtml([
      include()
    ]))
    // .pipe(gulp.dest("build"))
    .pipe(htmlmin({
      minifyJS: true,
      minifyURLs: true,
      collapseWhitespace: true,
      removeComments: true,
      sortAttributes: true,
      sortClassName: true
    }))
    // .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build"))
    .pipe(sourcemaps.write());
});

gulp.task("style", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csscomb())
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/css"))
    .pipe(sourcemaps.write())
    .pipe(server.stream());
});

gulp.task("script-min", function (cb) {
  pump([
    gulp.src("source/js/**/*.js"),
    uglify(),
    rename({suffix: ".min"}),
    gulp.dest("build/js")
  ], cb);
});

gulp.task("script-concat", function (cb) {
  pump([
    gulp.src("build/js/*.js"),
    concat('main.min.js'),
    gulp.dest("build/js")
  ], cb);
});

gulp.task("images-jpg", function () {
  return gulp.src("source/img/raster/*.jpg")
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img/raster"));
});

gulp.task("images-png", function () {
  return gulp.src("source/img/raster/*.png")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3})
    ]))
    .pipe(gulp.dest("build/img/raster"));
});

gulp.task("webp", function () {
  return gulp.src("build/img/raster/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img/webp"));
});

gulp.task("svg", function () {
  return gulp.src("source/img/vector/**/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("build/img/vector"));
});

gulp.task("sprite", function () {
  return gulp.src("build/img/vector/sprite/*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/vector"));
});


gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/*.{woff,woff2}",
      "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});


gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
  gulp.watch("source/js/*.js", ["script-min"]).on("change", server.reload);
});


gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "svg",
    "sprite",
    "html",
    "style",
    "script-min",
    "script-concat",
    "images-jpg",
    "images-png",
    "webp",
    done
  );
});

ghpages.publish("build");
