var g_data;
var Username = "";
var Password = "";
var wan_index = "";
var wan_session_index = "";
var iporppp = "";
var wan_iporppp_new = "";
var first_time_login = gFirstFlag;
$(document).ready(function() {
    initValidate();
    if (gDebug) {
        //调试模式读取本地数据
        getDataByAjax("../fake/oltauth", initPage);
    } else {
        XHR.get("get_allwan_info", null, initPage);
    }
    if(first_time_login != "1"){
        window.parent.location = "../index.html";
    }
});

function initValidate() {
    $("#wan_form").validate({
        debug: false,
        rules: {
            Username_text: { required: true, digits: true },
            pwd_text: { required: true, digits: true },
        },
        errorPlacement: function(error, element) {
            //错误信息位置设置方法
            error.insertAfter(element.parent().parent());
        },
        messages: {},
        submitHandler: function(form) {
            //校验成功回调
            fiberlog("validate user management settings ok.....");
        },
        invalidHandler: function(form, validator) {
            //校验失败回调
            fiberlog("validate user management failed.....");
            return false;
        },
    });
}

function initPage(data) {
    if (data != null) {
        for (let i = 0; i < data.wan.length; i++) {
            if (data.wan[i].AddressingType === "PPPoE") {
                this.Username = data.wan[i].Username;
                this.Password = data.wan[i].Password;
                this.wan_index = data.wan[i].wan_index;
                this.wan_session_index = data.wan[i].wan_session_index;
                this.iporppp = data.wan[i].iporppp;
                this.wan_iporppp_new = data.wan[i].iporppp;
            }
        }
    }
    displaywanHtml();
}

function displaywanHtml() {
    if (this.Username == "")
        $("#Username_text").val("");
    else
        $("#Username_text").val(this.Username.split("@")[0]);
    $("#pwd_text").val(fhdecrypt(this.Password));
}

function wanApply() {
    show_shadow();
    if (!$("#wan_form").valid()) {
        return;
    }
    var postdata = new Object();
    postdata.Username = $("#Username_text").val() + "@tedata.net.eg";
    postdata.WPd = fhencrypt($("#pwd_text").val());

    postdata.wan_index = this.wan_index;
    postdata.wan_session_index = this.wan_session_index;
    postdata.iporppp = this.iporppp;
    postdata.wan_iporppp_new = this.iporppp;

    XHR.post("wan_modify_ECU_CNT", postdata, function() {
        window.location.href = "fast_settings_wifi.html";
    });
}

function wanCancel() {
    window.location.href = "fast_settings_eg.html";
}
