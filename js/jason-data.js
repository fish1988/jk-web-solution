/* ==========================================================
 *	jason-data.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	/* data utils
	 * ============== */

	$(function() {
		// add-on data
		$.ajaxSetup({
					method : 'GET',
					data : {
						currentUser : 'jason',
						from : 'bootstrap',
						timeStamp: new Date().getTime()
					},
					dataType : 'json',
					error : function(request, status, error) {
						alert('内部错误');
					}
				});
			// loading mask
		});

}(window.jQuery);