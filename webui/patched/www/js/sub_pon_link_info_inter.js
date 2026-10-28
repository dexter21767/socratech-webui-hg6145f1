var PonlinkArray = null;
var chooseIndex;
var action;
var sessionidstr = "";
var devicetotal = "0";
var time1 = "";
var glogin_user = 0;
var ghostArray = [];
var login_user = gLoginUser;
function getSessionId() {
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			sessionidstr = getdata.sessionid;
		}
	});
}

$(document).ready(function() {
	//优化滚动条，无需改动
	customScrollBar("html");

	getData();

	$('#upload_button').click(function() {
		//valid check
		if ($('form')[0].uploadfile.value == '' || $('form')[0].uploadfile.value == undefined) {
			alert("请选择文件");
			return false;
		}
		getSessionId();
		var action = "../cgi-bin/ajax?method=uploadSubgateway&action=subgateway_upgrade&key=" + sessionidstr;
		$("#file_form").attr("action", action)
		showOrHideLoadingWindowFromIframe("show");
	});

	var options = {
		success: completeHandler
	};
	$("#file_form").submit(function() {
		$(this).ajaxSubmit(options);
		return false;//阻止表单默认提交
	});

});

function completeHandler(returnData, statusText) {
	if (statusText != "success") {
		errorHandler();
		return;
	}
	returnData = JSON.parse(returnData);

	var uploadsuccess = false;
	var errmsg = "";
	if (returnData) {
		if (returnData.uploadStatus != null
			&& returnData.uploadStatus != undefined
			&& returnData.uploadStatus == "UPLOADSUCCESS") {
			$("#choosefile").css('display', 'none');
			uploadsuccess = true;
			save_upgrade(ontid);
		}
	}

	if (false == uploadsuccess) {
		errorHandler(errmsg);
	}
	else {
		showOrHideLoadingWindowFromIframe("hide");
		alert("上传成功");
	}
	return;
}


function errorHandler(msg) {
	if (msg != null && msg.session_valid != null && msg.session_valid != undefined) {
		if (msg.session_valid == 0) //session invalid, jump to login page
		{
			parent.window.location = "../index.html";
			return;
		}
	}

	var showmessage = "文件上传出错，请重试";

	if (msg != undefined && msg != "") {
		showmessage = msg;
	}

	fiberlog("upload error");
	showOrHideLoadingWindowFromIframe("hide");
	alert(showmessage);
}

function getData() {
	// getDataByAjax("../fake/ponlink_info", parseWanData);
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/edgeOnt_info", parseWanData);
	}
	else {
		XHR.get("get_lan_status", null, function(data) {
			data = JSON.parse(JSON.stringify(data).replace(/_point_/g, "."));
			if (data && data.lan_status) {
				var landata = data.lan_status;
				for (var i = 0; i < landata.data.length; i++) {
					if (landata.data[i].MACAddress != "" && landata.data[i].IPAddress != "" && landata.data[i].Active == "1") {
						ghostArray.push({
							MACAddress: landata.data[i].MACAddress,
							IPAddress: landata.data[i].IPAddress
						})
					}
				}
			}
			console.log(ghostArray);
			XHR.get("get_edgeOnt_info", null, parseWanData);
		});
	}
	showOrHideLoadingWindowFromIframe("hide");
}

