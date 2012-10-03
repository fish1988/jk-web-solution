/* ==========================================================
 *	jason-grid-renderer.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* class renderer
	 * ============== */

	$(function() {
		// renderers [dataRenderer,cssRenderer]
		$.jRenderer = {}
		$.jRenderer.classChange = function(v, rules, type) {
			var dataIndex = v
			if (typeof type == 'undefined')
				type = 'equal'
			if (v.constructor === Array) {
				dataIndex = v[0]
			}

			switch (type) {
				case 'equal' : {
					for (var i in rules) {
						if (i == dataIndex)
							return rules[i]
					}
					break
				}
				case 'range' : {
					for (var i in rules) {
						if (i <= dataIndex)
							return rules[i]
					}
					break
				}
			}
			return ''

		}

		$.jRenderer.valueChange = function(v, rules, type) {
			var dataIndex = v
			if (typeof type == 'undefined')
				type = 'equal'
			if (v.constructor === Array) {
				dataIndex = v[0]
			}

			switch (type) {
				case 'format' : {
					if (rules.constructor === String) {
						return $.jString.format(rules, v)
					} else {
						return v
					}
					break
				}
				case 'equal' : {
					for (var i in rules) {
						if (i == dataIndex)
							return $.jString.format(rules[i], v)
					}
					break
				}
				case 'range' : {
					for (var i in rules) {
						if (i <= dataIndex)
							return $.jString.format(rules[i], v)
					}
					break
				}
			}
			return v
		}

		$.jRenderer.statusChange = function(v) {
			var rules = {
				0 : '有效',
				1 : '无效'
			}
			return $.jRenderer.valueChange(v, rules)
		}

		$.jRenderer.yesNoChange = function(v) {
			var rules = {
				0 : '是',
				1 : '否'
			}
			return $.jRenderer.valueChange(v, rules)
		}
		
		$.jRenderer.hasOrNotChange = function(v) {
			var rules = {
				0 : '有',
				1 : '无'
			}
			return $.jRenderer.valueChange(v, rules)
		}
		
		$.jRenderer.statusClsChange = function(v) {
			var rules = {
				1 : 'td-err',
				0 : 'td-ok'
			}
			return $.jRenderer.classChange(v, rules)
		}
		
		
		
		
		$.jRenderer.downloadChange = function(v) {
			var template = '<a href="{0}">{1}</a>'
			return $.jRenderer.valueChange(v, template, 'format')
		}

		$.jRenderer.cmdChange = function(v) {

			return $.jRenderer.valueChange(v, {
				0 : '<span class="cmd j-opacity6" title="已无效"><i class="icon-trash"></i></span>',
				1 : ''
			})

		}

		$.jRenderer.modalChange = function(v) {
			var template = '<a href="#">{0}</a>'
			return $.jRenderer.valueChange(v, template, 'format')
		}

		$.jRenderer.shortDateTimeChange = function(v) {
			var dateStr = v[0], a = dateStr.split(" "), d = a[0].split("-"), t = a[1]
					.split(":")
			return new XDate(d[0], (d[1] - 1), d[2], t[0], t[1], t[2])
					.toString('M-d HH:mm')
		}
		
		$.jRenderer.timeAndPersonChange = function(v){
			return $.jRenderer.shortDateTimeChange(v) + ' by '+v[1]
		}

	});

}(window.jQuery);