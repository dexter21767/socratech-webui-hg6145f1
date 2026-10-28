$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_netlock_status", null, parseGetData);
	}
}

function parseGetData(data)
{
	if ( data && data.netlock_status )
	{
		var netlock_status = data.netlock_status;
		$("#netlock_status").html(netlock_status);
		
	}
}
