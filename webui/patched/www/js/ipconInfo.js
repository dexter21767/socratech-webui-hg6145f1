
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
		getDataByAjax("../fake/wan_info", parseWanData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_allwan_info", null, parseWanData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseWanData(getdata)
{
	var ipv4HTML = '';
	var ipv6HTML = '';
	var paltresult = -1;
	
	if ( getdata && getdata.wan )
	{
		var wanAarry = getdata.wan;
		
		paltresult = getdata.plat_result; //0-omici;1-tr069
		
		if ( wanAarry.length > 0 )
		{
			for (var i=0; i<wanAarry.length; i++ )
			{
				var singleWan = wanAarry[i];
	
				if(paltresult != 'undefined' && paltresult == 0 && singleWan.ServiceList.indexOf('VOIP') > -1)
				{
					continue;
				}
				else
				{
					if ( singleWan.IPMode == 1 || singleWan.IPMode == 3 ) //ipv4
					{
						ipv4HTML += '<tr>';
						// 连接名称
						ipv4HTML += '<td>' + singleWan.Name + '</td>';
						// 使能状态
						if ( singleWan.Enable == 1 )
						{
							ipv4HTML += '<td>启用</td>';
						}
						else
						{
							ipv4HTML += '<td>未启用</td>';
						}
						// 连接状态
						if ( singleWan.ConnectionStatus == 'Unconfigured' )
						{
							ipv4HTML += '<td>未连接</td>';
						}
						else if ( singleWan.ConnectionStatus == 'Connecting' || singleWan.ConnectionStatus == 'Authenticating')
						{
							ipv4HTML += '<td>连接中</td>';
						}
						else if ( singleWan.ConnectionStatus == 'Connected' )
						{
							ipv4HTML += '<td>已连接</td>';
						}
						else if ( singleWan.ConnectionStatus == 'Disconnected' )
						{
							ipv4HTML += '<td>连接失败</td>';
						}
						else
						{
							ipv4HTML += '<td>未连接</td>';
						}
						// 地址获取方式
						if ( singleWan.AddressingType.toUpperCase() == "PPPOE" )
						{
							ipv4HTML += '<td>PPPoE</td>';
						}
						else
						{
							ipv4HTML += '<td>' + singleWan.AddressingType + '</td>';
						}
						
						if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
						{
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
							ipv4HTML += '<td></td>';
						}
						else
						{
							if ( singleWan.ConnectionStatus == 'Connected' || singleWan.AddressingType == 'Static' )
							{
								ipv4HTML += '<td>' + singleWan.ExternalIPAddress + '</td>';
								if ( singleWan.AddressingType.toUpperCase() == 'PPPOE' )
								{
									ipv4HTML += '<td>255.255.255.255</td>';
									ipv4HTML += '<td>' + singleWan.RemoteIPAddress + '</td>';
								}
								else
								{
									ipv4HTML += '<td>' + singleWan.SubnetMask + '</td>';
									ipv4HTML += '<td>' + singleWan.DefaultGateway + '</td>';
								}
								if ( singleWan.DNSSevers == '' )
								{
									ipv4HTML += '<td></td>';
									ipv4HTML += '<td></td>';
								}
								else
								{
									var dns = singleWan.DNSServers + ',';
									ipv4HTML += '<td>' + dns.split(',')[0] + '</td>';
									ipv4HTML += '<td>' + dns.split(',')[1] + '</td>';
								}
							}
							else
							{
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
								ipv4HTML += '<td></td>';
							}
						}
						ipv4HTML += '</tr>';
					}
					
					if ( singleWan.IPMode == 2 || singleWan.IPMode == 3 ) //ipv6
					{
						ipv6HTML += '<tr>';
						// 连接名称
						ipv6HTML += '<td>' + singleWan.Name + '</td>';
						// 使能状态
						if ( singleWan.Enable == 1 )
						{
							ipv6HTML += '<td>启用</td>';
						}
						else
						{
							ipv6HTML += '<td>未启用</td>';
						}
						// 连接状态
						if ( singleWan.IPv6ConnStatus == 'Unconfigured' )
						{
							ipv6HTML += '<td>未连接</td>';
						}
						else if ( singleWan.IPv6ConnStatus == 'Connecting' || singleWan.IPv6ConnStatus == 'Authenticating')
						{
							ipv6HTML += '<td>连接中</td>';
						}
						else if ( singleWan.IPv6ConnStatus == 'Connected' )
						{
							ipv6HTML += '<td>已连接</td>';
						}
						else if ( singleWan.IPv6ConnStatus == 'Disconnected' )
						{
							ipv6HTML += '<td>连接失败</td>';
						}
						else
						{
							ipv6HTML += '<td>未连接</td>';
						}
						if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
						{
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
							ipv6HTML += '<td></td>';
						}
						else
						{
							// 前缀获取方式
							ipv6HTML += '<td>' + singleWan.IPv6PrefixOrigin + '</td>';
							// IP获取方式
							// ipv6HTML += '<td>' + singleWan.AddressingType + '</td>';
							ipv6HTML += '<td>' + singleWan.IPv6IPAddressOrigin + '</td>';
							// IP地址状态
							if ( singleWan.MFlag == 1 )
							{
								ipv6HTML += '<td>有状态</td>';
							}
							else
							{
								ipv6HTML += '<td>无状态</td>';
							}
							if ( singleWan.IPv6ConnStatus == 'Connected' || singleWan.IPv6IPAddressOrigin == 'Static' )
							{
								ipv6HTML += '<td>' + singleWan.IPv6Prefix + '</td>';
								ipv6HTML += '<td>' + singleWan.IPv6IPAddress + '</td>';
								if ( singleWan.IPv6DNSServers == '' )
								{
									ipv6HTML += '<td></td>';
									ipv6HTML += '<td></td>';
								}
								else
								{
									var v6dns = singleWan.IPv6DNSServers + ',';
									ipv6HTML += '<td>'+ v6dns.split(',')[0] +'</td>';
									ipv6HTML += '<td>'+ v6dns.split(',')[1] +'</td>';
								}
							}
							else
							{
								ipv6HTML += '<td></td>';
								ipv6HTML += '<td></td>';
								ipv6HTML += '<td></td>';
								ipv6HTML += '<td></td>';
							}
						}
						if ( singleWan.Dslite_Enable == '1' )
						{
							ipv6HTML += '<td>' + singleWan.Aftr + '</td></tr>';
						}
						else
						{	
							ipv6HTML += '<td></td></tr>';
						}		
					}
				}
			}
		}
	}
	$("#wancfgv4").html(ipv4HTML);
	$("#wancfgv6").html(ipv6HTML);
}
