var sessionidstr = "";
var wifidata = "";
var selectIdx = -1;
var old_PreSharedKey;
var multiAP = "";
var validata_form;
var operator_name = gOperatorName;
var multiap_enable;
var band_steering;
var modelname = gModelName;
var ssid = [];
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	//获取wan连接中ssid的编号
	$("#ssid_choice").bind("change", function() {
		var sel = $(this).val() - 1;

		if ((sel == 0 || sel == 1 || sel == 2 || sel == 3) && ($("#BeaconType").val() == "Basic" || $("#BeaconType").val() == "WPA-Enterprise" ||
			$("#BeaconType").val() == "WPA" || $("#BeaconType").val() == "WPA2-Enterprise" || $("#BeaconType").val() == "11i" || $("#BeaconType").val() == "WPA/WPA2" || $("#BeaconType").val() == "WPAand11i" || $("#BeaconType").val() == "WPA-WPA2-Enterprise")) {
			$("#twoInput_div").hide();
		}
		fillCurrentSel(sel);
	});


	XHR.get("get_multiAP_enable", null, multiInfo);
	XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);
	if (operator_name == "PH_PLDT") {
		initValidate_pldt();
		$("#pldt_password_tip").show();
	} else {
		initValidate();
		$("#common_password_tip").show();
	}

	if (modelname == "HG6145F" || gWifiCap == "0" ) {
		$("#WPA3").hide();
		$("#WPA2WPA3").hide();
	}

	$("#BeaconType").bind("change", function() {
		validata_form.resetForm();
		var BeaconTypeval = $("#BeaconType").val();
		BeaconTypeShow(BeaconTypeval);
	});

	// $("#BasicEncryptionModes").bind("change", function() {
	// 	if ($(this).val() == "WEPEncryption") {
	// 		$("#wep_div").show();
	// 	} else {
	// 		$("#wep_div").hide();
	// 	}
	// });

	initPage();
	customSwitchInit();
	customPasswordInit();
});

function BeaconTypeShow(BeaconTypeval) {
	if (BeaconTypeval == "Basic") {
		$("#open_div").show();
		$("#wpa_div").hide();
		$("#wpa-enterprise_div").hide();
	}
	else if (BeaconTypeval == "11i") {
		$("#open_div").hide();
		$("#wpa_div").show();
		$("#wpa3_div").show();
		$("#wpa-enterprise_div").hide();
	} else if (BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPAand11i") {
		$("#open_div").hide();
		$("#wpa_div").show();
		$("#wpa3_div").show();
		$("#wpa-enterprise_div").hide();
	} else if (BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise" || BeaconTypeval == "WPA-WPA2-Enterprise")//wifi企业认证
	{
		$("#open_div").hide();
		$("#wpa_div").show();
		$("#wpa3_div").hide();
		$("#wpa-enterprise_div").show();
	}
	else {
		$("#wpa3_div").show();
		$("#wpa-enterprise_div").hide();
		$("#open_div").hide();
		$("#wpa_div").show();
	}
}

function multiInfo(data) {
	multiAP = data.multiAP_enable.Enable;
}
function bandsteeringInfo(data) {
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function getSSID(all_wan_info) {

	for (var i = 0; i < all_wan_info.wan.length; i++) {
		var single_wan = all_wan_info.wan[i];
		if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") >= 0) {
			ssid = single_wan.LanInterface.split(',');
			for (var j = 0; j < ssid.length; j++) {
				if (ssid[j].indexOf("dev.wla.") >= 0) {
					$("#ssid_choice option").each(function() {
						if ($(this).val() == ssid[j].substr(ssid[j].length - 1, 1)) {
							//$(this).css("display","none");
							$(this).remove();
						}
					});
				}
			}
			//ssid.push(single_wan.LanInterface.substr(single_wan.LanInterface.length -1)); 

		}
	}
}

// function multiInfo(data)
// {
// 	multiAP = data.multiAP_enable.Enable;

// 	if(multiAP == "1")
// 	{
// 		alert("The Band Steering function is enabled, please close it before configuring!");
// 		$("#SSID").attr("disabled", true);
// 		$("[type='radio']").attr("disabled", true);
// 		$("#BeaconType").attr("disabled", true);
// 		$("[type='checkbox']").attr("disabled", true);
// 		$("#PreSharedKey").attr("disabled", true);
// 		$("[type='button']").attr("disabled", true);
// 	}
// }

function initPage() {
	if (gDebug) {
		getDataByAjax("../fake/wlanAdvanced", fillData);
	} else {
		XHR.get("get_wifi_status", null, fillData);
	}
}

function initValidate_pldt() {
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": { required: true, minlength: 12, maxlength: 63, nocn: true, pwdcheck_pldt: true },
			"SSID": { required: true, minlength: 1, maxlength: 32, nocn: true },
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	});
}

