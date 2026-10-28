var sessionidstr = "";
var g_data;
var band_steering = "";
var operator_name = gOperatorName;
var modelname = gModelName;
var login_user = gLoginUser;
var operator_mode;
var onu_type = gOnu_type;
$(document).ready(function() {
    //优化滚动条，无需改动
    //customScrollBar("html");

    initValidate();

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/firewall", initPage);
    }
    else {
        XHR.get("get_multiAP_enable", null, initPage);
        
        //XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);

        if (operator_name == "MY_TM") {
            $("#current_mode_div").show();
            //$("#current_mode").attr("disabled", true);
        }
        if (operator_name == "TH_AIS" || operator_name == "MY_TM") {

            XHR.get("get_operator_mode_info", null, operator_modeInfo);
            $(":radio").bind("click", function() {
                if ($("input[type='radio']:checked").val() == "1") {
                    $("#mode").show();
                } else {
                    $("#mode").hide();
                }
            });
        }

        if (onu_type == "4" && operator_name != "MY_TM") {
            XHR.get("get_mesh_mode", null, meshModeInfo);
        }

        if (operator_name == "CHL_ENTEL" && login_user == "0") {
            $("input[name='firewall_enable']").attr("disabled", true);
            $("#prompt_admin").hide();
            $("#prompt_user").show();
            $("#button_div").hide();
        }
    }
    
    if(gFttr_type == "fttr_main"){
        $("input[name='firewall_enable']").attr("disabled", true);
        $("#Roaming_Param_div").show();
    }
    
    if (gOperatorMode == "3" && gOperatorName == "TH_AIS") {
        $("#firewall_enable").attr("disabled", true);
        $("#firewall_disable").attr("disabled", true);
        $("#multiap_mode").attr("disabled", true);
        document.getElementById('wireless_apply_cancel').style.display = 'none';
        $(".main_header_hint").html("multi_ap_enable_prompt_ap_mode".i18n());
    } else if (gOperatorName == "MY_TM" || onu_type == "4") {
        $("#prompt_admin").html("easymesh_enable_prompt".i18n());
        $("#multi_ap_enable_title").html("multi_ap_enable_title".i18n());
        $("#multi_ap_mode").html("easymesh_mode_title".i18n());
    }
    else {
        $(".main_header_hint").html("multi_ap_enable_prompt".i18n());
    }

    showMeshModeInfo();


});

function initValidate()
{
	$("#multi_ap_form").validate({
		debug: true,
		rules: {
			"Roaming_Param": {required: true, range_int:[-75,-60]},
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate catv ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate catv failed.....");
			return false;
		}
	}); 
}

function meshModeInfo(data) {
    if (data.Mode == "2") {
        $("#current_mode").html("Agent".i18n());
        $("#multiap_mode").val("2");
    } else {
        $("#current_mode").html("Controller".i18n());
        $("#multiap_mode").val("3");
    }
}

function operator_modeInfo(data) {
    operator_mode = data.operator_mode;
    if (operator_mode == "0") {
        alert("operator_mode_invalid".i18n());
        $(".main_submit").hide();
    } else if (operator_mode == "1" || operator_mode == "2") {
        $("#multiap_mode").attr("disabled", true);
        $("#multiap_mode").val("3");
    } else if (operator_mode == "3") {
        $("#multiap_mode").attr("disabled", true);
        $("#multiap_mode").val("2");
    }
    if (operator_mode == "10" || operator_mode == "11" || operator_mode == "12") {
        $("#current_mode").html("Controller");
    } else if (operator_mode == "13") {
        $("#current_mode").html("Agent");
    }


}


