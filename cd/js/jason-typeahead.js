/* ==========================================================
 *	jason-typeahead.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/*
	 * typeahead ==============
	 */
	$(function() {

			/*	// ajax typeahead
				$('.typeahead-user[data-provide="typeahead"]').typeahead({
							ajax : {
								url : 'data/user.json',
								triggerLength : 1,
								method:'get'
							},
							items : 4,
							selectItems : 1
						})*/

				// local typeahead
				$.getJSON('data/user.json', function(data) {
							$('.typeahead-user[data-provide="typeahead"]')
									.typeahead({
												source : data,
												items : 4,
												selectItems : 1
											})
						})

			})

}(window.jQuery);