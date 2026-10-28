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
	
	if(operator_name == "MAGYAR_4IG" || operator_name == "ALB_AFT")
	{
		var dynamicClsListHTML = '';
		for (var i = 50; i<=85;  i=i+5){
			dynamicClsListHTML += "<option value="+ i +">"+i+"</option>";
		}

		$("#ring_voltage_vpk").append(dynamicClsListHTML);
		$("#loop_current_div").show();
		$("#open_circuit_voltage_div").show();
		$("#ring_voltage_vpk_div").show();
	}

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_advance", initPage);
	}
	else
	{
		XHR.get("get_voice_advance_info", null, initPage);
	}
    if(operator_name == "TH_AIS" && login_user == "0"){
       $("#DigitMapMode_select_div").hide();  
       $("#EchoCancellationEnable_div").hide();
       $("#TransmitGain_div").hide();
       $("#ReceiveGain_div").hide();
       $("#UserAgentPort_div").hide();
       $("#HeartbeatSwitch_div").hide();
       $("#HeartbeatCycle_div").hide();
	   $("#fax_div").hide();
    }else{
       $("#DigitMapMode_select_div").show(); 
       $("#EchoCancellationEnable_div").show(); 
       $("#TransmitGain_div").show();
       $("#ReceiveGain_div").show(); 
       $("#UserAgentPort_div").show(); 
       $("#HeartbeatSwitch_div").show(); 
       $("#HeartbeatCycle_div").show();
	   $("#fax_div").show();
    }
    
    if(operator_name == "TH_AIS"){
		if(login_user == "0")
		{
			$("#option120_div").hide();
		}
		else
		{
			$("#option120_div").show();
		}
       $("#jitter_buffer_div").show();  
       
    }else{
       $("#jitter_buffer_div").hide(); 
    }
    if(operator_name == "MY_TM"){
       $("#call_forwarding_div").show();  
    }else{
       $("#call_forwarding_div").hide(); 
    }
    
    if(operator_name == "TH_AIS"){
       $("#enable_callForwarding_div").show();  
    }else{
       $("#enable_callForwarding_div").hide(); 
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
    
    if(operator_name == "PLE_PALTEL"){
       $("#dtfm_info").show(); 
       $("#DigitMapMode_select1 option:eq(1)").html("RFC4733");

	   $("#CallerIDEnableOther option[value=MDMF]").show();
    }else{
       if(operator_name == "BZ_INTELBRAS")
       {
       		$("#dtfm_info").show();
			$("#DigitMapMode_select1 option:eq(2)").html("SIP INFO");

			$("#div_call_id_dtmf_start_digit").show();
			$("#div_call_id_dtmf_end_digit").show();

			$("#div_send_category").show();
			$("#fanji_title").html("fanji_title_ib".i18n());	
       }
	   else
	   {
	   		$("#dtfm_info").hide();
	   }
       $("#DigitMapMode_select1 option:eq(1)").html("RFC2833"); 
    }
    
    
    $("#hotline_enable1").bind("change", function(){
    	if ($("#hotline_enable1").prop("checked")){
    		$("#Hotline_number_text1").attr("disabled", false);
    		$("#Hotelinetime_text1").attr("disabled", false);
    	}else{
    		$("#Hotline_number_text1").attr("disabled", true);
    		$("#Hotelinetime_text1").attr("disabled", true);
    	}
    });
    $("#hotline_enable2").bind("change", function(){
    	if ($("#hotline_enable2").prop("checked")){
    		$("#Hotline_number_text2").attr("disabled", false);
    		$("#Hotelinetime_text2").attr("disabled", false);
    	}else{
    		$("#Hotline_number_text2").attr("disabled", true);
    		$("#Hotelinetime_text2").attr("disabled", true);
    	}
    });
    $("#hotline_enable3").bind("change", function(){
    	if ($("#hotline_enable3").prop("checked")){
    		$("#Hotline_number_text3").attr("disabled", false);
    		$("#Hotelinetime_text3").attr("disabled", false);
    	}else{
    		$("#Hotline_number_text3").attr("disabled", true);
    		$("#Hotelinetime_text3").attr("disabled", true);
    	}
    });
    $("#hotline_enable4").bind("change", function(){
    	if ($("#hotline_enable4").prop("checked")){
    		$("#Hotline_number_text4").attr("disabled", false);
    		$("#Hotelinetime_text4").attr("disabled", false);
    	}else{
    		$("#Hotline_number_text4").attr("disabled", true);
    		$("#Hotelinetime_text4").attr("disabled", true);
    	}
    });

	if(operator_name == "MEX_MEGA")
    {
        $("#div_conference_mode").show(); 
    }
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
			"HeartbeatCycle": {required: true, range_int:[1,43200]},
			"UserAgentPort": {range_int:[1024,65535]},
            "offhook":{range_int:[0,1000]},
            "fixup": {required: true, range_int:[20,200]},
            "min_buffer": {required: true, range_int:[20,200]},
            "max_buffer": {required: true, range_int:[20,200]},
			"TransmitGain1": {required: true, range_int:[-12,6]},
			"ReceiveGain1": {required: true, range_int:[-12,6]},
			"TransmitGain2": {required: true, range_int:[-12,6]},
			"ReceiveGain2": {required: true, range_int:[-12,6]},
			"TransmitGain3": {required: true, range_int:[-12,6]},
			"ReceiveGain3": {required: true, range_int:[-12,6]},
			"TransmitGain4": {required: true, range_int:[-12,6]},
			"ReceiveGain4": {required: true, range_int:[-12,6]},
            "Hotelinetime_text1":{range_int:[0,60]},
            "Hotelinetime_text_2":{range_int:[0,60]},
            "Hotelinetime_text_3":{range_int:[0,60]},
            "Hotelinetime_text_4":{range_int:[0,60]},
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
	
	//判断当前用户为普通用户还是管理员用户
	var login_user = gLoginUser;
	if(operator_name == "TH_TRUE"|| operator_name == "TH_SME_TRUE"){
		if(login_user == "0"){
		//	alert("当前为泰国TREU的普通用户");
			$("input").attr("disabled", true);
			$("select").attr("disabled", true);		
		}
	}
	if(operator_name != "MY_TM")
	{
		$("#comfort_noise").hide();
		$("#comfort_noise2").hide();
		$("#comfort_noise3").hide();
		$("#comfort_noise4").hide();
	}
	if(operator_name == "ARG_CLARO")
	{
		$("#call_id_mode_other").hide();
	}else{
		$("#call_id_mode").hide();
		$("#call_id_mode2").hide();
		$("#call_id_mode3").hide();
		$("#call_id_mode4").hide();
	}
	if(operator_name != "MEX_TP" && operator_name != "SFU_MEX_TP"){
		$("#subscribe_item").hide();
	}
    if(operator_name != "PLE_PALTEL" && operator_name != "ECU_CNT" && operator_name != "MY_TM" )
    {
    	$("#ringback_hotline_div").hide();
        $("#ringback_hotline_div_2").hide();
        $("#ringback_hotline_div_3").hide();
        $("#ringback_hotline_div_4").hide();
    	
    }
	
    if(operator_name != "ECU_CNT")
    {
        $("#message_waiting_div").hide();
        $("#message_waiting_div_2").hide();
        $("#message_waiting_div_3").hide();
        $("#message_waiting_div_4").hide();
    }
	
	//if(operator_name != "ECU_CNT")
    //{
       	//$("#message_waiting_div").show();
        // $("#message_waiting_div_2").show();
        // $("#message_waiting_div_3").show();
        // $("#message_waiting_div_4").show();
    //}
    
    if(operator_name == "ECU_CNT")
    {
    	$("#voice_ecu_cnt").show();
        $("#port_gain").show();
        $("#set_gain_dsp").show();
        $("#rec_gain_dsp").show();
        $("#port_tx").val("0");
        $("#port_rx").val("-3.5");
    }else{
        $("#set_gain").show();
        $("#rec_gain").show();
    }
	
	if(operator_name != "BZ_INTELBRAS")
    {
        $("#div_flash_method").hide();
        $("#div_flash_method_2").hide();
        $("#div_flash_method_3").hide();
        $("#div_flash_method_4").hide();
    }

	
}

