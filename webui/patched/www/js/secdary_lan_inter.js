var g_data;
var login_user = "";
var operator_name = gOperatorName;
var br0;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	initValidate();
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/oltauth", initPage);
	}
	else {
		XHR.get("get_sec_lan_info", null, initPage);
		XHR.get("get_ipv4_lan_info", null, getbr0);
	}
	$("#enable").bind("change", function() {
		if ($("#enable").val() == "1") {
			$("#DHCP_div").show();
		} else {
			$("#DHCP_div").hide();
		}
	});

	$("#secIp_enable").bind("change", function() {
		if ($("#secIp_enable").prop("checked")) {
			$("[type='text']").attr("disabled", false);
			$("#enable").attr("disabled", false);
		} else {
			$("[type='text']").attr("disabled", true);
			$("#enable").attr("disabled", true);
		}
	});

	if (operator_name == "EG_TELECOM") {
		$("#option60_div").hide();
		$("#dhcp_cfg_div").hide();
		$("#tip").show();
		$("#subnet_mask").css("width", "35px")
		$("#sec_lan_prompt").html("You may enable/disable secondary networking parameters as you wish, and it will take effect after restaring.");
	}
});

function getbr0(getdata) {
	br0 = getdata.lan_ipv4.IPInterfaceIPAddress;
}

function initValidate() {
	var flag;
	if (operator_name == "EG_TELECOM") {
		flag = false;
	} else {
		flag = true;
	}

	$("#sec_lan_form").validate({
		debug: false,
		rules: {
			"ip_text": { required: true, ipv4: true },
			"subnet_mask": { required: flag, subnetMask: flag },
			"lanStartAddress_text": { required: true, ipv4: true },
			"lanEndAddress_text": { required: true, ipv4: true },
			"priDnsAddress_text": { required: true, ipv4: true },
			"secDnsAddress_text": { ipv4: true },
			"dhcp_hour_text": { required: true, maxlength: 2, range_int_time: [0, 99] },
			"dhcp_min_text": { required: true, maxlength: 2, range_int_time: [0, 59] },
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form) {//校验成功回调
			fiberlog("validate user management settings ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate user management failed.....");
			return false;
		}
	});
}

function initPage(data) {

	if (data != null && data && data.dns_info) {
		g_data = data.dns_info;
		displaySecLANHtml();
		displaySecDNSHtml();
	}

}

function displaySecLANHtml() {
	setCheckbox("secIp_enable", g_data.sec_ip_enable);
	if (g_data.sec_ip_enable == "0") {
		$("[type='text']").attr("disabled", true);
		$("#enable").attr("disabled", true);
	} else {
		$("[type='text']").attr("disabled", false);
		$("#enable").attr("disabled", false);
		$("#ip_text").val(g_data.sec_ip);
		if(operator_name == "EG_TELECOM"){
			if(g_data.sec_subnetmask == ""){
				$("#subnet_mask").val("");
			}else{
				$("#subnet_mask").val(g_data.sec_subnetmask.split(".")[3]);
			}
			
		}else{
			$("#subnet_mask").val(g_data.sec_subnetmask);
		}
	}
}

function displaySecDNSHtml() {
	$("#enable").val(g_data.sec_dns_enable);
	if ($("#enable").val() == "0") {
		$("#DHCP_div").hide();
		$("#lanStartAddress_text").val();
		$("#lanEndAddress_text").val();
		$("#priDnsAddress_text").val();
		$("#secDnsAddress_text").val();
		$("#dhcp_hour_text").val();
		$("#dhcp_min_text").val();
		$("#option60_text").val();
	} else {
		$("#lanStartAddress_text").val(g_data.sec_dns_startIP);
		$("#lanEndAddress_text").val(g_data.sec_dns_endIP);
		if (g_data.sec_dns_server.indexOf(",") > 0) {
			$("#priDnsAddress_text").val(g_data.sec_dns_server.split(",")[0]);
			$("#secDnsAddress_text").val(g_data.sec_dns_server.split(",")[1]);
		} else {
			$("#priDnsAddress_text").val(g_data.sec_dns_server);
			$("#secDnsAddress_text").val("");
		}
		var hour = Math.floor(g_data.sec_release_time / 3600);
		var min = parseInt((g_data.sec_release_time % 3600) / 60);
		$("#dhcp_hour_text").val(hour);
		$("#dhcp_min_text").val(min);
		if (g_data.sec_option60_enable != "0") {
			$("#option60_text").val(g_data.sec_option60_value);
		}
	}
}

