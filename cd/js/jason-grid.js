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
							sortable : $(ths[i]).attr('sortable') === 'true',
							dataRender : $(ths[i]).attr('data-render'),
							clsRender : $(ths[i]).attr('cls-render'),
							width : $(ths[i]).css('width').replace('px', ''),
							align : $(ths[i]).css('text-align'),
							hidden : $(ths[i]).attr('hidden')
						})
			}
			ths.remove()
			// console.log(btns,btnArr)
			// console.log(cm);
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
						showToggleBtn : grid.attr('show-column') === 'false'
								? false
								: true,
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
			$.jgrid.getGrid = function(dom) {
				var toolbar = $(dom).parents('.grid-toolbar'), grid
				if (typeof toolbar.attr('grid-target') !== 'undefined') {
					grid = $(toolbar.attr('grid-target'))
				}
				if (!grid || grid.length == 0) {
					grid = $(dom).parents('.grid')
				}
				return grid
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
				var ids = []
				
				for (var i = 0; i < rows.length; i++) {
					ids.push($(rows[i]).attr('row-id'))
				}

				var url = $(dom).attr('url')
				if (url) {
					$.jAlert.alert($.jString.format($(dom).attr('msg'),
									rows.length), 'confirm',
							(url.indexOf('?') === -1 ? url + '?' : url + '&')
									+ 'ids=' + ids.join(';'), function() {
								grid.flexReload()
							})
				} else {
					$.jAlert.alert('请求地址未配置')
				}
			}

			// single item
			$.jgrid.oneGridItemFn = function(dom, innerTr) {
				var grid = $.jgrid.getGrid(dom), rows = (typeof innerTr == 'undefined'
						? grid.find('.trSelected')
						: $(dom).parents('tr'))
				// console.log(rows)
				if (typeof innerTr !== 'undefined' && rows.length !== 1) {
					$.jAlert
							.alert(rows.length === 0 ? '请选择记录' : '只能选择一条记录进行修改')
					return
				}
				var modal = $(dom).attr('href')
				if (modal) {
					// load record or proxy used in .modal shown
					var url = $(dom).attr('url')
					if (typeof url === 'undefined' || url == null
							|| url.length < 1) {
						$(modal).attr('record', $(rows[0]).attr('record'))
						//console.log(133,$(rows[0]),$(rows[0]).attr('record'))
					} else
						$(modal).attr(
								'data-url',
								(url.indexOf('?') === -1 ? url + '?' : url
										+ '&')
										+ 'id=' + $(rows[0]).attr('row-id'))

					$(modal).attr('modal-title', $(dom).attr('modal-title'))
					$(modal).modal('show')
				}
			}

			// grid tr action
			$('.grid').on('click.tr-action', 'tr .td-action', function(e) {
						var $dom = $(e.target)
						$.jgrid.oneGridItemFn($dom,'inner')
					})

			$('.grid-toolbar .btn').click(function() {
						$.jPopover.hideTrPopover()
					})
			// with modal
			$('.grid-one').click(function() {
						$.jgrid.oneGridItemFn(this)
					})

			// with alert
			$('.grid-more').click(function() {
						$.jgrid.gridItemsFn(this)
					})
			// grid preview
			$('.grid-preview').click(function() {
						var $this = $(this)
						if ($this.hasClass('active')) {
							$.jgrid.getGrid(this).flexAllowPreview(false)
							$this.attr('data-original-title', '打开自动预览')
							$('.tooltip .tooltip-inner').text('打开自动预览')
						} else {
							$.jgrid.getGrid(this).flexAllowPreview(true)
							$this.attr('data-original-title', '关闭自动预览')
							$('.tooltip .tooltip-inner').text('关闭自动预览')
						}
					})
			// grid f5
			$('.grid-refresh').click(function() {
						$.jgrid.getGrid(this).flexReload()
					})

			// left-nav grid action
			$('.left-nav').on('click.left-nav', function(e) {
				var $this = $(e.target).parents('li'), $grid = $($this
						.parents('.left-nav').attr('grid-reload')), param = $this
						.parents('ul').attr('data-type')

				// console.log('grid 176', $this)
				if ($grid.length == 0 || typeof param == 'undefined')
					return false
				// console.log('click', 'valid')
				if (typeof $this.attr('data-id') !== 'undefined') {
					var params = {}
					if ($this.attr('data-id') !== 'custom') {
						// console.log($grid.p)

						params[param] = $this.attr('data-id')
						// console.log(params)
						if ($.jTimer) {
							$.jTimer.addTimer($grid.attr('id'), function() {
										$grid.flexQuery(params).flexReload()
									})
						}
					} else {
						if ($(e.target).hasClass('date-query')) {

							var startTime = $this.find('#startTime').val(), endTime = $this
									.find('#endTime').val()

							if (startTime > endTime) {
								$this.find('#startTime').val(endTime)
								$this.find('#endTime').val(startTime)
								params['startTime'] = endTime
								params['endTime'] = startTime
							} else {
								params['startTime'] = startTime
								params['endTime'] = endTime
							}

							if (params['startTime'].length === 0) {
								params['startTime'] = '1970-01-01'
							}

							if (params['endTime'].length === 0) {
								params['endTime'] = '2188-08-08'
							}

							console.log(params)
							if ($.jTimer) {
								$.jTimer.addTimer($grid.attr('id'), function() {
											$grid.flexQuery(params)
													.flexReload()
										})
							}
						}
					}
				}
			})
		});

	});

}(window.jQuery);