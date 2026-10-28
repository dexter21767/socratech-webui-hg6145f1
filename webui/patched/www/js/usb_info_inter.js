var usb_port_num;
var device_type = gModelName;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	getData();
});

function getData() {
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/base_info", parseGetData);
	}
	else {
		XHR.get("show_device_info", null, initPage);
		if (device_type == "HG6145D2") {
			XHR.poll(gStatusFreshInterval, "get_usb_other_info", null, parseGetUsbData);
		} else {
			XHR.poll(gStatusFreshInterval, "get_usb_info", null, parseGetData);
		}
	}
}
function initPage(data) {
	usb_port_num = data.usb_port_num;
}

function parseGetData(data) {
	if (data.usb_1 == 0) {
		$("#usb1").html("Unconnected");

	} else {
		$("#usb1").html("Connected");
	}
	if (usb_port_num == 2) {
		$("#usb_2").show();
		if (data.usb_2 == 0) {
			$("#usb2").html("Unconnected");

		} else {
			$("#usb2").html("Connected");
		}
	}
}

function parseGetUsbData(data) {
	if (data.usb_1 == "active") {
		$("#usb1").html("Connected");

	} else {
		$("#usb1").html("Unconnected");
	}
	if (usb_port_num == 2) {
		$("#usb_2").show();
		if (data.usb_2 == "active") {
			$("#usb2").html("Connected");
		} else {
			$("#usb2").html("Unconnected");
		}
	}
}