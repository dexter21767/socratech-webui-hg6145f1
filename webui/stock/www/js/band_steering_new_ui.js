var sessionidstr = "";
var wifidata = "";
var selectIdx = 0;
var old_PreSharedKey;
var multiAP = "";
var bandsteering_enable = "";
var operator_name = gOperatorName;
var device_type = gModelName;
var password_length = 8;
var fttr_type = gFttr_type;
var BS_BackupEnable;
var BS_SSID;
var BS_BeaconType;
var BS_BasicAuthentication;
var BS_WPAEncryption;
var BS_PreSharedKey;
var wifi_type = gWifiCap;
var g_rrsi_2;
var g_rrsi_5;
var gMode;
var gWPARekeyInterval;
$(document).ready(function() {
	XHR.get("get_multiAP_enable", null, getMultiap);
	function getMultiap(data) {
		multiAP = data.multiAP_enable.Enable;

	}

	initValidate();



	/*WIFI5 设备无WPA3、WPA2WPA3*/
	if (wifi_type == "0") {
		$("#WPA3").hide();
		$("#WPA2WPA3").hide();
	}

	$("#BeaconType").bind("change", function() {
		var BeaconTypeval = $(this).val();
		if (BeaconTypeval == "Basic") {
			if (gNewUiFlag)
				$("#open_div").hide();
			else
				$("#open_div").show();
			$("#wpa_div").hide();
			if ($("#BasicEncryptionModes").val() == "WEPEncryption") {
				$("#wep_div").show();
			}
			else {
				$("#wep_div").hide();
			}
			$("#reAuthentication_div").hide();
		} else if (BeaconTypeval == "WPA/WPA2") {
			if (operator_name != "CHL_ENTEL" || operator_name != "COL_ETB") {
				$("#WPA_Algorithms_text").html("TKIPAES");
				$("#Tkipaesncryption").attr("checked", "checked");
				gMode = "TKIPandAESEncryption"
			}
			$("#open_div").hide();
			$("#wep_div").hide();
			$("#wpa_div").show();
			$("#twoInput_div").hide();
			if (gNewUiFlag)
				$("#reAuthentication_div").hide();
			else
				$("#reAuthentication_div").show();
		} else if ((BeaconTypeval == "WPA3" || BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "11i")) {
			$("#WPA_Algorithms_text").html("AES");
			gMode = "Aesencryption"
			if (BeaconTypeval == "11i") {
				if (gNewUiFlag)
					$("#reAuthentication_div").hide();
				else
					$("#reAuthentication_div").show();
			} else {
				$("#reAuthentication_div").hide();
			}
			$("#open_div").hide();
			$("#wep_div").hide();
			$("#wpa_div").show();
			$("#twoInput_div").hide();
		}

	});

	$("#BasicEncryptionModes").bind("change", function() {
		if ($(this).val() == "WEPEncryption") {
			$("#wep_div").show();
		} else {
			$("#wep_div").hide();
		}
	});

	initPage();


});
function showBSInfo() {
	if ($("input[name='bs']:eq(0)").is(":checked")) {
		$("#bs_info_div").show();
	} else {
		$("#bs_info_div").hide();
	}
}
function initPage() {

	XHR.get("get_bandSteering_wlan", null, fillData);
}

function change_eye() {
	$("#PreSharedKey").toggleClass("fh-text-security");
}


function initValidate() {
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": { required: true, minlength: password_length, maxlength: 63, nocn: true },
			"SSID": { required: true, minlength: 1, maxlength: 32, nocn: true },
			"reAuthentication": { required: true, range_int: [0, 86400], nocn: true },
			"24g_rssi": { required: true, range_int: [-100, 0] },
			"5g_rssi": { required: true, range_int: [-100, 0] },
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
	if (data) {
		wifidata = data.bandSteering;
		console.log(wifidata);
		bandsteering_enable = wifidata.X_FH_BandSteeringEnable;
		fillCurrentSel(selectIdx);
	}
}

