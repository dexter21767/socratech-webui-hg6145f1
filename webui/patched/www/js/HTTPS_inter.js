var g_data;
var g_httpsenable;

$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else {
		XHR.get("get_ipv4_lan_info", null, initPage);
	}

	if (operator_name == "MY_TM" ) 
	{
		$("input[name='https_enable']").bind("change", function() {
		if (g_data.httpsenable == $(this).val()) {
			$("#submit_btn").attr("disabled", true);
		}
		else {
			$("#submit_btn").attr("disabled", false);
		}
		})
	}

	//ROM_RCSRDS/MAGYAR_4IG
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG" || operator_name == "EG_TELECOM") {
		$("#https_prompt_inter").css('display', 'none');
		$("#https_button_div").css('display', 'none');
		$("#https_disable").css('display', 'none');
		$("#rc_disable").css('display', 'none');
		$("#https_prompt_ROM_RCSRDS").css('display', '');
	}
	if (operator_name == "ECU_CNT" ) 
	{
		$(".input_button").attr("disabled", true);
		$("#https_enable").attr("disabled", true);  
		$("#https_disable").attr("disabled", true);  
	}
});

function initPage(getdata) {
	if (getdata && getdata.lan_ipv4) {
		g_data = getdata.lan_ipv4;
		displayHtml();
	}
}

function displayHtml() {
	if(operator_name == "MY_TM" )
	{
	$("#submit_btn").attr("disabled", true);	
	}
	if (g_data.httpsenable == "1") {
		$("input[name='https_enable']:first").attr('checked', 'checked');
	}
	else {
		$("input[name='https_enable']:last").attr('checked', 'checked');
	}
}

function Cancel() {
	displayHtml();
}

function SaveApply() {
	show_shadow();
	var postdata = new Object();
	var https_enable = $("input[name='https_enable']:checked").val();
	g_httpsenable = https_enable;
	postdata.https_enable = https_enable;

	if (gNewUiFlag) {
		myConfirm('Tip', "Please reboot to apply!", function(r) {
			if (r) {
				XHR.post("set_https_http", postdata, locationTo);
			}
		});
	} else {
		if (confirm("reboot_to_apply".i18n())) {
			XHR.post("set_https_http", postdata, locationTo);
		}
	}
}

function locationTo(data) {
	if (data.success == "false") {
		XHR.get("get_ipv4_lan_info", null, initPage);
	}

}

