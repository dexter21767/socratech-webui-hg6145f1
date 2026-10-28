var ipv6_mac_filter_data = null;
var ipv6_mac_filter_mode;
var ipv6_mac_filter_enable;
var addflag = "edit";
var selfilterIndex = 1;
var operator_name = gOperatorName;
var gMacmode;
var gnotifyflag = true;
$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");

    initValidate();

    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/v6mac_filter", initPage);
    }
    else {
        XHR.get("get_ipv6_mac_filter_info", null, initPage);
    }

    if (gOperatorName == "MEX_TELMEX") {
        $(".main_item_name").css("width", "20%");
        $(".main_item_content").css("width", "calc(80% - 3px)");
    } else {
        if (!gNewUiFlag) {
        $(".main_item_name").css("width", "23%");
        $(".main_item_content").css("width", "calc(77% - 3px)");
        }
    }

    if (operator_name == "EG_TELECOM") {
        $("#mac_host_adress").show();
        XHR.get("get_lan_status", null, hostInfo);
    }
    else {
        $("#mac_host_adress").hide();
    }
});

function selectOption(value) {
    $("#ipv6_mac_address").val(value)
}

function hostInfo(data) {
    var protocol_select = '<option value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-select-</option>';
    if (data && data.lan_status) {
        for (var i = 0; i < data.lan_status.data.length; i++) {
            var dhcpuser = data.lan_status.data[i];
            protocol_select += "<option value='" + dhcpuser.MACAddress + "'>" + dhcpuser.MACAddress + '(' + dhcpuser.HostName + ')' + "</option>";
        }
    }
    $("#mac_host_adress").append(protocol_select);
}

function initValidate() {
    $("#ipv6_mac_filter_list_form").validate({
        debug: true,
        rules: {
            "ipv6_mac_address": { required: true, mac: true },
            "ipv6_mac_start_hour": { required: true, range_int_time: [0, 23], rangelength: [1, 2] },
            "ipv6_mac_start_min": { required: true, range_int_time: [0, 59], rangelength: [1, 2] },
            "ipv6_mac_end_hour": { required: true, range_int_time: [0, 23], rangelength: [1, 2] },
            "ipv6_mac_end_min": { required: true, range_int_time: [0, 59], rangelength: [1, 2] }
        },
        errorPlacement: function(error, element) { //错误信息位置设置方法
            error.insertAfter(element.parent().parent());
        },
        messages: {
        },
        submitHandler: function(form) {//校验成功回调
            fiberlog("validate mac filter ok.....");
        },
        invalidHandler: function(form, validator) {  //校验失败回调
            fiberlog("validate mac filter failed.....");
            return false;
        }
    });
}

function EnableCancel() {
    if (ipv6_mac_filter_mode.IPV6MACFMode == 'black') //设置过滤模式，黑白名单
    {
        $("input[name='ipv6_mac_filter_mode']:last").attr('checked', 'checked');
    }
    else if (ipv6_mac_filter_mode.IPV6MACFMode == 'white') {
        $("input[name='ipv6_mac_filter_mode']:first").attr('checked', 'checked');
    }
    if (ipv6_mac_filter_enable.IPV6MACFEnable == '0') {
        $("input[name='ipv6_mac_filter_enable']:last").attr('checked', 'checked');
    }
    else if (ipv6_mac_filter_enable.IPV6MACFEnable == '1') {
        $("input[name='ipv6_mac_filter_enable']:first").attr('checked', 'checked');
    }
}

function Showthisinfo(element, value) {
    if (!gNewUiFlag) {
    $("#fw_config_form").show();
    }
    addflag = "edit";
    $("#add_item").remove();
    if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI")
    {
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    }else{
    if (!gNewUiFlag) {
    $("#" + element).children().css("background-color", "#b7e3e3");
    $("#" + element).siblings().children().css("background-color", "#eef2f6");
    $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");    
    }
    }
    

    var index = element.split("_")[1];

    selfilterIndex = parseInt(value.split("_")[1]);
    var mode = "old";

    displayFormHtml(mode, index);
}

function displayFormHtml(mode, index) {
    var curdata = ipv6_mac_filter_data[index];

    if (mode == "init") //页面无数据时显示addfilter
    {
        if (ipv6_mac_filter_data.length > 0) {
            curdata = ipv6_mac_filter_data[index];
        }
        else {
            //addfilter();
            return;
        }
    }
    $("#ipv6_mac_address").val(curdata.MAC);
    $("#ipv6_mac_start_hour").val((curdata.TimeStart).split(":")[0]);
    $("#ipv6_mac_start_min").val((curdata.TimeStart).split(":")[1]);
    $("#ipv6_mac_end_hour").val((curdata.TimeStop).split(":")[0]);
    $("#ipv6_mac_end_min").val((curdata.TimeStop).split(":")[1]);
    $("#ipv6_mac_enable").val(curdata.Enable);

}

