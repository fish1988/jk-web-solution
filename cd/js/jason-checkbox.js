/* ==========================================================
 *	jason-checkbox.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* checkbox utils
	 * ============== */
	$.jCheckbox = {
		uncheck : function($icon) {
			$.ltIE7
					? $icon.removeClass('icon-check')
							.addClass('icon-check-empty').html('&#xf096;&nbsp;')
							
					: $icon.removeClass('icon-check')
							.addClass('icon-check-empty')
		},
		check : function($icon) {
			$.ltIE7
					? $icon.removeClass('icon-check-empty')
							.addClass('icon-check').html('&#xf046;&nbsp;')
							
					: $icon.removeClass('icon-check-empty')
							.addClass('icon-check')

		}

	}

}(window.jQuery);