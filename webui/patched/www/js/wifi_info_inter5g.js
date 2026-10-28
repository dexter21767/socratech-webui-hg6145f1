var multiAP = "";
var basicData ;
var BSSID;
var operator_name = gOperatorName;
var login_user = gLoginUser;
var ssid = [];
var ssid_b = [];
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	if(operator_name == "TH_AIS"){
		$("#wifi_mode").hide();
	}

	if(operator_name == "IDN_TELKOM")
	{
		XHR.get("get_allwan_info", null, getBridegeSSID);	
	}
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
       // XHR.get("get_ssiddisplay_info", null, ssiddisplayInfo);
		XHR.get("get_multiAP_enable", null, multiInfo);
		
		//XHR.get("get_bandSteering", null, getSSID);
		XHR.get("wlanBasicSettings_5G", null, initPage);
        if(operator_name == "TH_AIS"){
        	XHR.poll(gStatusFreshInterval, "get_wifi_status_5G_th_ais", null, parseGetData);  
        }else{
          XHR.poll(gStatusFreshInterval, "get_wifi_status_5G", null, parseGetData);  
        }
		
	}
}

function getBridegeSSID(all_wan_info){

	/*modify by zhangbin,印尼电信适配16个ssid*/
	var number = all_wan_info.wifi_port_num
	for (var i = 0; i < all_wan_info.wan.length; i++) {
		var single_wan = all_wan_info.wan[i];
		if (single_wan.Name.indexOf("_B_")  >= 0 && single_wan.Name.indexOf("INTERNET") >= 0) 
		{	
			ssid = single_wan.LanInterface.split(',');
			for(var j = 0; j < ssid.length; j++){ 
				if(ssid[j].indexOf("dev.wla.5") >= 0 || ssid[j].indexOf("dev.wla.6") >= 0 || ssid[j].indexOf("dev.wla.7") >= 0 || ssid[j].indexOf("dev.wla.8") >= 0
				|| ssid[j].indexOf("dev.wla.9") >= 0 || ssid[j].indexOf("dev.wla.10") >= 0 || ssid[j].indexOf("dev.wla.11") >= 0 || ssid[j].indexOf("dev.wla.12") >= 0)
				{
					if(number == 16)
						ssid_b.push(Number(ssid[j].slice(8) - 9));
					else
						ssid_b.push(Number(ssid[j].slice(8) - 5));
				}
			}
		}
	}
}


function getSSID(data){
	BSSID = data.bandSteering.SSID;	
}


function initPage(data)
{
	
	if (data && data.wifi_status)
	{
		basicData = data.wifi_status;
	}
	
}
function multiInfo(data)
{
	multiAP = data.multiAP_enable.Enable;	
}

