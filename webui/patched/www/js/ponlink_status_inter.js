
$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/lanpon_status", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_lanpon_status", null, parseGetData);
	}
}

function parseGetData(data)
{
	if ( data )
	{
		$("#lan_pon_status").html(data.Status);
		$("#lan_pon_sendpack").html(data.PacketsSent);
		$("#lan_pon_recvpack").html(data.PacketsReceived);
		$("#lan_pon_recvbyte").html(data.BytesReceived);
		$("#lan_pon_sendbyte").html(data.BytesSent);
		$("#lan_pon_CRCerror").html(data.CRCErrorsPacketsReceived);
		$("#lan_pon_sendpower").html(Number(data.TXPower).toFixed(2) + " dBm");
		$("#lan_pon_votage").html(Number(data.SupplyVottage).toFixed(2) + " V");
		$("#lan_pon_current").html(Number(data.BiasCurrent).toFixed(2) + " mA");
		$("#lan_pon_tempreature").html(Number(data.TransceiverTemperature).toFixed(2) + " ℃");
	}
}
