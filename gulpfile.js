// Подключение модулей
const gulp = require('gulp')
const less = require('gulp-less')
const del = require('del')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const gulppug = require('gulp-pug')
const stylus = require('gulp-stylus')
const sass = require('gulp-sass')(require('sass'))
const ts = require('gulp-typescript') 
const coffee = require('gulp-coffee')

// Пути к изначальным файлам и файлам назначения
const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    }
}

// Задача для отчистки каталога
function clean() {
    return del(['dist/*', '!dist/img'])
}


// Задача для минификации HTML
function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())
}

// Задача для обработки PUG файлов
function pug() {
    return gulp.src(paths.pug.src)
        .pipe(gulppug())
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browsersync.stream())
}


// Задача для обработки стилей
function styles() {
    return gulp.src(paths.styles.src)   
        .pipe(sourcemaps.init())     
        // .pipe(less())
        //.pipe(stylus())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

// Задача для обработки скриптов
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true}))
        /*
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'main.min.js'
        }))
        */ 
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browsersync.stream())
}

// Задача для компрессии изображений
function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.images.dest))
}

// Задача для отслеживания изменений стилей и скриптов
function watch() {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    })
    gulp.watch(paths.html.dest).on('change', browsersync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
}


// Задача для порядка выполнения сборки     
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)



// Экспорт задач
exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build
exports.img = img
exports.html = html
exports.pug = pug


