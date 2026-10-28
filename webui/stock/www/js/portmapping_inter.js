var port_mapping_data = "";
var all_wan_info = '';
var wan_info = '';
var addflag = "edit";
var selfilterIndex = 1;
var operator_name;
var lan_status;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	initValidate();

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	if (operator_name != "MEX_TELMEX") {
		$("#host_name").hide();
		$("#user_div").hide();
		$("#application_div").hide();
	}

	if (operator_name == "MEX_TELMEX") {
		//$("#protocol_div").hide();
		//$("#public_port_div").hide();
		//$("#private_port_div").hide();
		getAppTempsOptions();
		$("#port_mapping_application").attr("disabled", true);
		$("input[name='app_type_button']").bind("click", function() {
			var type_button = $("input[name='app_type_button']:checked").val();
			if (type_button == 0) {
				$("#port_mapping_application").attr("disabled", true);
				$("#port_mapping_application").val("0");
			} else {
				$("#port_mapping_application").attr("disabled", false);
			}
		});

	}

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/port_mapping", initPage);
	} else {
		//XHR.get("get_allwan_info", null, initConnectName);
		XHR.poll(gStatusFreshInterval, "get_lan_status", null, getLanHost);
		XHR.get("get_allwan_info", null, initPage);

	}
	if (operator_name == "MY_TM") {
		$("#application_div_mytm").show();
		$("#application_my_tm").bind("change", function() {
			if ($("#application_my_tm").val() == "SSH") {
				$("#port_mapping_public_port_start").val("22");
				$("#port_mapping_public_port_end").val("22");
				$("#port_mapping_private_port_start").val("22");
				$("#port_mapping_private_port_end").val("22");

			} else if ($("#application_my_tm").val() == "Telnet") {
				$("#port_mapping_public_port_start").val("23");
				$("#port_mapping_public_port_end").val("23");
				$("#port_mapping_private_port_start").val("23");
				$("#port_mapping_private_port_end").val("23");
			} else {
				$("#port_mapping_public_port_start").val("21");
				$("#port_mapping_public_port_end").val("21");
				$("#port_mapping_private_port_start").val("21");
				$("#port_mapping_private_port_end").val("21");
			}
		});
	}

	$("#host_name").bind("change", function() {
		$("#port_mapping_private_ip").val($("#host_name").val());
	});
});

function getLanHost(getdata) {
	lan_status = getdata.lan_status

}

