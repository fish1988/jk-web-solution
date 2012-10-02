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
					combo2 : 'data/data2.txt?pid=',
					combo3 : 'data/data.txt?pid=',
					
					brand :'data/brand.json?pid=',
					platform:'data/platform.json?pid=',
					software:'data/software.json?pid=',
					resolution:'data/resolution.json?pid=',
					network:'data/network.json?pid=',
					model:'data/modelselect.json?pid='
				}
					
				$.jStore.getUrl = function(id){
					
					return $.jStore[id]
				}

	//		})

}(window.jQuery)