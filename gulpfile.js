/**
 * [gulp前端集成解决方案]
 * @update: 2016.10.11
 * @author: yongcheng0660@163.com
 * @github: https://github.com/bravefuture
 */

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

/**
 * 需要合成图文件名
 */
var spriteFileNames = ['icons'];
var spriteTaskNames = [];
/**
 * 版本号
 */
var version = '?v=' + 201609141626;
/**
 * 遍历合成雪碧图
 */
spriteFileNames.forEach(function(v, i) {
	spriteTaskNames.push('sprite' + i);
    gulp.task('sprite' + i, function() {
        var spriteData = gulp.src('./images/' + v + '/*.png').pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/' + v + '_sprite/sprite.png' + version,
            padding: 2,
            cssName: 'sprite.scss',
            cssFormat: 'scss'
        }));
        return spriteData.pipe(gulp.dest('images/' + v + '_sprite/'));
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
	        .pipe(gulp.dest('./js/'+ v +'/dist/'));
	});	
});

/**
 * 编译sass
 */
gulp.task('sass', spriteTaskNames, function() {
    return gulp.src('./sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

/**
 * 实时监控
 */
gulp.task('watch', function() {
    gulp.watch('./images/**/*.png', spriteTaskNames);
    gulp.watch('./sass/*.scss', ['sass']);
    gulp.watch('./js/**/**/*.js', seajsTastNames);
});

/**
 * 指定默认任务
 */
gulp.task('default', ['watch', 'sass'].concat(spriteTaskNames).concat(seajsTastNames));

