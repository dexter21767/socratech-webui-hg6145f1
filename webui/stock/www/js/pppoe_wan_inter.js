var ddns_data = "";
var all_wan_info = '';
var wan_info = '';
var addflag = "edit";
var selfilterIndex = 1;
var operator_name = gOperatorName;
var login_user = gLoginUser;
var provider_list = new Array();
var curdata;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");

	initValidate();

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});

	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ddns", initPage);
	} else {
		//XHR.get("get_allwan_info", null, initConnectName);

		XHR.get("get_allwan_info", null, initPage);
	}
	
	

});



function initPage(getdata) //从后端获取数据，初始化页面
{
	var wan_num = 0;
	var dynamicHtml = '';
	
	if (getdata != null) {
		all_wan_info = getdata;
		wan_info = all_wan_info.wan;
		if(all_wan_info != '' && all_wan_info.wan)
		{
			wan_num = all_wan_info.wan.length;
		}
		
		$("#ddns_interface").html(dynamicHtml);
		$("#ddns_interface").attr("disabled", true);
		displayTableHtml();
		//displayFormHtml("init", 0 , 1);	
		//$("#ddns_config_form").hide();
		$("#ddns_list").children().eq(0).children().css("background-color", "#b7e3e3");
		$("#ddns_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
		$("#ddns_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color",
			"#eef2f6");
	}
}
function initValidate() {
	$("#pppoe_wan_list_form").validate({
		debug: true,
		rules: {
			"WanUserName":{required: true},
			"POED":{required: true, nocn: true},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate ddns ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate ddns failed.....");
			return false;
		}
	});
}

function Showthisinfo(element) //选中当前行并改变背景色
{
    addflag = "edit";
    $("#add_item").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    var index = element.split("_")[1];
    var single_wan = all_wan_info.wan[index];
	var mode = "old";
    selfilterIndex = parseInt(index)+1;
    displayFormHtml(mode,index);
}

function displayFormHtml(mode, wan_index) //显示详细信息
{
	curdata = wan_info[wan_index];
	if (mode == "init") //初始化状态
	{
		if (curdata && curdata.length > 0) {
			curdata = wan_info[wan_index];
		} else {
			return;
		}
	}
	$("#WanUserName").val(curdata.Username);
	$("#POED").val( fhdecrypt(curdata.Password) );

}

function displayTableHtml() {
	var num = 1;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
	    var n = i + 1;
	    var single =all_wan_info.wan[i];
		var wan_name_value = single.wan_index + '_' + single.wan_session_index + '_' + single.iporppp + '_' + single.Name;//拼接wan的value给
	    if(single.AddressingType != "PPPoE" && single.AddressingType != "PPPOE" ){
            continue;
        }
        dynamicClsListHTML += '<tr id="outtable_'+i+'" style="cursor: pointer;" onclick="Showthisinfo(this.id)">'; //新增数据时，把数据在前端显示显示
	    dynamicClsListHTML += '<td align="center">'+ n +'</td>';
	    dynamicClsListHTML += '<td align="center">' + single.Name + '</td>';
	    dynamicClsListHTML += '<td align="center">' + single.vlanid +'/'+ single.p8021 +'</td>';
	    if("1" == single.IPMode)
	    {
	    	ip_mode = "IPv4";
	    }
	    else if("2" == single.IPMode)
	    {
	    	ip_mode = "IPv6";
	    }
	    else if("3" == single.IPMode)
	    {
	    	ip_mode = "IPv4&IPv6";
	    }
	    dynamicClsListHTML += '<td align="center">' + ip_mode + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" class="delselwan" value="'+ wan_name_value +'"></td>';
	    dynamicClsListHTML += '</tr>';  
	    }


	$("#pppoe_wan_list").html(dynamicClsListHTML);
	$("#pppoe_wan_list tr:eq(0)").click();
}
function save_apply() //提交页面数据 
{
	show_shadow();
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	if (!$("#pppoe_wan_list_form").valid()) {
		alert("illegal_value_alert".i18n());
		return;
	}
	var postdata = new Object();
	
	postdata.Username = $("#WanUserName").val();
	postdata.WPd = fhencrypt($("#POED").val());
	
	postdata.wan_index = curdata.wan_index;
	postdata.wan_session_index = curdata.wan_session_index;
	postdata.iporppp = curdata.iporppp;
	postdata.wan_iporppp_new = curdata.iporppp;
	XHR.post("modify_pppoe_wan", postdata, initPage);
}
