var sessionidstr = "";
var g_data;
$(document).ready(function(){
	//优化滚动条，无需改动

    var postdata = new Object();
    console.log(postdata);
    XHR.get("get_operator", null, get_operator);
    XHR.post("set_landingPage_info", postdata, initPage);	
});

function initPage(getdata)
{
}


function save_enable_apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
	postdata.Enable = $("input[name='iot_enable']:checked").val();
	XHR.post("set_iot_info", postdata, initPage);
}


 function save_apply()
{
	show_shadow();
	
	if( ! $("#Iot_form").valid() )
	{
	     alert("illegal_value_alert".i18n());
	    return;
	}
	
	var postdata = new Object();
	postdata.action = "config";
	postdata.HttpConnectUrl = $("#iot_url").val();
	postdata.HttpConnectPassword = fhencrypt($("#iot_password").val());
	XHR.post("set_iot_info", postdata, initPage);
	sleep(1000);	
}

function get_operator(getdata){
    if ( getdata.operator_name != undefined )
    {
        var operator_name = getdata.operator_name;
    }
}