function parseWanData(getdata) {
	var HTML = '';
	var UpgradeState_flag = 0;

	$("#chooseall").attr("checked", false);
	console.log(getdata);
	if (getdata && getdata.ponlist) {

		PonlinkArray = getdata.ponlist;
		devicetotal = PonlinkArray.length;
		$(".ponlist_count").html(devicetotal);
		$("#restart_button, #upgrade_button").attr("disabled", false);
		$(".operation button").attr("disabled", false);
		for (var i = 0; i < PonlinkArray.length; i++) {
			var isDisabled_AuthState = "";
			var isDisabled_goto = "";
			var singlePon = PonlinkArray[i];
			var IPAddress = "";
			var j = singlePon.pon_index;

			//X_FH_UpgradeState为3表示正在升级或重启
			if (singlePon.X_FH_UpgradeState == 3) {
				UpgradeState_flag++;
			} else {
				if (singlePon.AuthState == 0) {
					isDisabled_AuthState = "disabled";
				}
			}

			//比较mac和hosts下的是否匹配
			for (var index = 0; index < ghostArray.length; index++) {
				if (singlePon.MAC.toUpperCase() == ghostArray[index].MACAddress.toUpperCase()) {
					IPAddress = ghostArray[index].IPAddress;
				}
			}

			if (IPAddress == "") {
				isDisabled_goto = "disabled";
			}
			
			
			HTML += '<tr id="table_'+i+'"   onclick="Showthisinfo(this.id)" style="color:rgba(255, 255, 255, 0.8);border:0px">';

			//HTML += '<td align="center"><input type="checkbox" class="choose_' + i + '" id= "' + j + '"></td>';

			//编号
			HTML += '<td class="ponlink_info_td" align="center" style="border:0px">' + (i + 1) + '</td>';

			// 光路由器
			HTML += '<td id="idnum_' + i + '" style="border:0px" class="ponlink_info_td" onclick="getPonList(this.id)" align="center"><img src=../image/ic_router_small.png></td>';

			// GPON SN
			HTML += '<td style="border:0px" class="ponlink_info_td" align="center">' + singlePon.SN + '</td>';

			// IPAddress
			HTML += '<td  style="border:0px" class="ponlink_info_td" align="center">' + IPAddress + " ";
			HTML += '<button value="' + IPAddress + '" type="button" onclick="gotopage(this.value)"' + isDisabled_goto + '>manage</button>';
			HTML += '</td>';

			// 在线状态
			if (singlePon.Status.toLowerCase() == 'online') {
				HTML += '<td style="border:0px" class="ponlink_info_td" align="center">online</td>';
			}
			else if (singlePon.Status.toLowerCase() == 'disabled') {
				HTML += '<td style="border:0px" class="ponlink_info_td" align="center">disabled</td>';
			}
			else {
				HTML += '<td style="border:0px" class="ponlink_info_td" align="center">offline</td>';
			}

			// 授权状态
			if (singlePon.AuthState == 0) {
				HTML += '<td style="border:0px" class="ponlink_info_td" align="center">unauthorized</td>';
			}
			else {
				HTML += '<td style="border:0px" class="ponlink_info_td" align="center">authorized</td>';
			}
			
			//升级状态
			/*if (singlePon.X_FH_UpgradeState == 1) {
				HTML += '<td class="ponlink_info_td" align="center">successfully</td>';
			}
			else if (singlePon.X_FH_UpgradeState == 2) {
				HTML += '<td class="ponlink_info_td" align="center">failed</td>';
			}
			else if (singlePon.X_FH_UpgradeState == 3) {
				HTML += '<td class="ponlink_info_td" align="center">upgrading</td>';
			}
			else {
				HTML += '<td class="ponlink_info_td" align="center"></td>';
			}*/

			// 操作
			HTML += '<td style="border:0px" class="ponlink_info_td operation" style="display: none;" align="center">';

			HTML += '<button id="btn2_' + j + '" value="0" type="button" onclick="set_pon_enable(this.id,value)" ' + isDisabled_AuthState + '>deauthorize</button>';

			HTML += '</td>';

			HTML += '</tr>';
		}
	}

	$("#ponlink_info").html(HTML);
	if(!gNewUiFlag){
	$("#ponlink_info").children().eq(0).children().css("background-color","#b7e3e3");
    $("#ponlink_info").children().eq(0).siblings().children().css("background-color","#eef2f6");
    $("#ponlink_info").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");     
	}
	
	/*if (UpgradeState_flag > 0) {
		$(".operation button").attr("disabled", true);
		$("#restart_button, #upgrade_button").attr("disabled", true);
	}*/

	if (login_user == "1") {
		$("#batch_botton").show();
		$(".operation").show();
	}
	else {
		$("#batch_botton").hide();
		$(".operation").hide();
	}
}

function set_pon_enable(value, action) {
	var index;
	index = value.split("_")[1];
	var postdata = new Object();
	postdata.chooseIndex = index;
	postdata.action = action;
	postdata.sessionid = sessionidstr;
	XHR.post("set_pon_enable", postdata, parseWanData);
}

