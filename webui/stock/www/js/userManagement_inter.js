var gPwdStrength = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customPasswordInit();
	initValidate();
	$("#PdNew_pd").bind("keyup", function(){
		gPwdStrength = checkPasswordStrength($(this).val(), "password_tips");
	});	
	
	$("#username").bind("change", function(){
        if ($(this).val() == "admin"){
        	$(".account").show();
        }else{
        	$(".account").hide();
        }
    });

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
	}
});

function parseLoginUser(data)
{
	$(".account").hide();
	if ( data && data.login_user != undefined && data.login_user == "1" ) //common user
	{
		$("#username option[value='admin']").remove();
	}
}

function saveApply()
{
	show_shadow();
	if (($("#PdNew_pd").val()).indexOf(" ")>=0)
	{
		//alert("密码不能包含空格，请重新填写");
		alert("password_involvespace".i18n());
		return;
	}
    if ((parseInt($("#PdNew_pd").val().length) < 5))
    {
		//alert("密码至少5位");
		alert("password_fiveBype".i18n());
        return;
    }	
	
	if( ! $("#userManagementForm").valid())
	{
		//alert("某些项的值无效，请重新填写");
		alert("password_invilidValue".i18n());
		return;
	}else{
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
			if(gPwdStrength <= 1)
			{
				if(confirm("password_weak".i18n()) == false)
				{
					$("#PdNew_pd").focus();
					return false;
				}
				XHR.post("userManagement", data, checkResult);
			}
			else
			{
				XHR.post("userManagement", data, checkResult);
			}
			
		}
	}
}

function checkResult(responseData)
{
	show_shadow();
	if(responseData.success == "true")
	{
		//alert("修改密码成功!");
		alert("modifyPassword_success".i18n());
	}
	else
	{
		if(responseData.errorCode == "-4")
		{
			
			//alert("原密码错误，请重新输入！");
			alert("password_error".i18n());
		}
		else
		{
			//alert("修改密码失败！");
			alert("modifyPassword_false".i18n());
		}
	}
	$("input[type='password']").val("");
	$("#PdCfm_pd").focus();
}

function initValidate()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
			"password": {required: true, maxlength:16},
			"newPassword": {required: true, maxlength:16},
			"confirmPassword": {required: true, maxlength:16, equalTo: "#PdNew_pd"}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
			//请输入原密码   请输入确认密码  确认密码和新密码不相同
			"password": { required: "password_initial".i18n()},
			"newPassword":{required: "password_new".i18n()},
			"confirmPassword":{required: "password_confirm".i18n(), equalTo: "password_newpassError".i18n()}
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate user management settings ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate user management failed.....");
			return false;
		}
	}); 
}

function buildData()
{
	var data = new Object();
	data.username = $("#username").val(); 
	data.userpd = fhencrypt($("#PdCfm_pd").val());
	data.newPd = fhencrypt($("#PdNew_pd").val());

	return data;
}