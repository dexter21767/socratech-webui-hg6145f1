var sessionidstr = "";
var operator_name = gOperatorName;
var login_user = gLoginUser;

function getSessionId()
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
}

$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if(glang == "span")
		$("#textfield").attr("placeholder", "choose upgrade file".i18n());

	if (operator_name == "MEX_TELMEX") {
		$("#update_telmex").show();
		$("#update_common").hide();
	} else {
		$("#update_telmex").hide();
		$("#update_common").show();
	}

	//console.log("login_user " + login_user);
	if (operator_name == "IDN_TELKOM" || (operator_name == "MEX_NETWEY" && (login_user =="0" || login_user =="1"))) {
		$("#update_config_header").hide();
		$("#file_form").hide();
	}

	if (operator_name == "IDN_TELKOM" || (operator_name == "MEX_NETWEY" && (login_user =="0" || login_user =="1"))) {
		$('#upload_button').click(function() {
			window.location.reload();
		});
	}
	else {
		$('#upload_button').click(function() {
			//valid check
			if (operator_name == "MEX_TELMEX") {
				if ($("#path").val() == '') {
					if (gNewUiFlag)
            			myAlert('Tip', '' + "upload_path_empty_error".i18n() + '', function() { })
        			else
					alert("upload_path_empty_error".i18n());
					return false;
				}
			} else {
				if ($('form')[0].uploadfile.value == '' || $('form')[0].uploadfile.value == undefined) {
					if (gNewUiFlag)
            			myAlert('Tip', '' + "file_error_alert".i18n() + '', function() { })
        			else
					alert("file_error_alert".i18n());
					return false;
				}
			}
			getSessionId();
			$("#file_form").attr("action", "../cgi-bin/ajax?method=upload&action=commonfile&path=/var/" + "&key=" + sessionidstr);
		});
	}

	var options = {
		success: completeHandler,
		error: completeHandler_err
	};

	$("#file_form").submit(function() {
		$(this).ajaxSubmit(options);
		$('#upload_button').attr('disabled', "true");
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
		if (returnData.error_code != null && returnData.error_code != undefined) {
			if (returnData.error_code == 14)//add by fengshuo 20191205
			{
				errmsg = "File is illegal, please check and upload again!";
			}
			else if (returnData.error_code == 19) {
				errmsg = "Path" + $("#path").val() + "is unreachable";
			}
			else if (returnData.error_code == 20) {
				errmsg = "Path" + $("#path").val() + "id readonly";
			}
		}

		if (returnData.uploadStatus != null
			&& returnData.uploadStatus != undefined
			&& returnData.uploadStatus == "UPLOADSUCCESS") {
			uploadsuccess = true;
			if (gNewUiFlag)
            	myAlert('Tip', "Upload successfully ! ONU will reboot.", function() { })
        	else
				alert("upload_success_alert".i18n());
			getSessionId();
			var postdata = new Object();
			postdata.sessionid = sessionidstr;
			XHR.post("set_onu_reboot", postdata, null);
			jumpToLoginPage(true);
		}
	}

	if (false == uploadsuccess) {
		errorHandler(errmsg);
	}
	else {

	}
	return;
}


function errorHandler(msg) {
	var showmessage = "upload_error_alert".i18n();

	if (msg != undefined && msg != "") {
		showmessage = msg;
	}

	fiberlog("upload error");
	if (gNewUiFlag){
		myAlert('Tip', '' + showmessage + '', function() { })
	}else{
		alert(showmessage);
	}
	window.location.reload()
}

function completeHandler_err(returnData, statusText) {
	errorHandler();
}

function down_cfgfile() {
	XHR.get("get_login_user", null, function(getdata) {
		if (getdata.sessionid != undefined) {
			var postdata = new Object();
			postdata.sessionid = getdata.sessionid;
			XHR.post("down_cfgfile", postdata, parse_return_data);
		}
	});
}

function parse_return_data(data) {
	if (data && data.success == "true") {
		window.location = "../cgi-bin/download?usrconfig_conf";
	}
	else {
		if (gNewUiFlag)
			myAlert('Tip', '' + "unknown_error_alert".i18n() + '', function() { })
        else
		alert("unknown_error_alert".i18n());
	}
}

function upload_file() {
	$("#uploadfile_telmex").click();
}


function upload_file2(path) {
	$("#path").val(path.slice(12));
}

function deleteFile(){
	$("#textfield").val("");
	$("#uploadfile").val("");
}