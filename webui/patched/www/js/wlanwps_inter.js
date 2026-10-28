var sessionidstr = "";
var g_wpsdata = "";
var selectIdx = 1;
var statusJSON;
var pincode24g;
var pincode5g;
var button24g;
var button5g;
var wpsButtonSelect = "";
var wifi_enable;
var wifi_5g_enable;
var inner_index = gWifi5GIndex;
var operator_name = gOperatorName;
var fttr_type = gFttr_type;
var multiAP = "";
var gssid1_hide;
var gssid5_hide;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	statusJSON = { "0": "connection_fail".i18n(), "1": "Connecting".i18n(), "2": "Time_Out".i18n(), "3": "connection_Successful".i18n() };
	//XHR.get("get_ssiddisplay_info", null, ssiddisplayInfo);

	if(operator_name == "FTTR_SUB_COMMON")
		XHR.get("get_multiAP_enable", null, multiInfo);
	
	if (operator_name == "EG_TELECOM") {
		XHR.get("get_wifi_status", null, getssidinfo_2g);
		XHR.get("get_wifi_status_5G", null, getssidinfo_5g);
	}

	initPage();
	setInterval(function() { getWPSstate(); }, 30000);

	$("#wifi_sel").bind("change", function() {
		var index = $(this).val();
		selectIdx = index;
		fillCurrentEnable(index);
		fillCurrentData(index);
		fillCurrentButton(index);

	});

	if (operator_name == "TH_AIS") {
		$("#div_wps_bandSelec").hide();
		$("#br_id").hide();
	}

	if ((operator_name == "FTTR_SUB_COMMON" && multiAP == "1")) {
		$("#multiap_tip").show();
		$("#wireless_apply").hide();
		$("#wireless_apply2").hide();
		$("#wifi_sel").attr("disabled", true);
		$("#wps_enable").attr("disabled", true);
		$("#wps_PIN").attr("disabled", true);
		$("#wps_style_p").attr("disabled", true);
		$("#wps_style_b").attr("disabled", true);
		$(".main_header_hint").html("wps_prompt_ap".i18n());
	}

	if (operator_name == "BZ_ALGAR") {
		$("#WPS_connect").val("wps_apply".i18n());
	}

});
function showWPSInfo() {
	if ($("input[name='wps_style']:first").is(':checked')) {
		$("#pin_code_div").show();
	} else {
		$("#pin_code_div").hide();
	}
}
function getssidinfo_2g(data) {
	gssid1_hide = data.wifi_status[0].X_FH_SSIDHide;
}

function getssidinfo_5g(data) {
	console.log(data)
	gssid5_hide = data.wifi_status5g[0].X_FH_SSIDHide;
}

// function ssiddisplayInfo(data) {
// 	inner_index = data.ssid_info.main_wifi_index_5g;
// }

function getWPSstate() {
	XHR.get("get_wps_info", null, fillWPSData);
}

function multiInfo(data) {
	multiAP = data.multiAP_enable.Enable;
}

function fillWPSData(data) {
	if (data) {
		if (wifi_enable == 1 && wifi_5g_enable == 1) {
			selectIdx = $("#wifi_sel").val();
		}
		else {
			if (wifi_enable == 1) {
				selectIdx = 1;
			}
			if (wifi_5g_enable == 1) {
				selectIdx = 5;
			}
		}
		fillCurrentData(selectIdx);
	}
}
function initPage() {
	if (gDebug) {
		getDataByAjax("../fake/wlanAdvanced", fillData);
	} else {
		XHR.get("get_wps_info", null, fillData);
	}
}

function fillData(data) {
	if (data) {
		//alert(JSON.stringify(data));
		g_wpsdata = data;
		pincode24g = g_wpsdata.pin24g;
		pincode5g = g_wpsdata.pin5g;
		button24g = g_wpsdata.button24g;
		button5g = g_wpsdata.button5g;
		wpsButtonSelect = g_wpsdata.wpsButtonSelect;
		wifi_enable = g_wpsdata.wifi_enable;
		wifi_5g_enable = g_wpsdata.wifi_5g_enable;
		if (button24g == "start") {
			$("#wps_style_b").prop("checked", true);
		} else {
			$("#wps_style_p").prop("checked", true);
		}
		if (wpsButtonSelect == "0") {
			$("#wifi_sel").val("1");
			selectIdx = 1;
		}
		if (wpsButtonSelect == "1") {
			$("#wifi_sel").val("5");
			selectIdx = 5;
		}
		if (wifi_enable == 1 && wifi_5g_enable == 1) {
			$("#wifi_sel").attr("disabled", false);
		}
		else {
			if (wifi_enable == 1) {
				$("#wifi_sel").val("1");
				selectIdx = 1;
			}
			if (wifi_5g_enable == 1) {
				$("#wifi_sel").val("5");
				selectIdx = 5;
			}
			$("#wifi_sel").attr("disabled", true);
		}

		fillCurrentEnable(selectIdx);
		fillCurrentData(selectIdx);
		fillCurrentButton(selectIdx);
	}
}
function fillCurrentButton(index) {
	if (index == "1") {
		if (button24g != "start") {
			$("#wps_style_p").prop("checked", true);
			$("#wps_PIN").val(pincode24g);
		} else {
			$("#wps_style_b").prop("checked", true);
			$("#wps_PIN").val(pincode24g);
			if(gNewUiFlag)
				$("#pin_code_div").hide();
		}

	} else if (index == "5") {
		if (button5g != "start") {
			$("#wps_style_p").prop("checked", true);
			$("#wps_PIN").val(pincode5g);
		} else {
			$("#wps_style_b").prop("checked", true);
			$("#wps_PIN").val(pincode5g);
			if(gNewUiFlag)
				$("#pin_code_div").hide();
		}
	}

}

