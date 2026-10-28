var g_data;
var device_type = gModelName;
var operator_name = gOperatorName;
var operator_mode_modify;
var cur_operator_mode;
var g_httpsenable;
var sessionidstr = "";
var wifi_enable;
var wifi_5g_enable;
var lan_port_10g_num;
var lan_port_num;
var temp_b64_bs;
var temp_b64_24g;
var temp_b64_5g;
var all_wan_info = '';
var wan_index;
var wan_session_index;
var main_wifi_index_5g;
var bindListLanHead = "dev.eth.";
var bindListWifiHead = "dev.wla.";
var bindlist_combo = "dev.eth.1,dev.eth.2,dev.eth.3,dev.wla.1,dev.wla.9";
var bindlist_ag = "dev.eth.2,dev.wla.1,dev.wla.9";
var pppoe_required = true;
var bindlist_cur = "";


$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	initValidate();
	portbind_num = $("input[name='portbind']").length;
	lanportbind_num = $(".lanport").length;
	wifiportbind_num = $(".wifiport").length;
	
	$("input[name='operator_mode']").bind("click", function(){
		var operator_mode = $("input[name='operator_mode']:checked").val();
		var bind_list;
		if (operator_mode == 10)
		{
			bind_list = bindlist_combo;
		}
		else if (operator_mode == 12)
		{
			bind_list = bindlist_ag;
		}
		if (operator_mode == 10 || operator_mode == 12){
			$("#wan_info").css("display", "");
			
			//console.log("cur_operator_mode " + cur_operator_mode);
			//console.log("bindlist_cur " + bindlist_cur);
			
			if(operator_mode == cur_operator_mode)
			{
				
				bindlist_switch(bindlist_cur);
			}
			else
			{
				bindlist_switch(bind_list);
			}
		}else{
			$("#wan_info").css("display", "none");
		}
	});	

	if(gOperatorMode != "3")
	{
		customSwitchInit();
	}
	$("#WlanEnable_container").bind("click", function(){
		if($("#WlanEnable_container").hasClass("switch_content_on"))
		{
			$("#change_bandSteering_mode").show();
			$("#ssid_info_24g").hide();	
			$("#ssid_info_5g").hide();	
		}
		else
		{
			$("#change_bandSteering_mode").hide();	
			$("#ssid_info_24g").show();	
			$("#ssid_info_5g").show();	
		}
	});

	


	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_ssiddisplay_info", null, ssiddisplayInfo);
		XHR.get("get_allwan_info_broadBand", null, initPage_wan);
		XHR.get("get_wizard_info", null, initPage);
		
		
		//XHR.get("vlanbind", null, constructWifiPortHtml);
	}

	//checkWifiEnable();
	

	if (wifi_5g_enable == 1) {
		$("#lantext1").html("wifi_5g_gbit_port1".i18n());
		$("#lantext2").html("wifi_5g_itv".i18n());
		$("#lantext3").html("wifi_5g_gbit_port3".i18n());
		$("#lantext4").html("wifi_5g_gbit_port4".i18n());
	}
	else {
		$("#lantext1").html("wifi_gbit_port".i18n());
		$("#lantext2").html("wifi_iTV".i18n());
		$("#lantext3").html("wifi_100m_port2".i18n());
		$("#lantext4").html("wifi_100m_port3".i18n());
	}
	$("#lantext5").html("wifi_10g_lan".i18n());
	if (lan_port_10g_num == 1) {
		document.getElementById('LAN5enable').style.display = '';
	}
});

function back_to_main() {
	if (operator_name == "MY_TM")
	{
		window.parent.location = "../html/main_my_tm.html";
	}
}

function ssiddisplayInfo(data) {
	main_wifi_index_5g = data.ssid_info.main_wifi_index_5g;
}

//Construct  Wifi Port Html
function constructWifiPortHtml(data) {
	sessionidstr = data.sessionid;
	if (data.success != 'true') {
		return false;
	}

	if (data.wifi_enable != undefined) {
		wifi_enable = data.wifi_enable;
	}

	if (data.wifi_5g_enable != undefined) {
		wifi_5g_enable = data.wifi_5g_enable;
	}

	if (data.lan_port_10g_num != undefined) {
		lan_port_10g_num = data.lan_port_10g_num;
	}
	if (data.lan_port_num != undefined) {
		lan_port_num = data.lan_port_num;
	}

	gWifiData = data;
}

