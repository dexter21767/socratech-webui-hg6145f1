var sessionidstr = "";
var all_wan_info;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	$("#wan_connect").bind("change", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
	}
});

function initValidate()
{
	$("#traceroute_form").validate({
		debug: true,
		rules: {
			"address": {required: true, nocn: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate loid failed.....");
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
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata )
	{
		all_wan_info = getdata;
	}
	
	var wan_num = 0;
	var dynamicHtml = '';

	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			if ( single_wan.Name.indexOf('_R_') >= 0 )
			{
				dynamicHtml += '<option value="' + single_wan.wan_index + '_' + single_wan.wan_session_index + '_' + single_wan.IPMode + '">' + single_wan.Name + '</option>';
			}
		}
	}
	$("#wan_connect").html(dynamicHtml);
	
	displayControl();
}

function displayControl()
{
	if ( $("#wan_connect option").size() > 0 )
	{
		var select_wan_ip_version = $("#wan_connect").val().split("_")[2];
		var dynamicHtml = '';
		if ( select_wan_ip_version == 1 || select_wan_ip_version == 3 )
		{
			dynamicHtml += "<option value='4'>IPv4</option>"; 
		}
		if ( select_wan_ip_version == 2 || select_wan_ip_version == 3 )
		{
			dynamicHtml += "<option value='6'>IPv6</option>"; 
		}
		$("#ip_version").html(dynamicHtml);
		
		$(".main_save").show();
	}
	else
	{
		$(".main_save").hide();
	}
}

function isValidURL(ipAddress)
{
    var urlPat=/(?:(?:http[s]?|ftp):\/\/)?[^\/\.]+?\.[^\.\\\/]+?\.\w{2,}$/i;
    var matchArray=ipAddress.match(urlPat);
    if( matchArray != null )
    {
        return true;
    } 
    else 
    {
        return false;
    } 
}

function saveApply()
{
	if( ! $("#traceroute_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	if ( $("#ip_version").val() == 4 && false == isValidIpAddress($("#address").val()) && false == isValidURL($("#address").val()))
	{
		alert("您输入的IPv4地址无效，请重新输入");
		return;
	}
	else if ( $("#ip_version").val() == 6 && false == isValidIpAddress6($("#address").val()) && false == isValidURL($("#address").val()))
	{
		alert("您输入的IPv6地址无效，请重新输入");
		return;
	}
	
	var postdata = new Object();
	postdata.address = $("#address").val();
	postdata.ipversion = $("#ip_version").val();
	
	var select_wan_info = getSingleWanInfo($("#wan_connect").val());
	
	if ( $("#ip_version").val() == 4 )
	{
		if ( select_wan_info.ConnectionStatus == "Connected" )
		{
			postdata.iface_ip = select_wan_info.ExternalIPAddress;
			postdata.iors = "-s";
		}
		else
		{
			if ( select_wan_info.vlanid > 0 )
			{
				postdata.iface_ip = "wan." + select_wan_info.vlanid;
			}
			else
			{
				postdata.iface_ip = "wan";
			}
			postdata.iors = "-i";
		}
	}
	else if ( $("#ip_version").val() == 6 )
	{
		if ( select_wan_info.IPv6ConnStatus == "Connected" )
		{
			postdata.iface_ip = select_wan_info.IPv6IPAddress;
			postdata.iors = "-s";
		}
		else
		{
			if ( select_wan_info.vlanid > 0 )
			{
				postdata.iface_ip = "wan." + select_wan_info.vlanid;
			}
			else
			{
				postdata.iface_ip = "wan";
			}
			postdata.iors = "-i";
		}
	}
	
	postdata.sessionid = sessionidstr;
	XHR.post("do_traceroute", postdata, showPingResult);
	showOrHideLoadingWindowFromIframe("show");
}

function showPingResult(data)
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	if (data)
	{
		var dynamicHtml = data.result.split('\n').join('<br/>');
		$("#result").html(dynamicHtml);
	}
	else
	{
		$("#result").html("本次Traceroute测试没有返回结果。");
	}
}

function getSingleWanInfo(selectwan_index)
{
	var select_wan_index = selectwan_index.split('_')[0];
	var select_wan_session_index = selectwan_index.split('_')[1];
	var wan_num = all_wan_info.wan.length;
	var select_wan_info = '';
	
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			if ( single_wan.wan_index == select_wan_index 
				&& single_wan.wan_session_index == select_wan_session_index )
				{
					select_wan_info = single_wan;
					break;
				}
		}
	}
	
	return select_wan_info;
}