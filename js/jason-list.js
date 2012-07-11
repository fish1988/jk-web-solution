/* ==========================================================
 *	jason-list.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* list grid reorder
	 * ============== */

	$(function() {

		$("#products").sortable();
		$("#products").disableSelection();
		$("a.switcher").bind("click", function(e) {
			e.preventDefault();

			var theid = $(this).attr("id");
			var theproducts = $("ul#products");
			var classNames = $(this).attr('class').split(' ');

			var listthumb = 'img/qq-mobile.png', gridthumb = "img/qq-mobile.png";

			if ($(this).hasClass("active")) {
				// if currently clicked button has the active class
				// then we do nothing!
				return false;
			} else {
				// otherwise we are clicking on the inactive button
				// and in the process of switching views!

				if (theid == "gridview") {
					$(this).addClass("active");
					$("#listview").removeClass("active");

					//$("#listview").children("img").attr("src","img/list-view.png");

					var theimg = $(this).children("img");
					//theimg.attr("src", "img/grid-view-active.png");

					// remove the list class and change to grid
					theproducts.removeClass("list");
					theproducts.addClass("grid");

					// update all thumbnails to larger size
					$("img.thumb").attr("src", gridthumb);
				}

				else if (theid == "listview") {
					$(this).addClass("active");
					$("#gridview").removeClass("active");

					$("#gridview").children("img").attr("src",
							"img/grid-view.png");

					var theimg = $(this).children("img");
					theimg.attr("src", "img/list-view-active.png");

					// remove the grid view and change to list
					theproducts.removeClass("grid")
					theproducts.addClass("list");
					// update all thumbnails to smaller size
					$("img.thumb").attr("src", listthumb);
				}
			}

		});
	})

}(window.jQuery)