var sessionidstr = "";
var wifidata = "";
var selectIdx = 0;
var operator_name = gOperatorName;
var userlevel = gLoginUser;
var multiap_enable;
var band_steering;
var model_name = gModelName;
var wifi_type = gWifi5Cap;
var inner_index;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	$("#ssid_choice").bind("change", function(){
		var sel = $(this).val() - 5;
		
		if((sel == 0 || sel == 1 || sel == 2 || sel == 3 || sel == 4) && ($("#BeaconType").val() == "WPA2/WPA3" || $("#BeaconType").val() == "WPA/WPA2" ||
		$("#BeaconType").val() == "WPA" || $("#BeaconType").val() == "11i"
		 || $("#BeaconType").val() == "WPA-Enterprise" || $("#BeaconType").val() == "WPA2-Enterprise" || $("#BeaconType").val() == "WPA-WPA2-Enterprise")) {
			$("#twoInput_div").hide();
		}
		fillCurrentSel(sel);
	});

	/*WIFI5 设备无WPA3、WPA2WPA3*/
	if(wifi_type == "0")
	{
		$("#WPA3").hide();
		$("#WPA2WPA3").hide();
	}

	if(operator_name == "PH_PLDT"){
		$("#show_password").show();
		initValidate_pldt();
		$("#pldt_password_tip").show();
	}else{
		if((operator_name == "MEX_TELMEX") || (operator_name == "PLE_PALTEL")
			|| (operator_name == "TH_AIS") ||  (operator_name == "MY_TM")){
			$("#show_password").show();
		}
		initValidate();
		$("#common_password_tip").show();
	}
    
    if(operator_name == "ECU_CNT"){
        $("#Wmm_enable_div").show();
    }
    
	if (operator_name == "COL_CLARO") {
			$("#BasicEncryptionModes").append("<option value='WEPEncryption'>WEP</option>");
	}
	if (operator_name == "IDN_TELKOM") {
		$("#BeaconType").append("<option value=\"WPA-Enterprise\">WPA</option>");
		$("#BeaconType").append("<option value=\"WPA2-Enterprise\">WPA2</option>");
		$("#BeaconType").append("<option value=\"WPA-WPA2-Enterprise\">WPA/WPA2</option>");
	}
	$("#BeaconType").bind("change", function(){
		var BeaconTypeval = $(this).val();
		if (BeaconTypeval == "Basic")
		{
			$("#open_div").show();
			$("#wpa_div").hide();
			$("#reAuthentication_div").hide();
			$("#wpa-enterprise_div").hide();
			if ($("#BasicEncryptionModes").val() == "WEPEncryption")
			{
				$("#wep_div").show();
			}
			else
			{
				$("#wep_div").hide();
			}
		}
		else if (BeaconTypeval == "Both" || BeaconTypeval == "SharedKey")
		{
			$("#open_div").hide();
			$("#wpa_div").hide();
			$("#wep_div").show();
			$("#reAuthentication_div").hide();
		}else if (BeaconTypeval == "WPA3" || BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "11i" )
		{
			if (BeaconTypeval == "11i"){
				$("#reAuthentication_div").show();
				$("#wpa3_div").show();
			}else{
				$("#reAuthentication_div").hide();
			}
			$("#Aesencryption").attr("checked","checked");
			$("#open_div").hide();
			$("#wep_div").hide();
			$("#wpa_div").show();
			$("#twoInput_div").hide();
			$("#wpa-enterprise_div").hide();
			
		}else if(BeaconTypeval == "WPA/WPA2")
		{
			 $("#Tkipaesncryption").attr("checked","checked");
			 $("#open_div").hide();
			 $("#wep_div").hide();
			 $("#wpa_div").show();
			 $("#wpa3_div").show();
			 $("#twoInput_div").hide();
			 $("#reAuthentication_div").show();
			 $("#wpa-enterprise_div").hide();
		}else if(BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise" || BeaconTypeval == "WPA-WPA2-Enterprise" )//wifi企业认证
		{	
			if (BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise") {
				$("#Aesencryption").attr("checked","checked");
			} else{
				$("#Tkipaesncryption").attr("checked","checked");
		}
			$("#open_div").hide();
			$("#wpa_div").show();
			$("#wpa3_div").hide();
			$("#reAuthentication_div").hide();
		
			$("#wpa-enterprise_div").show();
			
		}
		else{
			
			$("#open_div").hide();
			$("#wep_div").hide();
			$("#wpa_div").show();
			$("#twoInput_div").hide();
			$("#reAuthentication_div").hide();
			$("#wpa-enterprise_div").hide();
		}
	});

	$("#BasicEncryptionModes").bind("change", function(){
		if ($(this).val() == "WEPEncryption")
		{

			$("#wep_div").show();
			
		}
		else
		{
			$("#wep_div").hide();
		}
	});
	if(gOperatorMode == "13" && operator_name == "MY_TM")
	{
		$(":input").attr("disabled", true);
		$("#ssid_choice").attr("disabled", false);
	}
	XHR.get("get_multiAP_enable", null, multiInfo);
	XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);	
	initPage();
	customSwitchInit();
	//customPasswordInit();

	if(gOperatorMode == "3" && gOperatorName == "TH_AIS")
	{
		$("#ssid_enable").attr("disabled",true);
		$("#ssid_disable").attr("disabled",true);
		$("#SSID").attr("disabled",true);
		$("#X_FH_SSIDHide").attr("disabled",true);
		$("#ssid_isolation_enable").attr("disabled",true);
		$("#ssid_isolation_disable").attr("disabled",true);
		$("#BeaconType").attr("disabled",true);
		$("#reAuthentication").attr("disabled",true);
		$("#BasicEncryptionModes").attr("disabled",true);
		$("#Aesencryption").attr("disabled",true);
		$("#Tkipaesncryption").attr("disabled",true);
		$("#PreSharedKey").attr("disabled",true);
		document.getElementById('wireless_apply_cancel').style.display = 'none';
		$(".main_header_hint").html("security_prompt_ap_mode".i18n());
	}
	else
	{
		$(".main_header_hint").html("security_prompt".i18n());
	}

	
});
function multiInfo(data)
{
	multiAP = data.multiAP_enable.Enable;
}
function bandsteeringInfo(data)
{
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}


