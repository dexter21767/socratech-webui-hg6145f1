
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/oltauth", initPage);
	}
	else
	{
		XHR.get("get_phy_pwd", null, initPage);
	}
});

function initValidate()
{
	$("#loid_form").validate({
		debug: true,
		rules: {
			"Pwd_password": {maxlength:24, nocn: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate loid failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata)
	{
		$("#Pwd_password").val(getdata.GPONPassWord);
	}
}

function saveApply()
{
	if( ! $("#loid_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	
	if ($("#Pwd_password").val().length > 10)
	{
		alert("输入密码的长度不能大于10！请重新输入");
		$("#Pwd_password").val("");
		return;
	}
	
	/* 把输入得密码转为对应ascii码值的16进制 */
	var pwdascii=new Array();
	for (var i = 0; i < $("#Pwd_password").val().length; i++ )
	{
		pwdascii.push($("#Pwd_password").val().charCodeAt(i).toString(16));
	}
	
	postdata.GPONPassWordAsciiHex = pwdascii.join("");
	postdata.GPONPassWord = $("#Pwd_password").val();
	
	XHR.post("set_phy_pwd", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

