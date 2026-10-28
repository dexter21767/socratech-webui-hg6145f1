var gdata;
var sessionidstr;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});

	$("input[name='preconfigure_enable']").bind("click", function(){
		var preconfigure_enable  = $("input[name='preconfigure_enable']:checked").val();
		console.log("preconfigure_enable " + preconfigure_enable);
		if (preconfigure_enable == 1){
			$("#down_preconfigureForm").css("display", "");	
			console.log("gPreconfigure_enable " + gPreconfigure_enable);
			if (gPreconfigure_enable == "0")
			{
				console.log("gPreconfigure_enable " + gPreconfigure_enable);
				$("#preconfigure_button").attr("disabled", true);
			}
		}else{
			$("#down_preconfigureForm").css("display", "none");
		}
	});	

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_preset_info", initPage);
	}
	else
	{
		initPage();
	}

});

function initPage()
{
	displayHtml();
}

function displayHtml()
{
	if (gPreconfigure_enable == "1"){
		$("input[name='preconfigure_enable']:first").attr('checked', 'checked');
		$("#down_preconfigureForm").css("display", "");
		$("#preconfigure_button").attr("disabled", false);
	}else{
		$("input[name='preconfigure_enable']:last").attr('checked', 'checked');
		$("#down_preconfigureForm").css("display", "none");	
		
	}	
}

function CancelBtn()
{
	displayHtml();
}

function LoadStatus(responseData) {
	var postdata2 = new Object();
	postdata2.sessionid = sessionidstr;
	$("#preconfigure_button").hide();
    $("#down_preconfigureForm").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());
	XHR.post("set_onu_reboot", postdata2, null);
	jumpToLoginPage(true);
}

function saveApply()
{
	show_shadow();
	var preconfigure_enable = $("input[name='preconfigure_enable']:checked").val();
	var prompt;
	prompt = "takes_effect_after_restart".i18n();
	if (preconfigure_enable != gPreconfigure_enable) {
		if(confirm(prompt))
		{
		    var postdata = new Object();
			postdata.preconfigure_enable = preconfigure_enable;
	        XHR.post("set_preconfigure_enable", postdata, LoadStatus);
		}
	}
}

function down_preconfigure() {
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			var postdata = new Object();
			postdata.sessionid = getdata.sessionid;
			XHR.post("down_precfgfile", postdata, parse_return_data);
		}
	});
}

function parse_return_data(data) {
	if (data && data.success == "true") {
		window.location = "../cgi-bin/download?pre_usrconfig_conf";
	}
	else {
		alert("unknown_error_alert".i18n());
	}
}

