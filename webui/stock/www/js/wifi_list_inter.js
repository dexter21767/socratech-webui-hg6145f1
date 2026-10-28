var g_wifiNamedata;
var channelIsInUse_24g;
var channelIsInUse_5g;
var uptime;
var connectDate;
var operator_name = gOperatorName;
var ssid_arr = [];
var main_wifi_index_5g;
var g_brmac;
var g_brip;
var g_submask;
var ssidname_2g;
var ssidname_5g;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	getData();

	if(gWifiEnable5G != "1"){
		$("#5g").hide();
	}
	
	if (operator_name == "PLE_PALTEL") {
		//$("#td_uptime").show();
		$("#td_connectDate").show();

		//$("#td_5g_uptime").show();
		$("#td_5g_connectDate").show();
	}

	if (operator_name == "ARG_CLARO") {
		$("#td_channel").show();
		$("#td_receivingRate").show();
		$("#td_signal").show();
		$("#td_Noise").show();
		$("#td_antenna_number").show();

		$("#td_5g_channel").show();
		$("#td_5g_receivingRate").show();
		$("#td_5g_signal").show();
		$("#td_5g_Noise").show();
		$("#td_5g_antenna_number").show();

	}
	if (operator_name == "TH_AIS") {
		$("#td_rssi").show();
		$("#td_leasetime").show();
		$("#td_5g_rssi").show();
		$("#td_5g_leasetime").show();

	}

	if (operator_name == "CHL_ENTEL") {
		$("#td_channel").show();
		$("#td_receivingRate").show();
		$("#td_signal").show();
		$("#td_uptime").show();

		$("#td_5g_channel").show();
		$("#td_5g_receivingRate").show();
		$("#td_5g_signal").show();
		$("#td_5g_uptime").show();

	}
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
		$("#wifi_2G_inter").hide();
		$("#wifi_2G_rom").show();
		$("#wifi_5G_inter").hide();
		$("#wifi_5G_rom").show();
	}

	if (operator_name == "FTTR_MAIN_SFU_COMMON" || operator_name == "FTTR_SUB_COMMON") {
		$("#wifi_macListPrompt").html("You can query the  wifi clients information directly connected to this device.");
	}

	if (operator_name == "EG_TELECOM") {
		$("#td_rssi").show();
		$("#td_5g_rssi").show();
	}
});



function ssiddisplayInfo(data) {
	main_wifi_index_5g = data.ssid_info.main_wifi_index_5g;
}

function getData() {
	if (gDebug) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else {

		XHR.get("get_ipv4_lan_info", null, deviceInfo);
		
		//XHR.get("get_ssiddisplay_info", null, ssiddisplayInfo);
		XHR.get("get_wifi_status", null, wifi_status);
		
		if(gWifiEnable5G == 1)
			XHR.get("get_wifi_status_5G", null, wifi_status_5G);

		if(operator_name == "IDN_TELKOM")
			XHR.get("get_allwan_info", null, getSSID);

		//XHR.get("vlanbind", null, wifiNamedara);
		XHR.poll(gStatusFreshInterval, "get_lan_status", null, parseGetData);
	}
}
function deviceInfo(data) {
	g_brmac = data.lan_ipv4.brmac;
	g_brip = data.lan_ipv4.IPInterfaceIPAddress;
	g_submask = data.lan_ipv4.IPInterfaceSubnetMask;
}
function getSSID(all_wan_info) {
	for (var i = 0; i < all_wan_info.wan.length; i++) {
		var single_wan = all_wan_info.wan[i];
		if (single_wan.Name.indexOf("_B_") >= 0 && single_wan.Name.indexOf("INTERNET") >= 0) {
			ssid = single_wan.LanInterface.split(',');
			for (var j = 0; j < ssid.length; j++) {
				if (ssid[j].indexOf("dev.wla.") >= 0) {
					ssid_arr.push(ssid[j].split('.')[2]);
				}
			}
			//ssid.push(single_wan.LanInterface.substr(single_wan.LanInterface.length -1)); 

		}
	}
}

function wifi_status(data) {
	ssidname_2g = [];
	if(data && data.wifi_status){
		channelIsInUse_24g = data.wifi_status[1].channelIsInUse;
		for(var i = 0; i < data.wifi_status.length; i++){
			ssidname_2g.push(data.wifi_status[i].SSID)
		}
	}
}

