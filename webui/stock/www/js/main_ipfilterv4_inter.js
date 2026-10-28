var ipfilterin_data;
var ipfilterout_data;
var ipv4_filter_mode;
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
    if ( operator_name == "ECU_CNT") {
        $("#src_ipfilter_host_adress").show();
        $("#dst_ipfilter_host_adress").show();
        XHR.get("get_lan_status", null, hostInfo);
    }
    else {
        $("#src_ipfilter_host_adress").hide();
        $("#dst_ipfilter_host_adress").hide();
    }

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/ipfilter_lan", initPage);
    }
    else {
        if(operator_name == "ECU_CNT")
            XHR.get("get_firewall_info", null, getaFirewall_info);
        
        XHR.get("get_ipv4filter_info", null, initPage);
    }
    if(operator_name == "ECU_CNT")
    {
        $("#ipfilter_direction").bind("change", function() {
            if($("#ipfilter_direction").val() == "out")
            {
                $("#src_ipfilter_host_adress").show();
                $("#dst_ipfilter_host_adress").hide();
            }else{
                $("#dst_ipfilter_host_adress").show();
                $("#src_ipfilter_host_adress").hide();
            }
        });
        $("#DestIPStart").keyup(function(){
            var this_val = $(this).val();
            var this_valArr = this_val.split(".");
            if (this_valArr.length == 4 && this_valArr[0] != "" && this_valArr[1] != "" && this_valArr[2] != "" && this_valArr[3] != "")
            {
                var ipadd_Before = this_valArr[0] + "." + this_valArr[1] + "." + this_valArr[2] + ".";
                var dst_ip_start = $("#DestIPStart").val();
                if (dst_ip_start != ""){
                    $("#DestIPStart").val(ipadd_Before+dst_ip_start.split(".")[3]);
                    $("#DestIPEnd").val(ipadd_Before+dst_ip_start.split(".")[3]);
                }
            }
        });
        $("#SourceIPStart").keyup(function(){
            var thisval = $(this).val();
            var thisvalArr = thisval.split(".");
            if (thisvalArr.length == 4 && thisvalArr[0] != "" && thisvalArr[1] != "" && thisvalArr[2] != "" && thisvalArr[3] != "")
            {
                var ipaddBefore = thisvalArr[0] + "." + thisvalArr[1] + "." + thisvalArr[2] + ".";
                var sorce_ip_start = $("#SourceIPStart").val();
                if (sorce_ip_start != ""){
                    $("#SourceIPStart").val(ipaddBefore+sorce_ip_start.split(".")[3]);
                    $("#SourceIPEnd").val(ipaddBefore+sorce_ip_start.split(".")[3]);
                }
            }
        });
    }   
});
function selectOption(value) {
    $("#SourceIPStart").val(value)
    $("#SourceIPEnd").val(value)
}
function selectSrcOption(value) {
    $("#DestIPStart").val(value)
    $("#DestIPEnd").val(value)
}
function hostInfo(data) {
    var protocol_select = '<option value="" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-select-</option>';
    if (data && data.lan_status) {
        for (var i = 0; i < data.lan_status.data.length; i++) {
            var dhcpuser = data.lan_status.data[i];
            protocol_select += "<option value='" + dhcpuser.IPAddress + "'>" + dhcpuser.IPAddress + '(' + dhcpuser.HostName + ')' + "</option>";
        }
    }
    $("#src_ipfilter_host_adress").append(protocol_select);
    $("#dst_ipfilter_host_adress").append(protocol_select);
}

