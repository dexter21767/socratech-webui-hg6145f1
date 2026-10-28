var all_wan_info;
var Interval;
var timeCount = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$("#tracert_btn").val("Start");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
	}
	
	$("#wan_connect").bind("change", function(){
		var index = parseInt($(this).val());
		var IPMode = all_wan_info.wan[index].IPMode;
		fillIPVersion(IPMode);
	});
});

function fillIPVersion (IPMode)
{
	if (IPMode == "1"){
		$("#ip_version").val("1");
		$("#ip_version").attr("disabled", true);
		
	}else if(IPMode == "2"){
		$("#ip_version").val("2");
		$("#ip_version").attr("disabled", true);
	}else if(IPMode == "3"){
		$("#ip_version").val("1");
		$("#ip_version").attr("disabled", false);
	}
}


function initValidate()
{
	$("#traceroute_form").validate({
		debug: true,
		rules: {
			"address": {required: true, nocn: true},
			"wan_connect": {required: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate loid failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
	if(operator_name == "TH_AIS")
	{
		$("#address").val("ais.co.th");
	}

	if ( getdata )
	{
		all_wan_info = getdata;
	}
	
	var wan_num = 0;
	var dynamicHtml = '';

	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( var i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];
			if(single_wan.ConnectionType.indexOf("Bridged") == -1) {
				dynamicHtml += '<option value="'+i+'">' + single_wan.Name + '</option>';
			}
		}
	}
	$("#wan_connect").html(dynamicHtml);
	$("#wan_connect").change();
}

function isValidURL(ipAddress)
{
    var urlPat=/(?:(?:http[s]?|ftp):\/\/)?[^\/\.]+?\.[^\.\\\/]+?\.\w{2,}$/i;
    var matchArray=ipAddress.match(urlPat);
    if( matchArray != null )
    {
        return true;
    } 
    else 
    {
        return false;
    } 
}
function ischar(ipAddress)
{

	var reg = /^[\w-.:\/]+$/; //number letter _ -.:/
	if (!reg.test(ipAddress))
	{
	 return false; 
	}
	else
	{
		 return true;
	}
	
}

function saveApply()
{
	show_shadow();
	$("#tracert_text").html("");
	if( ! $("#traceroute_form").valid() )
	{
		alert("invalid_value_alert".i18n());
		return;
	}
	
	if ( false == ischar($("#address").val()))
	{
		alert("invalid_address_alert".i18n());
		return;
	}
	
	var index = parseInt($("#wan_connect").val());
	var waninfo = all_wan_info.wan[index];
	var postdata = new Object();
	postdata.Interface = waninfo.WAN_url;
	postdata.HostName = $("#address").val();
	postdata.DNSServer = waninfo.DNSServers.split(",")[0] || '';
	postdata.IPVersion = $("#ip_version").val();
	XHR.post("do_dns_lookup", postdata, showPingResult);
}

function showPingResult(data)
{
	if (data.dns_lookup_cmd == "success")
	{
		$("#tracert_text").html("Please wait a moment.");
		$("#tracert_btn").attr("disabled", true);
		timeCount = 0;
		setTimeout(function(){
			getResult();
		}, 3000);
	}else{
		var dynamicHTML = '';
		var Status = "Error_DNSServerNotAvailable";
		var AnswerType = "";
		var HostNameReturned = "";
		var IPAddresses = "";
		var DNSServerIP = "";
		var ResponseTime = 0;
		dynamicHTML += "Status = " + Status + '&#13;&#10;';
		dynamicHTML += "AnswerType = " + AnswerType + '&#13;&#10;';
		dynamicHTML += "HostNameReturned = " + HostNameReturned + '&#13;&#10;';
		dynamicHTML += "IPAddresses = " + IPAddresses + '&#13;&#10;';
		dynamicHTML += "DNSServerIP = " + DNSServerIP + '&#13;&#10;';
		dynamicHTML += "ResponseTime = " + ResponseTime + '&#13;&#10;';
		$("#tracert_text").html(dynamicHTML);
	}
}

function getResult() {
	XHR.get("get_dns_lookup_result", null, returndatafunc)
}

function returndatafunc(data)
{	
	var dynamicHTML = '';
	var Status = "Error_DNSServerNotAvailable";
	var AnswerType = "";
	var HostNameReturned = "";
	var IPAddresses = "";
	var DNSServerIP = "";
	var ResponseTime = 0;
	if(timeCount > 20) {
		dynamicHTML += "Status = " + Status + '&#13;&#10;';
		dynamicHTML += "AnswerType = " + AnswerType + '&#13;&#10;';
		dynamicHTML += "HostNameReturned = " + HostNameReturned + '&#13;&#10;';
		dynamicHTML += "IPAddresses = " + IPAddresses + '&#13;&#10;';
		dynamicHTML += "DNSServerIP = " + DNSServerIP + '&#13;&#10;';
		dynamicHTML += "ResponseTime = " + ResponseTime + '&#13;&#10;';
		$("#tracert_text").html(dynamicHTML);
		$("#tracert_btn").attr("disabled", false);
		return;
	}
	if (data && data.ret == 0)
	{
		if(data.DiagnosticsState != "Requested")
		{
			var result = data.result;
			for(var i=0; i<result.length; i++) {
				if(result[i].Status == "Success") {
					Status = result[i].Status;
					AnswerType = result[i].AnswerType;
					HostNameReturned = result[i].HostNameReturned;
					IPAddresses = result[i].IPAddresses;
					DNSServerIP = result[i].DNSServerIP;
					ResponseTime = result[i].ResponseTime;
					break;
				}
			} 
			dynamicHTML += "Status = " + Status + '&#13;&#10;';
			dynamicHTML += "AnswerType = " + AnswerType + '&#13;&#10;';
			dynamicHTML += "HostNameReturned = " + HostNameReturned + '&#13;&#10;';
			dynamicHTML += "IPAddresses = " + IPAddresses + '&#13;&#10;';
			dynamicHTML += "DNSServerIP = " + DNSServerIP + '&#13;&#10;';
			dynamicHTML += "ResponseTime = " + ResponseTime + '&#13;&#10;';
			$("#tracert_text").html(dynamicHTML);
			$("#tracert_btn").attr("disabled", false);
		}else{
			timeCount++;
			setTimeout(function(){
				getResult();
			}, 3000);
		}
	}else{
		dynamicHTML += "Status = " + Status + '&#13;&#10;';
		dynamicHTML += "AnswerType = " + AnswerType + '&#13;&#10;';
		dynamicHTML += "HostNameReturned = " + HostNameReturned + '&#13;&#10;';
		dynamicHTML += "IPAddresses = " + IPAddresses + '&#13;&#10;';
		dynamicHTML += "DNSServerIP = " + DNSServerIP + '&#13;&#10;';
		dynamicHTML += "ResponseTime = " + ResponseTime + '&#13;&#10;';
		$("#tracert_text").html(dynamicHTML);
		$("#tracert_btn").attr("disabled", false);
	}
}