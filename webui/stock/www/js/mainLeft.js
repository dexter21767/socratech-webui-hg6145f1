var gLastOperateTime; //记录上一次有效操作的时间，用来完成一段时间无操作自动退出功能
var gSessionFlag;
var fttr_type = null;
(function() {
    gLastOperateTime = new Date().getTime();
})();

var gHash;
var isIE7 = false;
var lastSubMenuName, lastSubSecondMenuName, lastSubThirdMenuName;
var lastMainMenuName;

var gSessionMaxTime = 300; //default 300s
var sessionidstr = "";
var area_code = "";
var awifi_switch = "";
var awifi_type = "";
var gClean_timeOut = "";
var mainMenuJsonObject, subMenuJsonObject;
var operator_name;
var login_user = '1'; //use admin as default
var RemoteUrlEnable = "";
var isWan = "";
var multiap_flag = gMultiapFlag;
var catvnum = gCatv_num;
var device_type = gModelName;
var iot_flag = gIOT_flag;
var subversion_flag;
var UserName;
var SuperUsername;
var gauto_enable;
var model_name = gModelName;
var cur_lang = glang;
var cur_pon_mode = gPon_mode;
$(document).ready(function() {
    if (operator_name == "EG_TELECOM") {
        var link = document.createElement('link'); //创建link标签
        link.setAttribute('rel', 'stylesheet'); //设置rel属性
        link.setAttribute('href', '../css/mainLeft_eg.css'); //设置href属性
        document.body.appendChild(link); //把link标签加入到body中


        var link_1 = document.createElement('link'); //创建link标签
        link_1.setAttribute('rel', 'stylesheet'); //设置rel属性
        link_1.setAttribute('href', '../css/main_style_eg.css'); //设置href属性
        document.body.appendChild(link_1); //把link标签加入到body中

    }else if (operator_name == "MAR_INWI") {
        var link = document.createElement('link'); //创建link标签
        link.setAttribute('rel', 'stylesheet'); //设置rel属性
        link.setAttribute('href', '../css/mainLeft_mar_imwi.css'); //设置href属性
        document.body.appendChild(link); //把link标签加入到body中
        var link_1 = document.createElement('link'); //创建link标签
        link_1.setAttribute('rel', 'stylesheet'); //设置rel属性
        link_1.setAttribute('href', '../css/main_style_mar_imwi.css'); //设置href属性
        document.body.appendChild(link_1); //把link标签加入到body中
    }
    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/login_user", parseLoginUser);
    }
    else {
        XHR.get("get_login_user", null, parseLoginUser);
        if (operator_name == "TH_AIS"){
            XHR.get("get_username", null, getUserName);
            XHR.get("get_super_userName", null, getSuperUserame);
        }
    }
    constructMenuObj();

    if (gDebug) //调试模式读取本地数据
    {
        getDataByAjax("../fake/device_info", parseDeviceInfo);
        getDataByAjax("../fake/web_config", parseWebConfig);
    }
    else {
        if (gFttr_type == "fttr_sub") {
            XHR.get("get_switch_auto", null, getSwitchAuto);
        }
        /*统一从util_global_vars.js全局变量获取*/
        //XHR.get("get_multiAP_enable", null, getMultiapFlag);
        //XHR.get("get_iot_enable", null, getIotFlag);
        XHR.get("get_sub_version_info", null, getsubverion);
        XHR.get("show_device_info", null, parseDeviceInfo);
        XHR.get("get_web_config", null, parseWebConfig);
        //XHR.get("get_base_info", null, logoSetting);
        logoSetting();
    }
    bodyLoad();
    clearTimeout(gClean_timeOut);
    gClean_timeOut = setTimeout("checkSessionTimeout();", 15000);
    changeCss();
    change_css_style();

    if (operator_name == "EG_TELECOM") {
        //  $("#fast_setting").show();
    }

    if (operator_name == "MY_TM") {
        $("#model_name").html(model_name)
    }

    //$("body").prepend('<style type="text/css"> .left-meun {background-color: red;} </style>');
});


function getSwitchAuto(data) {
    gauto_enable = data.auto_enable;
}

/*function getMultiapFlag(data) {
    multiap_flag = data.multiAP_enable.multiAp_flag;
}

function getIotFlag(data) {
    iot_flag = data.iot_info.iot_flag;
}*/

