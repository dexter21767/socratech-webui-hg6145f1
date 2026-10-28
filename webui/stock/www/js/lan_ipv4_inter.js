var g_landata;
var sessionidstr;
var g_lanIPv6data;
var g_ModelName;
var operator_name = gOperatorName;
var login_user = gLoginUser;
var bindListLanHead = "dev.eth.";
var bindListWifiHead = "dev.wla.";
var portbind_num;
var lanportbind_num;
var portbind_num1;
var lanportbind_num1;
var g_ModelName = gModelName
var g_option60_exist;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	//TH_AIS/ROM_RCSRDS/MAGYAR_4IG
	if((operator_name == "TH_AIS" &&  login_user == 0 ) || (operator_name == "ROM_RCSRDS" && login_user == 0)
		|| (operator_name == "MAGYAR_4IG" && login_user == 0))
		{
			$("#lan_ipv6_cfg").hide();
		}
	
	//ROM_RCSRDS/MAGYAR_4IG
	if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG"){
		$("#option43_div").show();
		$("#option_43_enable").bind("change", function(){
			var sel = $(this).val();
			option43TypeSwitch(sel);
		});
	}
	if(operator_name == "TH_AIS")
	{
		$("#domain_name").show();
		$("#ModelName").html(g_ModelName);
		$("#DHCPv6dis_div").show();
		$("#RAdis_div").show();
		$("#lan_isloation_div").show();
	}
	var dhcp_typeoption = '<option value="1">'+"dhcp_typeS".i18n()+'</option><option value="0">'+"ipv6_disable_tip".i18n()+'</option>';
	$("#dhcp_typesel").html(dhcp_typeoption);

	$("#dhcp_typesel").bind("change", function(){
		var sel = $(this).val();
		checkDHCPdivElement(sel);
	});

	$("#dns_source_sel").bind("change", function(){
		var sel = $(this).val();
		if (sel == "Static"){
			$("#static_dns_div").show();
		}else{
			$("#static_dns_div").hide();
		}
	});

	$("#Prefix_Mode_sel").bind("change", function(){
		var sel = $(this).val();
		if (sel == "Static"){
			$("#Prefix_Set_div").show();
			if(operator_name == "CHL_GTD")
			{
				$("#IPv6Prefix_div").show();
			}			
		}else{
			$("#Prefix_Set_div").hide();
			if(operator_name == "CHL_GTD")
			{
				$("#IPv6Prefix_div").hide();
			}			
		}
	});

	$("#Enable_dhcpv6").bind("change", function(){
		if ($("#Enable_dhcpv6").prop("checked")){
			$("#v6dhcpstart").attr("disabled", false);
			$("#v6dhcpend").attr("disabled", false);
		}else{
			$("#v6dhcpstart").attr("disabled", true);
			$("#v6dhcpend").attr("disabled", true);
		}
	});
	
	//ROM_RCSRDS/MAGYAR_4IG
	if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG"){
		$("#option60_enable_div").show();
		$("#option_60_enable").bind("change", function(){
		var sel = $(this).val();
		if (sel == "1"){
			$("#option60_div").show();
		}else{
			$("#option60_div").hide();
		}
	  });
	}
	$("#second_ip_enable").bind("change", function(){
		if ($("#second_ip_enable").prop("checked")){
			$("#second_ip").attr("disabled", false);
		}else{
			$("#second_ip").attr("disabled", true);
		}
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
    
    if(gOperatorName == "ECU_CNT"){
        $("#dhcpRelay_option125").show();
    }
    
	if(operator_name == "FTTR_MAIN_SFU_COMMON" || operator_name == "FTTR_SUB_COMMON")
	{
		$("#dhcp_timeTips").html("( 1 min - 168 hours )")
	}

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipv4_lan_info", initPage);
	}
	else
	{
		XHR.get("get_ipv4_lan_info", null, initPage);
		XHR.get("get_ipv6_lan", null, initIPv6Page);
	}
	portbind_num = $("input[name='portbind']").length;
	lanportbind_num = $(".lanport").length;

	portbind_num1 = $("input[name='portbind1']").length;
	lanportbind_num1 = $(".lanport1").length;

	if(operator_name == "FTTR_SUB_COMMON")
	{
		$("#div_dhcp_serviceHead").css("display", "none");
		$("#div_dhcp_typeTitle").css("display", "none");
		$("#DHCP_div").css("display", "none");
	}

	if(operator_name == "ES_DIGI")
		$("#ipv6_enable_div").show();
	
});

