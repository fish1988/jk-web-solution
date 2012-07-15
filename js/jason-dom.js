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

		$('.show-hide-switch,.show-switch,.hide-switch').click(
				function() {
					var targets = $(this).attr('show-hide');
					var showType = $(this).hasClass('show-switch') ? 1
							: $(this).hasClass('hide-switch') ? 2 : 0;

					if (targets && targets.length) {
						var targetArr = targets.split(/\s+/);
						for ( var i = 0; i < targetArr.length; i++) {
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