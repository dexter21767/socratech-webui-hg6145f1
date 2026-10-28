var sessionidstr = "";
var voicedata;
var timeout_test;
var g_action = "";
var g_pots_port = "";
var g_test_count = 0;
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
	}
});


function initPage(getdata)
{
	
	if ( getdata )
	{
		voicedata = getdata;
		setsessionidstr();
	}
	if(voicedata.voice_port_num == 1){
		$("#loop_pots_port option:gt(0)").hide();
		$("#circuit_pots_port option:gt(0)").hide();
	}else if (voicedata.voice_port_num == 2) {
		$("#loop_pots_port option:gt(1)").hide();
		$("#circuit_pots_port option:gt(1)").hide();
	}
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


function recoverStatus(){
	$("#loop_start_btn").prop("disabled", false);
	$("#loop_obtain_btn").prop("disabled", false);
	$("#circuit_start_btn").prop("disabled", false);
	$("#circuit_obtain_btn").prop("disabled", false);
	clearTimeout(timeout_test);
	g_test_count = 0;
}

function initLoopData(){
	$("#loop_test_result").html("Testing......Please wait.");
	clearTimeout(timeout_test);
	g_test_count = 0;
	$("#a_ground_ac_v").html("");
	$("#b_ground_ac_v").html("");
	$("#a_b_ac_vo").html("");
	$("#a_ground_dc_v").html("");
	$("#b_ground_dc_v").html("");
	$("#a_b_dc_v").html("");
	$("#a_g_r").html("");
	$("#b_g_r").html("");
	$("#a_b_r").html("");
	$("#a_g_c").html("");
	$("#b_g_c").html("");
	$("#a_b_c").html("");
	$("#loop_start_btn").prop("disabled", true);
	$("#loop_obtain_btn").prop("disabled", true);
	$("#circuit_start_btn").prop("disabled", true);
	$("#circuit_obtain_btn").prop("disabled", true);
}

function initCircuitData(){
	$("#circuit_test_result").html("Testing......Please wait.");
	clearTimeout(timeout_test);
	g_test_count = 0;
	$("#loop_current_test").html("");
	$("#feed_voltage_test").html("");
	$("#ring_test_result").html("");
	$("#loop_current").html("");
	$("#feed_voltage").html("");
	$("#ring_voltage").html("");
	$("#loop_start_btn").prop("disabled", true);
	$("#loop_obtain_btn").prop("disabled", true);
	$("#circuit_start_btn").prop("disabled", true);
	$("#circuit_obtain_btn").prop("disabled", true);
}

function loop_start_test(){
	initLoopData();
	var pots_port = $("#loop_pots_port").val();
	var test_mode = $("#loop_test_mode").prop("checked")? "1":"2";
	g_action = "loop_test";
	g_pots_port = pots_port;
	var postdata = new Object();
	postdata.action = "loop_test";
	postdata.pots_port = pots_port;
	postdata.test_mode = test_mode;
	postdata.sessionid = sessionidstr;
	XHR.post("start_voip_test", postdata, checkTestResult);
}


function circuit_start_test(){
	initCircuitData();
	var pots_port = $("#circuit_pots_port").val();
	var test_mode = $("#circuit_test_mode").prop("checked")? "1":"2";
	g_action = "circuit_test";
	g_pots_port = pots_port;
	var postdata = new Object();
	postdata.action = "circuit_test";
	postdata.pots_port = pots_port;
	postdata.test_mode = test_mode;
	postdata.sessionid = sessionidstr;
	XHR.post("start_voip_test", postdata, checkTestResult);
}


function checkTestResult(data){
	if(data && data.success == "true"){
		var postdata = new Object();
		postdata.action = data.action;
		postdata.pots_port = data.pots_port;
		XHR.post("get_voip_test_result", postdata, show_test_result);
	}
}

function show_test_result(data){
	if(data && data.success == "true"){
		if(g_test_count > 60){
			recoverStatus();
			alert("voip_diagnosis_failed".i18n());
			return;
		}
		if(data.action == "loop_test"){
			if(data.test_result == "0"){
				setTimeout(function(){
					$("#loop_test_result").html("Test completed. You could get the result.");
					recoverStatus();
				}, 3000);
			}else if(data.test_result == "1"){
				$("#loop_test_result").html("Server error! Please try again!");
				clearTimeout(timeout_test);
				timeout_test = setTimeout(update_test_result, 2000);
			}else{
				$("#loop_test_result").html("Server error! Please try again!");
				clearTimeout(timeout_test);
				timeout_test = setTimeout(update_test_result, 2000);
			}
		}else if(data.action == "circuit_test"){
			if(data.test_result == "0"){
				setTimeout(function(){
					$("#circuit_test_result").html("Test completed. You could get the result.");
					recoverStatus();
				}, 3000);
			}else if(data.test_result == "1"){
				$("#circuit_test_result").html("Server error! Please try again!");
				clearTimeout(timeout_test);
				timeout_test = setTimeout(update_test_result, 2000);
			}else{
				$("#circuit_test_result").html("Server error! Please try again!");
				clearTimeout(timeout_test);
				timeout_test = setTimeout(update_test_result, 2000);
			}
		}
	}else{
		alert("voip_diagnosis_failed".i18n());
		recoverStatus();
		return;
	}
}

function update_test_result(){
	g_test_count++;
	var postdata = new Object();
	postdata.action = g_action;
	postdata.pots_port = g_pots_port;
	XHR.post("get_voip_test_result", postdata, show_test_result);
}



function loop_obtain_result(){
	clearTimeout(timeout_test);
	g_test_count = 0;
	var pots_port = $("#loop_pots_port").val();
	var postdata = new Object();
	postdata.action = "loop_test";
	postdata.pots_port = pots_port;
	XHR.post("get_obtain_result", postdata, show_obtain_result);
}

function circuit_obtain_result(){
	clearTimeout(timeout_test);
	g_test_count = 0;
	var pots_port = $("#circuit_pots_port").val();
	var postdata = new Object();
	postdata.action = "circuit_test";
	postdata.pots_port = pots_port;
	XHR.post("get_obtain_result", postdata, show_obtain_result);
}

function show_obtain_result(data){
	console.log(data);
	if(data && data.success == "true"){
		if(data.action == "loop_test"){
			$("#a_ground_ac_v").html(data.AGroundACVoltage);
			$("#b_ground_ac_v").html(data.BGroundACVoltage);
			$("#a_b_ac_vo").html(data.ABACVoltage);
			$("#a_ground_dc_v").html(data.AGroundDCVoltage);
			$("#b_ground_dc_v").html(data.BGroundDCVoltage);
			$("#a_b_dc_v").html(data.ABDCVoltage);
			$("#a_g_r").html(data.AGroundInsulationResistance);
			$("#b_g_r").html(data.BGroundInsulationResistance);
			$("#a_b_r").html(data.ABInsulationResistance);
			$("#a_g_c").html(data.AGroundCapacitance);
			$("#b_g_c").html(data.BGroundCapacitance);
			$("#a_b_c").html(data.ABCapacitance);
		}else if(data.action == "circuit_test"){
			$("#loop_current_test").html(data.LoopcurrentState);
			$("#feed_voltage_test").html(data.FeederVoltageState);
			$("#ring_test_result").html(data.RingingCurrentVoltageState);
			$("#loop_current").html(data.LoopCurrent);
			$("#feed_voltage").html(data.FeederVoltage);
			$("#ring_voltage").html(data.RingingCurrentVoltage);
		}
	}
}