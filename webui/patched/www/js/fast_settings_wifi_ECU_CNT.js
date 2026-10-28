var g_data;
var login_user = "";
var operator_name = "";
var SSID = "";
var PreSharedKey = "";
$(document).ready(function () {
  initValidate();
  if (gDebug) {
    //调试模式读取本地数据
    getDataByAjax("../fake/oltauth", initPage);
  } else {
    XHR.get("get_wifi_status", null, initPage);
  }
  //解决密码框自动填充问题
  // setTimeout(function () {
  //     document.getElementById("SSID").removeAttribute("disabled");
  // }, 1000);
});

function change_eye() {
  $("#PreSharedKey").toggleClass("fh-text-security");
}

function initValidate() {
  $("#wifi_form").validate({
    debug: false,
    rules: {
      SSID: { required: true, minlength: 1, maxlength: 32, nocn: true },
      PreSharedKey: { required: true, minlength: 8, maxlength: 63, nocn: true },
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
  login_user = gLoginUser;
  operator_name = gOperatorName;
  if (data != null) {
    this.SSID = data.wifi_status[0].SSID;
    this.PreSharedKey = data.wifi_status[0].PreSharedKey;
  }
  displaywifiHtml();
}

function displaywifiHtml() {
  $("#SSID").val(fhdecrypt(this.SSID));
  $("#PreSharedKey").val(fhdecrypt(this.PreSharedKey));
}

function wifiCancel() {
  window.location.href="fast_settings_wan_ECU_CNT.html";
  //displaywifiHtml();
}

function wifiApply() {
  show_shadow();
  if (!$("#wifi_form").valid()) {
    alert("wan_value_invilid".i18n());
    return;
  }
  var postdata = new Object();
  postdata.wifiIndex = "1";
  postdata.SSID = fhencrypt($("#SSID").val());
  postdata.PreSharedKey = fhencrypt($("#PreSharedKey").val());
  XHR.post("setWlanAdvancedSettings_ECU_CNT", postdata, function(){
      window.location.href = "fast_settings_voip_ECU_CNT.html";
  });
 // pause();
  
}
