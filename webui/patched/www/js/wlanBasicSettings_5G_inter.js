var sessionidstr = "";
var operator_name = gOperatorName;
var multiAP = "";
var cur_Channel = 0;
var device_type = gModelName;
var wifidata = "";
var band_steering = "";
var selectIdx = 0;
var channel_TH_AIS_5G = "36,40,44,48,52,56,60,64,149,153,157,161";
var wifi_type = gWifi5Cap;
var basicData;
var inner_index;
var fttr_type = gFttr_type;
var custom = "";
var user_type = gLoginUser;
var possible_channels_5g;
var channels_5g = [];
var DFSChannelList;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	if (operator_name == "SFU_COMMON") {
		XHR.get("get_common_custom", null, function(data) {
			custom = data.custom
		});
	}
	if(gOperatorMode == "13" && operator_name == "MY_TM")
	{
		$(":input").attr("disabled", true);
		$("#WlanBandWidth_select").attr("disabled", false);
		$("#WlanChannel_select").attr("disabled", false);
		$("#wireless_apply").attr("disabled", false);
		$("#wireless_cancel").attr("disabled", false);
	}
	XHR.get("get_multiAP_enable", null, multiInfo);
	generateHtml();
	initValidate();
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

	//厄瓜多尔新增定制化需求：增加DTIM priod
	if (operator_name == "ECU_CNT") {
		$("#dtim_period_div").show();
	}
	//印尼电信隐藏802.11ax
	if ((operator_name == "IDN_TELKOM" && (device_type == "HG6145F")) || (wifi_type == "0")) {
		$("#wlcfg_wlgMode option[value=ax]").hide();
	}
	//泰国3BB wifi6设备隐藏802.11ax，显示定制化802.11a/n/ac/ax
	if (((operator_name == "TH_3BB" || operator_name == "TH_AIS") && (wifi_type == "1"))) {
		$("#wlcfg_wlgMode option[value=ax]").hide();

		//$("#wlcfg_wlgMode option[value=anacax]").show();
		$("#wlcfg_wlgMode").append("<option value='anacax'>802.11 a/n/ac/ax</option>");
	}
    
    if ((( operator_name == "MY_TM") && (wifi_type == "1")) || (operator_name == "PAK_CYBERNET" && device_type == "HG6144F")) {
    	$("#wlcfg_wlgMode option[value=ax]").hide();
    
    	//$("#wlcfg_wlgMode option[value=anacax]").show();
    	$("#wlcfg_wlgMode").append("<option value='ax'>802.11 a/n/ac/ax</option>");
    }

	//厄瓜多尔定制化
	if (operator_name == "ECU_CNT") {
		$("#wlcfg_wlgMode").append("<option value='a,n'>802.11 n</option>");
		$("#wlcfg_wlgMode").append("<option value='ac'>802.11 ac</option>");
	}

	if (operator_name == "TUR_TURKSAT") {
		$("#WlanChannel_select").bind("change", function() {
			if ($("#WlanChannel_select").val() == "0") {
				$("#auto_channel_trriger").show();
			} else {
				$("#auto_channel_trriger").hide();
			}
		});
	}

	if (operator_name == "CHL_ENTEL") {
		$("#mode_ax").html("802.11 n/ac/ax");
	}
	else if (operator_name == "BZ_VERO") {
		$("#mode_ax").html("802.11 a/n/ac/ax");
	}
	if (operator_name == "TH_AIS") {
		$(".main_item_name").css("width", "20%");
		$(".main_item_content").css("width", "calc(80% - 3px)");
		$("#ssid_choice_div").show();
		//$("#mode_ax").html("802.11 a/n/ac/ax");
		$("#ssid_choice").bind("change", function() {
			var sel = $(this).val() - 5;
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
		XHR.get("wlanBasicSettings_5G", null, initPage);
	}

	if (operator_name == "TUR_TURKSAT") {
		if ($("#WlanChannel_select").val() == "0") {
			$("#auto_channel_trriger").show();
		} else {
			$("#auto_channel_trriger").hide();
		}

	}
	//墨西哥telmex禁用web配置5G带宽与信道
	if (operator_name == "MEX_TELMEX") {
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
	}

	if (operator_name == "MEX_TP" && user_type == "0") {
		$("#wlcfg_wlgMode").attr("disabled", true);
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
		//$("#basicDomain").attr("disabled",true);
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
		$("#auto_choice_recommend").attr("disabled", true);
		$("#auto_choice_custom").attr("disabled", true);
		$("#GuardInterval_select").attr("disabled", true);
		//document.getElementById('wireless_apply_cancel').style.display = 'none';
		$(".main_header_hint").html("basic_prompt_ap_mode".i18n());
	}
	else {
		$(".main_header_hint").html("basic_prompt".i18n());
	}

});