function getsubverion(data) {
    subversion_flag = data.sub_version.reuse_status;
}
function logoSetting() {
    //非新UI风格
    if (!gNewUiFlag) {
        if (operator_name == "TH_3BB") {
            $("#logo").css("background-image", "url(../image/3bb.png)");
            $("#device_name").show();
            $("#device_name").append(gModelName);
        } else if (operator_name == "PLE_PALTEL") {
            $("#logo").css("background-image", "url(../image/logo_paltel.png)");
        } else if (operator_name == "EG_TELECOM") {
            $("#logo").css("background-image", "url(../image/logo_eg.jpg)");
            $("#logo").css("background-position", "center");
            // $("#logo").css("background-size", "30% 100%");
        } else if (operator_name == "MEX_TELMEX") {
            $("#logo").css("background-image", "url(../image/logo_telmex.png)");
            $("#logo").css("background-position", "center");
            var obj = $("#logo");
            obj.addClass("clickable");
            var url = "http://www.telmex.com";
            obj.click(function() {
                window.open(url);
            })
        } else if (operator_name == "MAGYAR_4IG") {
            $("#logo").css("background-image", "url(../image/fiberhome_logo_rm.png)");
        } else if (operator_name == "ROM_RCSRDS") {
            $("#logo").css("background-image", "url(../image/romania_logo_2_rm.png)");
        } else if (operator_name == "BZ_INTELBRAS") {// BZ_INTELBRAS
            $("#logo").css("background-image", "url(../image/logo_Intelbras_fiberhome.png)");
            $("#logo").css("background-position", "center");
            $("#logo").css("width", "200px");
            $("#logo").css("height", "80px");
            $("#logo").css("background-size", "contain");
        } else if (operator_name == "MAR_INWI") {// MAR_INWI
            $("#logo").css("background-image", "url(../image/mar_inwi.png)");
            $("#logo").css("background-position-x", "40px");
            $("#logo").css("background-position-y", "30px");
        } else if (operator_name == "MEX_NETWEY") {// MEX_NETWEY
            $("#logo").css("background-image", "url(../image/logo00_60@2x-8.png)");
            $("#logo").css("background-position", "center");
            $("#logo").css("width", "200px");
            $("#logo").css("height", "80px");
            $("#logo").css("position", "relative");
            $("#logo").css("top", "14px");
            $("#logo").css("background-size", "contain");
        }
    } else {  //新UI风格更换logo
        if (operator_name == "ES_DIGI") {
            $("#logo").attr("src", "../image/new_ui/es_digi_logo.png");
            $("#logo").css("margin-top", "10px");
            $("#logo").css("height", "40px");
        }
    }


    //TH_AIS版本要求显示用户名
    if (operator_name == "TH_AIS") {
        if (login_user == 2) //admin user
        {
            $("#admin_ais").html(SuperUsername);
        }
        else //common user
        {
            $("#admin_ais").html(UserName);
        }

    }
}

function changeCss() {
    if (operator_name == "BZ_CLARO") {
        $(".body").css("width", "1065px");
        $("#logo").css("width", "260px");
        $(".left-meun").css("width", "260px");
        $(".content").css("width", "805px");
        //$("#device_name").append(data.ModelName);
    } else if ((operator_name == "PLE_PALTEL") || (operator_name == "ECU_CNT")) {
        var obj = document.getElementById("css");
        obj.setAttribute("href", "../css/mainLeft_ple.css");
    }
}

function parseWebConfig(data) {
    if (data) {
        sessionidstr = data.sessionid;
        if (data.SessionMaxTime != undefined) {
            gSessionMaxTime = parseInt(data.SessionMaxTime);
        }
    }
    //哥伦比亚Claro版本要求默认时间为15分钟(900秒)
    if (operator_name == "COL_CLARO") {
        gSessionMaxTime = 900;
    }
}

function parseLoginUser(data) {
    if (data) {
        sessionidstr = data.sessionid;
        login_user = data.login_user;
        RemoteUrlEnable = data.RemoteUrlEnable;
        isWan = data.isWan;
    }
}


function getUserName(data) {
    if (data) {
        UserName = data.user_name;

    }
}

function getSuperUserame(data) {
    if (data) {
        SuperUsername = data.super_userName;

    }
}

