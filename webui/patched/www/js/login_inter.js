//javascript for login_inter.html
// var isEmpty = true;

var sessionidstr = "";
var operator_name = "";
var FirstTimeSetting = "";
var isFirstlogin = "";
var isFirstloginUser = "";
var isFirstloginAdmin = "";
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
var area_code;
var g_device_name;
var g_super_userName;
var cur_lang;
document.onkeydown = function mykeyDown(e) {
	e = e || event;
	if (e.keyCode == 13) {
		document.getElementById('login_btn').click();

	}
	return;
}

$(document).ready(function() {
	XHR.get("get_operator", null, get_operator_sn);
	XHR.get("get_device_name", null, logoSetting);
	initCustom();
	$("#username_common").show();
	$("#common_password").show();
	$("#login_btn").show();
	$("#reset_btn").show();
	if(operator_name == "MAR_INWI"){
		$("#username_td").css("width","50%");
		$("#pwd_td").css("width","50%");
		$("#login_table").attr("background","../image/login_mar_inwi.png")
		$(".STYLE6").css("color","#FFFFFF")
		$("#login_table").css("background-repeat","no-repeat")
		$(".STYLE1").css("background-repeat","repeat-x")
		$(".STYLE1").css("background-color","#FFFFFF")
		$("#username").html("Identifiant");
		$("#mar_imwi").show();
		$("#common").hide();
		$("#lang_div").show();
		$("#lang_div").css("margin-top","60px");
		$("#SpanishModify").hide();
		$("#FrenchModify").show();
		$("#FrenchModify").css("color","grey");
		$("#EnglishModify").css("color","grey");
		XHR.get("get_lang_info", null, get_lang_info);
	}else{
		if(operator_name == "CHL_MP" && area_code == "PRT_LIGAT" || operator_name == "PRT_LIGAT"){
			$("#login_table").attr("background","../image/login_ligat.png")
			$(".STYLE6").css("color","#FFFFC7")
			$("#login_table").css("background-repeat","no-repeat")
		}else{
			$("#login_table").attr("background","../image/login.png")
		}

		if(operator_name != "PLE_PALTEL"){
			$(".STYLE1").css("background-image","url(../image/background.png)")
			$(".STYLE1").css("background-repeat","repeat-x")
		}
		
	}

	if (operator_name == "EG_TELECOM" || operator_name == "BZ_INTELBRAS" || operator_name == "MEX_MEGA" || operator_name == "ALGERIA_TELECOM") {
		XHR.get("get_web_config", null, getWebConfig);
	}
	if (operator_name == "BZ_CLARO") {
		XHR.get("get_super_userName_telmex", null, get_super_userName);
		noNeedSavePassword();
		//createCode();
	}
	if (operator_name == "BZ_INTELBRAS") {
		XHR.get("get_super_userName_telmex", null, get_super_userName);
	}

	if (operator_name == "MEX_TELMEX") {
		XHR.get("get_super_userName_telmex", null, get_super_userName);
		XHR.get("get_lang_info", null, get_lang_info);
		$("#show_password").show();
		$("#lang_div").show();
		$(".STYLE2").css("width", "100px");
	}

	if (operator_name == "BZ_INTELBRAS") {
		XHR.get("get_lang_info", null, get_lang_info);
		$("#lang_div").show();
		$(".STYLE2").css("width", "100px");
	}

	if (operator_name == "MEX_NETWEY") {
		XHR.get("get_lang_info", null, get_lang_info);
		$("#lang_div").show();
		//$(".STYLE2").css("width", "100px");
	}


	if(operator_name == "PH_DITO"){
		$("#td_regist").show();
	}
});
function jump(){
	window.open("http://inwi.ma")
}

function logoSetting(data) {
	var ModelName;
	g_device_name = data.ModelName;
	$("#login_title").html(data.ModelName);
}

function get_super_userName(data) {
	g_super_userName = data.super_userName
	if (operator_name != "BZ_INTELBRAS")
	{
		if (data && data != undefined) {
			$("#user_name").val(data.super_userName);
			$("#user_name").css("background-color", "#F5F5F5");
			$("#user_name").attr("disabled", true);
		}
	}

}

function get_lang_info(data) {
	if (data && data != undefined) {
		cur_lang = data.i18n;
		if (data.i18n == 'span') {
			$("#SpanishModify").css("color", "#00BFFF");
			$("#EnglishModify").css("color", "black");

			if (operator_name == "MEX_NETWEY")
			{
				$("#login_btn").html("login_btn".i18n());
				$("#user_name").attr("placeholder", "user_name".i18n());
				$("#loginpp").attr("placeholder", "loginpp".i18n());
			}
		}
		else if (data.i18n == 'en') {
			$("#EnglishModify").css("color", "#00BFFF");
			$("#SpanishModify").css("color", "black");
			$("#login_btn").html("login_btn".i18n());

			if (operator_name == "BZ_INTELBRAS")
			{
				$("#user_name").attr("placeholder", "user_name".i18n());
				$("#loginpp").attr("placeholder", "loginpp".i18n());
			}
		}
		else if (data.i18n == 'pt') {
			$("#PortugueseModify").css("color", "#00BFFF");
			$("#EnglishModify").css("color", "black");
			$("#login_btn").html("login_btn".i18n());
			if (operator_name == "BZ_INTELBRAS")
			{
				$("#user_name").attr("placeholder", "user_name".i18n());
				$("#loginpp").attr("placeholder", "loginpp".i18n());
			}
		}
	}
}

