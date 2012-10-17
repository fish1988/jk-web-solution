/* ==========================================================
 *	jason-navbar.js
 * 
 *
 * ========================================================== */

!function($) {

	'use strict'; //

	// navbar
	$.jNavbar = {}

	$.jNavbar.getNavString = function(func) {
		var lines = new String(func)
		lines = lines.substring(lines.indexOf("/*") + 2, lines
						.lastIndexOf("*/"))
		return lines
	}

	// navbar template
	var navTemplateStringFunc = function() {
		/*<div class="container-fluid">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
				</a>
				<div class="btn-group pull-right">
					<a title="当前用户" class="btn dropdown-toggle" data-toggle="dropdown" href="#"> <i class="icon-user"></i> <span class="const-userName" style="width: 40px;">jasonkou</span> <span class="caret"></span>
					</a>
					<ul class="dropdown-menu">
						<li><a href="logout.html">注销登录</a></li>
					</ul>
				</div>
				<div class="nav-collapse">
					<ul class="nav">
						<li id="nav"><a href="nav.htm" style="padding-left: 5px;">首页</a></li>
						<li id="borrow"><a href="borrow.htm">借用申请</a></li>
						<li id="myproperty"><a href="myproperty.htm">个人资产</a></li>
						<li id="workflow"><a href="workflow.htm">流程管理</a></li>
						<li id="phone"><a href="phone.htm">手机入库</a></li>
						<li id="model"><a href="model.htm">机型库</a></li>
						<li id="dict" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">字典管理<b class="caret"></b></a>
							<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
								<li><a href="link.htm">系统网址</a></li>
								<li class="divider"></li>
								<li><a href="platform.htm">平台</a></li>
								<li><a href="software.htm">平台版本</a></li>
								<li><a href="resolution.htm">分辨率</a></li>
								<li class="divider"></li>
								<li><a href="brand.htm">品牌</a></li>
								<li><a href="network.htm">网络制式</a></li>
								<li class="divider"></li>
								<li><a href="usetype.htm">借用用途</a></li>
								<li><a href="ordertype.htm">申请类型</a></li>
								<li><a href="workflowstatus.htm">流程状态</a></li>
								<li><a href="workflowinfo.htm">工作流</a></li>
								<li class="divider"></li>
								<li><a href="booktype.htm">图书类别</a></li>
							</ul></li>
					</ul>
				</div>
			</div>*/
	}

	
				var $navTemplate = $($.jNavbar
						.getNavString(navTemplateStringFunc))

				$navTemplate.find('#'
						+ $('.global-nav .navbar-inner').attr('active'))
						.addClass('active')

				//console.log(62, $('.global-nav .navbar-inner').attr('active'))
				$('.global-nav .navbar-inner').append($navTemplate)
			

}(window.jQuery);
