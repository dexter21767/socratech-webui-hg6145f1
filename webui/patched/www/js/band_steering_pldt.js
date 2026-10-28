var sessionidstr = "";
var wifidata = "";
var selectIdx = 0;
var old_PreSharedKey;
var multiAP = "";
var bandsteering_enable = "";
var operator_name = gOperatorName;	
var device_type = gModelName;
var password_length = 8;
var wifi5gdata = "";
var fttr_type = gFttr_type;
var wifi_type = gWifiCap;

$(document).ready(function(){
	//优化滚动条，无需改动
	//show_shadow();
	//customSwitchInit();
    if(operator_name == "PH_RADIUS"){
        password_length = 12;
    }
	customPasswordInit();
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
	
	if(gOperatorName == "MEX_TELMEX"){
		$(".main_item_name").css("width","30%");
		$(".main_item_content").css("width","calc(70% - 3px)");
	}
    if(gOperatorName == "PLE_PALTEL"){
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

	
	$("#WlanEnable_container").bind("click", function(){
			if(device_type == "HG6145F3" ||  device_type == "HG6145F4" ){
				if($("#WlanEnable_container").hasClass("switch_content_on")){
					$("#change_bandSteering_mode").show();
				}else{
					$("#change_bandSteering_mode").hide();	
				}
			}else{
				if(!(fttr_type == "fttr_sub" && multiAP == "1" )){
					saveEnable_Apply();
				}
			}	
	});
	
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
		if(operator_name == "PLE_PALTEL" || operator_name == "TH_AIS"){
			$("#show_password").show();   
		}
		initValidate();
		$("#common_password_tip").show();
	}
	
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
		
	});
	
	initPage();
	{
		$(".main_header_hint").html("security_prompt".i18n());
	}
    
    $('input[type=radio][name=bandsteering_enable]').change(function(){
       if ($(this).val() == "0")
       {
        $(".input_text").attr("disabled", true);
        $("#BeaconType").attr("disabled", true);
        $("#change_bandSteering_mode").hide();
       }else if ($(this).val() == "1")
       {
       $(".input_text").attr("disabled", false);
       $("#BeaconType").attr("disabled", false);
       $("#change_bandSteering_mode").show();
       	fillCurrentSel(0);
       }else if ($(this).val() == "2")
       {
           $(".input_text").attr("disabled", false);
           $("#BeaconType").attr("disabled", false);
           $("#change_bandSteering_mode").show();
          fillCurrentSel(1); 
       }else if ($(this).val() == "3")
       {
           $(".input_text").attr("disabled", false);
           $("#BeaconType").attr("disabled", false);
           $("#change_bandSteering_mode").show();
       	fillCurrentSel(2);
       }else if ($(this).val() == "4")
       {
           $(".input_text").attr("disabled", false);
           $("#BeaconType").attr("disabled", false);
           $("#change_bandSteering_mode").show();
          fillCurrentSel(3); 
       }
       var postdata = new Object();
       postdata.action = "enable";
       postdata.index = $("input[name='bandsteering_enable']:checked").val();
       XHR.post("set_bandSteering_pldt", postdata, fillData);
    })

});

function initPage()
{
    XHR.get("get_wifi_status_5G", null, fill5GData);
	XHR.get("get_wifi_status", null, fillData);
    
}

