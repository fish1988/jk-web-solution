/* ==========================================================
 *	jason-form.js
 *  should be included after jquery-validate.js
 *  make forms be easily controlled
 *
 * ========================================================== */

!function($) {

	"use strict"; //

	/*
	 * FORM Validation ==============
	 */

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

		// getInfo form select
		$.jForm.getDataFromSelect = function(select) {
			var arr = [], id = select.attr('id'), type = select
					.attr('data-url')
			var options = $('option:not(.fixed)', select)
			// var store = select.attr('data-url')
			options.each(function(k, opt) {
						var option = $(opt)
						arr.push({
									id : option.val(),
									name : option.text(),
									target : id,
									type : type
								})
					})
			// var selectType =

			return arr
		}

		// build search source
		$.jForm.buildSource = function(form, source) {
			// major selects
			var mainSelects = $('select[autoload=true]', form)
			console.log(mainSelects)
			$.each(mainSelects, function(i, sel) {

						var select = $(sel)
						if (typeof source[select.attr('id')] == 'undefined') {
							source[select.attr('id')] = $.jForm
									.getDataFromSelect(select)
						}
					})

			// other selects
			var otherSelects = $('select:not([autoload=true])', form)
			console.log(65, otherSelects)
			$.each(otherSelects, function(i, sel) {
						var select = $(sel)
						source[select.attr('id')] = $.jForm
								.getDataFromSelect(select)

					})

			return source
		}

		// form defaults
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
			form[0].reset()
			form
					.find('input:text, input:password, input:file,select, textarea')
					.val('')
			form.find('input:radio,input:checkbox').removeAttr('checked')
					.removeAttr('selected')
			form.find(':file.image-preview').imagepreview('reset')
			
			// form.find('.combobox-container input:text').val('请选择')
			var combos = $('.combobox', form)
			for (var i = 0; i < combos.length; i++) {
				$.combobox[$(combos[i]).attr('real-id')].reset()
			}

			if (type) {
				if (form.attr('default'))
					$.jForm.loadRecord(form, $.parseJSON(form.attr('default')))
			}

		}

		// form item change
		$.jForm.itemEditChange = function(form, status) {
			if (status == 'new') {
				$('.edit-hide', form).removeClass('hidden')
				$('.edit-show', form).addClass('hidden')
				$('.edit-disable', form).removeAttr('disabled')
				$('.edit-disable.combobox', form).combobox('actived')
			} else if (status == 'edit') {
				$('.edit-hide', form).addClass('hidden')
				$('.edit-show', form).removeClass('hidden')
				$('.edit-disable', form).attr('disabled', true)
				$('.edit-disable.combobox', form).combobox('disabled')
			}

		}

		$.jForm.loadRecord = function(form, record) { // !!!

			$.each(record, function(i, k) {

						if (k === null || typeof k === 'undefined') {
							return
						}

						// normal input / select (1)
						var input = $(
								'input[name="' + i + '"],select[name="' + i
										+ '"]', form).not(':checkbox')
								.not(':radio').not('.combobox')
						if (input.length) {
							input.val(k)
							return
						}

						// displayfield / textarea (2)
						var display = $('span[name="' + i
										+ '"],textarea[name="' + i + '"]', form)
						if (display.length) {
							display.text(k)
							return
						}

						// checkbox/radios (3) Mark:checkbox-value = [1,2] or
						// "1;2"
						var radio = $('input[name="' + i + '"][value="' + k
										+ '"]:radio', form)
						if (radio.length) {
							radio.attr('checked', true)
							return
						}

						var checkboxVal = (k === true ? '1' : k === false
								? '0'
								: k)
						if (!$.isArray(checkboxVal)) {
							checkboxVal = checkboxVal.toString().split(';')
						}
						for (var j = 0; j < checkboxVal.length; j++) {
							var check = $('input[name="' + i + '"][value="'
											+ checkboxVal[j] + '"]:checkbox',
									form)
							if (check.length) {
								check.attr('checked', true)
							}
						}
					})

			// special component ??
			// combobox //!!!
			var combos = $('.combobox', form).not('.not-set-value')
			var valMap = {}
			// console.log(combos.length)
			// return
			if (combos.length) {
				for (var i = 0; i < combos.length; i++) {
					var combo = combos[i], comboId = $(combo).attr('id'), comboRealId = $(combo)
							.attr('real-id')
					valMap[comboRealId] = []

					// combo
					if (record[comboId]) {
						console.log(record[comboId])

						valMap[comboRealId].push($(combo).attr('multiple')
								? record[comboId].toString().replace(/;/, ',')
								: record[comboId].toString())
					}

					// combo children
					if ($(combo).attr('child-id')) {

						var target = $('#' + $(combo).attr('child-id'), form)
						// console.log(216,$(combo),target)

						// valMap
						while (target.length > 0) {

							var child = $(target[0])

							// console.log(225,child)
							if (typeof record[child.attr('id')] != 'undefined'
									&& record[child.attr('id')] !== null) {
								valMap[comboRealId].push(child.attr('multiple')
										? record[child.attr('id')].toString()
												.replace(/;/, ',')
										: record[child.attr('id')].toString())
							} else {
								break
							}
							if ($('#' + child.attr('child-id')).length) {
								target = $($('#' + child.attr('child-id'))[0])
							} else {
								break
							}
						}
					} else {

					}
				}
			}
			// console.log(243,valMap)
			for (var i in valMap) {
				if (valMap[i].length) {
					$.combobox[i].setValue(valMap[i].join(';'))
				}
				// console.log(i, valMap[i].join(';'), ' gogo')
			}

		}

		// bug form-params handler
		$.jForm.getParams = function($f) {
			var params = $f.serializeObject(), queryObject = {}
			$.each(params, function(key, val) {
						if (typeof key == 'string' && key.charAt(0) === '_') {
							queryObject[key.slice(1)] = val
						} else {
							queryObject[key] = val
						}
					})
			return queryObject
		}

		// clear form
		$('.clear-form').click(function() {
			var $this = $(this), formSelector = $this.attr('target-form')
			if (!formSelector)
				return
			var $form = $(formSelector)
			$.jForm.reset($form)
			$('.search[target-form="' + formSelector + '"]')
					.search('clearItems')
		})

		// submit form
		$('.submit-form.btn').click(function() {
			var $this = $(this), formSelector = $this.attr('target-form')
			if (!formSelector)
				return
			var $form = $(formSelector)

			// query form
			if ($form.hasClass('form-query')) {
				$form.submit(function() {
					// add left-nav params
					var leftNavParams = {}
					$(".left-nav li.selected").each(function(i, li) {
								var $this = $(li)
								if (typeof $this.attr('data-id') !== 'undefined') {
									var paramId = $this.parents('ul')
											.attr('data-type')
									if (typeof paramId !== 'undefined') {
										leftNavParams[paramId] = $this
												.attr('data-id')
									}
								}
							})
					// console.log('left', leftNavParams)
					if ($form.parent().hasClass('query-detail')) {
						$form.parent().addClass('hidden')
					}
					$($form.attr('grid-reload')).flexOptions({
						params : $.extend($.jForm.getParams($form),
								leftNavParams)
					}).flexReload()
					return false
				}).trigger('submit')
			}
		})

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
					// add left-nav params
					var leftNavParams = {}, queryObject = {}
					$(".left-nav li.selected").each(function(i, li) {
								var $this = $(li)
								if (typeof $this.attr('data-id') !== 'undefined') {
									var paramId = $this.parents('ul')
											.attr('data-type')
									if (typeof paramId !== 'undefined') {
										leftNavParams[paramId] = $this
												.attr('data-id')
									}
								}
							})
					// console.log('left', leftNavParams, f.serializeObject())

					$(f.attr('grid-reload')).flexOptions({

								params : $.extend($.jForm.getParams(f),
										leftNavParams)
							}).flexReload()
					return false
				}).trigger('submit')
			}

			// default actions
			f.ajaxForm({
						type : 'POST',
						data : {
							from : 'bootstrap',
							timeStamp : new Date().getTime()
						},
						success : function(data) {

							f.parents('.modal').modal('hide')

							if (data && !data.success) {
								$.jAlert
										.alert($.jMsg.getMsg(data.message,
														data.value))
							} else {
								if (f.attr('success-alert')) {
									$.jAlert.alert($.jMsg.getMsg(data.message,
													data.value))
								} else
									$.jAlert.msg($.jMsg.getMsg(data.message,
													data.value))
							}
							// callback reload
							$(f.attr('grid-reload')).flexReload()

						}
					})

		})

	});

}(window.jQuery);
