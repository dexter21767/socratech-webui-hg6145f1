var sessionidstr = "";
var g_data;
var login_user = gLoginUser;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	initValidate();
	customSwitchInit();
	$("#first_server_enable").bind("click", function(){
			if($("#first_server_enable").hasClass("switch_content_on")){
				$("#first_server_info").show();
				
			}else{
				$("#first_server_info").hide();	
			}		
	});
	$("#second_server_enable").bind("click", function(){
			if($("#second_server_enable").hasClass("switch_content_on")){
				$("#second_server_info").show();
				
			}else{
				$("#second_server_info").hide();	
			}		
	});
	XHR.get("get_ais_agent_info", null, initPage);
	
});

function initPage(getdata)
{
	if (getdata != null )
	{
		setSwitchValue("first_server_enable", getdata.First_server_enable);
		if(getdata.First_server_enable == "1"){
			$("#first_server_info").show();	
		}else{
			$("#first_server_info").hide();	
		}
		$("#first_server_address").val(getdata.Primary_server_address);
		$("#first_server_interval").val(getdata.CPEagent_Interval_time_first);
		setSwitchValue("second_server_enable", getdata.Second_server_enable);
		if(getdata.Second_server_enable == "1"){
			$("#second_server_info").show();	
		}else{
			$("#second_server_info").hide();	
		}
		$("#second_server_address").val(getdata.Secondary_server_address);
		$("#second_server_interval").val(getdata.CPEagent_Interval_time_second);
		$("#secret_key_version").val(getdata.SecretKeyVersion);
		$("#secret_key").val(getdata.SecretKey);
	}	
}


function initValidate()
{	
	$("#agent_form").validate({
		debug: true,
		rules: {
            "first_server_address": {required: true,url: true,rangelength:[1, 255]},
            "first_server_interval": {required: true,range_int:[1,86400]},
            "second_server_address": {required: true,url: true,rangelength:[1, 255]},
            "second_server_interval": {required: true,range_int:[1,86400]},	
            "secret_key_version": {required: true,rangelength:[1, 255]},	
            "secret_key": {required: true,rangelength:[1, 255]},	
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

function sendInfo()
{
	show_shadow();
	var postdata = new Object();
	postdata.send_information_immediately = "1";
	XHR.post("send_aisagent_status", postdata, initPage2);
}

function initPage2(getdata)
{
	if (getdata.success == "true")
	{
		alert("send_information_success".i18n());
	}
	else
	{
		alert("send_information_fail".i18n());
	}
}


 function save_apply()
{
	show_shadow();
	
	if( ! $("#agent_form").valid() )
	{
	    alert("illegal_value_alert".i18n());
	    return;
	}
	
	var postdata = new Object();
	if($("#first_server_enable").hasClass("switch_content_on")){
		postdata.First_server_enable = "1";
		postdata.Primary_server_address = $("#first_server_address").val();
		postdata.CPEagent_Interval_time_first = $("#first_server_interval").val();
	}else{
		postdata.First_server_enable = "0";
	}
	
	if($("#second_server_enable").hasClass("switch_content_on")){
		postdata.Second_server_enable = "1";
		postdata.Secondary_server_address = $("#second_server_address").val();
		postdata.CPEagent_Interval_time_second = $("#second_server_interval").val();
	}else{
		postdata.Second_server_enable = "0";
	}
	
	postdata.SecretKeyVersion = $("#secret_key_version").val();
	postdata.SecretKey = $("#secret_key").val();

	XHR.post("set_ais_agent_info", postdata, initPage);
}

