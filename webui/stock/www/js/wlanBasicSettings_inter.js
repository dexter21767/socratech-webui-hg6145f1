var sessionidstr = "";
var operator_name = gOperatorName;
var fttr_type = gFttr_type;
var multiAP = "";
var device_type = gModelName;
var wifidata = "";
var band_steering = "";
var selectIdx = 0;
var channel_TH_AIS = "1,2,3,4,5,6,7,8,9,10,11";
var wifi_type = gWifiCap;
var custom = "";
var user_type = gLoginUser;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	if (operator_name == "SFU_COMMON") {
		XHR.get("get_common_custom", null, function(data) {
			custom = data.custom
		});
	}

	generateHtml();
	initValidate();
	
	if(gOperatorMode == "13" && operator_name == "MY_TM")
	{
		$(":input").attr("disabled", true);
		$("#WlanBandWidth_select").attr("disabled", false);
		$("#WlanChannel_select").attr("disabled", false);
		$("#wireless_apply").attr("disabled", false);
		$("#wireless_cancel").attr("disabled", false);
	}
	if (!(gOperatorMode == "3" && gOperatorName == "TH_AIS")) {
		customSwitchInit();
	}
	customPasswordInit();

	$("#wlcfg_wlgMode").bind("change", function() {
		displayControl();
	});

	$("#WlanEnable_container").bind("click", function() {
		submitWifiEnable();
	});

	if (operator_name == "TUR_TURKSAT") {
		$("#WlanChannel_select").bind("change", function() {
			if ($("#WlanChannel_select").val() == "0") {
				$("#auto_channel_trriger").show();
			} else {
				$("#auto_channel_trriger").hide();
			}
		});
	}
	//泰国3BB wifi6设备隐藏802.11ax，显示定制化802.11b/g/n/ax
	if (((operator_name == "TH_3BB" || operator_name == "TH_AIS" ) && (wifi_type == "1"))) {
		$("#wlcfg_wlgMode option[value=ax]").hide();

		//$("#wlcfg_wlgMode option[value=bgnax]").show();
		$("#wlcfg_wlgMode").append("<option value='bgnax'>802.11 b/g/n/ax</option>");
	}
    
    if ((( operator_name == "MY_TM") && (wifi_type == "1")) || (operator_name == "PAK_CYBERNET" && device_type == "HG6144F")) {
    	$("#wlcfg_wlgMode option[value=ax]").hide();
    	//$("#wlcfg_wlgMode option[value=bgnax]").show();
    	$("#wlcfg_wlgMode").append("<option value='ax'>802.11 b/g/n/ax</option>");
    }
	if (operator_name == "BZ_VERO") {
		$("#mode_ax").html("802.11 a/n/ac/ax");
	}
	if (operator_name == "TH_AIS") {
		$(".main_item_name").css("width", "20%");
		$(".main_item_content").css("width", "calc(80% - 3px)");
		//$("#mode_ax").html("802.11 b/g/n/ax");

		$("#ssid_choice_div").show();
		$("#ssid_choice").bind("change", function() {
			var sel = $(this).val() - 1;
			fillCurrentSel(sel);
		});
		$("#WlanChannel_select").bind("change", function() {
			show_channel_ais();
		});
		generateoption();
		XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);
	}

	if (gDebug) {
		getDataByAjax("../fake/wlanAdvanced", initPage);
	}
	else {
		XHR.get("get_multiAP_enable", null, multiInfo);
		XHR.get("wlanBasicSettings", null, initPage);
	}
	//厄瓜多尔新增定制化需求：增加DTIM priod
	if (operator_name == "ECU_CNT") {
		$("#dtim_period_div").show();
	}

	//印尼电信隐藏802.11ax
	if ((operator_name == "IDN_TELKOM" && device_type == "HG6145F") || (wifi_type == "0")) {
		$("#wlcfg_wlgMode option[value=ax]").hide();
	}

	if (operator_name == "TUR_TURKSAT") {
		if ($("#WlanChannel_select").val() == "0") {
			$("#auto_channel_trriger").show();
		} else {
			$("#auto_channel_trriger").hide();
		}

	}

	if (operator_name == "CHL_ENTEL") {
		$("#mode_ax").html("802.11 b/g/n/ax");
	}

	//墨西哥telmex禁用web配置2.4G带宽
	if (operator_name == "MEX_TELMEX") {
		$("#WlanBandWidth_select").attr("disabled", true);
	}

	if (operator_name == "MEX_TP" && user_type == "0") {
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
	}

	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
		$("#switch_ROM_RCSRDS").show();
		$("#switch").hide();
	}

	if ( operator_name == "MY_TM") {
			$("#wifi6").show();
			if(operator_name == "MY_TM"){
				$("#fast_roaming_div").show();
				$("#airtime_faines_div").show();
				$("#beamforming_div").show();
				$("#ssid_mimo_enable").attr("disabled", true);
				$("#ssid_mimo_disable").attr("disabled", true);
				$("#ssid_ofdma_enable").attr("disabled", true);
				$("#ssid_ofdma_disable").attr("disabled", true);
			}
		
	}

	if (operator_name == "IDN_TELKOM" && device_type == "HG6145F1") {
		if ($("#wlcfg_wlgMode").val() == "ax") {
			$("#wifi6").show();
			$("#bsscolorEnable_div").show();
		}
	}

	if (operator_name == "BZ_INTELBRAS" && device_type == "HG6145F3") {
		if ($("#wlcfg_wlgMode").val() == "ax") {
			$("#wifi6").show();
			$("#beamforming_div").show();
			$("#bsscolorEnable_div").show();
		}
	}
	
	if ((gOperatorMode == "3" && gOperatorName == "TH_AIS") || (operator_name == "FTTR_SUB_COMMON" && multiAP == "1")) {
		if ((operator_name == "FTTR_SUB_COMMON" && multiAP == "1"))
			$("#multiap_tip").show();

		$("#wlcfg_wlgMode").attr("disabled", true);
		$("#dtim_period").attr("disabled", true);

		//$("#basicDomain").attr("disabled",true);
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
		$("#auto_channel_trriger_button").attr("disabled", true);
		$("#auto_choice_recommend").attr("disabled", true);
		$("#auto_choice_custom").attr("disabled", true);
		$("#auto_custom_channel_div").attr("disabled", true);
		$("#GuardInterval_select").attr("disabled", true);
		//document.getElementById('wireless_apply_cancel').style.display = 'none';
		$(".main_header_hint").html("basic_prompt_ap_mode".i18n());
	}
	else {
		$(".main_header_hint").html("basic_prompt".i18n());
	}

});

