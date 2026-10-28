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
var wps_enable_2g;
var wps_enable_5g;
var wifi_password_encode;
$(document).ready(function(){
	//优化滚动条，无需改动
	//show_shadow();
	//customSwitchInit();
    if(operator_name == "PH_RADIUS"){
        password_length = 12;
    }
	customPasswordInit();
	
	if(gOperatorMode == "13" && operator_name == "MY_TM")
	{
		$(":input").attr("disabled", true);
	}
	//customScrollBar("html");	
	XHR.get("get_multiAP_enable", null, getMultiap);
	//initValidate();
	//印尼电信隐藏802.11ax
	if(operator_name == "IDN_TELKOM" ){
		$("#BeaconType option[value=WPA3]").hide();
		$("#BeaconType option[value='WPA2/WPA3']").hide();
	}
	if (operator_name == "COL_MILLICOM") {
		$("#2g_5gRssi").hide();
	}
	if(operator_name == "MAR_INWI"){
		$("#secure_wpa_pass_phrase").html("Password");
	}
	if(gOperatorName == "MEX_TELMEX"){
		$(".main_item_name").css("width","30%");
		$(".main_item_content").css("width","calc(70% - 3px)");
	}
    if(gOperatorName == "PLE_PALTEL" || operator_name == "EG_TELECOM" || operator_name == "MY_TM"){
        $("#X_FH_SSIDHide").show();
        $("#hide_tip").show();
    }
	
	if(device_type == "HG6145F3" || device_type == "HG6145F4" ){
		$("#button_div").hide();
		$("#button_div_MTK").show();
	}
	function getMultiap(data){
		multiAP = data.multiAP_enable.Enable;	
		
	}

	if(!(gOperatorMode == "3" && gOperatorName == "TH_AIS") && !(operator_name == "FTTR_SUB_COMMON" && multiAP == "1" ))
	{
		customSwitchInit();
	}
	
	$("#WlanEnable_container").bind("click", function(){
			if(device_type == "HG6145F3" ||  device_type == "HG6145F4" ){
				if($("#WlanEnable_container").hasClass("switch_content_on")){
					$("#change_bandSteering_mode").show();
					if(operator_name == "TH_AIS")
					{
						if(BS_BackupEnable == "1")
						{
							$("#SSID").val(BS_SSID);
							$("#BeaconType").val(BS_BeaconType);
							if (BS_WPAEncryption == "TKIPandAESEncryption"){
								$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
							}else if(BS_WPAEncryption == "AESEncryption"){
								$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
							}
							var preSharedKey = fhdecrypt(BS_PreSharedKey);
							$("#PreSharedKey").val(preSharedKey);
						}
					}
				}else{
					$("#change_bandSteering_mode").hide();	
				}
			}else{
				if(!(operator_name == "FTTR_SUB_COMMON" && multiAP == "1" )){
					saveEnable_Apply();
				}
			}	
	});
	
	if (operator_name == "EG_TELECOM") {
		XHR.get("get_wps_info", null,wpsInfo);
	}

	if(operator_name == "PH_PLDT"){
		$("#show_password").show();
        initValidate_pldt();
        $("#pldt_password_tip").show();
	}else if(operator_name == "MEX_TELMEX"){
		initValidate_telmex();
		$("#telmex_password_tip").show();
			
	}else if(operator_name == "PH_RADIUS"){
		$("#show_password").show();
		$("#pldt_password_tip").show();	
        initValidate();
	}
    else{
		if(operator_name == "PLE_PALTEL" || operator_name == "TH_AIS" || operator_name == "MY_TM" ||
         operator_name ==  "EG_TELECOM" || operator_name ==  "COL_ETB" || operator_name == "ESP_EMBOU"){
			$("#show_password").show();   
		}
		initValidate();
		$("#common_password_tip").show();
	}

	/*WIFI5 设备无WPA3、WPA2WPA3*/
	if(wifi_type == "0")
	{
		$("#WPA3").hide();
		$("#WPA2WPA3").hide();
	}

	if (operator_name == "CHL_ENTEL" || operator_name == "COL_ETB") 
	{
		$("#Aesencryption").removeAttr("disabled");
		$("#Tkipaesncryption").removeAttr("disabled");
	}
    
	$("#BeaconType").bind("change", function(){
		var BeaconTypeval = $(this).val();
		if (BeaconTypeval == "Basic")
		{
			$("#open_div").show();
			$("#wpa_div").hide();
			if ($("#BasicEncryptionModes").val() == "WEPEncryption")
			{
				$("#wep_div").show();
			}
			else
			{
				$("#wep_div").hide();
			}
			$("#reAuthentication_div").hide();
		}else if(BeaconTypeval == "WPA/WPA2")
		{
			if (operator_name != "CHL_ENTEL" || operator_name != "COL_ETB") 
			{
				$("#Tkipaesncryption").attr("checked","checked");
			}
			$("#open_div").hide();
			$("#wep_div").hide();
			$("#wpa_div").show();
			$("#twoInput_div").hide();
			$("#reAuthentication_div").show();
		}else if((BeaconTypeval == "WPA3" || BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "11i"  ))
		{
		if (BeaconTypeval == "11i"){
			$("#reAuthentication_div").show();
		}else{
			$("#reAuthentication_div").hide();
		}
			if (operator_name != "CHL_ENTEL" || operator_name != "COL_ETB") 
			{
				$("#Aesencryption").attr("checked","checked");
			}
			$("#open_div").hide();
			$("#wep_div").hide();
			$("#wpa_div").show();
			$("#twoInput_div").hide();
		}
		
		if(gOperatorName == "TH_AIS"){
			$("#reAuthentication_div").hide();
			$("#open_div").hide();	
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

	$("#BasicEncryptionModes").bind("change", function(){
		if ($(this).val() == "WEPEncryption")
		{
			$("#wep_div").show();
		}else
		{
			$("#wep_div").hide();
		}
	});


	if(gOperatorName == "ALGERIA_TELECOM"){
		$("#PreSharedKey").prop('type', "password");	
	}
	
	initPage();

	if(operator_name == "MEX_NETWEY" && (gLoginUser == "0" ||gLoginUser == "1" )){
		$("#2g_5gRssi").hide();
		$("#BeaconType").attr("disabled",true);
		$("#reAuthentication").attr("disabled",true);
	}

	if((gOperatorMode == "3" && gOperatorName == "TH_AIS") || (operator_name == "FTTR_SUB_COMMON" && multiAP == "1" ))
	{
		$("#WlanEnable_container").attr("disabled",true);
		$("#SSID").attr("disabled",true);
		$("#X_FH_SSIDHide").attr("disabled",true);
		$("#ssid_isolation_enable").attr("disabled",true);
		$("#ssid_isolation_disable").attr("disabled",true);
		$("#BeaconType").attr("disabled",true);
		$("#reAuthentication").attr("disabled",true);
		$("#BasicAuthenticationMode").attr("disabled",true);
		$("#WPAEncryptionModes").attr("disabled",true);
		$("#PreSharedKey").attr("disabled",true);
		$("#24g_rssi").attr("disabled",true);
		$("#5g_rssi").attr("disabled",true);
		document.getElementById('button_div_MTK').style.display = 'none';
		if(operator_name == "FTTR_SUB_COMMON"){
			if(bandsteering_enable == "1")
				$("#multiap_tip").show();
			else
				$("#multiap_tip2").show();
			
			$("#button_div").hide();
		}
		$(".main_header_hint").html("bandsteering_prompt_ap_mode".i18n());
	}
	else
	{
		$(".main_header_hint").html("security_prompt".i18n());
	}
	
	if(operator_name == "TH_3BB")
    {
		$("#PreSharedKey").prop('type','password')

		setInterval(function(){
		    if($("#PreSharedKey").length > 0){
				if(!$("#PreSharedKey").hasClass("fh-text-security")){
					$("#PreSharedKey").addClass("fh-text-security");
				}
				if($("#PreSharedKey").attr('type') != 'password'){
					$('#PreSharedKey').prop('type','password')
				}
			}else{
				window.location.reload();
			}
		}, 10);
	}

});

function initPage()
{

	XHR.get("get_bandSteering_wlan", null, fillData);
}

function change_eye()
{
    $("#PreSharedKey").toggleClass("fh-text-security");	
}


function initValidate_pldt()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": {required: true, minlength:12, maxlength:63, nocn: true,  pwdcheck_pldt: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true},
            "reAuthentication": {required: true, range_int:[0,86400], nocn: true},
            "24g_rssi":{required: true, range_int: [-100, 0]},
            "5g_rssi":{required: true, range_int: [-100, 0]},
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

function initValidate_telmex()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": {required: true, minlength:8, maxlength:63, nocn: true,  pwdcheck_telmex: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true},
			"reAuthentication": {required: true, range_int:[0,86400], nocn: true},
            "24g_rssi":{required: true, range_int: [-100, 0]},
            "5g_rssi":{required: true, range_int: [-100, 0]},
			
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


function initValidate()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": {required: true, minlength:password_length, maxlength:63, nocn: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true},
            "reAuthentication": {required: true, range_int:[0,86400], nocn: true},
            "24g_rssi":{required: true, range_int: [-100, 0]},
            "5g_rssi":{required: true, range_int: [-100, 0]},
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
	// /alert(JSON.stringify(data));
	if (data)
	{
		wifidata = data.bandSteering;
		console.log(wifidata);
		bandsteering_enable = wifidata.X_FH_BandSteeringEnable;
		if(operator_name == "TH_AIS")
		{
			BS_BackupEnable = wifidata.X_FH_BS_BackupEnable;
			BS_SSID = wifidata.X_FH_BS_SSID;
			BS_BeaconType = wifidata.X_FH_BS_BeaconType;
			BS_BasicAuthentication = wifidata.X_FH_BS_BasicAuthentication;
			BS_WPAEncryption = wifidata.X_FH_BS_WPAEncryption;
			BS_PreSharedKey = wifidata.X_FH_BS_PreSharedKey;
		}
		
		// var ssidSelectOption = [];
		// for (var i=1; i<=wifidata.length; i++)
		// {
		// 	ssidSelectOption += '<option value="'+i+'">'+i+'</option>';
		// }
		// $("#ssid_choice").html(ssidSelectOption);

		fillCurrentSel(selectIdx);
	}
}

function fillCurrentSel(sel)
{
	var data = wifidata;
	// $("#ssid_choice").val((sel+1));
	// if (data.Enable == "0"){
	// 	$("input[name='ssid_enable']:last").attr('checked', 'checked');
	// }else{
	// 	$("input[name='ssid_enable']:first").attr('checked', 'checked');
	// }

	
	if(data.X_FH_BandSteeringEnable == "0"){
		$("#change_bandSteering_mode").hide();
	}else{
		$("#change_bandSteering_mode").show();
	}
    setSwitchValue("WlanEnable_container", data.X_FH_BandSteeringEnable);
	// if(multiAP == "1"){
	// 	setSwitchValue("WlanEnable_container", data.X_FH_BandSteeringEnable);
	// }

	if(operator_name == "TH_AIS"){
		$("#isolation_enable_div").show();
		if (data.isolation_enable == "0"){
			$("input[name='ssid_isolation']:last").attr('checked', 'checked');
		}else{
			$("input[name='ssid_isolation']:first").attr('checked', 'checked');
		}
	}
	
	$("#SSID").val(data.SSID);
    if (data.X_FH_SSIDHide == "1"){
    	setCheckbox("X_FH_SSIDHide", "0");
    }else{
    	setCheckbox("X_FH_SSIDHide", "1");
    }
	var BeaconTypeval = data.BeaconType;
	

	// if((sel == 0 || sel == 1 || sel == 2 || sel == 3) && (BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" ||
	// BeaconTypeval == "WPA" || BeaconTypeval == "WPA2")) {
	// 	$("#twoInput_div").hide();
	// }

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

	$("#NodeEncryption").click(function(){
		$("#wpa3_div").hide();
	});

	$("#Tkipncryption, #Aesencryption, #Tkipaesncryption, #Saencryption").click(function(){
		$("#wpa3_div").show();
	});

	if (data.BasicEncryptionModes != ""){
		$("#BasicEncryptionModes").val(data.BasicEncryptionModes);
	}
	if (data.WPAEncryptionModes == "TKIPandAESEncryption"){
		$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
	}else if(data.WPAEncryptionModes == "AESEncryption"){
		$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
	}
	$("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None
	
	if(operator_name == "BZ_INTELBRAS")
	{
		wifi_password_encode = data.wifi_password_encode;
		$("#PreSharedKey").val(wifi_password_encode);
	}
    else if(operator_name == "ALGERIA_TELECOM"){
		wifi_password_encode = data.wifi_password_encode;
		$("#PreSharedKey").val(wifi_password_encode);
	}
	else
	{
		var temp_b64 = fhdecrypt(data.PreSharedKey);
		old_PreSharedKey = data.PreSharedKey;
		$("#PreSharedKey").val(temp_b64);
	}
	$("#reAuthentication").val(data.X_FH_WPARekeyInterval);
	$("#24g_rssi").val(data.X_FH_RSSIThreshold_2G);
	$("#5g_rssi").val(data.X_FH_RSSIThreshold_5G);

	if(gOperatorName == "TH_AIS"){
		$("#2g_5gRssi").hide();
		$("#reAuthentication_div").hide();
		$("#open_div").hide();
    }
	
}

function wpsInfo(g_wpsdata){
	wps_enable_2g = g_wpsdata.Enable2g;
	wps_enable_5g = g_wpsdata.Enable5g;
}

function checkHex(str){
	var len = str.length;

	for (var i=0; i<str.length; i++) {
		if ((str.charAt(i) >= '0' && str.charAt(i) <= '9') ||
			(str.charAt(i) >= 'a' && str.charAt(i) <= 'f') ||
			(str.charAt(i) >= 'A' && str.charAt(i) <= 'F') ){
				continue;
		}else
	        return false;
	}
    return true;
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

	if(operator_name == "EG_TELECOM" && (wps_enable_5g == "1" || wps_enable_2g == "1") && $("#X_FH_SSIDHide").prop("checked")){
		alert("WPS is enabled. Please don't hide SSID !")
		return
	}

	var postdata = new Object();
	postdata.action = "info";
	if(device_type != "HG6145F3" &&  device_type != "HG6145F4"){
		postdata.SSID = fhencrypt($("#SSID").val()); 
	}
	
    if(operator_name == "PLE_PALTEL" || operator_name == "EG_TELECOM" || operator_name == "MY_TM"){
      postdata.X_FH_SSIDHide = $("#X_FH_SSIDHide").prop("checked") ? 0 : 1;  
    }
	var BeaconType = $("#BeaconType").val();
	if(BeaconType == "Basic"){
		if(device_type == "HG6145F3" || device_type == "HG6145F4"){
			postdata.BeaconType = "None";
		}else{
			postdata.BeaconType = BeaconType;
		}
		postdata.BasicAuthenticationMode = "OpenSystem";
		var BasicEncryptionModes = $("#BasicEncryptionModes").val();
		postdata.BasicEncryptionModes = BasicEncryptionModes;
	}else{
		postdata.BeaconType = BeaconType;
		
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		
		if(operator_name == "BZ_INTELBRAS"){
			if($("#PreSharedKey").val() == wifi_password_encode){
				postdata.PreSharedKey = fhencrypt(wifi_password_encode);
			}else{
				postdata.PreSharedKey = fhencrypt($("#PreSharedKey").val()); 
			}
		}else{
			var temp_b64 = fhencrypt($("#PreSharedKey").val());
			postdata.PreSharedKey = temp_b64; 
		}

		if(BeaconType == "11i" || BeaconType == "WPA/WPA2"){
			postdata.X_FH_WPARekeyInterval = $("#reAuthentication").val();
		}
	}
	if (operator_name != "COL_MILLICOM") {
		postdata.X_FH_RSSIThreshold_2G = $("#24g_rssi").val();
        postdata.X_FH_RSSIThreshold_5G = $("#5g_rssi").val();
	}
	if(device_type == "HG6145F3" || device_type == "HG6145F4" ){
		//postdata.X_FH_BandSteeringEnable  =  $("input[name='WlanEnable_checkbox']").val();
		if (operator_name == "TH_AIS")
		{
			postdata.isolation_enable = $("input[name='ssid_isolation']:checked").val();
		}
		if($("#WlanEnable_container").hasClass("switch_content_on"))
		{
			postdata.SSID = fhencrypt($("#SSID").val());
			postdata.X_FH_BandSteeringEnable = "1";
		}else{
			postdata.SSID = fhencrypt($("#SSID").val()+"_5"); 
			postdata.X_FH_BandSteeringEnable = "0";
		}

		if(gOperatorMode == "3" && gOperatorName == "TH_AIS")
		{
			return;
		}
		if(gOperatorMode == "13" && operator_name == "MY_TM")
		{
			return;
		}
		XHR.post("set_bandSteering_wlan_MTK", postdata, fillData);
	}else{
		XHR.post("set_bandSteering_wlan", postdata, fillData);
	}   
}
 
function clearInputValue(id)
{
	if(gOperatorName == "ALGERIA_TELECOM")
	{
		$("#" + id).val("");
	}
}
	

function resetInputValue(id)
{
	if(gOperatorName == "ALGERIA_TELECOM")
	{
		if($("#" + id).val() == "")
			$("#" + id).val(wifi_password_encode);
	}
}

