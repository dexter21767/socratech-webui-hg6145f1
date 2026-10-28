var sessionidstr = "";
var local_management_data = "";

$(document).ready(function(){
	//customScrollBar("html");
	initPage();
});

function initPage()
{
	showOrHideLoadingWindowFromIframe("show");
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced", fillData);
	}else{
		XHR.get("get_localmanagement", null, fillData);
	}
}


function fillData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	if (data)
	{
		if(data.sessionid != undefined)
		{
			sessionidstr = data.sessionid;
		}
		local_management_data = data;
		displayHtml();
	}
}

function displayHtml()
{
	if(local_management_data.lantelnetValue == "1"){
		$("input[name='lantelnet_enable']:eq(0)").attr("checked", true);
	}else{
		$("input[name='lantelnet_enable']:eq(1)").attr("checked", true);
	}
	if(local_management_data.wantelnetValue == "1"){
		$("input[name='wantelnet_enable']:eq(0)").attr("checked", true);
	}else{
		$("input[name='wantelnet_enable']:eq(1)").attr("checked", true);
	}
	if(local_management_data.lanwebValue == "1"){
		$("input[name='lanweb_enable']:eq(0)").attr("checked", true);
	}else{
		$("input[name='lanweb_enable']:eq(1)").attr("checked", true);
	}
	if(local_management_data.wanwebValue == "1"){
		$("input[name='wanweb_enable']:eq(0)").attr("checked", true);
	}else{
		$("input[name='wanweb_enable']:eq(1)").attr("checked", true);
	}
}

function CancelBtn()
{
	displayHtml();
}

function telnetsaveApply()
{	
	var postdata = new Object();
	postdata.action = "telnet";
	postdata.lantelnetValue = $("input[name='lantelnet_enable']:checked").val();
	postdata.wantelnetValue = $("input[name='wantelnet_enable']:checked").val();
	XHR.post("set_localmanagement", postdata, fillData);
	showOrHideLoadingWindowFromIframe("show");
}

function websaveApply()
{	
	var postdata = new Object();
	postdata.action = "web";
	postdata.lanwebValue = $("input[name='lanweb_enable']:checked").val();
	postdata.wanwebValue = $("input[name='wanweb_enable']:checked").val();
	if($("input[name='lanweb_enable']:checked").val() == "0")
	{
		if(confirm("lan_web_disable_tips".i18n()) == false)
		{
			return;
		}
	}
	XHR.post("set_localmanagement", postdata, fillData);
	showOrHideLoadingWindowFromIframe("show");
}

