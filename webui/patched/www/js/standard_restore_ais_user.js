var sessionidstr = "";
var operator_name =  gOperatorName;
var login_user = gLoginUser;
var Interval;
var Interval_sec;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	  
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
