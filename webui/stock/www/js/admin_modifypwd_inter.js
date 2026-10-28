var gPwdStrength = 0;
var operator_name = gOperatorName;
var login_user = gLoginUser;

$(document).ready(function(){
	customPasswordInit();
    if(operator_name !="EG_TELECOM")
    {
      if(operator_name =="BZ_INTELBRAS" || operator_name =="JOR_UMNIAH")
      {
      	initValidate_pldt();
      }
	  else
	  {
	  	initValidate();
	  }
    }else{
      initValidate_pldt();
      $("#ed_tips").show();
      $("#new_password_title").css("height","50px");
      $("#new_password_value").css("height","50px");
    }
	

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_super_userName", null, get_super_userName);
		XHR.get("get_username", null, get_username);
		
		if(operator_name =="BZ_INTELBRAS")
		{
			setTimeout("alert('initial_login_modify_password'.i18n())",
				100);
		}
	}
});

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

function saveApply()
{
	show_shadow();
	if (($("#password_new").val()).indexOf(" ") >= 0)
	{
		//alert("密码不能包含空格，请重新填写");
		alert("password_involvespace".i18n());
		return;
	}

	if(operator_name =="BZ_INTELBRAS" || operator_name =="JOR_UMNIAH" || operator_name =="ALGERIA_TELECOM")
	{
		if ($("#password_new").val() == $("#password_old").val())
		{
			alert("password_new_same_password_old".i18n());
			return;
		}
	}
	
	if( ! $("#userManagementForm").valid())//通用
	{
		//alert("某些项的值无效，请重新填写");
		alert("password_invilidValue".i18n());
		return;
	}
	else
	{
		var data = buildData();
		
		if(gDebug)
		{
			//新密码强度较弱，建议您改为更安全的密码，无论如何都要修改吗？
			if(confirm("password_weak".i18n()) == false)
			{
				return false;
			}
			postDataByAjax("../fake/post", JSON.stringify(data));
		}
		else
		{
			if(operator_name =="BZ_INTELBRAS" || operator_name =="JOR_UMNIAH" || operator_name =="ALGERIA_TELECOM")
			{
				if(login_user == 1)
				{
					XHR.post("admin_management", data, checkResult);//admin 
				}
				else
				{
				
					XHR.post("userManagement", data, checkResult);//common user
				}
			}
			else
			{
				XHR.post("admin_management", data, checkResult);//post 方法使用的地方	
			}
		}
	}
	//window.location.reload();
}

function checkResult(responseData)
{
	if(responseData.success == "true")
	{
		//alert("修改密码成功!");
		if(operator_name =="BZ_INTELBRAS" || operator_name =="ALGERIA_TELECOM")
		{
			if(login_user == 1)//admin
			{
				XHR.get("set_web_config", null, null);
			}
			else//common user
			{
				XHR.get("set_web_user_config", null, null);
			}
		}
		alert("modifyPassword_success".i18n());
		if(operator_name =="EG_TELECOM")
		{
			window.location.href = "fast_settings_eg.html";
		}else{
			realLogout();
		}
		
	}
	else
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
	}

}

function initValidate()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
		    //"password_old": { required: true, minlength : 8, maxlength: 32 , },
			"password_old": { required: true},
		    "password_new": { required: true, minlength : 8, maxlength: 32, nocn: true},
		    "password_new_confirm": { required: true, maxlength: 32,  equalTo: "#password_new" }
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

function initValidate_pldt()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
		    //"password_old": { required: true, minlength : 12, maxlength: 32 , },
			"password_old": { required: true},
		    "password_new": { required: true, minlength : 8, maxlength: 32 , pwdcheck_pldt: true},
		    "password_new_confirm": { required: true, maxlength: 32,  equalTo: "#password_new" }
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

function buildData()
{
	var data = new Object();
	data.username = $("#username").val();  
	if(operator_name =="BZ_INTELBRAS" || operator_name =="JOR_UMNIAH" || operator_name =="ALGERIA_TELECOM")
	{
		if(login_user == 1)//admin
		{
			data.old_password = fhencrypt($("#password_old").val());
			data.new_password = fhencrypt($("#password_new").val());
		}
		else//common user
		{
			data.userpd = fhencrypt($("#password_old").val());
			data.newPd = fhencrypt($("#password_new").val());
		}
	}
	else
	{
		data.old_password = fhencrypt($("#password_old").val());
		data.new_password = fhencrypt($("#password_new").val());
	}

	return data;
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