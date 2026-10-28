var sessionidstr = "";
var voicedata;
var port_num;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	//initValidate();
	if(gNewUiFlag){
		$(".table_left").css("height","44px")
		$(".select").css("height","32px")
		$(".input_text").css("height","32px")
	}
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	$("input:checkbox").bind("click", function(){
		displayControl();
	});
	
	if(operator_name == "ARG_CLARO"){
		$("option[value='g723']").hide();
		$("#port1_5").hide();
		$("#port2_5").hide();
		$("#port3_5").hide();
		$("#port4_5").hide();
	}

	if(operator_name == "MEX_MEGA")
	{
		$("#AMR_pri1").show();
		$("#G729B_pri1").show();
		$("#AMR_pri2").show();
		$("#G729B_pri2").show();
		$("#AMR_pri3").show();
		$("#G729B_pri3").show();
		$("#AMR_pri4").show();
		$("#G729B_pri4").show();
		$("#AMR_pri5").show();
		$("#G729B_pri5").show();
	}

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
		if(gNewUiFlag)
			$("#port_2_title").hide();
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
			var g711u = voicedata[i].g711u_Priority + "_" + voicedata[i].g711u_PacketizationPeriod + "_g711u";
			arrayObj.push(g711u);
			var g711a = voicedata[i].g711a_Priority + "_" + voicedata[i].g711a_PacketizationPeriod + "_g711a";
			arrayObj.push(g711a);
			var g729 = voicedata[i].g729_Priority + "_" + voicedata[i].g729_PacketizationPeriod + "_g729";
			arrayObj.push(g729);
			var g723 = voicedata[i].g723_Priority + "_" + voicedata[i].g723_PacketizationPeriod + "_g723";
			arrayObj.push(g723);
			var g722 = voicedata[i].g722_Priority + "_" + voicedata[i].g722_PacketizationPeriod + "_g722";
			arrayObj.push(g722);

			if(operator_name == "MEX_MEGA")
			{
				var AMR = voicedata[i].AMR_Priority + "_" + voicedata[i].AMR_PacketizationPeriod + "_AMR";
				arrayObj.push(AMR);
				var G729B = voicedata[i].G729B_Priority + "_" + voicedata[i].G729B_PacketizationPeriod + "_G729B";
				arrayObj.push(G729B);
			}

			var newarrayObj = new Array("_20_", "_20_", "_20_", "_20_", "_20_");
			for (var n=0; n<arrayObj.length; n++)
			{
				if (arrayObj[n].split("_")[0] == 1)
				{
					newarrayObj[0] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[0] == 2)
				{
					newarrayObj[1] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[0] == 3)
				{
					newarrayObj[2] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[0] == 4)
				{
					newarrayObj[3] = arrayObj[n];
				}
				if (arrayObj[n].split("_")[0] == 5)
				{
					newarrayObj[4] = arrayObj[n];
				}

			}

			for (var j=0; j<newarrayObj.length; j++)
			{
				var valueArr = newarrayObj[j].split("_");

				var codecId = "voip" + (i+1) + "_pri" + (j+1) + "codec";
				$("#" + codecId).val(valueArr[2]);
				
				var IntervalId = "voip" + (i+1) + "PackageInterval" + (j+1);
				$("#" + IntervalId).val(valueArr[1]);
			}
		}
	}
}

