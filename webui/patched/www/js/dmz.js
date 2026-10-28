var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/dmz", initPage);
	}
	else
	{
		XHR.get("get_dmz_info", null, initPage);
	}
});

function initValidate()
{
	$("#dmz_form").validate({
		debug: true,
		rules: {
			"DMZ_text": {ipv4: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate dmz ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate dmz failed.....");
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
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.dmz)
	{
		$("#DMZ_text").val(getdata.dmz.DMZIP);
	}
}

function saveApply()
{
	if( ! $("#dmz_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.DMZIP = $("#DMZ_text").val();
	postdata.sessionid = sessionidstr;
	XHR.post("set_dmz_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

