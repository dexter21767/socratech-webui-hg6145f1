var sessionidstr = "";
var all_portmapping_info = '';
var splitchar = '_';
var max_num_each_wan = 8; //8 as default

$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	initValidate();

	$("#WANselect_select").bind("change", function() {
		selectWanChange();
	});

	showOrHideLoadingWindowFromIframe("show");
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/portmapping", initPage);
	}
	else {
		XHR.get("get_port_mapping_info", null, initPage);
	}
});

function initValidate() {
	$("#portmapping_form").validate({
		debug: true,
		rules: {
			"ExternalPort_text": { required: true, range_int: [1, 65535] },
			"InternalPort_text": { required: true, range_int: [1, 65535] },
			"InternalClient_text": { required: true, ipv4: true }
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate port mapping ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate port mapping failed.....");
			return false;
		}
	});
}


function initPage(getdata) {
	if (getdata.sessionid != undefined) {
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");

	if (getdata != null && getdata.portmapping) {
		all_portmapping_info = getdata.portmapping;
	}
	max_num_each_wan = getdata.max_num_each_wan;

	initConnectNameConnectList();
	selectWanChange();

	displayControl();
}

function selectWanChange() {
	$("#ExternalPort_text").val('');
	$("#InternalClient_text").val('');
	$("#InternalPort_text").val('');
}

function getSingleWanInfo(wan_sequence) {
	var select_wan_index = wan_sequence.split(splitchar)[0];
	var select_wan_session_index = wan_sequence.split(splitchar)[1];
	var wan_num = all_portmapping_info.length;
	var select_info = '';

	if (wan_num > 0) {
		for (i = 0; i < wan_num; i++) {
			var single_wan = all_portmapping_info[i];
			if (single_wan.wan_index == select_wan_index
				&& single_wan.wan_session_index == select_wan_session_index) {
				select_info = single_wan;
				break;
			}
		}
	}
	return select_info;
}

function initConnectNameConnectList() {
	var wan_num = 0;
	var dynamicNameHtml = '';
	var dynamicListHtml = '';

	if (all_portmapping_info != '') {
		wan_num = all_portmapping_info.length;
	}
	if (wan_num > 0) {
		for (i = 0; i < wan_num; i++) {
			var single_wan = all_portmapping_info[i];
			if (single_wan.Name.indexOf('INTERNET') >= 0 && single_wan.Name.indexOf('_R_') >= 0) {
				var mapping_list = single_wan.mapping;
				if (mapping_list.length > 0) {
					for (list_index = 0; list_index < mapping_list.length; list_index++) {
						dynamicListHtml += '<tr>';
						dynamicListHtml += '<td>' + single_wan.Name + '</td>';
						dynamicListHtml += '<td>' + mapping_list[list_index].ExternalPort + '</td>';
						dynamicListHtml += '<td>' + mapping_list[list_index].PortMappingProtocol + '</td>';
						dynamicListHtml += '<td>' + mapping_list[list_index].InternalClient + '</td>';
						dynamicListHtml += '<td>' + mapping_list[list_index].InternalPort + '</td>';
						var mapping_sequence = single_wan.wan_index + '_' + single_wan.wan_session_index + '_' + mapping_list[list_index].mapping_index;
						if (mapping_list[list_index].PortMappingEnabled == 1) {
							dynamicListHtml += '<td>已启用</td>';
							dynamicListHtml += '<td><input type="button" value="禁用" id="' + mapping_sequence + '_0" onclick="doDisableEnable(this.id)"/>';
						}
						else {
							dynamicListHtml += '<td>未启用</td>';
							dynamicListHtml += '<td><input type="button" value="启用" id="' + mapping_sequence + '_1" onclick="doDisableEnable(this.id)"/>';
						}
						dynamicListHtml += '<input type="button" value="删除" id="' + mapping_sequence + '" onclick="doDelete(this.id)"/></td>';
						dynamicListHtml += '</tr>';
					}
				}

				if (mapping_list.length < max_num_each_wan) {
					dynamicNameHtml += '<option value="' + single_wan.wan_index + '_' + single_wan.wan_session_index + '">' + single_wan.Name + '</option>';
				}
			}
		}
	}

	$("#WANselect_select").html(dynamicNameHtml);
	$("#portmapping_list").html(dynamicListHtml);
}

function displayControl() {
	if ($("#WANselect_select option").size() == 0) {
		$("#portmapping_form").hide();
	}
	else {
		$("#portmapping_form").show();
	}
}

function doDisableEnable(eid) {
	var postdata = new Object();
	postdata.action = "enablechange";
	postdata.wan_index = eid.split("_")[0];
	postdata.wan_session_index = eid.split("_")[1];
	postdata.mapping_index = eid.split("_")[2];
	postdata.PortMappingEnabled = eid.split("_")[3];
	var wan_sequence = eid.split("_")[0] + '_' + eid.split("_")[1];
	postdata.wan_iporppp = getSingleWanInfo(wan_sequence).iporppp;
	postdata.sessionid = sessionidstr;
	XHR.post("set_port_mapping_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doDelete(eid) {
	var postdata = new Object();
	postdata.action = "delete";
	postdata.wan_index = eid.split("_")[0];
	postdata.wan_session_index = eid.split("_")[1];
	postdata.mapping_index = eid.split("_")[2];
	var wan_sequence = eid.split("_")[0] + '_' + eid.split("_")[1];
	postdata.wan_iporppp = getSingleWanInfo(wan_sequence).iporppp;
	postdata.sessionid = sessionidstr;
	XHR.post("set_port_mapping_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doAdd() {
	if (!$("#portmapping_form").valid()) {
		alert("某些项的值无效，请重新填写");
		return;
	}

	var postdata = new Object();
	postdata.action = "add";
	postdata.wan_index = $("#WANselect_select").val().split("_")[0];
	postdata.wan_session_index = $("#WANselect_select").val().split("_")[1];
	postdata.wan_iporppp = getSingleWanInfo($("#WANselect_select").val()).iporppp;
	postdata.ExternalPort = $("#ExternalPort_text").val();
	postdata.PortMappingProtocol = $("#PortMappingProtocol_select").val();
	postdata.InternalClient = $("#InternalClient_text").val();
	postdata.InternalPort = $("#InternalPort_text").val();
	postdata.sessionid = sessionidstr;
	XHR.post("set_port_mapping_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

