define(function(require, exports, module) {
	var a = require('../module_a/module_a');
	var b = function(x) {
		return a(x) * 2;
	};
	module.exports = b;
});