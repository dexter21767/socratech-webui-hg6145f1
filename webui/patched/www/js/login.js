//javascript for login.html
// var isEmpty = true;
var sessionidstr = "";

var loid_result;
var loid_status;
var area_code;
document.onkeydown=function mykeyDown(e){   
	e = e||event;		
	if(e.keyCode == 13) 
	{
		document.getElementById('login_btn').click();
	}    
	return;
}

$(document).ready(function(){
	
	if ( gDebug ) //检查是否为出厂模式
	{
		getDataByAjax("../fake/factorymode", showFactoryTip);
	}
	else
	{
		XHR.get("get_factory_mode", null, showFactoryTip);
	}
});

function showFactoryTip(getdata)
{
	if ( getdata )
	{
		sessionidstr = getdata.sessionid;
		loid_result = getdata.loid_result;
		loid_status = getdata.loid_status;
		area_code = getdata.area_code;
		if(getdata.factory_mode == '1')
			document.getElementById("tip").style.display = "";
		else
			document.getElementById("tip").style.display = "none";
		
		/*if (( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ) 
		&& ( area_code != "Guangdong" ) && ( area_code != "Chongqing" ) && ( area_code != "Fujian" ))
		{
			document.getElementById("Gansu_register").style.display = "none";			    
		}	
		else
		{
			document.getElementById("Gansu_register").style.display = "";	
		}*/
		
		if (( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ) 
		&& ( area_code == "Jiangsu" || area_code == "Zhejiang" || area_code == "Jiangxi" || area_code == "Hainan"))
		{
			//document.getElementById("Gansu_register").style.display = "none";	
			$("#register_btn").attr("disabled", true);		    
		}	
		else
		{
			//document.getElementById("Gansu_register").style.display = "";
			$("#register_btn").attr("disabled", false);				
		}						
		
		if ( area_code == "Hainan" )
		{
			document.getElementById("hainan_route").style.display = "";
			
			if (getdata.loid_RouteStatus == '1')
			{		
				$("#hainan_route_button").attr("disabled", true);
			}
			else
			{			
				$("#hainan_route_button").attr("disabled", false);
			}			    
		}	
		else
		{
			document.getElementById("hainan_route").style.display = "none";	
		}		
		
	}
}

function onlogin(a) 
	{
		if (a == 1)//login
		{	
			if($("#user_name").val().length <= 0) {
				alert('用户名不能为空，请重新输入！');
				return false;
			}
			if($("#loginpp").val().length <= 0) {
				alert('密码不能为空，请重新输入！');
				return false;
			}
			
			doLoginRequest();
		}
		else if (a == 2)//cancel
		{
			loginpp.value = "";
			document.getElementById("login_error_hint").style.display = "none";	
		}
		else if (a ==3)//regist
		{
			/*if (( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ))
			{
				if(confirm("设备已在ITMS上成功注册，是否继续注册?"))
				{
					window.location.href = "register.html";
				}
				else
				{
					return;
				}		    
			}*/
			if ( area_code == "Sichuan" )
			{
				window.location.href = "register_Sichuan.html";
			}	
			else if ( area_code == "Guangdong" )
			{
				if (( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ))
				{
					window.location.href = "register_Guangdonged.html";		    
				}	
				else
				{
					window.location.href = "register_Guangdong.html";
				}						
			}	
			else if ( area_code == "Fujian" )
			{
				if (( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ))
				{
					window.location.href = "register_Fujianed.html";		    
				}	
				else
				{
					window.location.href = "register_Fujian.html";
				}						
			}			
			else if ( area_code == "Chongqing" )
			{
				if (( loid_status == 0 ||  loid_status == 99 ) && ( loid_result == 1 ))
				{
					window.location.href = "register_Chongqinged.html";		    
				}	
				else
				{
					if (confirm("注册前请拔掉光纤！注册操作如下：1.拔掉光纤 2.填写LOID 3.点击“注册”按钮 4.插上光纤"))
					{
						window.location.href = "register_Chongqing.html";
					}						
				}						
			}		
			/*else if ( area_code == "Hainan" )
			{
				window.location.href = "register_Hainan.html";																		
			}	*/			
			else
			{
				window.location.href = "register.html";
			}
			
			document.getElementById("login_error_hint").style.display = "none";
		}
		else if (a == 5)
		{
			window.location.href = "route_Hainan.html";		    								
		}			
}

function doLoginRequest()
{
	var postdata = new Object();
	$("#login_btn").attr("disabled",true);
	
	postdata.username = $("#user_name").val();
	postdata.loginpd = fhencrypt($("#loginpp").val());
	postdata.port = 0;

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/logindata", parseLoginData);
	}
	else
	{
		XHR.get("get_operator", null, function(data){
			if ( data )
			{
				sessionidstr = data.sessionid;
			}
		});
	        postdata.sessionid = sessionidstr;
	        XHR.post("do_login", postdata, parseLoginData);	

	}
}

function parseLoginData(data)
{
	if (data)
	{
		if ( data.login_result == 0 )//校验成功
		{
			$("#login_btn").attr("disabled",false);
			window.location.href="main.html";
			return;
		}
		else if ( data.login_result == 1 )
		{
			alert("当前已有用户在别处登录，请稍后登录");
			document.getElementById("login_error_hint").innerHTML = _("logoutError");
		}
		else if ( data.login_result == 2 )
		{
			alert("您的连续错误登陆次数已经达到3次，请1分钟后再试");
			document.getElementById("login_error_hint").innerHTML = _("3timeError");
		}
		else if ( data.login_result == 3 )
		{
			alert("电信维护帐号已被禁用，请另选帐号登录");
			document.getElementById("login_error_hint").innerHTML = _("adminUnavailable");
		}
		else if ( data.login_result == 4 )
		{
			//alert("用户名或密码错误，请重试");
			document.getElementById("login_error_hint").innerHTML = _("namePwdError");
		}
		else if ( data.login_result == 5 )
		{
			//alert("已有用户登陆，请稍后重试!");
			document.getElementById("login_error_hint").innerHTML = _("haveuserLogin");
		}
		else if ( data.login_result == 6 )
		{
			//alert("访问的IP没有权限登录!");
			document.getElementById("login_error_hint").innerHTML = _("ipNotAllowError");
		}
		else if (data.login_result == 9) {//User account Unavailable
			login_error_hint.innerHTML = "user_account_disabled_error".i18n();
		}
		else
		{
//			alert("未知错误");
			document.getElementById("login_error_hint").innerHTML = _("serverError");
		}
	}
	else
	{
//		alert("未知错误");
		document.getElementById("login_error_hint").innerHTML = _("serverError");
	}
	$("#login_btn").attr("disabled",false);
	$("#loginpp").val("");
}
