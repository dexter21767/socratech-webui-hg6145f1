var operator_name =  gOperatorName;
var login_user = gLoginUser;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_lan_status", null, parseGetData);
	}
}

function parseGetData(data)
{
	if(operator_name == "BZ_INTELBRAS")
	{
		$("#dhcp_userListPrompt").html("lan_userListPrompt".i18n());
		$("#dhcp_userListHead").html("lan_userListHead".i18n());
	}
	$("#user_list").empty();
	var html = [];
	if ( data && data.lan_status)
	{
		var j = 0;
		if(operator_name == "TH_AIS" || operator_name == "MY_TM" || operator_name == "PAK_CYBERNET")
		{
			$("#td_interface").show();
		}
		for (var i=0; i<data.lan_status.data.length; i++)
		{
			var dhcpuser = data.lan_status.data[i];
			if (dhcpuser.AddressSource == "DHCP" || operator_name == "BZ_INTELBRAS")
			{
				
				var LeaseTimeRemaining = dhcpuser.LeaseTimeRemaining;
				var type;
				if(dhcpuser.AddressSource == "DHCP"){
					type = "Dynamic".i18n();
				}else{
					type = "Static".i18n();
				}
                if(dhcpuser.IPAddress == ""|| dhcpuser.IPAddress == null || isValidIpAddress(dhcpuser.IPAddress) == false){
                	continue;
                }
				if(dhcpuser.Active == "0"){
					continue;
				}
				if(LeaseTimeRemaining == "0"){
					continue;
				}
				if(operator_name == "TH_AIS" || operator_name == "MY_TM" || operator_name == "PAK_CYBERNET")
				{
					var index = dhcpuser.Layer2Interface.split('.')[4];
					var interface;
					var ssid_no;
				
					if(dhcpuser.Layer2Interface.indexOf("LANEthernetInterfaceConfig") >= 0)//LAN
					{
						ssid_no = index;
						interface = "LAN" + ssid_no;
					}
					else if(dhcpuser.Layer2Interface.indexOf("WLANConfiguration") >= 0)//wifi
					{
						if(data.lan_status.wifi_num_all == 16 && data.lan_status.ssid_display_num == 8
							&& data.lan_status.wifi_5g_enable == 1 && index > 8)
						{
						    if (16 == index)
					    	{
					    	    ssid_no = 9;
					    	}
							else
							{
								ssid_no = index - 4;
							}
						}
						else
						{
							ssid_no = index;
						}
						interface = "SSID" + ssid_no;
					}

					if(login_user == 0 && ssid_no == 9)
					{
						continue;
					}
				}
			
				if (gNewUiFlag)
					html += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
				else
				html += '<tr class="table_01">';
				j++;
				html += '<td style="text-align: center;">'+j+'</td>';
				html += '<td style="text-align: center;">'+dhcpuser.HostName+'</td>';
				if(operator_name == "TH_AIS" || operator_name == "MY_TM" || operator_name == "PAK_CYBERNET")
				{
                 
					html += '<td style="text-align: center;">'+interface+'</td>';
				}
                if(operator_name == "TH_AIS" && dhcpuser.HostName == "HG6145F3")
                {
                    var mac_init = dhcpuser.MACAddress.replace(/:/g,'');
                   // console.log(mac_init);
                    var mac = parseInt(mac_init,16);
                    var aa = mac +1;
                    var mac_16 = aa.toString(16);
                    var mac_upper = mac_16.toUpperCase();
                    var mac_complete = mac_upper.substr(0,2)+":" +mac_upper.substr(2,2)+":"+mac_upper.substr(4,2)+":"+mac_upper.substr(6,2)+":"+ 
                                       mac_upper.substr(8,2)+":"+mac_upper.substr(10,2);
                    //console.log(mac_complete);
                    html += '<td style="text-align: center;">'+mac_complete+'</td>';
                }else
                {
                    html += '<td style="text-align: center;">'+dhcpuser.MACAddress+'</td>';
                }
				if(operator_name == "PAK_CYBERNET" && dhcpuser.IPv6Address != "")
				{
					html += '<td style="text-align: center;">'+dhcpuser.IPAddress+'<br>'+dhcpuser.IPv6Address+'</td>';
				}
				else
				{
					html += '<td style="text-align: center;">'+dhcpuser.IPAddress+'</td>';
				}
				html += '<td style="text-align: center;">'+LeaseTimeRemaining+'</td>';
				html += '<td style="text-align: center;">'+type+'</td>';
				html += '</tr>';
			}
		}
        if (gNewUiFlag){
        if (j == 0)
			$("#image").show();
		else
			$("#image").hide();
        }
		
	} 
	else {
		if (gNewUiFlag)
			$("#image").show();
	}
	$("#user_list").append(html);
}
