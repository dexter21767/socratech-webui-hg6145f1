
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/base_info", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_base_info", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	if ( data )
	{
		if ( data.authStatus == 0 )
		{
			$("#pon_status").html("未注册未认证");
		}
		else if ( data.authStatus == 1 )
		{
			$("#pon_status").html("已注册未认证");
		}
		else if ( data.authStatus == 2 )
		{
			$("#pon_status").html("已注册已认证");
		}
		else 
		{
			$("#pon_status").html("未知");
		}
		
		if ( data.fecStatus == 2 )
		{
			$("#fec_status").html("开启");
		}
		else
		{
			$("#fec_status").html("关闭");
		}
		
		$("#pon_send_pack").html(data.ponPacketsSent);
		$("#pon_recv_pack").html(data.ponPacketsReceived);
		$("#pon_recv_byte").html(data.ponBytesReceived);
		$("#pon_send_byte").html(data.ponBytesSent);
		$("#send_power").html(data.txpower);
		$("#recv_power").html(data.rxpower);
		$("#votage").html(data.supplyvottage);
		$("#tempreature").html(data.transceivertemperature);
		$("#current").html(data.biascurrent);
	}
}
