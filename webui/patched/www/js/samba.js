var g_samba_enable;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	if ( gDebug ) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_samba_info", null, initPage);
	}

});

function initPage(getdata)
{
	if (getdata && getdata.samba_enable)
	{
		g_samba_enable = getdata.samba_enable;
		displayHtml();
	}
}

function displayHtml()
{
	if (g_samba_enable == "1")
	{
		$("input[name='samba_enable'][value='1']").attr('checked', 'checked');
	}
	else
	{
		$("input[name='samba_enable'][value='0']").attr('checked', 'checked');
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
	postdata.samba_enable = $("input[name='samba_enable']:checked").val();

	XHR.post("set_samba_info", postdata, initPage);
}

