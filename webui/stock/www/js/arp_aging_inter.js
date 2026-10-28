var ipfilterin_data;
var ipfilterout_data;
var addflag = "edit";
var selfilterIndex = 1;
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
		getDataByAjax("../fake/ipfilter_lan", initPage);
	}
	else
	{
		XHR.get("get_allwan_info", null, initConnectName);
		XHR.get("get_arp_aging_info", null, initPage);
	}
});

//获取wan_name
function initConnectName(getdata)
{
	var wan_num = 0;
	var dynamicHtml = '';
	all_wan_info = getdata;
	if ( all_wan_info.show_wan )
	{
		selectwan = all_wan_info.show_wan;
	}
			
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	if ( wan_num > 0 )
	{
		for ( i=0; i< wan_num; i++ )
		{
			var single_wan = all_wan_info.wan[i];	
			var wan_path = single_wan.WAN_url;		
			if(single_wan.Name.indexOf("_B_") == -1)
			{
			 dynamicHtml += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
			}
		}
	}
	$("#wan_name").html(dynamicHtml);
}

//规则校验
function initValidate()
{	
	$("#ip_filter_list_form").validate({
		debug: true,
		rules: {
            "arp_aging_time": {required: true, range_int:[5,1440]}
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

function Showthisinfo(element,value) //选中当前行并改变背景色
{
	$("#fw_config_form").show();
    addflag = "edit";
    $("#add_item").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    var index = element.split("_")[1];
	var mode = "old";
    selfilterIndex = value;

    displayFormHtml(mode,index);
}

function displayFormHtml(mode,index) //显示详细信息
{
   var curdata = ipfilterin_data[index];
   if (mode == "init") //页面无数据时
   {
       if (ipfilterin_data.length > 0)
       {
           curdata = ipfilterin_data[index];
       }
       else
       {
           return;
       }
   }
   
	$("#wan_name").val(curdata.Interface);
	$("#arp_aging_time").val(curdata.ArpAgingTime);
}

function displayTableHtml() //动态给列表赋值显示后端传来的数据内容
{   
    var num = 1;
    var dynamicClsListHTML = '';
    for (var m = 0; m < ipfilterin_data.length; m++)
    {
        var n = m + 1;
        var single = ipfilterin_data[m];
		var temp1 = single.Interface;
		var temp2 = "";
		if($("#wan_name option").length == 0){
			 single.Interface = "";
		}
		$("#wan_name option").each(function (){
			
			if(temp1 == this.value)
			{	
				temp2 = this.text;
				return false;
			}
		})
        dynamicClsListHTML += '<tr id="outtable_'+m+'" style="cursor: pointer;" title="'+ single.arp_aging_index +'" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
        dynamicClsListHTML += '<td align="center" class="out_Id">' + (m+1) + '</td>';
		dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + temp2 + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.ArpAgingTime +'</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="'+ single.arp_aging_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#ipfilter_List").html(dynamicClsListHTML);
	$("#ipfilter_List tr:eq(0)").click();
}

function addfilter() //增加过滤条目
{
    addflag = "add";
    $("#fw_config_form").show(); 
    var addHtml = []; //新增一个占位标记行
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';

    if ($("#add_item").length == 0)//第一次添加数据时设置默认值
    {
        $("#ipfilter_List").append(addHtml);
        $(".input_text").each(function (i){
           $(this).val('');
        });
        $("#ipfilter_direction").val("out");
        $("#ipfilter_direction").attr("disabled", false);
        $("#Protocol").val("TCP/UDP");
        setCheckbox("ipfilter_Enable", 0);
        $("#add_item").children().css("background-color","#b7e3e3");
        $("#add_item").siblings().children().css("background-color","#eef2f6");
        $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function initPage(getdata)//从后端获取数据，初始化页面
{ 
	if (getdata != null && getdata.arp_aging_info)
	{
		if(getdata.arp_aging_info.Enable == "0")
		{	
			 $("input[name='arp_aging_enable']").eq(1).attr('checked', 'checked');
		}else if(getdata.arp_aging_info.Enable == "1")
		{
			 $("input[name='arp_aging_enable']").eq(0).attr('checked', 'checked');
		}
		
		ipfilterin_data = getdata.arp_aging_info.arp_aging_data;
	    displayTableHtml();
		
		displayFormHtml("init", 0);
		$("#ipfilter_List").children().eq(0).children().css("background-color","#b7e3e3");
		$("#ipfilter_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
		$("#ipfilter_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");     
	}
}

function doDelete(index) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
    postdata.filter_index = parseInt(index);
    XHR.post("set_arp_aging_info", postdata, initPage);
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
   
    if(confirm("delete_alert".i18n()) == false)
    {
        return;
    }

    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
            value_temp = checkNodes[i].value;
            index = value_temp;
            doDelete(index);
			
        }
    }
   window.location.reload();
   // XHR.get("get_Ipv4StaticRoute_info", null, initPage); //删除操作后，重新刷新页面
}

function click_remove_all()
{
    var checkNodes = $("input[type='checkbox']");
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
		
        index = value_temp;
        doDelete(index);   
    }
	window.location.reload();
    //XHR.get("get_Ipv4StaticRoute_info", null, initPage);
}

function doSave()//提交页面数据 
{
    show_shadow();
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
	if(!$("#ip_filter_list_form").valid() )
    {
        alert("illegal_value_alert".i18n());
        return;
    }
	
	if($("#wan_name").val() == "" || $("#wan_name").val() == null){
		alert("wan_name_is_empty_alert".i18n());
        return;
	}
	
	var repeatFlag = false;
	if(addflag == "add"){
		$("#ipfilter_List tr").each(function(){
			var cur_wan = $(this).find("td").eq(1).html();
			var cur_time = $(this).find("td").eq(2).html();
			if($("#wan_name option:selected").text() == cur_wan && $("#arp_aging_time").val() == cur_time){
				repeatFlag = true;
			}
		});
	}else{
		$("#ipfilter_List tr").each(function(){
			var index = $(this).index()+1;
			var cur_wan = $(this).find("td").eq(1).html();
			var cur_time = $(this).find("td").eq(2).html();
			if(index != selfilterIndex && $("#wan_name option:selected").text() == cur_wan && $("#arp_aging_time").val() == cur_time){
				repeatFlag = true;
			}
		});
	}
	if(repeatFlag){
		alert("repeat_with_the_existing_rules".i18n());
		$("#arp_aging_time").focus();
		return false;
	}
	
    var postdata = new Object();
    postdata.action = addflag;
	
	if (addflag == "add")
	{
	    if (ipfilterin_data.length >= 8)
	   {
	      alert("fw_most8RulesAlert".i18n());
	      return;
	   }		
	}
	
    if (addflag == "edit")
    {
        postdata.filter_index = selfilterIndex;
    }
    postdata.Interface = $("#wan_name").val();
    postdata.ArpAgingTime = $("#arp_aging_time").val();
    XHR.post("set_arp_aging_info", postdata, initPage);
	addflag = "edit";
}


function EnableApply()//配置ARP Aging Enable
{
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.Enable = $("input[name='arp_aging_enable']:checked").val();
    XHR.post("set_arp_aging_info", postdata, initPage);
}