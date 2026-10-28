$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
});

function webreboot()
{
	if(confirm("reboot_confirm".i18n()))
	{	
		XHR.get("get_login_user", null, function(getdata){
			if ( getdata.sessionid != undefined )
			{
				sessionidstr = getdata.sessionid;
				$("#Restart_button").hide();
				$("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n()); 
				jumpToLoginPage(true);
				var postdata = new Object();
				postdata.sessionid = sessionidstr;
			
				XHR.post("set_onu_reboot", postdata, reloadData);
			}
		});
	}		
}

function reloadData(responseData)
{
	/*$("#Restart_button").hide();
	if(responseData.success != "true")
	{
		alert("restore_error".i18n());
	}
	else
	{
		$("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n()); 
		XHR.get("get_login_user", null, function(getdata){
			if ( getdata.sessionid != undefined )
			{
				sessionidstr = getdata.sessionid;
				var postdata = new Object();
				postdata.sessionid = sessionidstr;
				XHR.post("set_onu_reboot", postdata, null);
			}
		});
		jumpToLoginPage(true);
	}*/
}
