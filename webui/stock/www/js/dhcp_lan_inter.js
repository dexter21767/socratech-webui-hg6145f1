var dhcp_filter_data = null;
var dhcp_filter_mode;
var addflag = "edit";
var selfilterIndex = 1;
var dhcp_static_data;
var macAddress;
var IPAddress;
var dhcp_client_data;
var maxaddress;
var minaddress;
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
        XHR.get("get_dhcp_lan_info", null, initPage);
    }
    XHR.get("get_lan_status", null, getDataFromDhcpClient);
    XHR.get("get_ipv4_lan_info", null, getAddressPool);

    if (gOperatorName == "MEX_TELMEX") {
        $("#dhcp_lan_div").removeAttr("style");
        $("#macaddr_tips").removeAttr("class");
    }

    if (gOperatorName == "TH_AIS") {
        $("#dhcp_lan_enable_title").show();
        $("#macaddr_div").removeClass("main_item_name_lan");
    }
	if (gOperatorName == "BZ_INTELBRAS") {
		$("#div_mac_addr").removeClass("main_item_lan");
		$("#macaddr_div").removeClass("main_item_name_lan");
		$("#mac_addr_div").removeClass("main_item_content_lan");
    }
});

//获取地址池地址
function getAddressPool(getdata) {
    minaddress = ip2int(getdata.lan_ipv4.MinAddress);
    maxaddress = ip2int(getdata.lan_ipv4.MaxAddress);
}




//接收 dhcp_client传来的值
function getDataFromDhcpClient(getdata) {
    //alert(JSON.stringify(getdata));
    dhcp_client_data = getdata.lan_status.data;
}

//从dhcp_client中获取ip并检查有效性

