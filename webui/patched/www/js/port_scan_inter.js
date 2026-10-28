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
		XHR.get("get_port_scan_enable_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata != null && getdata.eth_filter )
	{
		g_data = getdata.eth_filter;
		displayHtml();
	}
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{
	if (g_data.PORTSCANEnable == "0")
    {
		$("input[name='anti_port_scan_enable']:last").attr('checked', 'checked');
	}
    else
    {
		$("input[name='anti_port_scan_enable']:first").attr('checked', 'checked');
	}
}

function save_apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.PORTSCANEnable = $("input[name='anti_port_scan_enable']:checked").val();
	XHR.post("set_port_scan_enable_info", postdata, initPage);
}
	
	