function cancelBtn()
{
    if(operator_name == "TH_AIS"){
        $("#jitter_buffer").val(voicedata.jitter_buffer);
        $("#fixup").val(voicedata.jitter_buffer_fixup);
        $("#min_buffer").val(voicedata.jitter_buffer_min);
        $("#max_buffer").val(voicedata.jitter_buffer_max);
		$("#option_120").val(voicedata.Option_120);
        if ($("#jitter_buffer").val() == "1"){
        	 $("#fixup_div").show(); 
             $("#min_div").hide();
             $("#max_div").hide();
        }else{
        	$("#fixup_div").hide(); 
             $("#min_div").show();
             $("#max_div").show();
        }
        
    }
	$("#TelephoneEventPayloadType").val(voicedata.TelephoneEventPayloadType);
	$("#RTPRedundancyPayload").val(voicedata.RTPRedundancyPayload);
	$("#HeartbeatCount").val(voicedata.HeartbeatCount);
	$("#HeartbeatCycle").val(voicedata.HeartbeatCycle);
	if (voicedata.FaxPassThroughEnable == "1"){
		$("#Faxmode").val("0");
	}else if (voicedata.FaxT38Enable == "1"){
		$("#Faxmode").val("1");
	}
	$("#PolarityReversalMode").val(voicedata.PolarityReversalMode);
	$("#transferSharp").val(voicedata.transferSharp);
	//$("#DigitMapMode_select").val(voicedata.DTMFMethod);
	$("#CIDHeadfield").val(voicedata.CIDHeadfield);
	$("#HeartbeatSwitch").val(voicedata.HeartbeatSwitch);
	$("#UserAgentPort").val(voicedata.UserAgentPort);
    
	$("#CallerIDEnableOther").val(voicedata.CallerIDEnableOther);
	$("#SubscribeEnable").val(voicedata.SubscribeEnable);
    $("#faxSwitch_mode").val(voicedata.FaxSwitch);
    $("#multihoming_mode").val(voicedata.MultihomingMode);
    $("#voice_server_type").val(voicedata.VoiceServerType);
    $("#option120").val(voicedata.Option120);
    $("#user_mode").val(voicedata.UserMode);
    $("#offhook").val(voicedata.Offhook);

    $("#ring_voltage_vpk").val(voicedata.RingVoltage);
    $("#loop_current").val(voicedata.LoopCurrent);
    $("#open_circuit_voltage").val(voicedata.CircuitVoltage);

	if(operator_name == "MEX_MEGA")
	{
		$("#conference_mode").val(voicedata.conference_mode);
	}

	if(operator_name == "BZ_INTELBRAS")
	{
		$("#call_id_dtmf_start_digit").val(voicedata.call_id_dtmf_start_digit);
		$("#call_id_dtmf_end_digit").val(voicedata.call_id_dtmf_end_digit);
		$("#send_category").val(voicedata.send_category);
	}
    
	for (var i=1; i<=voicedata.voice_port_num; i++)
	{
		$("#EchoCancellationEnable"+i).val(eval("voicedata.EchoCancellationEnable"+i));
		$("#SilenceSuppression"+i).val(eval("voicedata.SilenceSuppression"+i));
		$("#DigitMapMode_select"+i).val(eval("voicedata.DTMFMethod"+i));
		$("#flash_method"+i).val(eval("voicedata.flash_method"+i));
		$("#CallWaitingEnable"+i).val(eval("voicedata.CallWaitingEnable"+i));
		$("#ThreeWayCallingEnable"+i).val(eval("voicedata.ThreeWayCallingEnable"+i));
		$("#CallerIDEnable"+i).val(eval("voicedata.CallerIDEnable"+i));
		$("#TransmitGain"+i).val(eval("voicedata.TransmitGain"+i));
		$("#ReceiveGain"+i).val(eval("voicedata.ReceiveGain"+i));
        setCheckbox("message_waiting"+i, eval("voicedata.MessageWaiting"+i));
		$("#ComfortNoiseEnable"+i).val(eval("voicedata.ComfortNoiseEnable"+i));
        $("#CallForwardingEnable"+i).val(eval("voicedata.callForwardingEnable"+i));
        if(eval("voicedata.HotlineEnable"+i) == "0")
        {
            $("#hotline_enable"+i).prop("checked", false);
            $("#Hotelinetime_text"+i).attr("disabled", true);
            $("#Hotline_number_text"+i).attr("disabled", true);
        }else
        {
            $("#hotline_enable"+i).prop("checked", true);
            $("#Hotelinetime_text"+i).attr("disabled", false);
            $("#Hotline_number_text"+i).attr("disabled", false);
        }
        $("#hotline_enable"+i).val(eval("voicedata.HotlineEnable"+i));
        $("#Hotelinetime_text"+i).val(eval("voicedata.HotlineTimer"+i));
        $("#Hotline_number_text"+i).val(eval("voicedata.HotlineNumber"+i));
        setCheckbox("callForwarding_unconditional"+i, eval("voicedata.callForwardUnconditional"+i));
        setCheckbox("callForwarding_busy"+i, eval("voicedata.callForwardbusy"+i));
        setCheckbox("callForwarding_noreply"+i, eval("voicedata.callForwardnoReply"+i));
        $("#callForwarding_unconditional_number"+i).val(eval("voicedata.callForwardUnconditionalNumber"+i));
        $("#callForwarding_busy_number"+i).val(eval("voicedata.callForwardbusyNumber"+i));
        $("#callForwarding_noreply_number"+i).val(eval("voicedata.callForwardnoReplyNumber"+i));  
	}
}

