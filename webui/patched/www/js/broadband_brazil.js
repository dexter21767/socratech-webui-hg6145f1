var sessionidstr = "";
var all_wan_info = '';
var selectwan = '';
var login_user = gLoginUser;
var operator_name = gOperatorName;
var splitchar = '_';
var connect_flag;
var bindListLanHead = "dev.eth.";
var bindListWifiHead = "dev.wla.";



var v4V6ModeAarry = new Array('1', '2', '3');
var ipv4ModeHTML = "<option value='1'>IPv4</option>";
var ipv6ModeHTML = "<option value='2'>IPv6</option>";
var ipv4AndIPv6ModeHTML = "<option value='2'>IPv6</option><option value='3'>IPv4&IPv6</option>";
//var ipv4AndIPv6ModeHTML_brazil_claro = "<option value='2'>IPv6</option><option value='3'>IPv4&IPv6</option>";
var serviceModesArray = new Array('TR069', 'VOIP', 'INTERNET', 'OTHER', "SPECIAL_SERVICE_1", "SPECIAL_SERVICE_2", "SPECIAL_SERVICE_3", "SPECIAL_SERVICE_4"); //1 2 4 8 16 32 64 128
var service_modes_new_array = new Array('TR069', 'VOIP', 'TR069,VOIP', 'INTERNET', "TR069,INTERNET", "VOIP,INTERNET", "TR069,VOIP,INTERNET", "MULTICAST", "IPTV", "COMMUNITY","OTHER"); 
//var serviceModesArray = new Array('TR069', 'VOIP', 'INTERNET', 'OTHER'); //1 2 4 8



var connectModeAarry = new Array('route', 'bridge');
//IPoE和PPPoE下的ipv4 address的值无重叠部分，所以不加
var addressTypeArray = new Array('DHCP', 'Static', 'PPPoE');
var ipoeIPv4AddressHTML = "<option value='DHCP'>DHCP</option><option value='Static'>Static</option>";
var pppoeIPv4AddressHTML = "<option value='PPPOE'>PPPoE</option>";

var ipv6AddressArray = new Array('AutoConfigured', 'DHCPv6', 'Static', 'None');
var ipoeIPv6AddressHTML = "<option value='AutoConfigured'>AutoConfigured</option><option value='DHCPv6'>DHCPv6</option><option value='Static'>Static</option>";
var ipoeIPv6AddressHTML_Auto = "<option value='AutoConfigured'>AutoConfigured</option><option value='DHCPv6'>DHCPv6</option>";
var ipoeIPv6AddressHTML_STATIC = "<option value='Static'>Static</option>";
var pppoeIPv6AddressHTML = "<option value='AutoConfigured'>AutoConfigured</option><option value='DHCPv6'>DHCPv6</option>";


//var ipv6PrefixTypeArray = new Array('PrefixDelegation', 'Static', 'PPPOE', 'None');
//var ipoeIPv6PrefixTypeHTML = "<option value='PrefixDelegation'>Prefix Delegate</option><option value='Static'>Static</option><option value='None'>None</option>";
var ipv6PrefixTypeArray = new Array('PrefixDelegation','PPPOE','Static','None');
var pppoeIPv6PrefixTypeHTML = "<option value='PrefixDelegation'>Prefix Delegate</option><option value='PPPOE'>PPPoE</option>";
var ipoeIPv6PrefixTypeHTML = "<option value='PrefixDelegation'>Prefix Delegate</option><option value='Static'>Static</option>";

var portbind_num;
var lanportbind_num;
var wifiportbind_num;
var garea_code;
var wifi_5g_enable;
var addflag = "edit";

var tr69_wan_modify_enable = 1; //default 

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
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
	
	$("#WanConnectName_select").bind("change", function(){
		selectWanChange();
	});
	
	$("#WanAddress_select").bind("change", function(){
		initIPorPPPInnerHTML();
		//initServiceList();
	});
	
	$("#WanConnectMode_select").bind("change", function(){// route 、bridge
		initServiceList();
	});
	
	$("#WanServiceList_select").bind("change", function(){ //tr069 、 internet
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
	}
	else
	{
		XHR.get("vlanbind", null, constructWifiPortHtml);
	}
	
	portbind_num = $("input[name='portbind']").length;
	lanportbind_num = $(".lanport").length;
	wifiportbind_num = $(".wifiport").length;
	
	//泰国TRUE，普通用户登录时该页面所有下拉框、输入框不可编辑
	
	
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
			"Wan_802_1_P_select": {required: true, range_int:[0,7]},
			"WanVlanID_text": {required: true, range_int:[0,4095]},
			"WanUserName_text": {required: true},
			"POED": {required: true, nocn: true},
			"idleDisconnectTime_text": {required: true, range_int:[0,65535]},
			"WanIPv4Address_text": {required: true, ipv4: true},
			"WanSubmask_text": {required: true, ipv4: true},
			"WanGateway_text": {required: true, ipv4: true},
			"WanPri_DNS_text": {required: true, ipv4: true},
			"WanSec_DNS_text": {ipv4: true},
            "WanIPv6Address_Pre_text": {required: true, ipv6_mask:true},
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
		alert("get_wifi_port_bind_failed".i18n());
		return false;
	}
	
	if ( data.wifi_5g_enable != undefined )
	{
		wifi_5g_enable = data.wifi_5g_enable;
	}	
	
	gWifiData = data;
}

