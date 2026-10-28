var sessionidstr = "";
var g_data;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipfilter_eth", initPage);
	}
	else
	{
		XHR.get("get_upstream_configure_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata != null && getdata.upstream_port )
	{
		g_data = getdata.upstream_port;
		displayHtml();
	}
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{
	$("#port_select").val(g_data);
}

function reloadData(responseData)
{
	if(responseData.success != "true")
	{
		if(gNewUiFlag)
			myAlert('Tip', "restore_error".i18n());
		else
			alert("restore_error".i18n());
	}
	else
	{
		var postdata = new Object();
		postdata.sessionid = sessionidstr;
		XHR.post("set_onu_reboot", postdata, null);
        jumpToLoginPage(true);
	}
}

function save_apply()
{
	show_shadow();
	if(gNewUiFlag)
		myAlert('Tip', "takes_effect_after_device_restart".i18n());
	else
		alert("takes_effect_after_device_restart".i18n());
	var postdata = new Object();
	postdata.upstream_port = $("#port_select").val();
    XHR.post("set_upstream_configure_info", postdata, reloadData);
}
	
	
