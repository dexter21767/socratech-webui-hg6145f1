var gHash;
var isIE7 = false;
var lastSubMenuName, lastSubSecondMenuName, lastSubThirdMenuName;
var lastMainMenuName;
var gLastOperateTime; //记录上一次有效操作的时间，用来完成一段时间无操作自动退出功能
var gSessionMaxTime = 300; //default 300s
var sessionidstr = "";
var area_code = "";
var awifi_switch = "";
var awifi_type = "";
var gClean_timeOut = "";
var mainMenuJsonObject,subMenuJsonObject;
var operator_name;
var login_user = '1'; //use admin as default

$(document).ready(function(){
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
	}
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/web_config", parseWebConfig);
	}
	else
	{
		XHR.get("get_web_config", null, parseWebConfig);
	}
	clearTimeout(gClean_timeOut);
	gClean_timeOut = setTimeout("checkSessionTimeout();", 15000);
	gLastOperateTime = new Date().getTime();
});

function parseWebConfig(data)
{
	if ( data )
	{
		sessionidstr = data.sessionid;
		if ( data.SessionMaxTime != undefined )
		{
			gSessionMaxTime = data.SessionMaxTime;
		}
	}
}

function parseLoginUser(data)
{
	if ( data )
	{
		sessionidstr = data.sessionid;
		login_user = data.login_user;
	}
}

function realLogout()
{
	var postdata = new Object();
	var user = '';
	if ( login_user == 4 ) //fiberuser
	{
		user = "fiber";
	}
	else if ( login_user == 2 ) //admin user
	{
		user = "admin";
	}
	else //default as common user
	{
		user = "common";
	}
	postdata.sessionid = sessionidstr;
	postdata.username = user;
	XHR.post("do_logout", postdata, function(data){
		window.parent.location = "../../normal";
	});
}

function checkSessionTimeout()
{
	var currentTime = new Date().getTime();
	if ( parseInt(currentTime) - parseInt(gLastOperateTime) >= parseInt(gSessionMaxTime) * 1000 ) //无操作自动退出时间，默认5分钟
	{
		alert("Time Out, Please Login again!");
		realLogout();
		
	}
	else
	{
		clearTimeout(gClean_timeOut);
		gClean_timeOut = setTimeout("checkSessionTimeout();", 15000);
	}
}