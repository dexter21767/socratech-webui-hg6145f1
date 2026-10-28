var sessionidstr = "";
var all_wan_info = '';
var selectwan = '';

var splitchar = '_';

var bindListLanHead = "dev.eth.";
var bindListWifiHead = "dev.wla.";

var v4V6ModeAarry = new Array('1', '2', '3');
var ipv4ModeHTML = "<option value='1'>IPv4</option>";
var ipv6ModeHTML = "<option value='2'>IPv6</option>";
var ipv4AndIPv6ModeHTML = "<option value='1'>IPv4</option><option value='2'>IPv6</option><option value='3'>IPv4&IPv6</option>";

var serviceModesArray = new Array('TR069', 'VOIP', 'INTERNET', 'OTHER', "SPECIAL_SERVICE_1", "SPECIAL_SERVICE_2", "SPECIAL_SERVICE_3", "SPECIAL_SERVICE_4"); //1 2 4 8 16 32 64 128
//var serviceModesArray = new Array('TR069', 'VOIP', 'INTERNET', 'OTHER'); //1 2 4 8
var routeServiceListHTML = "<option value='4'>上网</option><option value='1'>管理</option><option value='2'>语音</option><option value='6'>上网+语音</option><option value='5'>上网+管理</option><option value='3'>语音+管理</option><option value='7'>上网+语音+管理</option><option value='8'>其它</option>";//路由模式是否需要其它？
routeServiceListHTML += "<option value='16'>SPECIAL_SERVICE_1</option>";
routeServiceListHTML += "<option value='32'>SPECIAL_SERVICE_2</option>";
routeServiceListHTML += "<option value='64'>SPECIAL_SERVICE_3</option>";
routeServiceListHTML += "<option value='128'>SPECIAL_SERVICE_4</option>";

var bridgeServiceListHTML = "<option value='4'>上网</option><option value='8'>其它</option>";

var connectModeAarry = new Array('route', 'bridge');
var ipoeConnectModeHTML = "<option value='route'>路由</option>";
var pppoeConnectModeHTML = "<option value='route'>路由</option><option value='bridge'>桥接</option>";

//IPoE和PPPoE下的ipv4 address的值无重叠部分，所以不加
var addressTypeArray = new Array('DHCP', 'Static', 'PPPoE');
var ipoeIPv4AddressHTML = "<option value='DHCP'>DHCP</option><option value='Static'>Static</option>";
var pppoeIPv4AddressHTML = "<option value='PPPOE'>PPPoE</option>";

var ipv6AddressArray = new Array('AutoConfigured', 'DHCPv6', 'Static', 'None');
var ipoeIPv6AddressHTML = "<option value='AutoConfigured'>AutoConfigured</option><option value='DHCPv6'>DHCPv6</option><option value='Static'>Static</option><option value='None'>None</option>";
var pppoeIPv6AddressHTML = "<option value='AutoConfigured'>AutoConfigured</option><option value='DHCPv6'>DHCPv6</option><option value='None'>None</option>";

var ipv6PrefixTypeArray = new Array('PrefixDelegation', 'Static', 'PPPOE', 'None');
var ipoeIPv6PrefixTypeHTML = "<option value='PrefixDelegation'>PrefixDelegation</option><option value='Static'>Static</option><option value='None'>None</option>";
var pppoeIPv6PrefixTypeHTML = "<option value='PrefixDelegation'>PrefixDelegation</option><option value='PPPOE'>PPPoE</option><option value='None'>None</option>";

var portbind_num;
var lanportbind_num;
var wifiportbind_num;
var garea_code;
var wifi_5g_enable;

var tr69_wan_modify_enable = 1; //default 

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_factory_mode", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
		if ( getdata.area_code != undefined )
		{
			garea_code = getdata.area_code;
		}
	});
	
	if(garea_code == "Sichuan")
	{
		$("#WanMTU_text").attr("disabled",true); 
	}
	
	$("#WanConnectName_select").bind("change", function(){
		selectWanChange();
	});
	
	$("#WanAddress_select").bind("change", function(){
		initIPorPPPInnerHTML();
		initServiceList();
	});
	
	$("#WanConnectMode_select").bind("change", function(){
		initServiceList();
	});
	
	$("#WanServiceList_select").bind("change", function(){
		secServiceList();
	});	
	
	$("select").bind("change", function(){
		checkShowHideElement();
	});
	
	$("input:checkbox").bind("click", function(){
		checkShowHideElement();
	});
	
	//隐藏错误提示
	$(".main_item_error_hint").each(function (i){
		$(this).hide();
	});
	
	//Construct  Wifi Port Html
	if(gDebug)
	{
		getDataByAjax("../fake/vlanbind", constructWifiPortHtml);
	}else{
		XHR.get("vlanbind", null, constructWifiPortHtml);
	}
	
	portbind_num = $("input[name='portbind']").length;
	lanportbind_num = $(".lanport").length;
	wifiportbind_num = $(".wifiport").length;
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
	}
});

