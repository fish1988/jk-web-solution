/* ==========================================================
 *	jason-dom.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/*
	 * dom utils ==============
	 */

	$(function() {
				/*$('body').click(function(e) {
							console.log(e, $(e.target))
							if ($(e.target).length == 0) {
								$.jPopover.hideTrPopover()
							}
						})*/

				// common click hide divs
				$('html').on('click.clickOutHide', function(e) {
					if ($(e.target).hasClass('show-hide-switch'))
						return false

					if ($(e.target).closest('.clickOutHide').length
							&& !$(e.target).hasClass('close'))
						return false
					$('.clickOutHide').addClass('hidden')

				})

				$('.show-hide-switch,.show-switch,.hide-switch').click(
						function() {
							console.log($(this))
							var targets = $(this).attr('show-hide');
							var showType = $(this).hasClass('show-switch')
									? 1
									: $(this).hasClass('hide-switch') ? 2 : 0;

							if (targets && targets.length) {
								var targetArr = targets.split(/\s+/);
								for (var i = 0; i < targetArr.length; i++) {
									var els = $('.' + targetArr[i]);
									if (els) {
										if (showType === 0) {
											els.toggleClass('hidden');
										} else if (showType === 1) {
											els.removeClass('hidden');
										} else {
											els.addClass('hidden');
										}

									}
								}
							}
						});

				$('.active-switch li').click(function() {
							$(this).parent().find('li').removeClass('selected');
							$(this).toggleClass('selected');
						});
			});

}(window.jQuery);