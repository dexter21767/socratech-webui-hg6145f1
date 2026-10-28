var gPwdStrength = 0;
var operator_name = gOperatorName;
var common_user_name;
var password_length = 8;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	customPasswordInit();
	
    if(operator_name == "TH_AIS"){
    	document.getElementById("username").removeAttribute("disabled");
    }
    
	if(operator_name == "TH_3BB"){
		$("#th_tips").show();
        $("#common_tips").hide();
    }
    if(operator_name == "EG_TELECOM"){
        $("#ed_tips").show();
        $("#common_tips").hide();
        $("#new_password_title").css("height","50px");
        $("#new_password_value").css("height","50px");
    }

    if(operator_name == "MEX_NETWEY"){
        if(gLoginUser == "2")
            $("#old_pwd_div").hide();
        
        if(gLoginUser == "2" || gLoginUser == "1")
            $("#account_prompt").html("call_center_promot".i18n());	
    }
    
	if(operator_name == "TH_3BB"){
		initValidate_3BB();
	}else if(operator_name == "PH_PLDT" || operator_name == "EG_TELECOM" || operator_name == "MY_TM" || operator_name == "BZ_INTELBRAS" || operator_name == "JOR_UMNIAH"){
        if(operator_name == "PH_PLDT"){
           password_length = 12; 
        }
		initValidate_pldt();
	}else if(operator_name == "COL_CLARO"){
		initValidate_COL_CLARO();
	}else if(operator_name == "PH_RADIUS"){
        password_length = 12; 
		initValidate();
	}
    else{
		initValidate();
	}
	
	//if(operator_name == "COL_ETB"){
		$("#sessionTimeForm").show();
		initValidateSessionTime();
	//}

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		//XHR.get("get_login_user", null, parseLoginUser);
		XHR.get("get_super_userName", null, get_super_userName);
                XHR.get("get_username", null, get_username);
		//if(operator_name == "COL_ETB")
		XHR.get("get_sessiontime", null, get_sessiontime);
	}
});

function get_username(data)
{
	if(data && data != undefined){
		//alert(JSON.stringify(data));
        common_user_name = data.user_name;
		//$("#username").val(data.user_name);
	}
}

function get_super_userName(data)
{
	if(data && data != undefined){
		if(gNewUiFlag)
			$("#username").html(data.super_userName);
		else
		$("#username").val(data.super_userName);
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
		if (gNewUiFlag)
            myAlert('Tip', '' + "password_involvespace".i18n() + '', function() { })
        else
		alert("password_involvespace".i18n());
		return;
	}
	
    if(common_user_name == $("#username").val())
    {
		if (gNewUiFlag)
            myAlert('Tip', "Common password should not be same as Admin password!", function() { })
        else
        alert("common_password_same_admin_password".i18n()); //普通用户用户名不能和管理员一致
        return;
    }

	if( ! $("#userManagementForm").valid())//通用
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "password_invilidValue".i18n() + '', function() { })
        else
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
		if (gNewUiFlag)
            myAlert('Tip', '' + "modifyPassword_success".i18n() + '', function() { window.location.reload();})
        else{
		alert("modifyPassword_success".i18n());
		window.location.reload();
		}
	}
	else
	{
		if(responseData.errorCode == "-4")
		{
			//alert("原密码错误，请重新输入！");
			if (gNewUiFlag)
            	myAlert('Tip', '' + "password_error".i18n() + '', function() { })
        	else
				alert("password_error".i18n());
			$("input[type='password']").val("");//清空所有的password类型的值
			$("#password_old").focus();//选中当前的密码值			
		}
		else
		{
			//alert("修改密码失败！");
			if (gNewUiFlag)
            	myAlert('Tip', '' + "modifyPassword_false".i18n() + '', function() { })
        	else
			alert("modifyPassword_false".i18n());
			$("input[type='password']").val("");//清空所有的password类型的值
			$("#password_old").focus();//选中当前的密码值			
		}
	}

}
function get_sessiontime(getdata)
{
	if (getdata != null) {
        $("#sessiontime").val(getdata.sessiontime);
    }
}
function saveTimeApply()
{
	
	if( ! $("#sessionTimeForm").valid())//通用
	{
		alert("password_invilidValue".i18n());
		return;
	}
	show_shadow();
	var postdata = new Object();
	postdata.sessiontime = $("#sessiontime").val();
	XHR.post("set_sessiontime", postdata, get_sessiontime);

}
function initValidateSessionTime()
{
	$("#sessionTimeForm").validate({
		debug: false,
		rules: {
			"sessiontime": { required: true, range_int: [1, 30]},
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
		    "password_new": { required: true, minlength : password_length, maxlength: 32 , pwdcheck_pldt: true},
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


function initValidate_3BB()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
		    //"password_old": { required: true, minlength : 4, maxlength: 32 , },
			"password_old": { required: true},
		    "password_new": { required: true, minlength : 4, maxlength: 32, nocn: true},
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

function initValidate_COL_CLARO()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
		    //"password_old": { required: true, minlength : 8, maxlength: 32 , },
			"password_old": { required: true},
		    "password_new": { required: true, minlength : 10, maxlength: 32, pwdcheck_pldt: true},
		    "password_new_confirm": { required: true, minlength : 10, maxlength: 32,  equalTo: "#password_new" }
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

function initValidate()
{
	$("#userManagementForm").validate({
		debug: false,
		rules: {
            "username": { required: true,minlength :1,  maxlength: 32, nocn: true},
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

function buildData()
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
	data.old_password = fhencrypt($("#password_old").val());
	data.new_password = fhencrypt($("#password_new").val());

	return data;
}