function initValidate()
{
	$("#broadband_form").validate({
		debug: true,
		rules: {
			"WanMTU_text": {required: true, range_int:[0,1540]},
			"WanVlanID_text": {required: true, range_int:[0,4095]},
			"WanUserName_text": {required: true},
			"POED": {required: true},
			"idleDisconnectTime_text": {required: true, range_int:[0,65535]},
			"WanIPv4Address_text": {required: true, ipv4: true},
			"WanSubmask_text": {required: true, ipv4: true},
			"WanGateway_text": {required: true, ipv4: true},
			"WanPri_DNS_text": {required: true, ipv4: true},
			"WanSec_DNS_text": {ipv4: true},
			"WanIPv6Address_Pre_text": {required: true, ipv6:true},
			"WanIPv6Address_text": {required: true, ipv6:true},
			"WanIPv6_Gateway_text": {required: true, ipv6:true},
			"WanIPv6Pri_DNS_text": {required: true, ipv6:true},
			"WanIPv6Sec_DNS_text": {ipv6:true},
			"aftr_text": {required: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate broadband ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate broadband failed.....");
			return false;
		}
	}); 
}

//Construct  Wifi Port Html
function constructWifiPortHtml(data)
{
	sessionidstr = data.sessionid;
	if(data.success != 'true')
	{
		alert("get wifi port bind failed!");	
		return false;
	}
	
	if ( data.wifi_5g_enable != undefined )
	{
		wifi_5g_enable = data.wifi_5g_enable;
	}	
	
	gWifiData = data;
	
	//wifi port
	var i = 0;
	//var index2g = 0;
	//var index5g = 0;
	var wifinum = 0;
	var dynamicHTML = '';
	//var dynamicHTML5g = '';
	for (i=0; i<16; i++)
	{
		var singlewlanvlanbind = data.wlanVlanBindList[i];
		if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi 实例存在
		{
			wifinum++;
			if(wifi_5g_enable == 1)
			{
				if (eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) == "2.4G-1" || eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) == "5G-1")
				{
					dynamicHTML += '<span class="wifiport"><input type="checkbox" name="portbind" value="'+ i +'" id="Wan_SSID_checkbox' + wifinum + '">SSID-' + eval(i+1) + '(' + eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) + ')' + '</span>';
				}
				else
				{
					dynamicHTML += '<span class="wifiport"><input type="checkbox" name="portbind" disabled value="'+ i +'" id="Wan_SSID_checkbox' + wifinum + '">SSID-' + eval(i+1) + '(' + eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) + ')' + '</span>';
				}
			}
			else if(wifi_5g_enable == 0 && eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)).indexOf("5G") < 0)
			{
				if (eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) == "2.4G-1")
				{
					dynamicHTML += '<span class="wifiport"><input type="checkbox" name="portbind" value="'+ i +'" id="Wan_SSID_checkbox' + wifinum + '">SSID-' + eval(i+1) + '(' + eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) + ')' + '</span>';
				}
				else
				{
					dynamicHTML += '<span class="wifiport"><input type="checkbox" name="portbind" disabled value="'+ i +'" id="Wan_SSID_checkbox' + wifinum + '">SSID-' + eval(i+1) + '(' + eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) + ')' + '</span>';
				}			
			}
			/*if (singlewlanvlanbind.X_CT_COM_RFBand == "1")//5g
			{
				index5g++;
				wifinum++;
				dynamicHTML5g += '<span class="wifiport"><input type="checkbox" name="portbind" value="'+ i +'" id="Wan_SSID_checkbox' + wifinum + '">5G-' + index5g + '</span>';
			}
			else //2.4g
			{
				index2g++;
				wifinum++;
				dynamicHTML2g += '<span class="wifiport"><input type="checkbox" name="portbind" value="'+ i +'" id="Wan_SSID_checkbox' + wifinum + '">2.4G-' + index2g + '</span>';
			}*/

		}
		continue;
	}
	$("#wifi_div").html(dynamicHTML);
	if (wifinum<=4)
	{
		document.getElementById('wifi_ports_div2').style.height = 0 + 'px';
	}
	else if(wifinum<=8)
	{
		document.getElementById('wifi_ports_div2').style.height = 50 + 'px';
	}
	else if(wifinum<=12)
	{
		document.getElementById('wifi_ports_div2').style.height = 100 + 'px';
	}
	else
	{
		document.getElementById('wifi_ports_div2').style.height = 150 + 'px';
	}
	//$("#5g_wifi_div").html(dynamicHTML5g);
	
}

function checkShowHideElement()
{
	if ( $("#WanVlan_Enable").attr('checked') )
	{
		$("#VLAN_Setting").show();
	}
	else
	{
		$("#VLAN_Setting").hide();
	}
	
	if ( $("#WanAddress_select").val() == "PPPoE" && $("#WanConnectMode_select").val() == "route" )
	{
		$("#Address_PPPoE_Setting").show();
		if($("#dialMode_select").val() == 'OnDemand')
		{
			$("#idleDisconnectTime_Setting").show();
		}
		else
		{
			$("#idleDisconnectTime_Setting").hide();
		}
	}
	else
	{
		$("#Address_PPPoE_Setting").hide();
	}
	

	if ( $("#WanConnectMode_select").val() == 'route' )
	{
		if ( $("#WanIP_Mode_select").val() == '1' ) //ipv4
		{
			$("#IPv4_Settings").show();
			$("#IPv6_Settings").hide();
		}
		else if ( $("#WanIP_Mode_select").val() == '2' ) //ipv6
		{
			$("#IPv4_Settings").hide();
			$("#IPv6_Settings").show();
		}
		else
		{
			$("#IPv4_Settings").show();
			$("#IPv6_Settings").show();
		}
	}
	else
	{
		$("#IPv4_Settings").hide();
		$("#IPv6_Settings").hide();
	}
	
	if ( $("#WanIPv4Address_select").val() == 'Static' )
	{
		$("#IPv4_Address_Static_Settings").show();
	}
	else
	{
		$("#IPv4_Address_Static_Settings").hide();
	}
	
	if ( $("#WanPrefix_checkbox").attr('checked') )
	{
		$("#IPv6_Address_Prefix_Type_Tr").show();
	}
	else
	{
		$("#IPv6_Address_Prefix_Type_Tr").hide();
	}
	
	if ( $("#WanPrefix_checkbox").attr('checked') && $("#WanPrefix_select").val() == 'Static' )
	{
		$("#IPv6_Address_Prefix_Tr").show();
	}
	else
	{
		$("#IPv6_Address_Prefix_Tr").hide();
	}
	
	if ( $("#WanIPv6Address_select").val() == 'Static' )
	{
		$("#IPv6_Address_Static_Settings").show();
	}
	else
	{
		$("#IPv6_Address_Static_Settings").hide();
	}
	
	if ( $("#WanServiceList_select").val() == '1' || $("#WanServiceList_select").val() == '2' || $("#WanServiceList_select").val() == '3' )
	{
		// $("#lan_ports").hide();
		// $("#wifi_ports").hide();
		$("#port_div").hide();
	}
	else
	{
		// $("#lan_ports").show();
		// $("#wifi_ports").show();
		$("#port_div").show();
	}
	
	if ( $("#WanDslite_checkbox").attr('checked') )
	{
		$("#aftr_check_div").show();
	}
	else
	{
		$("#aftr_check_div").hide();
	}
	
	if ( $("#WanDslite_checkbox").attr('checked') && $("#aftr_checkbox").attr('checked') )
	{
		$("#aftr_value_div").show();
	}
	else
	{
		$("#aftr_value_div").hide();
	}
	
	// 包含Internet且IP模式为IPv6的连接才能配置DS-Lite信息
	if ( 4 == (4 & $("#WanServiceList_select").val())
		&& $("#WanIP_Mode_select").val() == v4V6ModeAarry[1] )
	{
		$("#IPv6_Dslite_Settingstotal").show();
	}
	else
	{
		$("#IPv6_Dslite_Settingstotal").hide();
	}
		
	if ( $("#WanConnectName_select").val() == '0' )//新建
	{
		$("#delete_button").hide();
	}
	else
	{
		$("#delete_button").show();
	}
	
	if ( all_wan_info.wifi_device == 1 )
	{
		$(".wifi_ports").show();
	/*	if ( all_wan_info.wifi_5g_enable == 1 )
		{
			$("#wifi_ports_div2").show();
		}
		else
		{
			$("#wifi_ports_div2").hide();
		}*/
		$(".wifiport").hide();
		for ( i=0; i<all_wan_info.wifi_port_num; i++ )
		{
			$(".wifiport:eq(" + i + ")").show();
		}
	}
	else
	{
		$(".wifi_ports").hide();
	}
}

