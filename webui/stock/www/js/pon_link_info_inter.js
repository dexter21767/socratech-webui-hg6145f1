var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if(operator_name == "CHL_ENTEL"){
		$(".tip").show();
	}

	if(operator_name == "SFU_COMMON")
	{
		$("#temp_range").show();
	}
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
}

function parseGetData(data)
{
	if ( data )
	{
		if(data.txpower == "-40.00" && operator_name == "EG_TELECOM"){
			$("#send_power").html("No Connection");
		}else{
			$("#send_power").html((data.txpower) + " dBm");
		}
		console.log(data.rxpower)
		if(data.rxpower == "-40.00" && operator_name == "EG_TELECOM"){
			$("#recv_power").html("No Connection");
		}else{
			$("#recv_power").html((data.rxpower) + " dBm");
		}
		
		$("#votage").html((data.supplyvottage) + " V");
		$("#tempreature").html((data.transceivertemperature) + " ℃");
		$("#current").html((data.biascurrent) + " mA");
	}
}