function show_value() {
	if ($("input[name='ssid_bssscolor']:first").is(":checked")) {
		$("#BSSColorValue_div").show()
		if($("#BSSColorValue").val() == "0"){
			$("#BSSColorValue").val("");
		}
	} else {
		$("#BSSColorValue_div").hide()
	}
}

function setAtuoChannelTrriger() {
	if (operator_name == "TUR_TURKSAT") {
		show_shadow();
		$("#auto_channel_trriger_button").attr("disabled", true);
		var timeoutObj = setTimeout(function() {
			$("#auto_channel_trriger_button").removeAttr("disabled");
			clearTimeout(timeoutObj);
		}, 10000)
		var postdata = new Object();
		postdata.action = "0";

		XHR.post("set_atuoChannelr", postdata, initPage);
	}
}


function multiInfo(data) {
	multiAP = data.multiAP_enable.Enable;
	if (multiAP == "1") {
		if (operator_name == "TH_AIS") {
			$("#show").show();
		}
		else {
			$("#switch").hide();
			if(gNewUiFlag){
				$("#wifi_enable_apply_div").hide();
				$("#line").hide();
			}
		}
	}

}

function getchannelList() {
	XHR.get("get_wifi_possible_channels_2g", null, setchannelListHtml);
}

function setchannelListHtml(data) {
	var channelListHTML = "<option value='0'>" + 'basic_frequency_auto'.i18n() + "</option>";
	if (data && data.channels != undefined && data.channels.indexOf("-") > -1) {
		var arr = data.channels.split("-");
		for (var i = parseInt(arr[0]); i <= parseInt(arr[1]); i++) {
			channelListHTML += "<option value='" + i + "'>" + 'channel'.i18n() + " " + i + "</option>";
		}
	}
	$("#WlanChannel_select").html(channelListHTML);
}

