var sessionidstr = "";
var operator_name =  gOperatorName;
var login_user = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
});

function down_cfgfile()
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
            $("#Restart_button").attr("disabled",true);
			var postdata = new Object();
			postdata.sessionid = getdata.sessionid;
			XHR.post("down_cfgfile_ais", postdata, parse_return_data);
		}
	});
}

function parse_return_data(data)
{
	console.log(data);
	if ( data && data.success == "true" && data.uploadToServerWeb == 0)
	{
		window.location = "../cgi-bin/download?"+ data.filename;
		alert("download_config_success".i18n());
	}
	else
	{
		alert("unknown_error_alert".i18n());
	}
}