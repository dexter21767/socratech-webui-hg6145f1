var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/alg", initPage);
	}
	else
	{
		XHR.get("get_alg_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.alg)
	{
		setCheckbox("H323Enable_checkbox", getdata.alg.H323Enable);
		setCheckbox("SIPEnable_checkbox", getdata.alg.SIPEnable);
		setCheckbox("RTSPEnable_checkbox", getdata.alg.RTSPEnable);
		setCheckbox("L2TPEnable_checkbox", getdata.alg.L2TPEnable);
		setCheckbox("IPSECEnable_checkbox", getdata.alg.IPSECEnable);
		setCheckbox("FTPEnable_checkbox", getdata.alg.FTPEnable);
		if ( getOperator() == "CT" )
		{
			$("#pptp_div").show();
			setCheckbox("PPTPEnable_checkbox", getdata.alg.PPTPEnable);
		}
		else
		{
			$("#pptp_div").hide();
		}
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.H323Enable = getCheckbox("H323Enable_checkbox");
	postdata.SIPEnable = getCheckbox("SIPEnable_checkbox");
	postdata.RTSPEnable = getCheckbox("RTSPEnable_checkbox");
	postdata.L2TPEnable = getCheckbox("L2TPEnable_checkbox");
	postdata.IPSECEnable = getCheckbox("IPSECEnable_checkbox");
	postdata.FTPEnable = getCheckbox("FTPEnable_checkbox");
	if ( getOperator() == "CT" )
		postdata.PPTPEnable = getCheckbox("PPTPEnable_checkbox");
	postdata.sessionid = sessionidstr;
	XHR.post("set_alg_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