function checkWifiEnable() {
	for (var i = 1; i <= 16; i++) {
		var singlewlanvlanbind = gWifiData.wlanVlanBindList[i - 1];
		if (eval("singlewlanvlanbind.ssid" + i) == 1)
		{
			if (eval("all_wan_info.wifi_obj_enable.ConfigActive" + i) == 0) {
				$("#Wan_SSID_checkbox" + i).attr("disabled", true);
			} else {
				$("#Wan_SSID_checkbox" + i).attr("disabled", false);
			}
		}
		continue;
	}
}

function change_eye()
{
    $("#PreSharedKey_bs").toggleClass("fh-text-security");	
}

function change_eye_24g()
{
    $("#PreSharedKey").toggleClass("fh-text-security");	
}

function change_eye_5g()
{
    $("#PreSharedKey_5G").toggleClass("fh-text-security");	
}

function initPage_wan(getdata)
{
	all_wan_info = '';
	if (getdata != null)
	{
		all_wan_info = getdata;
		for (var m = 0; m < all_wan_info.wan.length; m++)
		{	
			//console.log("m= " + m)
			var single = all_wan_info.wan[m];
			var wan_name_value = single.wan_index + '_' + single.wan_session_index + '_' + single.iporppp + '_' + single.Name;//拼接wan的value给
			//console.log(wan_name_value);
			if ((single.Name.indexOf("_R_") >= 0) && (single.Name.indexOf("INTERNET") >= 0) && single.ConnectionType == "PPPoE_Routed")
			{
				wan_index = wan_name_value.split("_")[0];
				wan_session_index = wan_name_value.split("_")[1];
				$("#WanUserName_text").val(single.Username);
				$("#POED").val(fhdecrypt(single.Password));
				bindlist_cur = single.LanInterface;
				//console.log("LanInterface " + single.LanInterface);
				//console.log(wan_index);
				//console.log(wan_session_index);
				break;
			}
		}
	}
}

function initPage(getdata)
{
	if (getdata != null && getdata.wizard_info) {
		g_data = getdata.wizard_info;
		displayHtml(); 
	}
}

function unCheckAllBindPorts() {
	$("input[name='portbind']").prop("checked", false);
}

function bindlist_switch(bindlist)
{
	var operator_mode = $("input[name='operator_mode']:checked").val();
	//console.log("bindlist: "+ bindlist);
	//console.log("main_wifi_index_5g: "+ main_wifi_index_5g);
	unCheckAllBindPorts();
	//$("#Wan_Port_checkbox1").attr("disabled", false);
	//$("#Wan_Port_checkbox4").attr("disabled", false);
	
	if (bindlist != '')
	{
		var bindlist_array = bindlist.split(',');
		for (var i = 0; i < bindlist_array.length; i++) 
		{
			var singlebind = bindlist_array[i];
			//console.log('singlebind is ' + singlebind);
			if (singlebind.indexOf(bindListLanHead) >= 0)
			{
				var singleport = singlebind.split('.')[2]; //dev.eth.1-4
				var elementIndex = singleport - 1;
				$("input[name='portbind']:eq(" + elementIndex + ")").prop("checked", true);
			}
			if (singlebind.indexOf(bindListWifiHead) >= 0) 
			{
				var singleport = singlebind.split('.')[2]; //dev.wla.1-4
				if (main_wifi_index_5g == 9) 
				{
					if (singleport > 8) {
						var elementIndex = singleport - 5;
					} else {
						var elementIndex = singleport - 1;
					}
					$("input[name='portbind']").each(function(i) {
						if ($(this).val() == elementIndex) {
							$(this).prop("checked", true);
						}
					});
				}
				else 
				{
					var elementIndex = singleport - 1;
					$("input[name='portbind']").each(function(i)
					{
						if ($(this).val() == elementIndex) {
							$(this).prop("checked", true);
						}
					});
				}
			}
		}
	}
	if (operator_mode == "10")
	{
		$("#Wan_Port_checkbox4").attr("disabled", true);
	}
	else if (operator_mode == "12")
	{
		$("#Wan_Port_checkbox1").attr("disabled", true);
		$("#Wan_Port_checkbox4").attr("disabled", true);
	}
}

