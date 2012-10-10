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
					
					brand :'dropdown/brand.html?pid=',
					platform:'dropdown/platform.html?pid=',
					software:'dropdown/software.html?pid=',
					resolution:'dropdown/resolution.html?pid=',
					network:'dropdown/networkStandard.html?pid=',
					model:'dropdown/phoneModel.html?pid=',
					link:'dropdown/cdlink.html?pid=',
					workflow:'data/opstatus.json?pid='
				}
					
				$.jStore.getUrl = function(id){
					
					return $.jStore[id]
				}

	//		})

}(window.jQuery)