function initValidate() {
	$("#port_mapping_list_form").validate({
		debug: true,
		rules: {
			"port_mapping_wan": { required: true },
			"port_mapping_description": { rangelength: [0, 31], description: true },
			"port_mapping_public_ip": {
				ipv4: true
			},
			"port_mapping_public_port_start": {
				required: true,
				range_int: [1, 65535]
			},
			"port_mapping_public_port_end": {
				required: true,
				range_int: [1, 65535]
			},
			"port_mapping_private_ip": {
				required: true,
				ipv4: true
			},
			"port_mapping_private_port_start": {
				required: true,
				range_int: [1, 65535]
			},
			"port_mapping_private_port_end": {
				required: true,
				range_int: [1, 65535]
			}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate port mapping ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate port mapping failed.....");
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


	var mode = "old";
	var portmapping_index = element.split("_")[1];
	var wan_index = element.split("_")[2];
	selfilterIndex = value.split("_")[1];
	selfilterIndex = parseInt(selfilterIndex);
	displayFormHtml(mode, wan_index, portmapping_index);
}

function displayFormHtml(mode, wan_index, portmapping_index) //显示详细信息
{

	if (mode == "init") //初始化状态
	{
		//wan_info = all_wan_info.wan; //获取所有wan连接信息
		for (var i = 0; i < wan_info.length; i++) {
			port_mapping_data = wan_info[i].portMapping; //获取当前第i条WAN下的portMapping信息
			//var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
			if (port_mapping_data.length == 0) {
				continue;
			}
			else {
				for (var m = 0; m < port_mapping_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
				{
					if (undefined == port_mapping_data[m]) {
						continue;
					}
					else {
						wan_index = i;
						portmapping_index = m;
						break;
					}
				}
				break;
			}
		}
		var curdata = wan_info[wan_index].portMapping[portmapping_index];
		var wan_url = wan_info[wan_index].WAN_url;

	}
	else {
		var curdata = wan_info[wan_index].portMapping[portmapping_index];
		var wan_url = wan_info[wan_index].WAN_url;
	}
	if (!curdata) {
		//addfilter();
		return;
	}
	if (!gNewUiFlag) {
		$("#fw_config_form").show();
	}
	$("#port_mapping_wan").attr("disabled", true);
	$("#port_mapping_wan").val(wan_url);
	$("#port_mapping_description").val(curdata.PortMappingDescription);
	$("#port_mapping_protocol").val(curdata.PortMappingProtocol);
	$("#port_mapping_public_ip").val(curdata.RemoteHost);
	$("#port_mapping_public_port_start").val(curdata.ExternalPort);
	$("#port_mapping_public_port_end").val(curdata.ExternalPortEndRange);
	$("#port_mapping_private_ip").val(curdata.InternalClient);
	$("#port_mapping_private_port_start").val(curdata.InternalPort);
	$("#port_mapping_private_port_end").val(curdata.X_FH_InternalPortEndRange);
	$("#port_mapping_enable").val(curdata.PortMappingEnabled);

	if (operator_name == "MEX_TELMEX") {
		$("input[name='app_type_button']").eq(0).attr("checked", true);;
		$("#port_mapping_application").attr("disabled", true);
		$("#port_mapping_application").val("0");
	}
}

function displayTableHtml() {
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		port_mapping_data = wan_info[i].portMapping; //获取当前第i条WAN下的portMapping信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
		if (port_mapping_data.length != 0) {
			for (var m = 0; m < port_mapping_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
			{
				var n = m + 1;
				var single = port_mapping_data[m]; //对于第m条portmapping 信息赋值给single
				$("#port_mapping_wan option").each(function() {
					if (wan_url == this.value) {
						wan_url = this.text;
					}
				});
				//针对每一条portMapping信息，其id中i、m分别表示第i条wan连接下的第m条portMapping信息。以供showshisinfo调用
				dynamicClsListHTML += '<tr id="table_' + m + "_" + i +
					'" style="cursor: pointer;" title="delout_' + single.port_mapping_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center">' + num + '</td>';
				dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortMappingDescription + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortMappingProtocol + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.RemoteHost + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.ExternalPort + '</td>'; 初始代码
				dynamicClsListHTML += '<td align="center">' + single.ExternalPort + '-' + single.ExternalPortEndRange + '</td>';//fengshuo xiugai
				dynamicClsListHTML += '<td align="center">' + single.InternalClient + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.X_FH_InternalPortEndRange + '-' + single.ExternalPortEndRange + 初始代码
				dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.X_FH_InternalPortEndRange +//冯朔修改
					'</td>';
				if (single.PortMappingEnabled == "1") {
					dynamicClsListHTML += '<td align="center">' + "enable_certificate".i18n() + '</td>';
				} else {
					dynamicClsListHTML += '<td align="center">' + "disable_certificate".i18n() + '</td>';
				}
				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + i + '_' + single.port_mapping_index +
					'" name="port_mapping_flag"></td>';
				dynamicClsListHTML += '</tr>';
				num++;
			}
		}


	}

	$("#port_mapping_list").html(dynamicClsListHTML);
	$("#port_mapping_list tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		port_mapping_data = wan_info[i].portMapping; //获取当前第i条WAN下的portMapping信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
		if (port_mapping_data.length != 0) {
			for (var m = 0; m < port_mapping_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
			{
				var n = m + 1;
				var single = port_mapping_data[m]; //对于第m条portmapping 信息赋值给single
				$("#port_mapping_wan option").each(function() {
					if (wan_url == this.value) {
						wan_url = this.text;
					}
				});
				//针对每一条portMapping信息，其id中i、m分别表示第i条wan连接下的第m条portMapping信息。以供showshisinfo调用
				dynamicClsListHTML += '<tr id="mactable_' + m + "_" + i + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.port_mapping_index + '" onclick="Showthisinfo(this.id,this.title)">';
				dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + i + '_' + single.port_mapping_index + '" name="fw_remove_flag"></td>';
				dynamicClsListHTML += '<td align="center">' + num + '</td>';
				dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortMappingDescription + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortMappingProtocol + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.RemoteHost + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.ExternalPort + '-' + single.ExternalPortEndRange + '</td>';//fengshuo xiugai
				dynamicClsListHTML += '<td align="center">' + single.InternalClient + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.X_FH_InternalPortEndRange +//冯朔修改
					'</td>';
				if (single.PortMappingEnabled == "1") {
					dynamicClsListHTML += '<td align="center">' + "Enable".i18n() + '</td>';
				} else {
					dynamicClsListHTML += '<td align="center">' + "Disable".i18n() + '</td>';
				}
				dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
				dynamicClsListHTML += '</tr>';
				num++;
			}
		}
	}
	if (dynamicClsListHTML != '')
		$("#image").hide();
	else
		$("#image").show();
	$("#port_mapping_list").html(dynamicClsListHTML);
	$("#port_mapping_list tr:eq(0)").click();
}
function showEditForm(id) {
	$("#fw_config_form").show();
	$("#loading_div").show()
	//$(window.parent.document).find("#loading_window_div4").show();
	//$(window.parent.document).find("#loading_window_div5").show();
	removeError();
	if (id)
		$("#title").html("Edit Port Mapping Rule (ID:".i18n() + (Number(id) + 1) + ")");
}

function addfilter() //增加过滤条目
{
	if (gNewUiFlag) {
		$("#loading_div").show()
		//$(window.parent.document).find("#loading_window_div4").show();
		//$(window.parent.document).find("#loading_window_div5").show();
		$("#title").html("Add Port Mapping Rule".i18n());
	}
	addflag = "add";
	var addHtml = []; //新增一个占位标记行
	$("#fw_config_form").show();
	$("#port_mapping_wan").attr("disabled", false);
	if (!gNewUiFlag) {
		addHtml += '<tr id="add_item">';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td></td>';
		addHtml += '</tr>';
	}

		if ($("#add_item").length == 0) //第一次添加数据时设置默认值
		{
			$("#port_mapping_list").append(addHtml);
			$(".input_text").each(function(i) {
				$(this).val('');
			});
			$("#Protocol").val("TCP");
			$("#port_mapping_enable").val("Enable");
			if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
				$("#add_item").children().css("background-color", "#DEC0DF");
				$("#add_item").siblings().children().css("background-color", "#eef2f6");
				$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
			} else {
				if (!gNewUiFlag) {
					$("#add_item").children().css("background-color", "#b7e3e3");
					$("#add_item").siblings().children().css("background-color", "#eef2f6");
					$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
				}
			}

		}

		if (operator_name == "MEX_TELMEX") {
			load_pre_config(0);
		}
	
}


function initPage(getdata) //从后端获取数据，初始化页面
{
	var wan_num = 0;
	var dynamicHtml = '';
	var dynamtiHtml_host = '';

	//增加hostname下拉框
	dynamtiHtml_host += ' <option name= "single_wan" value="">' + "Select" + '</option>';
	for (j = 0; j < lan_status.data.length; j++) {
		var single_lan = lan_status.data[j];
		if (single_lan.AddressSource == "DHCP") {
			dynamtiHtml_host += ' <option name= "single_wan" value="' + single_lan.IPAddress + '">' + single_lan.HostName + '</option>';
		}
	}
	$("#host_name").html(dynamtiHtml_host);
	$("#application_my_tm").val("1");


	if (getdata != null && getdata.wan) {
		all_wan_info = getdata;
		wan_info = all_wan_info.wan;
		if (all_wan_info != '' && all_wan_info.wan) {
			wan_num = all_wan_info.wan.length;
		}

		if (wan_num > 0) {
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (single_wan.ServiceList.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) {
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}

			}
		}
		$("#port_mapping_wan").html(dynamicHtml);

		if (gNewUiFlag) {
			displayTableHtmlNewUI();
			$("#fw_config_form").hide()
			$("#loading_div").hide();
			$(window.parent.document).find("#loading_window_div4").hide();
			$(window.parent.document).find("#loading_window_div5").hide();
			$("#checkAll").prop("checked", false);
		} else {
			displayTableHtml();
			//displayFormHtml("init", 0 , 0);	
			//$("#port_mapping_config_form").hide();
			if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
				$("#port_mapping_list").children().eq(0).children().css("background-color", "#DEC0DF");
				$("#port_mapping_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
				$("#port_mapping_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color",
					"#eef2f6");
			} else {
				$("#port_mapping_list").children().eq(0).children().css("background-color", "#b7e3e3");
				$("#port_mapping_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
				$("#port_mapping_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color",
					"#eef2f6");
			}
		}

	}
}

function doDelete(wan_num, index) //删除操作
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.url = wan_info[parseInt(wan_num)].WAN_url;
	postdata.port_mapping_index = parseInt(index);
	postdata.pagetype = "portmapping";
	XHR.post("set_port_mapping_info_inter", postdata, initPage);
	selfilterIndex = 1;
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
						var wan_num = value_temp.split("_")[1];
						index = value_temp.split("_")[2];
						doDelete(wan_num, index);
					}
				}
				window.location.reload();
			}
		});
	} else {
		if (confirm("delete_alert".i18n()) == false) //确认删除
		{
			return;
		}
		for (var i = 0; i < checkNodes.length; i++) {
			if (checkNodes[i].checked == true) {
				value_temp = checkNodes[i].value;
				var wan_num = value_temp.split("_")[1];
				index = value_temp.split("_")[2];
				doDelete(wan_num, index);
			}
		}
		//XHR.get("get_allwan_info", null, initConnectName);
		$("#fw_config_form").hide();
		window.location.reload();
		//	XHR.get("get_allwan_info", null, initPage);	
	}
}
function click_remove_all() {
	var checkNodes = $("input[type='checkbox']");
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
		alert("no_rules_alert".i18n());
		return;
	}
	if (confirm("delete_all_alert".i18n()) == false) {
		return;
	}
	for (var i = 0; i < checkNodes.length; i++) {
		value_temp = checkNodes[i].value;
		var wan_num = value_temp.split("_")[1];
		index = value_temp.split("_")[2];
		doDelete(wan_num, index);
	}
	$("#fw_config_form").hide();
	window.location.reload();
	XHR.get("get_allwan_info", null, initPage);
}