function checkShowHideElement()
{
	if ( $("#WanAddress_select").val() == "PPPoE" && $("#WanConnectMode_select").val() == "route" )
	{
		$("#Address_PPPoE_Setting").show();
		if($("#dialMode_select").val() == 'OnDemand')
		{
			$("#manual_mode").hide();
			$("#keep_alive_mode").show();
			$("#idleDisconnectTime_Setting").show();
		}
		else if($("#dialMode_select").val() == 'Manual')
		{
			$("#keep_alive_mode").hide();
			$("#idleDisconnectTime_Setting").hide();
			$("#manual_mode").show();
		}	
		else
		{
			$("#manual_mode").hide();
			$("#keep_alive_mode").show();
			$("#idleDisconnectTime_Setting").hide();
		}
	}
	else
	{
		$("#Address_PPPoE_Setting").hide();
	}
	

	if ( $("#WanServiceList_select").val() == '1' || $("#WanServiceList_select").val() == '2' || $("#WanServiceList_select").val() == '3' )
	{
		$("#port_div").hide();
		$("#WanIP_Mode").show();
		$("#nat_dns_mtu_div").hide();
	}
	else if( $("#WanServiceList_select").val() == '4' || $("#WanServiceList_select").val() == '5' 
			|| $("#WanServiceList_select").val() == '6' || $("#WanServiceList_select").val() == '7' 
			||  $("#WanServiceList_select").val() == '10')
	{
		$("#WanIP_Mode").show();
		$("#nat_dns_mtu_div").show();
		$("#port_div").show();
	}
	else if ( $("#WanServiceList_select").val() == '8' || $("#WanServiceList_select").val() == '9' || $("#WanServiceList_select").val() == '11' )
	{
		$("#port_div").show();
		$("#WanIP_Mode").show();
		$("#nat_dns_mtu_div").hide();
	}
	
	//2020年3月15日 fengshuo修改，ipv6前缀获取方式只有在带有internet属性时，才可开启。
	if( $("#WanServiceList_select").val() == '4' || $("#WanServiceList_select").val() == '5'|| $("#WanServiceList_select").val() == '6' || $("#WanServiceList_select").val() == '7' )
	{
		$("#WanPrefix_checkbox").removeAttr("disabled");
	}
	else
	{
		$("#WanPrefix_checkbox").prop("checked", false); //其他情况下不获取前缀，并且使其不可选
		$("#WanPrefix_checkbox").attr("disabled", true);
	}
	//2019-12-31 se确认，lxg 商讨，确认将ipv6的dhcp、静态、pppoe获取单独出来。
	if ($("#wan_connect_mode_select_v4").val() == 'Static')//针对ipv4的方案设计
	{
		$("#dhcp_list_title_value").html("IPV4 " + "wan_static_mode".i18n());//标题更改

		$("#IPv4_Address_Static_Settings").show();
		
		$("#option60_setting").hide();
	
	}
	else if($("#wan_connect_mode_select_v4").val() == 'DHCP')//选中dhcp模式时，ipv4地址配置方式隐藏
	{
		$("#dhcp_list_title_value").html("IPV4 " + "wan_dhcp_mode".i18n());//标题更改

		$("#IPv4_Address_Static_Settings").hide();
		//2020-3-6 与lxg商讨，增加option60 选项的显示控制
		$("#option60_setting").show();

		// $("#WanIPv4Address_text").attr("disabled", "true");
		// $("#WanSubmask_text").attr("disabled", "true");
		// $("#WanGateway_text").attr("disabled", "true");
		// $("#WanPri_DNS_text").attr("disabled", "true");
		// $("#WanSec_DNS_text").attr("disabled", "true");
	}
	else if($("#wan_connect_mode_select_v4").val() == 'PPPOE')
	{
		$("#dhcp_list_title_value").html("IPV4 " + "wan_pppoe_mode".i18n());//标题更改
		$("#IPv4_Address_Static_Settings").hide();
		$("#option60_setting").hide();
		// $("#WanIPv4Address_text").attr("disabled", "true");
		// $("#WanSubmask_text").attr("disabled", "true");
		// $("#WanGateway_text").attr("disabled", "true");
		// $("#WanPri_DNS_text").attr("disabled", "true");
		// $("#WanSec_DNS_text").attr("disabled", "true");
	}
	
	if($("#WanIPv6Address_select").val() == 'Static')
	{
		$("#IPv6_Address_Static_Settings").show();	
		$("#ipv6_list_title_value").html("IPV6 " + "wan_static_mode".i18n());//标题更改
	}
	else
	{
		$("#IPv6_Address_Static_Settings").hide();
		$("#ipv6_list_title_value").html("IPV6");//标题更改
	}

	if ( $("#WanPrefix_checkbox").attr('checked'))
	{
		$("#IPv6_Address_Prefix_Type_Tr").show();
	}
	else
	{
		$("#IPv6_Address_Prefix_Type_Tr").hide();
	}
	
	if ($("#WanPrefix_checkbox").attr('checked') && $("#WanPrefix_select").val() == 'Static'  )
	{
		$("#IPv6_Address_Prefix_Tr").show();
	}
	else
	{
		$("#IPv6_Address_Prefix_Tr").hide();
	}
	
	// if($("#WanPrefix_select").val() == 'Static'){
	// 	$("#WanIPv6Address_select").html(ipoeIPv6AddressHTML_STATIC);
	// }
	// else if($("#WanPrefix_select").val() == 'PrefixDelegation'){
	// 	$("#WanIPv6Address_select").html(ipoeIPv6AddressHTML_Auto);
	// }
	
	if ( $("#WanConnectMode_select").val() == 'route' )
	{
		if ( $("#WanIP_Mode_select").val() == '1' ) //ipv4
		{
			$("#IPv4_Settings").show();
			$("#IPv6_Settings").hide();
			$("#ipv4_list_title_div").show();
			$("#ipv6_list_title_div").hide();
			$("#nat_setting").show();//ipv4 时，可以配置nat
		}
		else if ( $("#WanIP_Mode_select").val() == '2' ) //ipv6
		{
			$("#IPv4_Settings").hide();
			$("#IPv6_Settings").show();
			$("#ipv4_list_title_div").hide();
			$("#ipv6_list_title_div").show();
			$("#nat_setting").hide();//ipv6 时，不可以配置nat
		}
		else
		{
			$("#IPv4_Settings").show();
			$("#IPv6_Settings").show();
			$("#ipv4_list_title_div").show();
			$("#ipv6_list_title_div").show();
			$("#nat_setting").show();
		}
	}
	else
	{
		$("#IPv4_Settings").hide();
		$("#IPv6_Settings").hide();
		//$("#port_div").hide();
		//$("#lan_ports").show();
		
		$("#wifi_ports_div1").hide();
		$("#wifi_ports_div2").hide();
		$("#WanIP_Mode").hide();
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
	// 2019-11-02 fengshuo 使得dslite隐藏不使用

	$("#IPv6_Dslite_Settingstotal").hide();
		
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
	
	if(login_user =="0" && operator_name == "BZ_CLARO"){
		$("#wan_address").hide();
		$("#VLAN_Setting").hide();
		$("#priority_setting").hide();
		$("#nat_dns_mtu_div").hide();
		$("#PROXY_Setting").hide();
		$("#port_div").hide();
		$("#connect_mode_div").hide();
	}
}

function initPage(getdata)
{
	if(login_user =="1" && operator_name == "BZ_CLARO"){
		$("#add").attr("style","display:block:");
	}
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
		// modify by fengshuo 经se同意，放开对tr069控制的限制
		// if ( getdata.tr69wan_modify != undefined )
		// {
		// 	tr69_wan_modify_enable = getdata.tr69wan_modify;
		// }
	}
	
	//初始化wan连接名称
	initConnectName();
	//初始化IP模式
	initIpProtocol();
	//根据封装类型初始化配置项的内容
	initIPorPPPInnerHTML();
	//根据连接模式初始化业务类型列表
	initServiceList();
	
	displayTableHtml();

	if(getdata.wan && getdata.wan.length > 0)
	{
		var value_temp = $("#WanConnectName_select").val();
		displayFormHtml("init",value_temp);
	}
	else
	{
		$("#broadband_form").hide();
		//displayFormHtml("init","0");
	}
	//selectWanChange();
	
	checkWifiEnable();
	if(login_user =="0" && operator_name == "BZ_CLARO"){
		$("#wan_address").hide();
		$("#VLAN_Setting").hide();
		$("#priority_setting").hide();
		$("#nat_dns_mtu_div").hide();
		$("#PROXY_Setting").hide();
		$("#port_div").hide();
		$("#connect_mode_div").hide();
	}
	
	if(wifi_5g_enable == 1)
	{
		$("#lantext1").html("wifi_5g_gbit_port1".i18n());
		$("#lantext2").html("wifi_5g_itv".i18n());
		$("#lantext3").html("wifi_5g_gbit_port3".i18n());
		$("#lantext4").html("wifi_5g_gbit_port4".i18n());
	}
	else
	{	
		$("#lantext1").html("wifi_gbit_port".i18n());
		$("#lantext2").html("wifi_iTV".i18n());
		$("#lantext3").html("wifi_100m_port2".i18n());
		$("#lantext4").html("wifi_100m_port3".i18n());	
	}
	//底色显示
	$("#internet_list").children().eq(0).children().css("background-color","#b7e3e3");
	$("#internet_list").children().eq(0).siblings().children().css("background-color","#eef2f6");
	$("#internet_list").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

}