//规则校验
function initValidate()
{	
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"BSSColorValue":{range_int:[1,63],required: true},
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
		postdata.action = "1";

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


function bandsteeringInfo(data) {
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function getchannelList() {
	XHR.get("get_wifi_possible_channels_5g", null, setchannelListHtml);
}

function setchannelListHtml(data) {
	if (operator_name == "BZ_INTELBRAS")
	{
		var channelListHTML = "<option value='36,40,44,48,149,153,157,161,165'>" + 'basic_frequency_auto'.i18n() + "</option>";
		channelListHTML += "<option value='36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165'>" + 'auto_selected_with_dfs'.i18n() + "</option>";
	}
	else
	{
		var channelListHTML = "<option value='0'>" + 'basic_frequency_auto'.i18n() + "</option>";
	}
	
	/*if (data && data.channelsNum > 0)
	{
		for (var i=0; i<data.channelsNum; i++)
		{
			var channels = eval("data.channels_" + i);
			channelListHTML += "<option value='"+channels+"'>"+'channel'.i18n()+channels+"</option>"
		}
	}*/
	if (data && data.channels != undefined && data.channels.length > 0) {
		var arr = data.channels.split(",");
		possible_channels_5g = data.channels;
		channels_5g = arr;
		//console.log("setchannelListHtml channels_5g " + channels_5g);
		for (var i = 0; i < arr.length; i++) {
			channelListHTML += "<option value='" + arr[i] + "'>" + 'channel'.i18n() + " " + arr[i] + "</option>";
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

	var bandWidthListHtml = "<option value='2'>20MHz/40MHz</option><option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>80MHz</option>";
	if ((device_type == "HG6245N" || device_type == "HG6145F1") && operator_name == "ARG_CLARO") {
		bandWidthListHtml = "<option value='2'>20MHz/40MHz</option><option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>20/40/80MHz</option>";
	}
	if ((wifi_type == "0") && operator_name == "BZ_VERO") {
		bandWidthListHtml = "<option value='2'>20MHz/40MHz</option><option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>20/40/80MHz</option>";
	}else if((wifi_type == "1") && operator_name == "BZ_VERO"){
		bandWidthListHtml = "<option value='2'>20MHz/40MHz</option><option value='0'>20MHz</option><option value='1'>40MHz</option><option value='4'>20/40/80/160MHz</option>";
	}

	if (device_type == "HG5855SW" || device_type == "HG6245Y" || device_type == "HG6041V" || device_type == "HG6244V"
		|| device_type == "HG6145F1" || device_type == "HG6145F3" || device_type == "HG6145F4" || device_type == "HG6144F"
		|| device_type == "HG3143F" || device_type == "HG6243F" || device_type == "SR3141M"  || device_type == "HG6371F"
		|| device_type == "HG3141F") {
		if (operator_name == "TH_TRUE" || operator_name == "ARG_CLARO" || operator_name == "TH_AIS") {
			bandWidthListHtml += "<option value='4'>Auto(20/40/80/160MHz)</option>";
		}else {
			if (operator_name == "PAK_CYBERNET" || operator_name == "PAK_PTCL" || operator_name == "JOR_UMNIAH"){
				bandWidthListHtml = "<option value='2'>20MHz/40MHz</option><option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>Auto(20/40/80/160MHz)</option>";
			}else if(operator_name == "ES_DIGI"){
				bandWidthListHtml += "<option value='4'>Auto(20/40/80/160MHz)</option>";
			}else{
				bandWidthListHtml += "<option value='4'>160MHz</option>";
			}
		}
		if(operator_name == "ALGERIA_TELECOM"){
			bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='2'>20MHz/40MHz</option><option value='3'>80MHz</option><option value='4'>160MHz</option><option value='10'>20/40/80/160MHz</option>";
		}

	}

	 if(operator_name == "MY_TM")
		{
			bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>80MHz</option>";
			bandWidthListHtml += "<option value='4'>160MHz</option>";
			bandWidthListHtml += "<option value='10'>20/40/80/160MHz</option>";
		}

	if (operator_name == "ECU_CNT") {
		bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>80MHz</option><option value='4'>160MHz</option><option value='11'>(Auto)40/80/160MHz</option><option value='10'>(Auto)20/40/80/160MHz</option>";
	}

	if (operator_name == "CHL_ENTEL" && device_type == "HG6145F1") {
		bandWidthListHtml = "<option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>80MHz</option><option value='4'>Auto(20/40/80/160MHz)</option>";
	}

	if (operator_name == "PRY_NUCLEO") {
		bandWidthListHtml = "<option value='2'>20MHz/40MHz</option><option value='0'>20MHz</option><option value='1'>40MHz</option><option value='3'>40/80MHz</option>";
	}

	var gData;
	var basicDomainJSON = { "ET": "domain0", "FC": "domain1", "TH": "domain2", "PH": "domain3", "ID": "domain4", "BR": "domain5", "IN": "domain6", "AM": "domain7", "MY": "domain8", "PK": "domain9", "RU": "domain10", "CN": "domain11", "CL": "domain12", "US": "domain13", "MM": "domain14", "EC": "domain15", "CO": "domain16", "AR": "domain17", "LK": "domain18", "IR": "domain19", "YM": "domain20", "SA": "domain21", "KW": "domain22", "IQ": "domain23", "PS": "domain25", "MX": "domain26", "CI": "domain27", "EG": "domain28", "MA": "domain29","ES":"domain30","PY":"domain31","JO":"domain32" };

	var basicDomainHtml = [];
	for (var key in basicDomainJSON) {
		var domain = basicDomainJSON[key];
		basicDomainHtml += '<option value="' + key + '">' + domain.i18n() + '</option>';
	}

	$("#basicDomain").html(basicDomainHtml);
	$("#WlanBandWidth_select").html(bandWidthListHtml);
}

function initPage(data) {
	getchannelList();
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			sessionidstr = getdata.sessionid;
		}
	});

	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE" || operator_name == "MEX_MEGA") {
		$("#dfs_div").show();
		if(operator_name == "MEX_MEGA")
		{
			$("#with_dfs").html("isolation_enable".i18n());
			$("#without_dfs").html("isolation_disable".i18n());
		}
		else
		{
			$("with_dfs").html("with_dfs".i18n());
			$("without_dfs").html("without_dfs".i18n());
		}
	} else {
		$("#dfs_div").hide();
	}
	if (data && data.wifi_status) {
		basicData = data.wifi_status;
		displayHtml();
		if (operator_name == "TH_AIS") {
			XHR.get("get_wifi_status_5G", null, fillData);
		}
	}
}

