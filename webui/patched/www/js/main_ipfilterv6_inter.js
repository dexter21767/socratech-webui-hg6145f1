var ipfilterin_data;
var ipfilterout_data;
var ipv4_filter_mode;
var ipv6_filterup_mode;
var ipv6_filterdown_mode;
var addflag = "edit";
var selfilterIndex = 1;
var operator_name = gOperatorName;
$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");

    initValidate();

    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/ipfilter_lan", initPage);
    }
    else {
        if(operator_name == "ECU_CNT")
            XHR.get("get_firewall_info", null, getaFirewall_info);
        
        XHR.get("get_ipv6filter_info", null, initPage);
    }
});

function getaFirewall_info(getdata) {
    if (getdata != null && getdata.firewall) {
        var g_data = getdata.firewall;
        if ((g_data.LEVEL != "4") && operator_name == "ECU_CNT") {
            $("[type='radio']").attr("disabled", true);
            $(".input_button").hide();
            $(".input_button").attr("disabled", true);

        }
    }
}

function initValidate() {
    $("#ip_filter_list_form").validate({
        debug: true,
        rules: {
            "ipfilter_Name": { nocn: true },
            "SourceIPStart": { ipv6: true },
            "SourceIPEnd": { ipv6: true },
            "DestIPStart": { ipv6: true },
            "DestIPEnd": { ipv6: true },
            "SourcePortStart": { range_int: [1, 65535] },
            "SourcePortEnd": { range_int: [1, 65535] },
            "DestPortStart": { range_int: [1, 65535] },
            "DestPortEnd": { range_int: [1, 65535] }
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
    if (ipv6_filterup_mode == 'black') //设置过滤模式，黑白名单(up)
    {
        $("input[name='ipv6_filterup_mode']:last").attr('checked', 'checked');
    }
    else {
        $("input[name='ipv6_filterup_mode']:first").attr('checked', 'checked');
    }
    if (ipv6_filterdown_mode == 'black') //设置过滤模式，黑白名单(down)
    {
        $("input[name='ipv6_filterdown_mode']:last").attr('checked', 'checked');
    }
    else {
        $("input[name='ipv6_filterdown_mode']:first").attr('checked', 'checked');
    }

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


    var mode = "in";
    if (element.split("_")[0] == "outtable") {
        mode = "out";
    }
    var index = element.split("_")[1];

    selfilterIndex = value.split("_")[1];
    selfilterIndex = parseInt(selfilterIndex);

    displayFormHtml(mode, index);
}

function displayFormHtml(mode, index) //显示详细信息
{
    var direction = "out";
    var curdata = ipfilterout_data[index];
    if (mode == "in") //根据mode来判断方向
    {
        curdata = ipfilterin_data[index];
        direction = "in";
    }

    if (mode == "init") //初始化状态
    {
        if (ipfilterout_data.length > 0) {
            curdata = ipfilterout_data[index];
            direction = "out";
        }
        else if (ipfilterin_data.length > 0) {
            curdata = ipfilterin_data[index];
            direction = "in";
        }
        else {
            // addfilter();
            return;
        }
    }
    $("#ipfilter_direction").val(direction); //赋值
    $("#ipfilter_direction").attr("disabled", true);
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

function displayTableHtml() //动态给列表赋值显示，根据方向direction来给两个方向数据配置后端传来的数据内容
{
    var num = 1;
    var dynamicClsListHTML = '';
    for (var m = 0; m < ipfilterout_data.length; m++) //Out：Lan->Wan 方向
    {
        var n = m + 1;
        var single = ipfilterout_data[m];
        var EnableStatus;
        if (single.Enable == 1) {
            EnableStatus = "pps_enable".i18n();
        }
        else {
            EnableStatus = "pps_disable".i18n();
        }

        dynamicClsListHTML += '<tr id="outtable_' + m + '" style="cursor: pointer;" title="delout_' + single.ipfilterout_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
        dynamicClsListHTML += '<td align="center" class="out_Name">' + num + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_direction">LAN->WAN</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.SourceIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.DestIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_Protocol">' + single.Protocol + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="delout_' + ipfilterout_data[m].ipfilterout_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
        num++;
    }

    for (var m = 0; m < ipfilterin_data.length; m++) //In: Wan -> Lan 方向
    {
        var n = m + 1;
        var single = ipfilterin_data[m];
        var EnableStatus;
        if (single.Enable == 1) {
            EnableStatus = "pps_enable".i18n();
        } else {
            EnableStatus = "pps_disable".i18n();
        }
        dynamicClsListHTML += ' <tr id="intable_' + m + '" style="cursor: pointer; " title="delin_' + single.ipfilterin_index + '"  onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center" class="in_Name">' + num + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_direction">WAN->LAN</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourceIP">' + single.SourceIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestIP">' + single.DestIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_Protocol">' + single.Protocol + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" value="delin_' + ipfilterin_data[m].ipfilterin_index + '" name="fw_remove_flag" id="delin_' + m + '"></td>';
        dynamicClsListHTML += '</tr>';
        num++;
    }

    $("#ipfilter_List").html(dynamicClsListHTML);
    $("#ipfilter_List tr:eq(0)").click();
}
function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    var num = 1;
    if (ipfilterout_data.length == 0 && ipfilterin_data.length == 0)
        $("#image").show();
    else
        $("#image").hide();

    for (var m = 0; m < ipfilterout_data.length; m++) {
        var single = ipfilterout_data[m];
        dynamicClsListHTML += '<tr id="outtable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="delout_' + single.ipfilterout_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="delout_' + single.ipfilterout_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center" class="out_Name">' + num++ + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_direction">LAN->WAN</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.SourceIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.DestIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_Protocol">' + single.Protocol.i18n() + '</td>';
        dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
        dynamicClsListHTML += '</tr>';
    }
    for (var m = 0; m < ipfilterin_data.length; m++) {
        var single = ipfilterin_data[m];
        dynamicClsListHTML += '<tr id="intable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="delin_' + single.ipfilterin_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="delin_' + single.ipfilterin_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center" class="in_Name">' + num++ + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_direction">WAN->LAN</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourceIP">' + single.SourceIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestIP">' + single.DestIPStart + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_Protocol">' + single.Protocol.i18n() + '</td>';
        dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#ipfilter_List").html(dynamicClsListHTML);
    $("#ipfilter_List tr:eq(0)").click();
}
function showEditForm(id) {
    $("#fw_config_form").show();
    $("#loading_div").show()
    //$(window.parent.document).find("#loading_window_div4").show();
    //$(window.parent.document).find("#loading_window_div5").show();
    removeError();
    if (id)
        $("#title").html("Edit IPv6 Filtering Rule (ID:".i18n() + (Number(id) + 1) + ")");
}
function addfilter() //增加过滤条目
{
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add IPv6 Filtering Rule".i18n());
        $(".input_text").each(function(i) {
            $(this).val('');
        });
        $("#ipfilter_direction").val("out");
        $("#ipfilter_direction").attr("disabled", false);
        $("#Protocol").val("TCP/UDP");
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
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td></td>';
        addHtml += '</tr>';

        if ($("#add_item").length == 0)//第一次添加数据时设置默认值
        {
            $("#ipfilter_List").append(addHtml);
            $(".input_text").each(function(i) {
                $(this).val('');
            });
            $("#ipfilter_direction").val("out");
            $("#ipfilter_direction").attr("disabled", false);
            $("#Protocol").val("TCP/UDP");
            setCheckbox("ipfilter_Enable", 0);
            if (operator_name == "EG_TELECOM" || operator_name == "MAR_INWI") {
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

    function initPage(getdata)//从后端获取数据，初始化页面
    {
        if (getdata != null && getdata.ipfilter_lan) {
            ipv6_filterup_mode = getdata.ipfilter_lan.IPV6FilterOutMode;
            ipv6_filterdown_mode = getdata.ipfilter_lan.IPV6FilterInMode;
            ipfilterin_data = getdata.ipfilter_lan.ipfilterin;
            ipfilterout_data = getdata.ipfilter_lan.ipfilterout;
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

    function doDelete(direction, index) //删除操作
    {
        var postdata = new Object();
        postdata.action = "delete";
        postdata.direction = direction;
        postdata.filter_index = index;
        XHR.post("set_ipv6filter_info", postdata, initPage);
        sleep(300);
    }
    function click_remove() //点击删除按钮，可以删除单个和多个
    {
        var checkNodes = $("input[type='checkbox']");
        var is_checked;
        var value_temp;
        var direction;
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
                    for (var i = 0; i < checkNodes.length; i++) {
                        if (checkNodes[i].checked == true) {
                            value_temp = checkNodes[i].value;
                            if (value_temp.split("_")[0] == "delout") {
                                direction = "out";
                            }
                            else if (value_temp.split("_")[0] == "delin") {
                                direction = "in";
                            }
                            index = value_temp.split("_")[1];
                            doDelete(direction, index);
                        }
                    }
                    window.location.reload();
                }
            });
        } else {
            if (confirm("delete_alert".i18n()) == false) {
                return;
            }

            for (var i = 0; i < checkNodes.length; i++) {
                if (checkNodes[i].checked == true) {
                    value_temp = checkNodes[i].value;
                    if (value_temp.split("_")[0] == "delout") {
                        direction = "out";
                    }
                    else if (value_temp.split("_")[0] == "delin") {
                        direction = "in";
                    }
                    index = value_temp.split("_")[1];
                    doDelete(direction, index);
                }
            }
            window.location.reload();
        }
        //XHR.get("get_ipv6filter_info", null, initPage); //删除操作后，重新刷新页面
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
            if (value_temp.split("_")[0] == "delout") {
                direction = "out";
            }
            else if (value_temp.split("_")[0] == "delin") {
                direction = "in";
            }
            index = value_temp.split("_")[1];
            doDelete(direction, index);
        }
        window.location.reload();
        //XHR.get("get_ipv6filter_info", null, initPage);
    }
    function extraValidCheck()//额外规则校验（包括ip、端口等）
    {

        if ($("#SourcePortStart").val() == "" && $("#SourcePortEnd").val() != "") {
            $("#MinSourcePort-error").html("fw_startIPAlert".i18n());
            return false;
        } else if (parseInt($("#SourcePortStart").val()) > parseInt($("#SourcePortEnd").val())) {
            $("#MinSourcePort-error").html("fw_endPortTooSmallAlert".i18n());
            return false;
        }
        if ($("#DestPortStart").val() == "" && $("#DestPortEnd").val() != "") {
            $("#MinDestinationPort-error").html("fw_startPortAlert".i18n());
            return false;
        } else if (parseInt($("#DestPortStart").val()) > parseInt($("#DestPortEnd").val())) {
            $("#MinDestinationPort-error").html("fw_endPortTooSmallAlert".i18n());
            return false;
        }

        return true;
    }

    function EnableApply()//配置filterMode
    {
        show_shadow();
        var postdata = new Object();
        postdata.action = "enable";
        postdata.IPV6FilterOutMode = $("input[name='ipv6_filterup_mode']:checked").val();
        postdata.IPV6FilterInMode = $("input[name='ipv6_filterdown_mode']:checked").val();
        XHR.post("set_ipv6filter_info", postdata, initPage);
    }

    function doSave()//提交页面数据 
    {
        show_shadow();
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

        if (!extraValidCheck()) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
            else
                alert("illegal_value_alert".i18n());
            return;
        }

        var postdata = new Object();
        postdata.action = addflag;
        if (addflag == "edit") {
            postdata.filter_index = selfilterIndex;
        }
        postdata.direction = $("#ipfilter_direction").val();
        if (addflag == "add") {
            if ($("#ipfilter_direction").val() == "in" && ipfilterin_data.length >= 32) {
                if (gNewUiFlag)
                    myAlert('Tip', '' + "fw_most32RulesAlert".i18n() + '', function() { })
                else
                    alert("fw_most32RulesAlert".i18n());
                return;
            }

            if ($("#ipfilter_direction").val() == "out" && ipfilterout_data.length >= 32) {
                if (gNewUiFlag)
                    myAlert('Tip', '' + "fw_most32RulesAlert".i18n() + '', function() { })
                else
                    alert("fw_most32RulesAlert".i18n());
                return;
            }
        }
        postdata.Protocol = $("#Protocol").val();
        postdata.SourceIPStart = $("#SourceIPStart").val();
        postdata.SourceIPEnd = $("#SourceIPEnd").val();
        postdata.SourcePortStart = $("#SourcePortStart").val();
        postdata.SourcePortEnd = $("#SourcePortEnd").val();
        postdata.DestIPStart = $("#DestIPStart").val();
        postdata.DestIPEnd = $("#DestIPEnd").val();
        postdata.DestPortStart = $("#DestPortStart").val();
        postdata.DestPortEnd = $("#DestPortEnd").val();
        XHR.post("set_ipv6filter_info", postdata, initPage);
        addflag = "edit";
    }