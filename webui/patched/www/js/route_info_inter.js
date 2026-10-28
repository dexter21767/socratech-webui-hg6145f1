$(document).ready(function(){
	//优化滚动条，无需改动
	// //customScrollBar("html");
	 showLog();
});

function parseDate(data)
{
	loadLog(data);
}

function showLog()
{
	XHR.get("get_route_info", null, parseDate);
}

function loadLog(data)
{
	var dynamicHTML = "";
	
	for( var i=1; i<=data.logcount; i++ )
	{
		dynamicHTML +=  eval("data.log" + i) + '&#13;&#10;';
	}
	
	$("#logtable").html(dynamicHTML);
}