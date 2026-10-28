var sessionidstr = "";
var g_data;
var operator_name;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/remote_control", initPage);
	}
	else
	{
		XHR.get("get_vpn_through_info", null, initPage);
	}
	L2TP_passThrough();
});

//泰国TRUE 泰国3BB定制化需求 
function L2TP_passThrough()
{
	if(gOperatorName == "TH_3BB" || gOperatorName == "TH_TRUE" ||  gOperatorName == "COL_CLARO" || gOperatorName == "PH_PLDT" )
	{	
			$("#L2TP_passThrough").show();
	}
}

function initPage(getdata)
{
	//alert(JSON.stringify(getdata));
	if (getdata != null && getdata.vpn_through_enable)
	{
		g_data = getdata.vpn_through_enable;
		displayHtml();
	}
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{
	if (g_data.IPSECEnable == "0")
    {
		$("input[name='IPSec_Passthrough_enable']:last").attr('checked', 'checked');
	}
    else if(g_data.IPSECEnable == "1")
	{
		
		$("input[name='IPSec_Passthrough_enable']:first").attr('checked', 'checked');
	}
	if (g_data.PPTPEnable == "0")
	{
		$("input[name='PPTP_Passthrough_enable']:last").attr('checked', 'checked');
	}
	else if(g_data.PPTPEnable == "1"){
		$("input[name='PPTP_Passthrough_enable']:first").attr('checked', 'checked');
	}
	if (g_data.L2TPEnable == "0")
	{
		$("input[name='L2TP_Passthrough_enable']:last").attr('checked', 'checked');
	}
	else if(g_data.L2TPEnable == "1"){
		$("input[name='L2TP_Passthrough_enable']:first").attr('checked', 'checked');
	}
}

function save_apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.IPSECEnable = $("input[name='IPSec_Passthrough_enable']:checked").val();
	postdata.PPTPEnable = $("input[name='PPTP_Passthrough_enable']:checked").val();
	if(gOperatorName == "TH_3BB" || gOperatorName == "TH_TRUE" || gOperatorName == "COL_CLARO" || gOperatorName == "PH_PLDT")
	{	
		postdata.L2TPEnable = $("input[name='L2TP_Passthrough_enable']:checked").val();
	}
	//alert(JSON.stringify(postdata));
	XHR.post("set_vpn_through_info", postdata, initPage);
}

