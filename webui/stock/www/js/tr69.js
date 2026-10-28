var sessionidstr = "";
var tr69_modify_enable = 1; //default
var garea_code;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	$("select").bind("change", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");

	XHR.get("get_factory_mode", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
		if ( getdata.area_code != undefined )
		{
			garea_code = getdata.area_code;
		}
	});	
	
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
			"Informinter_text": {required: true, range_int:[0,2147481]},
			"Acsurl_text": {required: true, maxlength:256},
			"AcsUserName_text": {required: true, maxlength:256 },
			"AcsPassWord_password": {required: true, maxlength:256},
			"ConnReqName_text": {required: true, maxlength:256},
			"ConnReqPassWord_password": {required: true, maxlength:256},
			"AcsPassWord_password": {required: true, maxlength:256},
			"MldAddr_text": {required: true, maxlength:256},
			"MldPort_text": {required: true, maxlength:256}
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
function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.tr69)
	{
		if ( getdata.itms_modify != undefined )
		{
			tr69_modify_enable = getdata.itms_modify;
		}
		
		if ( getdata.tr69.PeriodicInformEnable == "1" )
		{
			$("#Tr69Inform_checkbox").prop("checked", true);
		}
		else
		{
			$("#Tr69Inform_checkbox").prop("checked", false);
		}
		
		$("#Informinter_text").val(getdata.tr69.PeriodicInformInterval);
		$("#Acsurl_text").val(getdata.tr69.URL);
		$("#AcsUserName_text").val(getdata.tr69.Username);
		$("#AcsPassWord_password").val(getdata.tr69.Password);
		$("#ConnReqName_text").val(getdata.tr69.ConnectionRequestUsername);
		$("#ConnReqPassWord_password").val(getdata.tr69.ConnectionRequestPassword);
		if ( getOperator() == "CT" )
		{
			$("#Middleware_select").val(getdata.tr69.Tr069Enable);
			$("#MldAddr_text").val(getdata.tr69.MiddlewareURL);
			$("#MldPort_text").val(getdata.tr69.MiddlewarePort);
		}
	}
	checkDisableElement();
	displayControl();
}

function saveApply()
{
	if( ! $("#tr69_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.PeriodicInformEnable = $("#Tr69Inform_checkbox").attr("checked") ? "1" : "0";
	postdata.PeriodicInformInterval = $("#Informinter_text").val();
	postdata.URL = $("#Acsurl_text").val();
	postdata.Username = $("#AcsUserName_text").val();
	postdata.Password = $("#AcsPassWord_password").val();
	postdata.ConnectionRequestUsername = $("#ConnReqName_text").val();
	postdata.ConnectionRequestPassword = $("#ConnReqPassWord_password").val();
	if ( getOperator() == "CT" )
	{
		postdata.Tr069Enable = $("#Middleware_select").val();
		postdata.MiddlewareURL = $("#MldAddr_text").val();
		postdata.MiddlewarePort = $("#MldPort_text").val();
	}
	postdata.sessionid = sessionidstr;
	XHR.post("set_tr69_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


function displayControl()
{
	if ( $("#Middleware_select").val() == '1' ) //不启用中间件
	{
		$(".middleware_item").hide();
	}
	else
	{
		$(".middleware_item").show();
	}
}

function checkDisableElement()
{
	if ( tr69_modify_enable == 0 || garea_code == "Guangdong" || garea_code == "Hunan" 
	|| garea_code == "Jiangsu" || garea_code == "Chongqing" || garea_code == "Sichuan" 
	|| garea_code == "Shanghai" || garea_code == "Anhui" || garea_code == "Fujian" 
	|| garea_code == "Gansu" || garea_code == "Tianjin" || garea_code == "Zhejiang"
	|| garea_code == "Trunk" || garea_code == "trunk" )
	{
		$(":text,:password,:checkbox, select, :button").attr("disabled", true);
	}
	else
	{
		$(":text,:password,:checkbox, select, :button").removeAttr("disabled");
	}
}
