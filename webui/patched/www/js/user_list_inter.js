var g_brmac;
var g_brip;
var g_submask;
$(document).ready(function() {

	XHR.get("get_ipv4_lan_info", null, deviceInfo);
	getData();

    if (gOperatorName == "ESP_EMBOU") {
        $("#td_hostname").hide();
        $("#td_hiredTime").hide();
        $("#userListPrompt").html("On this page, you can query the all client information.");
    }

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
            var type;
            if (gOperatorName != "ESP_EMBOU") {
                if (dhcpuser.AddressSource == "DHCP") {
                    type = "Dynamic".i18n();
                } else {
                    type = "Static".i18n();
                }
            } else {
                type = "N/A"
                if (dhcpuser.Layer2Interface.indexOf("LANEthernetInterfaceConfig") >= 0)//LAN
                {
                    type = "wired"
                }
                else if (dhcpuser.Layer2Interface.indexOf("WLANConfiguration") >= 0)//wifi
                {
                    type = "wireless"
                }
            }


            if (dhcpuser.IPAddress == "" || dhcpuser.IPAddress == null || isValidIpAddress(dhcpuser.IPAddress) == false) {
                continue;
            }

            if (!is_same_network_segment(dhcpuser.IPAddress, g_brip, g_submask)) {
                continue;
            }

            j++;
            html += '<tr class="table_01">';
            html += '<td style="text-align: center;">' + j + '</td>';
            if (gOperatorName != "ESP_EMBOU")
                html += '<td style="text-align: center;">' + dhcpuser.HostName + '</td>';
            html += '<td style="text-align: center;">' + dhcpuser.MACAddress + '</td>';
            html += '<td style="text-align: center;">' + dhcpuser.IPAddress + '</td>';
            if (gOperatorName != "ESP_EMBOU")
                html += '<td style="text-align: center;">' + LeaseTimeRemaining + '</td>';
            html += '<td style="text-align: center;">' + type + '</td>';
            html += '</tr>';
        }
    }
    $("#user_list").append(html);
}
