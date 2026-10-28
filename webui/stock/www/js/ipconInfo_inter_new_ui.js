var g_index = 0;
var g_wandata;
var login_user = gLoginUser;
var operator_name = gOperatorName;
var globalipv6address;
var all_wan_info;
$(document).ready(function() {
	getData();
	if(all_wan_info.wan.length == 0){
		$("#image").show();
		//myAlert('Tip','There is currently no wan connection !',function(r){}); 
	}
});

function getData() {
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", parseWanData);
	}
	else {
		//XHR.poll(gStatusFreshInterval, "get_allwan_info", null, parseWanData);
		XHR.get( "get_allwan_info", null, parseWanData);
	}
}

function parseIPV6Data(data) {
	if (data && data.lan_ipv6) {
		globalipv6address = data.lan_ipv6.ipv6globaladdress;
	}
}

function Showthiswanmoreinfo(mode, element) {
	if (mode == "1") {
		var index = element.split("_")[1];
		g_index = index;
	} else if (mode == "0") {
		var index = element;
	} else {
		var index = 0;
	}
	if (g_wandata) {
		var thiswan = g_wandata[index];
		console.log(thiswan)
		if (thiswan) {
			var lastconnectionError = thiswan.LastConnectionError;
			$("#WAN_Mac").html(thiswan.MACAddress);
			var secondTime = thiswan.Uptime;// 秒
			var minuteTime = 0;// 分
			var hourTime = 0;// 小时
			if (secondTime >= 60) {
				minuteTime = parseInt(secondTime / 60);
				secondTime = parseInt(secondTime % 60);
				if (minuteTime >= 60) {
					hourTime = parseInt(minuteTime / 60);
					minuteTime = parseInt(minuteTime % 60);
				}
			}
			$("#Connection_Uptime").html(hourTime + " h " + minuteTime + "  m  " + secondTime + " s");

			if (thiswan.ConnectionType.toUpperCase() == "PPPOE_ROUTED") {
				$("#Gateway_title").show();
				$("#dial_status").addClass("last_right_td");
				$("#wan_mac_title").removeClass("last_left_td");
				$("#Connection_Uptime").removeClass("last_right_td");
				
				$("#Gateway").show();
				if (isValidIpAddress(thiswan.RemoteIPAddress) == false) {
					$("#Gateway").html("");
				} else {
					$("#Gateway").html(thiswan.RemoteIPAddress);
				}

			} else if (thiswan.ConnectionType.toUpperCase() == "IP_ROUTED") {
				$("#Gateway_title").show();
				$("#wan_mac_title").removeClass("last_left_td");
				$("#Connection_Uptime").removeClass("last_right_td");
				$("#Gateway").show();
				if (isValidIpAddress(thiswan.DefaultGateway) == false) {
					$("#Gateway").html("");
				} else {
					$("#Gateway").html(thiswan.DefaultGateway);
				}

			} else {
				$("#wan_mac_title").addClass("last_left_td");
				$("#Connection_Uptime").addClass("last_right_td");
				$("#Gateway").html(""); //桥接或其他
				$("#Gateway_title").hide();
				$("#Gateway").hide();
				$("#other_title").hide();
				$("#other").hide();
			}
			if (thiswan.AddressingType.toUpperCase() == "PPPOE") {
				$("#dial_status_title").show();
				$("#dial_status").show();
				$("#other_title").hide();
				$("#other").hide();
				switch (lastconnectionError) {
					case "ERROR_AUTHENTICATION_FAILURE":
						$("#dial_status").html("ERROR_AUTHENTICATION_FAILURE".i18n());
						break;
					case "ERROR_ISP_DISCONNECT":
						$("#dial_status").html("ERROR_ISP_DISCONNECT".i18n());
						break;
					case "ERROR_ISP_TIME_OUT":
						$("#dial_status").html("ERROR_ISP_TIME_OUT".i18n());
						break;
					case "ERROR_UNKNOWN":
						$("#dial_status").html("ERROR_UNKNOWN".i18n());
						break;
					case "ERROR_NONE":
						$("#dial_status").html("ERROR_NONE".i18n());
						break;
					default:
						$("#dial_status").html("ERROR_UNKNOWN".i18n());
				}

			} else {
				$("#dial_status_title").hide();
				$("#dial_status").hide();
				if($("#Gateway").is(":visible")){
					$("#other_title").show();
					$("#other").show();
				}else{
					$("#other_title").hide();
					$("#other").hide();
				}
			}

			if (thiswan.IPMode == "1") {
				$("#v6_info").css("display", "none");
				if(gNewUiFlag)
					$("#v6_info_title").css("display", "none");
			} else {
				if(gNewUiFlag)
					$("#v6_info_title").css("display", "");
				$("#v6_info").css("display", "");
				if (thiswan.IPv6ConnStatus == "Connected") {
					$("#IPV6_Status").html("Up".i18n());
				} else {
					$("#IPV6_Status").html("Down".i18n());
				}
				if (operator_name == "TH_AIS") {
					if (thiswan.IPv6ConnStatus == "Connected" && thiswan.IPv6IPAddress == "") {
						$("#v6_addr").html(globalipv6address);
					} else {
						$("#v6_addr").html(thiswan.IPv6IPAddress);
					}
				} else {
					$("#v6_addr").html(thiswan.IPv6IPAddress);
				}

				$("#v6_prefix").html(thiswan.IPv6Prefix);
				$("#v6_Gateway").html(thiswan.DefaultIPv6Gateway);
				if (thiswan.IPv6DNSServers.indexOf(",") == -1) {
					$("#v6_dns").html(thiswan.IPv6DNSServers)
					$("#v6_dns2").html("");
				} else {
					$("#v6_dns").html(thiswan.IPv6DNSServers.split(",")[0]);
					$("#v6_dns2").html(thiswan.IPv6DNSServers.split(",")[1]);
				}

			}
		}
	}
}

