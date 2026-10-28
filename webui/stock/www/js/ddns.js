var sessionidstr = "";
var all_ddns_info = '';
var selectwan = '';

var splitchar = '_';

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ddns", initPage);
	}
	else
	{
		XHR.get("get_ddns_info", null, initPage);
	}
});

function initValidate()
{
	$("#ddns_form").validate({
		debug: true,
		rules: {
			"ServicePort_text": {required: true, range_int:[1,65535]},
			"DDNSUsername_text": {required: true, nocn: true},
			"DDNSPd": {required: true, nocn: true}
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
		wanParams = getdata.all_wan_str.replace(/NULL/g, '').split('&');
		wanParamNum = parseInt(getdata.wan_param_num);
		wanNum = parseInt(wanParams.length/wanParamNum);
		var count = -1;
		
		document.getElementById("DDNS_select").options.length=1;
		if ( getdata.route_wanname != "UCI_NULL" && getdata.route_wanname != "" )
		{	
			count++;
		}
		if (getdata.all_wan_str != "")
		{	   	
		   if (wanNum >= 1)
		   {
			   addOption(wanParams[wanParamNum*0],wanParams[wanParamNum*0]-1);
		   }
		   if (wanNum >= 2)
		   {
			  addOption(wanParams[wanParamNum*1],wanParams[wanParamNum*1]-1);
		   }		
		   if (wanNum >= 3)
		   {
			  addOption(wanParams[wanParamNum*2],wanParams[wanParamNum*2]-1);
		   }
		   if (wanNum >= 4)
		   {
			  addOption(wanParams[wanParamNum*3],wanParams[wanParamNum*3]-1);
		   }		
		}
		if (getdata.DDNSIDIDX == "")
		{
			$("#DDNS_select")[0].value = 4;		
		}
		else
		{
			$("#DDNS_select")[0].value = getdata.DDNSIDIDX;	
		}
		
		if (-1 != count)
		{
			$("#Btn_Submit_button").attr("disabled", false);
			changeInterface(getdata.DDNSIDIDX);
			$("#DDNS_select").attr("disabled", false);
			$("#DDNSCfgEnabled_Value").attr("disabled", false);
			if ($("#DDNS_select")[0].value == 4)
			{
				$("#Btn_Cancel_button").attr("disabled", true);
			}
			else
			{
				$("#Btn_Cancel_button").attr("disabled", false);
			}		
		}
		else
		{
			$("#Btn_Submit_button").attr("disabled", true);
			$("#Btn_Cancel_button").attr("disabled", true);
			$("#DDNS_select").attr("disabled", true);
			$("#DDNSCfgEnabled_Value").attr("disabled", true);
		}		
	}

	
	enableDDNSCfg();
}

function changeInterface(index)
{
	var checkindex = index;

	if (index != 4)
	{
		for (i = 0; i < wanNum; i++) 
		{	
			if (parseInt(wanParams[wanParamNum*i]-1) == parseInt(checkindex))
			{				
				if (wanParams[wanParamNum*i+1] == "false")
				{			
					$("#DDNSCfgEnabled_Value").attr("checked", false);
				}
				else
				{
					$("#DDNSCfgEnabled_Value").attr("checked", true);
				}
				$("#DDNSProvider_text").val("ORAY");
				$("#ServicePort_text").val(wanParams[wanParamNum*i+5]);
				$("#DDNSUsername_text").val(wanParams[wanParamNum*i+3]);
				$("#DDNSPassword_password").val(wanParams[wanParamNum*i+4]);
				$("#DDNSDomainName_text").val(wanParams[wanParamNum*i+6]);
				$("#DDNSHostName_text").val(wanParams[wanParamNum*i+7]);
						
				if (wanParams[wanParamNum*i+8] == "0")
				{
					$("#DDNSStatus_text").html("正常运行");
				}
				else if (wanParams[wanParamNum*i+8] == "1")
				{
					$("#DDNSStatus_text").html("未启用");
				}		
				else if (wanParams[wanParamNum*i+8] == "2")
				{
					$("#DDNSStatus_text").html("请填写服务端口");
				}		
				else if (wanParams[wanParamNum*i+8] == "3")
				{
					$("#DDNSStatus_text").html("连接DDNS服务商平台失败");
				}
				else if (wanParams[wanParamNum*i+8] == "4")
				{
					$("#DDNSStatus_text").html("DDNS帐号在服务商平台认证失败");
				}
				else if (wanParams[wanParamNum*i+8] == "5")
				{
					$("#DDNSStatus_text").html("请填写DDNS用户名");
				}
				else if (wanParams[wanParamNum*i+8] == "6")
				{
					$("#DDNSStatus_text").html("请填写DDNS密码");
				}
				else if (wanParams[wanParamNum*i+8] == "7")
				{
					$("#DDNSStatus_text").html("请填写DDNS域名");
				}
				else if (wanParams[wanParamNum*i+8] == "8")
				{
					$("#DDNSStatus_text").html("请填写DDNS主机名");
				}
				else if (wanParams[wanParamNum*i+8] == "9")
				{
					$("#DDNSStatus_text").html("其它错误,错误码" + wanParams[wanParamNum*i+10]);
				}		
				else if (wanParams[wanParamNum*i+8] == "10")
				{
					$("#DDNSStatus_text").html("DDNS服务商拒绝服务,错误码" + wanParams[wanParamNum*i+10]);
				}		
				
				$("#DDNSIP_text").val(wanParams[wanParamNum*i+9]);
				//$("#DDNSErrMsg_text").html(wanParams[wanParamNum*i+10]);
			}
		}
	}	
	else
	{	
		$("#DDNSCfgEnabled_Value").attr("checked", false);		
		$("#DDNSProvider_text").val("ORAY");
		$("#ServicePort_text").val("");
		$("#DDNSUsername_text").val("");
		$("#DDNSPassword_password").val("");
		$("#DDNSDomainName_text").val("");
		$("#DDNSHostName_text").val("");
		$("#DDNSStatus_text").html("");	
		$("#DDNSIP_text").html("");		
	}
}

function enableDDNSCfg()
{
	//var enabled = $("#DDNSCfgEnabled_Value").attr("checked");
	
	if(document.getElementById('DDNSCfgEnabled_Value').checked == true )
	{
		$("#ServicePort_text").attr("disabled", false);
		$("#DDNSUsername_text").attr("disabled", false);
		$("#DDNSPassword_password").attr("disabled", false);		
	}
	else
	{
		$("#ServicePort_text").attr("disabled", true);
		$("#DDNSUsername_text").attr("disabled", true);
		$("#DDNSPassword_password").attr("disabled", true);		
	}
	
	//$("#DDNSProvider_text").attr("disabled", !enabled);
	//$("#DDNSWANInterface_select").attr("disabled", !enabled);
	//$("#DDNSDomainName_text").attr("disabled", !enabled);
	//$("#DDNSHostName_text").attr("disabled", !enabled);
}

function addOption(text,value)
{ 
	document.getElementById("DDNS_select").options.add(new Option(text,value));
}

function isValidNumberRange(number, floor, top)
{
	if (!number )
		return false;
		
	if (0 != number % 1)  //20140214 number must be an integer
		return false;
    if (isNaN(number) || number < floor || number > top)
	    return false;
		
	return true;
}

function submitDDNSCfg(a)
{
	/*if( ! $("#ddns_form").valid() && a == 1)
	{
		alert("某些项的值无效，请重新填写");
		return;
	}*/
	if (a == 1)
	{
		if (!isValidNumberRange($('#ServicePort_text').val(), 1, 65535))
		{
			alert("某些项的值无效，请重新填写");
			return;
		}
		if(!/^[a-zA-Z0-9-_]+$/.test($('#DDNSUsername_text').val()))
		{
			alert("某些项的值无效，请重新填写");
			return;
		}	
		if(!/^[a-zA-Z0-9-_]+$/.test($('#DDNSPassword_password').val()))
		{
			alert("某些项的值无效，请重新填写");
			return;
		}		
	}
	
	var postdata = new Object();
	if (a == 2)
	{
		postdata.action = "refresh";	
		postdata.ddnsidIdx = $("#DDNS_select")[0].value;
	}
	else if (a == 3)
	{
		postdata.action = "del";
		postdata.ddnsidIdx = $("#DDNS_select")[0].value;	
	}	
	else
	{
		postdata.action = "edit";
		postdata.ddnsidIdx = $("#DDNS_select")[0].value;
		//if ($("#DDNSCfgEnabled_Value").attr("checked"))
		if(document.getElementById('DDNSCfgEnabled_Value').checked == true )
		{
			postdata.DDNSCfgEnabled = "true";
		}
		else
		{
			postdata.DDNSCfgEnabled = "false";
		}

		postdata.DDNSProvider = $("#DDNSProvider_text").val();
		postdata.ServicePort = $("#ServicePort_text").val();
		postdata.DDNSUsername = $("#DDNSUsername_text").val();
		postdata.DDNSPd = $("#DDNSPassword_password").val();
		postdata.DDNSDomainName = $("#DDNSDomainName_text").val();
		postdata.DDNSHostName = $("#DDNSHostName_text").val();		
	}	
	
	postdata.sessionid = sessionidstr;
	XHR.post("set_ddns_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
	setTimeout(function() {
		showOrHideLoadingWindowFromIframe("hide");
	}, 500);	
}

