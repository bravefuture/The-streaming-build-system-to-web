# gulp前端集成解决方案（web端） 
> 利用gulp完成对Sass文件的编译压缩、自动生成雪碧图、seajs的合并压缩及对以上任务进行实时监控。

##### 所需工具
1. gulp
2. gulp.spritesmith
3. gulp-sass
4. gulp-seajs-combine

##### 在根目录下新建Gulpfile.js

##### 把所需的插件request进来
```javascript
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var sass = require('gulp-sass');
var seajs = require('gulp-seajs-combine');
var uglify = require('gulp-uglify');
```
##### 合成雪碧图
> 这里可同时合并多个雪碧图，可在spriteFileNames数组添加新文件名，同时在指定的文件目录新建该文件。

```javascript
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
```
##### seajs模块合并压缩
> 同样可实现多个入口文件的合并压缩。

```javascript
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
```
##### 编译sass
```javascript
/**
 * 编译sass
 */
gulp.task('sass', spriteTaskNames, function() {
    return gulp.src('./sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});
```
##### 实时监控
```javascript
gulp.task('watch', function() {
    gulp.watch('./images/**/*.png', spriteTaskNames);
    gulp.watch('./sass/*.scss', ['sass']);
    gulp.watch('./js/**/**/*.js', seajsTastNames);
});
```
##### 指定默认任务
```javascript
gulp.task('default', ['watch', 'sass'].concat(spriteTaskNames).concat(seajsTastNames));
```
##### 启动流程
1. 先全局安装所需npm插件
2. 在package.json文件里修改"scripts"值，link所有npm插件
3. 连接npm插件: $ npm start (首次编译时连接)
4. 启动gulp: $ gulp