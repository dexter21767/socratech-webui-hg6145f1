var wan_data = '';
var splitchar = '_';
var deleteNum = 0,  maxRecordIndex = 1;;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/static_route_v6", initPage);
	}
	else
	{
		XHR.get("get_static_route_v6", null, initPage);
	}
});

function initValidate()
{
	$("#route_form").validate({
		debug: true,
		rules: {
			"NextHop_text": {required: true, ipv6:true}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate port mapping ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate port mapping failed.....");
			return false;
		}
	}); 
}
function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	var routeListHTML = '', recordIndex = 1;
	if (getdata != null && getdata.route_v6)
	{
		wan_data = getdata.route_v6.wan;
		routedata = getdata.route_v6.routing;
		
		if(getdata.route_v6.routing != null && getdata.route_v6.routing != "" )
		{
			for (var i=0; i<routedata.length; i++)
			{
				var routeParams = routedata[i];  //.replace(/ {1,}/g, ' ')
				var InterfaceName = '';
				
				recordIndex++;
				routeListHTML += '<tr align=center>';
				routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_1_table">IPv6</td>';
				if ('NULL' == routeParams.DestIPPrefix)
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_2_table">&nbsp;</td>';
				}
				else
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_2_table">' + routeParams.DestIPPrefix + '</td>';
				}
				if ('NULL' == routeParams.NextHop)
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_3_table">&nbsp;</td>';
				}
				else
				{
					routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_3_table">' + routeParams.NextHop + '</td>';
				}
			    for ( var j=0; j<wan_data.length; j++ )
				{
					var single = wan_data[j];
					if(!jQuery.isEmptyObject(wan_data[j]) && single.interface_name == routeParams.Interface)
					{
						InterfaceName = single.Name;
					}		
				}
				routeListHTML += '<td id="StaticRouteInfo_' + recordIndex + '_4_table">' + InterfaceName + '</td>';
				routeListHTML += '<td><input type="button" value="删除" id="StaticRouteInfo_' + recordIndex + '_5_table" onclick="deleteRoute(this.name)" name="SelectforDel_IPv6_' + routeParams.routeIndex + '"></td>';
				routeListHTML += '</tr>';
				
			}
			maxRecordIndex = recordIndex;
		}
		$("#routev6List").html(routeListHTML);
		initWanName();
		$("#DestIPPrefix_text").val('');
		$("#NextHop_text").val('');
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
			if(!jQuery.isEmptyObject(wan_data[i]))
			dynamicHTML += '<option value="' + single.interface_name+ '">' + single.Name + '</option>';
		}
	}
	$("#Interface_select").html(dynamicHTML);
	if ( $("#Interface_select option").size() == 0 )
	{
		$("#RouteApply_button").addClass("input_button_disabled");
		$("#RouteApply_button").attr("disabled", true);
	}
	else
	{
		$("#RouteApply_button").removeClass("input_button_disabled");
		$("#RouteApply_button").attr("disabled", false);
	}
}

function deleteRoute(elementName)
{
	var postdata = new Object();
	postdata.action = "delete";
	var deleteStr = '';
	
	var routeIndex = -1;
	if (0 == elementName.indexOf('SelectforDel_IPv6_'))
	{
		routeIndex = parseInt(elementName.replace(/SelectforDel_IPv6_/g, ''));
	}
	
	postdata.routeIndex = routeIndex;
	
	XHR.post("set_static_route_v6", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function checkAddRouteFields()
{
	var destipprefix = $("#DestIPPrefix_text").val(), nethop= $("#NextHop_text").val();
	var destipaddr = destipprefix.split('/')[0];
	var prefixlen = destipprefix.split('/')[1];
	if ( isNullString(destipprefix) && isNullString(nethop))
	{
		alert("目的IP前缀和下一跳地址不能都为空");
		return false;
		
	}

	if(destipprefix.indexOf('/') == -1 || !isValidIpv6PrefixAddress(destipaddr) || !isValidPrefixLength(prefixlen))
	{
		alert("无效的目的IP前缀");
		return false;
	}
	if (!isNullString(nethop) && !isValidIpAddress6(nethop))
	{
		alert("无效的下一跳地址");
		return false;
	}
	
	return true;
}

function addIpv6StaticRoute ()
{
	var test = checkAddRouteFields();
	
	if (test)
	{
		var postdata = new Object();
		postdata.action = "add";
		if ( $("#Interface_select option").size() > 0 )
		{
			postdata.Enable = 1;
			postdata.DestIPPrefix = $("#DestIPPrefix_text").val();
			postdata.NextHop = $("#NextHop_text").val();
			postdata.Interface = $("#Interface_select").val();
		}
		else
		{
			return;
		}
		
		XHR.post("set_static_route_v6", postdata, initPage);
		showOrHideLoadingWindowFromIframe("show");
	}
}

