/* ==========================================================
 *	jason-const.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	// all consts for html display
	// like datetime or cookies
	$.jConst = {}
	$.jConst.pageInit = function() {
		var date = new XDate(), userName = $.cookie('user_login_name'), leaderName, nowTime = date
				.toString('yyyy-MM-dd HH:mm:ss'), nowDate = date
				.toString('yyyy-MM-dd'), yearBefore = date.addYears(-1)
				.toString('yyyy-MM-dd')

		$.jConst.val($('.const-userName'), userName)
		$.jConst.val($('.const-nowDate'), nowDate)
		$.jConst.val($('.const-nowTime'), nowTime)
		$.jConst.val($('.const-yearBeforeDate'), yearBefore)

	}

	$.jConst.val = function($el, v) {
		if ($el.is('input')) {
			$el.val(v)
		} else {
			$el.text(v)
		}
	}

	$.jConst.pageInit()

}(window.jQuery);
