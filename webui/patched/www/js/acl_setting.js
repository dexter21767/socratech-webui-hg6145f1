var acl_data;
var ipfilterout_data;
var addflag = "edit";
var selfilterIndex = 1;
var operator_name = gOperatorName;
var login_user = gLoginUser;
var cur_protocol;
var all_wan_info = '';
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	initValidate();

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	if (operator_name == "TH_AIS" || operator_name == "MY_TM") {
		$("#acl_protocol").append("<option value='SAMBA'>SAMBA</option>");
		$("#acl_protocol").append("<option value='TFTP'>TFTP</option>");
	}
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipfilter_lan", initPage);
	}
	else {
		if(operator_name == "ECU_CNT")
			XHR.get("get_firewall_info", null, getaFirewall_info);

		if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU" ) {
			XHR.get("get_allwan_info", null, initConnectName);
			$("#acl_direction").bind("change", function() {
				bind_interface_change();
			});
			$("#acl_bind_interface").show();
			$("#acl_bind_interface_td").show();
			if ($("#acl_direction").val() == "1") {
				show_wan_name();
			} else {
				dynamicHtml = '';
				dynamicHtml += '<option value="LAN">LAN</option>';
				$("#acl_bind_direction").html(dynamicHtml);
			}
		}
		XHR.get("get_acl_info", null, initPage);
	}

	if (operator_name == "PLE_PALTEL") {
		$("#acl_direction").change(function() {
			if ($(this).val() == "1") {
				$("#acl_protocol").find("option[value='HTTPS']").show();
			} else {
				$("#acl_protocol").find("option[value='HTTPS']").hide();
				if (cur_protocol == "HTTPS") {
					$("#acl_protocol").val("ALL");
				}
			}
		});
	}

	if (operator_name == "EG_TELECOM") {
		$("#acl_direction").change(function() {
			if ($(this).val() == "1") {
				$("#acl_protocol").find("option[value='HTTP']").show();
			} else {
				$("#acl_protocol").find("option[value='HTTP']").hide();
			}
		});
	}

	if (operator_name == "ECU_CNT") {
		$("#fw_add").hide();
		$("#fw_delete").hide();
		$("#fw_deleteAll").hide();acl_direction
		$("#acl_direction").attr("disabled", true);
		$("#acl_protocol").attr("disabled", true);
		$("#acl_direction").change(function() {
			//handle_direction();
		});
	}

	if (operator_name == "BZ_INTELBRAS") {
		$("#acl_port_td").show();
		$("#acl_direction").change(function() {
			if($("#acl_direction").val() == "1" && $("#acl_protocol").val() != "ICMP" && $("#acl_protocol").val() != "ALL")
			{
				$("#acl_port_font").show();
				$("#acl_port").show();
				$("#acl_port_span").show();
				$("#port_tips_font").show();
			}
			else
			{
				$("#acl_port_font").hide();
				$("#acl_port").hide();
				$("#acl_port_span").hide();
				$("#port_tips_font").hide();
			}
		});

		$("#acl_protocol").change(function() {
			if($("#acl_direction").val() == "1" && $("#acl_protocol").val() != "ICMP" && $("#acl_protocol").val() != "ALL")
			{
				$("#acl_port_font").show();
				$("#acl_port").show();
				$("#acl_port_span").show();
				$("#port_tips_font").show();
			}
			else
			{
				$("#acl_port_font").hide();
				$("#acl_port").hide();
				$("#acl_port_span").hide();
				$("#port_tips_font").hide();
			}
		});
	}

});

function handle_direction() {
	if ($("#acl_direction").val() == "1") {
		$("#acl_protocol option").each(function() {
			if ($(this).val() == "TR069" || $(this).val() == "SAMBA") {
				$(this).remove();
			}
		});
		$("#acl_protocol").append("<option value='TR069'>TR069</option>");
	} else {
		$("#acl_protocol option").each(function() {
			if ($(this).val() == "TR069" || $(this).val() == "SAMBA") {
				$(this).remove();
			}
		});
		$("#acl_protocol").append("<option value='SAMBA'>SAMBA</option>");
	}

}

