var addflag = "edit";
var selfilterIndex = 1;
var lanip;
var cur_index = 0;
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/dmz", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initPage);
        //XHR.get("get_ipv4_lan_info", null, lanip );
	}
});


function lanip(getdata)
{
	lanip = getdata.lan_ipv4.IPInterfaceIPAddress;
}

function initValidate()
{	
	$("#policy_list_form").validate({
		debug: true,
		rules: 
        {
            "vendor_id": {required: true}
        },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate dmz host ip ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate dmz host ip failed.....");
			return false;
		}
	}); 
}

function get_service_route_info(){
	var service_route_info = JSON.parse(localStorage.getItem("service_route_info")) || [];
	return service_route_info;
}

function displayTableHtml()
{
	var dynamicClsListHTML = '';
	var service_route_info = get_service_route_info();
	for(var i=0; i<service_route_info.length; i++){
		dynamicClsListHTML += '<tr onclick="Showthisinfo(this)">';
		dynamicClsListHTML += '<td align="center">' + service_route_info[i].VendorID + '</td>';
		dynamicClsListHTML += '<td align="center">' + service_route_info[i].WanName + '</td>';
		dynamicClsListHTML += '<td align="center"><input type="checkbox"></td>';
		dynamicClsListHTML += '</tr>';
	}
	$("#policy_list").html(dynamicClsListHTML);
	if($("#policy_list").length > 0){
		$("#policy_list tr:eq(0)").click();
	}
}

function Showthisinfo(that){
	cur_index = $(that).index();
    addflag = "edit";
    $("#add_item").remove();
    $(that).children().css("background-color","#b7e3e3");
    $(that).siblings().children().css("background-color","#eef2f6");
    $(that).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	
	$("#vendor_id").val($(that).find("td:eq(0)").text());
	$("#policy_wan").val($(that).find("td:eq(1)").text());
	$("#policy_list_config").show();
}

function addfilter()
{
    addflag = "add";
    var addHtml = [];
    $("#policy_list_config").show();
	
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
	
    if ($("#add_item").length == 0)
    {
        $("#policy_list").append(addHtml);
        $(".input_text").each(function (i){
            $(this).val('');
        });
        $("#add_item").children().css("background-color","#b7e3e3");
        $("#add_item").siblings().children().css("background-color","#eef2f6");
        $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }else{
		displayTableHtml();
		$("#policy_list").children().eq(0).children().css("background-color","#b7e3e3");
		$("#policy_list").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#policy_list").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}

function initPage(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	
	if (getdata != null && getdata.wan) {
		var all_wan_info = getdata;
		var wan_info = all_wan_info.wan;
		if(all_wan_info != '' && all_wan_info.wan)
		{
			wan_num = all_wan_info.wan.length;
		}
		
		if (wan_num > 0)
		{
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (single_wan.Name.indexOf("_B_") > -1) 
				{
					dynamicHtml += ' <option name= "single_wan" value="' + single_wan.Name + '">' + single_wan.Name + '</option>';
				}
			}
			
		}
	
		$("#policy_wan").html(dynamicHtml);
		displayTableHtml();

		$("#policy_list").children().eq(0).children().css("background-color","#b7e3e3");
		$("#policy_list").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#policy_list").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
 
}

function click_remove() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("input[type='checkbox']");
    var is_checked;
    var delete_index_arr = [];;

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
   
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }

    $("#policy_list tr").each(function(){
		if($(this).find("input[type='checkbox']").attr("checked")){
			delete_index_arr.push($(this).index());
		}
	});
	var service_route_info = get_service_route_info();
	var delete_arr = [];
	for(var i=0; i<delete_index_arr.length; i++){
		var index = delete_index_arr[i];
		delete_arr.push(service_route_info[index]);
	}
	var new_service_route_info = [];
	for(var i=0; i<service_route_info.length; i++){
		if(delete_arr.indexOf(service_route_info[i]) == -1){
			new_service_route_info.push(service_route_info[i]);
		}
	}
	localStorage.setItem("service_route_info", JSON.stringify(new_service_route_info));
	window.location.reload();
}


function doSave()
{
    show_shadow();
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
    if(!$("#policy_list_form").valid())
    {
        alert("illegal_value_alert".i18n());
        return;
    }
   
    if($("#policy_wan").val() == "" || $("#policy_wan").val() == null){
		alert("wan_name_is_empty_alert".i18n());
        return;
	}
	
	var repeatFlag = false;
	if(addflag == "add"){
		$("#policy_list tr").each(function(){
			var cur_wan = $(this).find("td").eq(1).html();
			if($("#policy_wan option:selected").text() == cur_wan){
				repeatFlag = true;
			}
		});
	}else{
		$("#policy_list tr").each(function(){
			var index = $(this).index()+1;
			var cur_wan = $(this).find("td").eq(1).html();
			if(index != selfilterIndex && $("#policy_wan option:selected").text() == cur_wan){
				repeatFlag = true;
			}
		});
	}
	if(repeatFlag){
		alert("repeat_with_the_existing_rules".i18n());
		$("#policy_wan").focus();
		return false;
	}
   
	var service_route_info = get_service_route_info();
	
    if (addflag == "edit")
    {
		service_route_info[cur_index]["VendorID"] = $("#vendor_id").val();
		service_route_info[cur_index]["WanName"] = $("#policy_wan").val();
		localStorage.setItem("service_route_info", JSON.stringify(service_route_info));
		$("#policy_list tr:eq("+cur_index+") td:eq(0)").text($("#vendor_id").val());
		$("#policy_list tr:eq("+cur_index+") td:eq(1)").text($("#policy_wan").val());
    }
    if (addflag == "add") 
    {		
        if (service_route_info.length >= 32)
        {
            alert("app_most32RulesAlert".i18n());
            return;
        }
		
		var vendor_id = $("#vendor_id").val();
		var policy_wan = $("#policy_wan").val();
		var rule = {"VendorID": vendor_id, "WanName": policy_wan};
		service_route_info.push(rule);
		localStorage.setItem("service_route_info", JSON.stringify(service_route_info));
		displayTableHtml();
		$("#policy_list").children().eq(0).children().css("background-color","#b7e3e3");
		$("#policy_list").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#policy_list").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
    addflag = "edit";
}
