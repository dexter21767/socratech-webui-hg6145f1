var sessionidstr = "";
var operator_name = gOperatorName;
var modeArray = new Array('TR069', 'VOIP', 'IPTV', 'INTERNET', 'OTHER'); //1 2 4 8 16
var modeListHTML = "<option value='16'>OTHER</option><option value='9'>TR069,INTERNET</option><option value='11'>TR069,VOIP,INTERNET</option><option value='13'>TR069,IPTV,INTERNET</option><option value='15'>TR069,VOIP,IPTV,INTERNET</option>";
var modeListHTML_TELMEX = "<option value='16'>OTHER</option><option value='1'>TR069</option><option value='2'>VOIP</option><option value='3'>TR069,VOIP</option>";

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	initDynamicHTML();
	
	$("input:checkbox").bind("change", function(){
		checkDisableDisplayElement();
	});
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_base", initPage);
	}
	else
	{
		XHR.get("get_qos_base_info", null, initPage);
	}
});

function initValidate()
{
	$("#qos_base_form").validate({
		debug: true,
		rules: {
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate qos_base ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate qos_base failed.....");
			return false;
		}
	}); 
}

function initDynamicHTML()
{
	/*if(operator_name == "MEX_TELMEX")
	{
		$("#qoscfg_template").html(modeListHTML_TELMEX);
	}
	else
	{
		$("#qoscfg_template").html(modeListHTML);
	}*/

	$("#qoscfg_template").html(modeListHTML);
}

function checkDisableDisplayElement()
{
	if ( $("#QoSEnable_checkbox").attr("checked") )
	{
		$("#mode_div").show();
	}
	else
	{
		$("#mode_div").hide();
	}
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
	
	if (getdata != null && getdata.qos)
	{
		var qosdata = getdata.qos;
		setCheckbox("QoSEnable_checkbox", qosdata.Enable);
		$("#qoscfg_template").val(parseValueByString(qosdata.Mode, modeArray));
	}
	checkDisableDisplayElement();
}

function saveApply()
{
	if( ! $("#qos_base_form").valid() )
	{
		alert("某些项的值无效，请重新填写");
		return;
	}
	
	var postdata = new Object();
	postdata.Enable = getCheckbox("QoSEnable_checkbox");
	postdata.Mode = parseStringByValue($("#qoscfg_template").val(), modeArray);
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_base_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

