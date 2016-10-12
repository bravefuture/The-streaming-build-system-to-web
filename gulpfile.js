/**
 * 1. 先全局安装所需npm插件
 * 2. 在package.json文件里修改"scripts"值，link所有npm插件
 * 3. 连接npm插件: $ npm start (首次编译时连接)
 * 4. 启动gulp: $ gulp
 */

'use strict';

var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var sass = require('gulp-sass');
var seajs = require('gulp-seajs-combine');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

/**
 * 需要合成图文件名
 */
var spriteFileNames = ['icons', 'icons2'];
var spriteTaskNames = [];
/**
 * 遍历合成雪碧图
 */
spriteFileNames.forEach(function(v, i) {
	spriteTaskNames.push('sprite' + i);
    gulp.task('sprite' + i, function() {
        var spriteData = gulp.src('./images/' + v + '/*.png').pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/' + v + '_sprite/sprite.png',
            padding: 5,
            cssName: 'sprite.scss',
            cssFormat: 'scss'
        }));
        return spriteData.pipe(gulp.dest('images/' + v + '_sprite/')).pipe(livereload());
    });
});

/**
 * 需要模块合并的文件名
 */
var seajsFileNames = ['sub', 'index'];
var seajsTastNames = [];
/**
 * seajs模块合并压缩
 */
seajsFileNames.forEach(function(v, i) {
	seajsTastNames.push('seajscombine' + i);
	gulp.task('seajscombine' + i, function() {
	    return gulp.src('./js/'+ v +'/src/'+ v +'.js')
	        .pipe(seajs(null, {
	        	base: '../../components',
	            except: [
	                'jquery'
	            ]
	        }))
	        .pipe(uglify({
	            mangle: {except: ['require', 'exports', 'module', '$']},
	            compress: true
	        }))
	        .pipe(gulp.dest('./js/'+ v +'/dist/'))
	        .pipe(livereload());
	});	
});

/**
 * 监控html文件
 */
gulp.task('html', function() {
    gulp.src('./html_demo/*.html')
        .pipe(livereload());
});

/**
 * 编译sass
 */
gulp.task('sass', spriteTaskNames, function() {
    return gulp.src('./sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(livereload());
});

/**
 * 实时监控
 */
gulp.task('watch', function() {
	livereload.listen();
    gulp.watch('images/**/*.png', spriteTaskNames.concat(['sass']));
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch('html_demo/*.html', ['html']);
    gulp.watch('js/**/**/*.js', seajsTastNames);
});

/**
 * 指定默认任务
 */
gulp.task('default', ['watch', 'sass'].concat(spriteTaskNames).concat(seajsTastNames));