function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	all_wan_info = '';
	// selectwan = '';
	if ( getdata != null )
	{
		all_wan_info = getdata;
		if ( getdata.tr69wan_modify != undefined )
		{
			tr69_wan_modify_enable = getdata.tr69wan_modify;
		}
	}
	
	//初始化wan连接名称
	initConnectName();
	//初始化IP模式
	initIpProtocol();
	//根据封装类型初始化配置项的内容
	initIPorPPPInnerHTML();
	//根据连接模式初始化业务类型列表
	initServiceList();
	
	selectWanChange();
	
	checkWifiEnable();
	
	if(wifi_5g_enable == 1)
	{
		$("#lantext1").html("千兆口1");
		$("#lantext2").html("iTV");
		$("#lantext3").html("千兆口3");
		$("#lantext4").html("千兆口4");
	}
	else
	{	
		$("#lantext1").html("千兆口");
		$("#lantext2").html("iTV");
		$("#lantext3").html("百兆口2");
		$("#lantext4").html("百兆口3");	
	}
	
	showOrHideLoadingWindowFromIframe('hide');
}

function checkWifiEnable()
{
	for ( var i=1; i<= 16; i++ )
	{
		var singlewlanvlanbind = gWifiData.wlanVlanBindList[i-1];
		if(eval("singlewlanvlanbind.ssid" + i) == 1)//wifi 实例存在
		{
			if ( eval("all_wan_info.wifi_obj_enable.ConfigActive" + i) == 0 )
			{
				$("#Wan_SSID_checkbox" + i).attr("disabled", true);
			}
		}
		continue;
	}
}

function selectWanChange()
{
	$(".main_item_error_hint").each(function (i){
		$(this).hide();
	});
	
	selectwan = $("#WanConnectName_select").val();
	if ( selectwan == 0 )//新增WAN连接
	{
		loadNewWan();
	}
	else
	{
		var select_wan_info = getSingleWanInfo(selectwan);
		//alert(select_wan_info);
		if ( select_wan_info != '' )
		{
			loadSpecifiedWan(select_wan_info);
		}
	}
	
	checkShowHideElement();
}

function getSingleWanInfo(selectwan_index)
{
	var select_wan_index = selectwan.split(splitchar)[0];
	var select_wan_session_index = selectwan.split(splitchar)[1];
	var select_iporppp = selectwan.split(splitchar)[2];
	//alert(selectwan);
	var wan_num = all_wan_info.wan.length;
	//alert(wan_num);
	var select_wan_info = '';
	
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			if ( single_wan.wan_index == select_wan_index 
				&& single_wan.wan_session_index == select_wan_session_index 
				&& single_wan.iporppp == select_iporppp )
				{
					select_wan_info = single_wan;
					break;
				}
		}
	}
	
	return select_wan_info;
}


//加载新增WAN连接的参数
function loadNewWan()
{
	$("#WanAddress_select").val("IPoE");//封装类型默认选择IPoE
	initIPorPPPInnerHTML();
	
	$("#WanConnectMode_select").val(connectModeAarry[0]);//连接模式默认选择路由
	initServiceList();
	
	$("#WanServiceList_select").val(4); //业务类型默认选择上网
	
	//v4V6ModeAarry is "1_2_3";
	$("#WanIP_Mode_select").val(v4V6ModeAarry[0]);//IP模式默认选择IPv4
	
	if(garea_code == 'Sichuan')
	{
		$("#dialMode_select").val('OnDemand');
	}
	else
	{
		$("#dialMode_select").val('AlwaysOn');
	}
	//alert(garea_code);
	if(garea_code == "Sichuan")
	{	
		$("#WanMTU_text").val('1460');
		$("#WanMTU_text").attr("disabled",true); 
	}
	else
	{
		$("#WanMTU_text").val('1500'); //默认MTU为1500
	}	
	
	//默认禁用VLAN
	$("#WanVlan_Enable").prop("checked", false);
	$("#WanVlanID_text").val('');
	
	$("#Wan_802_1_P_select").val('0');
	
	unCheckAllBindPorts();//去除所有端口绑定
	
	// IPv4信息
	// addressTypeArray is ('DHCP', 'Static', 'PPPoE')
	$("#WanIPv4Address_select").val(addressTypeArray[0]);//默认选择DHCP
	clearIpv4StaticIpInfo();
	clearPPPoEInfo();
	
	// IPv6信息
	$("#WanPrefix_checkbox").prop("checked", false); //默认不获取前缀
	// ipv6PrefixTypeArray is ('PrefixDelegation', 'Static', 'PPPoE', 'None');
	$("#WanIPv6Address_Pre_text").val(ipv6PrefixTypeArray[0]);
	$("#WanIPv6Address_Pre_text").val('');
	//ipv6DNS配置暂缺
	$("#WanIPv6Address_select").val(ipv6AddressArray[1]);
	clearIpv6StaticIpInfo();
	$("#WanDslite_checkbox").prop("checked", false);
	$("#aftr_checkbox").prop("checked", false);
	$("#aftr_text").val('');
	
	//tr069 wan不能修改，part 2
	$("#save_button, #delete_button").removeAttr("disabled");
	$("#save_button, #delete_button").removeClass("input_button_disabled");
	$("#tr69_wan_hint").hide();
}