//显示列表内容
function displayTableHtml() //动态给列表赋值显示后端传来的数据内容
{   
    var num = 1;
    var ip_mode = '';
    var dynamicClsListHTML = '';
    for (var m = 0; m < all_wan_info.wan.length; m++)
    {
        var n = m + 1;
        var single =all_wan_info.wan[m];
		if(login_user =="0" && operator_name == "BZ_CLARO"){
			if(single.ServiceList == "INTERNET")
			{
				var wan_name_value = single.wan_index + '_' + single.wan_session_index + '_' + single.iporppp + '_' + single.Name;//拼接wan的value给
				dynamicClsListHTML += '<tr id="outtable_'+m+'" style="cursor: pointer;" onclick="Showthisinfo(this.id)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center">'+ n +'</td>';
				dynamicClsListHTML += '<td align="center">' + single.Name + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.vlanid +'/'+ single.p8021 +'</td>';
				if("1" == single.IPMode)
				{
					ip_mode = "IPv4";
				}
				else if("2" == single.IPMode)
				{
					ip_mode = "IPv6";
				}
				else if("3" == single.IPMode)
				{
					ip_mode = "IPv4&IPv6";
				}
				dynamicClsListHTML += '<td align="center">' + ip_mode + '</td>';
				dynamicClsListHTML += '<td align="center"><input type="checkbox" class="delselwan" value="'+ wan_name_value +'"></td>';
				dynamicClsListHTML += '</tr>';
			}
		}	
		else{
			
				var wan_name_value = single.wan_index + '_' + single.wan_session_index + '_' + single.iporppp + '_' + single.Name;//拼接wan的value给
				dynamicClsListHTML += '<tr id="outtable_'+m+'" style="cursor: pointer;" onclick="Showthisinfo(this.id)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center">'+ n +'</td>';
				dynamicClsListHTML += '<td align="center">' + single.Name + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.vlanid +'/'+ single.p8021 +'</td>';
				if("1" == single.IPMode)
				{
					ip_mode = "IPv4";
				}
				else if("2" == single.IPMode)
				{
					ip_mode = "IPv6";
				}
				else if("3" == single.IPMode)
				{
					ip_mode = "IPv4&IPv6";
				}
				dynamicClsListHTML += '<td align="center">' + ip_mode + '</td>';
				dynamicClsListHTML += '<td align="center"><input type="checkbox" class="delselwan" value="'+ wan_name_value +'"></td>';
				dynamicClsListHTML += '</tr>';
			
		}
		
    }
    $("#internet_list").html(dynamicClsListHTML);
	$("#internet_list tr:eq(0)").click();
}

