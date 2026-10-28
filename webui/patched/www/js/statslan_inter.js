var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG"){
		$("#lan_mac_tr").css("display", "");
	}
	if(operator_name == "BZ_INTELBRAS"){
		$("#ipv6_global_addr_tr").css("display", "");
	}
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
		XHR.poll(gStatusFreshInterval, "get_ipv4_lan_info", null, parseGetData);
	}
}

function parseGetData(data)
{
	if ( data && data.lan_ipv4 )
	{
		var landata = data.lan_ipv4;
		$("#ip_addr").html(landata.IPInterfaceIPAddress);
		$("#lan_mast").html(landata.IPInterfaceSubnetMask);
		$("#lan_mac").html(landata.brmac);
		var Local_IPv6 = landata.Local_IPv6Address;
		$("#v6_addr").html(Local_IPv6);
		if(operator_name == "BZ_INTELBRAS")
		{
			$("#ipv6_global_addr").html(landata.ipv6globaladdress);
		}
	}
}
