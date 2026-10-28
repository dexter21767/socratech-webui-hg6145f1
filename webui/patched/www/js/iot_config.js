var sessionidstr = "";
var g_data;
var login_user = gLoginUser;
var operator_name = gOperatorName;
var fttr_type = gFttr_type;

$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");
    initValidate();

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/firewall", initPage);
    }
    else {
        XHR.get("get_iot_info", null, initPage);
    }


});

function initPage(getdata) {
    if (getdata != null) {
        var iot_info = getdata.iot_info;
        if (iot_info.Enable == "0") {
            $("[name='iot_enable'][value='0']").prop('checked', 'true');
        } else if (iot_info.Enable == "1") {
            $("[name='iot_enable'][value='1'").prop('checked', 'true');
        }
        $("#iot_url").val(getdata.HttpConnectUrl);
        $("#iot_password").val(fhdecrypt(getdata.HttpConnectPassword));
    }
}


function initValidate() {
    $("#Iot_form").validate({
        debug: true,
        rules: {
            "iot_url": { required: true, url: true, rangelength: [1, 255] },
            "iot_password": { required: true, minlength: 8, maxlength: 63, nocn: true, pwdcheck_iot: true },

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

function save_enable_apply() {
    show_shadow();
    var postdata = new Object();
    postdata.action = "enable";
    postdata.Enable = $("input[name='iot_enable']:checked").val();
    if (gNewUiFlag)
        myAlert('Tip', "reboot_to_apply".i18n())
    else
       alert("reboot_to_apply".i18n()); 
    
    XHR.post("set_iot_info", postdata, initPage);
}


function save_apply() {
    show_shadow();

    if (!$("#Iot_form").valid()) {
        if(gNewUiFlag)
            myAlert('Tip', "illegal_value_alert".i18n());
        else
            alert("illegal_value_alert".i18n());
        return;
    }

    var postdata = new Object();
    postdata.action = "config";
    postdata.HttpConnectUrl = $("#iot_url").val();
    postdata.HttpConnectPassword = fhencrypt($("#iot_password").val());
    if (gNewUiFlag)
        myAlert('Tip', "reboot_to_apply".i18n())
    else
       alert("reboot_to_apply".i18n()); 
    
    XHR.post("set_iot_info", postdata, initPage);
    
    sleep(1000);
}



