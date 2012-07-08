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
						0 : '是',
						1 : '否',
						2 : '不是',
						3 : '不知'
					}
					return $.jRenderer.valueChange(v, rules)
				}
				
				$.jRenderer.statusClsChange = function(v) {
					var rules = {
						1 : 'td-err',
						0 : 'td-ok'
					}
					return $.jRenderer.valueChange(v, rules)
				}
				$.jRenderer.downloadChange = function(v) {
					var template = '<a href="{0}">{1}</a>'
					return $.jRenderer.valueChange(v, template, 'format')
				}
			});

}(window.jQuery);