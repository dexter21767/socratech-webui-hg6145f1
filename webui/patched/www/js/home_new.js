var all_wan_info;
$(document).ready(function() {
    if (gFttr_type == "fttr_main") {
        $("#fiber_div").show();
    } else {
        $("#fiber_div").hide();
    }
    if (gWifiEnable == "0") {
        $("#onu_image").attr("src", "../image/new_ui/onu_nowifi.png");
        $("#device_model").attr("src", "../image/new_ui/device_uptime_nowifi.png");
        $("#wifi_div").hide();
    }else
    {
        $("#onu_image").attr("src", "../image/new_ui/onu.png");     
        $("#device_model").attr("src", "../image/new_ui/device_uptime.png");   
    } 
    getData();
});

function getData() {
    XHR.get("get_home_info", null, parsehomeInfo);
    XHR.get("get_allwan_info", null, parseWanData);
}

function parsehomeInfo(data) {
    $("#mac_address").html("MAC:   " + data.brmac);
    $("#ModelName").html(gModelName);
    $("#system_uptime").html(Uptime(data.uptime));
    $("#ip_address").html(data.IPInterfaceIPAddress);
    $("#host_num").html(data.hostnum);
}

function reboot() {
    myConfirm('Are you sure to reboot the device ?'.i18n(), 'After rebooting, it may cause the attached device to disconnect.Please operate with caution.'.i18n(), function(r) {
        if (r) {
            //...点确定之后执行的内容  
            XHR.get("get_login_user", null, function(getdata) {
                if (getdata.sessionid != undefined) {
                    var sessionidstr = getdata.sessionid;
                    jumpToLoginPage(true);
                    var postdata = new Object();
                    postdata.sessionid = sessionidstr;
                    XHR.post("set_onu_reboot", postdata, reloadRebootData);
                }
            });
        }
    });
}

function reloadRebootData() {
    myAlert('Reboot Successfully', '' + 'System is rebooting... Please wait for a moment and relogin after reboot.', function() { })
}

function parseWanData(getdata) {
    var existwanflag = false
    all_wan_info = getdata;
    if (getdata) {
        for (var m = 0; m < all_wan_info.wan.length; m++) {
            var singleWan = all_wan_info.wan[m];
            console.log(singleWan)
            if (singleWan.ConnectionStatus == "Connected") {
                existwanflag = true;
                $("#Connection_Uptime").html(Uptime(singleWan.Uptime))
                break
            }
        }
    }
    if (!existwanflag) {
        $("#Connection_Uptime").html("Unconnected".i18n())
        $("#internet_status").attr("src", "../image/new_ui/redline.png")
        $("#no_connect").show()
    } else {
        $("#internet_status").attr("src", "../image/new_ui/green_line.png")
        $("#no_connect").hide()
    }
}

function Uptime(time) {
    var secondTime = time;// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    var dayTime = 0;
    if (secondTime >= 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime >= 60) {
            hourTime = parseInt(minuteTime / 60);
            minuteTime = parseInt(minuteTime % 60);
            if (hourTime >= 24) {
                dayTime = parseInt(hourTime / 24);
                hourTime = parseInt(hourTime % 24);
            }
        }
    }
    return dayTime + " d " + hourTime + " h " + minuteTime + " m"
}
