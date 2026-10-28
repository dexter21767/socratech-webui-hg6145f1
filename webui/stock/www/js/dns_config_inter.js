var all_wan_info = '';
var wan_info = '';
var addflag_dns_search = "edit";
var addflag_static_dns = "edit";
var selfilterIndex1 = 1;
var selfilterIndex2 = 1;
var dns_search_data;
var static_dns_data;
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});

	if (gDebug) //调试模式读取本地数据
	{
		//getDataByAjax("../fake/ddns", initPage);
	} else {
		//XHR.get("get_allwan_info", null, initConnectName);

		XHR.get("get_allwan_info", null, initPage);
		XHR.get("get_static_dns_info", null, initPage2);
	}
});


function initValidate() {
	$("#dns_search_list_form").validate({
		debug: true,
		rules: {
			"dns_search_domain":{required: true, url: true,rangelength:[1, 255]},
			"dns_server":{required: true, ipv4: true}	
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate dns search ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate dns search failed.....");
			return false;
		}
	});
	
	$("#static_dns_list_form").validate({
		debug: true,
		rules: {
			"static_dns_domain":{required: true, url: true,rangelength:[1, 255]},
			"static_dns_ip":{required: true, ipv4: true}	
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate static dns ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate static dns failed.....");
			return false;
		}
	});
}


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

		/*if(operator_name == "MEX_TELMEX"){
			dynamicHtml += ' <option name=" " value=" "></option>';
		}*/
		
		if (wan_num > 0)
		{
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) 
				{
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
			}
		}
		$("#dns_wan").html(dynamicHtml);
		
		XHR.get("get_dns_search_info", null, initPage1);
	}
}

