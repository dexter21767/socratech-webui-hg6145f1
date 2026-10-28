//javascript for login_inter.html
// var isEmpty = true;

var sessionidstr = "";
var operator_name = "";
var FirstTimeSetting = "";
var isFirstlogin = "";
var verifiCode = "";
var super_userName = "";
var admin_enable = "";
var zkzcode;//3BB验证码
var username = "";
var lang = "";
var login_error_hint;
var login_user;
var isFirstSetting;
var sn;
var default_password;

$(document).ready(function() {
	XHR.get("get_operator", null, get_operator);
	if (operator_name == "MEX_MEGA") {
		XHR.get("get_web_config", null, getWebConfig);
	}

	if (operator_name == "ES_DIGI") {
		$("#lang_div").show();
		$("#logo").attr("src", "../image/new_ui/es_digi_logo.png");
		XHR.get("get_lang_info", null, get_lang_info);
	}

	
})
document.onkeydown = function mykeyDown(e) {
	e = e || event;
	if (e.keyCode == 13) {
		document.getElementById('login_btn').click();

	}
	return;
}
function get_lang_info(data) {
	if (data && data != undefined) {
		if (data.i18n == 'span') {
			$("#user_name").attr("placeholder", "user_name".i18n());
			$("#loginpp").attr("placeholder", "loginpp".i18n());
			$("#SpanishModify").css("color", "rgba(255, 98, 37, 1)");
		}else{
			$("#EnglishModify").css("color", "rgba(255, 98, 37, 1)");
		}
	}
}
function initPage(data) {
	if (data.success == "true") {
		window.location.reload();
	}
}

function changeLanguage(kind) {
	var postdata1 = new Object();
	if (kind == "en") {
		postdata1.lang = "en";
	}
	else if (kind == "spain") {
		postdata1.lang = "span";
	}

	XHR.post("set_lang_info", postdata1, initPage);
}

function get_operator(getdata) {

	if (getdata.operator_name != undefined) {
		operator_name = getdata.operator_name;
	}
}

function onlogin() {

	if ($("#user_name").val().length <= 0 || $("#loginpp").val().length <= 0) {
		$("#tip").html("username or password is illegal !");
		return false;
	}
	doLoginRequest();

}

function getWebConfig(data) {
	if (data && data.Date) {
		$("#date_div").show();
		$("#date_pwd").html(data.Date);
	}
}

function cancel() {
	$("#user_name").val("");
	$("#loginpp").val("");
	$("#tip").html("");
}

function removetip() {
	$("#tip").html("");
}

function doLoginRequest() {
	var postdata = new Object();
	postdata.username = $("#user_name").val();
	postdata.loginpd = fhencrypt($("#loginpp").val());
	postdata.port = 0;
	postdata.sessionid = sessionidstr;
	XHR.post("do_login", postdata, parseLoginData);

}

function parseLoginData(data) {
	if (data) {

		XHR.get("get_login_user", null, function(data_1) {
			if (data_1) {
				login_user = data_1.login_user;
			}
		});

		var login_error_hint = document.getElementById("tip");
		if (data.login_result == 0)//校验成功
		{
			if (operator_name == "OMN_OMANTEL" && data.is_redirect == 1) 
			{
				window.location.href = "user_modifypw_omn_omantel.html";
			}else{
				window.location.href = "main_new_ui.html";
			}
			return;
		}
		else if (data.login_result == 1) {
			login_error_hint.innerHTML = "haveuserlogin".i18n();
		}
		else if (data.login_result == 2) {
			login_error_hint.innerHTML = "3timeError".i18n();
		}
		else if (data.login_result == 3) {
			login_error_hint.innerHTML = "account_disabled_error".i18n();
		}
		else if (data.login_result == 4) {
			login_error_hint.innerHTML = "name_pwd_error".i18n();
		}
		else if (data.login_result == 100) {
			login_error_hint.innerHTML = "login_fail".i18n();
		}
		else {
			login_error_hint.innerHTML = "unexpected_error".i18n();
		}
	}
	else {
		login_error_hint.innerHTML = "unexpected_error".i18n();
	}
	$("#login_btn").attr("disabled", false);
	$("#loginpp").val("");
	$("#loginpp_display").val("");
}

