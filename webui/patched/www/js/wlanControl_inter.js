var currentData = "";
var AssociateNumdata = "";
var operator_name = gOperatorName;
var userlevel = gLoginUser;
var ssidstr = new Array();
var fttr_type = gFttr_type;
var multiAP = "";

$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	//厄瓜多尔版本定制化显示120-200%功率
	if (operator_name == "ECU_CNT" || operator_name == "COL_EMCALI") {
		$("#TransmitPower option[value=120]").show();
		$("#TransmitPower option[value=140]").show();
		$("#TransmitPower option[value=160]").show();
		$("#TransmitPower option[value=180]").show();
		$("#TransmitPower option[value=200]").show();
	}

	if(gOperatorMode == "13" && operator_name == "MY_TM")
	{
		$("#TransmitPower").attr("disabled", true);
		$("#wifi_power_apply").attr("disabled", true);
		$("#wifi_power_cancel").attr("disabled", true);
	}
	if(operator_name == "FTTR_SUB_COMMON")
		XHR.get("get_multiAP_enable", null, multiInfo);

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	init_wlan_power();
	initPage();
	customSwitchInit();
	customPasswordInit();



	if ((operator_name == "FTTR_SUB_COMMON" && multiAP == "1")) {

		$("#multiap_tip").show();
		$("#wireless_apply").hide();
		$("#wireless_apply2").hide();
		$("#TransmitPower").attr("disabled", true);
		$(".main_header_hint").html("wifipower_prompt_ap".i18n());
		for (var i = 1; i <= AssociateNumdata.length; i++)
			$("#AssociateNum_" + i).attr("disabled", true);
	}

	if (operator_name == "IDN_TELKOM") {
		if (ssidstr.indexOf(1) >= 0 && ssidstr.indexOf(2) >= 0 && ssidstr.indexOf(3) >= 0 && ssidstr.indexOf(4) >= 0) {
			$("#wifi_con_num_div").hide();
		}
	}
});

function multiInfo(data) {
	multiAP = data.multiAP_enable.Enable;
}

function initPage() {
	if (gDebug) {
		getDataByAjax("../fake/wlanAdvanced", fillData);
	} else {

		if (operator_name == "IDN_TELKOM") {
			XHR.get("get_allwan_info", null, getSSID);
		}
		XHR.get("getWlanControl", null, fillData);

	}
}
//获取wan连接中ssid的编号
function getSSID(all_wan_info) {
	for (var i = 0; i < all_wan_info.wan.length; i++) {
		var single_wan = all_wan_info.wan[i];
		if (single_wan.Name.indexOf("_B_") >= 0 && single_wan.Name.indexOf("INTERNET") >= 0) {
			ssid = single_wan.LanInterface.split(',');
			for (var j = 0; j < ssid.length; j++) {
				if (ssid[j].indexOf("dev.wla.") >= 0) {
					console.log(ssid[j].substr(-1));
					ssidstr.push(Number(ssid[j].slice(8)));
				}
			}
			//ssid.push(single_wan.LanInterface.substr(single_wan.LanInterface.length -1)); 	
		}
	}
}

function init_wlan_power() {
	wlan_power_html = '<input type="radio" name="wifi_power" value="3"><font>High</font>&nbsp&nbsp&nbsp' +
		'<input type="radio" name="wifi_power" value="2"><font>Medium</font>&nbsp&nbsp&nbsp' +
		'<input type="radio" name="wifi_power" value="1"><font>Standard</font>';
	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE") {
		$("#wifi_power_control").html(wlan_power_html);
	}

	if (operator_name == "MEX_TELMEX") {
		wlan_power_html = '';
		wlan_power_html = '<input type="radio" name="wifi_power" value="4"><font>' + "maximum".i18n() + '</font>&nbsp&nbsp&nbsp' +
			'<input type="radio" name="wifi_power" value="3"><font>' + "high".i18n() + '</font>&nbsp&nbsp&nbsp' +
			'<input type="radio" name="wifi_power" value="2"><font>' + "medium".i18n() + '</font>&nbsp&nbsp&nbsp' +
			'<input type="radio" name="wifi_power" value="1"><font>' + "low".i18n() + '</font>';
		$("#wifi_power_control").html(wlan_power_html);
	}
}

