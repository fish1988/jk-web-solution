/* ==========================================================
 *	jason-search.js
 *
 * ========================================================== */
!function($) {

	'use strict'
	var Search = function(element, options) {

		this.$element = $(element)
		this.options = $.extend({}, $.fn.search.defaults, options)
		this.targetForm = this.options.formId
		this.$addOn = this.options.addOn
		this.$container = this.setup(element)

		$('.query-params', this.$container).click(function() {
					return false
				})
		this.matcher = this.options.matcher || this.matcher
		this.sorter = this.options.sorter || this.sorter
		this.highlighter = this.options.highlighter || this.highlighter
		this.updater = this.options.updater || this.updater
		this.$menu = $(this.options.menu).appendTo('body')
		// this.$menu = $(this.options.menu).appendTo(this.$container)

		if (this.options.menuWidth) {
			this.$menu.css('width', this.options.menuWidth)
		}
		this.source = this.options.source
		// console.log(24, this.source)
		// this.loadSource(this.options.comboIds)
		this.shown = false
		this.listen()
	}

	/*
	 * NOTE: SearchBox EXTENDS BOOTSTRAP-TYPEAHEAD.js
	 * ==========================================
	 */

	Search.prototype = $.extend({}, $.fn.typeahead.Constructor.prototype, {

		constructor : Search,
		clearItems : function() {
			// console.log('49 clearItems----')
			var search = this.$container
			$('.query-item', search).remove()
			this.adjust()
		},
		getAdditionItem : function(query) {
			var me = this, form = $(me.targetForm), items = []

			var inputs = $('input.j-search-item', form)

			inputs.each(function(i, input) {
						var inp = $(input)
						if (inp.hasClass('positive-integer')
								&& !/^\d+$/.test(query)) {

						} else
							items.push({
										id : query,
										name : query + ' - '
												+ inp.attr('title'),
										target : inp.attr('id')
									})
					})
			return items
		},
		addItemRemoveListener : function() {
			var search = this.$container, me = this
			$('.query-item-clear', search).off('click').click(function() {
				// form record
				var changeId = $('.query-item-label', $(this).parent())
						.attr('data-type')

				if ($.combobox[changeId]) {
					$.combobox[changeId].setSingleValue('')
					$.combobox[changeId].$target.trigger('change')
					var combo = $.combobox[changeId].getChild()
					while (combo) {
						combo.setSingleValue('')
						combo.$target.trigger('change')
						$('.query-item-label[data-type='
								+ combo.$target.attr('id') + ']').parent()
								.remove()
						combo = combo.getChild()
					}
				} else {
					$('#' + changeId, $(me.targetForm)).val('')
				}
				// console.log(51, $(this).parent())
				$(this).parent().remove()

				me.adjust()
			})
		},
		adjust : function(tag) {
			var search = this.$container
			var offsetX = search.find('.query-params').width()

			search.find('.query-input').css({
						marginLeft : offsetX + 'px'
					})
			// console.log(offsetX + 'px')

			var inputWidth = $.browser.msie
					? (search.width() - offsetX - 10)
					: (search.width() - offsetX - 30) + 'px'
			search.find('.query-input').css({
						width : inputWidth
					})
			this.$element.css({
						width : inputWidth
					})

			$('ul.search.dropdown-menu').css({
						width : inputWidth
					})
			if (typeof tag == 'undefined') {
				$(this.targetForm).submit()
			}

			// console.log(97, $('ul.search.dropdown-menu').css('width'))
		},
		setup : function(element) {
			var input = $(element), search = $(this.options.template), me = this
			input.before(search)

			input.css('width', $.browser.msie ? search.width() - 10 : search
							.width()
							- 30)
			search.find('.query-input').css('width',
					$.browser.msie ? search.width() - 10 : search.width() - 30)
					.prepend(input)
			$('.query-clear .search-clear').click(function() {
						$('.query-item', search).remove()
						$.jForm.reset($(me.targetForm))
						// $('.submit-form[target-form="#'+$(this.targetForm).attr('id')+'"]')[0].click()
						input.val('')
						me.adjust()
					})

			// form bind

			// inputs
			var inputs = $('input.j-search-item', $(this.targetForm)), selects = $(
					'select', $(this.targetForm)), count = inputs.length
					+ selects.length

			if (count < 4) {
				// console.log(149,me.$addOn)
				me.$addOn = me.options.addOn.replace('style=""',
						'style="max-width:200px;"').replace('style=";"',
						'style="max-width:135px;"')
			}
			inputs.each(function(i, input) {
						$(input).on('change', function() {
							// console.log('change', $(input))
							var $this = $(this), targetItemLabel = $(
									'.query-item-label[data-type='
											+ $this.attr('id') + ']', search), targetItemLabelText = $this
									.val()
									+ ' - ' + $this.attr('title')

							if (targetItemLabel.length) {
								if ($this.val() == '') {
									targetItemLabel.parent().remove()
								} else {
									targetItemLabel
											.attr('data-id', $this.val()).attr(
													'data-value',
													targetItemLabelText).attr(
													'title',
													targetItemLabelText)
									$('.jlabel-inner', targetItemLabel)
											.text(targetItemLabelText)
								}
							} else {
								var addOn = $.jString.format(me.$addOn,
										targetItemLabelText, $this.val(), $this
												.attr('id'), 'icon-user')
								search.find('.query-params').append(addOn)
								// add item
								me.addItemRemoveListener()
							}
							me.adjust(0)
						})
					})
			// combos
			selects.each(function(i, select) {
						$(select).on('change', function() {
							// console.log('change 107', $(this))
							var $this = $(this), targetItemLabel = $(
									'.query-item-label[data-type='
											+ $this.attr('id') + ']', search), targetItemLabelText = $(
									'option:selected', $this).text()
							if (targetItemLabel.length) {
								if ($this.val() == '') {
									var changeComboId = $this.attr('id')

									var combo = $.combobox[changeComboId]
											.getChild()
									while (combo) {
										combo.setSingleValue('')
										combo.$target.trigger('change')
										$('.query-item-label[data-type='
												+ combo.$target.attr('id')
												+ ']').parent().remove()
										combo = combo.getChild()
									}
									targetItemLabel.parent().remove()
								} else {
									targetItemLabel
											.attr('data-id', $this.val()).attr(
													'data-value',
													targetItemLabelText).attr(
													'title',
													targetItemLabelText)
									$('.jlabel-inner', targetItemLabel)
											.text(targetItemLabelText)
								}

							} else {
								var addOn = $.jString.format(me.$addOn,
										targetItemLabelText, $this.val(), $this
												.attr('id'), 'icon-user')
								search.find('.query-params').append(addOn)
								// add item
								me.addItemRemoveListener()
							}
							me.adjust(0)

						})
					})
			return search
		},
		select : function() {
			var me = this
			var activeLi = this.$menu.find('.active')
			var val = activeLi.attr('data-value')
			var dataId = activeLi.attr('data-id')
			var dataType = activeLi.attr('data-type')

			this.$element.val(this.updater(val)).change()

			var search = this.$container

			var similar = $('span[data-type=' + dataType + ']', search)
			if (similar.length) {
				similar.attr('data-value', val).attr('data-id', dataId).attr(
						'data-type', dataType).attr('title', val)
				$('.jlabel-inner', similar).text(val)

			} else {
				var addOn = $.jString.format(this.$addOn, val, dataId,
						dataType, 'icon-user')
				search.find('.query-params').append(addOn)
				me.addItemRemoveListener()
			}

			// form record
			var record = {}
			$('.query-item-label', search).each(function() {
						var label = $(this)
						record[label.attr('data-type')] = label.attr('data-id')
					})
			$.jForm.loadRecord($(this.targetForm), record)
			this.adjust()
			this.$element.val('')// .change()
			return this.hide()
		}

		,
		updater : function(item) {
			return item
		}

		,
		show : function() {
			var pos = $.extend({}, this.$element.offset(), {
						height : this.$element[0].offsetHeight
					})

			this.$menu.css({
						top : pos.top + pos.height,
						left : pos.left
					})

			this.$menu.show()
			this.shown = true
			return this
		},
		listen : function() {
			var me = this, el = this.$element
			this.$element.on('blur', $.proxy(this.blur, this)).on('keypress',
					$.proxy(this.keypress, this)).on('keyup',
					$.proxy(this.keyup, this)).on('focus blur', function() {
				/*if (el.val() == ''
						|| el.val() == el.attr('placeholder')) {*/

				$('.search-clear', me.$container).removeClass('hidden')
					/*if ($('.query-item', me.$container).length == 0) {
				// console.log(190, el.val())
				$('.search-clear', me.$container)
					.addClass('hidden')

				} else {
				$('.search-clear', me.$container)
					.removeClass('hidden')
				}*/
				})

			if ($.browser.webkit || $.browser.msie) {
				this.$element.on('keydown', $.proxy(this.keypress, this))
			}

			this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter',
					'li', $.proxy(this.mouseenter, this))
		},
		lookup : function(event) {
			var that = this, items = [], q
			// build
			this.source = $.jForm.buildSource($(this.targetForm), this.source)
			// console.log(264, this.source)

			this.query = this.$element.val()

			if (!this.query) {
				return this.shown ? this.hide() : this
			}

			$.each(this.source, function(k, v) {
						items = $.merge(items, $.grep(v, function(item) {
											return that.matcher(item.name)
										}))
					})

			// console.log(75, items)
			items = this.sorter(items)
			// if (!items.length) {
			items = $.merge(items, this.getAdditionItem(this.query))
			// }

			if (!items.length) {
				return this.shown ? this.hide() : this
			}
			this.adjust(0)
			// console.log(81, items)

			return this.render(items.slice(0, this.options.items)).show()
		}

		,
		hide : function() {
			this.$menu.hide()
			this.shown = false
			return this
		},
		matcher : function(item) {
			return ~item.toLowerCase().indexOf(this.query.toLowerCase())
		}

		,
		sorter : function(items) {
			var beginswith = [], caseSensitive = [], caseInsensitive = [], item

			while (item = items.shift()) {
				if (!item.name.toLowerCase().indexOf(this.query.toLowerCase()))
					beginswith.push(item)
				else if (~item.name.indexOf(this.query))
					caseSensitive.push(item)
				else
					caseInsensitive.push(item)
			}

			return beginswith.concat(caseSensitive, caseInsensitive)
		}

		,
		highlighter : function(item) {
			var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,
					'\\$&')
			return item.replace(new RegExp('(' + query + ')', 'ig'), function(
							$1, match) {
						return '<strong>' + match + '</strong>'
					})
		},
		render : function(items) {
			var that = this
			// console.log(items)
			items = $(items).map(function(i, item) {
				i = $(that.options.item).attr('data-id', item.id).attr(
						'data-value', item.name).attr('data-type', item.target)
				i.find('a').html(that.highlighter(item.name))
				return i[0]
			})
			// console.log(items)

			items.first().addClass('active')
			this.$menu.html(items)
			return this
		}
	})
	/*
	 * SEARCH PLUGIN DEFINITION ===========================
	 */

	$.fn.search = function(option) {
		this.each(function() {
					var $this = $(this).removeClass('space-search'), mySearch = $this
							.data('search')
					if (mySearch) {
						if (typeof option == 'string')
							mySearch[option]()
						return false
					} else {
						mySearch = new Search(this, {
									// source :
									// $.parseJSON($this.attr('data-source')) ||
									// [],
									comboIds : $this.attr('combo-select'),
									formId : $this.attr('target-form'),
									/*
									 * source : [ { id : 1, name : "Alabama", target : 'userId' }, {
									 * id : 2, name : "Alaska", target : 'userId' }, { id : 3, name :
									 * "Arizona", target : 'userId' }, { id : 4, name : "Arkansas",
									 * target : 'userId' }, { id : 5, name : "Alabama", target :
									 * 'userId' }, { id : 7, name : "axxx", target : 'userName' }, {
									 * id : 8, name : "acds", target : 'userName' } ],
									 */
									menuWidth : $this.css('width')
								})
						$this.data('search', mySearch)
					}

				})
	}

	$.fn.search.defaults = {
		source : {},
		items : 8,
		addOn : '<div class="query-item" style=""><span data-id="{1}" data-type="{2}" data-value="{0}" title="{0}" class="query-item-label" style=";"><i class="{3} hidden"></i> <span class="jlabel-inner">{0}</span></span><span class="query-item-clear" title="移除">×</span></div>',
		template : '<div class="query-container"><div class="query-params"></div><div class="query-input"><div class="query-clear"><div class="search-clear hidden show-hide-switch" title="移除所有条件" show-hide="search-clear" >×</div></div><div rel="tooltip" title="更多选择..." class="j-tooltip-l query-trigger show-hide-switch" show-hide="query-detail"></div></div></div>',
		menu : '<ul class="search dropdown-menu"></ul>',
		item : '<li><a href="#"></a></li>'
	}

	$.fn.search.Constructor = Search

	// $(function() {
	$('.search').search()
	// })

}(window.jQuery)
