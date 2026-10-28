var dhcp_data = "";
var wan_info = '';
var addflag = "edit";
var all_wan_info = '';
var selfilterIndex = 1;
var all_num = 0;
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
	}
});


function initValidate()
{	
	$("#dhcp_list_form").validate({
		debug: true,
		rules: 
        {
            "option_id": {required: true, range_int: [1,254]},
			"option_request_seq": {required: true, range_int: [1,8]},
			"option_value": {required: true}
        },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate dhcp client option ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate dhcp client option failed.....");
			return false;
		}
	}); 
}

function Showthisinfo(element,value)
{
    $("#dhcp_config_form").show();
    addflag = "edit";
    $("#add_item").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

    var dhcp_request_index = element.split("_")[1];
	var wan_index = element.split("_")[2];
    var mode = "old";
	selfilterIndex = parseInt(value.split("_")[1]);
	displayFormHtml(mode, wan_index, dhcp_request_index);
}

function displayFormHtml(mode, wan_index, dhcp_request_index)
{
	var curdata = wan_info[wan_index].dhcpRequest[dhcp_request_index];//************************************与后端返回数据有关**********************
	var wan_url = wan_info[wan_index].WAN_url;
	if (mode == "init") //初始化状态
	{
		if (curdata && curdata.length > 0) {
			curdata = wan_info[wan_index].dhcpRequest[dhcp_request_index];
		} else {
			return;
		}
	}
	$("#dhcp_wan").attr("disabled", true);
	$("#dhcp_wan").val(wan_url);
	$("#option_id").val(curdata.Tag);
	$("#option_request_seq").val(curdata.Order);
	$("input[name='option_format'][value='Base64']").prop("checked", true);
}

function displayTableHtml()
{
	all_num = 0;
	var dynamicClsListHTML = '';
	wan_info = all_wan_info.wan; //获取所有wan连接信息
	for (var i = 0; i < wan_info.length; i++) {
		dhcp_data = wan_info[i].dhcpRequest; //获取当前第i条WAN下的dhcp client option信息
		var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条dhcp client option的wan_name信息显示
		
		if (dhcp_data.length != 0) {
			for (var m = 0; m < dhcp_data.length; m++) //将第i条WAN连接下的dhcp client option信息进行遍历
			{
				all_num++;
				var n = m + 1;
				var single = dhcp_data[m]; //对于第m条dhcp client option信息赋值给single
				var temp = "";
				$("#dhcp_wan option").each(function() {
					if (wan_url == this.value) {
						temp = this.text;
					}
				});
				//针对每一条dhcp client option信息，其id中i、m分别表示第i条wan连接下的第m条dhcp client option信息。以供showshisinfo调用
				dynamicClsListHTML += '<tr id="table_' + m + "_" + i +
					'" style="cursor: pointer;" title="delout_'+ single.dhcp_request_index +'" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
				dynamicClsListHTML += '<td align="center">' + temp + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.Tag + '</td>';
				dynamicClsListHTML += '<td align="center">' + single.Order + '</td>';
				dynamicClsListHTML += '<td align="center" style="display:none">' + "Base64" + '</td>';
				dynamicClsListHTML += '<td align="center" style="display:none">' + "" + '</td>';
				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + i + '_' + single.dhcp_request_index +
					'" name="dhcp_option_flag"></td>';
				dynamicClsListHTML += '</tr>';
			}
		}
	}
	if(dynamicClsListHTML == ""){
		$("#dhcp_config_form").hide();
	}
	$("#dhcp_list").html(dynamicClsListHTML);
	$("#dhcp_list tr:eq(0)").click();
}

