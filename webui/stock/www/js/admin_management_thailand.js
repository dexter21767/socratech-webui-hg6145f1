var gPwdStrength = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customPasswordInit();
	initValidate();
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
		XHR.get("get_super_userName", null, get_super_userName);
	}
});

function parseLoginUser(data)//函数赋初值
{
	if ( data && data.login_user != undefined && data.login_user == "1" ) //common user
	{
		$("#username option[value='admin']").remove();
	}
}
function get_super_userName(data)
{
	if(data && data != undefined){
		$("#username").val(data.super_userName);
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
	
	// if(! check_password_special_char($("#password_new").val()))
	// {
	// 	alert("password_without_char".i18n());
	// 	$("#password_new").val("");//清空所有的password类型的值
	// 	$("#password_new_confirm").val("");//清空所有的password类型的值
	// 	$("#password_new").focus();
	// 	return;
	// }
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
			XHR.post("admin_management", data, checkResult);//post 方法使用的地方	
		}
	}
	//window.location.reload();
}

function checkResult(responseData)
{
	if(responseData.success == "true")
	{
		//alert("修改密码成功!");
		alert("modifyPassword_success".i18n());
		window.location.reload();
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
		    //"password_old": { required: true, minlength : 8, num_letter_ : true,maxlength: 32 , },
			"password_old": { required: true},
		    "password_new": { required: true, minlength : 8,maxlength: 32 , nocn: true},
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
	data.old_password = fhencrypt($("#password_old").val());
	data.new_password = fhencrypt($("#password_new").val());

	return data;
}