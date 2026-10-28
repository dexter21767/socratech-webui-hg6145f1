var fttr_type = gFttr_type;
var operator_name = gOperatorName;
var wanInterface;
var wan_index;

$(document).ready(function(){
	initValidate();
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/statslan", parseGetData);
	}
	else
	{
		XHR.get("get_loop_detection_status_info", null, parseGetData);
	}
	
});

function initValidate()
{
	$("#loop_detection_form").validate({
		debug: true,
		rules: {
			"detection_Interval": {required: true, range_int:[1,60]},
			"recovery_interval": {required: true, range_int:[10,1800]}, 
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate loop detection ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate loop detection failed.....");
			return false;
		}
	}); 
}

function parseGetData(data)
{
	$("#lanInfo_list").empty();
	
	var html = "";
	var detected_flag = false;
	if ( data && data.ethernet_ports_info)
	{
	    var ethernet_ports_info = data.ethernet_ports_info;
		var	length = ethernet_ports_info.ethernet_ports_data.length
		for (var i=0; i<length; i++)
		{	
			var ethernet_ports = data.ethernet_ports_info.ethernet_ports_data[i];
			html += '<tr class="table_01">';
			//html += '<td style="text-align: center;">'+(i+1)+'</td>';
			html += '<td style="text-align: center;">'+ "LAN" + (i+1) +'</td>';
			if(ethernet_ports.X_FH_DetectionStatus == 1)
			{
				html += '<td style="text-align: center;">'+"Detected".i18n()+'</td>';
			}
			else
			{
				html += '<td style="text-align: center;">'+"Not Detected".i18n()+'</td>';
			}
			
			html += '</tr>';
		}
	}
	$("#lanInfo_list").append(html);

	setCheckbox("loop_detection_enable", data.LoopbackEnable);
	$("#detection_Interval").val(data.LoopExistPeriod);
	$("#recovery_interval").val(data.LoopCancelPeriod);
}

function save_apply()
{
	if ( ! $("#loop_detection_form").valid() )
	{
		alert("value_illegal".i18n());
		return;
	}
	
	show_shadow();
	var postdata = new Object();
    postdata.LoopbackEnable = getCheckbox("loop_detection_enable");
	postdata.LoopExistPeriod = $("#detection_Interval").val();
	postdata.LoopCancelPeriod = $("#recovery_interval").val();

	XHR.post("set_loop_detection_info", postdata, parseGetData);
}
