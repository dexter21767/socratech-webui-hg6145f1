var gdata;
var sessionidstr;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$("input[name='catv_enable']").bind("click", function(){
		var catv_enable  = $("input[name='catv_enable']:checked").val();
		if (catv_enable == 0){
			$("#RfOffset_div").css("display", "none");
		}else{
			$("#RfOffset_div").css("display", "");
			
		}
	});	

	if(operator_name == "ARG_GIGARED"){
		$("#catv_enable_div").css("display", "none");
		$("#RfOffset_div").css("display", "");
		$("#catv_prompt").html("You could view RF power on this page.");
	}

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_catv_info", initPage);
	}
	else
	{
		XHR.get("get_catv_info", null, initPage);
	}
});

function initValidate()
{
	$("#catv_form").validate({
		debug: true,
		rules: {
			"catv_rfoffset": {required: true, range_int:[-127,127]},
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
	if ( getdata != null && getdata.CATV )
	{
		gdata = getdata.CATV;
		displayHtml();
	}
}

function displayHtml()
{
	if(operator_name == "ARG_GIGARED"){
		if (gdata.Enable == "0"){
			$('#catv_rfoffset').attr("disabled",true);
			$("#catv_button_div").css("display", "none");
		}else{
			$('#catv_rfoffset').attr("disabled",false);
			$("#catv_button_div").css("display", "");
		}
	}else{
		if (gdata.Enable == "0"){
			$("#RfOffset_div").css("display", "none");
			$("input[name='catv_enable']:last").attr('checked', 'checked');
		}else{
			$("#RfOffset_div").css("display", "");
			$("input[name='catv_enable']:first").attr('checked', 'checked');
		}	
	}
	$("#catv_rfoffset").val(gdata.RfOffset);
}


function CancelBtn()
{
	displayHtml();
}

function saveApply()
{
	show_shadow();
	if ( ! $("#catv_form").valid() )
	{
		if(gNewUiFlag)
			myAlert('Tip', "value_illegal".i18n())
		else
			alert("value_illegal".i18n());
		return;
	}

	var postdata = new Object();
	postdata.Enable = $("input[name='catv_enable']:checked").val();
	if(postdata.Enable == 1)
	{		
		postdata.RfOffset = $("#catv_rfoffset").val();
	}
	else
	{		
		postdata.RfOffset = gdata.RfOffset;		
	}
	XHR.post("set_catv_info", postdata, initPage);
}
