var sessionidstr = "";
var wifidata = "";
var selectIdx = 0;
var old_PreSharedKey;
var multiAP = "";
var bandsteering_enable = "";
var operator_name = gOperatorName;
var device_type = gModelName;
var wifi_type = gWifiCap;

$(document).ready(function() {
    //优化滚动条，无需改动
    //show_shadow();
    //customSwitchInit();
    customPasswordInit();
    //customScrollBar("html");    
    XHR.get("get_multiAP_enable", null, getMultiap);
    //initValidate();
    //印尼电信隐藏802.11ax
    if (operator_name == "IDN_TELKOM") {
        $("#BeaconType option[value=WPA3]").hide();
        $("#BeaconType option[value='WPA2/WPA3']").hide();
    }
    if (operator_name == "COL_MILLICOM") {
        $("#2g_5gRssi").hide();
    }

    if (gOperatorName == "MEX_TELMEX") {
        $(".main_item_name").css("width", "30%");
        $(".main_item_content").css("width", "calc(70% - 3px)");
    }
    if (gOperatorName == "PLE_PALTEL") {
        $("#X_FH_SSIDHide").show();
        $("#hide_tip").show();
    }

    if (device_type == "HG6145F3") {
        $("#button_div").hide();
        $("#button_div_AIS").show();
    }
    function getMultiap(data) {
        multiAP = data.multiAP_enable.Enable;

    }
    customSwitchInit();

    $("#WlanEnable_container").bind("click", function() {
        if (device_type == "HG6145F3") {
            if ($("#WlanEnable_container").hasClass("switch_content_on")) {
                $("#change_bandSteering_mode").show();
            } else {
                $("#change_bandSteering_mode").hide();
            }
        } else {
            saveEnable_Apply();
        }
    });

	initValidate();
	$("#common_password_tip").show();
    
    if (wifi_type == "0") {
        $("#WPA3").hide();
        $("#WPA2WPA3").hide();
    }

    if (gModelName == "HG6145F1") {
		$("#WPA3").show();
		$("#WPA2WPA3").show();
	}

    if(operator_name == "MEX_TP"){
        $("#reAuthentication").attr("disabled",true);
    }

    $("#BeaconType").bind("change", function() {
        var BeaconTypeval = $(this).val();
        if (BeaconTypeval == "Basic") {
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
            $("#open_div").hide();
            $("#wep_div").hide();
            $("#wpa_div").show();
            $("#twoInput_div").hide();
            $("#reAuthentication_div").show();
        } else if (BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPA" || BeaconTypeval == "11i" || BeaconTypeval == "WPAand11i") {
            if (BeaconTypeval == "11i" || BeaconTypeval == "WPA/WPA2" ) {
                $("#reAuthentication_div").show();
            } else {
                $("#reAuthentication_div").hide();
            }
            $("#open_div").hide();
            $("#wep_div").hide();
            $("#wpa_div").show();
            $("#twoInput_div").hide();
        }else{
			$("#wpa3_div").show();
			$("#wpa-enterprise_div").hide();
			$("#open_div").hide();
			$("#wpa_div").show();
			$("#reAuthentication_div").hide();
		}
    });

    //根据BandSteering动态显示SSID Name等信息
    $("#bandsteering_enable_container").bind("click", function() {
        if ($("#bandsteering_data").val() == "1") {
            $("#change_bandSteering_mode").show();
        } else {
            $("#change_bandSteering_mode").hide();
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

function initPage() {

    XHR.get("get_bandSteering_wlan", null, fillData);
}

function change_eye() {
    $("#PreSharedKey").toggleClass("fh-text-security");
}

function initValidate_pldt() {
    $("#wlanAdv_settings_form").validate({
        debug: true,
        rules: {
            "PreSharedKey": { required: true, minlength: 12, maxlength: 63, nocn: true, pwdcheck_pldt: true },
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

function initValidate_telmex() {
    $("#wlanAdv_settings_form").validate({
        debug: true,
        rules: {
            "PreSharedKey": { required: true, minlength: 8, maxlength: 63, nocn: true, pwdcheck_telmex: true },
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


function initValidate() {
    $("#wlanAdv_settings_form").validate({
        debug: true,
        rules: {
            "PreSharedKey": { required: true, minlength: 8, maxlength: 63, nocn: true },
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
        bandsteering_enable = wifidata.X_FH_BandSteeringEnable;
        fillCurrentSel(selectIdx);
    }
}

function fillCurrentSel(sel) {
    var data = wifidata;

    if (data.X_FH_BandSteeringEnable == "0") {
        $("#change_bandSteering_mode").hide();
    } else {
        $("#change_bandSteering_mode").show();
    }

    setSwitchValue("WlanEnable_container", data.X_FH_BandSteeringEnable);

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
        $("#open_div").show();
        $("#wpa_div").hide();
    } else {
        $("#BeaconType").val(BeaconTypeval);
    }

    if (BeaconTypeval == "Basic") {
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
            $("#reAuthentication_div").show();
        }
        $("#open_div").hide();
        $("#wep_div").hide();
        $("#wpa_div").show();
    }else{
        $("#BeaconType").val("WPA");
        $("#reAuthentication_div").hide();
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
    if (data.WPAEncryptionModes == "TKIPEncryption"){
		$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
	}else if (data.WPAEncryptionModes == "TKIPandAESEncryption"){
		$("input[name='WPAEncryptionModes']:eq(2)").attr('checked', 'checked');
	}else if(data.WPAEncryptionModes == "AESEncryption"){
		$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
	}
    $("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None

    temp_b64 = fhdecrypt(data.PreSharedKey);
    old_PreSharedKey = data.PreSharedKey;
    $("#PreSharedKey").val(temp_b64);
    if(operator_name == "MEX_TP"){
        $("#reAuthentication").val("86400");
    }else{
        $("#reAuthentication").val(data.X_FH_WPARekeyInterval);
    }
    $("#24g_rssi").val(data.X_FH_RSSIThreshold_2G);
    $("#5g_rssi").val(data.X_FH_RSSIThreshold_5G);
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


function extraValidCheck() {
    if (parseInt($("#24g_rssi").val()) < parseInt($("#5g_rssi").val())) {
        alert("rssi_invalid_value_alert".i18n());
        return false;
    }
    return true;
}

function saveEnable_Apply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.X_FH_BandSteeringEnable = $("input[name='WlanEnable_checkbox']").val();
    XHR.post("set_bandSteering_wlan", postdata, fillData);
    
    //更新全局变量band_steering
    parent.band_steering = postdata.X_FH_BandSteeringEnable;
}

function saveApply() {
    show_shadow();

    if (!$("#wlanAdv_settings_form").valid()) {
        alert("invalid_value_alert".i18n());
        return;
    }

    if (!extraValidCheck()) {
        // alert("illegal_value_alert".i18n());
        return;
    }
    var postdata = new Object();
    postdata.action = "info";
    if (device_type != "HG6145F3") {
        postdata.SSID = fhencrypt($("#SSID").val());
    }

    if (operator_name == "PLE_PALTEL") {
        postdata.X_FH_SSIDHide = $("#X_FH_SSIDHide").prop("checked") ? 0 : 1;
    }
    var BeaconType = $("#BeaconType").val();
    if (BeaconType == "Basic") {
        if (device_type == "HG6145F3") {
            postdata.BeaconType = "None";
        } else {
            postdata.BeaconType = BeaconType;
        }
        postdata.BasicAuthenticationMode = "OpenSystem";
        var BasicEncryptionModes = $("#BasicEncryptionModes").val();
        postdata.BasicEncryptionModes = BasicEncryptionModes;
    } else {
        postdata.BeaconType = BeaconType;

        postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
        var temp_b64 = fhencrypt($("#PreSharedKey").val());
        postdata.PreSharedKey = temp_b64;
        if (BeaconType == "11i" || BeaconType == "WPA/WPA2") {
            if(operator_name == "MEX_TP"){
                postdata.X_FH_WPARekeyInterval = "86400";
            }else{
                postdata.X_FH_WPARekeyInterval = $("#reAuthentication").val();
            }
        }
    }
    if (operator_name != "COL_MILLICOM") {
        postdata.X_FH_RSSIThreshold_2G = $("#24g_rssi").val();
        postdata.X_FH_RSSIThreshold_5G = $("#5g_rssi").val();
    }
    if (device_type == "HG6145F3") {
        if (operator_name == "TH_AIS") {
            postdata.isolation_enable = $("input[name='ssid_isolation']:checked").val();
        }
        if ($("#WlanEnable_container").hasClass("switch_content_on")) {
            postdata.SSID = fhencrypt($("#SSID").val());
            postdata.X_FH_BandSteeringEnable = "1";
        } else {
            postdata.SSID = fhencrypt($("#SSID").val() + "_5");
            postdata.X_FH_BandSteeringEnable = "0";
        }
        XHR.post("set_bandSteering_wlan_MTK", postdata, fillData);

        //更新全局变量band_steering
        parent.band_steering = postdata.X_FH_BandSteeringEnable;
    } else {
        XHR.post("set_bandSteering_wlan", postdata, fillData);
    }
}



