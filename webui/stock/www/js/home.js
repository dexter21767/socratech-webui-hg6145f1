var operator_name = gOperatorName;
var multiAP;
var download_flag = 0;
var upload_flag = 0;
var globalipv6address;
var br0_mac;
var Interval;
var Interval_sec;
var beginOperateTime;
var endOperateTime;

$(document).ready(function(){

	getData();
	$("#cmn-toggle-1").bind("click", function(){
		submitWifiEnable(2);
	});
	
	$("#cmn-toggle-2").bind("click", function(){
		submitWifiEnable(5);
	});
	
	$(".title-label").css("width","130px");

	if(gOperatorMode == "3" && gOperatorName == "TH_AIS")
	{
		$("#cmn-toggle-1").attr("disabled", true);
		$("#cmn-toggle-2").attr("disabled", true);
	}
});

function getData()
{
	XHR.get( "get_base_info", null, parseBaseInfo);
	XHR.get( "get_lan_status", null, parsedhcpData);
	XHR.get( "get_wifi_status", null, parsewifiData);
	XHR.get("get_ipv6_lan", null, parseIPV6Data);
	XHR.get( "get_wifi_status_5G", null, parsewifi5GData);
	XHR.get( "get_allwan_info", null, parseWanData);
	XHR.get( "get_other_aisinfo", null, parseAISInfoData);
	XHR.get("get_multiAP_enable", null, multiInfo);
 	//XHR.get("get_speedtest_server", null, parseSpeedtestServer);
    XHR.get("get_qos_base_info", null, parseQosinfo);
}

function parseQosinfo(data)
{
    if(data.qos.Enable == "0"){
     $("#qos").html("Off");   
    }else{
      $("#qos").html("On");  
    }
    
}

