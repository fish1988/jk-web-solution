/* ==========================================================
 *	jason-alert.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	$(function() {
		// alert box
		if ($('#jason-alert').length === 0) {
			$(document.body).append($('<div id="jason-alert"></div>'))
		}

		// object
		$.jAlert = {}
		$.jAlert.alert = function(msg, t, url, callback) {

			var template = '<div class="modal narrow-modal"><div class="modal-header"><a class="close" data-dismiss="modal">×</a><span class="loader"></span><h4>提示</h4></div><div class="modal-body">'
					+ msg + '</div><div class="modal-footer">'
			if (t == 'confirm') {
				template += '<a class="btn" data-dismiss="modal" href="#"> 取 消 </a><a class="btn btn-primary alert-action" href="#"> 确 认 </a>'
			} else {
				template += '<a class="btn btn-primary" data-dismiss="modal" href="#"> 确 认 </a>'
			}
			template += '</div></div>'
			$('#jason-alert').html(template)

			var me = $('#jason-alert .modal')
			me.on('hide', function() {
						$('.modal-backdrop').remove()
					})
			me.modal('show')
			$('.modal-backdrop').not(':last').remove()
			// $('.btn-primary', me).focus()

			if (t == 'confirm') {
				$('.alert-action', me).click(function() {
					// $('#jason-alert .modal').modal('hide')
					$('span.loader', me).show()
					$('.btn-primary', me).addClass('disabled')

					setTimeout(function() {
								$.getJSON(url, function(data) {
											$('.loader', me).hide()
											if (callback)
												callback()
											$.jAlert.alert($.jMsg[data.msg
													? data.msg
													: 'success'])
										})
							}, 500)
				})
			}
			/*
						$('#jason-alert .modal .close-alert').click(function() {
									$('#jason-alert .modal').modal('hide')
								})*/
		}
		/*$.jAlert.alert = function(msg, t, url) {

			var template = '<div class="alert alert-block fade in"><a class="close" data-dismiss="alert">×</a> <h4 class="alert-heading">提示</h4><div class="alert-text">'
					+ msg + '</div><br><div class="pull-right alert-btns">'
			if (t == 'confirm') {
				template += '<a class="btn btn-small alert-action" href="#"> 确 认 </a> &nbsp; <a class="btn btn-small close-alert" data-dismiss="alert" href="#"> 取 消 </a>'
			} else {
				template += '<a class="btn btn-small close-alert" data-dismiss="alert" href="#"> 确 认 </a>'
			}
			template += '</div></div>'
			$('#jason-alert').html(template)
			$(document.body).append('<div class="modal-backdrop in"></div>')
			$('#jason-alert .alert').css({
						left : $(window).width() / 2 - 100,
						top : $(window).height() / 2 - 50,
						'min-width' : 200,
						'min-height' : 80
					}).show()

			$('.alert').bind('closed', function() {
						$('.modal-backdrop').remove()
					})
			if (t == 'confirm') {
				$('.alert-action').click(function() {
					$('#jason-alert .alert').alert('close')
					$.getJSON(url, function(data) {
								$.jAlert.alert($.jMsg[data.msg
										? data.msg
										: 'success'])
							})
				})
			}

			$('#jason-alert .alert .close-alert').click(function() {
						$('#jason-alert .alert').alert('close')
					})
		}*/
		// base alert
		$('.show-alert').click(function() {
					var msg = $(this).attr('msg')
					$.jAlert.alert(msg)
				})
		// confirm alert
		$('.confirm-alert').click(function() {
					var msg = $(this).attr('msg')
					$.jAlert.alert(msg, 'confirm')
				})

	});

}(window.jQuery);

/*function getBoundingClientRect(elem) {
	// 如果存在getBoundingClientRect就使用原生方法
	if (elem.getBoundingClientRect) {
		var rect = elem.getBoundingClientRect();
		return {
			// 兼容IE
			left : rect.left - document.documentElement.clientLeft
					|| document.body.clientLeft || 0,
			top : rect.top - document.documentElement.clientTop
					|| document.body.clientTop || 0
		};

	} else {
		var obj = getPosition(elem);
		return {
			left : obj.left
					- Math.max(document.documentElement.scrollLeft,
							document.body.scrollLeft),
			top : obj.top
					- Math.max(document.documentElement.scrollTop,
							document.body.scrollTop)
		};

	}

}*/