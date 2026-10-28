var gPwdStrength = 0;
var operator_name = gOperatorName;
var login_user = gLoginUser;
var cur_lang = glang;
var g_device_name;
var isFirstlogin = "";
var isFirstloginUser = "";
var isFirstloginAdmin = "";
var main_wifi_index_5g = gWifi5GIndex;

$(document).ready(function(){
	customPasswordInit();
	initValidate_pldt();
	

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		customSwitchInit();
		XHR.get("get_web_config", null, getWebConfig);
		XHR.get("get_device_name", null, logoSetting);
		XHR.get("get_web_config", null, getWebConfig);
		XHR.get("get_super_userName", null, get_super_userName);
		XHR.get("get_username", null, get_username);

		initPage();
		XHR.get("get_wifi_status", null, parseGetData2);
		XHR.get("get_wifi_status_5G", null, parseGetData5);
		$("#WlanEnable_container").bind("click", function(){
				bs_show();
		});
		
		if(operator_name =="BZ_INTELBRAS")
		{
			if(cur_lang == "en")//en
			{
				$("#modify").html("modify_btn".i18n());
			}
			else//pt
			{
				$("#modify").html("modify_btn".i18n());
			}
			if ((isFirstloginAdmin == "1" && login_user == 1))
			{
				$("#div_terms_of_use").show();
			}
			else
			{
				$("#div_terms_of_use").hide();
			}
			setTimeout("alert('initial_login_modify_password'.i18n())",
				100);
		}
	}
});

function initPage()
{

	XHR.get("get_bandSteering_wlan", null, fillData);
	
}

function fillData(data)
{
	if (data)
	{
		wifidata = data.bandSteering;
		setSwitchValue("WlanEnable_container", wifidata.X_FH_BandSteeringEnable);
		$("#WlanEnable_checkbox").val(wifidata.X_FH_BandSteeringEnable);
		$("#ssidname_bs").val(wifidata.SSID);
		bs_show();
	}
}

function getWebConfig(data) {
	if (data) {
		isFirstlogin = data.FirstTimeLogin;
		isFirstloginAdmin = data.FirstTimeLoginAdmin;
		isFirstloginUser = data.FirstTimeLoginUser;
	}
}

function get_super_userName(data)
{
	if(data && data != undefined){
		$("#username").val(data.super_userName);
	}
}

function get_username(data)
{
	if(data && data != undefined){
		if(login_user == 0)////common user
		{
			$("#username").val(data.user_name);
		}
	}
}

function parseLoginUser(data)//函数赋初值
{
	if ( data && data.login_user != undefined && data.login_user == 0 ) //common user
	{
		$("#username option[value='admin']").remove();
	}
}

function Modify()
{
	show_shadow();
	if (($("#password_new").val()).indexOf(" ") >= 0)
	{
		//alert("密码不能包含空格，请重新填写");
		alert("password_involvespace".i18n());
		return;
	}
	
	if( ! $("#userManagementForm").valid())//通用
	{
		//alert("某些项的值无效，请重新填写");
		alert("password_invilidValue".i18n());
		return;
	}
	else
	{
		if((isFirstloginAdmin == "1" && login_user == "1"))
		{
			if ($("#terms_of_use_enable").prop("checked") == false)
			{
				alert("agree_terms_of_use_first".i18n());
				return false;
			}
		}

		var postdata1 = new Object();
		postdata1.temp = "1";
		if(login_user == "1")//admin
		{
			postdata1.admin_or_common = "2";
		}
		else if(login_user == "0")//user
		{
			postdata1.admin_or_common = "1";
		}
		postdata1.new_password = fhencrypt($("#password_new").val());
		XHR.post("set_pwd_wifi_info", postdata1, function(responseData){
			if(responseData.success != "true")
			{
				if(responseData.errorCode == "-4")
				{
					alert("password_error".i18n());
					$("input[type='password']").val("");
					$("#password_old").focus();			
				}
				else
				{
					alert("modifyPassword_false".i18n());
					$("input[type='password']").val("");
					$("#password_old").focus();		
				}
				return;
			}
			var bs_enable = $("input[name='WlanEnable_checkbox']").val();
			if(bs_enable == "1"){
				var postdata = new Object();
				postdata.temp = "4";
				postdata.X_FH_BandSteeringEnable = "1";
				postdata.SSID = fhencrypt($("#ssidname_bs").val());  
				postdata.PreSharedKey = fhencrypt($("#password_bs").val());
				XHR.post("set_pwd_wifi_info", postdata, checkResult);
			}
			else{
				var postdata2 = new Object();
				postdata2.temp = "2";
				postdata2.X_FH_BandSteeringEnable = "0";
				postdata2.SSID_24G_SEG = fhencrypt($("#ssidname_2").val());
				postdata2.PASSWORD_24G_SEG = fhencrypt($("#password_2").val());
				XHR.post("set_pwd_wifi_info", postdata2, function(data2){
					var postdata3 = new Object();
					postdata3.temp = "3";
					postdata3.main_wifi_index_5g = main_wifi_index_5g;
					postdata3.SSID_5G_SEG = fhencrypt($("#ssidname_5").val());
					postdata3.PASSWORD_5G_SEG = fhencrypt($("#password_5").val());
					XHR.post("set_pwd_wifi_info", postdata3, checkResult);
				});
			}	
			
		});
	}
}