function generateHtml() {
	if (operator_name != "COMMON" && operator_name != "SFU_COMMON" && operator_name != "MAGYAR_4IG"
		&& operator_name != "FTTR_MAIN_SFU_COMMON" && operator_name != "FTTR_SUB_COMMON" && operator_name != "AP_COMMON" && operator_name != "ALB_AFT") {
		$("#basicDomain").attr("disabled", true);
	}

	if (operator_name == "SFU_COMMON") {
		if (custom == "IDN_ICON") {
			$("#basicDomain").attr("disabled", true);
		}
	}

	//var channelListHTML = "<option value='0'>"+'basic_frequency_auto'.i18n()+"</option><option value='1'>"+'channel'.i18n()+"1</option><option value='2'>"+'channel'.i18n()+"2</option><option value='3'>"+'channel'.i18n()+"3</option><option value='4'>"+'channel'.i18n()+"4</option><option value='5'>"+'channel'.i18n()+"5</option><option value='6'>"+'channel'.i18n()+"6</option><option value='7'>"+'channel'.i18n()+"7</option><option value='8'>"+'channel'.i18n()+"8</option><option value='9'>"+'channel'.i18n()+"9</option><option value='10'>"+'channel'.i18n()+"10</option><option value='11'>"+'channel'.i18n()+"11</option>";
	//	channelListHTML += "</option><option value='12'>"+'channel'.i18n()+"12</option><option value='13'>"+'channel'.i18n()+"13</option>"; 
	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE") {
		var bandWidthListHtml = "<option value='2'>Auto 20/40 MHz</option>"
	} else {
		var bandWidthListHtml = "<option value='2'>20MHz/40MHz</option>"
	}
	bandWidthListHtml += "<option value='0'>20MHz</option><option value='1'>40MHz</option>";
	if(operator_name == "ALGERIA_TELECOM"){
		bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='2'>20MHz/40MHz</option>";
	}

	var gData;
	var basicDomainJSON = { "ET": "domain0", "FC": "domain1", "TH": "domain2", "PH": "domain3", "ID": "domain4", "BR": "domain5", "IN": "domain6", "AM": "domain7", "MY": "domain8", "PK": "domain9", "RU": "domain10", "CN": "domain11", "CL": "domain12", "US": "domain13", "MM": "domain14", "EC": "domain15", "CO": "domain16", "AR": "domain17", "LK": "domain18", "IR": "domain19", "YM": "domain20", "SA": "domain21", "KW": "domain22", "IQ": "domain23", "PS": "domain25", "MX": "domain26", "CI": "domain27", "EG": "domain28","MA":"domain29","ES":"domain30","PY":"domain31","JO":"domain32"};

	var basicDomainHtml = [];
	for (var key in basicDomainJSON) {
		var domain = basicDomainJSON[key];
		basicDomainHtml += '<option value="' + key + '">' + domain.i18n() + '</option>';
	}
	$("#basicDomain").html(basicDomainHtml);
	$("#WlanBandWidth_select").html(bandWidthListHtml);
	//$("#WlanChannel_select").html(channelListHTML);
}

function bandsteeringInfo(data) {
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function initPage(data) {
	getchannelList();
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			sessionidstr = getdata.sessionid;
		}
	});
	if (data && data.wifi_status) {
		basicData = data.wifi_status;
		displayHtml();
		if (operator_name == "TH_AIS") {
			XHR.get("get_wifi_status", null, fillData);
		}
	}

}

