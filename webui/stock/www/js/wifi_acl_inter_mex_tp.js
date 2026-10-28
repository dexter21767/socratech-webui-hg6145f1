var wifi_acl_data_black = [];
var wifi_acl_data_white = [];
var black_count = 0;
var white_count = 0;
var wifi_acl_mode;
var wifi_acl_mode_checked;
var addflag_b = null;
var addflag_w = null;
var selfilterIndexBlack = 0;
var selfilterIndexWhite = 0;

$(document).ready(function(){
    //优化滚动条，无需改动
    //customScrollBar("html");
    
    initValidate();

    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
	$("input[name='wifi_acl_mode']").click(function(){
		wifi_acl_mode_checked = $(this).val();
		if(wifi_acl_mode_checked == 0){
			$("#BlacklistForm").hide();
			$("#WhitelistForm").hide();
		}else if(wifi_acl_mode_checked == 1){
			$("#BlacklistForm").show();
			$("#WhitelistForm").hide();
		}else if(wifi_acl_mode_checked == 2){
			$("#BlacklistForm").hide();
			$("#WhitelistForm").show();
		}
	});
    
    if ( gDebug ) //调试模式读取本地数据
    {
        getDataByAjax("../fake/v4mac_filter", initPage);
    }
    else
    {
        XHR.get("get_wifi_acl_info_mex_tp", null, initPage);
    }
});

