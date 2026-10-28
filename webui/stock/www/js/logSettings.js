var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customSwitchInit();

	showOrHideLoadingWindowFromIframe("show");
	initPage();
});

function initPage()
{
	gDebug = false;
	if(gDebug)
	{
		getDataByAjax("../fake/logSettings", fillData);
	}else{
		XHR.get("getLogSettings", null, fillData);
	}
}

function fillData(data)
{
	if ( data.sessionid != undefined )
	{
		sessionidstr = data.sessionid;
	}
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success == 'true')
	{
		$("#log_settings_form").fill(data.data);
		setSwitchValue("LogEnable_checkbox", data.data.enable);
	}else{
		alert("get getLogSettings failed!");
	}
	
}

function saveApply()
{
	var data = buildData();
	
	if(gDebug)
	{
		postDataByAjax("../fake/post", JSON.stringify(data));
	}else{
		//showOrHideLoadingWindowFromIframe("show");
		data.sessionid = sessionidstr;
		XHR.post("setLogSettings", data, fillData);
	}
}

function buildData()
{
	var data = new Object();
	data.enable = $("#LogEnable_checkbox_value").val();
	data.loglevel = $("#LevelLog_select").val();
	data.logviewlevel = $("#LevelDisplay_select").val();
	
	return data;
}

/*
function reloadData(responseData)
{
	if(responseData.success == "true")
	{
		fiberlog("post data success!");
		initPage();
	}
	else
	{
		alert("提交日志设置参数失败！");
	}
}*/