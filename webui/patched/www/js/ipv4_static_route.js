var ipfilterin_data;
var ipfilterout_data;
var addflag = "edit";
var selfilterIndex = 1;
var operator_name = gOperatorName;
var login_user = gLoginUser;

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
        if (operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP") {
            XHR.get("get_allwan_info_broadBand", null, initConnectName);
        } else {
            XHR.get("get_allwan_info", null, initConnectName);
        }
        XHR.get("get_Ipv4StaticRoute_info", null, initPage);
    }
});




//获取wan_name
function initConnectName(getdata) {
    var wan_num = 0;
    var dynamicHtml = '';
    all_wan_info = getdata;
    if (all_wan_info.show_wan) {
        selectwan = all_wan_info.show_wan;
    }

    if (all_wan_info != '' && all_wan_info.wan) {
        wan_num = all_wan_info.wan.length;
    }
    if (wan_num > 0) {
        for (i = 0; i < wan_num; i++) {
            var single_wan = all_wan_info.wan[i];
            var wan_path = single_wan.WAN_url;
            var wan_ip_mode = single_wan.IPMode;
            if (operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "CHL_ENTEL" || operator_name == "MEX_MEGA") {
                if (single_wan.Name.indexOf("_B_") == -1 && wan_ip_mode != 2) {
                    dynamicHtml += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
                }
            }else if(operator_name == "IDN_LINKNET"){
                if ((single_wan.Name.indexOf("INTERNET") >= 0  || single_wan.Name.indexOf("IPTV") >= 0 ) && single_wan.Name.indexOf("_B_") == -1 && wan_ip_mode != 2) {
                    dynamicHtml += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
                }
            }else {
                if (operator_name == "TH_AIS" && single_wan.Name.indexOf("aisfibre") >= 0 && single_wan.ServiceList.indexOf("INTERNET") >= 0 && single_wan.ConnectionType.indexOf("Routed") >= 0 && wan_ip_mode != 2) {
                    dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
                }
                else if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1 && wan_ip_mode != 2) {
                    dynamicHtml += ' <option name= "upnp_select" value="' + wan_path + '">' + single_wan.Name + '</option>';
                }
            }
        }
    }
    $("#wan_name").html(dynamicHtml);
}

