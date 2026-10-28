var ntpServerNumber = 3;
var operator_name = gOperatorName;
var StartTime;
var EndTime;
var MonthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
var WeekIndexArray = ["1st","2nd","3rd","4th","last"]
var WeekDayArray = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
function initZoneHtml()
{

	var ntpzone = '<option value="-12:00" id="GMTm12title">'+"GMTm12title".i18n()+'</option>' +
		'<option value="-11:00" id="GMTm11title">'+"GMTm11title".i18n()+'</option>' +
		'<option value="-10:00" id="GMTm10title">'+"GMTm10title".i18n()+'</option>' +
		'<option value="-09:00" id="GMTm9title">'+"GMTm9title".i18n()+'</option>' +
		'<option value="-08:00" id="GMTm8title">'+"GMTm8title".i18n()+'</option>' +
		'<option value="-07:00" id="GMTm7title">'+"GMTm7title".i18n()+'</option>' +
		'<option value="-06:00" id="GMTm6title">'+"GMTm6title".i18n()+'</option>' +
		'<option value="-05:00" id="GMTm5title">'+"GMTm5title".i18n()+'</option>' +
		'<option value="-04:00" id="GMTm4title">'+"GMTm4title".i18n()+'</option>';
		if(operator_name == "ARG_CLARO"){
			ntpzone += '<option value="-03:00" id="GMTm3title">'+"GMTm3title_arg".i18n()+'</option>';
		}else{
			ntpzone += '<option value="-03:00" id="GMTm3title">'+"GMTm3title".i18n()+'</option>';
		}
		ntpzone += '<option value="-02:00" id="GMTm2title">'+"GMTm2title".i18n()+'</option>' +
		'<option value="-01:00" id="GMTm1title">'+"GMTm1title".i18n()+'</option>' +
		'<option value="00:00" id="GMT0title">'+"GMT0title".i18n()+'</option>' +
		'<option value="+01:00" id="GMT1title">'+"GMT1title".i18n()+'</option>';
		if(operator_name == "PLE_PALTEL"){
			ntpzone += '<option value="+02:00" id="GMT2title">'+"GMT2title_ple".i18n()+'</option>';
		}else if(operator_name == "EG_TELECOM"){
			ntpzone += '<option value="+02:00" id="GMT2title">'+"GMT2title_eg".i18n()+'</option>';
		}else{
			ntpzone += '<option value="+02:00" id="GMT2title">'+"GMT2title".i18n()+'</option>';
		}
		ntpzone += '<option value="+03:00" id="GMT3title">'+"GMT3title".i18n()+'</option>' +
		'<option value="+04:00" id="GMT4title">'+"GMT4title".i18n()+'</option>' +
		'<option value="+05:00" id="GMT5title">'+"GMT5title".i18n()+'</option>' +
		'<option value="+06:00" id="GMT6title">'+"GMT6title".i18n()+'</option>' +
		'<option value="+07:00" id="GMT7title">'+"GMT7title".i18n()+'</option>' +
		'<option value="+08:00" id="GMT8title" selected="selected">'+"GMT8title".i18n()+'</option>' +
		'<option value="+09:00" id="GMT9title">'+"GMT9title".i18n()+'</option>' +
		'<option value="+10:00" id="GMT10title">'+"GMT10title".i18n()+'</option>' +
		'<option value="+11:00" id="GMT11title">'+"GMT11title".i18n()+'</option>' +
		'<option value="+12:00" id="GMT12title">'+"GMT12title".i18n()+'</option>';
		
		$("#ntpzone_select").html(ntpzone);
}

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	initZoneHtml();
	if(operator_name == "ARG_CLARO"){
		$("#ntp_wan").show();
		$("#ntp_wanType").hide();
	}

	if((operator_name != "MEX_TELMEX") && (operator_name != "TH_AIS")){
		$("#ThirdNtpServer").hide();

	}
	
	if(operator_name == "ES_DIGI"){
		$("#daylight_digi").show();
		fillDayLightOption();
	}

	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ntp_info", initPage);
	}
	else
	{
		if(operator_name == "ARG_CLARO")
			XHR.get("get_allwan_info", null, initWanName);
		XHR.get("get_ntp_info", null, initPage);
		
	}
	if(operator_name == "CHL_MP" || operator_name == "PLE_PALTEL" || operator_name == "MEX_TELMEX" || operator_name == "CHL_ENTEL" || operator_name == "MEX_MEGA" )
	{
		$("#tr_daylightsavingstime_s").css("display", "");
		$("#tr_daylightsavingstime_e").css("display", "");
		$("#checkDaylight_checkbox").bind("change", function(){
			if ($("#checkDaylight_checkbox").prop("checked")){
				$("#start_y").attr("disabled", false);
				$("#start_m").attr("disabled", false);
				$("#start_d").attr("disabled", false);
				$("#start_h").attr("disabled", false);
				$("#start_min").attr("disabled", false);
				$("#start_s").attr("disabled", false);
				$("#end_y").attr("disabled", false);
				$("#end_m").attr("disabled", false);
				$("#end_d").attr("disabled", false);
				$("#end_h").attr("disabled", false);
				$("#end_min").attr("disabled", false);
				$("#end_s").attr("disabled", false);			
			}else{
				$("#start_y").attr("disabled", true);
				$("#start_m").attr("disabled", true);
				$("#start_d").attr("disabled", true);
				$("#start_h").attr("disabled", true);
				$("#start_min").attr("disabled", true);
				$("#start_s").attr("disabled", true);
				$("#end_y").attr("disabled", true);
				$("#end_m").attr("disabled", true);
				$("#end_d").attr("disabled", true);
				$("#end_h").attr("disabled", true);
				$("#end_min").attr("disabled", true);
				$("#end_s").attr("disabled", true);		
			}
		});
	}
	else
	{
		$("#tr_daylightsavingstime_s").css("display", "none");	
		$("#tr_daylightsavingstime_e").css("display", "none");	
	}

});


