var sessionidstr = "";
var voicedata;
var port_num;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});


	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_advance", initPage);
	}
	else
	{
		XHR.get("get_voice_codec_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_advance_form").validate({
		debug: true,
		rules: {
			"voip1PackageInterval1": {required: true, range_int:[10, 60]},
			"voip1PackageInterval2": {required: true, range_int:[10, 60]},
			"voip1PackageInterval3": {required: true, range_int:[10, 60]},
			"voip1PackageInterval4": {required: true, range_int:[10, 60]},
			"voip1PackageInterval5": {required: true, range_int:[10, 60]},
			"voip2PackageInterval1": {required: true, range_int:[10, 60]},
			"voip2PackageInterval2": {required: true, range_int:[10, 60]},
			"voip2PackageInterval3": {required: true, range_int:[10, 60]},
			"voip2PackageInterval4": {required: true, range_int:[10, 60]},
			"voip2PackageInterval5": {required: true, range_int:[10, 60]},
			"voip3PackageInterval1": {required: true, range_int:[10, 60]},
			"voip3PackageInterval2": {required: true, range_int:[10, 60]},
			"voip3PackageInterval3": {required: true, range_int:[10, 60]},
			"voip3PackageInterval4": {required: true, range_int:[10, 60]},
			"voip3PackageInterval5": {required: true, range_int:[10, 60]},
			"voip4PackageInterval1": {required: true, range_int:[10, 60]},
			"voip4PackageInterval2": {required: true, range_int:[10, 60]},
			"voip4PackageInterval3": {required: true, range_int:[10, 60]},
			"voip4PackageInterval4": {required: true, range_int:[10, 60]},
			"voip4PackageInterval5": {required: true, range_int:[10, 60]}
			
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate voice_advance ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate voice_advance failed.....");
			return false;
		}
	}); 
}

function initPage(getdata)
{
	//判断当前用户为普通用户还是管理员用户
		var login_user = gLoginUser;
		if(operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE"){
			if(login_user == "0"){
			//	alert("当前为泰国TREU的普通用户");
				$("input").attr("disabled", true);
				$("select").attr("disabled", true);		
			}
	}
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}

	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});

	if (getdata.voice_port_num == 1) 
	{
		$("#port_2").hide();
	    $("#port_3").hide();
	    $("#port_4").hide();
	}else if (getdata.voice_port_num == 2) 
	{
	    $("#port_3").hide();
	    $("#port_4").hide();
	}else if (getdata.voice_port_num == 4)
	{
	    $("#port_3").show();
	    $("#port_4").show();
	}


	if (getdata != null && getdata.voice_advance)
	{
	    voicedata = getdata.voice_advance;
	    port_num = voicedata.length;
		for (var i=0; i<voicedata.length; i++)
		{
			var arrayObj = new Array();
			var g711u = voicedata[i].g711u_Enable + "_" + voicedata[i].g711u_Priority + "_" + voicedata[i].g711u_PacketizationPeriod + "_g711u";
			arrayObj.push(g711u);
			var g711a = voicedata[i].g711a_Enable + "_" + voicedata[i].g711a_Priority + "_" + voicedata[i].g711a_PacketizationPeriod + "_g711a";
			arrayObj.push(g711a);
			var g723 = voicedata[i].g723_Enable + "_" + voicedata[i].g723_Priority + "_" + voicedata[i].g723_PacketizationPeriod + "_g723";
			arrayObj.push(g723);
			var g729 = voicedata[i].g729_Enable + "_" + voicedata[i].g729_Priority + "_" + voicedata[i].g729_PacketizationPeriod + "_g729";
			arrayObj.push(g729);
			var g722 = voicedata[i].g722_Enable + "_" + voicedata[i].g722_Priority + "_" + voicedata[i].g722_PacketizationPeriod + "_g722";
			arrayObj.push(g722);

			var newarrayObj = new Array("0_1_20_", "0_2_20_", "0_3_20_", "0_4_20_", "0_5_20_");
			for (var n=0; n<arrayObj.length; n++)
			{
				if (arrayObj[n].split("_")[3] == "g711u")
				{
					newarrayObj[0] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[3] == "g711a")
				{
					newarrayObj[1] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[3] == "g723")
				{
					newarrayObj[2] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[3] == "g729")
				{
					newarrayObj[3] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[3] == "g722")
				{
					newarrayObj[4] = arrayObj[n];
				}

			}

			for (var j=0; j<newarrayObj.length; j++)
			{
				var valueArr = newarrayObj[j].split("_");
				
				var enableId = "voip" + (i+1) + "_enable" + (j+1);
				$("#" + enableId).attr("checked", valueArr[0]=="1"? true:false);
				$("#" + enableId).change();

				var codecId = "voip" + (i+1) + "_pri" + (j+1) + "codec";
				$("#" + codecId).val(valueArr[1]);
				
				var IntervalId = "voip" + (i+1) + "PackageInterval" + (j+1);
				$("#" + IntervalId).val(valueArr[2]);
			}
		}
	}
}

