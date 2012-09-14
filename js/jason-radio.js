/* ==========================================================
 *	jason-radio.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'

	/* radio
	 * ============== */

	$(function() {

		$('.remote-radio,.remote-checkbox').each(function() {
			var $this = $(this), targetName = $this.attr('target-name'), template = '<label class="radio inline"><input type="radio" name="{0}" id="{0}" value="{1}">{2}</label>', liArr = []

			if (!$this.attr('data-url'))
				return
				
			if($this.hasClass('remote-checkbox'))
				template = '<label class="checkbox inline"><input type="checkbox" name="{0}" id="{0}" value="{1}">{2}</label>'

			var url = $.jStore.getUrl($this.attr('data-url'))
			console.log(28, 'here', $this.attr('data-url'), url)
			if (!url)
				return
			$.getJSON(url, function(data) {
						$.each(data, function(k, v) {
									liArr.push($.jString.format(template,
											targetName, v.id, v.name))
								})
						$this.append(liArr.join(''))
					})

		})
	})
}(window.jQuery)