function checkip(ip) {
    //alert(ip);
    for (var i = 0; i < dhcp_client_data.length; i++) {
        if (ip == dhcp_client_data[i].IPAddress) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "IP_used_Alert".i18n() + '', function() { })
            else
                alert("IP_used_Alert".i18n());
            return false;
        }
    }
}
function initValidate() {
    $("#dhcp_lan_list_form").validate({
        debug: true,
        rules: {
            "dhcp_lan_mac_address": { mac: true, required: true },
            "dhcp_lan_ip": { ipv4: true, required: true }
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


function extraValidCheck()//额外规则校验（包括ip、端口等）
{

    if (ip2int($("#dhcp_lan_ip").val()) < minaddress || ip2int($("#dhcp_lan_ip").val()) > maxaddress) {
        $("#MinDestinationAddress-error").html("fw_endIPTooSmallAlert".i18n());
        return false;
    }


    return true;
}


function Showthisinfo(element, value) {
    if (!gNewUiFlag) {
        $("#fw_config_form").show();
    }
    addflag = "edit";
    $("#add_item").remove();
    if (gOperatorName == "EG_TELECOM" || (gOperatorName == "MAR_INWI")) {
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

function displayFormHtml(mode, index) {
    var curdata = dhcp_static_data[index];

    if (mode == "init") //页面无数据时显示addfilter
    {
        if (dhcp_static_data.length > 0) {
            curdata = dhcp_static_data[index];
        }
        else {
            // addfilter();
            return;
        }
    }
    $("#dhcp_lan_mac_address").val(curdata.MACAddress);
    $("#dhcp_lan_ip").val(curdata.IPAddress);
    if (gOperatorName == "TH_AIS") {
        $("#dhcp_lan_enable_div").show();
        $("#dhcp_enable").val(curdata.Enable);
    }
}

function displayTableHtml() {
    var dynamicClsListHTML = '';
    for (var m = 0; m < dhcp_static_data.length; m++) {
        var single = dhcp_static_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" style="cursor: pointer;" title="delout_' + single.dhcp_static_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MACAddress + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.IPAddress + '</td>';
        if (gOperatorName == "TH_AIS") {
            if (single.Enable == "1") {
                dynamicClsListHTML += '<td align="center">' + "Enable" + '</td>';
            } else {
                dynamicClsListHTML += '<td align="center">' + "Disable" + '</td>';
            }
        }
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + single.dhcp_static_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#dhcp_lan_List").html(dynamicClsListHTML);
    $("#dhcp_lan_List tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    if (dhcp_static_data.length > 0)
        $("#image").hide();
    else
        $("#image").show();
    for (var m = 0; m < dhcp_static_data.length; m++) {
        var single = dhcp_static_data[m];
        var num = m + 1;
        dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.dhcp_static_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.dhcp_static_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center">' + num + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.MACAddress + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.IPAddress + '</td>';
        if (gOperatorName == "TH_AIS") {
            if ("1" == single.Enable) {
                dynamicClsListHTML += '<td align="center">' + "Enable" + '</td>';
            }
            else if ("0" == single.Enable) {
                dynamicClsListHTML += '<td align="center">' + "Disable" + '</td>';
            }
        }
        dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#dhcp_lan_List").html(dynamicClsListHTML);
    $("#dhcp_lan_List tr:eq(0)").click();
}

function showEditForm(id) {
    $("#fw_config_form").show();
    $("#loading_div").show()
    //$(window.parent.document).find("#loading_window_div4").show();
    //$(window.parent.document).find("#loading_window_div5").show();
    removeError();
    if (id)
        $("#title").html("Edit DHCP Static IP Rule (ID:".i18n() + (Number(id) + 1) + ")");
}
function addfilter() {
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add DHCP Static IP Rule".i18n());
        $(".input_text").each(function(i) {
            $(this).val('');
        });
    }
    addflag = "add";

    $("#fw_config_form").show();
    if (gOperatorName == "TH_AIS") {
        $("#dhcp_lan_enable_div").show();
    }
    if (!gNewUiFlag) {
        var addHtml = [];
        addHtml += '<tr id="add_item">';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        if (gOperatorName == "TH_AIS") {
            addHtml += '<td align="center">--</td>';
        }
        addHtml += '<td align="center"></td>';
        addHtml += '</tr>';
        if ($("#add_item").length == 0) {
            $("#dhcp_lan_List").append(addHtml);
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

    if (getdata != null && getdata.dhcp_static_data) {
        dhcp_static_data = getdata.dhcp_static_data;
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
            if (gOperatorName == "EG_TELECOM" || (gOperatorName == "MAR_INWI")) {
                $("#dhcp_lan_List").children().eq(0).children().css("background-color", "#DEC0DF");
                $("#dhcp_lan_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                $("#dhcp_lan_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            } else {
                $("#dhcp_lan_List").children().eq(0).children().css("background-color", "#b7e3e3");
                $("#dhcp_lan_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                $("#dhcp_lan_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            }
        }

    }
}

function doDelete(index) //删除操作
{
    var postdata = new Object();
    postdata.action = "delete";
    postdata.dhcp_lan_index = parseInt(index);
    XHR.post("set_dhcp_lan_info", postdata, initPage);
    sleep(300);
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
    }
    //XHR.get("get_dhcp_lan_info", null, initPage); //删除操作后，重新刷新页面
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
    //XHR.get("get_dhcp_lan_info", null, initPage);
}

//校验Mac地址和ip是否冲突
function checkMacAndIP(macAddress, IPAddress, index) {
    for (var i = 0; i < dhcp_static_data.length; i++) {
        //alert("第"+i+"次循环")
        if (index == dhcp_static_data[i].dhcp_static_index) {
            //alert("进入continue");
            continue;
        }
        if (macAddress == dhcp_static_data[i].MACAddress) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "IP_used_Alert".i18n() + '', function() { })
            else
            alert("MAC_used_Alert".i18n());
            return false;
        }
        if (IPAddress == dhcp_static_data[i].IPAddress) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "IP_used_Alert".i18n() + '', function() { })
            else
            alert("IP_used_Alert".i18n());
            return false;
        }
    }
    return true;
}

function doSave() {
    show_shadow();
    var time_start;
    var time_stop;
    //清除自定义错误提示
    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (!$("#dhcp_lan_list_form").valid()) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
        alert("illegal_value_alert".i18n());
        return;
    }

    if (!extraValidCheck()) // 额外校验，如要需要再打开
    {
        if (gNewUiFlag)
            myAlert('Tip', '' + "IP_illegal_Alert".i18n() + '', function() { })
        else
        alert("IP_illegal_Alert".i18n());
        return;
    }
    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit") {
        postdata.dhcp_lan_index = selfilterIndex;
    }
    if (addflag == "add") {
        if (dhcp_static_data.length >= 32) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "fw_most32RulesAlert".i18n() + '', function() { })
            else
            alert("fw_most32RulesAlert".i18n());
            return;
        }
    }
    postdata.MACAddress = $("#dhcp_lan_mac_address").val().toUpperCase();
    postdata.IPAddress = $("#dhcp_lan_ip").val();
    if (gOperatorName == "TH_AIS") {
        postdata.Enable = $("#dhcp_enable").val();
    }
    if (addflag == "edit") {
        if (checkMacAndIP(postdata.MACAddress, postdata.IPAddress, postdata.dhcp_lan_index) == false) {
            //alert("请重新输入");
            return;
        }
    } else if (addflag == "add") {
        if (checkMacAndIP(postdata.MACAddress, postdata.IPAddress) == false) {
            //alert("请重新输入");
            return;
        }
    }
    if (gOperatorName != "TH_AIS") {
        if (checkip(postdata.IPAddress) == false) {
            return;
        }
    }
    XHR.post("set_dhcp_lan_info", postdata, initPage);
    addflag = "edit";
}
