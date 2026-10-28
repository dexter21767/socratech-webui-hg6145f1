var sessionidstr = "";
var wifidata = "";
var selectIdx = 0;
var old_PreSharedKey;
var multiAP = "";
var bandsteering_enable = "";
var operator_name = gOperatorName;	

$(document).ready(function(){
	//优化滚动条，无需改动
	//show_shadow();
	//customSwitchInit();
	customPasswordInit();
	//customScrollBar("html");	
	XHR.get("get_multiAP_enable", null, getMultiap);
	initValidate();

	function getMultiap(data){
		multiAP = data.multiAP_enable.Enable;	
		
	}
	customSwitchInit();
	
	$("#WlanEnable_container").bind("click", function(){
			saveEnable_Apply();
	});
	
	
	$("#BeaconType").bind("change", function(){
		var BeaconTypeval = $(this).val();
		if (BeaconTypeval == "Basic")
		{
			$("#open_div").show();
			$("#wpa_div").hide();
			$("#wpa3_div").hide();
			$("#wpa-enterprise_div").hide();
		}else if(BeaconTypeval == "WPA" ||BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "11i" )
		{	
			$("#open_div").hide();
			$("#wpa_div").show();
			$("#wpa3_div").show();
			$("#wpa-enterprise_div").hide();
		}else if(BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise" || BeaconTypeval == "WPA-WPA2-Enterprise" )//wifiä¼ä¸šè®¤è¯
		{
			$("#open_div").hide();
			$("#wpa_div").show();
			$("#wpa3_div").hide();
			$("#wpa-enterprise_div").show();
		}
	
    });
	
	//根据BandSteering动态显示SSID Name等信息
	$("#bandsteering_enable_container").bind("click",function(){
		if($("#bandsteering_data").val() == "1")
		{
			$("#change_bandSteering_mode").show();
		}else{
			$("#change_bandSteering_mode").hide();
			}
	});
	initPage();

});

function initPage()
{
	XHR.get("get_bandSteering_wlan", null, fillData);	
}

function change_eye()
{
    $("#PreSharedKey").toggleClass("fh-text-security");	
}

function initValidate()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": {required: true, minlength:8, maxlength:63, nocn: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true},
            "24g_rssi":{required: true, range_int: [-100, 0]},
            "5g_rssi":{required: true, range_int: [-100, 0]},
            "ip_address": {required: true, ipv4: true},
			"port": {required: true, range_int:[1,65535]},
			"shared_secret": {required: true, minlength:1, maxlength:64, nocn: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}

function fillData(data)
{
	if (data)
	{
		wifidata = data.bandSteering;
		bandsteering_enable = wifidata.X_FH_BandSteeringEnable;
		fillCurrentSel(selectIdx);
	}
}

function fillCurrentSel(sel)
{
	var data = wifidata;

	
	if(data.X_FH_BandSteeringEnable == "0"){
		$("#change_bandSteering_mode").hide();
	}else{
		$("#change_bandSteering_mode").show();
	}
    setSwitchValue("WlanEnable_container", data.X_FH_BandSteeringEnable);

	
	$("#SSID").val(data.SSID);
	var BeaconTypeval = data.BeaconType;
	
	if (BeaconTypeval == "Basic")
	{
		if (data.BasicAuthenticationMode == "SharedKey")
		{
			BeaconTypeval = "SharedKey";
		}

		if (data.BasicAuthenticationMode == "Both")
		{
			BeaconTypeval = "Both";
		}
	}

	if(BeaconTypeval == "WPA3"){
		if(data.WPAEncryptionModes == "None"){
			$("#wpa3_div").hide();
		}else{
			$("#wpa3_div").show();
		}
	}

	if(BeaconTypeval == "None"){
		$("#BeaconType").val("None");
		$("#open_div").show();
		$("#wpa_div").hide();
	}else
	{
		$("#BeaconType").val(BeaconTypeval);
	}

	if (BeaconTypeval == "Basic")
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
	else if(BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPA" || BeaconTypeval == "WPA2" || BeaconTypeval == "11i")
	{
	if (BeaconTypeval == "WPA/WPA2"  || BeaconTypeval == "11i")
		{
			$("#reAuthentication_div").show();
		}
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
	}
	else if(BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise" || BeaconTypeval == "WPA-WPA2-Enterprise"){
		$("#open_div").hide();
		$("#wpa_div").show();
		$("#wpa3_div").hide();
		$("#wpa-enterprise_div").show();
	}
	
	//$("#Tkipncryption, #Aesencryption, #Tkipaesncryption, #Saencryption").click(function(){
		//$("#wpa3_div").show();
	//});

	if (data.WPAEncryptionModes == "TKIPEncryption"){
			$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
		}else if (data.WPAEncryptionModes == "TKIPandAESEncryption"){
			$("input[name='WPAEncryptionModes']:eq(2)").attr('checked', 'checked');
		}else if(data.WPAEncryptionModes == "AESEncryption"){
			$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
		}

	
	if (data.BasicEncryptionModes != ""){
		$("#BasicEncryptionModes").val(data.BasicEncryptionModes);
	}
	
	temp_b64 = fhdecrypt(data.PreSharedKey);
	$("#PreSharedKey").val(temp_b64);
	
	//$("#reAuthentication").val(data.X_FH_WPARekeyInterval);
	if(multiAP == "1"){
		$("#24g_rssi").val(data.X_FH_RSSIThreshold_2G);
		$("#5g_rssi").val(data.X_FH_RSSIThreshold_5G);
	}else{
		$("#24g_rssi").val(data.X_FH_RSSIThreshold_2G);
		$("#5g_rssi").val(data.X_FH_RSSIThreshold_5G);
	}
	$("#ip_address").val(data.ServiceIp);
	$("#port").val(data.Port);
	$("#shared_secret").val(fhdecrypt(data.Key));
	var temp_b64 = fhdecrypt(data.PreSharedKey);
	$("#PreSharedKey").val(temp_b64);
	
}


function extraValidCheck()
{
	if(parseInt($("#24g_rssi").val()) < parseInt($("#5g_rssi").val())){
		alert("rssi_invalid_value_alert".i18n());
		return false;
	}
	return true;
}

function saveEnable_Apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
    postdata.X_FH_BandSteeringEnable  =  $("input[name='WlanEnable_checkbox']").val();
    XHR.post("set_bandSteering_wlan", postdata, fillData);
	// if(multiAP == "1"){	
	// 	postdata.X_FH_BandSteeringEnable  =  $("input[name='WlanEnable_checkbox']").val();
	// 	XHR.post("set_bandSteering_wlan", postdata, fillData);
	// 	if(postdata.X_FH_BandSteeringEnable == "1") //开启mesh，开启bandsteering时，显示bandsteering页面，隐藏advance页面
	// 	{
	// 		$(".hide_or_not", window.parent.document).addClass("show-none");
	// 	}else //开启mesh，没开启bandsteering时，按照原有格式实现
	// 	{
	// 		$(".hide_or_not", window.parent.document).removeClass("show-none");
	// 	}
	// }else if(multiAP == "0"){
	// 	postdata.X_FH_BandSteeringEnable  =  $("input[name='WlanEnable_checkbox']").val();
	// 	//$(".thr-menu-open", window.parent.document).children().removeClass("thr-menu-select").eq(1).addClass("thr-menu-select");
	// 	pause_back();
	// 	XHR.post("set_bandSteering_wlan", postdata, fillData);
	// }else{
	// 	$(".hide_or_not", window.parent.document).removeClass("show-none");
	// 	}
	//更新全局变量band_steering
	parent.band_steering = postdata.X_FH_BandSteeringEnable;	
}

function saveApply()
{
	show_shadow();
	
	if( ! $("#wlanAdv_settings_form").valid() )
	{
		alert("invalid_value_alert".i18n());
		return;
	}
	
	if( !extraValidCheck() )
	{
	   // alert("illegal_value_alert".i18n());
	    return;
	}
	var postdata = new Object();
	postdata.action = "info";
	postdata.SSID = fhencrypt($("#SSID").val());     
	//postdata.X_FH_SSIDHide = $("#X_FH_SSIDHide").prop("checked") ? 0 : 1;
	var BeaconType = $("#BeaconType").val();
	if(BeaconType == "Basic"){
		postdata.BeaconType = BeaconType;
		postdata.BasicAuthenticationMode = "OpenSystem";
		var BasicEncryptionModes = $("#BasicEncryptionModes").val();
		postdata.BasicEncryptionModes = BasicEncryptionModes;
	}else if(BeaconType == "WPA-Enterprise" || BeaconType == "WPA2-Enterprise" || BeaconType == "WPA-WPA2-Enterprise"){
		postdata.BeaconType = BeaconType;
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		postdata.ip_address = $("#ip_address").val();
		postdata.port = $("#port").val();
		postdata.shared_secret = fhencrypt($("#shared_secret").val());
	}else{
		postdata.BeaconType = BeaconType;
		
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		var temp_b64 = fhencrypt($("#PreSharedKey").val());
		postdata.PreSharedKey = temp_b64; 
		/*if(BeaconType == "11i" || BeaconType == "WPA/WPA2"){
			postdata.X_FH_WPARekeyInterval = $("#reAuthentication").val();
		}*/
	}
        postdata.X_FH_RSSIThreshold_2G = $("#24g_rssi").val();
        postdata.X_FH_RSSIThreshold_5G = $("#5g_rssi").val();
        XHR.post("set_bandSteering_wlan", postdata, fillData);
	}
 


