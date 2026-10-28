var gDebug = false; //调试模式默认关闭
var g2GLanPortDescribeArarry = new Array("千兆口", "iTV", "百兆口2", "百兆口3");
var g5GLanPortDescribeArarry = new Array("千兆口1", "iTV", "千兆口3", "千兆口4");
var g2GWifiPortDescribeArarry = new Array("2G-SSID1", "2G-SSID2", "2G-SSID3", "2G-SSID4");
var g5GWifiPortDescribeArarry = new Array("5G-SSID1", "5G-SSID2", "5G-SSID3", "5G-SSID4");
var g2GWifiMaxNum = 1;
var g5GWifiMaxNum = 1;

var gWANIPConnectionHead = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection."; //1-8
var gWANPPPConnectionHead = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection."; //1-8
var gLanPortHead = "InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig."; //1-4
var gWifiPortHead = "InternetGatewayDevice.LANDevice.1.WLANConfiguration."; //1-8
var gStatusFreshInterval = 10; //状态页面刷新间隔，秒

var gCssName;
var gLoginUser;
var gOperator;

var gOperatorName = null;
var gLoginUser = null;
var gDeviceInfo = null;
var gMultiapFlag = null;
var glang = null;
var gModelName = null;
var gnewtopoFlag = null;
var gOperatorMode = null;
var gFttr_type = null;
var gArea_code = null;
var gDevice_type = null;
var gCatv_num = null;
var gNewUiFlag = false;
var isFirstloginFlag = null;
var isFirstloginUserFlag = null;
var gPreconfigure_enable = null;
var gPon_mode = null;
var gusb_port = null
var gWifiCap = null;//获取2.4G WIFI能力 1为wifi6 0为wifi5
var gWifi5Cap = null;//获取5G WIFI能力 1为wifi6 0为wifi5
var gWifiEnable = null;
var gWifiEnable5G = null;
var gWifi5GIndex = null;//5G SSID起始index
var gOnu_type = null;
var gIOT_flag = null;
var g10GLanPortNum = 0; //10gLAN口数
var gLanPortNum = 4;
//Assign values to global variables (no need session)
(function(){

	if (gLoginUser === null) {
		XHR.get("get_login_user", null, function(data) {
			if (data) {
				if (data.login_user == "1") {
					gLoginUser = "0"
				} else if (data.login_user == "2") {
					gLoginUser = "1";
				} else if (data.login_user == "4") {
					gLoginUser = "2";
				} else {
					gLoginUser = "-1";
				}
			}
		});
	}

	/*统一获取设备能力集接口 */
	if (gDeviceInfo === null && gLoginUser != "-1") {
		XHR.get("show_device_info", null, function(data) {
			if (data) {
				gOperatorName = data.operator_name;
				gDeviceInfo = data;
				gFttr_type = data.fttr_type;
				gArea_code = data.area_code;
				gDevice_type = data.devicetype;
				gCatv_num = data.catv_num;
				gWifiCap = data.wifi_cap;
				gWifi5Cap = data.wifi5_cap;
				gusb_port = data.usb_port_num;
				gWifiEnable = data.wifi_enable;
				gWifiEnable5G = data.wifi_5g_enable;
				gWifi5GIndex = data.wifi_5g_index;
				gOnu_type = data.onu_type;
				gPon_mode = data.pon_mode;
				gModelName = data.ModelName;
				gMultiapFlag = data.multiAp_flag;
				gIOT_flag = data.iot_flag;
				g10GLanPortNum = data.lan_port_10g_num;
				gLanPortNum = data.lan_port_num;
				if (data.UI_flag == "1") {
					gNewUiFlag = true;
				}
				if (gOperatorName == "COL_MILLICOM" && gModelName == "PG5237") {
					gModelName = "HG6145F3"
				}
			}
		});
	}
		
	if(glang == null &&(gOperatorName == "MEX_TELMEX" || gOperatorName == "BZ_INTELBRAS"||gOperatorName == "MEX_NETWEY"||gOperatorName == "ES_DIGI")){
		XHR.get("get_lang_info", null, function(data) {
			if (data) {
				glang = data.i18n;
			}
		});
	}

	if ((gOperatorName == "TH_AIS" ||  gOperatorName == "MY_TM") && gOperatorMode == null) {
		XHR.get("get_operator_mode_info", null, function(data) {
			gOperatorMode = data.operator_mode;
		});
	}

	if (gOperatorName == "EG_TELECOM") {
		XHR.get("get_web_config", null, function(data) {
			gFirstFlag = data.FirstTimeLogin;
		});
	}

	if (gOperatorName == "BZ_INTELBRAS") {
		XHR.get("get_web_config", null, function(data) {
			if (data) {
				isFirstloginFlag = data.FirstTimeLoginAdmin;
				isFirstloginUserFlag = data.FirstTimeLoginUser;
				gPreconfigure_enable = data.Preconfigure_enable;
			}
		});
	}


})();