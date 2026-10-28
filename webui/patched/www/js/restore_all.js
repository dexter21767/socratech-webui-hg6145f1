var sessionidstr;
var operator_name = gOperatorName;	
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});

	if(operator_name == "EG_TELECOM"){
		$("#adminRestore_prompt").html("On this page, the device could be restored to factory settings.");
	}
});

function restore_all()
{
	var prompt;
	if(operator_name == "EG_TELECOM"){
		prompt = "restore_confirm_eg".i18n()
	}else{
		prompt = "restore_confirm".i18n()
	}
	

    if(confirm(prompt))
    {
        $("#Restart_button").hide();
        $("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());
        jumpToLoginPage(true);
	    var postdata = new Object();
	    postdata.sessionid = sessionidstr;
        XHR.post("restore_all", postdata, reloadData);
    }
}

function reloadData(responseData)
{
    // $("#Restart_button").hide();
    // $("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());
    // jumpToLoginPage(true);
	// if(responseData.success != 0)
	// {
	// 	alert("restore_error".i18n());
	// }
	// else
	// {
	// 	$("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());       
	// 	jumpToLoginPage(true);
	// }
}
