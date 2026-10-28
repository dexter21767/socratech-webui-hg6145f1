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

function mainteanance()
{
	var postdata = new Object();
	postdata.action = "accountchange";
	postdata.sessionid = sessionidstr;
	XHR.post("do_moremgt", postdata, reloadData);
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