function fillCurrentEnable(index) {
	if (index == "1") {
		//alert("2.4g");
		if (gNewUiFlag) {
			if (g_wpsdata.Enable2g == "1") {
				$("input[name='wps_enable']:first").attr('checked', 'checked');
			} else {
				$("input[name='wps_enable']:last").attr('checked', 'checked');
			}
		} else {
		setCheckbox("wps_enable", g_wpsdata.Enable2g);
		}
	} else {
		///alert("5g");
		if (gNewUiFlag) {
			if (g_wpsdata.Enable5g == "1") {
				$("input[name='wps_enable']:first").attr('checked', 'checked');
			} else {
				$("input[name='wps_enable']:last").attr('checked', 'checked');
			}
		} else {
		setCheckbox("wps_enable", g_wpsdata.Enable5g);
	}
	}
}

function checkwpspincode(str) {
	if (str.length > 0) {
		var re = /^[0-9]{8}$/;
		if (!re.test(str)) {
			return false;
		}
		else {
			return true;
		}
	}
	return true;
}

function fillCurrentData(index) {
	//statusJSON = {"0":"connection_fail".i18n(),"1":"Connecting".i18n(),"2":"Time_Out".i18n(),"3":"connection_Successful".i18n()};
	if (operator_name == "TH_AIS") {
		if (g_wpsdata.status2g == 3 || g_wpsdata.status5g == 3)//Successful
		{
			$("#wps_state").html(statusJSON[3]);
		}
		else if (g_wpsdata.status2g == 1 || g_wpsdata.status5g == 1)//Connecting
		{
			$("#wps_state").html(statusJSON[1]);
		}
		else if (g_wpsdata.status2g == 2 || g_wpsdata.status5g == 2)//Time_Out
		{
			$("#wps_state").html(statusJSON[2]);
		}
		else //fail
		{
			$("#wps_state").html(statusJSON[0]);
		}
	}
	else {
		if (index == "1") {
			$("#wps_state").html(statusJSON[g_wpsdata.status2g]);
		}
		else {
			$("#wps_state").html(statusJSON[g_wpsdata.status5g]);
		}
	}
}

function CancelBtnEnable() {
	var index = $("#wifi_sel").val();
	fillCurrentEnable(index);
}

function CancelBtn() {
	$("#wps_PIN").val("");
	$("input[name='wps_style']:first").attr('checked', 'checked');
}

function saveApplyEnable() {
	show_shadow();
	var postdata = new Object();
	var action;
	var index = $("#wifi_sel").val();
	if (operator_name == "TH_AIS") {
		postdata.action = "5g";
		postdata.Enable5g = getCheckbox("wps_enable");
		postdata.Enable2g = postdata.Enable5g;
		postdata.X_FH_WPSButtonSelect = "1";
	}
	else {
		if (index == "1") {
			if (gssid1_hide == "0" && operator_name == "EG_TELECOM") {
				alert("not_hide_24g_SSID1".i18n());
				return
			}
			postdata.action = "2.4g";
			if(gNewUiFlag)
				postdata.Enable2g = $("input[name='wps_enable']:checked").val();  
			else
				postdata.Enable2g = getCheckbox("wps_enable");
			postdata.X_FH_WPSButtonSelect = "0";
		}
		else {
			if (gssid5_hide == "0" && operator_name == "EG_TELECOM") {
				alert("not_hide_5g_SSID1".i18n());
				return
			}
			postdata.action = "5g";
			if(gNewUiFlag)
				postdata.Enable5g = $("input[name='wps_enable']:checked").val();  
			else
				postdata.Enable5g = getCheckbox("wps_enable");
			postdata.X_FH_WPSButtonSelect = "1";

		}
	}

	XHR.post("set_wps_enable", postdata, fillData);
}

function saveApply() {

	show_shadow();
	var postdata = new Object();
	var index = $("#wifi_sel").val();
	if (operator_name == "TH_AIS") {
		index = inner_index;
	}
	else {
		if (index == "5") {
			index = inner_index;
		}
	}

	postdata.index = index;
	if (gssid1_hide == "0" && operator_name == "EG_TELECOM" && index == "1") {
		alert("not_hide_24g_SSID1".i18n());
		return
	} else if (gssid5_hide == "0" && operator_name == "EG_TELECOM") {
		alert("not_hide_5g_SSID1".i18n());
		return
	}
	var mothed = $("input[name='wps_style']:checked").val();
	if (mothed == "PIN") {
		var pin_code = $("#wps_PIN").val();
		if (pin_code == "") {
			if(gNewUiFlag)
        		myAlert('Tip', '' + "wps_nopinalert".i18n() + '', function() { })
			else
			$("#wps_PIN-error").html("wps_nopinalert".i18n());
			$("#wps_PIN").focus();
			return false;
		}
		if (!checkwpspincode(pin_code)) {
			if(gNewUiFlag)
        		myAlert('Tip', '' + "wps_pinillegal".i18n() + '', function() { })
			else
			$("#wps_PIN-error").html("wps_pinillegal".i18n());
			$("#wps_PIN").focus();
			return false;
		}
		$("#wps_PIN-error").html("");
		postdata.mothed = "PIN";
		postdata.X_FH_WPSPIN = pin_code;
	} else {
		postdata.mothed = "button";
	}
	if ($("#wifi_sel").val() == "1") {
		postdata.X_FH_WPSButtonSelect = "0";
	}
	else {
		postdata.X_FH_WPSButtonSelect = "1";
	}

	XHR.post("set_wps_pin_button", postdata, fillData);
}

