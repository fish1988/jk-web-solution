/* ==========================================================
 *	jason-number-field.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	$(function() {
				$('.positive-integer').numeric({
							decimal : false,
							negative : false
						})
				$('.positive-float').numeric({
							negative : false
						})
			})

}(window.jQuery);