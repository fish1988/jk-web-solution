/* ==========================================================
 *	jason-msg.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* Msg Code
	 * ============== */

	// add-on data
	$.jMsg = {
		success : '操作成功',
		failure : '操作失败',
		validation_error : '验证失败',
		error_duplicate_name : '名称重复',
		phone_message : '操作成功，资产编号：{0}'
	}

	$.jMsg.getMsg = function(msg, val) {
		console.log(23,msg,val,$.jMsg[msg])
		if (typeof $.jMsg[msg] == 'undefined')
			return ''
		if (!val)
			return $.jMsg[msg]
		return $.jString.format($.jMsg[msg], val)
	}

}(window.jQuery);