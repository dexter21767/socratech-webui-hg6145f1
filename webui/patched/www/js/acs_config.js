var sessionidstr = "";
var g_data;
var login_user = gLoginUser;
var operator_name = gOperatorName;
var g_certificate_enable = "";
var  required_flag = true;
var tr069password_encode;
var tr069conReqPwd_encode;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
   if(operator_name == "EG_TELECOM"){
       required_flag = false;
   }
	initValidate();
	$("input[name='acs_stun_enable']").bind("click", function(){
		var acs_stun_enable  = $("input[name='acs_stun_enable']:checked").val();
		if (acs_stun_enable == 0){
			$("#stun_cfg").css("display", "none");
			
		}else{
			$("#stun_cfg").css("display", "");
		}
	});
   
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_acs_info", null, initPage);	
	}
	
	if(operator_name == "PH_PLDT" || operator_name == "TH_AIS" || operator_name == "FTTR_SUB_COMMON" || operator_name == "ES_DIGI" || operator_name == "AP_COMMON")
	{
		XHR.get("get_acs_stun_info", null, initPage_stun);
		$("#Stun").show();
	}

	if(operator_name == "TH_AIS" )
	{	
		$("#certificate_auth").show();
		$(".main_item_name").css("width","28%");
		$(".main_item_content").css("width","calc(72% - 3px)");
	}
	
	if( operator_name != "CHL_MP" && operator_name != "ECU_CNT" && operator_name != "EG_TELECOM"){
        //解决密码框自动填充问题
        setTimeout(function(){
        	document.getElementById("acs_username").removeAttribute("disabled");
        	document.getElementById("acs_stun_username").removeAttribute("disabled");
        }, 1000);
    }
    
    if(login_user !="1" && operator_name == "ECU_CNT")
    {
        $("#acs_username").attr("disabled", false);
    }

	if(operator_name == "BZ_INTELBRAS")
	{
		$("#div_acs_auth").show();
		$("#acs_password").prop('type', "password");
		$("#acs_connetionRequest_password").prop('type', "password");
	}
    
	if(operator_name == "ALGERIA_TELECOM")
	{
		$("#acs_password").prop('type', "password");
		$("#acs_connetionRequest_password").prop('type', "password");
	}
    
	if(operator_name == "COL_ETB"){
		$("#show_password").show();
	}
	
});

function change_eye() {
	$("#acs_password").toggleClass("fh-text-security");
}

