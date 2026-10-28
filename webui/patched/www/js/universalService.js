
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_service_info", parseBaseInfo);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_service_info", null, parseBaseInfo);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseBaseInfo(data)
{
	//preconf location info
	if(data.UUID != "" && data.UUID != undefined){
		$("#UUID").html(data.UUID);
	}
	if(data.RegID != "" && data.RegID != undefined){
		$("#RegID").html(data.RegID);
	}
	if(data.MgtURL != "" && data.MgtURL != undefined){
		$("#MgtURL").html(data.MgtURL);
	}
	if(data.MgtURLBU != "" && data.MgtURLBU != undefined){
		$("#MgtURLBU").html(data.MgtURLBU);
	}
	if(data.ReportURL != "" && data.ReportURL != undefined){
		$("#ReportURL").html(data.ReportURL);
	}
	if(data.ReportURLBU != "" && data.ReportURLBU != undefined){
		$("#ReportURLBU").html(data.ReportURLBU);
	}
	if(data.ReportCyc != "" && data.ReportCyc != undefined){
		$("#ReportCyc").html(data.ReportCyc);
	}
	if(data.TaskCyc != "" && data.TaskCyc != undefined){
		$("#TaskCyc").html(data.TaskCyc/60);
	}
	if(data.SpeedURL != "" && data.SpeedURL != undefined){
		$("#SpeedURL").html(data.SpeedURL);
	}
	if(data.SpeedURLBU != "" && data.SpeedURLBU != undefined){
		$("#SpeedURLBU").html(data.SpeedURLBU);
	}
	if(data.TraceURL != "" && data.TraceURL != undefined){
		$("#TraceURL").html(data.TraceURL);
	}
	if(data.MgtTime != "" && data.MgtTime != undefined){
		$("#MgtTime").html(data.MgtTime);
	}
	
	//gateway location info
	if(data.gwtimestamp != "" && data.gwtimestamp != undefined)
	{
		$("#gwtimestamp").html(data.gwtimestamp);
	 if(data.gwlongitude != "" && data.gwlongitude != undefined){
		$("#gwlongitude").html(transLongitude(data.gwlongitude, 0, 1));
	 } 
	 if(data.gwlatitude != "" && data.gwlatitude != undefined){
		$("#gwlatitude").html(transLongitude(data.gwlatitude, 1, 1));
	 }
	 if(data.gwelevation != "" && data.gwelevation != undefined){
		$("#gwelevation").html(data.gwelevation);
	 }
	 if(data.gwhorizontalerror != "" && data.gwhorizontalerror != undefined){
		$("#gwhorizontalerror").html(data.gwhorizontalerror);
	 }
	 if(data.gwaltitudeerror != "" && data.gwaltitudeerror != undefined){
		$("#gwaltitudeerror").html(data.gwaltitudeerror);
	 }
	 if(data.gwareacode != "" && data.gwareacode != undefined){
		$("#gwareacode").html(data.gwareacode);
	 }
	 if(data.gwtimestamp != "" && data.gwtimestamp != undefined){
		$("#gwtimestamp").html(data.gwtimestamp);
	 }
	 if(data.gwGISDigest != "" && data.gwGISDigest != undefined){
		$("#gwGISDigest").html(data.gwGISDigest);
	 }
    }
	
	//olt location info
	if(data.olttimestamp != "" && data.olttimestamp != undefined){
		$("#olttimestamp").html(data.olttimestamp);
	  if(data.oltlongitude != "" && data.oltlongitude != undefined){
		  $("#oltlongitude").html(transLongitude(data.oltlongitude, 0, 0));
	  }
	  if(data.oltlatitude != "" && data.oltlatitude != undefined){
		  $("#oltlatitude").html(transLongitude(data.oltlatitude, 1, 0));
	  }
	  if(data.oltelevation != "" && data.oltelevation != undefined){
		  $("#oltelevation").html(data.oltelevation);
	  }
	  if(data.olthorizontalerror != "" && data.olthorizontalerror != undefined){
		  $("#olthorizontalerror").html(data.olthorizontalerror);
	  }
	  if(data.oltaltitudeerror != "" && data.oltaltitudeerror != undefined){
		  $("#oltaltitudeerror").html(data.oltaltitudeerror);
	  }
	  if(data.oltareacode != "" && data.oltareacode != undefined){
		  $("#oltareacode").html(data.oltareacode);
	  }
	  if(data.olttimestamp != "" && data.olttimestamp != undefined){
		  $("#olttimestamp").html(data.olttimestamp);
	  }
	  if(data.oltGISDigest != "" && data.oltGISDigest != undefined){
		  $("#oltGISDigest").html(data.oltGISDigest);
	  }
	}
	
	//device info
	//if(data.Manufacturer != "" && data.Manufacturer != undefined){
	//	$("#device_vendor").html(data.Manufacturer);
	$("#device_vendor").html("FH");
	//}
	if(data.operators_code != "" && data.operators_code != undefined){
		$("#device_operator").html(data.operators_code);
	}
	if(data.ModelName != "" && data.ModelName != undefined){
		$("#ModelStr").html(data.ModelName);
	}
	if(data.SerialNumber != "" && data.SerialNumber != undefined){
		$("#SerialNum").html(data.SerialNumber);
	}
	if(data.SoftwareVersion != "" && data.SoftwareVersion != undefined){
		$("#SoftVer").html(data.SoftwareVersion);
	}
	if(data.wanmac != "" && data.wanmac != undefined){
		$("#WANMAC").html(data.wanmac);
	}
	if(data.devmac != "" && data.devmac != undefined){
		$("#DevMAC").html(data.devmac);
	}
	if(data.WANAccessType != "" && data.WANAccessType != undefined){
		$("#Uplink").html(data.WANAccessType);
	}
	
	
	$("#DeviceTime").html(data.date.replace("UTC",""));
	if(data.informstatus != "" && data.informstatus != undefined){
		switch(data.informstatus)
		{
			case '8':
				$("#informFlag").html("上报成功");
				break;
			case '7':
				$("#informFlag").html("上报过程中断");
				break;
			case '6':
				$("#informFlag").html("上报无回应");
				break;
			default:
				$("#informFlag").html("未上报");
				break;
		}
	}	
}

function transLongitude(val, type, infoType)
{
	var longitudeStr = "";
	if(val == "" || val == undefined){
		longitudeStr = "--";
		return longitudeStr;
	}
	if(type == 0)//经度
	{
		if(typeof val == "number"){
			longitudeStr += (val > 0 ? "东经": "西经");
		}else if(typeof val == "string"){
			if(val.charAt(0) == '-'){
				longitudeStr += "西经";
			}else{
				longitudeStr += "东经";
			}
		}
	}else{
		if(typeof val == "number"){
			longitudeStr += (val > 0 ? "北纬": "南纬");
		}else if(typeof val == "string"){
			if(val.charAt(0) == '-'){
				longitudeStr += "南纬";
			}else{
				longitudeStr += "北纬";
			}
		}
	}
	
	if(infoType == 0)//olt
	{
		var valNum;
		if(typeof val == "string"){
			valNum = parseInt(val);
		}else if(typeof val == "number"){
			valNum = val;
		}
		var absVal = Math.abs(valNum);
		longitudeStr += (absVal/100000).toFixed(5).toString();
		
	}
	else{//app
		var valNum;
		if(typeof val == "string"){
			valNum = Math.abs(parseFloat(val));
		}else if(typeof val == "number"){
			valNum = Math.abs(val);
		}
		longitudeStr += valNum.toFixed(5);
	}
	return longitudeStr;
}