function returnUploadSpeedFunc(data)
{	
	setTimeout("pause_back()", 18000);
	if(data.download_diagnostics_state == "Completed")
	{
		var total_bytes_received = data.total_bytes_received;
		var download_diagnostics_bomtime = data.download_diagnostics_bomtime;//0000-00-00T00:00:00.123456Z
		var download_diagnostics_eomtime = data.download_diagnostics_eomtime;
		
		console.log("total_bytes_received " + total_bytes_received);
		console.log("download_diagnostics_bomtime " + download_diagnostics_bomtime);
		console.log("download_diagnostics_eomtime " + download_diagnostics_eomtime);
		
		var ds_time_h = download_diagnostics_bomtime.split('T')[1].split('.')[0].split(':')[0];
		var ds_time_m = download_diagnostics_bomtime.split('T')[1].split('.')[0].split(':')[1];
		var ds_time_s = download_diagnostics_bomtime.split('T')[1].split('.')[0].split(':')[2];
		var ds_time_ms;
		if(download_diagnostics_bomtime.indexOf("Z") >= 0)
		{
			ds_time_ms = download_diagnostics_bomtime.split('T')[1].split('.')[1].split('Z')[0];
		}
		console.log("ds_time_h " + ds_time_h);
		console.log("ds_time_m " + ds_time_m);
		console.log("ds_time_s " + ds_time_s);
		console.log("ds_time_ms " + ds_time_ms);

		var de_time_h = download_diagnostics_eomtime.split('T')[1].split('.')[0].split(':')[0];
		var de_time_m = download_diagnostics_eomtime.split('T')[1].split('.')[0].split(':')[1];
		var de_time_s = download_diagnostics_eomtime.split('T')[1].split('.')[0].split(':')[2];
		var de_time_ms;
		if(download_diagnostics_eomtime.indexOf("Z") >= 0)
		{
			de_time_ms = download_diagnostics_eomtime.split('T')[1].split('.')[1].split('Z')[0];
		}
		
		console.log("de_time_h " + de_time_h);
		console.log("de_time_m " + de_time_m);
		console.log("de_time_s " + de_time_s);
		console.log("de_time_ms " + de_time_ms);

		var dtime = (parseInt(de_time_h - ds_time_h)*3600*1000000 + parseInt(de_time_m - ds_time_m)*60*1000000 + parseInt(de_time_s - ds_time_s)*1000000 + parseInt(de_time_ms- ds_time_ms));
		console.log("dtime " + dtime);
		var download_speed;
		if(dtime != 0)
		{
			download_speed = Number((total_bytes_received*8/dtime).toString().match(/^\d+(?:\.\d{0,2})?/));
			console.log("download_speed " + download_speed);
		}
		else
		{
			download_speed = "NA";
		}
		
		$("#download_speed").html(download_speed + " Mbps");
	}
	else
	{
		$("#download_speed").html("NA");
	}
	console.log("data.upload_diagnostics_state " + data.upload_diagnostics_state);
	if (data.upload_diagnostics_state != "Requested")
	{
		if(data.upload_diagnostics_state != "Completed")
		{
			alert("Upload Speed Test failed!");
		}
		if(data.upload_diagnostics_state == "Completed")
		{
			var upload_total_bytes_sent = data.upload_total_bytes_sent;
			var upload_diagnostics_bomtime = data.upload_diagnostics_bomtime;
			var upload_diagnostics_eomtime = data.upload_diagnostics_eomtime;

			console.log("upload_total_bytes_sent " + upload_total_bytes_sent);
			console.log("upload_diagnostics_bomtime " + upload_diagnostics_bomtime);
			console.log("upload_diagnostics_eomtime " + upload_diagnostics_eomtime);
			
			var us_time_h = upload_diagnostics_bomtime.split('T')[1].split('.')[0].split(':')[0];
			var us_time_m = upload_diagnostics_bomtime.split('T')[1].split('.')[0].split(':')[1];
			var us_time_s = upload_diagnostics_bomtime.split('T')[1].split('.')[0].split(':')[2];
			var us_time_ms;
			if(upload_diagnostics_bomtime.indexOf("Z") >= 0)
			{
				us_time_ms = upload_diagnostics_bomtime.split('T')[1].split('.')[1].split('Z')[0];
			}
			console.log("us_time_h " + us_time_h);
			console.log("us_time_m " + us_time_m);
			console.log("us_time_s " + us_time_s);
			console.log("us_time_ms " + us_time_ms);

			var ue_time_h = upload_diagnostics_eomtime.split('T')[1].split('.')[0].split(':')[0];
			var ue_time_m = upload_diagnostics_eomtime.split('T')[1].split('.')[0].split(':')[1];
			var ue_time_s = upload_diagnostics_eomtime.split('T')[1].split('.')[0].split(':')[2];

			var ue_time_ms;
			if(upload_diagnostics_eomtime.indexOf("Z") >= 0)
			{
				ue_time_ms = upload_diagnostics_eomtime.split('T')[1].split('.')[1].split('Z')[0];
			}

			console.log("ue_time_h " + ue_time_h);
			console.log("ue_time_m " + ue_time_m);
			console.log("ue_time_s " + ue_time_s);
			console.log("ue_time_ms " + ue_time_ms);
			var utime =	(parseInt(ue_time_h - us_time_h)*3600*1000000 + parseInt(ue_time_m - us_time_m)*60*1000000 + parseInt(ue_time_s - us_time_s)*1000000 + parseInt(ue_time_ms- us_time_ms));
			
			var upload_speed;
			console.log("upload_total_bytes_sent " + upload_total_bytes_sent);
			console.log("utime " + utime);
			if(utime != 0)
			{
				upload_speed = Number((upload_total_bytes_sent*8/utime).toString().match(/^\d+(?:\.\d{0,2})?/));
				console.log("upload_speed " + upload_speed);
			}
			else
			{
				upload_speed = "NA";
			}
	
			$("#upload_speed").html(upload_speed+ " Mbps");
		}
		else
		{
			$("#upload_speed").html("NA");
		}
		pause_back();
		console.log("upload speed finished");
		clearInterval(Interval);		
	}
	
}

function show_upload_speed_result(data)
{
	setTimeout(function(){clearInterval(Interval); }, 20000);
	Interval = setInterval(function(){XHR.get("get_upload_speed_result", null, returnUploadSpeedFunc);}, 2000);
}

