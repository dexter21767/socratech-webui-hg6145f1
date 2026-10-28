var timeout;
var count = 0;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "both";
	postdata.DiagnosticsState = "Requested";
	XHR.post("set_search_wifi_neighbor", postdata, get_result);
}

function get_result(data){
	if(count > 20){
		alert("time_out".i18n());
		return;
	}
	if(data && data.wifi_neighbor){
		var DiagnosticsState = data.wifi_neighbor.DiagnosticsState;
		if(DiagnosticsState.indexOf("Complete") == -1){
			count++;
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				XHR.get("get_neighbor", null, get_result);
			}, 1500);
			
		}else{
			get_neighborresult();
		}
	}else{
		count++;
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			XHR.get("get_neighbor", null, get_result);
		}, 1500);
	}
}

function get_neighborresult(){
	count = 0;
	clearTimeout(timeout);
	if(gNewUiFlag)
		XHR.get("get_neighborresult", null, init_new_ui_table);
	else
		XHR.get("get_neighborresult", null, init_table);
}

function init_table(data){
	$("#wifi_list").empty();
	var html = '';
	if ( data && data.wifi_neighbor_info)
	{
		wifi_neighbor_data = data.wifi_neighbor_info.wifi_neighbor_data;

		if(operator_name == "PAK_CYBERNET")
		{
			$("#td_signal_strength_level").show();
		}

		var i = 0;
		for (i=0; i<wifi_neighbor_data.length; i++)
		{
			var wifi_info = wifi_neighbor_data[i];
			html += '<tr id="add_item">';
			html += '<td width="20%" style="text-align: center;">'+ wifi_info.SSID +'</td>';
			html += '<td width="20%" style="text-align: center;">'+wifi_info.BSSID +'</td>';
			html += '<td width="8%" style="text-align: center;">'+wifi_info.Channel+'</td>';
			html += '<td width="7%" style="text-align: center;">'+wifi_info.SignalStrength+'</td>';
			
			if(operator_name == "PAK_CYBERNET")
			{
				if(wifi_info.SignalStrength >= -100 && wifi_info.SignalStrength <= -81 )
				{
					html += '<td width="7%" style="text-align: center;">'+'Lousy'+'</td>';
				}
				else if(wifi_info.SignalStrength >= -80 && wifi_info.SignalStrength <= -71)
				{
					html += '<td width="7%" style="text-align: center;">'+'Weak'+'</td>';
				}
				else if(wifi_info.SignalStrength >= -70 && wifi_info.SignalStrength <= -61)
				{
					html += '<td width="7%" style="text-align: center;">'+'Normal'+'</td>';
				}
				else if(wifi_info.SignalStrength >= -60 && wifi_info.SignalStrength <= -31)
				{
					html += '<td width="7%" style="text-align: center;">'+'Strong'+'</td>';
				}
				else if(wifi_info.SignalStrength >= -30 && wifi_info.SignalStrength <= 0)
				{
					html += '<td width="7%" style="text-align: center;">'+'Amazing'+'</td>';
				}
				
			}

			html += '<td width="7%" style="text-align: center;">'+wifi_info.Noise+'</td>';
			html += '<td width="8%" style="text-align: center;">'+ wifi_info.DTIMPeriod +'</td>';
			html += '<td width="7%" style="text-align: center;">'+wifi_info.BeaconPeriod +'</td>';
			html += '<td width="8%" style="text-align: center;">'+wifi_info.EncryptionMode+'</td>';
			html += '<td width="8%" style="text-align: center;">'+wifi_info.SupportedStandards+'</td>';
			html += '<td width="7%" style="text-align: center;">'+wifi_info.MaxBitRate+'</td>';
			html += '</tr>';
		}
	}
	$("#wifi_list").append(html);
	
    $("#add_item").children().css("background-color", "#eef2f6");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
	
	$("#input_button").attr("disabled", false);
}

function init_new_ui_table(data){
	$("#wifi_list").empty();
	var html = '';
	if ( data && data.wifi_neighbor_info)
	{
		wifi_neighbor_data = data.wifi_neighbor_info.wifi_neighbor_data;
		var i = 0;
		for (i=0; i<wifi_neighbor_data.length; i++)
		{
			var wifi_info = wifi_neighbor_data[i];
			html += '<tr id="add_item" style="color:rgba(255, 255, 255, 0.8)">';
			html += '<td style="text-align: center;">'+ wifi_info.SSID +'</td>';
			html += '<td  style="text-align: center;">'+wifi_info.BSSID +'</td>';
			html += '<td style="text-align: center;">'+wifi_info.Channel+'</td>';
			html += '<td style="text-align: center;">'+wifi_info.SignalStrength+'</td>';
			
			html += '<td  style="text-align: center;">'+wifi_info.Noise+'</td>';
			html += '<td  style="text-align: center;">'+ wifi_info.DTIMPeriod +'</td>';
			html += '<td style="text-align: center;">'+wifi_info.BeaconPeriod +'</td>';
			html += '<td  style="text-align: center;">'+wifi_info.EncryptionMode+'</td>';
			html += '<td style="text-align: center;">'+wifi_info.SupportedStandards+'</td>';
			html += '<td  style="text-align: center;">'+wifi_info.MaxBitRate+'</td>';
			html += '</tr>';
		}
	}
	$("#wifi_list").append(html);
	$("#input_button").attr("disabled", false);
}