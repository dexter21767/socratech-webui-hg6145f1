var sessionidstr = "";
var ftp_servicesdata = "";
var operator_name = gOperatorName;
var timeout;
var usbflag = 0;
var ftp_password_encode;

$(document).ready(function(){
	//customScrollBar("html");

	initPage();
	if(operator_name == "EG_TELECOM")
	{
		XHR.get("get_dongle_info", null, usbInfo);
		initValidate_telecom();
		$("#ftpServer_pwdTips").html("(You can input 8-32 characters,alphanumeric and special characters)");
	}else
	{
		initValidate();
	}
	
	$("input[name='ftpServer_enable']").bind("click", function(){
		var ftpServer_enable  = $("input[name='ftpServer_enable']:checked").val();
		if (ftpServer_enable == 0){
			$("#user_pwd").css("display", "none");
		}else{
			$("#user_pwd").css("display", "");
		}
	});
	if(operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "TH_AIS"){
		$("#ftp_client_form").show();
	}

	if(gOperatorName == "MEX_TELMEX"){
		$(".main_item_name").css("width","20%");
		$(".main_item_content").css("width","calc(80% - 3px)");
	}else if(operator_name == "EG_TELECOM"){
		$(".main_item_name").css("width","15%");
		$(".main_item_content").css("width","calc(85% - 3px)");
	}else{
		if(!gNewUiFlag){
        $(".main_item_name").css("width","23%");
        $(".main_item_content").css("width","calc(77% - 3px)");
		}
    }
	//initPage();

	if(gOperatorName == "BZ_INTELBRAS"){
		$("#ftpServer_pwd").prop('type', "password");	
	}	

	if(gOperatorName == "ALGERIA_TELECOM"){
		$("#ftpServer_pwd").prop('type', "password");	
	}
    
	if(operator_name == "COL_ETB"){
		$("#show_password").show();
	}


	if(operator_name == "TH_3BB")
    {
		$("#ftpServer_pwd,#ftpClient_pwd").prop('type','password')

		setInterval(function(){
		    if($("#ftpServer_pwd").length > 0){
				if($("#ftpServer_pwd").attr('type') != 'password'){
					$('#ftpServer_pwd').prop('type','password')
				}
			}else{
				window.location.reload();
			}
			if($("#ftpClient_pwd").length > 0){
				if($("#ftpClient_pwd").attr('type') != 'password'){
					$('#ftpClient_pwd').prop('type','password')
				}
			}else{
				window.location.reload();
			}
		}, 10);
	}
});

function change_eye() {
	$("#ftpServer_pwd").toggleClass("fh-text-security");
}

function usbInfo(data)
{
    var dongle_info = data.dongle_info;
    console.log(dongle_info);
    for(var i = 0; i<dongle_info.length; i++)
    {
        if(dongle_info[i].Status == "active")
        {
			usbflag = 1;
             break;
        }
    }
}

function initValidate_telecom()
{
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"ftpServer_user": {required: true, maxlength:32, num_letter_:true},
			"ftpServer_pwd": {required: true, minlength:8, maxlength:32, pwdcheck_pldt:true}
		},
		errorPlacement: function(error, element) { 
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {
			fiberlog("validate loid failed.....");
			return false;
		}
	}); 

}

