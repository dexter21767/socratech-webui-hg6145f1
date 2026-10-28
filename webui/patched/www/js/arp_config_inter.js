var dhcp_filter_data = null;
var dhcp_filter_mode;
var addflag = "edit";
var selfilterIndex = 1;
var arp_static_data;
var macAddress;
var IPAddress;
var dhcp_client_data;
var maxaddress;
var minaddress;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();

	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/dhcp_filter", initPage);
	}
	else
	{
		XHR.get("get_arp_config_info", null, initPage);
	}
	XHR.get("get_lan_status", null, getDataFromDhcpClient);
	XHR.get("get_ipv4_lan_info", null, getAddressPool);
});

//获取地址池地址
function getAddressPool(getdata)
{
	minaddress = ip2int(getdata.lan_ipv4.MinAddress);
	maxaddress =  ip2int(getdata.lan_ipv4.MaxAddress);
}




//接收 dhcp_client传来的值
function getDataFromDhcpClient(getdata)
{
	//alert(JSON.stringify(getdata));
	dhcp_client_data = getdata.lan_status.data;
}

//从dhcp_client中获取ip并检查有效性

function checkip(ip)
{
	//alert(ip);
	for(var i = 0; i<dhcp_client_data.length; i++)
	{
		if(ip == dhcp_client_data[i].IPAddress){
			alert("IP_used_Alert".i18n());
			return false;
		}
	}
}
function initValidate()
{	
	$("#dhcp_lan_list_form").validate({
		debug: true,
		rules: {
            "dhcp_lan_mac_address": {mac: true, required: true},
			"dhcp_lan_ip":{ipv4:true, required: true}
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


function extraValidCheck()//额外规则校验（包括ip、端口等）
{
   
    if (ip2int($("#dhcp_lan_ip").val()) < minaddress || ip2int($("#dhcp_lan_ip").val()) > maxaddress)
    {
        $("#MinDestinationAddress-error").html("fw_endIPTooSmallAlert".i18n());
        return false;
    }
   

	return true;
}


function Showthisinfo(element,value)
{
    $("#fw_config_form").show();
    addflag = "edit";
    $("#add_item").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

    var index = element.split("_")[1];

    selfilterIndex = parseInt(value.split("_")[1]);
	
    var mode = "old";

    displayFormHtml(mode,index);
}

function displayFormHtml(mode,index)
{
    var curdata = arp_static_data[index];
    
    if (mode == "init") //页面无数据时显示addfilter
    {
        if (arp_static_data.length > 0)
        {  
            curdata = arp_static_data[index];
        }
        else 
        {
           // addfilter();
            return;
        }
    }
    $("#dhcp_lan_mac_address").val(curdata.MACAddress);
    $("#dhcp_lan_ip").val(curdata.IPAddress);
}

function displayTableHtml()
{
    var dynamicClsListHTML = '';
    for (var m = 0; m < arp_static_data.length; m++)
    {
        var single = arp_static_data[m];
		console.log(single);
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_'+m+'" style="cursor: pointer;" title="delout_'+ single.arp_rule_index +'" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MACAddress + '</td>';
		dynamicClsListHTML += '<td align="center">' + single.IPAddress + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_'+ single.arp_rule_index +'" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#dhcp_lan_List").html(dynamicClsListHTML);
	$("#dhcp_lan_List tr:eq(0)").click();
}

function addfilter()
{
    addflag = "add";
    var addHtml = [];
    $("#fw_config_form").show(); 
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    addHtml += '</tr>';
    if ($("#add_item").length == 0)
    {
        $("#dhcp_lan_List").append(addHtml);
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
	
    if (getdata != null && getdata.arp_static_data.arp_data)
	{
		if(getdata.arp_static_data.Enable == "0")
		{	
			 $("input[name='arp_enable']").eq(1).attr('checked', 'checked');
		}else if(getdata.arp_static_data.Enable == "1")
		{
			 $("input[name='arp_enable']").eq(0).attr('checked', 'checked');
		}
		
        arp_static_data = getdata.arp_static_data.arp_data ;
        displayTableHtml();

        displayFormHtml("init", 0);

        $("#dhcp_lan_List").children().eq(0).children().css("background-color","#b7e3e3");
        $("#dhcp_lan_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
        $("#dhcp_lan_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}

function doDelete(index) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
    postdata.arp_rule_index = parseInt(index);
    XHR.post("set_arp_config_info", postdata, initPage);
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
            index = value_temp.split("_")[1];
            doDelete(index);
        }
    }
    window.location.reload();
    //XHR.get("get_dhcp_lan_info", null, initPage); //删除操作后，重新刷新页面
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
        index = value_temp.split("_")[1];
        doDelete(index);   
    }
	window.location.reload();
    //XHR.get("get_dhcp_lan_info", null, initPage);
}

//校验Mac地址和ip是否冲突
function checkMacAndIP(macAddress,IPAddress, index)
{
	for(var i = 0; i < arp_static_data.length; i++ )
	{
		//alert("第"+i+"次循环")
		if(index == arp_static_data[i].arp_rule_index)
		{
			//alert("进入continue");
			continue;
		}
		if(macAddress ==arp_static_data[i].MACAddress)
		{
			alert("MAC_used_Alert".i18n());
			return false ;
		}
		if(IPAddress == arp_static_data[i].IPAddress)
		{
			alert("IP_used_Alert".i18n());
			return false ;
		}
	}
	return true;
}

function doSave()
{
    show_shadow();
    var time_start;
    var time_stop;
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });
	
    if(!$("#dhcp_lan_list_form").valid() )
    {
        alert("illegal_value_alert".i18n());
        return;
    }
    
    if( !extraValidCheck() ) // 额外校验，如要需要再打开
    {
		 alert("IP_illegal_Alert".i18n());
        return;
    }
    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit")
    {
        postdata.arp_rule_index = selfilterIndex;
    }
    if (addflag == "add") 
    {
        if (arp_static_data.length >= 8)
        {
            alert("fw_most8RulesAlert".i18n());
            return;
        }		
    }
    postdata.MACAddress = $("#dhcp_lan_mac_address").val().toUpperCase();
    postdata.IPAddress = $("#dhcp_lan_ip").val();
	if(addflag == "edit"){
		if(checkMacAndIP(postdata.MACAddress,postdata.IPAddress,  postdata.arp_rule_index) == false)
		{
			//alert("请重新输入");
			return;
		}
	}else if(addflag =="add"){
		if(checkMacAndIP(postdata.MACAddress,postdata.IPAddress) == false){
			//alert("请重新输入");
			return;
		}
	}
	if(checkip(postdata.IPAddress) == false)
	{
			return;
	}
	
	XHR.post("set_arp_config_info", postdata, initPage);
    addflag = "edit"; 
}

function EnableApply()//配置ARP Enable
{
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.Enable = $("input[name='arp_enable']:checked").val();
    XHR.post("set_arp_config_info", postdata, initPage);
}

