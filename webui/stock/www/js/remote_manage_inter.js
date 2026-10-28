$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	show_shadow();
	XHR.poll(gStatusFreshInterval, "get_remote_manage_info", null, initPage);
}

function initPage(data){
	if(data){
		var connect_acs_status = data.connect_acs_status;
		var connect_request_status = data.connect_request_status;
		if(connect_acs_status == 8){
			$("#unsolicited_report_status").html("Reported");
		}else{
			$("#unsolicited_report_status").html("Not reported");
		}
		if(connect_request_status == 2){
			$("#acs_connection_status").html("Connect Success");
		}else if(connect_request_status == 1){
			$("#acs_connection_status").html("Connect Fail");
		}else if(connect_request_status == 0){
			$("#acs_connection_status").html("No remote connection request");
		}
		if(connect_acs_status == 8 && connect_request_status == 2){
			$("#service_provisioning_status").html("Applied");
		}else{
			$("#service_provisioning_status").html("Remote service configuration not applied");
		}
	}
}