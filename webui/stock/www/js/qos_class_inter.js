$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	initValidate();
	showOrHideLoadingWindowFromIframe("show");
	var typeHTML = "<option value=''>&nbsp;</option>";
	typeHTML += "<option value='SMAC'>"+"match_src_mac".i18n()+"</option>";
	typeHTML += "<option value='DMAC'>"+"match_des_mac".i18n()+"</option>";
	typeHTML += "<option value='8021P'>8021P</option>";
	typeHTML += "<option value='SIP'>"+"match_src_ip".i18n()+"</option>";
	typeHTML += "<option value='DIP'>"+"match_des_ip".i18n()+"</option>";
	typeHTML += "<option value='SPORT'>"+"match_src_port".i18n()+"</option>";
	typeHTML += "<option value='DPORT'>"+"match_des_port_num".i18n()+"</option>";
	typeHTML += "<option value='TOS'>TOS</option>";
	typeHTML += "<option value='DSCP'>DSCP</option>";
	typeHTML += "<option value='VLAN'>VLAN</option>";
	typeHTML += "<option value='WANInterface'>"+"match_net_connection".i18n()+"</option>";
	typeHTML += "<option value='LANInterface'>"+"match_lan_side_port".i18n()+"</option>";
	typeHTML += "<option value='Protocol'>"+"match_protocol_type".i18n()+"</option>";


	var typeHTML2 = "<option value=''>&nbsp;</option>";
	typeHTML2 += "<option value='SMAC'>"+"match_src_mac".i18n()+"</option>";
	typeHTML2 += "<option value='DMAC'>"+"match_des_mac".i18n()+"</option>";
	typeHTML2 += "<option value='8021P'>8021P</option>";
	typeHTML2 += "<option value='SIP'>"+"match_src_ip".i18n()+"</option>";
	typeHTML2 += "<option value='DIP'>"+"match_des_ip".i18n()+"</option>";
	typeHTML2 += "<option value='SPORT'>"+"match_src_port".i18n()+"</option>";
	typeHTML2 += "<option value='DPORT'>"+"match_des_port_num".i18n()+"</option>";
	typeHTML2 += "<option value='TOS'>TOS</option>";
	typeHTML2 += "<option value='DSCP'>DSCP</option>";
	typeHTML2 += "<option value='VLAN'>VLAN</option>";
	typeHTML2 += "<option value='WANInterface'>"+"match_net_connection".i18n()+"</option>";
	typeHTML2 += "<option value='LANInterface'>"+"match_lan_side_port".i18n()+"</option>";
	$(".type_select").each(function(){
		var index = this.id.split("_")[1];
		// fiberlog(this.id);
		if (index == 1) {
			$(this).html(typeHTML);
		}
		else
		{
			$(this).html(typeHTML2);
		}
	});
	
	$(".protocollist_select").each(function(){
		// fiberlog(this.id);
		$(this).html(protocolListHTML);
	});
	
	XHR.get("get_allwan_info", null, function(getdata){
		var all_wan_info = '';
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		};	
		if ( getdata != null )
		{
			all_wan_info = getdata;
			
			var wan_num = 0;
			var dynamicHtml = '';
			if ( all_wan_info != '' && all_wan_info.wan )
			{
				wan_num = all_wan_info.wan.length;
			}
			if ( wan_num > 0 )
			{
				for ( var i=0; i< wan_num; i++ )
				{
					var single_wan = all_wan_info.wan[i];
					
					var iporppptype;
					
					if (single_wan.iporppp == 1)
					{
						iporppptype = "WANIPConnection";
					}
					else
					{
						iporppptype = "WANPPPConnection";
					}
					
					dynamicHtml += '<option value="InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.' + iporppptype + '.' + single_wan.wan_session_index +'">' + single_wan.Name + '</option>';
				}
			}
			$(".waninterface_select").each(function(){
				$(this).html(dynamicHtml);
			});
		}

	
	});	
	
	$(".laninterface_select").each(function(){
		$(this).html(laninterfaceListHTML);
	});

	$(".WanIPMode_select").each(function(){
		$(this).html(wanIPModeHtml);
	});
	
	XHR.get("get_wifi_status", null, function(data){
		if ( data && data.wifi_status.actual_wifi_num )
		{
			if (data.wifi_status.actual_wifi_num != 8) //单频
			{
				$(".laninterface_select option[value='InternetGatewayDevice.LANDevice.1.WLANConfiguration.5']").remove();
				$(".laninterface_select option[value='InternetGatewayDevice.LANDevice.1.WLANConfiguration.6']").remove();
				$(".laninterface_select option[value='InternetGatewayDevice.LANDevice.1.WLANConfiguration.7']").remove();
				$(".laninterface_select option[value='InternetGatewayDevice.LANDevice.1.WLANConfiguration.8']").remove();
			}
		};
		if ( data.sessionid != undefined )
		{
			sessionidstr = data.sessionid;
		}
	});
	
	$(".type_select").bind("change", function(){
		displayControl();
		protocolListControl(this);
	});
	
	$("#WanIPModeMax").bind("change", function(){
		$("#WanIPModeMin").val($(this).val());
	});

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_class", initPage);
	}
	else
	{
		XHR.get("get_qos_class", null, initPage);
	}
});


