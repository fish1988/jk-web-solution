/* ==========================================================
 *	jason-combobox.js
 *
 * ========================================================== */
!function($) {

	'use strict'
	$.combobox = {};
	$.combobox.initValues = [];
	var Combobox = function(element, options) {
		this.multiSelect = ($(element).attr('multiple') === 'multiple' || $(element)
				.attr('multiple') === 'true')
		this.options = $.extend({}, this.multiSelect
						? $.fn.combobox.multiDefaults
						: $.fn.combobox.defaults, options)
		this.width = parseInt(this.options.width) // default width
		this.$container = this.setup(element)
		this.placeholder = this.options.placeholder
		this.$element = this.$container.find('input')
		this.$element.attr('placeholder',this.placeholder)
		this.$element.css({
					width : this.width
				})

		this.$button = this.$container.find('.dropdown-toggle')
		this.$clear = this.$container.find('.combobox-clear')
		this.$clear.hide()
		this.$clear.css({left:this.width-5+'px'})
		this.$target = this.$container.find('select')
		this.matcher = this.options.matcher || this.matcher
		this.sorter = this.options.sorter || this.sorter
		this.highlighter = this.options.highlighter || this.highlighter
		this.$menu = $(this.options.menu).appendTo('body')
		this.$menu.width( this.width +11)
		
		this.initValue = this.options.initValue // default width

		this.shown = false
		this.selected = false
		this.refresh()
		this.listen()
	}

	/*
	 * NOTE: COMBOBOX EXTENDS BOOTSTRAP-TYPEAHEAD.js
	 * ==========================================
	 */

	Combobox.prototype = $.extend({}, $.fn.typeahead.Constructor.prototype, {

		constructor : Combobox,

		reset : function() {
			if (this.$target.hasClass('not-set-value')) {
				// console.log(this.$target,this.$target.find('option:not(.fixed)'),'remove')
				this.$target.find('option:not(.fixed)').remove()
			}
			this.$target.val('')
			$.jPlaceholder.val(this.$element,this.placeholder)
			this.refresh()
		},
		getChild : function() {
			return $.combobox[this.$target.attr('child-id')];
		},
		findText : function(v) {
			var sel = this.$target;
			var op = sel.find('option');
			var val = this.$element.val();
			// console.log(op);
			for (var i = 0; i < op.length; i++) {
				if (op[i].innerHTML == val) {
					return op[i];
				}
			}
			return null;

		},
		setValue : function(vals) {
			var arrValues = vals.split(';')
			if (arrValues.length) {
				var i = 0;
				var parent = '#'
				var id = this.$target.attr('id')
				while (arrValues.length - i) {
					if (id) {
						$.combobox.initValues.push({
									'id' : id,
									'value' : arrValues[i++],
									'parent' : parent,
									'loadChild' : arrValues.length - i === 0
											? true
											: false
								})
					}
					parent = id
					id = $('#' + id).attr('child-id')
				}

			}

			// set values
			for (var i = 0; i < $.combobox.initValues.length; i++) {
				var item = $.combobox.initValues[i]
				// load and setValue
				$.combobox[item.id].load(true, item.parent, item.value)
				if (item.loadChild === true) {
					var child = $.combobox[item.id].getChild()
					if (child) {
						child.load(true, '#')
					}
				}
			}
			$.combobox.initValues = []
		},
		setSingleValue : function(v) {
			if (typeof v === 'undefined')
				return;

			var arr = v.split(',')
			var targetVals = [], elementText = ''
			for (var i = 0; i < arr.length; i++) {
				var val = arr[i]
				var found = this.$target.find('option[value="' + val + '"]')

				if (found.length) {
					targetVals.push(val)

					var text = found[0].innerHTML;

					elementText += text + (i === arr.length - 1 ? '' : ';');
				}

			}
			this.$target.val(targetVals);
			console.log(this.$target.val())
			this.$element.val(elementText);
			this.$clear.show()
		},
		setup : function(element) {
			var select = $(element), combobox = $(this.options.template)
			select.before(combobox)
			select.detach()
			combobox.append(select)
			return combobox
		}

		,
		parse : function() {
			var map = {}, source = [], selected = false
			this.$target.find('option').each(function() {
						var option = $(this)
						map[option.text()] = option.val()
						source.push(option.text())
						if (option.attr('selected'))
							selected = option.html()
					})
			this.map = map
			if (selected) {
				this.$element.val(selected)
				this.$container.addClass('combobox-selected')
				this.selected = true
			}
			return source
		}

		,
		toggle : function() {

			if (!this.shown) {
				$('.dropdown-menu').hide();
				console.log('button click')
				var v = this.$element.val()
				this.$element.val('').focus()
				if (this.multiSelect) {
					console.log('multi', v)

				} else {

					this.clearTarget()
				}
				this.lookup(v)
				if (v !== this.placeholder) {
					$.jPlaceholder.val(this.$element,this.placeholder)

					// this.lookup(v)
				}else{
					//this.$clear.hide()
				}
			} else {
				$('.dropdown-menu').hide()
				this.shown = false
			}
		}

		,
		clearTarget : function() {
			// console.log('clearTarget')
			this.$target.val(this.multiSelect ? [] : '')
			this.$container.removeClass('combobox-selected')
			this.selected = false
		}

		,
		refresh : function() {
			this.source = this.parse()
			this.options.items = this.source.length
		}

		// modified typeahead function adding container and target
		// handling
		,
		click : function(e) {
			e.stopPropagation()
			e.preventDefault()
			this.select(e)
			// return;

		},

		select : function(e) {
			// e.stopPropagation()
			// e.preventDefault()
			var li = this.$menu.find('.active')
			this.$clear.show()
			var val = li.attr('data-value')
			console.log('select')
			if (this.multiSelect) {

				var input = li.find(':checkbox')
				// input.trigger
				if (input.attr('checked')) {
					input.attr('checked', false)
					input.parent().removeClass('li-selected')
				} else {
					input.attr('checked', true)
					input.parent().addClass('li-selected')
				}

				var selectLi = this.$menu.find('.li-selected')
				var text = '', dataValues = []
				for (var i = 0; i < selectLi.length; i++) {
					dataValues
							.push(this.map[$(selectLi[i]).attr('data-value')])
					text += $('a', $(selectLi[i])).text()
							+ (i == selectLi.length - 1 ? '' : ';')
				}
				if (dataValues.length === 0) {
					dataValues = []
				}
				this.$target.val(dataValues)
				this.$element.val(text)
				console.log('dataValues', dataValues)
				console.log('text', text)
				console.log('res', this.$target.val())
				this.$target.trigger('change')
				this.$container.addClass('combobox-selected')

				// this.$target.val(this.map[val])

				this.selected = true
				return // this.hide()
			} else {

				console.log('select', val)
				var val2 = this.$element.val()
				this.$element.val(val)
				this.$container.addClass('combobox-selected')
				this.$target.val(this.map[val])
				if (val !== val2)
					this.$target.trigger('change')
				this.selected = true
				return this.hide()
			}

		}

		// modified typeahead function removing the blank handling
		,
		lookup : function(oldVal) {
			var that = this, items, q

			this.query = this.$element.val()

			items = $.grep(this.source, function(item) {
						if (that.matcher(item))
							return item
					})

			items = this.sorter(items)

			if (!items.length) {
				return this.shown ? this.hide() : this
			}

			this.render(items.slice(0, this.options.items)).show()
			this.$menu.find('li').removeClass('active')
					.removeClass('li-selected')

			console.log('lookup')
			if (this.multiSelect) {
				console.log('oldVal', oldVal)
				var arr = oldVal.split(';')

				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === '')
						continue
					var activeLi = this.$menu.find('li[data-value="' + arr[i]
							+ '"]')
					activeLi.find(':checkbox').attr('checked', true)
					activeLi.addClass('li-selected')

					console.log('select291', arr[i])
				}

			} else {
				var activeLi = this.$menu.find('li[data-value="' + oldVal
						+ '"]')

				activeLi.addClass('active')
			}
			this.$element.val(oldVal)
			this.shown = true
		}

		// modified typeahead function adding button handling
		,
		listen : function() {
			var me = this;
			/*this.$element.on('blur', $.proxy(this.blur, this)).on('keypress',
					$.proxy(this.keypress, this)).on('keyup',
					$.proxy(this.keyup, this)).on('focus', function() {
						if ($(this).val() == me.placeholder || $(this).val() ==''){
							$(this).val('')
							//me.$clear.hide()
						}else{
							//me.$clear.show()
						}
					})*/

			if ($.browser.webkit || $.browser.msie) {
				this.$element.on('keydown', $.proxy(this.keypress, this))
			}

			this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter','li', $.proxy(this.mouseenter, this))
			if (this.multiSelect)
				this.$menu.on('mouseleave', function() {
							setTimeout(function() {
										console.log('mouseout')
										me.hide()
									}, 300)
						})

			var child = this.$target.attr('child-id')
			if (child) {
				this.$target.on('change', function() {
							console.log($(this).attr('id') + ' change');
							var combo = $.combobox[child]

							if (!combo)
								return;
							var val = combo.$target.val();
							
							combo.$element.val('');
							combo.$target.val(combo.multiSelect ? [] : '');

							if (combo.multiSelect)
								combo.$target.trigger('change')

							if ($(this).val() !== '' && $(this).val() !== null) {
								me.$clear.show()
								combo.load(true, me.multiSelect ? $(this).val()
												.join(	';') : $(this).val());
							} else {
								console.log('remove')
								combo.$target.find('option:not(.fixed)')
										.remove();
								combo.refresh();

							}
							combo.$element.trigger('blur')
							if (me.multiSelect && $(this).val() === null){
								$.jPlaceholder.val(me.$element,me.placeholder)
								me.$clear.hide()
							}else{
								me.$clear.show()
							}
							if (combo.multiSelect)
								$.jPlaceholder.val(combo.$element,combo.placeholder)
						})
			}
			this.$button.on('click', $.proxy(this.toggle, this))

			this.$clear.on('click', function(e) {
						e.stopPropagation()
						e.preventDefault()
						me.$menu.hide()
						
						me.shown = false
						console.log('clear ' + me.$target.attr('id'))
						var val = me.$target.val();

						var val2 = me.$element.val();

						if (val2 === me.placeholder || val2 === '') {
							console.log('no clear');
							$.jPlaceholder.val(me.$element,me.placeholder)
							
							//me.$target.trigger('change')
							return;
						}
						if (me.multiSelect) {
							$.jPlaceholder.val(me.$element,me.placeholder)
						} else {
							me.$element.val('').focus();
						}
						me.$target.val(me.multiSelect ? [] : '');

						if (me.multiSelect) {
							if (val !== null)
								me.$target.trigger('change')
						} else if (val.length || val2.length)
							me.$target.trigger('change')
						me.$clear.hide()
					})
		}

		// modified typeahead function to clear on type and prevent on
		// moving around
		,
		keyup : function(e) {

			switch (e.keyCode) {
				case 40 : // down arrow
				case 39 : // right arrow
				case 38 : // up arrow
				case 37 : // left arrow
				case 36 : // home
				case 35 : // end
				case 16 : // shift
					break

				case 9 : // tab
				case 13 : // enter
					if (!this.shown)
						return

					this.select()
					break

				case 27 : // escape
					if (!this.shown)
						return

					this.hide()
					break

				default :
					this.clearTarget()
					this.lookup()
			}

			var found = this.findText(this.$element.val())
			if (found) {
				this.selected = true
				this.$target.val($(found).val());
				this.$target.trigger('change')

			} else {

				this.selected = false
				var combo = this.getChild();
				// this.$element.val('');
				if (!combo)
					return;
				// combo.$element.val('')
				// combo.$element.trigger('blur')
				combo.$target.val('')
				combo.$target.find('option:not(.fixed)').remove()
				combo.refresh()
			}
			e.stopPropagation()
			e.preventDefault()
		}

		// modified typeahead function to only hide menu if it is
		// visible
		,
		blur : function(e) {

			var that = this

			if (this.multiSelect) {
				// console.log('hide - 441')
				/*
				 * setTimeout(function() {
				 * 
				 * //that.hide() //that.shown = false; if (that.$element.val() ==
				 * '') that.$element.val(that.placeholdeXr); }, 1500)
				 */
			} else {
				if (that.shown)
					setTimeout(function() {

								that.hide()
								that.shown = false;
								if (that.$element.val() == ''
										|| !that.findText(that.$element.val()))
									$.jPlaceholder.val(that.$element,that.placeholder)
							}, 150)
				else
					setTimeout(function() {
								if (that.$element.val() == ''
										|| !that.findText(that.$element.val()))
									$.jPlaceholder.val(that.$element,that.placeholder)
							}, 150)
			}

			e.stopPropagation()
			e.preventDefault()

		}

		,
		load : function(needLoad, ids, initValue) {

			var combo = this;

			var url = $.jStore.getUrl(combo.$target.attr('data-url'))
			if (typeof url === 'undefined' || url.length === 0) {
				combo.setSingleValue(initValue);
				return

			}
			if (needLoad) {

				// remove unfixed items
				combo.$target.find('option:not(.fixed)').remove();

				if (ids && ids.length > 0) {
					url += ids;
				} else {
					return;
				}

				// get data
				$.get(url, function(data) {
							// console.log(combo.$target.attr('id') + '
							// ' + url);
							combo.$target.find('option:not(.fixed)').remove()
							var arr = [];
							for (var i = 0; i < data.length; i++) {
								arr.push('<option value="' + data[i].id + '">'
										+ data[i].name + '</option>');
							}
							combo.$target.append(arr.join(""));
							var val = combo.$target.val();

							combo.$element.val('');
							// if (val.length)
							// combo.$target.trigger('change');
							combo.$target.val(combo.multiSelect ? [] : '')
							$.jPlaceholder.val(combo.$element,combo.placeholder)
							combo.refresh();

							if (initValue) {
								combo.setSingleValue(initValue);
								// console.log(combo.$target.attr('id'),initValue);
							}

						}, 'json');
			}

		}
	})
	/*
	 * COMBOBOX PLUGIN DEFINITION ===========================
	 */

	$.fn.combobox = function() {
		this.each(function() {
					var $this = $(this), combo

					// console.log($(this).attr('val'));
					combo = new Combobox(this, {
								width : $(this).attr('width') || 220,
								placeholder : $(this).attr('placeholder')
										|| '请选择'
							})
					$.jPlaceholder.val(combo.$element,combo.placeholder)
					$this.data('combobox', combo)

					var initValues = $(this).attr('val')
					var arrValues = initValues ? initValues.split(';') : [];

					// console.log(initValues,arrValues)
					if (initValues && arrValues.length) {
						var i = 0;
						var parent = '#'
						var id = $this.attr('id')
						while (arrValues.length - i) {
							if (id) {
								// var valueObj = {};
								// valueObj['id'] = arrValues[i++]
								$.combobox.initValues.push({
											'id' : id,
											'value' : arrValues[i++],
											'parent' : parent,
											'loadChild' : arrValues.length - i === 0
													? true
													: false
										})
								// console.log(id);
							}
							parent = id;
							id = $('#' + id).attr('child-id');

						}

					}
					// console.log($.combobox.initValues);

					if (typeof option == 'string')
						combo[option]()
					// console.log(combo);
					if ($this.attr('id')) {
						$.combobox[$this.attr('id')] = combo;
					}

					if ($this.attr('data-url')) {
						// need load data? and init paramid/ids..
						combo.load($(this).attr('autoload'), '#');
					}

				})

		// set values
		for (var i = 0; i < $.combobox.initValues.length; i++) {
			var item = $.combobox.initValues[i]
			// load and setValue
			$.combobox[item.id].load(true, item.parent, item.value)
			if (item.loadChild === true) {
				var child = $.combobox[item.id].getChild()
				if (child) {
					child.load(true, '#')
				}
			}
		}
		$.combobox.initValues = []
	}
	$.fn.combobox.defaults = {
		template : '<div class="combobox-container"><input type="text"><span class="add-on btn dropdown-toggle" data-dropdown="dropdown"><span class="caret"></span></span><span class="combobox-clear">×</span></div>',
		menu : '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
		item : '<li><a href="#"></a></li>',
		placeholder : null
	}

	$.fn.combobox.multiDefaults = {
		template : '<div class="combobox-container"><input type="text" readonly><span class="add-on btn dropdown-toggle" data-dropdown="dropdown"><span class="caret"></span></span><span class="combobox-clear">×</span></div>',
		menu : '<ul class="typeahead typeahead-long dropdown-menu multi-combobox"></ul>',
		item : '<li><input type="checkbox"><a href="#"></a></li>',
		placeholder : null
	}

	$.fn.combobox.Constructor = Combobox

	// $(function() {
	$('.combobox').combobox()
	// })

}(window.jQuery)
