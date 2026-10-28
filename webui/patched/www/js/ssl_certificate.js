var sessionidstr = "";
var operator_name = gOperatorName;

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
	getSessionId();
	$('#upload_button').click(function() {
		//valid check
		if ($('form')[0].uploadfile.value == '' || $('form')[0].uploadfile.value == undefined) {
			if(gNewUiFlag)
				myAlert('Tip', "file_error_alert".i18n())
			else
				alert("file_error_alert".i18n());
			return false;
		}
		else
		{
			var uploadfile_array = $('form')[0].uploadfile.value.split(".");
			var uploadfile_name = uploadfile_array[uploadfile_array.length -1];
			//console.log("length: " + uploadfile_array.length);
			//console.log("uploadfile_name: " + uploadfile_name);
			if(uploadfile_name == '' || uploadfile_name == undefined)
			{
				if(gNewUiFlag)
					myAlert('Tip', "update_format_illegal".i18n())
				else
					alert("update_format_illegal".i18n());
				return false;
			}
			else
			{
				if(uploadfile_name != "key" && uploadfile_name != "pem" && uploadfile_name != "crt")
				{
					if(gNewUiFlag)
						myAlert('Tip', "update_format_illegal".i18n())
					else
						alert("update_format_illegal".i18n());
					return false;
				}
			}
		}
		$("#file_form").attr("action", "../cgi-bin/ajax?method=upload&action=uploadcert&path=/fhconf/" + "&key=" + sessionidstr);
	});

	var options = {
		success: completeHandler,
		error: completeHandler_err
	};

	$("#file_form").submit(function() {
		$(this).ajaxSubmit(options);
		$('#upload_button').attr('disabled', "true");
		return false;
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
			if (returnData.error_code == 14)
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
			if(gNewUiFlag)
				myAlert('Tip', "upload_cert_success_alert".i18n())
			else
				alert("upload_cert_success_alert".i18n());
			getSessionId();
			var postdata = new Object();
			postdata.sessionid = sessionidstr;
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
	if(gNewUiFlag)
		myAlert('Tip', showmessage)
	else
		alert(showmessage);
}

function completeHandler_err(returnData, statusText) {
	errorHandler();
}