//javascript for login_inter.html
// var isEmpty = true;

var sessionidstr = "";
var operators_name = "";
var login_user ;
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
		operators_name = getdata.operator_name;
	}
	if(operators_name == "BZ_TIM"){
		sessionStorage.setItem("operator_name", "BZ_TIM");
	}
}

function onlogin() 
{	
	if($("#login").val().length <= 0) {
		alert("no_username_alert".i18n());
		return false;
	}
	if($("#senha").val().length <= 0) {
		alert("no_password_alert".i18n());
		return false;
	}
	doLoginRequest();		
}

function doLoginRequest()
{
	var postdata = new Object();
	$("#login_btn").prop("disabled",true);
	
	postdata.username = $("#login").val();
	postdata.loginpd = fhencrypt($("#senha").val());
	postdata.port = 0;
	XHR.post("do_login", postdata, parseLoginData);	
	
}

function get_login_user(data)
{
    login_user = data.login_user;
}

function parseLoginData(data)
{
	if (data)
	{
		if ( data.login_result == 0 )//校验成功
		{
            XHR.get("get_login_user", null, get_login_user);
			if(login_user == "1"){
				var postdata = new Object();
				postdata.sessionid = sessionidstr;
				postdata.username = "common";
				XHR.post("do_logout", postdata, function(data){
					window.parent.location = "../index.html";
				});
			}else{
				$("#login_btn").prop("disabled",false);
				window.location.href="page_02.html";
			    return;
			}
		}
		else if ( data.login_result == 1 )
		{
			//alert("当前已有用户在别处登录，请稍后登录");
			alert("haveuserlogin".i18n());
		}
		else if ( data.login_result == 2 )
		{
			//alert("您的连续错误登陆次数已经达到3次，请30分钟后再试");
			alert("3timeError".i18n());
		}
		else if ( data.login_result == 3 )
		{
			//alert("电信维护帐号已被禁用，请另选帐号登录");
			alert("account_disabled_error".i18n());
		}
		else if ( data.login_result == 4 )
		{
			//alert("用户名或密码错误，请重试");
			alert("name_pwd_error".i18n());

		}
		else if (data.login_result == 9) {//User account Unavailable
			login_error_hint.innerHTML = "user_account_disabled_error".i18n();
		}
		else if ( data.login_result == 100 )
		{
			//alert("wan侧登陆");
			alert("login_fail".i18n());

		}
		else
		{
			//alert("未知错误");
			alert("unexpected_error".i18n());
		}
	}
	else
	{
		alert("unexpected_error".i18n());
	}
	$("#login_btn").prop("disabled",false);
}