function fillData(data) {
	if (data && data.wifi_status) {

		wifidata = data.wifi_status;
		var ssidSelectOption = [];
		for (var i = 1; i <= wifidata.length; i++) {
			//没开启mesh，开启bandsteering时，advance页面只有ssid2-4
			if (multiAP == "0" && band_steering == "1") {
				if (i == 1) {
					continue;
				}
			}
			ssidSelectOption += '<option value="' + i + '">' + i + '</option>';
		}
		$("#ssid_choice").html(ssidSelectOption);
		fillCurrentSel(selectIdx);
	}


}

//规则校验
function initValidate() {
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"BSSColorValue":{range_int:[1,63] , required: true},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
			return true;
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");	
			return false;
		}
	}); 
}

function saveApply() {
	if (!$("#wlanAdv_settings_form").valid()) {
		alert("illegal_value_alert".i18n());
		return;
	}
	show_shadow();
	var postdata = new Object();
	postdata.mode = "setWifiValue";

	if (multiAP == "1") {
		postdata.multiAP_enable = "1";
	}

	if (operator_name == "COMMON" || (operator_name == "SFU_COMMON" && custom != "IDN_ICON") || operator_name == "MAGYAR_4IG"
		|| operator_name == "FTTR_MAIN_SFU_COMMON" || operator_name == "FTTR_SUB_COMMON" || operator_name == "AP_COMMON" || operator_name == "ALB_AFT") {
		postdata.RegulatoryDomain = $("#basicDomain").val();
	}
	postdata.X_FH_ChannelWidth = $("#WlanBandWidth_select").val();
	postdata.Channel = $("#WlanChannel_select").val();
	if (postdata.Channel == "0") {
		postdata.AutoChannelEnable = "1";
	} else {
		postdata.AutoChannelEnable = "0";
	}
	postdata.X_FH_SGI = $("#GuardInterval_select").val();
	postdata.device_type = device_type;
	if (operator_name == "TH_AIS") {
		selectIdx = $("#ssid_choice").val() - 1;
		postdata.wifiIndex = $("#ssid_choice").val();
		postdata.X_FH_ChannelList = calcBindList();
		postdata.Standard = $("#wlcfg_wlgMode").val();
	} else {
		postdata.Standard = $("#wlcfg_wlgMode").val();
	}

	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
		postdata.RadioEnabled = $("#Wlcfg_switch").val();
	}
	if (gOperatorMode == "3" && gOperatorName == "TH_AIS") {
		return;
	}
	if (gOperatorName == "MY_TM" ) {
        postdata.fastromingEnable = $("input[name='ssid_fast_roaming']:checked").val();
		postdata.aritimeFairEnable = $("input[name='ssid_airtime_faines']:checked").val();
		postdata.beamformingEnable = $("input[name='ssid_beamforming']:checked").val();
		postdata.twtEnable = $("input[name='ssid_twt']:checked").val();
	}

    if(gOperatorName == "IDN_TELKOM" && $("#wlcfg_wlgMode").val() == "ax"){
		postdata.mimoEnable = $("input[name='ssid_mimo']:checked").val();
		postdata.ofdmaEnable = $("input[name='ssid_ofdma']:checked").val();
		postdata.twtEnable = $("input[name='ssid_twt']:checked").val();
		postdata.bsscolorEnable = $("input[name='ssid_bssscolor']:checked").val();
		if (postdata.bsscolorEnable == "1")
			postdata.bssColorValue = $("#BSSColorValue").val();
		else
			postdata.bssColorValue = "0";
	}
	if(gOperatorName == "BZ_INTELBRAS" && $("#wlcfg_wlgMode").val() == "ax" && device_type == "HG6145F3"){
		postdata.mimoEnable = $("input[name='ssid_mimo']:checked").val();
		postdata.ofdmaEnable = $("input[name='ssid_ofdma']:checked").val();
		postdata.twtEnable = $("input[name='ssid_twt']:checked").val();
		postdata.beamformingEnable = $("input[name='ssid_beamforming']:checked").val();
		postdata.bsscolorEnable = $("input[name='ssid_bssscolor']:checked").val();
		if (postdata.bsscolorEnable == "1")
			postdata.bssColorValue = $("#BSSColorValue").val();
		else
			postdata.bssColorValue = "0";
	}
	postdata.custom = custom;
	XHR.post("setWlanBasicCfg", postdata, initPage);
}

