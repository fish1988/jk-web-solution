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
				
			if (typeof dataIndex == 'undefined'){
				return ''
			}
			if (v.constructor === Array) {
				dataIndex = v[0]
			}
			if(dataIndex === null || typeof dataIndex == 'undefined')
				return ''
			
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
						if (i == dataIndex){
							return $.jString.format(rules[i], v)
						}
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
				1 : '有效',
				0 : '无效'
			}
			return $.jRenderer.valueChange(v, rules)
		}

		$.jRenderer.yesNoChange = function(v) {
			var rules = {
				1 : '是',
				0 : '否'
			}

			console.log(v,$.jRenderer.valueChange(v, rules))
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
				0 : 'td-err',
				1 : 'td-ok'
			}
			return $.jRenderer.classChange(v, rules)
		}

		// download link
		$.jRenderer.downloadChange = function(v) {
			var template = '<a href="{0}">{1}</a>'
			return $.jRenderer.valueChange(v, template, 'format')
		}

		// deleted or not
		$.jRenderer.cmdChange = function(v) {
			return $.jRenderer.valueChange(v, {
				0 : '<span class="cmd j-opacity6" title="已无效"><i class="icon-trash"></i></span>',
				1 : ''
			})

		}

		// show tips on hover
		$.jRenderer.tipsChange = function(v) {
			var template = '<a class="td-action" title="{0}" href="#myModal">{0}</a>'
			return $.jRenderer.valueChange(v, template, 'format')
		}

		// short time change
		$.jRenderer.shortDateTimeChange = function(v) {
			
			var dateStr = v[0]
			if(!dateStr || !dateStr.length){
				return ''
			}
			var a = dateStr.split(" "), d = a[0].split("-"), t = a[1]
					.split(":")
			return new XDate(d[0], (d[1] - 1), d[2], t[0], t[1], t[2])
					.toString('M-d HH:mm')
		}

		$.jRenderer.timeAndPersonChange = function(v) {
			return $.jRenderer.shortDateTimeChange(v) + ' by ' + v[1]
		}

		// modal change
		$.jRenderer.modalChange = function(v) {
			var text = $.jRenderer.valueChange(v[0], {
						1 : '待审批',
						2 : '审批通过'
					})
			var template = '<a class="td-action" href="#workflowModal" title="{0}">{0}</a>'
			if(typeof v[1] !='undefined' && !!v[1]){
				template = '{0}'
			}
			
			return $.jRenderer.valueChange(text, template, 'format')
		}
		
		// name concat change
		$.jRenderer.concatChange = function(v){
			var template = '{1} {0}'
			return $.jRenderer.valueChange(v, template, 'format')
		}
		
		// add Memory Unit (M)
		$.jRenderer.addMemoryChange = function(v){
			var template = '{0}M'
			return $.jRenderer.valueChange(v, template, 'format')
		}
		
		// add cpu speed unit (G)
		$.jRenderer.addCPUChange = function(v){
			var template = '{0}GHZ'
			return $.jRenderer.valueChange(v, template, 'format')
		}
		
		// remote popover
		$.jRenderer.remotePopoverChange = function(v){
			var template =  '<a class="remote-popover" href="#" title="{0}" data-url="phoneModel/list.html?modelId={1}">{0}</a>'
			return $.jRenderer.valueChange(v, template, 'format')
		}
	});

}(window.jQuery);