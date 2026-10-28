var g_landata;
var sessionidstr;
var g_lanIPv6data;
var g_ModelName;
var operator_name = gOperatorName;
var login_user = gLoginUser;
var bindListLanHead = "dev.eth.";
var bindListWifiHead = "dev.wla.";


$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	var dhcp_typeoption = '<option value="1">'+"dhcp_typeS".i18n()+'</option><option value="0">'+"ipv6_disable_tip".i18n()+'</option>';
	$("#dhcp_typesel").html(dhcp_typeoption);

	$("#dhcp_typesel").bind("change", function(){
		var sel = $(this).val();
		checkDHCPdivElement(sel);
	});

	$(".changetxt").keyup(function(){
		
		var thisval = $(this).val();
		var thisvalArr = thisval.split(".");
		if (thisvalArr.length == 4 && thisvalArr[0] != "" && thisvalArr[1] != "" && thisvalArr[2] != "" && thisvalArr[3] != "")
		{
			var ipaddBefore = thisvalArr[0] + "." + thisvalArr[1] + "." + thisvalArr[2] + ".";

			var LanIP_Address_text = $("#LanIP_Address_text").val();
			if (LanIP_Address_text != ""){
				$("#LanIP_Address_text").val(ipaddBefore+LanIP_Address_text.split(".")[3]);
			}
			var LanStartAddress_text = $("#LanStartAddress_text").val();
			if (LanStartAddress_text != ""){
				
				$("#LanStartAddress_text").val(ipaddBefore+LanStartAddress_text.split(".")[3]);
			}
			var LanEndAddress_text = $("#LanEndAddress_text").val();
			if (LanEndAddress_text != ""){
				$("#LanEndAddress_text").val(ipaddBefore+LanEndAddress_text.split(".")[3]);
			}
			var priDnsAddress_text = $("#priDnsAddress_text").val();
			if (priDnsAddress_text != ""){
				$("#priDnsAddress_text").val(LanIP_Address_text);
			}
			var secDnsAddress_text = $("#secDnsAddress_text").val();
			if (secDnsAddress_text != ""){
				$("#secDnsAddress_text").val(ipaddBefore+secDnsAddress_text.split(".")[3]);
			}
			var gateway_text = $("#gateway_text").val();
			if (gateway_text != ""){
				$("#gateway_text").val(LanIP_Address_text);
			}
		}
	});
    
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipv4_lan_info", initPage);
	}
	else
	{
		XHR.get("get_ipv4_lan_info", null, initPage);
		XHR.get("get_base_info", null, modelName);
	}
});