function fillData(data) {
	if (data && data.wifi_status5g) {

		wifidata = data.wifi_status5g;
		var ssidSelectOption = [];
		for (var i = 1; i <= wifidata.length; i++) {
			//没开启mesh，开启bandsteering时，advance页面只有ssid2-4
			if (multiAP == "0" && band_steering == "1") {
				if (i == 1) {
					continue;
				}
			}
			if (operator_name == "TH_AIS") {
				ssidSelectOption += '<option value="' + (i + 4) + '">' + (i + 4) + '</option>';
			} else {
				ssidSelectOption += '<option value="' + (i + 4) + '">' + i + '</option>';
			}

		}
		$("#ssid_choice").html(ssidSelectOption);
		fillCurrentSel(selectIdx);
	}


}

function saveApply() {
	if( !$("#wlanAdv_settings_form").valid())
	{
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

	if (operator_name == "BZ_INTELBRAS")
	{
		if($("#WlanChannel_select").val() == "36,40,44,48,149,153,157,161,165"
			|| $("#WlanChannel_select").val() == "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165")
		{
			postdata.Channel = 0;
			postdata.X_FH_ChannelList = $("#WlanChannel_select").val();
			postdata.AutoChannelEnable = "1";
		}
		else
		{
			postdata.Channel = $("#WlanChannel_select").val();
			postdata.AutoChannelEnable = "0";
		}
	}
	else
	{
		postdata.Channel = $("#WlanChannel_select").val();
		if (postdata.Channel == "0") {
			postdata.AutoChannelEnable = "1";
		} else {
			postdata.AutoChannelEnable = "0";
		}
	}
	
	postdata.X_FH_GuardInterval = $("#GuardInterval_select").val();
	postdata.X_FH_SGI = $("#GuardInterval_select").val();
	postdata.sessionid = sessionidstr;
	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE" || gOperatorName == "MEX_MEGA") {
		postdata.X_FH_DFSChannelEnable = $("#dfs_setting_select").val();
	}

	if (operator_name == "TH_AIS") {
		selectIdx = $("#ssid_choice").val() - 5;
		postdata.wifiIndex = index;
		postdata.X_FH_ChannelList = calcBindList();
		postdata.Standard = $("#wlcfg_wlgMode").val();
	} else {
		postdata.wifiIndex = inner_index;
		postdata.Standard = $("#wlcfg_wlgMode").val();
	}
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
		postdata.RadioEnabled = $("#Wlcfg_switch").val();
	}

	postdata.device_type = device_type;
	if (gOperatorMode == "3" && gOperatorName == "TH_AIS") {
		return;
	}
    if(gOperatorName == "MY_TM"){
        postdata.fastromamingEnable = $("input[name='ssid_fast_roaming']:checked").val();
        postdata.aritimeFairEnable = $("input[name='ssid_airtime_faines']:checked").val();
        postdata.beamformingEnable = $("input[name='ssid_beamforming']:checked").val();
        postdata.twtEnable = $("input[name='ssid_twt']:checked").val();
    }
    
    if(gOperatorName == "IDN_TELKOM" && $("#wlcfg_wlgMode").val() == "ax"){
        postdata.mimoEnable = $("input[name='ssid_mimo']:checked").val();
        postdata.ofdmaEnable = $("input[name='ssid_ofdma']:checked").val();
        postdata.twtEnable = $("input[name='ssid_twt']:checked").val();
        postdata.bsscolorEnable = $("input[name='ssid_bssscolor']:checked").val();
		if(postdata.bsscolorEnable == "1")
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
	XHR.post("setWlanBasicCfg_5G", postdata, initPage);
}

