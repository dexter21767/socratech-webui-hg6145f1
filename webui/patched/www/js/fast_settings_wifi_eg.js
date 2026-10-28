var g_data;
var login_user = "";
var operator_name = "";
var SSID = "";
var PreSharedKey = "";
var BeaconType = "";
var WPAEncryptionModes = "";
var RadioEnabled = "";
var X_FH_BandSteeringEnable = "";
var first_time_login = gFirstFlag;
var  band_steering_enable;
$(document).ready(function() {
	initValidate();
    if(first_time_login != "1"){
        window.parent.location = "../index.html";
    }
	customSwitchInit();

	XHR.get("get_bandSteering_wlan", null, bandsteering_info);
	XHR.get("get_wifi_status", null, initPage_2G);
    XHR.get("get_wifi_status_5G", null, initPage_5G);
	

    $("#WlanEnable_container").bind("click", function() {
    	if ($("#WlanEnable_container").hasClass("switch_content_on")) {
	
    		$("#wifi_setting_div").show();
    	} else {
	
			$("#wifi_setting_div").hide();
    		
    	}
    })
    
    $("#bandsteering_enable_container").bind("click", function() {
    	if ($("#bandsteering_enable_container").hasClass("switch_content_on")) {
    		$("#5g_wifi_setting").hide();
    	} else {
    		$("#5g_wifi_setting").show();
    	}
        saveEnable_Apply();
    })
});

function bandsteering_info(data)
{
	band_steering_enable = data.bandSteering.X_FH_BandSteeringEnable;
}

function change_eye() {
	$("#PreSharedKey").toggleClass("fh-text-security");
}

function initValidate() {
	$("#wifi_form").validate({
		debug: false,
		rules: {
			SSID: { required: true, minlength: 1, maxlength: 32, nocn: true },
			PreSharedKey: { required: true, minlength: 8, maxlength: 63, nocn: true },
		},
		errorPlacement: function(error, element) {
			//错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) {
			//校验成功回调
			fiberlog("validate user management settings ok.....");
		},
		invalidHandler: function(form, validator) {
			//校验失败回调
			fiberlog("validate user management failed.....");
			return false;
		},
	});
}

function initPage_2G(data) {
	console.log(data)
	if (data != null) {
		this.SSID = data.wifi_status[0].SSID;//data.wifi_status[0].SSID;
		this.PreSharedKey = data.wifi_status[0].PreSharedKey;
		this.BeaconType = data.wifi_status[0].BeaconType;
		this.WPAEncryptionModes = data.wifi_status[0].WPAEncryptionModes;
		this.RadioEnabled = data.wifi_status[0].RadioEnabled;
		this.X_FH_BandSteeringEnable = data.wifi_status[0].bandsteering_enable;
	}
	displaywifiHtml_2G();
}

function initPage_5G(data) {
	console.log(data)
	if (data != null) {
		this.SSID = data.wifi_status5g[0].SSID;//data.wifi_status[0].SSID;
		this.PreSharedKey = data.wifi_status5g[0].PreSharedKey;
		this.BeaconType = data.wifi_status5g[0].BeaconType;
		this.WPAEncryptionModes = data.wifi_status5g[0].WPAEncryptionModes;
		this.RadioEnabled = data.wifi_status5g[0].RadioEnabled;
	}
	displaywifiHtml_5G();
}

function displaywifiHtml_5G() {
	$("#5GSSID").val(fhdecrypt(this.SSID)+"_5G");
	$("#5GPreSharedKey").val(fhdecrypt(this.PreSharedKey));
	$("#5GBeaconType").val(this.BeaconType);
	$("#5GWPAEncryptionModes").val(this.WPAEncryptionModes);
	if (this.BeaconType == "Basic")
		$("#wpa_div").hide();
	else
		$("#wpa_div").show();

	setSwitchValue("WlanEnable_container", this.RadioEnabled);

	if (this.RadioEnabled == "1") {
		$("#wifi_setting_div").show();
		$("#WlanEnable").val("1");

	} else {
		$("#wifi_setting_div").hide();
		$("#WlanEnable").val("0");
	}

}


