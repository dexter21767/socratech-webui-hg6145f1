var gCatvNum = gCatv_num;
var device_type = gDevice_type;
var operator_name;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	getData();
	
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/base_info", parseBaseInfo);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_base_info", null, parseBaseInfo);
       if(operator_name == "EG_TELECOM"){
        XHR.get( "get_dongle_info", null, dongleInfo); 
        }
        setInterval(function(){
            if(operator_name == "EG_TELECOM"){
               XHR.get("get_dongle_info", null, dongleInfo); 
            }
        }, 10000);
		if(operator_name == "ECU_CNT" ){
			XHR.get( "get_dongle_info", null, usbInfo); 
			}
			setInterval(function(){
				if(operator_name == "ECU_CNT" ){
				   XHR.get("get_dongle_info", null, usbInfo); 
				}
			}, 10000);
        
	}
}
function usbInfo(data)
{
	$("#tr_usb").show();
    var dongle_info = data.dongle_info;
    console.log(dongle_info);
    for(var i = 0; i<dongle_info.length; i++)
    {
        if(dongle_info[i].Status == "active" )
        {
            $("#usb_status").html("Up");
            break;
        }else 
		{
			$("#usb_status").html("Down");
		}
    }
}

function dongleInfo(data)
{
    $("#tr_dongle").show();
    var dongle_info = data.dongle_info;
    console.log(dongle_info);
    for(var i = 0; i<dongle_info.length; i++)
    {
        if(dongle_info[i].Status == "Up" )
        {
            $("#dongle_status").html("Up");
            break;
        }else if(dongle_info[i].Status == "active")
        {
            $("#dongle_status").html("Connected");
             break;
        }else{
            $("#dongle_status").html("Disconnected");
        }
    }
}

function catvInfo(data)
{
	$("#catv_state").html(data.CATV.PowerStatus);
	$("#catv_received_power").html(data.CATV.TXPower);
	$("#catv_rf_power").html(data.CATV.RfPower);
}

function getpontype(ponmode){
	var result = "GPON";
	switch(ponmode){
		case "0": 
			result = "EPON";
			break;
		case "1":
			result = "GPON";
			break;
		case "2":
			result = "EPON_10G";
			break;
		case "3":
			result = "EPON_10G_S";
			break;
		case "4":
			result = "XGPON";
			break;
		case "5":
			result = "XGSPON";
			break;
		case "6":
			result = "Router";
			break;
		default:
			result = "GPON";
	}
	return result;
}