function initPage1(getdata){
	if (getdata != null && getdata.dns_search_data)
	{
        dns_search_data = getdata.dns_search_data ;
        displayTableHtml1();

        displayFormHtml1("init", 0);

        $("#dns_search_List").children().eq(0).children().css("background-color","#b7e3e3");
        $("#dns_search_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
        $("#dns_search_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}

function initPage2(getdata){
	if (getdata != null && getdata.static_dns_data)
	{
        static_dns_data = getdata.static_dns_data ;
        displayTableHtml2();

        displayFormHtml2("init", 0);

        $("#static_dns_List").children().eq(0).children().css("background-color","#b7e3e3");
        $("#static_dns_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
        $("#static_dns_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}

function displayTableHtml2(){
	var dynamicClsListHTML = '';
    for (var m = 0; m < static_dns_data.length; m++)
    {
        var single = static_dns_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_'+m+'" style="cursor: pointer;" title="delout_'+ single.static_dns_index +'" onclick="Showthisinfo2(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.DomainName + '</td>';
		dynamicClsListHTML += '<td align="center">' + single.IPAddress + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_'+ single.static_dns_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#static_dns_List").html(dynamicClsListHTML);
	$("#static_dns_List tr:eq(0)").click();
}

function Showthisinfo2(element,value)
{
    $("#static_dns_form").show();
    addflag_static_dns = "edit";
    $("#add_item_2").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

    var index = element.split("_")[1];

    selfilterIndex2 = parseInt(value.split("_")[1]);
    var mode = "old";

    displayFormHtml2(mode,index);
}

function displayFormHtml2(mode,index)
{
    var curdata = static_dns_data[index];
    
    if (mode == "init") //页面无数据时显示addfilter
    {
        if (static_dns_data.length > 0)
        {  
            curdata = static_dns_data[index];
        }
        else 
        {
           // addfilter();
            return;
        }
    }
    $("#static_dns_domain").val(curdata.DomainName);
    $("#static_dns_ip").val(curdata.IPAddress);
}

function displayTableHtml1(){
	var dynamicClsListHTML = '';
    for (var m = 0; m < dns_search_data.length; m++)
    {
        var single = dns_search_data[m];
		var wan_name = "";
		$("#dns_wan option").each(function() {
			if (single.Interface == this.value) 
			{
				wan_name = this.text;
			}
		});
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_'+m+'" style="cursor: pointer;" title="delout_'+ single.dns_search_index +'" onclick="Showthisinfo1(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.DomainName + '</td>';
		dynamicClsListHTML += '<td align="center">' + wan_name + '</td>';
		dynamicClsListHTML += '<td align="center">' + single.DNSServer + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_'+ single.dns_search_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#dns_search_List").html(dynamicClsListHTML);
	$("#dns_search_List tr:eq(0)").click();
}

function Showthisinfo1(element,value)
{
    $("#dns_search_form").show();
    addflag_dns_search = "edit";
    $("#add_item_1").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

    var index = element.split("_")[1];

    selfilterIndex1 = parseInt(value.split("_")[1]);
    var mode = "old";

    displayFormHtml1(mode,index);
}

function displayFormHtml1(mode,index)
{
    var curdata = dns_search_data[index];
    
    if (mode == "init") //页面无数据时显示addfilter
    {
        if (dns_search_data.length > 0)
        {  
            curdata = dns_search_data[index];
        }
        else 
        {
           // addfilter();
            return;
        }
    }
    $("#dns_search_domain").val(curdata.DomainName);
    $("#dns_wan").val(curdata.Interface);
	$("#dns_server").val(curdata.DNSServer);
}

function addfilter_dns_search() //增加过滤条目
{
	addflag_dns_search = "add";
	var addHtml = []; //新增一个占位标记行
	$("#dns_search_form").show();
	addHtml += '<tr id="add_item_1">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';

	if ($("#add_item_1").length == 0) //第一次添加数据时设置默认值
	{
		$("#dns_search_List").append(addHtml);
		$("#dns_search_form .input_text").each(function(i) {
			$(this).val('');
		});

		$("#add_item_1").children().css("background-color", "#b7e3e3");
		$("#add_item_1").siblings().children().css("background-color", "#eef2f6");
		$("#add_item_1").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
	}
}

function addfilter_static_dns() //增加过滤条目
{
	addflag_static_dns = "add";
	var addHtml = []; //新增一个占位标记行
	$("#static_dns_form").show();
	addHtml += '<tr id="add_item_2">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';

	if ($("#add_item_2").length == 0) //第一次添加数据时设置默认值
	{
		$("#static_dns_List").append(addHtml);
		$("#static_dns_form .input_text").each(function(i) {
			$(this).val('');
		});

		$("#add_item_2").children().css("background-color", "#b7e3e3");
		$("#add_item_2").siblings().children().css("background-color", "#eef2f6");
		$("#add_item_2").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
	}
}

function doSave_dnsSearch(){
	show_shadow();
	//清除自定义错误提示
	$("#dns_search_list_form .main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	if (!$("#dns_search_list_form").valid()) {
		alert("illegal_value_alert".i18n());
		return;
	}
	var postdata = new Object();
	postdata.action = addflag_dns_search;
	if (addflag_dns_search == "edit") {
		postdata.dns_search_index = selfilterIndex1;
	}
	if (addflag_dns_search == "add") 
    {
        if (dns_search_data.length >= 8)
        {
            alert("fw_most8RulesAlert".i18n());
            return;
        }		
    }
	postdata.Enable = "1";
	postdata.DomainName = $("#dns_search_domain").val();
	postdata.Interface = $("#dns_wan").val();
	postdata.DNSServer = $("#dns_server").val();
	XHR.post("set_dns_search_info", postdata, initPage);
	addflag_dns_search = "edit";
	selfilterIndex1= 1;
}

function doSave_staticDNS(){
	show_shadow();
	//清除自定义错误提示
	$("#static_dns_list_form .main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	if (!$("#static_dns_list_form").valid()) {
		alert("illegal_value_alert".i18n());
		return;
	}
	var postdata = new Object();
	postdata.action = addflag_static_dns;
	if (addflag_static_dns == "edit") {
		postdata.static_dns_index = selfilterIndex2;
	}
	if (addflag_static_dns == "add") 
    {
        if (static_dns_data.length >= 8)
        {
            alert("fw_most8RulesAlert".i18n());
            return;
        }		
    }
	postdata.Enable = "1";
	postdata.DomainName = $("#static_dns_domain").val();
	postdata.IPAddress = $("#static_dns_ip").val();
	XHR.post("set_static_dns_info", postdata, initPage2);
	addflag_static_dns = "edit";
	selfilterIndex2= 1;
}

function doDelete1(index) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
    postdata.dns_search_index = parseInt(index);
    XHR.post("set_dns_search_info", postdata, null);
	sleep(300);
}


function click_remove_dns_search() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("#dns_search_list_form").find("input[type='checkbox']");
    var is_checked;
    var value_temp;
    var index;

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

    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[1];
            doDelete1(index);
        }
    }
    window.location.reload();
}


function doDelete2(index) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
    postdata.static_dns_index = parseInt(index);
    XHR.post("set_static_dns_info", postdata, null);
	sleep(300);
}


function click_remove_static_dns() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("#static_dns_list_form").find("input[type='checkbox']");
    var is_checked;
    var value_temp;
    var index;

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

    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[1];
            doDelete2(index);
        }
    }
    window.location.reload();
}