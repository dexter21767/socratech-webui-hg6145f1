$(document).ready(function(){
	//优化滚动条，无需改动
	// //customScrollBar("html");
	 showLog();
});

function parseDate(data)
{
	loadLog(data);
}

function showLog()
{
	var postdata = new Object();
	postdata.action = "showlog";
	XHR.post("syslog_inter", postdata, parseDate);
}

function loadLog(data)
{
	var dynamicHTML = "";
	var dynamicHTML_old ="";
	/*var isEven; //是否是偶数行
	var tr069ip = "";
	
	//get tr069 wan ip
	XHR.get("get_allwan_info", null, function(getdata)
	{	
		if ( getdata && getdata.wan )
		{
			var wanAarry = getdata.wan;
			if ( wanAarry.length > 0 )
			{
				for (var i=0; i<wanAarry.length; i++ )
				{
					var singleWan = wanAarry[i];
					if ( singleWan.Name.toUpperCase().indexOf("TR069") >=0 )
					{
						if ( singleWan.IPMode == 1 || singleWan.IPMode == 3 ) //ipv4
						{
							if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
							{
								tr069ip = "";
							}
							else
							{
								if ( singleWan.ConnectionStatus == 'Connected' || singleWan.AddressingType == 'Static' )
								{
									tr069ip = singleWan.ExternalIPAddress;
								}
							}
						}
						
						if ( singleWan.IPMode == 2 ) //ipv6
						{
							if ( singleWan.ConnectionType == 'PPPoE_Bridged' )
							{
								tr069ip = "";
							}
							else
							{
								if ( singleWan.IPv6ConnStatus == 'Connected' || singleWan.IPv6IPAddressOrigin == 'Static' )
								{
									tr069ip = singleWan.IPv6IPAddress;
								}
							}
						}
					}
				}
			}
		}
	});*/
	
	dynamicHTML += 'Manufacturer: ' + data.Manufacturer + '&#13;&#10;';
	dynamicHTML += 'ProductClass: ' + data.ProductClass + '&#13;&#10;';
	dynamicHTML += 'SerialNumber: ' + data.SerialNumber + '&#13;&#10;';
	dynamicHTML += 'ONU IP: ' + data.IP + '&#13;&#10;';
	dynamicHTML += 'HWVer: ' + data.HWVer + '&#13;&#10;';
	dynamicHTML += 'SWVer: ' + data.SWVer + '&#13;&#10;&#13;&#10;';
	for( var i=1; i<=data.logcount; i++ )
	{
        dynamicHTML_old =  eval("data.log" + i) + '&#13;&#10;';
        dynamicHTML_old = dynamicHTML_old.replace("(none) daemon.alert","");
        dynamicHTML_old = dynamicHTML_old.replace("(none) user.alert","");	  
        dynamicHTML_old = dynamicHTML_old.replace("[IDN_Log]","");
        dynamicHTML += dynamicHTML_old;
	}
	$("#logtable").html(dynamicHTML);
}