function getaFirewall_info(getdata) {
	if (getdata != null && getdata.firewall) {
		var g_data = getdata.firewall;
		if (operator_name == "ECU_CNT" && (g_data.LEVEL != "4")) {
			$("[type='radio']").attr("disabled", true);
			$(".input_button").hide();
			$(".input_button").attr("disabled", true);

		}
	}
}

//规则校验
function initValidate() {
	$("#acl_list_form").validate({
		debug: true,
		rules: {
			"subnetMask": { required: true, subnetMask: true },
			"SourceIPStart": { ipv4: true },
			"SourceIPEnd": { ipv4: true },
			"PLDT_acl_sourceIPStart": { ipv4: true },
			"PLDT_acl_sourceIPEnd": { range_int: [8, 32] },
			"acl_port": {required:true,range_int_equal:[1025,65535,0]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
			
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate mac filter ok.....");
			return true;
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	});
}

function Showthisinfo(element, value) //选中当前行并改变背景色
{
	if (!gNewUiFlag) {
	$("#fw_config_form").show();
	}
	addflag = "edit";
	$("#add_item").remove();
	if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
		$("#" + element).children().css("background-color", "#DEC0DF");
		$("#" + element).siblings().children().css("background-color", "#eef2f6");
		$("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
	} else {
    if (!gNewUiFlag) {
		$("#" + element).children().css("background-color", "#b7e3e3");
		$("#" + element).siblings().children().css("background-color", "#eef2f6");
		$("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }
	}

	var index = element.split("_")[1];
	var mode = "old";
	selfilterIndex = parseInt(value);
	if (gOperatorName == "ECU_CNT")
	{
		if(index == "0" || index == "1")
		{
		$("#acl_active").attr('disabled', true);	
		$("#acl_sourceIPStart").attr('disabled', true);
		$("#acl_sourceIPEnd").attr('disabled', true);
		}else{
		$("#acl_active").attr('disabled', false);
		$("#acl_sourceIPStart").attr('disabled', false);
		$("#acl_sourceIPEnd").attr('disabled', false);	
		}
	}
	displayFormHtml(mode, index);
}
function showEditForm(id) {
	$("#fw_config_form").show();
	$("#loading_div").show()
	//$(window.parent.document).find("#loading_window_div4").show();
	//$(window.parent.document).find("#loading_window_div5").show();
	removeError();
	if (id)
		$("#title").html("Edit ACL Settings Rule (ID:".i18n() + (Number(id) + 1) + ")");
}

function displayFormHtml(mode, index) //显示详细信息
{
	var curdata = acl_data[index];
	if (mode == "init") //初始化状态
	{

		if (acl_data.length > 0) {
			curdata = acl_data[index];
		}
		else {
			return;
		}
	}
	if (curdata.Enable == "Yes") {
		curdata.Enable = 1;

	} else if (curdata.Enable == "No") {
		curdata.Enable = 0;
	}

	if (operator_name == "PH_PLDT") {
		$("#PLDT_acl_sourceIPStart").val(curdata.StartIp);
		$("#PLDT_acl_sourceIPEnd").val(curdata.EndIp);
	} else {
		$("#acl_sourceIPStart").val(curdata.StartIp);
		$("#acl_sourceIPEnd").val(curdata.EndIp);
	}
	$("#acl_active").val(curdata.Enable);
	$("#SourcePortEnd").val(curdata.SourcePortEnd);
	$("#acl_direction").val(curdata.Direction);
	if (operator_name == "ECU_CNT") {
		//handle_direction();
	}
	if (operator_name == "PLE_PALTEL") {
		if (curdata.Direction == "0") {
			$("#acl_protocol").find("option[value='HTTPS']").hide();
		} else {
			$("#acl_protocol").find("option[value='HTTPS']").show();
		}
	}

	//ROM_RCSRDS/MAGYAR_4IG
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU") {
		bind_interface_change();
		if(operator_name == "BZ_INTELBRAS")
		{
			if(curdata.Interface.indexOf("TR069_TYPE") >= 0)
			{
				var wan_num = 0;
				if (all_wan_info != '' && all_wan_info.wan) {
					wan_num = all_wan_info.wan.length;
				}
				if (wan_num > 0) {
					for (i = 0; i < wan_num; i++) {
						var single_wan = all_wan_info.wan[i];
						var wan_path = single_wan.WAN_url;
						if ((single_wan.Name.indexOf("TR069") >= 0) && single_wan.Name.indexOf("_B_") == -1) {
							console.log("single_wan.Name " + single_wan.Name);
							$("#acl_bind_direction").val(single_wan.Name);
							break;
						}
					}
				}
			}
			else
			{
				$("#acl_bind_direction").val(curdata.Interface);
			}
		}
		else
		{
			$("#acl_bind_direction").val(curdata.Interface);
		}

	}

	$("#acl_protocol").val(curdata.Protocol);

	if(operator_name == "BZ_INTELBRAS")
	{
		if(curdata.Direction == "1" && curdata.Protocol != "ICMP")
		{
			$("#acl_port_font").show();
			$("#acl_port").show();
			$("#acl_port_span").show();
			$("#port_tips_font").show();
		}
		else
		{
			$("#acl_port_font").hide();
			$("#acl_port").hide();
			$("#acl_port_span").hide();
			$("#port_tips_font").hide();
		}
		$("#acl_port").val(curdata.WanPort);
	}
	cur_protocol = curdata.Protocol;
}
function displayTableHtmlNewUI() {
	var dynamicClsListHTML = '';
	var temp;
	if (acl_data.length > 0)
		$("#image").hide();
	else
		$("#image").show();
	for (var m = 0; m < acl_data.length; m++) {
		var single = acl_data[m];
		var num = m + 1;
		var active = single.Enable == "1" ? "acl_yes".i18n() : "No";
		if (single.Direction == "1") {
			temp = "WAN";
		}
		else if (single.Direction == "0") {
			temp = "LAN";
		}
		dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="' + single.acl_index + '" onclick="Showthisinfo(this.id,this.title)">';
		dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.acl_index + '" name="fw_remove_flag"></td>';
		dynamicClsListHTML += '<td align="center">' + num + '</td>';
		dynamicClsListHTML += '<td align="center">' + active + '</td>';
		dynamicClsListHTML += '<td align="center">' + single.StartIp + "--" + single.EndIp + '</td>';
		dynamicClsListHTML += '<td align="center">' + single.Protocol.i18n() + '</td>';
		dynamicClsListHTML += '<td align="center">' + temp + '</td>';
		if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU") {
			dynamicClsListHTML += '<td align="center">' + single.Interface + '</td>';
		}
		dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
		dynamicClsListHTML += '</tr>';
	}
	$("#ipfilter_List").html(dynamicClsListHTML);
	$("#ipfilter_List tr:eq(0)").click();
}

function displayTableHtml() //动态给列表赋值显示后端传来的数据内容
{
	var num = 1;
	var dynamicClsListHTML = '';
	var temp;
	var n = 0;
	for (var m = 0; m < acl_data.length; m++) {
		var single = acl_data[m];
		if ((operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP") && login_user == 0) {
			if (!(single.Direction == "0" && (single.Protocol == "HTTP" || single.Protocol == "Telnet"))) {
				continue;
			}
		}
		// if (operator_name == "ECU_CNT") {
		// 	if (( (single.Protocol == "HTTPS" || single.Protocol == "TELNET" || single.Protocol == "SSH")) ) {
		// 		continue;
		// 	}
		// }
		n++;
		var active = single.Enable == "1" ? "acl_yes".i18n() : "acl_no".i18n();

		if (single.Direction == "1") {
			temp = "WAN";
		}
		else if (single.Direction == "0") {
			temp = "LAN";
		}
		dynamicClsListHTML += '<tr id="outtable_' + m + '" style="cursor: pointer;" title="' + single.acl_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
		dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + n + '</td>';
		dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + active + '</td>';
		if (operator_name == "PH_PLDT") {
			if (single.StartIp == "") {
				dynamicClsListHTML += '<td align="center" class="out_SourceIP">--</td>';
			} else {
				dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.StartIp + '/' + single.EndIp + '</td>';
			}
		} else {
			dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.StartIp + '--' + single.EndIp + '</td>';
		}
		dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.Protocol + '</td>';
		if (operator_name == "BZ_INTELBRAS")
		{
			if(temp == "WAN" && single.Protocol != "ICMP" && single.Protocol != "ALL")
			{
				dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.WanPort + '</td>';
			}
			else
			{
				dynamicClsListHTML += '<td align="center" class="out_DestIP">' + '--' + '</td>';
			}
		}
		dynamicClsListHTML += '<td align="center" class="out_DestPort">' + temp + '</td>';

		//ROM_RCSRDS/MAGYAR_4IG
		if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU") {
			if(operator_name == "BZ_INTELBRAS")
			{
				if(single.Interface.indexOf("TR069_TYPE") >= 0)
				{
					var wan_num = 0;
					if (all_wan_info != '' && all_wan_info.wan) {
						wan_num = all_wan_info.wan.length;
					}
					if (wan_num > 0) {
						for (i = 0; i < wan_num; i++) {
							var single_wan = all_wan_info.wan[i];
							var wan_path = single_wan.WAN_url;
							if ((single_wan.Name.indexOf("TR069") >= 0) && single_wan.Name.indexOf("_B_") == -1) {
								console.log("single_wan.Name " + single_wan.Name);
								dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single_wan.Name + '</td>';
								break;
							}
						}
					}
				}
				else
				{
					dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.Interface + '</td>';
				}
			}
			else
			{
				dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.Interface + '</td>';
			}
		}
		if (operator_name != "ECU_CNT") {
		dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="' + single.acl_index + '" name="fw_remove_flag"></td>';
		}
		dynamicClsListHTML += '</tr>';
	}
	$("#ipfilter_List").html(dynamicClsListHTML);
	$("#ipfilter_List tr:eq(0)").click();
}

function addfilter() //增加过滤条目
{
	if (gNewUiFlag) {
		$("#loading_div").show()
		//$(window.parent.document).find("#loading_window_div4").show();
		//$(window.parent.document).find("#loading_window_div5").show();
		$("#title").html("Add ACL Settings Rule".i18n());
		$(".input_text").each(function(i) {
			$(this).val('');
		});
	}
	addflag = "add";
	$("#fw_config_form").show();
	var addHtml = []; //新增一个占位标记行
	if (!gNewUiFlag) {
	addHtml += '<tr id="add_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';

	//ROM_RCSRDS/MAGYAR_4IG
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU") {
		addHtml += '<td align="center">--</td>';
	}
	addHtml += '<td></td>';
	addHtml += '</tr>';
	}

	if ($("#add_item").length == 0)//第一次添加数据时设置默认值
	{
		$("#ipfilter_List").append(addHtml);
		$(".input_text").each(function(i) {
			$(this).val('');
		});
		if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
			$("#add_item").children().css("background-color", "#DEC0DF");
			$("#add_item").siblings().children().css("background-color", "#eef2f6");
			$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
		} else {
			$("#add_item").children().css("background-color", "#b7e3e3");
			$("#add_item").siblings().children().css("background-color", "#eef2f6");
			$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
		}

	}
}

