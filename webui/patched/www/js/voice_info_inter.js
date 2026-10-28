var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_status", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_voice_status", null, parseGetData);
	}
}

function parseGetData(data)
{
	var dynamicHTML = [];
	var voice_data = data.voice_status;
	for (var i=1; i<=voice_data.voice_port_num; i++){
		if(gNewUiFlag)
			dynamicHTML +='<tr class="table_content" style="text-align: center;color:rgba(255, 255, 255, 0.8)"><td>'+i+'</td>';
		else
		    dynamicHTML +='<tr class="table_01" style="text-align: center;"><td>'+i+'</td>';
		var RegStatus = eval("voice_data.RegAndCallStatus" + i);
		var statuscode;
		if (RegStatus == 0){
			status = "INACTIVE".i18n();
		}else if(RegStatus == 1){
			status = "REGING".i18n();
		}else if(RegStatus == 2){
			status = "IDLE".i18n();
		}else if(RegStatus == 3){
			status = "OFF_HOOK".i18n();
		}else if(RegStatus == 4){
			status = "DIALING".i18n();
		}else if(RegStatus == 5){
			status = "RING".i18n();
		}else if(RegStatus == 6){
			status = "RINGBACK".i18n();
		}else if(RegStatus == 7){
			status = "CONNECTING".i18n();
		}else if(RegStatus == 8){
			status = "CONNECTED".i18n();
		}else if(RegStatus == 9){
			status = "ON_HOOK".i18n();
		}else if(RegStatus == 10){
			status = "DISCONNECTING".i18n();
		}else if(RegStatus == 11){
			status = "BUSY".i18n();
		}else if(RegStatus == 12){
			status = "REG_FAIL".i18n();
		}else if(RegStatus == 13){
			status = "LINE_FAIL".i18n();
		}else if(RegStatus == 14){
			status = "NOT_FOUND".i18n();
		}else if(RegStatus == 15){
			status = "AUTH".i18n();
		}else if(RegStatus == 16){
			status = "NO_RESPONSE".i18n();
		}else if(RegStatus == 17){
			status = "IP_CONFIG".i18n();
		}
		dynamicHTML += '<td>'+status+'</td>';
		if (voice_data.ServerType == "2")
		{
			dynamicHTML +='<td></td></tr>';
		}
		else
		{
			if(operator_name == "COL_MILLICOM"){
				var temp_num = eval("voice_data.URI" + i);
			}else{
				var temp_num = eval("voice_data.DirectoryNumber" + i);
				if (temp_num == "")
				{
					temp_num = eval("voice_data.AuthUserName" + i).split("@")[0];
				}
			}
		    dynamicHTML += '<td>' + temp_num + '</td></tr>';
		}
	}
	$("#voice_info").html(dynamicHTML);
}
