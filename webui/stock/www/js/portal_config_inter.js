var addflag = "edit";
var selfilterIndex = 1;
var cur_index = 0;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	displayportalinfo();
	displayTableHtml();
	
	$("#dhcp_lan_List").children().eq(0).children().css("background-color","#b7e3e3");
	$("#dhcp_lan_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
	$("#dhcp_lan_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
});

function displayportalinfo(){
	$("#enable_portal").prop("checked", localStorage.getItem("enable_portal")=="1"? true:false);
	$("#default_url").val(localStorage.getItem("default_url"));
}

function getportallist(){
	var portal_list = JSON.parse(localStorage.getItem("portal_list")) || [];
	return portal_list;
}

function initValidate()
{	
	$("#portal_config_form").validate({
		debug: true,
		rules: {
            "default_url": {required: true, url: true,rangelength:[1, 255]}
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
	$("#dhcp_lan_list_form").validate({
		debug: true,
		rules: {
			"redirect_url": {required: true, url: true,rangelength:[1, 255]}
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

function displayTableHtml(){
	var dynamicClsListHTML = '';
	var portal_list = getportallist();
	for(var i=0; i<portal_list.length; i++){
		dynamicClsListHTML += '<tr onclick="Showthisinfo(this)">';
		dynamicClsListHTML += '<td align="center">' + (i+1) + '</td>';
		dynamicClsListHTML += '<td align="center">' + portal_list[i].dev_type + '</td>';
		dynamicClsListHTML += '<td align="center">' + portal_list[i].redirect_url + '</td>';
		dynamicClsListHTML += '<td align="center"><input type="checkbox"></td>';
		dynamicClsListHTML += '</tr>';
	}
	$("#dhcp_lan_List").html(dynamicClsListHTML);
	if($("#dhcp_lan_List").length > 0){
		$("#dhcp_lan_List tr:eq(0)").click();
	}
}

function Showthisinfo(that){
	cur_index = $(that).index();
    addflag = "edit";
    $("#add_item").remove();
    $(that).children().css("background-color","#b7e3e3");
    $(that).siblings().children().css("background-color","#eef2f6");
    $(that).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	
	$("#dev_type").val($(that).find("td:eq(1)").text());
	$("#redirect_url").val($(that).find("td:eq(2)").text());
	$("#fw_config_form").show();
}

function addfilter()
{
    addflag = "add";
    var addHtml = [];
    $("#fw_config_form").show();
	$("#fw_config_form .input_text").val("");
	addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
	
    if ($("#add_item").length == 0)
    {
        $("#dhcp_lan_List").append(addHtml);
        $("#add_item").children().css("background-color","#b7e3e3");
        $("#add_item").siblings().children().css("background-color","#eef2f6");
        $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }else{
		$("#dhcp_lan_List").children().eq(0).children().css("background-color","#b7e3e3");
		$("#dhcp_lan_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#dhcp_lan_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}



function click_remove() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("#dhcp_lan_list_form input[type='checkbox']");
    var is_checked;
    var delete_index_arr = [];;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = checkNodes.is(':checked'); //判断是否有选中
    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
   
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }

    $("#dhcp_lan_List tr").each(function(){
		if($(this).find("input[type='checkbox']").attr("checked")){
			delete_index_arr.push($(this).index());
		}
	});
	var portal_list = getportallist();
	var delete_arr = [];
	for(var i=0; i<delete_index_arr.length; i++){
		var index = delete_index_arr[i];
		delete_arr.push(portal_list[index]);
	}
	var new_portal_list = [];
	for(var i=0; i<portal_list.length; i++){
		if(delete_arr.indexOf(portal_list[i]) == -1){
			new_portal_list.push(portal_list[i]);
		}
	}
	localStorage.setItem("portal_list", JSON.stringify(new_portal_list));
	window.location.reload();
}



function doSave()
{
    show_shadow();
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
    if(!$("#dhcp_lan_list_form").valid())
    {
        alert("illegal_value_alert".i18n());
        return;
    }
	
	var repeatFlag = false;
	if(addflag == "add"){
		$("#dhcp_lan_List tr").each(function(){
			var cur_url = $(this).find("td").eq(2).html();
			if($("#redirect_url").val() == cur_url){
				repeatFlag = true;
			}
		});
	}else{
		$("#dhcp_lan_List tr").each(function(){
			var index = $(this).index()+1;
			var cur_url = $(this).find("td").eq(2).html();
			if(index != selfilterIndex && $("#redirect_url").val() == cur_url){
				repeatFlag = true;
			}
		});
	}
	if(repeatFlag){
		alert("repeat_with_the_existing_rules".i18n());
		$("#redirect_url").focus();
		return false;
	}
   
	var portal_list = getportallist();
	
    if (addflag == "edit")
    {
		portal_list[cur_index]["dev_type"] = $("#dev_type").val();
		portal_list[cur_index]["redirect_url"] = $("#redirect_url").val();
		localStorage.setItem("portal_list", JSON.stringify(portal_list));
		$("#dhcp_lan_List tr:eq("+cur_index+") td:eq(1)").text($("#dev_type").val());
		$("#dhcp_lan_List tr:eq("+cur_index+") td:eq(2)").text($("#redirect_url").val());
    }
    if (addflag == "add") 
    {		
        if (portal_list.length >= 8)
        {
            alert("app_most8RulesAlert".i18n());
            return;
        }
		
		var dev_type = $("#dev_type").val();
		var redirect_url = $("#redirect_url").val();
		var rule = {"dev_type": dev_type, "redirect_url": redirect_url};
		portal_list.push(rule);
		localStorage.setItem("portal_list", JSON.stringify(portal_list));
		displayTableHtml();
		$("#dhcp_lan_List").children().eq(0).children().css("background-color","#b7e3e3");
		$("#dhcp_lan_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#dhcp_lan_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
    addflag = "edit";
}

function saveApply(){
	show_shadow();
	//清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	if(!$("#portal_config_form").valid() )
    {
        alert("illegal_value_alert".i18n());
        return;
    }
	localStorage.setItem("enable_portal", $("#enable_portal").prop("checked")? "1":"0");
	localStorage.setItem("default_url", $("#default_url").val());
	displayportalinfo();
}