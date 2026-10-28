var gPwdStrength = 0;
var operator_name = gOperatorName;
var login_user;
var wifidata = "";
var main_wifi_index_5g = gWifi5GIndex;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
		customPasswordInit();
	
		initValidate();
	
		customSwitchInit();
		XHR.get("get_login_user", null, parseLoginUser);
		initPage();
		XHR.get("get_wifi_status", null, parseGetData2);
		XHR.get("get_wifi_status_5G", null, parseGetData5);
		$("#WlanEnable_container").bind("click", function(){
				bs_show();
		});	
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

//获取管理员用户用户名
function get_super_userName(data)
{
	if(data && data != undefined){
		//alert(JSON.stringify(data));
		$("#username").val(data.super_userName);
	}
}

//获取普通用户用户名
function get_common_userName(data)
{
	if(data && data != undefined){
		//alert(JSON.stringify(data));
		$("#username").val(data.user_name);
	}
}
//获取当前登录用户类型（管理员 or 普通用户）
function parseLoginUser(data)//函数赋初值
{
	if ( data && data.login_user != undefined ) 
	{
		login_user = data.login_user
		if(login_user == "2"){
			XHR.get("get_super_userName", null, get_super_userName);
		}else if(login_user == "1"){
			XHR.get("get_username", null, get_common_userName);
		}
	}
}

function saveApply()
{
	show_shadow();
	if (($("#password_new").val()).indexOf(" ") >= 0)
	{
		alert("password_involvespace".i18n());
		return;
	}
	if( ! $("#userManagementForm").valid() )
	{
		alert("invalid_value_alert".i18n());
		return;
	}


	var postdata1 = new Object();
	postdata1.temp = "1";
	postdata1.admin_or_common = login_user;
	postdata1.username = $("#username").val(); 
	postdata1.old_password = fhencrypt($("#password_old").val());
	postdata1.new_password = fhencrypt($("#password_new").val());
	XHR.post("set_pwd_wifi_info", postdata1, function(responseData){
		if(responseData.success != "true")
		{
			if(responseData.errorCode == "-4")
			{
				//alert("原密码错误，请重新输入！");
				alert("password_error".i18n());
				$("input[type='password']").val("");//清空所有的password类型的值
				$("#password_old").focus();//选中当前的密码值			
			}
			else
			{
				//alert("修改密码失败！");
				alert("modifyPassword_false".i18n());
				$("input[type='password']").val("");//清空所有的password类型的值
				$("#password_old").focus();//选中当前的密码值			
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

function checkResult(responseData)
{
	if(responseData.success == "true")
	{
		alert("modifyPassword_success".i18n());
		XHR.get("set_web_user_config", null, function(){
			window.location.href = "main_inter.html";
		})
	}
}


function initValidate()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
		    "password_old": { required: true,  maxlength: 32 },
		    "password_new": { required: true, minlength : 8, maxlength: 32},
		    "password_new_confirm": { required: true, minlength : 8, maxlength: 32,  equalTo: "#password_new" },
			
			"ssidname_2": { required: true, minlength : 1, maxlength: 32 ,nocn: true },
			"password_2": { required: true, minlength : 8, maxlength: 63 ,nocn: true },
			"ssidname_5": { required: true, minlength : 1, maxlength: 32 ,nocn: true },
			"password_5": { required: true, minlength : 8, maxlength: 63 ,nocn: true },
			"password_confirm": { required: true, minlength : 8, maxlength: 63,  equalTo: "#password_2"},
			"password_confirm_5": { required: true, minlength : 8, maxlength: 63,  equalTo: "#password_5"},

			"ssidname_bs": { required: true, minlength : 1, maxlength: 32 ,nocn: true},
			"password_bs": { required: true, minlength : 8, maxlength: 63 ,nocn: true},
			"password_confirm_bs": { required: true, minlength : 8, maxlength: 63,  equalTo: "#password_bs" },
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
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


function gotoMenuPage(){
	XHR.get("set_web_user_config", null, function(){
		window.location.href = "main_inter.html"
	});
}


function bs_show()
{
	if($("#WlanEnable_container").hasClass("switch_content switch_content_off"))
	{	
		$("#2gwifi").show();
		$("#5gwifi").show();
		$("#bs").hide();
		//$("#ssidname_bs").val("");
		$("#password_bs").val("");
		$("#password_confirm_bs").val("");
	}
	else
	{
		$("#2gwifi").hide();
		$("#5gwifi").hide();
		$("#bs").show();
		//$("#ssidname_2").val("");
		$("#password_2").val("");
		$("#password_confirm").val("");
		//$("#ssidname_5").val("");
		$("#password_5").val("");
		$("#password_confirm_5").val("");
	}
}