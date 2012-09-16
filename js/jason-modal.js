/* ==========================================================
 *	jason-modal.js
 *
 * ========================================================== */

!function($) {

	"use strict"; //

	/* Modal actions
	 * ============== */
	$.fn.modal.defaults = {
		backdrop : true,//'static',
		keyboard : true,
		show : true
	}
	$(function() {
				$('.modal').on('show', function() {
					var me = $(this)
					// default title
					if (me.attr('default-title')) {
					} else {
						me.attr('default-title', $('.modal-header h3', me)
										.text())
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
												$.jForm
														.loadRecord(form,
																record)
												// form.unmask()
												$('span.loader', me).hide()
											})

								})
					}

				})
				
				$('.modal').on('hide', function() {
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

			});

}(window.jQuery);
