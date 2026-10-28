var sessionidstr = "";
var ipfilter_data;
var wan_data;
var IPFEnable;
var IPFMode;
var addindex = '';

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
		XHR.get("get_ipfilter_info", null, initPage);
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
	
	if (getdata != null && getdata.ipfilter_lan)
	{
		wan_data = getdata.ipfilter_lan.wan;
		ipfilter_data = getdata.ipfilter_lan.ipfilterout;
		IPFEnable = getdata.ipfilter_lan.IPFEnable;
		IPFMode = getdata.ipfilter_lan.IPFMode;
		
		var dynamicClsListHTML = '';
		addindex = '';
		
		setCheckbox("enable_checkbox", IPFEnable);
		$("#mode_select").val(IPFMode);  //black黑名单，white白名单
		
		//ipfilter list
		if(getdata.ipfilter_lan.ipfilterout != null && getdata.ipfilter_lan.ipfilterout != "" )
		{
			for (var m=0; m<ipfilter_data.length; m++)
			{
				var single = ipfilter_data[m];
				if ( IPFMode == "white")
				{
					if (single.WName != 'NULL' && single.WName != '')  
					{
						dynamicClsListHTML += '<tr>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_1_table\'>' + single.WName + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_2_table\'>' + single.WProtocol + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_3_table\'>' + single.WMinSrcaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_4_table\'>' + single.WMaxSrcaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_5_table\'>' + single.WMinDstaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_6_table\'>' + single.WMaxDstaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_7_table\'>' + single.WMinSrcport + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_8_table\'>' + single.WMaxSrcport + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_9_table\'>' + single.WMinDstport + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_10_table\'>' + single.WMaxDstport + '</td>';
						//dynamicClsListHTML += '<td><input type="checkbox" id="ipfilter_OutFilter' + m + '_12_table" onclick="deleteEntry(this)" name="ipfilter_OutFilter' + i + '"></td>';
						dynamicClsListHTML += '<td><input type="button" value="删除" id="ipfilter_OutFilter' + single.ipfilterout_index + '_5_table" onclick="doDelete(this.name)" name="ipfilter_OutFilter_' + single.ipfilterout_index + '"></td>';
						dynamicClsListHTML += '</tr>';
					}
					else
					{
						if ( addindex == '' )
						{
							addindex = m + 1;
						}
					}
				}
				else 
				{
					if (single.BName != 'NULL' && single.BName != '')  
					{
						dynamicClsListHTML += '<tr>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_1_table\'>' + single.BName + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_2_table\'>' + single.BProtocol + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_3_table\'>' + single.BMinSrcaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_4_table\'>' + single.BMaxSrcaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_5_table\'>' + single.BMinDstaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_6_table\'>' + single.BMaxDstaddr + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_7_table\'>' + single.BMinSrcport + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_8_table\'>' + single.BMaxSrcport + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_9_table\'>' + single.BMinDstport + '</td>';
						dynamicClsListHTML += '<td id=\'ipfilter_OutFilter' + m + '_10_table\'>' + single.BMaxDstport + '</td>';
						//dynamicClsListHTML += '<td><input type="checkbox" id="ipfilter_OutFilter' + m + '_12_table" onclick="deleteEntry(this)" name="ipfilter_OutFilter' + i + '"></td>';
						dynamicClsListHTML += '<td><input type="button" value="删除" id="ipfilter_OutFilter' + single.ipfilterout_index + '_5_table" onclick="doDelete(this.name)" name="ipfilter_OutFilter_' + single.ipfilterout_index + '"></td>';
						dynamicClsListHTML += '</tr>';
					}
					else
					{
						if ( addindex == '' )
						{
							addindex = m + 1;
						}
					}
				}
			}
		}
		$("#Outflow_List").html(dynamicClsListHTML);
	}
	$(".input_text").each(function (i){
	$(this).val('');});
	$("#ipfilter_AddAgreement").val("TCP/UDP");
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
	postdata.IPFMode = $("#mode_select").val();
	postdata.filter_index = index;
	postdata.sessionid = sessionidstr;
	XHR.post("set_ipfilter_info", postdata, initPage);
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
	postdata.IPFMode = $("#mode_select").val();
	postdata.filter_index = addindex;
	postdata.Name = $("#ipfilter_AddFilter").val();
	//postdata.Enable = getCheckbox("ipfilter_Enable");
    postdata.Protocol = $("#ipfilter_AddAgreement").val();
    postdata.MinSrcaddr = $("#ipfilter_MinSourceAddress").val();
    postdata.MaxSrcaddr = $("#ipfilter_MaxSourceAddress").val();
    postdata.MinSrcport = $("#ipfilter_MinSourcePort").val();
    postdata.MaxSrcport = $("#ipfilter_MaxSourcePort").val();
    postdata.MinDstaddr = $("#ipfilter_MinDestinationAddress").val();
    postdata.MaxDstaddr = $("#ipfilter_MaxDestinationAddress").val();
    postdata.MinDstport = $("#ipfilter_MinDestinationPort").val();
    postdata.MaxDstport = $("#ipfilter_MaxDestinationPort").val();		
	postdata.sessionid = sessionidstr;
	XHR.post("set_ipfilter_info", postdata, initPage);
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
	if ( IPFEnable == '1' )
	{
		$("#ip_filter_list_form").show();
		if ( addindex == '' )
		{
			$("#add_div").hide();
		}
		else
		{
			$("#add_div").show();
		}
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
	postdata.IPFEnable = getCheckbox("enable_checkbox");
	postdata.IPFMode = $("#mode_select").val();
	postdata.sessionid = sessionidstr;
	XHR.post("set_ipfilter_info", postdata, initPage);
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