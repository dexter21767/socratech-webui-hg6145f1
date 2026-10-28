var sessionidstr = "";
var voicedata;
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
		getDataByAjax("../fake/voice_advance", initPage);
	}
	else
	{
		XHR.get("get_voice_advance_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_advance_form").validate({
		debug: true,
		rules: {
			"SipLocalPort_text": {required: true, range_int:[1025,65535]},
			"RegisterExpires_text": {required: true, range_int:[20,65535]},
			"RegisterRetryInterval_text": {required: true, range_int:[1,65535]},
			"SessionExpires_text": {required: true, range_int:[120,3600]},
			"RtpPortStart_text": {required: true, range_int:[1026,65494]},
			"RtpPortEnd_text": {required: true, range_int:[1032,65535]},
			"SipDSCPMark_text": {required: true, range_int:[0,63]},
			"RtpDSCPMark_text": {required: true, range_int:[0,63]},
			"DSPRXGain_text": {required: true, range_int:[-14,6]},
			"DSPTXGain_text": {required: true, range_int:[-14,6]},
			"FlashMin_text": {required: true, range_int:[50,500]},
			"FlashMax_text": {required: true, range_int:[50,2000]},
			"RingVoltage_text": {required: true, range_int:[45,65]},
			"Jitterbuffer_min": {required: true},
			"Jitterbuffer_max": {required: true},
			"JBFaxSize": {required: true, range_int:[30,200]},
			"G722Priority_text": {required: true, range_int:[1,4]},
			"G722RtpPackageInterval_text": {required: true},
			"G711aPriority_text": {required: true, range_int:[1,4]},
			"G711aRtpPackageInterval_text": {required: true},
			"G711uPriority_text": {required: true, range_int:[1,4]},
			"G711uRtpPackageInterval_text": {required: true},
			"G729Priority_text": {required: true, range_int:[1,4]},
			"G729RtpPackageInterval_text": {required: true}
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
	
	if (getdata != null && getdata.voice_advance)
	{
		voicedata = getdata.voice_advance;
		$("#URIType_select").val(voicedata.URIType);
		$("#DTMFMethod_select").val(voicedata.DTMFMethod);
		$("#SipLocalPort_text").val(voicedata.UserAgentPort);
		$("#RegisterExpires_text").val(voicedata.RegisterExpires);
		$("#RegisterRetryInterval_text").val(voicedata.RegisterRetryInterval);
		if (getOperator() == "CM")
			$("#SessionUpdateTimer_text").val(voicedata.SessionExpires);
		else
			$("#SessionExpires_text").val(voicedata.SessionExpires);
		$("#RtpPortStart_text").val(voicedata.LocalPortMin);
		$("#RtpPortEnd_text").val(voicedata.LocalPortMax);
		setCheckbox("PRACKEnable_checkbox", voicedata.sendReliableResponse);
		setCheckbox("BootDeRegisterEnable_checkbox", voicedata.BootDeRegisterEnable);
		$("#SipDSCPMark_text").val(voicedata.SIPDSCPMark);
		$("#RtpDSCPMark_text").val(voicedata.RTPDSCPMark);
		$("#DSPRXGain_text").val(voicedata.ReceiveGain);
		$("#DSPTXGain_text").val(voicedata.TransmitGain);
		$("#FlashMin_text").val(voicedata.FlashMin);
		$("#FlashMax_text").val(voicedata.FlashMax);
		setCheckbox("EchoCancelEnable_checkbox", voicedata.EchoCancellationEnable);
		setCheckbox("VadCngEnable_checkbox", voicedata.SilenceSuppression);
		$("#RingVoltage_text").val(voicedata.ring_vol);
		setCheckbox("ECEnable", voicedata.HighFaxECEnable);
		$("#Jitterbuffer_min").val(voicedata.JBMinSize);
		$("#Jitterbuffer_max").val(voicedata.JBMaxSize);
		$("#JBFaxSize").val(voicedata.JBFaxSize);
		setCheckbox("TimeEnable", voicedata.bEnabledate);
		//setCheckbox("DisplayName", voicedata.DisplayName);
		$("#Polarity_select").val(voicedata.PolarityReversalMode);
		setCheckbox("G722Enable_checkbox", voicedata.g722_Enable);
		$("#G722Priority_text").val(voicedata.g722_Priority);
		$("#G722RtpPackageInterval_text").val(voicedata.g722_PacketizationPeriod);
		setCheckbox("G711aEnable_checkbox", voicedata.g711a_Enable);
		$("#G711aPriority_text").val(voicedata.g711a_Priority);
		$("#G711aRtpPackageInterval_text").val(voicedata.g711a_PacketizationPeriod);
		setCheckbox("G711uEnable_checkbox", voicedata.g711u_Enable);
		$("#G711uPriority_text").val(voicedata.g711u_Priority);
		$("#G711uRtpPackageInterval_text").val(voicedata.g711u_PacketizationPeriod);
		setCheckbox("G729Enable_checkbox", voicedata.g729_Enable);
		$("#G729Priority_text").val(voicedata.g729_Priority);
		$("#G729RtpPackageInterval_text").val(voicedata.g729_PacketizationPeriod);
	}
	
	displayControl();
}


function displayControl()
{
	if ( getCheckbox("G722Enable_checkbox") )
	{
		$("#G722Priority_text").attr("disabled", false);
		$("#G722RtpPackageInterval_text").attr("disabled", false);
	}
	else
	{
		$("#G722Priority_text").attr("disabled", true);
		$("#G722RtpPackageInterval_text").attr("disabled", true);
	}
	
	if ( getCheckbox("G729Enable_checkbox") )
	{
		$("#G729Priority_text").attr("disabled", false);
		$("#G729RtpPackageInterval_text").attr("disabled", false);
	}
	else
	{
		$("#G729Priority_text").attr("disabled", true);
		$("#G729RtpPackageInterval_text").attr("disabled", true);
	}
	
	if ( getCheckbox("G711aEnable_checkbox") )
	{
		$("#G711aPriority_text").attr("disabled", false);
		$("#G711aRtpPackageInterval_text").attr("disabled", false);
	}
	else
	{
		$("#G711aPriority_text").attr("disabled", true);
		$("#G711aRtpPackageInterval_text").attr("disabled", true);
	}
	
	if ( getCheckbox("G711uEnable_checkbox") )
	{
		$("#G711uPriority_text").attr("disabled", false);
		$("#G711uRtpPackageInterval_text").attr("disabled", false);
	}
	else
	{
		$("#G711uPriority_text").attr("disabled", true);
		$("#G711uRtpPackageInterval_text").attr("disabled", true);
	}
	
	if (voicedata.ServerType == 2 )
	{
		$(".sip_item").each(function (i){
			$(this).hide();
		});
	}
	else
	{
		$(".sip_item").each(function (i){
			$(this).show();
		});
		if (getOperator() == "CM")
		{
			$("#SessionExpires_div").hide();
			$("#SessionUpdateTimer_div").show();
		}
		else
		{
			$("#SessionExpires_div").show();
			$("#SessionUpdateTimer_div").hide();
		}
	}
}

function saveApply()
{
	if( ! $("#voice_advance_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	if (parseInt($('#FlashMin_text').val()) > parseInt($('#FlashMax_text').val()))
	{
		alert("拍叉最短时间必须小于等于拍叉最长时间");
		return;
	}
	if (parseInt($('#Jitterbuffer_min').val()) > parseInt($('#Jitterbuffer_max').val()))
	{
		alert("Jitterbuffer的最小配置不能大于最大配置");
		return;
	}
	if (parseInt($('#RtpPortStart_text').val()) > parseInt($('#RtpPortEnd_text').val()))
	{
		alert("本地RTP端口号最小值必须小于等于本地RTP端口号最大值");
		return;
	}	
	
	var postdata = new Object();
	postdata.ServerType = voicedata.ServerType;
	postdata.URIType = $("#URIType_select").val();
	postdata.DTMFMethod = $("#DTMFMethod_select").val();
	postdata.UserAgentPort = $("#SipLocalPort_text").val();
	postdata.RegisterExpires = $("#RegisterExpires_text").val();
	postdata.RegisterRetryInterval = $("#RegisterRetryInterval_text").val();
	if ( getOperator() == "CM" )
		postdata.SessionExpires = $("#SessionUpdateTimer_text").val();
	else
		postdata.SessionExpires = $("#SessionExpires_text").val();
	postdata.LocalPortMin = $("#RtpPortStart_text").val();
	postdata.LocalPortMax = $("#RtpPortEnd_text").val();
	postdata.sendReliableResponse = getCheckbox("PRACKEnable_checkbox");
	postdata.BootDeRegisterEnable = getCheckbox("BootDeRegisterEnable_checkbox");
	postdata.SIPDSCPMark = $("#SipDSCPMark_text").val();
	postdata.RTPDSCPMark = $("#RtpDSCPMark_text").val();
	postdata.ReceiveGain = $("#DSPRXGain_text").val();
	postdata.TransmitGain = $("#DSPTXGain_text").val();
	postdata.FlashMin = $("#FlashMin_text").val();
	postdata.FlashMax = $("#FlashMax_text").val();
	postdata.EchoCancellationEnable = getCheckbox("EchoCancelEnable_checkbox");
	postdata.SilenceSuppression = getCheckbox("VadCngEnable_checkbox");
	postdata.ring_vol = $("#RingVoltage_text").val();
	postdata.HighFaxECEnable = getCheckbox("ECEnable");
	postdata.JBMinSize = $("#Jitterbuffer_min").val();
	postdata.JBMaxSize = $("#Jitterbuffer_max").val();
	postdata.JBFaxSize = $("#JBFaxSize").val();
	postdata.bEnabledate = getCheckbox("TimeEnable");
	//postdata.DisplayName = getCheckbox("DisplayName");
	postdata.PolarityReversalMode = $("#Polarity_select").val();
	postdata.g722_Enable = getCheckbox("G722Enable_checkbox");
	postdata.g722_Priority = $("#G722Priority_text").val();
	postdata.g722_PacketizationPeriod = $("#G722RtpPackageInterval_text").val();
	postdata.g711a_Enable = getCheckbox("G711aEnable_checkbox");
	postdata.g711a_Priority = $("#G711aPriority_text").val();
	postdata.g711a_PacketizationPeriod = $("#G711aRtpPackageInterval_text").val();
	postdata.g711u_Enable = getCheckbox("G711uEnable_checkbox");
	postdata.g711u_Priority = $("#G711uPriority_text").val();
	postdata.g711u_PacketizationPeriod = $("#G711uRtpPackageInterval_text").val();
	postdata.g729_Enable = getCheckbox("G729Enable_checkbox");
	postdata.g729_Priority = $("#G729Priority_text").val();
	postdata.g729_PacketizationPeriod = $("#G729RtpPackageInterval_text").val();
	postdata.sessionid = sessionidstr;
	XHR.post("set_voice_advance_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


