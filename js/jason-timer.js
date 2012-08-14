/* ==========================================================
 *	jason-timer.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	/*
	 * $.timer ==============
	 */

	$(function() {
				$.jTimer = {}
				$.jTimer.addTimer = function(timerId, fn, ms) {
					if ($.jTimer[timerId]) {
						clearTimeout($.jTimer[timerId])
						$.jTimer[timerId] = null
					}
					$.jTimer[timerId] = setTimeout(fn, typeof ms == 'undefined' ? 0 : ms)
				}
			})
}(jQuery)