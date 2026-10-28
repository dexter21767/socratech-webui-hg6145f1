var sessionidstr = "";
var garea_code;
var user;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	$("select").bind("change", function(){
		displayControl();
	});
	
	showOrHideLoadingWindowFromIframe("show");

	XHR.get("get_factory_mode", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
		if ( getdata.area_code != undefined )
		{
			garea_code = getdata.area_code;
		}
	});	
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/tr69_info", initPage);
	}
	else
	{
		XHR.get("get_wifidog_info", null, initPage);
	}
	
});

function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata)
	{		
		if (garea_code == "Jiangsu")
		{
			document.getElementById('Reg_server').style.display = "none";
			document.getElementById('Reg_port').style.display = "none";
			$("#authserver").val(getdata.AUTHSERVER);
			$("#authport").val(getdata.AUTHPORT);	
			$("#authpath").val(getdata.AUTHPATH);	
			$("#portalserver").val(getdata.PORTALSERVER);
			$("#portalport").val(getdata.PORTALPORT);
			$("#portalpath").val(getdata.PORTALPATH);		
		}
		else if (garea_code == "Guangdong")
		{
			document.getElementById('Reg_server').style.display = "none";
			document.getElementById('Reg_port').style.display = "none";
			document.getElementById('Portal_server').style.display = "none";
			document.getElementById('Portal_port').style.display = "none";	
			document.getElementById('Portal_path').style.display = "none";	
			$("#authserver").val(getdata.AUTHSERVER);
			$("#authport").val(getdata.AUTHPORT);	
			$("#authpath").val(getdata.AUTHPATH);			
		}
		else
		{
			document.getElementById('Auth_path').style.display = "none";
			document.getElementById('Portal_path').style.display = "none";
			$("#server").val(getdata.SERVER);
			$("#port").val(getdata.PORT);		
			$("#authserver").val(getdata.AUTHSERVER);
			$("#authport").val(getdata.AUTHPORT);
			$("#portalserver").val(getdata.PORTALSERVER);
			$("#portalport").val(getdata.PORTALPORT);	
		}		
	}
}

function SaveApply()
{	
	/*if( ! $("#lanauth_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}*/
	
	var postdata = new Object();

	if (garea_code == "Jiangsu")
	{
		postdata.authserver = $("#authserver").val();
		postdata.authport = $("#authport").val();
		postdata.authpath = $("#authpath").val();
		postdata.portalserver = $("#portalserver").val();
		postdata.portalport = $("#portalport").val();
		postdata.portalpath = $("#portalpath").val();	
	}
	else if (garea_code == "Guangdong")
	{	
		postdata.authserver = $("#authserver").val();
		postdata.authport = $("#authport").val();
		postdata.authpath = $("#authpath").val();	
	}
	else
	{
		postdata.server = $("#server").val();
		postdata.port = $("#port").val();	
		postdata.authserver = $("#authserver").val();
		postdata.authport = $("#authport").val();
		postdata.portalserver = $("#portalserver").val();
		postdata.portalport = $("#portalport").val();
	}
	
	postdata.sessionid = sessionidstr;
	XHR.post("set_wifidog_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}