function parseBaseInfo(data)
{
	 operator_name  = gOperatorName;
	 if(device_type != 1){
		$("#onu_parammeter").hide();
		$("#tr_olt_vendor_id").hide();
	 }else{
		$("#onu_parammeter").show();
		if(operator_name != "EG_TELECOM")
		{
			if(operator_name == "BZ_INTELBRAS")
			{
				if(data.ponmode == 1)//GPON
				{
					$("#tr_olt_vendor_id").show();
					$("#tr_ONU_state").show();
					$("#tr_ONU_regstate").show();
				}
				else
				{	
					$("#tr_olt_vendor_id").hide();
					$("#tr_ONU_state").hide();
					$("#tr_ONU_regstate").hide();
				}
			}
			else
			{
				
				$("#tr_olt_vendor_id").show();
			}
			$("#olt_vendor").html(data.vendor); 
		}
	 }

	 if(gCatvNum == "1"){
		 $("#catv").show();
		 if(data.Enable == 1)
		 {
			 $("#catv_state").html("Enable");
		 }else
		 {
			 $("#catv_state").html("Disable");
		 }
		 var temp;
		  temp = data.TXPower/100;
		 $("#catv_received_power").html(temp.toFixed(2)+"dBm");
		 temp = data.RfPower/100;
		 $("#catv_rf_power").html(temp.toFixed(2)+"dBmV");
	 }else if(gCatvNum == "0"){
		 $("#catv").hide();
	 }
	if(operator_name == "TH_3BB"){
		$("#flash").show();
		$("#flash_rate").html(data.flash_usage+ "%");
	}
	
	if(gOperatorName == "COL_CLARO"){
		$("#tr_manufacturer").show();
		$("#tr_firmware_name").show();
		$("#tr_compile_time").show();
		$("#tr_os_version").show();
		//$("#tr_bandwidth_usage").show();
		$("#tr_transceivertemperature").show();
		$("#tr_supply_voltage").show();
	}
	if(gOperatorName == "TH_AIS")
	{
		$("#tr_uplink_mode").show();
	}
	
	//$("#pontype").html(data.WANAccessType);
	$("#pontype").html(getpontype(data.ponmode));
	if(operator_name == "EG_TELECOM"){
		$("#serial_number").html(data.gponsn);
	}else{
		$("#serial_number").html(data.SerialNumber);
	}
	
	$("#Manufacturer").html(data.Manufacturer);
	$("#firmware_name").html(data.Manufacturer + " atos");
	$("#HardwareVersion").html(data.HardwareVersion);
	$("#SoftwareVersion").html(data.SoftwareVersion);
	$("#SoftCompileTime").html(data.SoftCompileTime);
	
	if(operator_name == "COL_MILLICOM" && data.ModelName == "HG6145F3"){
		$("#ModelName").html("PG5237")
	}else{
		$("#ModelName").html(data.ModelName);
	}

	$("#CPU_rate").html(data.cpu_usage+ "%");
	$("#LOID").html(data.loid_name);
	var pos = data.compile_time.indexOf('PREEMPT');
	$("#compile_time").html(data.compile_time.substr(pos + 8));
	$("#os_version").html(data.os_version);
	$("#transceivertemperature").html(data.transceivertemperature+"℃");
	var secondTime = data.uptime;// 秒
	var minuteTime = 0;// 分
	var hourTime = 0;// 小时
	var dayTime = 0;
	if (secondTime >= 60) {
	    minuteTime = parseInt(secondTime / 60);
	    secondTime = parseInt(secondTime % 60);
	    if (minuteTime >= 60) {
	        hourTime = parseInt(minuteTime / 60);
	        minuteTime = parseInt(minuteTime % 60);
			if(hourTime >= 24){
				dayTime = parseInt(hourTime / 24);
				hourTime = parseInt(hourTime % 24);
			}
	    }
	}
	// if (dayTime <10){
	// 	dayTime = "0" + dayTime;
	// }
	// if (hourTime < 10){
	//     hourTime = "0" + hourTime;
	// }
	// if (secondTime < 10){
	//     secondTime = "0" + secondTime;
	// }
	// if (minuteTime < 10){
	//     minuteTime = "0" + minuteTime;
	// }

	$("#system_uptime").html(dayTime + " d " + hourTime + " h " + minuteTime + " m "  + secondTime+ " s");
    if(operator_name == "TH_AIS")
    {
       $("#mac_addr").html(data.tr069_mac);   
    }else{
      $("#mac_addr").html(data.brmac);  
    }
	
	
	if (data.mem_total != 0)
	{
		var mem_usage = ((data.mem_total-data.mem_free)/data.mem_total*100).toFixed(2);
		$("#mem_rate").html(mem_usage + "%");
	}
	else
	{
		$("#mem_rate").html("0%");
	}

	var pon_reg_state = data.pon_reg_state;
	var loid_reg_state = data.loid_reg_state;
	var ONTStatusVal;
	var ONU_regstateVal;
	switch (pon_reg_state)
	{
		case "1":
			ONTStatusVal = "pon_status_val1".i18n();
			break;
		case "2":
			ONTStatusVal = "pon_status_val2".i18n();
			break;
		case "3":
			ONTStatusVal = "pon_status_val3".i18n();
			break;
		case "4":
			ONTStatusVal = "pon_status_val4".i18n();
			break;
		case "5":
			ONTStatusVal = "pon_status_val5".i18n();
			break;
		case "6":
			ONTStatusVal = "pon_status_val6".i18n();
			break;
		case "7":
			ONTStatusVal = "pon_status_val7".i18n();
			break;
		default:
			ONTStatusVal = "ERROR";
	}
	$("#ONTStatus").html(ONTStatusVal.i18n());

	if (pon_reg_state == "1"){
		ONU_regstateVal = "onu_reg_state_val1".i18n();
	}else if (pon_reg_state == "5"){
		ONU_regstateVal = "onu_reg_state_val5".i18n();
	}else{
		switch (loid_reg_state)
		{
			case "0":
				ONU_regstateVal = "onu_reg_state_val0".i18n();
				break;
			case "1":
				ONU_regstateVal = "onu_reg_state_val1_ok".i18n();
				break;
			case "2":
				ONU_regstateVal = "onu_reg_state_val2".i18n();
				break;
			case "3":
				ONU_regstateVal = "onu_reg_state_val3".i18n();
				break;
			case "4":
				ONU_regstateVal = "onu_reg_state_val4".i18n();
				break;
			default:
				ONTStatusVal = "ERROR";
		}
	}
	$("#ONU_regstate").html(ONU_regstateVal);

	if(operator_name == "TH_AIS")
	{
		var Uplink_Mode;
		var uplink_mode = data.uplink_mode;
		var Lan4_status = data.Lan4_status;
		if(uplink_mode == "dev.pon.1")
		{
			Uplink_Mode = "PON";
		}
		else if(uplink_mode == "dev.eth.4")
		{
			if(Lan4_status != "Up" && gOperatorMode == "3")
			{
				Uplink_Mode = "WIFI";
			}
			else
			{
				Uplink_Mode = "ETH4";
			}
		}
		else 
		{
			Uplink_Mode = uplink_mode;
		}
		$("#uplink_mode").html(Uplink_Mode);
	}
	
	/*if (data.httpsEnable == "1"){
		if(operator_name == "BZ_TIM"){
			$("#server_port").html("4343");
		}else{
			$("#server_port").html("443");
		}
	}else{
		$("#server_port").html(data.web_port);
	}*/
	var protocol = window.location.protocol;
	if(protocol == "https:"){
		$("#server_port").html(data.https_web_port);
	}else if(protocol == "http:"){
		$("#server_port").html(data.web_port);
	}

	if(operator_name == "BZ_INTELBRAS" && data.ponmode == 1)
	{	
		$("#tr_onur_id").show();
		$("#onu_id").html(data.onu_id);
	}

	if(operator_name == "MEX_TELMEX"){
		if(data.default_key_2G == 1 || data.default_key_5G == 1){
			alert("change_pwd_alert".i18n());
		}
	}
	if(operator_name == "MEX_MEGA" && gLoginUser == 0)//common user
	{
		$("#tr_softver").hide();
	}
}
