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
});

function saveApply()
{
	var postdata = new Object();
	postdata.pausetime = $("#pause_time").val();
	postdata.sessionid = sessionidstr;
	XHR.post("webframeworkpause", postdata, reloadData);
	showOrHideLoadingWindowFromIframe("show");
}

function reloadData()
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe('hide');
}
