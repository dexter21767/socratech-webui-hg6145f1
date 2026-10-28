var operator_name = gOperatorName;
var login_user = gLoginUser;
var g_brmac;
var g_brip;
var g_submask;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	if (operator_name == "PAK_CYBERNET") {
		$("#td_interface").show();
	}
	XHR.get("get_ipv4_lan_info", null, deviceInfo);
	getData();
});

function getData() {
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else {
		XHR.poll(gStatusFreshInterval, "get_lan_status", null, parseGetData);
	}
}

function deviceInfo(data) {
	g_brmac = data.lan_ipv4.brmac;
	g_brip = data.lan_ipv4.IPInterfaceIPAddress;
	g_submask = data.lan_ipv4.IPInterfaceSubnetMask;
}

function parseGetData(data) {
	$("#user_list").empty();
	var html = [];
	if (data && data.lan_status) {
		var j = 0;
		for (var i = 0; i < data.lan_status.data.length; i++) {
			var dhcpuser = data.lan_status.data[i];
			var LeaseTimeRemaining = dhcpuser.LeaseTimeRemaining;

			if (dhcpuser.InterfaceType != "Ethernet") {
				continue;
			}

			if (dhcpuser.IPAddress == "" || dhcpuser.IPAddress == null || isValidIpAddress(dhcpuser.IPAddress) == false) {
				continue;
			}
			if (dhcpuser.Active == "0") {
				continue;
			}
			if (LeaseTimeRemaining == "0") {
				continue;
			}
			if (!is_same_network_segment(dhcpuser.IPAddress, g_brip, g_submask)) {
				continue;
			}

			if (operator_name == "PAK_CYBERNET") {
				var index = dhcpuser.Layer2Interface.split('.')[4];
				var interface;
				var ssid_no;

				if (dhcpuser.Layer2Interface.indexOf("LANEthernetInterfaceConfig") >= 0)//LAN
				{
					ssid_no = index;
					interface = "LAN" + ssid_no;
				}
			}
			j++;
			html += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
			html += '<td style="text-align: center;">' + j + '</td>';
			html += '<td style="text-align: center;">' + dhcpuser.HostName + '</td>';
			if( operator_name == "PAK_CYBERNET")
			{
				html += '<td style="text-align: center;">'+interface+'</td>';
			}
			html += '<td style="text-align: center;">' + dhcpuser.MACAddress + '</td>';

			if(operator_name == "PAK_CYBERNET" && dhcpuser.IPv6Address != "")
				html += '<td style="text-align: center;">'+dhcpuser.IPAddress+'<br>'+dhcpuser.IPv6Address+'</td>';
			else
				html += '<td style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
			if (dhcpuser.AddressSource == "DHCP")
				html += '<td style="text-align: center;">' + LeaseTimeRemaining + '</td>';
			else
				html += '<td style="text-align: center;">N/A</td>';
			html += '</tr>';

		}
		if (j == 0)
			$("#image").show();
		else
			$("#image").hide();
	}
	else {
		$("#image").show();
	}
	$("#user_list").append(html);
}