function setCheck(ajaxObject, ischecked)
{
	if(ajaxObject)
	{
		if(ischecked == 1 || ischecked == '1' || true == ischecked || ischecked == 'Enable' || ischecked == 'Enabled')
		{
			ajaxObject.attr('checked', true);
		}
		else
		{
			ajaxObject.attr('checked', false);
		}
	}	
}

function loadSpecifiedWan(select_wan_info)
{
	//alert(select_wan_info.iporppp);
	if ( select_wan_info.iporppp == '1' ) //1:ipoe  2:pppoe
	{
		$("#WanAddress_select").val("IPoE");
	}
	else
	{
		$("#WanAddress_select").val("PPPoE");
	}
	//这种直接赋值的无法触发select的change事件，需要手动调用
	initIPorPPPInnerHTML();
	
	if ( select_wan_info.ConnectionType == "IP_Routed" || select_wan_info.ConnectionType == "PPPoE_Routed" )
	{
		$("#WanConnectMode_select").val(connectModeAarry[0]);
	}
	else
	{
		$("#WanConnectMode_select").val(connectModeAarry[1]);
	}
	initServiceList();
	
	var selectListValue = 0;
	var isTr69Wan = 0;
	//serviceModesArray is ('TR069', 'VOIP', 'INTERNET', 'OTHER');
	for ( var i=0; i< serviceModesArray.length; i++ )
	{
		if ( select_wan_info.ServiceList.toUpperCase().indexOf(serviceModesArray[i]) >= 0)
		{
			selectListValue += Math.pow(2,i);
			if ( i == 0 )
			{
				isTr69Wan = 1;
			}
		}
	}
	//fiberlog('selectListValue is ' + selectListValue);
	$("#WanServiceList_select").val(selectListValue);
	
	$("#WanIP_Mode_select").val(select_wan_info.IPMode);
	
	//ipc和pppc的mtu管理量不同
	// if ( select_wan_info.iporppp == '1' )
	// {
		$("#WanMTU_text").val(select_wan_info.mtu);
	// }
	// else
	// {
		// $("#WanMTU_text").val(select_wan_info.mtu);
	// }
	if ( getOperator() == "CU" )
	{
		if(select_wan_info.VLANEnabled == '1')
			$("#WanVlan_Enable").prop("checked", true);
		else
			$("#WanVlan_Enable").prop("checked", false);
		$("#WanVlanID_text").val(select_wan_info.vlanid);
	}
	else if ( getOperator() == "CM" )
	{
		if(select_wan_info.VLANEnabled == '2')
			$("#WanVlan_Enable").prop("checked", true);
		else
			$("#WanVlan_Enable").prop("checked", false);
		$("#WanVlanID_text").val(select_wan_info.vlanid);
	}	
	else
	{
		if ( select_wan_info.vlanid == '0' )
		{
			$("#WanVlan_Enable").prop("checked", false);
			$("#WanVlanID_text").val('');
		}
		else
		{
			$("#WanVlan_Enable").prop("checked", true);
			$("#WanVlanID_text").val(select_wan_info.vlanid);
		}
	}
	
	$("#Wan_802_1_P_select").val(select_wan_info.p8021);
	
	var bindlist = select_wan_info.LanInterface;
	//fiberlog('bindlist is ' + bindlist);
	unCheckAllBindPorts();
	if ( bindlist != '' )
	{
		var bindlist_array = bindlist.split(',');
		for(var i=0; i < bindlist_array.length; i++)
		{
			var singlebind = bindlist_array[i];
			//fiberlog('singlebind is ' + singlebind);
			if ( singlebind.indexOf(bindListLanHead) >= 0 )
			{
				var singleport = singlebind.split('.')[2]; //dev.eth.1-4
				var elementIndex = singleport - 1;
				$("input[name='portbind']:eq(" + elementIndex + ")").prop("checked", true);
			}
			if ( singlebind.indexOf(bindListWifiHead) >= 0 )
			{
				var singleport = singlebind.split('.')[2]; //dev.wla.1-4
				var elementIndex = singleport - 1;
				$("input[name='portbind']").each(function (i){
					if ($(this).val() == elementIndex)
					{
						$(this).prop("checked", true);
					}
				});
			}
		}
	}
	
	// IPv4信息
	$("#WanIPv4Address_select").val(select_wan_info.AddressingType);
	if (select_wan_info.AddressingType == addressTypeArray[1])
	{
		//填充static信息
		$("#WanIPv4Address_text").val(select_wan_info.ExternalIPAddress);
		$("#WanSubmask_text").val(select_wan_info.SubnetMask);
		$("#WanGateway_text").val(select_wan_info.DefaultGateway);
		var dns = select_wan_info.DNSServers;
		if ( dns.indexOf(',') >= 0 )
		{
			$("#WanPri_DNS_text").val(dns.split(',')[0]);
			$("#WanSec_DNS_text").val(dns.split(',')[1]);
		}
		else
		{
			$("#WanPri_DNS_text").val(dns);
			$("#WanSec_DNS_text").val('');
		}
	}
	else
	{
		clearIpv4StaticIpInfo();
	}
	if (select_wan_info.AddressingType == addressTypeArray[2])
	{
		//填充pppoe信息
		$("#WanUserName_text").val(select_wan_info.Username);
		$("#POED").val(select_wan_info.Password);
		$("#dialMode_select").val(select_wan_info.ConnectionTrigger);
		$("#idleDisconnectTime_text").val(select_wan_info.IdleDisconnectTime);
		
		setCheck($("#WanProxyEnable_text"), select_wan_info.pppProxyEnable);
		$("#WanMAXUser_text").val(select_wan_info.pppMAXUser);
		setCheck($("#BROADBUND_ppptobridge"), select_wan_info.pppToBridge);		
	}
	else
	{
		clearPPPoEInfo();
	}
	
	// IPv6信息
	if ( select_wan_info.IPv6PrefixDelegationEnabled == '1' )
	{
		$("#WanPrefix_checkbox").prop("checked", true);
		$("#WanPrefix_select").val(select_wan_info.IPv6PrefixOrigin);
		if ( select_wan_info.IPv6PrefixOrigin == 'Static' )
		{
			$("#WanIPv6Address_Pre_text").val(select_wan_info.IPv6Prefix);
		}
		else
		{
			$("#WanIPv6Address_Pre_text").val('');
		}
	}
	else
	{
		$("#WanPrefix_checkbox").prop("checked", false);
		// ipv6PrefixTypeArray is ('PrefixDelegation', 'Static', 'PPPoE', 'None');
		$("#WanIPv6Address_Pre_text").val(ipv6PrefixTypeArray[0]);
		$("#WanIPv6Address_Pre_text").val('');
	}
	//ipv6DNS配置暂缺
	$("#WanIPv6Address_select").val(select_wan_info.IPv6IPAddressOrigin);
	//fiberlog(select_wan_info.IPv6IPAddressOrigin);
	// ipv6AddressArray is ('AutoConfigured', 'DHCPv6', 'Static', 'None')
	if ( select_wan_info.IPv6IPAddressOrigin == ipv6AddressArray[2] )
	{
		$("#WanIPv6Address_text").val(select_wan_info.IPv6IPAddress);
		$("#WanIPv6_Gateway_text").val(select_wan_info.DefaultIPv6Gateway);
		var dns = select_wan_info.IPv6DNSServers;
		if ( dns.indexOf(',') >= 0 )
		{
			$("#WanIPv6Pri_DNS_text").val(dns.split(',')[0]);
			$("#WanIPv6Sec_DNS_text").val(dns.split(',')[1]);
		}
		else
		{
			$("#WanIPv6Pri_DNS_text").val(dns);
			$("#WanIPv6Sec_DNS_text").val('');
		}
	}
	else
	{
		clearIpv6StaticIpInfo();
	}
	if ( select_wan_info.Dslite_Enable == '1' )
	{
		$("#WanDslite_checkbox").prop("checked", true);
		if ( select_wan_info.AftrMode == '1' )
		{
			$("#aftr_checkbox").prop("checked", true);
			$("#aftr_text").val(select_wan_info.Aftr);
		}
		else
		{
			$("#aftr_checkbox").prop("checked", false);
			$("#aftr_text").val('');
		}
	}
	else
	{
		$("#WanDslite_checkbox").prop("checked", false);
		$("#aftr_checkbox").prop("checked", false);
		$("#aftr_text").val('');
	}
	
	//tr069 wan不能修改，part 1
	if ( isTr69Wan == 1 && tr69_wan_modify_enable == 0 )
	{
		$("#save_button, #delete_button").attr("disabled", "disabled");
		$("#save_button, #delete_button").addClass("input_button_disabled");
		$("#tr69_wan_hint").show();
	}
	else
	{
		$("#save_button, #delete_button").removeAttr("disabled");
		$("#save_button, #delete_button").removeClass("input_button_disabled");
		$("#tr69_wan_hint").hide();
	}
}

