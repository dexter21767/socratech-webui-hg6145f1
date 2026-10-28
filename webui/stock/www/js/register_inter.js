var g_data;
var login_user = "";
$(document).ready(function(){
	initValidate();
});

function change_eye()
{
    $("#Loidpwd_text").toggleClass("fh-text-security");	 
}

function change_passKey_eye()
{
    $("#Pwd_password").toggleClass("fh-text-security");	
}

function initValidate()
{
	$("#loid_form").validate({
		debug: false,
		rules: {
			"LoidId_text": {required: true, maxlength:24, minlength:1, nocn: true},
			"Loidpwd_text": { maxlength:12, nocn: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
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


function gotoLoginPage(){
	window.location.href = "login_inter.html"
}
function isLetterornumber(s)//是否为字母或者数字或者_
{
	if (s == ""){
	    return true;
	}
	var re = /^[A-Za-z0-9\_\-]*$/g ;
	return re.test(s);
}

function LOIDsaveApply()
{
	if( !$("#loid_form").valid())
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "sncfg_value_invilid".i18n() + '', function() { })
        else
			alert("sncfg_value_invilid".i18n());
		return;
	}
	var LoidId_text = $("#LoidId_text").val();
	var Loidpwd_text = $("#Loidpwd_text").val();
	var postdata = new Object();
	postdata.method = "loid";
	postdata.LoidId_text = LoidId_text;
	postdata.Loidpwd_text = fhencrypt(Loidpwd_text);
	XHR.post("do_loidregister", postdata,function(data){
		if(data.session_valid == 1){
			alert("config successfully")
		}
	});
}

function isLetter_number(s){
	var re = /^[A-Za-z0-9]+$/g;
	return re.test(s);
}