function initValidate()
{
	var ftpServer_pwd_flag = false;
    if(operator_name == "ALGERIA_TELECOM" && $("#ftpServer_pwd").val() == ftp_password_encode)
    {
        ftpServer_pwd_flag = false;
    }
    else
    {
        ftpServer_pwd_flag = true;            
    }
	$("#wlanAdv_settings_form").validate({
		debug: true,
		rules: {
			"ftpServer_user": {required: true, maxlength:32, num_letter_:true},
			"ftpServer_pwd": {required: true, maxlength:8, num_letter_:ftpServer_pwd_flag}
		},
		errorPlacement: function(error, element) { 
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){
			fiberlog("validate loid ok.....");
		},
		invalidHandler: function(form, validator) {
			fiberlog("validate loid failed.....");
			return false;
		}
	}); 
	
	$("#ftp_client_form").validate({
		debug: true,
		rules: {
			"ftpClient_url": {required: true, minlength:1, maxlength:256, nocn: true},
			"ftpClient_port": {required: true, range_int:[1, 65535]},
			"ftpClient_user": {required: true,minlength:1, maxlength:32, nocn: true},
			"ftpClient_pwd": {required: true,minlength:1, maxlength:32, nocn: true}
			
		},
		errorPlacement: function(error, element) { 
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){
			fiberlog("validate ftp client ok.....");
		},
		invalidHandler: function(form, validator) {
			fiberlog("validate ftp client failed.....");
			return false;
		}
	}); 
}

