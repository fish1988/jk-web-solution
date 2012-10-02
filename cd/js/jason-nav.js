/* ==========================================================
 *	jason-nav.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	/* nav
	 * ============== */

	$(function() {

		// Disable # links
		$('body').on('click', 'a[href^=#]', function(e) {
					// console.log(18,'click #',$(this))
					e.preventDefault()
				})

		$('.remote-ul').each(function() {
			var $this = $(this), template = '<li data-id="{0}"><a href="#">{1}</a></li>', liArr = []

			if (!$this.attr('data-url'))
				return

			var url = $.jStore.getUrl($this.attr('data-url'))
			console.log(28, 'here', $this.attr('data-url'), url)
			if (!url)
				return
			$.getJSON(url, function(data) {
						$.each(data, function(k, v) {
									liArr.push($.jString.format(template, v.id,
											v.name))
								})
						liArr.push('<li class="divider"></li>')
						$this.append(liArr.join(''))
					})

		})
	})
}(window.jQuery)