function returnDownloadSpeedFunc(data)
{	 
	console.log("data.download_diagnostics_state " + data.download_diagnostics_state);
	if (data.download_diagnostics_state != "Requested")
	{
		if(data.download_diagnostics_state != "Completed")
		{
			alert("Download Speed Test failed!");
		}
		clearInterval(Interval_sec);
		
		var postdata2 = new Object();
		var action = "upload";
    	postdata2.action = action;
		XHR.post("set_download_upload_speed_diagnostics", postdata2, show_upload_speed_result);
	}
	else
	{
		endOperateTime = new Date().getTime();
		console.log("beginOperateTime " + beginOperateTime);
		console.log("endOperateTime " + endOperateTime);
		console.log("endOperateTime - beginOperateTime" + parseInt(endOperateTime - beginOperateTime));
		if(data.download_diagnostics_state == "Requested" && (parseInt(endOperateTime - beginOperateTime) > 18000))
		{
			console.log("1111 ");
			var postdata2 = new Object();
			var action = "upload";
	    	postdata2.action = action;
			XHR.post("set_download_upload_speed_diagnostics", postdata2, show_upload_speed_result);
		}
	}
}

function show_download_speed_result(data)
{
	setTimeout(function(){clearInterval(Interval_sec); }, 20000);
	Interval_sec = setInterval(function(){XHR.get("get_download_speed_result", null, returnDownloadSpeedFunc);}, 2000);
}

function show_shadow() {
	pause();
}

function pause() {
	$(window.parent.document).find("#loading_window_div").attr('style', 'display:true');
}

function pause_back() {
	$(window.parent.document).find("#loading_window_div").attr('style', 'display:none');
	console.log("pause_back ");
}

function speedtest(data)
{
    console.log("speedtest");
   //window.open("https://www.speedtest.net"); 

    show_shadow();
    $("#download_speed").html("0.00");
    $("#upload_speed").html("0.00");
	var postdata = new Object();
	var action = "download";
    postdata.action = action;
	beginOperateTime = new Date().getTime();
	console.log("beginOperateTime " + beginOperateTime);
    XHR.post("set_download_upload_speed_diagnostics", postdata, show_download_speed_result);
}

function parseSpeedtestServer(data)
{
    var speedTestListHTML;
   // var speedTestListHTML = "<option value='0'>"+'basic_frequency_auto'.i18n()+"</option>";
    if(data && data.serverLists != undefined && data.serverLists.length > 0){
    	//var arr = data.channels.split(",");
    	for(var i=0; i<data.serverLists.length; i++){
    		speedTestListHTML += "<option value='"+data.serverLists[i].url+"'>"+data.serverLists[i].name+"</option>";
    	}
    }
    $("#speedtest_url_select").html(speedTestListHTML);
}

function test_speed()
{
    var postdata = new Object();
    postdata.url = $("#speedtest_url_select").val();
    XHR.post("triger_speedtest", postdata, get_speedtest_status);	
}

function get_speedtest_status(data){
    if(data.ret == "0"){
     var direction = "down";
     var postdata2 = new Object();
     postdata2.direction = direction;
     XHR.post("get_speedtest_result", postdata2, get_speedtest_down_result); 
    }
}

function get_speedtest_up_result(data){
    if(data.progress == "5")
    {
     upload_flag = "1";   
     $("#upload_speed").html(data.speedaverage);  
    } 
}

function get_speedtest_down_result(data){
    if(data.progress == "5")
    {
     download_flag = "1";   
     $("#download_speed").html(data.speedaverage);  
     var postdata3 = new Object();
     postdata3.direction = "up";
     XHR.post("get_speedtest_result", postdata3, get_speedtest_up_result);  
    } 
}

function parseIPV6Data(data)
{
	if(data && data.lan_ipv6){
		globalipv6address = data.lan_ipv6.ipv6globaladdress;
	}
}