function initPage(getdata)//从后端获取数据，初始化页面
{

	if (operator_name == "PH_PLDT") {
		$("#Other_IP").css('display', 'none')
		$("#PLDT_IP").css('display', 'block')

		$("#acl_direction").attr('disabled', 'disabled')

		$("#acl_protocol").find("option").remove();
		$("#acl_protocol").append("<option value='ICMP'>ICMP</option>");
		$("#acl_protocol").append("<option value='TR069'>TR069</option>");
	}
	
	if (operator_name == "COL_MILLICOM") {
		var protocol_select = '<option value="ALL">ALL</option>' +
			'<option value="HTTPS">HTTPS</option>' +
			'<option value="Telnet">Telnet</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SNMP">SNMP</option>' +
			'<option value="FTP">FTP</option>' +
			'<option value="SSH">SSH</option>';
		$("#acl_protocol").html(protocol_select);
	}

	if (operator_name == "CHL_ENTEL") {
		var protocol_select = '<option value="ALL">ALL</option>' +
			'<option value="HTTP">HTTP</option>' +
			'<option value="Telnet">Telnet</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SAMBA">SAMBA</option>' +
			'<option value="FTP">FTP</option>' +
			'<option value="SSH">SSH</option>';
		$("#acl_protocol").html(protocol_select);
	}
	if (operator_name == "EG_TELECOM") {
		var protocol_select = '<option value="ALL">ALL</option>' +
			'<option value="HTTPS">HTTPS</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SNMP">SNMP</option>' +
			'<option value="FTP">FTP</option>';
		if ($("#acl_direction").val() == "1") {
			protocol_select += '<option value="HTTP">HTTP</option>';
		}
		$("#acl_protocol").html(protocol_select);
	}
	if (operator_name == "ECU_CNT") {
		if (login_user == "2") {
			var protocol_select = 
				'<option value="SSH">SSH</option>' +
				'<option value="ICMP">ICMP</option>'+
				'<option value="HTTPS">HTTPS</option>';
		}
		// else if (login_user == "1") {
		// 	var protocol_select =
		// 		'<option value="HTTP">HTTP</option>' +
		// 		'<option value="FTP">FTP</option>';
		// }
		// if ($("#acl_direction").val() == "1") {
		// 	protocol_select += '<option value="TR069">TR069</option>';
		// }
		// else {
		// 	protocol_select += '<option value="SAMBA">SAMBA</option>';
		// }
		$("#acl_protocol").html(protocol_select);
	}


	if (operator_name == "IDN_TELKOM") {
		var protocol_select = '<option value="ALL">ALL</option>' +
			'<option value="HTTP">HTTP</option>' +
			'<option value="Telnet">Telnet</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SNMP">SNMP</option>' +
			'<option value="FTP">FTP</option>' +
			'<option value="SSH">SSH</option>' +
			'<option value="TR069">TR069</option>';
		$("#acl_protocol").html(protocol_select);
	}

	if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE") {
		var protocol_select = '<option value="HTTP">HTTP</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SNMP">SNMP</option>' +
			'<option value="FTP">FTP</option>' +
			'<option value="Telnet">Telnet</option>';

		if (login_user != "0") {
			protocol_select += '<option value="SSH">SSH</option>';
		}
		$("#acl_protocol").html(protocol_select);
	}

	if ((operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP") && login_user == 0) {
		$("input[name='acl_enable']").attr('disabled', true);
		$("#acl_direction").attr('disabled', true).val(0);
		$("#acl_protocol option").each(function() {
			if ($(this).val() != "HTTP" && $(this).val() != "Telnet") {
				$(this).hide();
			}
			if ($(this).val() == "HTTP") {
				$(this).attr("selected", true);
			}
		});
	}

	if (operator_name == "PLE_PALTEL" || operator_name == "MEX_TELMEX") {
		var protocol_select = '<option value="ALL">ALL</option>' +
			'<option value="HTTP">HTTP</option>' +
			'<option value="HTTPS">HTTPS</option>' +
			'<option value="Telnet">Telnet</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SNMP">SNMP</option>' +
			'<option value="FTP">FTP</option>' +
			'<option value="SSH">SSH</option>';
		$("#acl_protocol").html(protocol_select);
	}
	if (operator_name == "COL_ETB") {
		var protocol_select = '<option value="ALL">ALL</option>' +
			'<option value="Telnet">Telnet</option>' +
			'<option value="ICMP">ICMP</option>' +
			'<option value="SNMP">SNMP</option>' +
			'<option value="FTP">FTP</option>' +
			'<option value="SSH">SSH</option>';
		$("#acl_protocol").html(protocol_select);
	}

	//ROM_RCSRDS/MAGYAR_4IG
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS") {
		var protocol_select;
		if ($("#acl_direction").val() == "0") {
			protocol_select = '<option value="ALL">ALL</option>' +
				'<option value="Telnet">Telnet</option>' +
				'<option value="ICMP">ICMP</option>' +
				'<option value="SNMP">SNMP</option>' +
				'<option value="FTP">FTP</option>' +
				'<option value="HTTPS">HTTPS</option>' +
				'<option value="HTTP">HTTP</option>';
		} else {
			if(operator_name == "BZ_INTELBRAS")
			{
				protocol_select = '<option value="ALL">ALL</option>' +
				'<option value="Telnet">Telnet</option>' +
				'<option value="ICMP">ICMP</option>' +
				'<option value="SNMP">SNMP</option>' +
				'<option value="FTP">FTP</option>' +
				'<option value="HTTPS">HTTPS</option>' +
				'<option value="HTTP">HTTP</option>';
			}
			else
			{
				protocol_select = '<option value="ALL">ALL</option>' +
				'<option value="Telnet">Telnet</option>' +
				'<option value="ICMP">ICMP</option>' +
				'<option value="SNMP">SNMP</option>' +
				'<option value="FTP">FTP</option>' +
				'<option value="HTTPS">HTTPS</option>';
			}	
		}
		$("#acl_protocol").html(protocol_select);

	}
	if (getdata.acl_info.Enable == "0") {
		$("input[name='acl_enable']").eq(1).attr('checked', 'checked');
	} else if (getdata.acl_info.Enable == "1") {
		$("input[name='acl_enable']").eq(0).attr('checked', 'checked');
	}

	if (getdata != null && getdata.acl_info) {
		acl_data = getdata.acl_info.acl_data;
if (gNewUiFlag) {
			displayTableHtmlNewUI();
			$("#fw_config_form").hide()
			$("#loading_div").hide();
			$(window.parent.document).find("#loading_window_div4").hide();
			$(window.parent.document).find("#loading_window_div5").hide();
			$("#checkAll").prop("checked", false);
		} else {
		displayTableHtml();
		if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
			$("#ipfilter_List").children().eq(0).children().css("background-color", "#DEC0DF");
			$("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
			$("#ipfilter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
		} else {
			$("#ipfilter_List").children().eq(0).children().css("background-color", "#b7e3e3");
			$("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
			$("#ipfilter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
		}
        }

	}
	if(gusb_port == 0){
		$("#acl_protocol").find("option[value='FTP']").remove();
	}
	
	if(operator_name == "BZ_INTELBRAS" && $("#acl_direction").val() == "1" && $("#acl_protocol").val() != "ICMP" && $("#acl_protocol").val() != "ALL")
	{
		$("#acl_port_font").show();
		$("#acl_port").show();
		$("#acl_port_span").show();
		$("#port_tips_font").show();
	}
	else
	{
		$("#acl_port_font").hide();
		$("#acl_port").hide();
		$("#acl_port_span").hide();
		$("#port_tips_font").hide();
	}
	
}

function doDelete(index) //删除操作
{

	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = parseInt(index);
	XHR.post("set_acl_info", postdata, initPage);
	sleep(300);
}
function click_remove() //点击删除按钮，可以删除单个和多个
{
	var checkNodes = $("input[type='checkbox']");
	var is_checked;
	var value_temp;
	var index;

	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
		if (gNewUiFlag)
			myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
		else
		alert("no_rules_alert".i18n());
		return;
	}
	is_checked = $("input[type = checkbox]").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
		if (gNewUiFlag)
			myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
		else
		alert("no_selected_rules_alert".i18n());
		return;
	}

	if (gNewUiFlag) {
		myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
			if (r) {
				var i = 1
				for (i; i < checkNodes.length; i++) {
					if (checkNodes[i].checked == true) {
						value_temp = checkNodes[i].value;
						index = value_temp.split("_")[1];
						doDelete(index);
					}
				}
				window.location.reload();
			}
		});
	} else {
	if (confirm("delete_alert".i18n()) == false) {
		return;
	}

	for (var i = 0; i < checkNodes.length; i++) {
		if (checkNodes[i].checked == true) {
			value_temp = checkNodes[i].value;
			index = value_temp;
			doDelete(index);
		}
	}
	window.location.reload();
	}
	//XHR.get("get_acl_info", null, initPage); //删除操作后，重新刷新页面
}

