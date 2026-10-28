var sessionidstr = "";
var selectwan = '';
var g_data;
var	all_wan_info = '';
var operator_name = gOperatorName;
var login_user = gLoginUser;
var checkedflag = false;
var routeflag ;
var bridgeflag ;
var groute_wan;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	initPage();
	
});

function initPage(){

	XHR.get("get_allwan_info", null, initConnectName);
	
}

function initConnectName(getdata)
{
	var wan_num = 0;
	routeflag = false;
	bridgeflag = false;
	all_wan_info = getdata;
	if ( all_wan_info.show_wan )
	{
		selectwan = all_wan_info.show_wan;
	}
			
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];	
			if(single_wan.Name.indexOf("INTERNET") >=0 && single_wan.ConnectionType.indexOf("Routed") >=0 && single_wan.ConnectionStatus == "Connected")
			{
				routeflag = true;
				groute_wan = single_wan;
				
			}

			if((single_wan.ConnectionType.indexOf("Bridged") >=0 && single_wan.LanInterface.indexOf("dev.eth.4") >=0))
			{
				bridgeflag = true;
			}
		}
	}

	if(bridgeflag == true && routeflag == false){
		$("#LAN4_enable").prop('checked', true);
		$("#LAN4_enable").prop('disabled', true);
	}else if(bridgeflag == false && routeflag == true){
		$("#LAN4_enable").prop('checked', false);
	}else if(bridgeflag == false && routeflag == false){
		$("#LAN4_enable").prop('checked', false);
		$("#LAN4_enable").prop('disabled', true);
	}else if(bridgeflag == true && routeflag == true){
		$("#LAN4_enable").prop('checked', false);
		$("#LAN4_enable").prop('disabled', true);
	}
}

function save_apply()
{
	show_shadow();
	var bind = $("input[name='LAN4_enable']:checked").val();
	if(bind == "1" && bridgeflag == false && routeflag == true){
		changeWanApply()
	}
}


function changeWanApply() {
	var postdata = new Object();
	var action = '';
	action = "wan_modify";
	postdata.wan_index = groute_wan.wan_index;
	postdata.wan_session_index = groute_wan.wan_session_index;
	postdata.wan_iporppp_old = groute_wan.iporppp;
	postdata.wan_iporppp_new = "2";
	postdata.ConnectionType = "PPPoE_Bridged";
	postdata.IPMode = groute_wan.IPMode;
	postdata.ServiceList = "INTERNET";
	postdata.mtu = groute_wan.mtu;
	postdata.LanInterface = "dev.eth.4";
	postdata.vlanid = groute_wan.vlanid;
	postdata.AddressingType = "";
	postdata.Dslite_Enable = groute_wan.Dslite_Enable;
	postdata.NATEnabled = groute_wan.NATEnabled;
	postdata.p8021 = groute_wan.p8021;
	
	XHR.post(action, postdata, function(){
		if(groute_wan.ServiceList != "INTERNET"){
			addNewWan();
		}else{
			initPage();
		}
	});
}

function addNewWan() {
	var postdata = new Object();
	var action = '';
	action = "wan_add_new";
	console.log(groute_wan)
	postdata.AddressingType = groute_wan.AddressingType;
	postdata.IPMode = "1";
	if(groute_wan.iporppp == "1"){
		postdata.wan_iporppp_new = "1";
		postdata.ConnectionType = "IP_Routed";
		if(groute_wan.AddressingType == "DHCP"){
			postdata.option60_enable = groute_wan.option60_enable;
			postdata.option60_value = groute_wan.option60_value;
		}else if(groute_wan.AddressingType == "Static"){

			postdata.ExternalIPAddress = groute_wan.ExternalIPAddress;
			postdata.SubnetMask = groute_wan.SubnetMask;
			postdata.DefaultGateway = groute_wan.DefaultGateway;
			postdata.DNSServers = groute_wan.DNSServers;
		}
	}else if(groute_wan.iporppp == "2"){
		postdata.wan_iporppp_new = "2";
		postdata.ConnectionType = "PPPoE_Routed";
		postdata.Username = groute_wan.Username;
		postdata.WPd = groute_wan.Password;
		postdata.ConnectionTrigger = groute_wan.ConnectionTrigger;
		if(groute_wan.ConnectionTrigger == "OnDemand"){
			postdata.IdleDisconnectTime = groute_wan.IdleDisconnectTime
		}
	}
	
	
	postdata.ServiceList = groute_wan.ServiceList.replace(",INTERNET","");
	postdata.mtu = groute_wan.mtu;
	postdata.vlanid = groute_wan.vlanid;
	postdata.Dslite_Enable = groute_wan.Dslite_Enable;
	postdata.NATEnabled = groute_wan.NATEnabled;
	postdata.p8021 = groute_wan.p8021;
	XHR.post(action, postdata, initPage);
}