function clearIpv6StaticIpInfo()
{
	$("#WanIPv6Address_text").val('');
	$("#WanIPv6_Gateway_text").val('');
	$("#WanIPv6Pri_DNS_text").val('');
	$("#WanIPv6Sec_DNS_text").val('');
}
function clearIpv4StaticIpInfo()
{
	$("#WanIPv4Address_text").val('');
	$("#WanSubmask_text").val('');
	$("#WanGateway_text").val('');
	$("#WanPri_DNS_text").val('');
	$("#WanSec_DNS_text").val('');
}
function clearPPPoEInfo()
{
	$("#WanUserName_text").val('');
	$("#POED").val('');
}

function unCheckAllBindPorts()
{
	$("input[name='portbind']").prop("checked", false);
}

function initIPorPPPInnerHTML()
{
	//fiberlog("in initIPorPPPInnerHTML");
	if ( $("#WanAddress_select").val() == "IPoE" )
	{
		$("#WanPrefix_select").html(ipoeIPv6PrefixTypeHTML);
		$("#WanIPv4Address_select").html(ipoeIPv4AddressHTML);
		$("#WanConnectMode_select").html(ipoeConnectModeHTML);
		$("#WanIPv6Address_select").html(ipoeIPv6AddressHTML);

		if(garea_code == "Sichuan")
		{	
			$("#WanMTU_text").val('1460');
		}
		else
		{
			$("#WanMTU_text").val('1500'); //IPoE默认MTU为1500
		}		
		
	}
	else
	{
		$("#WanPrefix_select").html(pppoeIPv6PrefixTypeHTML);
		$("#WanIPv4Address_select").html(pppoeIPv4AddressHTML);
		$("#WanConnectMode_select").html(pppoeConnectModeHTML);
		$("#WanIPv6Address_select").html(pppoeIPv6AddressHTML);
		
		if(garea_code == "Sichuan")
		{	
			$("#WanMTU_text").val('1460');
		}
		else
		{
			$("#WanMTU_text").val('1492'); //PPPoE默认MTU为1492
		}			
	}
}

function initServiceList()
{
	var addressType =  $("#WanAddress_select").val();
	var connectionType = $("#WanConnectMode_select").val();
	var serviceList = $("#WanServiceList_select").val();
	
	if ( $("#WanConnectMode_select").val() == "route" )
	{
		$("#WanServiceList_select").html(routeServiceListHTML);
		if ( $("#WanAddress_select").val() == "IPoE" )
		{
			if(garea_code == "Sichuan")
			{	
				$("#WanMTU_text").val('1460');
			}
			else
			{
				$("#WanMTU_text").val('1500');
			}			
		}
		else
		{
			if(garea_code == "Sichuan")
			{	
				$("#WanMTU_text").val('1460');
			}
			else
			{
				$("#WanMTU_text").val('1492');
			}				
		}
	}
	else
	{
		$("#WanServiceList_select").html(bridgeServiceListHTML);

		if(garea_code == "Sichuan")
		{	
			$("#WanMTU_text").val('1460');
		}
		else
		{
			$("#WanMTU_text").val('1500');
		}		
		
	}
	
	if (addressType == 'PPPoE' && connectionType == 'route' 
	&& (serviceList == 4 || serviceList == 5 || serviceList == 6 || serviceList == 7) 
	&& (garea_code == 'Zhejiang' || garea_code == 'Jiangsu'))	
	{
		document.getElementById('PROXY_Setting').style.display = '';
	}
	else
	{
		document.getElementById('PROXY_Setting').style.display = 'none';
	}
	
	if (addressType == 'PPPoE' && connectionType == 'route' && (garea_code == 'Zhejiang' || garea_code == 'Jiangsu'))
	{
		document.getElementById('pppToBridgeId').style.display = '';
	}
	else
	{
		document.getElementById('pppToBridgeId').style.display = 'none';
	}		
	
}

