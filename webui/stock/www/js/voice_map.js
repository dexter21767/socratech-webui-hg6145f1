var voicedata = '';
var sessionidstr = "";

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");
	
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_map", initPage);
	}
	else
	{
		XHR.get("get_voice_map_info", null, initPage);
	}
});

function initValidate()
{
	$("#voice_map_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}


function initPage(getdata)
{
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
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.voice_map)
	{
		voicedata = getdata.voice_map;
		setCheckbox("SpecialMapEnable_checkbox",voicedata.DigitMapSpecialEnable);
		$("#SpecialMap_textarea").val(voicedata.DigitMapSpecial);
		setCheckbox("PBXMapEnable_checkbox",voicedata.PBXPrefixEnable);
		$("#PBXoutMap_textarea").val(voicedata.PBXPrefix);
		$("#PBXinMap_textarea").val(voicedata.PBXDigitMap);
		setCheckbox("DigitMapEnable_checkbox",voicedata.DigitMapEnable);
		$("#DigitMap_textarea").val(voicedata.DigitMap);
	}
}


function checkMapFields()
{
    var data = new Object();
	if($('#SpecialMapEnable_checkbox').attr('checked'))
	{
		if ($('#SpecialMap_textarea').val().length > "150")
		{
			alert('特定号码最大长度为150!');
			return false;
		}
	}
	if($('#PBXMapEnable_checkbox').attr('checked'))
	{
		if ($('#PBXoutMap_textarea').val().length > "20")
		{
			alert('外线前缀最大长度为20!');
			return false;
		}
		if ($('#PBXinMap_textarea').val().length > "20")
		{
			alert('内线前缀最大长度为20!');
			return false;
		}
	}
	if($('#DigitMapEnable_checkbox').attr('checked'))
	{
		if ($('#DigitMap_textarea').val().length > 4096)
		{
			alert('基本数图最大长度为4096!');
			return false;
		}	
	}
	return true;
}


function saveApply()
{
	if( ! $("#voice_map_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	if(!checkMapFields())
	{
		return;
	}
	var postdata = new Object();
	postdata.DigitMapSpecialEnable = getCheckbox("SpecialMapEnable_checkbox");
	if ( postdata.DigitMapSpecialEnable == 1)
	{
		if (!isNullString($('#SpecialMap_textarea').val()))
		{
			postdata.DigitMapSpecial = $("#SpecialMap_textarea").val();
		}
		else
		{
			postdata.DigitMapSpecial = 'NULL';
		}
	}	
	
	postdata.PBXPrefixEnable = getCheckbox("PBXMapEnable_checkbox");
	if ( postdata.PBXPrefixEnable == 1)
	{
		if (!isNullString($('#PBXoutMap_textarea').val())) 
		{
			postdata.PBXPrefix = $("#PBXoutMap_textarea").val();
		}
		else
		{
			postdata.PBXPrefix = 'NULL';
		}
		if (!isNullString($('#PBXinMap_textarea').val())) 
		{
			postdata.PBXDigitMap = $("#PBXinMap_textarea").val();
		}
		else
		{
			postdata.PBXDigitMap = 'NULL';
		}
	}	
	
	postdata.DigitMapEnable = getCheckbox("DigitMapEnable_checkbox");
	
	if ( postdata.DigitMapEnable == 1)
	{
		if (!isNullString($('#DigitMap_textarea').val()))
		{
			postdata.DigitMap = $("#DigitMap_textarea").val();
		}
		else
		{
			postdata.DigitMap = 'NULL';
		}
	}
	postdata.sessionid = sessionidstr;
	XHR.post("set_voice_map_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}


