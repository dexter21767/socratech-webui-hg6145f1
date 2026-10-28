var port_forwarding_data = "";
var all_wan_info = '';
var wan_info = '';
var addflag = "edit";
var selfilterIndex = 1;
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	initValidate();

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/port_mapping", initPage);
	} else {
		//XHR.get("get_allwan_info", null, initConnectName);

		XHR.get("get_allwan_info", null, initPage);
	}
});

function initValidate() {
	$("#port_forwarding_list_form").validate({
		debug: true,
		rules: {
			"port_forwarding_description": { rangelength: [0, 32], description: true },
			"port_forwarding_public_port_start": {
				required: true,
				range_int: [1, 65535]
			},
			"port_forwarding_public_port_end": {
				required: true,
				range_int: [1, 65535]
			},
			"port_forwarding_private_ip": {
				required: true,
				ipv4: true
			},
			"port_forwarding_private_port_start": {
				required: true,
				range_int: [1, 65535]
			},
			"port_forwarding_private_port_end": {
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
	if (!gNewUiFlag) {
		$("#" + element).children().css("background-color", "#b7e3e3");
		$("#" + element).siblings().children().css("background-color", "#eef2f6");
		$("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
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
			port_forwarding_data = wan_info[i].portMapping; //获取当前第i条WAN下的portMapping信息
			//var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
			if (port_forwarding_data.length == 0) {
				continue;
			}
			else {
				for (var m = 0; m < port_forwarding_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
				{
					if (undefined == port_forwarding_data[m]) {
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
	$("#port_forwarding_wan").attr("disabled", true);
	$("#port_forwarding_wan").val(wan_url);
	$("#port_forwarding_description").val(curdata.PortMappingDescription);
	$("#port_forwarding_protocol").val(curdata.PortMappingProtocol);
	$("#port_forwarding_public_port_start").val(curdata.ExternalPort);
	$("#port_forwarding_public_port_end").val(curdata.ExternalPortEndRange);
	$("#port_forwarding_private_ip").val(curdata.InternalClient);
	$("#port_forwarding_private_port_start").val(curdata.InternalPort);
	$("#port_forwarding_private_port_end").val(curdata.X_FH_InternalPortEndRange);
	$("#port_forwarding_enable").val(curdata.PortMappingEnabled);
}

function displayTableHtml() {
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		port_forwarding_data = wan_info[i].portMapping; //获取当前第i条WAN下的portMapping信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
		if (port_forwarding_data.length != 0) {
			for (var m = 0; m < port_forwarding_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
			{
				var n = m + 1;
				var single = port_forwarding_data[m]; //对于第m条portmapping 信息赋值给single
				$("#port_forwarding_wan option").each(function() {
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
				//dynamicClsListHTML += '<td align="center">' + single.RemoteHost + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.ExternalPort + '</td>'; 初始代码
				dynamicClsListHTML += '<td align="center">' + single.ExternalPort + '-' + single.ExternalPortEndRange + '</td>';//fengshuo xiugai
				dynamicClsListHTML += '<td align="center">' + single.InternalClient + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.X_FH_InternalPortEndRange + '-' + single.ExternalPortEndRange + 初始代码
				dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.X_FH_InternalPortEndRange +//冯朔修改
					'</td>';
				if (single.PortMappingEnabled == "1") {
					dynamicClsListHTML += '<td align="center">' + "Enable" + '</td>';
				} else {
					dynamicClsListHTML += '<td align="center">' + "Disable" + '</td>';
				}
				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + i + '_' + single.port_mapping_index +
					'" name="port_forwarding_flag"></td>';
				dynamicClsListHTML += '</tr>';
				num++;
			}
		}


	}

	$("#port_forwarding_list").html(dynamicClsListHTML);
	$("#port_forwarding_list tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		port_forwarding_data = wan_info[i].portMapping; //获取当前第i条WAN下的portMapping信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
		if (port_forwarding_data.length != 0) {
			for (var m = 0; m < port_forwarding_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
			{
				var n = m + 1;
				var single = port_forwarding_data[m]; //对于第m条portmapping 信息赋值给single
				$("#port_forwarding_wan option").each(function() {
					if (wan_url == this.value) {
						wan_url = this.text;
					}
				});
				//针对每一条portMapping信息，其id中i、m分别表示第i条wan连接下的第m条portMapping信息。以供showshisinfo调用
				dynamicClsListHTML += '<tr id="table_' + m + "_" + i + '"class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px" style="cursor: pointer;" title="delout_' + single.port_mapping_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + i + '_' + single.port_mapping_index + '" name="fw_remove_flag"></td>';
				dynamicClsListHTML += '<td align="center">' + num + '</td>';
				dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortMappingDescription + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortMappingProtocol + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.RemoteHost + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.ExternalPort + '</td>'; 初始代码
				dynamicClsListHTML += '<td align="center">' + single.ExternalPort + '-' + single.ExternalPortEndRange + '</td>';//fengshuo xiugai
				dynamicClsListHTML += '<td align="center">' + single.InternalClient + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.X_FH_InternalPortEndRange + '-' + single.ExternalPortEndRange + 初始代码
				dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.X_FH_InternalPortEndRange +//冯朔修改
					'</td>';
				if (single.PortMappingEnabled == "1") {
					dynamicClsListHTML += '<td align="center">' + "Enable" + '</td>';
				} else {
					dynamicClsListHTML += '<td align="center">' + "Disable" + '</td>';
				}
				dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit" + '</td>';
				dynamicClsListHTML += '</tr>';
				num++;
			}
		}


	}
	if (dynamicClsListHTML != '')
		$("#image").hide();
	else
		$("#image").show();
	$("#port_forwarding_list").html(dynamicClsListHTML);
	$("#port_forwarding_list tr:eq(0)").click();
}

function showEditForm(id) {
	$("#fw_config_form").show();
	$("#loading_div").show()
	removeError();
	if (id)
		$("#title").html("Edit Port Forwarding Rule (ID:" + (Number(id) + 1) + ")");
}

function addfilter() //增加过滤条目
{
	if (gNewUiFlag) {
		$("#loading_div").show()
		$("#title").html("Add Port Forwarding Rule");
	}
	addflag = "add";
	var addHtml = []; //新增一个占位标记行
	$("#fw_config_form").show();
	$("#port_forwarding_wan").attr("disabled", false);
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
		addHtml += '<td></td>';
		addHtml += '</tr>';
	}

	if ($("#add_item").length == 0) //第一次添加数据时设置默认值
	{
		$("#port_forwarding_list").append(addHtml);
		$(".input_text").each(function(i) {
			$(this).val('');
		});
		$("#Protocol").val("TCP");
		$("#port_forwarding_enable").val("Enable");

		if (!gNewUiFlag) {
			$("#add_item").children().css("background-color", "#b7e3e3");
			$("#add_item").siblings().children().css("background-color", "#eef2f6");
			$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
		}
	}
}

function initPage(getdata) //从后端获取数据，初始化页面
{
	var wan_num = 0;
	var dynamicHtml = '';
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
				if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) {
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
			}
		}
		$("#port_forwarding_wan").html(dynamicHtml);

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
			$("#port_mapping_list").children().eq(0).children().css("background-color", "#b7e3e3");
			$("#port_mapping_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
			$("#port_mapping_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color",
				"#eef2f6");
		}
	}
}

function doDelete(wan_num, index) //删除操作
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.url = wan_info[parseInt(wan_num)].WAN_url;
	postdata.port_mapping_index = parseInt(index);
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
			myAlert('Tip', "no_rules_alert".i18n())
		else
			alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[type = checkbox]").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
		if (gNewUiFlag)
			myAlert('Tip', "no_selected_rules_alert".i18n())
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
	$("#port_mapping_config_form").hide();
	window.location.reload();
	XHR.get("get_allwan_info", null, initPage);
}

function extraValidCheck()//额外规则校验（包括ip、端口等）
{


	if (parseInt($("#port_forwarding_public_port_start").val()) > parseInt($("#port_forwarding_public_port_end").val())) {
		if (gNewUiFlag)
			myAlert('Tip', "fw_endPortTooSmallAlert".i18n())
		else
			alert("fw_endPortTooSmallAlert".i18n())
		return false;
	}

	if (parseInt($("#port_forwarding_private_port_start").val()) > parseInt($("#port_forwarding_private_port_end").val())) {
		if (gNewUiFlag)
			myAlert('Tip', "fw_endPortTooSmallAlert".i18n())
		else
			alert("fw_endPortTooSmallAlert".i18n())
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

	if (!$("#port_forwarding_list_form").valid()) {
		if (gNewUiFlag)
			myAlert('Tip', "illegal_value_alert".i18n())
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

		if (port_forwarding_data.length >= 32) {
			if (gNewUiFlag)
				myAlert('Tip', "app_most32RulesAlert".i18n())
			else
				alert("app_most32RulesAlert".i18n());
			return;
		}
	}
	postdata.wanurl = $("#port_forwarding_wan").val();
	postdata.PortMappingEnabled = $("#port_forwarding_enable").val();
	postdata.PortMappingDescription = $("#port_forwarding_description").val();
	postdata.PortMappingProtocol = $("#port_forwarding_protocol").val();
	postdata.ExternalPort = $("#port_forwarding_public_port_start").val();
	postdata.ExternalPortEndRange = $("#port_forwarding_public_port_end").val();
	postdata.InternalClient = $("#port_forwarding_private_ip").val();
	postdata.InternalPort = $("#port_forwarding_private_port_start").val();
	postdata.X_FH_InternalPortEndRange = $("#port_forwarding_private_port_end").val();
	postdata.pagetype = "portforwarding";
	XHR.post("set_port_mapping_info_inter", postdata, initPage);
	addflag = "edit";
}
