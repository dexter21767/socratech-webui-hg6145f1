var sessionidstr = "";
var schedule_reboot_data = "";


$(document).ready(function(){
	initValidate();
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	
	$("input[name='schedule_reboot_enable']").bind("click", function(){
		var schedule_reboot_enable  = $("input[name='schedule_reboot_enable']:checked").val();
		if (schedule_reboot_enable == 0){
			$("#fw_time_day").css("display", "none");
			
		}else{
			$("#fw_time_day").css("display", "");
		}
	});
	$(".main_item_name").css("width","20%");
	$(".main_item_content").css("width","calc(80% - 3px)");
	initPage();
});


function initValidate()
{
	$("#schedule_settings_form").validate({
		debug: true,
		rules: {
			"start_hour":{required:true,number:true,range_int_time:[0,23],rangelength:[1, 2]},
			"start_min":{required:true,number:true,range_int_time:[0,59],rangelength:[1, 2]}
		},
		errorPlacement: function(error, element) { 
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {
			fiberlog("validate loid failed.....");
			return false;
		}
	}); 
}

function checkWeek() {
	var everyday =  $('#Everyday').prop('checked');
	if (everyday) {		
		return "1,2,3,4,5,6,7";
	} else {
		var str = "";
		$("input[name='dayofweek']").each(function() {
			if ($(this).is(":checked")) {
				str += $(this).val() + ",";
			}
		});
		str = str.substring(0, str.length - 1);
		return str;
	}

}


function extraValidCheck() {
	var item = 0;
	var schedule_reboot_enable  = $("input[name='schedule_reboot_enable']:checked").val();
	if(schedule_reboot_enable == "0")
	{
		return true;
	}
	
	$("input:checkbox[name='dayofweek']").each(function(){
		    if($(this).is(":checked")){
				item++;
		       }
		   })
		if(item <=0){
			$("#main_content-error").html("fw_dayErrorAlert".i18n());
			return false;
		}
		return true;
	
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced", fillData);
	}else{
		XHR.get("get_schedule_reboot_info", null, fillData);
	}
	
	$("#add_item").children().css("background-color", "#b7e3e3");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
	$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}


function fillData(data)
{
	if (data && data.schedule_reboot_info)
	{
		schedule_reboot_data = data.schedule_reboot_info;
		displayHtml();
	}
}


function displayHtml()
{
	if (schedule_reboot_data.schedule_reboot_enable == "0"){
		$("#fw_time_day").css("display", "none");
		$("input[name='schedule_reboot_enable']:last").attr('checked', 'checked');
	}else{
		$("#fw_time_day").css("display", "");
		$("input[name='schedule_reboot_enable']:first").attr('checked', 'checked');
	}
	var mintime_aes = schedule_reboot_data.schedule_reboot_mintime;
	var hourtime_aes = schedule_reboot_data.schedule_reboot_hourtime;
	var weekday_aes = schedule_reboot_data.schedule_reboot_weekday;
	var strArray = weekday_aes.split(',');
	
	$("#start_hour").val(hourtime_aes);
	$("#start_min").val(mintime_aes);
	
	$("input[name='dayofweek']").each(function(){
			$(this).prop('checked', false);
	})
		

	$("input[name='dayofweek']").each(function(){
		for(var j=0;j<=strArray.length;j++){
			if($(this).val() == strArray[j]){
			
			$(this).prop('checked', true);
			}
		}
		
	})
	
	$("#add_time_item").children().css("background-color", "#b7e3e3");
	$("#add_time_item").siblings().children().css("background-color", "#eef2f6");
	$("#add_time_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}

function CancelBtn()
{
	displayHtml();
}

function saveApply()
{
	show_shadow();

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
		
	if( ! $("#schedule_settings_form").valid())
	{
		
		alert("invalid_data_alert".i18n());
		return;
	}
	
	var postdata = new Object();
	postdata.schedule_reboot_enable = $("input[name='schedule_reboot_enable']:checked").val();	
	
	if($("input[name='schedule_reboot_enable']:checked").val() != 0)
	{
		if( ! extraValidCheck())
		{
		
			alert("invalid_data_alert".i18n());
			return;
		}
	}
	
	week_limit = checkWeek();
	postdata.schedule_reboot_weekday = week_limit;
	
	postdata.schedule_reboot_hourtime = $("#start_hour").val();
	postdata.schedule_reboot_mintime =$("#start_min").val();
	
	XHR.post("set_schedule_reboot_info", postdata, fillData);


}



