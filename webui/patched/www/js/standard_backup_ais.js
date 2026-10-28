var sessionidstr = "";
var operator_name =  gOperatorName;
var login_user = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	if(login_user =="0" && operator_name == "TH_AIS")
		{
		$("#file_form").hide();
		}

	XHR.get("get_confinguration_info", null, initPage);
});

function initPage(getdata)
{
	if (getdata != null )
	{
		$("#configure_url").val(getdata.upload_server_url)
	}
}


function completeHandler(returnData, statusText)
{
	if ( statusText != "success" )
	{
		errorHandler();
		return;
	}
	returnData = JSON.parse(returnData);
	
	var uploadsuccess = false;
	var errmsg = "";
	if ( returnData )
	{
		if ( returnData.error_code != null && returnData.error_code != undefined )
		{
			if ( returnData.error_code == 14)//add by fengshuo 20191205
			{
				errmsg = "File is illegal, please check and upload again!";
			}
			else if ( returnData.error_code == 19 )
			{
				errmsg = "Path" + $("#path").val() + "is unreachable";
			}
			else if ( returnData.error_code == 20 )
			{
				errmsg = "Path" + $("#path").val() + "id readonly";
			}
		}
		
		if ( returnData.uploadStatus != null
			&& returnData.uploadStatus != undefined
			&& returnData.uploadStatus == "UPLOADSUCCESS" )
		{
			uploadsuccess = true;
			alert("upload_success_alert".i18n());
			XHR.get("get_login_user", null, function(getdata){
				if ( getdata.sessionid != undefined )
				{
					sessionidstr = getdata.sessionid;
			
					var postdata = new Object();
					postdata.sessionid = sessionidstr;
					XHR.post("set_onu_reboot", postdata, null);
				}
			});
		}
	}

	if ( false == uploadsuccess )
	{
		errorHandler(errmsg);
	}
	else
	{
		//alert("Success");
        
	}
	return;
}

function show_upload_file_server_result(data)
{
	setTimeout(function(){clearInterval(Interval); }, 20000);
	Interval = setInterval(function(){XHR.get("get_upload_file_server_result", null, returndatafunc);}, 5000);
}

function returndatafunc(data)
{	
	console.log(data.auto_upload_status);
	if (data.auto_upload_status != "")
	{
		if (data.auto_upload_status == "success")
		{
			clearInterval(Interval);
			alert("upload_success_to_server".i18n());
		}
		else
		{
			clearInterval(Interval);
			alert("upload_failed_to_server".i18n());
		}
	}
}

function save_apply()
{
    show_shadow();
    var postdata = new Object();
    postdata.action = "configuration_url";
    postdata.configure_url = $("#configure_url").val();
    XHR.post("set_confinguration_info", postdata, initPage);
}

function upload_file_server()
{
    show_shadow();
    var postdata = new Object();
    postdata.action = "upload_file";
    postdata.upload_status = "1";
    XHR.post("set_confinguration_info", postdata, show_upload_file_server_result);
}


function errorHandler(msg)
{
	var showmessage = "upload_error_alert".i18n();
	
	if ( msg != undefined && msg != "" )
	{
		showmessage = msg;
	}
	
	fiberlog("upload error");
	alert(showmessage);
}

function down_cfgfile()
{
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
            $("#Restart_button").attr("disabled",true);
			var postdata = new Object();
			postdata.sessionid = getdata.sessionid;
			XHR.post("down_cfgfile_ais", postdata, parse_return_data);
		}
	});
}

function parse_return_data(data)
{
	console.log(data);
	if ( data && data.success == "true" && data.uploadToServerWeb == 0)
	{
		window.location = "../cgi-bin/download?"+ data.filename;
		alert("download_config_success".i18n());
	}
	else
	{
		alert("unknown_error_alert".i18n());
	}
}

function upload_file()
{
	$("#uploadfile_telmex").click();
}


function upload_file2(path)
{
	$("#path").val(path.slice(12));
}