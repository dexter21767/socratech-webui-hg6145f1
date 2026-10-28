var g_index = 0;
var g_wandata;
var login_user = gLoginUser;
var operator_name = gOperatorName;
var globalipv6address;
//var innerHTML = '';
var ip = "";
var mask = "";
var dongle_dns = "";
var dongle_index;
var dongle_status;
var voip_port_service_flag = 0;
var voip_wan_flag = 0;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	if (operator_name == "TH_AIS") {
		$("#mode").hide();
		$("#name").show();
	}
	if (operator_name == "COL_ETB")
		$("#wanName_td").show();
	
	getData();
});

function getData() {
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", parseWanData);
	}
	else {
		if (operator_name == "EG_TELECOM") {
			XHR.get("get_voip_port_service", null, voipPortService);
		}
		if (operator_name == "TH_AIS") {
			XHR.get("get_ipv6_lan", null, parseIPV6Data);
		}
		XHR.get("get_dongle_info", null, dongleInfo);
		if (operator_name == "ARG_CLARO" || operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "COL_ETB" ) {
			XHR.poll(gStatusFreshInterval, "get_allwan_info_broadBand", null, parseWanData);
		} else {
			XHR.poll(gStatusFreshInterval, "get_allwan_info", null, parseWanData);
		}
		XHR.poll(gStatusFreshInterval, "get_dongle_info", null, dongleInfo);
	}

}

function voipPortService(data) {
	voip_port_service = data.voip_service_info;
	if (voip_port_service.voip_vlan != "-1") {
		voip_port_service_flag = 1;
	}
	console.log(voip_port_service);
}

function dongleInfo(data) {
	var dongle_info = data.dongle_info;
	console.log(dongle_info);
	for (var i = 0; i < dongle_info.length; i++) {
		if (dongle_info[i].Status == "Up") {
			dongle_status = dongle_info[i].Status;
			console.log(dongle_info[i]);
			ip = dongle_info[i].X_FH_IPAddress;
			mask = dongle_info[i].X_FH_SubnetMask;
			dongle_dns = dongle_info[i].X_FH_DNSServers;
			dongle_index = dongle_info[i].dongle_index;
			break;
		}
	}
	console.log("dongle_index====" + dongle_index);
}

function parseIPV6Data(data) {
	if (data && data.lan_ipv6) {
		globalipv6address = data.lan_ipv6.ipv6globaladdress;
	}
}

