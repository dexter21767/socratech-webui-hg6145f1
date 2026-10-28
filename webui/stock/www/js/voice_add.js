var sessionidstr = "";
var voicedata = '';

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	$("input:checkbox").bind("click", function(){
		displayControl();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_add", initPage);
	}
	else
	{
		XHR.get("get_voice_add_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_add_form").validate({
		debug: true,
		rules: {
			"conferenceuri": {required: true},
			"hotlineuri": {required: true},
			"L1_HotlineTimer": {required: true, min:0},
			"HeartbeatCycle": {required: true, min:0},
			"HeartbeatCount": {required: true, min:0}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}


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
	
	if (getdata != null && getdata.voice_add)
	{
		voicedata = getdata.voice_add;
		
		$("#TimeSyncMode").val(voicedata.TimeSyncMode);
		$("#CountryRegion").val(voicedata.CountryRegion);
		if ( voicedata.ServerType == 0 )
		{
			setCheckbox("PolarityReversalMode", voicedata.PolarityReversalMode);
			setCheckbox("EnableSubsAfterReg", voicedata.EnableSubsAfterReg);
			$("#ThreePartyInIMS").val(voicedata.ThreePartyInIMS);
			$("#conferenceuri").val(voicedata.conferenceuri);
			$("#hotlineuri").val(voicedata.hotlineuri);
		}
		else if ( voicedata.ServerType == 1 )
		{
			setCheckbox("PolarityReversalMode", voicedata.PolarityReversalMode);
			$("#L1_HotlineTimer").val(voicedata.L1_HotlineTimer);
			$("#hotlineuri").val(voicedata.HotlineNumber);
			setCheckbox("HotlineEnable", voicedata.HotlineEnable);
			setCheckbox("ThreeWayCallingEnable", voicedata.ThreeWayCallingEnable);
			setCheckbox("CallWaitingEnable", voicedata.CallWaitingEnable);
		}
		else if ( voicedata.ServerType == 2 )
		{
			setCheckbox("HeartbeatMode", voicedata.HeartbeatMode);
			$("#HeartbeatCycle").val(voicedata.HeartbeatCycle);
			$("#HeartbeatCount").val(voicedata.HeartbeatCount);
		}
	}
	
	displayControl();
}



function extraValidCheck()
{
	var error_num = 0;

	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function displayControl()
{
	$(".sip_item,.h248_item,.ims_item").each(function (i){
		$(this).hide();
	});
	if ( voicedata.ServerType == 0 )
	{
		$(".ims_item").each(function (i){
			$(this).show();
		});
	}
	else if ( voicedata.ServerType == 1 )
	{
		$(".sip_item").each(function (i){
			$(this).show();
		});
		if ( getCheckbox("HotlineEnable") == 0 )
		{
			$("#L1_HotlineTimer").attr("disabled", true);
			$("#hotlineuri").attr("disabled", true);
		}
		else
		{
			$("#L1_HotlineTimer").attr("disabled", false);
			$("#hotlineuri").attr("disabled", false);
		}
	}
	else if ( voicedata.ServerType == 2 )
	{
		$(".h248_item").each(function (i){
			$(this).show();
		});
		if ( getCheckbox("HeartbeatMode") == 0 )
		{
			$("#HeartbeatCycle").attr("disabled", true);
			$("#HeartbeatCount").attr("disabled", true);
		}
		else
		{
			$("#HeartbeatCycle").attr("disabled", false);
			$("#HeartbeatCount").attr("disabled", false);
		}
	}
}

function saveApply()
{
	if( ! $("#voice_add_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.ServerType = voicedata.ServerType;
	postdata.TimeSyncMode = $("#TimeSyncMode").val();
	postdata.CountryRegion = $("#CountryRegion").val();
	if ( voicedata.ServerType == 0 )
	{
		postdata.PolarityReversalMode = getCheckbox("PolarityReversalMode");
		postdata.EnableSubsAfterReg = getCheckbox("EnableSubsAfterReg");
		postdata.ThreePartyInIMS = $("#ThreePartyInIMS").val();
		postdata.conferenceuri = $("#conferenceuri").val();
		postdata.hotlineuri = $("#hotlineuri").val();
	}
	else if ( voicedata.ServerType == 1 )
	{
		postdata.PolarityReversalMode = getCheckbox("PolarityReversalMode");
		postdata.L1_HotlineTimer =$("#L1_HotlineTimer").val();
		postdata.HotlineNumber = $("#hotlineuri").val();
		postdata.HotlineEnable = getCheckbox("HotlineEnable");
		postdata.ThreeWayCallingEnable = getCheckbox("ThreeWayCallingEnable");
		postdata.CallWaitingEnable = getCheckbox("CallWaitingEnable");
	}
	else if ( voicedata.ServerType == 2 )
	{
		postdata.HeartbeatMode = getCheckbox("HeartbeatMode");
		postdata.HeartbeatCycle = $("#HeartbeatCycle").val();
		postdata.HeartbeatCount = $("#HeartbeatCount").val();
	}
	postdata.sessionid = sessionidstr;
	XHR.post("set_voice_add_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


