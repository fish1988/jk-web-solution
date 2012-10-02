/* ==========================================================
 *	jason-tour.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/*
	 * dom utils ==============
	 */

	$(function() {
				var tour = new Tour();
				/*tour.addStep({
							path : 'nav.htm',
							element : '#nav-title',
							placement : 'right',
							title : '提示',
							content : '点击此处编辑/保存导航',
							options : {
								labels : {
									prev : '上一步',
									next : '下一步',
									end : '跳过帮助'
								}
							}
						})
				tour.addStep({
							path : 'nav.htm',
							element : '.navbar.nav-title:first .brand',
							placement : 'bottom',
							title : '提示',
							content : '点击此处编辑/保存分类'
						});*/

				/*
				tour.addStep({
				path : 'index.html',
				element : '#reflex-mode',
				placement : 'bottom',
				title : 'Reflex mode',
				content : 'Reflex mode is enabled, click on the page heading to continue!',
				reflex : true
				});
				tour.addStep({
					path : 'page.html',
					element : 'h1',
					placement : 'bottom',
					title : 'See, you are not restricted to only one page',
					content : 'Well, nothing to see here. Click next to go back '
							+ 'to the index page.'
				});
				tour.addStep({
					path : 'index.html',
					element : '#contributing',
					placement : 'right',
					title : 'Best of all, it's free!',
					content : 'Yeah! Free as in beer... or speech. Use and abuse, '
							+ 'but don't forget to contribute!'
				});*/
				tour.start();

			});

}(window.jQuery);