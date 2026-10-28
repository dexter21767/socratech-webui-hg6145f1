var g_data;
var login_user = "";
var operator_name = "";
var Username = "";
var Password = "";
var wan_index = "";
var wan_session_index = "";
var iporppp = "";
var wan_iporppp_new = "";

$(document).ready(function () {
  initValidate();
  if (gDebug) {
    //调试模式读取本地数据
    getDataByAjax("../fake/oltauth", initPage);
  } else {
    XHR.get("get_allwan_info", null, initPage);
  }
  //解决密码框自动填充问题
  // setTimeout(function () {
  //     document.getElementById("Username_text").removeAttribute("disabled");
  // }, 1000);
});

function change_eye() {
  $("#pwd_text").toggleClass("fh-text-security");
}

function initValidate() {
  $("#wan_form").validate({
    debug: false,
    rules: {
      Username_text: { required: true },
      pwd_text: { required: true, nocn: true },
    },
    errorPlacement: function (error, element) {
      //错误信息位置设置方法
      error.insertAfter(element.parent().parent());
    },
    messages: {},
    submitHandler: function (form) {
      //校验成功回调
      fiberlog("validate user management settings ok.....");
    },
    invalidHandler: function (form, validator) {
      //校验失败回调
      fiberlog("validate user management failed.....");
      return false;
    },
  });
}

function initPage(data) {
  //用户层级
  login_user = gLoginUser;
  //国家码
  operator_name = gOperatorName;
  // wan_info = data.wan;
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
  $("#Username_text").val(this.Username);
  $("#pwd_text").val(fhdecrypt(this.Password));
}

function wanCancel() {
  displaywanHtml();
}

function wanApply() {
  show_shadow();
  if (!$("#wan_form").valid()) {
    alert("wan_value_invilid".i18n());
    return;
  }
  var postdata = new Object();
  postdata.Username = $("#Username_text").val();
  postdata.WPd = fhencrypt($("#pwd_text").val());

  postdata.wan_index = this.wan_index;
  postdata.wan_session_index = this.wan_session_index;
  postdata.iporppp = this.iporppp;
  postdata.wan_iporppp_new = this.iporppp;

  XHR.post("wan_modify_ECU_CNT", postdata, function(){
      window.location.href = "fast_settings_wifi_ECU_CNT.html";
  });
  //pause();
}

