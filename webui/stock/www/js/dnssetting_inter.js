var sessionidstr = "";
var selectwan = '';
var g_data;
var	all_wan_info = '';
var operator_name = gOperatorName;
var login_user = gLoginUser;
var lanip;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	initValidate();
	if(operator_name == "TH_AIS" ){
		//$("#dns_resource option[value=1]").hide();
		//$("#dns_resource option[value=3]").html("Relay");
		
		$("#dns_resource").find("option").remove();
		$("#dns_resource").append("<option value='0'>Proxy</option>"); 
		$("#dns_resource").append("<option value='3'>Relay</option>");
		$("#dns_resource").append("<option value='2'>Static</option>");
	}
	else
	{
		$("#dns_resource").find("option").remove();
		$("#dns_resource").append("<option value='1'>Relay</option>"); 
		$("#dns_resource").append("<option value='0'>Proxy</option>"); 
		$("#dns_resource").append("<option value='3'>Forward</option>");
		$("#dns_resource").append("<option value='2'>Static</option>");
	}
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/upnp", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initConnectName);
        XHR.get("get_dns_info", null, initPage);
        XHR.get("get_ipv4_lan_info", null, lanip );
	}
		//IsChecked();
	$("#dns_resource").bind("change", function()
    {
        if($("#dns_resource").val() == "3")
        {	if(operator_name == "TH_AIS")
        	{
				$("#wanname").hide();
			}else{
	            $("#wanname").show();
			}
	        $("#dhcp_dns").hide();
				
        }else if($("#dns_resource").val() == "2"){
            $("#wanname").hide();
            $("#dhcp_dns").show();
        }else if($("#dns_resource").val() == "0" || $("#dns_resource").val() == "1"){
            $("#wanname").hide();
            $("#dhcp_dns").hide();
        }
    })
	
function initConnectName(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	all_wan_info = getdata;
	if ( all_wan_info.show_wan )
	{
		selectwan = all_wan_info.show_wan;
	}
			
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];	
			var wan_path = single_wan.WAN_url;
			if(operator_name == "TH_AIS" && single_wan.ServiceList.indexOf("INTERNET") >= 0 && single_wan.ConnectionType.indexOf("Routed")>= 0)
			{
				dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
			}
			else if(single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1)
			{
				dynamicHtml += ' <option name= "dns_select" value="' + wan_path + '">' + single_wan.Name + '</option>';		
			}
			
		}
	}
	$("#wan_name").html(dynamicHtml);
	
	XHR.get("get_dns_info", null, initPage);
}

});

function lanip(getdata)
{
	lanip = getdata.lan_ipv4.IPInterfaceIPAddress;
}

function initValidate()
{	
	$("#dnssetting_form").validate({
		debug: true,
		rules: 
        {
            "primary_dns": {required: true,ipv4: true},
            "secondary_dns": {ipv4: true},
            "wan_name":{required: true}
        },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate dmz host ip ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate dmz host ip failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
    $("#dns_resource").val(getdata.dns_info.X_FH_DNSMode);
    $("#primary_dns").val("");
    $("#secondary_dns").val(""); 
    if($("#dns_resource").val() == "2")
    {
       $("#wanname").hide();
       $("#dhcp_dns").show(); 
       $("#primary_dns").val(getdata.dns_info.DNSServers.split(",")[0]);
       $("#secondary_dns").val(getdata.dns_info.DNSServers.split(",")[1]); 
    }else if($("#dns_resource").val() == "3")
    {	
        if(operator_name == "TH_AIS")
        	{
				$("#wanname").hide();
			}else{
	            $("#wanname").show();
			}
	    $("#dhcp_dns").hide();
		$("#wan_name").val(getdata.dns_info.X_FH_DNSWANURL);
    
    }else{
        $("#wanname").hide();
        $("#dhcp_dns").hide();  
    }
    
}

function extraValidCheck()
{
    if ($("#primary_dns").val() == lanip   )
    {
        $("#MinSourceAddress-error").html("lan_ip_illegal_alert".i18n());
        return false;
    }
    if($("#secondary_dns").val() == lanip)
    {
        $("#secondip-error").html("lan_ip_illegal_alert".i18n());
        return false;
    }
	return true;
}


function save_apply()
{
	show_shadow();
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
    if(!$("#dnssetting_form").valid() )
    {
        alert("illegal_value_alert".i18n());
        return;
    }
    
    if( !extraValidCheck() ) // 额外校验，如要需要再打开
    {
    	 alert("illegal_value_alert".i18n());
        return;
     }
    
    
	var postdata = new Object();
	postdata.DnsMode = $("#dns_resource").val();
    if(postdata.DnsMode == "3")
    {
     postdata.Wanurl = $("#wan_name").val();   
    }else if(postdata.DnsMode == "2")
    {
        $("#wanname").hide();
        $("#dhcp_dns").show();
        postdata.DnsServer = $("#primary_dns").val() + "," + $("#secondary_dns").val();
    }
	
	XHR.post("set_dns_info", postdata, initPage);
}

