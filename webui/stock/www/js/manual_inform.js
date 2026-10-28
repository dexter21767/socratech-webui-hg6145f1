var sessionidstr = "";
var tr69_wan_exist = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	
	XHR.get("get_allwan_info", null, function(data){
		if ( data && data.wan )
		{
			for (var i=0; i< data.wan.length; i++ )
			{
				var singlename = data.wan[i].Name.toUpperCase();
				if ( singlename.indexOf("TR069") >= 0 )
				{
					tr69_wan_exist = 1;
					break;
				}
			}
		}
	});
});

function saveApply()
{
	var postdata = new Object();
	$("#result").hide();
	postdata.action = "inform";
	postdata.sessionid = sessionidstr;
	XHR.post("do_moremgt", postdata, parseInformResult);
	showOrHideLoadingWindowFromIframe("show");
}

function parseInformResult(data)
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	var dynamicHTML;
	if (data)
	{
		if ( data.handlestatus == 0 )//-1:表示未手动上报，1：表示手动上报中，0：表示上报结束
		{
			switch(data.informstatus)
			{
				case '9':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_timeout".i18n();
					break;
				case '8':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_success".i18n();
					break;
				case '7':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_interrupt".i18n();
					break;
				case '6':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_no_response".i18n();
					break;
				case '5':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_acs_resolution_failed".i18n();
					break;
				case '4':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_no_acs_configuration_parameter".i18n();
					break;
				case '3':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_no_dns_information".i18n();
					break;
				case '2':
				case '1':
					if(tr69_wan_exist == 0)
					{
						dynamicHTML = "manual_inform_result".i18n() + "manual_inform_no_remote_management_wan".i18n();
					}
					else
					{
						dynamicHTML = "manual_inform_result".i18n() + "manual_inform_remote_wan_no_effect".i18n();
					}
					break;
				case '0':
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_smart_gateway_starting".i18n();
					break;
				default:
					dynamicHTML = "manual_inform_result".i18n() + "manual_inform_failed".i18n();
					break;
			}
		}
		else
		{
			dynamicHTML = "manual_inform_result".i18n() + "manual_inform_failed".i18n();
		}
	}
	else
	{
		dynamicHTML = "manual_inform_internal_system_error".i18n();
	}
	
	$("#result").html("<br/>" + dynamicHTML);
	$("#result").show();
}