function displayHtml()
{
	//console.log(g_data);
	var bind_list;
	cur_operator_mode = g_data.operator_mode; 
	if (g_data.operator_mode == "10") {
		$("#operator_mode_combo").prop('checked', true);
		$("#wan_info").css("display", "");
		bind_list = bindlist_combo;
	}
	else if (g_data.operator_mode == "11") {
		$("#operator_mode_bridge").prop('checked', true);
		$("#wan_info").css("display", "none");
	}
	else if (g_data.operator_mode == "12") {
		$("#operator_mode_rg").prop('checked', true);
		$("#wan_info").css("display", "");
		bind_list = bindlist_ag;
	}
	else if (g_data.operator_mode == "13") {
		$("#operator_mode_ap").prop('checked', true);
		$("#wan_info").css("display", "none");
	}
	if (g_data.operator_mode == "10" || g_data.operator_mode == "12")
	{
		//bindlist_switch(bind_list);
		//console.log("bindlist_cur123 " + bindlist_cur);
		bindlist_switch(bindlist_cur);
	}
	

	//console.log("data.X_FH_BandSteeringEnable " + g_data.X_FH_BandSteeringEnable);
	
	if(g_data.X_FH_BandSteeringEnable == "0"){
		$("#change_bandSteering_mode").hide();
		$("#ssid_info_24g").show();	
		$("#ssid_info_5g").show();	
	}else{
		$("#change_bandSteering_mode").show();
		$("#ssid_info_24g").hide();	
		$("#ssid_info_5g").hide();	
	}
    setSwitchValue("WlanEnable_container", g_data.X_FH_BandSteeringEnable);

	/*ssid_bs*/
	$("#ssid_bs").val(g_data.ssid_bs);
	temp_b64_bs = fhdecrypt(g_data.ssid_bs_pwd);
	old_PreSharedKey_bs = g_data.ssid_bs_pwd;
	$("#PreSharedKey_bs").val(temp_b64_bs);

	/*2.4G SSID*/
	$("#SSID").val(g_data.ssid_24g);
	temp_b64_24g = fhdecrypt(g_data.ssid_24g_pwd);
	old_PreSharedKey_24g = g_data.ssid_24g_pwd;
	$("#PreSharedKey").val(temp_b64_24g);

	/*5G SSID*/
	$("#SSID_5G").val(g_data.ssid_5g);
	temp_b64_5g = fhdecrypt(g_data.ssid_5g_pwd);
	old_PreSharedKey_5g = g_data.ssid_5g_pwd;
	$("#PreSharedKey_5G").val(temp_b64_5g);
	
}

function Cancel()
{
	displayHtml();
}

function calcBindList() {
	var bindlist = '';
	if ($("#port_div").is(":visible")) {
		for (var i = 0; i < portbind_num; i++) {
			var bindstr = '';
			var portnumber = '';
			if ($("input[name='portbind']:eq(" + i + ")").attr('checked')) {
				if (i < lanportbind_num) {
					portnumber = i + 1;
					bindstr = bindListLanHead + portnumber;
				}
				else {
					if (main_wifi_index_5g == 9) {
						portnumber = $("input[name='portbind']:eq(" + i + ")").attr('value');
						if (portnumber == "4" || portnumber == "5" || portnumber == "6" || portnumber == "7") {
							portnumber = parseInt(portnumber) + 5;
						} else {
							portnumber = parseInt(portnumber) + 1;
						}
						bindstr = bindListWifiHead + portnumber;
					} else {
						portnumber = $("input[name='portbind']:eq(" + i + ")").attr('value');
						portnumber = parseInt(portnumber) + 1;
						bindstr = bindListWifiHead + portnumber;
					}

				}
			}

			if (bindstr != '') {
				if (bindlist == '') {
					bindlist = bindstr;
				}
				else {
					bindlist += ',' + bindstr;
				}
			}
		}
	}
	return bindlist;
}

