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
	if (getdata.operator_mode == "0") {
		$("#current_mode").html("Auto mode");
	} else if (getdata.operator_mode == "1") {
		$("#current_mode").html("Main Router Tagged mode");
	} else if (getdata.operator_mode == "2") {
		$("#current_mode").html("Main Router Untagged mode");
	} else if (getdata.operator_mode == "3") {
		$("#current_mode").html("AP mode");
	}

	if ((operator_name == "TH_AIS" || operator_name == "MY_TM") && loginUser == "0") {
		$("#operator_mode_auto_div").hide();
		$("#operator_mode_ap_div").hide();
	} else {
		$("#operator_mode_auto_div").show();
		$("#operator_mode_ap_div").show();
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
	if (g_data.operator_mode == "0") {
		$("#operator_mode_auto").prop('checked', true);
	}
	else if (g_data.operator_mode == "1") {
		$("#operator_mode_tagged").prop('checked', true);
	}
	else if (g_data.operator_mode == "2") {
		$("#operator_mode_untagged").prop('checked', true);
	}
	else if (g_data.operator_mode == "3") {
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
	if ((operator_name == "TH_AIS" || operator_name == "MY_TM") && loginUser == "0") {
		if (mode == "0" || mode == "3") {
			return;
		}
	}
	if (mode == "3") {
		alert("takes_effect_after_device_restart".i18n());
		var postdata = new Object();
		postdata.operator_mode = mode;
		XHR.post("set_operator_mode_info", postdata, LoadStatus);
	} else {
		sessionStorage.setItem("mode", mode);
		window.open('upstream_configure_ais_inter.html', 'popwindow', 'height=100',
			'width=150', 'top=100', 'left=100', 'toolbar=no', 'location=no', 'resizable=yes');

	}

}