function initPage(getdata)
{
	if (getdata != null )
	{
		var acs_info = getdata.acs_info;
		if(acs_info.Enable == "0"){
			$("[name='acs_enable'][value='0']").prop('checked','true');
		}else if(acs_info.Enable == "1"){
			$("[name='acs_enable'][value='1'").prop('checked','true');
		}
		if(operator_name == "TH_3BB")
		{
			$("#acs_url").val(fhdecrypt(getdata.URL));
			$("#acs_username").val(fhdecrypt(getdata.TH_3BBUsername));
			$("#acs_password").val(fhdecrypt(getdata.Password));
			$("#acs_connetionRequest_path").val(fhdecrypt(getdata.X_FH_ConnectionRequestPath));
			$("#acs_connetionRequest_port").val(fhdecrypt(getdata.X_FH_ConnectionRequestPort));
			$("#acs_connetionRequest_username").val(fhdecrypt(getdata.ConnectionRequestUsername));
			$("#acs_connetionRequest_password").val(fhdecrypt(getdata.ConnectionRequestPassword));
			$("#acs_inform_interval").val(fhdecrypt(getdata.PeriodicInformInterval));
		}
		else
		{
			$("#acs_url").val(getdata.URL);
			$("#acs_username").val(getdata.Username);
			if(operator_name == "BZ_INTELBRAS"){
				tr069password_encode = getdata.tr069password_encode;
				$("#acs_password").val(tr069password_encode);
			}
            		else if(operator_name == "ALGERIA_TELECOM"){
				tr069password_encode = getdata.tr069password_encode;
				$("#acs_password").val(tr069password_encode);
			}
			else{
				$("#acs_password").val(fhdecrypt(getdata.Password));
			}
			$("#acs_connetionRequest_path").val(getdata.X_FH_ConnectionRequestPath);
			$("#acs_connetionRequest_port").val(getdata.X_FH_ConnectionRequestPort);
			$("#acs_connetionRequest_username").val(getdata.ConnectionRequestUsername);
			if(operator_name == "BZ_INTELBRAS"){
				$("#acs_connetionRequest_password").val(tr069password_encode);
			}
            		else if(operator_name == "ALGERIA_TELECOM"){
				tr069conReqPwd_encode = getdata.tr069conReqPwd_encode;
				$("#acs_connetionRequest_password").val(getdata.tr069conReqPwd_encode);
			}
			else{
				$("#acs_connetionRequest_password").val(fhdecrypt(getdata.ConnectionRequestPassword));
			}
			$("#acs_inform_interval").val(getdata.PeriodicInformInterval);
		}
		if(operator_name == "BZ_INTELBRAS" )
		{
			if(getdata.acs_auth_enable == "1")
		    {
				$("#acs_auth_enable").prop('checked',true);
			}
		    else if(getdata.acs_auth_enable == "0")
		    {
				$("#acs_auth_disable").prop('checked',true);
			}
		}
		if(getdata.PeriodicInformEnable == "1"){
			$("[name='acs_infrom_enable'][value='1']").prop('checked','true');
		}else if(getdata.PeriodicInformEnable == "0"){
			$("[name='acs_infrom_enable'][value='0']").prop('checked','true');
		}
		if (getdata.CertificateEnable == "1")
		{
			$("input[name='certificate_enable'][value='1']").attr('checked', 'checked');
		}
		else
		{
			$("input[name='certificate_enable'][value='0']").attr('checked', 'checked');
		}
		
	}	
	//巴西Claro的普通用户在该页面无法进行任何操作
	if(login_user =="0" && operator_name == "BZ_CLARO")
	{
		$(".input_button").attr("disabled", true);
		$(".board_width").attr("disabled", true);
		$("[type='radio']").attr("disabled", true);
	}
    
    if( operator_name == "EG_TELECOM")
    {
    	$(".input_text").attr("disabled", true);
    	$("[type='radio']").attr("disabled", true);
        $("#acs_username").attr("disabled", true);
        $("#acs_password").attr("disabled", true);
		$(".input_button").attr("disabled", true);
    }
    
    //厄瓜多尔的管理员用户在该页面无法进行任何操作
    if(login_user =="1" && operator_name == "ECU_CNT")
    {
    	$(".input_button").attr("disabled", true);
    	$(".board_width").attr("disabled", true);
        $(".input_text").attr("disabled",true);
    	$("[type='radio']").attr("disabled", true);
        $("#acs_username").attr("disabled", true);
        $("#acs_username").attr("style","");
    }
    if( operator_name == "CHL_MP")
    {
        $(".main_header_hint").html("ACS_prompt_mp".i18n());
        $(".input_text valid").attr("disabled", true);
        $("#div_other_button").hide();
        $("#div_tr069_button").hide();
    	$("#acs_password").attr("disabled", true);
        $("#acs_connetionRequest_path").attr("disabled", true);
        $("#acs_connetionRequest_port").attr("disabled", true);
        $("#acs_connetionRequest_username").attr("disabled", true);
        $("#acs_connetionRequest_password").attr("disabled", true);
        $("#acs_inform_interval").attr("disabled", true);
    	$(".board_width").attr("disabled", true);
        $(".input_button").attr("disabled", true);
    	$("[type='radio']").attr("disabled", true);
		$("#acs_url").attr("disabled", true);
		$("#acs_username").attr("disabled", true);
		
    }

    if(operator_name == "TH_3BB")
    {
    	$("#acs_url,#acs_username,#acs_connetionRequest_path,#acs_connetionRequest_username,,#acs_connetionRequest_port,#acs_inform_interval").addClass("fh-text-security");
    	$("#acs_url,#acs_username,#acs_connetionRequest_path,#acs_connetionRequest_username,,#acs_connetionRequest_port,#acs_inform_interval").bind("cut copy ",function(e){
    		e.preventDefault()});
		$("#acs_url,#acs_username,#acs_password,#acs_connetionRequest_path,#acs_connetionRequest_username,#acs_connetionRequest_password,#acs_connetionRequest_port,#acs_inform_interval").prop('type','password')

    	setInterval(function(){
		    if($("#acs_url").length > 0){
				if(!$("#acs_url").hasClass("fh-text-security")){
					$("#acs_url").addClass("fh-text-security");
				}
				if($("#acs_url").attr('type') != 'password'){
					$('#acs_url').prop('type','password')
				}
			}else{
				window.location.reload();
			}
			
			if($("#acs_username").length > 0){
				if(!$("#acs_username").hasClass("fh-text-security")){
					$("#acs_username").addClass("fh-text-security");
				}
				if($("#acs_username").attr('type') != 'password'){
					$('#acs_username').prop('type','password')
				}
			}else{
				window.location.reload();
			}

			if($("#acs_password").length > 0){
				if($("#acs_password").attr('type') != 'password'){
					$('#acs_password').prop('type','password')
				}
			}
			
			if($("#acs_connetionRequest_path").length > 0){
				if(!$("#acs_connetionRequest_path").hasClass("fh-text-security")){
					$("#acs_connetionRequest_path").addClass("fh-text-security");
				}
				if($("#acs_connetionRequest_path").attr('type') != 'password'){
					$('#acs_connetionRequest_path').prop('type','password')
				}
			}else{
				window.location.reload();
			}
			if($("#acs_connetionRequest_username").length > 0){
				if(!$("#acs_connetionRequest_username").hasClass("fh-text-security")){
					$("#acs_connetionRequest_username").addClass("fh-text-security");
				}
				if($("#acs_connetionRequest_username").attr('type') != 'password'){
					$('#acs_connetionRequest_username').prop('type','password')
				}
			}else{
				window.location.reload();
			}

			if($("#acs_connetionRequest_password").length > 0){
				if($("#acs_connetionRequest_password").attr('type') != 'password'){
					$('#acs_connetionRequest_password').prop('type','password')
				}
			}
			
			if($("#acs_connetionRequest_port").length > 0){
				if(!$("#acs_connetionRequest_port").hasClass("fh-text-security")){
					$("#acs_connetionRequest_port").addClass("fh-text-security");
				}
				if($("#acs_connetionRequest_port").attr('type') != 'password'){
					$('#acs_connetionRequest_port').prop('type','password')
				}
			}else{
				window.location.reload();
			}
			
			if($("#acs_inform_interval").length > 0){
				if(!$("#acs_inform_interval").hasClass("fh-text-security")){
					$("#acs_inform_interval").addClass("fh-text-security");
				}
				if($("#acs_inform_interval").attr('type') != 'password'){
					$('#acs_inform_interval').prop('type','password')
				}
			}else{
				window.location.reload();
			}
		}, 10);
    }
}