function getaFirewall_info(getdata) {
    if (getdata != null && getdata.firewall) {
        var g_data = getdata.firewall;
        if (operator_name == "ECU_CNT" && (g_data.LEVEL != "4")) {
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
            "SourceIPStart": { ipv4: true },
            "SourceIPEnd": { ipv4: true },
            "DestIPStart": { ipv4: true },
            "DestIPEnd": { ipv4: true },
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
    if (ipv4_filter_mode.IPFMode == 'black') //设置过滤模式，黑白名单
    {
        $("input[name='ipv4_filter_mode']:last").attr('checked', 'checked');
    }
    else {
        $("input[name='ipv4_filter_mode']:first").attr('checked', 'checked');
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
    if(operator_name == "ECU_CNT")
    {
        if( direction =="out")
        {
            // alert("111");
            $("#src_ipfilter_host_adress").show();
            $("#dst_ipfilter_host_adress").hide();
        }else
        {
            $("#src_ipfilter_host_adress").hide();
            $("#dst_ipfilter_host_adress").show();
        }
    }
}

function displayTableHtml() //动态给列表赋值显示，根据方向direction来给两个方向数据配置后端传来的数据内容
{
    var num = 1;
    var dynamicClsListHTML = '';
    for (var m = 0; m < ipfilterout_data.length; m++) //Out：Lan->Wan 方向
    {
        var n = m + 1;
        var single = ipfilterout_data[m];
        dynamicClsListHTML += '<tr id="outtable_' + m + '" style="cursor: pointer;" title="delout_' + single.ipfilterout_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
        dynamicClsListHTML += '<td align="center" class="out_Name">' + num++ + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_direction">LAN->WAN</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.SourceIPStart + '-' + single.SourceIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.DestIPStart + '-' + single.DestIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_Protocol">' + single.Protocol + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="delout_' + ipfilterout_data[m].ipfilterout_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }

    for (var m = 0; m < ipfilterin_data.length; m++) //In: Wan -> Lan 方向
    {
        var n = m + 1;
        var single = ipfilterin_data[m];
        dynamicClsListHTML += ' <tr id="intable_' + m + '" style="cursor: pointer; " title="delin_' + single.ipfilterin_index + '"  onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center" class="in_Name">' + num++ + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_direction">WAN->LAN</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourceIP">' + single.SourceIPStart + '-' + single.SourceIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestIP">' + single.DestIPStart + '-' + single.DestIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_Protocol">' + single.Protocol + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" value="delin_' + ipfilterin_data[m].ipfilterin_index + '" name="fw_remove_flag" id="delin_' + m + '"></td>';
        dynamicClsListHTML += '</tr>';
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
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  id="delout_' + m + '" value="delout_' + single.ipfilterout_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center" class="out_Name">' + num++ + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_direction">LAN->WAN</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.SourceIPStart + '-' + single.SourceIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.DestIPStart + '-' + single.DestIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_Protocol">' + single.Protocol.i18n() + '</td>';
        dynamicClsListHTML += '<td id="' + m + '" align="center" class="edit"  onclick="showEditForm(this.id)">' + "Edit".i18n()  + '</td>';
        dynamicClsListHTML += '</tr>';
    }
    for (var m = 0; m < ipfilterin_data.length; m++) {
        var single = ipfilterin_data[m];
        dynamicClsListHTML += '<tr id="intable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="delin_' + single.ipfilterin_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="delin_' + single.ipfilterin_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center" class="in_Name">' + num++ + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_direction">WAN->LAN</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourceIP">' + single.SourceIPStart + '-' + single.SourceIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_SourcePort">' + single.SourcePortStart + '-' + single.SourcePortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestIP">' + single.DestIPStart + '-' + single.DestIPEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_DestPort">' + single.DestPortStart + '-' + single.DestPortEnd + '</td>';
        dynamicClsListHTML += '<td align="center" class="in_Protocol">' + single.Protocol.i18n() + '</td>';
        dynamicClsListHTML += '<td id="' + m + '" align="center" class="edit"  onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
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
        $("#title").html("Edit IPv4 Filtering Rule (ID:".i18n() + (Number(id) + 1) + ")");
}
function addfilter() //增加过滤条目
{
    if(operator_name == "ECU_CNT")
    {
        $("#src_ipfilter_host_adress").show();
        $("#dst_ipfilter_host_adress").hide();
        $("#src_ipfilter_host_adress").val("");
        $("#dst_ipfilter_host_adress").val("");
    }
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add IPv4 Filtering Rule".i18n());
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
        ipv4_filter_mode = getdata.ipfilter_lan;
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
    XHR.post("set_ipv4filter_info", postdata, initPage);
    sleep(300);
}
function click_remove() {
    var checkNodes = $("input[type='checkbox']");
    var is_checked;
    var value_temp;
    var direction;
    var index;

    if (0 == checkNodes.length) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
            alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("input[type = checkbox]").is(':checked');

    if (!is_checked) {
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
    //  XHR.get("get_ipv4filter_info", null, initPage); //删除操作后，重新刷新页面
}

function click_remove_all() {
    var checkNodes = $("input[type='checkbox']");
    if (0 == checkNodes.length) {
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
    // XHR.get("get_ipv4filter_info", null, initPage);
}
function extraValidCheck() {
    if ($("#SourceIPStart").val() == "" && $("#SourceIPEnd").val() != "") {
        $("#MinSourceAddress-error").html("fw_startIPAlert".i18n());
        return false;
    } else if (ip2int($("#SourceIPStart").val()) > ip2int($("#SourceIPEnd").val())) {
        $("#MinSourceAddress-error").html("fw_endIPTooSmallAlert".i18n());
        return false;
    }

    if ($("#SourcePortStart").val() == "" && $("#SourcePortEnd").val() != "") {
        $("#MinSourcePort-error").html("fw_startPortAlert".i18n());
        return false;
    } else if (parseInt($("#SourcePortStart").val()) > parseInt($("#SourcePortEnd").val())) {
        $("#MinSourcePort-error").html("fw_endPortTooSmallAlert".i18n());
        return false;
    }

    if ($("#DestIPStart").val() == "" && $("#DestIPEnd").val() != "") {
        $("#MinDestinationAddress-error").html("fw_startIPAlert".i18n());
        return false;
    } else
        if (ip2int($("#DestIPStart").val()) > ip2int($("#DestIPEnd").val())) {
            $("#MinDestinationAddress-error").html("fw_endIPTooSmallAlert".i18n());
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

function EnableApply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.IPFMode = $("input[name='ipv4_filter_mode']:checked").val();
    XHR.post("set_ipv4filter_info", postdata, initPage);
}

function doSave() {
    show_shadow();

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
    XHR.post("set_ipv4filter_info", postdata, initPage);
    addflag = "edit";
}