function displayTableHtml() {
    var dynamicClsListHTML = '';
    for (var m = 0; m < ipv6_mac_filter_data.length; m++) {
        var single = ipv6_mac_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" style="cursor: pointer;" title="del_' + single.ipv6_mac_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.TimeStart + "--" + single.TimeStop + '</td>';
        if ("1" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "firewall_enable".i18n() + '</td>';
        }
        else if ("0" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "firewall_disable".i18n() + '</td>';
        }

        //  dynamicClsListHTML += '<td align="center">' + single.Enable + '</td>';//不确定Enable里面是什么，如果打印输出就需要加一个判断

        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + single.ipv6_mac_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#ipv6_mac_filter_List").html(dynamicClsListHTML);
    $("#ipv6_mac_filter_List tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    if(ipv6_mac_filter_data.length>0)
        $("#image").hide();
    else
        $("#image").show();
    for (var m = 0; m < ipv6_mac_filter_data.length; m++) {
        var single = ipv6_mac_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.ipv6_mac_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.ipv6_mac_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.TimeStart + "--" + single.TimeStop + '</td>';
        if ("1" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "Enable" + '</td>';
        }
        else if ("0" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "Disable" + '</td>';
        }
        dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit" + '</td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#mac_filter_List").html(dynamicClsListHTML);
    $("#mac_filter_List tr:eq(0)").click();
}
function showEditForm(id) {
    $("#fw_config_form").show();
    $("#loading_div").show()
    //$(window.parent.document).find("#loading_window_div4").show();
    //$(window.parent.document).find("#loading_window_div5").show();
    removeError();
    if (id)
        $("#mac_title").html("Edit MAC Filtering (ID:"+(Number(id)+1)+")");
}
function addfilter() {
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
       //$(window.parent.document).find("#loading_window_div5").show();
        $("#mac_title").html("Add MAC Filtering");
    }
    addflag = "add";
    var addHtml = [];
    $("#fw_config_form").show();
    if (operator_name == "EG_TELECOM"  || operator_name == "MAR_INWI") {
        $("#mac_host_adress").show();
        $("#mac_host_adress"). val("");
    }
    else {
        $("#mac_host_adress").hide();
    }
    addHtml += '<tr id="add_item">';
    if (!gNewUiFlag) {
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center"></td>';
    }
    addHtml += '</tr>';
    if ($("#add_item").length == 0) {
        $("#ipv6_mac_filter_List").append(addHtml);
        $(".input_text").each(function(i) {
            $(this).val('');
        });
        $("#ipv6_mac_start_hour").val("00");
        $("#ipv6_mac_start_min").val("00");
        $("#ipv6_mac_end_hour").val("23");
        $("#ipv6_mac_end_min").val("59");
        if (gOperatorName == "EG_TELECOM"  || operator_name == "MAR_INWI")
        {
            $("#add_item").children().css("background-color", "#DEC0DF");
            $("#add_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }else{
        if (!gNewUiFlag) {
         $("#add_item").children().css("background-color", "#b7e3e3");
         $("#add_item").siblings().children().css("background-color", "#eef2f6");
         $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
         }
        }
       
    }
}

function initPage(getdata) {
    if (getdata != null && getdata.ipv6_mac_filter_info) {
        ipv6_mac_filter_enable = getdata.ipv6_mac_filter_info;
        ipv6_mac_filter_mode = getdata.ipv6_mac_filter_info;
        ipv6_mac_filter_data = getdata.ipv6_mac_filter_info.ipv6_filter_data;
        gMacmode = getdata.ipv6_mac_filter_info.IPV6MACFMode;
        ipv6_mac_filter_data = getdata.ipv6_mac_filter_info.ipv6_filter_data;
        EnableCancel();
        if (gNewUiFlag) {
            displayTableHtmlNewUI();
            $("#fw_config_form").hide()
            $("#loading_div").hide();
            $(window.parent.document).find("#loading_window_div4").hide();
            $(window.parent.document).find("#loading_window_div5").hide();
            $("#checkAll").prop("checked", false);
        } else {
        displayTableHtml();
        }

        displayFormHtml("init", 0);
        if (gOperatorName == "EG_TELECOM" || gOperatorName == "MAR_INWI")
        {
            $("#ipv6_mac_filter_List").children().eq(0).children().css("background-color", "#DEC0DF");
            $("#ipv6_mac_filter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
            $("#ipv6_mac_filter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }else{
        if (!gNewUiFlag) {
        $("#ipv6_mac_filter_List").children().eq(0).children().css("background-color", "#b7e3e3");
        $("#ipv6_mac_filter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
        $("#ipv6_mac_filter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");  
        }  
        }
       
    }
}

//校验Mac地址是否冲突
function checkMac(macAddress, index) {
    for (var i = 0; i < ipv6_mac_filter_data.length; i++) {
        //alert("第"+i+"次循环")
        if (index == ipv6_mac_filter_data[i].ipv6_mac_filter_index) {
            //alert("进入continue");
            continue;
        }
        if (macAddress == ipv6_mac_filter_data[i].MAC) {
            alert("MAC_used_Alert".i18n());
            return false;
        }
    }
    return true;
}


function doDelete(index) //删除操作
{
    var postdata = new Object();
    postdata.action = "delete";
    postdata.ipv6_mac_filter_index = index;
    XHR.post("set_ipv6_mac_filter_info", postdata, initPage);
}

function extraValidCheck() {
    var start_hour = $("#ipv6_mac_start_hour").val();
    var start_min = $("#ipv6_mac_start_min").val();
    var end_hour = $("#ipv6_mac_end_hour").val();
    var end_min = $("#ipv6_mac_end_min").val();
    var start = parseInt($("#ipv6_mac_start_hour").val()) * 60 + parseInt($("#ipv6_mac_start_min").val());
    var end = parseInt($("#ipv6_mac_end_hour").val()) * 60 + parseInt($("#ipv6_mac_end_min").val());
    if (parseInt(start) > parseInt(end)) {
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

    if (0 == checkNodes.length) //如果沒有数据，则返回并报错
    {
        if (gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("input[type = checkbox]").is(':checked'); //判断是否有选中

    if (!is_checked) //如果没有选中任何条目
    {
        if (gNewUiFlag)
            myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
        else
        alert("no_selected_rules_alert".i18n());
        return;
    }

    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
    var array = "";
    var count = 0;
                var i = 1
                for (i; i < checkNodes.length; i++) {
        if (checkNodes[i].checked == true) {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[1];
            array += index + ",";
            count++;
        }
    }
    array = array.slice(0, -1)
    doDelete(array);
    if (count == checkNodes.length)
        $("#fw_config_form").hide();
    else
        Showthisinfo("mactable_0", "del_1")
            }
        });
    } else {
        if (confirm("delete_alert".i18n()) == false) //确认删除
        {
            return;
        }
        var array = "";
        var count = 0;
        var i = 0
        for (i; i < checkNodes.length; i++) {
            if (checkNodes[i].checked == true) {
                value_temp = checkNodes[i].value;
                index = value_temp.split("_")[1];
                array += index + ",";
                count++;
            }
        }
        array = array.slice(0, -1)
        doDelete(array);
        if (count == checkNodes.length)
            $("#fw_config_form").hide();
        else
            Showthisinfo("mactable_0", "del_1")
    }
}


function click_remove_all() {
    var checkNodes = $("input[type='checkbox']");
    var array = "";

    if (gnotifyflag) {

        if (0 == checkNodes.length) //如果沒有数据，则返回并报错
        {
            alert("no_rules_alert".i18n());
            return;
        }

        if (confirm("delete_alert_all".i18n()) == false) {
            return;
        }
    }
    if (0 != checkNodes.length) {
        for (var i = 0; i < checkNodes.length; i++) {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[1];
            array += index + ",";
        }
        array = array.slice(0, -1)
        console.log(array)
        doDelete(array);
    }

    $("#fw_config_form").hide();
    gnotifyflag = true;
}

function tip() {
    if (operator_name == "EG_TELECOM") {
        alert("You must enter the MAC adress of the PC connected to the device. Otherwise,you can't access the web page.")
    }
}

function EnableApply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.ipv6_mac_filter_enable = $("input[name='ipv6_mac_filter_enable']:checked").val();
    postdata.ipv6_mac_filter_mode = $("input[name='ipv6_mac_filter_mode']:checked").val();
    if (postdata.ipv6_mac_filter_mode != gMacmode && operator_name == "EG_TELECOM") {
        gnotifyflag = false;
        click_remove_all();
        sleep(300)
    }
    XHR.post("set_ipv6_mac_filter_info", postdata, initPage);
}

function doSave() {
    show_shadow();
    var time_start;
    var time_stop;
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (!$("#ipv6_mac_filter_list_form").valid()) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
        alert("illegal_value_alert".i18n());
        return;
    }

    if (!extraValidCheck()) // 额外校验，如要需要再打开
    {
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
        alert("illegal_value_alert".i18n());
        return;
    }

    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit") {
        postdata.ipv6_mac_filter_index = selfilterIndex;
    }
    if (addflag == "add") {
        if (ipv6_mac_filter_data.length >= 128) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "fw_most128RulesAlert".i18n() + '', function() { })
            else
            alert("fw_most128RulesAlert".i18n());
            return;
        }
    }
    time_start = switchto24time($("#ipv6_mac_start_hour").val()) + ":" + switchto24time($("#ipv6_mac_start_min").val());
    time_stop = switchto24time($("#ipv6_mac_end_hour").val()) + ":" + switchto24time($("#ipv6_mac_end_min").val());
    postdata.MAC = $("#ipv6_mac_address").val().toUpperCase();
    postdata.TimeStart = time_start;
    postdata.TimeStop = time_stop;
    postdata.Enable = $("#ipv6_mac_enable").val();
    if (addflag == "edit") {
        if (checkMac(postdata.MAC, postdata.ipv6_mac_filter_index) == false) {
            //alert("请重新输入");
            return;
        }
    } else if (addflag == "add") {
        if (checkMac(postdata.MAC, postdata.ipv6_mac_filter_index) == false) {
            //alert("请重新输入");
            return;
        }
    }
    XHR.post("set_ipv6_mac_filter_info", postdata, initPage);
    addflag = "edit";
}
