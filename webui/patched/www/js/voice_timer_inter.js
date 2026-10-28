var sessionidstr = "";
var voicedata;
var temp_b64;
var operator_name = gOperatorName;
var sliding_spring_time_start = [80,2500];
var sliding_spring_time_end = [90,2500];
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	if(operator_name == "ECU_CNT"){
		sliding_spring_time_start = [50,2500];
		sliding_spring_time_end = [60,2500];
	}
	initValidate();
	if(operator_name == "ECU_CNT"){
	$("#slidingspring_tip").html("slidingspring_cnt_tip".i18n());
	}
	//$("auto_height").parent().eq(0).attr("height:70px");
	
	//$("select").each(function (i){
	//	$(this).children().eq(0).html("max_title".i18n());
	//	$(this).children().eq(1).html("min_title".i18n());
	//});

	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_dial", initPage);
	}
	else
	{
		XHR.get("get_voice_dial_info", null, initPage);
	}

	if(operator_name == "MEX_MEGA"){
       $("#div_ring_cadences").show();  
    }else{
       $("#div_ring_cadences").hide(); 
    }
});


function initValidate()
{
	$("#voice_dial_form").validate({
		debug: true,
		rules: {
			"RegisterExpires_text": {required: true, range_int:[120,65335]},
			"ShortTimerValue_text":{required: true, range_int:[1,10]},
			"LongTimerValue_text": {required: true, range_int:[4,20]},
			"ShortTimerValue_text2":{required: true, range_int:[1,254]},
			"LongTimerValue_text2": {required: true, range_int:[1,254]},
			"StartDigitTimer_text": {required: true, range_int:[1,254]},
			"NoAnswerTimer_text": {required: true, range_int:[1,254]},
			"HangingReminderToneTimer_text": {required: true, range_int:[1,254]},
			"BusyToneTimer_text": {required: true, range_int:[1,254]},
            "BusyRingbacktime_text":{ range_int:[1,254]},
			"RegisterRetryInterval_text": {required: true, range_int:[30,3600]},
			"MaxWaitDelay_text": {required: true, range_int:[1,254]},
			"HookFlashDownTime_text": {required: true, range_int_ten:true, range_int:sliding_spring_time_start},
			"HookFlashUpTime_text": {required: true, range_int_ten:true, range_int:sliding_spring_time_end},
			"SessionUpdate_text": {required: true, range_int:[90,65535]},
			"StartDialingTimer_text": {required: true, range_int:[10,20]},
            "onHook_confirm_timer_text":{required: true, range_int:[600,2500]}
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
    
	var b = new Base64();
	//判断当前用户为普通用户还是管理员用户
	var login_user = gLoginUser;
    if(operator_name == "PLE_PALTEL"){
        $("#ringback_time_div").show();
    }
    
    if(operator_name == "ECU_CNT"){
        $("#onHook_confirm_timer").show();
    }
	if(operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE"){
		if(login_user == "0"){
		//	alert("当前为泰国TREU的普通用户");
			$("input").attr("disabled", true);
			$("select").attr("disabled", true);		
			$("#DigitMap_text").attr("disabled", true);
		}
	}
	if(operator_name == "MY_TM")
	{
		$("#session_timer_enable").show();
		$("#session_timer").show();
	}
	else
	{
		$("#session_timer_enable").hide();
		$("#session_timer").hide();
	}
	
	if (getdata != null && getdata.voice_dial)
	{
		voicedata = getdata.voice_dial;
		 temp_b64 = b.decode(voicedata.DigitMap);	
		
		
		displayHtmlData();
	}
	
}


function displayHtmlData()
{
	if ( voicedata.ServerType != 2 )
	{
		if (voicedata.DigitMapType == 0 || voicedata.DigitMapType == 1){
			$("#DigitMapMode_select").val("0");
		}
		if (voicedata.DigitMapType == 2 || voicedata.DigitMapType == 3){
			$("#DigitMapMode_select").val("2");
		}
		$("#DigitMap_text").val(temp_b64);
		//$("#DigitMap_text").val(voicedata.DigitMap);
		$("#RegisterExpires_text").val(voicedata.RegisterExpires);
		$("#LongTimerValue_text").val(voicedata.InterDigitTimerLong);
		$("#ShortTimerValue_text").val(voicedata.InterDigitTimerShort);
		$("#StartDigitTimer_text").val(voicedata.StartDigitTimer);
		$("#NoAnswerTimer_text").val(voicedata.NoAnswerTimer);
		$("#HangingReminderToneTimer_text").val(voicedata.HangingReminderToneTimer);
		$("#BusyToneTimer_text").val(voicedata.BusyToneTimer);
        $("#BusyRingbacktime_text").val(voicedata.RingbackToneTimer);
		$("#RegisterRetryInterval_text").val(voicedata.RegisterRetryInterval);
		$("#MaxWaitDelay_text").val(voicedata.MaxWaitDelay);
		$("#HookFlashDownTime_text").val(voicedata.HookFlashDownTime);
		$("#HookFlashUpTime_text").val(voicedata.HookFlashUpTime);
		$("#SessionTimerEnable").val(voicedata.SessionTimerEnable);
		$("#SessionUpdate_text").val(voicedata.SessionUpdateTimer);
        $("#onHook_confirm_timer_text").val(voicedata.OnHookConfirmTime);
		if(operator_name == "MEX_MEGA")
		{
			$("#ring_cadences").val(voicedata.ring_cadences);
		}
	}
	else
	{
		$("#StartDialingTimer_text").val(voicedata.StartDigitTimer);
		$("#ShortTimerValue_text2").val(voicedata.InterDigitTimerShort);
		$("#LongTimerValue_text2").val(voicedata.InterDigitTimerLong);
	}

	displayControl();
}


function cancelBtn()
{
	displayHtmlData();
}


function displayControl()
{
	if ( voicedata.ServerType != 2 )
	{
		$("#ims_sip_div").show();
		$("#h248_div").hide();
	}
	else
	{
		$("#ims_sip_div").hide();
		$("#h248_div").show();
	}
}
function extraValidCheck()
{
	var StartTime = $("#HookFlashDownTime_text").val() ;
	var EndTime = $("#HookFlashUpTime_text").val() ;
	if(parseInt(StartTime) > parseInt(EndTime))
	{
		if(gNewUiFlag)
		{
			myAlert('Tip', '' + "sliding_time_seg_alert".i18n() + '', function() { })
			return  false;
		}else
		{
			alert("sliding_time_seg_alert".i18n());
		}
		return  false;
	}	
	return  true;
}

function saveApply()
{
	show_shadow();
	if( ! $("#voice_dial_form").valid() )
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "value_invilid".i18n() + '', function() { })
        else
			alert("value_invilid".i18n());
		return;
	}
		if( !extraValidCheck() ) 
		{
		return;
	}
	var postdata = new Object();
	var temp_b64 = new Base64();
	postdata.ServerType = voicedata.ServerType;
	if ( voicedata.ServerType != 2 )
	{
		if ($("#DigitMap_text").val().length > 4095)
		{
			if (gNewUiFlag)
            	myAlert('Tip', '' + "alert_dial_length_error".i18n() + '', function() { })
        	else
				alert("alert_dial_length_error".i18n());
			return;
		}
		postdata.DigitMapType = $("#DigitMapMode_select").val();
		postdata.DigitMap = temp_b64.encode($("#DigitMap_text").val());    
		postdata.RegisterExpires = $("#RegisterExpires_text").val();
		postdata.InterDigitTimerLong = $("#LongTimerValue_text").val();
		postdata.InterDigitTimerShort = $("#ShortTimerValue_text").val();
		postdata.StartDigitTimer = $("#StartDigitTimer_text").val();
		postdata.NoAnswerTimer = $("#NoAnswerTimer_text").val();
		postdata.HangingReminderToneTimer = $("#HangingReminderToneTimer_text").val();
		postdata.BusyToneTimer = $("#BusyToneTimer_text").val();
		postdata.RegisterRetryInterval = $("#RegisterRetryInterval_text").val();
		postdata.MaxWaitDelay = $("#MaxWaitDelay_text").val();
		postdata.HookFlashDownTime = $("#HookFlashDownTime_text").val();
		postdata.HookFlashUpTime = $("#HookFlashUpTime_text").val();
		if(operator_name == "MY_TM")
		{
			postdata.SessionTimerEnable = $("#SessionTimerEnable").val();
			postdata.SessionUpdateTimer = $("#SessionUpdate_text").val();
		}
        if(operator_name == "PLE_PALTEL")
        {
            postdata.RingbackToneTimer = $("#BusyRingbacktime_text").val();
        }
        if(operator_name == "ECU_CNT")
        {
            postdata.OnHookConfirmTimer = $("#onHook_confirm_timer_text").val();
        }
		if(operator_name == "MEX_MEGA")
		{
			postdata.ring_cadences = $("#ring_cadences").val();
		}
    }
	else
	{
		postdata.StartDigitTimer = $("#StartDialingTimer_text").val();
		postdata.InterDigitTimerShort = $("#ShortTimerValue_text2").val();
		postdata.InterDigitTimerLong = $("#LongTimerValue_text2").val();
	}
	XHR.post("set_voice_dial_info", postdata, initPage);

}


