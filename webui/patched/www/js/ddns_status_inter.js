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
		XHR.poll(gStatusFreshInterval, "get_allwan_info", null, parseGetData);
	}
}

function parseGetData(data)
{
	$("#user_list").empty();
	var html = [];
	var num = 1;
	var j = 0;
	wan_info = data.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		
		ddns_data = wan_info[i].ddns; //获取当前第i条WAN下的ddns信息
		if (ddns_data.length != 0) {
			for (var m = 0; m < ddns_data.length; m++) //将第i条WAN连接下的ddns信息进行遍历
			{
				j++;
				var n = m + 1;
				var single = ddns_data[m]; //对于第m条ddns 信息赋值给single
				var ddns_status = single.DDNSStatus;
				html += '<tr class="table_01">';
				html += '<td style="text-align: center;">'+j+'</td>';
			
			switch (ddns_status)
			{
				case "1":
					html += '<td align="center">' + "ddns_status_val1".i18n() + '</td>';
					html += '</tr>';
					break;
				case "2":
					html += '<td align="center">' + "ddns_status_val2".i18n() + '</td>';
					html += '</tr>';
					break;
				case "3":
					html += '<td align="center">' + "ddns_status_val3".i18n() + '</td>';
					html += '</tr>';
					break;
				case "4":
					html += '<td align="center">' + "ddns_status_val4".i18n() + '</td>';
					html += '</tr>';
					break;
				case "5":
					html += '<td align="center">' + "ddns_status_val5".i18n() + '</td>';
					html += '</tr>';
					break;
				case "6":
					html += '<td align="center">' + "ddns_status_val6".i18n() + '</td>';
					html += '</tr>';
					break;
				case "7":
					html += '<td align="center">' + "ddns_status_val7".i18n() + '</td>';
					html += '</tr>';
					break;
				case "8":
					html += '<td align="center">' + "ddns_status_val8".i18n() + '</td>';
					html += '</tr>';
					break;
				case "9":
					html += '<td align="center">' + "ddns_status_val9".i18n() + '</td>';
					html += '</tr>';
					break;
				case "10":
					html += '<td align="center">' + "ddns_status_val10".i18n() + '</td>';
					html += '</tr>';
					break;
				case "11":
					html += '<td align="center">' + "ddns_status_val11".i18n() + '</td>';
					html += '</tr>';
					break;
				case "12":
					html += '<td align="center">' + "ddns_status_val12".i18n() + '</td>';
					html += '</tr>';
					break;
				case "13":
					html += '<td align="center">' + "ddns_status_val13".i18n() + '</td>';
					html += '</tr>';
					break;
			}
			
				
				num++;
			}
		}
	}
	$("#user_list").append(html);
}

