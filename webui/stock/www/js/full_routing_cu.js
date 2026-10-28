var wan_data = '';
var splitchar = '_';

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	$("#wan_select").bind("change", function(){
		selectWanChange();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/full_routing", initPage);
	}
	else
	{
		XHR.get("get_full_routing", null, initPage);
	}
});

function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.routing)
	{
		wan_data = getdata.routing.wan;
		initWanName();
		selectWanChange();
	}
}

function initWanName()
{
	var dynamicHTML = '';
	if ( wan_data.length >0 )
	{
		for ( i=0; i<wan_data.length; i++ )
		{
			var single = wan_data[i];
			dynamicHTML += '<option value="' + single.wan_index + splitchar + single.wan_session_index + splitchar + single.iporppp + '">' + single.Name + '</option>';
		}
	}
	$("#wan_select").html(dynamicHTML);
	if ( $("#wan_select option").size() == 0 )
	{
		$("#wansave").addClass("input_button_disabled");
		$("#wansave").attr("disabled", true);
	}
	else
	{
		$("#wansave").removeClass("input_button_disabled");
		$("#wansave").attr("disabled", false);
	}
}

function selectWanChange()
{
	if ( $("#wan_select option").size() > 0 )
	{
		var select_wan_index = $("#wan_select").val().split(splitchar)[0];
		var select_wan_session_index = $("#wan_select").val().split(splitchar)[1];
		if ( wan_data.length >0 )
		{
			for ( i=0; i<wan_data.length; i++ )
			{
				var single = wan_data[i];
				if ( single.wan_index == select_wan_index && single.wan_session_index == select_wan_session_index )
				{
					$("#IPForwardList").val(single.IPForwardList);
					setCheckbox("IPForwardModeEnabled", single.IPForwardModeEnabled);
					break;
				}
			}
		}
	}
}

function saveApply(action)
{
	var postdata = new Object();
	postdata.action = action;
	
	if ( action == "wan" )
	{
		if ( $("#wan_select option").size() > 0 )
		{
			postdata.IPForwardList = $("#IPForwardList").val();
			postdata.IPForwardModeEnabled = getCheckbox("IPForwardModeEnabled");
			postdata.wan_index = $("#wan_select").val().split(splitchar)[0];
			postdata.wan_session_index = $("#wan_select").val().split(splitchar)[1];
			postdata.wan_iporppp = $("#wan_select").val().split(splitchar)[2];
		}
		else
		{
			return;
		}
	}
	else
	{
		return;
	}
	
	XHR.post("set_full_routing", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

