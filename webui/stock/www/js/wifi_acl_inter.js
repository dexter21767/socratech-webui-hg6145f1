var wifi_acl_data_black = null;
var wifi_acl_data_white = null;
var wifi_acl_mode;
var wifi_acl_mode_checked;
var addflag = "edit";
var selfilterIndex = 1;
var g_black_or_white = "";

$(document).ready(function(){
    //优化滚动条，无需改动
    //customScrollBar("html");
    
    initValidate();

    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
	if(gOperatorMode == "13" && operator_name == "MY_TM")
	{
		$(":input").attr("disabled", true);
	}

	if(gOperatorName == "MEX_TELMEX" ||gOperatorName == "TH_AIS"){
		 $(".main_item_name").css("width","22%");
		$(".main_item_content").css("width","calc(78% - 3px)");
	}
	
	$("input[name='wifi_acl_mode']").click(function(){
		$("#fw_config_form").css("display","none");
		$("#wifi_acl_List").find("tr").css("display","none");
		wifi_acl_mode_checked = $(this).val();
		$("#wifi_acl_List").find("tr").each(function(index, element){
			var id = $(this).attr("id");
			if(wifi_acl_mode_checked == "1")
			{
				if(id.indexOf("black") > -1)
				{
					$(this).css("display", "");
				}
			}
			else if(wifi_acl_mode_checked == "2")
			{
				if(id.indexOf("white") > -1)
				{
					$(this).css("display", "");
				}
			}
		});
		$("#wifi_acl_List").find("tr").each(function(index, element){
			if($(this).css("display") != "none"){
				$(this).click();
				return false;
			}
		});
		if(wifi_acl_mode_checked == "0")
		{
			$("#fw_add").attr("disabled", true);
			$("#fw_delete").attr("disabled", true);
			$("#fw_deleteAll").attr("disabled", true);
		}else{
			$("#fw_add").attr("disabled", false);
			$("#fw_delete").attr("disabled", false);
			$("#fw_deleteAll").attr("disabled", false);
		}
	});
    
    if ( gDebug ) //调试模式读取本地数据
    {
        getDataByAjax("../fake/v4mac_filter", initPage);
    }
    else
    {
        XHR.get("get_wifi_acl_info", null, initPage);
    }
});