function fillCurrentSel(sel) {
	var data = wifidata;
	if (data.X_FH_BandSteeringEnable == "1") {
		$("input[name='bs']:eq(0)").prop("checked", true)
	} else {
		$("input[name='bs']:eq(1)").prop("checked", true)
	}

	showBSInfo();

	$("#SSID").val(data.SSID);
	if (data.X_FH_SSIDHide == "1") {
		setCheckbox("X_FH_SSIDHide", "0");
	} else {
		setCheckbox("X_FH_SSIDHide", "1");
	}
	var BeaconTypeval = data.BeaconType;

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

	if (BeaconTypeval == "None") {
		$("#BeaconType").val("None");
		if (gNewUiFlag)
			$("#open_div").hide();
		else
			$("#open_div").show();
		$("#wpa_div").hide();
	} else {
		$("#BeaconType").val(BeaconTypeval);
	}

	if (BeaconTypeval == "Basic") {
		if (gNewUiFlag)
			$("#open_div").hide();
		else
			$("#open_div").show();
		$("#wpa_div").hide();
		var BasicEncryptionModes = data.BasicEncryptionModes;
		if (BasicEncryptionModes == "WEPEncryption") {
			$("#wep_div").show();
		} else {
			$("#wep_div").hide();
		}
	}
	else if (BeaconTypeval == "Both" || BeaconTypeval == "SharedKey") {
		$("#open_div").hide();
		$("#wpa_div").hide();
		$("#wep_div").show();
	}
	else if (BeaconTypeval == "WPA3") {
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
		$("#twoInput_div").show();
	}
	else if (BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPA" || BeaconTypeval == "WPA2" || BeaconTypeval == "11i") {
		if (BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "11i") {
			if (gNewUiFlag)
				$("#reAuthentication_div").hide();
			else
				$("#reAuthentication_div").show();
		}
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
	}

	$("#NodeEncryption").click(function() {
		$("#wpa3_div").hide();
	});

	$("#Tkipncryption, #Aesencryption, #Tkipaesncryption, #Saencryption").click(function() {
		$("#wpa3_div").show();
	});

	if (data.BasicEncryptionModes != "") {
		$("#BasicEncryptionModes").val(data.BasicEncryptionModes);
	}
	gMode = data.WPAEncryptionModes;
	if (gNewUiFlag) {
		if (data.WPAEncryptionModes == "TKIPEncryption")
			$("#WPA_Algorithms_text").html("TKIPAES")
		else if (data.WPAEncryptionModes == "TKIPandAESEncryption")
			$("#WPA_Algorithms_text").html("TKIPAES")
		else
			$("#WPA_Algorithms_text").html("AES")
	}
	$("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None

	temp_b64 = fhdecrypt(data.PreSharedKey);
	old_PreSharedKey = data.PreSharedKey;
	$("#PreSharedKey").val(temp_b64);
	gWPARekeyInterval = data.X_FH_WPARekeyInterval;
	g_rrsi_2 = data.X_FH_RSSIThreshold_2G;
	g_rrsi_5 = data.X_FH_RSSIThreshold_5G;
}


function saveApply() {
	show_shadow();

	if (!$("#wlanAdv_settings_form").valid()) {
		alert("invalid_value_alert".i18n());
		return;
	}

	var postdata = new Object();
	postdata.action = "info";
	var BeaconType = $("#BeaconType").val();
	if (BeaconType == "Basic") {
		postdata.BeaconType = "None";
		postdata.BasicAuthenticationMode = "OpenSystem";
		postdata.BasicEncryptionModes = "None";
	} else {
		postdata.BeaconType = BeaconType;
		postdata.WPAEncryptionModes = gMode;
		var temp_b64 = fhencrypt($("#PreSharedKey").val());
		postdata.PreSharedKey = temp_b64;
		if (BeaconType == "11i" || BeaconType == "WPA/WPA2") {
			postdata.X_FH_WPARekeyInterval = gWPARekeyInterval;
		}
	}
	if (operator_name != "COL_MILLICOM") {
		postdata.X_FH_RSSIThreshold_2G = g_rrsi_2;
		postdata.X_FH_RSSIThreshold_5G = g_rrsi_5;
	}

	if ($("input[name='bs']:eq(0)").is(":checked")) {
		postdata.SSID = fhencrypt($("#SSID").val());
		postdata.X_FH_BandSteeringEnable = "1";
	} else {
		postdata.SSID = fhencrypt($("#SSID").val() + "_5");
		postdata.X_FH_BandSteeringEnable = "0";
	}

	XHR.post("set_bandSteering_wlan_MTK", postdata, fillData);

}



