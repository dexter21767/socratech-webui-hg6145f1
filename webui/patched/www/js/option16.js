var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/option16", initPage);
	}
	else
	{
		XHR.get("get_option16", null, initPage);
	}
});

function initValidate()
{
	$("#option_form").validate({
		debug: true,
		rules: {
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
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata && getdata.option )
	{
		var data = getdata.option;
		data.option16_encry_enable == "no" ? setCheckbox("option16_encry_enable", 0):setCheckbox("option16_encry_enable", 1);
	}
}

function saveApply()
{
	if( ! $("#option_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();

	getCheckbox("option16_encry_enable") == 1 ? postdata.option16_encry_enable = "yes" : postdata.option16_encry_enable = "no";
	postdata.sessionid = sessionidstr;
	XHR.post("set_option16", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