function Showthisinfo(element) //选中当前行并改变背景色
{
    addflag = "edit";
    $("#add_item").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    var index = element.split("_")[1];
    var single_wan = all_wan_info.wan[index];
    var wan_name_value = single_wan.wan_index + '_' + single_wan.wan_session_index + '_' + single_wan.iporppp + '_' + single_wan.Name;//拼接wan的value给
	var mode = "old";
    selfilterIndex = parseInt(index)+1;
    displayFormHtml(mode,wan_name_value);
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
			}else{
				$("#Wan_SSID_checkbox" + i).attr("disabled", false);
			}
		}
		continue;
	}
}

function displayFormHtml(mode,wan_name)
{
	$("#broadband_form").show();
	$(".main_item_error_hint").each(function (i){
		$(this).hide();
	});

	selectwan = wan_name;
	
	$("#WanConnectName_select option").each(function (){
		
		if(selectwan == this.value)
		{	
			$("#WanConnectName_select").val(selectwan);
		}
	})
	if( mode == "init" && selectwan == "0")
	{
		//addfilter();
		loadNewWan();
	}
	else
	{
		var select_wan_info = getSingleWanInfo(selectwan);
		if ( select_wan_info != '' )
		{
			loadSpecifiedWan(select_wan_info);
		}
	}
	checkShowHideElement();
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
		if ( select_wan_info != '' )
		{
			loadSpecifiedWan(select_wan_info);
		}
	}
	
	checkShowHideElement();
}

