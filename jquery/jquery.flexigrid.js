/*
 * Flexigrid for jQuery -  v1.1
 *
 * Copyright (c) 2008 Paulo P. Marinas (code.google.com/p/flexigrid/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
;(function($) {

	$.addFlex = function(t, p) {
		if (t.grid)
			return false; // return if already exist
		p = $.extend({ // apply default properties
			// id : Math.random(100),
			rendererCache : {},
			rowId : 'id',
			height : 200, // default height
			width : 'auto', // auto width
			striped : true, // apply odd even stripes
			novstripe : false,
			minwidth : 50, // min width of columns
			minheight : 80, // min height of columns
			resizable : false, // allow table resizing
			url : false, // URL if using data from AJAX
			method : 'GET', // data sending method
			dataType : 'json', // json
			errormsg : '连接失败',
			usepager : true,
			nowrap : true,
			page : 1, // current page
			total : 1, // total items
			useRp : true, // use the results per page select box
			rp : 20, // results per page
			rpOptions : [10, 15, 20, 50, 100], // allowed per-page values
			showPageNumbers : 10,
			title : false,
			pagestat : '<b>{from}</b> - <b>{to}</b> 条，共  <b>{total}</b> 条 '
					+ '( <b>{time}</b> 秒 )',
			pagetext : '第',
			outof : '页，共',
			findtext : '查找',
			params : {}, // allow optional parameters to be passed around
			procmsg : '操作进行中...',
			query : '',
			qtype : '',
			nomsg : '没有数据',
			minColToggle : 2, // minimum allowed column to be hidden
			allowPreview : true,
			showToggleBtn : true, // show or hide column toggle popup
			hideOnSubmit : true,
			autoload : false,
			blockOpacity : 0.5,
			preProcess : false,
			checkbox : false,
			groupHeader : false,
			addTitleToCell : true, // add a title attr to cells with truncated
			// contents
			dblClickResize : false, // auto resize column by double clicking
			onDragCol : false,
			onToggleCol : false,
			onChangeSort : false,
			onSuccess : false,
			onError : false,
			onSubmit : false
				// using a custom populate function
		}, p);
		$(t).show() // show if hidden
				.attr({
							cellPadding : 0,
							cellSpacing : 0,
							border : 0
						}) // remove padding and spacing
				.removeAttr('width'); // remove width properties
		// create grid class
		var g = {
			hset : {},
			rePosDrag : function() {
				var cdleft = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft > 0)
					cdleft -= Math.floor(p.cgwidth / 2);
				$(g.cDrag).css({
							top : g.hDiv.offsetTop + 1
						});
				var cdpad = this.cdpad;
				$('div', g.cDrag).hide();

				$('thead tr:last th:visible', this.hDiv).each(function() {
							var n = $('thead tr:last th:visible', g.hDiv)
									.index(this);
							var cdpos = parseInt($('div', this).width());
							if (cdleft == 0)
								cdleft -= Math.floor(p.cgwidth / 2);
							cdpos = cdpos + cdleft + cdpad;
							if (isNaN(cdpos)) {
								cdpos = 0;
							}
							// add checkboxes
							$('div:eq(' + n + ')', g.cDrag).css({
										'left' : cdpos + (p.checkbox ? 22 : 0)
												+ 'px'
									}).show();
							cdleft = cdpos;
						});
			},
			fixHeight : function(newH) {
				newH = false;
				if (!newH)
					newH = $(g.bDiv).height();
				var hdHeight = $(this.hDiv).height();
				$('div', this.cDrag).each(function() {
					$(this).height((newH + hdHeight > 400 ? 400 : newH
							+ hdHeight));
						// console.log(108,newH + hdHeight)
				});
				var nd = parseInt($(g.nDiv).height());
				/*				if (nd > newH)
									$(g.nDiv).height('auto').width(200);
								else*/
				$(g.nDiv).height('auto').width(200);
				$(g.block).css({
							height : newH,
							marginBottom : (newH * -1)
						});
				var hrH = g.bDiv.offsetTop + newH;
				if (p.height != 'auto' && p.resizable)
					hrH = g.vDiv.offsetTop;
				$(g.rDiv).css({
							height : hrH
						});
			},
			dragStart : function(dragtype, e, obj) { // default drag function

				// start
				if (dragtype == 'colresize') {// column resize

					this.fixHeight()
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					var n = $('div', this.cDrag).index(obj);

					var ow = $('tr:last th:visible div:eq(' + n + ')',
							this.hDiv).width()
					$(obj).addClass('dragging').siblings().hide();
					$(obj).prev().addClass('dragging').show();
					this.colresize = {
						startX : e.pageX,
						ol : parseInt(obj.style.left),
						ow : ow,
						n : n
					};
					$('body').css('cursor', 'col-resize');
				} else if (dragtype == 'vresize') {// table resize
					var hgo = false;
					$('body').css('cursor', 'row-resize');
					if (obj) {
						hgo = true;
						$('body').css('cursor', 'col-resize');
					}
					this.vresize = {
						h : p.height,
						sy : e.pageY,
						w : p.width,
						sx : e.pageX,
						hgo : hgo
					};
				} else if (dragtype == 'colMove') {// column header drag
					return
					if (p.groupHeader)
						return
					$(g.nDiv).hide();
					$(g.nBtn).hide();

					this.hset = $(this.hDiv).offset();
					this.hset.right = this.hset.left
							+ $('table', this.hDiv).width();
					this.hset.bottom = this.hset.top
							+ $('table', this.hDiv).height();
					this.dcol = obj;
					this.dcoln = $('tr:last th', this.hDiv).index(obj);
					this.colCopy = document.createElement("div");
					this.colCopy.className = "colCopy";
					this.colCopy.innerHTML = obj.innerHTML;
					if ($.browser.msie) {
						this.colCopy.className = "colCopy ie";
					}
					$(this.colCopy).css({
								position : 'absolute',
								float : 'left',
								display : 'none',
								textAlign : obj.align
							});
					$('body').append(this.colCopy);
					$(this.cDrag).hide();
				}
				$('body').noSelect();
			},
			dragMove : function(e) {
				if (this.colresize) {// column resize
					var n = this.colresize.n;
					var diff = e.pageX - this.colresize.startX;
					var nleft = this.colresize.ol + diff;
					var nw = this.colresize.ow + diff;
					if (nw > p.minwidth) {
						$('div:eq(' + n + ')', this.cDrag).css('left', nleft);
						this.colresize.nw = nw;
					}
				} else if (this.vresize) {// table resize
					var v = this.vresize;
					var y = e.pageY;
					var diff = y - v.sy;
					if (!p.defwidth)
						p.defwidth = p.width;
					if (p.width != 'auto' && !p.nohresize && v.hgo) {
						var x = e.pageX;
						var xdiff = x - v.sx;
						var newW = v.w + xdiff;
						if (newW > p.defwidth) {
							this.gDiv.style.width = newW + 'px';
							p.width = newW;
						}
					}
					var newH = v.h + diff;
					if ((newH > p.minheight || p.height < p.minheight)
							&& !v.hgo) {
						this.bDiv.style.height = newH + 'px';
						p.height = newH;
						this.fixHeight(newH);
					}
					v = null;
				} else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver');
					if (e.pageX > this.hset.right || e.pageX < this.hset.left
							|| e.pageY > this.hset.bottom
							|| e.pageY < this.hset.top) {
						// this.dragEnd();
						$('body').css('cursor', 'move');
					} else {
						$('body').css('cursor', 'pointer');
					}
					$(this.colCopy).css({
								top : e.pageY + 10,
								left : e.pageX + 20,
								display : 'block'
							});
				}
			},
			dragEnd : function() {
				if (this.colresize) {
					var n = this.colresize.n;
					var nw = this.colresize.nw;
					$('tr:last th:visible div:eq(' + n + ')', this.hDiv).css(
							'width', nw);
					$('tr', this.bDiv).each(function() {
								var $tdDiv = $('td:visible div:eq(' + n + ')',
										this);
								$tdDiv.css('width', nw);
								g.addTitleToCell($tdDiv);
							});
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					$('div:eq(' + n + ')', this.cDrag).siblings().show();
					$('.dragging', this.cDrag).removeClass('dragging');
					this.rePosDrag();
					this.fixHeight();
					this.colresize = false;
					var name = p.colModel[n].name; // Store the widths in the
					// cookies
					// $.cookie('flexiwidths/'+name, nw);
				} else if (this.vresize) {
					this.vresize = false;
				} else if (this.colCopy) {
					$(this.colCopy).remove();
					if (this.dcolt != null) {
						if (this.dcoln > this.dcolt)
							$('tr:last th:eq(' + this.dcolt + ')', this.hDiv)
									.before(this.dcol);
						else
							$('tr:last th:eq(' + this.dcolt + ')', this.hDiv)
									.after(this.dcol);
						this.switchCol(this.dcoln, this.dcolt);
						$(this.cdropleft).remove();
						$(this.cdropright).remove();
						this.rePosDrag();
						if (p.onDragCol) {
							p.onDragCol(this.dcoln, this.dcolt);
						}
					}
					this.dcol = null;
					this.hset = null;
					this.dcoln = null;
					this.dcolt = null;
					this.colCopy = null;
					$('tr:last .thMove', this.hDiv).removeClass('thMove');
					$(this.cDrag).show();
				}
				$('body').css('cursor', 'default');
				$('body').noSelect(false);
			},
			toggleCol : function(cid, visible) {
				var ncol = $("tr:last th[axis='col" + cid + "']", this.hDiv)[0];
				var n = $('thead tr:last th', g.hDiv).index(ncol);
				var cb = $('input[value=' + cid + ']', g.nDiv)[0];
				if (visible == null) {
					visible = ncol.hidden;
				}
				if ($('input:checked', g.nDiv).length < p.minColToggle
						&& !visible) {
					return false;
				}
				if (visible) {
					ncol.hidden = false;
					$(ncol).show();
					cb.checked = true;
				} else {
					ncol.hidden = true;
					$(ncol).hide();
					cb.checked = false;
				}
				$('tbody tr', t).each(function() {
							if (visible) {
								$('td:eq(' + n + ')', this).show();
							} else {
								$('td:eq(' + n + ')', this).hide();
							}
						});
				this.rePosDrag();
				if (p.onToggleCol) {
					p.onToggleCol(cid, visible);
				}
				return visible;
			},
			switchCol : function(cdrag, cdrop) { // switch columns
				$('tbody tr', t).each(function() {
					if (cdrag > cdrop)
						$('td:eq(' + cdrop + ')', this).before($('td:eq('
										+ cdrag + ')', this));
					else
						$('td:eq(' + cdrop + ')', this).after($('td:eq('
										+ cdrag + ')', this));
				});
				// switch order in nDiv
				if (cdrag > cdrop) {
					$('tr:eq(' + cdrop + ')', this.nDiv).before($('tr:eq('
									+ cdrag + ')', this.nDiv));
				} else {
					$('tr:eq(' + cdrop + ')', this.nDiv).after($('tr:eq('
									+ cdrag + ')', this.nDiv));
				}
				if ($.browser.msie && $.browser.version < 7.0) {
					$('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},
			scroll : function() {
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				this.rePosDrag();
			},
			checkToolBarStat : function() {
				var selectRows = $('tbody tr.trSelected', g.bDiv), $toolbar = $('.grid-toolbar[grid-target=#'
						+ p.id + ']'), $checkbox = $(':checkbox', g.hDiv), $allRows = $(
						'tbody tr', g.bDiv)
				if ($toolbar.length == 0) {
					return
				}
				if (selectRows.length == 0) {
					$('.grid-one,.grid-more', $toolbar).addClass('disabled')
				} else if (selectRows.length == 1) {
					$('.grid-one,.grid-more', $toolbar).removeClass('disabled')
				} else {
					$('.grid-more', $toolbar).removeClass('disabled')
					$('.grid-one', $toolbar).addClass('disabled')
				}

				if ($allRows.length === selectRows.length) {
					$checkbox[0].checked = true
				} else {
					$checkbox[0].checked = false
				}
			},
			cellRender : function(pth, align, val, cls) {
				// return;
				// var s = new Date().getTime()
				var /*cacheVal, dataRenderer = cm.dataRender, clsRenderer = cm.clsRender, dataIndex, tdVal = [], */td = document
						.createElement('td'), tdDiv = document
						.createElement('div')

				/*	// dataIndex = cm.name.split(';')
					for (var i = 0, len = dataIndex.length; i < len; i++) {
						tdVal.push(row[dataIndex[i]])
					}*/

				// console.log(655,n,p.colModel)
				// if (pth != null) {
				/*if (p.sortname == $(pth).attr('abbr') && p.sortname) {
					$(td).addClass('sorted')
				}*/
				/*$(tdDiv).css({
							textAlign : align,// pth.align,
							width : $('div', pth)[0].style.width
						});*/
				tdDiv.style['text-align'] = align
				tdDiv.style['width'] = pth.firstChild.style.width
				if (pth.hidden) {
					td.style['display'] = 'none'
					// $(td).css('display', 'none')
				}
				// }
				/*if (p.nowrap == false) {
					$(tdDiv).css('white-space', 'normal')
				}*/

				// data renderer
				/*if ($.jRenderer && typeof dataRenderer != 'undefined'
						&& $.jRenderer[dataRenderer]) {

					if (cacheVal = p.rendererCache[dataRenderer + '-' + tdVal])
						tdDiv.innerHTML = cacheVal
					else {
						tdDiv.innerHTML = $.jRenderer[dataRenderer](tdVal)
						p.rendererCache[dataRenderer + '-' + tdVal] = tdDiv.innerHTML
					}
				}*/
				typeof val != 'undefined'
						? tdDiv.innerHTML = val
						: tdDiv.innerHTML = '&nbsp;'

				/*if (typeof val != 'undefined') {
					tdDiv.innerHTML = val
				} else {
					tdDiv.innerHTML = '&nbsp;'
				}*/

				// style renderer
				/*if ($.jRenderer && typeof clsRenderer != 'undefined'
						&& $.jRenderer[clsRenderer]) {
					if (cacheVal = p.rendererCache[clsRenderer + '-' + tdVal])
						$(tdDiv).addClass(cacheVal)
					else {
						cacheVal = $.jRenderer[clsRenderer](tdVal)
						$(tdDiv).addClass(cacheVal)
						p.rendererCache[clsRenderer + '-' + tdVal] = cacheVal
					}
				}*/
				if (typeof cls != 'undefined') {
					$(tdDiv).addClass(cls)
				}
				td.appendChild(tdDiv)// .removeAttr('width'); // wrap
				// content
				// console.log('cellRender 404 ', new Date().getTime() - s+'ms')
				return td
			},
			addData : function(data) { // parse data
				console.log('addData 411 ', new Date().getTime() - p.startTime
								+ ' ms')
				if (p.dataType == 'json') {
					data = $.extend({
								items : [],
								page : 0,
								total : 0
							}, data);
				}
				if (p.preProcess) {
					data = p.preProcess(data);
				}
				// $('.pReload', this.pDiv).removeClass('loading');
				this.loading = false;
				if (!data) {
					// $('.pPageStat', this.pDiv).html(p.errormsg);
					return false;
				}
				p.total = data.total;

				if (p.total == 0) {
					$('tr, a, td, div', t).unbind();
					$(t).empty();
					$(t).html('<tr><td><div>没有记录</div></td></tr>')
					p.pages = 1;
					p.page = 1;
					$('.pagination', g.pDiv).addClass('hidden')
					setTimeout(function() {
								$('.page-loading').hide()
							}, 0)
					// $(g.gDiv).addClass('hidden')
					return false
				}
				p.pages = Math.ceil(p.total / p.rp);
				if (p.pages > 1) {
					$('.pagination', g.pDiv).removeClass('hidden')
				} else {
					$('.pagination', g.pDiv).addClass('hidden')
				}
				// build new body
				var tbody = document.createElement('tbody'), me = this

				if (p.dataType == 'json') {

					var tr, tdEl, cm, cth, cthch, objTr, cthDiv, idx, td,tdDiv,pth, pthMap = {}, dataIndex = {}, tdDataMap = {}, tdClsMap = {}, rowData, tdVal = [], dataRenderer, clsRenderer, cacheVal, idx, cacheDataKey, cacheClsKey,val,cls

					var ss = new Date().getTime()
					
					// compute vals
					for (var j = 0, len = p.colModel.length; j < len; j++) {
						pthMap[j] = $('tr:last th:eq(' + j + ')', g.hDiv)
								.get(0)
						cm = p.colModel[j]
						dataIndex[j] = cm.name.split(';')
						dataRenderer = cm.dataRender
						clsRenderer = cm.clsRender
						for (var i = 0, rLen = data.items.length; i < rLen; i++) {
							rowData = data.items[i]
							tdVal = []
							for (var k = 0, idxLen = dataIndex[j].length; k < idxLen; k++) {
								tdVal.push(rowData[dataIndex[j][k]])
							}

							idx = i * len + j

							if ($.jRenderer
									&& typeof dataRenderer != 'undefined'
									&& $.jRenderer[dataRenderer]) {

								cacheDataKey = dataRenderer + '-' + tdVal

								if (cacheVal = p.rendererCache[cacheDataKey])
									tdDataMap[idx] = cacheVal
								else {
									cacheVal = $.jRenderer[dataRenderer](tdVal)
									tdDataMap[idx] = cacheVal
									p.rendererCache[cacheDataKey] = cacheVal
								}
							} else {
								tdDataMap[idx] = tdVal
							}

							if ($.jRenderer
									&& typeof clsRenderer != 'undefined'
									&& $.jRenderer[clsRenderer]) {
								cacheClsKey = clsRenderer + '-' + tdVal
								if (cacheVal = p.rendererCache[clsRenderer])
									tdClsMap[idx] = cacheVal
								else {
									cacheVal = $.jRenderer[clsRenderer](tdVal)
									tdClsMap[idx] = cacheVal
									p.rendererCache[clsRenderer] = cacheVal
								}
							}
						}
					}
					console.log('544 for... ', new Date().getTime() - ss)
					// renderers
					$.each(data.items, function(i, row) {
						tr = document.createElement('tr');
						if (i % 2 && p.striped)
							tr.className = 'erow';
						tdEl = []
						// console.log(p.colModel)
						if (p.colModel) {
							for (var j = 0, len = p.colModel.length; j < len; j++) {
								// cell data renderer
								idx = i * len + j
								pth = pthMap[j]
								td = document.createElement('td'), tdDiv = document
										.createElement('div')

								tdDiv.style['text-align'] = p.colModel[j].align
								tdDiv.style['width'] = pth.firstChild.style.width
								if (pth.hidden) {
									td.style['display'] = 'none'
								}
								val = tdDataMap[idx]
								cls = tdClsMap[idx]
								typeof val != 'undefined'
										? tdDiv.innerHTML = val
										: tdDiv.innerHTML = '&nbsp;'

								if (typeof cls != 'undefined') {
									$(tdDiv).addClass(cls)
								}
								td.appendChild(tdDiv)// .removeAttr('width');
														// // wrap
								tdEl.push(td)
								/*tdEl.push(me.cellRender(pthMap[j],
										p.colModel[j].align, tdDataMap[idx],
										tdClsMap[idx]))*/
							}
						}
						// add checkbox
						if (p.checkbox) {
							cth = $('<th/>');
							cthch = $('<input type="checkbox"/>');
							objTr = $(tr);
							cthch.addClass("noborder").click(function() {
								if (this.checked) {
									$(this).parents('tr')
											.addClass('trSelected');
								} else {
									$(this).parents('tr')
											.removeClass('trSelected');
								}
								me.checkToolBarStat()
							})
							cthDiv = $('<div style="width:22px;"/>');
							cth.addClass("cth").append(cthDiv.append(cthch));

							$(tr).prepend(cth);
						}
						// add cell
						$('thead tr:last th', g.hDiv).each(function() {

									idx = $(this).attr('axis').substr(3);
									td = tdEl[idx];
									tr.appendChild(td);
									// console.log(idx, td.innerHTML)
									td = null;
								});

						if ($('thead', this.gDiv).length < 1) // handle
						// if
						// grid has no
						// headers
						{

							for (idx = 0; idx < cell.length; idx++) {
								td = tdEl[idx];
								tr.appendChild(td);
								td = null;
							}
						}
						// add record info
						$(tr).attr('row-id', row[p.rowId]);
						$(tr).attr('record', $.stringifyJSON(row));

						$(tbody).append(tr);
						tr = null;
					});

					console.log('614 cell... ', new Date().getTime() - ss)

				}

				// console.log('addData 514 ', new Date().getTime() - s + ' ms')

				$('tr', t).unbind();
				$(t).empty();
				$(t).append(tbody);
				// this.addCellProp();
				this.addRowProp()
				this.rePosDrag()
				tbody = null;
				data = null;
				i = null;
				if (p.onSuccess) {
					p.onSuccess(this);
				}
				if (p.hideOnSubmit) {
					$(g.block).remove();
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if ($.browser.opera) {
					$(t).css('visibility', 'visible');
				}
				console.log('addData 545 ', new Date().getTime() - p.startTime
								+ ' ms')
				this.buildPager();
				setTimeout(function() {
							$('tbody tr td', g.bDiv).each(function() {
										g.addTitleToCell($(this))
									})
						}, 200)
				// console.log('addData ', new Date().getTime() - s + ' ms')
			},
			changeSort : function(th) { // change sortorder
				if (this.loading) {
					return true;
				}
				$(g.nDiv).hide();
				$(g.nBtn).hide();
				if (p.sortname == $(th).attr('abbr')) {
					if (p.sortorder == 'asc') {
						p.sortorder = 'desc';
					} else {
						p.sortorder = 'asc';
					}
				}
				$(th).addClass('sorted').siblings().removeClass('sorted');
				$('tr:last .sdesc', this.hDiv).removeClass('sdesc');
				$('tr:last .sasc', this.hDiv).removeClass('sasc');
				$('div', th).addClass('s' + p.sortorder);
				p.sortname = $(th).attr('abbr');
				if (p.onChangeSort) {
					p.onChangeSort(p.sortname, p.sortorder);
				} else {
					this.populate();
				}
			},
			buildPager : function() { // rebuild pager based on new properties
				var curPage = p.page, totalPage = p.pages, leftPos = 1, rightPos = 1, pageHtml = '', numberArr = [], pageCount = (totalPage > p.showPageNumbers)
						? p.showPageNumbers
						: totalPage, next = parseInt(p.showPageNumbers / 2), prev = (pageCount
						% 2 === 0 ? next - 1 : next), me = this
				if (prev < curPage) {
					leftPos = curPage - prev
				}
				if (curPage <= totalPage - next) {
					rightPos = curPage + next
				} else {
					rightPos = totalPage
				}

				if (rightPos - leftPos + 1 < pageCount) {
					while (leftPos > 1 && rightPos - leftPos + 1 < pageCount)
						leftPos--
					while (rightPos < pageCount
							&& rightPos - leftPos + 1 < pageCount)
						rightPos++

				}
				var template = '<li><a href="#" page-index="{0}">{0}</a><li>', pageArr = []
				for (var i = leftPos; i <= rightPos; i++) {
					pageArr.push($.jString.format(template, i))
				}
				pageHtml = pageArr.join('')
				$('.pagination .page-numbers', this.pDiv).html(pageHtml)
				$('.pagination .page-numbers a[page-index=' + curPage + ']',
						this.pDiv).parent().addClass('active')

				console.log(prev, next, curPage, totalPage, leftPos, rightPos,
						pageCount/*, pageArr,
				pageHtml*/)

				var $clearPager = $('.grid-toolbar[grid-target=#' + p.id + ']')
						.find('.grid-result-pager')
				if (curPage > 1) {
					$('.pagination .prev-page', g.pDiv).removeClass('hidden')
					$('.prev-page', $clearPager).removeClass('disabled')
				} else {
					$('.pagination .prev-page', g.pDiv).addClass('hidden')
					$('.prev-page', $clearPager).addClass('disabled')
				}
				if (curPage === totalPage) {
					$('.pagination .next-page', g.pDiv).addClass('hidden')
					$('.next-page', $clearPager).addClass('disabled')
				} else {
					$('.pagination .next-page', g.pDiv).removeClass('hidden')
					$('.next-page', $clearPager).removeClass('disabled')
				}

				$('.pagination a', this.pDiv).off('click')
				$('.pagination .page-numbers a', this.pDiv).click(function() {
							if ($(this).parent().hasClass('active'))
								return
							var page = parseInt($(this).attr('page-index'))
							window.scrollTo(0)
							me.changePageNum(page)
							p.page = page
							console.log('change page', p.page)
						})

				$('.btn', $clearPager).off('click')
				$('.prev-page', $clearPager).click(function() {
							if ($(this).hasClass('disabled'))
								return
							me.changePageNum(p.page - 1)
							if (p.page > 1) {
								p.page -= 1
							}
							console.log('change page 647 ', p.page)
						})
				$('.next-page', $clearPager).click(function() {
							if ($(this).hasClass('disabled'))
								return
							me.changePageNum(p.page + 1)
							if (p.page < p.pages) {
								p.page += 1
							}
							console.log('change page 656', p.page)
						})
				$('.pagination .prev-page a', this.pDiv).click(function() {
							window.scrollTo(0)
							me.changePageNum(p.page - 1)
							if (p.page > 1) {
								p.page -= 1
							}
						})
				$('.pagination .next-page a', this.pDiv).click(function() {
							window.scrollTo(0)
							me.changePageNum(p.page + 1)
							if (p.page < p.pages) {
								p.page += 1
							}
						})

				// set result stat
				var r1 = (p.page - 1) * p.rp + 1;
				var r2 = r1 + p.rp - 1;
				if (p.total < r2) {
					r2 = p.total;
				}
				var stat = p.pagestat;
				stat = stat.replace(/{from}/, r1);
				stat = stat.replace(/{to}/, r2);
				stat = stat.replace(/{total}/, p.total);

				p.lastQueryTime = (new Date().getTime() - p.startTime)
				stat = stat.replace(/{time}/, p.lastQueryTime / 1000);
				$('.grid-toolbar[grid-target=#' + p.id + ']')
						.find('.grid-result-stat').html(stat)//
				$('.page-loading').hide()
			},
			populate : function() { // get latest data
				var me = this
				p.startTime = new Date().getTime()

				// p.allowPreview = false
				$('.page-loading').show()
				if (this.loading) {
					return true;
				}
				if (p.onSubmit) {
					var gh = p.onSubmit();
					if (!gh) {
						return false;
					}
				}
				this.loading = true;
				if (!p.url) {
					return false;
				}
				// $('.pPageStat', this.pDiv).html(p.procmsg);
				// $('.pReload', this.pDiv).addClass('loading');
				$(g.block).css({
							top : g.bDiv.offsetTop
						});
				if (p.hideOnSubmit) {
					$(this.gDiv).prepend(g.block);
				}
				if ($.browser.opera) {
					$(t).css('visibility', 'hidden');
				}
				if (!p.newp) {
					p.newp = 1;
				}
				if (p.page > p.pages) {
					p.page = p.pages;
				}
				var param = {
					page : p.newp, // page
					start : (p.newp - 1) * p.rp, // start
					limit : p.rp, // pageSize
					sort : p.sortname.indexOf(';') !== -1 ? p.sortname.slice(0,
							p.sortname.indexOf(';')) : p.sortname, // sort
					dir : p.sortorder, // dir
					query : p.query,
					qtype : p.qtype
				}
				if (p.params) {
					for (var i in p.params) {
						param[i] = p.params[i]
					}
				}

				$.ajax({
							type : p.method,
							url : p.url,
							data : param,
							dataType : p.dataType,
							success : function(data) {
								setTimeout(function() {
											g.addData(data)
										}, 0);
								// console.log(p.rendererCache)
								me.checkToolBarStat()
								//$.jPopover.hideTrPopover()
								// p.allowPreview = true
								if (p.checkbox)
									$('input', g.hDiv)[0].checked = '';
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								try {
									if (p.onError)
										p.onError(XMLHttpRequest, textStatus,
												errorThrown);
								} catch (e) {
								}
							}
						});
			},
			changePageNum : function(pageNum) {
				if (this.loading) {
					return true;
				}
				p.newp = pageNum
				if (p.newp == p.page) {
					return false;
				}
				if (p.onChangePage) {
					p.onChangePage(p.newp);
				} else {
					this.populate();
				}
			},
			changePage : function(ctype) { // change page
				if (this.loading) {
					return true;
				}
				switch (ctype) {
					case 'first' :
						p.newp = 1;
						break;
					case 'prev' :
						if (p.page > 1) {
							p.newp = parseInt(p.page) - 1;
						}
						break;
					case 'next' :
						if (p.page < p.pages) {
							p.newp = parseInt(p.page) + 1;
						}
						break;
					case 'last' :
						p.newp = p.pages;
						break;
					case 'input' :
						var nv = parseInt($('.pcontrol input', this.pDiv).val());
						if (isNaN(nv)) {
							nv = 1;
						}
						if (nv < 1) {
							nv = 1;
						} else if (nv > p.pages) {
							nv = p.pages;
						}
						$('.pcontrol input', this.pDiv).val(nv);
						p.newp = nv;
						break;
				}
				if (p.newp == p.page) {
					return false;
				}
				if (p.onChangePage) {
					p.onChangePage(p.newp);
				} else {
					this.populate();
				}
			},
			addCellProp : function() {

				$('tbody tr td', g.bDiv).each(function() {
							var tdDiv = document.createElement('div');
							var n = $('td', $(this).parent()).index(this);
							// console.log(655,n,p.colModel)
							var pth = $('tr:last th:eq(' + n + ')', g.hDiv)
									.get(0);
							if (pth != null) {
								if (p.sortname == $(pth).attr('abbr')
										&& p.sortname) {
									$(this).addClass('sorted')
								}
								$(tdDiv).css({
											textAlign : p.colModel[n].align,// pth.align,
											width : $('div:first', pth)[0].style.width
										});

								if (pth.hidden) {
									$(this).css('display', 'none');
								}
							}
							if (p.nowrap == false) {
								$(tdDiv).css('white-space', 'normal');
							}
							if (this.innerHTML == '') {
								this.innerHTML = '&nbsp;';
							}
							// console.log(this)
							tdDiv.innerHTML = this.innerHTML;
							var prnt = $(this).parent()[0];
							var pid = false;
							if (prnt.id) {
								pid = prnt.id.substr(3);
							}
							if (pth != null) {
								if (pth.process)
									pth.process(tdDiv, pid);
							}
							$(this).empty().append(tdDiv).removeAttr('width'); // wrap
							// content
							g.addTitleToCell(tdDiv);
						});
			},
			getCellDim : function(obj) {// get cell prop for editable event
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {
					ht : ht,
					wt : wt,
					top : top,
					left : left,
					pdl : pdl,
					pdt : pdt,
					pht : pht,
					pwt : pwt
				};
			},
			addRowProp : function() {
				var me = this
				var s = new Date().getTime()
				$('tbody tr', g.bDiv).each(function() {
					var $td, $link, $div, $thead = $('thead tr:last', me.hDiv), $tr = $(this)
					$('td:nth(1) a', $tr).hover(function() {
						if (!p.allowPreview)
							return

						if ($.jPopover) {
							$td = $(this).parents('td'), $div = $('div', $td), $link = $(
									'a', $td)
							if ($link.width() > $div.width()) {
								$link = $div
							}
							$.jTimer.addTimer($link, function() {
										$.jPopover.showTrPopover($link, $tr,
												$thead)
									}, 200)
						}

					}, function() {
						
						if (!p.allowPreview)
							return

						if ($.jPopover) {
							$td = $(this).parents('td'), $div = $('div', $td), $link = $(
									'a', $td)
							if ($link.width() > $div.width()) {
								$link = $div
							}
							$.jTimer.removeTimer($link)
						}
						
						//$.jPopover.hideTrPopover()
					})

					$(this).click(function(e) {
								var obj = (e.target || e.srcElement);
								if (obj.href || obj.type)
									return true;
								$(this).toggleClass('trSelected');

								// add checkbox
								if (p.checkbox) {
									if ($(this).hasClass('trSelected')) {
										$(this).find('input')[0].checked = true;
									} else {
										$(this).find('input')[0].checked = false
									}
								}
								if (p.singleSelect && !g.multisel) {
									$(this).siblings()
											.removeClass('trSelected');
									$(this).toggleClass('trSelected');
								}
								me.checkToolBarStat()
							}).mousedown(function(e) {
								if (e.shiftKey) {
									$(this).toggleClass('trSelected');
									g.multisel = true;
									this.focus();
									$(g.gDiv).noSelect();
									me.checkToolBarStat()
								}
								if (e.ctrlKey) {
									$(this).toggleClass('trSelected');
									g.multisel = true;
									this.focus();
									me.checkToolBarStat()
								}
							}).mouseup(function() {
								if (g.multisel && !e.ctrlKey) {
									g.multisel = false;
									$(g.gDiv).noSelect(false);
									me.checkToolBarStat()
								}
							}).hover(function(e) {
								/*var $tr = $(this)
								if ($.jPopover && p.allowPreview) {
									var $link = $('td:nth(1) a', $tr), $thead = $(
											'thead tr:last', me.hDiv)
									if ($link.width() > $('td:nth(1) div', $tr).width()) {
										$link = $('td:nth(1) div', $tr)
									}
									$.jTimer.addTimer($link, function() {
												$.jPopover.showTrPopover($link, $tr,
														$thead)
											}, 580)
								}*/
								// console.log($(this), 'show pop')
								if (g.multisel && e.shiftKey) {
									$(this).toggleClass('trSelected');
									me.checkToolBarStat()
								}
							}, function() {

								/*if ($.jPopover && p.allowPreview) {
									var $link = $('td:nth(1) a', $(this))

									if ($link.width() > $('td:nth(1) div', $(this))
											.width()) {
										$link = $('td:nth(1) div', $(this))
									}
									$.jTimer.removeTimer($link)
									// $.jPopover.hideTrPopover()
								}*/
								// console.log('hide pop')
							})

					if ($.browser.msie && $.browser.version < 7.0) {
						$(this).hover(function() {
									$(this).addClass('trOver');
								}, function() {
									$(this).removeClass('trOver');
								});
					}
				});

				console.log('add Row: ', new Date().getTime() - s)

			},

			combo_flag : true,
			combo_resetIndex : function(selObj) {
				if (this.combo_flag) {
					selObj.selectedIndex = 0;
				}
				this.combo_flag = true;
			},
			combo_doSelectAction : function(selObj) {
				eval(selObj.options[selObj.selectedIndex].value);
				selObj.selectedIndex = 0;
				this.combo_flag = false;
			},
			// Add title attribute to div if cell contents is truncated
			addTitleToCell : function(tdDiv) {

				// var s = new Date().getTime()
				if (p.addTitleToCell) {
					$div = (tdDiv instanceof jQuery) ? tdDiv : $(tdDiv)
					if ($('a', $div).hasClass('cmd'))
						return

					var txt = $div.text()
					if (txt.length > 6)
						$div.attr('title', txt)
					/*
					var $span = $('<span />').css('display', 'none'), $div = (tdDiv instanceof jQuery)
							? tdDiv
							: $(tdDiv), div_w = $div.outerWidth(), span_w = 0;

					$('body').children(':first').before($span);
					$span.html($div.html());
					
					console.log('940 addTitle ',new Date().getTime()-s+' ms')
					$span.css('font-size', '' + $div.css('font-size'));
					$span.css('padding-left', '' + $div.css('padding-left'));
					span_w = $span.innerWidth();
					$span.remove();

					if (span_w > div_w) {
						$div.attr('title', $div.text());
					} else {
						$div.removeAttr('title');
					}*/
					// console.log('948 addTitle ',new Date().getTime()-s+' ms')
				}
			},

			autoResizeColumn : function(obj) {
				if (!p.dblClickResize) {
					return;
				}
				var n = $('div', this.cDrag).index(obj), $th = $(
						'tr:last th:visible div:eq(' + n + ')', this.hDiv), ol = parseInt(obj.style.left), ow = $th
						.width(), nw = 0, nl = 0, $span = $('<span />');
				$('body').children(':first').before($span);
				$span.html($th.html());
				$span.css('font-size', '' + $th.css('font-size'));
				$span.css('padding-left', '' + $th.css('padding-left'));
				$span.css('padding-right', '' + $th.css('padding-right'));
				nw = $span.width();
				$('tr', this.bDiv).each(function() {
					var $tdDiv = $('td:visible div:eq(' + n + ')', this), spanW = 0;
					$span.html($tdDiv.html());
					$span.css('font-size', '' + $tdDiv.css('font-size'));
					$span.css('padding-left', '' + $tdDiv.css('padding-left'));
					$span
							.css('padding-right', ''
											+ $tdDiv.css('padding-right'));
					spanW = $span.width();
					nw = (spanW > nw) ? spanW : nw;
				});
				$span.remove();
				nw = (p.minWidth > nw) ? p.minWidth : nw;
				nl = ol + (nw - ow);
				$('div:eq(' + n + ')', this.cDrag).css('left', nl);
				this.colresize = {
					nw : nw,
					n : n
				};
				g.dragEnd();
			},
			pager : 0
		};
		if (p.colModel) { // create model if any
			thead = document.createElement('thead');

			// create group header if any
			if (p.groupHeader) {
				var tr = document.createElement('tr');
				if (p.checkbox) {
					$(tr).append('<th>&nbsp;</th>')
				}
				for (var i = 0; i < p.groupHeader.length; i++) {
					var cm = p.groupHeader[i];
					var th = document.createElement('th');
					if (cm) {
						if (cm.display != undefined) {
							th.innerHTML = cm.display;
						}
						if (cm.colspan) {
							$(th).attr('colspan', cm.colspan);
						}
						// th.align = 'center'
					} else {
						th.innerHTML = "";
						$(th).attr('width', 30);
					}
					$(tr).append(th)
				}
				$(thead).append(tr);
			}

			var tr = document.createElement('tr');
			for (var i = 0; i < p.colModel.length; i++) {
				var cm = p.colModel[i];
				var th = document.createElement('th');
				$(th).attr('axis', 'col' + i);
				if (cm) { // only use cm if its defined
					/*var cookie_width = 'flexiwidths/'+cm.name;		// Re-Store the widths in the cookies
					if( $.cookie(cookie_width) != undefined ) {
						cm.width = $.cookie(cookie_width);
					}*/
					if (typeof cm.display != 'undefined') {
						th.innerHTML = cm.display
					}
					if (cm.name && cm.sortable) {
						$(th).append('<span></span>')
						$(th).attr('abbr', cm.name)
					}
					if (cm.align) {
						$(th).css({
							'text-align' : cm.align.indexOf('right') >= 0
									? 'center'
									: cm.align
						})
					}
					if (cm.width) {
						$(th).attr('width', cm.width);
					}
					if (cm.hidden) {
						th.hidden = true;
					}
					if (cm.process) {
						th.process = cm.process;
					}
				} else {
					th.innerHTML = "&nbsp;"
					$(th).attr('width', 30);
				}
				$(tr).append(th);
			}
			$(thead).append(tr);
			// console.log($(tr))
			$(t).prepend(thead);
		} // end if p.colmodel
		// init divs
		g.gDiv = document.createElement('div'); // create global container
		g.mDiv = document.createElement('div'); // create title container
		g.hDiv = document.createElement('div'); // create header container
		g.bDiv = document.createElement('div'); // create body container
		g.vDiv = document.createElement('div'); // create grip
		g.rDiv = document.createElement('div'); // create horizontal resizer
		g.cDrag = document.createElement('div'); // create column drag
		g.block = document.createElement('div'); // creat blocker
		g.nDiv = document.createElement('div'); // create column show/hide popup
		g.nBtn = document.createElement('div'); // create column show/hide
		// button
		g.iDiv = document.createElement('div'); // create editable layer
		g.tDiv = document.createElement('div'); // create toolbar
		g.sDiv = document.createElement('div');
		g.pDiv = document.createElement('div'); // create pager container
		if (!p.usepager) {
			g.pDiv.style.display = 'none';
		}
		g.hTable = document.createElement('table');
		g.gDiv.className = 'flexigrid';
		g.gDiv.id = 'flexigrid-' + p.id;
		if (p.width != 'auto') {
			$(g.gDiv).width(p.width)
		}
		// add conditional classes
		if ($.browser.msie) {
			$(g.gDiv).addClass('ie');
		}
		if (p.novstripe) {
			$(g.gDiv).addClass('novstripe');
		}
		$(t).before(g.gDiv);
		$(g.gDiv).append(t);

		// set toolbar
		if (p.toolbar) {
			g.tDiv.className = 'tDiv';
			// console.log(p.toolbar)
			/*var tDiv2 = document.createElement('div');
			tDiv2.className = 'tDiv2';
			for (var i = 0; i < p.buttons.length; i++) {
				var btn = p.buttons[i];
				if (!btn.separator) {
					//$(tDiv2).append(btn)
					var btnDiv = document.createElement('div');
					btnDiv.className = 'fbutton';
					$(btnDiv).append(btn)
					$(tDiv2).append(btnDiv)
					var btnDiv = document.createElement('div');
					btnDiv.className = 'fbutton';
					btnDiv.innerHTML = ("<div><span>")
							+ (btn.hidename ? "&nbsp;" : btn.name)
							+ ("</span></div>");
					if (btn.bclass)
						$('span', btnDiv).addClass(btn.bclass).css({
									paddingLeft : 20
								});
					if (btn.bimage) // if bimage defined, use its string as an
						// image url for this buttons style (RS)
						$('span', btnDiv)
								.css(
										'background',
										'url(' + btn.bimage
												+ ') no-repeat center left');
					$('span', btnDiv).css('paddingLeft', 20);

					if (btn.tooltip) // add title if exists (RS)
						$('span', btnDiv)[0].title = btn.tooltip;

					btnDiv.onpress = btn.onpress;
					btnDiv.name = btn.name;
					if (btn.id) {
						btnDiv.id = btn.id;
					}
					if (btn.onpress) {
						$(btnDiv).click(function() {
									this.onpress(this.id || this.name, g.gDiv);
								});
					}
					$(tDiv2).append(btnDiv);
					if ($.browser.msie && $.browser.version < 7.0) {
						$(btnDiv).hover(function() {
									$(this).addClass('fbOver');
								}, function() {
									$(this).removeClass('fbOver');
								});
					}
				} else {
					$(tDiv2).append("<div class='btnseparator'></div>");
				}
			}*/
			$(g.tDiv).append(p.toolbar);
			$(g.tDiv).append("<div style='clear:both'></div>");
			$(g.gDiv).prepend(g.tDiv);
		}
		g.hDiv.className = 'hDiv';

		/*// Define a combo button set with custom action'ed calls when clicked.
		if (p.combobuttons && $(g.tDiv2)) {
			var btnDiv = document.createElement('div');
			btnDiv.className = 'fbutton';

			var tSelect = document.createElement('select');
			$(tSelect).change(function() {
						g.combo_doSelectAction(tSelect)
					});
			$(tSelect).click(function() {
						g.combo_resetIndex(tSelect)
					});
			tSelect.className = 'cselect';
			$(btnDiv).append(tSelect);

			for (i = 0; i < p.combobuttons.length; i++) {
				var btn = p.combobuttons[i];
				if (!btn.separator) {
					var btnOpt = document.createElement('option');
					btnOpt.innerHTML = btn.name;

					if (btn.bclass)
						$(btnOpt).addClass(btn.bclass).css({
									paddingLeft : 20
								});
					if (btn.bimage) // if bimage defined, use its string as an
						// image url for this buttons style (RS)
						$(btnOpt)
								.css(
										'background',
										'url(' + btn.bimage
												+ ') no-repeat center left');
					$(btnOpt).css('paddingLeft', 20);

					if (btn.tooltip) // add title if exists (RS)
						$(btnOpt)[0].title = btn.tooltip;

					if (btn.onpress) {
						btnOpt.value = btn.onpress;
					}
					$(tSelect).append(btnOpt);
				}
			}
			$('.tDiv2').append(btnDiv);
		}*/

		$(t).before(g.hDiv);
		g.hTable.cellPadding = 0;
		g.hTable.cellSpacing = 0;
		$(g.hDiv).append('<div class="hDivBox"></div>');
		$('div', g.hDiv).append(g.hTable);
		var thead = $("thead:first", t).get(0);
		// console.log($(thead))
		if (thead)
			$(g.hTable).append(thead);
		thead = null;
		if (!p.colmodel)
			var ci = 0;
		$('thead tr:last th', g.hDiv).each(function() {
			var thdiv = document.createElement('div');
			if ($(this).attr('abbr')) {
				$(this).click(function(e) {
							if (!$(this).hasClass('thOver'))
								return false;
							var obj = (e.target || e.srcElement);
							if (obj.href || obj.type)
								return true;
							g.changeSort(this);
						});
				if ($(this).attr('abbr') == p.sortname) {
					this.className = 'sorted';
					thdiv.className = 's' + p.sortorder;
				}
			}
			if (this.hidden) {
				$(this).hide();
			}
			if (!p.colmodel) {
				$(this).attr('axis', 'col' + ci++);
			}
			$(thdiv).css({
						textAlign : this.align,
						width : this.width + 'px'
					});
			thdiv.innerHTML = this.innerHTML;

			$(this).empty().append(thdiv).removeAttr('width').mousedown(
					function(e) {
						g.dragStart('colMove', e, this);
					}).hover(function() {
				if (!g.colresize && !$(this).hasClass('thMove') && !g.colCopy) {
					$(this).addClass('thOver');
				}
				if ($(this).attr('abbr') != p.sortname && !g.colCopy
						&& !g.colresize && $(this).attr('abbr')) {
					$('div', this).addClass('s' + p.sortorder);
				} else if ($(this).attr('abbr') == p.sortname && !g.colCopy
						&& !g.colresize && $(this).attr('abbr')) {
					var no = (p.sortorder == 'asc') ? 'desc' : 'asc';
					$('div', this).removeClass('s' + p.sortorder).addClass('s'
							+ no);
				}
				if (g.colCopy) {
					var n = $('tr:last th', g.hDiv).index(this);
					if (n == g.dcoln) {
						return false;
					}
					if (n < g.dcoln) {
						$(this).append(g.cdropleft);
					} else {
						$(this).append(g.cdropright);
					}
					g.dcolt = n;
				} else if (!g.colresize) {
					var nv = $('tr:last th:visible', g.hDiv).index(this);
					var onl = parseInt($('div:eq(' + nv + ')', g.cDrag)
							.css('left'));
					var nw = jQuery(g.nBtn).outerWidth();
					var nl = onl - nw + Math.floor(p.cgwidth / 2);
					$(g.nBtn).hide();
					if (p.groupHeader == false)
						$(g.nBtn).css({
							left : (nl > $(g.hDiv).width()
									? $(g.hDiv).width()
									: nl)
									+ 'px',
							top : g.hDiv.offsetTop
						}).show();
					var ndw = parseInt($(g.nDiv).width());
					$(g.nDiv).css({
								top : g.bDiv.offsetTop
							});
					if ((nl + ndw) > $(g.gDiv).width()) {
						$(g.nDiv).css('left', onl - ndw + 1);
					} else {
						$(g.nDiv).css('left', nl);
					}
					if ($(this).hasClass('sorted')) {
						$(g.nBtn).addClass('srtd');
					} else {
						$(g.nBtn).removeClass('srtd');
					}
				}
			}, function() {
				$(this).removeClass('thOver');
				if ($(this).attr('abbr') != p.sortname) {
					$('div', this).removeClass('s' + p.sortorder);
				} else if ($(this).attr('abbr') == p.sortname) {
					var no = (p.sortorder == 'asc') ? 'desc' : 'asc';
					$('div', this).addClass('s' + p.sortorder).removeClass('s'
							+ no);
				}
				if (g.colCopy) {
					$(g.cdropleft).remove();
					$(g.cdropright).remove();
					g.dcolt = null;
				}
			}); // wrap content
		});
		// set bDiv
		g.bDiv.className = 'bDiv j-scrollbar';
		$(t).before(g.bDiv);
		$(g.bDiv).css({
					height : (p.height == 'auto') ? 'auto' : p.height + "px"
				}).scroll(function(e) {
					g.scroll()
				}).append(t);
		if (p.height == 'auto') {
			$('table', g.bDiv).addClass('autoht');
		}
		// add td & row properties
		// g.addCellProp();
		// g.addRowProp();

		// set cDrag
		var cdcol = $('thead tr:last th:first', g.hDiv).get(0);
		if (cdcol != null) {
			g.cDrag.className = 'cDrag';
			g.cdpad = 0;
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth')))
					? 0
					: parseInt($('div', cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth')))
					? 0
					: parseInt($('div', cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft')))
					? 0
					: parseInt($('div', cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight')))
					? 0
					: parseInt($('div', cdcol).css('paddingRight')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth')))
					? 0
					: parseInt($(cdcol).css('borderLeftWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth')))
					? 0
					: parseInt($(cdcol).css('borderRightWidth')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft')))
					? 0
					: parseInt($(cdcol).css('paddingLeft')));
			g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight')))
					? 0
					: parseInt($(cdcol).css('paddingRight')));
			$(g.bDiv).before(g.cDrag);
			var cdheight = $(g.bDiv).height();
			var hdheight = $(g.hDiv).height();
			$(g.cDrag).css({
						top : -hdheight + 'px'
					});
			$('thead tr:last th', g.hDiv).each(function() {
						var cgDiv = document.createElement('div');
						$(g.cDrag).append(cgDiv);
						if (!p.cgwidth) {
							p.cgwidth = $(cgDiv).width();
						}
						$(cgDiv).css({
									height : cdheight + hdheight
								}).mousedown(function(e) {
									g.dragStart('colresize', e, this);
								}).dblclick(function(e) {
									g.autoResizeColumn(this);
								});
						if ($.browser.msie && $.browser.version < 7.0) {
							g.fixHeight($(g.gDiv).height());
							$(cgDiv).hover(function() {
										g.fixHeight();
										$(this).addClass('dragging')
									}, function() {
										if (!g.colresize)
											$(this).removeClass('dragging')
									});
						}
					});
		}
		// add strip
		if (p.striped) {
			$('tbody tr:odd', g.bDiv).addClass('erow');
		}
		if (p.resizable && p.height != 'auto') {
			g.vDiv.className = 'vGrip';
			$(g.vDiv).mousedown(function(e) {
						g.dragStart('vresize', e)
					}).html('<span></span>');
			$(g.bDiv).after(g.vDiv);
		}
		if (p.resizable && p.width != 'auto' && !p.nohresize) {
			g.rDiv.className = 'hGrip';
			$(g.rDiv).mousedown(function(e) {
						g.dragStart('vresize', e, true);
					}).html('<span></span>').css('height', $(g.gDiv).height());
			if ($.browser.msie && $.browser.version < 7.0) {
				$(g.rDiv).hover(function() {
							$(this).addClass('hgOver');
						}, function() {
							$(this).removeClass('hgOver');
						});
			}
			$(g.gDiv).append(g.rDiv);
		}
		// add pager
		if (p.usepager) {

			g.pDiv.className = 'pDiv';
			g.pDiv.innerHTML = '<div class="pagination hidden"></div><div class="pDiv2"></div>';
			var paginationHtml = '<ul class="prev-page hidden"><li><a href="#">上一页</a></li></ul>&nbsp;&nbsp;&nbsp;'
					+ '<ul class="page-numbers"></ul>'
					+ '&nbsp;&nbsp;&nbsp;<ul class="next-page"><li><a href="#">下一页</a></li></ul>'

			$(g.bDiv).after(g.pDiv)

			$('.pagination', g.pDiv).html(paginationHtml)

			/*var html = ' <div class="pGroup"> <div class="pFirst pButton"><span></span></div><div class="pPrev pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">'
					+ p.pagetext
					+ ' <input type="text" size="4" value="1" /> '
					+ p.outof
					+ ' <span> 1 </span>  页 </span></div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pNext pButton"><span></span></div><div class="pLast pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pReload pButton"><span></span></div> </div> <div class="btnseparator"></div> ';
			$('.pDiv2', g.pDiv).html(html);
			$('.pReload', g.pDiv).click(function() {
						g.populate()
					});
			$('.pFirst', g.pDiv).click(function() {
						g.changePage('first')
					});
			$('.pPrev', g.pDiv).click(function() {
						g.changePage('prev')
					});
			$('.pNext', g.pDiv).click(function() {
						g.changePage('next')
					});
			$('.pLast', g.pDiv).click(function() {
						g.changePage('last')
					});
			$('.pcontrol input', g.pDiv).keydown(function(e) {
						if (e.keyCode == 13)
							g.changePage('input')
					});
			if ($.browser.msie && $.browser.version < 7)
				$('.pButton', g.pDiv).hover(function() {
							$(this).addClass('pBtnOver');
						}, function() {
							$(this).removeClass('pBtnOver');
						});
			if (p.useRp) {
				var opt = '', sel = '';
				for (var nx = 0; nx < p.rpOptions.length; nx++) {
					if (p.rp == p.rpOptions[nx])
						sel = 'selected="selected"';
					else
						sel = '';
					opt += "<option value='" + p.rpOptions[nx] + "' " + sel
							+ " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
				}
				$('.pDiv2', g.pDiv)
						.prepend("<div class='pGroup'><select name='rp' class='page-select'>"
								+ opt
								+ "</select></div> <div class='btnseparator'></div>");
				$('select', g.pDiv).change(function() {
							if (p.onRpChange) {
								p.onRpChange(+this.value);
							} else {
								p.newp = 1;
								p.rp = +this.value;
								g.populate();
							}
						});
			}*/
		}
		// $(g.pDiv, g.sDiv)
		$(g.pDiv)
				.append("<div class='pGroup' style='float:right;display:none;'><span class='pPageStat'></span></div><div style='clear:both'></div>");
		// add title
		if (p.title) {
			g.mDiv.className = 'mDiv';
			g.mDiv.innerHTML = '<div class="ftitle">' + p.title + '</div>';
			$(g.gDiv).prepend(g.mDiv);
			if (p.showTableToggleBtn) {
				$(g.mDiv)
						.append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
				$('div.ptogtitle', g.mDiv).click(function() {
							$(g.gDiv).toggleClass('hideBody');
							$(this).toggleClass('vsble');
						});
			}
		}
		// setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';
		// add block
		g.block.className = 'gBlock';
		var gh = $(g.bDiv).height();
		var gtop = g.bDiv.offsetTop;
		$(g.block).css({
					width : g.bDiv.style.width,
					height : gh,
					background : 'white',
					position : 'relative',
					marginBottom : (gh * -1),
					zIndex : 1,
					top : gtop,
					left : '0px'
				});
		$(g.block).fadeTo(0, p.blockOpacity);
		// add column control
		if ($('tr:last th', g.hDiv).length) {

			// add checkbox
			if (p.checkbox) {
				$('tr:last', g.hDiv).each(function() {
					var cth = $('<td align="center"/>');
					var cthch = $('<input type="checkbox"/>');
					cthch.click(function() {
						if (this.checked) {
							$('tbody tr', g.bDiv).each(function() {
								$(this).addClass('trSelected').find('input')[0].checked = true;
							})
						} else {

							$('tbody tr', g.bDiv).each(function() {
								$(this).removeClass('trSelected').find('input')[0].checked = false;
							})
						}
						g.checkToolBarStat()
					})
					var cthDiv = $('<div style="width:22px;"/>');
					cth.addClass("cth").append(cthDiv.append(cthch));

					$(this).prepend(cth);
				})
			};
			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css({
						marginBottom : (gh * -1),
						display : 'none',
						top : gtop
					}).noSelect();
			var cn = 0;
			$('tr:last th div', g.hDiv).each(function() {
				var kcol = $("tr:last th[axis='col" + cn + "']", g.hDiv)[0];
				var chk = 'checked="checked"';
				if (kcol.style.display == 'none') {
					chk = '';
				}
				$('tbody', g.nDiv)
						.append('<tr><td class="ndcol1"><input type="checkbox" '
								+ chk
								+ ' class="togCol" value="'
								+ cn
								+ '" /></td><td class="ndcol2">'
								+ this.innerHTML + '</td></tr>');
				cn++;
			});
			if ($.browser.msie && $.browser.version < 7.0)
				$('tr', g.nDiv).hover(function() {
							$(this).addClass('ndcolover');
						}, function() {
							$(this).removeClass('ndcolover');
						});
			$('td.ndcol2', g.nDiv).click(function() {
				if ($('input:checked', g.nDiv).length <= p.minColToggle
						&& $(this).prev().find('input')[0].checked)
					return false;
				return g.toggleCol($(this).prev().find('input').val());
			});
			$('input.togCol', g.nDiv).click(function() {
				if ($('input:checked', g.nDiv).length < p.minColToggle
						&& this.checked == false)
					return false;
				$(this).parent().next().trigger('click');
			});
			$(g.gDiv).prepend(g.nDiv);
			$(g.nBtn).addClass('nBtn').html('<div></div>').attr('title',
					'显示/隐藏列').click(function() {
						$(g.nDiv).toggle();
						return true;
					});
			// position ajust
			if (p.groupHeader) {
				$(g.nBtn).css({
							marginTop : 25
						})
			}
			if (p.showToggleBtn) {
				$(g.gDiv).prepend(g.nBtn);
			}
		}
		// add date edit layer
		$(g.iDiv).addClass('iDiv').css({
					display : 'none'
				});
		$(g.bDiv).append(g.iDiv);
		// add flexigrid events
		$(g.bDiv).hover(function() {
					setTimeout(function() {
								$(g.nDiv).hide()
							}, 100)
					$(g.nBtn).hide();

				}, function() {
					// $.jPopover.hideTrPopover()
					if (g.multisel) {
						g.multisel = false;
					}
				});
		/*	$(g.gDiv).hover(function() {
					}, function() {
						console.log('1444');$(g.nDiv).hide();
						$(g.nBtn).hide();
					});*/
		// add document events
		$(document).mousemove(function(e) {
					g.dragMove(e)
				}).mouseup(function(e) {
					g.dragEnd()
				}).hover(function() {
				}, function() {
					g.dragEnd()
				});
		// browser adjustments
		if ($.browser.msie && $.browser.version < 7.0) {
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv', g.gDiv).css({
						width : '100%'
					});
			$(g.gDiv).addClass('ie6');
			if (p.width != 'auto') {
				$(g.gDiv).addClass('ie6fullwidthbug');
			}
		}
		g.rePosDrag();
		g.fixHeight();
		// make grid functions accessible
		t.p = p;
		t.grid = g;
		// load data
		if (p.url && p.autoload) {
			g.populate();
		}
		return t;
	};
	var docloaded = false;
	$(document).ready(function() {
				docloaded = true
			});
	$.fn.flexigrid = function(p) {
		return this.each(function() {
					if (!docloaded) {
						$(this).hide();
						var t = this;
						$(document).ready(function() {
									$.addFlex(t, p);
								});
					} else {
						$.addFlex(this, p);
					}
				});
	} // end flexigrid
	$.fn.flexReload = function(p) { // function to reload grid
		console.log('reload')
		return this.each(function() {
					if (this.grid && this.p.url)
						this.grid.populate();
				});
	} // end flexReload
	$.fn.flexOptions = function(p) { // function to update general options
		return this.each(function() {
					if (this.grid)
						$.extend(this.p, p);
				});
	} // end flexOptions
	$.fn.flexQuery = function(p) { // function to update query params
		return this.each(function() {
					if (this.grid)
						$.extend(this.p.params, p);
				});
	} // end flexOptions

	$.fn.flexToggleCol = function(cid, visible) { // function to reload grid
		return this.each(function() {
					if (this.grid)
						this.grid.toggleCol(cid, visible);
				});
	} // end flexToggleCol
	$.fn.flexAddData = function(data) { // function to add data to grid
		return this.each(function() {
					if (this.grid)
						this.grid.addData(data);
				});
	}

	$.fn.flexAllowPreview = function(trueOrFalse) { // function to add data to
		// grid
		return this.each(function() {
					if (this.grid)
						$.extend(this.p, {
									allowPreview : trueOrFalse
								})
				});
	}
	$.fn.noSelect = function(p) { // no select plugin by me :-)
		var prevent = (p == null) ? true : p;
		if (prevent) {
			return this.each(function() {
						if ($.browser.msie || $.browser.safari)
							$(this).bind('selectstart', function() {
										return false;
									});
						else if ($.browser.mozilla) {
							$(this).css('MozUserSelect', 'none');
							$('body').trigger('focus');
						} else if ($.browser.opera)
							$(this).bind('mousedown', function() {
										return false;
									});
						else
							$(this).attr('unselectable', 'on');
					});
		} else {
			return this.each(function() {
						if ($.browser.msie || $.browser.safari)
							$(this).unbind('selectstart');
						else if ($.browser.mozilla)
							$(this).css('MozUserSelect', 'inherit');
						else if ($.browser.opera)
							$(this).unbind('mousedown');
						else
							$(this).removeAttr('unselectable', 'on');
					});
		}
	}
})(jQuery)
