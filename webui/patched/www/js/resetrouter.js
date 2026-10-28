var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/usb_device", initPage);
	}
	else
	{
		XHR.get("get_usb_device", null, initPage);
	}
});



function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	showOrHideLoadingWindowFromIframe("hide");
	
	setCheckbox("restore_checkbox", getdata.restore);
	
	var usb_device = getdata.usb.split("\n");
	
	var dynamicHTML = '';
	for ( var i=0; i<usb_device.length; i++ )
	{
		if ( undefined != usb_device[i] && '' != usb_device[i] )
		{
			dynamicHTML += '<option value="' + usb_device[i] + '">' + usb_device[i] + '</option>';
		}
	}
	
	$("#usb_device").html(dynamicHTML);
}


function saveApply()
{
	var select_usb = $("#usb_device").val();
	if( undefined == select_usb || '' == select_usb )
	{
		alert("请连接USB设备");
		return;
	}
	
	if (getCheckbox("restore_checkbox") == 1)
	{
		if (confirm("开启快速恢复风险较大，请谨慎操作") == false)
		{
			return;
		}
	}
	
	var postdata = new Object();
	postdata.restore = getCheckbox("restore_checkbox");
	postdata.usb = select_usb;
	postdata.sessionid = sessionidstr;
	XHR.post("usb_backup", postdata, function(returndata){
		showOrHideLoadingWindowFromIframe("hide");
		if ( returndata.ret == 0 )
		{
			alert("备份成功");
		}
		else
		{
			alert("备份失败");
		}
	});
	showOrHideLoadingWindowFromIframe("show");
}

function restore_factory()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容
	window.parent.document.getElementById("pop_window_title").innerHTML = "恢复出厂设置确认";
	window.parent.document.getElementById("pop_window_message").innerHTML = "该操作会导致您的设备恢复到出厂配置，确定要恢复出厂配置吗？";

	//更改确认操作函数
	var eid = parentObj.getElementById("confirm");
	eid.onclick = function(){
		window.parent.document.getElementById("pop_window_title").innerHTML = "恢复出厂配置提醒";
		window.parent.document.getElementById("pop_window_message").innerHTML = "设备正在恢复出厂，此过程持续2分钟左右<br/>请勿断电，请耐心等待";
		$("#pop_window_option", parentObj).hide();
		var postdata = new Object();
		postdata.sessionid = sessionidstr;
		XHR.post("restore_short", postdata, reloadData);
	};
	
	showOrHidePopWindowFromIframe("show");
}

function reloadData(responseData)
{
	if ( responseData.success != "true")
	{
		alert("恢复出厂配置失败！");
	}
	else
	{
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		window.parent.document.getElementById("pop_window_title").innerHTML = "恢复出厂配置提醒";
		window.parent.document.getElementById("pop_window_message").innerHTML = "设备正在恢复出厂，此过程持续2分钟左右<br/>请勿断电，请耐心等待";
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");
		
		//XHR.post("reboot", null, null);
		jumpToLoginPage(true);
	}
}


function webreboot()
{
	cleanPopWindowContentFromIframe();
	var parentObj = window.parent.document;
	//填充内容

	window.parent.document.getElementById("pop_window_title").innerHTML = "重启确认";
	window.parent.document.getElementById("pop_window_message").innerHTML = "确定要重启设备吗？";
	//更改确认操作函数
	var eid = window.parent.document.getElementById("confirm");
	eid.onclick = function(){
		window.parent.document.getElementById("pop_window_title").innerHTML = "重启设备提醒";
		window.parent.document.getElementById("pop_window_message").innerHTML = "设备正在重启，请耐心等待";	
		$("#pop_window_option", parentObj).hide();
		var postdata = new Object();
		postdata.sessionid = sessionidstr;
		XHR.post("reboot", postdata, reloadDataReboot);
	};
	showOrHidePopWindowFromIframe("show");
}

function reloadDataReboot(responseData)
{
	if(responseData.success != "true")
	{
		alert("重启设备失败！");
	}
	else
	{
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		window.parent.document.getElementById("pop_window_title").innerHTML = "重启设备提醒";
		window.parent.document.getElementById("pop_window_message").innerHTML = "设备正在重启，请耐心等待";			
		$("#pop_window_option", parentObj).hide();
		showOrHidePopWindowFromIframe("show");
		
		//XHR.post("reboot", null, null);
		jumpToLoginPage(true);
	}
}