function getSingleWanInfo(selectwan_index)
{
    var select_wan_index = selectwan_index.split(splitchar)[0];
    var select_wan_session_index = selectwan_index.split(splitchar)[1];
    var select_iporppp = selectwan_index.split(splitchar)[2];
	var wan_num = all_wan_info.wan.length;
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


//加载新增WAN连接的参数，并配置默认值
function loadNewWan()
{
	$("#WanAddress_select").val("IPoE");//封装类型默认选择IPoE
	initIPorPPPInnerHTML();
	
	$("#WanConnectMode_select").val(connectModeAarry[0]);//连接模式默认选择路由
	initServiceList();
	
	$("#WanServiceList_select").val(4); //业务类型默认选择上网-internet
	
	//v4V6ModeAarry is "1_2_3";
	$("#WanIP_Mode_select").val(v4V6ModeAarry[0]);//IP模式默认选择IPv4	
	
	//默认禁用VLAN
	$("#WanVlan_Enable").prop("checked", true);
	$("#WanVlanID_text").val('');
	
	$("#Wan_802_1_P_select").val('0');//优先级默认设置
	
	unCheckAllBindPorts();//去除所有端口绑定
	
	// IPv4信息
	// addressTypeArray is ('DHCP', 'Static', 'PPPoE')
	$("#wan_connect_mode_select_v4").val(addressTypeArray[0]);//默认选择DHCP
	clearIpv4StaticIpInfo();
	clearPPPoEInfo();
	
	// IPv6信息
	//2020-03-15 fengshuo 与lxg要求，ipv6默认不获取前缀
	$("#WanPrefix_checkbox").prop("checked", false); //默认获取前缀
	
	// ipv6PrefixTypeArray is ('PrefixDelegation', 'Static', 'PPPoE', 'None');
	//$("#WanIPv6Address_Pre_text").val(ipv6PrefixTypeArray[0]);
	$("#WanIPv6Address_Pre_text").val('');
	//ipv6DNS配置暂缺
	$("#WanIPv6Address_select").val(ipv6AddressArray[1]);
	clearIpv6StaticIpInfo();
	$("#WanDslite_checkbox").prop("checked", false);
	$("#aftr_checkbox").prop("checked", false);
	$("#aftr_text").val('');
	
	//tr069 wan不能修改，part 2有待确认，这里是否保留
	$("#save_button, #delete_button").removeAttr("disabled");
	$("#save_button, #delete_button").removeClass("input_button_disabled");
	$("#tr69_wan_hint").hide();
}

function setCheck(ajaxObject, ischecked)//设置函数是否选中
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

//加载具体的wan 连接
function loadSpecifiedWan(select_wan_info)
{
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

	for ( var i=0; i< service_modes_new_array.length; i++ )
	{
		if(select_wan_info.ServiceList == service_modes_new_array[i])
		{
			selectListValue = i;//选择当前的service list
		// modify by fengshuo 经SE同意，放开对TR069控制的限制
		// if ( i == 0 )
	 	// 	{
			// 	isTr69Wan = 1;
	 	// 	}
		}
	}	

	$("#WanServiceList_select").val(selectListValue + 1);
	
	$("#WanIP_Mode_select").val(select_wan_info.IPMode);
	
	$("#WanMTU_text").val(select_wan_info.mtu);

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
	
	$("#Wan_802_1_P_select").val(select_wan_info.p8021);
	$("#nat_select").val(select_wan_info.NATEnabled);
	
	var bindlist = select_wan_info.LanInterface;
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
	$("#wan_connect_mode_select_v4").val(select_wan_info.AddressingType);//IPOE模式
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
	else if (select_wan_info.AddressingType == addressTypeArray[0])//20200306 fengshuo 修改 option60显示
	{
		clearIpv4StaticIpInfo();
		if(operator_name == "BZ_CLARO" && select_wan_info.option60_enable == 1 && $("#option60_setting").is(":visible"))
		{
			$("#option60_text").val(select_wan_info.option60_value);
		}
		else if(operator_name == "BZ_CLARO" && select_wan_info.option60_enable == 0 && $("#option60_setting").is(":visible"))
		{
			$("#option60_text").val("");
		}
	}
	if (select_wan_info.AddressingType == addressTypeArray[2])//PPPOE模式
	{
		//填充pppoe信息
		$("#WanUserName_text").val(select_wan_info.Username);
		$("#POED").val(select_wan_info.Password);
		$("#dialMode_select").val(select_wan_info.ConnectionTrigger);
		$("#idleDisconnectTime_text").val(select_wan_info.IdleDisconnectTime);
		if(select_wan_info.X_FH_AutoConnection == 1)
		{
			$("#connect_button").addClass("select_button");
		}
		else if(select_wan_info.X_FH_AutoConnection == 2)
		{
			$("#disconnect_button").addClass("select_button");
		}
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
		$("#WanIPv6Address_Pre_text").val('');
		//$("#WanPrefix_select").val('NULL');
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
	
	//tr069 wan不能修改，part 1 有待确认，这里是否保留
	//modify by fengshuo 20191211 SE同意，放开对tr069编辑的控制限制，可以修改tr069
	// if ( isTr69Wan == 1 && tr69_wan_modify_enable == 0 )
	// {
	// 	$("#save_button, #delete_button").attr("disabled", "disabled");
	// 	$("#save_button, #delete_button").addClass("input_button_disabled");
	// 	$("#tr69_wan_hint").show();
	// }
	// else
	// {
		$("#save_button, #delete_button").removeAttr("disabled");
		$("#save_button, #delete_button").removeClass("input_button_disabled");
		$("#tr69_wan_hint").hide();
	//}

}

//清空文本框的内容
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
	var ipoeConnectModeHTML = "<option value='route'>" + "ipoe_route".i18n()+"</option><option value='bridge'>"+"ipoe_bridge".i18n()+"</option>";
	var pppoeConnectModeHTML = "<option value='route'>" + "pppoe_route".i18n() + "</option><option value='bridge'>" + "pppoe_bridge".i18n() + "</option>";
	
	//fiberlog("in initIPorPPPInnerHTML");
	if ( $("#WanAddress_select").val() == "IPoE" )
	{
		$("#WanPrefix_select").html(ipoeIPv6PrefixTypeHTML);
		$("#wan_connect_mode_select_v4").html(ipoeIPv4AddressHTML);
		$("#WanConnectMode_select").html(ipoeConnectModeHTML);
		$("#WanIPv6Address_select").html(ipoeIPv6AddressHTML);
		$("#WanMTU_text").val('1500'); //IPoE默认MTU为1500	
	}
	else
	{
		$("#WanPrefix_select").html(pppoeIPv6PrefixTypeHTML);
		$("#wan_connect_mode_select_v4").html(pppoeIPv4AddressHTML);
		$("#WanConnectMode_select").html(pppoeConnectModeHTML);
		$("#WanIPv6Address_select").html(pppoeIPv6AddressHTML);
		$("#WanMTU_text").val('1492'); //PPPoE默认MTU为1492				
	}
}

function initServiceList()
{
	var addressType =  $("#WanAddress_select").val();
	var connectionType = $("#WanConnectMode_select").val();
	var serviceList = $("#WanServiceList_select").val();
	var routeServiceListHTML = "<option value='1'>"+"route_option_tr069".i18n() + 
			"</option><option value='2'>" + "route_option_voip".i18n() +
			"</option><option value='3'>" + "route_option_tr069_voip".i18n() +
			"</option><option value='4'>" + "route_option_internet".i18n()+ 
		"</option><option value='5'>" + "route_option_tr069_internet".i18n() +
		"</option><option value='6'>" + "route_option_voip_internet".i18n() +
		"</option><option value='7'>" + "route_option_tr069_voip_internet".i18n() +
		"</option><option value='8'>" + "route_option_multicast".i18n() +
		"</option><option value='9'>" + "route_option_iptv".i18n() +
		"</option><option value='10'>" + "route_option_community".i18n() +
		"</option><option value='11'>" + "route_option_other".i18n() + "</option>";//路由模式是否需要其它？
	var bridgeServiceListHTML = "<option value='4'>" + "bridge_option_internet".i18n() + "</option><option value='8'>" + "route_option_multicast".i18n() +
		"</option><option value='11'>" + "bridge_option_other".i18n() + "</option>";
		
	if(login_user =="0" && operator_name == "BZ_CLARO"){
			var routeServiceListHTML = "<option value='4'>" + "route_option_internet".i18n()+ 
		"</option>";
		}
	
	if ($("#WanConnectMode_select").val() == "route")
	{
		$("#WanServiceList_select").html(routeServiceListHTML);
		$("#WanServiceList_select").val(4);
		$("#nat_setting").show();
		$("#dns_relay_setting").show();
		$("#mtu_setting").show();
		$("#WanIP_Mode").show();
		$("#wan_connect_mode").show();
		$("#dhcp_list_title").show();
		$("#wan_address").show();
		if ( $("#WanAddress_select").val() == "IPoE" )
		{
			$("#WanMTU_text").val('1500');		
		}
		else
		{
			$("#WanMTU_text").val('1492');		
		}
	}
	else//桥接模式下的页面显示
	{
		$("#WanServiceList_select").html(bridgeServiceListHTML);
		$("#nat_setting").hide();
		$("#dns_relay_setting").hide();
		$("#mtu_setting").hide();
		$("#WanIP_Mode").hide();
		$("#wan_connect_mode").hide();
		$("#dhcp_list_title").hide();
		$("#wan_address").hide();

		$("#WanMTU_text").val('1500');

	}
	
	document.getElementById('PROXY_Setting').style.display = 'none';
	document.getElementById('pppToBridgeId').style.display = 'none';
}

function secServiceList()
{
	var addressType =  $("#WanAddress_select").val();
	var connectionType = $("#WanConnectMode_select").val();
	var serviceList = $("#WanServiceList_select").val();	
	document.getElementById('PROXY_Setting').style.display = 'none';	
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
	dynamicHtml += '<option value="0">'+"add_new_wan_connection".i18n()+'</font></option>';
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

function deleteValidCheck(str)
{	
	if ((str.indexOf('VOICE') > 0) && (garea_code == "Sichuan"))
	{
		alert("modify_voice_alert".i18n());
		return false;
	}	
	if ((str.indexOf('Other') > 0) && (garea_code == "Sichuan"))
	{
		alert("modify_other_alert".i18n());
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
				//检查是否有重复的vlan
				if ( single_wan.vlanid == $("#WanVlanID_text").val() && single_wan.vlanid > 0 )
				{
					alert("duplicate_vlan_alert1".i18n() + $("#WanVlanID_text").val() + "duplicate_vlan_alert2".i18n());
					return false;
				}
				
				
				if ( (($("#WanServiceList_select").val() == 1) || ($("#WanServiceList_select").val() == 3) || ($("#WanServiceList_select").val() == 5) || ($("#WanServiceList_select").val() == 7)) 
					&& single_wan.ServiceList.indexOf(service_modes_new_array[0]) >=0 )
				{
					alert("one_tr069_alert".i18n());
					return false;
				}

				//单条语音限制
				if ( (($("#WanServiceList_select").val() == 2) || ($("#WanServiceList_select").val() == 3) || ($("#WanServiceList_select").val() == 6) || ($("#WanServiceList_select").val() == 7)) 
					&& single_wan.ServiceList.indexOf(service_modes_new_array[1]) >=0 )
				{
					alert("one_voice_alert".i18n());
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
	}
			
	return true;
}
function check_connection(value)
{
	if(value == "Connect")
	{
		connect_flag = "true";
		$("#connect_button").addClass("select_button");
		$("#disconnect_button").removeClass("select_button");
	}
	else if(value == "Disconnect")
	{
		connect_flag = "false";
		$("#disconnect_button").addClass("select_button");
		$("#connect_button").removeClass("select_button");
	}
	else 
	{
		connect_flag = ""; 
	}
}
//下发postdata 数据
function saveApply()
{
	show_shadow();
	
	if( ! $("#broadband_form").valid() )
	{
		alert("invalid_value_alert".i18n());
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
	
	
	if (addflag == "add")
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
	if(connect_flag == "true"){
		postdata.X_FH_AutoConnection = 1;
	}else if(connect_flag == "false"){
		postdata.X_FH_AutoConnection = 2;
	}
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

	var selectListValue = $("#WanServiceList_select").val();
	var ServiceList = '';
	//modify by fengshuo 20191203
	//下发wanname 配置字，利用servicelist进行配置，通过赋予一个service_modes_new_array的数组，里面存放对应的service的各种组合值
	ServiceList = service_modes_new_array[selectListValue-1];
	postdata.ServiceList = ServiceList;
	
	postdata.IPMode = $("#WanIP_Mode_select").val();
	
	postdata.mtu = $("#WanMTU_text").val();
	
	postdata.VLANEnabled = 2;
	postdata.vlanid = $("#WanVlanID_text").val();
		
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
			postdata.AddressingType = $("#wan_connect_mode_select_v4").val();
		}
	}
	else
	{
		postdata.AddressingType = addressTypeArray[2]; //PPPoE
	}
	//add by fengshuo 20191220 se需求确认 ，只有在wanmode 选择为 桥接的时候， wanmode 设置为 空，以供status页面调用数据。
	if($("#WanConnectMode_select").val() == "bridge")
	{
		postdata.AddressingType="";
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
		//postdata.Password = $("#POED").val();
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
		//&& ( 4 == (4 & selectListValue) || 8 == selectListValue || selectListValue>=16) )
		&& ( $("#nat_select").val() == 1))
	{
			postdata.NATEnabled = "1";
	}
	else
	{
		postdata.NATEnabled = "0";
	}

	//针对option60 操作 2020-03-06 fengshuo 
	if(operator_name == "BZ_CLARO" && $("#wan_connect_mode_select_v4").val() == 'DHCP')
	{
		var option60_value = '';

		option60_value = $("#option60_text").val();
		if(!option60_value.match(/^[ ]*$/))
		{
		    //console.log("all space")
		//}
		//if(option60_value != "")
		//{
			postdata.option60_enable = 1;
			var str_check = option60_value;
			
			var arr = str_check.split(',');
			var len = arr.length;
			for(var i=0; i<len-1; i++)
			{
				if(arr[i].match(/^[ ]*$/))
				{
					alert("option60_alert".i18n());//报错
					return;
				}	
			}
			postdata.option60_value = option60_value;
		}
		else
		{
			postdata.option60_enable = 0;
			postdata.option60_value = "";
		}	
		
	}
	
	postdata.sessionid = sessionidstr;

	XHR.post(action, postdata, initPage);

	addflag = "edit";
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

function addfilter() //增加新的wan连接条目
{
	addflag = "add";
    var addHtml = []; //新增一个占位标记行
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';

    if ($("#add_item").length == 0)//第一次添加数据时设置默认值
    {
		$("#internet_list").append(addHtml);
		$(".input_text").each(function (i){
		   $(this).val('');
		});
		displayFormHtml("init","0");
		$("#add_item").children().css("background-color","#b7e3e3");
		$("#add_item").siblings().children().css("background-color","#eef2f6");
		$("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

var IPoEPPPoEArr = [];
var IPoEPPPoEArrIndex = 0;

function click_remove()
{
    var checkNodes = $(".delselwan");
    var is_checked = false;
    var value_temp;
	var wan_num = $("#WanConnectName_select").val();
	var index = wan_num.split("_")[0];

    IPoEPPPoEArr = [];
    IPoEPPPoEArrIndex = 0;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    for(var i = 0; i < checkNodes.length; i++)
    {
        if (checkNodes.eq(i).attr("checked") == "checked")
        {
            is_checked = true;
            IPoEPPPoEArr.push(getSingleWanInfo(checkNodes[i].value).iporppp);
        }
    }
    
    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
   
    if(confirm("delete_alert".i18n()) == false)
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes.eq(i).attr("checked")  == "checked")
        {
            value_temp = checkNodes[i].value;
            index = value_temp;
            sleep(300);
            deleteWan(index); //执行删除操作
			
        }
    }
	
}
function deleteWan(index)
{
    show_shadow();
    if ( ! deleteValidCheck(index) )
	{
        IPoEPPPoEArrIndex++;
		return;
	}
	var postdata = new Object();
	postdata.wan_index = index.split("_")[0];
	postdata.wan_session_index = index.split("_")[1];
    postdata.wan_iporppp_old = IPoEPPPoEArr[IPoEPPPoEArrIndex];
    IPoEPPPoEArrIndex++;
	selectwan = '';
	postdata.sessionid = sessionidstr;
	
	XHR.post("wan_delete", postdata, initPage);		
	
}

function calcBindList()
{
	var bindlist = '';
	//if ( $("#port_div").is(":visible") )
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