function repeatHandel(array, flg)
{
	var saveArray = new Array();
	for (var o=0; o<array.length; o++){
		saveArray.push(array[o]);
	}

	var wrongdata;
	var sortarr = array.sort();
	var wrongdataArr = [];

	for (var i=0; i<(sortarr.length - 1); i++)
	{
		if ((sortarr[i] == sortarr[i+1]) && (sortarr[i] != "")){
			wrongdata = sortarr[i];
			wrongdataArr.push(wrongdata);
			
		}
	}

	if (wrongdataArr.length == 0)
	{
		return 0;
	}

	if (gNewUiFlag)
        myAlert('Tip', '' + "codingrepeat".i18n() + '', function() { })
	else
	alert("codingrepeat".i18n());
	for  (var m=0; m<wrongdataArr.length; m++)
	{
		for (var j=0; j<saveArray.length; j++)
		{
			if (saveArray[j] == wrongdataArr[m])
			{
				//main_item_error_hint
				//$("#voip"+flg+"_pri"+(j+1)+"codec").val("");
				$("#voip"+flg+"_pri"+(j+1)+"codec").addClass("main_item_error_hint")
			}
		}
	}

	return 1;
}

function saveApply()
{
	show_shadow();
    var postdata = new Object();
    for (var i = 1; i <= port_num; i++) {
        for (var j = 1; j <= 5; j++) {
            var voipkey = "voip" + i + "PackageInterval" + j
            var value = $("#" + voipkey).val();
            if (!valid_Range_Int(value, 10, 60)) {
				if (gNewUiFlag)
					myAlert('Tip', '' + "illegal_Period_value_alert".i18n() + '', function() { })
				else
                    alert("illegal_Period_value_alert".i18n());
                return
            }
        }
    }
	var codec_1_1 = $("#voip1_pri1codec").val();
	var codec_1_2 = $("#voip1_pri2codec").val();
	var codec_1_3 = $("#voip1_pri3codec").val();
	var codec_1_4 = $("#voip1_pri4codec").val();
	var codec_1_5 = $("#voip1_pri5codec").val();
	var arrayObj1 = new Array(codec_1_1, codec_1_2, codec_1_3, codec_1_4, codec_1_5);
	if (repeatHandel(arrayObj1, "1") == 1){
		console.log("wrong");
		return;
	}
	if (port_num >= 2)
	{
		var codec_2_1 = $("#voip2_pri1codec").val();
		var codec_2_2 = $("#voip2_pri2codec").val();
		var codec_2_3 = $("#voip2_pri3codec").val();
		var codec_2_4 = $("#voip2_pri4codec").val();
		var codec_2_5 = $("#voip2_pri5codec").val();
		var arrayObj2 = new Array(codec_2_1, codec_2_2, codec_2_3, codec_2_4, codec_2_5);
		if (repeatHandel(arrayObj2, "2") == 1){
			console.log("wrong");
			return;
		}
	}
	if (port_num >= 3)
	{
		var codec_3_1 = $("#voip3_pri1codec").val();
        var codec_3_2 = $("#voip3_pri2codec").val();
        var codec_3_3 = $("#voip3_pri3codec").val();
        var codec_3_4 = $("#voip3_pri4codec").val();
        var codec_3_5 = $("#voip3_pri5codec").val();
        var arrayObj3 = new Array(codec_3_1, codec_3_2, codec_3_3, codec_3_4, codec_3_5);
        if (repeatHandel(arrayObj3, "3") == 1) {
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
        var arrayObj4 = new Array(codec_4_1, codec_4_2, codec_4_3, codec_4_4, codec_4_5);
        if (repeatHandel(arrayObj4, "4") == 1) {
	        console.log("wrong");
	        return;
        }
	}
	console.log("right");

	var codecval_1_1 = $("#voip1_pri1codec").val() + "_" + $("#voip1PackageInterval1").val() + "_1_1";
	var codecval_1_2 = $("#voip1_pri2codec").val() + "_" + $("#voip1PackageInterval2").val() + "_1_2";
	var codecval_1_3 = $("#voip1_pri3codec").val() + "_" + $("#voip1PackageInterval3").val() + "_1_3";
	var codecval_1_4 = $("#voip1_pri4codec").val() + "_" + $("#voip1PackageInterval4").val() + "_1_4";
	var codecval_1_5 = $("#voip1_pri5codec").val() + "_" + $("#voip1PackageInterval5").val() + "_1_5";
	var codecvalarray1 = new Array(codecval_1_1, codecval_1_2, codecval_1_3, codecval_1_4, codecval_1_5);
	console.log(codecvalarray1);
	
	if (port_num >= 2)
	{
		var codecval_2_1 = $("#voip2_pri1codec").val() + "_" + $("#voip2PackageInterval1").val() + "_2_1";
		var codecval_2_2 = $("#voip2_pri2codec").val() + "_" + $("#voip2PackageInterval2").val() + "_2_2";
		var codecval_2_3 = $("#voip2_pri3codec").val() + "_" + $("#voip2PackageInterval3").val() + "_2_3";
		var codecval_2_4 = $("#voip2_pri4codec").val() + "_" + $("#voip2PackageInterval4").val() + "_2_4";
		var codecval_2_5 = $("#voip2_pri5codec").val() + "_" + $("#voip2PackageInterval5").val() + "_2_5";
		var codecvalarray2 = new Array(codecval_2_1, codecval_2_2, codecval_2_3, codecval_2_4, codecval_2_5);
		console.log(codecvalarray2);
	}
	
	if (port_num >= 3)
	{
		var codecval_3_1 = $("#voip3_pri1codec").val() + "_" + $("#voip3PackageInterval1").val() + "_3_1";
	    var codecval_3_2 = $("#voip3_pri2codec").val() + "_" + $("#voip3PackageInterval2").val() + "_3_2";
	    var codecval_3_3 = $("#voip3_pri3codec").val() + "_" + $("#voip3PackageInterval3").val() + "_3_3";
	    var codecval_3_4 = $("#voip3_pri4codec").val() + "_" + $("#voip3PackageInterval4").val() + "_3_4";
	    var codecval_3_5 = $("#voip3_pri5codec").val() + "_" + $("#voip3PackageInterval5").val() + "_3_5";
	    var codecvalarray3 = new Array(codecval_3_1, codecval_3_2, codecval_3_3, codecval_3_4, codecval_3_5);
	    console.log(codecvalarray3);
	}
	
	if (port_num >= 4)
	{
	    var codecval_4_1 = $("#voip4_pri1codec").val() + "_" + $("#voip4PackageInterval1").val() + "_4_1";
	    var codecval_4_2 = $("#voip4_pri2codec").val() + "_" + $("#voip4PackageInterval2").val() + "_4_2";
	    var codecval_4_3 = $("#voip4_pri3codec").val() + "_" + $("#voip4PackageInterval3").val() + "_4_3";
	    var codecval_4_4 = $("#voip4_pri4codec").val() + "_" + $("#voip4PackageInterval4").val() + "_4_4";
	    var codecval_4_5 = $("#voip4_pri5codec").val() + "_" + $("#voip4PackageInterval5").val() + "_4_5";
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
	postdata.g729_Enable_1 = 0;
	postdata.g729_Priority_1 = "";
	postdata.g729_PacketizationPeriod_1 = 20;
	postdata.g723_Enable_1 = 0;
	postdata.g723_Priority_1 = "";
	postdata.g723_PacketizationPeriod_1 = 20;
	postdata.g722_Enable_1 = 0;
	postdata.g722_Priority_1 = "";
	postdata.g722_PacketizationPeriod_1 = 20;

	if(operator_name == "MEX_MEGA")
	{
		postdata.AMR_Enable_1 = 0;
		postdata.AMR_Priority_1 = "";
		postdata.AMR_PacketizationPeriod_1 = 20;
		postdata.G729B_Enable_1 = 0;
		postdata.G729B_Priority_1 = "";
		postdata.G729B_PacketizationPeriod_1 = 20;
	}
	
	if(port_num >= 2)
	{
		postdata.g711u_Enable_2 = 0;
		postdata.g711u_Priority_2 = "";
		postdata.g711u_PacketizationPeriod_2 = 20;
		postdata.g711a_Enable_2 = 0;
		postdata.g711a_Priority_2 = "";
		postdata.g711a_PacketizationPeriod_2 = 20;
		postdata.g729_Enable_2 = 0;
		postdata.g729_Priority_2 = "";
		postdata.g729_PacketizationPeriod_2 = 20;
		postdata.g723_Enable_2 = 0;
		postdata.g723_Priority_2 = "";
		postdata.g723_PacketizationPeriod_2 = 20;
		postdata.g722_Enable_2 = 0;
		postdata.g722_Priority_2 = "";
		postdata.g722_PacketizationPeriod_2 = 20;
	}
	
	if(port_num >= 3)
	{
		postdata.g711u_Enable_3 = 0;
	    postdata.g711u_Priority_3 = "";
	    postdata.g711u_PacketizationPeriod_3 = 20;
	    postdata.g711a_Enable_3 = 0;
	    postdata.g711a_Priority_3 = "";
	    postdata.g711a_PacketizationPeriod_3 = 20;
	    postdata.g729_Enable_3 = 0;
	    postdata.g729_Priority_3 = "";
	    postdata.g729_PacketizationPeriod_3 = 20;
	    postdata.g723_Enable_3 = 0;
	    postdata.g723_Priority_3 = "";
	    postdata.g723_PacketizationPeriod_3 = 20;
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
	    postdata.g729_Enable_4 = 0;
	    postdata.g729_Priority_3 = "";
	    postdata.g729_PacketizationPeriod_4 = 20;
	    postdata.g723_Enable_4 = 0;
	    postdata.g723_Priority_4 = "";
	    postdata.g723_PacketizationPeriod_4 = 20;
	    postdata.g722_Enable_4 = 0;
	    postdata.g722_Priority_4 = "";
	    postdata.g722_PacketizationPeriod_4 = 20;
	}
	for (var i=0; i<codecvalarray1.length; i++)
	{
		var Identify = codecvalarray1[i].split("_");
		if (Identify[0] == "g711u")
		{
			postdata.g711u_Enable_1 = 1;
			postdata.g711u_Priority_1 = Identify[3];
			postdata.g711u_PacketizationPeriod_1 = Identify[1];
		}

		if (Identify[0] == "g711a")
		{
			postdata.g711a_Enable_1 = 1;
			postdata.g711a_Priority_1 = Identify[3];
			postdata.g711a_PacketizationPeriod_1 = Identify[1];
		}

		if (Identify[0] == "g729")
		{
			postdata.g729_Enable_1 = 1;
			postdata.g729_Priority_1 = Identify[3];
			postdata.g729_PacketizationPeriod_1 = Identify[1];
		}

		if (Identify[0] == "g723")
		{
			postdata.g723_Enable_1 = 1;
			postdata.g723_Priority_1 = Identify[3];
			postdata.g723_PacketizationPeriod_1 = Identify[1];
		}

		if (Identify[0] == "g722")
		{
			postdata.g722_Enable_1 = 1;
			postdata.g722_Priority_1 = Identify[3];
			postdata.g722_PacketizationPeriod_1 = Identify[1];
		}

		if(operator_name == "MEX_MEGA")
		{
			if (Identify[0] == "AMR")
			{
				postdata.AMR_Enable_1 = 1;
				postdata.AMR_Priority_1 = Identify[3];
				postdata.AMR_PacketizationPeriod_1 = Identify[1];
			}

			if (Identify[0] == "G729B")
			{
				postdata.G729B_Enable_1 = 1;
				postdata.G729B_Priority_1 = Identify[3];
				postdata.G729B_PacketizationPeriod_1 = Identify[1];
			}
		}
		
	}

	if(port_num >= 2)
	{
		for (var i=0; i<codecvalarray2.length; i++)
		{
			var Identify = codecvalarray2[i].split("_");
			if (Identify[0] == "g711u")
			{
				postdata.g711u_Enable_2 = 1;
				postdata.g711u_Priority_2 = Identify[3];
				postdata.g711u_PacketizationPeriod_2 = Identify[1];
			}

			if (Identify[0] == "g711a")
			{
				postdata.g711a_Enable_2 = 1;
				postdata.g711a_Priority_2 = Identify[3];
				postdata.g711a_PacketizationPeriod_2 = Identify[1];
			}

			if (Identify[0] == "g729")
			{
				postdata.g729_Enable_2 = 1;
				postdata.g729_Priority_2 = Identify[3];
				postdata.g729_PacketizationPeriod_2 = Identify[1];
			}

			if (Identify[0] == "g723")
			{
				postdata.g723_Enable_2 = 1;
				postdata.g723_Priority_2 = Identify[3];
				postdata.g723_PacketizationPeriod_2 = Identify[1];
			}

			if (Identify[0] == "g722")
			{
				postdata.g722_Enable_2 = 1;
				postdata.g722_Priority_2 = Identify[3];
				postdata.g722_PacketizationPeriod_2 = Identify[1];
			}
		}
	}
	
	if(port_num >= 3)
	{
		for (var i = 0; i < codecvalarray3.length; i++) {
	        var Identify = codecvalarray3[i].split("_");
	        if (Identify[0] == "g711u") {
	            postdata.g711u_Enable_3 = 1;
	            postdata.g711u_Priority_3 = Identify[3];
	            postdata.g711u_PacketizationPeriod_3 = Identify[1];
	        }

	        if (Identify[0] == "g711a") {
	            postdata.g711a_Enable_3 = 1;
	            postdata.g711a_Priority_3 = Identify[3];
	            postdata.g711a_PacketizationPeriod_3 = Identify[1];
	        }

	        if (Identify[0] == "g729") {
	            postdata.g729_Enable_3 = 1;
	            postdata.g729_Priority_3 = Identify[3];
	            postdata.g729_PacketizationPeriod_3 = Identify[1];
	        }

	        if (Identify[0] == "g723") {
	            postdata.g723_Enable_3 = 1;
	            postdata.g723_Priority_3 = Identify[3];
	            postdata.g723_PacketizationPeriod_3 = Identify[1];
	        }

	        if (Identify[0] == "g722") {
	            postdata.g722_Enable_3 = 1;
	            postdata.g722_Priority_3 = Identify[3];
	            postdata.g722_PacketizationPeriod_3 = Identify[1];
	        }
	    }
	}
	
	if (port_num >= 4)
	{
	    for (var i = 0; i < codecvalarray4.length; i++) {
	        var Identify = codecvalarray4[i].split("_");
	        if (Identify[0] == "g711u") {
	            postdata.g711u_Enable_4 = 1;
	            postdata.g711u_Priority_4 = Identify[3];
	            postdata.g711u_PacketizationPeriod_4 = Identify[1];
	        }

	        if (Identify[0] == "g711a") {
	            postdata.g711a_Enable_4 = 1;
	            postdata.g711a_Priority_4 = Identify[3];
	            postdata.g711a_PacketizationPeriod_4 = Identify[1];
	        }

	        if (Identify[0] == "g729") {
	            postdata.g729_Enable_4 = 1;
	            postdata.g729_Priority_4 = Identify[3];
	            postdata.g729_PacketizationPeriod_4 = Identify[1];
	        }

	        if (Identify[0] == "g723") {
	            postdata.g723_Enable_4 = 1;
	            postdata.g723_Priority_4 = Identify[3];
	            postdata.g723_PacketizationPeriod_4 = Identify[1];
	        }

	        if (Identify[0] == "g722") {
	            postdata.g722_Enable_4 = 1;
	            postdata.g722_Priority_4 = Identify[3];
	            postdata.g722_PacketizationPeriod_4 = Identify[1];
	        }
	    }
	}
	postdata.sessionid = sessionidstr;

	XHR.post("set_voice_codec_info", postdata, initPage);

}