function initValidate() {
	validata_form = $("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"ssid_choice": { required: true },
			"PreSharedKey": { required: true, minlength: 8, maxlength: 63, nocn: true },
			"SSID": { required: true, minlength: 1, maxlength: 32, nocn: true },
			"ip_address": { required: true, ipv4: true },
			"port": { required: true, range_int: [1, 65535] },
			"shared_secret": { required: true, minlength: 1, maxlength: 64, nocn: true }
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	});
}

function fillData(data) {

	if (data && data.wifi_status) {
		wifidata = data.wifi_status;
		var ssidSelectOption = [];
		for (var i = 1; i <= wifidata.length; i++) {

			//开启bandsteering时，advance页面只有ssid2-4
			if (band_steering == "1") {
				if (i == 1) {
					continue;
				}
			}
			if ((operator_name == "ES_DIGI" || operator_name == "PAK_PTCL") && i == 3 && wifidata[i - 1].isolation_enable == "1")
				continue;
			
			ssidSelectOption += '<option value="' + i + '">' + i + '</option>';
		}
		$("#ssid_choice").html(ssidSelectOption);
	}

	if (operator_name == "IDN_TELKOM") {
		XHR.get("get_allwan_info", null, getSSID);

	}

	if(selectIdx == -1){
		if($("#ssid_choice option").length == 0)
			$("#wlanAdv_settings_form").hide();
		else
			fillCurrentSel(Number($("#ssid_choice option:first").val() - 1));
	}else{
		fillCurrentSel(selectIdx);
	}
	
	// $("#ssid_choice option").each(function(){
	//      if($(this).css("display")=="block"){
	//          $(this).change();
	//          return false;
	//      }
	// });
}