function initPage_stun(getdata)
{
	if (getdata != null )
	{
		var acs_stun_info = getdata;
		if(acs_stun_info.STUNEnable == "0"){
			$("#stun_cfg").css("display", "none");
			$("input[name='acs_stun_enable']:last").attr('checked', 'checked');
		}else if(acs_stun_info.STUNEnable == "1"){
			$("#stun_cfg").css("display", "");
			$("input[name='acs_stun_enable']:first").attr('checked', 'checked');
		}

		$("#acs_stun_url").val(getdata.STUNServerAddress);
		$("#acs_stun_service_port").val(getdata.STUNServerPort);
		$("#acs_stun_username").val(getdata.STUNUsername);
		$("#acs_stun_password").val(fhdecrypt(getdata.STUNPassword));
		$("#acs_serviceID").val(getdata.X_FH_service_id);
	}
}

function initValidate()
{	
	var url_flag = false;
	var ipv6_domain_flag = false;
	if(operator_name == "BZ_INTELBRAS" || operator_name == "MEX_MEGA")
	{
		url_flag = false;
		ipv6_domain_flag = true;
	}
	else
	{
		 url_flag = true;
		 ipv6_domain_flag = false;
	}
	$("#Acs_form").validate({
		debug: true,
		rules: {
            "acs_url": {required: true,url: url_flag, ipv6_url: ipv6_domain_flag, rangelength:[1,255]},
            "acs_username": {required: required_flag, maxlength:255},
            "acs_password": {required: required_flag, nocn: true, maxlength:255},
            "acs_connetionRequest_path": {required: true,rangelength:[1,255]},
            "acs_connetionRequest_port": {required: true,range_int:[1,65535]},
			"acs_connetionRequest_username": {required: true,rangelength:[1,64]},
			"acs_connetionRequest_password": {required: true, nocn: true,rangelength:[1,64]},
			"acs_inform_interval": {required: true , range_int:[1,2147483647]},
			"acs_stun_url": {required: true,url:true,rangelength:[1,255]},
			"acs_stun_service_port": {required: true, range_int:[1,65535]},
			"acs_stun_password": {nocn: true, maxlength:255},
			"acs_stun_username": {nocn: true, maxlength:255}
			
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}

function save_enable_apply()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
	postdata.EnableCWMP = $("input[name='acs_enable']:checked").val();
	
	XHR.post("set_acs_info", postdata, initPage);
}



 function save_apply()
{
	
	if( ! $("#Acs_form").valid() )
	{
		if (gNewUiFlag)
            	myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
	     alert("illegal_value_alert".i18n());
	    return;
	}
	show_shadow();
	var postdata = new Object();
	postdata.action = "config";
	if(operator_name == "TH_3BB")
	{
		postdata.URL = fhencrypt($("#acs_url").val());
		postdata.TH_3BBUsername = fhencrypt($("#acs_username").val());
		postdata.Password = fhencrypt($("#acs_password").val());
		postdata.X_FH_ConnectionRequestPath = fhencrypt($("#acs_connetionRequest_path").val());
		postdata.X_FH_ConnectionRequestPort = fhencrypt($("#acs_connetionRequest_port").val());
		postdata.ConnectionRequestUsername = fhencrypt($("#acs_connetionRequest_username").val());
		postdata.ConnectionRequestPassword = fhencrypt($("#acs_connetionRequest_password").val());
		postdata.PeriodicInformInterval = fhencrypt($("#acs_inform_interval").val());
	}else{
		postdata.URL = $("#acs_url").val();
		postdata.Username = $("#acs_username").val();
		if(operator_name == "BZ_INTELBRAS"){
			if($("#acs_password").val() == tr069password_encode){
				postdata.Password = fhencrypt(tr069password_encode);
			}else{
				postdata.Password = fhencrypt($("#acs_password").val());
			}
		}else{
			postdata.Password = fhencrypt($("#acs_password").val());
		}
		
		postdata.X_FH_ConnectionRequestPath = $("#acs_connetionRequest_path").val();
		postdata.X_FH_ConnectionRequestPort = $("#acs_connetionRequest_port").val();
		postdata.ConnectionRequestUsername = $("#acs_connetionRequest_username").val();
		if(operator_name == "BZ_INTELBRAS"){
			if($("#acs_connetionRequest_password").val() == tr069password_encode){
				postdata.ConnectionRequestPassword = fhencrypt(tr069password_encode);
			}else{
				postdata.ConnectionRequestPassword = fhencrypt($("#acs_connetionRequest_password").val());
			}
		}else{
			postdata.ConnectionRequestPassword = fhencrypt($("#acs_connetionRequest_password").val());
		}
		postdata.PeriodicInformInterval = $("#acs_inform_interval").val();
	}
	
	if(operator_name == "BZ_INTELBRAS")
	{
		postdata.acs_auth_enable = $("input[name='acs_auth_enable']:checked").val();
	}
	postdata.PeriodicInformEnable = $("input[name='acs_infrom_enable']:checked").val();
	postdata.CertificateEnable= $("input[name='certificate_enable']:checked").val();
	
	XHR.post("set_acs_info", postdata, initPage);
	sleep(1000);
	if(operator_name == "PH_PLDT" || operator_name == "TH_AIS" || operator_name == "FTTR_SUB_COMMON" || operator_name == "ES_DIGI" || operator_name == "AP_COMMON")
	{
		var postdata1 = new Object();
		postdata1.STUNEnable = $("input[name='acs_stun_enable']:checked").val();
		postdata1.STUNServerAddress = $("#acs_stun_url").val();
		postdata1.STUNServerPort = $("#acs_stun_service_port").val();
		postdata1.STUNUsername = $("#acs_stun_username").val();
		postdata1.STUNPassword = fhencrypt($("#acs_stun_password").val());
		postdata1.X_FH_service_id = $("#acs_serviceID").val();
		XHR.post("set_acs_stun_info", postdata1, initPage_stun);
	}
	
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
			$("#" + id).val(tr069password_encode);
	}
}