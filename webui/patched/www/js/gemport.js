var fttr_type = gFttr_type;
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
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_gemport_info", null, parseGetData);
	}
}

function parseGetData(data)
{
	//alert(JSON.stringify(data));
	$("#lanInfo_list").empty();
	var html = "";
	if ( data && data.ethernet_ports_info)
	{
	    var ethernet_ports_info = data.ethernet_ports_info;

		/*当设备为AP时，最后一个口为WAN口，不显示相关数据*/
		var length;
		if(gDevice_type != 1)
			length = ethernet_ports_info.ethernet_ports_data.length -1;
		else
			length = ethernet_ports_info.ethernet_ports_data.length
		for (var i=0; i<length; i++)
		{	
			var ethernet_ports = data.ethernet_ports_info.ethernet_ports_data[i];
			html += '<tr class="table_01">';
				html += '<td style="text-align: center;">'+ethernet_ports.GEMPortId+'</td>';
				
				html += '<td style="text-align: center;">'+ethernet_ports.TxGemFrames+'</td>';
				html += '<td style="text-align: center;">'+ethernet_ports.RxGemFrames+'</td>';
				
				html += '<td style="text-align: center;">'+ethernet_ports.TxPayloadBytes+'</td>';
				html += '<td style="text-align: center;">'+ethernet_ports.RxPayloadBytes+'</td>';
				
		}
	}
	$("#lanInfo_list").append(html);
}
