/* ==========================================================
 *	jason-base.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* base utils
	 * ============== */

	$(function() {
				// add-on data
				$.jString = {}
				$.jString.format = function(source, params) {
					if (arguments.length === 1) {
						return function() {
							var args = $.makeArray(arguments);
							args.unshift(source);
							return $.validator.format.apply(this, args);
						};
					}
					if (arguments.length > 2 && params.constructor !== Array) {
						params = $.makeArray(arguments).slice(1);
					}
					if (params.constructor !== Array) {
						params = [params];
					}
					$.each(params, function(i, n) {
								source = source.replace(new RegExp("\\{" + i
														+ "\\}", "g"), n);
							});
					return source;

				}
			})
}(window.jQuery);