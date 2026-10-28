var timeflag = 0;
var steps_24g = 0;
var steps_5g = 0;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
});

function get_data_24g() {
	show_shadow();
	var postdata = new Object();
	postdata.action = "low";
	postdata.DiagnosticsState = "Requested";
	XHR.post("set_search_wifi_neighbor", postdata, get_result_24g);
}

function get_data_5g() {
	show_shadow();
	var postdata = new Object();
	postdata.action = "high";
	postdata.DiagnosticsState = "Requested";
	XHR.post("set_search_wifi_neighbor", postdata, get_result_5g);
}

function get_result_24g(getdata) {
	if (getdata != null && getdata.wifi_neighbor.DiagnosticsState) {
		set_table = getdata.wifi_neighbor.DiagnosticsState;
		if (set_table != "Completed") {
			if (steps_24g > 10) {
				alert("time_out".i18n());
				steps_24g = 0;
			} else {
				steps_24g++;
				setTimeout(function() {
					XHR.get("get_neighbor_24g", null, get_result_24g);
				}, 3000);
			}
		} else {
			XHR.get("get_neighborresult_24g", null, init_table_24g);
			steps_24g = 0;
		}
	} else {
		steps_24g = 0;
		alert("get_neighbor_failed_24g".i18n());
	}
}

function get_result_5g(getdata) {
	if (getdata != null && getdata.wifi_neighbor.DiagnosticsState) {
		set_table = getdata.wifi_neighbor.DiagnosticsState;
		if (set_table != "Completed") {
			if (steps_5g > 10) {
				alert("time_out".i18n());
				steps_5g = 0;
			} else {
				steps_5g++;
				setTimeout(function() {
					XHR.get("get_neighbor_5g", null, get_result_5g);
				}, 3000);
			}
		} else {
			XHR.get("get_neighborresult_5g", null, init_table_5g);
			steps_5g = 0;
		}
	} else {
		steps_5g = 0;
		alert("get_neighbor_failed_5g".i18n());
	}
}

function init_table_24g(data) {
	$("#wifi_list_24g").empty();
	var html = '';
	if (data && data.wifi_neighbor_info) {
		wifi_neighbor_data = data.wifi_neighbor_info.wifi_neighbor_data;

		var i = 0;
		var num = 0;
		for (i = 0; i < wifi_neighbor_data.length; i++) {
			var wifi_info_24g = wifi_neighbor_data[i];
			num = i + 1;
			html += '<tr id="add_item">';
			html += '<td width="10%" style="text-align: center;">' + num + '</td>';
			html += '<td width="25%" style="text-align: center;">' + wifi_info_24g.X_FH_WLAN_NeighborSSID + '</td>';
			html += '<td width="25%" style="text-align: center;">' + wifi_info_24g.X_FH_WLAN_NeighborBSSID + '</td>';
			html += '<td width="20%" style="text-align: center;">' + wifi_info_24g.X_FH_WLAN_NeighborChannel + '</td>';
			html += '<td width="20%" style="text-align: center;">' + wifi_info_24g.X_FH_WLAN_NeighborRSSI + '</td>';
			html += '</tr>';
		}
	}
	$("#wifi_list_24g").append(html);

	$("#add_item").children().css("background-color", "#eef2f6");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
	//$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}

function init_table_5g(data) {
	var html = '';
	$("#wifi_list_5g").empty();
	if (data && data.wifi_neighbor_info) {
		wifi_neighbor_data = data.wifi_neighbor_info.wifi_neighbor_data;

		var i = 0;
		var num = 0;
		for (i = 0; i < wifi_neighbor_data.length; i++) {
			var wifi_info_5g = wifi_neighbor_data[i];
			num = i + 1;
			html += '<tr id="add_item_5g">';
			html += '<td width="10%" style="text-align: center;">' + num + '</td>';
			html += '<td width="25%" style="text-align: center;">' + wifi_info_5g.X_FH_WLAN_NeighborSSID + '</td>';
			html += '<td width="25%" style="text-align: center;">' + wifi_info_5g.X_FH_WLAN_NeighborBSSID + '</td>';
			html += '<td width="20%" style="text-align: center;">' + wifi_info_5g.X_FH_WLAN_NeighborChannel + '</td>';
			html += '<td width="20%" style="text-align: center;">' + wifi_info_5g.X_FH_WLAN_NeighborRSSI + '</td>';
			html += '</tr>';
		}
	}
	$("#wifi_list_5g").append(html);

	$("#add_item_5g").children().css("background-color", "#eef2f6");
	$("#add_item_5g").siblings().children().css("background-color", "#eef2f6");
	//$("#add_item_5g").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}

function wifi_sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime)
			return;
	}
}