function submitWifiEnable() {
	show_shadow();
	var postdata = new Object();
	postdata.mode = "setWifiEnable";
	postdata.wifiIndex = inner_index;
	if(gNewUiFlag){
		postdata.RadioEnabled = $("input[name='wifi_enable']:checked").val();
	}else{
		postdata.RadioEnabled = $("input[name='data.ssidEnable']").val();
	}
	postdata.sessionid = sessionidstr;
	console.log(postdata);
	if (gOperatorMode == "3" && gOperatorName == "TH_AIS") {
		return;
	}
	XHR.post("setWlanBasicCfg_5G", postdata);
}

function displayControl() {
	var guradListHtml;
	//墨西哥telmex禁用web配置5G带宽
	if (operator_name == "MEX_TELMEX") {
		$("#WlanBandWidth_select").attr("disabled", true);
	} else if (operator_name == "ECU_CNT" || operator_name == "ALGERIA_TELECOM") {
		if ($("#wlcfg_wlgMode").val() == "a") {
			$("#WlanBandWidth_select").attr("disabled", true);
			$("#WlanBandWidth_select").val("0");
			$("#WlanBandWidth_select").children().eq(4).hide();
		} else if ($("#wlcfg_wlgMode").val() == "a,n,ac" || $("#wlcfg_wlgMode").val() == "ac") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").val("0");
			$("#WlanBandWidth_select").children().eq(3).show();
			$("#WlanBandWidth_select").children().eq(4).show();
			$("#WlanBandWidth_select").children().eq(5).show();
		} else if ($("#wlcfg_wlgMode").val() == "ax") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").val("0");
			$("#WlanBandWidth_select").children().eq(3).show();
			$("#WlanBandWidth_select").children().eq(4).show();
			$("#WlanBandWidth_select").children().eq(5).show();
		} else if ($("#wlcfg_wlgMode").val() == "an" || $("#wlcfg_wlgMode").val() == "a,n") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").val("2");
			$("#WlanBandWidth_select").children().eq(3).hide();
			$("#WlanBandWidth_select").children().eq(4).hide();
			$("#WlanBandWidth_select").children().eq(5).hide();
		}
	}else if (operator_name == "MEX_TP" && user_type == "0") {
		$("#wlcfg_wlgMode").attr("disabled", true);
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
	} else {
		if ($("#wlcfg_wlgMode").val() == "a") {
			$("#WlanBandWidth_select").attr("disabled", true);
			$("#WlanBandWidth_select").val("0");
			$("#WlanBandWidth_select").children().eq(4).hide();

		} else if ($("#wlcfg_wlgMode").val() == "a,n,ac") {
			$("#WlanBandWidth_select").attr("disabled", false);
			//$("#WlanBandWidth_select").val("2");
			$("#WlanBandWidth_select").children().eq(3).show();
			$("#WlanBandWidth_select").children().eq(4).show();//Auto(20/40/80/160MHz)
		} else if ($("#wlcfg_wlgMode").val() == "anacax" || $("#wlcfg_wlgMode").val() == "ax") {
			$("#WlanBandWidth_select").attr("disabled", false);
			//$("#WlanBandWidth_select").val("2");
			$("#WlanBandWidth_select").children().eq(3).show();
			$("#WlanBandWidth_select").children().eq(4).show();
		} else if ($("#wlcfg_wlgMode").val() == "an") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").val("2");
			$("#WlanBandWidth_select").children().eq(3).hide();
			$("#WlanBandWidth_select").children().eq(4).hide();
		}
	}
	updateChannelList();
	if ($("#wlcfg_wlgMode").val() == "ax" || $("#wlcfg_wlgMode").val() == "anacax") {
		guradListHtml = "<option value='1'>0.8us</option><option value='2'>1.6us</option> <option value='3'>3.2us</option><option value='4'>Auto</option>";
	} else {
		guradListHtml = "<option value='0'>0.4us</option><option value='1'>0.8us</option> <option value='4'>Auto</option>"
	}
	$("#GuardInterval_select").html(guradListHtml);
    if ($("#wlcfg_wlgMode").val() == "ax" || $("#wlcfg_wlgMode").val() == "anacax") 
    {
     $("#GuardInterval_select").val("0");   
    }

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
	inner_index = basicData.index;
	console.log("inner_index===" + inner_index);
	DFSChannelList = basicData.X_FH_DFSChannelList.split(",");
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
	//setSwitchValue("WlanEnable_container", basicData.RadioEnabled);
	$("#wlcfg_wlgMode").val(basicData.Standard);
	$("#basicDomain").val(basicData.RegulatoryDomain);
	$("#dtim_period").val(basicData.X_FH_DTIMperiod);
	$("#WlanBandWidth_select").val(basicData.X_FH_ChannelWidth);

	$("#dfs_setting_select").val(basicData.X_FH_DFSChannelEnable);	
	if(gOperatorName == "MEX_MEGA")
	{
		changeChannelArr();
	}
	$("#WlanChannel_select").val(basicData.Channel);
	$("#GuardInterval_select").val(basicData.X_FH_GuardInterval);
	
    if (basicData.fastromingEnable == "0") {
    	$("input[name='ssid_fast_roaming']:eq(1)").prop("checked", true);
    } else if(basicData.fastromingEnable == "1") {
    	$("input[name='ssid_fast_roaming']:eq(0)").prop("checked", true);
    }
    
    
    if (basicData.airtimefairnesEnable == "0") {
    	$("input[name='ssid_airtime_faines']:eq(1)").prop("checked", true);
    } else if(basicData.airtimefairnesEnable == "1") {
    	$("input[name='ssid_airtime_faines']:eq(0)").prop("checked", true);
    }
    
    if (basicData.beamformingEnable == "0") {
    	$("input[name='ssid_beamforming']:eq(1)").prop("checked", true);
    } else if(basicData.beamformingEnable == "1") {
    	$("input[name='ssid_beamforming']:eq(0)").prop("checked", true);
    }
    
    if(basicData.mimoEnable == "0"){
        $("input[name='ssid_mimo']:eq(1)").prop("checked", true);
    }else{
        $("input[name='ssid_mimo']:eq(0)").prop("checked", true);
    }
    if(basicData.ofdmaEnable == "0"){
        $("input[name='ssid_ofdma']:eq(1)").prop("checked", true);
    }else{
        $("input[name='ssid_ofdma']:eq(0)").prop("checked", true);
    }
    if(basicData.twtEnable == "0"){
        $("input[name='ssid_twt']:eq(1)").prop("checked", true);
    }else{
        $("input[name='ssid_twt']:eq(0)").prop("checked", true);
    }
    if(basicData.bsscolorEnable == "0"){
        $("input[name='ssid_bssscolor']:eq(1)").prop("checked", true);
		$("#BSSColorValue_div").hide()
		$("#BSSColorValue").val(basicData.bssColorValue)
    }else if(basicData.bsscolorEnable == "1"){
        $("input[name='ssid_bssscolor']:eq(0)").prop("checked", true);
		if(operator_name == "IDN_TELKOM"){
			$("#BSSColorValue_div").show()
		}
		if(operator_name == "BZ_INTELBRAS" && device_type == "HG6145F3"){
			$("#BSSColorValue_div").show()
		}
		$("#BSSColorValue").val(basicData.bssColorValue)
    }
	
	//墨西哥telmex禁用web配置5G带宽
	if (operator_name == "MEX_TELMEX" || (operator_name == "FTTR_SUB_COMMON" && multiAP == "1")) {
		$("#WlanBandWidth_select").attr("disabled", true);
	} else if (operator_name == "ECU_CNT" || operator_name == "ALGERIA_TELECOM") {
		if ($("#wlcfg_wlgMode").val() == "a") {
			$("#WlanBandWidth_select").attr("disabled", true);
			$("#WlanBandWidth_select").val("0");
			$("#WlanBandWidth_select").children().eq(4).hide();
			$("#WlanBandWidth_select").children().eq(5).hide();
		} else if ($("#wlcfg_wlgMode").val() == "a,n,ac" || $("#wlcfg_wlgMode").val() == "ac") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").children().eq(3).show();
			$("#WlanBandWidth_select").children().eq(4).show();
			$("#WlanBandWidth_select").children().eq(5).show();
		} else if ($("#wlcfg_wlgMode").val() == "ax") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").children().eq(3).show();
			$("#WlanBandWidth_select").children().eq(4).show();
			$("#WlanBandWidth_select").children().eq(5).show();
		} else if ($("#wlcfg_wlgMode").val() == "an" || $("#wlcfg_wlgMode").val() == "a,n") {
			$("#WlanBandWidth_select").attr("disabled", false);
			$("#WlanBandWidth_select").children().eq(3).hide();
			$("#WlanBandWidth_select").children().eq(4).hide();
			$("#WlanBandWidth_select").children().eq(5).hide();
		}
	} else if (operator_name == "MEX_TP" && user_type == "0") {
		$("#wlcfg_wlgMode").attr("disabled", true);
		$("#WlanBandWidth_select").attr("disabled", true);
		$("#WlanChannel_select").attr("disabled", true);
	} else {
		if (basicData.Standard == "a") {
			$("#WlanBandWidth_select").attr("disabled", true);
			$("#WlanBandWidth_select").val("0");
		} else if (basicData.Standard == "an" || basicData.Standard == "a,n,ac" || basicData.Standard == "anacax" || basicData.Standard == "ax") {
			$("#WlanBandWidth_select").attr("disabled", false);
		}

		if (basicData.Standard == "an") {
			$("#WlanBandWidth_select").children().eq(3).hide();
		} else {
			$("#WlanBandWidth_select").children().eq(3).show();
		}
	}
	if ($("#wlcfg_wlgMode").val() == "ax" || $("#wlcfg_wlgMode").val() == "anacax") {
		guradListHtml = "<option value='1'>0.8us</option><option value='2'>1.6us</option> <option value='3'>3.2us</option><option value='4'>Auto</option>";
	} else {
		guradListHtml = "<option value='0'>0.4us</option><option value='1'>0.8us</option> <option value='4'>Auto</option>"
	}
	$("#GuardInterval_select").html(guradListHtml);
	$("#GuardInterval_select").val(basicData.X_FH_SGI);
	if (operator_name == "TH_AIS") {
		show_channel_ais();
		var channelist = basicData.X_FH_ChannelList;
		if (channelist == channel_TH_AIS_5G) {
			$("input[name='auto_choice']:eq(0)").prop("checked", true);
			show_custom_channel(1);
		} else if (channelist == "36,40,44,48,52,56,60,64" && $("#WlanBandWidth_select").val() == "4") {
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
		updateAISChannelList();
	}
	if (operator_name == "BZ_INTELBRAS")
	{
		if(basicData.X_FH_ChannelList == "36,40,44,48,149,153,157,161,165"
			|| basicData.X_FH_ChannelList == "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165")
		{
			if(basicData.Channel == 0)
			{
				$("#WlanChannel_select").val(basicData.X_FH_ChannelList);
			}
			else
			{
				$("#WlanChannel_select").val(basicData.Channel);
			}
		}
		else
		{
			$("#WlanChannel_select").val(basicData.Channel);
		}
	}

}

