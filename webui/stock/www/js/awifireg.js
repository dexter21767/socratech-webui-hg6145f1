var sessionidstr = "";
var garea_code;
var url;
var MAC;
var DEVICESN;

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
		var hasInternet = false;
		MAC = getdata.MAC;
		DEVICESN = getdata.DEVICESN;
		
		if ( getdata.route_wanname != "UCI_NULL" && getdata.route_wanname != "" )
		{
			hasInternet = true;
		}
		if ( ! hasInternet )
		{
			$("#SaveApply_button").attr('disabled', true);
		}
		else
		{
			$("#SaveApply_button").attr('disabled', false);
		}
		
		if ( hasInternet )
		{
			$("#awifiHint").hide();
		}
		else
		{
			$("#awifiHint").show();
		}
			
		$("#SaveApply_button").attr('value', '启用个性化站点');
		
	}
}

function SaveApply()
{	
	//if (garea_code == "Jiangsu")
		url = "http://iportal.awifi.cn/shopunion/awifi/bss/TYregshop.api?mac=" + MAC +  "&sn=" + DEVICESN + "";
	/*else
	{	
		url = "http://" + getdata.SERVER +  ":" + getdata.PORT + "/" + getdata.URL +  ".htm?gw_mac=" + getdata.MAC + "&gw_address=" + getdata.IP + "&gw_port=" + getdata.GWPORT + "&gw_id=" + getdata.HOSTNAME  + "&ver=" + getdata.VER + "";
	}*/		
	window.location = url;
}
