var g_data;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_portisolation_info", null, initPage);
	}
});

function initPage(getdata)
{

	if (getdata != null && getdata.portIsolation_info)
	{
		g_data = getdata.portIsolation_info;
		displayHtml();
	}	
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{

	if (g_data.protIsolation_enable == "1")
	{
		$("input[name='PortIsolation_enable']:first").attr('checked', 'checked');
	}
	else
	{	
		$("input[name='PortIsolation_enable']:last").attr('checked', 'checked');
	}
}


function save_apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.protIsolation_enable = $("input[name='PortIsolation_enable']:checked").val();
	XHR.post("set_portisolation_info", postdata, initPage);
}


