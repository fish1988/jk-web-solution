/* ==========================================================
 *	jason-store.js
 * 	map	for urls  attached with cache config
 *
 * ========================================================== */

!function($) {

	'use strict'

	/* Store
	 * ============== */

	//$(function() {
				
				$.jStore = {
					combo1 : 'data/data.txt?pid=',
					combo2 : 'data/data.txt?pid=',
					combo3 : 'data/data.txt?pid='
				}
					
				$.jStore.getUrl = function(id){
					
					return $.jStore[id]
				}

	//		})

}(window.jQuery)