$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
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
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	var portHTML = '';
	var hostHTML = '';
	if ( data && data.lan_status )
	{
		var landata = data.lan_status;
		for (i=1; i<=landata.max_lan_host_num; i++)
		{
			if ( eval('landata.MACAddress' + i) )
			{
				hostHTML += '<tr>';
				hostHTML += '<td>' + eval('landata.IPAddress' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.MACAddress' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.DeviceType' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.HostName' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.DevName' + i) + '</td>';
				var portid = eval('landata.portid' + i);
				var place;
				if ( portid.indexOf(gLanPortHead) >= 0 )
				{
					portid = "LAN" + portid.substr(gLanPortHead.length,1);
				}
				else if ( portid.indexOf(gWifiPortHead) >= 0 )
				{
					portid = "SSID" + portid.substr(gWifiPortHead.length,1);
				}
				hostHTML += '<td>' + portid + '</td>';
				
				var day = parseInt(eval('landata.LeaseTimeRemaining' + i)/86400);
				var day2 = eval('landata.LeaseTimeRemaining' + i)%86400;
				var hours = parseInt(day2/3600);
				var hours2 = day2%3600;
				var minutes = parseInt(hours2/60);
				var minutes2 = hours2%60;
				var second = eval('landata.LeaseTimeRemaining' + i)%60;
				hostHTML += '<td>' + day + '天' + hours + '时' + minutes + '分' + second + '秒</td>';
				hostHTML += '<td>' + eval('landata.Brand' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.OS' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.RxBytes' + i) + '</td>';
				hostHTML += '<td>' + eval('landata.TxBytes' + i) + '</td>';
				if ( eval('landata.Active' + i) == 1 )
				{
					hostHTML += '<td>在线</td>';
				}
				else
				{
					hostHTML += '<td>离线</td>';
				}
				hostHTML += '</tr>';
			}
		}
		
		for (i=1; i<=landata.lan_port_num; i++)
		{
			portHTML += '<tr>';
			portHTML += '<td>' + i + '</td>';
			if ( eval('landata.Status' + i) == "Up" )
			{
				if ( eval('landata.LinkDuplex' + i) == "Full" )
				{
					portHTML += '<td>全双工</td>';
				}
				else if ( eval('landata.LinkDuplex' + i) == "Half" )
				{
					portHTML += '<td>半双工</td>';
				}
				else
				{
					portHTML += '<td>自动协商</td>';
				}
				portHTML += '<td>' + eval('landata.LinkSpeed' + i) + '</td>';
				portHTML += '<td>已连接设备</td>';
				portHTML += '<td>' + eval('landata.BytesReceived' + i) + '</td>';
				portHTML += '<td>' + eval('landata.PacketsReceived' + i) + '</td>';
				portHTML += '<td>' + eval('landata.BytesSent' + i) + '</td>';
				portHTML += '<td>' + eval('landata.PacketsSent' + i) + '</td>';
			}
			else
			{
				portHTML += '<td></td>';
				portHTML += '<td></td>';
				portHTML += '<td>未连接设备</td>';
				portHTML += '<td></td>';
				portHTML += '<td></td>';
				portHTML += '<td></td>';
				portHTML += '<td></td>';
			}
			portHTML += '</tr>';
		}
	}
	
	$("#port_info").html(portHTML);
	$("#lan_host").html(hostHTML);
}
