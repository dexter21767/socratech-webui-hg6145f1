var mac_filter_data = null;
var mac_filter_mode;
var mac_filter_enable;
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
        getDataByAjax("../fake/v4mac_filter", initPage);
    }
    else {
        XHR.get("get_ipv4_mac_filter_info", null, initPage);
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

    if (operator_name == "EG_TELECOM" || operator_name == "ECU_CNT") {
        $("#mac_host_adress").show();
        XHR.get("get_lan_status", null, hostInfo);
    }
    else {
        $("#mac_host_adress").hide();
    }
    if (operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT") {
        $("#button_div").hide();
    }

});

function selectOption(value) {
    $("#mac_address").val(value)
}

function hostInfo(data) {
    var protocol_select = '<option value="" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-select-</option>';
    if (data && data.lan_status) {
        for (var i = 0; i < data.lan_status.data.length; i++) {
            var dhcpuser = data.lan_status.data[i];
            protocol_select += "<option value='" + dhcpuser.MACAddress + "'>" + dhcpuser.MACAddress + '(' + dhcpuser.HostName + ')' + "</option>";
        }
    }
    $("#mac_host_adress").append(protocol_select);
}

function initValidate() {
    $("#mac_filter_list_form").validate({
        debug: true,
        rules: {
            "mac_address": { required: true, mac: true },
            "mac_start_hour": { required: true, range_int_time: [0, 23], rangelength: [1, 2] },
            "mac_start_min": { required: true, range_int_time: [0, 59], rangelength: [1, 2] },
            "mac_end_hour": { required: true, range_int_time: [0, 23], rangelength: [1, 2] },
            "mac_end_min": { required: true, range_int_time: [0, 59], rangelength: [1, 2] }
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

//校验Mac地址是否冲突
function checkMac(macAddress, index) {
    for (var i = 0; i < mac_filter_data.length; i++) {
        if (index == mac_filter_data[i].ipv4_mac_filter_index) {
            continue;
        }
        if (macAddress == mac_filter_data[i].MAC) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "MAC_used_Alert".i18n() + '', function() { })
            else
                alert("MAC_used_Alert".i18n());
            return false;
        }
    }
    return true;
}


function EnableCancel() {
    if (mac_filter_mode.MACFMode == 'black') //设置过滤模式，黑白名单
    {
        $("input[name='mac_filter_mode']:last").attr('checked', 'checked');
        if (operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT") {
            $("input[name='mac_filter_mode']:last").attr('disabled', 'true');
            $("input[name='mac_filter_mode']:first").hide();
            $("#firewall_white").hide();
        }


    }
    else if (mac_filter_mode.MACFMode == 'white') {
        $("input[name='mac_filter_mode']:first").attr('checked', 'checked');
        if (operator_name == "CHL_MP" &&  gArea_code != "PRT_LIGAT") {
            $("input[name='mac_filter_mode']:first").attr('disabled', 'true');
            $("input[name='mac_filter_mode']:last").hide();
            $("#firewall_black").hide();
        }
    }
    if (mac_filter_enable.MACFEnable == '0') {
        $("input[name='mac_filter_enable']:last").attr('checked', 'checked');
        if (operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT") {
            $("input[name='mac_filter_enable']:last").attr('disabled', 'true');
            $("input[name='mac_filter_enable']:first").hide();
            $("#firewall_enable").hide();
        }
    }
    else if (mac_filter_enable.MACFEnable == '1') {
        $("input[name='mac_filter_enable']:first").attr('checked', 'checked');
        if (operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT") {
            $("input[name='mac_filter_enable']:first").attr('disabled', 'true');
            $("input[name='mac_filter_enable']:last").hide();
            $("#firewall_disable").hide();
        }
    }
}

function Showthisinfo(element, value) {
    if ((operator_name != "CHL_MP" || gArea_code == "PRT_LIGAT") && !gNewUiFlag) {
        $("#fw_config_form").show();
    }
    addflag = "edit";
    $("#add_item").remove();
    if (gOperatorName == "EG_TELECOM") {
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    }else if(gOperatorName == "MAR_INWI"){
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    }
     else {
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
    var curdata = mac_filter_data[index];
    if (mode == "init") //页面无数据时显示addfilter
    {
        if (mac_filter_data.length > 0) {
            curdata = mac_filter_data[index];
        }
        else {
            // addfilter();
            return;
        }
    }

    $("#mac_address").val(curdata.MAC);
    $("#mac_start_hour").val((curdata.TimeStart).split(":")[0]);
    $("#mac_start_min").val((curdata.TimeStart).split(":")[1]);
    $("#mac_end_hour").val((curdata.TimeStop).split(":")[0]);
    $("#mac_end_min").val((curdata.TimeStop).split(":")[1]);
    $("#mac_enable").val(curdata.Enable);
}

function displayTableHtml() {
    var dynamicClsListHTML = '';
    for (var m = 0; m < mac_filter_data.length; m++) {
        var single = mac_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" style="cursor: pointer;"  title="del_' + single.ipv4_mac_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.TimeStart + "--" + single.TimeStop + '</td>';
        if ("1" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "firewall_enable".i18n() + '</td>';
        }
        else if ("0" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "firewall_disable".i18n() + '</td>';
        }
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + single.ipv4_mac_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#mac_filter_List").html(dynamicClsListHTML);
    $("#mac_filter_List tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    if (mac_filter_data.length > 0)
        $("#image").hide();
    else
        $("#image").show();
    for (var m = 0; m < mac_filter_data.length; m++) {
        var single = mac_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.ipv4_mac_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.ipv4_mac_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.TimeStart + "--" + single.TimeStop + '</td>';
        if ("1" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "Enable".i18n() + '</td>';
        }
        else if ("0" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "Disable".i18n() + '</td>';
        }
        dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
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
        $("#title").html("Edit MAC Filtering (ID:".i18n() + (Number(id) + 1) + ")");
}
function addfilter() {
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add MAC Filtering".i18n());
    }
    addflag = "add";
    var addHtml = [];
    if (operator_name != "CHL_MP" || gArea_code == "PRT_LIGAT") {
        $("#fw_config_form").show();
    }
    if (operator_name == "EG_TELECOM"|| operator_name == "ECU_CNT") {
        $("#mac_host_adress").show();
        $("#mac_host_adress"). val("");
    }
    else {
        $("#mac_host_adress").hide();
    }
    if (!gNewUiFlag) {
        addHtml += '<tr id="add_item">';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center"></td>';
        addHtml += '</tr>';
    }
    if ($("#add_item").length == 0) {
        $("#mac_filter_List").append(addHtml);
        $(".input_text").each(function(i) {
            $(this).val('');
        });
        $("#mac_start_hour").val("00");
        $("#mac_start_min").val("00");
        $("#mac_end_hour").val("23");
        $("#mac_end_min").val("59");
        if (gOperatorName == "EG_TELECOM" || (gOperatorName == "MAR_INWI") ){
            $("#add_item").children().css("background-color", "#DEC0DF");
            $("#add_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");

        }else {
            if (!gNewUiFlag) {
                $("#add_item").children().css("background-color", "#b7e3e3");
                $("#add_item").siblings().children().css("background-color", "#eef2f6");
                $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            }
        }

    }
}

function initPage(getdata) {
    if (getdata != null && getdata.ipv4_mac_filter_info) {
        mac_filter_enable = getdata.ipv4_mac_filter_info;
        mac_filter_mode = getdata.ipv4_mac_filter_info;
        gMacmode = getdata.ipv4_mac_filter_info.MACFMode;
        mac_filter_data = getdata.ipv4_mac_filter_info.mac_filter_data;
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
            if (gOperatorName == "EG_TELECOM" || (gOperatorName == "MAR_INWI")) {
                $("#mac_filter_List").children().eq(0).children().css("background-color", "#DEC0DF");
                $("#mac_filter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                $("#mac_filter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            } else {
                $("#mac_filter_List").children().eq(0).children().css("background-color", "#b7e3e3");
                $("#mac_filter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                $("#mac_filter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            }
        }

    }
}

function doDelete(index) //删除操作
{
    var postdata = new Object();
    postdata.action = "delete";
    postdata.ipv4_mac_filter_index = index;
    XHR.post("set_ipv4_mac_filter_info", postdata, initPage);
}

function extraValidCheck() {
    var start_hour = $("#mac_start_hour").val();
    var start_min = $("#mac_start_min").val();
    var end_hour = $("#mac_end_hour").val();
    var end_min = $("#mac_end_min").val();
    var start = parseInt($("#mac_start_hour").val()) * 60 + parseInt($("#mac_start_min").val());
    var end = parseInt($("#mac_end_hour").val()) * 60 + parseInt($("#mac_end_min").val());
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
    if (operator_name == "EG_TELECOM" || operator_name == "ECU_CNT") {
		alert("include_pc_mac".i18n());
	}
}

function EnableApply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.ipv4_mac_filter_enable = $("input[name='mac_filter_enable']:checked").val();
    postdata.ipv4_mac_filter_mode = $("input[name='mac_filter_mode']:checked").val();
    if (postdata.ipv4_mac_filter_mode != gMacmode && operator_name == "EG_TELECOM") {
        gnotifyflag = false;
        click_remove_all();
        sleep(300)
    }
    XHR.post("set_ipv4_mac_filter_info", postdata, initPage);

}

function doSave() {
    show_shadow();
    var time_start;
    var time_stop;
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (!$("#mac_filter_list_form").valid()) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
            alert("illegal_value_alert".i18n());
        return;
    }
    if (operator_name != "MY_TM") {
        if (!extraValidCheck()) // 额外校验，如要需要再打开
        {
            if (gNewUiFlag)
                myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
            else
                alert("illegal_value_alert".i18n());
            return;
        }
    }


    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit") {
        postdata.ipv4_mac_filter_index = selfilterIndex;

    }
    if (addflag == "add") {
        if (mac_filter_data.length >= 128) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "fw_most128RulesAlert".i18n() + '', function() { })
            else
                alert("fw_most128RulesAlert".i18n());
            return;
        }
    }
    time_start = switchto24time($("#mac_start_hour").val()) + ":" + switchto24time($("#mac_start_min").val());
    time_stop = switchto24time($("#mac_end_hour").val()) + ":" + switchto24time($("#mac_end_min").val());
    postdata.MAC = $("#mac_address").val().toUpperCase();
    postdata.TimeStart = time_start;
    postdata.TimeStop = time_stop;
    postdata.Enable = $("#mac_enable").val();
    if (operator_name != "MY_TM") {
        if (addflag == "edit") {
            if (checkMac(postdata.MAC, postdata.ipv4_mac_filter_index) == false) {
                //alert("请重新输入");
                return;
            }
        } else if (addflag == "add") {
            if (checkMac(postdata.MAC, postdata.ipv4_mac_filter_index) == false) {
                //alert("请重新输入");
                return;
            }
        }
    }



    XHR.post("set_ipv4_mac_filter_info", postdata, initPage);
    addflag = "edit";
    //实现Add按钮的动态新增   
}
