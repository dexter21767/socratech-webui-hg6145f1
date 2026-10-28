var sessionidstr = "";
var g_data;
var operator_name = gOperatorName;
var loginUser = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
    
    initValidate();
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_lineID_info", null, initPage);
	}
});

function initPage(getdata)
{
	if (getdata.lineId_info != null && getdata)
	{
		g_data = getdata.lineId_info;
		displayHtml();
	}	
}

function initValidate()
{	
	$("#line_settings_form").validate({
		debug: true,
		rules: {
            "line_id": {required: true, rangelength:[1, 32]},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{
    setCheckbox("line_enable",g_data.LineId_enable);
    $("#line_id").val(g_data.LineId); 
}

function save_apply()
{
	show_shadow();
    if ( ! $("#line_settings_form").valid() )
    {
    	alert("value_illegal".i18n());
    	return;
    }
	var postdata = new Object();
    postdata.line_enable = getCheckbox("line_enable");
    postdata.line_id = $("#line_id").val();
	XHR.post("set_lineID_info", postdata, initPage);
}