function click_remove_all() {
	var checkNodes = $("input[type='checkbox']");
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
		alert("no_rules_alert".i18n());
		return;
	}
	if (confirm("delete_alert_all".i18n()) == false) {
		return;
	}
	for (var i = 0; i < checkNodes.length; i++) {

		value_temp = checkNodes[i].value;
		index = value_temp;
		doDelete(index);
	}
	window.location.reload();
	// XHR.get("get_Ipv4StaticRoute_info", null, initPage);
}

function EnableApply()//配置ACL Enable
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
	postdata.Enable = $("input[name='acl_enable']:checked").val();
	XHR.post("set_acl_info", postdata, initPage);
}
//额外的规则校验
function extraValidCheck()//额外规则校验（包括ip、端口等）
{
	if ($("#acl_sourceIPStart").val() == "" && $("#acl_sourceIPEnd").val() != "") {
		$("#MinSourceAddress-error").html("fw_startIPAlert".i18n());
		return false;
	} else if (ip2int($("#acl_sourceIPStart").val()) > ip2int($("#acl_sourceIPEnd").val())) {
		$("#MinSourceAddress-error").html("fw_endIPTooSmallAlert".i18n());
		return false;
	}
	return true;
}



function doSave()//提交页面数据 
{
	show_shadow();
	if (operator_name == "PH_PLDT" && !PLDT_checkform()) return false
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});

	if (!$("#acl_list_form").valid()) {
		if (gNewUiFlag)
			myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
		else
		alert("illegal_value_alert".i18n());
		return;
	}

	if (operator_name != "PH_PLDT" && !extraValidCheck()) {
		if (gNewUiFlag)
			myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
		else
		alert("illegal_value_alert".i18n());
		return;
	}
	if (addflag == "add") {
		if (operator_name == "TH_AIS" || operator_name == "MY_TM") {
			if (acl_data.length >= 32) {
				alert("fw_most32RulesAlert".i18n());
				return;
			}
		} else if(operator_name == "PLE_PALTEL"){
			if (acl_data.length >= 20) {
				alert("fw_most20RulesAlert".i18n());
				return;
			}
		}else {
			if (acl_data.length >= 16) {
				if (gNewUiFlag)
					myAlert('Tip', '' + "fw_most16RulesAlert".i18n() + '', function() { })
				else
				alert("fw_most16RulesAlert".i18n());
				return;
			}
		}

	}
	var isRepeat = false;
	var postdata = new Object();
	postdata.action = addflag;
	if (addflag == "edit") {
		postdata.index = selfilterIndex;
	}

	if (operator_name == "PH_PLDT") {
		postdata.StartIp = $("#PLDT_acl_sourceIPStart").val();
		postdata.EndIp = $("#PLDT_acl_sourceIPEnd").val();
		postdata.Direction = "1";
	}
	else {
		postdata.StartIp = $("#acl_sourceIPStart").val();
		postdata.EndIp = $("#acl_sourceIPEnd").val();
		postdata.Direction = $("#acl_direction").val();
	}
	postdata.Enable = $("#acl_active").val();
	postdata.Protocol = $("#acl_protocol").val();

	//ROM_RCSRDS/MAGYAR_4IG
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU") {
		if(operator_name == "BZ_INTELBRAS")
		{
			if($("#acl_bind_direction").val().indexOf("TR069") >= 0)
			{
				postdata.Interface = "TR069_TYPE";
			}
			else
			{
				postdata.Interface = $("#acl_bind_direction").val();
			}
		}
		else
		{
			postdata.Interface = $("#acl_bind_direction").val();
		}
		
	}

	if(operator_name == "BZ_INTELBRAS")
	{
		if($("#acl_direction").val() == "1" && $("#acl_protocol").val() != "ICMP" && $("#acl_protocol").val() != "ALL")
		{
			postdata.WanPort = $("#acl_port").val();
		}
		else
		{
			postdata.WanPort = 0;
		}
	}

	//规则重复性校验
	for (var m = 0; m < acl_data.length; m++) {
		if (addflag == "add") {
			if (postdata.Enable == acl_data[m].Enable && postdata.Protocol == acl_data[m].Protocol && postdata.StartIp == acl_data[m].StartIp
				&& postdata.EndIp == acl_data[m].EndIp && postdata.Direction == acl_data[m].Direction && postdata.Direction == acl_data[m].Direction) {
				if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU")
				{
					if(postdata.Interface == acl_data[m].Interface)
					{
						isRepeat = true;
						break;
					}

					if(operator_name == "BZ_INTELBRAS")
					{
						if(postdata.WanPort == acl_data[m].WanPort)
						{
							isRepeat = true;
							break;
						}
					}
				}
				else
				{
					isRepeat = true;
					break;
				}
			}
			else
			{
				if(operator_name == "BZ_INTELBRAS")
				{
					if(postdata.WanPort == acl_data[m].WanPort && postdata.WanPort != '0' && acl_data[m].WanPort != '0')
					{
						isRepeat = true;
						break;
					}
				}
			}
		} else if (addflag == "edit") {
			if (selfilterIndex != acl_data[m].acl_index && postdata.Enable == acl_data[m].Enable && postdata.Protocol == acl_data[m].Protocol && postdata.StartIp == acl_data[m].StartIp
				&& postdata.EndIp == acl_data[m].EndIp && postdata.Direction == acl_data[m].Direction && postdata.Direction == acl_data[m].Direction) {
				if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "BZ_INTELBRAS" || operator_name == "ALB_AFT" || operator_name == "ESP_EMBOU")
				{
					if(postdata.Interface == acl_data[m].Interface)
					{
						isRepeat = true;
						break;
					}

					if(operator_name == "BZ_INTELBRAS")
					{
						if(postdata.WanPort == acl_data[m].WanPort)
						{
							isRepeat = true;
							break;
						}
					}
				}
				else
				{
					isRepeat = true;
					break;
				}
			}
			else
			{
				if(selfilterIndex != acl_data[m].acl_index && operator_name == "BZ_INTELBRAS")
				{
					if(postdata.WanPort == acl_data[m].WanPort && postdata.WanPort != '0' && acl_data[m].WanPort != '0')
					{
						isRepeat = true;
						break;
					}
				}
			}
		}

	}

	if (isRepeat) {
		if (gNewUiFlag)
			myAlert('Tip', "Repeat with the existing rules. Please reconfigure it!", function() { })
		else
		alert("repeat_with_the_existing_rules".i18n());
		return;
	}

	XHR.post("set_acl_info", postdata, initPage);
	addflag = "edit";
}

