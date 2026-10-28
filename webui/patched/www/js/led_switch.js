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
		XHR.get("get_led_switch_info", null, initPage);
	}
});

function initPage(getdata)
{
	if ( getdata != null && getdata.led_switch_info )
	{
		gdata = getdata.led_switch_info;
		displayHtml();
	}
}

function displayHtml()
{
	if (gdata.led_switch_enable == "1"){
		$("input[name='led_switch_enable']:first").attr('checked', 'checked');
		
	}else{
		$("input[name='led_switch_enable']:last").attr('checked', 'checked');
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
	postdata.led_switch_enable = $("input[name='led_switch_enable']:checked").val();
	XHR.post("set_led_switch_info", postdata, initPage);
}
