var g_data;

$(document).ready(function(){
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_igmp_info", parseRegisterData);
	}
	else
	{
		//XHR.get("get_igmp_info", null, parseRegisterData);
		XHR.get("get_web_port", null, parseRegisterData);
	}
	initValidate();
});	

function initValidate()
{   
    $("#web_port_form").validate({
        debug: true,
        rules: {
            "web_port_modified": {required:true,range_int_equal:[1024,65535,80]}
        },
        errorPlacement: function(error, element) { //错误信息位置设置方法
           // error.insertAfter(element.parent().parent());
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



function parseRegisterData(getdata)
{
	if ( getdata )
	{
		g_data = getdata;
		displayHTML();
	}
}

function displayHTML()
{
	var web_port = g_data.web_port;
	if(gNewUiFlag)
		$("#web_port").html(web_port);
	else
		$("#web_port").val(web_port);
}

function extraValidCheck()
{	
	
    if ( $("#web_port_modified").val() == "1234")
    {
        $(".main_item_error_hint_extra").html("web_port_webPortErrorAlertmodified".i18n());
        return false;
    }
	return true;
}

function Cancel()
{
	displayHTML();
}

function saveApply()
{
	show_shadow();
	if( ! $("#web_port_form").valid() )
	{
		if(gNewUiFlag)
			myAlert('Tip', '' + "value_invilid".i18n() + '', function() {})
		else
			alert("value_invilid".i18n());
		return;
	}
    if( !extraValidCheck() ) // 额外校验，如要需要再打开
    {
		if(gNewUiFlag)
			myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() {})
		else
    		alert("illegal_value_alert".i18n());
        return;
    }
	$(".main_item_error_hint_extra").html("");
	var web_port = $("#web_port").val();
	var web_port_modified = $("#web_port_modified").val();
	var postdata = new Object();
	postdata.web_port = web_port;
	postdata.web_port_modified = web_port_modified;
	if(gNewUiFlag)
		myAlert('Tip', "rebootAlert".i18n())
	else	
		alert("rebootAlert".i18n());
	XHR.post("set_web_port", postdata, parseRegisterData);
}



