var sessionidstr = "";
var voicedata;
var g_pots_port = 1;
var operator_name = gOperatorName;
var login_user = gLoginUser;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_base", initPage);
	}
	else
	{
		XHR.get("get_voice_enable_info", null, initPage);
		XHR.get("get_voice_record", null, parseGetData);
	}
});

function parseGetData(data)
{
	var html = "";
	$("#logtable").empty();

	if ( data && data.voice_record_info)
	{
		var j = 0;
		for (var i=0; i<data.voice_record_info.voice_record_data.length; i++)
		{
			var voice_record_data = data.voice_record_info.voice_record_data[i];
			var temp = voice_record_data.type == 0? "Register":"Call";
			var row = voice_record_data.date + " " + voice_record_data.time + "  Port " + voice_record_data.port + " " + temp + "  response code: " + voice_record_data.code + "&#13;&#10;";
			html += row;
		}
	}
	$("#logtable").append(html);
}

function initPage(getdata)
{
	
	if ( getdata )
	{
		voicedata = getdata;
		setsessionidstr();
	}
	if(voicedata.voice_port_num == 1){
		$("#pots_port option:gt(0)").hide();
	}else if (voicedata.voice_port_num == 2) {
		$("#pots_port option:gt(1)").hide();
	}
	$("#pots_port").change();
}


function setsessionidstr(){
	if ( voicedata.sessionid != undefined )
	{
		sessionidstr = voicedata.sessionid;
	}
	else
	{
		XHR.get("get_login_user", null, function(getdata){
			if ( getdata.sessionid != undefined )
			{
				sessionidstr = getdata.sessionid;
			}
		});
	}
}

function portChange(that){
	g_pots_port = $(that).val();
}

function updateSta(){
	$("#update_sta").prop("disabled", true);
	$("#reset_sta").prop("disabled", true);
	show_shadow();
	var postdata = new Object();
	postdata.action = "update";
	postdata.pots_port = g_pots_port;
	postdata.sessionid = sessionidstr;
	XHR.post("set_voice_statistics", postdata, parseUpdate);
}

function parseUpdate(data){
	$("#statistics_List").empty();
	var cur_time = dateTime2str(new Date(),"yyyy-MM-dd hh:mm:ss");
	if(data && data.send != undefined && data.receive != undefined && data.delay != undefined && data.jitter != undefined && data.loss != undefined && data.remoteip != undefined){
		if(data.send == 0 && data.receive == 0){
			alert("There is no voice call.");
		}else{
			$("#statistics_List").append("<tr><td>1</td><td>"+cur_time+"</td><td>"+data.send+"</td><td>"+data.receive+"</td><td>"+data.delay+"</td><td>"+data.jitter+"</td><td>"+data.loss+"</td><td>"+data.remoteip+"</td></tr>");
		}
	}else{
		console.log("return error data!");
	}
	$("#update_sta").prop("disabled", false);
	$("#reset_sta").prop("disabled", false);
}

function dateTime2str(dateTime, format) {
	var z = {
		y: dateTime.getFullYear(),
		M: dateTime.getMonth() + 1,
		d: dateTime.getDate(),
		h: dateTime.getHours(),
		m: dateTime.getMinutes(),
		s: dateTime.getSeconds()
	};
	return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
		return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
	});
}

function resetSta(){
	$("#update_sta").prop("disabled", true);
	$("#reset_sta").prop("disabled", true);
	show_shadow();
	var postdata = new Object();
	postdata.action = "reset";
	postdata.pots_port = g_pots_port;
	postdata.sessionid = sessionidstr;
	XHR.post("set_voice_statistics", postdata, parseResetData);
}

function parseResetData(){
	$("#statistics_List").empty();
	$("#update_sta").prop("disabled", false);
	$("#reset_sta").prop("disabled", false);
}