function submitWifiEnable() {
	show_shadow();
	var postdata = new Object();
	postdata.mode = "setWifiEnable";
	if(gNewUiFlag){
		postdata.RadioEnabled = $("input[name='wifi_enable']:checked").val();
	}else{
		postdata.RadioEnabled = $("input[name='data.ssidEnable']").val();
	}
	
	if (gOperatorMode == "3" && gOperatorName == "TH_AIS") {
		return;
	}
	XHR.post("setWlanBasicCfg", postdata, initPage);
	//initPage();                                                
}

function displayControl() {
	var guradListHtml;
	//墨西哥telmex禁用web配置2.4G带宽
	if (operator_name == "MEX_TELMEX") {
		$("#WlanBandWidth_select").attr("disabled", true);
	} else if (operator_name == "MEX_TP" && user_type == "0") {
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
	} else {
		if ($("#wlcfg_wlgMode").val() == "b" || $("#wlcfg_wlgMode").val() == "g" || $("#wlcfg_wlgMode").val() == "bg") {

			$("#WlanBandWidth_select").attr("disabled", true);
			$("#WlanBandWidth_select").val("0");
		} else if ($("#wlcfg_wlgMode").val() == "n" || $("#wlcfg_wlgMode").val() == "bgn" || $("#wlcfg_wlgMode").val() == "bgnax" || $("#wlcfg_wlgMode").val() == "ax") {
			$("#WlanBandWidth_select").attr("disabled", false);
		}
	}
	if ($("#wlcfg_wlgMode").val() == "ax" || $("#wlcfg_wlgMode").val() == "bgnax") {
		guradListHtml = "<option value='1'>0.8us</option><option value='2'>1.6us</option> <option value='3'>3.2us</option><option value='4'>Auto</option>";
	} else {
		guradListHtml = "<option value='0'>0.4us</option><option value='1'>0.8us</option> <option value='4'>Auto</option>"
	}
	$("#GuardInterval_select").html(guradListHtml);


	if (operator_name == "MY_TM") {
			$("#wifi6").show();
			if(operator_name == "MY_TM"){
				$("#fast_roaming_div").show();
				$("#airtime_faines_div").show();
				$("#beamforming_div").show();
				$("#ssid_mimo_enable").attr("disabled", true);
				$("#ssid_mimo_disable").attr("disabled", true);
				$("#ssid_ofdma_enable").attr("disabled", true);
				$("#ssid_ofdma_disable").attr("disabled", true);
			}else{
				$("#bsscolorEnable_div").show();
				if( $("input[name='ssid_bssscolor']:eq(0)").prop("checked"))
					$("#BSSColorValue_div").show();
			}
		
    }


	if (operator_name == "IDN_TELKOM" && device_type == "HG6145F1") {
		if($("#wlcfg_wlgMode").val() == "ax"){
			$("#wifi6").show();
			$("#bsscolorEnable_div").show();
			if( $("input[name='ssid_bssscolor']:eq(0)").prop("checked"))
				$("#BSSColorValue_div").show();
			
		}else{
			$("#wifi6").hide();
		}
    }
	if (operator_name == "BZ_INTELBRAS" && device_type == "HG6145F3") {
		if($("#wlcfg_wlgMode").val() == "ax"){
			$("#wifi6").show();
			$("#bsscolorEnable_div").show();
			if( $("input[name='ssid_bssscolor']:eq(0)").prop("checked"))
				$("#BSSColorValue_div").show();
			
		}else{
			$("#wifi6").hide();
		}
    }
}


