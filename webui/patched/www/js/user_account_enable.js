var gdata;
var sessionidstr;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_led_switch_info", initPage);
	}
	else
	{
		XHR.get("get_user_account_enable_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata != null && getdata.user_account_enable_info )
	{
		gdata = getdata.user_account_enable_info;
		displayHtml();
	}
}

function displayHtml()
{
	if (gdata.user_account_enable == "1"){
		$("input[name='user_account_enable']:first").attr('checked', 'checked');
		
	}else{
		$("input[name='user_account_enable']:last").attr('checked', 'checked');
	}	
}

function CancelBtn()
{
	displayHtml();
}

function saveApply()
{
	show_shadow();
	var postdata = new Object();
	postdata.user_account_enable = $("input[name='user_account_enable']:checked").val();
	XHR.post("set_user_account_enable_info", postdata, initPage);
}
