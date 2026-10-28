var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/alg", initPage);
	}
	else
	{
		XHR.get("get_media_sharing_info", null, initPage);
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
	
	if (getdata != null && getdata.media_sharing)
	{
		setCheckbox("EnableMediaSharing", getdata.media_sharing.DMSEnable);
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.DMSEnable = getCheckbox("EnableMediaSharing");
	postdata.sessionid = sessionidstr;
	XHR.post("set_media_sharing_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

