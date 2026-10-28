var g_dlna_enable = "";


$(document).ready(function(){
	//优化滚动条，无需改动

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_dlna_enable_info", null, initPage);
	}

});

function initPage(getdata)
{
	if (getdata && getdata.dlna_enable_info)
	{
		g_dlna_enable = getdata.dlna_enable_info;
		displayHtml();
	}
}

function displayHtml()
{	
	if (g_dlna_enable.dlna_enable == "1")
	{
		$("input[name='dlna_enable'][value='1']").attr('checked', 'checked');
	}
	else
	{
		$("input[name='dlna_enable'][value='0']").attr('checked', 'checked');
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
	postdata.dlna_enable = $("input[name='dlna_enable']:checked").val();

	XHR.post("set_dlna_enable_info", postdata, initPage);
}


