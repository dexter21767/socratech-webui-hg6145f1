var nat_info;
var addflag = "edit";
var selfilterIndex = 1;
var all_wan_info = '';
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
		//getDataByAjax("../fake/port_mapping", initPage);
	}
	else {
		XHR.get("get_allwan_info", null, initPage);
		//XHR.get("get_nat_info", null, initPage);
	}

	//下拉框点击事件，当选项为many-to-one时，publicEndIp设置为禁用；当选项为one-to-one时，localEndIP和PublicEndIP设置为禁用
	if ($("#ruleType_select").val() == "One-to-One") {
		$("#nat_local_endIp").attr("disabled", true);
		$("#nat_local_endIp").val("");
		$("#nat_public_endIp").attr("disabled", true);
		$("#nat_public_endIp").val("");
	}
	if ($("#ruleType_select").val() == "Many-to-One") {
		$("#nat_public_endIp").attr("disabled", true);
		$("#nat_public_endIp").val("");
	}

	$("#ruleType_select").change(function() {
		var option = $(this).children("option:selected").val();
		if (option == "Many-to-One") {
			$("#nat_public_endIp").attr("disabled", true);
			$("#nat_public_endIp").val("");
			$("#nat_local_endIp").attr("disabled", false);
		} else if (option == "One-to-One") {
			$("#nat_local_endIp").attr("disabled", true);
			$("#nat_local_endIp").val("");
			$("#nat_public_endIp").attr("disabled", true);
			$("#nat_public_endIp").val("");
		} else {
			$("#nat_local_endIp").attr("disabled", false);
			$("#nat_public_endIp").attr("disabled", false);
		}

	})
});

function extraValidCheck()//额外规则校验（localStartIP不能大于localEndIP）
{
	if ($("#nat_public_endIp").val() != "") {
		if (ip2int($("#nat_public_startIp").val()) > ip2int($("#nat_public_endIp").val())) {
			if (gNewUiFlag)
				myAlert('Tip', "app_endIpTooSmallAlert".i18n())
			else
				alert("app_endIpTooSmallAlert".i18n());
			return false;
		}
	}

	if ($("#nat_local_endIp").val() != "") {
		if (ip2int($("#nat_local_startIp").val()) > ip2int($("#nat_local_endIp").val())) {
			if (gNewUiFlag)
				myAlert('Tip', "app_endIpTooSmallAlert".i18n())
			else
				alert("app_endIpTooSmallAlert".i18n());
			return false;
		}
	}

	return true;
}

