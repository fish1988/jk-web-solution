/* ==========================================================
 *	jason-popover.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	$(function() {
		// object
		$.jPopover = {}
		$.jPopover.showTrPopover = function($tdLink, $tr, $thead) {
			$('.popover').remove()
			// if ($tdLink.parents('tr').hasClass('trSelected'))
			var template = '<div id="jPopover" class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><a class="close" style="position:absolute;right:5px;top:3px;" title="关闭">×</a><div class="popover-content">{0}</div></div></div>', keys = $(
					'th', $thead), vals = $('td', $tr), content = [], $tempTd, $htmlVal

			// console.log(keys,vals)
			for (var i = 0, len = keys.length; i < len; i++) {
				if (!$.jString.isEmpty(keys[i].innerText)) {
					$tempTd = $(vals[i])
					$htmlVal = $('<span>').addClass($('div', $tempTd)
							.attr('class')).html($('div', $tempTd).html())
					if ($htmlVal.text().length > 5) {
						$htmlVal.attr('title', $htmlVal.text())
					}

					content.push('<p>' + keys[i].innerText + ' : '
							+ $htmlVal[0].outerHTML + '</p>')
				}
			}

			template = template.replace('{0}', content.join(''))
			// console.log(content.join(''))

			if ($('.modal:visible').length) {
				console.log(39 + ' ', $('.modal:visible').length)
				return
			}
			$tdLink.popover({
						title : $tdLink.text(),
						trigger : 'click',
						template : template,
						placement : 'right'
					}).popover('show')
			if ($('.popover').offset().left < 200) {
				$('.popover').css({
							'left' : '200px'
						})
			}

			// add data
			$('.popover-content', $('.popover')).html(content.join(''))

			// add close listener
			$('.close', $('.popover')).click(function() {
						$('.popover').remove()
					})

		}
		$.jPopover.hideTrPopover = function() {
			$('.popover').remove()
			// $tdLink.popover('hide').popover('destroy')
		}

		// model text renderer
		$.jPopover.modelRender = function(model, type) {
			var rules = {}, arr = []
			switch (type) {
				case 'model' : {
					rules = {
						modelName : '机型名称',
						brandName : '品牌',
						platformName : '系统',
						softwareName : '系统版本',
						screenSize : '屏幕尺寸',
						resolutionName : '分辨率',
						networkStandardNames : '网络制式'
					}

					$.each(model, function(k, v) {
								if (!rules[k]) {
									return
								}
								arr.push('<p>' + rules[k] + ':' + v + '</p>')
							})

				}

				break
				default :
				break
			}
			return arr.join('')
		}

		// remote popover
		$('html').on('mouseenter.popover', 'td .remote-popover', function(e) {
			var template = '<div id="jPopover" class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><a class="close" style="position:absolute;right:5px;top:3px;" title="关闭">×</a><div class="popover-content">{0}</div></div></div>', $this = $(e.target)
			$.jTimer.addTimer($this, function() {
				$('.popover').remove()

				$.post($this.attr('data-url'), function(data) {
							if (!data || !data.items || data.items.length == 0) {
								console.log('没有找到相应机型 ,链接 : '+$this.attr('data-url'))
								return false
							}

							var model = data.items[0]
							// console.log($.jPopover.modelRender(model,'model'))
							template = template.replace('{0}', $.jPopover
											.modelRender(model, 'model'))
							$this.popover({
										title : $this.text(),
										trigger : 'click',
										template : template,
										placement : 'right'
									}).popover('show')

							$('.popover-content', $('.popover'))
									.html($.jPopover
											.modelRender(model, 'model'))
						})

			}, 200)

		})

		$('html').on('click.popover', function(e) {
			if ($(e.target).closest('.popover').length
					&& !$(e.target).hasClass('close'))
				// if($(e.target).parent().hasClass('popover') ||
				// $(e.target).parent().parent().hasClass('popover') ||
				// $(e.target).parent().parent().parent().hasClass('popover'))
				return false
			// $('[rel="popover"]').popover('hide')
			$('.popover').remove()

		})

	})

}(window.jQuery);
