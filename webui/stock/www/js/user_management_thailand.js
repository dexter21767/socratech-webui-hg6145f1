var gPwdStrength = 0;
var change_wan = 1;
var userLevel = 1;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customPasswordInit();
	initValidate();
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
		XHR.get("get_username", null, get_username);
	}
});

function parseLoginUser(data)//函数赋初值
{
	if ( data && data.login_user != undefined && data.login_user == "1" ) //common user
	{
		userLevel = 0;
		$("#username option[value='admin']").remove();
		$("#old_Lan_Pwd").show(); 
		$("#old_Wan_Pwd").show(); 
	}
}

function get_username(data)
{
	if(data && data != undefined){
		$("#username").val(data.user_name);
	}
}

function lan_saveApply()
{
    show_shadow();
    change_wan = 0;
	
	if ( userLevel == 0 ) //common user
	{
		if (! $("#lan_old_password").val())	
		{
			alert("password_involvespace".i18n()); //旧密码不能为空
			return;	
		}
	}	
	
	if (($("#lan_new_password").val()).indexOf(" ") >= 0)
	{
		//alert("密码不能包含空格，请重新填写");
		alert("password_involvespace".i18n());
		return;
	}
 //    if(! check_password_special_char($("#lan_new_password").val()))
	// {
	// 	alert("password_without_char".i18n());
	// 	$("#lan_new_password").val("");//清空所有的password类型的值
	// 	$("#lan_confirm_password").val("");//清空所有的password类型的值
	// 	$("#lan_new_password").focus();
	// 	return;
	// }
	
	if (!$("#userManagementForm_lan").valid())//通用
	{
		//alert("某些项的值无效，请重新填写");
		alert("password_invilidValue".i18n());
		return;
	}
	else //成功的时候，进行发送数据的拼接
	{
		var data = buildData_lan();
		
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
			XHR.post("user_management", data, checkResult);//post 方法使用的地方
		}
	}
}

function wan_saveApply() {
    show_shadow();
    change_wan = 1;
	
	/*if ( userLevel == 0 ) //common user
	{
		if (! $("#wan_old_password").val())	
		{
			alert("password_involvespace".i18n()); //旧密码不能为空
			return;	
		}
	}*/	
	
    if (($("#wan_new_password").val()).indexOf(" ") >= 0) {
        //alert("密码不能包含空格，请重新填写");
        alert("password_involvespace".i18n());
        return;
    }
 
 //    if(! check_password_special_char($("#wan_new_password").val()))
	// {
	// 	alert("password_without_char".i18n());
	// 	$("#wan_new_password").val("");//清空所有的password类型的值
	// 	$("#wan_new_password").focus();
	// 	return;
	// }
    if (!$("#userManagementForm_wan").valid())//通用
    {
        //alert("某些项的值无效，请重新填写");
        alert("password_invilidValue".i18n());
        return;
    }
    else {
        var data = buildData_wan(); //成功的时候，进行发送数据的拼接

        if (gDebug) {
            //新密码强度较弱，建议您改为更安全的密码，无论如何都要修改吗？
            if (confirm("password_weak".i18n()) == false)
            {
                return false;
            }
            postDataByAjax("../fake/post", JSON.stringify(data));
        }
        else {
            XHR.post("user_management", data, checkResult);//post 
        }
    }
	alert("enable_wan_acl_by_wan_side".i18n());
}

function checkResult(responseData)
{
	$("input[type='password']").val("");//清空所有的password类型的值
	if(responseData.success == "true")
	{
		//alert("修改密码成功!");
		alert("modifyPassword_success".i18n());
		
		
	}
	else
	{
		//alert("修改密码失败！");
		alert("modifyPassword_false".i18n());
		
		if (change_wan == 1)
		{
		    $("#wan_new_password").focus();//选中当前的设置的密码值
		}
		else
		{
		    $("#lan_new_password").focus();//选中当前设置的密码值
		}	 
		
	}
	
	  
}

function initValidate()
{
	$("#userManagementForm_lan").validate({
		debug: false,
		rules: {
		    "lan_new_password": { required: true,minlength :8,  maxlength: 32, nocn: true},
		    "lan_confirm_password": { required: true,minlength : 8, maxlength: 32,equalTo: "#lan_new_password" },
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {	
			num_letter_: "Please enter Number and letter.",
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate user settings ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate user  failed.....");
			return false;
		}
	});
	$("#userManagementForm_wan").validate({
	    debug: false,
	    rules: {
	        "wan_new_password": { required: true,minlength : 8,  maxlength: 32, nocn: true},
	        "wan_confirm_password": { required: true, minlength : 8, maxlength: 32,  equalTo: "#wan_new_password" }
	    },
	    errorPlacement: function (error, element) { //错误信息位置设置方法
	        error.insertAfter(element.parent().parent());
	    },
	    messages: {
	    },
	    submitHandler: function (form) {//校验成功回调
	        fiberlog("validate user settings ok.....");
	    },
	    invalidHandler: function (form, validator) {  //校验失败回调
	        fiberlog("validate user failed.....");
	        return false;
	    }
	});
}

function buildData_lan()
{
    var data = new Object();
    data.username = $("#username").val();
	if ( userLevel == 0 ) //common user
	{
		data.old_lan_password = fhencrypt($("#lan_old_password").val());	
	}
	data.new_lan_password = fhencrypt($("#lan_new_password").val());
	data.direction = "lan";
	return data;
}
function buildData_wan() {
    var data = new Object();
	if ( userLevel == 0 ) //common user
	{	
		data.old_wan_password = fhencrypt($("#wan_old_password").val());	
	}
    data.new_wan_password = fhencrypt($("#wan_new_password").val());
    data.direction = "wan";
    return data;
}