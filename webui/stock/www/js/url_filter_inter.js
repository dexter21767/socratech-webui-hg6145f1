var urlfilter_mode;
var urlfilter_enable;
var addflag = "edit";
var url_filter_data;
var selfilterIndex = 1;
var urlflag = true;
$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");	
    //extraValidCheck();
    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });
    if (operator_name == "EG_TELECOM") {
        urlflag = false;
    }
    initValidate();
    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/ipfilter_lan", initPage);
    }
    else {
        XHR.get("get_url_filter_info", null, initPage);
    }

});

function initValidate() {
    $("#ip_filter_list_form").validate({
        debug: true,
        rules: {
            "url_address": { required: true, url: urlflag, rangelength: [1, 255] },
            "url_start_hour": { required: true, number: true, range_int_time: [0, 23], rangelength: [1, 2] },
            "url_start_min": { required: true, number: true, range_int_time: [0, 59], rangelength: [1, 2] },
            "url_end_hour": { required: true, number: true, range_int_time: [0, 23], rangelength: [1, 2] },
            "url_end_min": { required: true, number: true, range_int_time: [0, 59], rangelength: [1, 2] },
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
function Showthisinfo(element, value) //选中当前行并改变背景色
{
    if (!gNewUiFlag) {
        $("#fw_config_form").show();
    }
    addflag = "edit";
    $("#add_item").remove();
    if (operator_name == "EG_TELECOM" || operator_name == "MAR_INWI") {
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    } else {
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

function EnableCancel() {
    if (urlfilter_enable.URLFEnable == '0') {
        $("input[name='urlfilter_enable']:last").attr('checked', 'checked');
    }
    else if (urlfilter_enable.URLFEnable == '1') {
        $("input[name='urlfilter_enable']:first").attr('checked', 'checked');
    }

    if (urlfilter_mode.URLFMode == 'black') //设置过滤模式，黑白名单
    {
        $("input[name='urlfilter_mode']:last").attr('checked', 'checked');
    }
    else if (urlfilter_mode.URLFEnable == 'white') {
        $("input[name='urlfilter_mode']:first").attr('checked', 'checked');
    }

}
function showEditForm(id) {
    $("#fw_config_form").show();
    $("#loading_div").show()
    //$(window.parent.document).find("#loading_window_div4").show();
    //$(window.parent.document).find("#loading_window_div5").show();
    removeError();
    if (id)
        $("#title").html("Edit URL Filtering Rule (ID:".i18n() + (Number(id) + 1) + ")");

}
function displayFormHtml(mode, index) //显示当前选中行的详细信息
{
    var curdata = url_filter_data[index];

    if (mode == "init") //页面无数据时显示addfilter
    {
        if (url_filter_data.length > 0) {
            curdata = url_filter_data[index];
        }
        else {
            // addfilter();
            return;
        }
    }

    $("#url_address").val(curdata.URL);
    $("#url_start_hour").val((curdata.TimeStart).split(":")[0]);
    $("#url_start_min").val((curdata.TimeStart).split(":")[1]);
    $("#url_end_hour").val((curdata.TimeStop).split(":")[0]);
    $("#url_end_min").val((curdata.TimeStop).split(":")[1]);
    $("#enable").val(curdata.Enable);
}

function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    var temp;
    if (url_filter_data.length > 0)
        $("#image").hide();
    else
        $("#image").show();
    for (var m = 0; m < url_filter_data.length; m++) {
        var single = url_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.Url_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.Url_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.URL + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.TimeStart + '--' + single.TimeStop + '</td>';
        if ("1" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "Enable".i18n() + '</td>';
        }
        else if ("0" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "Disable".i18n() + '</td>';
        }
        dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
        dynamicClsListHTML += '</tr>';
    }
    console.log(dynamicClsListHTML)
    $("#ipfilter_List").html(dynamicClsListHTML);
    $("#ipfilter_List tr:eq(0)").click();
}
function displayTableHtml()//从后端获取 urlFilter Table中的数据并在表中显示
{
    var dynamicClsListHTML = '';
    for (var m = 0; m < url_filter_data.length; m++) {
        var single = url_filter_data[m];

        var num = m + 1;
        dynamicClsListHTML += '<tr id="urltable_' + m + '" style="cursor: pointer;" title="delout_' + single.Url_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center" class="out_Name">' + num + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.URL + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.TimeStart + '--' + single.TimeStop + '</td>';
        if (single.Enable == "1") {
            dynamicClsListHTML += '<td align="center" class="out_Protocol">' + "firewall_enable".i18n() + '</td>';//不确定Enable里面是什么，如果打印输出就需要加一个判断
        }
        else if (single.Enable == "0") {
            dynamicClsListHTML += '<td align="center" class="out_Protocol">' + "firewall_disable".i18n() + '</td>';//不确定Enable里面是什么，如果打印输出就需要加一个判断
        }
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="delout_' + single.Url_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#ipfilter_List").html(dynamicClsListHTML);
    $("#ipfilter_List tr:eq(0)").click();
}

function addfilter()//点击add后显示的页面
{
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add URL Filtering Rule".i18n());
        $(".input_text").each(function(i) {
            $(this).val('');
        });
    }
    addflag = "add";
    $("#fw_config_form").show();
    var addHtml = []; //新增一个占位标记行
    if (!gNewUiFlag) {
        addHtml += '<tr id="add_item">';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td></td>';
        addHtml += '</tr>';
    }
    //$("#ipfilter_List").append(addHtml);
    if ($("#add_item").length == 0)//第一次添加数据时设置默认值
    {
        $("#ipfilter_List").append(addHtml);
        $(".input_text").each(function(i) {
            $(this).val('');
        });
        $("#url_start_hour").val("00");
        $("#url_start_min").val("00");
        $("#url_end_hour").val("23");
        $("#url_end_min").val("59");
        if (operator_name == "EG_TELECOM" || operator_name == "MAR_INWI") {
            $("#add_item").children().css("background-color", "#DEC0DF");
            $("#add_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }

    } else {
        $("#add_item").children().css("background-color", "#b7e3e3");
        $("#add_item").siblings().children().css("background-color", "#eef2f6");
        $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    }


}

function initPage(getdata)//从后端获取数据，初始化页面
{
    if (getdata != null && getdata.url_filter_info) {
        urlfilter_mode = getdata.url_filter_info;
        urlfilter_enable = getdata.url_filter_info;
        url_filter_data = getdata.url_filter_info.url_filter_data;
        EnableCancel();
        if (gNewUiFlag) {
            displayTableHtmlNewUI();
            $("#fw_config_form").hide()
            $("#loading_div").hide();
            $(window.parent.document).find("#loading_window_div4").hide();
            $(window.parent.document).find("#loading_window_div5").hide();
            $("#checkAll").prop("checked", false);
            displayFormHtml("init", 0);
        } else {
            displayTableHtml();

            displayFormHtml("init", 0);
            if (operator_name == "EG_TELECOM" || operator_name == "MAR_INWI") {
                $("#ipfilter_List").children().eq(0).children().css("background-color", "#DEC0DF");
                $("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                $("#ipfilter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");

            } else {
                $("#ipfilter_List").children().eq(0).children().css("background-color", "#b7e3e3");
                $("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                $("#ipfilter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            }
        }

    }
}

function doDelete(index) //删除操作
{
    var postdata = new Object();
    postdata.action = "delete";
    postdata.url_filter_index = parseInt(index);
    XHR.post("set_url_filter_info", postdata, initPage);
    sleep(300);
}

function extraValidCheck() {
    var start = parseInt($("#url_start_hour").val()) * 60 + parseInt($("#url_start_min").val());
    var end = parseInt($("#url_end_hour").val()) * 60 + parseInt($("#url_end_min").val());
    if (parseInt(start) > parseInt(end)) {
        if (gNewUiFlag)
            myAlert('Tip', "fw_timeErrorAlert".i18n())
         else
            alert("fw_timeErrorAlert".i18n());
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
                var i = 1
                for (i; i < checkNodes.length; i++) {
                    if (checkNodes[i].checked == true) {
                        value_temp = checkNodes[i].value;
                        index = value_temp.split("_")[1];
                        doDelete(index);
                    }
                }
                window.location.reload();
            }
        });
    } else {
        if (confirm("delete_alert".i18n()) == false) //确认删除
        {
            return;
        }

        for (var i = 0; i < checkNodes.length; i++) {
            if (checkNodes[i].checked == true) {
                value_temp = checkNodes[i].value;
                index = value_temp.split("_")[1];
                doDelete(index);
            }
        }
        window.location.reload();
        //XHR.get("get_url_filter_info", null, initPage); //删除操作后，重新刷新页面
    }

}
    function click_remove_all() {
        var checkNodes = $("input[type='checkbox']");
        if (0 == checkNodes.length) //如果沒有数据，则返回并报错
        {
            alert("no_rules_alert".i18n());
            return;
        }
        if (confirm("delete_alert_all".i18n()) == false) {
            return;
        }
        for (var i = 0; i < checkNodes.length; i++) {
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[1];
            doDelete(index);
        }
        window.location.reload();
        //XHR.get("get_url_filter_info", null, initPage);//删除操作后，重新刷新页面
}

function EnableApply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.url_filter_enable = $("input[name='urlfilter_enable']:checked").val();
    postdata.url_filter_mode = $("input[name='urlfilter_mode']:checked").val();
    XHR.post("set_url_filter_info", postdata, initPage);
}

function doSave() {
    show_shadow();
    var time_start;
    var time_stop;
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (!$("#ip_filter_list_form").valid()) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
            alert("illegal_value_alert".i18n());
        return;
    }
    if (operator_name != "MY_TM") {
        if (!extraValidCheck()) // 额外校验，如要需要再打开
        {
            return;
        }
    }

    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit") {
        postdata.url_filter_index = selfilterIndex;
    }
    if (addflag == "add") {
        if (url_filter_data.length >= 32) {
            if(gNewUiFlag)
                myAlert('Tip', "fw_most32RulesAlert".i18n())
            else
                alert("fw_most32RulesAlert".i18n());
            return;
        }
    }
    time_start = switchto24time($("#url_start_hour").val()) + ":" + switchto24time($("#url_start_min").val());
    time_stop = switchto24time($("#url_end_hour").val()) + ":" + switchto24time($("#url_end_min").val());
    postdata.URL = $("#url_address").val();
    postdata.TimeStart = time_start;
    postdata.TimeStop = time_stop;
    postdata.Enable = $("#enable").val();
    XHR.post("set_url_filter_info", postdata, initPage);
    addflag = "edit";
}