function initWanName(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	var all_wan_info = getdata;
	// if (all_wan_info.show_wan)
	// {
	// 	selectwan = all_wan_info.show_wan;
	// }
	
	if (all_wan_info != '' && all_wan_info.wan)
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for (i=0; i < wan_num; i++)
		{
			var single_wan = all_wan_info.wan[i];	
			var wan_path = single_wan.WAN_url;
			if( single_wan.Name.indexOf("_R_") >= 0 && single_wan.Name.indexOf("_OTHER_") < 0)
			{
			dynamicHtml += ' <option name= "wan_select" value="' + single_wan.Name + '">' + single_wan.Name + '</option>';		
			}
		}
	}
	$("#ntp_wan_name").html(dynamicHtml);
}

function initValidate()
{
	$("#ntp_form").validate({
		debug: true,
		rules: {
			"ntp_wan_name":{required:true},
			"Server1Other_text": {required: true, nocn: true},
			"Server2Other_text": {required: true, nocn: true},
			"Server3Other_text": {required: true, nocn: true},
			"NtpInterval_text":{required: true, range_int:[1,99999]}
			
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate ntp ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate ntp failed.....");
			return false;
		}
	}); 
}
function fillDayLightOption()
{
	let currentTime = new Date();
	let year = currentTime.getFullYear()
    var MonthSelectOption;
    var WeekIndexSelectOption;
	var WeekDaySelectOption;
	var HourSelectOption;

    for(var i= 1; i <= MonthArray.length; i++){
        MonthSelectOption += '<option value="' + i + '">' + MonthArray[i-1].i18n() + '</option>';
    }

	for(var i= 1; i <= WeekIndexArray.length; i++){
        WeekIndexSelectOption += '<option value="' + i + '">' + WeekIndexArray[i-1].i18n() + '</option>';
    }

	for(var i= 1; i <= WeekDayArray.length; i++){
        WeekDaySelectOption += '<option value="' + i + '">' + WeekDayArray[i-1].i18n() + '</option>';
    }

	for(var i= 1; i <= 23; i++){
        HourSelectOption += '<option value="' + i + '">' + i + ":00"+ '</option>';
    }

	$("#StartYear").html(year); 
	$("#EndYear").html(year); 

    $("#StartMonth").html(MonthSelectOption); 
	$("#EndMonth").html(MonthSelectOption); 

	$("#StartWdaycount").html(WeekIndexSelectOption); 
	$("#EndWdaycount").html(WeekIndexSelectOption); 

	$("#StartWday").html(WeekDaySelectOption); 
	$("#EndWday").html(WeekDaySelectOption); 

	$("#StartHour").html(HourSelectOption); 
	$("#EndHour").html(HourSelectOption); 
}