function displayHtml() {
	var guradListHtml;
	if (operator_name != "ROM_RCSRDS" && operator_name != "MAGYAR_4IG") {
		if(gNewUiFlag){
			if(basicData.RadioEnabled == "1"){
				$("input[name='wifi_enable']:first").attr('checked', 'checked');
			}else{
				$("input[name='wifi_enable']:last").attr('checked', 'checked');
			}
		}else{
			setSwitchValue("WlanEnable_container", basicData.RadioEnabled);
		}
	} else {

		$("#Wlcfg_switch").val(basicData.RadioEnabled);
	}

	if (operator_name == "TH_AIS") {
		$("#wlcfg_wlgMode").val(basicData.X_FH_Standard_Ex);
	}
	else {
		$("#wlcfg_wlgMode").val(basicData.Standard);
	}
	$("#dtim_period").val(basicData.X_FH_DTIMperiod);
	$("#basicDomain").val(basicData.RegulatoryDomain);
	$("#WlanBandWidth_select").val(basicData.X_FH_ChannelWidth);
	$("#WlanChannel_select").val(basicData.Channel);
    
    if (basicData.airtimefairnesEnable == "0") {
    	$("input[name='ssid_airtime_faines']:eq(1)").prop("checked", true);
    } else if(basicData.airtimefairnesEnable == "1") {
    	$("input[name='ssid_airtime_faines']:eq(0)").prop("checked", true);
    }
    
    if (basicData.fastromingEnable == "0") {
    	$("input[name='ssid_fast_roaming']:eq(1)").prop("checked", true);
    } else if(basicData.fastromingEnable == "1") {
    	$("input[name='ssid_fast_roaming']:eq(0)").prop("checked", true);
    }
    
    if (basicData.beamformingEnable == "0") {
    	$("input[name='ssid_beamforming']:eq(1)").prop("checked", true);
    } else if(basicData.beamformingEnable == "1") {
    	$("input[name='ssid_beamforming']:eq(0)").prop("checked", true);
    }
    
	if (basicData.mimoEnable == "0") {
		$("input[name='ssid_mimo']:eq(1)").prop("checked", true);
	} else {
		$("input[name='ssid_mimo']:eq(0)").prop("checked", true);
	}
	if (basicData.ofdmaEnable == "0") {
		$("input[name='ssid_ofdma']:eq(1)").prop("checked", true);
	} else {
		$("input[name='ssid_ofdma']:eq(0)").prop("checked", true);
	}
	if (basicData.twtEnable == "0") {
		$("input[name='ssid_twt']:eq(1)").prop("checked", true);
	} else {
		$("input[name='ssid_twt']:eq(0)").prop("checked", true);
	}
	if (basicData.bsscolorEnable == "0") {
		$("input[name='ssid_bssscolor']:eq(1)").prop("checked", true);
		$("#BSSColorValue_div").hide()
		$("#BSSColorValue").val(basicData.bssColorValue)
	} else if (basicData.bsscolorEnable == "1") {
		$("input[name='ssid_bssscolor']:eq(0)").prop("checked", true);
		if(operator_name == "IDN_TELKOM"){
			$("#BSSColorValue_div").show()
		}
		if(operator_name == "BZ_INTELBRAS" && device_type == "HG6145F3"){
			$("#BSSColorValue_div").show()
		}
		$("#BSSColorValue").val(basicData.bssColorValue)
	}


	//墨西哥telmex禁用web配置2.4G带宽
	if (operator_name == "MEX_TELMEX" || (operator_name == "FTTR_SUB_COMMON" && multiAP == "1")) {
		$("#WlanBandWidth_select").attr("disabled", true);
	} else if (operator_name == "MEX_TP" && user_type == "0") {
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
	} else {
		if (basicData.Standard == "b" || basicData.Standard == "g" || basicData.Standard == "bg") {
			$("#WlanBandWidth_select").attr("disabled", true);
			$("#WlanBandWidth_select").val("0");
		} else if (basicData.Standard == "n" || basicData.Standard == "bgn" || basicData.Standard == "bgnax" || basicData.Standard == "ax") {
			$("#WlanBandWidth_select").attr("disabled", false);
		}
	}
	if ($("#wlcfg_wlgMode").val() == "ax" || $("#wlcfg_wlgMode").val() == "bgnax") {
		guradListHtml = "<option value='1'>0.8us</option><option value='2'>1.6us</option> <option value='3'>3.2us</option><option value='4'>Auto</option>";
	} else {
		guradListHtml = "<option value='0'>0.4us</option><option value='1'>0.8us</option> <option value='4'>Auto</option>"
	}
	$("#GuardInterval_select").html(guradListHtml);
	$("#GuardInterval_select").val(basicData.X_FH_SGI);
	if (operator_name == "TH_AIS") {
		show_channel_ais();
		var channelist = basicData.X_FH_ChannelList;
		if (channelist == channel_TH_AIS) {
			$("input[name='auto_choice']:eq(0)").prop("checked", true);
			show_custom_channel(1);
		} else {
			$("input[name='auto_choice']:eq(1)").prop("checked", true);
			show_custom_channel(0);
		}
		var bindlist_array = channelist.split(',');
		for (var i = 0; i < bindlist_array.length; i++) {
			var singlebind = bindlist_array[i];
			$("input[name='custom_channel']").each(function(i) {
				if ($(this).val() == singlebind) {
					$(this).prop("checked", true);
				}
			});
		}
		if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
			var custom_channel;
			for (var m = 1; m < 14; m++) {
				custom_channel = "custom_channel" + m;
				$("#" + custom_channel).attr("disabled", true);
			}
		}
	}
}