function CancelBtn() {
	displayHtml();
}

function bandwidthTransform(value) {
	if(value == "0")
	{
		return "1";
	}else if(value == "1")
	{
		return "2";
	}else if(value == "2")
	{
		return "0";
	}else if(value == "3")
	{
		return "3";
	}else if(value == "4")
	{
		return "4";
	}else if(value == "5")
	{
		return "3";
	}else if(value == "10")
	{
		return "4";
	}
}

function updateChannelList() {
	cur_Channel = $("#WlanChannel_select").val();
	var postdata = new Object();
	if(gOperatorName == "ECU_CNT")
	{
		if($("#WlanBandWidth_select").val() == "0")
		{
			postdata.bandwidth = "1";
		}else if($("#WlanBandWidth_select").val() == "1")
		{
			postdata.bandwidth = "2";
		}else if($("#WlanBandWidth_select").val() == "3")
		{
			postdata.bandwidth = "3";
		}else if($("#WlanBandWidth_select").val() == "4")
		{
			postdata.bandwidth = "4";
		}else if($("#WlanBandWidth_select").val() == "10" || $("#WlanBandWidth_select").val() == "11")
		{
			postdata.bandwidth = "4";
		}
	}else if(gOperatorName == "MY_TM"){
		postdata.bandwidth = bandwidthTransform($("#WlanBandWidth_select").val());
	}else if(gOperatorName == "ALGERIA_TELECOM" ){
		if($("#WlanBandWidth_select").val() == "0")
			{
				postdata.bandwidth = "1";
			}else if($("#WlanBandWidth_select").val() == "1")
			{
				postdata.bandwidth = "2";
			}else if($("#WlanBandWidth_select").val() == "2")
			{
				postdata.bandwidth = "0";
			}else if($("#WlanBandWidth_select").val() == "3")
			{
				postdata.bandwidth = "3";
			}else if($("#WlanBandWidth_select").val() == "4" || $("#WlanBandWidth_select").val() == "10")
			{
				postdata.bandwidth = "4";
			}
	}else{
	postdata.bandwidth = $("#WlanBandWidth_select option:selected").index();
	}
	XHR.post("new_wifi_possible_channels_5g", postdata, updatechannelListHtml);

	if (gOperatorName == "TH_AIS") {
		updateAISChannelList();
	}
}