function change_eye()
{
    $("#PreSharedKey").toggleClass("fh-text-security");	
}

function initPage()
{
	
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced", fillData);
	}else{
		XHR.get("get_wifi_status_5G_th_ais", null, fillData);
	}
}


function initValidate_pldt()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"PreSharedKey": {required: true, minlength:12, maxlength:63, nocn: true,  pwdcheck_pldt: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true}
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
			"PreSharedKey": {required: true, minlength:8, maxlength:63, nocn: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true},
			"reAuthentication": {required: true, range_int:[0,86400], nocn: true},
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
	
	if (data && data.wifi_status5g)
	{
		wifidata = data.wifi_status5g;
		var ssidSelectOption = [];
		for (var i=1; i<=wifidata.length; i++)
		{
			//开启bandsteering时，advance页面只有ssid2-4
			if(band_steering == "1")
			{
				if(i == 1){
					continue;
				}
			} 
            if(multiAP == "0" )
            {
                if(i == 5){
                    continue;
                }
            }
			if(operator_name == "TH_AIS" && userlevel == 0 && i == 5)
			{
				continue;
			}else if(operator_name == "MY_TM"&& i == 5 )
            {
                continue;
            }
            else
			{
				ssidSelectOption += '<option value="'+(i+4)+'">'+(i+4)+'</option>';	
			}
		}
		
		$("#ssid_choice").html(ssidSelectOption);
		
		if(operator_name  == "IDN_TELKOM"){
			XHR.get("get_allwan_info", null, getSSID);
		}
		//泰国TRUE版本隐藏
		if(operator_name == "TH_TRUE"){
			$("#ssid_choice option").each(function(){
				if($(this).val() == "7"){
					$(this).remove();
				}
			});	
		}
        
        fillCurrentSel(selectIdx);
        $("#ssid_choice option").each(function(){
             if($(this).css("display")=="block"){
                 $(this).change();
                 return false;
             }
        });
		

	}
	
}

	//获取wan连接中ssid的编号
