var countval = 1;
var all_wan_info;
var	all_wan_info_new = '';
var Interval;
var timeout;
var stopflag = 0;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
    if(operator_name == "MEX_TELMEX"){
        $("#dataSize_dscp").show();
        initValidate_telmex();
        $("#repeatTimeTips").hide();
        $("#repeatTimeTips_telmex").show();
    }else{
        initValidate();
        $("#repeatTimeTips").show();
        $("#repeatTimeTips_telmex").hide();
    }
	$("#pingbtn").val("diagnosis_apply".i18n());
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wan_info", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
		//XHR.get("get_allwan_info", null, initConnectName);
	}
	$("#wan_connect").bind("change", function(){
		var index = $("option:selected").attr("name");
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
	}else{
		$("#ip_version").val("1");
		$("#ip_version").attr("disabled", false);
	}
}

function initValidate()
{
	$("#ping_form").validate({
		debug: true,
		rules: {
			"address": {required: true, nocn: true},
			"wan_connect": {required: true},
			"count": {required: true , range_int:[1,10]}
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
function initValidate_telmex()
{
	$("#ping_form").validate({
		debug: true,
		rules: {
			"address": {required: true, nocn: true},
			"wan_connect": {required: true},
			"count": {required: true , range_int:[1,10000]},
            "data_size": {required: true ,range_int:[32,65535]},
            "dscp": { range_int:[0,63]},
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
	$("#count").val(4);
    $("#data_size").val(56);
    $("#dscp").val(0);
	XHR.get("get_login_user", null, function(data){
		if ( data.sessionid != undefined )
		{
			sessionidstr = data.sessionid;
		}
	});
	
	if ( getdata )
	{
		all_wan_info = getdata;
	}
	
	var wan_num = 0;
	var dynamicHtml = '';
	//var single_wan;
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	dynamicHtml += '<option name ="LAN" value = "InternetGatewayDevice.LANDevice.1."> LAN</iption>';
	if ( wan_num > 0 )
	{
		for ( var i=0; i< wan_num; i++ )
		{
			//alert("0000");
			var single_wan = all_wan_info.wan[i];
			if(single_wan.IPMode == 1 ){
				if ((single_wan.Name.indexOf('_R_') >= 0  || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0)) && (single_wan.ExternalIPAddress != "0.0.0.0"
					&& single_wan.ExternalIPAddress != "255.255.255.255" 
					&& single_wan.ExternalIPAddress != "")  )
				{
					dynamicHtml += '<option  name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
			}else if(single_wan.IPMode == 2){
				if ( (single_wan.Name.indexOf('_R_') >= 0 || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0))  && (
					 single_wan.IPv6IPAddress != "")  )
				{
					dynamicHtml += '<option name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
			}else if(single_wan.IPMode == 3){
				if ( (single_wan.Name.indexOf('_R_') >= 0  || (single_wan.Name.indexOf("aisfibre") >= 0  && single_wan.ConnectionType.indexOf("Routed")>= 0) )&&( (single_wan.ExternalIPAddress != "0.0.0.0"
					&& single_wan.ExternalIPAddress != "255.255.255.255" 
					&& single_wan.ExternalIPAddress != "") || (
					 single_wan.IPv6IPAddress != "" ) )  )
				{
					dynamicHtml += '<option name="'+single_wan.IPMode +'" value="'+single_wan.WAN_url+'">' + single_wan.Name + '</option>';
				}
				
			}
					
		}
	}
	 // fillIPVersion(all_wan_info.wan[0].IPMode);
	$("#wan_connect").html(dynamicHtml);
	
}

function initConnectName(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	all_wan_info_new = getdata;
	if (all_wan_info_new.show_wan)
	{
		selectwan = all_wan_info_new.show_wan;
	}
	
	if (all_wan_info_new != '' && all_wan_info_new.wan)
	{
		wan_num = all_wan_info_new.wan.length;
	}
	if ( wan_num > 0 )
	{
		for (i=0; i < wan_num; i++)
		{
			var single_wan = all_wan_info_new.wan[i];	
			var wan_path = single_wan.WAN_url;
				//alert(single_wan.IPMode);
				dynamicHtml += ' <option name="'+single_wan.IPMode +'" value="'  + wan_path + ' ">' + single_wan.Name + '</option>';		
			
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
	$("#ping_text").html("");
	if( ! $("#ping_form").valid() )
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "invalid_value_alert".i18n() + '', function() { })
        else
			alert("invalid_value_alert".i18n());
		return;
	}
	//
	// if ( false == validateDomain($("#address").val()) && false == validateIP($("#address").val()) && false == validateURL($("#address").val())  )
	// {
	// 	alert("invalid_address_alert".i18n());
	// 	return;
	// }
	if (  false == ischar($("#address").val()))
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "invalid_address_alert".i18n() + '', function() { })
        else
			alert("invalid_address_alert".i18n());
		return;
	}
	
	clearTimeout(timeout);
	clearInterval(Interval);
	
	stopflag = 0;
	var postdata = new Object();
	postdata.address = $("#address").val();
    if($("#count").val() > 10){
        countval = 10;
        postdata.count = 10;
    }else{
        countval = $("#count").val();
        postdata.count = $("#count").val();
    }
	var wan_url = $("#wan_connect").val();
	postdata.WAN_url = wan_url;
	postdata.sessionid = sessionidstr;
	postdata.X_FH_WhoRequest = "web";
	postdata.IPVersion = $("#ip_version").val();
    //墨西哥telmex定制化需求:增加data block size和DSCP值
    if(gOperatorName == "MEX_TELMEX"){
     postdata.dataSize = $("#data_size").val(); 
     postdata.dscp = $("#dscp").val();   
    }
	//alert(JSON.stringify(postdata));
	XHR.post("do_ping", postdata, showPingResult);
}

function returndatafunc(data)
{
	if (data && data.DiagnosticsState != "Requested"){
		stopflag = 1;
		clearTimeout(timeout);
		clearInterval(Interval);
		var dynamicHTML = [];
		dynamicHTML += "SuccessCount".i18n() + " = " + data.SuccessCount + '&#13;&#10;';
		dynamicHTML += "FailureCount".i18n() + " = " + data.FailureCount + '&#13;&#10;';
		dynamicHTML += "AverageResponseTime".i18n() + " = " + data.AverageResponseTime + '&#13;&#10;';
		dynamicHTML += "MinimumResponseTime".i18n() + " = "+ data.MinimumResponseTime + '&#13;&#10;';
		dynamicHTML += "MaximumResponseTime".i18n() + " = " + data.MaximumResponseTime + '&#13;&#10;';

		if(data.DiagnosticsState == "Complete")
		{
			dynamicHTML += "DiagnosticsState".i18n() + " = " + "Complete".i18n() + '&#13;&#10;';
		}
		else if(data.DiagnosticsState == "None")
		{
			dynamicHTML += "DiagnosticsState".i18n() + " = " + "acs_auth_none".i18n() + '&#13;&#10;';
		}
		else if(data.DiagnosticsState == "Requested")
		{
			dynamicHTML += "DiagnosticsState".i18n() + " = " + "Requested".i18n() + '&#13;&#10;';
		}
		else
		{
			dynamicHTML += "DiagnosticsState".i18n() + " = " + "Error_CannotResolveHostName".i18n() + '&#13;&#10;';
		}

		$("#ping_text").html(dynamicHTML);

	}
}
function showPingResult(data)
{
	if (data.pingcmd == "success")
	{
		timeout = setTimeout(function(){
			//alert("1111");
			if (stopflag == 0){
				clearInterval(Interval); 
				
				$("#ping_text").html("ping time out");
			}
		}, countval*20000);
		Interval = setInterval(function(){XHR.get("get_ping_result", null, returndatafunc);}, 2000);
	}
}
