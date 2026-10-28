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
		XHR.get("get_sub_version_info", null, initPage);
	}

	
});

function initPage(getdata)
{
	if (getdata && getdata.sub_version)
	{
		g_data = getdata.sub_version;
		displayHtml();
	}
}

function displayHtml()
{
	
	if (g_data.reuse_status == "0")
	{
		$("input[name='sub_version_enable']:last").attr('checked', 'checked');
	}
	else
	{
		$("input[name='sub_version_enable']:first").attr('checked', 'checked');
	}
}

function Cancel()
{
	displayHtml();
}

function SaveApply()
{
	show_shadow();
	var postdata = new Object();
	postdata.reuse_status = $("input[name='sub_version_enable']:checked").val();
	
	if (postdata.reuse_status == "0")
	{
		XHR.post("set_sub_version_info", postdata, initPage);
	}
	else
	{
		XHR.post("set_sub_version_info", postdata, function(){
		window.parent.location = "../index.html";
  		});
	}
}



