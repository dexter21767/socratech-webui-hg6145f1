var ipfilterin_data;
var ipfilterout_data;
var IPFilterInPolicy;
var IPFilterOutPolicy;
var addflag = "edit";
var selfilterIndex = 1;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	initValidate();
	
	showOrHideLoadingWindowFromIframe("show");

	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipfilter_lan", initPage);
	}
	else
	{
		XHR.get("get_ipfilter_info", null, initPage);
	}
});

function initValidate()
{
	$("#ip_filter_list_form").validate({
		debug: true,
		rules: {
            "ipfilter_Name": {required: true, nocn: true},
            "SourceIPStart": {ipv4: true},
            "SourceIPEnd": {ipv4: true},
            "DestIPStart": {ipv4: true},
            "DestIPEnd": {ipv4: true},
            "SourcePortStart": {range_int:[0,65535]},
			"SourcePortEnd": {range_int:[0,65535]},
			"DestPortStart": {range_int:[0,65535]},
			"DestPortEnd": {range_int:[0,65535]}
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

function EnableCancel()
{
    if (IPFilterInPolicy == 0){
        $("input[name='wanfirewall_mode']:last").attr('checked', 'checked');
    }else{
        $("input[name='wanfirewall_mode']:first").attr('checked', 'checked');
    }

    if (IPFilterOutPolicy == 0){
        $("input[name='lanfirewall_mode']:last").attr('checked', 'checked');
    }else{
        $("input[name='lanfirewall_mode']:first").attr('checked', 'checked');
    }
}

function Showthisinfo(element)
{
    addflag = "edit";
    $("#add_item").remove();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

    var mode = "in";
    if (element.split("_")[0] == "outtable")
    {
        mode = "out";
    }
    var index = element.split("_")[1];

    selfilterIndex = parseInt(index)+1;

    displayFormHtml(mode, index);
}

function displayFormHtml(mode, index)
{
    var direction = "out";
    var curdata = ipfilterout_data[index];
    if (mode == "in")
    {
        curdata = ipfilterin_data[index];
        direction = "in";
    }

    if (mode == "init")
    {
        if (ipfilterout_data.length > 0)
        {
            curdata = ipfilterout_data[index];
            direction = "out";
        }
        else if (ipfilterin_data.length > 0)
        {
            curdata = ipfilterin_data[index];
            direction = "in";
        }
        else
        {
            addfilter();
            return;
        }
    }

    $("#ipfilter_Name").val(curdata.Name);
    $("#ipfilter_direction").val(direction);
    $("#ipfilter_direction").attr("disabled", true);
    setCheckbox("ipfilter_Enable", curdata.Enable);
    $("#SourceIPStart").val(curdata.SourceIPStart);
    $("#SourceIPEnd").val(curdata.SourceIPEnd);
    $("#SourcePortStart").val(curdata.SourcePortStart);
    $("#SourcePortEnd").val(curdata.SourcePortEnd);
    $("#DestIPStart").val(curdata.DestIPStart);
    $("#DestIPEnd").val(curdata.DestIPEnd);
    $("#DestPortStart").val(curdata.DestPortStart);
    $("#DestPortEnd").val(curdata.DestPortEnd);
    $("#Protocol").val(curdata.Protocol);
}

function displayTableHtml()
{
    var dynamicClsListHTML = '';
    for (var m=0; m<ipfilterout_data.length; m++)
    {
        var single = ipfilterout_data[m];
        var EnableStatus;
        if (single.Enable == 1){
            EnableStatus = "pps_enable".i18n();
        }else{
            EnableStatus = "pps_disable".i18n();
        }
        dynamicClsListHTML += '<tr id="outtable_'+m+'" style="cursor: pointer;" onclick="Showthisinfo(this.id)">';
        dynamicClsListHTML += '<td align="center" class="out_Name">' + single.Name + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_direction">LAN->WAN</td>';
        dynamicClsListHTML += '<td align="center" class="out_Enable">' + EnableStatus + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.SourceIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.SourcePortStart + '-'+ single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.DestIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.DestPortStart + '-'+ single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_Protocol">' + single.Protocol + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="button" value="'+"fw_delete".i18n()+'" id="delout_'+m+'" onclick="doDelete(this.id)"></td>';
        dynamicClsListHTML += '</tr>';
    }

    for (var m=0; m<ipfilterin_data.length; m++)
    {
        var single = ipfilterin_data[m];
        var EnableStatus;
        if (single.Enable == 1){
            EnableStatus = "pps_enable".i18n();
        }else{
            EnableStatus = "pps_disable".i18n();
        }
        dynamicClsListHTML += '<tr id="intable_'+m+'" style="cursor: pointer; " onclick="Showthisinfo(this.id)">';
        dynamicClsListHTML += '<td align="center" class="in_Name">' + single.Name + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_direction">WAN->LAN</td>';
        dynamicClsListHTML += '<td align="center" class="in_Enable">' + EnableStatus + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourceIP">' + single.SourceIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourcePort">' + single.SourcePortStart + '-'+ single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestIP">' + single.DestIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestPort">' + single.DestPortStart + '-'+ single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_Protocol">' + single.Protocol + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="button" value="'+"fw_delete".i18n()+'" id="delin_'+m+'" onclick="doDelete(this.id)"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#ipfilter_List").html(dynamicClsListHTML);
}

function addfilter()
{
    addflag = "add";
    var addHtml = [];
    addHtml += '<tr id="add_item">';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '<td>--</td>';
    addHtml += '</tr>';
    if ($("#add_item").length == 0){
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

function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	
	if (getdata != null && getdata.ipfilter_lan)
	{
		ipfilterin_data = getdata.ipfilter_lan.ipfilterin;
		ipfilterout_data = getdata.ipfilter_lan.ipfilterout;
		IPFilterInPolicy = getdata.ipfilter_lan.IPFilterInPolicy;
        IPFilterOutPolicy = getdata.ipfilter_lan.IPFilterOutPolicy;
        
        EnableCancel();	
        displayTableHtml();

        displayFormHtml("init", 0);

        $("#ipfilter_List").children().eq(0).children().css("background-color","#b7e3e3");
        $("#ipfilter_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
        $("#ipfilter_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}

function doDelete(elementName)
{
    console.log(elementName);
    var direction = "out";

    if (elementName.split("_")[0] == "delin")
    {
        direction = "in";
    }
	var index = elementName.split("_")[1];
	
	var postdata = new Object();
	postdata.action = "delete";
	postdata.direction = direction;
	postdata.filter_index = parseInt(index)+1;
	XHR.post("set_ipfilter_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function extraValidCheck()
{
	if ($("#ipfilter_Name").val() == "")
    {
        $("#add_text_error").html("过滤器名不能为空！");
        return false;
    }
    
    if (ip2int($("#SourceIPStart").val()) > ip2int($("#SourceIPEnd").val()))
    {
        $("#MinSourceAddress-error").html("fw_endIPTooSmallAlert".i18n());
        return false;
    }

    if (parseInt($("#SourcePortStart").val()) > parseInt($("#SourcePortEnd").val()))
    {
        $("#MinSourcePort-error").html("fw_endPortTooSmallAlert".i18n());
        return false;
    }
    
    if (ip2int($("#DestIPStart").val()) > ip2int($("#DestIPEnd").val()))
    {
        $("#MinDestinationAddress-error").html("fw_endIPTooSmallAlert".i18n());
        return false;
    }
    
    if (parseInt($("#DestPortStart").val()) > parseInt($("#DestPortEnd").val()))
    {
        $("#MinDestinationPort-error").html("fw_endPortTooSmallAlert".i18n());
        return false;
    }

	return true;
}

function EnableApply()
{
    var postdata = new Object();
    postdata.action = "enable";
    postdata.IPFilterInPolicy = $("input[name='wanfirewall_mode']:checked").val();
    postdata.IPFilterOutPolicy = $("input[name='lanfirewall_mode']:checked").val();
    XHR.post("set_ipfilter_info", postdata, initPage);
    showOrHideLoadingWindowFromIframe("show");
}

function doSave()
{
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function (i){
        $(this).html('');
    });

    if( ! $("#ip_filter_list_form").valid() )
    {
        alert("某些项的值无效，请重新填写");
        return;
    }
    
    if( !extraValidCheck() )
    {
        return;
    }

    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit"){
        postdata.filter_index = selfilterIndex;
    }
    postdata.direction = $("#ipfilter_direction").val();
    if (addflag == "add")
    {
        if ($("#ipfilter_direction").val() == "in" && ipfilterin_data.length >= 8){
            alert("fw_most8RulesAlert".i18n());
            return;
        }

        if ($("#ipfilter_direction").val() == "out" && ipfilterout_data.length >= 8){
            alert("fw_most8RulesAlert".i18n());
            return;
        }
    }
    postdata.Name = $("#ipfilter_Name").val();
    postdata.Enable = getCheckbox("ipfilter_Enable");
    postdata.Protocol = $("#Protocol").val();
    postdata.SourceIPStart = $("#SourceIPStart").val();
    postdata.SourceIPEnd = $("#SourceIPEnd").val();
    postdata.SourcePortStart = $("#SourcePortStart").val();
    postdata.SourcePortEnd = $("#SourcePortEnd").val();
    postdata.DestIPStart = $("#DestIPStart").val();
    postdata.DestIPEnd = $("#DestIPEnd").val();
    postdata.DestPortStart = $("#DestPortStart").val();
    postdata.DestPortEnd = $("#DestPortEnd").val();
    XHR.post("set_ipfilter_info", postdata, initPage);
    showOrHideLoadingWindowFromIframe("show");
}