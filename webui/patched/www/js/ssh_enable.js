var g_ssh_enable = "";


$(document).ready(function(){
	//优化滚动条，无需改动

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_ssh_info", null, initPage);
	}

});

function initPage(getdata)
{
	if (getdata != null)
	{
		g_ssh_enable = getdata;
		displayHtml();
	}
}

function displayHtml()
{	
	if (g_ssh_enable.lansshValue == "1" || g_ssh_enable.wansshValue == "1")
	{
		$("input[name='ssh_enable'][value='1']").attr('checked', 'checked');
	}
	else
	{
		$("input[name='ssh_enable'][value='0']").attr('checked', 'checked');
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
	postdata.lansshValue = $("input[name='ssh_enable']:checked").val();
	postdata.wansshValue = $("input[name='ssh_enable']:checked").val();
	
	XHR.post("set_ssh_info", postdata, initPage);
}