function initValidate() {
	$("#nat_list_form").validate({
		debug: true,
		rules: {
			"nat_wan": { required: true },
			"nat_description": { rangelength: [0, 31], description: true },
			"nat_local_startIp": { required: true, ipv4: true },
			"nat_local_endIp": { ipv4: true },
			"nat_public_startIp": { required: true, ipv4: true },
			"nat_public_endIp": { ipv4: true }
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate nat ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate nat failed.....");
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
	var nat_index = element.split("_")[1];
	var wan_index = element.split("_")[2];
	selfilterIndex = parseInt(value.split("_")[1]);

	displayFormHtml(mode, wan_index, nat_index);
}


function displayFormHtml(mode, wan_index, nat_index) {
	var curdata = wan_info[wan_index].nat[nat_index];//************************************与后端返回数据有关**********************
	var wan_url = wan_info[wan_index].WAN_url;
	if (mode == "init") //初始化状态
	{
		if (curdata.length > 0) {
			curdata = wan_info[wan_index].dmz[nat_index];
		} else {
			addfilter();
			return;
		}
	}
	$("#nat_wan").val(wan_url); //赋值
	$("#nat_description").val(curdata.Description);
	$("#ruleType_select").val(curdata.RuleType);
	$("#nat_local_startIp").val(curdata.LocalIPStart);
	$("#nat_local_endIp").val(curdata.LocalIPEnd);
	$("#nat_public_startIp").val(curdata.PublicIPStart);
	$("#nat_public_endIp").val(curdata.PublicIPEnd);
	$("#nat_wan").attr("disabled", true);
	if ($("#ruleType_select").val() == "One-to-One") {
		$("#nat_local_endIp").attr("disabled", true);
		$("#nat_public_endIp").attr("disabled", true);
	}
	else if ($("#ruleType_select").val() == "Many-to-One") {
		$("#nat_public_endIp").attr("disabled", true);
		$("#nat_local_endIp").attr("disabled", false);
	}
	else {
		$("#nat_local_endIp").attr("disabled", false);
		$("#nat_public_endIp").attr("disabled", false);
	}
}

function displayTableHtml() //动态给列表赋值显示
{
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		nat_info = wan_info[i].nat; //获取当前第i条WAN下的NAT信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条NAT的wan_name信息显示
		if (nat_info.length != 0) {
			for (var m = 0; m < nat_info.length; m++) //将第i条WAN连接下的NAT信息进行遍历
			{
				var n = m + 1;
				var single = nat_info[m]; //对于第m条NAT 信息赋值给single
				$("#nat_wan option").each(function() {
					if (wan_url == this.value) {
						wan_url = this.text;
					}
				});

				//针对每一条NAT信息，其id中i、m分别表示第i条wan连接下的第m条NAT信息。以供showshisinfo调用
				dynamicClsListHTML += '<tr id="table_' + m + "_" + i +
					'" style="cursor: pointer;" title="delout_' + single.nat_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center">' + num + '</td>';
				dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.Description + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.RuleType + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.LocalIPStart + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.InternalPort + '-' + single.ExternalPort + '</td>'; 初始代码
				dynamicClsListHTML += '<td align="center">' + single.LocalIPEnd + '</td>';//fengshuo xiugai
				dynamicClsListHTML += '<td align="center">' + single.PublicIPStart + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.X_FH_InternalPortEndRange + '-' + single.ExternalPortEndRange + 初始代码
				dynamicClsListHTML += '<td align="center">' + single.PublicIPEnd + '</td>';

				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + i + '_' + single.nat_index +
					'" name="nat_index"></td>';
				dynamicClsListHTML += '</tr>';
				num++;
			}
		}


	}
	$("#nat_list").html(dynamicClsListHTML);
	$("#nat_list tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
	var dynamicClsListHTML = '';
	var num = 1;
	wan_info = all_wan_info.wan;
	for (var i = 0; i < wan_info.length; i++) {
		dmz_data = wan_info[i].nat;
		var wan_url = wan_info[i].WAN_url;
		if (dmz_data.length != 0) {
			for (var m = 0; m < dmz_data.length; m++) {
				var n = m + 1;
				var single = dmz_data[m];
				$("#nat_wan option").each(function() {
					if (wan_url == this.value) {
						wan_url = this.text;
					}
				});
				dynamicClsListHTML += '<tr id="mactable_' + m + "_" + i + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.nat_index + '" onclick="Showthisinfo(this.id,this.title)">';
				dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + i + '_' + single.nat_index + '" name="fw_remove_flag"></td>';
				dynamicClsListHTML += '<td align="center">' + num + '</td>';
				dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.Description + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.RuleType.i18n() + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.LocalIPStart + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.LocalIPEnd + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PublicIPStart + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PublicIPEnd + '</td>';
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

	$("#nat_list").html(dynamicClsListHTML);
	$("#nat_list tr:eq(0)").click();
}

function showEditForm(id) {
	$("#fw_config_form").show();
	$("#loading_div").show()
	//$(window.parent.document).find("#loading_window_div4").show();
	//$(window.parent.document).find("#loading_window_div5").show();
	removeError();
	if (id)
		$("#title").html("Edit NAT Rule (ID:".i18n() + (Number(id) + 1) + ")");

}

function addfilter() //增加过滤条目
{
	if (gNewUiFlag) {
		$("#loading_div").show()
		//$(window.parent.document).find("#loading_window_div4").show();
		//$(window.parent.document).find("#loading_window_div5").show();
		$("#title").html("Add NAT Rule".i18n());
	}
	addflag = "add";
	$("#fw_config_form").show();
	$("#nat_wan").attr("disabled", false);
	if (!gNewUiFlag) {
		var addHtml = []; //新增一个占位标记行
		addHtml += '<tr id="add_item">';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center">--</td>';
		addHtml += '<td align="center"></td>';
		addHtml += '</tr>';
	}
		if ($("#add_item").length == 0)//第一次添加数据时设置默认值
		{
			$("#nat_list").append(addHtml);
			$(".input_text").each(function(i) {
				$(this).val('');
			});

			// $("#Protocol").val("TCP");
			// $("#port_mapping_enable").val("Enables");
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
	
}

function initPage(getdata)//从后端获取数据，初始化页面
{

	var dynamicHtml = '';
	if (getdata != null && getdata.wan) {
		all_wan_info = getdata;
		nat_Info = all_wan_info.nat;
		if (all_wan_info != '' && all_wan_info.wan) {
			wan_num = all_wan_info.wan.length;
		}
		if (wan_num > 0) {
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (operator_name == "TH_AIS" && single_wan.Name.indexOf("aisfibre") >= 0 && single_wan.ServiceList.indexOf("INTERNET") >= 0 && single_wan.ConnectionType.indexOf("Routed") >= 0) {
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
				else if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) {
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
			}

		}
		$("#nat_wan").html(dynamicHtml);
		$("#nat_wan").attr("disabled", true);
		// displayFormHtml("init", 0);
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
				$("#nat_list").children().eq(0).children().css("background-color", "#DEC0DF");
				$("#nat_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
				$("#nat_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
			} else {
				$("#nat_list").children().eq(0).children().css("background-color", "#b7e3e3");
				$("#nat_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
				$("#nat_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
			}
		}

	}
}

function doDelete(wan_num, index) //删除操作
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.url = wan_info[parseInt(wan_num)].WAN_url;
	postdata.nat_index = parseInt(index);
	XHR.post("set_nat_info", postdata);
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
		window.location.reload();
		// XHR.get("get_nat_info", null, initPage); //删除操作后，重新刷新页面
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
		window.location.reload();
		//XHR.get("get_nat_info", null, initPage);
	}

	function do_save()//提交页面数据 
	{
		show_shadow();
		//清除自定义错误提示
		$(".main_item_error_hint_extra").each(function(i) {
			$(this).html('');
		});


		if (!$("#nat_list_form").valid()) {
			if (gNewUiFlag)
				myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
			else
				alert("illegal_value_alert".i18n());
			return;
		}

		if (!extraValidCheck()) {
			return;
		}
		var isRepeat = false;
		var postdata = new Object();
		//	addflag = "add";
		postdata.action = addflag;
		if (addflag == "edit") {
			postdata.filter_index = selfilterIndex;
		}
		if (addflag == "add") {
			if (nat_info != null && nat_info.length >= 8) {
				if (gNewUiFlag)
					myAlert('Tip', '' + "fw_most8RulesAlert".i18n() + '', function() { })
				else
					alert("fw_most8RulesAlert".i18n());
				return;
			}
		}
		postdata.wanurl = $("#nat_wan").val();
		postdata.Description = $("#nat_description").val();
		postdata.RuleType = $("#ruleType_select").val();
		postdata.LocalIPStart = $("#nat_local_startIp").val();
		postdata.LocalIPEnd = $("#nat_local_endIp").val();
		postdata.PublicIPStart = $("#nat_public_startIp").val();
		postdata.PublicIPEnd = $("#nat_public_endIp").val();


		//规则重复性校验
		for (var i = 0; i < wan_info.length; i++) {
			if (postdata.wanurl == wan_info[i].WAN_url) {
				var nat = wan_info[i].nat;
				for (var j = 0; j < nat.length; j++) {
					if (addflag == "add") {
						if ((nat[j].RuleType == postdata.RuleType)
							&& (nat[j].LocalIPStart == postdata.LocalIPStart) && (nat[j].LocalIPEnd == postdata.LocalIPEnd)
							&& (nat[j].PublicIPStart == postdata.PublicIPStart) && (nat[j].PublicIPEnd == postdata.PublicIPEnd)
						) {
							isRepeat = true;
						}
					} else if (addflag == "edit") {
						if ((selfilterIndex != nat[j].nat_index) && (nat[j].RuleType == postdata.RuleType)
							&& (nat[j].LocalIPStart == postdata.LocalIPStart) && (nat[j].LocalIPEnd == postdata.LocalIPEnd)
							&& (nat[j].PublicIPStart == postdata.PublicIPStart) && (nat[j].PublicIPEnd == postdata.PublicIPEnd)) {
							isRepeat = true;
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

		XHR.post("set_nat_info", postdata, initPage);
		addflag = "edit";
	}