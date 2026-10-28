//javascript for login_inter.html
// var isEmpty = true;

var sessionidstr = "";
var operators_name = "";
var verifiCode = "";
var super_userName = "";
var admin_enable = "";
var zkzcode;//3BB验证码
var username = "";
var login_error_hint;
document.onkeydown = function mykeyDown(e) {
	e = e || event;
	if (e.keyCode == 13) {
		document.getElementById('submit').click();

	}
	return;
}

$(document).ready(function() {

	XHR.get("get_operator", null, get_operator);
	initCustom();


});

function createCode() {

	zkzcode = "";
	var zkzcodeLength = 5; //验证码的长度  
	var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm',
		'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'); //所有候选组成验证码的字符，当然也可以用中文的 

	for (var i = 0; i < zkzcodeLength; i++) {
		var charIndex = Math.floor(Math.random() * 56);
		zkzcode += selectChar[charIndex];
	}

	return zkzcode;

}

function get_operator(getdata) {
	if (getdata.operator_name != undefined) {
		operators_name = getdata.operator_name;
	}
}

//刷新验证码按钮
function refresh() {
	createCode();
	$("#checkCode").html(zkzcode);
}


function initCustom() {
	if (operators_name == 'TH_3BB') {
		createCode();
		$("#checkCode").show();
		$("#checkCode").html(zkzcode);
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
		if ($("#User").val().length <= 0) {
			alert("no_username_alert".i18n());
			return false;
		}
		if ($("#Passwd").val().length <= 0) {
			alert("no_password_alert".i18n());
			return false;
		}
		if($("#jiaoyanma").val() != zkzcode) {
			alert("validate_code_alert".i18n());
			return false;	
		}
		doLoginRequest();
	}

}

function doLoginRequest() {
	var postdata = new Object();
	$("#login_btn").attr("disabled", true);
	postdata.username = $("#User").val();
	postdata.loginpd = fhencrypt($("#Passwd").val());
	XHR.post("do_login", postdata, parseLoginData);

}

function parseLoginData(data) {
	if (data) {
		var login_error_hint = document.getElementById("login_error_hint");
		if (data.login_result == 0)//校验成功
		{
			$("#login_btn").attr("disabled", false);
			window.location.href = "/html/changemode_cfg.html";
			return;
		}
		else if (data.login_result == 1) {
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "haveuserlogin".i18n();
		}
		else if (data.login_result == 2) {
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "3timeError".i18n();
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
