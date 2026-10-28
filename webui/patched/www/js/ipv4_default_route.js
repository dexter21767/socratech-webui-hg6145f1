var sessionidstr = "";
var selectwan = '';
var g_data;
var	all_wan_info = '';
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/upnp", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initConnectName);
	}
		//IsChecked();
	if(operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "BZ_INTELBRAS"){
		$("#v6_default_route").show();
	}
	
function initConnectName(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	var dynamicHtml_v6 = '';
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
			var wan_ip_mode = single_wan.IPMode;
			var wan_path = single_wan.WAN_url;
			if((single_wan.Name.indexOf("INTERNET") >=0 && single_wan.Name.indexOf("_B_") == -1) || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0))
			{
				if(wan_ip_mode != 2){
					dynamicHtml += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
				if(wan_ip_mode != 1){
					dynamicHtml_v6 += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}	
			}
		}
	}
	$("#wan_name").html(dynamicHtml);
	XHR.get("get_Ipv4DefaultRoute_info", null, initPage);
	
	if(operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "BZ_INTELBRAS"){
		$("#wan_name_v6").html(dynamicHtml_v6);
		XHR.get("get_Ipv6DefaultRoute_info", null, initPage_v6);
	}
}

});




function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	
	if(getdata.ipv4DefaultRoute_info.DefaultConnectionService == "" || getdata.ipv4DefaultRoute_info.DefaultConnectionService == "NULL" || getdata.ipv4DefaultRoute_info.DefaultConnectionService == "null" )
	{
			$("#enable").prop('checked', false);
	}
	else
	{
			$("#enable").prop('checked', true);
	}
	
	$("#wan_name option").each(function (){
		if(getdata.ipv4DefaultRoute_info.DefaultConnectionService == this.value){
			$(this).prop("selected",true);
		}
	})
}

function initPage_v6(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	
	if(getdata.ipv6DefaultRoute_info.DefaultV6ConnectionService == "" || getdata.ipv6DefaultRoute_info.DefaultV6ConnectionService == "NULL" || getdata.ipv6DefaultRoute_info.DefaultV6ConnectionService == "null" )
	{
			$("#enable_v6").prop('checked', false);
	}
	else
	{
			$("#enable_v6").prop('checked', true);
	}
	
	$("#wan_name_v6 option").each(function (){
		if(getdata.ipv6DefaultRoute_info.DefaultV6ConnectionService == this.value){
			$(this).prop("selected",true);
		}
	})
}



function save_apply()
{
	show_shadow();
	var postdata = new Object();
	var defaultRoute_enable = $("input[name='firewall_enable']:checked").val();
	
	
	if(defaultRoute_enable == "enable")
	{
		postdata.DefaultConnectionService = $("#wan_name").val();
	}
	else if(defaultRoute_enable == undefined)
	{
		postdata.DefaultConnectionService = "NULL";
	}
	XHR.post("set_Ipv4DefaultRoute_info", postdata, initPage);
}

function save_apply_v6()
{
	show_shadow();
	var postdata = new Object();
	var defaultRoute_enable_v6 = $("input[name='firewall_enable_v6']:checked").val();
	
	
	if(defaultRoute_enable_v6 == "enable")
	{
		postdata.DefaultV6ConnectionService = $("#wan_name_v6").val();
	}
	else if(defaultRoute_enable_v6 == undefined)
	{
		postdata.DefaultV6ConnectionService = "NULL";
	}
	XHR.post("set_Ipv6DefaultRoute_info", postdata, initPage);
}
