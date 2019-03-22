var gulp         = require('gulp'), // Подключаем Gulp
    scss         = require('gulp-sass'), //Подключаем scss пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем кеширование
    pug          = require('gulp-pug'), //Подключаем pug
    using        = require('gulp-using'),
    plumber      = require('gulp-plumber'),
    clean        = require('gulp-clean'), //Подключаем clean
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('scss', function() { // Создаем таск scss
    return gulp.src('src/ii/scss/**/*.scss') // Берем источник
        .pipe(using({prefix:'Using file', path:'relative', color:'yellow', filesize:true})) //отображение в консоли изменений
        .pipe(scss()) // Преобразуем scss в CSS посредством gulp-scss
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('src/ii/css/')) // Выгружаем результата в папку src/css
        .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

gulp.task('pug', function() {
    return gulp.src('src/ii/**/*.pug')
        .pipe(using({prefix:'Using file', path:'relative', color:'yellow', filesize:true})) //отображение в консоли изменений
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(browserSync.reload({stream: true})) // Обновляем pug на странице при изменении
        .pipe(gulp.dest('src'));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'src' // Директория для сервера - src
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые скрипты
        'src/ii/js/**/*.js'
        ])
        .pipe(concat('scripts.min.js')) // Собираем их в кучу в новом файле script.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('dist/ii/js/')); // Выгружаем в папку src/js
});

gulp.task('scripts-min', function() {
    return gulp.src([ // Берем все необходимые скрипты
        'src/ii/js/**/*.js'
        ])
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('dist/ii/js/')); // Выгружаем в папку src/js
});

gulp.task('css-min', ['scss'], function() {
    return gulp.src('src/ii/css/**/*.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('dist/ii/css/')); // Выгружаем в папку src/css
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('src/ii/img/**/*') // Берем все изображения из src
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/ii/img/')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'scss', 'css-min', 'scripts-min', 'pug'], function() {

    // var buildCss = gulp.src('src/ii/css/**/*.css')
    // .pipe(gulp.dest('dist/ii/css/'))// Переносим библиотеки в продакшен

    var buildFonts = gulp.src('src/ii/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/ii/fonts/'))

    // var buildJs = gulp.src('src/ii/js/**/*.js') // Переносим скрипты в продакшен
    // .pipe(gulp.dest('dist/ii/js/'))

    var buildHtml = gulp.src('src/**/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist/pages/'));
});

gulp.task('clear', function (callback) {
    return cache.clearAll();
})

gulp.task('watch', ['browser-sync','scss', 'pug'], function() {
    gulp.watch('src/ii/scss/**/*.scss', ['scss']); // Наблюдение за scss файлами в папке scss
    gulp.watch('src/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('src/ii/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
    gulp.watch('src/ii/**/*.pug', ['pug']); // Наблюдение за pug файлами в папке src
    gulp.watch('src/ii/img/**/*'); // Наблюдение за image в папке src
});

gulp.task('default', ['watch']);