function select_this_wan(domNode) {
	$(".wan_name_select").removeClass("wan_name_select")
	$(".img_select").hide()
	$("#img_select_"+ domNode.id.split("_")[1]).show()
	$(domNode).addClass("wan_name_select")
	Showthisinfo(domNode.id.split("_")[1])
}
function Showthisinfo(id) {
	console.log(all_wan_info.wan[id]);
	singleWan = all_wan_info.wan[id];
	var wan_id = Number(id) + 1
	$("#wan_index").html(wan_id);
	var wan_state;
	if (singleWan.IPMode != 2) {
		if (singleWan.ConnectionStatus == "Connected") {
			wan_state = 'Up'.i18n();
		}
		else {
			wan_state = 'Down'.i18n();
		}
	} else {
		wan_state = '/';
	}
	$("#wan_state").html(wan_state);
	var ServiceList = singleWan.ServiceList.replace(/,/g, '_');
	$("#wan_mode").html(ServiceList);
	var ConnectionType;
	if (singleWan.ConnectionType == 'PPPoE_Bridged') {
		ConnectionType = "";
	} else if (singleWan.AddressingType.toUpperCase() == "PPPOE") {
		ConnectionType = 'PPPoE';
	}
	else {
		ConnectionType = singleWan.AddressingType;
	}
	$("#ip_mode").html(ConnectionType);
	var wan_ip;
	var wan_dns;
	var wan_mask;
	if (singleWan.ConnectionType == 'PPPoE_Bridged') {
		wan_ip = "";
		wan_dns = "";
		wan_mask = "";
	}
	else if (singleWan.ConnectionType.toUpperCase().indexOf("BRIDGE") >= 0) {
		wan_ip = "";
		wan_dns = "";
		wan_mask = "";
	}
	else {
		if (singleWan.ConnectionStatus == 'Connected' || singleWan.AddressingType == 'Static') {
			if (isValidIpAddress(singleWan.ExternalIPAddress) == false) 
				wan_ip = "";
			else 
				wan_ip = singleWan.ExternalIPAddress;

			if (singleWan.AddressingType.toUpperCase() == 'PPPOE') {
				wan_mask = "255.255.255.255";
			}
			else {
				if (isValidIpAddress(singleWan.SubnetMask) == false) {
					wan_mask = '';
				} else {
					wan_mask = singleWan.SubnetMask;
				}

			}
			if (singleWan.DNSSevers == '') {
				wan_dns = '';
			}
			else {
					var dns = singleWan.DNSServers + ',';
					if (isValidIpAddress(dns.split(',')[0]) == false) {
						wan_dns = '';
					} else {
						wan_dns = dns.split(',')[0];
					}
			}
		}
		else {
			wan_ip = "";
			wan_dns = "";
			wan_mask = "";
		}
	}
	$("#wan_ip").html(wan_ip);
	$("#wan_dns").html(wan_dns);
	$("#wan_mask").html(wan_mask);
	$("#vlan_p").html(singleWan.vlanid + '/' + singleWan.p8021);
	var type;
	if (singleWan.ConnectionType == "IP_Routed" || singleWan.ConnectionType == "PPPoE_Routed") 
		type = "Route".i18n();
	else 
		type = "Bridge".i18n();

	$("#wan_connect").html(type);
	Showthiswanmoreinfo("0", Number(id));	
}

function parseWanData(getdata) {
	all_wan_info = getdata;
	if (getdata && getdata.wan) {
		g_wandata = getdata.wan;
	}
	var dynamicClsListHTML = '';
	for (var m = 0; m < all_wan_info.wan.length; m++) {
		var single = all_wan_info.wan[m];
		var wan_name_value = single.wan_index + '_' + single.wan_session_index + '_' + single.iporppp + '_' + single.Name;
		dynamicClsListHTML += "<li  id='outtable_" + m + "' onclick='select_this_wan(this)' style='width:280px'>";
		dynamicClsListHTML += "<span class ='img_select' id='img_select_"+ m + "' style='display:none'></span>";
		dynamicClsListHTML += single.Name;
		dynamicClsListHTML += "<input id='wan_index_" + m + "' type='hidden' value='" + wan_name_value + "'>";//<input type="HIDDEN" name="recontrol_check" value="0">
		dynamicClsListHTML += "</li>";
	}
	$("#wan_rules").html(dynamicClsListHTML)
	$("#outtable_0").addClass("wan_name_select")
	if(all_wan_info.wan.length>0){
		$("#img_select_0").show()
		$("#image").hide();
		$("#wan_show_detail_content").show();
		Showthisinfo(0)
	}else{
		$("#main").css("padding","0px")
		return
		//dynamicClsListHTML = "<li> No WAN connection </li>"
		
		$("#image").show();
		//$("#wan_rules").html(dynamicClsListHTML)
			myAlert('Tip','There is currently no wan connection !',function(r){   
        }); 
	}
}
