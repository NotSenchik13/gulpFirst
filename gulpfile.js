// Подключение модулей
const gulp = require('gulp')
const less = require('gulp-less')
const del = require('del')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')



// Пути к изначальным файлам и файлам назначения
const paths = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

// Задача для отчистки каталога
function clean() {
    return del(['dist'])
}



// Задача для обработки стилей
function styles() {
    return gulp.src(paths.styles.src)        
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
}

// Задача для обработки скриптов
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

// Задача для отслеживания изменений стилей и скриптов
function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Задача для порядка выполнения сборки 
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

// Экспорт задач
exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build

