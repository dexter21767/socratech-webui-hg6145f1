var sessionidstr;
var operator_name = gOperatorName;	
$(document).ready(function(){
	


	//var width = (($(".main_config_body").width() - 367))/2
	//$("#reboot_imge").css("margin-left",width+"px")
	//$("#restore_imge").css("margin-left",width+"px")

	$("#reboot_imge").css("margin-left","auto")
	$("#restore_imge").css("margin-left","auto")

	//优化滚动条，无需改动
	//customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
});

function restoreDefault()
{
	myConfirm('Are you sure to restore the device ?'.i18n(),'After restoring, your private configuration will be lost. You sure you want to restore the default configuration ?'.i18n(),function(r){  
		if(r){  
			//...点确定之后执行的内容  
			XHR.get("get_login_user", null, function(getdata){
				if ( getdata.sessionid != undefined )
				{
					var sessionidstr = getdata.sessionid;
					jumpToLoginPage(true);
					var postdata = new Object();
					postdata.sessionid = sessionidstr;
					XHR.post("restoreDefault", postdata, reloadRestoreData);
				}
			});
		}  
	});
}

function webreboot()
{
	myConfirm('Are you sure to reboot the device ?'.i18n(),'After rebooting, it may cause the attached device to disconnect.Please operate with caution.'.i18n(),function(r){  
		if(r){  
			XHR.get("get_login_user", null, function(getdata){
				if ( getdata.sessionid != undefined )
				{
					var sessionidstr = getdata.sessionid;
					jumpToLoginPage(true);
					var postdata = new Object();
					postdata.sessionid = sessionidstr;
					XHR.post("set_onu_reboot", postdata, reloadRebootData);
				}
			});
		}  
	});	
}

function reloadRebootData(responseData)
{
	if(responseData.success != "true")
	{
		myAlert('Reboot Failed', 'The device reboot failed !', function() {})
	}
	else{
		myAlert('Reboot Successfully', '' + "rebooting".i18n() + '', function() {})
	}
}

function reloadRestoreData(responseData)
{
	if(responseData.success != "true")
	{
		myAlert('Restore Failed', 'The device restore failed !', function() {})
	}
	else{
		myAlert('Restore Successfully', '' + "rebooting".i18n() + '', function() {})
	}
}