function initPage()
{
	if(gDebug)
	{
		getDataByAjax("../fake/wlanAdvanced", fillData);
	}else{
		XHR.get("get_ftpservices", null, fillData);
		if(operator_name == "MEX_TP" || operator_name == "SFU_MEX_TP" || operator_name == "TH_AIS"){
			XHR.get("get_ftpclient_info", null, fillFtpClient);
		}
	}
	
	$("#add_item").children().css("background-color", "#b7e3e3");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
	$("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
}


function fillData(data)
{
	if (data && data.ftp_services)
	{
		ftp_servicesdata = data.ftp_services;
		displayHtml();
	}
}

function replacePwd(pwd){
	var temp = "";
	for(var i=0; i<pwd.length; i++){
		temp+="*";
	}
	return temp;
}

function fillFtpClient(data){
	if(data){
		if(data.UsbList.length > 0)
		{
			var usb_arr = data.UsbList.split(",");
			$("#downloadPath").empty();
			for(var i=0; i<usb_arr.length; i++){
				$("#downloadPath").append("<option value="+usb_arr[i]+">"+usb_arr[i]+"</option>");
			}
			$("#downloadPath").val(data.DownloadPath);
		}

		let password_aes =fhdecrypt(data.PassWord);
		$("#ftpClient_url").val(data.Url==""?"ftp://":data.Url);
		$("#ftpClient_port").val(data.Port);
		$("#ftpClient_user").val(data.UserName);
		$("#ftpClient_pwd").val(password_aes);
		
		$("#add_item td:eq(0)").html(data.UserName);
		$("#add_item td:eq(1)").html(replacePwd(password_aes));
		$("#add_item td:eq(2)").html(data.Port);
		$("#add_item td:eq(3)").html(data.Url);
		$("#add_item td:eq(4)").html(data.DownloadPath);
		$("#add_item td:eq(5)").html(data.Status);
		setTimeout(update_list_info, 2000);
	}
}

function displayHtml()
{
	if (ftp_servicesdata.ftp_enable == "0"){
		$("#user_pwd").css("display", "none");
		$("input[name='ftpServer_enable']:last").attr('checked', 'checked');
	}else{
		$("#user_pwd").css("display", "");
		$("input[name='ftpServer_enable']:first").attr('checked', 'checked');
	}
	let name_aes = fhdecrypt(ftp_servicesdata.ftp_username);
	$("#ftpServer_user").val(name_aes);
	if(operator_name == "ALGERIA_TELECOM"){
		ftp_password_encode = ftp_servicesdata.ftp_password_encode;
		$("#ftpServer_pwd").val(ftp_password_encode);
	}
	else{	
		let password_aes =fhdecrypt(ftp_servicesdata.ftp_password);
		$("#ftpServer_pwd").val(password_aes);
	}
	
	$("#add_item").children().css("background-color", "#eef2f6");
	$("#add_item").siblings().children().css("background-color", "#eef2f6");
}

function CancelBtn()
{
	displayHtml();
}

function saveApply()
{
	
	if( ! $("#wlanAdv_settings_form").valid() )
	{
		alert("invalid_data_alert".i18n());
		return;
	}

	if(operator_name == "ALGERIA_TELECOM" && $("input[name='ftpServer_enable']:checked").val() == '1'
		&& $("#ftpServer_pwd").val() != ftp_password_encode)
	{
		var ftpServer_pwd = $("#ftpServer_pwd").val();
		if (!isLetterornumber(ftpServer_pwd))
		{
			alert("ftpServer_pwdCfgIllegalAlert".i18n());
			$("#ftpServer_pwd").focus();
			return;
		}
	}
	show_shadow();
	var postdata = new Object();
	postdata.ftp_enable = $("input[name='ftpServer_enable']:checked").val();
	//postdata.ftp_username = $("#ftpServer_user").val();
	postdata.ftp_username = fhencrypt($("#ftpServer_user").val()); 

	if(operator_name == "BZ_INTELBRAS"){
		if($("#ftpServer_pwd").val() == ftp_password_encode){
			postdata.ftp_password = fhencrypt(ftp_password_encode);
		}else{
			postdata.ftp_password =fhencrypt($("#ftpServer_pwd").val());
		}
	}else{
		postdata.ftp_password =fhencrypt($("#ftpServer_pwd").val());
	}
	
	//alert(JSON.stringify(postdata));
	if(operator_name == "EG_TELECOM"){
		if(postdata.ftp_enable == "1" && usbflag == 0){
			alert("no_usb_device".i18n());
			XHR.get("get_ftpservices", null, fillData);
			return ;
		}
	}
	
	
	XHR.post("set_ftpservices", postdata, fillData);
}

function extraValidCheck()
{
	var ftp_url = $("#ftpClient_url").val();
	if(ftp_url.indexOf("ftp://") != 0){
		alert("ftp_url_illegal".i18n());
		$("#ftpClient_url").focus();
		return false;
	}
	var temp = ftp_url.substring(6);
	if(temp.indexOf("/") == -1){
		alert("ftp_url_illegal".i18n());
		$("#ftpClient_url").focus();
		return false;
	}
	var arr = temp.split("/");
	if(arr[arr.length-1].trim() == ""){
		alert("ftp_url_illegal".i18n());
		$("#ftpClient_url").focus();
		return false;
	}
	if(!isValidIpAddress(arr[0])){
		alert("ftp_url_illegal".i18n());
		$("#ftpClient_url").focus();
		return false;
	}
	return true;
}

function start_download(){
	if( ! $("#ftp_client_form").valid() )
	{
		alert("invalid_data_alert".i18n());
		return;
	}
	if(!extraValidCheck()){
		return;
	}
	show_shadow();
	clearTimeout(timeout);
	var postdata = new Object();
	postdata.Url = $("#ftpClient_url").val();
	postdata.Port = $("#ftpClient_port").val();
	postdata.UserName = $("#ftpClient_user").val();
	postdata.PassWord = fhencrypt($("#ftpClient_pwd").val());
	postdata.DownloadPath = $("#downloadPath").val();
	XHR.post("set_ftpclient_info", postdata, fillFtpClient);
}

function update_list_info(){
	XHR.get("get_ftpclient_info", null, function(data){
		let password_aes =fhdecrypt(data.PassWord);
		
		$("#add_item td:eq(0)").html(data.UserName);
		$("#add_item td:eq(1)").html(replacePwd(password_aes));
		$("#add_item td:eq(2)").html(data.Port);
		$("#add_item td:eq(3)").html(data.Url);
		$("#add_item td:eq(4)").html(data.DownloadPath);
		$("#add_item td:eq(5)").html(data.Status);
		if(data.Status != "SUCCESS" && data.Status != "FAIL"){
			clearTimeout(timeout);
			timeout = setTimeout(update_list_info, 2000);
		}
	});
}

function clearInputValue(id)
{
	if(gOperatorName == "ALGERIA_TELECOM")
	{
		$("#" + id).val("");
	}
}
	

function resetInputValue(id)
{
	if(gOperatorName == "ALGERIA_TELECOM")
	{
		if($("#" + id).val() == "")
			$("#" + id).val(ftp_password_encode);
	}
}