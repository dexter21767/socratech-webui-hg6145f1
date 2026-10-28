var sessionidstr = "";
var operator_name = gOperatorName;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customSwitchInit();
	initPage();
});

function initPage()
{
	showOrHideLoadingWindowFromIframe("show");
	gDebug = false;
	if(operator_name == "MEX_MEGA"){
		$("#log_enable_div").hide();
		$("#log_level_div").hide();
		$("#log_button_div").hide();
		var option_select = '<option value="6">Informational</option>' +
			'<option value="7">Debugging</option>';
		$("#LevelDisplay_select").html(option_select);
	}
	if(gDebug)
	{
		//getDataByAjax("../fake/logSettings", fillData);
	}else{
		XHR.get("getLogSettings", null, fillData);
	}
	showLog();
}

function showLog(){
	var postdata = new Object();
	postdata.action = "showlog";
	XHR.post("syslog_inter", postdata, fillLog);
}

function fillData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success == 'true')
	{
		$("#log_settings_form").fill(data.data);
		if(gNewUiFlag == "1"){
			if( data.data.enable == "1"){
				$("#log_enable").prop('checked',true); 
			}else{
				$("#log_disable").prop('checked',true); 
			}
		}else{
			setSwitchValue("LogEnable_checkbox", data.data.enable);
		}
	}else{
		alert("get getLogSettings failed!");
	}
}

function fillLog(data){
	showOrHideLoadingWindowFromIframe("hide");
	var dynamicHTML = "";
	for( var i=1; i<=data.logcount; i++ )
	{
		dynamicHTML +=  eval("data.log" + i) + '&#13;&#10;';
	}
	
	$("#logtable").html(dynamicHTML);
}

function saveApply()
{
	show_shadow();
	setTimeout(function(){
		window.location.reload();
	}, 1000);
	
	var postdata = buildData();
	if(gDebug)
	{
		//postDataByAjax("../fake/post", JSON.stringify(data));
	}else{
		XHR.post("setLogSettings", postdata, null);
	}
}

function buildData()
{
	var data = new Object();
	if(gNewUiFlag == "1")
	{
		data.enable = $("input[name='log_enable_setting']:checked").val();
	}else
	{
	data.enable = $("#LogEnable_checkbox_value").val();
	}
	data.loglevel = $("#LevelLog_select").val();
	data.logviewlevel = $("#LevelDisplay_select").val();

	if(operator_name == "MEX_MEGA"){
		data.enable = "1"
		data.loglevel = "7"
	}

	return data;
}

function refreshLog(){
	show_shadow();
	$("#logtable").html("");
	showLog();
}

function clearLog(){
	show_shadow();
	var postdata = new Object();
	postdata.action = "clearlog";
	postdata.sessionid = sessionidstr;
	XHR.post("syslog_inter", postdata, showLog);
}

function downloadLog(){
	show_shadow();
	var postdata = new Object();
	postdata.sessionid = sessionidstr;
	XHR.post("down_cfgfile", postdata, parse_return_data);
}

function parse_return_data(data)
{
	if ( data && data.success == "true")
	{
		window.location = "../cgi-bin/download?message_syslog";
	}
	else
	{
		alert("unknown_error_alert".i18n());
	}
}