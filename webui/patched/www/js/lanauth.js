var sessionidstr = "";
var garea_code;
var oldstartip;
var oldendip;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
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
		XHR.get("get_lanauth_info", null, initPage);
	}
	
});

function initValidate()
{
	$("#lanauth_form").validate({
		debug: true,
		rules: {
			"ip": {required: true, ipv4: true},
			"mask": {required: true, ipv4: true},
			"startip": {required: true, ipv4: true},
			"endip": {required: true, ipv4: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate tr69 ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate tr69 failed.....");
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
		document.getElementById('freetime').style.display = 'none';
		setCheck($("#enable"), getdata.ENABLE);
		$("#ip").val(getdata.IP);
		$("#mask").val(getdata.MASK);
		$("#startip").val(getdata.STARTIP);
		$("#endip").val(getdata.ENDIP);
		$("#lease").val(getdata.LEASE);
		//$("#timeout").val(getdata.TIMEOUT);
		$all_wan_str=getdata.all_wan_str;
		
		if ( garea_code == "Jiangsu" )
		{
			$("#SSID2name").html("SSID2");
			$("#SSID4name").html("aWiFiSSID4");
		}
		else
		{
			$("#SSID2name").html("aWiFiSSID2");
			$("#SSID4name").html("SSID4");
		}	

		setCheck($("#lan1"), getdata.LAN1);
		setCheck($("#lan2"), getdata.LAN2);
		setCheck($("#lan3"), getdata.LAN3);
		setCheck($("#lan4"), getdata.LAN4);
		setCheck($("#wlan1"), getdata.WLAN1);
		setCheck($("#wlan2"), getdata.WLAN2);
		setCheck($("#wlan3"), getdata.WLAN3);
		setCheck($("#wlan4"), getdata.WLAN4);
		
		if ( $("#enable").attr('checked') )
		{
			if ( garea_code == "Jiangsu" )
			{
				$("#lan1").attr("disabled", false);
				$("#lan2").attr("disabled", false);
				$("#lan3").attr("disabled", false);
				$("#lan4").attr("disabled", false);
			}
			else
			{
				$("#lan1").attr("disabled", true);
				$("#lan2").attr("disabled", true);
				$("#lan3").attr("disabled", true);
				$("#lan4").attr("disabled", true);
			}
			$("#wlan2").attr("disabled", true);
		}
		else
		{	
			$("#wlan2").attr("disabled", true);
			if ( garea_code == "Jiangsu" )
			{
				$("#lan1").attr("disabled", true);
				$("#lan2").attr("disabled", true);
				$("#lan3").attr("disabled", true);
				$("#lan4").attr("disabled", true);
			}		
		}
		
		oldstartip = getdata.STARTIP;
		oldendip = getdata.ENDIP;
		if (getdata.wirelessenable == 1 )
		{
			$("#wifiport").show();
		}
		else
		{
			$("#wifiport").hide();
		}
		
		if ( getdata.PORT_NUMBER == 4 )
		{
			$("#port34").show();
		}
		else
		{
			$("#port34").hide();
		}
		
		if (getdata.SSIDEN1 != "1")
		{
			$("#wlan1").attr("disabled", true);
		}
		if (getdata.SSIDEN2 != "1")
		{
			$("#wlan2").attr("disabled", true);
		}
		if (getdata.SSIDEN3 != "1")
		{
			$("#wlan3").attr("disabled", true);
		}
		if (getdata.SSIDEN4 != "1")
		{
			$("#wlan4").attr("disabled", true);
		}

		if ( getdata.all_wan_str.indexOf('dev.eth.1') != -1 )
		{
			$("#lan1").attr("disabled", true);
			$("#lan1").attr("checked", false);
		}
		if ( getdata.all_wan_str.indexOf('dev.eth.2') != -1 )
		{
			$("#lan2").attr("disabled", true);
			$("#lan2").attr("checked", false);
		}
		if ( getdata.all_wan_str.indexOf('dev.eth.3') != -1 )
		{
			$("#lan3").attr("disabled", true);
			$("#lan3").attr("checked", false);
		}	
		if ( getdata.all_wan_str.indexOf('dev.eth.4') != -1 )
		{
			$("#lan4").attr("disabled", true);
			$("#lan4").attr("checked", false);
		}					
	}
}

function enablechange()
{
	if ( $("#enable").attr('checked') )
	{
		if ( $area == "Jiangsu" )
		{
			$("#lan1").attr("disabled", false);
			$("#lan2").attr("disabled", false);
			$("#lan3").attr("disabled", false);
			$("#lan4").attr("disabled", false);	
		}	
		else
		{	
			$("#lan1").attr("checked", true);
			$("#lan2").attr("checked", true);
			$("#lan3").attr("checked", true);
			$("#lan4").attr("checked", true);		
			if ( $area != "Jiangsu" )
			{
				$("#wlan2").attr("checked", true);
			}				
			$("#lan1").attr("disabled", true);
			$("#lan2").attr("disabled", true);
			$("#lan3").attr("disabled", true);
			$("#lan4").attr("disabled", true);
		}
		$("#wlan2").attr("disabled", true);		
	}
	else
	{	
		if ( $area == "Jiangsu" )
		{
			$("#lan1").attr("disabled", true);
			$("#lan2").attr("disabled", true);
			$("#lan3").attr("disabled", true);
			$("#lan4").attr("disabled", true);	
			$("#lan1").attr("checked", false);
			$("#lan2").attr("checked", false);
			$("#lan3").attr("checked", false);
			$("#lan4").attr("checked", false);
		}	
		else
		{		
			//postRegisterResult();
					
			$("#lan4").attr("checked", true);
			if ( $area != "Jiangsu" )
			{
				$("#wlan2").attr("checked", true);
			}
			setCheck($("#lan1"), LAN1);
			setCheck($("#lan2"), LAN2);
			setCheck($("#lan3"), LAN3);
			setCheck($("#wlan1"), WLAN1);
			setCheck($("#wlan3"), WLAN3);
			setCheck($("#wlan4"), WLAN4);
			
			$("#lan1").attr("disabled", false);
			$("#lan2").attr("disabled", false);
			$("#lan3").attr("disabled", false);
			$("#lan4").attr("disabled", false);		
		}		
		
	}
	
	if ( $all_wan_str.indexOf('dev.eth.1') != -1 )
	{
		$("#lan1").attr("disabled", true);
		$("#lan1").attr("checked", false);
	}
	if ( $all_wan_str.indexOf('dev.eth.2') != -1 )
	{
		$("#lan2").attr("disabled", true);
		$("#lan2").attr("checked", false);
	}
	if ( $all_wan_str.indexOf('dev.eth.3') != -1 )
	{
		$("#lan3").attr("disabled", true);
		$("#lan3").attr("checked", false);
	}	
	if ( $all_wan_str.indexOf('dev.eth.4') != -1 )
	{
		$("#lan4").attr("disabled", true);
		$("#lan4").attr("checked", false);
	}	
}

function SaveApply()
{
	/*if( ! $("#lanauth_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}*/

	var postdata = new Object();
	
	if ( $("#enable").attr('checked') )
	{
		postdata.enable = "1";	
	}
	else
	{
		postdata.enable = "0";
	}
	postdata.ip = $("#ip").val();
	postdata.mask = $("#mask").val();
	postdata.startip = $("#startip").val();
	postdata.endip = $("#endip").val();
	postdata.lease = $("#lease").val();
	//postdata.timeout = $("#timeout").val();
	postdata.lan1 = getCheck($("#lan1"));
	postdata.lan2 = getCheck($("#lan2"));
	postdata.lan3 = getCheck($("#lan3"));
	postdata.lan4 = getCheck($("#lan4"));
	postdata.wlan1 = getCheck($("#wlan1"));
	postdata.wlan2 = getCheck($("#wlan2"));
	postdata.wlan3 = getCheck($("#wlan3"));
	postdata.wlan4 = getCheck($("#wlan4")); 	
	postdata.lannum = postdata.wlan4+""+postdata.wlan3+""+postdata.wlan2+""+postdata.wlan1+""+postdata.lan4+""+postdata.lan3+""+postdata.lan2+""+postdata.lan1;
	postdata.lanstr = parseInt(postdata.lannum,2); //转成十进制
	postdata.sessionid = sessionidstr;
	XHR.post("set_lanauth_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function getCheck(ajaxObject)
{
	if(ajaxObject && ajaxObject.attr('checked'))
		return 1;
	else 
		return 0;
	
}

function setCheck(ajaxObject, ischecked)
{
	if(ajaxObject)
	{
		if(ischecked == 1 || ischecked == '1' || true == ischecked || ischecked == 'Enable' || ischecked == 'Enabled')
		{
			ajaxObject.attr('checked', true);
		}
		else
		{
			ajaxObject.attr('checked', false);
		}
	}	
}

