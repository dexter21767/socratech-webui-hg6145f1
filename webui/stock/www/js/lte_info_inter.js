var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	

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
		XHR.poll(gStatusFreshInterval, "get_lte_result", null, parseGetData);
	}
}

function parseGetData(data)
{
	if ( data )
	{
		$("#IMEI").html(data.IMEI);
		$("#IMSI").html(data.IMSI);
		$("#SIM_Number").html(data.SIMNumber);
		$("#ICCID").html(data.ICCID);

		// 0为sim state normal，1为sim state error
		if(data.SIMStatus == "0"){
			$("#SIMStatus").html("Normal");
		}else if(data.SIMStatus == "1"){
			$("#SIMStatus").html("Error");
		}

		//0为sim reg success，1为sim reg reject，2为sim don't reg
		if(data.SIMRegister == "0"){
			$("#SIMRegister").html("Success");
		}else if(data.SIMRegister == "1"){
			$("#SIMRegister").html("Reject");
		}else if(data.SIMRegister == "2"){
			$("#SIMRegister").html("Not register");
		}

		$("#Band").html(data.BAND);
		$("#PLMN").html(data.PLMN);
		$("#ECELL").html(data.CELLID);
		$("#PCI").html(data.PCI);
		$("#SINR").html(data.SINR);
		$("#RSRP").html(data.RSRP);
		$("#RSRQ").html(data.RSRQ);
		$("#RSSI").html(data.RSSI);
	}
}