function extraValidCheck()//额外规则校验（包括ip、端口等）
{

	if (parseInt($("#port_mapping_public_port_start").val()) > parseInt($("#port_mapping_public_port_end").val())) {
		if (gNewUiFlag)
			myAlert('Tip',"fw_endPortTooSmallAlert".i18n())
		else
			alert("fw_endPortTooSmallAlert".i18n());
		return false;
	}

	if (parseInt($("#port_mapping_private_port_start").val()) > parseInt($("#port_mapping_private_port_end").val())) {
		if (gNewUiFlag)
			myAlert('Tip', "fw_endPortTooSmallAlert".i18n())
		else
			alert("fw_endPortTooSmallAlert".i18n());
		return false;
	}

	return true;
}

function do_save() //提交页面数据 
{
	show_shadow();
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});

	if (!$("#port_mapping_list_form").valid()) {
		if (gNewUiFlag)
			myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
		else
			alert("illegal_value_alert".i18n());
		return;
	}

	if (!extraValidCheck()) {
		return;
	}

	var postdata = new Object();
	postdata.action = addflag;
	if (addflag == "edit") {
		postdata.port_mapping_index = selfilterIndex;
	}
	if (addflag == "add") {

		if (port_mapping_data.length >= 32) {
			if (gNewUiFlag)
				myAlert('Tip', '' + "app_most32RulesAlert".i18n() + '', function() { })
			else
				alert("app_most32RulesAlert".i18n());
			return;
		}
	}
	postdata.wanurl = $("#port_mapping_wan").val();
	postdata.pagetype = "portmapping";
	if (operator_name == "MEX_TELMEX") {
		postdata.portmapping_info = JSON.stringify(get_portmapping_info());
	} else {

		postdata.PortMappingEnabled = $("#port_mapping_enable").val();
		postdata.PortMappingDescription = $("#port_mapping_description").val();
		postdata.PortMappingProtocol = $("#port_mapping_protocol").val();
		postdata.RemoteHost = $("#port_mapping_public_ip").val();
		postdata.ExternalPort = $("#port_mapping_public_port_start").val();
		postdata.ExternalPortEndRange = $("#port_mapping_public_port_end").val();
		postdata.InternalClient = $("#port_mapping_private_ip").val();
		postdata.InternalPort = $("#port_mapping_private_port_start").val();
		postdata.X_FH_InternalPortEndRange = $("#port_mapping_private_port_end").val();

	}
	console.log(postdata);
	XHR.post("set_port_mapping_info_inter", postdata, initPage);
	addflag = "edit";
}


