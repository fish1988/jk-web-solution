/* ==========================================================
 *	jason-form.js
 *  should be included after jquery-validate.js
 *  make forms be easily controlled
 *
 * ========================================================== */

!function($) {

	"use strict"; //

	/* FORM Validation
	 * ============== */

	$(function() {

		$.fn.serializeObject = function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
						if (o[this.name] !== undefined) {
							if (!o[this.name].push) {
								o[this.name] = [o[this.name]];
							}
							o[this.name].push(this.value || '');
						} else {
							o[this.name] = this.value || '';
						}
					});
			return o;
		};

		$.jForm = {}

		$.jForm.setDefault = function(form) {
			var init = form.serializeObject()

			var combos = $('.combobox', form).not('.not-set-value')
			if (combos.length) {
				for (var i = 0; i < combos.length; i++) {
					var combo = $(combos[i])
					var vals = combo.attr('val')
					if (vals) {
						var arr = vals.split(";")
						if (arr.length > 0) {
							init[combo.attr('id')] = arr[0]
							var pos = 1
							while (combo.attr('child-id') && pos < arr.length) {
								init[combo.attr('child-id')] = arr[i]
								combo = $('#' + combo.attr('child-id'))
								pos++
							}
						}
					}
				}
			}
			// console.log(init)
			form.attr('default', $.stringifyJSON(init))

		}

		$.jForm.reset = function(form, type) { // type --: new/init

			//
			form
					.find('input:text, input:password, input:file,select, textarea')
					.val('')
			form.find('input:radio,input:checkbox').removeAttr('checked')
					.removeAttr('selected')
			$(form)[0].reset()
			// form.find('.combobox-container input:text').val('请选择')
			var combos = $('.combobox', form)
			for (var i = 0; i < combos.length; i++) {
				$.combobox[$(combos[i]).attr('id')].reset()
			}

			if (type) {
				if (form.attr('default'))
					$.jForm.loadRecord(form, $.parseJSON(form.attr('default')))
			}

		}
		$.jForm.loadRecord = function(form, record) { // !!!

			for (var i in record) {

				// normal input / select (1)
				var input = $(
						'input[name="' + i + '"],select[name="' + i + '"]',
						form).not(':checkbox').not(':radio').not('.combobox')
				if (input.length) {
					input.val(record[i])
					continue
				}

				// displayfield / textarea (2)
				var display = $('span[name="' + i + '"],textarea[name="' + i
								+ '"]', form)
				if (display.length) {
					display.text(record[i])
					continue
				}

				// checkbox/radios (3) Mark:checkbox-value = [1,2] or "1;2"
				var radio = $('input[name="' + i + '"][value="' + record[i]
								+ '"]:radio', form)
				if (radio.length) {
					radio.attr('checked', true)
					continue
				}

				var checkboxVal = record[i]
				if (!$.isArray(checkboxVal)
						&& checkboxVal.toString().indexOf(';') !== -1) {
					checkboxVal = checkboxVal.split(';')
				}
				for (var j = 0; j < checkboxVal.length; j++) {
					var check = $('input[name="' + i + '"][value="'
									+ checkboxVal[j] + '"]:checkbox', form)
					if (check.length) {
						check.attr('checked', true)
					}
				}

			}

			// special component ??
			// combobox //!!!
			var combos = $('.combobox', form).not('.not-set-value')
			var valMap = {}
			console.log(combos.length)
			// return
			if (combos.length) {
				for (var i = 0; i < combos.length; i++) {
					var combo = combos[i]
					var comboId = $(combo).attr('id')
					valMap[comboId] = []

					if (record[comboId]) {
						// console.log(record[comboId])

						valMap[comboId].push($(combo).attr('multiple')
								? record[comboId].toString().replace(/;/, ',')
								: record[comboId].toString())
					}

					if ($(combo).attr('child-id')) {

						var target = $('#' + $(combo).attr('child-id'), form)
						// valMap
						while (target.length > 0) {

							var child = $(target[0], form)
							if (record[child.attr('id')]) {
								valMap[comboId].push(child.attr('multiple')
										? record[child.attr('id')].toString()
												.replace(/;/, ',')
										: record[child.attr('id')].toString())
							} else {
								break
							}
							if ($('#' + child.attr('child-id')).length) {
								target = $($('#' + child.attr('child-id'))[0],
										form)
							} else {
								break
							}
						}
					} else {

					}
				}
			}
			// console.log(valMap)
			for (var i in valMap) {
				if (valMap[i].length)
					$.combobox[i].setValue(valMap[i].join(';'))
				console.log(i, valMap[i].join(';'), ' gogo')
			}

		}

		$('form').each(function() {
			var f = $(this)
			$.jForm.setDefault(f)
			if (f.hasClass('highlight')) {
				f.validate({
							highlight : function(label) {
								$(label).closest('.control-group')
										.addClass('error')
							},
							success : function(label) {
								$(label)
										// .text('OK!').addClass('valid')
										.closest('.control-group')
										.removeClass('error')
							}
						});
			} else
				f.validate()

			// query form
			if (f.hasClass('form-query')) {
				f.submit(function() {
							$(f.attr('grid-reload')).flexOptions({
										params : f.serializeObject()
									}).flexReload()
							return false
						}).trigger('submit')
			}

			// default actions
			f.ajaxForm(function() {
						$('.modal').modal('hide')
						// callback reload
						$(f.attr('grid-reload')).flexReload()
					});

		})

	});

}(window.jQuery);

