var g_wifiNamedata;
var multiAP = "";
var SSID;
var channelIsInUse_24g;
var channelIsInUse_5g;
var upTime;
var connectDate;
var operator_name = gOperatorName;
var ssid_arr = [];
var main_wifi_index_5g;
var g_brmac;
var wifi_2g;
var wifi_5g;
var g_host_data;
var wifi_5g_index
$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");

    if (operator_name == "JOR_UMNIAH") {
        $("#wifi_staPrompt").html(" On this page, you can query the WIFI Host information.");
        $("#wifi_2G_JOR_UMNIAH").show();
        $("#wifi_5G_JOR_UMNIAH").show();
        $("#wifi_24GstaHead").html("2.4G WIFI Host Information");
        $("#wifi_5GstaHead").html("5G WIFI Host Information");
    } else {
        $("#wifi_2G_inter").show();
        $("#wifi_5G_inter").show();
    }

    if (gWifiEnable5G != 1) {
        $("#5g").hide();
    }
    getData();

});

function getData() {
    if (gDebug) //调试模式读取本地数据
    {
        //getDataByAjax("../fake/wifi_info", parseGetData);
    }
    else {
        if (operator_name == "JOR_UMNIAH")
            XHR.get("get_lan_status", null, host_info);
        XHR.get("get_wifi_status", null, wifi_status);
        XHR.get("get_24g_sta_info", null, sta_info_24g);
        if (gWifiEnable5G == 1) {
            XHR.get("get_wifi_status_5G", null, wifi_status_5G);
            XHR.get("get_5g_sta_info", null, sta_info_5g);
        }

    }
}

function host_info(data) {
    g_host_data = data.lan_status.data
}
function wifi_status(data) {
    wifi_2g = data.wifi_status;
}
function wifi_status_5G(data) {
    console.log(data);
    wifi_5g = data.wifi_status5g;
    wifi_5g_index = parseInt(wifi_5g[0].index)
}

function sta_info_24g(data) {
    var html = [];
    $("#user_list").empty();
    if (data && data.wifi_sta_info_24g) {
        for (var i = 0; i < data.wifi_sta_info_24g.wifi_sta_data.length; i++) {

            var dhcpuser = data.wifi_sta_info_24g.wifi_sta_data[i];
            var ssid_index = parseInt(dhcpuser.ssid_index);
            var SSID = fhdecrypt(wifi_2g[ssid_index - 1].SSID);
            if (dhcpuser.AssociatedDeviceMACAddress == "") {
                continue
            }

            if (operator_name == "JOR_UMNIAH") {
                var hostname;
                var IPAddress;
                var flag = false
                for (var j = 0; j < g_host_data.length; j++) {
                    if (dhcpuser.AssociatedDeviceMACAddress.toUpperCase() == g_host_data[j].MACAddress.toUpperCase() && g_host_data[j].AccessType == "2.4G") {
                        hostname = g_host_data[j].HostName;
                        IPAddress = g_host_data[j].IPAddress;
                        flag = true;
                        break
                    }
                }
                if (!flag) {
                    continue
                }
                html += '<tr class="table_01">';
                html += '<td   style="text-align: center;">' + hostname + '</td>';
                html += '<td   style="text-align: center;">' + IPAddress + '</td>';
                html += '<td   style="text-align: center;">' + SSID + '</td>';
                html += '<td  style="text-align: center;">' + dhcpuser.AssociatedDeviceMACAddress.toUpperCase() + '</td>';
                html += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientSignalStrength + '</td>';
                html += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientTxRate + 'M' + '</td>';
                html += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientRxRate + 'M' + '</td>';
                html += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_SNR + '</td>';
                html += '</tr>';
            } else {
                html += '<tr class="table_01">';
                html += '<td width="12%" style="text-align: center;">' + SSID + '</td>';
                html += '<td width="13%" style="text-align: center;">' + dhcpuser.AssociatedDeviceMACAddress + '</td>';
                html += '<td width="13%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_UpTime + '</td>';
                html += '<td width="17%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientTxRate / 1000 + '</td>';
                html += '<td width="17%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientRxRate / 1000 + '</td>';
                html += '<td width="12%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientSignalStrength + '</td>';
                if (operator_name == "PAK_CYBERNET") {
                    if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -100 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -81) {
                        html += '<td width="7%" style="text-align: center;">' + 'Lousy' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -80 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -71) {
                        html += '<td width="7%" style="text-align: center;">' + 'Weak' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -70 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -61) {
                        html += '<td width="7%" style="text-align: center;">' + 'Normal' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -60 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -31) {
                        html += '<td width="7%" style="text-align: center;">' + 'Strong' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -30 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= 0) {
                        html += '<td width="7%" style="text-align: center;">' + 'Amazing' + '</td>';
                    }

                }
                html += '<td width="13%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_Noise + '</td>';
                html += '<td width="12%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_SNR + '</td>';
                html += '<td width="13%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_SignalQuality + '</td>';
                html += '</tr>';
            }
        }
    }
    $("#user_list").append(html);
}