function initValidate()
{
	$("#qos_form").validate({
		debug: true,
		rules: {
			"ClassQueue": {required: true},
			"DSCPMarkValue": {required: true, range_int:[0,63]},
			"P8021Value": {required: true, range_int:[0,7]},
			"ClassRate": {required: true, range_int:[0,1000000]},
			"Min1": {required: true},
			"Max1": {required: true},
			"Min2": {required: true},
			"Max2": {required: true},
			"Min3": {required: true},
			"Max3": {required: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate qos ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate qos failed.....");
			return false;
		}
	}); 
}

function initPage(getdata)
{

	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	};
	XHR.get("get_factory_log", null,  function(data){
		if ( data.sessionid != undefined )
			{
			   sessionidstr = data.sessionid;
			};
	});
	// 清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	// 重置添加选项
	resetAddOption();
	
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata && getdata.qos)
	{
		qosdata = getdata.qos;
		$("#class_type_num").html(qosdata.class_type_num);
		$("#class_num").html(qosdata.class_num);
		
		addindex = ''; //init addindex
		
		var dynamicHTML = '';
		for (var i=1; i<= qosdata.class_num; i++ )
		{
			if ( eval("qosdata.ClassQueue" + i) != '' && eval("qosdata.ClassQueue" + i) != 0 )
			{
				var dynamicTypeHTML = '';
				var typecount = 0;
				var relcount = 0;
				for ( var j=1; j<= qosdata.class_type_num; j++ )
				{
					if ( eval("qosdata.type" + i + "Type" + j) != '' )
					{
						typecount ++;
					}
					else if ( eval("qosdata.type" + i + "ProtocolList" + j) != '')
					{
						typecount ++;
					}
				}
				if ( typecount >= 0 )
				{
					if(typecount==0)
					{
						relcount = 1;
					}else{
						relcount = typecount;
					}
					
					dynamicHTML += '<tr>';
					dynamicHTML += '<td rowspan=' + relcount+ '>' + i + '</td>';
					dynamicHTML += '<td rowspan=' + relcount+ '>' + eval("qosdata.ClassQueue" + i) + '</td>';
					dynamicHTML += '<td rowspan=' + relcount+ '>' + eval("qosdata.DSCPMarkValue" + i) + '</td>';
					dynamicHTML += '<td rowspan=' + relcount + '>' + eval("qosdata.P8021Value" + i) + '</td>';
					dynamicHTML += '<td rowspan=' + relcount + '>' + eval("qosdata.ClassRate" + i) + '</td>';
					var firstrowindex = '';
			
					for ( var j=1; j<=qosdata.class_type_num; j++ )
					{
						if ( (eval("qosdata.type" + i + "Type" + j) != '' || eval("qosdata.type" + i + "ProtocolList" + j) != '') &&  firstrowindex == '' )
						{
							
							dynamicHTML += '<td>' + transferType(eval("qosdata.type" + i + "Type" + j)) + '</td>';
							if (eval("qosdata.type" + i + "Type" + j) == "Protocol") {
								dynamicHTML += '<td>' + ProtocolMode(eval("qosdata.type" + i + "Min" + j)) + '</td>';
							    dynamicHTML += '<td>' + ProtocolMode(eval("qosdata.type" + i + "Max" + j)) + '</td>';
							}
							else{
								dynamicHTML += '<td>' + eval("qosdata.type" + i + "Min" + j) + '</td>';
							    dynamicHTML += '<td>' + eval("qosdata.type" + i + "Max" + j) + '</td>';
							}
							var temp = eval("qosdata.type" + i + "ProtocolList" + j);
							dynamicHTML += '<td>' + (temp == 'TCP,UDP,RTP,ICMP'? 'ALL' : temp) + '</td>';
							firstrowindex = j;
						}
					}
					if(typecount==0){
						dynamicHTML += '<td></td>';
						dynamicHTML += '<td></td>';
						dynamicHTML += '<td></td>';
						dynamicHTML += '<td></td>';
					}
					if(typecount==0)
					{
						relcount = 1;
					}else{
						relcount = typecount;
					}
					
					dynamicHTML += '<td rowspan=' + relcount + '><input type="button" class="input_button input_button_heightwidth_unset" value="Delete" onclick="deleteClass(' + i + ')" /></td>';
					dynamicHTML += '</tr>';
					for ( var j=1; j<=qosdata.class_type_num; j++ )
					{
						if ( (eval("qosdata.type" + i + "Type" + j) != '' || eval("qosdata.type" + i + "ProtocolList" + j) != '') && j != firstrowindex )
						{
							dynamicHTML += '<tr>';
							dynamicHTML += '<td>' + transferType(eval("qosdata.type" + i + "Type" + j)) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "Min" + j) + '</td>';
							dynamicHTML += '<td>' + eval("qosdata.type" + i + "Max" + j) + '</td>';
							var temp = eval("qosdata.type" + i + "ProtocolList" + j);
							dynamicHTML += '<td>' + (temp == 'TCP,UDP,RTP,ICMP'? 'ALL' : temp) + '</td>';
							dynamicHTML += '</tr>';
						}
					}
				}
				else
				{
					if ( addindex == '' )
					{
						addindex = i;
					}
				}
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		var reg = new RegExp(gLanPortHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "LAN");
		reg = new RegExp(gWifiPortHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "SSID");
		var reg = new RegExp(gWANIPConnectionHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "WANIP");
		var reg = new RegExp(gWANPPPConnectionHead.replace(/\./g, "\\."), "g");
		dynamicHTML = dynamicHTML.replace(reg, "WANPPP");
		$("#Classification").html(dynamicHTML);
	}

	displayControl();
}
// function isValidLanFullPath(path)
// {
	// return /InternetGatewayDevice\.LANDevice\.1\.LANEthernetInterfaceConfig\.[1-4]/.test(path);
	           // InternetGatewayDevice\.LANDevice\.1\.LANEthernetInterfaceConfig\.
			     // /InternetGatewayDevice\.LANDevice\.1\.LANEthernetInterfaceConfig\.
