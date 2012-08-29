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

				// common click hide dropdowns
				/*$(document).click(function(e) {
					e.stopPropagation()
					var $target = $('.clickOutsideHide:visible')
					var $clicked = $(e.target)
					console.log(27, $target, $clicked,!$clicked.parents('ul.clickOutsideHide').length)
					
					if($target.length == 0)return
					if($target.length>0 && !$clicked.hasClass('dropdown-toggle')&& !$clicked.parents('ul.clickOutsideHide').length){
						$target.hide()
					}
					if ($target.length > 0
							&& $clicked.parent('.clickOutsideHide').length > 0) {
						$target.hide()
					}
					
						if ($.trim(myTarget) != '') {
						if ($('.' + myTarget) != clicked) {
							$('.clickOutsideHide').hide();
						}
					}
				})*/

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