//javascript for login_inter.html
var sessionidstr = "";
var operator_name = "";
var admin_enable = "";
var username = "";
var login_error_hint;
document.onkeydown=function mykeyDown(e){   
	e = e||event;		
	if(e.keyCode == 13) 
	{
		document.getElementById('login_btn').click();
		
	}    
	return;
}

$(document).ready(function(){
	XHR.get("get_operator", null, get_operator);

});




function get_operator(getdata)
{
	
	if ( getdata.operator_name != undefined )
	{
		operator_name = getdata.operator_name;
	}

	if(operator_name == "MAGYAR_4IG"){
		$("#digi_img").hide();
	}
}


function onlogin(a) 
	{
		if (a == 1)//login
		{	
			if($("#user_name").val().length <= 0) {
				alert("no_username_alert".i18n());
				$("#user_name").focus();
				return false;
			}
			if($("#loginpp").val().length <= 0) {
				alert("no_password_alert".i18n());
				$("#loginpp").focus();
				return false;
			}
			doLoginRequest();
		}
		else if (a == 2)//cancel
		{
			user_name.value = "";
			loginpp.value = "";
			document.getElementById("login_error_hint").style.display = "none";	
		}
		else if (a ==3)//regist
		{		
			window.location.href = "register.html";			
			document.getElementById("login_error_hint").style.display = "none";
		}			
	}

function doLoginRequest()
{
	var postdata = new Object();
	$("#btn_login_step_1").attr("disabled",true);
	
	postdata.username = $("#user_name").val();
	postdata.loginpd = fhencrypt($("#loginpp").val());
	postdata.port = 0;
	postdata.sessionid = sessionidstr;
	XHR.post("do_login", postdata, parseLoginData);	

}

function parseLoginData(data)
{
	if (data)
	{
		var login_error_hint = document.getElementById("login_error_hint");
		if ( data.login_result == 0 )
		{
			$("#btn_login_step_1").attr("disabled",false);
			if(operator_name == "OMN_OMANTEL" && data.is_redirect == 1){
				window.location.href="user_modifypw_omn_omantel.html";
			}else if((operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") && data.is_redirect == 1){
				window.location.href="user_modifypw_omn_omantel.html";
			}else{
                if(operator_name == "MAGYAR_4IG"){
                    window.location.href="main_magyar_4ig.html"; 
                }else{
                 window.location.href="main_romania.html"; 
                }
				
			}
			return;
		}
		else if ( data.login_result == 1 )
		{
			
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "haveuserlogin".i18n();
		}
		else if ( data.login_result == 2 )
		{
			
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "3timeError".i18n();
			if(operator_name == "TH_TRUE"|| operator_name == "TH_SME_TRUE")
			{
				login_error_hint.innerHTML = "3timeError_30".i18n();
			}
		}
		else if ( data.login_result == 3 )
		{
			//document.getElementById("login_error_hint").style.display = "none";
			login_error_hint.innerHTML = "account_disabled_error".i18n();
		}
		else if ( data.login_result == 4 )
		{
			
			//document.getElementById("login_error_hint").style.display = "";
			login_error_hint.innerHTML = "name_pwd_error".i18n();

		}
		else if (data.login_result == 9) {//User account Unavailable
			login_error_hint.innerHTML = "user_account_disabled_error".i18n();
		}
		else if ( data.login_result == 100 )
		{
			login_error_hint.innerHTML = "login_fail".i18n();

		}
		else
		{
			login_error_hint.innerHTML = "unexpected_error".i18n();
		}
	}
	else
	{
		alert("unexpected_error".i18n());
		document.getElementById("login_error_hint").style.display = "none";
	}
	$("#btn_login_step_1").attr("disabled",false);
	$("#loginpp").val("");
}