//根据登录的用户构建不同的菜单对象
function constructMenuObj() {
    var user, operators_code;
    var operator_seg = "";
    if (login_user == 4) //fiberuser
    {
        user = "superadmin";
    }
    else if (login_user == 2) //admin user
    {
        user = "admin";
    }
    else //default as common user
    {
        user = "common";
    }

    //todo, get operators_code, add operators_code
    if (gDebug) {
        getDataByAjax("../fake/operator", function(data) {
            if (data) {
                operators_code = data.operators_code;
            }
        });
    }
    else {
        XHR.get("get_operator", null, function(data) {
            if (data) {
                sessionidstr = data.sessionid;
                operators_code = data.operators_code;
                operator_name = data.operator_name;
                if (operators_code == "INTL" && operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE") {
                    operator_seg = "_th_true";
                } else if (operators_code == "INTL" && operator_name == "BZ_CLARO") {
                    operator_seg = "_bz_claro";
                }
                else if (operators_code == "INTL" && operator_name == "TH_3BB") {
                    operator_seg = "_th_3bb";
                }
                else if (operators_code == "INTL" && operator_name == "MY_TM") {
                    if (device_type == "HG6145F3")
                        operator_seg = "_my_tm_mesh";
                    else
                        operator_seg = "_malay_tm"
                }
                else if (operators_code == "INTL" && operator_name == "BZ_TIM") {
                    operator_seg = "_bz_tim";
                } else if (operators_code == "INTL" && operator_name == "IDN_TELKOM") {
                    operator_seg = "_idn_telkom";
                } else if (operators_code == "INTL" && operator_name == "OMN_OMANTEL") {
                    operator_seg = "_omn_omantel";
                } else if (operators_code == "INTL" && operator_name == "ARG_CLARO") {
                    operator_seg = "_arg_claro";
                } else if (operators_code == "INTL" && operator_name == "CHL_MP") {
                    if (gArea_code == "PRT_LIGAT") {
                        operator_seg = "_prt_ligat";
                    } else {
                        operator_seg = "_chl_mp";
                    }
                } else if (operators_code == "INTL" && operator_name == "PH_PLDT") {
                    operator_seg = "_ph_pldt";
                } else if (operators_code == "INTL" && operator_name == "JOR_UMNIAH") {
                    operator_seg = "_jor_umniah";
                }
                else if (operators_code == "INTL" && operator_name == "MEX_TP") {
                    operator_seg = "_mex_tp";
                }
                else if (operators_code == "INTL" && operator_name == "SFU_MEX_TP") {
                    operator_seg = "_sfu_mex_tp";
                }
                else if (operators_code == "INTL" && operator_name == "TUR_TURKSAT") {
                    operator_seg = "_tur_turksat";
                }
                else if (operators_code == "INTL" && operator_name == "PLE_PALTEL") {
                    operator_seg = "_ple_paltel";
                }
                else if (operators_code == "INTL" && operator_name == "COL_CLARO") {
                    operator_seg = "_col_claro";
                }
                else if (operators_code == "INTL" && operator_name == "COL_MILLICOM") {
                    operator_seg = "_col_millicom";
                }
                else if (operators_code == "INTL" && operator_name == "MEX_TELMEX") {
                    operator_seg = "_mex_telmex";
                }
                else if (operators_code == "INTL" && operator_name == "ECU_CNT") {
                    operator_seg = "_ecu_cnt";
                } else if (operators_code == "INTL" && operator_name == "EG_TELECOM") {
                    operator_seg = "_eg_telecom";
                }
                else if (operators_code == "INTL" && operator_name == "TH_AIS") {
                    operator_seg = "_th_ais";
                } else if (operators_code == "INTL" && operator_name == "CHL_ENTEL") {
                    operator_seg = "_chl_entel";
                } else if (operators_code == "INTL" && (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG")) {
                    operator_seg = "_rom_rcsrds";
                } else if (operators_code == "INTL" && operator_name == "BZ_ALGAR") {
                    operator_seg = "_bz_algar";
                } else if (operators_code == "INTL" && operator_name == "BZ_WDC") {
                    operator_seg = "_bz_wdc";
                }else if (operators_code == "INTL" && operator_name == "PAK_CYBERNET") {
                    operator_seg = "_pak_cybernet";
                } else if (operators_code == "INTL" && operator_name == "MAR_INWI") {
                    operator_seg = "_mar_inwi";
                } else if (operators_code == "INTL" && operator_name == "BZ_INTELBRAS") {
                    operator_seg = "_bz_intelbras";
                } else if (operators_code == "INTL" && operator_name == "MEX_MEGA") {
                    operator_seg = "_mex_mega";
                }else if (operators_code == "INTL" && operator_name == "MEX_NETWEY") {
                    operator_seg = "_mex_netwey";
                } else if (operators_code == "INTL" && operator_name == "ES_DIGI") {
                    operator_seg = "_es_digi";
                }else if (operators_code == "INTL" && operator_name == "PRY_NUCLEO") {
                    operator_seg = "_pre_nucleo";
                }else if (operators_code == "INTL" && operator_name == "IDN_IMI" && user == "common") {
                    operator_seg = "_idn_imi";
                }else if (operators_code == "INTL" && gNewUiFlag) {
                    operator_seg = "_new_ui";
                }else if (operators_code == "INTL") {
                    operator_seg = "_inter";

                }
                else {
                    operator_seg = "_inter";
                }
            }
        });
    }
    mainMenuJsonObject = JSON.parse($.ajax({ url: "../menu/main_menu_" + user + operator_seg + "?" + new Date().getTime(), async: false }).responseText);
    if(gNewUiFlag)
        mainMenuJsonObject = Object.assign({Home:{"mainDivId":"status_main_div", "hasChildMenu":false, "title":"Home", "selectClass": "first_menu_primary_select"}},mainMenuJsonObject)

    if (operator_name == "FTTR_MAIN_SFU_COMMON") {
        operator_seg = "_fttr_main";
    } else if (operator_name == "COL_EMCALI") {
        operator_seg = "_col_emcali";
    } else if (operator_name == "FTTR_SUB_COMMON") {
        operator_seg = "_fttr_sub";
    }  else if (operator_name == "IDN_LINKNET" && user == "admin") {
        operator_seg = "_idn_linknet";
    } else if (operator_name == "ARG_GIGARED" && user == "admin") {
        operator_seg = "_agr_gigared";
    } else if (operator_name == "PAK_CYBERNET" && user == "admin") {
        operator_seg = "_pak_cybernet";
    } else if (operator_name == "BZ_INTELBRAS" && user == "admin") {
        operator_seg = "_bz_intelbras";
    } else if (operator_name == "MEX_MEGA" && user == "admin") {
        operator_seg = "_mex_mega";
    }else if (operator_name == "MEX_NETWEY" && user == "admin") {
        operator_seg = "_mex_netwey";
    }else if (operator_name == "PRY_NUCLEO" && user == "admin") {
        operator_seg = "_pre_nucleo";
    }

    subMenuJsonObject = JSON.parse($.ajax({ url: "../menu/sub_menu_" + user + operator_seg + "?" + new Date().getTime(), async: false }).responseText);

    if(gNewUiFlag){
        subMenuJsonObject = Object.assign({Home:{"childMenuPosition": "self",  "src": "home_new.html"}},subMenuJsonObject)
    }
    
    //console.log(subMenuJsonObject);

    if(operator_name == "IDN_IMI" && user == "admin"){
        subMenuJsonObject.security.secondmenus[0].thirdmenus.push({"name":"security_parental_control", "title":"security_parental_control", "src": "parental_control_inter.html"})
    }

    if(operator_name == "IDN_LINKNET" && user == "common"){
        subMenuJsonObject.status.secondmenus[0].thirdmenus.push({"name":"status_health_check", "title":"Health_Check", "src": "healthcheck.html"})
    }

    if(operator_name == "PH_PLDT"&&model_name =="HG8143F" && (user == "common"||user == "admin")){
        subMenuJsonObject.status.secondmenus.push({
            "name": "status_lte", "title":"lte_status", 
            "thirdmenus": [
                {"name":"status_lte_info", "title":"lte_status", "src": "lte_info_inter.html"}
                ]
            });
    }

     if(operator_name == "ESP_EMBOU"){
        subMenuJsonObject.status.secondmenus[3].thirdmenus.push({"name":"status_userlist", "title":"userlist", "src": "user_list_inter.html"})
    }
    if (operator_name == "ALB_AFT") {
        if(user == "admin")
        subMenuJsonObject.app.secondmenus.push({
            "name": "app_alg", "title": "ALG",
            "thirdmenus": [
                { "name": "app_alg", "title": "ALG", "src": "alg_enable.html" }
            ]
        });

        subMenuJsonObject.status.secondmenus[3].thirdmenus.push({ "name": "status_dhcpv6_info", "title": "dhcpv6_info", "src": "dhcpv6_info_inter.html" })
    }

    /*根据相关功能宏动态加载fttr页面 */
   if(gFttr_type == "fttr_main"){
        subMenuJsonObject.status.secondmenus.push({
            "name": "status_ponlink", "title":"ponlink_status", 
            "thirdmenus": [
                {"name":"status_ponlink_inter", "title":"ponlink_status", "src": "ponlink_status_inter.html"}
            ]}, {
            "name": "sub_pon_link_info", "title":"subpon_info", 
            "thirdmenus": [
                {"name":"sub_pon_link_info", "title":"subpon_info", "src": "sub_pon_link_info_inter.html"}
            ]
        });

        if(login_user == "2"){
            subMenuJsonObject.network.secondmenus[2].thirdmenus.push({ "name": "network_wan_valn", "title": "vlanbind", "src": "vlanbind_inter.html" });
            subMenuJsonObject.network.secondmenus[3].thirdmenus.push({ "name": "IOT_Server", "title": "IOT_Server", "src": "iot_config.html" });
            subMenuJsonObject.manage.secondmenus[1].thirdmenus.push({ "name": "manage_device_upstreamPort_configure", "title": "upstreadm", "src": "upstream_configure_inter.html" });
        }
    }

    if(gFttr_type == "fttr_sub" && login_user == "2"){
        subMenuJsonObject.network.secondmenus.push({
            "name": "network_uplink", "title":"uplink_setting", 
            "thirdmenus": [
                {"name":"network_up_link", "title":"uplink_setting", "src": "uplink_setting.html"}
            ]
        });
    }

    if(operator_name == "PAK_PTCL" || operator_name == "COL_ETB"){
        subMenuJsonObject.network.secondmenus[0].thirdmenus.push({ "name": "network_wifi_guset", "title": "guest", "src": "wlanGuest_inter.html" });
    }
}

//根据端口数、无线状态等裁剪要显示的菜单
function parseDeviceInfo(data) {
    operator_name = data.operator_name;
    sessionidstr = data.sessionid;
    area_code = data.area_code;
    //awifi_switch = data.awifi_switch;
    //awifi_type = data.awifi_type;
    fttr_type = data.fttr_type;
    $.each(subMenuJsonObject, function(name, content) {
        if (content.childMenuPosition == "both") {
            var secondindex = 0;
            $.each(content.secondmenus, function(secondname, secondcontent) {
                var second_delete = false;
                if (data.wifi_enable < 1 && secondcontent.name.indexOf("wifi") >= 0) //wifi disabled
                {
                    // fiberlog("got one wifi! " + secondcontent.name );
                    second_delete = true;
                }
                if(gNewUiFlag)
                {   
                    if ((data.wifi_enable != 1 || multiap_flag == 0) && secondcontent.name.indexOf("status_topo") >= 0) //wifi disabled no topo
                    {
                        // fiberlog("got one third wifi! " + thirdcontent.name );
                        second_delete = true;
                    }
                }
                if (data.voice_port_num < 1 && secondcontent.name.indexOf("voice") >= 0) // no voice port
                {
                    // fiberlog("got one voice! " + secondcontent.name );
                    second_delete = true;
                }
                if (data.usb_port_num < 1 && secondcontent.name.indexOf("usb") >= 0) //no usb port
                {
                    // fiberlog("got one usb! " + secondcontent.name );
                    second_delete = true;
                }
                if (subversion_flag > 0 && secondcontent.name.indexOf("manage_soft") >= 0) {
                    second_delete = true;
                }
                if (data.area_code != "Hubei" && secondcontent.name.indexOf("comservice") >= 0) //no usb port
                {
                    // fiberlog("got one third usb! " + thirdcontent.name );
                    second_delete = true;
                }

                /*if (data.awifi_type == "2" && secondcontent.name.indexOf("awifi_site") >= 0) //no usb port
                {
                    second_delete = true;
                }
                if (data.awifi_type == "2" && secondcontent.name.indexOf("awifi_wifidog") >= 0) //no usb port
                {
                    second_delete = true;
                }*/
                // if ( (data.operator_name != "BZ_ALGAR" || data.operator_name != "TH_3BB" ) && secondcontent.name.indexOf("app_web_port") >= 0  ) //当operator_name为非BZ_ALGAR的时候，不显示web_port菜单
                // {
                //     // fiberlog("got one third usb! " + thirdcontent.name );
                //     alert("111");
                //     second_delete = true;
                // }
                if (data.operator_name != "BZ_CLARO" && secondcontent.name.indexOf("app_gre_tunnel") >= 0) //当operator_name为非BZ_CLARO的时候，不显示app_gre_tunnel菜单
                {
                    // fiberlog("got one third usb! " + thirdcontent.name );
                    second_delete = true;
                }
                if (data.operator_name == "TH_TRUE" && login_user == "1" && secondcontent.name.indexOf("network_wan") >= 0) //当operator_name为非BZ_CLARO的时候，不显示app_gre_tunnel菜单
                {
                    // fiberlog("got one third usb! " + thirdcontent.name );
                    second_delete = true;
                }
                if ((data.operator_name == "CHL_GTD" || data.operator_name == "ARM_GNC")&& secondcontent.name.indexOf("HTTPS") >= 0) //当operator_name为CHL_GTD的时候，不显示https菜单
                {
                    second_delete = true;
                }

                if (data.operator_name == "ARM_GNC" && secondcontent.name.indexOf("app_port_mapping") >= 0)
                {
                    secondcontent.title = "Port_Forwarding"
                }
                
                if(secondcontent.name.indexOf("remote_management") >= 0){
                    secondcontent.title = "remote_management"
                }
                //非ONU设备没有光模块信息不显示相关页面
                if (gDevice_type == 0 && (secondcontent.name.indexOf("status_pon") >= 0 || secondcontent.name.indexOf("network_olt_auth") >= 0)) {
                    second_delete = true;
                }



                if(data.operator_name == "COL_ETB" && login_user == "2" && secondcontent.name.indexOf("app_nat") >= 0 ){
                    content.secondmenus.push({"name": "app_alg", "title":"ALG",
                        "thirdmenus": [
                            {"name":"app_nat_alg", "title":"ALG", "src": "alg_inter.html"}
                        ]
                    });
                }
                if (gauto_enable == "1" && secondcontent.name.indexOf("network_uplink") >= 0) {
                    second_delete = true;
                }

                if (second_delete) //如果需要删除2级菜单，则执行删除动作
                {
                    delete content.secondmenus[secondindex];
                }

                else //否则处理3级菜单
                {
                    var thirdindex = 0;
                    if (secondcontent.thirdmenus != undefined) {
                        $.each(secondcontent.thirdmenus, function(thirdname, thirdcontent) {
                            var third_delete = false;


                            if (data.wifi_enable != 1 && thirdcontent.name.indexOf("wifi") >= 0) //wifi disabled
                            {
                                // fiberlog("got one third wifi! " + thirdcontent.name );
                                third_delete = true;
                            }
                            if (data.wifi_enable != 1 && thirdcontent.name.indexOf("status_topo_info") >= 0) //wifi disabled no topo
                            {
                                // fiberlog("got one third wifi! " + thirdcontent.name );
                                third_delete = true;
                            }
                            if (data.wifi_enable == 1 && data.wifi_5g_enable != 1)// 5g wifi disabled
                            {
                                if (thirdcontent.name.indexOf("wifi") >= 0 && (thirdcontent.name.toUpperCase().indexOf("5G") >= 0)) {
                                    // fiberlog("got one third 5g wifi! " + thirdcontent.name );
                                    third_delete = true;
                                }
                                if (thirdcontent.name.indexOf("wifi") >= 0 && (thirdcontent.name.indexOf("band_steering") >= 0)) {
                                    // fiberlog("got one third 5g wifi! " + thirdcontent.name );
                                    third_delete = true;
                                }
                            }
                            if (data.voice_port_num < 1 && thirdcontent.name.indexOf("voice") >= 0) // no voice port
                            {
                                // fiberlog("got one third voice! " + thirdcontent.name );
                                third_delete = true;
                            }
                            if (data.usb_port_num < 1 && thirdcontent.name.indexOf("usb") >= 0) //no usb port
                            {
                                // fiberlog("got one third usb! " + thirdcontent.name );
                                third_delete = true;
                            }
                            if (thirdcontent.name.indexOf("device_catv") >= 0) 
                            {
                                thirdcontent.title = "catv_settings";
                            }
                            if (gNewUiFlag == "1" && thirdcontent.name.indexOf("dhcp_userlist") >= 0) 
                            {
                                thirdcontent.title = "lan_userlist";
                            }
                            if (catvnum < 1 && thirdcontent.name.indexOf("device_catv") >= 0) //no catv port
                            {
                                third_delete = true;
                            }
                            if (data.operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT" && thirdcontent.name.indexOf("network_wifi_band_steering") >= 0) {
                                third_delete = true;
                            }
                            if (data.operator_name != "BZ_CLARO" && thirdcontent.name.indexOf("network_wan_broadband_bz_claro") >= 0) {
                                thirdcontent.src = "broadband_inter.html";
                            }
                            if (data.operator_name == "PH_PLDT" && device_type == "HG6145D2" && thirdcontent.name.indexOf("network_wifi_band_steering") >= 0) {
                                thirdcontent.src = "band_steering.html";
                            }

                            if (data.operator_name == "PH_PLDT" && device_type != "HG6145F1" && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                third_delete = true;
                            }

                            if (data.operator_name == "PH_PLDT" && device_type != "HG6145F1" && thirdcontent.name.indexOf("network_wifi_multiAp") >= 0) {
                                third_delete = true;
                            }

                            if (data.operator_name == "IDN_TELKOM" && thirdcontent.name.indexOf("network_wifi_band_steering") >= 0) {
                                thirdcontent.src = "band_steering_idn_telkom.html";
                            }
                            if (data.operator_name == "IDN_TELKOM" && thirdcontent.name.indexOf("network_wifi_advance") >= 0) {
                                thirdcontent.src = "wlanAdvancedSettings_idn_telkom.html";
                            }
                            if (data.operator_name == "IDN_TELKOM" && thirdcontent.name.indexOf("network_wifi_advance5G") >= 0) {
                                thirdcontent.src = "wlanAdvancedSettings_5G_idn_telkom.html";
                            }
                            
                            if (data.operator_name == "PAK_PTCL" && thirdcontent.name.indexOf("network_wifi_advance") >= 0) {
                                thirdcontent.src = "wlanAdvancedSettings_idn_telkom.html";
                            }
                            if (data.operator_name == "PAK_PTCL" && thirdcontent.name.indexOf("network_wifi_advance5G") >= 0) {
                                thirdcontent.src = "wlanAdvancedSettings_5G_idn_telkom.html";
                            }
                            if (data.operator_name == "PAK_PTCL" && thirdcontent.name.indexOf("network_wifi_band_steering") >= 0) {
                                thirdcontent.src = "band_steering_pck_ptcl.html";
                            }

                            if (data.operator_name == "ARM_GNC" && thirdcontent.name.indexOf("app_portmapping_portmapping") >= 0)
                            {
                                thirdcontent.title = "Port_Forwarding"
                                thirdcontent.src = "portforwarding_inter.html"
                            }

                            /*拓扑页面全部用新方案 */
                            if (thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                thirdcontent.src = "topo_new.html";
                            }
                            /*if ((device_type == "HG6144F" || device_type == "HG6145F1") && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                thirdcontent.src = "topo_new.html";
                            }
                            if ((device_type == "HG6145F3" || device_type == "HG6145F4") && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                thirdcontent.src = "topo_new.html";
                            }
                            if ((device_type == "HG6145F" || device_type == "HG6246R") && data.operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT" && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                thirdcontent.src = "topo_new.html";
                            }
                            if (newtopoFlag == "1" && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                thirdcontent.src = "topo_new.html";
                            }
                            if (data.operator_name == "FTTR_MAIN_SFU_COMMON" && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                thirdcontent.src = "topo_new.html";
                            }*/

                            if (data.operator_name == "FTTR_SUB_COMMON" && thirdcontent.name.indexOf("status_topo_info") >= 0) {
                                third_delete = true;
                            }
                            if (multiap_flag == 0 && thirdcontent.name.indexOf("network_wifi_multiAp") >= 0) //no multiap
                            {
                                third_delete = true;
                            }
                            if (device_type == "HG5852SA" && data.operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT" && thirdcontent.name.indexOf("network_wifi_multiAp") >= 0) //no multiap
                            {
                                third_delete = true;
                            }
                            if (multiap_flag == 0 && thirdcontent.name.indexOf("status_topo_info") >= 0) //no multiap
                            {
                                third_delete = true;
                            }
                            if (device_type == "HG5852SA" && data.operator_name == "CHL_MP" && gArea_code != "PRT_LIGAT" && thirdcontent.name.indexOf("status_topo_info") >= 0) //no multiap
                            {
                                third_delete = true;
                            }
                           
                            if (iot_flag == 0 && thirdcontent.name.indexOf("IOT_Server") >= 0) {
                                third_delete = true;
                            }
                            if (subversion_flag > 0 && thirdcontent.name.indexOf("manage_soft_view") >= 0) {
                                third_delete = true;
                            }
                            if (data.usb_port_num < 1 && thirdcontent.name.indexOf("manage_device_ftp") >= 0) //no usb port delete ftp
                            {
                                third_delete = true;
                            }
                            if (data.operator_name == "CHL_GTD" && thirdcontent.name.indexOf("HTTPS") >= 0)
                            {
                                third_delete = true;
                            }
                            if (data.operator_name == "TH_AIS" && data.RemoteUrlEnable && data.isWan && thirdcontent.name.indexOf("manage_device_upgrade") >= 0) {
                                third_delete = true;
                            }
                            if ( data.operator_name == "BZ_INTELBRAS" && thirdcontent.name.indexOf("manage_terms_of_use") >= 0) {
                                if(cur_lang == "en")//en
                                {
                                    thirdcontent.src = "./terms_" + device_type + "_en" + ".html";
                                }
                                else//pt
                                {
                                    thirdcontent.src = "./terms_" + device_type + ".html";
                                }
                            }
                            
                            if ( data.operator_name == "BZ_INTELBRAS" && cur_pon_mode != "1" && thirdcontent.name.indexOf("Gemport") >= 0 )
                            {
                                third_delete = true;
                            }

                            if ( data.operator_name == "IDN_IFORTE" && thirdcontent.name.indexOf("manage_device_upgrade") >= 0 ){
                                third_delete = true;
                            }

                            if ( gNewUiFlag == "1" && thirdcontent.name.indexOf("restore") >= 0)
                            {
                                thirdcontent.src = "restore_reboot.html";
                                thirdcontent.title = "restore_and_reboot"
                            }
                            if ( gNewUiFlag == "1" && (login_user == "2" &&  thirdcontent.name.indexOf("reboot") >= 0))
                            {
                                third_delete = true;
                            }
                            if ( gNewUiFlag == "1" &&  thirdcontent.name.indexOf("manage_admin_management") >= 0)
                            {
                                thirdcontent.title = "administrator_account_admin"
                            }

                            // if (data.operator_name == "BZ_ALGAR" && thirdcontent.name.indexOf("network_wifi_band_steering") >= 0) {
                            //     third_delete = true;
                            // }

                            if (gOperatorMode == "3" && data.operator_name == "TH_AIS" && (thirdcontent.name.indexOf("status_topo_info") >= 0
                                || thirdcontent.name.indexOf("status_pon_link") >= 0 || thirdcontent.name.indexOf("status_wan_ip") >= 0
                                //|| thirdcontent.name.indexOf("network_wifi_multiAp") >= 0
                                //|| thirdcontent.name.indexOf("network_wifi_band_steering") >= 0 || thirdcontent.name.indexOf("network_wifi_base") >= 0
                                //|| thirdcontent.name.indexOf("network_wifi_advance") >= 0
                                || thirdcontent.name.indexOf("network_wifi_control") >= 0
                                //|| thirdcontent.name.indexOf("network_wifi_base5G") >= 0 || thirdcontent.name.indexOf("network_wifi_advance5G") >= 0
                                || thirdcontent.name.indexOf("network_wifi_control5G") >= 0 || thirdcontent.name.indexOf("network_wifi_acl") >= 0
                                || thirdcontent.name.indexOf("network_wifi_wps") >= 0 || thirdcontent.name.indexOf("network_lan_v4") >= 0
                                || thirdcontent.name.indexOf("network_dhcp_lan") >= 0 || thirdcontent.name.indexOf("network_DNS_settings") >= 0
                                || thirdcontent.name.indexOf("network_wan_broadbund") >= 0 || thirdcontent.name.indexOf("iptv") >= 0
                                || thirdcontent.name.indexOf("network_voice_enable") >= 0 || thirdcontent.name.indexOf("network_voice_basic") >= 0
                                || thirdcontent.name.indexOf("network_voice_advance") >= 0 || thirdcontent.name.indexOf("network_voice_timeout") >= 0
                                || thirdcontent.name.indexOf("network_voice_codec") >= 0
                                || thirdcontent.name.indexOf("network_ipv4_default_route") >= 0 || thirdcontent.name.indexOf("network_ipv4_static_route") >= 0
                                || thirdcontent.name.indexOf("network_qoslimit") >= 0 || thirdcontent.name.indexOf("network_qos_base") >= 0
                                || thirdcontent.name.indexOf("network_qos_queue") >= 0 || thirdcontent.name.indexOf("network_qos_app") >= 0
                                || thirdcontent.name.indexOf("network_qos_class") >= 0 || thirdcontent.name.indexOf("security_firewall_firewall") >= 0
                                || thirdcontent.name.indexOf("security_ip_filter") >= 0 || thirdcontent.name.indexOf("security_ipv6_filter") >= 0
                                || thirdcontent.name.indexOf("security_dhcp_filter") >= 0 || thirdcontent.name.indexOf("security_wan_wan") >= 0
                                || thirdcontent.name.indexOf("security_filter_eth") >= 0 || thirdcontent.name.indexOf("security_mac_mac") >= 0
                                || thirdcontent.name.indexOf("security_mac_mac_v6") >= 0 || thirdcontent.name.indexOf("security_parental_control") >= 0
                                || thirdcontent.name.indexOf("security_acl_setting") >= 0 || thirdcontent.name.indexOf("security_ipv6_acl_setting") >= 0
                                || thirdcontent.name.indexOf("ddos") >= 0 || thirdcontent.name.indexOf("security_security_HTTPS") >= 0
                                || thirdcontent.name.indexOf("app_dlna_enable") >= 0 || thirdcontent.name.indexOf("app_ddns_ddns") >= 0
                                || thirdcontent.name.indexOf("app_vpn_vpn_through") >= 0
                                || thirdcontent.name.indexOf("app_portmapping_portmapping") >= 0 || thirdcontent.name.indexOf("app_nat_alg") >= 0
                                || thirdcontent.name.indexOf("app_upnp_upnp") >= 0 || thirdcontent.name.indexOf("app_nat_dmz") >= 0
                                || thirdcontent.name.indexOf("manage_soft_view") >= 0
                            )) {
                                thirdcontent.src = "blank.html";
                            }

                            if (third_delete) //需要删除3级菜单
                            {
                                delete content.secondmenus[secondindex].thirdmenus[thirdindex];
                            }

                            thirdindex++;
                        });
                    }
                }
                secondindex++;
            });
            //若2级菜单不存在，则应该删除1级菜单
            if (content.secondmenus.length == 1 && content.secondmenus[0] == null) {
                delete mainMenuJsonObject[name];
            }
        }
    });
}

function bodyLoad() {

    window.menuLeft = new CreateMenuLft(
        {
            oneObj: mainMenuJsonObject,
            towObj: subMenuJsonObject,
            firDomNodeName: '.fir-menu>ul',
            secDomNodeName: '.sec-menu',
            objName: 'menuLeft' // new 出来的对象名称
        }
    )
}
function clickRealLogout() {
    myConfirm('Do you confirm to logout ?'.i18n(), 'You will logout and return to the login page.'.i18n(), function(r) {
        if (r) {
            realLogout();
        }
    })
}

function realLogout() {
    var postdata = new Object();
    var user = '';
    if (login_user == 4) //superadmin 
    {
        user = "superadmin";
    }
    else if (login_user == 2) //admin user
    {
        user = "admin";
    }
    else //default as common user
    {
        user = "common";
    }
    postdata.sessionid = sessionidstr;
    postdata.username = user;
    XHR.post("do_logout", postdata, function(data) {
        if (operator_name == "BZ_TIM") {
            window.parent.location = "../html/login_inter.html";
        } else if (operator_name == "PH_PLDT") {
            window.parent.location = "../html/login_pldt.html";
        } else {
            window.parent.location = "../index.html";
        }
    });
}

function wizard() {
    if (operator_name == "MY_TM") {
        window.parent.location = "../html/wizard.html";
    }
}

function fast_setting() {
    window.location.href = "fast_settings_eg.html";
}

function cleanPopWindowContent() {
    $("#pop_window_icon").html('');
    $("#pop_window_title").html('');
    $("#pop_window_message").html('');
    //$("#pop_window_option").html('');
}
function showOrHidePopWindow(action) {
    if (action == "show") {
        $("#pop_bg_layer").show();
        $("#pop_window_div").show();
    }
    else {
        $("#pop_bg_layer").hide();
        $("#pop_window_div").hide();
    }
}


function doConfirm() {
    showOrHidePopWindow("hide");
}
function doCancel() {
    showOrHidePopWindow("hide");
}
function checkSessionTimeout() {
    var currentTime = new Date().getTime();
    console.log("operate time "+ (parseInt(currentTime) - parseInt(gLastOperateTime))/1000)
    if (parseInt(currentTime) - parseInt(gLastOperateTime) >= parseInt(gSessionMaxTime) * 1000) //无操作自动退出时间，默认5分钟
    {
        if (gNewUiFlag) {
            myAlert('Session Time Out'.i18n(), 'The session has timed out, please login in again!'.i18n(), function(r) {
                if (r) {
                    gSessionFlag = "1";
                    realLogout();
                }
            });
        } else {
            alert("Time_out".i18n());
            gSessionFlag = "1";
            realLogout();
        }

    }
    else {
        clearTimeout(gClean_timeOut);
        gClean_timeOut = setTimeout("checkSessionTimeout();", 15000);
    }
}