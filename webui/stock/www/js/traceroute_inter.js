var all_wan_info;
var Interval;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$("#tracert_btn").val("diagnosis_apply".i18n());
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
	}
	
	$("#wan_connect").bind("change", function(){
		var index = $("option:selected").attr("name");
		//alert(index);
		fillIPVersion(index);
	});
});

function fillIPVersion (index)
{
	if (index == "1"){
		$("#ip_version").val("1");
		$("#ip_version").attr("disabled", true);
		
	}else if(index == "2"){
		$("#ip_version").val("2");
		$("#ip_version").attr("disabled", true);
	}else if(index == "3"){
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
			//alert("0000");
			var single_wan = all_wan_info.wan[i];
			if(single_wan.IPMode == 1 ){
				if ((single_wan.Name.indexOf('_R_') >= 0 || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0)) && (single_wan.ExternalIPAddress != "0.0.0.0"
					&& single_wan.ExternalIPAddress != "255.255.255.255" 
					&& single_wan.ExternalIPAddress != "")  )
				{
					dynamicHtml += '<option  name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
			}else if(single_wan.IPMode == 2){
				if ((single_wan.Name.indexOf('_R_') >= 0 || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0)) && (
					 single_wan.IPv6IPAddress != ""))
				{
					dynamicHtml += '<option name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
			}else if(single_wan.IPMode == 3){
				if ((single_wan.Name.indexOf('_R_') >= 0 || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0)) && ( (single_wan.ExternalIPAddress != "0.0.0.0"
					&& single_wan.ExternalIPAddress != "255.255.255.255" 
					&& single_wan.ExternalIPAddress != "") || (
					 single_wan.IPv6IPAddress != "" ) )  )
				{
					dynamicHtml += '<option name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
				
			}
			
		}
	}
	$("#wan_connect").html(dynamicHtml);
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
		if (gNewUiFlag)
            myAlert('Tip', '' + "invalid_value_alert".i18n() + '', function() { })
        else
			alert("invalid_value_alert".i18n());
		return;
	}
	
	// if ( false == validateDomain($("#address").val()) && false == validateIP($("#address").val()) && false == validateURL($("#address").val())    )
	// {
	// 	alert("invalid_address_alert".i18n());
	// 	return;
	// }
	
	
	if ( false == ischar($("#address").val()))
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "invalid_address_alert".i18n() + '', function() { })
        else
			alert("invalid_address_alert".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.address = $("#address").val();
	// var wan_index = $("#wan_connect").val();
	// postdata.WAN_url = all_wan_info.wan[wan_index].WAN_url;
	postdata.X_FH_WhoRequest = "web";
	postdata.IPVersion = $("#ip_version").val();
	var wan_url = $("#wan_connect").val();
	postdata.WAN_url = wan_url;
	XHR.post("do_traceroute", postdata, showPingResult);
}

function showPingResult(data)
{
	
	if (data.traceroutecmd == "success")
	{
		setTimeout(function(){clearInterval(Interval); }, 130000);
		Interval = setInterval(function(){XHR.get("get_traceroute_result", null, returndatafunc);}, 2000);
	}
}

function returndatafunc(data)
{	
	var dynamicHTML = [];
	
	
	if (data)
	{
		
		if(data.DiagnosticsState == "Requested")
		{
		
			for (var i=1; i<=data.Resultcount; i++)
			{
				dynamicHTML += eval("data.DiagnosticsResult" + i) + '&#13;&#10;';
			}
			dynamicHTML += "DiagnosticsState : Requested";
		}else if(data.DiagnosticsState == "Complete")
		{
		
			clearInterval(Interval);
			for (var i=1; i<=data.Resultcount; i++)
				{
					dynamicHTML += eval("data.DiagnosticsResult" + i) + '&#13;&#10;';
				}
			dynamicHTML += "DiagnosticsState : Complete";
		}
		else if(data.DiagnosticsState == "Error_CannotResolveHostName")
		{	
			
			clearInterval(Interval);
			dynamicHTML += "DiagnosticsState : Error_CannotResolveHostName";
		}else if(data.DiagnosticsState == "Error_MaxHopCountExceeded")
		{
			clearInterval(Interval);
			for (var i=1; i<=data.Resultcount; i++)
				{
					dynamicHTML += eval("data.DiagnosticsResult" + i) + '&#13;&#10;';
				}
			dynamicHTML += "DiagnosticsState : Error_MaxHopCountExceeded";
		}
		$("#tracert_text").html(dynamicHTML);
	}
}