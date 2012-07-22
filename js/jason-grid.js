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
							sortable : $(ths[i]).attr('sortable'),
							dataRender : $(ths[i]).attr('data-render'),
							clsRender : $(ths[i]).attr('cls-render'),
							width : $(ths[i]).css('width').replace('px', ''),
							align : $(ths[i]).css('text-align')
						})
			}
			ths.remove()
			// console.log(btns,btnArr)
			// console.log(cm);
			// console.log(grid.attr('checkbox'),!!grid.attr('checkbox'));

			grid.flexigrid({
						url : grid.attr('data-url'),// 'data.txt'
						rowId : grid.attr('row-id'),
						colModel : cm/*[{
						display : 'ISO',
						name : 'iso',
						width : 40,
						sortable : true,
						align : 'center'
						}, {
						display : 'Name',
						name : 'name',
						width : 180,
						sortable : true,
						align : 'left'
						}, {
						display : 'Printable Name',
						name : 'printable_name',
						width : 120,
						sortable : true,
						align : 'left'
						}, {
						display : 'ISO3',
						name : 'iso3',
						width : 130,
						sortable : true,
						align : 'left',
						hide : true
						}, {
						display : 'Number Code',
						name : 'numcode',
						width : 80,
						sortable : true,
						align : 'right'
						}]*/,

						/*
						searchitems : [ {
							display : 'ISO',
							name : 'iso'
						}, {
							display : 'Name',
							name : 'name',
							isdefault : true
						} ],*/
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
				return $(toolbtn).parents('.grid')
			}

			// many items
			$.jgrid.gridItemsFn = function(dom) {
				var grid = $.jgrid.getGrid(dom)
				console.log(114,grid)
				var rows = grid.find('.bDiv').find('.trSelected')
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
				var rows = grid.find('.bDiv').find('.trSelected')
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

		});

	});

}(window.jQuery);