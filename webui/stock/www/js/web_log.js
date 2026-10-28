var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	$("input:[name='enable']").bind("click", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/web_log", initPage);
	}
	else
	{
		XHR.get("get_web_log", null, initPage);
	}
	displayControl();
});

function displayControl()
{
	if ( getRadio("enable") == 1 )
	{
		$("#loglevel").show();
	}
	else
	{
		$("#loglevel").hide();
	}
}

function initPage(data)
{
	if ( data.sessionid != undefined )
	{
		sessionidstr = data.sessionid;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( data )
	{
		setRadio("enable", data.LogEnable);
		$("#level").val(data.LogLevel);
	}
}

function saveApply()
{
	var postdata = new Object();
	postdata.LogEnable = getRadio("enable");
	postdata.LogLevel = $("#level").val();
	postdata.sessionid = sessionidstr;
	XHR.post("set_web_log", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