function updatechannelListHtml(data) {
	if (operator_name == "BZ_INTELBRAS")
	{
		var channelListHTML = "<option value='36,40,44,48,149,153,157,161,165'>" + 'basic_frequency_auto'.i18n() + "</option>";
		channelListHTML += "<option value='36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165'>" + 'auto_selected_with_dfs'.i18n() + "</option>";
	}
	else
	{
		var channelListHTML = "<option value='0'>" + 'basic_frequency_auto'.i18n() + "</option>";
	}
	if (data && data.channelsNum > 0) {
		channels_5g = [];
		for (var i = 0; i < data.channelsNum; i++) {
			var channels = eval("data.channels_" + i);
			channelListHTML += "<option value='" + channels + "'>" + 'channel'.i18n() + " " + channels + "</option>";
			channels_5g[i] = channels;
		}
	}
	//console.log("updatechannelListHtml channel: " + channels_5g);
	$("#WlanChannel_select").html(channelListHTML);
	if ($("#WlanChannel_select").find('option[value=' + cur_Channel + ']').length > 0) {
		$("#WlanChannel_select").val(cur_Channel);
	}

	if(gOperatorName == "MEX_MEGA")
	{
		changeChannelArr();
	}
}

function fillCurrentSel(sel) {
	console.log(sel);
	var data = wifidata[sel];
	index = wifidata[sel].index;
	if (sel == 1 || sel == 2 || sel == 3) {
		$("#other_info_div").hide();
	} else {
		$("#other_info_div").show();
	}
	$("#ssid_choice").val((sel + 5));
	$("#wlcfg_wlgMode").val(data.X_FH_Standard_Ex);
}
function generateoption() {
	var dynamicClsListHTML = '';
	for (var m = 36; m <= 64; m = m + 4) {
		dynamicClsListHTML +=
			"<span class='wifiport' id='span_channel" + m + "'><input type='checkbox' name='custom_channel' value=" + m + " id='custom_channel" + m + "'/>channel" + m + "</span>";

	}
	dynamicClsListHTML += "<br>"
	for (var m = 100; m <= 128; m = m + 4) {
		dynamicClsListHTML +=
			"<span class='wifiport' id='span_channel" + m + "'><input type='checkbox' name='custom_channel' value=" + m + " id='custom_channel" + m + "'/>channel" + m + "</span>";

	}
	dynamicClsListHTML += "<br>"
	for (var m = 149; m <= 165; m = m + 4) {
		dynamicClsListHTML +=
			"<span class='wifiport' id='span_channel" + m + "'><input type='checkbox' name='custom_channel' value=" + m + " id='custom_channel" + m + "'/>channel" + m + "</span>";

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
	var i = 0;
	if ($("#auto_channel_ais").is(":visible")) {
		if ($("input[name='auto_choice']:eq(1)").attr('checked')) {
			for (i = 0; i < 20; i++) {
				if (i < 8) {
					if ($("input[name='custom_channel']:eq(" + i + ")").attr('checked') && $("input[name='custom_channel']:eq(" + i + ")").is(":visible")) {

						bindlist += (36 + 4 * i) + ",";
					}
				}
				else if (7 < i && i < 16) {
					if ($("input[name='custom_channel']:eq(" + i + ")").attr('checked') && $("input[name='custom_channel']:eq(" + i + ")").is(":visible")) {
						bindlist += (100 + 4 * (i - 8)) + ",";
					}
				}
				else if (15 < i && i < 20) {
					if ($("input[name='custom_channel']:eq(" + i + ")").attr('checked') && $("input[name='custom_channel']:eq(" + i + ")").is(":visible")) {
						bindlist += (149 + 4 * (i - 16)) + ",";
					}
				}

			}
			bindlist_after = bindlist.substring(0, bindlist.length - 1);
		}
		else {
			if ($("#WlanBandWidth_select").val() == "4") {
				bindlist_after = "36,40,44,48,52,56,60,64";
			}
			else {
				bindlist_after = channel_TH_AIS_5G;
			}

		}
	}
	return bindlist_after;
}


function updateAISChannelList() {
	var index = $("#WlanBandWidth_select option:selected").index();
	var custom_channel;
	if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
		for (var i = 36; i <= 64; i = i + 4) {
			custom_channel = "custom_channel" + i
			$("#" + custom_channel).attr("disabled", true);
		}
	}
	if (index == "0" || index == "2") {
		for (var i = 100; i <= 128; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
		for (var i = 149; i <= 161; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
		$("#span_channel165").hide();
	} else if (index == "1") {
		for (var i = 100; i <= 128; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
		for (var i = 149; i <= 165; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
	} else if (index == "4") {
		for (var i = 100; i <= 128; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
		for (var i = 149; i <= 165; i = i + 4) {
			$("#span_channel" + i).hide();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}

	} else if (index == "3") {
		for (var i = 100; i <= 128; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
		for (var i = 149; i <= 161; i = i + 4) {
			$("#span_channel" + i).show();
			if (gOperatorName == "TH_AIS" && gOperatorMode == "3") {
				custom_channel = "custom_channel" + i
				$("#" + custom_channel).attr("disabled", true);
			}
		}
	}

}

function update_channels_5g() {
	var postdata = new Object();
	postdata.bandwidth = $("#WlanBandWidth_select option:selected").index();
	XHR.post("new_wifi_possible_channels_5g", postdata, function(data) {
		if (data && data.channelsNum > 0) {
			channels_5g = [];
			for (var i = 0; i < data.channelsNum; i++) {
				var channels = eval("data.channels_" + i);
				channels_5g[i] = channels;
			}
		}
		//console.log("update channel: " + channels_5g);
	});

}

function changeChannelArr() 
{   
	if(gOperatorName == "MEX_MEGA")
	{
		update_channels_5g();
		var cur_possible_channels_5g = [];
		cur_possible_channels_5g = channels_5g;
		
		//console.log("DFSChannelList channel: " + DFSChannelList);
		//console.log("after update channel: " + cur_possible_channels_5g);
		
	 	if ($("#dfs_setting_select").val() == 1)// enable
	 	{                    
			/*for (var i = 0; i < DFSChannelList.length; i++)
			{    
				if (channels_5g.indexOf(Number(DFSChannelList[i])) == -1)
				{     
					cur_possible_channels_5g.push(Number(DFSChannelList[i])); 
				}                    
			}    
			cur_possible_channels_5g.sort((a,b) => a-b);*/ 
		} 
		else//disable
		{                    
			for (var i = 0; i < DFSChannelList.length; i++) 
			{      
				if (possible_channels_5g.indexOf(Number(DFSChannelList[i])) != -1)
				{  
					for (var j = 0; j < cur_possible_channels_5g.length; j++) 
					{
						if(Number(cur_possible_channels_5g[j]) == Number(DFSChannelList[i]))
						{
							cur_possible_channels_5g.splice(j, 1);  
						}
					}
				}  
			}              
		} 
		//console.log("the last channel: " + cur_possible_channels_5g);
		
		var channelListHTML = "<option value='0'>" + 'basic_frequency_auto'.i18n() + "</option>";
		for (var i = 0; i < cur_possible_channels_5g.length; i++) {
			channelListHTML += "<option value='" + cur_possible_channels_5g[i] + "'>" + 'channel'.i18n() + " " + cur_possible_channels_5g[i] + "</option>";
		}
		$("#WlanChannel_select").html(channelListHTML); 
	}
                       
}