function  fill5GData(data)
{
    if (data && data.wifi_status5g)
    {
       wifi5gdata = data.wifi_status5g;
    }
    
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
	if (data && data.wifi_status)
	{
        wifidata = data.wifi_status;
        console.log(wifidata);
        var wifidata1 = data.wifi_status;
        $("#bandsteering_disable").prop('checked',true);  
        var flag = false
       if(wifidata1[0].bandsteering_enable == "0" && wifidata1[1].bandsteering_enable == "0" && wifidata1[2].bandsteering_enable == "0"
       && wifidata1[3].bandsteering_enable == "0"){
           flag = true;
       }

        for (var i=0; i<wifidata1.length; i++)
        {
            if(wifidata1[i].bandsteering_enable == "1" || flag )
            {
                if(flag)
                {
                    $("#bandsteering_disable").prop('checked',true); 
                     $(".input_text").attr("disabled", true);
                     $("#BeaconType").attr("disabled", true);
                     $("#change_bandSteering_mode").hide();
                }else
                {
                    $(".input_text").attr("disabled", false);
                    $("#BeaconType").attr("disabled", false);
                    if(i == 0)
                    {
                       $("#bandsteering_1").prop('checked',true);  
                    }else if(i == 1)
                    {
                       $("#bandsteering_2").prop('checked',true);  
                    }else if(i == 2)
                    {
                       $("#bandsteering_3").prop('checked',true);  
                    }else if(i == 3)
                    {
                       $("#bandsteering_4").prop('checked',true);  
                    }
                }
              
             $("#SSID").val(fhdecrypt(wifidata1[i].SSID));
             var BeaconTypeval = wifidata1[i].BeaconType;
             if(BeaconTypeval == "" ){
                BeaconTypeval = "Basic" ;
                
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
             	var BasicEncryptionModes = wifidata1[i].BasicEncryptionModes;
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
             
             if (wifidata1[i].BasicEncryptionModes != ""){
             	$("#BasicEncryptionModes").val(wifidata1[i].BasicEncryptionModes);
             }
             if (wifidata1[i].WPAEncryptionModes == "TKIPandAESEncryption"){
             	$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
             }else if(wifidata1[i].WPAEncryptionModes == "AESEncryption"){
             	$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
             }
             $("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None
             
             temp_b64 = fhdecrypt(wifidata1[i].PreSharedKey);
             old_PreSharedKey = wifidata1[i].PreSharedKey;
             $("#PreSharedKey").val(temp_b64);
             $("#reAuthentication").val(wifidata1[i].X_FH_WPARekeyInterval);
             $("#24g_rssi").val(wifidata1[i].rssi_2g);
             $("#5g_rssi").val(wifidata1[i].rssi_5g);
             break;      
            }
        }
         for (var j=0; j<wifidata.length; j++)
         {
             
            if(wifidata[j].Enable != "1" || wifi5gdata[j].Enable != "1")
            {
                 $("#bandsteering_"+(j+1)).attr("disabled", true);
            } 
           
         }
	}
}

function fillCurrentSel(sel)
{
  //  alert(sel);
    console.log(wifidata);
	if (wifidata)
	{ 
	    //for (var i=0; i<=wifidata.length; i++)
        var i = 0
	    //{
	         $("#SSID").val(fhdecrypt(wifidata[sel].SSID));
	         var BeaconTypeval = wifidata[sel].BeaconType;
	         if (BeaconTypeval == "Basic")
	         {
	         	if (wifidata[sel].BasicAuthenticationMode == "SharedKey")
	         	{
	         		BeaconTypeval = "SharedKey";
	         	}
	         
	         	if (wifidata[sel].BasicAuthenticationMode == "Both")
	         	{
	         		BeaconTypeval = "Both";
	         	}
	         }
	         
	         if(BeaconTypeval == "WPA3"){
               //  console.log(data);
	         	if(wifidata[sel].WPAEncryptionModes == "None"){
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
	         	var BasicEncryptionModes = wifidata[i].BasicEncryptionModes;
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
	         
	         if (wifidata[sel].BasicEncryptionModes != ""){
	         	$("#BasicEncryptionModes").val(wifidata[sel].BasicEncryptionModes);
	         }
	         if (wifidata[sel].WPAEncryptionModes == "TKIPandAESEncryption"){
	         	$("input[name='WPAEncryptionModes']:eq(1)").attr('checked', 'checked');
	         }else if(wifidata[sel].WPAEncryptionModes == "AESEncryption"){
	         	$("input[name='WPAEncryptionModes']:eq(0)").attr('checked', 'checked');
	         }
	         $("#twoInput_div").hide();//20200113 王洪磊 隐藏 WPA Algorithms中的 SAE 和 None
	         
	         temp_b64 = fhdecrypt(wifidata[sel].PreSharedKey);
	         old_PreSharedKey = wifidata[sel].PreSharedKey;
	         $("#PreSharedKey").val(temp_b64);
	         $("#reAuthentication").val(wifidata[sel].X_FH_WPARekeyInterval);
	         $("#24g_rssi").val(wifidata[sel].rssi_2g);
	         $("#5g_rssi").val(wifidata[sel].rssi_5g);
	}
	
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
	    alert("illegal_value_alert".i18n());
	    return;
	}
	var postdata = new Object();
	postdata.action = "info";
	postdata.index = $("input[name='bandsteering_enable']:checked").val();
	postdata.SSID = fhencrypt($("#SSID").val()); 
	
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
		var temp_b64 = fhencrypt($("#PreSharedKey").val());
		postdata.PreSharedKey = temp_b64; 
		if(BeaconType == "11i" || BeaconType == "WPA/WPA2"){
			postdata.X_FH_WPARekeyInterval = $("#reAuthentication").val();
		}
	}
	if (operator_name != "COL_MILLICOM") {
		postdata.X_FH_RSSIThreshold_2G = $("#24g_rssi").val();
        postdata.X_FH_RSSIThreshold_5G = $("#5g_rssi").val();
	}
        console.log(postdata);
		XHR.post("set_bandSteering_pldt", postdata, fillData);
	} 
      

 


