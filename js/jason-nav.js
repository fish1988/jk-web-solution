/* ==========================================================
 *	jason-nav.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	/* nav
	 * ============== */

	$(function() {

				// Disable # links
				$('a[href=#]').click(function(e) {
							e.preventDefault()
						})
			})
}(window.jQuery)