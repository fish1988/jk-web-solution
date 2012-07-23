/* ==========================================================
 *	jason-tooltip.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	$(function() {

				$('.j-tooltip').attr('rel', 'tooltip').tooltip({
							placement : 'top'
						})
				$('.j-tooltip-l').attr('rel', 'tooltip').tooltip({
							placement : 'left'
						})
				$('.j-tooltip-r').attr('rel', 'tooltip').tooltip({
							placement : 'right'
						})
				$('.j-tooltip-b').attr('rel', 'tooltip').tooltip({
							placement : 'bottom'
						})

				$('.close').each(function(i, val) {
							var $this = $(val)
							if (typeof $this.attr('title') == 'undefined') {
								$this.attr('title', '关闭')
							}
						})
			})

}(window.jQuery)