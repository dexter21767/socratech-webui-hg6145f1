var gdata;
var sessionidstr;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	
	initValidate();

	/*$("input[name='preset_enable']").bind("click", function(){
		var preset_enable  = $("input[name='preset_enable']:checked").val();
		console.log("preset_enable " + preset_enable);
		if (preset_enable == 1){
			$("#preset_time_div").css("display", "");
			$("#deviceRebootForm").css("display", "");	
			console.log("gdata.preset_enable " + gdata.preset_enable);
			if (gdata.preset_enable == "0")
			{
				console.log("gdata.preset_enable " + gdata.preset_enable);
				//$("#Restart_button").attr("disabled", true);
			}
		}else{
			$("#preset_time_div").css("display", "none");
			$("#deviceRebootForm").css("display", "none");
		}
	});
	*/

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_preset_info", initPage);
	}
	else
	{
		XHR.get("get_preset_info", null, initPage);
	}

});

function initValidate()
{
	$("#preset_form").validate({
		debug: true,
		rules: {
			"preset_time": {required: true, range_int:[5,300]},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate catv ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate catv failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
	if ( getdata != null && getdata.preset_info )
	{
		gdata = getdata.preset_info;
		displayHtml();
	}
}

function displayHtml()
{
	/*if (gdata.preset_enable == "1"){
		$("#preset_time_div").css("display", "");
		$("input[name='preset_enable']:last").attr('checked', 'checked');
		$("#deviceRebootForm").css("display", "");
		//$("#Restart_button").attr("disabled", false);
		
	}else{
		$("#preset_time_div").css("display", "none");
		$("input[name='preset_enable']:first").attr('checked', 'checked');
		$("#deviceRebootForm").css("display", "none");
	}*/	
	$("#preset_time").val(gdata.preset_time/1000);
	

	if (gdata.preset_enable == "1"){
		$("input[name='preset_enable']:first").attr('checked', 'checked');
	}else{
		$("input[name='preset_enable']:last").attr('checked', 'checked');
	}	
}


function CancelBtn()
{
	displayHtml();
}

function saveApply()
{
	show_shadow();
	if ( ! $("#preset_form").valid() )
	{
		alert("value_illegal".i18n());
		return;
	}

	var postdata = new Object();
	postdata.preset_enable = $("input[name='preset_enable']:checked").val();
	postdata.preset_time = ($("#preset_time").val()) * 1000;
	/*if(postdata.preset_enable == 1)
	{		
		postdata.preset_time = ($("#preset_time").val()) * 1000;
	}
	else
	{		
		postdata.preset_time = gdata.preset_time;		
	}*/
		 
	XHR.post("set_preset_info", postdata, initPage);
}

function restoreDefault()
{
	var prompt;
	prompt = "restore_confirm".i18n()

	//if(gdata.preset_enable == 1)
	{
	    if(confirm(prompt))
	    {
	        //$("#Restart_button").hide();
	        $("#deviceRebootForm").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());
	        jumpToLoginPage(true);
		    var postdata = new Object();
		    postdata.sessionid = sessionidstr;
	        XHR.post("restoreDefault", postdata, reloadData);
	    }
	}
}

function reloadData(responseData)
{
    // $("#Restart_button").hide();
    // $("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());
    // jumpToLoginPage(true);
	// if(responseData.success != 0)
	// {
	// 	alert("restore_error".i18n());
	// }
	// else
	// {
	// 	$("input").after("<h4>Rebooting...<br/></h4>"+"rebooting".i18n());       
	// 	jumpToLoginPage(true);
	// }
}

