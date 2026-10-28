
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/smart_platform_status", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_smart_platform_status", null, parseGetData);
	}
});

function parseGetData(data)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	$("#DistErrorMsgContent").hide();
	$("#OperErrorMsgContent").hide();
	$("#PluginErrorMsgContent").hide();
	
	$("#MgtURL").html(data.MgtURL);
	if (data.DistStatus == 1)
	{
		$("#DistStatus").html("未连接");
	}
	else if (data.DistStatus == 2)
	{
		$("#DistStatus").html("正在尝试连接分发平台");
    }
	else if (data.DistStatus == 3)
	{
		$("#DistStatus").html("与分发平台保持连接中");
    }
	else if (data.DistStatus == 4)
	{
		$("#DistStatus").html("与分发平台连接结束");
    }
	else if (data.DistStatus == 5)
	{
		$("#DistStatus").html("尝试连接分发平台失败");
		$("#DistErrorMsgContent").show();
		$("#DistErrorMsg").html(data.DistErrorMsg);
    }
	
	$("#OperAddr").html(data.OperAddr);
	if (data.OperStatus == 1)
	{
		$("#OperStatus").html("未连接");
	}
	else if (data.OperStatus == 2)
	{
		$("#OperStatus").html("正在尝试连接");
    }
	else if (data.OperStatus == 3)
	{
		$("#OperStatus").html("向运营平台注册中");
    }
	else if (data.OperStatus == 4)
	{
		$("#OperStatus").html("向运营平台心跳保活中");
    }
	else if (data.OperStatus == 5)
	{
		$("#OperStatus").html("与运营平台等待下一次心跳中");
    }
	else if (data.OperStatus == 6)
	{
		$("#OperStatus").html("尝试连接运营平台失败");
		$("#OperErrorMsgContent").show();
		$("#OperErrorMsg").html(data.OperErrorMsg);
    }
	
	$("#PluginAddr").html(data.PluginAddr);
	if (data.PluginStatus == 1)
	{
		$("#PluginStatus").html("未连接");
	}
	else if (data.PluginStatus == 2)
	{
		$("#PluginStatus").html("正在尝试连接");
    }
	else if (data.PluginStatus == 3)
	{
		$("#PluginStatus").html("向插件中心注册中");
    }
	else if (data.PluginStatus == 4)
	{
		$("#PluginStatus").html("向插件中心心跳保活中");
    }
	else if (data.PluginStatus == 5)
	{
		$("#PluginStatus").html("与插件中心等待下一次心跳");
    }
	else if (data.PluginStatus == 6)
	{
		$("#PluginStatus").html("尝试连接插件中心失败");
		$("#PluginErrorMsgContent").show();
		$("#PluginErrorMsg").html(data.PluginErrorMsg);
    }
	
	$.ajax({
		url: "../cgi-bin/get_smart_platform_status.cgi",
		method: "GET",
		dataType: 'json',
		cache: false,
		async: false,
		success: function(data){
			if ( data )
			{
				$("#bssAddr").html(data.smartNameStr1);
				$("#bssStatus").html(data.smartNameStr2);
				$("#abilityAddr").html(data.smartNameStr3);
				$("#abilityStatus").html(data.smartNameStr4);
			}
		}
	});
}
