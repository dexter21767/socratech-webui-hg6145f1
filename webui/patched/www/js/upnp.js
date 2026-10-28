var sessionidstr = "";
var selectwan = '';
var g_data;
var all_wan_info = '';
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/upnp", initPage);
	}
	else {
		XHR.get("get_allwan_info", null, initConnectName);
		XHR.get("get_upnp_info", null, initPage);

	}
});

function initPage(getdata) {
	//show_shadow();
	if (getdata.sessionid != undefined) {
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			sessionidstr = getdata.sessionid;
		}
	});

	if (getdata.Enable == "0") {
		$("input[name='upnp_enable']:last").attr('checked', 'checked');
	}
	else {
		$("input[name='upnp_enable']:first").attr('checked', 'checked');
	}

	$("#wan_name option").each(function() {
		if (getdata.Interface == this.value) {
			$(this).prop("selected", true);
		}
	});

	if (operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "BZ_ALGAR") {
		$("#tb_upnpInfo").show();
		if (getdata.upnp_info.upnp_data) {
			var upnp_data = getdata.upnp_info.upnp_data;
			if (upnp_data.length > 0) {
				$("#upnp_list").empty();
				var html = "";
				for (var i = 0; i < upnp_data.length; i++) {
					var upnp = upnp_data[i];
					html += '<tr class="table_01">';
					html += '<td style="text-align: center;">' + (i + 1) + '</td>';
					html += '<td style="text-align: center;">' + upnp.IPAddress + '</td>';
					html += '<td style="text-align: center;">' + upnp.ExternalPort + '</td>';
					html += '<td style="text-align: center;">' + upnp.InternalPort + '</td>';
					html += '<td style="text-align: center;">' + upnp.Protocol + '</td>';
					html += '<td style="text-align: center;">' + upnp.Description + '</td>';
					html += '<td style="text-align: center;">' + upnp.Status + '</td>';
					html += '</tr>';
				}
				$("#upnp_list").append(html);
			}
		}
	}

	if (operator_name == "TH_AIS") {
		$("#div_advertisement_period").show();
		$("#div_advertisement_time").show();
	}


}

function initConnectName(getdata) {
	var wan_num = 0;
	var dynamicHtml = '';
	all_wan_info = getdata;
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
			if (operator_name == "TH_AIS" && single_wan.Name.indexOf("aisfibre") >= 0 && single_wan.ServiceList.indexOf("INTERNET") >= 0 && single_wan.ConnectionType.indexOf("Routed") >= 0) {
				dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
			}
			else if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) {
				dynamicHtml += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
			}
		}
	}
	$("#wan_name").html(dynamicHtml);
}


function displayHtml() {
	if (g_data.Enable == "0") {
		$("input[name='upnp_enable']:last").attr('checked', 'checked');
	}
	else {
		$("input[name='upnp_enable']:first").attr('checked', 'checked');
	}
}

function save_apply() {
	show_shadow();
	var postdata = new Object();
	upnp_enable = $("input[name='upnp_enable']:checked").val();
	if (upnp_enable == "enable") {
		upnp_enable = 1;
	}
	else {
		upnp_enable = 0;

	}
	postdata.Enable = upnp_enable;
	postdata.Interface = $("#wan_name").val();
	XHR.post("set_upnp_info", postdata, initPage);
}