//每个端口至少有一种模式使能，且优先级在1到5之间
function priorityCheck(array1, array2){
	var defaultArray = ['1', '2', '3', '4', '5'];
	var returnValue = 0;
	for(var i=0; i<array1.length; i++){
		if((defaultArray.indexOf(array1[i]) ==  -1) && array2[i]){
			returnValue = -1;
			break;
		}
	}
	if(returnValue == -1){
		alert("priorityError1".i18n());
		return -1;
	}
	for(var i=0; i<array1.length; i++){
		if((defaultArray.indexOf(array1[i]) > -1) && array2[i]){
			returnValue = 2;
			break;
		}
	}
	if(returnValue == 2){
		return 2;
	}else{
		alert("priorityError2".i18n());
		return 1;
	}
}

function repeatHandel(array)
{
	var defaultArray = ['1', '2', '3', '4', '5'];
	var saveArray = new Array();
	for (var o=0; o<array.length; o++){
		saveArray.push(array[o]);
	}

	var wrongdata;
	var sortarr = array.sort();
	var wrongdataArr = [];

	for (var i=0; i<(sortarr.length - 1); i++)
	{
		if ((defaultArray.indexOf(sortarr[i]) > -1) && (defaultArray.indexOf(sortarr[i+1]) > -1) && sortarr[i] == sortarr[i+1]){
			wrongdata = sortarr[i];
			wrongdataArr.push(wrongdata);
			
		}
	}

	if (wrongdataArr.length == 0)
	{
		return 0;
	}

	alert("priorityrepeat".i18n());
	return 1;
}

