var sessionidstr = "";
var g_data;
var operator_name = gOperatorName;
var loginUser = gLoginUser;
$(document).ready(function() {
	if (gDebug) {
		getDataByAjax("../fake/firewall", initPage);
	}
	else {
		XHR.get("get_operator_mode_info", null, initPage);
	}
});

function initPage(getdata) {
	if (getdata.operator_mode == "10") {
		$("#current_mode").html("Combo Mode");
	} else if (getdata.operator_mode == "11") {
		$("#current_mode").html("Bridge Mode");
	} else if (getdata.operator_mode == "12") {
		$("#current_mode").html("RG Mode");
	} else if (getdata.operator_mode == "13") {
		$("#current_mode").html("AP Mode");
	}


	if (getdata != null && getdata.operator_mode) {
		g_data = getdata;
		displayHtml();
	}
}

function cancel() {
	displayHtml();
}

function displayHtml() {
	if (g_data.operator_mode == "10") {
		$("#operator_mode_combo").prop('checked', true);
	}
	else if (g_data.operator_mode == "11") {
		$("#operator_mode_bridge").prop('checked', true);
	}
	else if (g_data.operator_mode == "12") {
		$("#operator_mode_rg").prop('checked', true);
	}
	else if (g_data.operator_mode == "13") {
		$("#operator_mode_ap").prop('checked', true);
	}

}

function LoadStatus(responseData) {
	var postdata2 = new Object();
	postdata2.sessionid = sessionidstr;
	XHR.post("set_onu_reboot", postdata2, null);
	jumpToLoginPage(true);
}

function save_apply() {
	show_shadow();
        var mode = $("input[name='operator_mode']:checked").val();
		alert("takes_effect_after_device_restart".i18n());
		var postdata = new Object();
		postdata.operator_mode = mode;
		XHR.post("set_operator_mode_info", postdata, LoadStatus);
}

