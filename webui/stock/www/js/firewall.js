var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_firewall_info", null, initPage);
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
	
	if (getdata != null && getdata.firewall)
	{
		setCheckbox("FirewallEnable_checkbox", getdata.firewall.Enable);
		$("#Firewall_Level").val(getdata.firewall.LEVEL);
		setCheckbox("DosEnable_checkbox", getdata.firewall.DOSFEnable);
	}
	
}

function saveApply()
{
	var postdata = new Object();
	
	postdata.Enable = getCheckbox("FirewallEnable_checkbox");
	postdata.LEVEL = $("#Firewall_Level").val();
	postdata.DOSFEnable = getCheckbox("DosEnable_checkbox");
	postdata.sessionid = sessionidstr;
	XHR.post("set_firewall_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