function parseBaseInfo(data)
{
	$("#mode_name").html(data.ModelName);
	$("#mac_adress").html(data.tr069_mac);
	$("#hw_version").html(data.HardwareVersion);
	$("#fm_version").html(data.SoftwareVersion);
	$("#serial_number").html(data.SerialNumber);
	$("#cpu_usage").css("width",data.cpu_usage+"%");
	$("#cpu_usage_val").html(data.cpu_usage+"%");
    br0_mac = data.brmac;
	if (data.mem_total != 0)
	{
		var mem_usage = ((data.mem_total-data.mem_free)/data.mem_total*100).toFixed(2);
		$("#memory_usage").css("width",mem_usage+"%");
		$("#memory_usage_val").html(mem_usage+"%");
	}
	else
	{
		$("#memory_usage").css("width","0%");
		$("#memory_usage_val").html("0%");
	}
	var secondTime = data.uptime;
	var minuteTime = 0;
	var hourTime = 0;
	var dayTime = 0;
	if (secondTime >= 60) {
	    minuteTime = parseInt(secondTime / 60);
	    secondTime = parseInt(secondTime % 60);
	    if (minuteTime >= 60) {
	        hourTime = parseInt(minuteTime / 60);
	        minuteTime = parseInt(minuteTime % 60);
			if(hourTime >= 24){
				dayTime = parseInt(hourTime / 24);
				hourTime = parseInt(hourTime % 24);
			}
	    }
	}
	$("#system_uptime").html(dayTime + " d " + hourTime + " h " + minuteTime + " m "  + secondTime+ " s");
}
function parsedhcpData(data)
{	
		if ( data && data.lan_status)
		{
			$("#device_sum").html(data.lan_status.data.length);	
			var j = 0;
			for (var i=0; i<data.lan_status.data.length; i++)
			{
				var dhcpuser = data.lan_status.data[i];
                if(dhcpuser.ParentMac != br0_mac)
                {
                    continue;
                }
				if(dhcpuser.InterfaceType == "Ethernet"){
					var index = dhcpuser.Layer2Interface.split(".")[4];
					$("#lan"+index).css("width","100%");
					$("#image_lan"+index).prop("src","../image/ais/home/Path_231.png");
					$("#lan_ip_show_"+index).show();
					$("#lan_ip_"+index).html(dhcpuser.IPAddress);
					if(dhcpuser.IPv6Address != ""){
						$("#lan_ipv6_show_"+index).show();
						$("#lan_ipv6_"+index).html(dhcpuser.IPv6Address);
					}
				}
			}
		}				
}
function parsewifiData(data)
{		if ( data && data.wifi_status )
		{
			var wifidata = data.wifi_status;
			if(operator_name == "TH_AIS")
			{
				if ( wifidata[0].RadioEnabled == 1)
				{
					$("#cmn-toggle-1").prop("checked",true);
				}else{
					$("#cmn-toggle-1").prop("checked",false);	
				}
			}
			else
			{
				if ( wifidata[0].Enable == 1)
				{
					$("#cmn-toggle-1").prop("checked",true);
				}else{
					$("#cmn-toggle-1").prop("checked",false);	
				}
			}
			
			wifidata[0].SSID = fhdecrypt(wifidata[0].SSID);
			$("#ssidname2").html(wifidata[0].SSID);
		}	
}

function parsewifi5GData(data)
{		if ( data && data.wifi_status5g )
		{	
			var wifidata = data.wifi_status5g;	
			if(operator_name == "TH_AIS")
			{
				if ( wifidata[0].RadioEnabled == 1)
				{
					$("#cmn-toggle-2").prop("checked",true);
				}else{
					$("#cmn-toggle-2").prop("checked",false);	
				}
			}
			else
			{
				if ( wifidata[0].Enable == 1)
				{
					$("#cmn-toggle-2").prop("checked",true);
				}else{
					$("#cmn-toggle-2").prop("checked",false);	
				}
			}
			
			wifidata[0].SSID = fhdecrypt(wifidata[0].SSID);
			$("#ssidname5").html(wifidata[0].SSID);
		}	
}

