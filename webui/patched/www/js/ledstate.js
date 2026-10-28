var sessionidstr = "";
var operator_name = gOperatorName;
var g_timer;
function getSessionId() {
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			sessionidstr = getdata.sessionid;
		}
	});
}

$(document).ready(function() {
	var complete = 0;
	var interval;
	var purWidth = parseInt($("#progress").css("width")) / 100;
	//优化滚动条，无需改动
	//customScrollBar("html");

	if (operator_name == "MEX_TELMEX") {
		$("#file_telmex").show();
		$("#file_common").hide();
	} else {
		$("#file_telmex").hide();
		$("#file_common").show();
	}

	if(glang == "span")
		$("#upgradefile").attr("placeholder", "choose upgrade file".i18n());

	getSessionId();
	XHR.get("get_updateInfo", null, initPage);
	$(':submit').click(function() {
		if (operator_name == "MEX_TELMEX") {
			if ($("#path").val() == '') {
				alert("upload_path_empty_error".i18n());
				return false;
			}
		}
		else {
			if ($('form')[0].upgradefile.value == '' || $('form')[0].upgradefile.value == undefined) {
				if (gNewUiFlag)
            		myAlert('Tip', '' + "upgrade_nofile_err".i18n() + '', function() { })
        		else
					alert("upgrade_nofile_err".i18n());
				return false;
			}
		}

		clearInterval(g_timer);
		g_timer = setInterval(function() {
			XHR.get("get_heartbeat", null, null);
		}, 240 * 1000);

		$("#div_info").show();
		$(".inner-progress").css("width", 0);
		$("#progress").show();
		if (!gNewUiFlag)
			$("#upgrade_submit").hide();
		$("#update_info").html("update_info".i18n());
		interval = window.setInterval(function() {
			if (complete < 150) {
				complete = complete + 1;
				$(".inner-progress").css("width", complete * purWidth);
			}
			else {
				complete = 150;
			}
		}, 1000);
	});

	var options = {
		success: completeHandler,
		error: completeHandler_err
	};

	var action = $("#upgrade_form").attr("action");
	action += "&key=" + sessionidstr;
	$("#upgrade_form").attr("action", action)
	$("#upgrade_form").submit(function() {
		$(this).ajaxSubmit(options);
		return false;//阻止表单默认提交
	});
});

function initPage(getdata) {
	var data = getdata;
}

function completeHandler(returnData, statusText) {
	clearInterval(g_timer);
	getSessionId();
	if (statusText != "success") {
		errorHandler();
		return;
	}

	if (returnData && returnData.indexOf("UPLOADSUCCESS") >= 0) {
		fiberlog("upload success");
		var postdata = new Object();
		postdata.sessionid = sessionidstr;
		$("#progress").hide();

		//alert("update_success".i18n()+"update_restartAlert".i18n());
		if(gDevice_type != 1){
			$("#update_info").html("update_restart_AP_Alert".i18n());
		}else{
			$("#update_info").html("update_restartAlert".i18n());
		}
		
		XHR.post("set_onu_reboot", postdata, null);
		jumpToLoginPage(true);
	}
	else {
		errorHandler();
	}
}

function completeHandler_err(returnData, statusText) {
	clearInterval(g_timer);
	errorHandler();
}

function errorHandler() {
	//var postdata = new Object();
	fiberlog("upload error");
	//$("#update_info").html("update_fail".i18n());
	if (gNewUiFlag)
		$("#div_info").hide();
	$("#progress").hide();
	if (gNewUiFlag)
        myAlert('Tip', '' + "update_fail".i18n() + '', function() {
			window.location.reload()
	 })
    else
	alert("update_fail".i18n());
	$("#upgrade_submit").show();
	//alert("update_fail".i18n()+"update_restartAlert".i18n());
	//$("#update_info").html("update_restartAlert".i18n());
	//XHR.post("reboot", postdata, null);	
}

function upload_file() {
	$("#upgradefile_telmex").click();
}


function upload_file2(path) {
	$("#path").val(path.slice(12));
}

function deleteFile(){
	$("#upgradefile").val("");
	$("#fileField").val("");
}