function fillCurrentSel(sel) {

	var data = wifidata[sel];
	
	$("#ssid_choice").val((sel + 1));
	if (data.Enable == "0") {
		$("input[name='ssid_enable']:last").attr('checked', 'checked');
	} else {
		$("input[name='ssid_enable']:first").attr('checked', 'checked');
	}
	$("#SSID").val(fhdecrypt(data.SSID));


	if (data.X_FH_SSIDHide == "1") {
		setCheckbox("X_FH_SSIDHide", "0");
	} else {
		setCheckbox("X_FH_SSIDHide", "1");
	}
	var BeaconTypeval = data.BeaconType;

	if ((sel == 0 || sel == 1 || sel == 2 || sel == 3) && (BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPAand11i" ||
		BeaconTypeval == "WPA" || BeaconTypeval == "11i")) {
		$("#twoInput_div").hide();
	}


	if (BeaconTypeval == "Basic") {
		if (data.BasicAuthenticationMode == "SharedKey") {
			BeaconTypeval = "SharedKey";
		}
		if (data.BasicAuthenticationMode == "Both") {
			BeaconTypeval = "Both";
		}
	}

	if (BeaconTypeval == "WPA3") {
		if (data.WPAEncryptionModes == "None") {
			$("#wpa3_div").hide();
		} else {
			$("#wpa3_div").show();
		}
	}
    
	//BeaconType配置为WPAand11i时WEB适配(WPA/WPA2)
	if (BeaconTypeval == "WPAand11i") {
		$("#BeaconType").val("WPA/WPA2");
		BeaconTypeval = "WPA/WPA2";
	} else if (BeaconTypeval == "None") {
		$("#BeaconType").val("Basic");
		BeaconTypeval = "Basic";
		// $("#open_div").show();
		// $("#wpa_div").hide();
	} else {
		$("#BeaconType").val(BeaconTypeval);
	}


	BeaconTypeShow(BeaconTypeval);

	/*if (BeaconTypeval == "Basic")
	{
		$("#open_div").show();
		$("#wpa_div").hide();
		var BasicEncryptionModes = data.BasicEncryptionModes;
		if (BasicEncryptionModes == "WEPEncryption")
		{
			$("#wep_div").show();
		}else
		{
			$("#wep_div").hide();
		}
	}
	else if (BeaconTypeval == "Both" || BeaconTypeval == "SharedKey")
	{
		$("#open_div").hide();
		$("#wpa_div").hide();
		$("#wep_div").show();
	}
	else if(BeaconTypeval == "WPA3"){
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
		$("#twoInput_div").show();
	}else if(BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise" || BeaconTypeval == "WPA-WPA2-Enterprise"){
		$("#open_div").hide();
		$("#wpa_div").show();
		$("#wpa3_div").hide();
		$("#wpa-enterprise_div").show();
	}
	else if(BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPA" || BeaconTypeval == "11i" || BeaconTypeval == "WPAand11i")
	{
	
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
	}

	$("#NodeEncryption").click(function(){
		$("#wpa3_div").hide();
	});

	$("#Tkipncryption, #Aesencryption, #Tkipaesncryption, #Saencryption").click(function() {
		$("#wpa3_div").show();
	});*/

	if (data.BasicEncryptionModes != "") {
		$("#BasicEncryptionModes").val(data.BasicEncryptionModes);
	}
	$("#WEPKeyIndex").val(data.WEPKeyIndex);

	$("#WEPKey1").val(fhdecrypt(data.WEPKey1));
	if (data.WEPKey1.length == 10 || data.WEPKey1.length == 26) {
		$("#WEPSelect1").val(1);
	} else {
		$("#WEPSelect1").val(0);
	}

	$("#WEPKey2").val(fhdecrypt(data.WEPKey2));
	if (data.WEPKey2.length == 10 || data.WEPKey2.length == 26) {
		$("#WEPSelect2").val(1);
	} else {
		$("#WEPSelect2").val(0);
	}

	$("#WEPKey3").val(fhdecrypt(data.WEPKey3));
	if (data.WEPKey3.length == 10 || data.WEPKey3.length == 26) {
		$("#WEPSelect3").val(1);
	} else {
		$("#WEPSelect3").val(0);
	}

	$("#WEPKey4").val(fhdecrypt(data.WEPKey4));
	if (data.WEPKey4.length == 10 || data.WEPKey4.length == 26) {
		$("#WEPSelect4").val(1);
	} else {
		$("#WEPSelect4").val(0);
	}
	if (data.WPAEncryptionModes == "TKIPEncryption") {
		$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
	} else if (data.WPAEncryptionModes == "TKIPandAESEncryption") {
		$("input[name='WPAEncryptionModes']:eq(2)").attr('checked', 'checked');
	} else if (data.WPAEncryptionModes == "AESEncryption") {
		$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
	}
	$("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None

	$("#ip_address").val(data.ServiceIP);
	$("#port").val(data.Port);
	$("#shared_secret").val(fhdecrypt(data.Key));
	temp_b64 = fhdecrypt(data.PreSharedKey);
	$("#PreSharedKey").val(temp_b64);
}

function checkHex(str) {
	var len = str.length;

	for (var i = 0; i < str.length; i++) {
		if ((str.charAt(i) >= '0' && str.charAt(i) <= '9') ||
			(str.charAt(i) >= 'a' && str.charAt(i) <= 'f') ||
			(str.charAt(i) >= 'A' && str.charAt(i) <= 'F')) {
			continue;
		} else
			return false;
	}
	return true;
}

function checkInjection(str) {
	var len = str.length;
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) == '\r' || str.charAt(i) == '\n') {
			return false;
		} else
			continue;
	}
	return true;
}

