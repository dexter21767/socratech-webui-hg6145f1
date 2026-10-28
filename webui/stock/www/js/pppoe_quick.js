var sessionidstr = "";
var operators_name = "";
var verifiCode = "";
var super_userName = "";
var admin_enable = "";
var zkzcode;//3BB验证码
var username = "";
var operator_name = "";
var login_error_hint;
document.onkeydown=function mykeyDown(e){   
	e = e||event;		
	if(e.keyCode == 13) 
	{
		document.getElementById('submit').click();
		
	}    
	return;
}

$(document).ready(function(){
	
	/*if ( gDebug )
	{
		getDataByAjax("../fake/factorymode", showFactoryTip);
	}*/
	
	XHR.get("get_operator", null, get_operator);
	initCustom();
});


function get_operator(getdata){
    if ( getdata.operator_name != undefined )
    {
        operator_name = getdata.operator_name;
    }
}


//初始化页面
function initpage(data)
{
	alert(JSON.stringify(data));
}

//刷新验证码按钮
function refresh()
{
	createCode();
	$("#checkCode").html(zkzcode);
}


function initCustom()
{
	operators_name = operator_name;
	 if( operators_name == 'TH_3BB')
	{
		createCode();
		$("#checkCode").html(zkzcode);
	}
}

function onlogin(a) 
	{
		if (a == 1)//login
		{	
			if($("#User").val().length <= 0) {
				alert("no_username_alert".i18n());
				return false;
			}
			if($("#Passwd").val().length <= 0) {
				alert("no_password_alert".i18n());
				return false;
			}
			if($("#jiaoyanma").val() != zkzcode) {
				//alert("11");
				alert("validate_code_alert".i18n());
				return false;
			}
			doLoginRequest();
		}		
	}

function doLoginRequest()
{
	var postdata = new Object();
	//$("#login_btn").attr("disabled",true);
	postdata.Username = $("#User").val();
	postdata.Password = fhencrypt($("#Passwd").val()); 
	//alert(JSON.stringify(postdata));
	XHR.post("set_pppoe_quick", postdata, parseLoginData);	

	
}

function parseLoginData(data)
{
	if (data)
	{
		var login_error_hint = document.getElementById("login_error_hint");
		if ( data.info == 0 )//校验成功
		{
			login_error_hint.innerHTML = "Successful";
			
		}else{
			login_error_hint.innerHTML = "Fail";
		}
	}
	else
	{
		alert("unexpected_error".i18n());
		document.getElementById("login_error_hint").style.display = "none";
	}
	//$("#login_btn").attr("disabled",false);
	$("#User").val("");
	$("#Passwd").val("");
	$("#jiaoyanma").val("");
}
function createCode() {	
	zkzcode = "";
	var zkzcodeLength = 5; //验证码的长度  
	var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm',
		'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'); //所有候选组成验证码的字符
	
	for (var i = 0; i < zkzcodeLength; i++) {
		var charIndex = Math.floor(Math.random() * 56);
		zkzcode += selectChar[charIndex];
	}
	
	return zkzcode;
}