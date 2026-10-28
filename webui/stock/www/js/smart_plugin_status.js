var splitString = "&";
var login_user = '1'; //use admin as default
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/login_user", parseLoginUser);
		getDataByAjax("../fake/smart_plugin_status", parseGetData);
	}
	else
	{
		XHR.get("get_login_user", null, parseLoginUser);
		getdata();
	}
});

function parseLoginUser(data)
{
	if ( data )
	{
		login_user = data.login_user;
		if ( login_user == 1 )
		{
			$("#b1").text("在本页面上，您可以查看当前安装的所有插件名称及运行状态和插件配置下发状态.");
			document.getElementById("log").style.display = '';
			document.getElementById("b2").style.display = '';
		}
	}
}

function getdata()
{
	$.ajax({
		url: "../cgi-bin/get_smart_plugin_status.cgi",
		method: "GET",
		dataType: 'json',
		cache: false,
		async: false,
		success: function(data){
			parseGetData(data);
		}
	});
}

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	var statusHTML = '';
	if ( data && data.PlugNum != undefined && data.PlugNum >= 1 )
	{
		var nameArray = data.PlugNameStr.split(splitString);
		var versionArray = data.PlugVersionStr.split(splitString);
		var statusArray = data.PlugStatusStr.split(splitString);
		
		statusHTML = "<tr><td width='70%'>插件名称</td><td width='15%'>版本</td><td width='15%'>状态</td></tr>";
		for (var i=0; i<data.PlugNum; i++ )
		{
			statusHTML += "<tr>";
			statusHTML += "<td>" + nameArray[i] + "</td>";
			statusHTML += "<td>" + versionArray[i] + "</td>";
			if ( statusArray[i] !="" && statusArray[i] == 0 )
			{
				statusHTML += "<td>停止</td>";
			}
			else
			{
				statusHTML += "<td>运行</td>";
			}
			statusHTML += "</tr>";
		}
	}
	else
	{
		statusHTML = "<tr><td>暂无已安装插件</td></tr>"
	}
	$("#status").html(statusHTML);
	
	var logHTML = '';
	if ( data && data.PlugLogStr != undefined && data.PlugLogStr != "" )
	{
		var logArray = data.PlugLogStr.split(splitString);
		logHTML = "<tr><td width='50%'>时间</td><td width='50%'>操作</td></tr>";
		for (var i=0; i<logArray.length; i++ )
		{
			if ( logArray !=undefined && logArray[i] != "" )
			{
				var singleLog = logArray[i].replace(/ {1,}/g, " ").split(" ");
				logHTML += "<tr>";
				logHTML += "<td>" + singleLog[0] + " " + singleLog[1] + "</td>";
				logHTML += "<td>" + singleLog[2] + "</td>";
				logHTML += "</tr>";
			}
		}
	}
	else
	{
		logHTML = "<tr><td>暂无插件配置下发状态</td></tr>"
	}
	$("#log").html(logHTML);
	
	setTimeout("getdata()", 5000);
}