function bandsteeringInfo(data) {
    band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function initPage(getdata) {

    if (getdata != null) {
        g_data = getdata.multiAP_enable;

        displayHtml();
    }
}

function showMeshModeInfo() {
    if (onu_type == "4" && operator_name != "MY_TM") {
        if ($("input[name='firewall_enable']:eq(0)").is(":checked")) {
            $("#current_mode_div").show();
            $("#mode").show();
        } else {
            $("#current_mode_div").hide();
            $("#mode").hide();
        }
    }
}

function cancel() {
    displayHtml();
}

function displayHtml() {
    parent.multiAP = g_data.Enable;
    if (g_data.Enable == "1") {
        $("input[name='firewall_enable']").eq(0).attr('checked', true);
        if (operator_name == "TH_AIS" || operator_name == "MY_TM") {
            $("#mode").show();
            $("#multiap_mode").val(g_data.Mode);
        }
    }
    else if (g_data.Enable == "0") {
        $("input[name='firewall_enable']").eq(1).attr('checked', true);
        if (operator_name == "TH_AIS" || operator_name == "MY_TM") {
            $("#mode").hide();
        }
    }
    var romam_array = [];
    console.log(g_data)
    romam_array =  g_data.Roaming_Param.split(";")[2].split(" ")
    $("#Roaming_Param").val(romam_array[1]);
}

function LoadStatus(responseData) {
    var postdata2 = new Object();
    postdata2.sessionid = sessionidstr;
    XHR.post("set_onu_reboot", postdata2, null);
    jumpToLoginPage(true);
}

function save_apply() {
    if ( ! $("#multi_ap_form").valid() ){
        if(gNewUiFlag)
            myAlert('Tip', "value_illegal".i18n())
        else
            alert("value_illegal".i18n());
        return;
    }
    show_shadow();
    var postdata = new Object();
    postdata.Enable = $("input[name='firewall_enable']:checked").val();
    if(gFttr_type == "fttr_main")
    {
        postdata.Roaming_Param = "roam_tbss:"+ (Number($("#Roaming_Param").val())+3)+" 1 10 36 0x1 0;bounce:120 2 300;roam_weak:1000 "+Number($("#Roaming_Param").val())+" 3 50 20 0x4;"
    }
    if (postdata.Enable == 1) {
        postdata.AutoCfgBackhaul = 1;//此时下发节点autocfgBackhaul为1
        if (operator_name == "TH_AIS") {
            postdata.Mode = $("#multiap_mode").val();
        }
    } else if (postdata.Enable == 0) {
        postdata.AutoCfgBackhaul = 0;
    }

    if (gOperatorMode == "3" && gOperatorName == "TH_AIS") {
        return;
    }
    if (gOperatorName == "MY_TM" && postdata.Enable == 1) {
        var current_mode = operator_mode;

        if (current_mode == "10" || current_mode == "11" || current_mode == "12") {
            if ($("#multiap_mode").val() == "2") {
                alert("takes_effect_after_device_restart".i18n());
                postdata.operator_mode = current_mode;
                XHR.post("set_multiap_operator_mode_info", postdata, LoadStatus);
            } else {
                postdata.Enable = 1;
                XHR.post("set_multiAP_enable", postdata, initPage);
                sleep(500);
                window.lacation.reload();
            }
        } else if (current_mode == "13") {
            if ($("#multiap_mode").val() == "3") {
                alert("takes_effect_after_device_restart".i18n());
                postdata.operator_mode = current_mode;
                XHR.post("set_multiap_operator_mode_info", postdata, LoadStatus);
            } else {
                postdata.Enable = 1;
                XHR.post("set_multiAP_enable", postdata, initPage);
                sleep(500);
                window.lacation.reload();
            }
        }
    } else if (onu_type == "4" && postdata.Enable == 1) {
        if ($("#multiap_mode").val() == "3") {
            postdata.enable = "1"
            postdata.WorkMode = "router"
            postdata.Mode = "3"
        } else {
            postdata.enable = "1"
            postdata.WorkMode = "bridge"
            postdata.Mode = "2"
        }
        XHR.post("set_mesh_mode", postdata, meshModeInfo);
    } else {
        XHR.post("set_multiAP_enable", postdata, initPage);
        if (postdata.Enable == 1) {
            $(".topological_graph", window.parent.document).removeClass("show-none");
        } else {
            $(".topological_graph", window.parent.document).addClass("show-none");
            $(".topological_graph", window.parent.document).removeClass("show-block");
        }
    }
    //更新全局变量multiAP
    parent.multiAP = postdata.Enable;
}

