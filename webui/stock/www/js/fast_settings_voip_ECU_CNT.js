var g_data;
var login_user = "";
var operator_name = "";
var port = "";
var voipData;
var AuthUserName1 = "";
var AuthPassword1 = "";
var DirectoryNumber1 = "";
var voice_port_num = "1";

$(document).ready(function () {
  initValidate();
  if (gDebug) {
    //调试模式读取本地数据
    getDataByAjax("../fake/oltauth", initPage);
  } else {
    XHR.get("get_voice_base_info", null, initPage);
  }
  //解决密码框自动填充问题
  // setTimeout(function () {
  //     document.getElementById("wifiName_text").removeAttribute("disabled");
  // }, 1000);
});

function change_eye() {
  $("#AuthPassword1").toggleClass("fh-text-security");
}

function initValidate() {
  $("#wifi_form").validate({
    debug: false,
    rules: {
      AuthUserName_text_1: {
        required: true,
        minlength: 1,
        maxlength: 64,
        nocn: true,
      },
      AuthPassword1: {
        required: true,
        minlength: 1,
        maxlength: 64,
        nocn: true,
      },
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
  voipData = data.voice_base;

  if (voipData != null) {
    this.AuthUserName1 = voipData.AuthUserName1;
    this.AuthPassword1 = voipData.AuthPassword1;
    this.DirectoryNumber1 = voipData.DirectoryNumber1;
  }
  displayVoIPHtml();
}

function displayVoIPHtml() {
  $("#AuthUserName_text_1").val(fhdecrypt(this.AuthUserName1));
  $("#AuthPassword1").val(fhdecrypt(this.AuthPassword1));
  $("#DirectoryNumber1").val(fhdecrypt(this.DirectoryNumber1));
}

function wifiCancel() {
  window.location.href="fast_settings_wifi_ECU_CNT.html";
  //displayVoIPHtml();
}

function wifiApply() {
  show_shadow();
  if (!$("#wifi_form").valid()) {
    alert("wan_value_invilid".i18n());
    return;
  }
  var postdata = new Object();

  postdata.Enable1 = voipData.Enable1;
  postdata.AuthUserName1 = fhencrypt($("#AuthUserName_text_1").val());
  postdata.AuthPassword1 = fhencrypt($("#AuthPassword1").val());
  if ($("#DirectoryNumber1").val() == "") {
    //电话号码为空,自动填充用户名前缀
    var temp_phone_num = $("#AuthUserName_text_1").val().split("@")[0];
    postdata.DirectoryNumber1 = fhencrypt(temp_phone_num);
  } else {
    postdata.DirectoryNumber1 = fhencrypt($("#DirectoryNumber1").val());
  }

  XHR.post("set_voice_base_info_ECU_CNT", postdata, function(){
      window.location.href = "main_inter.html";
  });
  //pause();

  
}
