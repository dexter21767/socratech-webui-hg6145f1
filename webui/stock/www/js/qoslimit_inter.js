var sessionidstr = "";
var gData;
var addflag = "edit";
var currentIndex = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//show_shadow();
	//customSwitchInit();
	customPasswordInit();
	//customScrollBar("html");
	customSwitchInit();
	
	$("#RateLimitEnable_container").bind("click", function(){
		show_shadow();
		var postdata = new Object();
		postdata.action = "enable";
		postdata.X_FH_RateLimitEnable = $("input[name='RateLimitEnable_checkbox']").val();
		XHR.post("set_qoslimit_info", postdata, initPage);
	});
    
	$("#up_link_mode").bind("change", function(){
		show_shadow();
		var postdata = new Object();
		postdata.action = "up_mode_change";
		postdata.X_FH_UpMode = $(this).val();
		XHR.post("set_qoslimit_info", postdata, initPage);
	});

	$("#down_link_mode").bind("change", function(){
		show_shadow();
		var postdata = new Object();
		postdata.action = "down_mode_change";
		postdata.X_FH_DownMode = $(this).val();
		XHR.post("set_qoslimit_info", postdata, initPage);
	});
	initValidate();

	initPage();

});

function initPage()
{
	$("#up_limit_form").hide();
	$("#down_limit_form").hide();
	XHR.get("get_qoslimit_info", null, fillData);
	console.log(gData);
	if (gData.modeUp == "3"){
		$("#up_ip_list_body").children().eq(0).children().css("background-color","#b7e3e3");
		$("#up_ip_list_body").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#up_ip_list_body").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
		$("#up_ip_list_body").children().eq(0).children().click();
	} else {
		$("#up_mac_list_body").children().eq(0).children().css("background-color","#b7e3e3");
		$("#up_mac_list_body").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#up_mac_list_body").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
		$("#up_mac_list_body").children().eq(0).children().click();
	}
	if (gData.modeDown == "3"){
		$("#down_ip_list_body").children().eq(0).children().css("background-color","#b7e3e3");
		$("#down_ip_list_body").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#down_ip_list_body").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
		$("#down_ip_list_body").children().eq(0).children().click();
	} else {
		$("#down_mac_list_body").children().eq(0).children().css("background-color","#b7e3e3");
		$("#down_mac_list_body").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#down_mac_list_body").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
		$("#down_mac_list_body").children().eq(0).children().click();
	}
	
}