function change_eye() {
	$("#loginpp").toggleClass("fh-text-security");

}
function getWebConfig(data) {
	if (data) {
		isFirstSetting = data.FirstTimeSetting;
		isFirstlogin = data.FirstTimeLogin;
		isFirstloginUser = data.FirstTimeLoginUser;
		isFirstloginAdmin = data.FirstTimeLoginAdmin;
			

		if (operator_name == "MEX_MEGA" && data.Date)
		{
			$("#tr_date_pwd").show();
			$("#date_pwd_value").html(data.Date);
		}
	}
}

//巴西Claro需求：禁用管理员登录
function disableSuperUser(username) {
	if (super_userName == username && operator_name == "BZ_CLARO" && admin_enable == "0") {
		return false;
	}
}

//巴西Claro需求：登录时不弹出保存用户名密码弹框
function noNeedSavePassword() {
	//$("#loginpp").attr("type","text");
	var html = '';
	html = '<input name="loginpp" id="loginpp" maxlength="32" type="text"  autocomplete="off" style="width:130px; height:28px;" >';
	$("#password_td").html(html);
	html = '';
	html = '<input name="loginpp_display" id="loginpp_display" maxlength="32" type="text" autocomplete="off" style="width:130px; height:28px;">';
	$("#password_td").append(html);
	$("#loginpp").hide();
	$("#loginpp_display").val();
	var str = ""//存储表单真实密码
	$("#loginpp_display").keyup(function() {
		value = $(this).val();//获取表单密码
		if (value.length >= str.length) {//当密码长度增加时由于前面的已经变成星号，所以截取后面输入的字符追加到str中
			str += value.substr(str.length, value.length - str.length);
		}
		else {//当密码长度减小时，判断减小后的长度，然后从真实密码中截取
			str = str.substr(0, value.length);
		}
		$("#loginpp").val(str);
		$(this).val(value.replace(/./g, "*"));//变星星喽
	})
}

//刷新验证码按钮
function refresh() {
	//createCode();
	$("#verifiCode").html(zkzcode);
}


function initCustom() {

	if (operator_name == 'TH_TRUE') {
		$("#tr_verifi").show();
		$("#verifiCode").html(verifiCode);
	} else if (operator_name == 'TH_3BB') {
		//createCode();
		$("#tr_verifi").show();
		var obj = document.getElementById("verifiCode");
		obj.style.cssText = "letter-spacing:15px";
		$("#verifiCode").html(zkzcode);
	}
}

function get_operator_sn(getdata) {

	if (getdata.operator_name != undefined) {
		operator_name = getdata.operator_name;
		sn = getdata.SerialNumber;
		default_password = sn.substring(sn.length - 8, sn.length);
		area_code = getdata.area_code;
	}
	if (operator_name == "BZ_TIM") {
		sessionStorage.setItem("operator_name", "BZ_TIM");
	}
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
		window.location.href = "register_inter.html";
		document.getElementById("login_error_hint").style.display = "none";
	}
}

function doLoginRequest() {
	var postdata = new Object();
	$("#login_btn").attr("disabled", true);

	if(operator_name == "BZ_ALGAR")
	{
		postdata.login_name = fhencrypt($("#user_name").val());
	}
	else
	{
		postdata.username = $("#user_name").val();
	}
	postdata.loginpd = fhencrypt($("#loginpp").val());
	postdata.port = 0;

	//巴西Claro页面开启禁用管理员登录
	if (disableSuperUser(postdata.username) == false) {
		alert("name_pwd_error".i18n());
		return;
	}
	postdata.sessionid = sessionidstr;
	XHR.post("do_login", postdata, parseLoginData);

}