function initPage(getdata)
{
	if (getdata != null && getdata.ntp)
	{
		if (getdata.ntp.Enable == '1')
		{
			if(gNewUiFlag)
				$("input[name='ntp_enable']:first").attr('checked', 'checked');
			else
			$("#NtpEnable_checkbox").prop("checked", true);
		}
		else
		{
			if(gNewUiFlag)
				$("input[name='ntp_enable']:last").attr('checked', 'checked');
			else
			$("#NtpEnable_checkbox").prop("checked", false);
		}
		
		
		$("#ntp_wan_name").val(getdata.ntp.X_FH_WanName)
		$("#wan_select").val(getdata.ntp.NTPServerType);
		$("#NtpInterval_text").val(getdata.ntp.NTPInterval);
		for (var i=1; i<=ntpServerNumber; i++)
		{
			var server = eval("getdata.ntp.NTPServer" + i);
			$("#Server" + i + "Other_text").val(server);
		}
		var arrary= [];
		arrary = getdata.ntp.date.replace("UTC","").split(" ")
		var time_html="";
		for(var m =0 ;m<arrary.length;m++){
			time_html += arrary[m].i18n()+"&nbsp;"
		}
		$("#SystemTime_label").html(time_html);
		

		
		$("#ntpzone_select").val(getdata.ntp.LocalTimeZone);
		if(operator_name == "CHL_MP" || operator_name == "PLE_PALTEL" || operator_name == "MEX_TELMEX" || operator_name == "CHL_ENTEL" || operator_name == "MEX_MEGA")
		{		
			if (getdata.ntp.DaylightSavingsUsed == '1')
			{
				$("#checkDaylight_checkbox").prop("checked", true);
				$("#start_y").attr("disabled", false);
				$("#start_m").attr("disabled", false);
				$("#start_d").attr("disabled", false);
				$("#start_h").attr("disabled", false);
				$("#start_min").attr("disabled", false);
				$("#start_s").attr("disabled", false);
				$("#end_y").attr("disabled", false);
				$("#end_m").attr("disabled", false);
				$("#end_d").attr("disabled", false);
				$("#end_h").attr("disabled", false);
				$("#end_min").attr("disabled", false);
				$("#end_s").attr("disabled", false);		
			}
			else
			{
				$("#checkDaylight_checkbox").prop("checked", false);
				$("#start_y").attr("disabled", true);
				$("#start_m").attr("disabled", true);
				$("#start_d").attr("disabled", true);
				$("#start_h").attr("disabled", true);
				$("#start_min").attr("disabled", true);
				$("#start_s").attr("disabled", true);
				$("#end_y").attr("disabled", true);
				$("#end_m").attr("disabled", true);
				$("#end_d").attr("disabled", true);
				$("#end_h").attr("disabled", true);
				$("#end_min").attr("disabled", true);
				$("#end_s").attr("disabled", true);	
			}
			StartTime = getdata.ntp.DaylightSavingsStart;
			EndTime = getdata.ntp.DaylightSavingsEnd;
			if(getdata.ntp.DaylightSavingsStart)
			{
				var DaylightSavingsStart = getdata.ntp.DaylightSavingsStart.split('-');
				var DaylightSavingsTime_S = DaylightSavingsStart[2].split(':');
				
				$("#start_y").val(DaylightSavingsStart[0]);
				$("#start_m").val(DaylightSavingsStart[1]);
				$("#start_d").val(DaylightSavingsTime_S[0].substring(0,2));
				$("#start_h").val(DaylightSavingsTime_S[0].substring(3,5));
				$("#start_min").val(DaylightSavingsTime_S[1]);
				$("#start_s").val(DaylightSavingsTime_S[2].substring(0,2));		
				//2017-08-01T13:50:00
				

				var DaylightSavingsEnd = getdata.ntp.DaylightSavingsEnd.split('-');
				var DaylightSavingsTime_E = DaylightSavingsEnd[2].split(':');
				$("#end_y").val(DaylightSavingsEnd[0]);
				$("#end_m").val(DaylightSavingsEnd[1]);
				$("#end_d").val(DaylightSavingsTime_E[0].substring(0,2));
				$("#end_h").val(DaylightSavingsTime_E[0].substring(3,5));
				$("#end_min").val(DaylightSavingsTime_E[1]);
				$("#end_s").val(DaylightSavingsTime_E[2].substring(0,2));
			}
		}	
		if(operator_name == "ES_DIGI"){
			
			if(getdata.ntp.DaylightSavingsUsed == '1')
			{
				$("#checkDaylight_checkbox_digi").prop("checked", true);
				$("#daylight_digi_cfg").show()
			}
			else{
				$("#checkDaylight_checkbox_digi").prop("checked", false);
				$("#daylight_digi_cfg").hide()
			}
				
			$("#StartMonth").val(getdata.ntp.X_FH_DstStartMonth);
			if(getdata.ntp.X_FH_DstStartWdayorder == "1"){
				$("#StartWdaycount").val("5")
			}else{
				$("#StartWdaycount").val(getdata.ntp.X_FH_DstStartWdaycount);
			}
			
			$("#StartWday").val(getdata.ntp.X_FH_DstStartWday);
			$("#StartHour").val(getdata.ntp.X_FH_DstStartHour);
	
			$("#EndMonth").val(getdata.ntp.X_FH_DstEndMonth);
			if(getdata.ntp.X_FH_DstEndWdayorder == "1"){
				$("#EndWdaycount").val("5")
			}else{
				$("#EndWdaycount").val(getdata.ntp.X_FH_DstEndWdaycount);
			}
			$("#EndWday").val(getdata.ntp.X_FH_DstEndWday);
			$("#EndHour").val(getdata.ntp.X_FH_DstEndHour);
		}
	}
}
function showDaylightCfg(){
	if ($("#checkDaylight_checkbox_digi").attr('checked'))
		$("#daylight_digi_cfg").show();
	else
		$("#daylight_digi_cfg").hide();

}
function checkDaylightType()
{
		if(!checkYearLegal($("#start_y").val()))
		{
			return false;
		}
		if(!checkMonthLegal($("#start_m").val()))
		{
			return false;
		}
		if(!checkDateLegal($("#start_d").val(), $("#start_m").val()))
		{
			return false;
		}
		if(!checkHourLegal($("#start_h").val()))
		{
			return false;
		}
		if(!checkMinLegal($("#start_min").val()))
		{
			return false;
		}
		if(!checkMinLegal($("#start_s").val()))
		{
			return false;
		}
		if(!checkYearLegal($("#end_y").val()))
		{
			return false;
		}
		if(!checkMonthLegal($("#end_m").val()))
		{
			return false;
		}
		if(!checkDateLegal($("#end_d").val(), $("#end_m").val()))
		{
			return false;
		}
		if(!checkHourLegal($("#end_h").val()))
		{
			return false;
		}
		if(!checkMinLegal($("#end_min").val()))
		{
			return false;
		}
		if(!checkMinLegal($("#end_s").val()))
		{
			return false;
		}
				
		if(parseInt($("#start_y").val()) < parseInt($("#end_y").val()))
		{
			return true;
		}
		else if(parseInt($("#start_y").val()) > parseInt($("#end_y").val()))
		{		
			return false;
		}
		
		if(parseInt($("#start_m").val()) < parseInt($("#end_m").val()))
		{
			return true;
		}
		else if(parseInt($("#start_m").val()) > parseInt($("#end_m").val()))
		{		
			return false;
		}		

		if(parseInt($("#start_d").val()) < parseInt($("#end_d").val()))
		{
			return true;
		}
		else if(parseInt($("#start_d").val()) > parseInt($("#end_d").val()))
		{	
			return false;
		}	
		
		if(parseInt($("#start_h").val()) < parseInt($("#end_h").val()))
		{
			return true;
		}
		else if(parseInt($("#start_h").val()) > parseInt($("#end_h").val()))
		{		
			return false;
		}	
		
		if(parseInt($("#start_min").val()) < parseInt($("#end_min").val()))
		{
			return true;
		}
		else if(parseInt($("#start_min").val()) > parseInt($("#end_min").val()))
		{
			return false;
		}	
		
		if(parseInt($("#start_s").val()) < parseInt($("#end_s").val()))
		{
			return true;
		}
		else if(parseInt($("#start_s").val()) > parseInt($("#end_s").val()))
		{	
			return false;
		}	
		return true;
}


