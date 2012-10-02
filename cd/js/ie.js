$(function() {
	if ($.browser.msie) {
		var ver = parseInt($.browser.version, 10);
		if (ver === 6) {
			$('.btn').bind('mouseover', function() {
						$(this).addClass('btn-hover');
					});
			$('.btn').bind('mouseout', function() {
						$(this).removeClass('btn-hover');
					});
			$('.btn-group:last-child').addClass('last-child');
			$('.row div[class^="span"]:last-child').addClass('last-child');
			$('[class*="span"]').addClass('margin-left-20');
			$(':button[class="btn"], :reset[class="btn"], :submit[class="btn"], input[type="button"]')
					.addClass('button-reset');
			$(':checkbox').addClass('input-checkbox');
			$(':radio').addClass('input-radio');
			$('[class^="icon-"], [class*=" icon-"]').addClass('icon-sprite');
			$('.pagination li:first-child a')
					.addClass('pagination-first-child');
		} else if (ver === 7) {

		} else if (ver === 8) {

		}
	}
})