function initValidate()
{
	var range;
	var max_hour;
	if(operator_name == "FTTR_MAIN_SFU_COMMON" || operator_name == "FTTR_SUB_COMMON"){
		range = [0,168];
		max_hour = 3;
	}else{
		range = [0,99];
		max_hour = 2;
	}
	$("#lan_ipv4_form").validate({
		debug: true,
		rules: {
			"LanIP_Address_text": {required: true, ipv4: true},
			"LanSubmask_text": {required: true, subnetMask: true},
			"LanStartAddress_text": {required: true, ipv4: true},
			"LanEndAddress_text": {required: true, ipv4: true},
			"LanDHCP_Submask_text": {required: true, subnetMask: true},
			"priDnsAddress_text": {required: true, ipv4: true},
			"secDnsAddress_text": {ipv4: true},
			"gateway_text": {required: true, ipv4: true},
			"dhcp_hour_text": {required: true, maxlength: max_hour ,range_int:range},
			"dhcp_min_text": {required: true,  maxlength: 2  ,range_int:[0,59]},
			"ipv6_static_addr": {required: true, ipv6_mask:[0,128]},
			"first_dns": {required: true, ipv6:true},
			"sec_dns": {required: true, ipv6:true},
			"v6dhcpstart": {required: true, ipv6_suffix:true},
			"v6dhcpend": {required: true, ipv6_suffix:true}, //isValidIPv6AddressRange
			"ValidLifeTime": {required: true, range_int:[1,4294967295]},
			"LinkMTU": {required: true},
			"PreferredLifeTime": {required: true, range_int:[1,4294967295]},
			"Prefix_Set": {required: true}, //isValidIPv6AddressRange ipv6prefix
			"max_Interval": {required: true, range_int:[4,1800]},
			"min_Interval": {required: true, range_int:[3,1350]}, //max bigger than min
			"vendor_specific_infor": {required: true, rangelength:[1,189]},
			"option60Start":{required: true, ipv4: true},
			"option60End":{required: true, ipv4: true},
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



function initIPv6Page(getdata)
{
	if ( getdata != null && getdata.lan_ipv6 )
	{
		g_lanIPv6data = getdata.lan_ipv6;
		displayIPv6Html();
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

function displayIPv6Html()
{
	var ipv6_static_addr = g_lanIPv6data.ipv6localaddress;
	$("#ipv6_static_addr").val(ipv6_static_addr);
	if(operator_name == "BZ_INTELBRAS")
	{
		$("#ipv6_global_addr_div").show();
		$("#ipv6_global_addr").val(g_lanIPv6data.ipv6globaladdress);
	}	
	$("#max_Interval").val(g_lanIPv6data.RAMaxRtrAdvInterval);
	$("#min_Interval").val(g_lanIPv6data.RAMinRtrAdvInterval);
	setCheckbox("Managed_Flag", g_lanIPv6data.RAAdvManagedFlag);
	setCheckbox("other_Flag", g_lanIPv6data.RAAdvOtherConfigFlag);
	setCheckbox("ipv6_eanble", g_lanIPv6data.IPv6ConfigEnable);
	$("#dns_source_sel").val(g_lanIPv6data.IPv6DNSConfigType);
	
	//智利MP版本增加Prefix Valid LifeTime和Prefix Preferred LifeTime功能
	if (g_lanIPv6data.IPv6DNSConfigType == "Static"){
		$("#static_dns_div").show();
	}else{
		$("#static_dns_div").hide();
	}
	if (g_lanIPv6data.IPv6DNSServers.indexOf(",") > 0){
		$("#first_dns").val(g_lanIPv6data.IPv6DNSServers.split(",")[0]);
		$("#sec_dns").val(g_lanIPv6data.IPv6DNSServers.split(",")[1]);
	}else{
		$("#first_dns").val(g_lanIPv6data.IPv6DNSServers);
		$("#sec_dns").val("");
	}

	$("#Prefix_Mode_sel").val(g_lanIPv6data.PIMODE);
	if (g_lanIPv6data.PIMODE == "Static"){
		$("#Prefix_Set_div").show();
		if(operator_name == "CHL_GTD")
		{
			$("#IPv6Prefix_div").show();
		}		
	}else{
		$("#Prefix_Set_div").hide();
		if(operator_name == "CHL_GTD")
		{
			$("#IPv6Prefix_div").hide();
		}			
	}
	$("#Prefix_Set").val(g_lanIPv6data.PIPrefix);
	//智利MP版本增加IPv6 Autonomous Flag和Link MTU功能
	if(operator_name == "CHL_GTD")
	{
		$("#LinkMTU_div").show();	
		setCheckbox("AutonomousFlag", g_lanIPv6data.AutonomousFlag);
		$("#LinkMTU").val(g_lanIPv6data.LinkMTU);	
		$("#ValidLifeTime").val(g_lanIPv6data.PIValidLifeTime);
		$("#PreferredLifeTime").val(g_lanIPv6data.PIPreferredLifeTime);		
	}

	if(operator_name == "BZ_VERO")
	{
		$("#LinkMTU_div").show();	
		$("#LinkMTU").val(g_lanIPv6data.LinkMTU);	
	}
	setCheckbox("Enable_dhcpv6", g_lanIPv6data.DHCPv6ServerEnable);
	if (g_lanIPv6data.DHCPv6ServerEnable == 1){
		$("#v6dhcpstart").attr("disabled", false);
		$("#v6dhcpend").attr("disabled", false);
	}else{
		$("#v6dhcpstart").attr("disabled", true);
		$("#v6dhcpend").attr("disabled", true);
	}

	$("#v6dhcpstart").val(g_lanIPv6data.DHCPv6ServerMinAddress);
	$("#v6dhcpend").val(g_lanIPv6data.DHCPv6ServerMaxAddress);
	//TH_AIS DHCPv6 Disable
	if(operator_name == "TH_AIS")
	{
		var bindlist = g_lanIPv6data.DHCPv6Forbid;
		if ( bindlist != '' )
		{
			var bindlist_array = bindlist.split(',');
			for(var i=0; i < bindlist_array.length; i++)
			{
				var singlebind = bindlist_array[i];
				//fiberlog('singlebind is ' + singlebind);
				if ( singlebind.indexOf(bindListLanHead) >= 0 )
				{
					var singleport = singlebind.split('.')[2]; //dev.eth.1-4
					var elementIndex = singleport - 1;
					$("input[name='portbind']:eq(" + elementIndex + ")").prop("checked", true);
				}
				if ( singlebind.indexOf(bindListWifiHead) >= 0 )
				{
					var singleport = singlebind.split('.')[2]; //dev.wla.1-4
					var elementIndex = singleport - 1;
					$("input[name='portbind']").each(function (i){
						if ($(this).val() == elementIndex)
						{
							$(this).prop("checked", true);
						}
					});
				}
			}
		}
		
		var bindlist1= g_lanIPv6data.RaForbid;
		if ( bindlist1!= '' )
		{
			var bindlist1_array = bindlist1.split(',');
			for(var i=0; i < bindlist1_array.length; i++)
			{
				var singlebind = bindlist1_array[i];
				//fiberlog('singlebind is ' + singlebind);
				if ( singlebind.indexOf(bindListLanHead) >= 0 )
				{
					var singleport = singlebind.split('.')[2]; //dev.eth.1-4
					var elementIndex = singleport - 1;
					$("input[name='portbind1']:eq(" + elementIndex + ")").prop("checked", true);
				}
				if ( singlebind.indexOf(bindListWifiHead) >= 0 )
				{
					var singleport = singlebind.split('.')[2]; //dev.wla.1-4
					var elementIndex = singleport - 1;
					$("input[name='portbind1']").each(function (i){
						if ($(this).val() == elementIndex)
						{
							$(this).prop("checked", true);
						}
					});
				}
			}
		}
	}
}

function displayIPv4Html()
{
	if(operator_name == "BZ_TIM")
	{
		$("#DIV_HostName").css("display", "");
	}
	$("#HostName_text").val(g_landata.DomainName);
	$("#LanIP_Address_text").val(g_landata.IPInterfaceIPAddress);
	$("#LanSubmask_text").val(g_landata.IPInterfaceSubnetMask);
	if(operator_name == "TH_AIS")
	{
		if (g_landata.lan_isolation == "0")
		{
			$("input[name='lan_isolation']:last").attr('checked', 'checked');
		}
		else
		{
			$("input[name='lan_isolation']:first").attr('checked', 'checked');
		}
	}

	$("#dhcp_typesel").val(g_landata.DHCPServerEnable);
	if  (g_landata.DHCPServerEnable == "1")
	{
		if(operator_name == "FTTR_SUB_COMMON")
		{
			$("#DHCP_div").css("display", "none");
		}
		else
		{
			$("#DHCP_div").css("display", "");
		}
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
	setCheckbox("second_ip_enable", g_landata.second_ip_enable);
	$("#second_ip").val(g_landata.second_ip);
	if(gOperatorName == "COL_CLARO"){
		$("#div_second_ip_enable").css("display", "");
		$("#div_second_ip").css("display", "");
		$("#second_ip_enable").change();
	}
    if(gOperatorName == "ECU_CNT"){
    	setCheckbox("enable_dhcprelay", g_landata.DHCPRelay);
        setCheckbox("option125", g_landata.X_FH_OPTION125Enable);
    }
    
	//ROM_RCSRDS/MAGYAR_4IG
    if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG")
	{
		var b = new Base64();
		$("#option_43_enable").val(g_landata.X_FH_DhcpdOption43Enable);
		option43TypeSwitch(g_landata.X_FH_DhcpdOption43Enable);

		if(g_landata.X_FH_DhcpdOption43Enable == "1")
		{
			$("#vendor_specific_infor").val(b.decode(g_landata.X_FH_DhcpdOption43));
		}
		
		if(g_landata.Option60Enable != "1")
		{
			$("#option_60_enable").val("0");
		}
		else
		{
			$("#option_60_enable").val("1");
		}
		if(g_landata.Option60Enable == ""){
			g_option60_exist = 0;
		}else{
			g_option60_exist = 1;
		}
		$("#option_60_enable").change();
		$("#option60Start").val(g_landata.Option60Start);
		$("#option60End").val(g_landata.Option60End);
	}
    
}

function extraValidCheck()
{	
	var dhcp_start = $("#LanStartAddress_text").val();
	var dhcp_end = $("#LanEndAddress_text").val();
	var dhcp_submask = $("#LanDHCP_Submask_text").val();
	var dhcp_gateway = $("#gateway_text").val();
	if(!is_same_network_segment(dhcp_start, dhcp_gateway, dhcp_submask)){
		if(gNewUiFlag)
		{
		myAlert('Tip', '' + "dhcp_start_seg_alert".i18n() + '', function() { })
		}else
		{
			alert("dhcp_start_seg_alert".i18n());
		}
		return false;
	}
	if(!is_same_network_segment(dhcp_end, dhcp_gateway, dhcp_submask)){
		if(gNewUiFlag)
		{
		myAlert('Tip', '' + "dhcp_end_seg_alert".i18n() + '', function() { })
		}else{
			alert("dhcp_end_seg_alert".i18n());
		}
		return false;
	}
	if(compareIP(dhcp_end, dhcp_start) == -1){
		if(gNewUiFlag)
		{
		myAlert('Tip', '' + "dhcp_start_end_alert".i18n() + '', function() { })
		}else{
			alert("dhcp_start_end_alert".i18n());
		}
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
	if(gOperatorName=="COL_CLARO" && $("#second_ip_enable").prop("checked")){
		if ($("#LanIP_Address_text").val() == $("#second_ip").val())
		{
			$("#SecAddress-error").html("lan_ip_illegal_alert".i18n());
			return false;
		}
	}
	
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
	displayIPv6Html();
}

function saveApply()
{
	show_shadow();
	if(gOperatorName=="COL_CLARO" && $("#second_ip_enable").prop("checked")){
		$("#second_ip").rules("add",{required: true, ipv4: true});
	}
	if ( ! $("#lan_ipv4_form").valid() )
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "value_illegal".i18n() + '', function() { })
        else
			alert("value_illegal".i18n());
		return;
	}
	
	/*add begin by lihj,20210108,reason:the last value of ip address can't be 0 or 255*/
	//lan_ip
	if(!check_ip_last_value($("#LanIP_Address_text").val()))
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "dhcp_ip_illegal".i18n() + '', function() { })
        else
			alert("dhcp_ip_illegal".i18n());
		return;
	}	
	
	if( !ipcheck() ) // 额外校验，如要需要再打开
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
		 	alert("illegal_value_alert".i18n());
	    return;
	 }
	
	if ($("#dhcp_typesel").val() == "1")
	{
		// 额外校验 DHCP开始地址、结束地址必须和网关在同一网段，且开始地址必须小于结束地址
		if( !extraValidCheck() ) 
		{
			// if (gNewUiFlag)
            // 	myAlert('Tip', '' + "value_illegal".i18n() + '', function() { })
        	// else
			// 	alert("value_illegal".i18n());
			return;
		}
		
		//check ip address last value is 0 or 255
		if( !ValidIPAddrCheck() ) 
		{
			if (gNewUiFlag)
            	myAlert('Tip', '' + "dhcp_ip_illegal".i18n() + '', function() { })
        	else
				alert("dhcp_ip_illegal".i18n());
			return;
		}
	}
	
	var errdex = 0;

	if ( parseInt($("#max_Interval").val()) < parseInt($("#min_Interval").val()) )
	{
		$("#RA-error").html("min_time_erroe".i18n());
		errdex++;
	}else{
		$("#RA-error").empty();
	}
	
	if(operator_name == "CHL_GTD")
	{
		var linkmtu = $("#LinkMTU").val();

		if((linkmtu != 0) && (!valid_Range_Int(linkmtu, 1280, 1500)))
		{
			alert("value_illegal".i18n());
			$("#Link_MTU-error").html("link_mtu_error".i18n());
			errdex++;
			return;			
		}
		else
		{
			$("#Link_MTU-error").empty();
		}
			
		if ($("#Prefix_Mode_sel").val() == "Static")
		{	
			if ( parseInt($("#ValidLifeTime").val()) < parseInt($("#PreferredLifeTime").val()) )
			{
				alert("value_illegal".i18n());
				$("#prefixLifeTime-error").html("min_Lifetime_error".i18n());
				errdex++;
				return;	
			}else{
				$("#prefixLifeTime-error").empty();
			}
		}
		
	}
	if(operator_name == "BZ_VERO")
	{
		var linkmtu = $("#LinkMTU").val();
		if((linkmtu != 0) && (!valid_Range_Int(linkmtu, 1280, 1500)))
		{
			alert("value_illegal".i18n());
			$("#Link_MTU-error").html("link_mtu_error".i18n());
			errdex++;
			return;			
		}
		else
		{
			$("#Link_MTU-error").empty();
		}
	}
	
	if ( $("#Prefix_Set").is(":visible") && ! isValidIpv6PrefixAddress($("#Prefix_Set").val()) )
	{
		$("#prefix-error").html("invalid_prefix_error".i18n());
		errdex++;
	}else{
		$("#prefix-error").empty();
	}

	if ( $("#v6dhcpend").is(":visible"))
	{
		var sip = $("#v6dhcpstart").val();
		var eip = $("#v6dhcpend").val();
		var addrFieldNum = 4;
		if(!isValidIPv6AddrOfPool(sip, addrFieldNum) || !isValidIPv6AddrOfPool(eip, addrFieldNum))
		{
			$("#v6dhcpend-error").html("ip_pool_error".i18n());
			errdex++;
		}
		else if(!isValidIPv6AddrPoolRange(sip, eip, addrFieldNum))
		{
			$("#v6dhcpend-error").html("end_address_error".i18n());
			errdex++;
		}
	}else{
		$("#v6dhcpend-error").empty();
	}
	if (errdex > 0){
		if (gNewUiFlag)
            myAlert('Tip', '' + "value_illegal".i18n() + '', function() { })
        else
			alert("value_illegal".i18n());
		return;
	}
	
	var postdata = new Object();
	if(operator_name == "BZ_TIM")
	{
		postdata.DomainName = $("#HostName_text").val();
	}
	postdata.IPInterfaceIPAddress = $("#LanIP_Address_text").val();
	postdata.IPInterfaceSubnetMask = $("#LanSubmask_text").val();

	if(operator_name == "TH_AIS")
	{
		postdata.LANIsolation = $("input[name='lan_isolation']:checked").val();
	}
	postdata.DHCPServerEnable = $("#dhcp_typesel").val();
	if(gOperatorName == "COL_CLARO"){
		postdata.second_ip_enable = getCheckbox("second_ip_enable");
		if(getCheckbox("second_ip_enable")){
			postdata.second_ip = $("#second_ip").val();
		}
	}
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
		var legaltime;

		if(operator_name == "FTTR_MAIN_SFU_COMMON" || operator_name == "FTTR_SUB_COMMON")
			legaltime = 604800;
		else
			legaltime = 356400;
		
		if (DHCPLeaseTimeval > legaltime) //99 hour
		{
			if (gNewUiFlag)
            	myAlert('Tip', '' + "DHCP_Lease_Time_is_illegal".i18n() + '', function() { })
        	else
			alert("DHCP_Lease_Time_is_illegal".i18n());
			return;
		}
		if( ($("#dhcp_hour_text").val() == "0" || $("#dhcp_hour_text").val() == "00") 
        && ($("#dhcp_min_text").val() == "0" || $("#dhcp_min_text").val() == "00")){
			if (gNewUiFlag)
				myAlert('Tip', '' + "DHCP_Lease_Time_is_illegal".i18n() + '', function() { })
			else
			alert("DHCP_Lease_Time_is_illegal".i18n());
			return ;
		}
		postdata.DHCPLeaseTime = DHCPLeaseTimeval;
        if(gOperatorName == "ECU_CNT"){
            postdata.DHCPRelay = getCheckbox("enable_dhcprelay");
            postdata.Option125 = getCheckbox("option125");
        }
	}
	
	/*add by zhangbin,20211102,romnia option43 value should be Base64 encoded */
	//ROM_RCSRDS/MAGYAR_4IG
	if(operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG")
	{
		var b = new Base64();
		postdata.X_FH_DhcpdOption43Enable = $("#option_43_enable").val();
		if($("#option_43_enable").val() == "1")
		{
			postdata.X_FH_DhcpdOption43 =b.encode($("#vendor_specific_infor").val());
		}
		
		postdata.Option60Enable = $("#option_60_enable").val();
		if($("#option_60_enable").val() == "1")
		{
			postdata.Option60Start = $("#option60Start").val();
			postdata.Option60End = $("#option60End").val();
		}
		if(g_option60_exist == 1 && $("#option_60_enable").val() == "1")
		{
			postdata.action = "modify";
		}
		else if(g_option60_exist == 0 && $("#option_60_enable").val() == "1")
		{
			postdata.action = "add";
		}
		else 
		{
			postdata.action = "delete";
		}
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
		
	var postdata2 = new Object();
	if(operator_name == "ES_DIGI")
		postdata2.IPv6ConfigEnable = getCheckbox("ipv6_eanble");
	
	postdata2.ipv6localaddress = $("#ipv6_static_addr").val();
	if(operator_name == "TH_AIS")
	{
		postdata2.DHCPv6Forbid = calcBindList();
		postdata2.RaForbid = calcBindList1();
	}
	postdata2.RAAdvManagedFlag = getCheckbox("Managed_Flag");
	postdata2.RAAdvOtherConfigFlag = getCheckbox("other_Flag");
	
	if(operator_name == "CHL_GTD" || operator_name == "BZ_VERO")
	{
		postdata2.LinkMTU = $("#LinkMTU").val();
	}	

	postdata2.RAMaxRtrAdvInterval = $("#max_Interval").val();
	postdata2.RAMinRtrAdvInterval = $("#min_Interval").val();

	postdata2.IPv6DNSConfigType = $("#dns_source_sel").val();
	if ($("#dns_source_sel").val() == "Static"){
		postdata2.IPv6DNSServers = $("#first_dns").val() + "," + $("#sec_dns").val();
	}

	//智利MP版本增加IPv6 Autonomous Flag和Link MTU功能
	postdata2.PIMODE = $("#Prefix_Mode_sel").val();
	if ($("#Prefix_Mode_sel").val() == "Static")
	{
		postdata2.PIPrefix = $("#Prefix_Set").val();
		if(operator_name == "CHL_GTD")
		{
			postdata2.AutonomousFlag = getCheckbox("AutonomousFlag");
			postdata2.PIValidLifeTime = $("#ValidLifeTime").val();
			postdata2.PIPreferredLifeTime = $("#PreferredLifeTime").val();
		}
	}

	postdata2.DHCPv6ServerEnable = getCheckbox("Enable_dhcpv6");
	if (getCheckbox("Enable_dhcpv6") == "1"){
		postdata2.DHCPv6ServerMinAddress = $("#v6dhcpstart").val();
		postdata2.DHCPv6ServerMaxAddress = $("#v6dhcpend").val();
	}
    
    if(operator_name != "EG_TELECOM" && operator_name != "ECU_CNT")
    {
    if (gNewUiFlag)
		myAlert('Tip', '' + "rebootAlert".i18n() + '', function() { })
	else
       alert("rebootAlert".i18n()); 
    }
	XHR.post("set_ipv4_lan", postdata, initPage);
	setTimeout(function(){
	XHR.post("set_ipv6_lan", postdata2, initIPv6Page);
	},1000)
    if(operator_name == "EG_TELECOM"){
        if(confirm("rebootAlert_ED".i18n()))
        {
           XHR.get("get_login_user", null, function(getdata){
           	if ( getdata.sessionid != undefined )
           	{
           		sessionidstr = getdata.sessionid;
           		var postdata = new Object();
           		postdata.sessionid = sessionidstr;
           		XHR.post("set_onu_reboot", postdata, reloadData);
           	}
           });
        }
    }
}
function reloadData()
{
    
}

function checkDHCPdivElement(sel)
{
	if  (sel == "1")
	{
		if(operator_name == "FTTR_SUB_COMMON")
		{
			$("#DHCP_div").css("display", "none");
		}
		else
		{
			$("#DHCP_div").css("display", "");
		}
	}
	else
	{
		$("#DHCP_div").css("display", "none");
	}
}
function calcBindList()
{
	var bindlist = '';
	if ( $("#DHCPv6dis_div").is(":visible") )
	{
		for ( var i=0; i<portbind_num; i++ )
		{
			var bindstr = '';
			var portnumber = '';
			if ( $("input[name='portbind']:eq(" + i + ")").attr('checked') )
			{
				if ( i < lanportbind_num )
				{
					portnumber = i + 1;
					bindstr = bindListLanHead + portnumber;
				}
				else
				{
					portnumber = $("input[name='portbind']:eq(" + i + ")").attr('value');
					portnumber = parseInt(portnumber) + 1;
					bindstr = bindListWifiHead + portnumber;
				}
			}
			
			if ( bindstr != '' )
			{
				if ( bindlist == '' )
				{
					bindlist = bindstr;
				}
				else
				{
					bindlist += ',' + bindstr;
				}
			}
		}
	}
	
	return bindlist;
}

function calcBindList1()
{
	var bindlist1 = '';
	if ( $("#RAdis_div").is(":visible") )
	{
		for ( var i=0; i<portbind_num1; i++ )
		{
			var bindstr = '';
			var portnumber = '';
			if ( $("input[name='portbind1']:eq(" + i + ")").attr('checked') )
			{
				if ( i < lanportbind_num1 )
				{
					portnumber = i + 1;
					bindstr = bindListLanHead + portnumber;
				}
				else
				{
					portnumber = $("input[name='portbind']:eq(" + i + ")").attr('value');
					portnumber = parseInt(portnumber) + 1;
					bindstr = bindListWifiHead + portnumber;
				}
			}
			
			if ( bindstr != '' )
			{
				if ( bindlist1 == '' )
				{
					bindlist1 = bindstr;
				}
				else
				{
					bindlist1 += ',' + bindstr;
				}
			}
		}
	}
	
	return bindlist1;
}

function option43TypeSwitch(sel)
{
	if  (sel == "1")
	{
		$("#vendor_div").css("display", "");
	}
	else
	{
		$("#vendor_div").css("display", "none");
	}
}
