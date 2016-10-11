define('index/dist/index', function(require, exports, module) {
	var b = require('module_b/module_b');
	var index = function(x) {
		return b(x) + 2;
	};
	module.exports = index;
});