function secServiceList()
{
	var addressType =  $("#WanAddress_select").val();
	var connectionType = $("#WanConnectMode_select").val();
	var serviceList = $("#WanServiceList_select").val();
	
	if (addressType == 'PPPoE' && connectionType == 'route' 
	&& (serviceList == 4 || serviceList == 5 || serviceList == 6 || serviceList == 7) 
	&& (garea_code == 'Zhejiang' || garea_code == 'Jiangsu'))	
	{
		document.getElementById('PROXY_Setting').style.display = '';
	}
	else
	{
		document.getElementById('PROXY_Setting').style.display = 'none';
	}
	
}

function initConnectName()
{
	//fiberlog('got ' + all_wan_info.wan.length + ' wan');
	var wan_num = 0;
	var dynamicHtml = '';
	
	if ( all_wan_info.show_wan )
	{
		selectwan = all_wan_info.show_wan;
	}
	
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			dynamicHtml += '<option value="' + single_wan.wan_index + '_' + single_wan.wan_session_index + '_' + single_wan.iporppp + '_' + single_wan.Name + '">' + single_wan.Name + '</option>';
			if ( selectwan == '' )
			{
				selectwan = single_wan.wan_index + '_' + single_wan.wan_session_index;
			}
			
			//兼容AddressingType为PPPoE和PPPOE的情况
			if ( single_wan.AddressingType.toUpperCase() == addressTypeArray[2].toUpperCase() )
			{
				all_wan_info.wan[i].AddressingType = addressTypeArray[2];
			}
		}
	}
	dynamicHtml += '<option value="0">新增WAN连接</option>';
	if ( selectwan == '' )
	{
		selectwan = '0';
	}
	// fiberlog('selectwan is ' + selectwan);
	
	$("#WanConnectName_select").html(dynamicHtml);
	$("#WanConnectName_select").val(selectwan);
}

function initIpProtocol()
{
	if ( all_wan_info.ip_protocol_version == 1 ) //ipv4
	{
		$("#WanIP_Mode_select").html(ipv4ModeHTML);
	}
	else if ( all_wan_info.ip_protocol_version == 2 ) //ipv6
	{
		$("#WanIP_Mode_select").html(ipv6ModeHTML);
	}
	else
	{
		$("#WanIP_Mode_select").html(ipv4AndIPv6ModeHTML);//v4&v6
	}
}

function deleteValidCheck()
{
	var str = $("#WanConnectName_select")[0].value;
	
	//alert(str);
	if ((str.indexOf('TR069') > 0) && (garea_code == "Gansu" || garea_code == "Guizhou" || garea_code == "Jiangxi" 
	|| garea_code == "Jiangsu" || garea_code == "Jilin" || garea_code == "Heilongjiang" || garea_code == "Hubei" 
	|| garea_code == "Hunan" || garea_code == "Guangdong" || garea_code == "Chongqing" || garea_code == "Sichuan" 
	|| garea_code == "Shanghai" || garea_code == "Anhui" || garea_code == "Fujian" || garea_code == "Tianjin" 
	|| garea_code == "Zhejiang" || garea_code == "Yunnan" || garea_code == "Trunk" || garea_code == "trunk"))
	{
		alert("不能修改含tr069的WAN连接");
		return false;
	}	
	if ((str.indexOf('VOICE') > 0) && (garea_code == "Sichuan"))
	{
		alert("不能修改含VOICE的WAN连接");
		return false;
	}	
	if ((str.indexOf('Other') > 0) && (garea_code == "Sichuan"))
	{
		alert("不能修改含Other的WAN连接");
		return false;
	}		
	return true;
}

