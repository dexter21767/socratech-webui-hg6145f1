var sessionidstr;
var lan_port_num;
var lan_port_10g_num;
var lan_ports_value = [];


$(document).ready(function(){
	XHR.get("vlanbind", null, constructLANWifiPortHtml);
	XHR.get("getEthernetPorts_Enable", null, initPage);
	if(operator_name == "BZ_INTELBRAS")
	{
		$("#lan_port_work_title").html("lan_port_work_title_ib".i18n());
	}
});



//Construct  Lan Wifi Port Html
function constructLANWifiPortHtml(data)
{
	sessionidstr = data.sessionid;
	if(data.success != 'true')
	{
		return false;
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
	$("#lan_enable_list .lanport:gt("+(lan_num-1)+")").hide();
}

function get_lan_ports_enable_info(){
	var lan_ports_enable_info = [];
	$("#lan_enable_list [name='portbind']").each(function(index, element){
		if($(this).css("display") != "none"){
			var obj = new Object();
			if(index < lan_ports_value.length){
				obj.ethernet_ports_index = index + 1;
				obj.Enable = getLANenableCheckBox($(this));
				lan_ports_enable_info.push(obj);
			}
		}
	});
	return lan_ports_enable_info;
}

function saveApply()
{
	show_shadow();
	var postdata = new Object();
	postdata.sessionid = sessionidstr;
	postdata.lan_ports_enable_info = JSON.stringify(get_lan_ports_enable_info());
	console.log(JSON.stringify(postdata));
	XHR.post("setEthernetPorts_Enable", postdata, initPage);
}

function setLANenaleCheckBox(domObj, value){
	var enable = value;
	if(enable == 1){
		domObj.prop("checked", true);
	}else if(enable == 0){
		domObj.prop("checked", false);
	}
}

function getLANenableCheckBox(domObj){
	var switch_value;
	if(domObj.attr("checked")){
		switch_value = 1;
		return switch_value;
	}else{
		switch_value = 0;
		return switch_value;
	}
}

function initPage(getdata)
{
	if ( getdata != null && getdata.lan_ports_enable_info )
	{
		for(var i=0; i < getdata.lan_ports_enable_info.length; i++){
			var current = getdata.lan_ports_enable_info[i];
			setLANenaleCheckBox($("#lan_enable_list [name='portbind']:eq("+(current.ethernet_ports_index-1)+")"), current.Enable);
			lan_ports_value.push(current.Enable);
		}
	}
}

