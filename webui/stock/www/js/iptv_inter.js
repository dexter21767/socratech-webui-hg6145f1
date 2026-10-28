var g_data;
var operator_name = gOperatorName;
$(document).ready(function(){
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_igmp_info", parseRegisterData);
	}
	else
	{
		XHR.get("get_igmp_info", null, parseRegisterData);
	}

	if(operator_name == "TH_AIS"){
		$(".main_item_name").css("width","20%");
		$(".main_item_content").css("width","calc(80% - 3px)");
	}
});	

function parseRegisterData(data)
{
	if ( data )
	{
		g_data = data;
		displayHTML();
	}
}

function displayHTML()
{
	if(g_data.IGMPProxy == "1"){
		
		$("input[name='iptv_IGMPProxy']").prop('checked','true');
	}
	// if(g_data.IGMPSnooping == "1"){
		
	// 	$("input[name='iptv_IGMPSnooping']").prop('checked','true');
	// }
	if(g_data.MLDProxy == "1"){
		
		$("input[name='iptv_MLDProxy']").prop('checked','true');
	}
	// if(g_data.MLDSnooping == "1"){
	// 	$("input[name='iptv_MLDSnooping']").prop('checked','true');
	// }
	$("#iptv_vlan").val(g_data.igmpvlan);
	
}


function Cancel()
{
	displayHTML();
}


function switchApply()
{
	show_shadow();
	$(".main_item_error_hint_extra").html("");
	
	// if($("input[name='iptv_IGMPSnooping']").is(':checked')){
		
	// 	$("input[name='iptv_IGMPSnooping']").val("1");
	// }else{
	// 	$("input[name='iptv_IGMPSnooping']").val("0");
	// }
	// if($("input[name='iptv_IGMPProxy']").is(':checked')){
		
	// 	$("input[name='iptv_IGMPProxy']").val("1");
	// }else{
	// 	$("input[name='iptv_IGMPProxy']").val("0");
	// }
	// if($("input[name='iptv_MLDSnooping']").is(':checked')){
		
	// 	$("input[name='iptv_MLDSnooping']").val("1");
	// }else{
	// 	$("input[name='iptv_MLDSnooping']").val("0");
	// }
	// if($("input[name='iptv_MLDProxy']").is(':checked')){
		
	// 	$("input[name='iptv_MLDProxy']").val("1");
	// }else{
	// 	$("input[name='iptv_MLDProxy']").val("0");
	// }
	
	
	var postdata = new Object();
	var action;
	postdata.action = "switchEnable";
	//postdata.IGMPSnooping = $("input[name='iptv_IGMPSnooping']").is(':checked')?1:0;
	postdata.IGMPProxy = $("input[name='iptv_IGMPProxy']").is(':checked')?1:0;
	//postdata.MLDSnooping = $("input[name='iptv_MLDSnooping']").is(':checked')?1:0;
	postdata.MLDProxy = $("input[name='iptv_MLDProxy']").is(':checked')?1:0;
	XHR.post("set_igmp_info", postdata, parseRegisterData);
}


function saveApply()
{
	var igmpvlan = $("#iptv_vlan").val();
	if (!valid_Range_Int(igmpvlan, 1, 4094))
	{
		if(gNewUiFlag)
			myAlert('Tip', "iptv_vlanIllegalAlert".i18n())
		else
			alert("iptv_vlanIllegalAlert".i18n())
		return;
	}
	show_shadow();
	$(".main_item_error_hint_extra").html("");

	var action;
	var postdata = new Object();
	postdata.action = "vlan";
	postdata.igmpvlan = igmpvlan;
	XHR.post("set_igmp_info", postdata, parseRegisterData);
}



