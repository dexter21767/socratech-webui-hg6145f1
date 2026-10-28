/**
 * @description 左侧菜单渲染相关逻辑
 * @time 20190312
 * @author scos_fx
 */
var multiAP = "";
var band_steering = "";
var hide;
var operator_name = gOperatorName;
var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
	hasOwn = ({}).hasOwnProperty;
for (var i in {
	toString: 1
}) {
	DONT_ENUM = false;
}

$(document).ready(function() {
	XHR.get("get_multiAP_enable", null, multiInfo);
	XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);
})

function bandsteeringInfo(data) {
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function multiInfo(data) {
	multiAP = data.multiAP_enable.Enable;
}

Object.keys = Object.keys || function(obj) {//ecma262v5 15.2.3.14
	var result = [];
	for (var key in obj) if (hasOwn.call(obj, key)) {
		result.push(key);
	}
	if (DONT_ENUM && obj) {
		for (var i = 0; key = DONT_ENUM[i++];) {
			if (hasOwn.call(obj, key)) {
				result.push(key);
			}
		}
	}
	return result;
};

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(callback, thisArg) {
		var T, k;
		if (this == null) {//如果调用forEach方法的对象是null就抛错
			throw new TypeError(' this is null or not defined');
		}
		var O = Object(this);//获取调用forEach的对象
		var len = O.length >>> 0;//手动转为32位整数
		if (typeof callback !== "function") {//callback检查
			throw new TypeError(callback + ' is not a function');
		}
		if (arguments.length > 1) {//第二参检查
			T = thisArg;
		}
		k = 0;
		while (k < len) {
			var kValue;
			if (k in O) {//某个数组项是否在数组中
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}

function CreateMenuLft(option) {
	this.firMenu = option.oneObj
	this.secMenu = option.towObj
	this.firDomNode = option.firDomNodeName
	this.secDomNode = option.secDomNodeName
	this.thisName = option.objName // new 出来的对象名称

	this.src = ''
	this.title = {}
	this.nowSecObj = {}
	this.hash = {}

	// 初始化
	this.createFirMenu()
	// 模拟点击效果 初始第一个一级菜单
	this.changeFirMenu($(this.firDomNode + '>li').get(0), Object.keys(this.firMenu)[0])
	// 模拟点击效果 初始第一个二级菜单
	this.changeSecMenu($('.sec-menu>li:first>span').get(0), Object.keys(this.firMenu)[0], 0)
	// 模拟点击效果 初始第一个三级菜单
	this.changeThrMenu($('.sec-menu>li:first>span+ul>li:first').get(0), 0)

}


// 渲染一级菜单
CreateMenuLft.prototype.createFirMenu = function() {
	var dynamicHTML = "";
	var menuObjName = this.thisName;
	$(this.firDomNode).empty();
	$.each(this.firMenu, function(name, content) {
		var clickFun = menuObjName + ".changeFirMenu(this,'" + name + "')"
		if (name != "awifi") {
			dynamicHTML += '<li  id="first_menu_' + name + '" ';
			dynamicHTML += 'onclick="' + clickFun + '">' + content.title.i18n() + '</li>';
		}
		else if (name == "awifi") {
			if (awifi_switch == "1") {
				dynamicHTML += '<li  id="first_menu_' + name + '" ';
				dynamicHTML += 'onclick="' + clickFun + '">' + content.title.i18n() + '</li>';
			}
		}
	})
	$(this.firDomNode).append(dynamicHTML);


}

// 一级菜单点击切换操作
CreateMenuLft.prototype.changeFirMenu = function(domNode, objName) {
	$(".fir-menu-open").removeClass("fir-menu-open")
	$(domNode).addClass("fir-menu-open")
	this.createSecMenu(objName)
	this.title.firTitle = this.firMenu[objName].title.i18n()
	this.hash.menuObjName = objName
	if (this.secMenu[objName].childMenuPosition == "self") {
		$(".main_iframe").attr("src", this.secMenu[objName].src)
		$(".left-meun").hide();
		$(".nav-title").hide();
		$(".content").css("width", "100%");
		$(".content").css("height", "auto");
		$(".main_iframe").css("width", "100%");
		$(".content").css("background-color", "black");
		$(".content").css("margin", "0 0 0 0");
		$(".content").css("background-color", "black");
		$(".main_iframe").css("background-color", "black");
		$(".main_iframe").css("margin", "0 0 0 0");
		$(".main_iframe").css("border-radius", "0px");
		const height = Number(document.documentElement.scrollHeight - 52);
		if(height>830){
			$(".main_iframe").css("height", height + "px");
			$(".conter").css("height", height + "px");
		}else{
			$(".main_iframe").css("height", "830px");
			$(".conter").css("height", "830px");
		}
		$(".main-body").css("background-color", "#000000");
	} else {
		$(".left-meun").show();
		$(".nav-title").show();
		$(".conter").css("height", "100%");
		$(".content").css("width", "calc(100% - 340px)");
		$(".content").css("height", "calc(100vh - 120px)");
		$(".content").css("background-color", "#1d1d20");
		$(".content").css("margin", "40px 16px 16px 0");
		$(".main_iframe").css("width", "calc(100% - 40px)");
		$(".main_iframe").css("background-color", "#1d1d20");
		$(".main_iframe").css("margin", "10px 0 0 20px");
		$(".main_iframe").css("border-radius", "12px");
		$(".main_iframe").css("height", "calc(100% - 110px)");
		$(".main-body").css("background-color", "#0b0b0b");

		this.changeSecMenu($('.sec-menu>li:first').get(0), objName, 0)
		this.changeThrMenu($('.sec-menu>li:first>span+ul>li:first').get(0), 0)
		var title = this.title.firTitle
		$(".sec-menu-title").text(title)
		//if(title == "Network")
		{
			$("#sec-menu-image").attr("src", '../image/new_ui/network_icon.png');
		}
	}


}

// 渲染二级菜单
CreateMenuLft.prototype.createSecMenu = function(secObjName) {
	if (this.secMenu[secObjName].childMenuPosition == "self") return;
	var initSecMenuArr = this.secMenu[secObjName].secondmenus;
	var initSecMenuName = secObjName;
	var partSecondMenuHTML = "";
	var menuObjName = this.thisName;
	var that = this
	$(this.secDomNode).empty();
	initSecMenuArr.forEach(function(e, index) {

		partSecondMenuHTML += "<li id='sec_" + e.title + "'" ;
		partSecondMenuHTML += "onclick='" + menuObjName + ".changeSecMenu(this,\"" + initSecMenuName + "\"," + index + ")'>";
		//partSecondMenuHTML += "<div class='arrow-down'></div>";
		partSecondMenuHTML += "<img class='sec_img' id='secimg_" + e.title + "'  src='../image/new_ui/arrow2.png'>";
		partSecondMenuHTML += "<span id='span_" + e.title + "'>";
		
		partSecondMenuHTML += e.title.i18n() + "</span>";

		if (typeof e.thirdmenus !== 'undefined' && e.thirdmenus.length > 0)
			partSecondMenuHTML += that.createThrMenu(e.thirdmenus)
		partSecondMenuHTML += "</li>";

	});
	$(this.secDomNode).append(partSecondMenuHTML);
}

// 二级菜单点击切换操作
CreateMenuLft.prototype.changeSecMenu = function(domNode, objFirName, secIndex) {


	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
		$(".sec-menu-select").removeClass("sec-menu-select");
		$(domNode).addClass("sec-menu-select");
	}
	if (this.secMenu[objFirName].childMenuPosition == "self")
		return;

	$(".thr-menu-open").removeClass("thr-menu-open")
	$(domNode).children("ul").addClass("thr-menu-open")
	this.nowSecObj = this.secMenu[objFirName].secondmenus[secIndex];
	while (this.nowSecObj == undefined) {
		if (secIndex > 20) {
			break;
		}
		secIndex++;
		this.nowSecObj = this.secMenu[objFirName].secondmenus[secIndex];
	}
	this.hash.secIndex = secIndex
	this.title.secTitle = this.secMenu[objFirName].secondmenus[secIndex].title.i18n()
	console.log(9)
	console.log(this.secMenu[objFirName].secondmenus[secIndex].title)
	$(".sec-menu > li").removeClass("clicked");
	$("#sec_" + this.secMenu[objFirName].secondmenus[secIndex].title).addClass("clicked")
	$(".sec_img-select").attr("src", "../image/new_ui/arrow2.png");
	$(".sec_img-select").removeClass("sec_img-select").addClass("sec_img")
	$("#secimg_" + this.secMenu[objFirName].secondmenus[secIndex].title).attr("src", "../image/new_ui/arrow.png");
	$("#secimg_" + this.secMenu[objFirName].secondmenus[secIndex].title).removeClass("sec_img").addClass("sec_img-select");
	this.changeThrMenu($(domNode).children("ul").children("li").get(0), 0)
}
// 渲染三级菜单
CreateMenuLft.prototype.createThrMenu = function(thrMenuObj) {
	var partThrMenuHTML = ''
	var menuObjName = this.thisName;
	partThrMenuHTML += '<ul class="thr-menu">'
	thrMenuObj.forEach(function(e, index) {
		partThrMenuHTML += '<span id="img_' + e.title + '"  class="img_select" style="display:none"></span>';
		if (thrMenuObj.length - 1 == 0) {
			partThrMenuHTML += '<li  style="margin-bottom: 15px;" id="thr_' + e.title + '" ';
		} else {
			partThrMenuHTML += '<li  id="thr_' + e.title + '" ';
		}

		partThrMenuHTML += 'onclick=" ' + menuObjName + '.changeThrMenu(this,' + index + ')">' + e.title.i18n() + '</li>';

	})
	partThrMenuHTML += '</ul>'
	return partThrMenuHTML
}

// 三级菜单点击切换操作
CreateMenuLft.prototype.changeThrMenu = function(domNode, theIndex) {
	if (!this.nowSecObj.thirdmenus)
		return;
	if ($(this).hasClass("hide_aaa")) {
		return;
	}
	$(".thr-menu-select").removeClass("thr-menu-select")

	$(".img_select").hide()
	$(domNode).addClass("thr-menu-select")
	event.stopPropagation();
	while (this.nowSecObj.thirdmenus[theIndex] == undefined) {
		theIndex++;
	}
	this.src = this.nowSecObj.thirdmenus[theIndex].src
	this.name = this.nowSecObj.thirdmenus[theIndex].name
	this.title.thrTitle = this.nowSecObj.thirdmenus[theIndex].title.i18n()
	//var title = this.title.firTitle + ' » ' + this.title.secTitle + ' » ' + this.title.thrTitle
	var title = this.title.thrTitle
	var title1 = this.nowSecObj.thirdmenus[theIndex].title;
	if ($("#thr_" + title1).hasClass("thr-menu-select")) {
		$("#img_" + title1).show()
	}
	
	$(".nav-title2").text(title)

	/*为适配多语言翻译，改用name进行匹配*/
	if (this.name == "status_overview_ip")
		$(".page_prompt").text("deviceinf_prompt".i18n())
	else if (this.name == "status_wifi_info")
		$(".page_prompt").text("wifistate_prompt".i18n())
	else if (this.name == "status_wifi_info5g")
		$(".page_prompt").text("wifistate_prompt".i18n())
	else if (this.name == "status_wifi_list")
		$(".page_prompt").text("wifi_macListPrompt".i18n())
	else if (this.name == "status_wifi_neighbor_list")
		$(".page_prompt").text("wifi_coverage_prompt".i18n())
	else if (this.name == "status_dhcpv6_info")
		$(".page_prompt").text("dhcpv6_info_prompt".i18n())
	else if (this.name == "status_topo_info")
		$(".page_prompt").text("topo_prompt".i18n())
	else if (this.name == "status_pon_link")
		$(".page_prompt").text("optpower_prompt".i18n())
	else if (this.name == "status_pon_info")
		$(".page_prompt").text("Pon_Prompt".i18n())
	else if (this.name  == "status_wan_ip")
		$(".page_prompt").text("wanstate_prompt".i18n())
	else if (this.name == "status_lan_lan")
		$(".page_prompt").text("lanstate_prompt".i18n())
	else if (this.name == "ethernetPorts")
		$(".page_prompt").text("EthernetPors_Prompt".i18n())
	else if (this.name == "status_dhcp_userlist")
		$(".page_prompt").text("lan_userListPrompt".i18n())
	else if (this.name == "status_ponlink_inter")
		$(".page_prompt").text("DownPonInf_prompt".i18n())
	else if (this.name == "sub_pon_link_info")
		$(".page_prompt").text("pon_sub_gateway_prompt".i18n())
	else if (this.name == "network_ipv4_static_route")
		$(".page_prompt").text("Ipv4StaticRoute_prompt".i18n())
	else if (this.name == "status_voice_info")
		$(".page_prompt").text("voipstateprompt".i18n())
	else if (this.name == "network_wifi_multiAp")
		$(".page_prompt").text("multi_ap_enable_prompt".i18n())
	else if (this.name == "network_wifi_band_steering")
		$(".page_prompt").text("bandsteering_prompt".i18n())
	else if (this.name == "network_wifi_advance")
		$(".page_prompt").text("security_prompt".i18n())
	else if (this.name == "network_wifi_base" || this.name == "network_wifi_base5G")
		$(".page_prompt").text("basic_prompt".i18n())
	else if (this.name == "network_wifi_advance" || this.name == "network_wifi_advance5G")
		$(".page_prompt").text("security_prompt".i18n())
	else if (this.name == "network_wifi_control" || this.name == "network_wifi_control5G")
		$(".page_prompt").text("wifipower_prompt".i18n())
	else if (this.name == "network_wifi_wps")
		$(".page_prompt").text("wps_prompt".i18n())
	else if (this.name == "network_lan_v4")
		$(".page_prompt").text("lan_prompt".i18n())
	else if (this.name == "network_dhcpv4_port_binding")
		$(".page_prompt").text("dhcpv4PortBinding_Prompt".i18n())
	else if (this.name == "network_dhcpv6_port_binding")
		$(".page_prompt").text("dhcpv6PortBinding_Prompt".i18n())
	else if (this.name == "network_dhcp_lan")
		$(".page_prompt").text("dhcp_lanPrompt".i18n())
	else if (this.name == "ITMS_Server")
		$(".page_prompt").text("ACS_prompt".i18n())	
	else if (this.name == "IOT_Server")
		$(".page_prompt").text("IOT_prompt".i18n())	
	else if (this.name == "network_wan_broadbund")
		$(".page_prompt").text("wan_prompt".i18n())
	else if (this.name == "network_wan_valn")
		$(".page_prompt").text("vlanbind_Prompt".i18n())
	else if (this.name == "iptv")
		$(".page_prompt").text("iptv_prompt".i18n())
	else if (this.name == "network_ipv4_default_route")
		$(".page_prompt").text("Ipv4DefaultRoute_prompt".i18n())
	else if (this.name == "network_olt_auth")
		$(".page_prompt").text("sncfg_prompt".i18n())
	else if (this.name == "network_voice_enable")
		$(".page_prompt").text("voipenable_prompt".i18n())
	else if (this.name == "network_voice_basic")
		$(".page_prompt").text("voipbasic_prompt".i18n())
	else if (this.name == "network_voice_advance")
		$(".page_prompt").text("voipadvance_prompt".i18n())
	else if (this.name == "network_voice_timeout")
		$(".page_prompt").text("timer_promt".i18n())
	else if (this.name == "network_voice_codec")
		$(".page_prompt").text("voip_codec_funcPrompt".i18n())
	else if (this.name == "security_firewall_firewall")
		$(".page_prompt").text("firewall_level_prompt".i18n())
	else if (this.name == "security_ip_filter")
		$(".page_prompt").text("fw_ipfilterPrompt".i18n())
	else if (this.name == "security_ipv6_filter")
		$(".page_prompt").text("fw_ipfilterPrompt".i18n())
	else if (this.name == "security_dhcp_filter")
		$(".page_prompt").text("dhcp_filterPrompt".i18n())
	else if (this.name == "security_wan_wan")
		$(".page_prompt").text("url_filterPrompt".i18n())
	else if (this.name == "security_acl_setting")
		$(".page_prompt").text("acl_EnablePrompt".i18n())
	else if (this.name == "security_ipv6_acl_setting")
		$(".page_prompt").text("ipv6_acl_EnablePrompt".i18n())
	else if (this.name == "ddos")
		$(".page_prompt").text("pro_ddos_prompt".i18n())
	else if (this.name == "security_mac_mac")
		$(".page_prompt").text("macaddr_filterPrompt".i18n())
	else if (this.name == "IPv6 MAC Filtering")
		$(".page_prompt").text("v6_macaddr_filterPrompt".i18n())
	else if (this.name == "app_vpn_vpn_through")
		$(".page_prompt").text("vpn_through_prompt".i18n())
	else if (this.name == "app_ddns_ddns")
		$(".page_prompt").text("ddns_prompt".i18n())
	else if (this.name == "security_parental_control")
		$(".page_prompt").text("parental_controlPrompt".i18n())
	else if (this.name == "app_alg")
		$(".page_prompt").text("alg_prompt".i18n())
	else if (this.name == "app_portmapping_portmapping")
		$(".page_prompt").text("portmapping_prompt".i18n())
	else if (this.name == "app_nat_alg")
		$(".page_prompt").text("nat_prompt".i18n())
	else if (this.name == "app_upnp_upnp")
		$(".page_prompt").text("upnp_prompt".i18n())
	else if (this.name == "app_nat_dmz")
		$(".page_prompt").text("dmz_prompt".i18n())
	else if (this.name == "app_Diagnosis_ping")
		$(".page_prompt").text("diagnosis_ping_prompt".i18n())
	else if (this.name == "app_Diagnosis_tracert")
		$(".page_prompt").text("tracert_prompt".i18n())
	else if (this.name == "app_Diagnosis_port_mirror")
		$(".page_prompt").text("cpu_port_mirror_prompt".i18n())
	else if (this.name == "security_security_HTTPS"){
		if(operator_name == "ROM_RCSRDS")
			$(".page_prompt").text("https_prompt_ROM_RCSRDS".i18n())
		else
			$(".page_prompt").text("https_prompt".i18n())
	}
	else if (this.name == "security_filter_eth")
		$(".page_prompt").text("anti_port_scan_prompt".i18n())
	else if (this.name == "app_web_port")
		$(".page_prompt").text("web_port_prompt".i18n())
	else if (this.name == "manage_user_management")
		$(".page_prompt").text("user_account_prompt".i18n())
	else if (this.name == "manage_admin_management")
		$(".page_prompt").text("admin_account_prompt".i18n())
	else if (this.name == "manage_device_ftp")
		$(".page_prompt").text("ftpServer_Prompt".i18n())
	else if (this.name == "manage_device_upstreamPort_configure")
		$(".page_prompt").text("upstream_configure_prompt".i18n())
	else if (this.name == "manage_device_reboot")
		$(".page_prompt").text("On this page, you can reboot the device.".i18n())
	else if (this.name == "manage_device_restore")
		$(".page_prompt").text("restore_reboot_prompt".i18n())
	else if (this.name == "manage_device_cfgfile")
		$(".page_prompt").text("update_config_prompt".i18n())
	else if (this.name == "manage_device_upgrade")
		$(".page_prompt").text("update_prompt".i18n())
	else if (this.name == "manage_device_ntp")
		$(".page_prompt").text("checktime_prompt".i18n())
	else if (this.name == "manage_log_view")
		$(".page_prompt").text("log_prompt".i18n())
	else if (this.name == "app_dlna_enable")
		$(".page_prompt").text("dlna_prompt".i18n())
	else if (this.name == "app_samba_service")
		$(".page_prompt").text("samba_prompt".i18n())
	else if (this.name == "IOT_Server")
		$(".page_prompt").text("IOT_prompt".i18n())
	else if (this.name == "manage_device_catv")
		$(".page_prompt").text("catv_prompt".i18n())//
	else if (this.name == "network_up_link")
		$(".page_prompt").text("uplink_prompt".i18n())
	else if (this.name == "status_route_info")
		$(".page_prompt").text("route_info_prompt".i18n())
	else if (this.name == "network_ipv6_static_route")
		$(".page_prompt").text("Ipv6StaticRoute_prompt".i18n())
	else if (this.name == "app_gre_tunnel")
		$(".page_prompt").text("app_gre_prompt".i18n())
	else if (this.name == "fault_info_collect")
		$(".page_prompt").text("fault_info_prompt".i18n())
	else if (this.name == "manage_device_ssl_certificate")
		$(".page_prompt").text("ssl_certificate_prompt".i18n())
	else if (this.name == "manage_device_open_source_software_notice")
		$(".page_prompt").text("open_source_software_noticeprompt".i18n())
	else if (this.name == "manage_system_log_view")
		$(".page_prompt").text("syslog_prompt".i18n())
	else if (this.name == "network_wifi_guset")
		$(".page_prompt").text("guest_prompt".i18n())
	else if (this.name == "app_port_forwarding")
		$(".page_prompt").text("portforwarding_prompt".i18n())
	$(".main_iframe").attr("src", this.src)
	console.log(this.src)
	this.hash.theIndex = theIndex
	//window.location.hash = '#' + this.hash.menuObjName + '/' + this.name.split("_")[1] + '/' + this.name.split("_")[2]

	gLastOperateTime = new Date().getTime()
	console.log(title1)
	console.log($("#thr_" + title1).hasClass("thr-menu-select"))

}