function extraValidCheck() {
	var wan_num;
	
	if (all_wan_info != '' && all_wan_info.wan) {
		wan_num = all_wan_info.wan.length;
	}
	//console.log("wan_num " + wan_num);
	if (wan_num > 0) {
		var bindList = calcBindList();
		//console.log("wan_index " + wan_index);
		for (var wan_num_i = 0; wan_num_i < wan_num; wan_num_i++) {	
			var saveBindListAarry = bindList.split(',');
			var single_wan = all_wan_info.wan[wan_num_i];
			if ($("#port_div").is(":visible") && single_wan.LanInterface != '' && bindList != '' && (wan_num_i != wan_index -1)) {
				var wanBindListAarry = single_wan.LanInterface.split(',');
				for (var i = 0; i <= saveBindListAarry.length; i++) {
					//console.log("i " + i);
					if (saveBindListAarry[i] != undefined && saveBindListAarry[i] != '') {
						for (var j = 0; j <= wanBindListAarry.length; j++) {
							if (wanBindListAarry[j] != undefined && wanBindListAarry[j] != '') {
								if (saveBindListAarry[i] == wanBindListAarry[j]) {
									alert("repeated_binding_port_alert1".i18n() + single_wan.Name + "repeated_binding_port_alert2".i18n());
									return false;
								}
							}
						}
					}
				}
			}
		}
	}
	return true;
}

function initValidate() { 
	var eg_required = false;
	$("#wizard_form").validate({
		debug: true,
		rules: { 
			"WanUserName_text": { required: true, maxlength: 63, digits:eg_required },
			"POED": { required: pppoe_required, nocn: true, maxlength: 63 ,digits:eg_required}, 
			"PreSharedKey_bs": {required: true, minlength:8, maxlength:63, nocn: true},
			"ssid_bs": {required: true, minlength:1, maxlength:32, nocn: true},
			"PreSharedKey": {required: true, minlength:8, maxlength:63, nocn: true},
			"SSID": {required: true, minlength:1, maxlength:32, nocn: true},
			"PreSharedKey_5G": {required: true, minlength:8, maxlength:63, nocn: true},
			"SSID_5G": {required: true, minlength:1, maxlength:32, nocn: true},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate broadband ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate broadband failed.....");
			return false;
		}
	});
}



function LoadStatus(responseData) {
	console.log("responseData.config_status " + responseData.config_status);
	var postdata2 = new Object();
	postdata2.sessionid = sessionidstr;

	if(responseData.config_status != "0")
	{
		alert("set_quick_setup_failed".i18n());
	}
	else
	{
		if(operator_mode_modify != null && operator_mode_modify)
		{	
			if (operator_name != "MY_TM")
			{
				alert("relogin_after_device_reboot".i18n());
			}
			XHR.post("set_onu_reboot", postdata2, null);
			jumpToLoginPage(true);
		}
	}
}

function SaveApply() {
	if (!$("#wizard_form").valid()) {
		alert("invalid_value_alert".i18n());
		return;
	}

	if($("#port_div").is(":visible") ){
		if (!extraValidCheck()) {
				return;
		}
	}

	if (operator_name != "MY_TM")
	{
		show_shadow();
	}
	var mode = $("input[name='operator_mode']:checked").val();
	var postdata = new Object();
	postdata.modechange = "0";
	if(cur_operator_mode != mode)
	{
		operator_mode_modify = true;
		postdata.modechange = "1";
		alert("takes_effect_after_device_restart".i18n());
		
		if (operator_name == "MY_TM")
		{
			pause();
		}
	}
	postdata.operator_mode = mode;
	cur_operator_mode = mode;
	postdata.wan_index = wan_index;
	postdata.wan_session_index = wan_session_index;

	if(mode == 10 || mode == 12)
	{
		postdata.Username = $("#WanUserName_text").val();
		postdata.WPd = fhencrypt($("#POED").val());
		postdata.LanInterface = calcBindList();
		bindlist_cur = calcBindList();
		//console.log("LanInterface" + postdata.LanInterface);
		if($("#WlanEnable_container").hasClass("switch_content_on"))
		{
			postdata.X_FH_BandSteeringEnable = "1";
			postdata.ssid_bs = fhencrypt($("#ssid_bs").val());
			postdata.PreSharedKey_bs = fhencrypt($("#PreSharedKey_bs").val());
		}
		else
		{ 
			postdata.X_FH_BandSteeringEnable = "0";
			postdata.SSID = fhencrypt($("#SSID").val());
			postdata.PreSharedKey = fhencrypt($("#PreSharedKey").val());
			postdata.SSID_5G = fhencrypt($("#SSID_5G").val());
			postdata.PreSharedKey_5G = fhencrypt($("#PreSharedKey_5G").val());
		}
	}
	XHR.post("set_wizard_info", postdata, LoadStatus);
	
}
