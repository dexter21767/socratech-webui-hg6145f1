var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_app", initPage);
	}
	else
	{
		XHR.get("get_qos_app", null, initPage);
	}
});

var addindex = '';
var qos_app_num = 4;
var queue_num = 8;

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
	var dynamicHTML = '';
	var dynamicHTMLQUEUE = '';
	
	if (getdata && getdata.qos)
	{
		addindex = '';
		qosdata = getdata.qos;
		
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				dynamicHTMLQUEUE += '<option value="'+ eval(i) +'">Q'+ eval(i) +'</option>';
			}
		}
		$("#ClassQueue").html(dynamicHTMLQUEUE);
		
		for (var i=1; i<=qos_app_num; i++ )
		{
			if ( eval("qosdata.AppName" + i) != '' && eval("qosdata.AppName" + i) != undefined && eval("qosdata.ClassQueue" + i) != '' && eval("qosdata.ClassQueue" + i) != undefined)
			{
				dynamicHTML += '<tr>';
				dynamicHTML += '<td>' + eval("qosdata.AppName" + i) + '</td>';
				dynamicHTML += '<td>Q' + eval("qosdata.ClassQueue" + i) + '</td>';
				dynamicHTML += '<td><input type="button" class="input_button input_button_heightwidth_unset" value="Delete" onclick=deleteApp(' + i + ') /></td>';
				dynamicHTML += '</tr>';
			}
			else
			{
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
	}
	$("#apps").html(dynamicHTML);
	
	displayControl();
}

function displayControl()
{
	if ( addindex == '' )
	{
		$("#adddiv").hide();
	}
	else
	{
		$("#adddiv").show();
	}
}

function deleteApp(index)
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = index;
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_app", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
	
}
function addApp()
{
	var postdata = new Object();
	getAddindex();
	postdata.action = "add";
	postdata.index = addindex;
	postdata.AppName = $("#AppName").val();
	postdata.ClassQueue = $("#ClassQueue").val();
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_app", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
	alert("addAPP_alert".i18n());
}

function getAddindex()
{
	var appName = $("#AppName").val();
	for (var i=1; i<=qos_app_num; i++ )
	{
       if(eval("qosdata.AppName" + i) == appName)
       {
       	  addindex = i;
       	  break;
       }
	}
}