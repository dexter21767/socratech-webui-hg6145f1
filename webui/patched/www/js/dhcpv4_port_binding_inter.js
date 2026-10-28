var sessionidstr;
var wifi_enable;
var wifi_5g_enable;
var lan_port_num;
var lan_port_10g_num;
var dhcp_switch;
var lan_ports_value = [];
var wifi_ports_value= [];
var wifi_ssid_num;
$(document).ready(function(){
	
	//优化滚动条，无需改动
	//customScrollBar("html");
	XHR.get("vlanbind", null, constructLANWifiPortHtml);
	XHR.get("get_dhcpv4_port_binding_info", null, initPage);
	XHR.get("get_dhcp_switch", null, DHCPConfigable);
	if(dhcp_switch == "0"){
		$("#dhcpv4_lan_list [name='portbind']").each(function(index, element){
					$(this).attr("disabled","true");

		});
		
		$("#dhcpv4_ssid [name='portbind']").each(function(index, element){
					$(this).attr("disabled","true");
		});
	}
});

function DHCPConfigable(data)
{
	dhcp_switch = data.dhcp_switch;
}

//Construct  Lan Wifi Port Html
function constructLANWifiPortHtml(data)
{
	sessionidstr = data.sessionid;
	if(data.success != 'true')
	{
		return false;
	}
	
	if(data.wifi_enable != undefined)
	{
		wifi_enable = data.wifi_enable;
	}
	
	if ( data.wifi_5g_enable != undefined )
	{
		wifi_5g_enable = data.wifi_5g_enable;
	}

	if(data.lan_port_num != undefined)
	{
		lan_port_num = data.lan_port_num;
	}
	
	if(data.lan_port_10g_num != undefined)
	{
		lan_port_10g_num = data.lan_port_10g_num;
	}
	var lan_num = lan_port_num + lan_port_10g_num;
	$("#dhcpv4_lan_list .lanport:gt("+(lan_num-1)+")").hide();
	
	if(wifi_enable == 0){
		$("#dhcpv4_ssid_2g").hide();
		$("#dhcpv4_ssid_5g").hide();
	}
	
	if(wifi_5g_enable == 0){
		$("#dhcpv4_ssid_5g").hide();
	}
}

function get_lan_ports_dhcp_info(){
	var lan_ports_dhcp_info = [];
	$("#dhcpv4_lan_list [name='portbind']").each(function(index, element){
		if($(this).is(':visible')){
			var obj = new Object();
			if(index < lan_ports_value.length){
				obj.ethernet_ports_index = index + 1;
				obj.X_FH_DHCPV4 = getDHCPCheckBox($(this),lan_ports_value[index]);
				lan_ports_dhcp_info.push(obj);
			}
		}
	});
	return lan_ports_dhcp_info;
}

function get_wlan_ports_dhcp_info(){
	var wlan_ports_dhcp_info = [];
	$("#dhcpv4_ssid [name='portbind']").each(function(index, element){
		if($(this).is(':visible')){
			var obj = new Object();
             if(wifi_ssid_num == "16"  &&  index >=4)
             {
               obj.ssid_ports_index = index + 5;  
             }else
             {
               obj.ssid_ports_index = index + 1;  
             }
			//obj.ssid_ports_index = index + 1;
			obj.X_FH_DHCPV4 = getDHCPCheckBox($(this),wifi_ports_value[index]);
			wlan_ports_dhcp_info.push(obj);
		}
	});
	return wlan_ports_dhcp_info;
}

function saveApply()
{
	show_shadow();
	var postdata = new Object();
	postdata.sessionid = sessionidstr;
	postdata.lan_ports_dhcp_info = JSON.stringify(get_lan_ports_dhcp_info());
	postdata.wlan_ports_dhcp_info = JSON.stringify(get_wlan_ports_dhcp_info());
	console.log(JSON.stringify(postdata));
	XHR.post("set_dhcpv4_port_binding_info", postdata, initPage);
}

function setDHCPCheckBox(domObj, value){
	var enable = dhcp_value_switch(value);
	if(enable == 1){
		domObj.prop("checked", true);
	}else if(enable == 0){
		domObj.prop("checked", false);
	}
}

function getDHCPCheckBox(domObj,value){
	var switch_value;
	if(domObj.attr("checked")){
		switch_value = parseInt(dhcp_value_checked_switch(value));
		return switch_value;
	}else{
		switch_value = parseInt(dhcp_value_unchecked_switch(value));
		return switch_value;
	}
}

function initPage(getdata)
{
    wifi_ssid_num = getdata.wifi_ssid_num;
	if ( getdata != null && getdata.lan_ports_dhcp_info )
	{
		for(var i=0; i < getdata.lan_ports_dhcp_info.length; i++){
			var current = getdata.lan_ports_dhcp_info[i];
			setDHCPCheckBox($("#dhcpv4_lan_list [name='portbind']:eq("+(current.ethernet_ports_index-1)+")"), current.X_FH_DHCPV4);
			lan_ports_value.push(current.X_FH_DHCPV4);
		}
	}
	if ( getdata != null && getdata.wlan_ports_dhcp_info )
	{
		for(var i=0; i < getdata.wlan_ports_dhcp_info.length; i++){
			var current = getdata.wlan_ports_dhcp_info[i];
            if(wifi_ssid_num == "16"  &&  (current.ssid_ports_index >5))
            {
              current.ssid_ports_index =   current.ssid_ports_index - 4;
            
            }
			setDHCPCheckBox($("#dhcpv4_ssid [name='portbind']:eq("+(current.ssid_ports_index-1)+")"), current.X_FH_DHCPV4);
			wifi_ports_value.push(current.X_FH_DHCPV4);
		}
	}
}

function dhcp_value_checked_switch(value)
{
	var dhcp_value;	
	var m ;
	var n;
	var h;
	h=value.toString(2);
	if(h.length<4){
		h="0"+h;
	}
	n = h.substring(2);
	m = "11"+ n;
	dhcp_value = parseInt(m,2).toString(10);
	return dhcp_value;
}

function dhcp_value_unchecked_switch(value)
{
	var dhcp_value;	
	var m ;
	var n;
	var h;
	h=value.toString(2);
	if(h.length<4){
		h="0"+h;
	}
	n = h.substring(2);
	m = "10"+ n;
	dhcp_value = parseInt(m,2).toString(10);
	return dhcp_value;
}



