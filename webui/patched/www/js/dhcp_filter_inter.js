var dhcp_filter_data = null;
var dhcp_filter_enable;
var dhcp_filter_mode;
var addflag = "edit";
var selfilterIndex = 1;

$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");

    initValidate();

    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/dhcp_filter", initPage);
    }
    else {
        XHR.get("get_dhcp_filter_info", null, initPage);
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
});

function initValidate() {
    $("#dhcp_filter_list_form").validate({
        debug: true,
        rules: {
            "dhcp_mac_address": { required: true, mac: true }
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

function EnableApply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.dhcp_filter_enable = $("input[name='dhcp_filter_enable']:checked").val();
    postdata.dhcp_filter_mode = $("input[name='dhcp_filter_mode']:checked").val();
    XHR.post("set_dhcp_filter_info", postdata, initPage);
}

function EnableCancel() {
    if (dhcp_filter_mode.DHCPFMode == 'black') //设置过滤模式，黑白名单
    {
        $("input[name='dhcp_filter_mode']:last").attr('checked', 'checked');
    }
    else if (dhcp_filter_mode.DHCPFMode == 'white') {
        $("input[name='dhcp_filter_mode']:first").attr('checked', 'checked');
    }
    if (dhcp_filter_enable.DHCPFEnable == '0') {
        $("input[name='dhcp_filter_enable']:last").attr('checked', 'checked');
    }
    else if (dhcp_filter_enable.DHCPFEnable == '1') {
        $("input[name='dhcp_filter_enable']:first").attr('checked', 'checked');
    }
}

function Showthisinfo(element, value) {
    if (!gNewUiFlag) {
        $("#fw_config_form").show();
    }
    addflag = "edit";
    $("#add_item").remove();
    if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
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

function showEditForm(id) {
    $("#fw_config_form").show();
    $("#loading_div").show()
    //$(window.parent.document).find("#loading_window_div4").show();
    //$(window.parent.document).find("#loading_window_div5").show();
    removeError();
    if (id)
        $("#title").html("Edit DHCP Filtering Rule (ID:".i18n() + (Number(id) + 1) + ")");
}
function displayFormHtml(mode, index) {
    var curdata = dhcp_filter_data[index];

    if (mode == "init") //页面无数据时显示addfilter
    {
        if (dhcp_filter_data.length > 0) {
            curdata = dhcp_filter_data[index];
        }
        else {
            //  addfilter();
            return;
        }
    }
    $("#dhcp_mac_address").val(curdata.MAC);
    $("#dhcp_enable").val(curdata.Enable);
}
function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    var temp;
    if (dhcp_filter_data.length > 0)
        $("#image").hide();
    else
        $("#image").show();
    for (var m = 0; m < dhcp_filter_data.length; m++) {
        var single = dhcp_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.dhcp_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.dhcp_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';
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
    $("#dhcp_filter_List").html(dynamicClsListHTML);
    $("#dhcp_filter_List tr:eq(0)").click();
}

function displayTableHtml() {
    var dynamicClsListHTML = '';
    for (var m = 0; m < dhcp_filter_data.length; m++) {
        var single = dhcp_filter_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" style="cursor: pointer;" title="del_' + single.dhcp_filter_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MAC + '</td>';

        if ("1" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "firewall_enable".i18n() + '</td>';
        }
        else if ("0" == single.Enable) {
            dynamicClsListHTML += '<td align="center">' + "firewall_disable".i18n() + '</td>';
        }
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + single.dhcp_filter_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    $("#dhcp_filter_List").html(dynamicClsListHTML);
    $("#dhcp_filter_List tr:eq(0)").click();
}

function addfilter() {
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add DHCP Filtering Rule".i18n());
        $(".input_text").each(function(i) {
            $(this).val('');
        });
    }
    addflag = "add";
    var addHtml = [];
    $("#fw_config_form").show();
    if (!gNewUiFlag) {
        addHtml += '<tr id="add_item">';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center"></td>';
        addHtml += '</tr>';
        if ($("#add_item").length == 0) {
            $("#dhcp_filter_List").append(addHtml);
            $(".input_text").each(function(i) {
                $(this).val('');
            });
            if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
                $("#add_item").children().css("background-color", "#DEC0DF");
                $("#add_item").siblings().children().css("background-color", "#eef2f6");
                $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");

            } else {
                $("#add_item").children().css("background-color", "#b7e3e3");
                $("#add_item").siblings().children().css("background-color", "#eef2f6");
                $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            }
        }
    }
}

    function initPage(getdata) {
        if (getdata != null && getdata.dhcp_filter_info) {
            dhcp_filter_enable = getdata.dhcp_filter_info;
            dhcp_filter_mode = getdata.dhcp_filter_info;
            dhcp_filter_data = getdata.dhcp_filter_info.dhcp_filter_data;
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
                if (gOperatorName == "EG_TELECOM" || operator_name == "MAR_INWI") {
                    $("#dhcp_filter_List").children().eq(0).children().css("background-color", "#DEC0DF");
                    $("#dhcp_filter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                    $("#dhcp_filter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");

                } else {
                    $("#dhcp_filter_List").children().eq(0).children().css("background-color", "#b7e3e3");
                    $("#dhcp_filter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                    $("#dhcp_filter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
                }
            }
        }
    }

    function doDelete(index) //删除操作
    {
        var postdata = new Object();
        postdata.action = "delete";
        postdata.dhcp_filter_index = parseInt(index);
        XHR.post("set_dhcp_filter_info", postdata, initPage);
        sleep(300);
    }

    // function extraValidCheck()
    // {
    //     if (ip2int($("#SourceIPStart").val()) > ip2int($("#SourceIPEnd").val()))
    //     {
    //         $("#MinSourceAddress-error").html("fw_endIPTooSmallAlert".i18n());
    //         return false;
    //     }

    //     if (parseInt($("#SourcePortStart").val()) > parseInt($("#SourcePortEnd").val()))
    //     {
    //         $("#MinSourcePort-error").html("fw_endPortTooSmallAlert".i18n());
    //         return false;
    //     }

    //     if (ip2int($("#DestIPStart").val()) > ip2int($("#DestIPEnd").val()))
    //     {
    //         $("#MinDestinationAddress-error").html("fw_endIPTooSmallAlert".i18n());
    //         return false;
    //     }

    //     if (parseInt($("#DestPortStart").val()) > parseInt($("#DestPortEnd").val()))
    //     {
    //         $("#MinDestinationPort-error").html("fw_endPortTooSmallAlert".i18n());
    //         return false;
    //     }

    // 	return true;
    // }

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
        }
        //XHR.get("get_dhcp_filter_info", null, initPage); //删除操作后，重新刷新页面
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
        // XHR.get("get_dhcp_filter_info", null, initPage);
    }

    function doSave() {
        show_shadow();
        var time_start;
        var time_stop;
        //清除自定义错误提示
        $(".main_item_error_hint_extra").each(function(i) {
            $(this).html('');
        });

        if (!$("#dhcp_filter_list_form").valid()) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
            else
                alert("illegal_value_alert".i18n());
            return;
        }

        /*if( !extraValidCheck() ) // 额外校验，如要需要再打开
        {
             alert("illegal_value_alert".i18n());
            return;
        }*/

        var postdata = new Object();
        postdata.action = addflag;
        if (addflag == "edit") {
            postdata.dhcp_filter_index = selfilterIndex;
        }
        if (addflag == "add") {
            if (dhcp_filter_data.length >= 8) {
                if(gNewUiFlag)
                    myAlert('Tip', "fw_most8RulesAlert".i18n())
                else
                    alert("fw_most8RulesAlert".i18n());
                return;
            }
        }
        postdata.MAC = $("#dhcp_mac_address").val().toUpperCase();
        postdata.Enable = $("#dhcp_enable").val();

        XHR.post("set_dhcp_filter_info", postdata, initPage);
        addflag = "edit";
    }
