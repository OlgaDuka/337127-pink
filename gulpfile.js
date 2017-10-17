"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var uglify = require("gulp-uglify");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include"); 
var run = require("run-sequence");
var del = require("del");
var server = require("browser-sync").create();

// Препроцессор, префиксы, минификация стилей
gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions",
        "IE 11",
        "Firefox ESR"
      ]})
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// Оптимизация графики
gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

// Перевод JPEG и PNG в формат WEBP (качество — 90%)
gulp.task("webp", function() {
  return gulp.src("img/webp-src/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"));
});

// Создание SVG-спрайта
gulp.task("sprite", function() {
  return gulp.src("img/sprite-src/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// Постпроцессинг HTML-файлов
gulp.task("html", function() {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

// Очистка билда
gulp.task("clean", function() {
  return del("build");
});

// Копирование файлов для сборки
gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "!img/sprite-src{,/**}",
    "!img/webp-src{,/**}",
    "js/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("build", function(done) {
  run("style", "sprite", "html", done);
});

// Cборка билда
gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "webp",
    "sprite",
    "html",
    done
  );
});

// Живой сервер разработки
gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
});
