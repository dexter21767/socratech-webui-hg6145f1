var g_wifiNamedata;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/wifi_info", parseGetData);
	}
	else
	{
		//XHR.get("vlanbind", null, wifiNamedara);
		XHR.get("getCallHistory", null, parseGetData);
		XHR.get("get_call_history_enable", null, history_enable);
	}
}
function history_enable(data)
{
	if(data.history_enable_info.history_enable == "0"){
		$("#call_history_disable").prop('checked',true);
	}else{
		$("#call_history_enable").prop('checked',true);
	}
}


function parseGetData(data)
{
	var html = [];
	$("#call_history_list").empty();

	if ( data && data.cal_history_info)
	{
		var j = 0;
		for (var i=0; i<data.cal_history_info.call_history_data.length; i++)
		{
			var call_history_data = data.cal_history_info.call_history_data[i];
			
				html += '<tr class="table_01">';
				html += '<td width="11%" style="text-align: center;">'+call_history_data.date+'</td>';
				html += '<td width="12%" style="text-align: center;">'+call_history_data.Time+'</td>';
				html += '<td width="13%" style="text-align: center;">'+call_history_data.OutNumber+'</td>';
				html += '<td width="13%" style="text-align: center;">'+call_history_data.Direction+'</td>';
				html += '<td width="13%" style="text-align: center;">'+call_history_data.LocalNumber+'</td>';
				html += '<td width="13%" style="text-align: center;">'+call_history_data.Duration+'</td>';
				html += '</tr>';
			}
		}
		$("#call_history_list").append(html);
	}
	function EnableApply()
	{
		show_shadow();
		var postdata = new Object();
		postdata.call_history_enable = $("input[name='call_history_enable']:checked").val();   
		XHR.post("set_call_history_enable", postdata, history_enable);
	}