function CancelBtn() {
	displayHtml();
}

function fillCurrentSel(sel) {
	var data = wifidata[sel];
	if (sel == 1 || sel == 2 || sel == 3) {
		$("#other_info_div").hide();
	} else {
		$("#other_info_div").show();
	}
	$("#ssid_choice").val((sel + 1));
	$("#wlcfg_wlgMode").val(data.X_FH_Standard_Ex);
}

function generateoption() {
	var dynamicClsListHTML = '';
	for (var m = 1; m < 14; m++) {
		dynamicClsListHTML +=
			"<span class='wifiport'><input type='checkbox' name='custom_channel' value=" + m + " id='custom_channel" + m + "'/>channel" + m + "</span>";

	}
	$("#auto_custom_channel_div").append(dynamicClsListHTML);
}

function show_custom_channel(value) {
	if ($("#auto_channel_ais").is(":visible")) {
		if (value == "0") {
			$("#auto_custom_div").show();
		} else {
			$("#auto_custom_div").hide();
		}
	}

}

function show_channel_ais() {
	if ($("#WlanChannel_select").val() == "0") {
		$("#auto_channel_ais").show();
		if ($("input[name='auto_choice']:eq(1)").attr('checked')) {
			show_custom_channel(0);
		}
	} else {
		$("#auto_channel_ais").hide();
		$("#auto_custom_div").hide();
	}
}

function calcBindList() {
	var bindlist = '';
	var bindlist_after = '';
	if ($("#auto_channel_ais").is(":visible")) {
		if ($("input[name='auto_choice']:eq(1)").attr('checked')) {
			for (var i = 0; i < 13; i++) {
				if ($("input[name='custom_channel']:eq(" + i + ")").attr('checked')) {
					bindlist += (i + 1) + ",";
				}
			}
			bindlist_after = bindlist.substring(0, bindlist.length - 1);
		}
		else {
			bindlist_after = channel_TH_AIS;
		}
	}
	return bindlist_after;
}


