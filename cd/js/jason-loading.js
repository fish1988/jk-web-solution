/* ==========================================================
 *	jason-loading.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	$.jLoading = {}

	$.jLoading.init = function() {
		if ($('.page-loading').length == 0)
			$('body')
					.append('<div class="page-loading"><span>loading...</span></div>')
	}
	$.jLoading.init()
	

	$.jLoading.show = function(el) {
		var $el = $(el)
		if ($el.parents('.modal').length)
			$('.loader', $el.parents('.modal')).show()
		else
			$('.page-loading').show()
	}

	$.jLoading.hide = function(el) {
		var $el = $(el)
		if ($el.parents('.modal').length) {
			setTimeout(function() {
						$('.loader', $el.parents('.modal')).hide()
					}, 300)
		} else
			$('.page-loading').hide()
	}

}(window.jQuery)
