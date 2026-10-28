var conntype = "";
var sessionidstr = "";
var default_route_data = 
{
    "wan_index":"1",
    "wan_session_index":"1",
    "wan_iporppp_old":2,
    "wan_iporppp_new":"2",
    "ConnectionType":"PPPoE_Routed",
    "ServiceList":"INTERNET",
    "IPMode":"3",
    "mtu":"1492",
    "VLANEnabled":2,
    "vlanid":"100",
    "p8021":"1",
    "LanInterface":"dev.eth.1,dev.eth.2,dev.eth.3,dev.eth.4,dev.wla.1,dev.wla.5",
    "AddressingType":"PPPoE",
    "ExternalIPAddress":"",
    "SubnetMask":"",
    "DefaultGateway":"",
    "DNSServers":"",
    "Username":"guest",
    "WPd":"Z3Vlc3Q=",
    "ConnectionTrigger":"AlwaysOn",
    "pppProxyEnable":"NULL",
    "pppMAXUser":"NULL",
    "pppToBridge":"0",
    "IPv6PrefixDelegationEnabled":1,
    "IPv6PrefixOrigin":"PrefixDelegation",
    "IPv6IPAddressOrigin":"DHCPv6",
    "Dslite_Enable":0,
    "NATEnabled":"1",
    "sessionid":"by62E5B2"
};
var default_bridge_data =
{
    "wan_index":"1",
    "wan_session_index":"1",
    "wan_iporppp_old":2,
    "wan_iporppp_new":"2",
    "ConnectionType":"PPPoE_Bridged",
    "ServiceList":"INTERNET",
    "IPMode":"3",
    "mtu":"1500",
    "VLANEnabled":2,
    "vlanid":"100",
    "p8021":"1",
    "LanInterface":"dev.eth.1,dev.eth.2,dev.eth.3,dev.eth.4,dev.wla.1,dev.wla.5",
    "AddressingType":"",
    "pppProxyEnable":"NULL",
    "pppMAXUser":"NULL",
    "pppToBridge":"NULL",
    "IPv6PrefixDelegationEnabled":1,
    "IPv6PrefixOrigin":"PrefixDelegation",
    "IPv6IPAddressOrigin":"DHCPv6",
    "Dslite_Enable":0,
    "NATEnabled":"0",
    "sessionid":"099FLGk6"
};
$(function(){
	XHR.get("get_operator_test", null, function(data){
		if ( data )
		{
			sessionidstr = data.sessionid;
		}
	});
	$("#live_tim_roteador").click(function(){
		conntype = "route";
		XHR.get("timwizardwan_conntype", null, parseWizardData);	
	});
	$("#live_tim_bridge").click(function(){
		conntype = "bridge";
		XHR.get("timwizardwan_conntype", null, parseWizardData);	
	});
	function parseWizardData(data){
		if(data && data.result != undefined){
			var result = data.result;
			if(result == 0){
				var ConnectionType = data.ConnectionType;
				var wan_index = data.wan_index;
				var wan_session_index = data.wan_session_index;
				var vlanid = data.vlanid;
				var p8021 = data.p8021;
				var LanInterface = data.LanInterface;
				var mtu = data.mtu;
				var AddressingType = data.AddressingType;
				if(conntype == "route"){
					default_route_data.wan_index = wan_index;
					default_route_data.wan_session_index = wan_session_index;
					default_route_data.vlanid = vlanid;
					default_route_data.p8021 = p8021;
					default_route_data.LanInterface = LanInterface;
					if(ConnectionType.indexOf("Routed") > -1 && mtu <= 1492){
						default_route_data.mtu = mtu;
					}
					if(AddressingType == "DHCP" || AddressingType == "Static"){
						default_route_data.wan_iporppp_old = 1;
					}
					default_route_data.sessionid = sessionidstr;
					wan_modify_internet("Routed");
				}else if(conntype == "bridge"){
					default_bridge_data.wan_index = wan_index;
					default_bridge_data.wan_session_index = wan_session_index;
					default_bridge_data.vlanid = vlanid;
					default_bridge_data.p8021 = p8021;
					if(AddressingType == "DHCP" || AddressingType == "Static"){
						default_bridge_data.wan_iporppp_old = 1;
					}
					default_bridge_data.sessionid = sessionidstr;
					var lan_str = "dev.eth.2,dev.eth.3,dev.eth.4";
					var ssid_str = LanInterface.replace("dev.eth.1,", "");
					ssid_str = ssid_str.replace("dev.eth.2,", "");
					ssid_str = ssid_str.replace("dev.eth.3,", "");
					ssid_str = ssid_str.replace("dev.eth.4,", "");
					default_bridge_data.LanInterface = lan_str + (ssid_str? (","+ssid_str):"");
					wan_modify_internet("Bridged");
				}
			}else if(result == -1){
				if(conntype == "route"){
					window.location.href="page_06.html";
				}else if(conntype == "bridge"){
					window.location.href="page_08.html";
				}
			}
		}
	}
});

function wan_modify_internet(mode){
	if(conntype == "route"){
		XHR.post("wan_modify", default_route_data, function(){
			window.location.href="page_04.html";
		});
	}else if(conntype == "bridge"){
		XHR.post("wan_modify", default_bridge_data, checkConn);
	}
}

function checkConn(){
	XHR.get("get_allwan_info", null, function(data){
		if(data && data.wan != undefined){
			var wanAarry = data.wan;
			var conn_ok = false;
			if(wanAarry.length > 0){
				for(var i=0; i<wanAarry.length; i++){
					var singleWan = wanAarry[i];
					if(singleWan.ServiceList == "INTERNET" && singleWan.ConnectionType.indexOf("Bridged") > -1){
						if(singleWan.ConnectionStatus == 'Connected'){
							conn_ok = true;
						}
					}
				}
			}
			if(conn_ok){
				window.location.href="page_07.html";
			}else{
				window.location.href="page_08.html";
			}
	    }
	});
}