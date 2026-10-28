var port_trigger_data = "";
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
	$("#port_trigger_list_form").validate({
		debug: true,
		rules: {
			 "port_trigger_description": {rangelength:[0,31],description:true},
			"trigger_port_start": {
				required: true,
				range_int: [1, 65535]
			},
			"trigger_port_end": {
				required: true,
				range_int: [1, 65535]
			},
			"open_port_start": {
				required: true,
				range_int: [1, 65535]
			},
			"open_port_end": {
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

function Showthisinfo(element,value) //选中当前行并改变背景色
{
	$("#port_trigger_config_form").show();
	addflag = "edit";
	$("#add_item").remove();
	$("#" + element).children().css("background-color", "#b7e3e3");
	$("#" + element).siblings().children().css("background-color", "#eef2f6");
	$("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");

	var mode = "old";
	var port_trigger_index = element.split("_")[1];
	var wan_index = element.split("_")[2];
	selfilterIndex = value.split("_")[1];
	selfilterIndex = parseInt(selfilterIndex);
	displayFormHtml(mode, wan_index, port_trigger_index);
}

function displayFormHtml(mode, wan_index, port_trigger_index) //显示详细信息
{
	//alert(port_trigger_index);
	if (mode == "init") //初始化状态
	{
		//wan_info = all_wan_info.wan; //获取所有wan连接信息
		for (var i = 0; i < wan_info.length; i++) {
			port_trigger_data = wan_info[i].portTrigger; //获取当前第i条WAN下的portTrigger信息
			//var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
			if (port_trigger_data.length == 0){
				continue;
			}
			else{
				for (var m = 0; m < port_trigger_data.length; m++) //将第i条WAN连接下的portTrigger信息进行遍历
				{
					if(undefined == port_trigger_data[m]){
						continue;
					}
					else{
						wan_index = i;
						port_trigger_index = m;
						break;
					}
				}
				break;
			}
		}
		var curdata = wan_info[wan_index].portTrigger[port_trigger_index];
		var wan_url = wan_info[wan_index].WAN_url;
		
	}
	else{
		var curdata = wan_info[wan_index].portTrigger[port_trigger_index];
		var wan_url = wan_info[wan_index].WAN_url;
	}
	if(!curdata){
		//addfilter();
		return;
	}
	$("#port_trigger_config_form").show();
	$("#port_trigger_wan").attr("disabled", true);
	$("#port_trigger_wan").val(wan_url);
	$("#port_trigger_description").val(curdata.PortTriggerDescription);
	$("#trigger_port_start").val(curdata.TriggerPortStart);
	$("#trigger_port_end").val(curdata.TriggerPortEnd);
	$("#port_trigger_protocol").val(curdata.PortTriggerProtocol);
	$("#open_port_start").val(curdata.OpenPortStart);
	$("#open_port_end").val(curdata.OpenPortEnd);
	$("#port_trigger_enable").val(curdata.PortTriggerEnabled);
}

function displayTableHtml() {
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	//alert(JSON.stringify(wan_info));
	for (var i = 0; i < wan_info.length; i++) {
		port_trigger_data = wan_info[i].portTrigger; //获取当前第i条WAN下的portMapping信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条mapping的wan_name信息显示
		if (port_trigger_data.length != 0) {
			for (var m = 0; m < port_trigger_data.length; m++) //将第i条WAN连接下的portMapping信息进行遍历
			{
				var n = m + 1;
				var single = port_trigger_data[m]; //对于第m条portmapping 信息赋值给single
				$("#port_trigger_wan option").each(function() {
					if (wan_url == this.value) {
						wan_url = this.text;
					}
				});
				//针对每一条portMapping信息，其id中i、m分别表示第i条wan连接下的第m条portMapping信息。以供showshisinfo调用
				dynamicClsListHTML += '<tr id="table_' + m + "_" + i +
					'" style="cursor: pointer;" title="delout_'+ single.port_trigger_index +'" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center">' + num + '</td>';
				dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.PortTriggerDescription + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.TriggerPortStart + '-' + single.TriggerPortEnd + '</td>';//fengshuo xiugai
				dynamicClsListHTML += '<td align="center">' + single.PortTriggerProtocol + '</td>';
				//dynamicClsListHTML += '<td align="center">' + single.X_FH_InternalPortEndRange + '-' + single.ExternalPortEndRange + 初始代码
				dynamicClsListHTML += '<td align="center">' + single.OpenPortStart + '-' + single.OpenPortEnd +//冯朔修改
					'</td>';
				if (single.PortTriggerEnabled == "1") {
					dynamicClsListHTML += '<td align="center">' + "Enable" + '</td>';
				} else {
					dynamicClsListHTML += '<td align="center">' + "Disable" + '</td>';
				}
				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + i + '_' + single.port_trigger_index +
					'" name="port_mapping_flag"></td>';
				dynamicClsListHTML += '</tr>';
				num++;
			}
		}


	}

	$("#port_trigger_list").html(dynamicClsListHTML);
	$("#port_trigger_list tr:eq(0)").click();
}

function addfilter() //增加过滤条目
{
	addflag = "add";
	var addHtml = []; //新增一个占位标记行
	$("#port_trigger_config_form").show();
	$("#port_trigger_wan").attr("disabled", false);
	addHtml += '<tr id="add_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';

	if ($("#add_item").length == 0) //第一次添加数据时设置默认值
	{
		$("#port_trigger_list").append(addHtml);
		$(".input_text").each(function(i) {
			$(this).val('');
		});
		$("#Protocol").val("TCP");
		$("#port_mapping_enable").val("Enable");

		$("#add_item").children().css("background-color", "#b7e3e3");
		$("#add_item").siblings().children().css("background-color", "#eef2f6");
		$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
	}
}

// function initConnectName(getdata) {
// 	var wan_num = 0;
// 	var dynamicHtml = '';
// 	all_wan_info = getdata;
// 	if (all_wan_info != '' && all_wan_info.wan) {
// 		wan_num = all_wan_info.wan.length;
// 	}
// 	if (wan_num > 0) {
// 		for (i = 0; i < wan_num; i++) {
// 			var single_wan = all_wan_info.wan[i];
// 			var wan_path = single_wan.WAN_url;
// 			if (single_wan.ServiceList.indexOf("INTERNET") >= 0) {
// 				dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
// 			}
// 		}
// 	}
// 	$("#port_mapping_wan").html(dynamicHtml);
// }

function initPage(getdata) //从后端获取数据，初始化页面
{
	var wan_num = 0;
	var dynamicHtml = '';
	if (getdata != null && getdata.wan) {
		all_wan_info = getdata;
		wan_info = all_wan_info.wan;
		if(all_wan_info != '' && all_wan_info.wan)
		{
			wan_num = all_wan_info.wan.length;
		}
		
		if (wan_num > 0)
		{
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) 
				{
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
			}
		}
		$("#port_trigger_wan").html(dynamicHtml);

		displayTableHtml();
		//displayFormHtml("init", 0 , 0);	
		//$("#port_mapping_config_form").hide();
		$("#port_trigger_list").children().eq(0).children().css("background-color", "#b7e3e3");
		$("#port_trigger_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
		$("#port_trigger_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color",
			"#eef2f6");
	}
}

function doDelete(wan_num, index) //删除操作
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.url = wan_info[parseInt(wan_num)].WAN_url;
	postdata.port_trigger_index = parseInt(index);
	XHR.post("set_port_trigger_info_inter", postdata,initPage);
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
		alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[type = checkbox]").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
		alert("no_selected_rules_alert".i18n());
		return;
	}

	if (confirm("delete_alert".i18n()) == false) {
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
	$("#port_trigger_config_form").hide();
	 window.location.reload();
//	XHR.get("get_allwan_info", null, initPage);	
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
	$("#port_trigger_config_form").hide();
	 window.location.reload();
	XHR.get("get_allwan_info", null, initPage);	
}

function extraValidCheck()//额外规则校验（包括ip、端口等）
{
    // if (ip2int($("#SourceIPStart").val()) > ip2int($("#SourceIPEnd").val()))
    // {
    //     $("#MinSourceAddress-error").html("fw_endIPTooSmallAlert".i18n());
    //     return false;
    // }

    if (parseInt($("#trigger_port_start").val()) > parseInt($("#trigger_port_end").val()))
    {
        $("#Public_port-error").html("fw_endPortTooSmallAlert".i18n());
        return false;
    }
    
    // if (ip2int($("#DestIPStart").val()) > ip2int($("#DestIPEnd").val()))
    // {
    //     $("#MinDestinationAddress-error").html("fw_endIPTooSmallAlert".i18n());
    //     return false;
    // }
    
    if (parseInt($("#open_port_start").val()) > parseInt($("#open_port_end").val()))
    {
        $("#Open_port-error").html("fw_endPortTooSmallAlert".i18n());
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

	if (!$("#port_trigger_list_form").valid()) {
		alert("illegal_value_alert".i18n());
		return;
	}
	
	if( !extraValidCheck() )
	{
	    alert("illegal_value_alert".i18n());
	    return;
	}
	
	var postdata = new Object();
	postdata.action = addflag;
	if (addflag == "edit") {
		postdata.port_trigger_index = selfilterIndex;
	}
	if (addflag == "add") {
		// if (port_trigger_data.length >= 12) {
		// 	alert("app_most32RulesAlert".i18n());
		// 	return;
		// }
	}
	postdata.wanurl = $("#port_trigger_wan").val();
	postdata.PortTriggerDescription = $("#port_trigger_description").val();
	postdata.TriggerPortStart = $("#trigger_port_start").val();
	postdata.TriggerPortEnd = $("#trigger_port_end").val();
	postdata.PortTriggerProtocol = $("#port_trigger_protocol").val();
	postdata.OpenPortStart = $("#open_port_start").val();
	postdata.OpenPortEnd  = $("#open_port_end").val();
	postdata.PortTriggerEnabled = $("#port_trigger_enable").val();
	//alert(JSON.stringify(postdata));
	XHR.post("set_port_trigger_info_inter", postdata, initPage);
	addflag = "edit";
}
