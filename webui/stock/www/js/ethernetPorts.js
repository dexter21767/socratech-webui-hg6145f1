var fttr_type = gFttr_type;
var operator_name = gOperatorName;
var wanInterface;
var wan_index;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	if(gDevice_type != 1  && gOperatorName != "MY_TM" )
	{
		$("#wan_table").show();
		$("#wan_port_title").show();
	}
	if(gOperatorName != "MY_TM" )
	{
	XHR.get("get_uplink_info", null, function(data) {
		if ( data && data.uplink_info){
			wanInterface = data.uplink_info.uplink_type;
			if(wanInterface.indexOf("dev.eth") > -1){
				wan_index = wanInterface.slice(-1);
			}else if(wanInterface == "dev.wifi.1"){
				wan_index = data.uplink_info.uplink_port
			}
		}
	})	
	}	
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
		XHR.poll(gStatusFreshInterval, "getEthernetPorts_info", null, parseGetData);
	}
}

function parseGetData(data)
{
	//alert(JSON.stringify(data));
	$("#lanInfo_list").empty();
	if(gDevice_type != 1)
		$("#wanInfo_list").empty();
	
	var html = "";
	if ( data && data.ethernet_ports_info)
	{
	    var ethernet_ports_info = data.ethernet_ports_info;

		/*当设备为AP时，不显示WAN口相关数据*/
		var	length = ethernet_ports_info.ethernet_ports_data.length
		for (var i=0; i<length; i++)
		{	
			if(wan_index && i == Number(wan_index) - 1 )
				continue
				
			var ethernet_ports = data.ethernet_ports_info.ethernet_ports_data[i];
			if(gNewUiFlag){
				html += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
			}else{
			html += '<tr class="table_01">';
			}
			html += '<td style="text-align: center;">'+ethernet_ports.ethernet_ports_index+'</td>';
			html += '<td style="text-align: center;">'+ethernet_ports.X_FH_LinkDuplex+'</td>';
			html += '<td style="text-align: center;">'+ethernet_ports.X_FH_LinkSpeed+'</td>';
			html += '<td style="text-align: center;">'+ethernet_ports.Status.i18n() +'</td>';
			if(ethernet_ports.Status == "Up"){
				html += '<td style="text-align: center;">'+ethernet_ports.BytesSent+'</td>';
				html += '<td style="text-align: center;">'+ethernet_ports.PacketsSent+'</td>';
				html += '<td style="text-align: center;">'+ethernet_ports.BytesReceived+'</td>';
				html += '<td style="text-align: center;">'+ethernet_ports.PacketsReceived+'</td>';
			}else{
				html += '<td style="text-align: center;">0</td>';
				html += '<td style="text-align: center;">0</td>';
				html += '<td style="text-align: center;">0</td>';
				html += '<td style="text-align: center;">0</td>';
			}

			html += '</tr>';
		}
		if(gDevice_type != 1 && gOperatorName != "MY_TM" )
		{
			var wan_html = "";
			var wan_port = data.ethernet_ports_info.ethernet_ports_data[ Number(wan_index) - 1]
			if(gNewUiFlag){
				wan_html += '<tr style="color:rgba(255, 255, 255, 0.8);font-size:14px">';
			}else{
				wan_html += '<tr class="table_01">';
			}
			wan_html += '<td style="text-align: center;">'+wan_port.ethernet_ports_index+'</td>';
			wan_html += '<td style="text-align: center;">'+wan_port.X_FH_LinkDuplex+'</td>';
			wan_html += '<td style="text-align: center;">'+wan_port.X_FH_LinkSpeed+'</td>';
			wan_html += '<td style="text-align: center;">'+wan_port.Status.i18n()+'</td>';
			if(wan_port.Status == "Up"){
				wan_html += '<td style="text-align: center;">'+wan_port.BytesSent+'</td>';
				wan_html += '<td style="text-align: center;">'+wan_port.PacketsSent+'</td>';
				wan_html += '<td style="text-align: center;">'+wan_port.BytesReceived+'</td>';
				wan_html += '<td style="text-align: center;">'+wan_port.PacketsReceived+'</td>';
			}else{
				wan_html += '<td style="text-align: center;">0</td>';
				wan_html += '<td style="text-align: center;">0</td>';
				wan_html += '<td style="text-align: center;">0</td>';
				wan_html += '<td style="text-align: center;">0</td>';
			}
		}
		
	}
	$("#lanInfo_list").append(html);
	if(gDevice_type != 1  && gOperatorName != "MY_TM" ){
		$("#wanInfo_list").append(wan_html);
	}
}
