var g_telnet_enable = "";


$(document).ready(function(){
	//优化滚动条，无需改动

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_telnet_info", null, initPage);
	}

});

function initPage(getdata)
{
	if (getdata != null)
	{
		g_telnet_enable = getdata;
		displayHtml();
	}
}

function displayHtml()
{	
	if (g_telnet_enable.lantelnetValue == "1" || g_telnet_enable.wantelnetValue == "1")
	{
		$("input[name='telnet_enable'][value='1']").attr('checked', 'checked');
	}
	else
	{
		$("input[name='telnet_enable'][value='0']").attr('checked', 'checked');
	}
}

function cancel()
{
	displayHtml();
}

function save_apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.lantelnetValue = $("input[name='telnet_enable']:checked").val();
	postdata.wantelnetValue = $("input[name='telnet_enable']:checked").val();
	XHR.post("set_telnet_info", postdata, initPage);
}



