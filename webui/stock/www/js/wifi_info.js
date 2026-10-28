
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
		getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_wifi_status", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	packinfoHTML = '';
	ssidinfoHTML = '';
	
	if ( data && data.wifi_status )
	{
		var wifidata = data.wifi_status;
		if ( wifidata.wifi_5g_support == 1 )
		{
			if ( wifidata.totalenable2g == 1 || wifidata.totalenable5g == 1)
			{
				$("#enable").html("开启");
			}
			else
			{
				$("#enable").html("关闭");
			}
		}
		else
		{
			if ( wifidata.totalenable2g == 1 )
			{
				$("#enable").html("开启");
			}
			else
			{
				$("#enable").html("关闭");
			}
		}
		$("#channel").html(wifidata.channel);
		
		for ( i=1; i<=2; i++ )
		{
			if ( eval("wifidata.ConfigActive" + i) == 1 )
			{
				packinfoHTML += '<tr>';
				// packinfoHTML += '<td>' + i + '</td>';
				if ( i <= 1 ) //2g wifi
				{
					packinfoHTML += '<td>2.4G-' + i + '</td>';
				}
				else //5g wifi
				{
					packinfoHTML += '<td>5G-' + (i-1) + '</td>';
				}
				packinfoHTML += '<td>' + eval("wifidata.SSID" + i) + '</td>';
				packinfoHTML += '<td>' + eval("wifidata.TotalBytesReceived" + i) + '</td>';
				packinfoHTML += '<td>' + eval("wifidata.TotalPacketsReceived" + i) + '</td>';
				packinfoHTML += '<td>' + eval("wifidata.TotalBytesSent" + i) + '</td>';
				packinfoHTML += '<td>' + eval("wifidata.TotalPacketsSent" + i) + '</td>';
				packinfoHTML += '</tr>';
				
				ssidinfoHTML += '<tr>';
				// ssidinfoHTML += '<td>' + i + '</td>';
				if ( i <= 1 ) //2g wifi
				{
					ssidinfoHTML += '<td>2.4G-' + i + '</td>';
				}
				else //5g wifi
				{
					ssidinfoHTML += '<td>5G-' + (i-1) + '</td>';
				}
				ssidinfoHTML += '<td>' + eval("wifidata.SSID" + i) + '</td>';
				if ( eval("wifidata.BeaconType" + i) == "None" )
				{
					ssidinfoHTML += '<td>未配置</td>';
				}
				else
				{
					ssidinfoHTML += '<td>已配置</td>';
				}
				
				if ( eval("wifidata.BasicAuthenticationMode" + i) == "OpenSystem" && eval("wifidata.BeaconType" + i) == "None" )
				{
					ssidinfoHTML += '<td>None</td>';
				}
				else if ( ( eval("wifidata.BasicAuthenticationMode" + i) == "OpenSystem" 
							|| eval("wifidata.BasicAuthenticationMode" + i) == "SharedKey"
							|| eval("wifidata.BasicAuthenticationMode" + i) == "Both" )
						&& eval("wifidata.BeaconType" + i) == "Basic" )
				{
					ssidinfoHTML += '<td>WEP</td>';
				}
				else if ( eval("wifidata.BeaconType" + i) == "WPA" )
				{
					ssidinfoHTML += '<td>WPA Pre-Share Key</td>';
				}
				else if ( eval("wifidata.BeaconType" + i) == "11i" || eval("wifidata.BeaconType" + i) == "WPA2")
				{
					ssidinfoHTML += '<td>WPA2 Pre-Share Key</td>';
				}
				else if ( eval("wifidata.BeaconType" + i) == "WPA/WPA2" || eval("wifidata.BeaconType" + i) == "WPAand11i" )
				{
					ssidinfoHTML += '<td>WPA/WPA2 Pre-Share Keys</td>';
				}
				else
				{
					ssidinfoHTML += '<td></td>';
				}
				
				if ( eval("wifidata.WPAEncryptionModes" + i) == "AES" || eval("wifidata.WPAEncryptionModes" + i) == "AESEncryption" )
				{
					ssidinfoHTML += '<td>AES</td>';
				}
				else if ( eval("wifidata.WPAEncryptionModes" + i) == "TKIP" || eval("wifidata.WPAEncryptionModes" + i) == "TKIPEncryption")
				{
					ssidinfoHTML += '<td>TKIP</td>';
				}
				else if ( eval("wifidata.WPAEncryptionModes" + i) == "AES+TKIP" || eval("wifidata.WPAEncryptionModes" + i) == "TKIPandAESEncryption" || eval("wifidata.WPAEncryptionModes" + i) == "TKIP+AESEncryption")
				{
					ssidinfoHTML += '<td>TKIP&AES</td>';
				}
				else
				{
					ssidinfoHTML += '<td></td>';
				}
				ssidinfoHTML += '</tr>';
			}
		}
	}
	
	$("#packinfo").html(packinfoHTML);
	$("#ssidinfo").html(ssidinfoHTML);
}
