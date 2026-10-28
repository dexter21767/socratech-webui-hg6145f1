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
		XHR.get("get_comservice_info", null, initPage);
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
	
	if (getdata != null && getdata.comservice)
	{
		setCheckbox("comserviceEnable_checkbox", getdata.comservice.Enable);
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.Enable = getCheckbox("comserviceEnable_checkbox");
	postdata.sessionid = sessionidstr;
	XHR.post("set_comservice_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