function extraValidCheck() {
	var dhcp_start = $("#lanStartAddress_text").val();
	var dhcp_end = $("#lanEndAddress_text").val();

	if (compareIP(dhcp_end, dhcp_start) == -1) {
		$("#lanEndAddress-error").html("dhcp_start_end_alert".i18n());
		return false;
	}

	return true;
}


function isLetterornumber(s)//是否为字母或者数字或者_
{
	if (s == "") {
		return true;
	}
	var re = /^[A-Za-z0-9\_\-]*$/g;
	return re.test(s);
}

function ValidIPAddrCheck() {
	var dhcp_start = $("#lanStartAddress_text").val();
	var dhcp_end = $("#lanEndAddress_text").val();
	var priDns = $("#priDnsAddress_text").val();
	var secDns = $("#secDnsAddress_text").val();

	//DHCP Start IP
	if (!check_ip_last_value(dhcp_start)) {
		return false;
	}

	//DHCP End IP
	if (!check_ip_last_value(dhcp_end)) {
		return false;
	}

	//DHCP Primary DNS
	if (!check_ip_last_value(priDns)) {
		return false;
	}

	//DHCP Secondary DNS
	if (!check_ip_last_value(secDns)) {
		return false;
	}


}

function saveApply() {
	show_shadow();
	if (!$("#sec_lan_form").valid()) {
		alert("value_illegal".i18n());
		return;
	}

	if (br0 == $("#ip_text").val()) {
		alert("lan_ip_illegal_alert".i18n());
		return false;
	}

	if (operator_name == "EG_TELECOM") {
		var mask = "255.255.255." + $("#subnet_mask").val();
		if (getCheckbox("secIp_enable") == "1" && !isValidSubnetMask(mask)) {
			alert("subnetMask_invalid".i18n());
			return;
		}
	}
	if ($("#enable").val() == "1") {
		// 额外校验 DHCP开始地址、结束地址必须和网关在同一网段，且开始地址必须小于结束地址
		if (!extraValidCheck()) {
			alert("value_illegal".i18n());
			return;
		}

		//check ip address last value is 0 or 255
		// if( !ValidIPAddrCheck() ) 
		// {
		// 	alert("dhcp_ip_illegal".i18n());
		// 	return;
		// }
	}

	var postdata = new Object();
	postdata.secip_enable = getCheckbox("secIp_enable");
	if (postdata.secip_enable == "1") {
		postdata.ip = $("#ip_text").val();
		if (operator_name == "EG_TELECOM") {
			postdata.subnetmask = "255.255.255." + $("#subnet_mask").val()
		} else {
			postdata.subnetmask = $("#subnet_mask").val();
		}

		postdata.ip_router = $("#ip_text").val();
		postdata.dns_type = $("#enable").val();
		if ($("#enable").val() == "1") {
			postdata.start_ip = $("#lanStartAddress_text").val();
			postdata.end_ip = $("#lanEndAddress_text").val();
			var priDns = $("#priDnsAddress_text").val();
			var secDns = $("#secDnsAddress_text").val();
			if (secDns != "") {
				postdata.dns_server = priDns + "," + secDns;
			} else {
				postdata.dns_server = priDns;
			}
			var dhcp_hour = $("#dhcp_hour_text").val();
			var dhcp_min = $("#dhcp_min_text").val();
			var DHCPLeaseTimeval = dhcp_hour * 3600 + dhcp_min * 60;
			if (DHCPLeaseTimeval > 356400) //99 hour
			{
				alert("DHCP_Lease_Time_is_illegal".i18n());
				return;
			}
			if (($("#dhcp_hour_text").val() == "0" || $("#dhcp_hour_text").val() == "00")
				&& ($("#dhcp_min_text").val() == "0" || $("#dhcp_min_text").val() == "00")) {
				alert("DHCP_Lease_Time_is_illegal".i18n());
				return;
			}
			postdata.release_time = DHCPLeaseTimeval;
			if ($("#option60_text").val() != "") {
				postdata.option60_enable = "1";
				postdata.option60_value = $("#option60_text").val();
			} else {
				postdata.option60_enable = "0";
				postdata.option60_value = "";
			}
		}

		if (operator_name == "EG_TELECOM") {
			postdata.dns_server = $("#ip_text").val();
		}
	} else {
		postdata.dns_type = "0";
	}
   if (operator_name != "EG_TELECOM") {
        alert("rebootAlert".i18n());
    }
	XHR.post("set_sec_lan_info", postdata, initPage);
}