function extraValidCheck()
{
	var wan_index = 0;
	var wan_session_index = 0;
	var wan_num;
	var str = $("#WanConnectName_select")[0].value;
	if ( $("#WanConnectName_select").val() != '0' ) //not new
	{
		wan_index = $("#WanConnectName_select").val().split(splitchar)[0];
		wan_session_index = $("#WanConnectName_select").val().split(splitchar)[1];
	}
	
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		var bindList = calcBindList();
		for ( var wan_num_i=0; wan_num_i< wan_num; wan_num_i++ )
		{
			var single_wan = all_wan_info.wan[wan_num_i];
			var saveBindListAarry = bindList.split(',');
			if ( ! (single_wan.wan_index == wan_index && single_wan.wan_session_index == wan_session_index) )
			{
				/*//检查是否有重复的vlan
				if ( getCheckbox("WanVlan_Enable") == 1 
					&& single_wan.vlanid == $("#WanVlanID_text").val() 
					&& single_wan.vlanid > 0 
					&& ((single_wan.ConnectionType == "IP_Routed" && $("#WanConnectMode_select").val() == connectModeAarry[0]) 
						|| (single_wan.ConnectionType == "PPPoE_Routed" && $("#WanConnectMode_select").val() == connectModeAarry[0])
						|| (single_wan.ConnectionType == "PPPoE_Bridged" && $("#WanConnectMode_select").val() == connectModeAarry[1])) )	
				{
					alert("已存在VLAN ID为" + $("#WanVlanID_text").val() + "的连接，请修改后重试");
					return false;
				}*/
				
				//只能有一条TR069/VOIP的wan
				if ( Math.pow(2,0) == ( $("#WanServiceList_select").val() & Math.pow(2,0) ) && single_wan.ServiceList.indexOf(serviceModesArray[0]) >=0 )
				{
					alert("已存在管理连接，请修改后重试");
					return false;
				}
				if ( Math.pow(2,1) == ( $("#WanServiceList_select").val() & Math.pow(2,1) ) && single_wan.ServiceList.indexOf(serviceModesArray[1]) >=0 )
				{
					alert("已存在语音连接，请修改后重试");
					return false;
				}
				
				//端口不能重复绑定
				if ( $("#port_div").is(":visible") && single_wan.LanInterface != '' && bindList != '' )
				{
					var wanBindListAarry = single_wan.LanInterface.split(',');
					for ( var i=0; i<= saveBindListAarry.length; i++ )
					{
						if ( saveBindListAarry[i] != undefined && saveBindListAarry[i] != '' )
						{
							for ( var j=0; j<= wanBindListAarry.length; j++ )
							{
								if ( wanBindListAarry[j] != undefined && wanBindListAarry[j] != '' )
								{
									if ( saveBindListAarry[i] == wanBindListAarry[j] )
									{
										alert("您绑定的端口和连接" + single_wan.Name + "有冲突，请修改后重试");
										return false;
									}
								}
							}
						}
					}
				}
			}
		}
	}

	if ((str.indexOf('TR069') > 0) && (garea_code == "Gansu" || garea_code == "Guizhou" || garea_code == "Jiangxi" 
	|| garea_code == "Jiangsu" || garea_code == "Jilin" || garea_code == "Heilongjiang" || garea_code == "Hubei" 
	|| garea_code == "Hunan" || garea_code == "Guangdong" || garea_code == "Chongqing" || garea_code == "Sichuan" 
	|| garea_code == "Shanghai" || garea_code == "Anhui" || garea_code == "Fujian" || garea_code == "Tianjin" 
	|| garea_code == "Zhejiang" || garea_code == "Yunnan" || garea_code == "Trunk" || garea_code == "trunk"))
	{
		alert("不能修改含tr069的WAN连接");
		return false;
	}		
	//alert(str);
	if ((str.indexOf('VOICE') > 0) && (garea_code == "Sichuan"))
	{
		alert("不能修改含VOICE的WAN连接");
		return false;
	}	
	if ((str.indexOf('Other') > 0) && (garea_code == "Sichuan"))
	{
		alert("不能修改含Other的WAN连接");
		return false;
	}		
	return true;
}
function saveApply()
{
	if( ! $("#broadband_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	if ( ! extraValidCheck() )
	{
		return;
	}
	
	var postdata = new Object();
	var action = '';
	var wanAddress = $("#WanAddress_select").val();
	var serviceList = $("#WanServiceList_select").val();
	var connectionMode = $("#WanConnectMode_select").val();		
	
	if ( $("#WanConnectName_select").val() == '0' )
	{
		action = "wan_add_new";
	}
	else
	{
		action = "wan_modify";
		var wan_num = $("#WanConnectName_select").val();
		postdata.wan_index = wan_num.split("_")[0];
		postdata.wan_session_index = wan_num.split("_")[1];
		postdata.wan_iporppp_old = getSingleWanInfo($("#WanConnectName_select").val()).iporppp;
	}
	
	if ( $("#WanAddress_select").val() == "IPoE" )
	{
		postdata.wan_iporppp_new = "1";
	}
	else
	{
		postdata.wan_iporppp_new = "2";
	}
	
	if ( getOperator() == "CM" )
	{
		if ( $("#WanConnectMode_select").val() == connectModeAarry[0] && $("#WanAddress_select").val() == "IPoE" )
		{
			postdata.ConnectionType = "IP_Routed";
		}
		else if($("#WanConnectMode_select").val() == connectModeAarry[0] && $("#WanAddress_select").val() == "PPPoE" )
		{
			postdata.ConnectionType = "PPPoE_Routed";
		}
		else if($("#WanConnectMode_select").val() == connectModeAarry[1] && $("#WanAddress_select").val() == "IPoE" )
		{
			postdata.ConnectionType = "IP_Bridged";
		}		
		else if($("#WanConnectMode_select").val() == connectModeAarry[1] && $("#WanAddress_select").val() == "PPPoE" )
		{
			postdata.ConnectionType = "PPPoE_Bridged";
		}		
	}
	else
	{
		if ( $("#WanConnectMode_select").val() == connectModeAarry[0] )
		{
			postdata.ConnectionType = "IP_Routed";
			/*if ($("#WanAddress_select").val() == "IPoE")
			{
				postdata.ConnectionType = "IP_Routed";
			}
			else
			{
				postdata.ConnectionType = "PPPoE_Routed";
			}*/
			
		}
		else
		{
			postdata.ConnectionType = "PPPoE_Bridged";
		}
	}
	var selectListValue = $("#WanServiceList_select").val();
	var ServiceList = '';
	for ( var i=0; i<serviceModesArray.length; i++ )
	{
		var j = Math.pow(2, i);
		if ( j == (j & selectListValue) )
		{
			if ( ServiceList == '' )
			{
				ServiceList = serviceModesArray[i];
			}
			else
			{
				ServiceList += ',' + serviceModesArray[i];
			}
		}
	}
	postdata.ServiceList = ServiceList;
	
	postdata.IPMode = $("#WanIP_Mode_select").val();
	
	postdata.mtu = $("#WanMTU_text").val();
	if ( getOperator() == "CU" )
	{
		if ( $("#WanVlan_Enable").attr("checked") )
		{
			postdata.VLANEnabled = 1;
			postdata.vlanid = $("#WanVlanID_text").val();
		}
		else
		{
			postdata.VLANEnabled = 0;
			postdata.vlanid = 0;
		}
	}
	else if ( getOperator() == "CM" )
	{
		if ( $("#WanVlan_Enable").attr("checked") )
		{
			postdata.VLANEnabled = 2;
			postdata.vlanid = $("#WanVlanID_text").val();
		}
		else
		{
			postdata.VLANEnabled = 0;
			postdata.vlanid = 0;
		}
	}	
	else
	{
		if ( $("#WanVlan_Enable").attr("checked") )
		{
			postdata.vlanid = $("#WanVlanID_text").val();
		}
		else
		{
			postdata.vlanid = 0;
		}
	}
	postdata.p8021 = $("#Wan_802_1_P_select").val();
	
	postdata.LanInterface = calcBindList();
	
	if ( $("#WanAddress_select").val() == "IPoE" )
	{
		if ( $("#WanIP_Mode_select").val() == v4V6ModeAarry[1] ) //ipv6
		{
			if ( $("#WanIPv6Address_select").val() == ipv6AddressArray[2] ) //Static
			{
				postdata.AddressingType = addressTypeArray[1]; //Static
			}
			else
			{
				postdata.AddressingType = addressTypeArray[0]; //DHCP
			}
		}
		else //v4&v6 ipv4 以ipv4的为准
		{
			postdata.AddressingType = $("#WanIPv4Address_select").val();
		}
	}
	else
	{
		postdata.AddressingType = addressTypeArray[2]; //PPPoE
	}
	
	if ( $("#IPv4_Address_Static_Settings").is(":visible") )
	{
		postdata.ExternalIPAddress = $("#WanIPv4Address_text").val();
		postdata.SubnetMask = $("#WanSubmask_text").val();
		postdata.DefaultGateway = $("#WanGateway_text").val();
		
		if ( $("#WanSec_DNS_text").val() == '' )
		{
			postdata.DNSServers = $("#WanPri_DNS_text").val();
		}
		else
		{
			postdata.DNSServers = $("#WanPri_DNS_text").val() + ',' + $("#WanSec_DNS_text").val();
		}
	}
	
	if ( $("#Address_PPPoE_Setting").is(":visible") )
	{
		postdata.Username = $("#WanUserName_text").val();	
		postdata.WPd = fhencrypt($("#POED").val());	
		postdata.ConnectionTrigger = $("#dialMode_select").val();
		if ( $("#dialMode_select").val() == 'OnDemand' )
		{
			postdata.IdleDisconnectTime = $("#idleDisconnectTime_text").val();
		}
	}

	if (wanAddress == 'PPPoE' && connectionMode == 'route' && (serviceList == 4 || serviceList == 5 || serviceList == 6 || serviceList == 7))
	{
		if ( document.getElementById('WanProxyEnable_text').checked == true )
		{
			postdata.pppProxyEnable = "1";
			postdata.pppMAXUser = $("#WanMAXUser_text").val();			
		}
		else
		{
			//alert(postdata.pppMAXUserset);
			postdata.pppProxyEnable = "0";
		}
	}
	else
	{
		postdata.pppProxyEnable = 'NULL';
		postdata.pppMAXUser = 'NULL';
	}
	if (wanAddress == 'PPPoE' && connectionMode == 'route')
	{
		if(document.getElementById('BROADBUND_ppptobridge').checked == true )
		{
			postdata.pppToBridge = "1";		
		}
		else
		{
			postdata.pppToBridge = "0";	
		}	
	}
	else
	{
		postdata.pppToBridge = 'NULL';
		postdata.pppToBridge = 'NULL';
	}		
	
	if ( $("#WanIP_Mode_select").val() == v4V6ModeAarry[1] 
		|| $("#WanIP_Mode_select").val() == v4V6ModeAarry[2] )
	{
		if ( $("#WanPrefix_checkbox").attr('checked') )
		{
			postdata.IPv6PrefixDelegationEnabled = 1;
		}
		else
		{
			postdata.IPv6PrefixDelegationEnabled = 0;
		}
		
		postdata.IPv6PrefixOrigin = $("#WanPrefix_select").val();
		if ( $("#WanPrefix_select").val() == 'Static' )
		{
			postdata.IPv6Prefix = $("#WanIPv6Address_Pre_text").val();
		}
	
		postdata.IPv6IPAddressOrigin = $("#WanIPv6Address_select").val();
		if ( $("#WanIPv6Address_select").val() == ipv6AddressArray[2] ) //Static
		{
			postdata.IPv6IPAddress = $("#WanIPv6Address_text").val();
			postdata.DefaultIPv6Gateway = $("#WanIPv6_Gateway_text").val();
			if ( $("#WanIPv6Sec_DNS_text").val() == '' )
			{
				postdata.IPv6DNSServers = $("#WanIPv6Pri_DNS_text").val();
			}
			else
			{
				postdata.IPv6DNSServers = $("#WanIPv6Pri_DNS_text").val() + ',' + $("#WanIPv6Sec_DNS_text").val();
			}
		}
	}
	
	if ( $("#IPv6_Dslite_Settingstotal").is(":visible") )
	{
		if ( $("#WanDslite_checkbox").attr('checked') )
		{
			postdata.Dslite_Enable = 1;
			if ( $("#aftr_checkbox").attr('checked') )
			{
				postdata.AftrMode = 1;
				postdata.Aftr = $("#aftr_text").val();
			}
			else
			{
				postdata.AftrMode = 0;
			}
		}
		else
		{
			postdata.Dslite_Enable = 0;
		}
	}
	else
	{
		postdata.Dslite_Enable = 0;
	}
	
	//route ipv4/ipv4v6 internet
	if ( ($("#WanConnectMode_select").val() == connectModeAarry[0] )
		&& ( $("#WanIP_Mode_select").val() == v4V6ModeAarry[0] || $("#WanIP_Mode_select").val() == v4V6ModeAarry[2])
		&& ( 4 == (4 & selectListValue) || 8 == selectListValue || selectListValue>=16) )
	{
			postdata.NATEnabled = "1";
	}
	else
	{
		postdata.NATEnabled = "0";
	}
	postdata.sessionid = sessionidstr;
	XHR.post(action, postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function enableProxy()
{
	var enable = $("#WanProxyEnable_text").attr('checked');
	
	if (enable)
	{
		document.getElementById('PROXY_Set').style.display = '';
	}
	else
	{
		document.getElementById('PROXY_Set').style.display = 'none';
	}
}

function deleteWan()
{
	if ( ! deleteValidCheck() )
	{
		return;
	}
	if ( confirm("您真的要删除该条连接么？") == true )
	{
		var postdata = new Object();
		// postdata.action = "wan_delete";
		var wan_num = $("#WanConnectName_select").val();
		postdata.wan_index = wan_num.split("_")[0];
		postdata.wan_session_index = wan_num.split("_")[1];
		postdata.wan_iporppp_old = getSingleWanInfo($("#WanConnectName_select").val()).iporppp;
		//fiberlog(postdata);
		selectwan = '';
		postdata.sessionid = sessionidstr;
		XHR.post("wan_delete", postdata, initPage);
		showOrHideLoadingWindowFromIframe("show");
	}
}

function calcBindList()
{
	var bindlist = '';
	if ( $("#port_div").is(":visible") )
	{
		for ( var i=0; i<portbind_num; i++ )
		{
			var bindstr = '';
			var portnumber = '';
			if ( $("input[name='portbind']:eq(" + i + ")").attr('checked') )
			{
				if ( i < lanportbind_num )
				{
					portnumber = i + 1;
					bindstr = bindListLanHead + portnumber;
				}
				else
				{
					portnumber = $("input[name='portbind']:eq(" + i + ")").attr('value');
					portnumber = parseInt(portnumber) + 1;
					bindstr = bindListWifiHead + portnumber;
				}
			}
			
			if ( bindstr != '' )
			{
				if ( bindlist == '' )
				{
					bindlist = bindstr;
				}
				else
				{
					bindlist += ',' + bindstr;
				}
			}
		}
	}
	
	return bindlist;
}