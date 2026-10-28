var dmz_data = "";
var addflag = "edit";
var all_wan_info = '';
var selfilterIndex = 1;
var lanip;
var lanSecip;
var lanSecip_enable;
var lan_status;
var operator_name = gOperatorName;
var login_user = gLoginUser;
$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");

    initValidate();

    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });
    if (operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP") {
        $("#id_add_div").hide();
    }
    if (operator_name != "MEX_TELMEX") {
        $("#host_name").hide();
    }

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/dmz", initPage);
    }
    else {
        if (operator_name == "MEX_TELMEX") {
            XHR.poll(gStatusFreshInterval, "get_lan_status", null, getLanHost);
        }
        XHR.get("get_allwan_info", null, initPage);
        XHR.get("get_ipv4_lan_info", null, lanip);

    }
    $("#host_name").bind("change", function() {
        $("#dmz_host_ip_address").val($("#host_name").val());
    });
});

function getLanHost(getdata) {
    lan_status = getdata.lan_status

}

function lanip(getdata) {
    lanip = getdata.lan_ipv4.IPInterfaceIPAddress;
    lanSecip = getdata.lan_ipv4.second_ip;
    lanSecip_enable = getdata.lan_ipv4.second_ip_enable;
}

function initValidate() {
    $("#dmz_list_form").validate({
        debug: true,
        rules:
        {
            "dmz_host_ip_address": { required: true, ipv4: true }
        },
        errorPlacement: function(error, element) { //错误信息位置设置方法
            error.insertAfter(element.parent().parent());
        },
        messages: {
        },
        submitHandler: function(form) {//校验成功回调
            fiberlog("validate dmz host ip ok.....");
        },
        invalidHandler: function(form, validator) {  //校验失败回调
            fiberlog("validate dmz host ip failed.....");
            return false;
        }
    });
}

function Showthisinfo(element, value) {
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


    var dmz_index = element.split("_")[1];
    var wan_index = element.split("_")[2];
    var mode = "old";
    selfilterIndex = parseInt(value.split("_")[1]);
    displayFormHtml(mode, wan_index, dmz_index);
}

function displayFormHtml(mode, wan_index, dmz_index) {
    var curdata = wan_info[wan_index].DMZ[dmz_index];//************************************与后端返回数据有关**********************
    var wan_url = wan_info[wan_index].WAN_url;
    if (mode == "init") //初始化状态
    {
        if (curdata.length > 0) {
            curdata = wan_info[wan_index].dmz[dmz_index];
        } else {
            addfilter();
            return;
        }
    }
    $("#dmz_host_ip_address").val(curdata.DMZHostIP);
    $("#dmz_enable").val(curdata.DMZEnabled);
    $("#dmz_wan").val(wan_url);
}

function displayTableHtml() {
    var num = 1;
    var dynamicClsListHTML = '';
    wan_info = all_wan_info.wan; //获取所有wan连接信息
    for (var i = 0; i < wan_info.length; i++) {
        if (wan_info[i].Name.indexOf("INTERNET") >= 0 && wan_info[i].Name.indexOf("_B_") >= 0) {
            continue;
        }
        dmz_data = wan_info[i].DMZ; //获取当前第i条WAN下的DMZ信息
        var wan_url = wan_info[i].WAN_url; // 获取当前wan的url信息，供单条DMZ的wan_name信息显示
        var wan_url_temp = wan_url;//此变量用于以下：如果wan连接改变或者是变为不包含internet 的 时候，则将url栏置空

        if (dmz_data != null && dmz_data.length) {
            for (var m = 0; m < dmz_data.length; m++) //将第i条WAN连接下的DMZ信息进行遍历
            {
                var n = m + 1;
                var single = dmz_data[m]; //对于第m条DMZ 信息赋值给single
                $("#dmz_wan option").each(function() {
                    if (wan_url == this.value) {
                        wan_url = this.text;
                    }
                });
                if (wan_url == wan_url_temp)//如果没有改变，则将url置空
                {
                    wan_url = "";
                }
                //针对每一条DMZ信息，其id中i、m分别表示第i条wan连接下的第m条DMZ信息。以供showshisinfo调用
                dynamicClsListHTML += '<tr id="table_' + m + "_" + i +
                    '" style="cursor: pointer;" title="delout_' + single.dmz_index + '" onclick="Showthisinfo(this.id,this.title)">'; //新增数据时，把数据在前端显示显示
                dynamicClsListHTML += '<td align="center">' + num + '</td>';
                dynamicClsListHTML += '<td align="center">' + single.DMZHostIP + '</td>';
                dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
                if (single.DMZEnabled == "1") {
                    dynamicClsListHTML += '<td align="center">' + "enable_certificate".i18n() + '</td>';
                } else {
                    dynamicClsListHTML += '<td align="center">' + "disable_certificate".i18n() + '</td>';
                }
                dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="del_' + i + '_' + single.dmz_index +
                    '" name="dmz_flag"></td>';
                dynamicClsListHTML += '</tr>';
                num++;
            }
        }
    }

    $("#dmz_list").html(dynamicClsListHTML);
    $("#dmz_list tr:eq(0)").click();

}

