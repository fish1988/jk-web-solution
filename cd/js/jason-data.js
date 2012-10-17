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
					method : 'POST',
					data : {
						from : 'bootstrap'
					},
					dataType : 'json',
					complete:function(xhr,status){
						if(xhr.responseText == 'session_timeout'){
							location.href = 'login.html'
						}
					},
					error : function(request, status, error) {
						console.log('内部错误');
					}
				});
			// loading mask
		});

}(window.jQuery);