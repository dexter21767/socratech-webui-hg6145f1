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
		XHR.get("get_alg_enable", null, initPage);
	}

	/*$("input[name='alg_enable']").bind("change", function(){
		if (g_data.alg_enable == $(this).val())
		{
			$("#submit_btn").attr("disabled", true);
		}
		else
		{
			$("#submit_btn").attr("disabled", false);
		}
	})*/
});

function initPage(getdata)
{
	if (getdata && getdata.alg_enable)
	{
		g_data = getdata;
		displayHtml();
	}
}

function displayHtml()
{
	//$("#submit_btn").attr("disabled", true);
	if (g_data.alg_enable == "1")
	{
		$("input[name='alg_enable']:first").attr('checked', 'checked');
	}
	else
	{
		$("input[name='alg_enable']:last").attr('checked', 'checked');
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
	var alg_enable = $("input[name='alg_enable']:checked").val();
	postdata.alg_enable = alg_enable;
	XHR.post("set_alg_enable", postdata, initPage);
}


