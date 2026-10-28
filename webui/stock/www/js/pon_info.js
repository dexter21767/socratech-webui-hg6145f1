$(document).ready(function(){
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_pon_info", null, parseGetData);
	}
}

function parseGetData(data)
{
	$("#PonInfo_list").empty();
	var html = "";
	console.log(data);
	if(data)
	{
		if(gNewUiFlag)
		html +='<tr class="table_content" style="text-align: center;color:rgba(255, 255, 255, 0.8)">';
		else{
		html += '<tr class="table_01">';
		}
		html += '<td style="text-align: center;">'+data.tx_bytes+'</td>';
		html += '<td style="text-align: center;">'+data.tx_packets+'</td>';
		html += '<td style="text-align: center;">'+data.rx_bytes+'</td>';
		html += '<td style="text-align: center;">'+data.rx_packets+'</td>';
		html += '</tr>';
	}
	$("#PonInfo_list").append(html);
}