function addfilter()
{
    addflag = "add";
    var addHtml = [];
    $("#dhcp_config_form").show();
	$("#dhcp_wan").attr("disabled", false);
	
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center" style="display:none">--</td>';
	addHtml += '<td align="center" style="display:none">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
	
    if ($("#add_item").length == 0)
    {
        $("#dhcp_list").append(addHtml);
        $(".input_text").each(function (i){
            $(this).val('');
        });
        $("#add_item").children().css("background-color","#b7e3e3");
        $("#add_item").siblings().children().css("background-color","#eef2f6");
        $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function initPage(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	
	if (getdata != null && getdata.wan) {
		all_wan_info = getdata;
		wan_info = all_wan_info.wan;
		if(all_wan_info != '' && all_wan_info.wan)
		{
			wan_num = all_wan_info.wan.length;
		}
		
		if (wan_num > 0)
		{
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (single_wan.Name.indexOf("_B_") == -1 && single_wan.iporppp == 1)
				{
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
			}
			
		}
		$("#dhcp_wan").html(dynamicHtml);
		displayTableHtml();
		displayFormHtml("init", 0 , 0);	

		$("#dhcp_list").children().eq(0).children().css("background-color","#b7e3e3");
	    $("#dhcp_list").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#dhcp_list").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
 
}


function doDelete(wan_num, index) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
	postdata.wanurl = wan_info[parseInt(wan_num)].WAN_url;
    postdata.dhcp_request_index = parseInt(index);
    XHR.post("set_dhcp_client_request_inter", postdata, initPage);
	sleep(300);
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
   
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }

    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
            value_temp = checkNodes[i].value;
			var wan_num = value_temp.split("_")[1];
            index = value_temp.split("_")[2];
            doDelete(wan_num, index);
        }
    }
}


function click_remove_all()
{
	var value_temp;
	var index;
    var checkNodes = $("input[type='checkbox']");
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }
    if(confirm("delete_all_alert".i18n()) == false)
    {
        return;
    }
	$("#dhcp_list tr:eq(0)").click();
    for(var i = 0; i < checkNodes.length; i++)
    {
        value_temp = checkNodes[i].value;
        index = value_temp.split("_")[2];
		var wan_num = value_temp.split("_")[1];
       doDelete(wan_num, index);
    }
}

function extraValidCheck()
{
	if($("#option_id").val() == "53" || $("#option_id").val() == "55"){
		alert("option_id_string".i18n());
        return false;
	}
	
	if($("#dhcp_wan").val() == null || $("#dhcp_wan").val() == ""){
		alert("wan_name_empty".i18n());
		return false;
	}
	
	var repeatOptionId = false;
	if(addflag == "add"){
		$("#dhcp_list tr").each(function(){
			var cur_wan = $(this).find("td").eq(0).html();
			var cur_option_id = $(this).find("td").eq(1).html();
			if($("#dhcp_wan option:selected").text() == cur_wan && $("#option_id").val() == cur_option_id){
				repeatOptionId = true;
			}
		});
	}else{
		$("#dhcp_list tr").each(function(){
			var index = $(this).index()+1;
			if(index != selfilterIndex && $(this).find("td").eq(1).html() == $("#option_id").val()){
				repeatOptionId = true;
			}
		});
	}
	if(repeatOptionId){
		alert("wan_name_same_option_id_must_different".i18n());
		$("#option_id").focus();
		return false;
	}
	
	return true;
}

function doSave()
{
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
    if(!$("#dhcp_list_form").valid() )
    {
        alert("illegal_value_alert".i18n());
        return;
    }
	if(!extraValidCheck()){
		return;
	}
	
	show_shadow();
    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit")
    {
        postdata.dhcp_request_index = selfilterIndex;
    }
    if (addflag == "add") 
    {		
        if (all_num >= 8)
        {
            alert("app_most8RulesAlert".i18n());
            return;
        }		
    }
	postdata.wanurl = $("#dhcp_wan").val();
	postdata.Enable = "1";
    postdata.Tag = $("#option_id").val();
	postdata.Order = $("#option_request_seq").val();
    XHR.post("set_dhcp_client_request_inter", postdata, initPage);
    addflag = "edit";
}
