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
		console.log('tour', 17, tour)
		tour.addStep({
					path : "query.html",
					element : "#query-txt",
					placement : "left",
					title : "Setup in four easy steps",
					content : "Easy is better, right? Easy like Bootstrap.",
					options : {
						labels : {
							prev : "Go back",
							next : "Hey",
							end : "Stop"
						}
					}
				});
		tour.addStep({
			path : "query.html",
			element : ".form-query",
			placement : "right",
			title : "And it is powerful!",
			content : "There are more options for those, like us, who want to do "
					+ "complicated things. <br \/>Power to the people! :P",
			reflex : true
		});/*
		tour.addStep({
		path : "index.html",
		element : "#reflex-mode",
		placement : "bottom",
		title : "Reflex mode",
		content : "Reflex mode is enabled, click on the page heading to continue!",
		reflex : true
		});
		tour.addStep({
				path : "page.html",
				element : "h1",
				placement : "bottom",
				title : "See, you are not restricted to only one page",
				content : "Well, nothing to see here. Click next to go back "
						+ "to the index page."
			});
		tour.addStep({
				path : "index.html",
				element : "#contributing",
				placement : "right",
				title : "Best of all, it's free!",
				content : "Yeah! Free as in beer... or speech. Use and abuse, "
						+ "but don't forget to contribute!"
			});*/
		tour.start();
		console.log('do start', 65)

	});

}(window.jQuery);