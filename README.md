# gulp前端集成解决方案（web端） 
> 利用gulp完成对Sass文件的编译压缩、自动生成雪碧图、seajs的合并压缩及对以上任务进行实时监控。

##### 所需工具
1. gulp
2. gulp.spritesmith
3. gulp-sass
4. gulp-seajs-combine
5. gulp-livereload

##### 在根目录下新建Gulpfile.js

##### 把所需的插件request进来
```javascript
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var sass = require('gulp-sass');
var seajs = require('gulp-seajs-combine');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
```
##### 合成雪碧图
> 这里可同时合并多个雪碧图，可在spriteFileNames数组添加新文件名，同时在指定的文件目录新建该文件。

```javascript
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
##### 监控html文件
```javascript
/**
 * 监控html文件
 */
gulp.task('html', function() {
    gulp.src('./html_demo/*.html')
        .pipe(livereload());
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
        .pipe(gulp.dest('./css'))
        .pipe(livereload());
});
```
##### 实时监控
```javascript
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