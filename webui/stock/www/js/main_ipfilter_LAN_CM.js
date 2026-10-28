var ipfilter_data;
var wan_data;
var IPFilterOutEnable;
var IPFilterOutPolicy;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipfilter_lan", initPage);
	}
	else
	{
		XHR.get("get_ipfilter_lan_info", null, initPage);
	}
});

function initValidate()
{
	$("#ip_filter_list_form").validate({
		debug: true,
		rules: {
			"ipfilter_MinSourcePort": {required: true, range_int:[0,65535]},
			"ipfilter_MaxSourcePort": {required: true, range_int:[0,65535]},
			"ipfilter_MinDestinationPort": {required: true, range_int:[0,65535]},
			"ipfilter_MaxDestinationPort": {required: true, range_int:[0,65535]},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.ipfilter_lan)
	{
		wan_data = getdata.ipfilter_lan.wan;
		ipfilter_data = getdata.ipfilter_lan.ipfilterout;
		IPFilterOutEnable = getdata.ipfilter_lan.IPFilterOutEnable;
		IPFilterOutPolicy = getdata.ipfilter_lan.IPFilterOutPolicy;
		var dynamicClsListHTML = '';
		
		setCheckbox("enable_checkbox", IPFilterOutEnable);
		$("#mode_select").val( getdata.IPFilterOutPolicy);  //0黑名单，1白名单
		
		//ipfilter list
		if(getdata.ipfilter_lan.ipfilterout != null && getdata.ipfilter_lan.ipfilterout != "" )
		{
			for (var m=0; m<ipfilter_data.length; m++)
			{
				var single = ipfilter_data[m];
				if (single.Name != 'NULL' && single.Name != '')  
				{
					dynamicClsListHTML += '<tr>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_1_table\'>' + single.Name + '</td>';
					if (single.Enable == '1')
					{
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_2_table\'>启用</td>';
					}
					else
					{
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_2_table\'>禁用</td>';
					}
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_3_table\'>' + single.Protocol + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_4_table\'>' + single.SourceIPStart + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_5_table\'>' + single.SourceIPEnd + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_6_table\'>' + single.DestIPStart + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_7_table\'>' + single.DestIPEnd + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_8_table\'>' + single.SourcePortStart + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_9_table\'>' + single.SourcePortEnd + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_10_table\'>' + single.DestPortStart + '</td>';
					dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_11_table\'>' + single.DestPortEnd + '</td>';
					//dynamicClsListHTML += '<td><input type="checkbox" id="ipfilter_OutFilter' + m + '_12_table" onclick="deleteEntry(this)" name="ipfilter_OutFilter' + i + '"></td>';
					dynamicClsListHTML += '<td><input type="button" value="删除" id="ipfilter_OutFilter' + single.ipfilterout_index + '_5_table" onclick="doDelete(this.name)" name="ipfilter_OutFilter_' + single.ipfilterout_index + '"></td>';
					dynamicClsListHTML += '</tr>';
				}
			}
		}
		$("#Outflow_List").html(dynamicClsListHTML);
	}
	//$("#add_text").val('');
	displayControl();
}

function doDelete(elementName)
{
	var index = -1;
	if (0 == elementName.indexOf('ipfilter_OutFilter_'))
	{
		index = parseInt(elementName.replace(/ipfilter_OutFilter_/g, ''));
	}
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.filterout_index = index;
	XHR.post("set_ipfilter_lan_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function doAdd()
{
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if( ! extraValidCheck() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	var postdata = new Object();
	postdata.action = "add";
	postdata.Name = $("#ipfilter_AddFilter").val();
	postdata.Enable = getCheckbox("ipfilter_Enable");
    postdata.Protocol = $("#ipfilter_AddAgreement").val();
    postdata.SourceIPStart = $("#ipfilter_MinSourceAddress").val();
    postdata.SourceIPEnd = $("#ipfilter_MaxSourceAddress").val();
    postdata.SourcePortStart = $("#ipfilter_MinSourcePort").val();
    postdata.SourcePortEnd = $("#ipfilter_MaxSourcePort").val();
    postdata.DestIPStart = $("#ipfilter_MinDestinationAddress").val();
    postdata.DestIPEnd = $("#ipfilter_MaxDestinationAddress").val();
    postdata.DestPortStart = $("#ipfilter_MinDestinationPort").val();
    postdata.DestPortEnd = $("#ipfilter_MaxDestinationPort").val();		
	
	XHR.post("set_ipfilter_lan_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function extraValidCheck()
{
	var error_num = 0;
	if ($("#ipfilter_AddFilter").val() == "")
    {
        $("#add_text_error").html("过滤器名不能为空！");
        error_num++;
    }
    else if ($("#ipfilter_MinSourceAddress").val() != "" && isValidIpAddress($("#ipfilter_MinSourceAddress").val()) == false)
    {
        $("#MinSourceAddress-error").html("源IP是无效IP地址.");
         error_num++;
    }
    else if ($("#ipfilter_MaxSourceAddress").val() != "" && isValidIpAddress($("#ipfilter_MaxSourceAddress").val()) == false)
    {
        $("#MaxSourceAddress-error").html("源IP是无效IP地址.");
        error_num++;
    }
    else if ($("#ipfilter_MinDestinationAddress").val() != "" && isValidIpAddress($("#ipfilter_MinDestinationAddress").val()) == false)
    {
        $("#MinDestinationAddress-error").html("目的IP是无效IP地址.");
        error_num++;
    }
    else if ($("#ipfilter_MaxDestinationAddress").val() != "" && isValidIpAddress($("#ipfilter_MaxDestinationAddress").val()) == false)
    {
        $("#MaxDestinationAddress-error").html("目的IP是无效IP地址.");
        error_num++;
    }
    else if ($("#ipfilter_MinSourcePort").val() != "" && isValidLimitTime($("#ipfilter_MinSourcePort").val()) == false)
    {
        $("#MinSourcePort-error").html("源端口号是无效端口号.");
        error_num++;
    }
    else if ($("#ipfilter_MaxSourcePort").val() != "" && isValidLimitTime($("#ipfilter_MaxSourcePort").val()) == false)
    {
       $("#MaxSourcePort-error").html("源端口号是无效端口号.");
        error_num++;
    }
    else if ($("#ipfilter_MinDestinationPort").val() != "" && isValidLimitTime($("#ipfilter_MinDestinationPort").val()) == false)
    {
        $("#MinDestinationPort-error").html("目的端口号是无效端口号.");
        error_num++;
    }
    else if ($("#ipfilter_MaxDestinationPort").val() != "" && isValidLimitTime($("#ipfilter_MaxDestinationPort").val()) == false)
    {
        $("#MaxDestinationPort-error").html("目的端口号是无效端口号.");
        error_num++;
    }	
    else
	{
		//do nothing
	}
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function displayControl()
{
	if ( IPFilterOutEnable == '1' )
	{
		$("#ip_filter_list_form").show();
	}
	else
	{
		$("#ip_filter_list_form").hide();
	}
	
}

function saveApply()
{
	if( ! $("#ipfilter_LAN_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	if(getCheckbox("enable_checkbox") ==1 && (wan_data == null || wan_data == "" ))
	{
		alert("当前没有Internet路由连接");
		return;
	}
	
	var postdata = new Object();
	postdata.action = "mode";
	postdata.IPFilterOutEnable = getCheckbox("enable_checkbox");
	postdata.IPFilterOutPolicy = $("#mode_select").val();
	
	XHR.post("set_ipfilter_lan_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function isValidIpAddress(ipAddress){
    var pattIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
    return pattIp.test(ipAddress);
}

function isValidLimitTime(ipAddress){
    var pattIp = /^[1-9]\d*$/;
    return pattIp.test(ipAddress);
}