function initValidate()
{   
    $("#BlacklistForm").validate({
        debug: true,
        rules: {
            "mac_address_b": {required:true,mac: true}
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
	$("#WhitelistForm").validate({
        debug: true,
        rules: {
            "mac_address_w": {required:true,mac: true}
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

//校验黑名单Mac地址是否冲突
function checkMacBlack(macAddress, index)
{
	for(var i = 0; i < wifi_acl_data_black.length; i++ )
	{
		if(index == wifi_acl_data_black[i].wifi_acl_index){
			continue;
		}
		if(macAddress == wifi_acl_data_black[i].MAC)
		{
			alert("MAC_used_Alert".i18n());
			return false ;
		}	
	}
	return true;
}

//校验白名单Mac地址是否冲突
function checkMacWhite(macAddress, index)
{
	for(var i = 0; i < wifi_acl_data_white.length; i++ )
	{
		if(index == wifi_acl_data_white[i].wifi_acl_index){
			continue;
		}
		if(macAddress == wifi_acl_data_white[i].MAC)
		{
			alert("MAC_used_Alert".i18n());
			return false ;
		}	
	}
	return true;
}

function ShowthisinfoBlack(element)
{
    $("#fw_config_form_b").show();
    addflag_b = "edit";
    $("#add_item_b").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	
	selfilterIndexBlack = element.split("_")[2];
    var index = element.split("_")[1];
	
	
    var mode = "old";

    displayFormHtmlBlack(mode,index);
}

function ShowthisinfoWhite(element)
{
    $("#fw_config_form_w").show();
    addflag_w = "edit";
    $("#add_item_w").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	
	selfilterIndexWhite = element.split("_")[2];
    var index = element.split("_")[1];
	
	
    var mode = "old";

    displayFormHtmlWhite(mode,index);
}

function displayFormHtmlBlack(mode,index)
{
	var curdata = wifi_acl_data_black[index];
    if (mode == "init")
    {
        if (wifi_acl_data_black.length > 0 && wifi_acl_mode_checked == "1")
        {
            curdata = wifi_acl_data_black[index];
        }
        else
        {
            return;
        }
    }
    
    $("#mac_address_b").val(curdata.MAC);
}

function displayFormHtmlWhite(mode,index)
{
	var curdata = wifi_acl_data_white[index];
    if (mode == "init")
    {
        if (wifi_acl_data_white.length > 0 && wifi_acl_mode_checked == "2")
        {
            curdata = wifi_acl_data_white[index];
        }
        else
        {
            return;
        }
    }
    
    $("#mac_address_w").val(curdata.MAC);
}

function displayTableHtmlBlack()
{
    var dynamicClsListHTML = '';

    for (var m = 0; m < wifi_acl_data_black.length; m++)
    {
        var single = wifi_acl_data_black[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="black_'+m+'_'+single.wifi_acl_index+'" style="cursor: pointer;" onclick="ShowthisinfoBlack(this.id)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_black_'+ single.wifi_acl_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
	
    $("#wifi_acl_List_b").empty().html(dynamicClsListHTML);
}

function displayTableHtmlWhite()
{
    var dynamicClsListHTML = '';
	for (var m = 0; m < wifi_acl_data_white.length; m++)
    {
        var single = wifi_acl_data_white[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="white_'+m+'_'+single.wifi_acl_index+'" style="cursor: pointer;" onclick="ShowthisinfoWhite(this.id)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_white_'+ single.wifi_acl_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
	
    $("#wifi_acl_List_w").empty().html(dynamicClsListHTML);
}

function addfilter_b()
{
    addflag_b = "add";
    var addHtml = [];
    $("#fw_config_form_b").show(); 
    addHtml += '<tr id="add_item_b">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
    if ($("#add_item_b").length == 0)
    {
        $("#wifi_acl_List_b").append(addHtml);
        $("#mac_address_b").val('');
        $("#add_item_b").children().css("background-color","#b7e3e3");
        $("#add_item_b").siblings().children().css("background-color","#eef2f6");
        $("#add_item_b").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function addfilter_w()
{
    addflag_w = "add";
    var addHtml = [];
    $("#fw_config_form_w").show(); 
    addHtml += '<tr id="add_item_w">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
    if ($("#add_item_w").length == 0)
    {
        $("#wifi_acl_List_w").append(addHtml);
        $("#mac_address_w").val('');
        $("#add_item_w").children().css("background-color","#b7e3e3");
        $("#add_item_w").siblings().children().css("background-color","#eef2f6");
        $("#add_item_w").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function initPage(getdata)
{   
    
    if (getdata != null && getdata.wifi_acl_info)
    {
        wifi_acl_mode = getdata.wifi_acl_info.wifi_acl_mode_2g;
		wifi_acl_mode_checked = wifi_acl_mode;
        var arr_black = getdata.wifi_acl_info.wifi_acl_data_black;
		var arr_white = getdata.wifi_acl_info.wifi_acl_data_white;
		black_count = getdata.wifi_acl_info.black_count;
		white_count = getdata.wifi_acl_info.white_count;
		wifi_acl_data_black = [];
		wifi_acl_data_white = [];
		for(var i=0; i<arr_black.length; i++){
			if(arr_black[i].RFBand == 0){
				wifi_acl_data_black.push(arr_black[i]);
			}
		}
		for(var i=0; i<arr_white.length; i++){
			if(arr_white[i].RFBand == 0){
				wifi_acl_data_white.push(arr_white[i]);
			}
		}
        for(var i=0; i<arr_black.length; i++){
        	if(arr_black[i].RFBand == 2){
        		wifi_acl_data_black.push(arr_black[i]);
        	}
        }
        for(var i=0; i<arr_white.length; i++){
        	if(arr_white[i].RFBand == 2){
        		wifi_acl_data_white.push(arr_white[i]);
        	}
        }
        
		if (wifi_acl_mode == '0') 
		{
			$("input[name='wifi_acl_mode']:eq(0)").attr('checked', 'checked').click();
		}else if(wifi_acl_mode == '1'){
			$("input[name='wifi_acl_mode']:eq(1)").attr('checked', 'checked').click();
		}else if(wifi_acl_mode == '2'){
			$("input[name='wifi_acl_mode']:eq(2)").attr('checked', 'checked').click();
		}
		displayTableHtmlBlack();
        displayTableHtmlWhite();

        displayFormHtmlBlack("init", 0, "");
		displayFormHtmlWhite("init", 0, "");

        $("#wifi_acl_List_b").children().eq(0).children().css("background-color","#b7e3e3").click();;
        $("#wifi_acl_List_b").children().eq(0).siblings().children().css("background-color","#eef2f6");
        $("#wifi_acl_List_b").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
		
		$("#wifi_acl_List_w").children().eq(0).children().css("background-color","#b7e3e3").click();
        $("#wifi_acl_List_w").children().eq(0).siblings().children().css("background-color","#eef2f6");
        $("#wifi_acl_List_w").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function doDelete(index,RFband) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
	postdata.band = "2.4g";
    postdata.RFband = RFband;
	postdata.wifi_acl_mode = wifi_acl_mode_checked;
    postdata.wifi_acl_index = index;
    XHR.post("set_wifi_acl_info_mex_tp", postdata, initPage);
	sleep(300);
}

function extraValidCheckBlack()
{
	var mac = $("#mac_address_b").val().toUpperCase();
	if(addflag_b == "add"){
		if(black_count >= 32)
		{
			alert("fw_most32RulesAlert".i18n());
			return false;
		}
		if(!checkMacBlack(mac, -1)){
			return false;
		}
	}else if(addflag_b == "edit"){
		if(!checkMacBlack(mac, selfilterIndexBlack)){
			return false;
		}
	}
    return true;
}

function extraValidCheckWhite()
{
	var mac = $("#mac_address_w").val().toUpperCase();
	if(addflag_w == "add"){
		if(white_count >= 32)
		{
			alert("fw_most32RulesAlert".i18n());
			return false;
		}
		if(!checkMacWhite(mac, -1)){
			return false;
		}
	}else if(addflag_w == "edit"){
		if(!checkMacWhite(mac, selfilterIndexWhite)){
			return false;
		}
	}
    return true;
}

function click_remove_b() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("#wifi_acl_List_b").find("input[type='checkbox']");
    var is_checked;
    var value_temp;
    var index;
    var RFBand;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("#wifi_acl_List_b").find("input[type='checkbox']").is(':checked'); //判断是否有选中

    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
	
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }

    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[2];
            for(var j = 0; j< wifi_acl_data_black.length;j++)
                {
                    RFBand = wifi_acl_data_black[j].RFBand;
                    break;
                 }
            
            doDelete(index,RFBand); 
        }
    }
    window.location.reload();
}


function click_remove_w() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("#wifi_acl_List_w").find("input[type='checkbox']");
    var is_checked;
    var value_temp;
    var index;
    var RFBand;

    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("#wifi_acl_List_w").find("input[type='checkbox']").is(':checked'); //判断是否有选中

    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
   
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }

    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[2];
            for(var j = 0; j< wifi_acl_data_white.length;j++){
                if(wifi_acl_data_white[j].wifi_acl_index == index){
                   RFBand = wifi_acl_data_white[j].RFBand;
                   break;
                }   
            }
         
			doDelete(index,RFBand); 
        }
    }
    window.location.reload();
}

function click_remove_all_b()
{
    var RFBand;
    var checkNodes = $("#wifi_acl_List_b").find("input[type='checkbox']");
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }
    if(confirm("delete_alert_all".i18n()) == false)
    {
        return;
    }
    
    for(var i = 0; i < checkNodes.length; i++)
    {
        value_temp = checkNodes[i].value;
        console.log(value_temp);
        index = value_temp.split("_")[2];
        
        for(var j = 0; j< wifi_acl_data_black.length;j++){
            if(wifi_acl_data_black[j].wifi_acl_index == index){
               RFBand = wifi_acl_data_black[j].RFBand;
               break;
            }   
        }
		doDelete(index,RFBand); 
    }
	 window.location.reload();
}

function click_remove_all_w()
{   
    var RFBand;
    var checkNodes = $("#wifi_acl_List_w").find("input[type='checkbox']");
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }
    if(confirm("delete_alert_all".i18n()) == false)
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
        value_temp = checkNodes[i].value;
        index = value_temp.split("_")[2];
        for(var j = 0; j< wifi_acl_data_white.length;j++)
            {
                RFBand = wifi_acl_data_white[j].RFBand;
                break;
             }
		doDelete(index,RFBand); 
    }
	window.location.reload();
}

function doSave()
{
    show_shadow();
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
    
	if(wifi_acl_mode_checked == 1){
		if(!$("#BlacklistForm").valid())
		{
			alert("illegal_value_alert".i18n());
			return;
		}
		if(!extraValidCheckBlack())
		{
			return;
		}
	}else if(wifi_acl_mode_checked == 2){
		if(!$("#WhitelistForm").valid() )
		{
			alert("illegal_value_alert".i18n());
			return;
		}
		if(!extraValidCheckWhite())
		{
			return;
		}
	}

    var postdata = new Object();
	postdata.band = "2.4g";
	postdata.wifi_acl_mode = wifi_acl_mode_checked;
	if(wifi_acl_mode_checked == 0){
		postdata.action = "enable";
	}else if(wifi_acl_mode_checked == 1){
		postdata.action = addflag_b;
		if(addflag_b == "edit"){
			postdata.wifi_acl_index = selfilterIndexBlack;
		}
		postdata.MAC = $("#mac_address_b").val().toUpperCase();
	}else if(wifi_acl_mode_checked == 2){
		postdata.action = addflag_w;
		if(addflag_w == "edit"){
			postdata.wifi_acl_index = selfilterIndexWhite;
		}
		postdata.MAC = $("#mac_address_w").val().toUpperCase();
	}
    XHR.post("set_wifi_acl_info_mex_tp", postdata, initPage);  
}