function parseGetData(data)
{
	if ( data && data.wifi_status5g )
	{
		var wifidata = data.wifi_status5g;

		if ( wifidata[0].RadioEnabled == 1)
		{
			$("#enable").html("On".i18n());
		}
		else
		{
			$("#enable").html("Off".i18n());
		}
		
		if(multiAP == "1")
		{
			$("#basicradio").hide();
			if(gNewUiFlag){
				$("#mode_title").addClass("first_left_td");
				$("#mode").addClass("first_right_td");
			}
			if (basicData.Standard == "b"){
				$("#mode").html("802.11b");
			}else if (basicData.Standard == "g"){
				$("#mode").html("802.11g");
			}else if (basicData.Standard == "bg"){
				$("#mode").html("802.11bg Mixed");
			}else if (basicData.Standard == "n"||wifidata[0].Standard == "a,n"){
				$("#mode").html("802.11n");
			}else if (basicData.Standard == "ng"){
				$("#mode").html("802.11gn Mixed");
			}else if (basicData.Standard == "bgn"){
				$("#mode").html("802.11bgn Mixed");
			}else if (basicData.Standard == "a"){
				
				$("#mode").html("802.11 a");
			}else if (basicData.Standard == "an"){
				$("#mode").html("802.11 an");
			}else if (basicData.Standard == "a,n,ac"){
				$("#mode").html("802.11 a/n/ac");
			}else if (basicData.Standard == "anacax"){
				$("#mode").html("802.11 a/n/ac/ax");
			}else if (basicData.Standard == "ac"){
				$("#mode").html("802.11 ac");
			}else{
				if(operator_name == "CHL_ENTEL")
					$("#mode").html("802.11 n/ac/ax");
				else
					$("#mode").html("802.11 ax");
			}
			$("#channel").html("2.4g_channel".i18n()+wifidata[0].channelIsInUse);
			
			var wifilistHtml = [];
			for (var i=0; i<wifidata.length; i++)
			{
				//墨西哥TP版本定制化需求：普通用户隐藏SSID8
				if((operator_name == "MEX_TP" ) && login_user == 0){
					if(i == 3){
						continue;
					}
				}
                

				//印尼电信定制化需求:桥接wan绑定的ssid不显示
                var ssid_is_band = 0;
				if(operator_name == "IDN_TELKOM")
				{	
					ssid_b.forEach(function(e){
						if (i == e){
							ssid_is_band = 1;
							return;
						}
					})
				}
                if (ssid_is_band == 1){
                	continue;
                }
				if(operator_name == "TH_AIS" && login_user == 0 && i == 4)
				{
					continue;
				}
				
                wifidata[i].SSID = fhdecrypt(wifidata[i].SSID);
                var basicSSIDtitle = "basicSSID"+(i+1)+"_title";
                //泰国AIS定制化需求：5G频段的SSID索引改为5,6,7,8
                if( operator_name == "TH_AIS"){
                   
                   basicSSIDtitle = "basicSSID"+(i+5)+"_title";
  
                }
				wifilistHtml += '<tr><td class="table_left" width="30%" size=20>'+basicSSIDtitle.i18n()+'</td>';
				wifilistHtml += '<td class="table_right" width="35%" size=20>'+htmlencode(wifidata[i].SSID)+'</td>';
			//	wifilistHtml += '<td class="table_right" width="20%" id="SSID1_mac" size=20>'+wifidata[i].BSSID+'</td>';
				if ( wifidata[i].Enable == 1)
				{
					wifilistHtml += '<td class="table_right" width="35%" size=20>'+"Enable".i18n()+'</td></tr>';
				
				}
				else
				{ 
					wifilistHtml += '<td class="table_right" width="35%" size=20>'+"Disable".i18n()+'</td></tr>';
				}
            
			}
			$("#wifi_list").html(wifilistHtml);
			
		}else
		{
			if (wifidata[0].Standard == "b"){
				$("#mode").html("802.11b");
			}else if (wifidata[0].Standard == "g"){
				$("#mode").html("802.11g");
			}else if (wifidata[0].Standard == "bg"){
				$("#mode").html("802.11bg Mixed");
			}else if (wifidata[0].Standard == "n" ||wifidata[0].Standard == "a,n"){
				$("#mode").html("802.11n");
			}else if (wifidata[0].Standard == "ng"){
				$("#mode").html("802.11gn Mixed");
			}else if (wifidata[0].Standard == "bgn"){
				$("#mode").html("802.11bgn Mixed");
			}else if (wifidata[0].Standard == "a"){
				$("#mode").html("802.11 a");
			}else if (wifidata[0].Standard == "an"){
				$("#mode").html("802.11 an");
			}else if (wifidata[0].Standard == "a,n,ac"){
				$("#mode").html("802.11 a/n/ac");
			}else if (wifidata[0].Standard == "anacax"){
				$("#mode").html("802.11 a/n/ac/ax");
			}else if (basicData.Standard == "ac"){
				$("#mode").html("802.11 ac");
			}else{
				if(operator_name == "BZ_VERO")
					$("#mode").html("802.11 a/n/ac/ax");
				else if(operator_name == "CHL_ENTEL")
					$("#mode").html("802.11 n/ac/ax");
				else
					$("#mode").html("802.11 ax");
			}
			$("#channel").html("5g_channel".i18n()+wifidata[0].channelIsInUse);
			
			var wifilistHtml = [];
			for (var i=0; i<wifidata.length; i++)
			{
				//墨西哥TP版本定制化需求：普通用户隐藏SSID8
				if((operator_name == "MEX_TP") && login_user == 0){
					if(i == 3){
						continue;
					}
				}
                
				var ssid_is_band = 0;
				//alert(ssid_b);
				//印尼电信定制化需求:桥接wan绑定的ssid不显示
				if(operator_name == "IDN_TELKOM")
				{	
					ssid_b.forEach(function(e){
						if (i == e){
							ssid_is_band = 1;
							return;
						}
					})
				}
				if (ssid_is_band == 1){
					continue;
				}
				wifidata[i].SSID = fhdecrypt(wifidata[i].SSID);
				var basicSSIDtitle = "basicSSID"+(i+1)+"_title";
				
                if(operator_name == "TH_AIS")
                {
                    
                    if(i == 4)
                    {
                        continue;
                    }
                }
                
				//墨西哥TP版本定制化需求：5G频段的SSID索引改为5,6,7,8
				if(operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "TH_AIS"){
					basicSSIDtitle = "basicSSID"+(i+5)+"_title";
				}
				wifilistHtml += '<tr><td class="table_left" width="30%" size=20>'+basicSSIDtitle.i18n()+'</td>';
				wifilistHtml += '<td class="table_right" width="35%" size=20>'+htmlencode(wifidata[i].SSID)+'</td>';
				//wifilistHtml += '<td class="table_right" width="20%" id="SSID1_mac" size=20>'+wifidata[i].BSSID+'</td>';
				if ( wifidata[i].Enable == 1)
				{
					wifilistHtml += '<td class="table_right" width="35%" size=20>'+"Enable".i18n()+'</td></tr>';
				
				}
				else
				{
					wifilistHtml += '<td class="table_right" width="35%" size=20>'+"Disable".i18n()+'</td></tr>';
				}
			}
			$("#wifi_list").html(wifilistHtml);
		}

		$("#receive_packet").html(wifidata[0].TotalPacketsReceived);
		$("#receive_byte").html(wifidata[0].TotalBytesReceived);
		$("#send_packet").html(wifidata[0].TotalPacketsSent);
		$("#send_byte").html(wifidata[0].TotalBytesSent);

		$("#receive_wrong_packet").html(wifidata[0].X_FH_RxErrorPkts);
		$("#receive_drop_packet").html(wifidata[0].X_FH_RxDropPkts);
		$("#send_wrong_packet").html(wifidata[0].X_FH_TxErrorPkts);
		$("#send_drop_packet").html(wifidata[0].X_FH_TxDropPkts);

	}
}
