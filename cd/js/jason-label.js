/* ==========================================================
 *	jason-label.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	/* labels
	 * ============== */

	$(function() {

		// control-label change
		// $('[required=""]').parents('.control-group').find('.control-label').prepend('<img
		// src="img/star.gif" width="16" height="16" style="margin-top:
		// -10px;">')
		$('[required=""],[required="required"],')
				.parents('.control-group')
				.find('.control-label')
				.prepend('<span class="label-required">*</span>')
				/*.prepend('<img src="img/star.gif" width="16" height="16" style="margin-top: -10px;">')*/

	})
}(window.jQuery);