function saveApply()
{
	show_shadow();
	if( !$("#ntp_form").valid() )
	{
		if (gNewUiFlag)
            myAlert('Tip', '' + "invalid_data_alert".i18n() + '', function() { })
        else
		alert("invalid_data_alert".i18n());
		return;
	}
	
	if(operator_name == "CHL_MP" || operator_name == "PLE_PALTEL" || operator_name == "MEX_TELMEX" || operator_name == "CHL_ENTEL" || operator_name == "MEX_MEGA")
	{	
		if ($("#checkDaylight_checkbox").attr('checked'))
		{
			if(!checkDaylightType())
			{
				alert("daylightsavingstimeIllegalAlert".i18n());
				return;	
			}
		}
	}
	
	var postdata = new Object();
	if(gNewUiFlag)
		postdata.Enable = $("input[name='ntp_enable']:checked").val();
	else
	postdata.Enable = $("#NtpEnable_checkbox").attr("checked") ? "1" : "0";
	postdata.NTPInterval = $("#NtpInterval_text").val();
	for (var i=1; i<=ntpServerNumber; i++)
	{
		if (i == 3 && operator_name != "MEX_TELMEX" && operator_name != "TH_AIS") {
			continue;
		}
		postdata["NTPServer" + i] = $("#Server" + i + "Other_text").val();
	}
	postdata.LocalTimeZone = $("#ntpzone_select").val();
	if(operator_name == "ARG_CLARO"){
		postdata.X_FH_WanName = $("#ntp_wan_name").val();
	}else{
		postdata.NTPServerType = $("#wan_select").val();
	}

	if(operator_name == "CHL_MP" || operator_name == "PLE_PALTEL" || operator_name == "MEX_TELMEX" || operator_name == "CHL_ENTEL" || operator_name == "MEX_MEGA")
	{
		postdata.DaylightSavingsUsed = $("#checkDaylight_checkbox").attr("checked") ? "1" : "0";
		if ($("#checkDaylight_checkbox").attr('checked'))
		{
			var DaylightSavingsStart = checkNTPYear($("#start_y").val())+ "-" + checkNTPMD($("#start_m").val()) + "-" +checkNTPMD($("#start_d").val())+"T"+checkNTPHMS($("#start_h").val())+":"+checkNTPHMS($("#start_min").val())+":"+checkNTPHMS($("#start_s").val());
			var DaylightSavingsEnd = checkNTPYear($("#end_y").val())+ "-" + checkNTPMD($("#end_m").val()) + "-" +checkNTPMD($("#end_d").val())+"T"+checkNTPHMS($("#end_h").val())+":"+checkNTPHMS($("#end_min").val())+":"+checkNTPHMS($("#end_s").val());
			postdata.DaylightSavingsStart = DaylightSavingsStart;
			postdata.DaylightSavingsEnd = DaylightSavingsEnd;							
		}
		else
		{
			
			postdata.DaylightSavingsStart = StartTime;
			postdata.DaylightSavingsEnd = EndTime;		
			
		}
	
	
	}
		
	if(operator_name == "ES_DIGI"){
		postdata.DaylightSavingsUsed = $("#checkDaylight_checkbox_digi").attr("checked") ? "1" : "0";
		//if ($("#checkDaylight_checkbox_digi").attr('checked'))
		{
			postdata.X_FH_DstStartMonth = $("#StartMonth").val();
			if($("#StartWdaycount").val() == "5"){
				postdata.X_FH_DstStartWdayorder = "1";
				postdata.X_FH_DstStartWdaycount = "1" 
			}else{
				postdata.X_FH_DstStartWdayorder = "0";
				postdata.X_FH_DstStartWdaycount = $("#StartWdaycount").val();
			}
			postdata.X_FH_DstStartWday = $("#StartWday").val();
			postdata.X_FH_DstStartHour = $("#StartHour").val();
				
			postdata.X_FH_DstEndMonth = $("#EndMonth").val();
			if($("#EndWdaycount").val() == "5"){
				postdata.X_FH_DstEndWdaycount = "1";
				postdata.X_FH_DstEndWdayorder = "1" 
			}else{
				postdata.X_FH_DstEndWdayorder = "0";
				postdata.X_FH_DstEndWdaycount = $("#EndWdaycount").val();
			}
			postdata.X_FH_DstEndWday = $("#EndWday").val();
			postdata.X_FH_DstEndHour = $("#EndHour").val();
		}
	}
	XHR.post("set_ntp_info", postdata, initPage);
}