function extraValidCheck()
{	
	var min_buffer = $("#min_buffer").val();
	var max_buffer = $("#max_buffer").val();


    if ( parseInt(min_buffer) > parseInt(max_buffer))
    {
        if (gNewUiFlag)
            myAlert('Tip', "voice_maxErrorAlert".i18n())
        else
    		alert("voice_maxErrorAlert".i18n());
        return false;
    }
	return true;
}

function saveApply()
{
	show_shadow();
	if( ! $("#voice_advance_form").valid() )
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "value_invilid".i18n() + '', function() { })
        else
		alert("value_invilid".i18n());
		return;
	}
    if( !extraValidCheck() ) // 额外校验，如要需要再打开
    {
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
	postdata.HeartbeatCycle = $("#HeartbeatCycle").val();
    if(operator_name == "TH_AIS")
    {
    	postdata.JitterBuffer = $("#jitter_buffer").val();
        postdata.Fixup = $("#fixup").val();
    	postdata.MinBuffer = $("#min_buffer").val();
    	postdata.MaxBuffer = $("#max_buffer").val();
		postdata.Option_120 = $("#option_120").val();
    }
	if ( $("#Faxmode").val() == "0" ){
		postdata.FaxPassThroughEnable = 1;
		postdata.FaxT38Enable = 0;
	}else if ($("#Faxmode").val() == "1" ){
		postdata.FaxPassThroughEnable = 0;
		postdata.FaxT38Enable = 1;
	}
	postdata.PolarityReversalMode = $("#PolarityReversalMode").val();
	postdata.transferSharp = $("#transferSharp").val();
	//postdata.DTMFMethod = $("#DigitMapMode_select").val();
	postdata.CIDHeadfield = $("#CIDHeadfield").val();
	postdata.HeartbeatSwitch = $("#HeartbeatSwitch").val();
	postdata.UserAgentPort = $("#UserAgentPort").val();
    if(operator_name == "ECU_CNT"){
    	postdata.FaxSwitch = $("#faxSwitch_mode").val();
        postdata.MultihomingMode = $("#multihoming_mode").val();
        postdata.VoiceServerType = $("#voice_server_type").val();
        postdata.Option120 = $("#option120").val();
        postdata.UserMode = $("#user_mode").val();
        postdata.Offhook = $("#offhook").val();
    }
	if(operator_name != "ARG_CLARO"){
		postdata.CallerIDEnableOther = $("#CallerIDEnableOther").val();
	}
	if(operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP"){
		postdata.SubscribeEnable = $("#SubscribeEnable").val();
	}
	
	if(operator_name == "MAGYAR_4IG" || operator_name == "ALB_AFT")
	{
		postdata.RingVoltage = $("#ring_voltage_vpk").val();
		postdata.LoopCurrent = $("#loop_current").val();
		postdata.CircuitVoltage = $("#open_circuit_voltage").val();
	}

	if(operator_name == "MEX_MEGA")
	{
		postdata.conference_mode = $("#conference_mode").val();
	}

	if(operator_name == "BZ_INTELBRAS")
	{
		postdata.call_id_dtmf_start_digit = $("#call_id_dtmf_start_digit").val();
		postdata.call_id_dtmf_end_digit = $("#call_id_dtmf_end_digit").val();
		postdata.send_category = $("#send_category").val();
	}
	
	for (var i=1; i<=voicedata.voice_port_num; i++)
	{
		postdata["EchoCancellationEnable"+i] = $("#EchoCancellationEnable"+i).val();
		postdata["SilenceSuppression"+i] = $("#SilenceSuppression"+i).val();
		postdata["DTMFMethod"+i] = $("#DigitMapMode_select"+i).val();
		if(operator_name == "BZ_INTELBRAS")
		{
			postdata["flash_method"+i] = $("#flash_method"+i).val();
		}
		postdata["CallWaitingEnable"+i] = $("#CallWaitingEnable"+i).val();
		postdata["ThreeWayCallingEnable"+i] = $("#ThreeWayCallingEnable"+i).val();
		if(operator_name == "ARG_CLARO")
		{
			postdata["CallerIDEnable"+i] = $("#CallerIDEnable"+i).val();
		}
		postdata["TransmitGain"+i] = $("#TransmitGain"+i).val();
		postdata["ReceiveGain"+i] = $("#ReceiveGain"+i).val();
		if(operator_name == "MY_TM")
		{
			postdata["ComfortNoiseEnable"+i] = $("#ComfortNoiseEnable"+i).val();
            postdata["CallForwardingEnable"+i] = $("#CallForwardingEnable"+i).val();
		}
        if(operator_name == "ECU_CNT")
        {
        	postdata["MessagetWaiting"+i] = getCheckbox("message_waiting"+i);
        }
        if(operator_name == "PLE_PALTEL" || operator_name == "ECU_CNT"  || operator_name == "MY_TM")
        {
            if($("#hotline_enable"+i).prop("checked")){
                postdata["hotline_enable"+i] = "1";
                postdata["Hotelinetime_text"+i] = $("#Hotelinetime_text"+i).val();
                postdata["Hotline_number_text"+i] = $("#Hotline_number_text"+i).val();
            }else
            {
                postdata["hotline_enable"+i] = "0";
            }
            
        }
        if(operator_name == "TH_AIS")
        {
            postdata["callForwardUnconditional"+i] = getCheckbox("callForwarding_unconditional"+i);
            postdata["callForwardUnconditionalNumber"+i] = $("#callForwarding_unconditional_number"+i).val();
            postdata["callForwardBusy"+i] = getCheckbox("callForwarding_busy"+i);
            postdata["callForwardBusyNumber"+i] = $("#callForwarding_busy_number"+i).val();
            postdata["callForwardNoReply"+i] = getCheckbox("callForwarding_noreply"+i);
            postdata["callForwardNoReplyNumber"+i] = $("#callForwarding_noreply_number"+i).val();
        }
        console.log(postdata);
	}
	XHR.post("set_voice_advance_info", postdata, initPage);

}