function displaywifiHtml_2G() {
	$("#SSID").val(fhdecrypt(this.SSID));
	$("#PreSharedKey").val(fhdecrypt(this.PreSharedKey));
	$("#BeaconType").val(this.BeaconType);
	$("#WPAEncryptionModes").val(this.WPAEncryptionModes);
	if (this.BeaconType == "Basic")
		$("#wpa_div").hide();
	else
		$("#wpa_div").show();

	setSwitchValue("WlanEnable_container", this.RadioEnabled);

	if (this.RadioEnabled == "1") {
		$("#wifi_setting_div").show();
		$("#WlanEnable").val("1");

	} else {
		$("#wifi_setting_div").hide();
		$("#WlanEnable").val("0");
	}
    
    setSwitchValue("bandsteering_enable_container", this.X_FH_BandSteeringEnable);

	if (this.X_FH_BandSteeringEnable == '1') {
		//$("#bandsteering").prop("checked", true);
         $("#5g_wifi_setting").hide();
	}
	else {
		//$("#bandsteering").prop("checked", false);
        $("#5g_wifi_setting").show();
	}
}


function saveEnable_Apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
    postdata.X_FH_BandSteeringEnable  =  $("input[name='bandsteering_enable']").val();
    XHR.post("set_bandSteering_wlan", postdata, bandsteering_info);
	//更新全局变量band_steering
	//parent.band_steering = postdata.X_FH_BandSteeringEnable;	
}

function wifiApply() {
	show_shadow();
	if (!$("#wifi_form").valid()) {
		return;
	}
	var postdata = new Object();
	postdata.RadioEnabled = $("#WlanEnable").val()
	if ($("#WlanEnable").val() == "1") {
		var BeaconType = $("#BeaconType").val();
		postdata.SSID = fhencrypt($("#SSID").val());
		postdata.BeaconType = BeaconType;
		if (BeaconType == "Basic") {
			postdata.BasicAuthenticationMode = "OpenSystem";
			postdata.BasicEncryptionModes = "None";
		} else {
			postdata.PreSharedKey = fhencrypt($("#PreSharedKey").val());
			postdata.WPAEncryptionModes = $("#WPAEncryptionModes").val();
		}
		postdata.X_FH_BandSteeringEnable = band_steering_enable;
		//alert(postdata.X_FH_BandSteeringEnable);
        if(postdata.X_FH_BandSteeringEnable != "1")
        {
            var BeaconType_5G = $("#5GBeaconType").val();
            postdata.SSID_5G = fhencrypt($("#5GSSID").val());
            postdata.BeaconType_5G = BeaconType_5G;
            if (BeaconType_5G == "Basic") {
            	postdata.BasicAuthenticationMode_5G = "OpenSystem";
            	postdata.BasicEncryptionModes_5G = "None";
            } else {
            	postdata.PreSharedKey_5G = fhencrypt($("#5GPreSharedKey").val());
            	postdata.WPAEncryptionModes_5G = $("#5GWPAEncryptionModes").val();
            }
        }
	}

	XHR.post("setWlanAdvancedSettings_EG", postdata, function() {
        XHR.get("set_web_config", null, null);
		window.location.href = "main_inter.html";
	});
}
function change_type_5G() {
	var BeaconTypeval = $("#5GBeaconType").val();
	if (BeaconTypeval == "Basic") {
		$("#5Gwpa_div").hide();
	} else {
		$("#5Gwpa_div").show();
		if (BeaconTypeval == "WPA3" || BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "11i") {
			$("#5GWPAEncryptionModes").val("AESEncryption");
		} else {
			$("#5GWPAEncryptionModes").val("TKIPandAESEncryption");
		}
	}
}

function change_type() {
	var BeaconTypeval = $("#BeaconType").val();
	if (BeaconTypeval == "Basic") {
		$("#wpa_div").hide();
	} else {
		$("#wpa_div").show();
		if (BeaconTypeval == "WPA3" || BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "11i") {
			$("#WPAEncryptionModes").val("AESEncryption");
		} else {
			$("#WPAEncryptionModes").val("TKIPandAESEncryption");
		}
	}

}
