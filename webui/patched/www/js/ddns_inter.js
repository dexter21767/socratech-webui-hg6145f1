var sessionidstr = "";
var g_data;
var	all_wan_info = '';
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ddns", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initConnectName);
		XHR.get("get_ddns_info", null, initPage);
	}
});


function initValidate()
{
	$("#ddns_form").validate({
		debug: true,
		rules: 
		{//-------------------------------------------------判断规则
			"ddns_user_name":{required: true, rangelength:[1,32]},
			"ddns_password":{required: true, rangelength:[1,32]},
			"ddns_host_title":{required: true, url: true,rangelength:[1, 255]}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate ddns ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate ddns failed.....");
			return false;
		}
	}); 
}

function initPage(getdata)
{
	if (getdata != null)
	{
		g_data = getdata;
		displayHtml();
	}
}

function displayHtml()
{
	var provider = "";
	if(g_data.Provider == "www.3322.org")
	{
		provider = "0";
	}
	else if(g_data.Provider == "www.dyndns.org")
	{
		provider = "1";
	}
	else if(g_data.Provider == "www.no-ip.com")
	{
		provider = "2";
	}
	else
	{
		provider = "3";
	}
	if (g_data.Enabled == '0') //设置使能
    {
        $("input[name='ddns_enable']:last").attr('checked', 'checked');
    }
    else
    {
        $("input[name='ddns_enable']:first").attr('checked', 'checked');
    }		
	$("#ddns_user_name").val(g_data.Username);
	$("#ddns_password").val(g_data.Password);
	$("#ddns_interface").val(g_data.WANPath);
	$("#ddns_host").val(g_data.DomainName);
	$("#ddns_provider").val(provider);
}

function initConnectName(getdata)
{
		var wan_num = 0;
		var dynamicHtml = '';
		all_wan_info = getdata;
		if (all_wan_info != '' && all_wan_info.wan)
		{
			wan_num = all_wan_info.wan.length;
		}
		if (wan_num > 0)
		{
			for ( i=0; i< wan_num; i++ )
			{
				var single_wan = all_wan_info.wan[i];	
				var wan_path = single_wan.WAN_url;
				if(single_wan.ServiceList.indexOf("INTERNET") >=0)//里面有internet
				{
					dynamicHtml += ' <option name= "ddns_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';		
				}
			}
		}
		$("#ddns_interface").html(dynamicHtml);
}
	

function save_apply()
{
	show_shadow();
	if( ! $("#ddns_form").valid() )
	{
		alert("illegal_value_alert".i18n());
		return;
	}
	var provider = "";
	if($("#ddns_provider").val() == "0")
	{
		provider = "www.3322.org";
	}
	else if($("#ddns_provider").val() == "1")
	{
		provider = "www.dyndns.org";
	}
	else if($("#ddns_provider").val() == "2")
	{
		provider = "www.no-ip.com";
	}
	else
	{
		provider = "Other";
	}

	var postdata = new Object();
	postdata.Enabled = $("input[name='ddns_enable']:checked").val();
	postdata.Username = $("#ddns_user_name").val();
	postdata.Password = $("#ddns_password").val();
	postdata.DomainName = $("#ddns_host").val();
	postdata.WANPath = $("#ddns_interface").val();
	postdata.Provider = provider;
	XHR.post("set_ddns_info", postdata, initPage);
}