function parseLoginData(data) {
	if (data) {
		$("#login_error_hint").show();
		XHR.get("get_login_user", null, function(data_1) {
			if (data_1) {
				login_user = data_1.login_user;
			}
		});

		var login_error_hint = document.getElementById("login_error_hint");
		if (data.login_result == 0)//校验成功
		{
			$("#login_btn").attr("disabled", false);
			if (operator_name == "OMN_OMANTEL" && data.is_redirect == 1) {
				window.location.href = "user_modifypw_omn_omantel.html";
			} else if (operator_name == "MEX_TELMEX" && data.is_redirect == 1) {
				window.location.href = "admin_modifypwd_inter.html";
			}else if (operator_name == "JOR_UMNIAH" && data.is_redirect == 1) {
				window.location.href = "admin_modifypwd_inter.html";
			}else if (operator_name == "ECU_CNT") {//点击登录之后, 判断是否是第一次配置
				XHR.get("get_web_config", null, isFirstTimeSetting);
			} else if (operator_name == "EG_TELECOM") {
				if (isFirstlogin == "1") {
					if (window.confirm("If you want to modify you default password , please click yes. Else, you can click no to skip!")) {
						window.location.href = "admin_modifypwd_inter.html";
					} else {
						window.location.href = "fast_settings_eg.html";
					}
				}
				else {
					window.location.href = "main_inter.html";
				}
			} else if (operator_name == "MY_TM") {
				window.location.href = "main_my_tm.html";
			}
			else if (operator_name == "BZ_INTELBRAS") {// BZ_INTELBRAS
				if ((data.admin_is_redirect == 1 && login_user == "2")
					|| (data.user_is_redirect == 1 && login_user == "1"))
				{
					window.location.href = "admin_modifypwd_bz_intelbras.html";
				}
				else
				{
					window.location.href = "main_bz_intelbras.html";
				}
			}
			else if (operator_name == "MEX_NETWEY") {
				window.location.href = "main_mex_netwey.html";
			}
            		else if(operator_name == "ALGERIA_TELECOM"){
				if(isFirstloginUser == "1" && login_user == "1"){
					if (window.confirm("If you want to modify your default password , please click ok. Otherwise, you can click cancel to skip this step !")) {
						window.location.href = "default_pwdmodify_inter.html";
					} else {
						XHR.get("set_web_user_config", null, function(){
							window.location.href = "main_inter.html";
						});
					}
				}else{
					window.location.href = "main_inter.html";
				}	
			}
			else if (operator_name == "BZ_ALGAR" && data.is_default_pwd == 1) {
				window.location.href = "default_pwdmodify_bz_algar.html";
			}
			else {
				if (operator_name == "MEX_TELMEX") {
					window.location.href = "main_inter_telmex.html";
				} else {
					window.location.href = "main_inter.html";
				}
			}
			return;
		}
		else if (data.login_result == 1) {
			//alert("当前已有用户在别处登录，请稍后登录");
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "haveuserlogin".i18n();
		}
		else if (data.login_result == 2) {
			//alert("您的连续错误登陆次数已经达到3次，请30分钟后再试");
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "3timeError".i18n();
			if (operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE") {//泰国TRUE定制需求，"您的连续错误登陆次数已经达到3次，请30分钟后再试"
				login_error_hint.innerHTML = "3timeError_30".i18n();
			} else if (operator_name == "ECU_CNT") {
				//厄瓜多尔定制需求，"您的连续错误登陆次数已经达到3次，请2分钟后再试"
				login_error_hint.innerHTML = "3timeError_2".i18n();
			} else if (operator_name == "PAK_PTCL") {
				login_error_hint.innerHTML = "10timeError_5".i18n();
			}
		}
		else if (data.login_result == 3) {
			//alert("电信维护帐号已被禁用，请另选帐号登录");
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "account_disabled_error".i18n();
		}
		else if (data.login_result == 9) {//User account Unavailable
			login_error_hint.innerHTML = "user_account_disabled_error".i18n();
		}
		else if (data.login_result == 4) {
			//alert("用户名或密码错误，请重试");
			//document.getElementById("login_error_hint").style.display = "";

			if (operator_name == "MEX_TELMEX") {
				login_error_hint.innerHTML = "name_pwd_error_mex".i18n();
				$("#login_error_hint").css("font-size", "16px");
			}
			else {
				login_error_hint.innerHTML = "name_pwd_error".i18n();
			}

		}
		else if (data.login_result == 100) {
			//alert("wan侧登陆");
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "login_fail".i18n();

		}
		else {
			//alert("未知错误");
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
	$("#loginpp_display").val("");
}
function change_css(id) {
	$("#" + id + "").css({ "border": "2px", "border-style": "solid", "border-color": "#00A0D7", "outline": "none" });

}

function change_css2(id) {
	$("#" + id + "").css({ "border": "none", "outline": "none" });
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
	else if (kind == "pt") {
		postdata1.lang = "pt";
	}

	XHR.post("set_lang_info", postdata1, initPage);
}

function isFirstTimeSetting(data) {

	if (data) {
		//login_user = gLoginUser;
		this.FirstTimeSetting = data.FirstTimeSetting;
		//第一次登录,则进入配置向导页面
		if (this.FirstTimeSetting === "1" && login_user !== "4") {

			window.location.href = "fast_settings_wan_ECU_CNT.html";

		} else {
			window.location.href = "main_inter.html";
		}

	}
}

function openTerms(url)
{	
	if(cur_lang == "en")//en
	{
		url = "./terms_" + g_device_name + "_en" + ".html";
	}
	else//pt
	{
		url = "./terms_" + g_device_name + ".html";
	}
	var features = "height=500, width=800, top=100, left=300, toolbar=no, menubar=no,scrollbars=no,resizable=no, location=no, status=no";	
	window.open(url, "new1", features);	
}
