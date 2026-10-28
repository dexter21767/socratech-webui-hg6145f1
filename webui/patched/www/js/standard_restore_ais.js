var sessionidstr = "";
var operator_name =  gOperatorName;
var login_user = gLoginUser;
var Interval;
var Interval_sec;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");

	if(login_user =="0" && operator_name == "TH_AIS")
		{
		$("#restore_ais_cfg").hide();
		}

      XHR.get("get_confinguration_info", null, initPage);
	  
      $("#upload_file_server").click(function(){
      console.log($('form')[0].uploadfile.value);
      if ( $('form')[0].uploadfile.value == '' || $('form')[0].uploadfile.value == undefined )
      {
          alert("file_error_alert".i18n());
          return false;
      }
       $("#file_form").attr("action","../cgi-bin/ajax?method=upload&action=standcofig_ais&path=/var/");
      });
      
      var options = {
       	success:completeHandler
       };
       $("#file_form").submit( function(){  
       	$(this).ajaxSubmit(options);  
           $('#upload_file_server').attr('disabled',"true");
       	return false;//阻止表单默认提交
           
       });
});

function initPage(getdata)
{
	if (getdata != null )
	{
		$("#configure_url").val(getdata.download_server_url);
	}
}

  
function show_config_upload_onu_result(data)
{
	setTimeout(function(){clearInterval(Interval); }, 20000);
	Interval = setInterval(function(){XHR.get("get_config_upload_onu_result", null, returndatafunc);}, 5000);
}

function returndatafunc(data)
{	
	console.log(data.web_download_status);
	if (data.web_download_status != "")
	{
		if (data.web_download_status == "success")
		{
			clearInterval(Interval);
			alert("restore_config_success".i18n());
		}
		else
		{
			clearInterval(Interval);
			alert("restore_config_failed".i18n());
		}
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
			//alert("Upload File Success! ONU will reboot ");
			var postdata = new Object();
			XHR.post("set_config_upload_onu", postdata, show_config_upload_onu_result);
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

function save_apply()
{
    show_shadow();
    var postdata = new Object();
    postdata.action = "configuration_url";
    postdata.configure_url = $("#configure_url").val();
    XHR.post("set_config_download_info", postdata, initPage);
}

function show_download_file_server_result(data)
{
	setTimeout(function(){clearInterval(Interval_sec); }, 10000);
	Interval_sec = setInterval(function(){XHR.get("get_download_file_server_result", null, returnDownloadDataFunc);}, 2000);
}

function returnDownloadDataFunc(data)
{	 
	console.log(data.auto_download_status);
	if (data.auto_download_status != "")
	{
		if (data.auto_download_status == "success")
		{
			clearInterval(Interval_sec);
			alert("download_success_from_server".i18n());
		}
		else
		{
			clearInterval(Interval_sec);
			alert("download_failed_from_server".i18n());
		}
	}
}

function download_file_server()
{
    show_shadow();
    var postdata = new Object();
    postdata.action = "download_file";
    postdata.download_status = "1";

    XHR.post("set_config_download_info", postdata, show_download_file_server_result);
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
			var postdata = new Object();
			postdata.sessionid = getdata.sessionid;
			XHR.post("down_cfgfile_ais", postdata, parse_return_data);
		}
	});
}

function parse_return_data(data)
{
	if ( data && data.success == "true")
	{
		window.location = "../cgi-bin/download?usrconfig_conf";
	}
	else
	{
		alert("unknown_error_alert".i18n());
	}
}



