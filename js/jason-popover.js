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
					'td,th', $thead), vals = $('td,th', $tr), content = [], $tempTd, $htmlVal

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
			
			template = template.replace('{0}',content.join(''))
			// console.log(content.join(''))

			$tdLink.popover({
						title : $tdLink.text(),
						trigger : 'click',
						template : template
					}).popover('show')
			if($('.popover').offset().left < 200){
				$('.popover').css({'left':'200px'})
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
		
		$('html').on('click.popover', function(e) {
					if($(e.target).closest('.popover').length && !$(e.target).hasClass('close') )
					//if($(e.target).parent().hasClass('popover') || $(e.target).parent().parent().hasClass('popover') || $(e.target).parent().parent().parent().hasClass('popover'))
						return false
					//$('[rel="popover"]').popover('hide')
					 $('.popover').remove()

					})

	})

}(window.jQuery);