function saveApply()
{
	show_shadow();
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
    if(!$("#voice_advance_form").valid())
    {
        alert("illegal_value_alert".i18n());
        return;
    }
	
	var codec_1_1 = $("#voip1_pri1codec").val();
	var codec_1_2 = $("#voip1_pri2codec").val();
	var codec_1_3 = $("#voip1_pri3codec").val();
	var codec_1_4 = $("#voip1_pri4codec").val();
	var codec_1_5 = $("#voip1_pri5codec").val();
	
	var enable_1_1 = $("#voip1_enable1").prop("checked");
	var enable_1_2 = $("#voip1_enable2").prop("checked");
	var enable_1_3 = $("#voip1_enable3").prop("checked");
	var enable_1_4 = $("#voip1_enable4").prop("checked");
	var enable_1_5 = $("#voip1_enable5").prop("checked");

	var arrayObj1 = new Array(codec_1_1, codec_1_2, codec_1_3, codec_1_4, codec_1_5);
	var enable_array1 = new Array(enable_1_1, enable_1_2, enable_1_3, enable_1_4, enable_1_5);
	
	if(priorityCheck(arrayObj1, enable_array1) != 2){
		console.log("wrong");
		return;
	}
	
	if (repeatHandel(arrayObj1) == 1){
		console.log("wrong");
		return;
	}
	
	if(port_num >= 2)
	{
		var codec_2_1 = $("#voip2_pri1codec").val();
		var codec_2_2 = $("#voip2_pri2codec").val();
		var codec_2_3 = $("#voip2_pri3codec").val();
		var codec_2_4 = $("#voip2_pri4codec").val();
		var codec_2_5 = $("#voip2_pri5codec").val();
		
		var enable_2_1 = $("#voip2_enable1").prop("checked");
		var enable_2_2 = $("#voip2_enable2").prop("checked");
		var enable_2_3 = $("#voip2_enable3").prop("checked");
		var enable_2_4 = $("#voip2_enable4").prop("checked");
		var enable_2_5 = $("#voip2_enable5").prop("checked");
	
		var arrayObj2 = new Array(codec_2_1, codec_2_2, codec_2_3, codec_2_4, codec_2_5);
		var enable_array2 = new Array(enable_2_1, enable_2_2, enable_2_3, enable_2_4, enable_2_5);
		
		if(priorityCheck(arrayObj2, enable_array2) != 2){
			console.log("wrong");
			return;
		}
		
		if (repeatHandel(arrayObj2) == 1){
			console.log("wrong");
			return;
		}
	}
	if(port_num >= 3)
	{
		var codec_3_1 = $("#voip3_pri1codec").val();
        var codec_3_2 = $("#voip3_pri2codec").val();
        var codec_3_3 = $("#voip3_pri3codec").val();
        var codec_3_4 = $("#voip3_pri4codec").val();
        var codec_3_5 = $("#voip3_pri5codec").val();
		
		var enable_3_1 = $("#voip3_enable1").prop("checked");
		var enable_3_2 = $("#voip3_enable2").prop("checked");
		var enable_3_3 = $("#voip3_enable3").prop("checked");
		var enable_3_4 = $("#voip3_enable4").prop("checked");
		var enable_3_5 = $("#voip3_enable5").prop("checked");
		
        var arrayObj3 = new Array(codec_3_1, codec_3_2, codec_3_3, codec_3_4, codec_3_5);
		var enable_array3 = new Array(enable_3_1, enable_3_2, enable_3_3, enable_3_4, enable_3_5);
		
		if(priorityCheck(arrayObj3, enable_array3) != 2){
			console.log("wrong");
			return;
		}
		
        if (repeatHandel(arrayObj3) == 1) {
	        console.log("wrong");
	        return;
        }
	}
	if (port_num >= 4)
	{
        var codec_4_1 = $("#voip4_pri1codec").val();
        var codec_4_2 = $("#voip4_pri2codec").val();
        var codec_4_3 = $("#voip4_pri3codec").val();
        var codec_4_4 = $("#voip4_pri4codec").val();
        var codec_4_5 = $("#voip4_pri5codec").val();
		
		var enable_4_1 = $("#voip4_enable1").prop("checked");
		var enable_4_2 = $("#voip4_enable2").prop("checked");
		var enable_4_3 = $("#voip4_enable3").prop("checked");
		var enable_4_4 = $("#voip4_enable4").prop("checked");
		var enable_4_5 = $("#voip4_enable5").prop("checked");
		
        var arrayObj4 = new Array(codec_4_1, codec_4_2, codec_4_3, codec_4_4, codec_4_5);
		var enable_array4 = new Array(enable_4_1, enable_4_2, enable_4_3, enable_4_4, enable_4_5);
		
		if(priorityCheck(arrayObj4, enable_array4) != 2){
			console.log("wrong");
			return;
		}
		
        if (repeatHandel(arrayObj4) == 1) {
	        console.log("wrong");
	        return;
        }
	}
	console.log("right");

	var codecval_1_1 = ($("#voip1_enable1").prop("checked")?"1":"0") + "_" + $("#voip1_pri1codec").val() + "_" + $("#voip1PackageInterval1").val() + "_1_g711u";
	var codecval_1_2 = ($("#voip1_enable2").prop("checked")?"1":"0") + "_" + $("#voip1_pri2codec").val() + "_" + $("#voip1PackageInterval2").val() + "_1_g711a";
	var codecval_1_3 = ($("#voip1_enable3").prop("checked")?"1":"0") + "_" + $("#voip1_pri3codec").val() + "_" + $("#voip1PackageInterval3").val() + "_1_g723";
	var codecval_1_4 = ($("#voip1_enable4").prop("checked")?"1":"0") + "_" + $("#voip1_pri4codec").val() + "_" + $("#voip1PackageInterval4").val() + "_1_g729";
	var codecval_1_5 = ($("#voip1_enable5").prop("checked")?"1":"0") + "_" + $("#voip1_pri5codec").val() + "_" + $("#voip1PackageInterval5").val() + "_1_g722";
	var codecvalarray1 = new Array(codecval_1_1, codecval_1_2, codecval_1_3, codecval_1_4, codecval_1_5);
	console.log(codecvalarray1);
	
	if (port_num >= 2)
	{
		var codecval_2_1 = ($("#voip2_enable1").prop("checked")?"1":"0") + "_" + $("#voip2_pri1codec").val() + "_" + $("#voip2PackageInterval1").val() + "_2_g711u";
		var codecval_2_2 = ($("#voip2_enable2").prop("checked")?"1":"0") + "_" + $("#voip2_pri2codec").val() + "_" + $("#voip2PackageInterval2").val() + "_2_g711a";
		var codecval_2_3 = ($("#voip2_enable3").prop("checked")?"1":"0") + "_" + $("#voip2_pri3codec").val() + "_" + $("#voip2PackageInterval3").val() + "_2_g723";
		var codecval_2_4 = ($("#voip2_enable4").prop("checked")?"1":"0") + "_" + $("#voip2_pri4codec").val() + "_" + $("#voip2PackageInterval4").val() + "_2_g729";
		var codecval_2_5 = ($("#voip2_enable5").prop("checked")?"1":"0") + "_" + $("#voip2_pri5codec").val() + "_" + $("#voip2PackageInterval5").val() + "_2_g722";
		var codecvalarray2 = new Array(codecval_2_1, codecval_2_2, codecval_2_3, codecval_2_4, codecval_2_5);
		console.log(codecvalarray2);
	}
	
	if (port_num >= 3)
	{
		var codecval_3_1 = ($("#voip3_enable1").prop("checked")?"1":"0") + "_" + $("#voip3_pri1codec").val() + "_" + $("#voip3PackageInterval1").val() + "_3_g711u";
	    var codecval_3_2 = ($("#voip3_enable2").prop("checked")?"1":"0") + "_" + $("#voip3_pri2codec").val() + "_" + $("#voip3PackageInterval2").val() + "_3_g711a";
	    var codecval_3_3 = ($("#voip3_enable3").prop("checked")?"1":"0") + "_" + $("#voip3_pri3codec").val() + "_" + $("#voip3PackageInterval3").val() + "_3_g723";
	    var codecval_3_4 = ($("#voip3_enable4").prop("checked")?"1":"0") + "_" + $("#voip3_pri4codec").val() + "_" + $("#voip3PackageInterval4").val() + "_3_g729";
	    var codecval_3_5 = ($("#voip3_enable5").prop("checked")?"1":"0") + "_" + $("#voip3_pri5codec").val() + "_" + $("#voip3PackageInterval5").val() + "_3_g722";
	    var codecvalarray3 = new Array(codecval_3_1, codecval_3_2, codecval_3_3, codecval_3_4, codecval_3_5);
	    console.log(codecvalarray3);
	}
	
	if (port_num >= 4)
	{
	    var codecval_4_1 = ($("#voip4_enable1").prop("checked")?"1":"0") + "_" + $("#voip4_pri1codec").val() + "_" + $("#voip4PackageInterval1").val() + "_4_g711u";
	    var codecval_4_2 = ($("#voip4_enable2").prop("checked")?"1":"0") + "_" + $("#voip4_pri2codec").val() + "_" + $("#voip4PackageInterval2").val() + "_4_g711a";
	    var codecval_4_3 = ($("#voip4_enable3").prop("checked")?"1":"0") + "_" + $("#voip4_pri3codec").val() + "_" + $("#voip4PackageInterval3").val() + "_4_g723";
	    var codecval_4_4 = ($("#voip4_enable4").prop("checked")?"1":"0") + "_" + $("#voip4_pri4codec").val() + "_" + $("#voip4PackageInterval4").val() + "_4_g729";
	    var codecval_4_5 = ($("#voip4_enable5").prop("checked")?"1":"0") + "_" + $("#voip4_pri5codec").val() + "_" + $("#voip4PackageInterval5").val() + "_4_g722";
	    var codecvalarray4 = new Array(codecval_4_1, codecval_4_2, codecval_4_3, codecval_4_4, codecval_4_5);
	    console.log(codecvalarray4);
	}
	var postdata = new Object();
	postdata.g711u_Enable_1 = 0;
	postdata.g711u_Priority_1 = "";
	postdata.g711u_PacketizationPeriod_1 = 20;
	postdata.g711a_Enable_1 = 0;
	postdata.g711a_Priority_1 = "";
	postdata.g711a_PacketizationPeriod_1 = 20;
	postdata.g723_Enable_1 = 0;
	postdata.g723_Priority_1 = "";
	postdata.g723_PacketizationPeriod_1 = 20;
	postdata.g729_Enable_1 = 0;
	postdata.g729_Priority_1 = "";
	postdata.g729_PacketizationPeriod_1 = 20;
	postdata.g722_Enable_1 = 0;
	postdata.g722_Priority_1 = "";
	postdata.g722_PacketizationPeriod_1 = 20;
	
    if(port_num >= 2)
	{
		postdata.g711u_Enable_2 = 0;
		postdata.g711u_Priority_2 = "";
		postdata.g711u_PacketizationPeriod_2 = 20;
		postdata.g711a_Enable_2 = 0;
		postdata.g711a_Priority_2 = "";
		postdata.g711a_PacketizationPeriod_2 = 20;
		postdata.g723_Enable_2 = 0;
		postdata.g723_Priority_2 = "";
		postdata.g723_PacketizationPeriod_2 = 20;
		postdata.g729_Enable_2 = 0;
		postdata.g729_Priority_2 = "";
		postdata.g729_PacketizationPeriod_2 = 20;
		postdata.g722_Enable_2 = 0;
		postdata.g722_Priority_2 = "";
		postdata.g722_PacketizationPeriod_2 = 20;
	}
	if (port_num >= 3)
	{
		postdata.g711u_Enable_3 = 0;
	    postdata.g711u_Priority_3 = "";
	    postdata.g711u_PacketizationPeriod_3 = 20;
	    postdata.g711a_Enable_3 = 0;
	    postdata.g711a_Priority_3 = "";
	    postdata.g711a_PacketizationPeriod_3 = 20;
		postdata.g723_Enable_3 = 0;
	    postdata.g723_Priority_3 = "";
	    postdata.g723_PacketizationPeriod_3 = 20;
	    postdata.g729_Enable_3 = 0;
	    postdata.g729_Priority_3 = "";
	    postdata.g729_PacketizationPeriod_3 = 20;
	    postdata.g722_Enable_3 = 0;
	    postdata.g722_Priority_3 = "";
	    postdata.g722_PacketizationPeriod_3 = 20;
	}
	if (port_num >= 4)
	{
	    postdata.g711u_Enable_4 = 0;
	    postdata.g711u_Priority_4 = "";
	    postdata.g711u_PacketizationPeriod_4 = 20;
	    postdata.g711a_Enable_4 = 0;
	    postdata.g711a_Priority_4 = "";
	    postdata.g711a_PacketizationPeriod_4 = 20;
		postdata.g723_Enable_4 = 0;
	    postdata.g723_Priority_4 = "";
	    postdata.g723_PacketizationPeriod_4 = 20;
	    postdata.g729_Enable_4 = 0;
	    postdata.g729_Priority_3 = "";
	    postdata.g729_PacketizationPeriod_4 = 20;
	    postdata.g722_Enable_4 = 0;
	    postdata.g722_Priority_4 = "";
	    postdata.g722_PacketizationPeriod_4 = 20;
	}
	for (var i=0; i<codecvalarray1.length; i++)
	{
		var Identify = codecvalarray1[i].split("_");
		if (Identify[4] == "g711u")
		{
			postdata.g711u_Enable_1 = Identify[0];
			postdata.g711u_Priority_1 = Identify[1];
			postdata.g711u_PacketizationPeriod_1 = Identify[2];
		}

		if (Identify[4] == "g711a")
		{
			postdata.g711a_Enable_1 = Identify[0];
			postdata.g711a_Priority_1 = Identify[1];
			postdata.g711a_PacketizationPeriod_1 = Identify[2];
		}
		
		if (Identify[4] == "g723")
		{
			postdata.g723_Enable_1 = Identify[0];
			postdata.g723_Priority_1 = Identify[1];
			postdata.g723_PacketizationPeriod_1 = Identify[2];
		}

		if (Identify[4] == "g729")
		{
			postdata.g729_Enable_1 = Identify[0];
			postdata.g729_Priority_1 = Identify[1];
			postdata.g729_PacketizationPeriod_1 = Identify[2];
		}

		if (Identify[4] == "g722")
		{
			postdata.g722_Enable_1 = Identify[0];
			postdata.g722_Priority_1 = Identify[1];
			postdata.g722_PacketizationPeriod_1 = Identify[2];
		}
	}
	if(port_num >= 2)
	{
		for (var i=0; i<codecvalarray2.length; i++)
		{
			var Identify = codecvalarray2[i].split("_");
			if (Identify[4] == "g711u")
			{
				postdata.g711u_Enable_2 = Identify[0];
				postdata.g711u_Priority_2 = Identify[1];
				postdata.g711u_PacketizationPeriod_2 = Identify[2];
			}

			if (Identify[4] == "g711a")
			{
				postdata.g711a_Enable_2 = Identify[0];
				postdata.g711a_Priority_2 = Identify[1];
				postdata.g711a_PacketizationPeriod_2 = Identify[2];
			}
			
			if (Identify[4] == "g723")
			{
				postdata.g723_Enable_2 = Identify[0];
				postdata.g723_Priority_2 = Identify[1];
				postdata.g723_PacketizationPeriod_2 = Identify[2];
			}

			if (Identify[4] == "g729")
			{
				postdata.g729_Enable_2 = Identify[0];
				postdata.g729_Priority_2 = Identify[1];
				postdata.g729_PacketizationPeriod_2 = Identify[2];
			}

			if (Identify[4] == "g722")
			{
				postdata.g722_Enable_2 = Identify[0];
				postdata.g722_Priority_2 = Identify[1];
				postdata.g722_PacketizationPeriod_2 = Identify[2];
			}
		}
	}
	if (port_num >= 3)
	{
	    for (var i = 0; i < codecvalarray3.length; i++) {
	        var Identify = codecvalarray3[i].split("_");
	        if (Identify[4] == "g711u") {
	            postdata.g711u_Enable_3 = Identify[0];
	            postdata.g711u_Priority_3 = Identify[1];
	            postdata.g711u_PacketizationPeriod_3 = Identify[2];
	        }

	        if (Identify[4] == "g711a") {
	            postdata.g711a_Enable_3 = Identify[0];
	            postdata.g711a_Priority_3 = Identify[1];
	            postdata.g711a_PacketizationPeriod_3 = Identify[2];
	        }

			if (Identify[4] == "g723") {
	            postdata.g723_Enable_3 = Identify[0];
	            postdata.g723_Priority_3 = Identify[1];
	            postdata.g723_PacketizationPeriod_3 = Identify[2];
	        }
			
	        if (Identify[4] == "g729") {
	            postdata.g729_Enable_3 = Identify[0];
	            postdata.g729_Priority_3 = Identify[1];
	            postdata.g729_PacketizationPeriod_3 = Identify[2];
	        }

	        if (Identify[4] == "g722") {
	            postdata.g722_Enable_3 = Identify[0];
	            postdata.g722_Priority_3 = Identify[1];
	            postdata.g722_PacketizationPeriod_3 = Identify[2];
	        }
	    }
	}
	if (port_num >= 4)
	{
		for (var i = 0; i < codecvalarray4.length; i++) {
	        var Identify = codecvalarray4[i].split("_");
	        if (Identify[4] == "g711u") {
	            postdata.g711u_Enable_4 = Identify[0];
	            postdata.g711u_Priority_4 = Identify[1];
	            postdata.g711u_PacketizationPeriod_4 = Identify[2];
	        }

	        if (Identify[4] == "g711a") {
	            postdata.g711a_Enable_4 = Identify[0];
	            postdata.g711a_Priority_4 = Identify[1];
	            postdata.g711a_PacketizationPeriod_4 = Identify[2];
	        }
			
			if (Identify[4] == "g723") {
	            postdata.g723_Enable_4 = Identify[0];
	            postdata.g723_Priority_4 = Identify[1];
	            postdata.g723_PacketizationPeriod_4 = Identify[2];
	        }

	        if (Identify[4] == "g729") {
	            postdata.g729_Enable_4 = Identify[0];
	            postdata.g729_Priority_4 = Identify[1];
	            postdata.g729_PacketizationPeriod_4 = Identify[2];
	        }

	        if (Identify[4] == "g722") {
	            postdata.g722_Enable_4 = Identify[0];
	            postdata.g722_Priority_4 = Identify[1];
	            postdata.g722_PacketizationPeriod_4 = Identify[2];
	        }
	    }
	}
	postdata.sessionid = sessionidstr;

	XHR.post("set_voice_codec_info", postdata, initPage);

}

function changeEnable(that){
	if($(that).prop("checked"))
	{
		$(that).parent("td").siblings("td").find("select").prop("disabled", false);
		$(that).parent("td").siblings("td").find("input").prop("disabled", false);
	}else{
		$(that).parent("td").siblings("td").find("select").prop("disabled", true);
		$(that).parent("td").siblings("td").find("input").prop("disabled", true);
	}
}