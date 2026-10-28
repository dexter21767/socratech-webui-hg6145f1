var sessionidstr = "";
var mac_filter_data;
var addindex = '';

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/mac_filter", initPage);
	}
	else
	{
		XHR.get("get_mac_whitefilter_info", null, initPage);
	}
});

function initValidate()
{
	$("#mac_filter_list_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.mac_filter)
	{
		mac_filter_data = getdata.mac_filter;
		$("#maxnum").html(mac_filter_data.maxnum);
		setCheckbox("enable_checkbox", mac_filter_data.MACFEnable);
		//$("#mode_select").val("white");
		
		//mac list
		var dynamicHTML = '';
		addindex = '';
		for (var i=1; i<=mac_filter_data.maxnum; i++ )
		{
			var single = eval("mac_filter_data.white" + i);
			if ( single != '' && single != 'disable' && single != undefined )
			{
				dynamicHTML += '<tr>';
				dynamicHTML += '<td><span id="span_' + i + '" value="0">' + single.toUpperCase() + '</span></td>';
				dynamicHTML += '<td width="40%"><input type="button" class="input_button input_button_heightwidth_unset" id="delete_' + i + '" onclick="doDelete(this.id)" value="删除"></td>';
				dynamicHTML += '</tr>';
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		$("#mac_list").html(dynamicHTML);
	}
	$("#add_text").val('');
	displayControl();
}


function doDelete(eid)
{
	var index = eid.split('_')[1];
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.MACFMode = "white";
	postdata.index = index;
	postdata.sessionid = sessionidstr;
	XHR.post("set_mac_whitefilter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doAdd()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! extraValidCheck() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	var postdata = new Object();
	postdata.action = "add";
	postdata.MACFMode = "white";
	postdata.mac = $("#add_text").val().toUpperCase();
	postdata.index = addindex;
	postdata.sessionid = sessionidstr;
	XHR.post("set_mac_whitefilter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function extraValidCheck()
{
	var error_num = 0;
	if ( $("#add_text").val() == '' )
	{
		error_num ++;
		$("#add_text_error").html("必须填写");
	}
	else
	{
		if ( ! isValidMacAddress($("#add_text").val()) )
		{
			error_num ++;
			$("#add_text_error").html("MAC地址无效，格式为xx:xx:xx:xx:xx:xx");
		}
		for (var i=1; i<=mac_filter_data.maxnum; i++ )
		{
			var single = eval("mac_filter_data.white" + i);
			if ( $("#add_text").val().toUpperCase() ==  single )
			{
				error_num ++;
				$("#add_text_error").html("该MAC已存在");
			}
		}
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function displayControl()
{
	/*if ( $("#mode_select").val() == 'white' )
	{
		$("#white_hint").show();
		$("#black_hint").hide();
	}
	else
	{
		$("#white_hint").hide();
		$("#black_hint").show();
	}*/
	
	if ( mac_filter_data.MACFEnable == '1' )
	{
		$("#mac_filter_list_form").show();
	}
	else
	{
		$("#mac_filter_list_form").hide();
	}
	
	if ( addindex == '' )
	{
		$("#add_div").hide();
	}
	else
	{
		$("#add_div").show();
	}
}

function saveApply()
{
	if( ! $("#mac_filter_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.action = "mode";
	postdata.MACFEnable = getCheckbox("enable_checkbox");
	postdata.MACFMode = "white";
	postdata.sessionid = sessionidstr;
	XHR.post("set_mac_whitefilter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


