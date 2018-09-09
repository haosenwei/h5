function initMainTable(name,url,columns){
	//对分页每页记录数设置
	var lengthMenuArray = [[10,  50, 100,200], [10,  50, 100,200]];
	
	table = $('#'+name).dataTable({
		bAutoWidth: false,
		searching:false, //关闭搜索
		//"scrollX": scrollTag,
		"dom": 'rt<"row"<"col-md-2 col-sm-12"i><"col-md-2 col-sm-12"l><"col-md-8 col-sm-12"p>>',
		"ordering": false,//关闭排序
		"aaSorting": [],
		"processing": true,
	    "serverSide": true,
		"ajax" : {
			"url":url,
            "type": "GET",
            "data": function ( d ) {
            	var content = $('#'+name+'_search_form').serializeJSON();
            	//重写参数，不需要排序等字段
            	var start = d.start;
            	var length = d.length;
            	delete d.columns;
            	delete d.search;
            	delete d.start;
            	d.offset = start;
            	return $.extend( {}, d, content);
            }
		},
		"columns" : columns,
		"language": {
            "lengthMenu": " _MENU_/页 ",
            "zeroRecords": "无",
            "info": "页数 _PAGE_ / _PAGES_  共 _TOTAL_ 条",
            "infoEmpty": "页数 0",
            "infoFiltered": "(过滤 _MAX_ 条数)",
            "paginate": {
                "first":      "首页",
                "last":       "末页",
                "next":       "下一页",
                "previous":   "上一页"
            },
            "loadingRecords": "加载...",
            "processing":     "处理...",
            "search":         "查找:"
        },

        "lengthMenu": lengthMenuArray
	});
	$('#'+name+' tbody').on('click', 'tr', function() {
		var v=$(this).find('input[type=checkbox]').get(0).checked;
		if(v){
			 $(this).find('input[type=checkbox]').get(0).checked = false;
		}else{
			 $(this).find('input[type=checkbox]').get(0).checked = true;
		}
		$(this).toggleClass('selected');
	});
	$('#'+name+' > thead > tr > td input[type=checkbox]').eq(0).on('click', function(){
		var th_checked = this.checked;//checkbox inside "TH" table header
	    $(this).closest('table').find('tbody > tr').each(function(){
			var row = this;
			var length = $(row).find("input[type=checkbox]").length;
			if(length == 0){
				return;
			}
			if(th_checked){
				var a = $(this).find('input[type=checkbox]');
				a.get(0).checked = true;
			}else{
				var a = $(this).find('input[type=checkbox]');
				a.get(0).checked = false;
			}
		});
	});
	var active_class = 'active';
	$('#'+name+' > thead > tr > td >div input[type=checkbox]').eq(0).on('click', function(){
		var th_checked = this.checked;//checkbox inside "TH" table header
	    $(this).closest('table').find('tbody > tr').each(function(){
			var row = this;
			if(th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
			else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
		});
	});
}
//提示
function showTips(msg,status){
	if(msg==undefined){
		msg = '执行成功';
	}
	if(status==undefined){
		status = 'info';
	}
	if(status=='info'){
		//成功消息提示，默认背景为浅绿色 
		toastr.info(msg);
		return;
	}
	if(status=='success'){
		toastr.success(msg);
		return;
	}
	if(status=='warning'){
		toastr.warning(msg);
		return;
	}
	if(status=='error'){
		toastr.error(msg);
		return;
	}
	toastr.info(msg); 
}
function formatDateTime(inputTime) {    
	var date = new Date(inputTime);  
	var y = date.getFullYear();    
	var m = date.getMonth() + 1;    
	m = m < 10 ? ('0' + m) : m;    
	var d = date.getDate();    
	d = d < 10 ? ('0' + d) : d;    
	var h = date.getHours();  
	h = h < 10 ? ('0' + h) : h;  
	var minute = date.getMinutes();  
	var second = date.getSeconds();  
	minute = minute < 10 ? ('0' + minute) : minute;    
	second = second < 10 ? ('0' + second) : second;   
	return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
};  

function aceAdd(title,toUrl,doUrl,name,refreshName){
	$.get(toUrl, function(data) {
		bootbox.dialog({
			title : title,
			message : data,
			size : "large",
			initEven : function() {
			},
			buttons : {
				success : {
					label : "确定",
					className : "btn-primary",
					callback: function () {  
						$('#'+name ).validate();
						if(!$('#'+name).valid()){
							return false;
						}
						var param=$('#'+name).serializeJSON();
						$.post(doUrl,param,function(result){
							showTips(result.message);
							if(refreshName != undefined && refreshName != ''){
								$('#'+refreshName).DataTable().ajax.reload();
							}
						}); 
					}  
				},
				cancel: {
			        label: "关闭",
			        className: '',
			        callback: function(){
			        }
			    }
			}
		});
	});
}
function aceDialog(title,toUrl,doUrl,name,refreshName){
	$.get(toUrl, function(data) {
		bootbox.dialog({
			title : title,
			message : data,
			size : "large",
			initEven : function() {
			},
			buttons : {
				success : {
					label : "确定",
					className : "btn-primary",
					callback: function () {  
						$('#'+name).validate();
						if(!$('#'+name).valid()){
							return false;
						}
						var param=$('#'+name).serializeJSON();
						$.post(doUrl,param,function(result){
							showTips(result.message);
							if(refreshName != undefined){
								$('#'+refreshName).DataTable().ajax.reload();
							}
						}); 
					}  
				},
				cancel: {
					label: "关闭",
					className: '',
					callback: function(){
					}
				}
			}
		});
	});
}
function getCheckBoxValues(name){
	var values=new Array()
	var i =0;
	$("#"+name).closest('table').find('tbody > tr').each(function(){
		var row = this;
		var length = $(row).find("input[type=checkbox]").length;
		if(length == 0){
			return;
		}
		var a = $(this).find('input[type=checkbox]');
		var b = a.get(0).checked ;
		if(b){
			values[i] = a.get(0).value;
			i++;
		}
	});
	return values;
}


function acePost(doUrl,param,title,refresh,name){
	if(title == undefined){
		title = '确定执行？';
	}
	bootbox.confirm({
		message: title,
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			if(result){
				if(param == undefined){
					param = '';
				}
				$.ajax({
					  type: 'POST',
					  url: doUrl,
					  data: param,
					  success: function(data){
						  showTips(data.message);
						  if(refresh!=undefined && refresh ==true){
							  $('#'+name).DataTable().ajax.reload();
						}
					  },
					  error: function(data){showTips(data.responseJSON.message,'error');}
				});
			}
		}
	});
}
function aceGet(doUrl,param,title,refresh,name){
	if(title == undefined){
		title = '确定执行？';
	}
	bootbox.confirm({
		message: title,
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			if(result){
				if(param == undefined){
					param = '';
				}
				$.ajax({
					url: doUrl,
					data: param,
					success: function(data){
						showTips(data.message);
						if(refresh!=undefined && refresh ==true){
							$('#'+name).DataTable().ajax.reload();
						}
					},
					error: function(data){showTips(data.responseJSON.message,'error');}
				});
			}
		}
	});
}
function aceDel(id,name,doUrl){
	acePost(doUrl,{ids:id},"确定删除？",true,name);
}
function aceDels(title,doUrl,name){
	var v =	getCheckBoxValues(name);
	if(v.length == 0){
		showTips("至少选择一条数据",'error');
		return false;
	}
	var ids = '';
	for(j = 0,len=v.length; j < len; j++) {
		if(j==len-1){
			ids=ids+v[j];
		}else{
			ids=ids+v[j]+',';
		}
	}
	acePost(doUrl,{ids:ids},title,true,name)
}
function aceDoPost(title,doUrl,name,length){
	var v =	getCheckBoxValues(name);
	if(v.length == 0){
		showTips("至少选择一条数据",'error');
		return false;
	}
	if(length!=undefined){
		if(v.length>length){
			showTips("选择数据不能超过"+length+"条数据",'error');
			return false;
		}
	}
	
	var ids = '';
	for(j = 0,len=v.length; j < len; j++) {
		if(j==len-1){
			ids=ids+v[j];
		}else{
			ids=ids+v[j]+',';
		}
	}
	acePost(doUrl,{ids:ids},title,false,name)
}
function aceEdit(id,title,toUrl,doUrl,name,refreshName) {
	$.post(toUrl,{"id":id}, function(data) {
		bootbox.dialog({
			title : title,
			message : data,
			size : "large",
			initEven : function() {
			},
			buttons : {
				success : {
					label : "确定",
					className : "btn-primary",
					callback: function () {  
						$('#'+name).validate();
						if(!$('#'+name).valid()){
							return false;
						}
						
						var param=$("#"+name+"_edit_form").serialize();
						$.ajax({
							url: doUrl,
							data: param,
							success: function(data){
								showTips(data.message);
								$('#'+name).DataTable().ajax.reload();
							},
							error: function(data){showTips(data.responseJSON.message,'error');}
						});
					}  
				},
				cancel: {
			        label: "关闭",
			        className: '',
			        callback: function(){
			        }
			    }
			}
		});
	});
}
//查看
function aceView(id,title,toUrl) {
	$.post(toUrl,{"id":id}, function(data) {
		bootbox.dialog({
			title : title,
			message : data,
			size : "large",
			initEven : function() {
			},
			buttons : {
				success : {
					label : "确定",
					className : "btn-primary"
				}
			}
		});
	});
}
//创建权限表格
function createCellAuth(td, cellData,rowData, row,col){
	var auth='<div class="hidden-sm hidden-xs action-buttons">'+
	'<a href="javascript:void(0);" class="tooltip-success" data-rel="tooltip" onclick="aceEditf('+cellData+')" title="修改" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a>'+
	'<a href="javascript:void(0);" class="tooltip-info" data-rel="tooltip" onclick="aceViewf('+cellData+')" title="查看" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a>'+
	'<a href="javascript:void(0);" class="tooltip-error" data-rel="tooltip" onclick="aceDelF('+cellData+')" title="删除" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a>'+
	'</div>'+
	'<div class="hidden-md hidden-lg"><div class="inline pos-rel">'+
	'<button class="btn btn-minier btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto" aria-expanded="false"><i class="ace-icon fa fa-cog icon-only bigger-110"></i></button>'+
	'<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'+
		'<li><a href="javascript:void(0);" class="tooltip-success" data-rel="tooltip" onclick="aceEditf('+cellData+')" title="修改" data-original-title="Edit"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a></li>'+
		'<li><a href="javascript:void(0);" class="tooltip-info" data-rel="tooltip" onclick="aceViewf('+cellData+')" title="查看" data-original-title="View"><span class="blue"><i class="ace-icon fa fa-search-plus bigger-120"></i></span></a></li></ul>'+
		'<li><a href="javascript:void(0);" class="tooltip-error" data-rel="tooltip" onclick="aceDelF('+cellData+')" title="删除" data-original-title="Delete"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a></li>'+
		'</div></div>';
	$(td).html(auth);
}


function createCheckCell(td, cellData,rowData, row,col){
	$(td).html('<label class="middle">'+
		'<input class="ace"  name="form-field-checkbox" value="'+cellData+'" type="checkbox">'+
		'<span class="lbl"></span>'+
	'</label>');
}