//javascript for login_inter.html
// var isEmpty = true;

var sessionidstr = "";
var operator_name = "";
var verifiCode = "";
var super_userName = "";
var admin_enable = "";
var zkzcode;
var username = "";
var login_error_hint;
document.onkeydown = function mykeyDown(e) {
	e = e || event;
	if (e.keyCode == 13) {
		document.getElementById('login_btn').click();
	}
	return;
}

$(document).ready(function() {
	XHR.get("get_device_name", null, logoSetting);
	XHR.get("get_operator", null, get_operator);
	initCustom();

});


function get_operator(getdata) {
	if (getdata.operator_name != undefined) {
		operator_name = getdata.operator_name;
	}
}

function logoSetting(data) {
	var ModelName;
	$("#device_name").append(data.ModelName);

}

function refresh() {
	createCode();
	$("#verifiCode").html(zkzcode);
}


function createCode() {

	zkzcode = "";
	var zkzcodeLength = 5;
	var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm',
		'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');

	for (var i = 0; i < zkzcodeLength; i++) {
		var charIndex = Math.floor(Math.random() * 56);
		zkzcode += selectChar[charIndex];
	}

	return zkzcode;

}



function initCustom() {
	if (operator_name == 'TH_3BB') {
		createCode();
		$("#tr_verifi").show();
		var obj = document.getElementById("verifiCode");
		obj.style.cssText = "letter-spacing:15px";

		$("#verifiCode").html(zkzcode);
	}
}

function showFactoryTip(getdata) {
	if (getdata) {
		sessionidstr = getdata.sessionid;
	}
	if (getdata.operators_name != undefined) {
		operators_name = getdata.operators_name;
	}
	if (getdata.verifiCode != undefined) {
		verifiCode = getdata.verifiCode;
	}
	super_userName = getdata.super_userName;
	admin_enable = getdata.admin_enable;
}

function onlogin(a) {
	if (a == 1)//login
	{
		if ($("#user_name").val().length <= 0) {
			alert("no_username_alert".i18n());
			return false;
		}
		if ($("#loginpp").val().length <= 0) {
			alert("no_password_alert".i18n());
			return false;
		}
		if ($("#validate_code").val() != zkzcode) {
			alert("validate_code_alert".i18n());
			return false;
		}
		doLoginRequest();
	}
	else if (a == 2)//cancel
	{
		user_name.value = "";
		loginpp.value = "";
		document.getElementById("login_error_hint").style.display = "none";
	}
	else if (a == 3)//regist
	{
		window.location.href = "register.html";
		document.getElementById("login_error_hint").style.display = "none";
	}
}

function doLoginRequest() {
	var postdata = new Object();
	$("#login_btn").attr("disabled", true);

	postdata.username = $("#user_name").val();
	postdata.loginpd = fhencrypt($("#loginpp").val());
	postdata.port = 0;
	XHR.post("do_login", postdata, parseLoginData);

}

function parseLoginData(data) {
	if (data) {
		$("#login_error_hint").show();
		var login_error_hint = document.getElementById("login_error_hint");
		if (data.login_result == 0) {
			$("#login_btn").attr("disabled", false);
			window.location.href = "main_inter.html";
			return;
		}
		else if (data.login_result == 1) {
			login_error_hint.innerHTML = "haveuserlogin".i18n();
		}
		else if (data.login_result == 2) {
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "3timeError".i18n();
			if (gOperatorName == "TH_TRUE") {
				login_error_hint.innerHTML = "3timeError_30".i18n();
			}
		}
		else if (data.login_result == 3) {
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "account_disabled_error".i18n();
		}
		else if (data.login_result == 4) {
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "name_pwd_error".i18n();

		}
		else if (data.login_result == 9) {//User account Unavailable
			login_error_hint.innerHTML = "user_account_disabled_error".i18n();
		}
		else if (data.login_result == 100) {
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "login_fail".i18n();

		}
		else {
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "unexpected_error".i18n();
		}
	}
	else {
		alert("unexpected_error".i18n());
		document.getElementById("login_error_hint").style.display = "none";
	}
	$("#login_btn").attr("disabled", false);
	$("#loginpp").val("");
}
