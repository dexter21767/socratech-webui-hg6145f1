var error_hint_start_invalid = "起始地址无效";
var error_hint_end_invalid = "结束地址无效";
var error_hint_start_end = "开始地址应小于结束地址";
var error_hint_range = "不在起始IP和结束IP范围内";
var splitchar = ".";
var old_ip = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	$("input:checkbox").bind("click", function(){
		checkDisableElement();
	});
	
	showOrHideLoadingWindowFromIframe("show");

	$('#LanIP_Address_text').bind('input', function() {
		changeIpHead();
	});
	$('#LanIP_Address_text').bind('propertychange', function() {
		changeIpHead();
	});
	
	//清除错误提示
	$(".main_item_error_hint").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipv4_lan_info", initPage);
	}
	else
	{
		XHR.get("get_ipv4_lan_info", null, initPage);
	}
});

function initValidate()
{
	$("#lan_ipv4_form").validate({
		debug: true,
		rules: {
			"LanIP_Address_text": {required: true, ipv4: true},
			"LanSubmask_text": {required: true, subnetMask: true},
			// "LanStartAddress_text": {required: true, ipv4: true},
			// "LanEndAddress_text": {required: true, ipv4: true},
			"LanDHCP_Submask_text": {required: true, subnetMask: true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate lan ipv4 ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate lan ipv4 failed.....");
			return false;
		}
	}); 
}
function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	if ( getdata != null && getdata.lan_ipv4 )
	{
		var landata = getdata.lan_ipv4;
		$("#LanIP_Address_text").val(landata.IPInterfaceIPAddress);
		old_ip = landata.IPInterfaceIPAddress;
		$("#LanSubmask_text").val(landata.IPInterfaceSubnetMask);
		$("#LanStartAddress_text").val(landata.MinAddress.split(splitchar)[3]);
		$("#LanEndAddress_text").val(landata.MaxAddress.split(splitchar)[3]);
		$("#LanDHCP_Submask_text").val(landata.SubnetMask);
		$("#LanLeaseTime_select").val(landata.DHCPLeaseTime);
		if (landata.DHCPServerEnable == '1')
		{
			$("#Lan_DHCP_checkbox").prop("checked", true);
		}
		else
		{
			$("#Lan_DHCP_checkbox").prop("checked", false);
		}
	}
	checkDisableElement();
	changeIpHead();
}

function saveApply()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! $("#lan_ipv4_form").valid() || ! extraValidCheck())
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var ipArray = $("#LanIP_Address_text").val().split(splitchar);
	var ip_header = ipArray[0] + '.' + ipArray[1] + '.' + ipArray[2] + '.';
	
	var postdata = new Object();
	postdata.IPInterfaceIPAddress = $("#LanIP_Address_text").val();
	postdata.IPInterfaceSubnetMask = $("#LanSubmask_text").val();
	postdata.MinAddress = ip_header + $("#LanStartAddress_text").val();
	postdata.MaxAddress = ip_header + $("#LanEndAddress_text").val();
	postdata.SubnetMask = $("#LanDHCP_Submask_text").val();
	postdata.DHCPLeaseTime = $("#LanLeaseTime_select").val();
	postdata.DHCPServerEnable = $("#Lan_DHCP_checkbox").attr("checked") ? "1" : "0";
	
	if ( $("#LanIP_Address_text").val() !=  old_ip )
	{
		postdata.ipchange = 1;
		
		cleanPopWindowContentFromIframe();
		var parentObj = window.parent.document;
		//填充内容
		$("#pop_window_title", parentObj).html("配置修改确认");
		$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_help"></div>');
		$("#pop_window_message", parentObj).html("您正在修改IP地址，是否确认修改？");
		
		//更改确认操作函数
		var eid = parentObj.getElementById("confirm");
		eid.onclick = function(){
			$("#pop_window_title", parentObj).html("配置修改提醒");
			$("#pop_window_icon", parentObj).html('<div class="pop_window_icon_alert"></div>');
			$("#pop_window_message", parentObj).html("修改成功，请访问修改后的IP地址！");
			$("#pop_window_option", parentObj).hide();
			
			XHR.post("set_ipv4_lan", postdata, null);
			
			jumpToLoginPage(true, $("#LanIP_Address_text").val());
		};
		
		showOrHidePopWindowFromIframe("show");
	}
	else
	{
		postdata.ipchange = 0;
		XHR.post("set_ipv4_lan", postdata, initPage);
		showOrHideLoadingWindowFromIframe("show");
	}
}

function extraValidCheck()
{
	var error_num = 0;
	
	var MinAddress = $("#LanStartAddress_text").val();
	var MaxAddress = $("#LanEndAddress_text").val();
	var SubnetMask = $("#LanDHCP_Submask_text").val();
	
	if ( ! isValidNumberRange(MinAddress, 1, 255) )
	{
		$("#LanStartAddress-error").html("初始IP地址无效");
		error_num ++;
	}
	if ( ! isValidNumberRange(MaxAddress, 1, 255) )
	{
		$("#LanEndAddress-error").html("结束IP地址无效");
		error_num ++;
	}
	
	if ( error_num > 0 )
	{
		return false;
	}
	
	//检查是否是有效的地址范围
	if ( parseInt(MinAddress) > parseInt(MaxAddress) )
	{
		$("#LanStartAddress-error").html("初始IP地址应小于等于结束IP地址");
		error_num ++;
	}
	
	if ( MinAddress == $("#LanIP_Address_text").val().split(splitchar)[3] )
	{
		$("#LanStartAddress-error").html("不能和IP地址相同");
		error_num ++;
	}
	if ( MaxAddress == $("#LanIP_Address_text").val().split(splitchar)[3] )
	{
		$("#LanEndAddress-error").html("不能和IP地址相同");
		error_num ++;
	}

	if ( error_num > 0 )
	{
		return false;
	}
	
	return true;
}

function checkDisableElement()
{
	if  ($("#Lan_DHCP_checkbox").attr("checked"))
	{
		$(".dhcp_set").attr("disabled", false);
	}
	else
	{
		$(".dhcp_set").attr("disabled", true);
	}
}

function changeIpHead()
{
	var lanip = $("#LanIP_Address_text").val();
	if ( isValidIpAddress(lanip) )
	{
		var ipArray = lanip.split('.');
		$(".network_segment").each(function(){
			$(this).html(ipArray[0] + '.' + ipArray[1] + '.' + ipArray[2] + '.');
		});
	}
}