// }

function transferType(type)
{
	var returnstr = type;
	
	if ( type == "SMAC" )
	{
		returnstr = "Source MAC address";
	}
	else if ( type == "DMAC" )
	{
		returnstr = "Destination MAC addres";
	}
	else if ( type == "SIP" )
	{
		returnstr = "Source IP address";
	}
	else if ( type == "DIP" )
	{
		returnstr = "Destination IP address";
	}
	else if ( type == "SPORT" )
	{
		returnstr = "Source port num";
	}
	else if ( type == "DPORT" )
	{
		returnstr = "Destination port num";
	}
	else if ( type == "LANInterface" )
	{
		returnstr = "LAN side port num"; 
	}
	else if ( type == "WANInterface" )
	{
		returnstr = "Internet connection";
	}
	else if ( type == "Protocol" )
	{
		returnstr = "Protocol type";
	}
	return returnstr;
}

function ProtocolMode(type)
{
	var returnstr;
	if(type == 1){
		returnstr = "IPv4"
	}
	else if(type == 2)
	{
		returnstr = "IPv6"
	}
	else if(type == 3)
	{
		returnstr = "IPv4&IPv6"
	}
	else{
		returnstr = ""
	}
	return returnstr;
}


function resetAddOption()
{
	$("#ClassQueue").val('');
	$("#DSCPMarkValue").val('0');
	$("#P8021Value").val('0');
	$("#ClassRate").val('');
	$("#Type_1").val('');
	$("#Type_2").val('');
	$("#Type_3").val('');
	$("#Min1").val('');
	$("#Max1").val('');
	$("#ProtocolList1").val('');
	$("#Min2").val('');
	$("#Max2").val('');
	$("#ProtocolList2").val('');
	$("#Min3").val('');
	$("#Max3").val('');
	$("#ProtocolList3").val('');
}

