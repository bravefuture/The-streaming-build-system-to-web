define('sub/dist/sub', function(require, exports, module) {
	var a = require('module_a/module_a');
	var sub = function(x) {
		return a(x) * 3;
	};
	module.exports = sub;
});