function load_pre_config(optionValue) {
	//generateHtml(optionValue);
	generatevalue(optionValue);
}

function getAnAppTempOption(optionValue, language) {
	var aOption = "<option value=" + "\"" + optionValue + "\">" + language.i18n() + "</option>";
	return aOption;
}

function getAppTempsOptions() {
	var html = "";
	html += getAnAppTempOption("0", "bbsp_selectdd");
	html += getAnAppTempOption("1", "bbsp_AIMTalk");
	html += getAnAppTempOption("2", "bbsp_AppleRemoteDesktop");
	html += getAnAppTempOption("3", "bbsp_RemoteSupportXP");
	html += getAnAppTempOption("4", "bbsp_BearShare");
	html += getAnAppTempOption("5", "bbsp_BitTorrent");
	html += getAnAppTempOption("6", "bbsp_CameraIP1");
	html += getAnAppTempOption("7", "bbsp_CameraIP2");
	html += getAnAppTempOption("8", "bbsp_CameraIP3");
	html += getAnAppTempOption("9", "bbsp_CameraIP4");
	html += getAnAppTempOption("10", "bbsp_CheckpointFW1VPN");
	html += getAnAppTempOption("11", "bbsp_DirectX");
	html += getAnAppTempOption("12", "bbsp_eMule");
	html += getAnAppTempOption("13", "bbsp_RemoteDesktop");
	html += getAnAppTempOption("14", "bbsp_Gnutella");
	html += getAnAppTempOption("15", "bbsp_ICQ");
	html += getAnAppTempOption("16", "bbsp_iMesh");
	html += getAnAppTempOption("17", "bbsp_IRC");
	html += getAnAppTempOption("18", "bbsp_iTunes");
	html += getAnAppTempOption("19", "bbsp_KaZaa");
	html += getAnAppTempOption("20", "bbsp_Napster");
	html += getAnAppTempOption("21", "bbsp_Netmeeting");
	html += getAnAppTempOption("22", "bbsp_OpenVPN");
	html += getAnAppTempOption("23", "bbsp_pcAnywhere");
	html += getAnAppTempOption("24", "bbsp_PlayStation");

	html += getAnAppTempOption("25", "bbsp_PPTP");
	html += getAnAppTempOption("26", "bbsp_FTPServer");
	html += getAnAppTempOption("27", "bbsp_ServerDHCPv6");
	html += getAnAppTempOption("28", "bbsp_ServerDNS");
	html += getAnAppTempOption("29", "bbsp_ServerHTTPS");
	html += getAnAppTempOption("30", "bbsp_ServerIMAP");
	html += getAnAppTempOption("31", "bbsp_ServerLotusNotes");
	html += getAnAppTempOption("32", "bbsp_ServerMAMP");
	html += getAnAppTempOption("33", "bbsp_ServerMySQL");
	html += getAnAppTempOption("34", "bbsp_ServerNNTP");
	html += getAnAppTempOption("35", "bbsp_ServerPOP3");
	html += getAnAppTempOption("36", "bbsp_ServerSQL");
	html += getAnAppTempOption("37", "bbsp_ServerSSH");
	html += getAnAppTempOption("38", "bbsp_ServerSMTP");
	html += getAnAppTempOption("39", "bbsp_TelnetServer");
	html += getAnAppTempOption("40", "bbsp_TFTP");
	html += getAnAppTempOption("41", "bbsp_ServerWEB");
	html += getAnAppTempOption("42", "bbsp_Skype");
	html += getAnAppTempOption("43", "bbsp_VNC");
	html += getAnAppTempOption("44", "bbsp_Vuze");
	html += getAnAppTempOption("45", "bbsp_Wii");
	html += getAnAppTempOption("46", "bbsp_WindowsLiveMessenger");
	html += getAnAppTempOption("47", "bbsp_WinMX");
	html += getAnAppTempOption("48", "bbsp_XWindows");
	html += getAnAppTempOption("49", "bbsp_XboxLive");
	html += getAnAppTempOption("50", "bbsp_YahooMessenger");
	$("#port_mapping_application").append(html);
}
var portmappingarrary =
	[
		[{ prt: "TCP", ips: "", ipse: "", eps: "", epse: "" }],
		[{ prt: "TCP", ips: "5190", ipse: "5190", eps: "5190", epse: "5190" }],//AIM TALK
		[{ prt: "TCP", ips: "3238", ipse: "3238", eps: "3238", epse: "3238" }],//Apple Remote desktop
		[{ prt: "TCP", ips: "3389", ipse: "3389", eps: "3389", epse: "3389" }],//XP Remote desktop
		[{ prt: "TCP", ips: "6346", ipse: "6346", eps: "6346", epse: "6346" }],//BearShare
		[{ prt: "TCP/UDP", ips: "6881", ipse: "6900", eps: "6881", epse: "6900" }],//BitTorrent
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "8120", epse: "8120" }],//IP Camera 1
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "8121", epse: "8121" }],//IP Camera 2
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "8122", epse: "8122" }],//IP Camera 3
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "8123", epse: "8123" }],//IP Camera 4
		[{ prt: "TCP/UDP", ips: "259", ipse: "259", eps: "259", epse: "259" }],//VPN

		//[{prt:"TCP",ips:"2300",ipse:"2400",eps:"2300",epse:"2400"},{prt:"UDP",ips:"2302",ipse:"2400",eps:"2302",epse:"2400"},{prt:"UDP",ips:"6073",ipse:"6073",eps:"6073",epse:"6073"},{prt:"TCP/UDP",ips:"47624",ipse:"47624",eps:"47624",epse:"47624"}],//DirectX
		//[{prt:"TCP",ips:"4662",ipse:"4662",eps:"4662",epse:"4662"},{prt:"UDP",ips:"4711",ipse:"4711",eps:"4711",epse:"4711"},{prt:"UDP",ips:"64583",ipse:"64583",eps:"64583",epse:"64583"},{prt:"TCP/UDP",ips:"4672",ipse:"4672",eps:"4672",epse:"4672"},{prt:"TCP/UDP",ips:"27673",ipse:"27673",eps:"27673",epse:"27673"}],//eMule
		[{ prt: "TCP", ips: "2300", ipse: "2400", eps: "2300", epse: "2400" }],//DirectX
		[{ prt: "TCP", ips: "4662", ipse: "4662", eps: "4662", epse: "4662" }],//eMule
		[{ prt: "TCP", ips: "3389", ipse: "3389", eps: "3389", epse: "3389" }],//Remote desktop
		[{ prt: "TCP/UDP", ips: "6346", ipse: "6347", eps: "6346", epse: "6347" }],//Gnutella
		[{ prt: "TCP", ips: "5190", ipse: "5190", eps: "5190", epse: "5190" }],//ICQ
		[{ prt: "TCP", ips: "1214", ipse: "1214", eps: "1214", epse: "1214" }],//IMESH
		[{ prt: "TCP", ips: "194", ipse: "194", eps: "194", epse: "194" }],//IRC
		//[{prt:"TCP",ips:"194",ipse:"194",eps:"194",epse:"194"},{prt:"TCP",ips:"5100",ipse:"5100",eps:"5100",epse:"5100"},{prt:"TCP",ips:"6665",ipse:"6669",eps:"6665",epse:"6669"}],//IRC
		[{ prt: "TCP/UDP", ips: "3689", ipse: "3689", eps: "3689", epse: "3689" }],//iTunes
		[{ prt: "TCP", ips: "1214", ipse: "1214", eps: "1214", epse: "1214" }],//KaZaa
		[{ prt: "TCP/UDP", ips: "6699", ipse: "6699", eps: "6699", epse: "6699" }],//Napster
		[{ prt: "TCP", ips: "389", ipse: "389", eps: "389", epse: "389" }],//Netmeeting

		//[{prt:"TCP",ips:"389",ipse:"389",eps:"389",epse:"389"},{prt:"TCP",ips:"522",ipse:"522",eps:"522",epse:"522"},{prt:"TCP",ips:"1023",ipse:"1023",eps:"1023",epse:"1023"},{prt:"TCP",ips:"1502",ipse:"1504",eps:"1502",epse:"1504"},{prt:"TCP",ips:"1720",ipse:"1732",eps:"1720",epse:"1732"},{prt:"TCP",ips:"65534",ipse:"65534",eps:"65534",epse:"65534"},{prt:"UDP",ips:"1024",ipse:"65535",eps:"1024",epse:"65535"}],//Netmeeting
		[{ prt: "TCP/UDP", ips: "1194", ipse: "1194", eps: "1194", epse: "1194" }],//OpenVPN
		[{ prt: "TCP/UDP", ips: "5631", ipse: "5632", eps: "5631", epse: "5632" }],//pcAnywhere
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "80", epse: "80" }],//PlayStation
		[{ prt: "TCP/UDP", ips: "1723", ipse: "1723", eps: "1723", epse: "1723" }],//PPTP
		[{ prt: "TCP", ips: "21", ipse: "21", eps: "21", epse: "21" }],//FTPServer
		[{ prt: "TCP/UDP", ips: "547", ipse: "547", eps: "547", epse: "547" }],//ServerDHCPv6
		[{ prt: "TCP/UDP", ips: "53", ipse: "53", eps: "53", epse: "53" }],//DNS
		[{ prt: "TCP", ips: "443", ipse: "443", eps: "443", epse: "443" }],//HTTPS
		[{ prt: "TCP", ips: "143", ipse: "143", eps: "143", epse: "143" }],//IMAP
		[{ prt: "TCP", ips: "1352", ipse: "1352", eps: "1352", epse: "1352" }],//LotusNotes
		[{ prt: "TCP", ips: "8888", ipse: "8889", eps: "8888", epse: "8889" }],//MAMP
		[{ prt: "TCP/UDP", ips: "3306", ipse: "3306", eps: "3306", epse: "3306" }],//MySQL
		[{ prt: "TCP", ips: "119", ipse: "119", eps: "119", epse: "119" }],//NNTP
		[{ prt: "TCP", ips: "110", ipse: "110", eps: "110", epse: "110" }],//POP3
		[{ prt: "TCP", ips: "1433", ipse: "1433", eps: "1433", epse: "1433" }],//SQL
		[{ prt: "TCP", ips: "22", ipse: "22", eps: "22", epse: "22" }],//SSH
		[{ prt: "TCP", ips: "25", ipse: "25", eps: "25", epse: "25" }],//SMTP
		[{ prt: "TCP", ips: "23", ipse: "23", eps: "23", epse: "23" }],//TelnetServer
		[{ prt: "TCP", ips: "69", ipse: "69", eps: "69", epse: "69" }],//TFTP
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "80", epse: "80" }],//ServerWEB
		[{ prt: "TCP", ips: "80", ipse: "80", eps: "80", epse: "80" }],//Skype
		[{ prt: "TCP", ips: "5500", ipse: "5500", eps: "5500", epse: "5500" }],//VNC
		[{ prt: "TCP", ips: "6880", ipse: "6880", eps: "6880", epse: "6880" }],//Vuze
		[{ prt: "TCP/UDP", ips: "80", ipse: "80", eps: "80", epse: "80" }],//Wii
		[{ prt: "UDP", ips: "9", ipse: "9", eps: "9", epse: "9" }],//WindowsLiveMessenger
		[{ prt: "TCP", ips: "6699", ipse: "6699", eps: "6699", epse: "6699" }],//WinMX
		[{ prt: "UDP", ips: "6000", ipse: "6000", eps: "6000", epse: "6000" }],//XWindows
		[{ prt: "TCP/UDP", ips: "53", ipse: "53", eps: "53", epse: "53" }],//XboxLive
		[{ prt: "TCP/UDP", ips: "5050", ipse: "5050", eps: "5050", epse: "5050" }],//YahooMessenger
	];
