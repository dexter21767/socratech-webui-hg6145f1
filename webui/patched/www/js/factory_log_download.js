var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	$("#logname").bind("change", function(){
		//prepareLog();
	});
	$('#download').click(function(){
		prepareLog();
	});
});

function prepareLog()
{
	var postdata = new Object();
	postdata.logname = $("#logname").val();
	postdata.sessionid = sessionidstr;
	XHR.post("prepare_log", postdata, parseResult);
	showOrHideLoadingWindowFromIframe("show");
}

function parseResult(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if ( data )
	{
		if ( data.prepare != undefined && data.prepare == '0' )
		{
			window.location="../cgi-bin/download?" + $("#logname").val();
		}
		else
		{
			alert("log_download_notexsit".i18n());
		}
	}
	else
	{
		alert("log_download_geterror".i18n());
		
	}
	//$("#download").attr("onclick", action);
}

