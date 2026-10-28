var collect_count = 0;
var collect_timeout;

function start_send_ubus(){
	show_shadow();
	$("#start_btn").prop("disabled", true);
	$("#div_rst").html("Collecting now, please wait a moment!");
	XHR.get("fault_collect_ubus", null, collect_fault_info);
}

function collect_fault_info(){
	collect_count++;
	XHR.get("collect_fault_info", null, parse_fault_info);
}

function parse_fault_info(data){
	$("#start_btn").prop("disabled", false);
	if(data && data.fileok == "1"){
		$("#div_rst").html("Collection finished!");
		var dynamicHTML = "";
	
		for( var i=1; i<=data.logcount; i++ )
		{
			dynamicHTML +=  eval("data.log" + i) + '&#13;&#10;';
		}
		
		$("#area_info").html(dynamicHTML);
	}else{
		if(collect_count > 10){
			$("#div_rst").html("Collection failed!");
		}else{
			clearTimeout(collect_timeout);
			collect_timeout = setTimeout(collect_fault_info, 2000);
		}
	}
}