function generateHtml(optionValue) {

	var dynamicClsListHTML = '';
	$("#telmex_config_form").empty();
	//for (var m = 0; m <portmappingarrary[optionValue].length; m++)
	for (var m = 0; m < 1; m++) {
		dynamicClsListHTML += '<div class="main_item">\
							<div class="main_item_name"><font>'+ "app_protocol".i18n() + '</font></div>\
							<div class="main_item_content">\
								<select id="port_mapping_protocol'+ m + '" style="width:150px">\
									<option value="TCP/UDP">TCP/UDP</option>\
									<option value="TCP">TCP</option>\
									<option value="UDP">UDP</option>\
								</select>\
							</div>\
						</div>\
						<div class="main_item" id="public_port_div">\
							<div class="main_item_name"><font>'+ "app_private_port".i18n() + '</font></div>\
							<div class="main_item_content">\
								<input type="text" class="input_text" autocomplete="off" id="port_mapping_public_port_start'+ m + '" name="port_mapping_public_port_start" style="width:150px">&nbsp;--&nbsp;\
								<input type="text" class="input_text" autocomplete="off" id="port_mapping_public_port_end'+ m + '"name="port_mapping_public_port_end" style="width:150px"><span class="redcolorfont">*</span>&nbsp;&nbsp;(1-65535)\
							</div>\
							<div id="Public_port-error" class="main_item_error_hint_extra"></div>\
						</div>\
						<div class="main_item" id="private_port_div">\
							<div class="main_item_name"><font>'+ "app_public_port".i18n() + '</font></div>\
							<div class="main_item_content">\
								<input type="text" class="input_text" autocomplete="off" id="port_mapping_private_port_start'+ m + '" name="port_mapping_private_port_start" style="width:150px">&nbsp;--&nbsp;\
								<input type="text" class="input_text" autocomplete="off" id="port_mapping_private_port_end'+ m + '" name="port_mapping_private_port_end" style="width:150px"/><span class="redcolorfont">*</span>&nbsp;&nbsp;(1-65535)\
							</div>\
							<div id="MinDestinationPort-error" class="main_item_error_hint_extra"></div>\
						</div><br>';

	}
	$("#telmex_config_form").append(dynamicClsListHTML);
}


