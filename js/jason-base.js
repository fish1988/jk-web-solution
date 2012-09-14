/* ==========================================================
 *	jason-base.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* base utils
	 * ============== */

				// placeholder
				$.jPlaceholder = {
					val : function($input,v) {
						if ('placeholder' in document.createElement('input'))
							return
						else
							$input.val(v)
					}
				}
				
					// IE debug
				if (!window.console) {
					window.console = {
						log : function(params) {
						}
					}
				}

	//$(function() {
			

				// add-on data
				$.jString = {}

				// is empty
				$.jString.isEmpty = function(str) {
					if (typeof str === 'undefined' || str === 'null'
							|| str === '')
						return true
					if ((str = str.replace(/\s/g, '')) === '')
						return true
					if (str.replace(/&nbsp;/g, '') === '')
						return true
					return false
				}
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

				$.jString.byteLen = function(str) {
					return str.replace(/([u0391-uFFE5])/gi, 'jk').length
				}
			//})
}(window.jQuery);