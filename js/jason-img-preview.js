/* ===========================================================
 * jason-img-preview.js
 * ========================================================== */

!function($) {

	"use strict"; // jshint ;_

	/* IMAGE PREVIEW
	 * ================================= */

	var ImagePreview = function(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, $.fn.imagepreview.defaults, options)
		this.$container = this.setup(element)
		this.listen()
	}

	ImagePreview.prototype = {
		setup : function(element) {
			var $input = this.$element, 
			$preview = $(this.options.template),
			imageHtml = $.jString
					.format(this.options.image, '100', '100'), $image = $(imageHtml),
					resultHtml = $.jString
					.format(this.options.result, $(element).attr('target-id'),
							$(element).attr('target-class') ? $(element)
									.attr('target-class') : '', $(element)
									.attr('target-required') ? 'required' : ''), $result = $(resultHtml)
			$input.after($preview)
			//$preview.append($input)
			$('.image-preview', $preview).append($image)
			$preview.append($result)
			this.$result = $result
			this.$image = $('.image-preview img', $preview)
			return $preview
		},
		listen : function() {
			this.$element.on('change.fileupload', $.proxy(this.change, this))
		},
		change : function(e) {
			var me = this, file = e.target.files !== undefined
					? e.target.files[0]
					: {
						name : e.target.value.replace(/^.+\\/, '')
					}, $form = $(me.options.form)//
			if (!file)
				return

			$form.append(this.$result.clone())
			$('body').append($form)
			$form.ajaxForm({
						success : function() {
							me.$image.attr('src', 'xxx.gif')
							me.$result.val('1111') 
							$form.remove()
						},
						error : function() {
							me.$image.attr('src', file.name)
							me.$result.val('1111') 
							$form.remove()
						}
					}).trigger('submit')

		}

	}

	/* IMAGE PREVIEW PLUGIN DEFINITION
	 * =========================== */

	$.fn.imagepreview = function(options) {
		return this.each(function() {
					var $this = $(this), data = $this.data('imagepreview')
					if (!data)
						$this.data('imagepreview', (data = new ImagePreview(
										this, options)))
				})
	}
	$.fn.imagepreview.defaults = {
		template : '<div class="image-preview-container"><div class="image-preview"></div></div>',
		image : '<img src="img/placehold/{0}x{1}.gif" alt="{0}X{1}" style="height: {0}px;width: {1}px;">',
		result : '<input id="{0}" name="{0}" type="text" class="{1}" {2}>',
		form : '<form action="data.aspx" method="post" enctype="multipart/form-data"></form>'
	}
	$.fn.imagepreview.Constructor = ImagePreview

	$('.image-preview').imagepreview()
	/* IMAGE PREVIEW DATA-API
	 * ================== */

	/*$(function() {
				$('body').on('click.imagepreview.data-api',
						'[data-provides="imagepreview"]', function(e) {
							var $this = $(this)
							if ($this.data('imagepreview'))
								return
							$this.imagepreview($this.data())
						})
			})*/

}(window.jQuery)