function displayTableHtmlNewUI() {
    var dynamicClsListHTML = '';
    var num = 1;
    wan_info = all_wan_info.wan;
    for (var i = 0; i < wan_info.length; i++) {
        if (wan_info[i].Name.indexOf("INTERNET") >= 0 && wan_info[i].Name.indexOf("_B_") >= 0) {
            continue;
        }
        dmz_data = wan_info[i].DMZ;
        var wan_url = wan_info[i].WAN_url;
        var wan_url_temp = wan_url;
        if (dmz_data.length != 0) {
            for (var m = 0; m < dmz_data.length; m++) {
                var n = m + 1;
                var single = dmz_data[m];
                $("#dmz_wan option").each(function() {
                    if (wan_url == this.value) {
                        wan_url = this.text;
                    }
                });
                if (wan_url == wan_url_temp) {
                    wan_url = "";
                }
                dynamicClsListHTML += '<tr id="mactable_' + m + "_" + i + '" class = "table_content" style="cursor: pointer;color:rgba(255, 255, 255, 0.8);font-size:14px"  title="del_' + single.dmz_index + '" onclick="Showthisinfo(this.id,this.title)">';
                dynamicClsListHTML += '<td align="center"><input type="checkbox" style="margin-top: 3px"  value="del_' + i + '_' + single.dmz_index + '" name="fw_remove_flag"></td>';
                dynamicClsListHTML += '<td align="center">' + num + '</td>';
                dynamicClsListHTML += '<td align="center">' + single.DMZHostIP + '</td>';
                dynamicClsListHTML += '<td align="center">' + wan_url + '</td>';
                if (single.DMZEnabled == "1") {
                    dynamicClsListHTML += '<td align="center">' + "Enable".i18n() + '</td>';
                } else {
                    dynamicClsListHTML += '<td align="center">' + "Disable".i18n() + '</td>';
                }
                dynamicClsListHTML += '<td id="' + m + '" align="center" style="color:rgba(255, 107, 49, 1)" onclick="showEditForm(this.id)">' + "Edit".i18n() + '</td>';
                dynamicClsListHTML += '</tr>';
                num++;
            }
        }
    }
    if (dynamicClsListHTML != '')
        $("#image").hide();
    else
        $("#image").show();
    $("#dmz_list").html(dynamicClsListHTML);
    $("#dmz_list tr:eq(0)").click();
}
function showEditForm(id) {
    $("#fw_config_form").show();
    $("#loading_div").show()
    //$(window.parent.document).find("#loading_window_div4").show();
    //$(window.parent.document).find("#loading_window_div5").show();
    removeError();
    if (id)
        $("#title").html("Edit DMZ Rule (ID:".i18n() + (Number(id) + 1) + ")");
}
function addfilter() {
    if (gNewUiFlag) {
        $("#loading_div").show()
        //$(window.parent.document).find("#loading_window_div4").show();
        //$(window.parent.document).find("#loading_window_div5").show();
        $("#title").html("Add DMZ Rule".i18n());
        $(".input_text").each(function(i) {
            $(this).val('');
        });
    }
    addflag = "add";
    var addHtml = [];
    $("#fw_config_form").show();
    $("#dmz_wan").attr("disabled", false);
    if (!gNewUiFlag) {
        addHtml += '<tr id="add_item">';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center">--</td>';
        addHtml += '<td align="center"></td>';
        addHtml += '</tr>';

        if ($("#add_item").length == 0) {
            $("#dmz_list").append(addHtml);
            $(".input_text").each(function(i) {

                $(this).val('');
            });
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

function initPage(getdata) {
    var wan_num = 0;
    var dynamicHtml = '';
    var dynamtiHtml_host = '';

    //增加hostname下拉框
    if (operator_name == "MEX_TELMEX") {
        dynamtiHtml_host += ' <option name= "single_wan" value="">' + "Select" + '</option>';
        for (j = 0; j < lan_status.data.length; j++) {
            var single_lan = lan_status.data[j];
            if (single_lan.AddressSource == "DHCP") {
                dynamtiHtml_host += ' <option name= "single_wan" value="' + single_lan.IPAddress + '">' + single_lan.HostName + '</option>';
            }
        }
        $("#host_name").html(dynamtiHtml_host);
    }

    if (getdata != null && getdata.wan) {
        all_wan_info = getdata;
        wan_info = all_wan_info.wan;
        if (all_wan_info != '' && all_wan_info.wan) {
            wan_num = all_wan_info.wan.length;
        }



        if (wan_num > 0) {
            for (i = 0; i < wan_num; i++) {
                var single_wan = all_wan_info.wan[i];
                var wan_path = single_wan.WAN_url;
                if (operator_name == "TH_AIS" && single_wan.Name.indexOf("aisfibre") >= 0 && single_wan.ServiceList.indexOf("INTERNET") >= 0 && single_wan.ConnectionType.indexOf("Routed") >= 0) {
                    dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
                }
                if (single_wan.Name.indexOf("INTERNET") >= 0 && single_wan.Name.indexOf("_B_") == -1) {
                    dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
                }
            }

            $("#dmz_wan").html(dynamicHtml);
            $("#dmz_wan").attr("disabled", true);
            if (gNewUiFlag) {
                displayTableHtmlNewUI();
                $("#fw_config_form").hide()
                $("#loading_div").hide();
                $(window.parent.document).find("#loading_window_div4").hide();
                $(window.parent.document).find("#loading_window_div5").hide();
                $("#checkAll").prop("checked", false);
            } else {
                displayTableHtml();
                //displayFormHtml("init", 0 , 0);	
                if (operator_name == "EG_TELECOM" || operator_name == "MAR_INWI") {
                    $("#dmz_list").children().eq(0).children().css("background-color", "#DEC0DF");
                    $("#dmz_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                    $("#dmz_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
                } else {
                    $("#dmz_list").children().eq(0).children().css("background-color", "#b7e3e3");
                    $("#dmz_list").children().eq(0).siblings().children().css("background-color", "#eef2f6");
                    $("#dmz_list").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
                }
            }

        }
    }
}


function doDelete(wan_num, index) //删除操作
{
    var postdata = new Object();
    postdata.action = "delete";
    postdata.url = wan_info[parseInt(wan_num)].WAN_url;
    postdata.dmz_index = parseInt(index);
    XHR.post("set_dmz_info_inter", postdata);
    sleep(300);
}

function extraValidCheck() {
    if ($("#dmz_host_ip_address").val() == lanip) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "app_ip_illegal_alert".i18n() + '')
        else
            alert("app_ip_illegal_alert".i18n())
        return false;
    }
    if (operator_name == "COL_CLARO") {
        if ($("#dmz_host_ip_address").val() == lanSecip && lanSecip_enable == "1") {
            $("#MinSourceAddress-error").html("app_ip_illegal_alert".i18n());
            return false;
        }
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
                        var wan_num = value_temp.split("_")[1];
                        index = value_temp.split("_")[2];
                        doDelete(wan_num, index);
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
                var wan_num = value_temp.split("_")[1];
                index = value_temp.split("_")[2];
                doDelete(wan_num, index);
            }
        }
        window.location.reload();
        // XHR.get("get_dmz_info_inter", null, initPage); //删除操作后，重新刷新页面
    }

}