function Showthiswanmoreinfo(mode, element) {
	if (element == "voip_port") {
		$("#" + element).children().css("background-color", "#b7e3e3");
		$("#" + element).siblings().children().css("background-color", "#eef2f6");
		$("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
		$("#v4_info").hide();
		$("#v6_info").hide();
		// $("#WAN_Mac").html("");
		$("#Gateway").html(voip_port_service.voip_defaultgaeway);
		//  $("#Connection_Uptime").html("");
		//  $("#v6_info").css("display", "none");
	} else {
		if (mode == "1") {
			var index = element.split("_")[1];
			g_index = index;
		} else if (mode == "0") {
			var index = element;
		} else {
			var index = 0;
		}
        
        if(operator_name == "EG_TELECOM" || operator_name == "MAR_INWI"){
         $("#wan_" + index).children().css("background-color", "#DEC0DF");
         $("#wan_" + index).siblings().children().css("background-color", "#eef2f6");
         $("#wan_" + index).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
        }
		else{
          $("#wan_" + index).children().css("background-color", "#b7e3e3");
          $("#wan_" + index).siblings().children().css("background-color", "#eef2f6");
          $("#wan_" + index).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");  
        }

		//$("#wan_"+index).css("color","rgb(153, 0, 0)").siblings().css("color","#000");
		
		$("#v4_info").show();
		if (g_wandata) {
			var thiswan = g_wandata[index];
			if (thiswan) {
				var lastconnectionError = thiswan.LastConnectionError;
				if(thiswan.ConnectionType.toUpperCase() == "PPPOE_BRIDGED"){
					$("#WAN_Mac").html("00:00:00:00:00:00");
				}else{
					$("#WAN_Mac").html(thiswan.MACAddress);
				}
				
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
				// if (hourTime < 10){
				//     hourTime = "0" + hourTime;
				// }
				// if (secondTime < 10){
				//     secondTime = "0" + secondTime;
				// }
				// if (minuteTime < 10){
				//     minuteTime = "0" + minuteTime;
				// }
				$("#Connection_Uptime").html(hourTime + " h " + minuteTime + " m " + secondTime + " s");

				if (thiswan.ConnectionType.toUpperCase() == "PPPOE_ROUTED") {
					$("#gateway_status").show();
					if (isValidIpAddress(thiswan.RemoteIPAddress) == false) {
						$("#Gateway").html("");
					} else {
						$("#Gateway").html(thiswan.RemoteIPAddress);
					}

				} else if (thiswan.ConnectionType.toUpperCase() == "IP_ROUTED") {
					$("#gateway_status").show();
					if (isValidIpAddress(thiswan.DefaultGateway) == false) {
						$("#Gateway").html("");
					} else {
						if(thiswan.IPMode == "2")
						{
							$("#Gateway").html();
						}else
						{
						$("#Gateway").html(thiswan.DefaultGateway);
						}
					}

				} else {
					$("#Gateway").html(""); //桥接或其他
					$("#gateway_status").hide();
				}
				if (thiswan.AddressingType.toUpperCase() == "PPPOE") {
					if((thiswan.ServiceList == "OTHER" && thiswan.ConnectionType.indexOf("Routed") == -1) || (thiswan.ConnectionType == "PPPoE_Bridged")){
						$("#pppoe_status").hide();
					}else{
						$("#pppoe_status").show();
					}
					
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
					$("#pppoe_status").hide();
				}

				if (thiswan.IPMode == "1") {
					$("#v6_info").css("display", "none");
				} else {
					$("#v6_info").css("display", "");
					if (thiswan.IPv6ConnStatus == "Connected") {
						$("#IPV6_Status").html("Up");
					} else {
						$("#IPV6_Status").html("Down");
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

					if (operator_name == "BZ_INTELBRAS")
					{
						$("#tr_link_local_address").show();
						$("#link_local_address").html(thiswan.LinkLocalAddress);
					}
					else
					{
						$("#tr_link_local_address").hide();
					}

				}
			}
		}
	}
}

function hideInfo() {
	$("#v4_info").hide();
	$("#v6_info").hide();
	$("#dongle_1").children().css("background-color", "#b7e3e3");
	$("#dongle_1").siblings().children().css("background-color", "#eef2f6");
	$("#dongle_1").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}

function parseWanData(getdata) {
	var innerHTML = '';
	var paltresult = -1;
	var i;
	if (getdata && getdata.wan) {
		var wanAarry = getdata.wan;
		g_wandata = wanAarry;
		//paltresult = getdata.plat_result; //0-omici;1-tr069
		if (wanAarry.length > 0) {
			for (i = 0; i < wanAarry.length; i++) {
				var singleWan = wanAarry[i];
				if ((operator_name == "MEX_TP") && login_user == "0" && singleWan.vlanid == 417 && singleWan.ServiceList == "INTERNET" && singleWan.ConnectionType == "PPPoE_Bridged") {
					continue;
				}
				if (operator_name == "BZ_TIM" && login_user == "0" && singleWan.ServiceList == "TR069,VOIP") {
					continue;
				}
				if (operator_name == "TH_TRUE" && singleWan.ConnectionType == "PPPoE_Bridged") {
					continue;
				}
				if (operator_name == "IDN_TELKOM" && singleWan.Name.indexOf("_INTERNET_B_") >= 0) {
					continue;
				}
				innerHTML += '<tr id="wan_' + i + '" style="cursor:pointer" onclick="Showthiswanmoreinfo(1, this.id)">';
				// 序号
				innerHTML += '<td>' + (i + 1) + '</td>';
				// 使能状态
				if (operator_name == "ARG_CLARO" || operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "COL_ETB") {
					
					if(operator_name == "COL_ETB")
						innerHTML += '<td>' + singleWan.wanName; + '</td>';

					if (singleWan.Enable == "1") {
						if (singleWan.ConnectionStatus == "Connected") {
							innerHTML += '<td>Up</td>';
						}
						else {
							innerHTML += '<td>Down</td>';
						}
					} else if (singleWan.Enable == "0") {
						innerHTML += '<td>Disabled</td>';
					}
				} else {
					if (singleWan.IPMode != 2) {
						if (singleWan.ConnectionStatus == "Connected") {
							innerHTML += '<td>'+"Up".i18n()+'</td>';
						}
						else {
							innerHTML += '<td>'+"Down".i18n()+'</td>';
						}
					} else {
						innerHTML += '<td>/</td>';
					}

				}

				if (operator_name == "TH_AIS") {
					var Namehtml = singleWan.Name;
					innerHTML += '<td>' + Namehtml + '</td>';
				} else {

					// 模式
					var ServiceListhtml = singleWan.ServiceList.replace(/,/g, '_');
					innerHTML += '<td>' + ServiceListhtml + '</td>';
				}

				// 地址获取方式
				if (singleWan.ConnectionType == 'PPPoE_Bridged') {
					innerHTML += '<td></td>';
				} else if (singleWan.AddressingType.toUpperCase() == "PPPOE") {
					innerHTML += '<td>PPPoE</td>';
				}
				else {
					innerHTML += '<td>' + singleWan.AddressingType + '</td>';
				}
				if (singleWan.ConnectionType == 'PPPoE_Bridged') {

					innerHTML += '<td></td>';
					innerHTML += '<td></td>';
					innerHTML += '<td></td>';
				}
				else if (singleWan.ConnectionType.toUpperCase().indexOf("BRIDGE") >= 0) {
					innerHTML += '<td></td>';
					innerHTML += '<td></td>';
					innerHTML += '<td></td>';
				}
				else {
					if (singleWan.ConnectionStatus == 'Connected' || singleWan.AddressingType == 'Static') {
						if (isValidIpAddress(singleWan.ExternalIPAddress) == false) {
							innerHTML += '<td></td>';
						} else {
							if(singleWan.IPMode == "2")
							{
								innerHTML += '<td></td>';
							}else{
							innerHTML += '<td>' + singleWan.ExternalIPAddress + '</td>';
							}
						}

						if (singleWan.AddressingType.toUpperCase() == 'PPPOE') {
							innerHTML += '<td>255.255.255.255</td>';
						}
						else {
							if (isValidIpAddress(singleWan.SubnetMask) == false) {
								innerHTML += '<td></td>';
							} else {
								if(singleWan.IPMode == "2")
								{
									innerHTML += '<td></td>';
								}else
								{
								innerHTML += '<td>' + singleWan.SubnetMask + '</td>';
								}
							}

						}
						if (singleWan.DNSSevers == '') {
							innerHTML += '<td></td>';
						}
						else {
							if (operator_name == "TH_AIS") {
								innerHTML += '<td>' + singleWan.DNSServers + '</td>';
							} else {
								var dns = singleWan.DNSServers + ',';
								if(singleWan.IPMode == "2")
								{
									innerHTML += '<td></td>';
								}else{
								if (isValidIpAddress(dns.split(',')[0]) == false) {
									innerHTML += '<td></td>';
								} else {
									innerHTML += '<td>' + dns.split(',')[0] + '</td>';
									}	
								}

							}
						}
					}
					else {
						innerHTML += '<td></td>';
						innerHTML += '<td></td>';
						innerHTML += '<td></td>';
					}
				}
				if((operator_name == "BZ_INTELBRAS" || operator_name == "BZ_VERO") && singleWan.vlanid == 0)
				{
					innerHTML += '<td>' + '--' + '/' + singleWan.p8021 + '</td>';
				}
				else
				{
					innerHTML += '<td>' + singleWan.vlanid + '/' + singleWan.p8021 + '</td>';
				}
				if (singleWan.ConnectionType == "IP_Routed" || singleWan.ConnectionType == "PPPoE_Routed") {
					innerHTML += '<td>' + "Route".i18n() + '</td>';
				}
				else {
					innerHTML += '<td>' + "Bridge".i18n() + '</td>';
				}

				innerHTML += '</tr>';

				if (singleWan.ServiceList == "VOIP") {
					voip_wan_flag = 1;
				}
			}
		}
		else {
			//ROM_RCSRDS/MAGYAR_4IG
			if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
				$("#v4_info").css("display", "none");
			}
		}
	}
	if (voip_port_service_flag == 1 && voip_wan_flag != 1 && operator_name == "EG_TELECOM") {
		var voip_type;
		if (voip_port_service.voip_type == "1") {
			voip_type = "DHCP";
		} else {
			voip_type = "Static";
		}
		innerHTML += '<tr id="voip_port" style="cursor:pointer" onclick="Showthiswanmoreinfo(1, this.id)" ><td>' + (i + 1) + '</td><td>UP</td><td>VOIP</td><td>' + voip_type + '</td>'
		innerHTML += '<td>' + voip_port_service.voip_ipaddress + '</td><td>' + voip_port_service.voip_subnetmask + '</td><td></td><td>' + voip_port_service.voip_vlan + '/' + voip_port_service.voip_priority + '</td><td>Route</td></tr>'
	}

	if (dongle_status == "Up") {
		innerHTML += '<tr id="dongle_1" style="cursor:pointer"  onclick="hideInfo()"><td>Dongle_' + dongle_index + '</td><td>UP</td><td>IPV4</td><td>DHCP</td>'
		innerHTML += '<td>' + ip + '</td><td>' + mask + '</td><td>' + dongle_dns + '</td><td>\\</td><td>Route</td></tr>'
	}

	$("#wancfgv4").html(innerHTML);

	Showthiswanmoreinfo("0", g_index);
}
