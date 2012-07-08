/* ==========================================================
 *	jason-combobox.js
 *  should be included after jquery-validate.js
 *  make forms be easily controlled
 *
 * ========================================================== */
!function($) {

	'use strict'
	$.combobox = {};
	$.combobox.initValues = [];
	var Combobox = function(element, options) {
		this.options = $.extend({}, $.fn.combobox.defaults, options)
		this.width = this.options.width; // default width
		this.$container = this.setup(element)
		this.$element = this.$container.find('input')
		this.$element.css({
					width : this.width
				})

		this.$button = this.$container.find('.dropdown-toggle')
		this.$clear = this.$container.find('.combobox-clear')
		this.$target = this.$container.find('select')
		this.matcher = this.options.matcher || this.matcher
		this.sorter = this.options.sorter || this.sorter
		this.highlighter = this.options.highlighter || this.highlighter
		this.$menu = $(this.options.menu).appendTo('body')
		this.$menu.css({
					width : this.width
				})
		this.placeholder = this.options.placeholder
		this.initValue = this.options.initValue // default width

		this.shown = false
		this.selected = false
		this.refresh()
		this.listen()
	}

	/* NOTE: COMBOBOX EXTENDS BOOTSTRAP-TYPEAHEAD.js
	   ========================================== */

	Combobox.prototype = $.extend({}, $.fn.typeahead.Constructor.prototype, {

				constructor : Combobox,

				reset : function() {
					if (this.$target.hasClass('not-set-value')) {
						// console.log(this.$target,this.$target.find('option:not(.fixed)'),'remove')
						this.$target.find('option:not(.fixed)').remove()
					}
					this.$target.val('')
					this.$element.val('请选择')
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

					var vals = v.split(',')
					var value = [] , texts = '';
					
					for (var i = 0; i < vals.length; i++) {
						var found = this.$target.find('option[value="' + vals[i]
								+ '"]')

						if (found.length) {
							value.push(vals[i])
							var text = found[0].innerHTML;
							texts+=text+';';
						}
					}
					this.$target.val(value)
					this.$element.val(texts)
					console.log(value,texts)
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
					// $('.dropdown-menu').hide();
					var v = this.$element.val();
					this.$element.val('').focus()
					this.clearTarget()
					this.lookup(v)
					if (v !== this.placeholder)
						this.$element.val(v)
				}

				,
				clearTarget : function() {
					this.$target.val('')
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
				select : function() {
					var val = this.$menu.find('.active').attr('data-value')
					var val2 = this.$element.val()
					this.$element.val(val)
					this.$container.addClass('combobox-selected')
					this.$target.val(this.map[val])
					if (val !== val2)
						this.$target.trigger('change')
					this.selected = true
					return // this.hide()
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

					var activeLi = this.$menu.find('li[data-value="' + oldVal
							+ '"]')
					this.$menu.find('li').removeClass('active')
					activeLi.addClass('active')

					this.shown = true
				}

				// modified typeahead function adding button handling
				,
				listen : function() {
					var me = this;
					this.$element.on('blur', $.proxy(this.blur, this)).on(
							'keypress', $.proxy(this.keypress, this)).on(
							'keyup', $.proxy(this.keyup, this)).on('focus',
							function() {
								if ($(this).val() == me.placeholder)
									$(this).val('');
							})

					if ($.browser.webkit || $.browser.msie) {
						this.$element.on('keydown', $
										.proxy(this.keypress, this))
					}

					/*this.$menu.on('click', $.proxy(this.click, this)).on(
							'mouseenter', 'li', $.proxy(this.mouseenter, this))*/

					var child = this.$target.attr('child-id')
					if (child) {
						this.$target.on('change', function() {
									// console.log($(this).attr('id') + '
									// change');
									var combo = $.combobox[child]

									if (!combo)
										return;
									var val = combo.$target.val();

									combo.$element.val('');
									combo.$target.val('');
									if (val.length)
										combo.$target.trigger('change')

									if ($(this).val() !== '') {
										combo.load(true, $(this).val());
									} else {
										combo.$target
												.find('option:not(.fixed)')
												.remove();
										combo.refresh();
									}
									combo.$element.trigger('blur')
								})
					}
					this.$button.on('click', $.proxy(this.toggle, this))

					this.$clear.on('click', function(e) {
								e.stopPropagation()
								e.preventDefault()

								var val = me.$target.val();

								var val2 = me.$element.val();

								if (val2 === me.placeholder || val2 === '') {
									console.log('no clear');
									return;
								}
								me.$element.val('').focus();

								me.$target.val('');

								if (val.length || val2.length)
									me.$target.trigger('change')

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
					if (that.shown)
						setTimeout(function() {
									// that.hide()
									that.shown = false;
									if (that.$element.val() == ''
											|| !that.findText(that.$element
													.val()))
										that.$element.val(that.placeholder);
								}, 150)
					else
						setTimeout(function() {
									if (that.$element.val() == ''
											|| !that.findText(that.$element
													.val()))
										that.$element.val(that.placeholder);
								}, 150)
					return;

					e.stopPropagation()
					e.preventDefault()

				}

				,
				load : function(needLoad, ids, initValue) {

					var combo = this;
					var url = combo.$target.attr('data-url')
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
									combo.$target.find('option:not(.fixed)')
											.remove()
									var arr = [];
									for (var i = 0; i < data.length; i++) {
										arr.push('<option value="' + data[i].id
												+ '">' + data[i].name
												+ '</option>');
									}
									combo.$target.append(arr.join(""));
									var val = combo.$target.val();

									combo.$element.val('');
									// if (val.length)
									// combo.$target.trigger('change');
									combo.$target.val('');
									combo.$element.val(combo.placeholder)
									combo.refresh();

									if (initValue) {
										combo.setSingleValue(initValue);
										// console.log(combo.$target.attr('id'),initValue);
									}

								}, 'json');
					}

				}
			})
	/* COMBOBOX PLUGIN DEFINITION
	 * =========================== */

	$.fn.combobox = function() {
		this.each(function() {
					var $this = $(this), combo

					// console.log($(this).attr('val'));
					combo = new Combobox(this, {
								width : $(this).attr('width') || 220,
								placeholder : $(this).attr('placeholder')
										|| '请选择'
							})
					combo.$element.val(combo.placeholder)
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
		template : '<div class="combobox-container"><input type="text"><span class="add-on btn dropdown-toggle" data-dropdown="dropdown"><span class="caret"/></span><span class="add-on combobox-clear">×</span></div>',
		menu : '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
		item : '<li class="show-checkbox"><input type="checkbox" style="float:left;margin-left:5px;margin-top:2px;"><a href="#"></a></li>',
		placeholder : null
	}

	$.fn.combobox.Constructor = Combobox

	$('.combobox').combobox()

}(window.jQuery)
