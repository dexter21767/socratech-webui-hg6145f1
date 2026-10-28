var ethernet_data;

$(document).ready(function(){
	//优化滚动条，无需改动
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
        
		XHR.get( "getEthernetPortsSeting_info", null, initPage);
	}
}

function initPage(data)
{  
   ethernet_data = data; 
   if ( data && data.ethernet_ports_info)
   {
     for (var i=0; i<data.ethernet_ports_info.ethernet_ports_data.length; i++)
     {
         var ethernet_ports = data.ethernet_ports_info.ethernet_ports_data[i];
         setCheckbox("etherernetPort_enable_checkbox_"+ethernet_ports.ethernet_ports_index, ethernet_ports.Enable)
         $("#mode_select_"+ethernet_ports.ethernet_ports_index).val(ethernet_ports.DuplexMode);
         $("#speed_select_"+ethernet_ports.ethernet_ports_index).val(ethernet_ports.MaxBitRate);
     }
   }
    pause_back();
}



function save_apply()
{
	pause();
	var postdata = new Object();
   for (var i=1; i<=ethernet_data.ethernet_ports_info.lan_port_num; i++ )
   { 
    if($("#etherernetPort_enable_checkbox_"+i).prop("checked")){
       postdata["enable" + i] = 1; 
    }else{
       postdata["enable" + i] = 0;  
    }
   	postdata["mode" + i] = $("#mode_select_" + i).val();
    postdata["speed" + i] = $("#speed_select_" + i).val();
   }
	XHR.post("setEthernetPortsSeting_info", postdata, initPage);
    
}



