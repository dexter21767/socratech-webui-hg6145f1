
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
	
	if ( tr69_wan_exist == 1 )
	{
		if ( data.loid_result == 1 )
		{
			$("#status").html("业务配置成功");
		}
		else if ( data.loid_result == 2 )
		{
			$("#status").html("业务配置失败");
		}
		else if ( data.loid_result == 99 )
		{
			$("#status").html("ITMS未下发远程业务配置状态");
		}
		else
		{
			$("#status").html("未知状态");
		}
	}
	else
	{
		$("#status").html("没有TR069连接");
	}
}