function initValidate()
{
	$("#lan_ipv4_form").validate({
		debug: true,
		rules: {
			"LanIP_Address_text": {required: true, ipv4: true},
			"LanSubmask_text": {required: true, subnetMask: true},
			"LanStartAddress_text": {required: true, ipv4: true},
			"LanEndAddress_text": {required: true, ipv4: true},
			"LanDHCP_Submask_text": {required: true, subnetMask: true},
			"priDnsAddress_text": {required: true, ipv4: true},
			"gateway_text": {required: true, ipv4: true},
			"dhcp_hour_text": {required: true, maxlength: 2  ,range_int:[0,99]},
			"dhcp_min_text": {required: true,  maxlength: 2  ,range_int:[0,59]}
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

function modelName(getdata)
{
	if ( getdata != null && getdata.ModelName )
	{
		 g_ModelName= getdata.ModelName;
		
		 $("#ModelName").html(g_ModelName);
			 
	}
}

function initPage(getdata)
{
	if ( getdata != null && getdata.lan_ipv4 )
	{
		g_landata = getdata.lan_ipv4;
		displayIPv4Html();
	}
}

function displayIPv4Html()
{
	$("#LanIP_Address_text").val(g_landata.IPInterfaceIPAddress);
	$("#LanSubmask_text").val(g_landata.IPInterfaceSubnetMask);

	if (g_landata.lan_isolation == "0")
	{
		$("input[name='lan_isolation']:last").attr('checked', 'checked');
	}
	else
	{
		$("input[name='lan_isolation']:first").attr('checked', 'checked');
	}

	$("#dhcp_typesel").val(g_landata.DHCPServerEnable);
	if  (g_landata.DHCPServerEnable == "1")
	{
		$("#DHCP_div").css("display", "");
	}
	else
	{
		$("#DHCP_div").css("display", "none");
	}
	$("#LanStartAddress_text").val(g_landata.MinAddress);
	$("#LanEndAddress_text").val(g_landata.MaxAddress);
	$("#LanDHCP_Submask_text").val(g_landata.SubnetMask);
	if (g_landata.DNSServers.indexOf(",") > 0)
	{
		$("#priDnsAddress_text").val(g_landata.DNSServers.split(",")[0]);
		$("#secDnsAddress_text").val(g_landata.DNSServers.split(",")[1]);
	}
	else
	{
		$("#priDnsAddress_text").val(g_landata.DNSServers);
		$("#secDnsAddress_text").val("");
	}
	
	$("#gateway_text").val(g_landata.IPRouters);
	var hour = Math.floor(g_landata.DHCPLeaseTime/3600);
	var min = parseInt((g_landata.DHCPLeaseTime%3600)/60);
	$("#dhcp_hour_text").val(hour);
	$("#dhcp_min_text").val(min);
    
}

function extraValidCheck()
{	
	var dhcp_start = $("#LanStartAddress_text").val();
	var dhcp_end = $("#LanEndAddress_text").val();
	var dhcp_submask = $("#LanDHCP_Submask_text").val();
	var dhcp_gateway = $("#gateway_text").val();
	if(!is_same_network_segment(dhcp_start, dhcp_gateway, dhcp_submask)){
		$("#LanStartAddress-error").html("dhcp_start_seg_alert".i18n());
		return false;
	}
	if(!is_same_network_segment(dhcp_end, dhcp_gateway, dhcp_submask)){
		$("#LanEndAddress-error").html("dhcp_end_seg_alert".i18n());
		return false;
	}
	if(compareIP(dhcp_end, dhcp_start) == -1){
		$("#LanEndAddress-error").html("dhcp_start_end_alert".i18n());
		return false;
	}
	return true;
}


function ValidIPAddrCheck()
{	
	var dhcp_start = $("#LanStartAddress_text").val();
	var dhcp_end = $("#LanEndAddress_text").val();
	var dhcp_gateway = $("#gateway_text").val();
	var priDns = $("#priDnsAddress_text").val();
	var secDns = $("#secDnsAddress_text").val();
	
	//DHCP Start IP
	if(!check_ip_last_value(dhcp_start))
	{
		return false;
	}

	//DHCP End IP
	if(!check_ip_last_value(dhcp_end))
	{
		return false;
	}

	//DHCP Primary DNS
	if(!check_ip_last_value(priDns))
	{
		return false;
	}

	//DHCP Secondary DNS
	if(!check_ip_last_value(secDns))
	{
		return false;
	}

	//DHCP Default Gateway 	
	if(!check_ip_last_value(dhcp_gateway))
	{
		return false;
	}
	return true;
}
function ipcheck()
{
	if ($("#LanIP_Address_text").val() == $("#LanStartAddress_text").val())
	{
	    $("#LanStartAddress-error").html("lan_ip_illegal_alert".i18n());
	    return false;
	}
	if($("#LanIP_Address_text").val() == $("#LanEndAddress_text").val())
	{
		$("#LanEndAddress-error").html("lan_ip_illegal_alert".i18n());
		return false;
	}
	
	return true;
}


function CancelBtn()
{
	displayIPv4Html();
}

function saveApply()
{
	show_shadow();
	if ( ! $("#lan_ipv4_form").valid() )
	{
		alert("value_illegal".i18n());
		return;
	}
	
	/*add begin by lihj,20210108,reason:the last value of ip address can't be 0 or 255*/
	//lan_ip
	if(!check_ip_last_value($("#LanIP_Address_text").val()))
	{
		alert("dhcp_ip_illegal".i18n());
		return;
	}	
	
	if( !ipcheck() ) // 额外校验，如要需要再打开
	{
		 alert("illegal_value_alert".i18n());
	    return;
	 }
	
	if ($("#dhcp_typesel").val() == "1")
	{
		// 额外校验 DHCP开始地址、结束地址必须和网关在同一网段，且开始地址必须小于结束地址
		if( !extraValidCheck() ) 
		{
			alert("value_illegal".i18n());
			return;
		}
		
		//check ip address last value is 0 or 255
		if( !ValidIPAddrCheck() ) 
		{
			alert("dhcp_ip_illegal".i18n());
			return;
		}
	}
	
	var postdata = new Object();
	postdata.IPInterfaceIPAddress = $("#LanIP_Address_text").val();
	postdata.IPInterfaceSubnetMask = $("#LanSubmask_text").val();

	postdata.LANIsolation = $("input[name='lan_isolation']:checked").val();
	postdata.DHCPServerEnable = $("#dhcp_typesel").val();
	if ($("#dhcp_typesel").val() == "1")
	{
		postdata.MinAddress = $("#LanStartAddress_text").val();

		postdata.MaxAddress = $("#LanEndAddress_text").val();
		postdata.SubnetMask = $("#LanDHCP_Submask_text").val();
		var priDns = $("#priDnsAddress_text").val();
		var secDns = $("#secDnsAddress_text").val();
		if (secDns != ""){
			postdata.DNSServers = priDns + "," + secDns;
		}else{
			postdata.DNSServers = priDns;
		}
		postdata.IPRouters = $("#gateway_text").val();
		var dhcp_hour = $("#dhcp_hour_text").val();
		var dhcp_min = $("#dhcp_min_text").val();
		var DHCPLeaseTimeval = dhcp_hour*3600 + dhcp_min*60;
		if (DHCPLeaseTimeval > 356400) //99 hour
		{
			alert("DHCP_Lease_Time_is_illegal".i18n());
			return;
		}
		if( ($("#dhcp_hour_text").val() == "0" || $("#dhcp_hour_text").val() == "00") 
        && ($("#dhcp_min_text").val() == "0" || $("#dhcp_min_text").val() == "00")){
			alert("DHCP_Lease_Time_is_illegal".i18n());
			return ;
		}
		postdata.DHCPLeaseTime = DHCPLeaseTimeval;
	}
	
	var postdata3 = new Object();
	if($("#LanIP_Address_text").val() == priDns)
	{
		postdata3.X_FH_DNSManualEnable = 0;
		XHR.post("set_DNS_agent", postdata3, initPage);//设置X_FH_DNSRelay节点为0，启动ipv4 DNS代理模式
	}
	else
	{
		postdata3.X_FH_DNSManualEnable = 1;
		//alert(postdata3.X_FH_DNSRelay);
		XHR.post("set_DNS_agent", postdata3, initPage);
	}
	alert("rebootAlert".i18n());
	XHR.post("set_ipv4_lan", postdata, initPage);
}

function checkDHCPdivElement(sel)
{
	if  (sel == "1")
	{
		$("#DHCP_div").css("display", "");
	}
	else
	{
		$("#DHCP_div").css("display", "none");
	}
}