function check_Wep() {
	var WEPKeyval = $("#WEPKey1").val();
	var keylength = WEPKeyval.length;
	var WEPSelect = $("#WEPSelect1").val();

	if (WEPSelect == 0) {
		if (keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key1".i18n() + "!");
			return false;
		}
		if (checkInjection(WEPKeyval) == false) {
			alert("WEP_key1".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1) {
		if (keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key1".i18n() + "!");
			return false;
		}
		if (checkHex(WEPKeyval) == false) {
			alert("Invalid_WEP_key1_format".i18n());
			return false;
		}
	}

	WEPKeyval = $("#WEPKey2").val();
	keylength = WEPKeyval.length;
	WEPSelect = $("#WEPSelect2").val();

	if (WEPSelect == 0) {
		if (keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key2".i18n() + "!");
			return false;
		}
		if (checkInjection(WEPKeyval) == false) {
			alert("WEP_key2".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1) {
		if (keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key2".i18n() + "!");
			return false;
		}
		if (checkHex(WEPKeyval) == false) {
			alert("Invalid_WEP_key2_format".i18n());
			return false;
		}
	}

	WEPKeyval = $("#WEPKey3").val();
	keylength = WEPKeyval.length;
	WEPSelect = $("#WEPSelect3").val();

	if (WEPSelect == 0) {
		if (keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key3".i18n() + "!");
			return false;
		}
		if (checkInjection(WEPKeyval) == false) {
			alert("WEP_key3".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1) {
		if (keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key3".i18n() + "!");
			return false;
		}
		if (checkHex(WEPKeyval) == false) {
			alert("Invalid_WEP_key3_format".i18n());
			return false;
		}
	}

	WEPKeyval = $("#WEPKey4").val();
	keylength = WEPKeyval.length;
	WEPSelect = $("#WEPSelect4").val();

	if (WEPSelect == 0) {
		if (keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key4".i18n() + "!");
			return false;
		}
		if (checkInjection(WEPKeyval) == false) {
			alert("WEP_key4".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1) {
		if (keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key4".i18n() + "!");
			return false;
		}
		if (checkHex(WEPKeyval) == false) {
			alert("Invalid_WEP_key4_format".i18n());
			return false;
		}
	}

	return true;
}

function saveApply() {
	show_shadow();
	if (!$("#wlanAdv_settings_form").valid()) {
		alert("invalid_value_alert".i18n());
		return;
	}

	var postdata = new Object();
	selectIdx = $("#ssid_choice").val() - 1;
	postdata.wifiIndex = $("#ssid_choice").val();
	postdata.Enable = $("input[name='ssid_enable']:checked").val();
	postdata.SSID = fhencrypt($("#SSID").val());
	postdata.X_FH_SSIDHide = $("#X_FH_SSIDHide").prop("checked") ? 0 : 1;
	var BeaconType = $("#BeaconType").val();
	if (BeaconType == "Basic") {
		postdata.BeaconType = BeaconType;
		postdata.BasicAuthenticationMode = "OpenSystem";
		var BasicEncryptionModes = $("#BasicEncryptionModes").val();
		postdata.BasicEncryptionModes = BasicEncryptionModes;
		if (BasicEncryptionModes == "WEPEncryption") {
			if (!check_Wep()) {
				return;
			}
			postdata.WEPKeyIndex = $("#WEPKeyIndex").val();
			postdata.WEPKey1 = fhencrypt($("#WEPKey1").val());
			postdata.WEPKey2 = fhencrypt($("#WEPKey2").val());
			postdata.WEPKey3 = fhencrypt($("#WEPKey3").val());
			postdata.WEPKey4 = fhencrypt($("#WEPKey4").val());
		}
	}
	else if (BeaconType == "Both" || BeaconType == "SharedKey") {
		postdata.BeaconType = "Basic";
		postdata.BasicAuthenticationMode = BeaconType;
		postdata.BasicEncryptionModes = "WEPEncryption";
		if (!check_Wep()) {
			return;
		}
		postdata.WEPKeyIndex = $("#WEPKeyIndex").val();
		postdata.WEPKey1 = fhencrypt($("#WEPKey1").val());
		postdata.WEPKey2 = fhencrypt($("#WEPKey2").val());
		postdata.WEPKey3 = fhencrypt($("#WEPKey3").val());
		postdata.WEPKey4 = fhencrypt($("#WEPKey4").val());
	} else if (BeaconType == "WPA-Enterprise" || BeaconType == "WPA2-Enterprise" || BeaconType == "WPA-WPA2-Enterprise") {
		postdata.BeaconType = BeaconType;
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		postdata.ip_address = $("#ip_address").val();
		postdata.port = $("#port").val();
		postdata.shared_secret = fhencrypt($("#shared_secret").val());
	} else {
		postdata.BeaconType = BeaconType;
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		var temp_b64 = fhencrypt($("#PreSharedKey").val());
		postdata.PreSharedKey = temp_b64;
	}
	XHR.post("setWlanAdvancedCfg", postdata, fillData);

	//window.location.reload();

}

