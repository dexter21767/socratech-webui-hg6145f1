var zkzcode;//3BB验证码
$(document).ready(function(){
	XHR.get("get_operator", null, get_operator);
	initCustom();
});
//刷新验证码按钮
function refresh()
{
	createCode();
	$("#checkCode").html(zkzcode);
}

function get_operator(getdata){
    if ( getdata.operator_name != undefined )
    {
        operator_name = getdata.operator_name;
    }
}

function createCode() {
	
	zkzcode = "";
	var zkzcodeLength = 5; //验证码的长度  
	var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm',
		'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'); //所有候选组成验证码的字符，当然也可以用中文的 
	
	for (var i = 0; i < zkzcodeLength; i++) {
		var charIndex = Math.floor(Math.random() * 56);
		zkzcode += selectChar[charIndex];
	}
	
	return zkzcode;

}

function initCustom()
{
		createCode();
		$("#checkCode").show();
		$("#checkCode").html(zkzcode);
}

function save_enable_apply()
{
	if($("#jiaoyanma").val() != zkzcode) {
		alert("Validate Code Error!");
		return false;	
	}
	var postdata = new Object();
	postdata.REMOTEACCEnable = "1";
	XHR.post("set_remote_control_info", postdata, initPage);
}
function save_disable_apply()
{
	if($("#jiaoyanma").val() != zkzcode) {
		alert("Validate Code Error!");
		return false;	
	}
	var postdata = new Object();
	postdata.REMOTEACCEnable = "0";
	XHR.post("set_remote_control_info", postdata, initPage);
}


function initPage(getdata)
{
	if (getdata != null && getdata.remotecontrol_enable)
	{
		var set_complete = document.getElementById("set_complete");
		g_data = getdata.remotecontrol_enable;
		if(getdata.remotecontrol_enable.REMOTEACCEnable == "1")
		{
			set_complete.innerHTML = "Enable Complete".i18n();	
		}else
		{
			set_complete.innerHTML = "Disable Complete".i18n();
		}
	}
}