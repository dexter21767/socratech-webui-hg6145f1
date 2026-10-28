
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
	var tr69_wan_exist = 0;

	XHR.get("get_allwan_name", null, function(data){
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
	
	// inform_status
	if ( tr69_wan_exist == 1 )
	{
		if ( data.tr069ipstatus == 1 )
		{
			if ( data.tr69url == "" || data.tr69url.toUpperCase() == "NULL" )
			{
				$("#inform_status").html('未上报(无ACS配置参数)');
			}
			else
			{
				if ( data.informstatus == 8 )
				{
					$("#inform_status").html('上报成功');
				}
				else if ( data.informstatus >= 0 && data.informstatus <= 5 )
				{
					$("#inform_status").html('未上报');
				}
				else if ( data.informstatus == 6 )
				{
					if ( data.handlestatus == 0 )
					{
						$("#inform_status").html('未上报(ACS域名解析失败)');
					}
					else
					{
						$("#inform_status").html('上报无回应');
					}
				}
				else if ( data.informstatus == 7 )
				{
					$("#inform_status").html('上报过程中断');
				}
				else
				{
					$("#inform_status").html('未知状态');
				}
			}
		}
		else
		{
			$("#inform_status").html('未上报(远程管理WAN连接未生效)');
		}
	}
	else
	{
		$("#inform_status").html('未上报(没有TR069连接)');
	}
	
	if ( tr69_wan_exist == 1 )
	{
		if ( data.tr069ipstatus == 1 )
		{
			if ( data.connectionrequeststatus == 0 )
			{
				$("#request_status").html('未收到远程连接请求');
			}
			else if ( data.connectionrequeststatus == 1 )
			{
				$("#request_status").html('ITMS发起的远程连接过程中断');
			}
			else if ( data.connectionrequeststatus == 2 )
			{
				$("#request_status").html('ITMS发起的远程连接过程成功');
			}
			else
			{
				$("#request_status").html('未知状态');
			}
		}
		else
		{
			$("#inform_status").html('未收到远程连接请求(远程管理WAN连接未生效)');
		}
	}
	else
	{
		$("#request_status").html('未收到远程连接请求(没有TR069连接)');
	}
}
