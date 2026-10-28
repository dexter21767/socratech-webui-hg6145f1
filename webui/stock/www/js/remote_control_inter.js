var sessionidstr = "";
var g_data;
var operators_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/remote_control", initPage);
	}
	else
	{
		XHR.get("get_remote_control_info", null, initPage);
	}
});

function initPage(getdata)
{
	if (getdata != null && getdata.remotecontrol_enable)
	{
		g_data = getdata.remotecontrol_enable;
		displayHtml();
	}
	if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG"){	
		$(".main_header_hint").html("remote_control_prompt_rom".i18n());	
	}
	
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{
	if(operators_name == "TH_3BB")
	{
		if (g_data.REMOTEACCEnable == "0")
		    {
				$("input[name='remote_control_enable']:last").attr('checked', 'checked');
			}
		    else if (g_data.REMOTEACCEnable == "1"){
				$("input[name='remote_control_enable']:first").attr('checked', 'checked');
			}
	}else
	{
		if(g_data.WebAniEnable == "0")
		{
			$("input[name='remote_control_enable']:last").attr('checked', 'checked');
		}else if(g_data.WebAniEnable == "1")
		{
			$("input[name='remote_control_enable']:first").attr('checked', 'checked');
		}
	}
	
}
	
	

function save_apply()
{
	show_shadow();
	
	var postdata = new Object();
	if(operators_name == "TH_3BB")
	{
		postdata.REMOTEACCEnable = $("input[name='remote_control_enable']:checked").val();
		postdata.LocalACLEnable = $("input[name='remote_control_enable']:checked").val();
		XHR.post("set_remote_control_info", postdata, initPage);
	}else
	{
		postdata.WebAniEnable = $("input[name='remote_control_enable']:checked").val();
		XHR.post("set_remote_control_info", postdata, initPage);
	}
	
}

