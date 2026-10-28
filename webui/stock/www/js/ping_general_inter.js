var all_wan_info;
var	all_wan_info_new = '';
var operator_name = gOperatorName;
var wan_num = 0;
var select_wan_index = 0;
var connection;

$(document).ready(function(){
	$("#pingbtn").val("diagnosis_apply".i18n());
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
	}

   
    
});

function initPage(getdata)
{
	XHR.get("get_login_user", null, function(data){
		if ( data.sessionid != undefined )
		{
			sessionidstr = data.sessionid;
		}
	});

	if(gOperatorName == "MEX_TELMEX"){
		$(".main_item_name").css("width","30%");
		$(".main_item_content").css("width","calc(70% - 3px)");
	}
	if ( getdata )
	{
		all_wan_info = getdata;
	}
	
	var dynamicHtml = '';
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}

	if ( wan_num > 0 )
	{
		for ( var i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			if(single_wan.IPMode == 1 ){
				if ( single_wan.Name.indexOf('_R_') >= 0 && (single_wan.ExternalIPAddress != "0.0.0.0"
					&& single_wan.ExternalIPAddress != "255.255.255.255" 
					&& single_wan.ExternalIPAddress != "")  )
				{
					dynamicHtml += '<option  name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
			}else if(single_wan.IPMode == 2){
				if ( single_wan.Name.indexOf('_R_') >= 0 && (
					 single_wan.IPv6IPAddress != "")  )
				{
					dynamicHtml += '<option name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
			}else if(single_wan.IPMode == 3){
				if ( single_wan.Name.indexOf('_R_') >= 0 &&( (single_wan.ExternalIPAddress != "0.0.0.0"
					&& single_wan.ExternalIPAddress != "255.255.255.255" 
					&& single_wan.ExternalIPAddress != "") || (
					 single_wan.IPv6IPAddress != "" ) )  )
				{
					dynamicHtml += '<option name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
				
			}
					
		}
	}
	$("#wan_connect").html(dynamicHtml);
	
}

function saveApply()
{
	show_shadow();
	stopflag = 0;
	var postdata = new Object();
	for(var i=0; i< wan_num; i++)
	{	var select_wan = all_wan_info.wan[i];
		if($("#wan_connect").val() == select_wan.WAN_url)
		{
			select_wan_index = i;
			break;
		}
	}	
	if(all_wan_info.wan[select_wan_index].IPMode == 2)
	{
		postdata.address = all_wan_info.wan[select_wan_index].DefaultIPv6Gateway;
		connection  = all_wan_info.wan[select_wan_index].IPv6ConnStatus;
		
	}else{
		postdata.address = all_wan_info.wan[select_wan_index].DefaultGateway;
		connection  = all_wan_info.wan[select_wan_index].ConnectionStatus;
	}
	var ipversion = all_wan_info.wan[select_wan_index].IPMode;
	var pri_dns = all_wan_info.wan[select_wan_index].DNSServers.split(",")[0];
	var sec_dns = all_wan_info.wan[select_wan_index].DNSServers.split(",")[1];
	var pri_dns_ipv6 = all_wan_info.wan[select_wan_index].IPv6DNSServers.split(",")[0];
	var sec_dns_ipv6 = all_wan_info.wan[select_wan_index].IPv6DNSServers.split(",")[1];

	postdata.count = 4;
	var wan_url = $("#wan_connect").val();
	postdata.WAN_url = wan_url;
	postdata.sessionid = sessionidstr;
	postdata.X_FH_WhoRequest = "web";
	postdata.IPVersion = ipversion;

	XHR.post("do_ping", postdata, showGatewayPingResult);

	setTimeout(function(){
			var postdata2 = new Object();
			if(ipversion == 2)
			{
				postdata2.address = pri_dns_ipv6;
			}else{
				postdata2.address = pri_dns;;
			}
			postdata2.count = 4;
			postdata2.WAN_url = wan_url;
			postdata2.sessionid = sessionidstr;
			postdata2.X_FH_WhoRequest = "web";
			postdata2.IPVersion = ipversion;
			XHR.post("do_ping", postdata2, showDNSServerPingResult);
	},1000);
	
	setTimeout(function(){
			var postdata3 = new Object();
			if(ipversion == 2)
			{
				postdata3.address = sec_dns_ipv6;
			}else{
				postdata3.address = sec_dns;
			}
			postdata3.count = 4;
			postdata3.WAN_url = wan_url;
			postdata3.sessionid = sessionidstr;
			postdata3.X_FH_WhoRequest = "web";
			postdata3.IPVersion = ipversion;
			XHR.post("do_ping", postdata3, showSecDNSServerPingResult);
	},1500);

	if(gOperatorName == "MEX_TELMEX"){
		$("#ping_result").show();
		if (all_wan_info.wan[select_wan_index].AddressingType.toUpperCase() != "PPPOE"){
			$("#pppoe_state_tr").hide();
		}else{
			$("#pppoe_state_tr").show();
			if(all_wan_info.wan[select_wan_index].LastConnectionError == "ERROR_NONE")
			{
				$("#pppoe_state_result").html("Connected".i18n());
			}else{
				$("#pppoe_state_result").html("Disconnected".i18n());
			}
		}
	}
	
}

function showGatewayPingResult(data)
{
	if (data.pingcmd == "success")	
	{
		XHR.get("get_ping_result", null, function(data){
			if(data &&  data.SuccessCount >= 1 || connection == "Connected")
			{		
				$("#ping_gateway_result").html("Connected".i18n());
			}else{
				$("#ping_gateway_result").html("Disconnected".i18n());
			}
		});
	}
}

function showDNSServerPingResult(data)
{
	if (data.pingcmd == "success")	
	{
		XHR.get("get_ping_result", null, function(data){
			if(data && data.SuccessCount >= 1 || connection == "Connected")
			{		
				$("#ping_pri_dns_result").html("Connected".i18n());
			}else{
				$("#ping_pri_dns_result").html("Disconnected".i18n());
			}
		});
	}
}

function showSecDNSServerPingResult(data)
{
	if (data.pingcmd == "success")	
	{
		XHR.get("get_ping_result", null, function(data){
			if(data && data.SuccessCount >= 1 || connection == "Connected")
			{		
				$("#ping_sec_dns_result").html("Connected".i18n());
			}else{
				$("#ping_sec_dns_result").html("Disconnected".i18n());
			}
		});
	}
}