function PLDT_checkform() {
	var start = $("#PLDT_acl_sourceIPStart").val();
	var end = $("#PLDT_acl_sourceIPEnd").val();


	if ((start == "" && end != "") || (start != "" && end == "")) {
		$("#MinSourceAddress-error").html("Configure both or not!");
		return false;
	}

	return true;
}

function initConnectName(getdata) {

	all_wan_info = getdata;
	show_wan_name();
}

function show_wan_name() {
	var wan_num = 0;
	var dynamicHtml = '';
	if (all_wan_info.show_wan) {
		selectwan = all_wan_info.show_wan;
	}

	if (all_wan_info != '' && all_wan_info.wan) {
		wan_num = all_wan_info.wan.length;
	}
	if (wan_num > 0) {
		for (i = 0; i < wan_num; i++) {
			var single_wan = all_wan_info.wan[i];
			var wan_path = single_wan.WAN_url;
			if(operator_name == "ESP_EMBOU"){
				dynamicHtml += ' <option value="' + single_wan.Name + '">' + single_wan.Name + '</option>';
			}else{
				if ((single_wan.Name.indexOf("INTERNET") >= 0
					|| single_wan.Name.indexOf("TR069") >= 0 || single_wan.Name.indexOf("TR069_VOIP") >= 0)
					&& single_wan.Name.indexOf("_B_") == -1) {
					dynamicHtml += ' <option value="' + single_wan.Name + '">' + single_wan.Name + '</option>';
				}
			}
		}
	}
	dynamicHtml += ' <option value="ALL">ALL</option>';
	$("#acl_bind_direction").html(dynamicHtml);
}

function bind_interface_change() {
	var dynamicHtml = '';
	var res = $("#acl_protocol").find("option[value='HTTP']");
	if ($("#acl_direction").val() == "1") {
		show_wan_name();
		if(operator_name != "BZ_INTELBRAS" && operator_name != "ALB_AFT")
		{
			if (res.length > 0) {
				$("#acl_protocol option[value='HTTP']").remove();
			}
		}
	} else {
		dynamicHtml = '';
		dynamicHtml += ' <option value="LAN">LAN</option>';
		$("#acl_bind_direction").html(dynamicHtml);
		if (res.length == 0 ){
			$("#acl_protocol").append('<option value="HTTP">HTTP</option>');
		}
	}
}