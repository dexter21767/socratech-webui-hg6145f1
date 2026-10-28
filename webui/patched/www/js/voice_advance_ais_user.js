var voicedata;
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	$("input:checkbox").bind("click", function(){
		displayControl();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_advance", initPage);
	}
	else
	{
		XHR.get("get_voice_advance_info", null, initPage);
	}
	
    $("#jitter_buffer").bind("change", function(){
    	if ($("#jitter_buffer").val() == "1"){
    		 $("#fixup_div").show(); 
             $("#min_div").hide();
             $("#max_div").hide();
    	}else{
    		$("#fixup_div").hide(); 
             $("#min_div").show();
             $("#max_div").show();
    	}
    });
    
});

function displayControl()
{
    
}

function initValidate()
{
	$("#voice_advance_form").validate({
		debug: true,
		rules: {
			"TelephoneEventPayloadType": {required: true, range_int_equal:[96,127,0]},
			"RTPRedundancyPayload": {required: true,  range_int_equal:[96,127,0]},
			"HeartbeatCount": {required: true, range_int:[1,120]},
            "fixup": {required: true, range_int:[20,200]},
            "min_buffer": {required: true, range_int:[20,200]},
            "max_buffer": {required: true, range_int:[20,200]},
            "callForwarding_unconditional_number1": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_unconditional_number2": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_unconditional_number3": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_unconditional_number4": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_busy_number1": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_busy_number2": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_busy_number3": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_busy_number4": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_noreply_number1": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_noreply_number2": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_noreply_number3": {minlength:0, maxlength:32, nocn: true},
            "callForwarding_noreply_number4": {minlength:0, maxlength:32, nocn: true}
		},

		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());	
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate voice_advance ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate voice_advance failed.....");
			return false;
		}
	});
	
}

function initPage(getdata)
{
	if (getdata != null && getdata.voice_advance)
	{
		voicedata = getdata.voice_advance;
		cancelBtn();
	}
	if (voicedata.voice_port_num == 1) {
		
		$(".port_2").hide();
	    $(".port_3").hide();
	    $(".port_4").hide();
	}
	if (voicedata.voice_port_num == 2) {
	    $(".port_3").hide();
	    $(".port_4").hide();
	}
	else if (voicedata.voice_port_num == 4) {
	    $(".port_3").show();
	    $(".port_4").show();
	}
	
}

function cancelBtn()
{
    $("#jitter_buffer").val(voicedata.jitter_buffer);// 4
    $("#fixup").val(voicedata.jitter_buffer_fixup);
    $("#min_buffer").val(voicedata.jitter_buffer_min);
    $("#max_buffer").val(voicedata.jitter_buffer_max);
    if ($("#jitter_buffer").val() == "1"){
    	 $("#fixup_div").show(); 
         $("#min_div").hide();
         $("#max_div").hide();
    }else{
    	$("#fixup_div").hide(); 
         $("#min_div").show();
         $("#max_div").show();
    }
        
	$("#TelephoneEventPayloadType").val(voicedata.TelephoneEventPayloadType);// 1
	$("#RTPRedundancyPayload").val(voicedata.RTPRedundancyPayload);// 2
	$("#HeartbeatCount").val(voicedata.HeartbeatCount);// 3


	$("#PolarityReversalMode").val(voicedata.PolarityReversalMode);// 5
	$("#transferSharp").val(voicedata.transferSharp);// 6
	$("#CIDHeadfield").val(voicedata.CIDHeadfield); // 7

    
	$("#CallerIDEnableOther").val(voicedata.CallerIDEnableOther);// 8
    
	for (var i=1; i<=voicedata.voice_port_num; i++)
	{
		$("#SilenceSuppression"+i).val(eval("voicedata.SilenceSuppression"+i));// 9
		$("#CallWaitingEnable"+i).val(eval("voicedata.CallWaitingEnable"+i));// 10
		$("#ThreeWayCallingEnable"+i).val(eval("voicedata.ThreeWayCallingEnable"+i));// 11 

        setCheckbox("callForwarding_unconditional"+i, eval("voicedata.callForwardUnconditional"+i));// 12
        setCheckbox("callForwarding_busy"+i, eval("voicedata.callForwardbusy"+i));// 14
        setCheckbox("callForwarding_noreply"+i, eval("voicedata.callForwardnoReply"+i));// 16
        $("#callForwarding_unconditional_number"+i).val(eval("voicedata.callForwardUnconditionalNumber"+i));// 13
        $("#callForwarding_busy_number"+i).val(eval("voicedata.callForwardbusyNumber"+i));// 15
        $("#callForwarding_noreply_number"+i).val(eval("voicedata.callForwardnoReplyNumber"+i)); // 17
	}
}

function extraValidCheck()
{	
	var min_buffer = $("#min_buffer").val();
	var max_buffer = $("#max_buffer").val();


    if ( parseInt(min_buffer) > parseInt(max_buffer))
    {
        
        $("#voicemax-error").html("voice_maxErrorAlert".i18n());
        return false;
    }
	return true;
}

function saveApply()
{
	show_shadow();
	if( ! $("#voice_advance_form").valid() )
	{
		alert("value_invilid".i18n());
		return;
	}
    if( !extraValidCheck() ) // 额外校验，如要需要再打开
    {
    alert("illegal_value_alert".i18n());
        return;
    }
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	var postdata = new Object();
	postdata.TelephoneEventPayloadType = $("#TelephoneEventPayloadType").val();
	postdata.RTPRedundancyPayload = $("#RTPRedundancyPayload").val();
	postdata.HeartbeatCount = $("#HeartbeatCount").val();

	postdata.JitterBuffer = $("#jitter_buffer").val();
    postdata.Fixup = $("#fixup").val();
	postdata.MinBuffer = $("#min_buffer").val();
	postdata.MaxBuffer = $("#max_buffer").val();
    

	postdata.PolarityReversalMode = $("#PolarityReversalMode").val();
	postdata.transferSharp = $("#transferSharp").val();
	postdata.CIDHeadfield = $("#CIDHeadfield").val();
	
	postdata.CallerIDEnableOther = $("#CallerIDEnableOther").val();
	
	for (var i=1; i<=voicedata.voice_port_num; i++)
	{
		postdata["SilenceSuppression"+i] = $("#SilenceSuppression"+i).val();
		postdata["CallWaitingEnable"+i] = $("#CallWaitingEnable"+i).val();
		postdata["ThreeWayCallingEnable"+i] = $("#ThreeWayCallingEnable"+i).val();
		
        postdata["callForwardUnconditional"+i] = getCheckbox("callForwarding_unconditional"+i);
        postdata["callForwardUnconditionalNumber"+i] = $("#callForwarding_unconditional_number"+i).val();
        postdata["callForwardBusy"+i] = getCheckbox("callForwarding_busy"+i);
        postdata["callForwardBusyNumber"+i] = $("#callForwarding_busy_number"+i).val();
        postdata["callForwardNoReply"+i] = getCheckbox("callForwarding_noreply"+i);
        postdata["callForwardNoReplyNumber"+i] = $("#callForwarding_noreply_number"+i).val();
        
        console.log(postdata);
	}
	XHR.post("set_voice_advance_info", postdata, initPage);

}