function updateWanData(singleWan)
{
	$("#wan_info").show();	
	$("#uptime_div").show();
	
   	if(singleWan.IPMode != "2")//not ipv6
	{
   		if(singleWan.ExternalIPAddress != "")
		{
   			$("#ipv4_div").show();
   			$("#wan_ip4").html(singleWan.ExternalIPAddress);
   		}
   
   		if(singleWan.DNSServers != "")
		{
   			$("#dns4_div").show();
   			$("#wan_dns4").html(singleWan.DNSServers);
   		}					
   	}
	
   	if(singleWan.IPMode != "1")//not ipv4
	{
   		if(singleWan.IPv6IPAddress != "")
		{
   			$("#ipv6_div").show();
   			$("#wan_ip6").html(singleWan.IPv6IPAddress);
   		}
		else if(singleWan.IPv6IPAddress == "" && globalipv6address != "")
		{
   			$("#ipv6_div").show();
   			$("#wan_ip6").html(globalipv6address);
   		}
   
   		if(singleWan.IPv6DNSServers != "")
		{
   			$("#dns6_div").show();
   			$("#wan_dns6").html(singleWan.IPv6DNSServers);
   		}					
   	}
   	var secondTime = singleWan.Uptime;
    var minuteTime = 0;
    var hourTime = 0;
    if (secondTime >= 60)
    {
       minuteTime = parseInt(secondTime / 60);
       secondTime = parseInt(secondTime % 60);
       if (minuteTime >= 60)
	   {
           hourTime = parseInt(minuteTime / 60);
           minuteTime = parseInt(minuteTime % 60);
       }
    }
    $("#uptime").html(hourTime + " h " + minuteTime + " m " + secondTime + " s");

	if(singleWan.ExternalIPAddress != "")
	{
		$("#wan_ip_check").show();
		$("#wan_ip_adress").html(singleWan.ExternalIPAddress);
	}
		
	if(singleWan.DNSServers != "")
	{
		$("#dns_ip_check").show();
		$("#dns_ip_adress").html(singleWan.DNSServers);
	}
		
	$("#wan_ip_bar").css("width","100%");
	$("#wan_ip_image").prop("src","../image/ais/home/Path_231.png")
					
	$("#dns_ip_bar").css("width","100%");
	$("#dns_ip_image").prop("src","../image/ais/home/Path_231.png")
	
	$("#ping_bar").css("width","100%");
	$("#ping_image").prop("src","../image/ais/home/Path_231.png");

	$("#wan_status").prop("src","../image/ais/home/Path_231.png");

	if(singleWan.IPv6ConnStatus == "Connected" && singleWan.ServiceList.indexOf("INTERNET") != -1 )
	{
    	if(singleWan.IPv6IPAddress != "")
		{
    		$("#wan_ipv6_check").show();
    		$("#wan_ipv6_adress").html(singleWan.IPv6IPAddress);
    	}
		else if(singleWan.IPv6IPAddress == "" && globalipv6address != "")
		{
    		$("#wan_ipv6_check").show();
    		$("#wan_ipv6_adress").html(globalipv6address);
    	}

		if(singleWan.IPv6DNSServers != "")
		{
    		$("#dns_ipv6_check").show();
    		$("#dns_ipv6_adress").html(singleWan.IPv6DNSServers);
		}
	}

	if((singleWan.ConnectionStatus == "Connected" || singleWan.IPv6ConnStatus == "Connected") && singleWan.ServiceList.indexOf("INTERNET") != -1)
	{
    	$("#ping_ip_check").show();
    	if(singleWan.ConnectionType == "PPPoE_Routed")
		{
			if(singleWan.IPMode == "2")
			{
				$("#ping_ip_adress").html(singleWan.DefaultIPv6Gateway);
			}
			else
			{
				$("#ping_ip_adress").html(singleWan.RemoteIPAddress);
			}
    	}
		else
		{
			if(singleWan.IPMode == "2")
			{
				$("#ping_ip_adress").html(singleWan.DefaultIPv6Gateway);
			}
			else
			{
				$("#ping_ip_adress").html(singleWan.DefaultGateway);
			}
    	}
	}

	var lastconnectionError = singleWan.LastConnectionError;
	if (singleWan.AddressingType.toUpperCase() == "PPPOE")
	{
    	$("#pppoe_status").show();
    	$("#wan_kind").html("PPPoE");
    	switch(lastconnectionError)
		{
    		case "ERROR_AUTHENTICATION_FAILURE":
    			$("#dial_status").html("Authentication Failure");
    			break;
    		case "ERROR_ISP_DISCONNECT":
    			$("#dial_status").html("Line is busy");
    			break;
    		case "ERROR_ISP_TIME_OUT":
    			$("#dial_status").html("Response Time out");
    			break;
    		case "ERROR_UNKNOWN":
    			$("#dial_status").html("Response Time out");
    			break;
    		case "ERROR_NONE":
    			$("#dial_status").html("Success");
    			break;
    		default:
    			$("#dial_status").html("Response Time out");
    	}
	}
	else
	{
		$("#wan_kind").html("");
	}
}