function sta_info_5g(data) {
    var html5g = [];
    $("#user_5glist").empty();
    if (data && data.wifi_sta_info_5g) {
        for (var i = 0; i < data.wifi_sta_info_5g.wifi_sta_data.length; i++) {
            var dhcpuser = data.wifi_sta_info_5g.wifi_sta_data[i];
            var ssid_index = parseInt(dhcpuser.ssid_index);
            var SSID = fhdecrypt(wifi_5g[ssid_index - wifi_5g_index].SSID)
            if (dhcpuser.AssociatedDeviceMACAddress == "") {
                continue
            }
            if (operator_name == "JOR_UMNIAH") {
                var hostname;
                var IPAddress;
                var flag = false;
                for (var j = 0; j < g_host_data.length; j++) {
                    if (dhcpuser.AssociatedDeviceMACAddress.toUpperCase() == g_host_data[j].MACAddress.toUpperCase() && g_host_data[j].AccessType == "5G") {
                        hostname = g_host_data[j].HostName;
                        IPAddress = g_host_data[j].IPAddress;
                        flag = true;
                        break
                    }
                }
                if (!flag) {
                    continue
                }
                html5g += '<tr class="table_01">';
                html5g += '<td   style="text-align: center;">' + hostname + '</td>';
                html5g += '<td   style="text-align: center;">' + IPAddress + '</td>';
                html5g += '<td   style="text-align: center;">' + SSID + '</td>';
                html5g += '<td  style="text-align: center;">' + dhcpuser.AssociatedDeviceMACAddress.toUpperCase() + '</td>';
                html5g += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientSignalStrength + '</td>';
                html5g += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientTxRate + 'M' + '</td>';
                html5g += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientRxRate + 'M' + '</td>';
                html5g += '<td  style="text-align: center;">' + dhcpuser.X_FH_WLAN_SNR + '</td>';
                html5g += '</tr>';
            }
            else {
                html5g += '<tr class="table_01">';
                html5g += '<td width="12%" style="text-align: center;">' + SSID + '</td>';
                html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.AssociatedDeviceMACAddress + '</td>';
                html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_UpTime + '</td>';
                html5g += '<td width="17%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientTxRate / 1000 + '</td>';
                html5g += '<td width="17%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientRxRate / 1000 + '</td>';
                html5g += '<td width="12%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_ClientSignalStrength + '</td>';
                if (operator_name == "PAK_CYBERNET") {
                    if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -100 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -81) {
                        html5g += '<td width="7%" style="text-align: center;">' + 'Lousy' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -80 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -71) {
                        html5g += '<td width="7%" style="text-align: center;">' + 'Weak' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -70 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -61) {
                        html5g += '<td width="7%" style="text-align: center;">' + 'Normal' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -60 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= -31) {
                        html5g += '<td width="7%" style="text-align: center;">' + 'Strong' + '</td>';
                    }
                    else if (dhcpuser.X_FH_WLAN_ClientSignalStrength >= -30 && dhcpuser.X_FH_WLAN_ClientSignalStrength <= 0) {
                        html5g += '<td width="7%" style="text-align: center;">' + 'Amazing' + '</td>';
                    } else {
                        html5g += '<td width="7%" style="text-align: center;">' + 'Amazing' + '</td>';
                    }

                }
                html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_Noise + '</td>';
                html5g += '<td width="12%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_SNR + '</td>';
                html5g += '<td width="13%" style="text-align: center;">' + dhcpuser.X_FH_WLAN_SignalQuality + '</td>';
                html5g += '</tr>';
            }
        }
    }
    $("#user_5glist").append(html5g);
}