function getSSID(all_wan_info){
	
	for (var i = 0; i < all_wan_info.wan.length; i++) {
		var single_wan = all_wan_info.wan[i];
		if ( single_wan.Name.indexOf("_B_")  >= 0 && single_wan.Name.indexOf("INTERNET")  >= 0) 
		{	
			ssid = single_wan.LanInterface.split(',');
			for(var j = 0; j < ssid.length; j++){
				if(ssid[j].indexOf("dev.wla.")>= 0){
					console.log($("#ssid_choice option").length);
					$("#ssid_choice option").each(function(){
						if($(this).val() == ssid[j].substr(ssid[j].length-1,1)){
							$(this).remove();
						}
					});						
				}
			}
			//ssid.push(single_wan.LanInterface.substr(single_wan.LanInterface.length -1)); 
			
		}
	}
}

function fillCurrentSel(sel)
{
    if(sel == 4){
        $("#X_FH_SSIDHide").hide();
        $("#ssid_hide_title").hide();
    }else{
        $("#X_FH_SSIDHide").show();
        $("#ssid_hide_title").show();
    }
    $("#ssid_choice").val((sel+5));
   
    
	var data = wifidata[sel];
	inner_index = data.index;
	if (data.Enable == "0"){
		$("input[name='ssid_enable']:last").attr('checked', 'checked');
	}else{
		$("input[name='ssid_enable']:first").attr('checked', 'checked');
	}
	
	if(operator_name == "TH_AIS"){
		$("#isolation_enable_div").show();
		if (data.isolation_enable == "0"){
			$("input[name='ssid_isolation']:last").attr('checked', 'checked');
		}else{
			$("input[name='ssid_isolation']:first").attr('checked', 'checked');
		}
	}
	
	$("#SSID").val(fhdecrypt(data.SSID));

	if (data.X_FH_SSIDHide == "1"){
		setCheckbox("X_FH_SSIDHide", "0");
	}else{
		setCheckbox("X_FH_SSIDHide", "1");
	}
    
    if (data.WMMEnable == "1"){
        	setCheckbox("wmm_enable", "1");
    }else{
        	setCheckbox("wmm_enable", "0");
    }
    
	var BeaconTypeval = data.BeaconType;

	if((sel == 0 || sel == 1 || sel == 2 || sel == 3) && (BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" ||
	BeaconTypeval == "WPA" || BeaconTypeval == "11i")) {
		$("#twoInput_div").hide();
	}

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
		$("#BeaconType").val("Basic");
		$("#open_div").show();
		$("#wpa_div").hide();
	}else{
		$("#BeaconType").val(BeaconTypeval);
	}

	if (BeaconTypeval == "Basic")
	{
		$("#open_div").show();
		$("#wpa_div").hide();
		$("#wpa-enterprise_div").hide();
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
	else if(BeaconTypeval == "WPA3")
	{
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
		$("#twoInput_div").show();
	}
	else if(BeaconTypeval == "WPA2/WPA3" || BeaconTypeval == "WPA/WPA2" || BeaconTypeval == "WPA" || BeaconTypeval == "11i")
	{
		if (BeaconTypeval == "WPA/WPA2"  || BeaconTypeval == "11i")
		{
			$("#reAuthentication_div").show();
		}
		//wpa2
		$("#open_div").hide();
		$("#wep_div").hide();
		$("#wpa_div").show();
	}else if(BeaconTypeval == "WPA-Enterprise" || BeaconTypeval == "WPA2-Enterprise" || BeaconTypeval == "WPA-WPA2-Enterprise"){
		$("#open_div").hide();
		$("#wpa_div").show();
		$("#wpa3_div").hide();
		$("#reAuthentication_div").hide();
		$("#wpa-enterprise_div").show();
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
	$("#WEPKeyIndex").val(data.WEPKeyIndex);

	$("#WEPKey1").val(fhdecrypt(data.WEPKey1));
	if (fhdecrypt(data.WEPKey1).length == 10 || fhdecrypt(data.WEPKey1).length == 26){
		$("#WEPSelect1").val(1);
	}else{
		$("#WEPSelect1").val(0);
	}

	$("#WEPKey2").val(fhdecrypt(data.WEPKey2));
	if (data.WEPKey2.length == 10 || data.WEPKey2.length == 26){
		$("#WEPSelect2").val(1);
	}else{
		$("#WEPSelect2").val(0);
	}

	$("#WEPKey3").val(fhdecrypt(data.WEPKey3));
	if (data.WEPKey3.length == 10 || data.WEPKey3.length == 26){
		$("#WEPSelect3").val(1);
	}else{
		$("#WEPSelect3").val(0);
	}

	$("#WEPKey4").val(fhdecrypt(data.WEPKey4));
	if (data.WEPKey4.length == 10 || data.WEPKey4.length == 26){
		$("#WEPSelect4").val(1);
	}else{
		$("#WEPSelect4").val(0);
	}

	 if (data.WPAEncryptionModes == "TKIPandAESEncryption"){
		$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
	}
	else{
		$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
	}
	$("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None
	temp_b64 = fhdecrypt(data.PreSharedKey);
	$("#PreSharedKey").val(temp_b64);
	$("#reAuthentication").val(data.X_FH_WPARekeyInterval);
	$("#ip_address").val(data.ServiceIP);
	$("#port").val(data.Port);
	$("#shared_secret").val(fhdecrypt(data.Key));
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

function checkInjection(str)
{
	var len = str.length;
	for (var i=0; i<str.length; i++) {
		if ( str.charAt(i) == '\r' || str.charAt(i) == '\n'){
				return false;
		}else
	        continue;
	}
    return true;
}

function check_Wep()
{
	var WEPKeyval = $("#WEPKey1").val();
	var keylength = WEPKeyval.length;
	var WEPSelect = $("#WEPSelect1").val();
	
	if (WEPSelect == 0){
		if(keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key1".i18n() + "!");
			return false;
		}
		if(checkInjection(WEPKeyval)== false){
			alert("WEP_key1".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1){
		if(keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key1".i18n() + "!");
			return false;
		}
		if(checkHex(WEPKeyval) == false){
			alert("Invalid_WEP_key1_format".i18n());
			return false;
		}
	}

	WEPKeyval = $("#WEPKey2").val();
	keylength = WEPKeyval.length;
	WEPSelect = $("#WEPSelect2").val();
	
	if (WEPSelect == 0){
		if(keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key2".i18n() + "!");
			return false;
		}
		if(checkInjection(WEPKeyval)== false){
			alert("WEP_key2".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1){
		if(keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key2".i18n() + "!");
			return false;
		}
		if(checkHex(WEPKeyval) == false){
			alert("Invalid_WEP_key2_format".i18n());
			return false;
		}
	}

	WEPKeyval = $("#WEPKey3").val();
	keylength = WEPKeyval.length;
	WEPSelect = $("#WEPSelect3").val();
	
	if (WEPSelect == 0){
		if(keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key3".i18n() + "!");
			return false;
		}
		if(checkInjection(WEPKeyval)== false){
			alert("WEP_key3".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1){
		if(keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key3".i18n() + "!");
			return false;
		}
		if(checkHex(WEPKeyval) == false){
			alert("Invalid_WEP_key3_format".i18n());
			return false;
		}
	}

	WEPKeyval = $("#WEPKey4").val();
	keylength = WEPKeyval.length;
	WEPSelect = $("#WEPSelect4").val();
	
	if (WEPSelect == 0){
		if(keylength != 5 && keylength != 13) {
			alert("Please_input_5_or_13_characters_of".i18n() + "WEP_key4".i18n() + "!");
			return false;
		}
		if(checkInjection(WEPKeyval)== false){
			alert("WEP_key4".i18n() + "contains_invalid_characters".i18n());
			return false;
		}
	}
	if (WEPSelect == 1){
		if(keylength != 10 && keylength != 26) {
			alert("Please_input_10_or_26_characters_of".i18n() + "WEP_key4".i18n() + "!");
			return false;
		}
		if(checkHex(WEPKeyval) == false){
			alert("Invalid_WEP_key4_format".i18n());
			return false;
		}
	}
	return true;
}

function saveApply()
{
	show_shadow();
	if( ! $("#wlanAdv_settings_form").valid() )
	{
		alert("invalid_value_alert".i18n());
		return;
	}
	
	var postdata = new Object();
	selectIdx = $("#ssid_choice").val() - 5;
    postdata.wifiIndex = inner_index;
    
	postdata.Enable = $("input[name='ssid_enable']:checked").val();
    // TODO:POST isolation_enable
    if(operator_name == "TH_AIS"){
    	postdata.isolation_enable = $("input[name='ssid_isolation']:checked").val();
    }
	postdata.SSID = fhencrypt($("#SSID").val());
	postdata.X_FH_SSIDHide = $("#X_FH_SSIDHide").prop("checked") ? 0 : 1;
    if(operator_name == "ECU_CNT"){
        postdata.wmm_enable = $("#wmm_enable").prop("checked") ? 1 : 0; 
    }
	var BeaconType = $("#BeaconType").val();

	if (BeaconType == "Basic"){
		if(model_name == "HG6145F3" || model_name == "HG6145F4"){
			postdata.BeaconType = "None";
		}else{
			postdata.BeaconType = BeaconType;
		}
		postdata.BasicAuthenticationMode = "OpenSystem";
		var BasicEncryptionModes = $("#BasicEncryptionModes").val();
		postdata.BasicEncryptionModes = BasicEncryptionModes;
		if (BasicEncryptionModes == "WEPEncryption")
		{
			if (!check_Wep()){
				return;
			}
			postdata.WEPKeyIndex = $("#WEPKeyIndex").val();
			postdata.WEPKey1 = fhencrypt($("#WEPKey1").val());
			postdata.WEPKey2 = fhencrypt($("#WEPKey2").val());
			postdata.WEPKey3 = fhencrypt($("#WEPKey3").val());
			postdata.WEPKey4 = fhencrypt($("#WEPKey4").val());
		}
	}
	else if (BeaconType == "Both" || BeaconType == "SharedKey")
	{
		postdata.BeaconType = "Basic";
		postdata.BasicAuthenticationMode = BeaconType;
		postdata.BasicEncryptionModes = "WEPEncryption";
		if (!check_Wep()){
			return;
		}
		postdata.WEPKeyIndex = $("#WEPKeyIndex").val();
		postdata.WEPKey1 = fhencrypt($("#WEPKey1").val());
		postdata.WEPKey2 = fhencrypt($("#WEPKey2").val());
		postdata.WEPKey3 = fhencrypt($("#WEPKey3").val());
		postdata.WEPKey4 = fhencrypt($("#WEPKey4").val());
	}
	else if(BeaconType == "WPA-Enterprise" || BeaconType == "WPA2-Enterprise" || BeaconType == "WPA-WPA2-Enterprise"){
		postdata.BeaconType = BeaconType;
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		postdata.ip_address = $("#ip_address").val();
		postdata.port = $("#port").val();
		postdata.shared_secret = fhencrypt($("#shared_secret").val());
	}
	else
	{
		postdata.BeaconType = BeaconType;
		postdata.WPAEncryptionModes = $("input[name='WPAEncryptionModes']:checked").val();
		var temp_b64 = fhencrypt($("#PreSharedKey").val());
		postdata.PreSharedKey = temp_b64;
		//postdata.PreSharedKey = $("#PreSharedKey").val();
		
		if(BeaconType == "11i" || BeaconType == "WPA/WPA2"){
			postdata.X_FH_WPARekeyInterval = $("#reAuthentication").val();
		}
	}
	
	if(gOperatorMode == "3" && gOperatorName == "TH_AIS")
	{
		return;
	}
	if(gOperatorMode == "13" && gOperatorName == "MY_TM")
	{
		return;
	}
	XHR.post("setWlanAdvancedCfg_5G", postdata, fillData);
}