function parseWanData(getdata)
{
	if( getdata && getdata.wan )
	{
        var all_wan_info =  getdata;
		var wanAarry = getdata.wan;
		var singleWan ;
		var PPPoE_Routed_flag = 0;
		console.log(all_wan_info);
        
        for(var j = 0; j < all_wan_info.wan.length; j++)
        {
           singleWan = all_wan_info.wan[j];
           //console.log(singleWan.ServiceList.indexOf("INTERNET"));

		   /*found INTERNET related PPPoE_Routed WAN and Connected*/
           if ( (singleWan.ConnectionStatus == "Connected" || singleWan.IPv6ConnStatus == "Connected") && 
           singleWan.ServiceList.indexOf("INTERNET") != -1 && singleWan.ConnectionType.indexOf("PPPoE_Routed") != -1)
           {
           		updateWanData(singleWan);
				PPPoE_Routed_flag = 1; //found PPPoE_Routed
				break;
           }
        }
		if(PPPoE_Routed_flag != 1) //not found PPPoE_Routed
		{
			for(j = 0; j < all_wan_info.wan.length; j++)
	        {
	           singleWan = all_wan_info.wan[j];
	           console.log(singleWan);

			   /*found INTERNET related IP_Routed WAN and Connected*/
	           if ( (singleWan.ConnectionStatus == "Connected" || singleWan.IPv6ConnStatus == "Connected") && 
	           singleWan.ServiceList.indexOf("INTERNET") != -1 && singleWan.ConnectionType.indexOf("IP_Routed") != -1)
	           {
	           		updateWanData(singleWan);
					break;
	           }
	        }
		}
	}
}
function webreboot()
{
	var postdata = new Object();
	XHR.post("set_onu_reboot", postdata, null);	
}

function show_topo()
{
	window.open ('topo_new.html', 'newwindow','height=900,width=950, top=200,left=200,toolbar=no,menubar=no,scrollbars=no');
	
}

function submitWifiEnable(band)
{
	var postdata = new Object();
	postdata.mode = "setWifiEnable";
    postdata.flag = "home";
	if(band == 2){
		if($("#cmn-toggle-1").prop("checked")){
			postdata.RadioEnabled = "1";
		}else{
			postdata.RadioEnabled = "0";
		}
		if(gOperatorMode == "3" && gOperatorName == "TH_AIS")
		{
			return;
		}
		XHR.post("setWlanBasicCfg", postdata, initPage); 
	}else{
		if($("#cmn-toggle-2").prop("checked")){
            postdata.wifiIndex = "9";
			postdata.RadioEnabled = "1";
		}else{
            postdata.wifiIndex = "9";
			postdata.RadioEnabled = "0";
		}
		if(gOperatorMode == "3" && gOperatorName == "TH_AIS")
		{
			return;
		}
		XHR.post("setWlanBasicCfg_5G", postdata, initPage);
	}
	                                            
}

function initPage()
{
  window.location.reload();
}

function parseAISInfoData(data)
{
	if (data){
		var cycle =  data.cycles;
		var status =  data.status;
		$("#sub_version").html(cycle + "." + status);
	}
}

function gotowlan2()
{
	var oid = window.parent.document.getElementById("first_menu_network"); 
	oid.click();
	var wid = window.parent.document.getElementById("thr_network_wifi_advance"); 
    wid.click();
}

function gotowlan5()
{
	var oid = window.parent.document.getElementById("first_menu_network"); 
	oid.click();
	var wid = window.parent.document.getElementById("thr_network_wifi_advance5G"); 
    wid.click();
}
function multiInfo(data)
{
	multiAP = data.multiAP_enable.Enable;
}