function getPonList(value) {
	chooseIndex = value.split("_")[1];
	var curdata = PonlinkArray[chooseIndex];
	$("#PON_ONTID").html(Number(curdata.ONT_ID)+1);
	$("#PON_MAC").html(curdata.MAC);
	//$("#PON_Manufacturer").html(curdata.Manufacturer);
	$("#PON_ProductClass").html(curdata.ProductClass);
	$("#PON_HardwareVersion").html(curdata.HardwareVersion);
	$("#PON_SoftwareVersion").html(curdata.SoftwareVersion);
	//$("#PON_ONTDistance").html(curdata.ONTDistance);
	$("#PON_TXPower").html(Number(curdata.TXPower).toFixed(3));
	$("#PON_RXPower").html(Number(curdata.RXPower).toFixed(3));
	$("#PON_LastDownCause").html(curdata.LastDownCause);
	$("#PON_LastUpTime").html(curdata.LastUpTime);
	$("#PON_LastDownTime").html(curdata.LastDownTime);
	$("#PON_LastDyingGaspTime").html(curdata.LastDyingGaspTime);
	//$("#PON_OnlineDuration").html(curdata.OnlineDuration);
	$("#PON_Alarm").html(curdata.Alarm);


	$("#background").css('display', 'block');
}

function saveApply(type) {
	var postdata = new Object();
	postdata.AutoAuth = type;
	postdata.sessionid = sessionidstr;
	XHR.post("set_autoauth_enable", postdata, parseWanData);

}

//全选
function docheckall() {
	for (var i = 0; i < devicetotal; i++) {
		if (1 == getCheckbox("chooseall")) {
			$(".choose_" + i).prop("checked", true);
		}
		else {
			$(".choose_" + i).prop("checked", false);
		}
	}
}

//重启
function set_restart(value) {
	var postdata = new Object();
	postdata.action = "reboot";
	postdata.ontid = value.split("_")[1];
	XHR.post("sub_router_reboot", postdata, parseWanData);
}

//批量重启
function restartAll() {
	if (!returnData("restart")) {
		return;
	}
	var postdata = new Object();
	postdata.action = "reboot";
	postdata.ontid = returnData();
	XHR.post("sub_router_reboot", postdata, parseWanData);

}

//批量升级
function upgradeAll() {
	if (!returnData("upgrade")) {
		return;
	}
	$("#choosefile").css('display', 'block');
	$('form')[0].uploadfile.value = '';
	ontid = returnData();
}

//返回勾选数据
function returnData(type) {
	var checkid = "";
	var checkText = "";
	for (var i = 0; i < devicetotal; i++) {
		if ("checked" == $(".choose_" + i).attr("checked")) {
			checkText += $(".choose_" + i).attr("id") + ",";
		}
	}
	if (checkText.length > 0) {
		checkid = checkText.slice(0, checkText.length - 1);
	}
	else {
		checkid = "";
	}

	if (checkid == "") {
		if (type == "restart") {
			alert("请选择需要重启的设备！");
		}
		else {
			alert("请选择需要升级的设备！");
		}

		return false;
	}
	return checkid;

}

function save_upgrade(value) {
	var parentObj = window.parent.document;
	var postdata = new Object();
	postdata.action = "upgrade";
	postdata.ontid = value;
	postdata.filename = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host + "/subupgrade/sub_upgrade.img";
	queryflagresult();//升级状态查询
	XHR.post("sub_router_upgrade", postdata, parseWanData);
}

//查询升级状态
function queryflagresult() {
	clearInterval(time1);
	time1 = setInterval(function() {
		XHR.get("get_edgeOnt_info", null, parseWanData);
	}, 10 * 1000);

	//4分钟停止循环读取升级状态
	setTimeout(function() {
		clearInterval(time1);
	}, 240 * 1000);
}

function gotopage(ipaddr) {
	var url = "http://" + ipaddr;
	window.open(url, "_blank");
}

function Showthisinfo(element) //选中当前行并改变背景色
{
	console.log(element)
    //$("#"+element).children().css("background-color","#b7e3e3");
    //$("#"+element).siblings().children().css("background-color","#eef2f6");
    //$("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	getPonList(element)
}