function checkResult(responseData)
{
	if(responseData.success == "true")
	{
		if(operator_name =="BZ_INTELBRAS")
		{
			if(login_user == 1)//admin
			{
				XHR.get("set_web_admin_config", null, null);
			}
			else//common user
			{
				XHR.get("set_web_user_config", null, null);
			}
		}
		alert("modifyPassword_success".i18n());
		window.location.href = "main_bz_intelbras.html";
	}
	else
	{
		if(responseData.errorCode == "-4")
		{
			alert("password_error".i18n());
			$("input[type='password']").val("");
			$("#password_old").focus();		
		}
		else
		{
			alert("modifyPassword_false".i18n());
			$("input[type='password']").val("");
			$("#password_old").focus();		
		}
	}
}

function initValidate_pldt()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
		    "password_new": { required: true, minlength : 8, maxlength: 29 , pwdcheck_pldt: true},
		    "password_new_confirm": { required: true, minlength : 8, maxlength: 29,  equalTo: "#password_new" },

			"ssidname_2": { required: true, minlength : 1, maxlength: 32 },
			"password_2": { required: true, minlength : 8, maxlength: 63, pwdcheck_pldt: true },
			"ssidname_5": { required: true, minlength : 1, maxlength: 32},
			"password_5": { required: true, minlength : 8, maxlength: 63, pwdcheck_pldt: true },
			"password_confirm": { required: true, minlength : 8, maxlength: 63,  equalTo: "#password_2" },
			"password_confirm_5": { required: true, minlength : 8, maxlength: 63,  equalTo: "#password_5" },

			"ssidname_bs": { required: true, minlength : 1, maxlength: 32 },
			"password_bs": { required: true, minlength : 8, maxlength: 63, pwdcheck_pldt: true },
			"password_confirm_bs": { required: true, minlength : 8, maxlength: 63,  equalTo: "#password_bs" },
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate admin management settings ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate admin management failed.....");
			return false;
		}
	}); 
}

function realLogout()
{
	var postdata = new Object();
	var user = '';
	if ( gLoginUser == 2 ) //fiberuser
	{
		user = "fiber";
	}
	else if ( gLoginUser == 1 ) //admin user
	{
		user = "admin";
	}
	else //default as common user
	{
		user = "common";
	}
	postdata.username = user;
	XHR.post("do_logout", postdata, function(data){
		window.location = "../index.html";
	});
}

function logoSetting(data) {
	var ModelName;
	g_device_name = data.ModelName;
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

function parseGetData2(data)
{
	if ( data && data.wifi_status )
	{
		var wifidata = data.wifi_status;
		$("#ssidname_2").val(fhdecrypt(wifidata[0].SSID))
	}

}

function parseGetData5(data)
{
	if ( data && data.wifi_status5g )
	{
		var wifidata = data.wifi_status5g;
		$("#ssidname_5").val(fhdecrypt(wifidata[0].SSID))
	}

}

function bs_show()
{
	if($("#WlanEnable_container").hasClass("switch_content switch_content_off"))
	{	
		$("#2gwifi").show();
		$("#5gwifi").show();
		$("#bs").hide();
		$("#password_bs").val("");
		$("#password_confirm_bs").val("");
	}
	else
	{
		$("#2gwifi").hide();
		$("#5gwifi").hide();
		$("#bs").show();
		$("#password_2").val("");
		$("#password_confirm").val("");
		$("#password_5").val("");
		$("#password_confirm_5").val("");
	}
}