/* ==========================================================
 *	jason-modal.js
 *
 * ========================================================== */

!function($) {

	"use strict"; //

	/* Modal actions
	 * ============== */
	$.fn.modal.defaults = {
		backdrop : 'static',
		keyboard : true,
		show : true
	}
	$(function() {
		var oldBodyMarginRight = $("body").css("margin-right")
		// modal show hide Scrollbar
		function hideScrollbar() {
			var body = $("body"), html = $("html"), oldBodyOuterWidth = body
					.outerWidth(true), oldScrollTop = html.scrollTop(), newBodyOuterWidth
			$("html").css("overflow-y", "hidden")
			newBodyOuterWidth = $("body").outerWidth(true)
			body
					.css(
							"margin-right",
							(newBodyOuterWidth - oldBodyOuterWidth + parseInt(oldBodyMarginRight))
									+ "px")
			html.scrollTop(oldScrollTop) // necessary for Firefox
			$("#simplemodal-overlay").width(newBodyOuterWidth)
		}

		$('.modal').on('show', function() {
			var me = $(this)

			// hideScrollbar
			hideScrollbar()
			// default title
			if (me.attr('default-title')) {
			} else {
				me.attr('default-title', $('.modal-header h3', me).text())
			}

			// title
			$('.modal-header h3', me).text(me.attr('modal-title') ? me
					.attr('modal-title') : me.attr('default-title'))

			// reset form
			$('form', me).each(function() {
						if (me.attr('record') || me.attr('data-url')) {
							$.jForm.reset($(this))

							// form items change
							$.jForm.itemEditChange($(this), 'edit')
						} else {
							$.jForm.reset($(this), 'new')
							// form items change
							$.jForm.itemEditChange($(this), 'new')
						}
					})

			// load record
			if (me.attr('record')) {
				var record = $.parseJSON(me.attr('record'))
				$('form', me).each(function() {
							$.jForm.loadRecord($(this), record)
						})
			} else
			// load url
			if (me.attr('data-url')) {
				var url = me.attr('data-url')

				$('form', me).each(function() {
							var form = $(this)
							// form.mask('loading')
							$('span.loader', me).show()
							$.getJSON(url, function(record) {
										$.jForm.loadRecord(form, record)
										// form.unmask()
										$('span.loader', me).hide()
									})

						})
			}

		})

		$('.modal').on('hide', function() {
					var html = $("html");
					var oldScrollTop = html.scrollTop() // necessary for
					// Firefox.
					html.css("overflow-y", "").scrollTop(oldScrollTop)
					$("body").css("margin-right", oldBodyMarginRight)
					var me = $(this)
					$('.modal-body', me).scrollTop(0)
				})

		$('.modal').on('hidden', function() {
			var me = $(this)

			$(this).removeAttr('modal-title')
			$(this).removeAttr('record')
			$(this).removeAttr('data-url')

			me.find('form').find('label').closest('.control-group')
					.removeClass('error');
			me.find('form').find('label.error').remove();
		})

		// modal animation
		$('body').on('click.modal-backdrop', '.modal-backdrop', function() {

					$('.modal.hide').animate({
								left : '49.5%'
							}, 120).animate({
								left : '50%'
							}, 120, function() {
								$('.modal.hide .btn-primary').focus()
							})
				})

	});

}(window.jQuery);
