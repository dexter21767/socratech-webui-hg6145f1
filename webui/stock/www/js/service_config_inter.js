$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	show_shadow();
	XHR.poll(gStatusFreshInterval, "get_service_config_info", null, initPage);
}

function initPage(data){
	if(data){
		var pon_reg_status = data.pon_reg_status;
		var veip_service_status = data.veip_service_status;
		var connect_acs_status = data.connect_acs_status;
		var connect_request_status = data.connect_request_status;
		if(pon_reg_status == "5"){
			$("#ont_registration_status").html("The ONT is registered with the OLT");
		}else{
			$("#ont_registration_status").html("The ONT is registering with the OLT. Please wait");
		}
		if(veip_service_status == 1){
			$("#olt_service_config_status").html("OLT service configured");
		}
		if(connect_acs_status == 8 && connect_request_status == 2){
			$("#acs_registration_status").html("Already registered to ACS");
		}
	}
}