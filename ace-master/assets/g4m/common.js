function getMenu(data){
	var menuHtml="<li class=\"\">"+
					"<a data-url=\"page/main\" href=\"#page/main\">"+
					"	<i class=\"menu-icon fa fa-tachometer\"></i>"+
					"	<span class=\"menu-text\"> 主页 </span>"+
					"</a>"+
					"<b class=\"arrow\"></b>"+
				"</li>";
	menuHtml+=getMenuIteration(data.pois,0);
	$(".nav-list").html(menuHtml);
	//return menuHtml;
}
function getMenuIteration(data, pid){
	var html="";
	/*
	<li class=\"\">
		<a href=\"#\" class=\"dropdown-toggle\">
			<i class=\"menu-icon fa fa-desktop\"></i>
			<span class=\"menu-text\">
				UI &amp; Elements
			</span>
	
			<b class=\"arrow fa fa-angle-down\"></b>
		</a>
	
		<b class=\"arrow\"></b>
		<ul class=\"submenu\">
			<li class=\"\">
				<a data-url=\"sys/table/main\" href=\"#sys/table/main\">
					<i class=\"menu-icon fa fa-caret-right\"></i>
					Elements
				</a>
	
				<b class=\"arrow\"></b>
			</li>
		</ul>
	</li>*/
	

	$.each(data, function(idx, obj ) {
		//判断是否是模块
		if(obj.typedic==1 && obj.pid == pid){
			//模块只加下拉
			html+="<li class=\"\">"+
			"<a href=\"#\" class=\"dropdown-toggle\">"+
				"<i class=\"menu-icon fa "+obj.icon+"\"></i>"+
				"<span class=\"menu-text\">"+
					obj.name+
				"</span>"+
				"<b class=\"arrow fa fa-angle-down\"></b>"+
			"</a>"+
			"<b class=\"arrow\"></b>"+
			"<ul class=\"submenu\">";
			html+=getMenuIteration(data,obj.id);
			html+="</ul>";
			html+="</li>";
		}
		//判断是否是菜单
		if(obj.typedic==2 && obj.pid == pid){
			//菜单添加地址
			html+="<li class=\"\">"+
					"<a data-url=\"page/"+obj.url+"\" href=\"#page/"+obj.url+"\">"+
					"<i class=\"menu-icon fa "+obj.icon+"\"></i>"+
					"<span class=\"menu-text\">"+obj.name+"</span>"+
					"</a>"+
				"</li>";
		}
	});
	return html;
}

/***



**/
function jsoupGetUtil(url,callback){
	url  = encodeURIComponent(url);
	$.ajax({ 
		type : "get",  
		async:false,  
		url: "http://8080.b.bangmc.vip/getjsoup",  
		dataType : "jsonp", 
		jsonp: "callback", 
		jsonpCallback: callback,//回调函数 
		contentType:"application/x-www-form-urlencoded; charset=UTF-8", 
		data:"url="+url, 
		success : function(json){}, 
		error : function(){} 
	}); 
}
function jsoupPostUtil(url,param ,callback){
	url  = encodeURIComponent(url);
	param  = encodeURIComponent(param);
	$.ajax({ 
		type : "post",  
		async:false,  
		url: "http://8080.b.bangmc.vip/postjsoup",  
		dataType : "jsonp", 
		jsonp: "callback", 
		jsonpCallback: callback,//回调函数 
		contentType:"application/x-www-form-urlencoded; charset=UTF-8", 
		data:"url="+url+"&param="+param, 
		success : function(json){}, 
		error : function(){} 
	}); 
}
