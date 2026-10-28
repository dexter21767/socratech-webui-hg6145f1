var login_user = gLoginUser;
var gPwdStrength = 0;
var change_wan = 1;
var operator_name = gOperatorName;
var userLevel = 1;
var super_userName;
var password_length = 8;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customPasswordInit();
    
    if(operator_name == "TH_AIS"){
    	document.getElementById("username").removeAttribute("disabled");
    }
	if(operator_name == "TH_3BB"){
		initValidate_3BB();
	}else if(operator_name == "PH_PLDT"|| operator_name == "EG_TELECOM" || operator_name == "MY_TM" || operator_name == "BZ_INTELBRAS" || operator_name == "JOR_UMNIAH"){
        if(operator_name == "PH_PLDT"){
           password_length = 12; 
        }
		initValidate_PLDT();
	}else if(operator_name == "COL_CLARO"){
		initValidate_COL_CLARO();
	}else if(operator_name == "PH_RADIUS"){
         password_length = 12; 
		initValidate();
	}else{
		initValidate();
	}
	//initValidate();
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
		XHR.get("get_username", null, get_username);
        XHR.get("get_super_userName", null, get_super_userName);
	}
});

function get_super_userName(data)
{
	if(data && data != undefined){
        super_userName = data.super_userName;
	}
}

function get_username(data)
{
	if(data && data != undefined){
		if(gNewUiFlag){
			$("#username").html(data.user_name);
		}else{
		$("#username").val(data.user_name);
		}
	}
}

function parseLoginUser(data)//函数赋初值
{
	if ( data && data.login_user != undefined && login_user == "0" ) //common user
	{
		userLevel = 0;
		$("#username option[value='admin']").remove();
		$("#old_Lan_Pwd").show(); 
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
			if (gNewUiFlag)
            	myAlert('Tip', '' + "password_involvespace".i18n() + '', function() { })
        	else
			alert("password_involvespace".i18n()); //旧密码不能为空
			return;	
		}
	}  
    
    if(super_userName == $("#username").val())
    {
		if (gNewUiFlag)
            myAlert('Tip', "Common password should not be same as Admin password!", function() { })
        else
		alert("common_password_same_admin_password".i18n());//普通用户用户名不能和管理员一致
		return;
    }
	
	if (($("#lan_new_password").val()).indexOf(" ") >= 0)
	{
		//alert("密码不能包含空格，请重新填写");
		if (gNewUiFlag)
            myAlert('Tip', '' + "password_involvespace".i18n() + '', function() { })
        else
		alert("password_involvespace".i18n());
		return;
	}
	
	if (!$("#userManagementForm_lan").valid())//通用
	{
		//alert("某些项的值无效，请重新填写");
		if (gNewUiFlag)
            myAlert('Tip', '' + "password_invilidValue".i18n() + '', function() { })
        else
		alert("password_invilidValue".i18n());
		return;
	}
	else //成功的时候，进行发送数据的拼接
	{
		if((operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP") && login_user == 0){
			if (($("#lan_new_password").val()).indexOf("@") >= 0)
			{
				//alert("密码不能包含@，请重新填写");
				alert("The password should not include the char of \"@\"");
				return;
			}
	    }
	
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
	//window.location.reload();
}

function wan_saveApply() {
    show_shadow();
    change_wan = 1;
    if (($("#wan_new_password").val()).indexOf(" ") >= 0) {
        //alert("密码不能包含空格，请重新填写");
        alert("password_involvespace".i18n());
        return;
    }
    if(! check_password_special_char($("#wan_new_password").val()))
	{
		alert("password_without_char".i18n());
		$("#wan_new_password").val("");//清空所有的password类型的值
		$("#wan_new_password").focus();
		return;
	}
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
  //  alert("Please enable WAN ACL to access by WAN side");
	window.location.reload();
}

function checkResult(responseData)
{
	//alert("111");
	if(responseData.success == "true")
	{
		//alert("修改密码成功!");
		if (gNewUiFlag)
            myAlert('Tip', '' + "modifyPassword_success".i18n() + '', function() { window.location.reload();})
        else{
		alert("modifyPassword_success".i18n());
			window.location.reload();
		}
	}
	else
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "modifyPassword_false".i18n() + '', function() { })
        else
		alert("modifyPassword_false".i18n());
	}
	$("input[type='password']").val("");//清空所有的password类型的值
	if (change_wan == 1)
    {
	    $("#wan_new_password").focus();//选中当前的设置的密码值
	}
	else
	{
	    $("#lan_new_password").focus();//选中当前设置的密码值
	}   
}


//针对菲律宾PLDT版本的initValidate

function initValidate_PLDT(){
	$("#userManagementForm_lan").validate({
		debug: false,
		rules: {
		    "lan_new_password": { required: true,minlength :password_length,  maxlength: 32 , pwdcheck_pldt: true},
		    "lan_confirm_password": { required: true,minlength : password_length, maxlength: 32, equalTo: "#lan_new_password" },
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
	

	
}

//针对3BB版本的initValidate
function initValidate_3BB(){
	$("#userManagementForm_lan").validate({
		debug: false,
		rules: {
		    "lan_new_password": { required: true,minlength :4,  maxlength: 32, nocn: true},
		    "lan_confirm_password": { required: true,minlength : 4, maxlength: 32, equalTo: "#lan_new_password" },
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
	
}

function initValidate_COL_CLARO()
{
	$("#userManagementForm_lan").validate({
		debug: false,
		rules: {
		    "lan_new_password": { required: true,minlength :10,  maxlength: 32, pwdcheck_pldt: true},
		    "lan_confirm_password": { required: true,minlength : 10, maxlength: 32, equalTo: "#lan_new_password" },
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
}


function initValidate()
{
	$("#userManagementForm_lan").validate({
		debug: false,
		rules: {
            "username": { required: true,minlength :1,  maxlength: 32, nocn: true},
		    "lan_new_password": { required: true,minlength :password_length,  maxlength: 32, nocn: true},
		    "lan_confirm_password": { required: true,minlength : password_length, maxlength: 32, equalTo: "#lan_new_password" },
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
	
}

function buildData_lan()
{
    var data = new Object();
	if(gNewUiFlag)
	{
		data.username = $("#username").html();
	}
	else
	{
		if(operator_name == "BZ_ALGAR")
		{
			data.login_name = fhencrypt($("#username").val());
		}
		else
		{
			data.username = $("#username").val();
		}
	}
    
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
    data.new_wan_password = fhencrypt($("#wan_new_password").val());
    data.direction = "wan";
    return data;
}