function initValidate()
{
	$("#up_limit_form").validate({
		debug: true,
		rules: {
			"up_ip_text": {required: true, ipv4: true},
			"up_mac_text": {required: true, mac: true},
            "up_speed_text": {required: true, range_int:[1, 1024*1024]},
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

	$("#down_limit_form").validate({
		debug: true,
		rules: {
			"down_ip_text": {required: true, ipv4: true},
			"down_mac_text": {required: true, mac: true},
            "down_speed_text": {required: true, range_int:[1, 1024*1024]},
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

function fillData(data)
{
	if (data)
	{
		gData = data;
		var dynamicHtml = "";
		setSwitchValue("RateLimitEnable_container", data.Enable);
		$("#up_link_mode").val(data.modeUp);
		
		if (data.modeUp == "0") {
			$("#btn_div_up").hide();
			$("#up_mac_list_body").html("");
			$("#up_ip_list_body").html("");
			$("#up_ip_list").hide();
			$("#up_ip_setting").hide();
			$("#up_mac_list").hide();
			$("#up_mac_setting").hide();
			$("#form_btn_up").hide();
			$("#up_speed_setting").hide();
		} else if (data.modeUp == "2") {
			$("#up_ip_list_body").html("");
			dynamicHtml = generateDynamicHtml(data.upMac, "up_mac");
			$("#btn_div_up").show();
			$("#up_mac_list_body").html(dynamicHtml);
			$("#up_ip_list").hide();
			$("#up_ip_setting").hide();
			$("#up_mac_list").show();
			$("#up_mac_setting").show();
			$("#form_btn_up").show();
			$("#up_speed_setting").show();
		} else if (data.modeUp == "3") {
			$("#up_mac_list_body").html("");
			dynamicHtml = generateDynamicHtml(data.upIp, "up_ip");
			$("#btn_div_up").show();
			$("#up_ip_list_body").html(dynamicHtml);
			$("#up_ip_list").show();
			$("#up_ip_setting").show();
			$("#up_mac_list").hide();
			$("#up_mac_setting").hide();
			$("#form_btn_up").show();
			$("#up_speed_setting").show();
		}

		$("#down_link_mode").val(data.modeDown);
		if (data.modeDown == "0") {
			$("#btn_div_down").hide();
			$("#down_mac_list_body").html("");
			$("#down_ip_list_body").html("");
			$("#down_ip_list").hide();
			$("#down_ip_setting").hide();
			$("#down_mac_list").hide();
			$("#down_mac_setting").hide();
			$("#form_btn_down").hide();
			$("#down_speed_setting").hide();
		} else if (data.modeDown == "2") {
			$("#down_ip_list_body").html("");
			dynamicHtml = generateDynamicHtml(data.downMac, "down_mac");
			$("#btn_div_down").show();
			$("#down_mac_list_body").html(dynamicHtml);
			$("#down_ip_list").hide();
			$("#down_ip_setting").hide();
			$("#down_mac_list").show();
			$("#down_mac_setting").show();
			$("#form_btn_down").show();
			$("#down_speed_setting").show();
		} else if (data.modeDown == "3") {
			$("#down_mac_list_body").html("");
			dynamicHtml = generateDynamicHtml(data.downIp, "down_ip");
			$("#btn_div_down").show();
			$("#down_ip_list_body").html(dynamicHtml);
			$("#down_ip_list").show();
			$("#down_ip_setting").show();
			$("#down_mac_list").hide();
			$("#down_mac_setting").hide();
			$("#form_btn_down").show();
			$("#down_speed_setting").show();
		}
	}
}

function generateDynamicHtml(data, tableName)
{
	var dynamicHtml = "";
	if (data)
	{
		var dataArray = data.split(',');
		for (var i = 0; i<dataArray.length; i++){
			var index = i + 1;
			var tmp_mac = dataArray[i].split('/')[0];
			var tmp_speed = dataArray[i].split('/')[1];
			dynamicHtml += '<tr id="'+tableName+'-'+i+'" style="cursor: pointer;" onclick="Showthisinfo(this.id,\''+tableName.split('_')[0]+'\')">';
			dynamicHtml += '<td align="center">'+index+'</td>';
			dynamicHtml += '<td align="center">'+tmp_mac+'</td>';
			dynamicHtml += '<td align="center">'+tmp_speed+'</td>';
			dynamicHtml += '<td align="center"><input type="checkbox" class="del_'+tableName.split('_')[0]+'_'+tableName.split('_')[1]+'" value="'+tmp_mac+'/'+tmp_speed+'"></input></td>';
			dynamicHtml += '</tr>';
		}
	}
	return dynamicHtml;
}

function Showthisinfo(element,upordown){
	addflag = "edit";
	if (upordown == "up"){
		$("#add_item_up").remove();
	} else {
		$("#add_item_down").remove();
	}
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	currentIndex = element.split("-")[1];
	var tableName = element.split("-")[0];
	if (tableName.indexOf("up") > -1){
		displayFormHtml_up(tableName, currentIndex);
	} else {
		displayFormHtml_down(tableName, currentIndex);
	}
}

function click_remove_up(){
	var checkNodes = gData.modeUp == "3" ? $(".del_up_ip") : $(".del_up_mac");
	var is_checked = false;
	var valueStr = "";

	if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

	for(var i = 0; i < checkNodes.length; i++)
    {
        if (checkNodes.eq(i).attr("checked") == "checked")
        {
            is_checked = true;
        }
		else
		{
			valueStr += checkNodes[i].value + ',';
		}
    }
	valueStr = valueStr.length == 0 ? valueStr : valueStr.substr(0, valueStr.length-1);//删去最后一个“，”

	if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }

	if(confirm("delete_alert".i18n()) == false){
        return;
    }

	show_shadow();
	var postdata = new Object();
	postdata.action = gData.modeUp == "3" ? "up_ip" : "up_mac";
	postdata.tabledata = valueStr;
	XHR.post("set_qoslimit_info", postdata, initPage);
}

function click_remove_down(){
	var checkNodes = gData.modeDown == "3" ? $(".del_down_ip") : $(".del_down_mac");
	console.log(checkNodes);
	var is_checked = false;
	var valueStr = "";

	if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

	for(var i = 0; i < checkNodes.length; i++)
    {
        if (checkNodes.eq(i).attr("checked") == "checked")
        {
            is_checked = true;
        }
		else
		{
			valueStr += checkNodes[i].value + ',';
		}
    }
	valueStr = valueStr.length == 0 ? valueStr : valueStr.substr(0, valueStr.length-1);//删去最后一个“，”

	if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }

	if(confirm("delete_alert".i18n()) == false){
        return;
    }

	show_shadow();
	var postdata = new Object();
	postdata.action = gData.modeDown == "3" ? "down_ip" : "down_mac";
	postdata.tabledata = valueStr;
	console.log(postdata);
	XHR.post("set_qoslimit_info", postdata, initPage);
}

function addBtnApply_up (){
	addflag = "add";
    var addHtml = []; //新增一个占位标记行
    addHtml += '<tr id="add_item_up">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';
	
    if ($("#add_item_up").length == 0)//第一次添加数据时设置默认值
    {
		if (gData.modeUp == "3"){
			$("#up_ip_list_body").append(addHtml);
		} else {
			$("#up_mac_list_body").append(addHtml);
		}
		
		$("#up_ip_text").val('');
		$("#up_mac_text").val('');
		$("#up_speed_text").val('');
		displayFormHtml_up("init", "0");
		$("#add_item_up").children().css("background-color","#b7e3e3");
		$("#add_item_up").siblings().children().css("background-color","#eef2f6");
		$("#add_item_up").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function displayFormHtml_up(mode, index){
	$("#up_limit_form").show();
	$(".main_item_error_hint").each(function (i){
		$(this).hide();
	});
	if (mode == "init"){
		$("#up_ip_text").val("");
		$("#up_mac_text").val("");
		$("#up_speed_text").val("");
	} else if (mode == "up_mac"){
		$("#up_mac_text").val(gData.upMac.split(',')[index].split('/')[0]);
		$("#up_speed_text").val(gData.upMac.split(',')[index].split('/')[1]);
	} else if (mode == "up_ip"){
		$("#up_ip_text").val(gData.upIp.split(',')[index].split('/')[0]);
		$("#up_speed_text").val(gData.upIp.split(',')[index].split('/')[1]);
	} 
}

function addBtnApply_down (){
	addflag = "add";
    var addHtml = []; //新增一个占位标记行
    addHtml += '<tr id="add_item_down">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';
	
    if ($("#add_item_down").length == 0)//第一次添加数据时设置默认值
    {
		if (gData.modeDown == "3"){
			$("#down_ip_list_body").append(addHtml);
		} else {
			$("#down_mac_list_body").append(addHtml);
		}
		
		$("#down_ip_text").val('');
		$("#down_mac_text").val('');
		$("#down_speed_text").val('');
		displayFormHtml_down("init", "0");
		$("#add_item_down").children().css("background-color","#b7e3e3");
		$("#add_item_down").siblings().children().css("background-color","#eef2f6");
		$("#add_item_down").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function displayFormHtml_down(mode, index){
	$("#down_limit_form").show();
	$(".main_item_error_hint").each(function (i){
		$(this).html("");
	});
	if (mode == "init"){
		$("#down_ip_text").val("");
		$("#down_mac_text").val("");
		$("#down_speed_text").val("");
	} else if (mode == "down_mac"){
		$("#down_mac_text").val(gData.downMac.split(',')[index].split('/')[0]);
		$("#down_speed_text").val(gData.downMac.split(',')[index].split('/')[1]);
	} else if (mode == "down_ip"){
		$("#down_ip_text").val(gData.downIp.split(',')[index].split('/')[0]);
		$("#down_speed_text").val(gData.downIp.split(',')[index].split('/')[1]);
	} 
}

function extraValidCheck(upordown)
{
	if (upordown == "up"){
		if (gData.modeUp == "3"){
			var upIpArray = gData.upIp.split(',');
			if (addflag == "add" && upIpArray.length >= 5){
				alert("add_max_alert".i18n());
				return;
			}
			for (var i=0; i<upIpArray.length; i++){
				//编辑时跳过自己
				if (i == currentIndex && addflag == "edit"){
					continue;
				}
				if ($("#up_ip_text").val() == upIpArray[i].split('/')[0]){
					alert("same_ip_alert".i18n());
					return;
				}
			}
		} else{
			var upMacArray = gData.upMac.split(',');
			if (addflag == "add" && upMacArray.length >= 5){
				alert("add_max_alert".i18n());
				return;
			}
			for (var i=0; i<upMacArray.length; i++){
				if ($("#up_mac_text").val() == upMacArray[i].split('/')[0]){
					alert("same_mac_alert".i18n());
					return;
				}
			}
		}
	} else if(upordown == "down"){
		if (gData.modeDown == "3"){
			var downIpArray = gData.downIp.split(',');
			if (addflag == "add" && downIpArray.length >= 5){
				alert("add_max_alert".i18n());
				return;
			}
			for (var i=0; i<downIpArray.length; i++){
				//编辑时跳过自己
				if (i == currentIndex && addflag == "edit"){
					continue;
				}
				if ($("#down_ip_text").val() == downIpArray[i].split('/')[0]){
					alert("same_ip_alert".i18n());
					return;
				}
			}
		} else{
			var downMacArray = gData.downMac.split(',');
			if (addflag == "add" && downMacArray.length >= 5){
				alert("add_max_alert".i18n());
				return;
			}
			for (var i=0; i<downMacArray.length; i++){
				if ($("#down_mac_text").val() == downMacArray[i].split('/')[0]){
					alert("same_mac_alert".i18n());
					return;
				}
			}
		}
	}
	return true;
}

function saveEnable_Apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
	postdata.X_FH_RateLimitEnable = $("input[name='RateLimitEnable_checkbox']").val();
	XHR.post("set_qoslimit_info", postdata, initPage);
}

function saveApply(upordown)
{
	console.log($("#up_limit_form").valid());
	if( (upordown == "up" && !$("#up_limit_form").valid()) || (upordown == "down" && !$("#down_limit_form").valid()))
	{
		alert("invalid_value_alert".i18n());
		return;
	}
	
	if( !extraValidCheck(upordown) ){
	    return;
	}
	show_shadow();
	var postdata = new Object();
	if (upordown == "up" && addflag == "add"){
		if (gData.modeUp == "3"){
			postdata.action = "up_ip";
			postdata.tabledata = (gData.upIp == "" ? gData.upIp : gData.upIp + ",") + $("#up_ip_text").val()  + "/" + $("#up_speed_text").val();
		} else {
			postdata.action = "up_mac";
			postdata.tabledata = (gData.upMac == "" ? gData.upMac : gData.upMac + ",") + $("#up_mac_text").val()  + "/" + $("#up_speed_text").val();
		}
	} else if (upordown == "up" && addflag == "edit"){
		if (gData.modeUp == "3"){
			postdata.action = "up_ip";
			var upIpArray = gData.upIp.split(',');
			upIpArray[currentIndex] = $("#up_ip_text").val()  + "/" + $("#up_speed_text").val();
			postdata.tabledata = upIpArray.join(",");
		} else {
			postdata.action = "up_mac";
			var upMacArray = gData.upMac.split(',');
			upMacArray[currentIndex] = $("#up_mac_text").val()  + "/" + $("#up_speed_text").val();
			postdata.tabledata = upMacArray.join(",");
		}
	} else if (upordown == "down" && addflag == "add"){
		if (gData.modeDown == "3"){
			postdata.action = "down_ip";
			postdata.tabledata = (gData.downIp == "" ? gData.downIp : gData.downIp + ",") + $("#down_ip_text").val()  + "/" + $("#down_speed_text").val();
		} else {
			postdata.action = "down_mac";
			postdata.tabledata = (gData.downMac == "" ? gData.downMac : gData.downMac + ",") + $("#down_mac_text").val()  + "/" + $("#down_speed_text").val();
		}
	} else if (upordown == "down" && addflag == "edit"){
		if (gData.modeDown == "3"){
			postdata.action = "down_ip";
			var downIpArray = gData.downIp.split(',');
			downIpArray[currentIndex] = $("#down_ip_text").val()  + "/" + $("#down_speed_text").val();
			postdata.tabledata = downIpArray.join(",");
		} else {
			postdata.action = "down_mac";
			var downMacArray = gData.downMac.split(',');
			downMacArray[currentIndex] = $("#down_mac_text").val()  + "/" + $("#down_speed_text").val();
			postdata.tabledata = downMacArray.join(",");
		}
	}
	XHR.post("set_qoslimit_info", postdata, initPage);
}
 


