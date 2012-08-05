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
				$('body').on('click.a[href=#]',function(e) {
							e.preventDefault()
						})
			})
}(window.jQuery)