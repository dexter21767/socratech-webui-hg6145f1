var sessionidstr;
var g_data;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	$("#RPCbtn").val("tr069_getRPCMethods".i18n());
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/tr69_info", initPage);
	}
	else
	{
		XHR.get("get_tr69_info", null, initPage);
	}
	
});

function initValidate()
{
	$("#tr69_form").validate({
		debug: true,
		rules: {
			"Acsurl_text": {required: true, maxlength:256, nocn: true},
			"AcsUserName_text": {required: true, maxlength:256, nocn: true},
			"AcsPassWord_password": {required: true, maxlength:256, nocn: true},
			"ConnReqPort_text": {required: true, range_int:[0,65535]},
			"ConnReqName_text": {required: true, maxlength:256, nocn: true},
			"ConnReqPassWord_password": {required: true, maxlength:256, nocn: true},
			"ConnReqAddr_text": {required: true, maxlength:64, nocn: true},
			"PeriodicInformInterval_text": {required: true, range_int:[1,2147483647]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate tr69 ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate tr69 failed.....");
			return false;
		}
	}); 
}
function initPage(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	
	if (data != null && data.tr69)
	{
		g_data = data.tr69;
		displayEnable();
		displayInfo();
	}
}

function displayEnable()
{
	if (g_data.EnableCWMP == 0){
		$("input[name='tr069_enable']:last").attr('checked', 'checked');
	}else{
		$("input[name='tr069_enable']:first").attr('checked', 'checked');
	}
}

function displayInfo()
{
	$("#Acsurl_text").val(g_data.URL);
	$("#AcsUserName_text").val(g_data.Username);
	$("#AcsPassWord_password").val(g_data.Password);
	$("#ConnReqAddr_text").val(g_data.X_FH_ConnectionRequestPath);
	$("#ConnReqPort_text").val(g_data.X_FH_ConnectionRequestPort);
	$("#ConnReqName_text").val(g_data.ConnectionRequestUsername);
	$("#ConnReqPassWord_password").val(g_data.ConnectionRequestPassword);
	if (g_data.PeriodicInformEnable == 0){
		$("input[name='tr069Inform_enable']:last").attr('checked', 'checked');
	}else{
		$("input[name='tr069Inform_enable']:first").attr('checked', 'checked');
	}
	$("#PeriodicInformInterval_text").val(g_data.PeriodicInformInterval);
}

function enableCancel()
{
	displayEnable();
}

function infoCancel()
{
	displayInfo();
}
function enablesSaveApply()
{
	var postdata = new Object();
	postdata.method = "enable";
	postdata.EnableCWMP = $("input[name='tr069_enable']:checked").val();
	postdata.sessionid = sessionidstr;

	XHR.post("set_tr69_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


function infoSaveApply()
{
	$(".main_item_error_hint_extra").html("");

	if( ! $("#tr69_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}

	if ($("#ConnReqAddr_text").val().substring(1,0) != "/"){
		$("#ConnReqAddr_error").html("连接请求路径必须以“/”开头。");
		return;
	}
	
	var postdata = new Object();
	postdata.method = "info";
	postdata.URL = $("#Acsurl_text").val();
	postdata.Username = $("#AcsUserName_text").val();
	postdata.Password = $("#AcsPassWord_password").val();
	postdata.X_FH_ConnectionRequestPath = $("#ConnReqAddr_text").val();
	postdata.X_FH_ConnectionRequestPort = $("#ConnReqPort_text").val();
	postdata.ConnectionRequestUsername = $("#ConnReqName_text").val();
	postdata.ConnectionRequestPassword = $("#ConnReqPassWord_password").val();
	postdata.PeriodicInformEnable = $("input[name='tr069Inform_enable']:checked").val();
	postdata.PeriodicInformInterval = $("#PeriodicInformInterval_text").val();
	postdata.sessionid = sessionidstr;
	
	XHR.post("set_tr69_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function RPCshow()
{
	$("#RPCmethod").show();
}