function generatevalue(optionValue) {

	for (var m = 0; m < portmappingarrary[optionValue].length; m++) {
		//$("#port_mapping_protocol"+ m +"").val(portmappingarrary[optionValue][m].prt);
		//$("#port_mapping_public_port_start"+ m +"").val(portmappingarrary[optionValue][m].ips);
		//$("#port_mapping_public_port_end"+ m +"").val(portmappingarrary[optionValue][m].ipse);
		//$("#port_mapping_private_port_start"+ m +"").val(portmappingarrary[optionValue][m].eps);
		//$("#port_mapping_private_port_end"+ m +"").val(portmappingarrary[optionValue][m].epse);

		$("#port_mapping_protocol").val(portmappingarrary[optionValue][m].prt);
		$("#port_mapping_public_port_start").val(portmappingarrary[optionValue][m].ips);
		$("#port_mapping_public_port_end").val(portmappingarrary[optionValue][m].ipse);
		$("#port_mapping_private_port_start").val(portmappingarrary[optionValue][m].eps);
		$("#port_mapping_private_port_end").val(portmappingarrary[optionValue][m].epse);
	}

}

function get_portmapping_info() {
	var single_portmapping_info = [];
	var option = $("#port_mapping_application").val();
	for (var i = 0; i < portmappingarrary[option].length; i++) {
		var obj = new Object();
		obj.PortMappingEnabled = $("#port_mapping_enable").val();
		obj.InternalClient = $("#port_mapping_private_ip").val();
		obj.PortMappingDescription = $("#port_mapping_description").val();
		obj.RemoteHost = $("#port_mapping_public_ip").val();
		obj.WanURL = $("#port_mapping_wan").val();
		obj.PortMappingProtocol = $("#port_mapping_protocol").val();
		obj.ExternalPort = $("#port_mapping_public_port_start").val();
		obj.ExternalPortEndRange = $("#port_mapping_public_port_end").val();
		obj.InternalPort = $("#port_mapping_private_port_start").val();
		obj.X_FH_InternalPortEndRange = $("#port_mapping_private_port_end").val();
		single_portmapping_info.push(obj);
	}
	console.log(single_portmapping_info);
	return single_portmapping_info;
}