//规则校验
function initValidate() {
    $("#ip_filter_list_form").validate({
        debug: true,
        rules: {
            "gateway": { required: false, ipv4: true },
            "ipAddress": { required: true, ipv4: true },
            "subnetMask": { required: true, subnetMask2: true }
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
    var mode = "old";
    selfilterIndex = value;

    displayFormHtml(mode, index);
}

function displayFormHtml(mode, index) //显示详细信息
{
    var curdata = ipfilterin_data[index];
    if (mode == "init") //页面无数据时
    {
        if (ipfilterin_data.length > 0) {
            curdata = ipfilterin_data[index];
        }
        else {
            return;
        }
    }

    $("#wan_name option").each(function() {

        if (curdata.Interface == this.value) {
            $(this).attr("selected", true);
        }
    });

    $("#gateway").val(curdata.GatewayIPAddress);
    $("#ipAddress").val(curdata.DestIPAddress);
    $("#subnetMask").val(curdata.DestSubnetMask);
    $("#SourcePortEnd").val(curdata.SourcePortEnd);
}

function displayTableHtml() //动态给列表赋值显示后端传来的数据内容
{
    var num = 1;
    var dynamicClsListHTML = '';
    for (var m = 0; m < ipfilterin_data.length; m++) {
        var n = m + 1;
        var single = ipfilterin_data[m];
        var wan_txt = "";
        $("#wan_name option").each(function() {

            if (single.Interface == this.value) {
                wan_txt = this.text;
            }
        });
        dynamicClsListHTML += '<tr id="outtable_' + m + '" style="cursor: pointer;" title="' + single.Ipv4_static_route_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
        dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + wan_txt + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.GatewayIPAddress + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestIP">' + single.DestIPAddress + '</td>';
        dynamicClsListHTML += '<td align="center" class="out_DestPort">' + single.DestSubnetMask + '</td>';
        if(single.Status == "Disabled")
        {
            dynamicClsListHTML += '<td align="center" class="out_Protocol">' + "Disabled".i18n() + '</td>';
        }
        else
        {
            dynamicClsListHTML += '<td align="center" class="out_Protocol">' + "Enabled".i18n() + '</td>';
        }
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="' + single.Ipv4_static_route_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#ipfilter_List").html(dynamicClsListHTML);
    $("#ipfilter_List tr:eq(0)").click();
}

function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    if (ipfilterin_data.length > 0)
        $("#image").hide();
    else
        $("#image").show();
    for (var m = 0; m < ipfilterin_data.length; m++) {
        var single = ipfilterin_data[m];
        var wan_txt = "";
        $("#wan_name option").each(function() {
            if (single.Interface == this.value) {
                wan_txt = this.text;
            }
        });
        dynamicClsListHTML += '<tr id="mactable_' + m + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="' + single.Ipv4_static_route_index + '" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + single.Ipv4_static_route_index + '" name="fw_remove_flag"></td>';
        dynamicClsListHTML += '<td align="center">' + wan_txt + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.GatewayIPAddress + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.DestIPAddress + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.DestSubnetMask + '</td>';
        dynamicClsListHTML += '<td align="center">' + single.Status.i18n() + '</td>';
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
        $("#title").html("Edit IPv4 Static Route Rule(ID:".i18n() + (Number(id) + 1) + ")");
}
function addfilter() //增加过滤条目
{
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add IPv4 Static Route Rule".i18n());
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
        addHtml += '<td align="center">--</td>';
        addHtml += '<td></td>';
        addHtml += '</tr>';

        if ($("#add_item").length == 0)//第一次添加数据时设置默认值
        {
            $("#ipfilter_List").append(addHtml);
            $(".input_text").each(function(i) {
                $(this).val('');
            });
            if (operator_name == "EG_TELECOM"|| operator_name == "MAR_INWI" ) {
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
    if (getdata != null && getdata.Ipv4_static_route_info) {
        ipfilterin_data = getdata.Ipv4_static_route_info.Ipv4_static_route_data;
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

//校验Mac地址是否冲突
function checkMac(macAddress, index) {
    for (var i = 0; i < ipfilterin_data.length; i++) {
        //alert("第"+i+"次循环")
        if (index == ipfilterin_data[i].Ipv4_static_route_index) {
            //alert("进入continue");
            continue;
        }
        if (macAddress == ipfilterin_data[i].DestIPAddress) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "IP_used_Alert".i18n() + '', function() { })
            else
                alert("IP_used_Alert".i18n());
            return false;
        }
    }
    return true;
}

function doDelete(index) //删除操作
{
    var postdata = new Object();
    postdata.action = "delete";
    postdata.filter_index = parseInt(index);
    XHR.post("set_Ipv4StaticRoute_info", postdata, initPage);
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
        if (confirm("delete_alert".i18n()) == false) {
            return;
        }

        for (var i = 0; i < checkNodes.length; i++) {
            if (checkNodes[i].checked == true) {
                value_temp = checkNodes[i].value;
                index = value_temp;
                doDelete(index);

            }
        }
        window.location.reload();
    }
    // XHR.get("get_Ipv4StaticRoute_info", null, initPage); //删除操作后，重新刷新页面
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

        index = value_temp;
        doDelete(index);
    }
    window.location.reload();
    //XHR.get("get_Ipv4StaticRoute_info", null, initPage);
}

function doSave()//提交页面数据 
{
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
    var postdata = new Object();
    postdata.action = addflag;

    if (addflag == "add") {
        var max_num;
        if(operator_name == "MEX_MEGA")
            max_num = 64;
        else
            max_num = 32;
        
        console.log(ipfilterin_data.length);
        if (ipfilterin_data.length >= max_num) {
            if (gNewUiFlag){
                if(operator_name == "MEX_MEGA")
                    myAlert('Tip',"fw_most64RulesAlert".i18n())
                else
                    myAlert('Tip', "fw_most32RulesAlert".i18n())
            }else{
                if(operator_name == "MEX_MEGA")
                    alert("fw_most64RulesAlert".i18n());
                else
                    alert("fw_most32RulesAlert".i18n());
            }
            return;
        }
    }

    if (addflag == "edit") {
        postdata.filter_index = selfilterIndex;
    }
    postdata.Enable = "1";
    postdata.Interface = $("#wan_name").val();
    postdata.GatewayIPAddress = $("#gateway").val();
    postdata.DestIPAddress = $("#ipAddress").val();
    postdata.DestSubnetMask = $("#subnetMask").val();
    if (addflag == "edit") {
        if (checkMac(postdata.DestIPAddress, postdata.filter_index) == false) {
            //alert("请重新输入");
            return;
        }
    } else if (addflag == "add") {
        if (checkMac(postdata.DestIPAddress, postdata.filter_index) == false) {
            //alert("请重新输入");
            return;
        }
    }
    XHR.post("set_Ipv4StaticRoute_info", postdata, initPage);
    addflag = "edit";
}