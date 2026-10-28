var gport;
$(document).ready(function(){
    XHR.get("get_uplink_info", null, initPage);
});

function initPage(getdata)
{
    console.log(getdata)
    if (getdata != null && getdata)
    {
        if (getdata.uplink_info.uplink_type == "dev.wifi.1") {
            $("#current_uplink").html("WiFi");
        } else if (getdata.uplink_info.uplink_type == "dev.pon.1") {
            $("#current_uplink").html("PON");
        } else if (getdata.uplink_info.uplink_type == "dev.eth.LAN") {
            $("#current_uplink").html("LAN");
        } else {
            $("#current_uplink").html("unknown");
        }
        
        $("#port").html(getdata.uplink_info.uplink_port);
        gport = getdata.uplink_info.uplink_port;
    };
}


function saveApply()
{
    if(gNewUiFlag){
        myConfirm('Tip', "This operation will force the device to restart.Are you sure to switch the uplink mode ?", function(r) {
            if (r) {
                var postdata = new Object();
                postdata.uplink_type = $("#uplink_type").val();
                postdata.uplink_port = gport;
                XHR.post("set_uplink_info", postdata, reloadData);
            }
        });
    }else{
        if(window.confirm("This operation will force the device to restart.Are you sure to switch the uplink mode ?")){
            var postdata = new Object();
            postdata.uplink_type = $("#uplink_type").val();
            postdata.uplink_port = gport;
            XHR.post("set_uplink_info", postdata, reloadData);
        }
    }
    
}

function reloadData(responseData)
{
    if(responseData.success != "true")
    {
        if(gNewUiFlag)
            myAlert('Tip', "set_uplink_mode_failed".i18n());
        else
            alert("set_uplink_mode_failed".i18n());
    }
    else
    {
        if(gNewUiFlag)
            myAlert('Tip', "relogin_after_device_reboot".i18n());
        else
            alert("relogin_after_device_reboot".i18n());
           jumpToLoginPage(true);
    }
}

