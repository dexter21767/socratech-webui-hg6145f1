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
		XHR.get("get_awifien_info", null, initPage);
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
		if ( getdata.USEWIFI == 0 ) //no ssid available
		{
			$("#usessid").hide();
			$("#nossid").show();
		}
		else
		{
			$("#usessid").show();
			$("#nossid").hide();
			if ( getdata.SSID2EN == 1 )
			{
				$("#aWiFienable").attr("checked", true);
				$("#ssidContent").show();
			}
			else
			{
				$("#aWiFienable").attr("checked", false);
				$("#ssidContent").hide();
			}
			var awifiNAME = getdata.SSIDNAME;
			var awifiNAMEex=awifiNAME.substring(6);
			var awifiNAMEix=awifiNAME.substring(0,6);	
			if (awifiNAMEix == "aWiFi-")
			{
				$("#ssidname").val(awifiNAMEex);
			}
			else
			{
				if (garea_code != "Jiangsu")
				{
					alert("WiFi名称应以aWiFi开头,在aWiFi之后应有连字符“-”");	
				}
				$("#ssidname").val("");
			}
		}
	}
}

function SaveApply()
{
	var ssidname = $("#ssidname").val();
	if ( getCheck($("#aWiFienable")) == 1 && ssidname == "" )
	{
		alert("WiFi名称不能为空");
		return;
	}
	
	/*if( ! $("#lanauth_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}*/
	
	var postdata = new Object();
	if(document.getElementById('aWiFienable').checked == true )
	{
		postdata.enable = 1;
	}
	else
	{
		postdata.enable = 0;
	}	
	//postdata.enable = getCheck($("#aWiFienable"));
	var ssidnamejoin = "aWiFi-" + $("#ssidname").val();
	postdata.ssidname = ssidnamejoin;
	
	postdata.sessionid = sessionidstr;
	XHR.post("set_awifien_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function enChange()
{
	if(document.getElementById('aWiFienable').checked == true )
	{
		$("#ssidContent").show();
	}
	else
	{
		$("#ssidContent").hide();
	}
}

function getCheck(ajaxObject)
{
	if(ajaxObject && ajaxObject.attr('checked'))
		return 1;
	else 
		return 0;
	
}