function initValidate()
{   
    $("#wifi_acl_list_form").validate({
        debug: true,
        rules: {
            "mac_address": {required:true,mac: true}
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

//校验Mac地址是否冲突
function checkMac(macAddress, index, black_or_white)
{
	for(var i = 0; i < wifi_acl_data_black.length; i++ )
	{
		if(addflag == "edit" && black_or_white == "black")
		{
			if(index == wifi_acl_data_black[i].wifi_acl_index)
			{
				continue;
			}
		}
		if(macAddress == wifi_acl_data_black[i].MAC)
		{
			alert("MAC_used_Alert".i18n());
			return false ;
		}	
	}
	for(var i = 0; i < wifi_acl_data_white.length; i++ )
	{
		if(addflag == "edit" && black_or_white == "white")
		{
			if(index == wifi_acl_data_white[i].wifi_acl_index)
			{
				continue;
			}
		}
		if(macAddress == wifi_acl_data_white[i].MAC)
		{
			alert("MAC_used_Alert".i18n());
			return false ;
		}	
	}
	return true;
}


function EnableCancel()
{
	//0为acl使能关，1为黑名单使能，2为白名单使能
    if (wifi_acl_mode == '0') 
    {
        $("input[name='wifi_acl_mode']:eq(0)").attr('checked', 'checked');
    }else if(wifi_acl_mode == '1'){
		$("input[name='wifi_acl_mode']:eq(1)").attr('checked', 'checked');
	}else if(wifi_acl_mode == '2'){
		$("input[name='wifi_acl_mode']:eq(2)").attr('checked', 'checked');
	}
}

function Showthisinfo(element)
{
    $("#fw_config_form").show();
    addflag = "edit";
    $("#add_item").remove();
    if(operator_name == "EG_TELECOM" ||  operator_name == "MAR_INWI"){
     $("#"+element).children().css("background-color", "#DEC0DF");
     $("#"+element).siblings().children().css("background-color", "#eef2f6");
     $("#"+element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
    }else{
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
	g_black_or_white = element.split("_")[0];
	selfilterIndex = element.split("_")[2];
    var index = element.split("_")[1];
	
	
    var mode = "old";

    displayFormHtml(mode,index,g_black_or_white);
}

function displayFormHtml(mode,index,black_or_white)
{
	var curdata;
	if(black_or_white == "black"){
		curdata = wifi_acl_data_black[index];
	}else if(black_or_white == "white"){
		curdata = wifi_acl_data_white[index];
	}
    if (mode == "init")
    {
        if (wifi_acl_data_black.length > 0 && wifi_acl_mode_checked == "1")
        {
            curdata = wifi_acl_data_black[index];
        }
		if (wifi_acl_data_white.length > 0 && wifi_acl_mode_checked == "2")
        {
            curdata = wifi_acl_data_white[index];
        }
        else
        {
            return;
        }
    }
    
    $("#mac_address").val(curdata.MAC);
}

function displayTableHtml()
{
    var dynamicClsListHTML = '';
    for (var m = 0; m < wifi_acl_data_black.length; m++)
    {
        var single = wifi_acl_data_black[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="black_'+m+'_'+single.wifi_acl_index+'" style="cursor: pointer;" onclick="Showthisinfo(this.id)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_black_'+ single.wifi_acl_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
	for (var m = 0; m < wifi_acl_data_white.length; m++)
    {
        var single = wifi_acl_data_white[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="white_'+m+'_'+single.wifi_acl_index+'" style="cursor: pointer;" onclick="Showthisinfo(this.id)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_white_'+ single.wifi_acl_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
	
    $("#wifi_acl_List").html(dynamicClsListHTML);
}

function addfilter()
{
    addflag = "add";
    var addHtml = [];
    $("#fw_config_form").show(); 
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
    if ($("#add_item").length == 0)
    {
        $("#wifi_acl_List").append(addHtml);
        $(".input_text").each(function (i){
            $(this).val('');
        });
        if(operator_name == "EG_TELECOM"  ||  operator_name == "MAR_INWI"){
         $("#add_item" + index).children().css("background-color", "#DEC0DF");
         $("#add_item" + index).siblings().children().css("background-color", "#eef2f6");
         $("#add_item" + index).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
        }else{
          $("#add_item").children().css("background-color","#b7e3e3");
          $("#add_item").siblings().children().css("background-color","#eef2f6");
          $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");  
        }
       
    }
}

function initPage(getdata)
{   
    if (getdata != null && getdata.wifi_acl_info)
    {
        wifi_acl_mode = getdata.wifi_acl_info.wifi_acl_mode;
        wifi_acl_data_black = getdata.wifi_acl_info.wifi_acl_data_black;
		wifi_acl_data_white = getdata.wifi_acl_info.wifi_acl_data_white;
        EnableCancel(); 
        displayTableHtml();

        displayFormHtml("init", 0, "");
         if(operator_name == "EG_TELECOM"  ||  operator_name == "MAR_INWI"){
           $("#wifi_acl_List").children().eq(0).children().css("background-color","#DEC0DF");
           $("#wifi_acl_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
           $("#wifi_acl_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");  
        }else{
          $("#wifi_acl_List").children().eq(0).children().css("background-color","#b7e3e3");
          $("#wifi_acl_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
          $("#wifi_acl_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");  
        }
       
		
		$("input[name='wifi_acl_mode']:checked").click();
    }
}

function doDelete(index, black_or_white) //删除操作
{  
    if(gOperatorMode == "13" && operator_name == "MY_TM")
    {
        return;
    }
    var postdata = new Object();
    postdata.action = "delete";
    postdata.wifi_acl_index = parseInt(index);
	postdata.black_or_white = black_or_white;
    XHR.post("set_wifi_acl_info", postdata, initPage);
	sleep(300);
}

function extraValidCheck()
{
    var start_hour = $("#mac_start_hour").val();
    var start_min = $("#mac_start_min").val();
    var end_hour = $("#mac_end_hour").val(); 
    var end_min =  $("#mac_end_min").val();
    var start = start_hour + start_min;
    var end = end_hour + end_min;
    if ( parseInt(start) > parseInt(end))	
    {
        $("#Time-error").html("fw_timeErrorAlert".i18n());
        return false;
    }
    return true;
}

function click_remove() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("input[type='checkbox']");
    var is_checked;
    var value_temp;
    var index;

    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("input[type = checkbox]").is(':checked'); //判断是否有选中

    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
	
	var num = 0;
	$("#wifi_acl_List").find("tr").each(function(index, element){
		if($(this).css("display") != "none" && $(this).find("input[type = checkbox]").is(':checked')){
			num++;
		}
	});
	if(num==0)
	{
		alert("no_rules_alert".i18n());
        return;
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
			var black_or_white = value_temp.split("_")[1];
			if((wifi_acl_mode_checked == "1" && black_or_white == "black")||(wifi_acl_mode_checked == "2" && black_or_white == "white"))
			{
				doDelete(index, black_or_white); 
			}  
        }
    }
    window.location.reload();
}


function click_remove_all()
{
    var checkNodes = $("input[type='checkbox']");
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }
	var num = 0;
	$("#wifi_acl_List").find("tr").each(function(index, element){
		if($(this).css("display") != "none"){
			num++;
		}
	});
	if(num==0)
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
		var black_or_white = value_temp.split("_")[1];
		if((wifi_acl_mode_checked == "1" && black_or_white == "black")||(wifi_acl_mode_checked == "2" && black_or_white == "white"))
		{
			doDelete(index, black_or_white); 
		}  
    }
	 window.location.reload();
}
function EnableApply()
{
    if(gOperatorMode == "13" && operator_name == "MY_TM")
    {
        return;
    }
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.wifi_acl_mode = $("input[name='wifi_acl_mode']:checked").val();
    XHR.post("set_wifi_acl_info", postdata, initPage);
}

function doSave()
{
    if(gOperatorMode == "13" && operator_name == "MY_TM")
    {
        return;
    }
    show_shadow();
    var time_start;
    var time_stop;
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
    
    if(!$("#wifi_acl_list_form").valid() )
    {
        alert("illegal_value_alert".i18n());
        return;
    }
    
    if( !extraValidCheck() ) // 额外校验，如要需要再打开
    {
         alert("illegal_value_alert".i18n());
        return;
    }

    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit")
    {
        postdata.black_or_white = g_black_or_white;
		postdata.wifi_acl_index = selfilterIndex;
		
    }
    if (addflag == "add") 
    {
        if ((wifi_acl_data_black.length >= 32 && wifi_acl_mode == "1") || (wifi_acl_data_white.length >= 32 && wifi_acl_mode == "2"))
        {
            alert("fw_most32RulesAlert".i18n());
            return;
        }    
		postdata.wifi_acl_mode = wifi_acl_mode_checked;
    }
    postdata.MAC = $("#mac_address").val().toUpperCase();
	if(addflag == "edit"){
		if(checkMac(postdata.MAC , postdata.wifi_acl_index, postdata.black_or_white) == false)
		{
			//alert("请重新输入");
			return;
		}
	}else if(addflag =="add"){
		if(checkMac(postdata.MAC , "-1", "") == false){
			//alert("请重新输入");
			return;
		}
	}
	
	
    XHR.post("set_wifi_acl_info", postdata, initPage);  
	addflag = "edit";
}