function click_remove_all() {
    var checkNodes = $("input[type='checkbox']");
    if (0 == checkNodes.length) //如果沒有数据，则返回并报错
    {
        alert("no_rules_alert".i18n());
        return;
    }
    if (confirm("delete_all_alert".i18n()) == false) {
        return;
    }
    for (var i = 0; i < checkNodes.length; i++) {
        value_temp = checkNodes[i].value;
        index = value_temp.split("_")[2];
        var wan_num = value_temp.split("_")[1];
        doDelete(wan_num, index);
    }
    window.location.reload();
    // XHR.get("get_dmz_info_inter", null, initPage);
}

function doSave() {
    show_shadow();
    $(".main_item_error_hint_extra").each(function(i) {
        $(this).html('');
    });

    if (!$("#dmz_list_form").valid()) {
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
            alert("illegal_value_alert".i18n());
        return;
    }

    if (!extraValidCheck()) // 额外校验，如要需要再打开
    {
        return;
    }



    var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit") {
        postdata.dmz_index = selfilterIndex;
    }
    if (addflag == "add") {
        var options = $("#dmz_wan option:selected");
        var to_select = options.text();
        var selected_text = $("#dmz_list").html();
        if (selected_text.indexOf(to_select) >= 0) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "wanName_illegal_alert".i18n() + '', function() { })
            else
                alert("wanName_illegal_alert".i18n());
            return;
        }

        if (dmz_data != null && dmz_data.length >= 4) {
            if (gNewUiFlag)
                myAlert('Tip', '' + "app_most8RulesAlert".i18n() + '', function() { })
            else
                alert("app_most8RulesAlert".i18n());
            return;
        }
    }
    postdata.DMZHostIP = $("#dmz_host_ip_address").val();
    postdata.wanurl = $("#dmz_wan").val();
    postdata.DMZEnabled = $("#dmz_enable").val();
    XHR.post("set_dmz_info_inter", postdata, initPage);
    addflag = "edit";
}
