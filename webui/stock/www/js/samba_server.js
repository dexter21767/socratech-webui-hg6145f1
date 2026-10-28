var sessionidstr = "";
var samba_servicesdata = "";


$(document).ready(function(){
	initValidate();
	$("input[name='samba_enable']").bind("click", function(){
		var samba_enable  = $("input[name='samba_enable']:checked").val();
		if (samba_enable == 0){
			$("#user_pwd").css("display", "none");
		}else{
			$("#user_pwd").css("display", "");
		}
	});
	$(".main_item_name").css("width","20%");
	$(".main_item_content").css("width","calc(80% - 3px)");
	initPage();
});


function initValidate()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"samba_user": {required: true, maxlength:32, nocn: true},
			"samba_pwd": {required: true, maxlength:8, nocn: true}
		},
		errorPlacement: function(error, element) { 
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {
			fiberlog("validate loid failed.....");
			return false;
		}
	}); 
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced", fillData);
	}else{
		XHR.get("get_samba_server_info", null, fillData);
	}
	
	$("#add_item").children().css("background-color", "#b7e3e3");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
	$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}


function fillData(data)
{
	if (data && data.samba_services)
	{
		samba_servicesdata = data.samba_services;
		displayHtml();
	}
}


function displayHtml()
{
	if (samba_servicesdata.samba_enable == "0"){
		$("#user_pwd").css("display", "none");
		$("input[name='samba_enable']:last").attr('checked', 'checked');
	}else{
		$("#user_pwd").css("display", "");
		$("input[name='samba_enable']:first").attr('checked', 'checked');
	}
	var name_aes = fhdecrypt(samba_servicesdata.samba_username);
	var password_aes =fhdecrypt(samba_servicesdata.samba_password);
	$("#samba_user").val(name_aes);
	$("#samba_pwd").val(password_aes);
	
	$("#add_item").children().css("background-color", "#eef2f6");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
}

function CancelBtn()
{
	displayHtml();
}

function saveApply()
{
	show_shadow();
	if( ! $("#wlanAdv_settings_form").valid() )
	{
		alert("invalid_data_alert".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.samba_enable = $("input[name='samba_enable']:checked").val();
	postdata.samba_username = $("#samba_user").val();
	postdata.samba_password =$("#samba_pwd").val();
	
	XHR.post("set_samba_server_info", postdata, fillData);
}


