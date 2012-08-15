/* ==========================================================
 *	jason-grid.js
 *  use flexigrid ...
 *
 * ========================================================== */

!function($) {

	$(function() {

		$('.grid').each(function() {

			// initialize
			var grid = $(this);
			// toolbar
			var toolbar = grid.find('thead .btn-toolbar')[0];

			// group header
			var groupHeader = []
			var ghead = grid.find('thead tr.group-header').find('th');
			for (var i = 0; i < ghead.length; i++) {
				groupHeader.push({
							display : $(ghead[i]).text(),
							colspan : $(ghead[i]).attr('colspan')
						})
			}
			ghead.remove()
			// thead
			var cm = [];
			var ths = grid.find('thead tr:last th');
			for (var i = 0; i < ths.length; i++) {
				cm.push({
							display : $(ths[i]).text(),
							name : $(ths[i]).attr('name'),
							sortable : $(ths[i]).attr('sortable')=== 'true',
							dataRender : $(ths[i]).attr('data-render'),
							clsRender : $(ths[i]).attr('cls-render'),
							width : $(ths[i]).css('width').replace('px', ''),
							align : $(ths[i]).css('text-align'),
							hidden : $(ths[i]).attr('hidden')
						})
			}
			ths.remove()
			// console.log(btns,btnArr)
			//console.log(cm);
			// console.log(grid.attr('checkbox'),!!grid.attr('checkbox'));
			if ($.timer) {
						$.timer.clearTimer(grid.attr('id'))
						$.timer.addTimer(grid.attr('id'), function() {
									
								})
					}
			grid.flexigrid({
						id : grid.attr('id'),
						url : grid.attr('data-url'),// 'data.txt'
						rowId : grid.attr('row-id'),
						colModel : cm,
						toolbar : toolbar,
						width : parseInt(grid.attr('grid-width')),
						height : parseInt(grid.attr('grid-height')),
						sortname : grid.attr('sort-name'),
						sortorder : grid.attr('sort-order'),
						title : grid.attr('title'),
						checkbox : grid.attr('checkbox') === 'true',
						resizable : grid.attr('resizable') === 'true',
						groupHeader : groupHeader.length == 0
								? false
								: groupHeader
					})

			$.jgrid = {}
			// grid buttons
			$.jgrid.getGrid = function(toolbtn) {
				var toolbar = $(toolbtn).parents('.grid-toolbar')
				if (typeof toolbar.attr('grid-target') !== 'undefined') {
					var grid = $(toolbar.attr('grid-target'))
				}
				// console.log('toolbar',toolbar,grid)
				return grid.length > 0 ? grid : toolbar.parents('.grid')
			}

			// many items
			$.jgrid.gridItemsFn = function(dom) {
				var grid = $.jgrid.getGrid(dom)

				var rows = grid.find('.trSelected')
				// console.log(114, grid,'rows',rows)
				if (rows.length < 1) {
					$.jAlert.alert('请选择记录')
					return
				}
				var ids = ''
				for (var i = 0; i < rows.length; i++) {
					ids += ($(rows[i]).attr('row-id') + ';')
				}

				var url = $(dom).attr('url')
				if (url) {
					$.jAlert.alert($.jString.format($(dom).attr('msg'),
									rows.length), 'confirm',
							(url.indexOf('?') === -1 ? url + '?' : url + '&')
									+ 'ids=' + ids, function() {
								grid.flexReload()
							})
				} else {
					$.jAlert.alert('请求地址未配置')
				}
			}

			// single item

			$.jgrid.oneGridItemFn = function(dom) {
				var grid = $.jgrid.getGrid(dom)
				var rows = grid.find('.trSelected')
				// console.log(rows)
				if (rows.length !== 1) {
					$.jAlert
							.alert(rows.length === 0 ? '请选择记录' : '只能选择一条记录进行修改')
					return
				}
				var modal = $(dom).attr('href')
				if (modal) {
					// load record or proxy used in .modal shown
					var url = $(dom).attr('url')
					if (typeof url === 'undefined' || url == null
							|| url.length < 1)
						$(modal).attr('record', $(rows[0]).attr('record'))
					else
						$(modal).attr(
								'data-url',
								(url.indexOf('?') === -1 ? url + '?' : url
										+ '&')
										+ 'id=' + $(rows[0]).attr('row-id'))

					$(modal).attr('modal-title', $(dom).attr('modal-title'))
					$(modal).modal('show')
				}
			}

			// with modal
			$('.grid-one').click(function() {
						$.jgrid.oneGridItemFn(this)
					})

			// with alert
			$('.grid-more').click(function() {
						$.jgrid.gridItemsFn(this)
					})

			// grid f5
			$('.grid-refresh').click(function() {
						$.jgrid.getGrid(this).flexReload()
					})

			// left-nav grid action
			$('.left-nav li').click(function() {
				// var timer
				var $this = $(this), $grid = $($this.parents('.left-nav')
						.attr('grid-reload')), param = $this.parents('ul')
						.attr('data-type')
				if ($grid.length == 0 || typeof param == 'undefined')
					return
				// console.log('click', 'valid')
				if (typeof $this.attr('data-id') !== 'undefined') {
					// console.log($grid.p)
					var params = {}
					params[param] = $this.attr('data-id')
					// console.log(params)
					if ($.jTimer) {
						$.jTimer.addTimer($grid.attr('id'), function() {
									$grid.flexQuery(params).flexReload()
								})
					}
				}

			})
		});

	});

}(window.jQuery);