function fillData(data) {
	if (data && data.AssociateNum) {
		currentData = data;
		AssociateNumdata = data.AssociateNum;
		var AssociateHtml = [];
		for (var i = 1; i <= AssociateNumdata.length; i++) {
			console.log(ssidstr.indexOf(i));
			if (operator_name == "IDN_TELKOM") {
				if (ssidstr.indexOf(i) > -1) {
					continue;

				}
			}
			if (gNewUiFlag) {
			AssociateHtml += '<div class="main_item" id="ssid_' + i + '">' +
					'<div class="main_item_name"> <span class="redcolorfont">*&nbsp;&nbsp;</span>SSID' + i + '</div>' +
					'<div class="main_item_content">' +
					'<div class="tip_text" id="tip_AssociateNum_' + i + '"> 1-32 characters</div>' +
					'<input type="text" class="input_text" autocomplete="off" id="AssociateNum_' + i + '"/>' +
					'<div id="err_AssociateNum_' + i + '" class="main_item_error_hint_extra"></div>' +
					'</div>' +
					'</div>';
			} else {
				AssociateHtml += '<div class="main_item" id="ssid_' + i + '">' +
				'<div class="main_item_name">SSID' + i + '</div>' +
				'<div class="main_item_content">' +
				'<input type="text" class="input_text" autocomplete="off"  style="width: 188px" id="AssociateNum_' + i + '"/>' +
				'</div>' +
				'<div id="err_AssociateNum_' + i + '" class="main_item_error_hint_extra"></div>' +
				'</div>';
			}

		}
		console.log(AssociateHtml);
		$("#AssociateNumdiv").html(AssociateHtml);

		fillPower();
		fillAssociate();
	}
}

function fillPower() {
	$("#TransmitPower").val(currentData.TransmitPower);
	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE") {
		if (currentData.TransmitPower == "1") {
			$("input[name='wifi_power']").eq(2).attr('checked', 'true');
		}
		else if (currentData.TransmitPower == "2") {
			$("input[name='wifi_power']").eq(1).attr('checked', 'true');
		}
		else if (currentData.TransmitPower == "3") {
			$("input[name='wifi_power']").eq(0).attr('checked', 'true');
		}
	} else if (operator_name == "MEX_TELMEX") {
		if (currentData.TransmitPower == "1") {
			$("input[name='wifi_power']").eq(3).attr('checked', 'true');
		}
		else if (currentData.TransmitPower == "2") {
			$("input[name='wifi_power']").eq(2).attr('checked', 'true');
		}
		else if (currentData.TransmitPower == "3") {
			$("input[name='wifi_power']").eq(1).attr('checked', 'true');
		}
		else if (currentData.TransmitPower == "4") {
			$("input[name='wifi_power']").eq(0).attr('checked', 'true');
		}
	}
}

function fillAssociate() {
	for (var i = 1; i <= AssociateNumdata.length; i++) {
		$("#AssociateNum_" + i).val(AssociateNumdata[i - 1].X_FH_AssociateNum);
	}
	if ((operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") && userlevel == 0) {
		for (var i = 2; i <= AssociateNumdata.length; i++) {
			$("#ssid_" + i).hide();
		}
	}
}

function PowerCancelBtn() {
	fillPower();
}

function CancelBtn() {
	fillAssociate();
}

function PowersaveApply() {
	  
    if(gOperatorMode == "13" && operator_name == "MY_TM")
    {
        return;
    }
	show_shadow();
	var postdata = new Object();
	postdata.method = "Power";
	postdata.TransmitPower = $("#TransmitPower").val();
	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE" || operator_name == "MEX_TELMEX") {
		postdata.TransmitPower = $("input[name='wifi_power']:checked").val();
	}
	XHR.post("setWlanControl", postdata, fillData);
}

function saveApply() {
	var postdata = new Object();
	for (var i = 1; i <= AssociateNumdata.length; i++) {
		var Associate = "AssociateNum_" + i;
		var Associateval = $("#" + Associate).val();

		if(operator_name == "IDN_TELKOM"){

			if($("#AssociateNum_1").val()== undefined)
			{
				alert("not_config".i18n())
				return
			}
				
			if( Associateval == undefined)
				Associateval = $("#AssociateNum_1").val();
		}

		if (!valid_Range_Int(Associateval, 0, 32)) {
			if (gNewUiFlag)
				myAlert('Tip', '' + "pf_connetnumberIllegalAlert".i18n() + '', function() { })
			else
			$("#err_AssociateNum_" + i).html("pf_connetnumberIllegalAlert".i18n());
			return;
		}

		if(operator_name == "IDN_TELKOM"){
			if(i>1 && Associateval != $("#AssociateNum_1").val()){
				alert("ssid1_same".i18n())
				return
			}
		}
		postdata[Associate] = Associateval;
	}
	show_shadow();
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	postdata.method = "Associate";
	XHR.post("setWlanControl", postdata, fillData);
}