function wifi_status_5G(data) {
	ssidname_5g = [];
	if(data && data.wifi_status5g){
		channelIsInUse_5g = data.wifi_status5g[1].channelIsInUse;
		for(var i = 0; i < data.wifi_status5g.length; i++){
			ssidname_5g.push(data.wifi_status5g[i].SSID)
		}
	}
}



/*function wifiNamedara(data) {
	g_wifiNamedata = data.wifi_obj_enable;
	XHR.poll(gStatusFreshInterval, "get_lan_status", null, parseGetData);
}*/

function parseGetData(data) {
	var html = [];
	var html5g = [];
	$("#user_list").empty();
	$("#user_5glist").empty();

	if (data && data.lan_status) {
		var index_2 = 0;
		var index_5 = 0;
		var ssidName;
		for (var i = 0; i < data.lan_status.data.length; i++) {
			var dhcpuser = data.lan_status.data[i];
			var secondTime = dhcpuser.ClientUpTime;
			var minuteTime = 0;// 分
			var hourTime = 0;// 小时
			var dayTime = 0;
			if (secondTime >= 60) {
				minuteTime = parseInt(secondTime / 60);
				secondTime = parseInt(secondTime % 60);
				if (minuteTime >= 60) {
					hourTime = parseInt(minuteTime / 60);
					minuteTime = parseInt(minuteTime % 60);
					if (hourTime >= 24) {
						dayTime = parseInt(hourTime / 24);
						hourTime = parseInt(hourTime % 24);
					}
				}
			}

			uptime = dayTime + " d " + hourTime + " h " + minuteTime + " m " + secondTime + " s";

			var clientuptime = dhcpuser.ClientUpTime;//设备上线时长单位s
			var date = new Date();//当前标准时间
			var time3 = Date.parse(date);//转换成毫秒，精确到秒，后三位为0
			var connecttime = time3 - clientuptime * 1000;//

			var ctdate = new Date(connecttime);
			var Y = ctdate.getFullYear();
			var M = (ctdate.getMonth() + 1 < 10 ? '0' + (ctdate.getMonth() + 1) : ctdate.getMonth() + 1);
			var D = ctdate.getDate() < 10 ? '0' + ctdate.getDate() : ctdate.getDate();
			var h = ctdate.getHours() < 10 ? '0' + ctdate.getHours() : ctdate.getHours();
			var m = ctdate.getMinutes() < 10 ? '0' + ctdate.getMinutes() : ctdate.getMinutes();
			var s = ctdate.getSeconds() < 10 ? '0' + ctdate.getSeconds() : ctdate.getSeconds();
			connectDate = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;

			if (dhcpuser.InterfaceType != "Ethernet" && dhcpuser.InterfaceType != "PON") {

				var index = parseInt(dhcpuser.Layer2Interface.split(".")[4]);
				
				if (operator_name == "IDN_TELKOM") {
					var ssid_isband;
					for (var k = 0; k < ssid_arr.length; k++) {
						if (index == ssid_arr[k]) {
							ssid_isband = 1
							break;
						}
					}
					if (ssid_isband == 1) {
						continue;
					}
				}
				if (dhcpuser.flag == -1) {
					continue;
				}

				if (dhcpuser.Active == "0") {
					continue;
				}

				if (dhcpuser.IPAddress == "" || dhcpuser.IPAddress == null || isValidIpAddress(dhcpuser.IPAddress) == false) {
					continue;
				}

				if (dhcpuser.LeaseTimeRemaining == "0") {
					continue;
				}

				//过滤子网关下挂设备
				if (dhcpuser.ParentMac.toUpperCase() != g_brmac.toUpperCase()) {
					continue;
				}

				//过滤子网关
				if (dhcpuser.DeviceType == "Agent" || dhcpuser.DeviceType.toUpperCase() == "AP") {
					continue;
				}


				//墨西哥增加相关过滤条件1.要与br0 IP同网段 2.要是DHCP 3.协商速率不为0
				if (operator_name == "MEX_TP") {

					if (dhcpuser.Tx_rate == 0)
						continue;

					if (dhcpuser.AddressSource && dhcpuser.AddressSource.toUpperCase() != "DHCP") {
						continue;
					}

				}

				if (!is_same_network_segment(dhcpuser.IPAddress, g_brip, g_submask) && operator_name != "BZ_INTELBRAS") {
					continue;
				}

				if (index <= 4) {
					index_2++;
					if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
						//ssidName = eval("g_wifiNamedata.ssid" + index);
						ssidName = ssidname_2g[index - 1];
						html += '<tr class="table_01">';
						html += '<td width="5%" style="text-align: center;">' + index_2 + '</td>';
						html += '<td width="12%" style="text-align: center;">' + fhdecrypt(ssidName) + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
						html += '<td width="10%" style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
						html += '<td width="13%" style="text-align: center;">' + uptime + '</td>';
						html += '<td width="17%" style="text-align: center;">' + parseInt(dhcpuser.Tx_rate) / 1000 + '</td>';
						html += '<td width="17%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + '</td>';
						html += '<td width="12%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
					} else {
						//ssidName = eval("g_wifiNamedata.ssid" + index);
						ssidName = ssidname_2g[index - 1];
						if (gNewUiFlag)
							html += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
						else
							html += '<tr class="table_01">';
						html += '<td width="1%" style="text-align: center;">' + index_2 + '</td>';
						html += '<td width="10%" style="text-align: center;">' + fhdecrypt(ssidName) + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.HostName + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
						html += '<td width="11%" style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
						html += '<td width="10%" style="text-align: center;">' + parseInt(dhcpuser.Tx_rate / 1000) + 'M' + '</td>';
					}
					if (operator_name == "PLE_PALTEL") {
						html += '<td width="13%" style="text-align: center;">' + connectDate + '</td>';
					}

					if (operator_name == "ARG_CLARO") {
						html += '<td width="13%" style="text-align: center;">' + channelIsInUse_24g + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + 'M' + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.noise + '</td>';
						html += '<td width="13%" style="text-align: center;">' + dhcpuser.antenna_number + '</td>';
					}

					if (operator_name == "CHL_ENTEL") {
						html += '<td width="7%" style="text-align: center;">' + channelIsInUse_24g + '</td>';
						html += '<td width="8%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + 'M' + '</td>';
						html += '<td width="7%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
						html += '<td width="20%" style="text-align: center;">' + uptime + '</td>';
					}
					if (operator_name == "TH_AIS") {
						html += '<td width="15%" style="text-align: center;">' + dhcpuser.rssi + ' dBm' + '</td>';
						html += '<td width="20%" style="text-align: center;">' + dhcpuser.LeaseTimeRemaining + '</td>';
					}

					if (operator_name == "EG_TELECOM") {
						html += '<td width="15%" style="text-align: center;">' + dhcpuser.rssi + ' dBm' + '</td>';
					}

					html += '</tr>';
				} else if (index >= 5 && index <= 8) {
					index_5++;
					if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
						//ssidName = eval("g_wifiNamedata.ssid" + index);
						ssidName = ssidname_5g[index - 5];
						html5g += '<tr class="table_01">';
						html5g += '<td width="5%" style="text-align: center;">' + index_5 + '</td>';
						html5g += '<td width="12%" style="text-align: center;">' + fhdecrypt(ssidName) + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
						html5g += '<td width="10%" style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + uptime + '</td>';
						html5g += '<td width="17%" style="text-align: center;">' + parseInt(dhcpuser.Tx_rate) / 1000 + '</td>';
						html5g += '<td width="17%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + '</td>';
						html5g += '<td width="12%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
					} else {
						//ssidName = eval("g_wifiNamedata.ssid" + index);
						ssidName = ssidname_5g[index - 5];
						if (gNewUiFlag)
							html5g += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
						else
							html5g += '<tr class="table_01">';
						html5g += '<td width="1%" style="text-align: center;">' + index_5 + '</td>';
						html5g += '<td width="10%" style="text-align: center;">' + fhdecrypt(ssidName) + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.HostName + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
						html5g += '<td width="11%" style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
						html5g += '<td width="10%" style="text-align: center;">' + parseInt(dhcpuser.Tx_rate / 1000) + 'M' + '</td>';
					}


					if (operator_name == "PLE_PALTEL") {
						html5g += '<td width="13%" style="text-align: center;">' + connectDate + '</td>';
					}

					if (operator_name == "ARG_CLARO") {
						html5g += '<td width="13%" style="text-align: center;">' + channelIsInUse_5g + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + 'M' + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.noise + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.antenna_number + '</td>';
					}

					if (operator_name == "CHL_ENTEL") {
						html5g += '<td width="7%" style="text-align: center;">' + channelIsInUse_5g + '</td>';
						html5g += '<td width="8%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + 'M' + '</td>';
						html5g += '<td width="7%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
						html5g += '<td width="20%" style="text-align: center;">' + uptime + '</td>';
					}
					if (operator_name == "TH_AIS") {
						html5g += '<td width="15%" style="text-align: center;">' + dhcpuser.rssi + ' dBm' + '</td>';
						html5g += '<td width="20%" style="text-align: center;">' + dhcpuser.LeaseTimeRemaining + '</td>';
					}

					if (operator_name == "EG_TELECOM") {
						html5g += '<td width="15%" style="text-align: center;">' + dhcpuser.rssi + ' dBm' + '</td>';
					}

					html5g += '</tr>';
				} else if (index >= 9 && index <= 12) {
					index_5++;
					if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
						//ssidName = eval("g_wifiNamedata.ssid" + index);
						ssidName = ssidname_5g[index - 9];
						html5g += '<tr class="table_01">';
						html5g += '<td width="5%" style="text-align: center;">' + index_5 + '</td>';
						html5g += '<td width="12%" style="text-align: center;">' + fhdecrypt(ssidName) + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
						html5g += '<td width="10%" style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + uptime + '</td>';
						html5g += '<td width="17%" style="text-align: center;">' + parseInt(dhcpuser.Tx_rate) / 1000 + '</td>';
						html5g += '<td width="17%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + '</td>';
						html5g += '<td width="12%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
					} else {
						//ssidName = eval("g_wifiNamedata.ssid" + index);
						ssidName = ssidname_5g[index - 9];
						if (gNewUiFlag)
							html5g += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
						else
							html5g += '<tr class="table_01">';
						html5g += '<td width="1%" style="text-align: center;">' + index_5 + '</td>';
						html5g += '<td width="10%" style="text-align: center;">' + fhdecrypt(ssidName) + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.HostName + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
						html5g += '<td width="11%" style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
						html5g += '<td width="10%" style="text-align: center;">' + parseInt(dhcpuser.Tx_rate / 1000) + 'M' + '</td>';
					}


					if (operator_name == "PLE_PALTEL") {
						html5g += '<td width="13%" style="text-align: center;">' + connectDate + '</td>';
					}

					if (operator_name == "ARG_CLARO") {
						html5g += '<td width="13%" style="text-align: center;">' + channelIsInUse_5g + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + 'M' + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.noise + '</td>';
						html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.antenna_number + '</td>';
					}

					if (operator_name == "CHL_ENTEL") {
						html5g += '<td width="7%" style="text-align: center;">' + channelIsInUse_5g + '</td>';
						html5g += '<td width="8%" style="text-align: center;">' + dhcpuser.rx_rate / 1000 + 'M' + '</td>';
						html5g += '<td width="7%" style="text-align: center;">' + dhcpuser.rssi + '</td>';
						html5g += '<td width="20%" style="text-align: center;">' + uptime + '</td>';
					}
					if (operator_name == "TH_AIS") {
						html5g += '<td width="15%" style="text-align: center;">' + dhcpuser.rssi + ' dBm' + '</td>';
						html5g += '<td width="20%" style="text-align: center;">' + dhcpuser.LeaseTimeRemaining + '</td>';
					}

					if (operator_name == "EG_TELECOM") {
						html5g += '<td width="15%" style="text-align: center;">' + dhcpuser.rssi + ' dBm' + '</td>';
					}

					html5g += '</tr>';
				}

				if (gNewUiFlag) {
					if (index_2 == 0)
						$("#image_2g").show();
					else
						$("#image_2g").hide();

					if (index_5 == 0)
						$("#image_5g").show();
					else
						$("#image_5g").hide();
				}
			} else {
				if (gNewUiFlag) {
					$("#image_5g").show();
					$("#image_2g").show();
				}
			}
		}
		$("#user_list").append(html);
		$("#user_5glist").append(html5g);
	}
}
