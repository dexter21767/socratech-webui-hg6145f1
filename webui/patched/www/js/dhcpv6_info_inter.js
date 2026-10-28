var operator_name = gOperatorName;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_dhcpv6_info", null, parseGetData);
	}
}

function parseGetData(data)
{
	var usedIPNum = 0;
	if(operator_name == "BZ_ALGAR")
	{
		$("#tab_ip_addresses").hide();
		$("#br_id").hide();
		$("#tr_dhcp_userListHead").show();
	}
	
	$("#dhcpv6_info_list").empty();
	var html = "";
	if ( data && data.dhcpv6_info)
	{
		for (var i=0; i<data.dhcpv6_info.data.length; i++)
		{
			var dhcpuser = data.dhcpv6_info.data[i];

			if( dhcpuser.AddressSource.toUpperCase() != "DHCP"){
				continue
			}

			if (dhcpuser.IPv6Address != "")
			{
				usedIPNum++;
				if (gNewUiFlag)
					html += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
				else
					html += '<tr class="table_01">';
				html += '<td style="text-align: center;">'+dhcpuser.Duid+'</td>';
				html += '<td style="text-align: center;">'+dhcpuser.IPv6Address+'</td>';
				html += '<td style="text-align: center;">'+dhcpuser.IPv6LeaseTimeRemaining+'</td>';
				html += '</tr>';
			}
			else if(operator_name == "BZ_ALGAR" && dhcpuser.Duid == "")
			{
				html += '<tr class="table_01">';
				html += '<td style="text-align: center;">'+ '--' +'</td>';
				html += '<td style="text-align: center;">'+ '--' +'</td>';
				html += '<td style="text-align: center;">'+ '--' +'</td>';
				html += '</tr>';
			}
			
		}
	}

	if(gNewUiFlag && usedIPNum != 0){
		$("#image").hide();
	}
	
	var total_ip_addr = data.total_ip_addr;	
	
    $("#total_ip_addresses").html(total_ip_addr);
    $("#remaining_ip_addresses").html(total_ip_addr - usedIPNum);
	
	$("#dhcpv6_info_list").append(html);
}
