var wifi_data = null;
var g_senha = "";
var g_senha_repetir = "";   
$(document).ready(function(){
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wlanAdvanced", parseWIFIData);
	}
	else
	{
	    XHR.get("get_wizard_wifi_inter", null, parseWIFIData);	
	}
	
	$('#mostrar_senha').change(function () {        
        // if ($('#mostrar_senha').is(":checked"))
        // {
        //     $("#senha").prop('type', 'text');
        //     $("#senha_repetir").prop('type', 'text');

        // } else {
        //     $("#senha").prop('type', 'password');
        //     $("#senha_repetir").prop('type', 'password');
        // }
         $("#senha_repetir").toggleClass("fh-text-security");
          $("#senha").toggleClass("fh-text-security");
    });
});

function parseWIFIData(data){
	if(data){
		wifi_data = data;
		fillData();
	}
}

function fillData()
{
	if(wifi_data)
	{
		$("#SSIDEnable").prop("checked", wifi_data.enable == "1"? true : false);
		$("#nome-rede-2g").val(fhdecrypt(wifi_data.ssid));
		$("#nome-rede-5g").val(fhdecrypt(wifi_data.ssid_5g));
		$("#BeaconType").val(wifi_data.beacon_type == "WPA2"? "11i":wifi_data.beacon_type);
		$("#senha").val(fhdecrypt(wifi_data.passwordStr));
		$("#senha_repetir").val(fhdecrypt(wifi_data.passwordStr));
		
		click_security_mode_check(wifi_data.beacon_type);
	}
}

function click_security_mode_check(securityModeValue)
{
	g_senha = $("#senha").val();
	g_senha_repetir = $("#senha_repetir").val();
	if(securityModeValue == "Basic")		//密码灰显不可配
	{
		document.getElementById("senha").value = "";
		document.getElementById("senha_repetir").value = "";
		document.getElementById("senha").disabled = true;
		document.getElementById("mostrar_senha").disabled = true;
		document.getElementById("senha_repetir").disabled = true;;
	}
	else												//密码可配
	{	
		document.getElementById("senha").disabled = false;
		document.getElementById("mostrar_senha").disabled = false;
		document.getElementById("senha_repetir").disabled = false;
		document.getElementById("senha").value = g_senha;
		document.getElementById("senha_repetir").value = g_senha_repetir;
	}
}

function checkData(){
	var ssid = $("#nome-rede-2g").val().replace(" ","");
	var ssid_5g = $("#nome-rede-5g").val().replace(" ","");
	var passwordStr = $("#senha").val();
	var passwordStrAgain = $("#senha_repetir").val();
	if(ssid.length == 0 || ssid == ""){
		alert("2.4GHz SSID cannot be empty!");
		$("#nome-rede-2g").focus();
		return false;
	}
	if(ssid_5g.length == 0 || ssid_5g == ""){
		alert("5GHz SSID cannot be empty!");
		$("#nome-rede-5g").focus();
		return false;
	}
	if($("#BeaconType").val() != "Basic")
	{
		if(passwordStr.length == 0 || passwordStr == ""){
			alert("WIFI Password cannot be empty!");
			$("#senha").focus();
			return false;
		}
		if(passwordStrAgain.length == 0 || passwordStrAgain == ""){
			alert("WIFI Password cannot be empty!");
			$("#senha_repetir").focus();
			return false;
		}
		if(passwordStr.length < 8 || passwordStr.length > 63){
			alert("Please input at least 8 characters of wpapsk key!");
			$("#senha").focus();
			return false;
		}
		if(passwordStrAgain.length < 8 || passwordStrAgain.length > 63){
			alert("Please input at least 8 characters of wpapsk key!");
			$("#senha_repetir").focus();
			return false;
		}
		if(passwordStr != passwordStrAgain){
			alert("WIFI Password must be same!");
			$("#senha_repetir").focus();
			return false;
		}
	}
	return true;
}

function saveApply(){
	if(!checkData()){
		return;
	}
	var postdata = new Object();
	postdata.enable = $("#SSIDEnable").is(":checked")? "1" : "0";
	postdata.ssid = fhencrypt($("#nome-rede-2g").val());
	postdata.ssid_5g = fhencrypt($("#nome-rede-5g").val());
	postdata.beacon_type = $("#BeaconType").val();
	if($("#BeaconType").val()!="Basic"){
		postdata.passwordStr = fhencrypt($("#senha").val());
	}
	XHR.post("set_wizard_wifi_inter", postdata, checkConn);
}

function checkConn(){
	XHR.get("get_allwan_info", null, function(data){
		if(data && data.wan != undefined){
			var wanAarry = data.wan;
			var conn_ok = false;
			if(wanAarry.length > 0){
				for(var i=0; i<wanAarry.length; i++){
					var singleWan = wanAarry[i];
					if(singleWan.ServiceList == "INTERNET" && singleWan.ConnectionType.indexOf("Routed") > -1){
						if(singleWan.ConnectionStatus == 'Connected' && singleWan.ExternalIPAddress != "0.0.0.0"){
							conn_ok = true;
						}
					}
				}
			}
			if(conn_ok){
				window.location.href="page_05.html";
			}else{
				window.location.href="page_06.html";
			}
	    }
	});
}