var macErrorHint = "MAC address is invalid, format is xx:xx:xx:xx:xx:xx";
var p8021ErrorHint = "8021P is invalid, the range is 0-7";
var minMaxErrorHint = "MAX value should not less than MIN value";
var ipErrorHint = "IP address is invalid";
var portErrorHint = "Port num is invalid, the range is 0-65535";
var tosErrorHint = "TOS value is invalid, the range is 0-255";
var dscpErrorHint = "DSCP value is invalid, the range is 0-63";
var vlanErrorHint = "VLAN value is invalid, the range is 1-4094";
var ProtocolErrorHint="The protocol can not be empty";

function extraValidCheck()
{
	var error_num = 0;
	
//	if ( $("#Type_1").val() == '' && $("#Type_2").val() == '' && $("#Type_3").val() == '' )
//	{
//		$("#selectType_error").html("请至少配置一个匹配条件");
//		error_num ++;
//	}
	
	for ( var i=1; i<=qosdata.class_type_num; i++ )
	{
		var typevalue = $("#Type_" + i).val();
		var protocolvalue = $("#ProtocolList" + i).val();
		if(typevalue != "" &&  protocolvalue == ""){
			$("#ProtocolList" + i + "_error").html(ProtocolErrorHint);
			error_num ++;
		}
		if ( typevalue != '' )
		{
			var minvalue = $("#Min" + i).val();
			var maxvalue = $("#Max" + i).val();
			if ( typevalue == "SMAC" || typevalue == "DMAC" )
			{
				if ( ! isValidMacAddress(minvalue) )
				{
					$("#Min" + i + "_error").html(macErrorHint);
					error_num ++;
				}
				if ( ! isValidMacAddress(maxvalue) )
				{
					$("#Max" + i + "_error").html(macErrorHint);
					error_num ++;
				}
				//todo, 最大值大于最小值
			}
			else if ( typevalue == "8021P" )
			{
				if ( !isValidNumberRange(minvalue, 0, 7) )
				{
					$("#Min" + i + "_error").html(p8021ErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 0, 7) )
				{
					$("#Max" + i + "_error").html(p8021ErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "SIP" || typevalue == "DIP" )
			{
				if ( !isValidIpAddress(minvalue) && !isValidIpv6AddressRegexp(minvalue) )
				{
					$("#Min" + i + "_error").html(ipErrorHint);
					error_num ++;
				}
				if ( !isValidIpAddress(maxvalue) && !isValidIpv6AddressRegexp(maxvalue) )
				{			
					$("#Max" + i + "_error").html(ipErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "SPORT" || typevalue == "DPORT" )
			{
				if ( !isValidPort(minvalue) )
				{
					$("#Min" + i + "_error").html(portErrorHint);
					error_num ++;
				}
				if ( !isValidPort(maxvalue) )
				{
					$("#Max" + i + "_error").html(portErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "TOS" )
			{
				if ( !isValidNumberRange(minvalue, 0, 255))
				{
					$("#Min" + i + "_error").html(tosErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 0, 255))
				{
					$("#Max" + i + "_error").html(tosErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "DSCP" )
			{
				if ( !isValidNumberRange(minvalue, 0, 63) )
				{
					$("#Min" + i + "_error").html(dscpErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 0, 63) )
				{
					$("#Max" + i + "_error").html(dscpErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "VLAN" )
			{
				if ( !isValidNumberRange(minvalue, 1, 4094) )
				{
					$("#Min" + i + "_error").html(vlanErrorHint);
					error_num ++;
				}
				if ( !isValidNumberRange(maxvalue, 1, 4094) )
				{
					$("#Max" + i + "_error").html(vlanErrorHint);
					error_num ++;
				}
				if ( maxvalue < minvalue )
				{
					$("#Max" + i + "_error").html(minMaxErrorHint);
					error_num ++;
				}
			}
			else if ( typevalue == "WANInterface" )
			{
				//todo, 最大值大于最小值
			}
			else if ( typevalue == "LANInterface" )
			{
				//todo, 最大值大于最小值
			}
		}
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function protocolListControl(element)
{
	var index = element.id.split("_")[1];
	var typevalue = $(element).val();
	var protocolEle = "#ProtocolList" + index;
	var oldPortocolValue = $(protocolEle).val();
	$(protocolEle).html(protocolListHTML);
/*	
	if ( typevalue == "SPORT" || typevalue == "DPORT" )
	{
		// 匹配条件为SPORT或DPORT时，协议不能为空，且协议不能包含ICMP
		$(protocolEle + " option[value='NULL']").remove(); 
		$(protocolEle + " option[value='ICMP']").remove(); 
		$(protocolEle + " option[value='TCP,ICMP']").remove(); 
		$(protocolEle + " option[value='TCP,UDP,ICMP']").remove(); 
	}
	else if ( typevalue == "LANInterface" )
	{
		// 匹配条件为LANInterface时，协议必须为"TCP,UDP"
		$(protocolEle + " option[value!='TCP,UDP']").remove(); 
	}
*/
	$(protocolEle).val(oldPortocolValue);
	
	if ( typevalue == "LANInterface" )
	{
		$(".waninterface" + index).hide();
		$(".laninterface" + index).show();
		$(".minmax" + index).hide();
		$(".WanIPMode" + index).hide();
	}
	else if ( typevalue == "WANInterface" )
	{
		$(".waninterface" + index).show();
		$(".laninterface" + index).hide();
		$(".minmax" + index).hide();
		$(".WanIPMode" + index).hide();
	}
	else if ( typevalue == "Protocol")
	{
		$(".waninterface" + index).hide();
		$(".laninterface" + index).hide();
		$(".minmax" + index).hide();
		$(".WanIPMode" + index).show();
	}
	else
	{
		$(".waninterface" + index).hide();
		$(".laninterface" + index).hide();
		$(".minmax" + index).show();
		$(".WanIPMode" + index).hide();
		if (typevalue == "SIP" || typevalue == "DIP")
		{
			$("#Min1").removeAttr("disabled");
			$("#Min2").removeAttr("disabled");
			$("#Min3").removeAttr("disabled");
			$("#Max1").removeAttr("onKeyup");
			$("#Max2").removeAttr("onKeyup");
			$("#Max3").removeAttr("onKeyup");
		}
		else
		{
			$("#Min1").attr("disabled","disabled");
			$("#Min2").attr("disabled","disabled");
			$("#Min3").attr("disabled","disabled");
			$("#Max1").attr("onKeyup","onkey1()");
			$("#Max2").attr("onKeyup","onkey2()");
			$("#Max3").attr("onKeyup","onkey3()");
		}
	}
}

function onkey1()
{
	document.getElementById("Min1").value = document.getElementById("Max1").value;
}

function onkey2()
{
	document.getElementById("Min2").value = document.getElementById("Max2").value;
}

function onkey3()
{
	document.getElementById("Min3").value = document.getElementById("Max3").value;
}

function displayControl()
{
	$(".type_select").each(function(){
		var index = this.id.split("_")[1];
		if ( $(this).val() == "" )
		{
			$(".type" + index).hide();
		}
		else
		{
			$(".type" + index).show();
		}
	});
	
	if ( addindex == '' )
	{
		$("#add_div").hide();
	}
	else
	{
		$("#add_div").show();
	}
}

function deleteClass(index)
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = index;
	postdata.ClassQueue = '0';
	postdata.DSCPMarkValue = '0';
	postdata.P8021Value = '0';
	for ( var i=1; i<=qosdata.class_type_num; i++ )
	{
		postdata["Type" + i] = "NULL";
		postdata["Min" + i] = "NULL";
		postdata["Max" + i] = "NULL";
		postdata["ProtocolList" + i] = "NULL";
	};
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_class", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function addClass()
{
	// 清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});

	if( ! $("#qos_form").valid() || ! extraValidCheck() )
	{
		alert("add_item_alert".i18n());
		return;
	}

	var postdata = new Object();
	postdata.action = "add";
	postdata.index = addindex;
	postdata.ClassQueue = $("#ClassQueue").val();
	postdata.DSCPMarkValue = $("#DSCPMarkValue").val();
	postdata.P8021Value = $("#P8021Value").val();
	postdata.ClassRate = $("#ClassRate").val();
	for ( var i=1; i<=qosdata.class_type_num; i++ )
	{
		if ( $("#Type_" + i).val() == '' )
		{
			postdata["Type" + i] = "NULL";
			postdata["Min" + i] = "NULL";
			postdata["Max" + i] = "NULL";
		//	postdata["ProtocolList" + i] = "NULL";
		}
		else
		{
			postdata["Type" + i] = $("#Type_" + i).val();
			if ( $("#Type_" + i).val() == "LANInterface" )
			{
				postdata["Min" + i] = $("#laninterfaceMax" + i).val();
				postdata["Max" + i] = $("#laninterfaceMax" + i).val();
			}
			else if ( $("#Type_" + i).val() == "WANInterface" )
			{
				postdata["Min" + i] = $("#waninterfaceMax" + i).val();
				postdata["Max" + i] = $("#waninterfaceMax" + i).val();
			}
			else if ( $("#Type_" + i).val() == "Protocol" )
			{
				postdata["Min" + i] = $("#WanIPModeMax").val();
				postdata["Max" + i] = $("#WanIPModeMax").val();
			}
			else
			{
				postdata["Min" + i] = $("#Min" + i).val();
				postdata["Max" + i] = $("#Max" + i).val();
			}
		//	postdata["ProtocolList" + i] = $("#ProtocolList" + i).val();
		}
		postdata["ProtocolList" + i] = $("#ProtocolList" + i).val();
	};
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_class", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

//var protocolListHTML = "<option value='NULL'>&nbsp;</option>";
var protocolListHTML = "<option value=''>&nbsp;</option>";
protocolListHTML += "<option value='TCP,UDP,RTP,ICMP'>ALL</option>";
protocolListHTML += "<option value='TCP'>TCP</option>";
protocolListHTML += "<option value='UDP'>UDP</option>";
protocolListHTML += "<option value='RTP'>RTP</option>";
protocolListHTML += "<option value='TCP,UDP'>TCP/UDP</option>";
protocolListHTML += "<option value='ICMP'>ICMP</option>";
//protocolListHTML += "<option value='TCP,ICMP'>TCP,ICMP</option>";
//protocolListHTML += "<option value='ICMP,UDP'>ICMP,UDP</option>";
//protocolListHTML += "<option value='TCP,UDP,ICMP'>TCP,UDP,ICMP</option>";

//todo, judge lan port num and wifi port num
var laninterfaceListHTML = "<option value='" + gLanPortHead + "1'>LAN1</option>";
laninterfaceListHTML += "<option value='" + gLanPortHead + "2'>LAN2</option>";
laninterfaceListHTML += "<option value='" + gLanPortHead + "3'>LAN3</option>";
laninterfaceListHTML += "<option value='" + gLanPortHead + "4'>LAN4</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "1'>SSID1</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "2'>SSID2</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "3'>SSID3</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "4'>SSID4</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "5'>SSID5</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "6'>SSID6</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "7'>SSID7</option>";
laninterfaceListHTML += "<option value='" + gWifiPortHead + "8'>SSID8</option>";

//todo, judge lan port num and wifi port num
var waninterfaceListHTML = "<option value='" + gWANIPConnectionHead + "1'>WANIP1</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "2'>WANIP2</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "3'>WANIP3</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "4'>WANIP4</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "5'>WANIP5</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "6'>WANIP6</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "7'>WANIP7</option>";
waninterfaceListHTML += "<option value='" + gWANIPConnectionHead + "8'>WANIP8</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "1'>WANPPP1</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "2'>WANPPP2</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "3'>WANPPP3</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "4'>WANPPP4</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "5'>WANPPP5</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "6'>WANPPP6</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "7'>WANPPP7</option>";
waninterfaceListHTML += "<option value='" + gWANPPPConnectionHead + "8'>WANPPP8</option>";
//  ipmode 
var wanIPModeHtml = "<option value = 1 >IPv4</option>";
wanIPModeHtml += "<option value = 2 >IPv6</option>";
wanIPModeHtml += "<option value = 3 >IPv4&IPv6</option>";

var qosdata = '';
var addindex = '';
var sessionidstr = "";

