var g_data;
var login_user = gLoginUser;
var operator_name = gOperatorName;
var g_certificate_enable = "";
var  required_flag = true;

$(document).ready(function(){
	//initValidate();
	
	{
		XHR.get("get_mqtt_info", null, initPage);
	}

});

function initPage(getdata)
{
	if ( getdata )
	{
		g_data = getdata;
		displayHTML();
	}
}

function displayHTML()
{
	var certficate_enable = g_data.certficate_enable;
	//$("#tr181_manage_server_url").val(g_data.server_add + ":" + g_data.server_port);	
	$("#tr181_manage_server_url").val("");	
	if(certficate_enable == "0")
	{
		$("[name='certficate_enable'][value='0']").prop('checked','true');
	}
	else if(certficate_enable == "1")
	{
		$("[name='certficate_enable'][value='1'").prop('checked','true');
	}	
	
}

function initValidate()
{	
	$("#mqtt_form").validate({
		debug: true,
		rules: {
            "tr181_manage_server_url": {required: true, rangelength:[1,255]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		}
	}); 
}

 function saveApply()
{
	show_shadow();
	
	if( ! $("#mqtt_form").valid() )
	{
	     alert("illegal_value_alert".i18n());
	    return;
	}
	
	var postdata = new Object();
//	console.log("indexOf " + $("#tr181_manage_server_url").val().indexOf(":"));
//	console.log("lastIndexOf " + $("#tr181_manage_server_url").val().lastIndexOf(":"));
	if(($("#tr181_manage_server_url").val().indexOf("mqtts://") >= 0
		|| $("#tr181_manage_server_url").val().indexOf("mqtt://") >= 0)
		&& $("#tr181_manage_server_url").val().lastIndexOf(":") >= 5)
	{
		postdata.ServerAddress = $("#tr181_manage_server_url").val().split(':')[0] + ":" + $("#tr181_manage_server_url").val().split(':')[1];
		postdata.ServerPort = $("#tr181_manage_server_url").val().split(':')[2];
	}
	else
	{
		alert("mqtt_url_invalid".i18n());
		return;
	}
	postdata.AuthEnable = $("input[name='certficate_enable']:checked").val();
	console.log("AuthEnable " + postdata.AuthEnable);
	XHR.post("set_mqtt_info", postdata, initPage);
	
}


