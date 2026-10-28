var sessionidstr = "";
var g_data;
var    all_wan_info = '';
$(document).ready(function(){
    //优化滚动条，无需改动
    //customScrollBar("html");

    initValidate();
    
    if ( gDebug ) //调试模式读取本地数据
    {
        getDataByAjax("../fake/ddns", initPage);
    }
    else {
        XHR.get("get_allwan_info", null, initConnectName);
        $("#gre_type").bind("change", function() {
            if ($("#gre_type").val() == "0") { //ipv4
                switchWanName(1)
                if (operator_name == "MEX_MEGA") {
                    $("#div_gre_remote_url_v4").show();
                    $("#div_gre_remote_url_v6").hide();
                }
            } else { //ipv6
                switchWanName(2)
                if (operator_name == "MEX_MEGA") {
                    $("#div_gre_remote_url_v4").hide();
                    $("#div_gre_remote_url_v6").show();
                }
            }
        });
        XHR.get("get_gre_tunnel_info", null, initPage);
    }
});

function gre_type_switch() {
    if ($("#gre_type").val() == "0")//ipv4
    {
        switchWanName(1)
        if (operator_name == "MEX_MEGA") {
            $("#div_gre_remote_url_v4").show();
            $("#div_gre_remote_url_v6").hide();
        }
    }
    else {
        switchWanName(2)
        if (operator_name == "MEX_MEGA") {
            $("#div_gre_remote_url_v4").hide();
            $("#div_gre_remote_url_v6").show();
        }
    }
}
function initValidate() {
    var url_ipv4_flag = false;
    var ipv4_flag = false;
    var ipv6_flag = false;
    if (operator_name == "MEX_MEGA") {
        url_ipv4_flag = false;
        ipv4_flag = true;
        ipv6_flag = true;
    }
    else {
        url_ipv4_flag = true;
        ipv4_flag = false;
        ipv6_flag = false;
    }
    $("#gre_tunnel_form").validate({
        debug: true,
        rules:
        {//-------------------------------------------------判断规则
            "gre_remote_url": { required: true, url: url_ipv4_flag, ipv4: ipv4_flag, rangelength: [1, 255] },
            "gre_remote_url_v6": { required: true, ipv6: ipv6_flag, rangelength: [1, 255] },
            "gre_vlanID": { required: true, range_int: [1, 4095] },
            "gre_tunnel_wanurl_select": { required: true },
        },
        errorPlacement: function(error, element) { //错误信息位置设置方法
            error.insertAfter(element.parent().parent());
        },
        messages: {
        },
        submitHandler: function(form) {//校验成功回调
            fiberlog("validate ddns ok.....");
        },
        invalidHandler: function(form, validator) {  //校验失败回调
            fiberlog("validate ddns failed.....");
            return false;
        }
    });
}

function initPage(getdata) {
    if (getdata != null) {
        g_data = getdata;
        displayHtml();
    }
}

function displayHtml() {
    if (g_data.Enable == "1") {
        $("input[name='gre_enable']").eq(0).attr('checked', 'true');
    }
    else {
        $("input[name='gre_enable']").eq(1).attr('checked', 'true');
    }
    $("#gre_type").val(g_data.IPMode);
    $("#gre_vlanID").val(g_data.VLANID);
    gre_type_switch();
    if (operator_name == "MEX_MEGA") {
        $("#div_gre_title").hide();
        $("#app_gre_prompt").html("gre_prompt".i18n());

        if (g_data.IPMode == "0")//ipv4
        {
            $("#gre_remote_url").val(g_data.RemoteURL);
        }
        else {
            $("#gre_remote_url_v6").val(g_data.RemoteURL);
        }
    }
    else {
        $("#gre_remote_url").val(g_data.RemoteURL);
    }
    $("#gre_tunnel_wanurl_select").val(g_data.WanURL);

}

function switchWanName(ipmode) {
    var wan_num = 0;
    var dynamicHtml = '';
    if (all_wan_info != '' && all_wan_info.wan) {
        wan_num = all_wan_info.wan.length;
    }
    if (wan_num > 0) {
        for (i = 0; i < wan_num; i++) {
            var single_wan = all_wan_info.wan[i];
            var wan_path = single_wan.WAN_url;
            if ((single_wan.ServiceList.indexOf("INTERNET") >= 0 || single_wan.ServiceList.indexOf("COMMUNITY") >= 0) && (single_wan.IPMode == 3 || single_wan.IPMode == ipmode))//里面有internet
            {
                dynamicHtml += ' <option name= "ddns_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
            }
        }
    }
    $("#gre_tunnel_wanurl_select").html(dynamicHtml);
}

function initConnectName(getdata) {
    all_wan_info = getdata;
}


function save_apply() {
    show_shadow();
    if (!$("#gre_tunnel_form").valid()) {
        if (gNewUiFlag)
            myAlert('Tip', "illegal_value_alert".i18n())
        else
            alert("illegal_value_alert".i18n());
        return;
    }
    var postdata = new Object();
    postdata.Enable = $("input[name='gre_enable']:checked").val();
    postdata.IPMode = $("#gre_type").val();
    postdata.WanURL = $("#gre_tunnel_wanurl_select").val();
    if (operator_name == "MEX_MEGA") {
        if ($("#gre_type").val() == "0")//ipv4
        {
            postdata.RemoteURL = $("#gre_remote_url").val();
        }
        else//ipv6
        {
            postdata.RemoteURL = $("#gre_remote_url_v6").val();
        }
    }
    else {
        postdata.RemoteURL = $("#gre_remote_url").val();
    }
    postdata.VLANID = $("#gre_vlanID").val();
    XHR.post("set_gre_tunnel_info", postdata, initPage);
}