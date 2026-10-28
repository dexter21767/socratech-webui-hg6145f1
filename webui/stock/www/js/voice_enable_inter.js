var sessionidstr = "";
var voicedata;
var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_base", initPage);
	}
	else
	{
		XHR.get("get_voice_enable_info", null, initPage);
	}
});


function initPage(getdata)
{
	//判断当前用户为普通用户还是管理员用户
	var login_user = gLoginUser;
	if(operator_name == "TH_TRUE" || operator_name == "TH_SME_TRUE"){
		if(login_user == "0"){
		//	alert("当前为泰国TREU的普通用户");
			$("input").attr("disabled", true);
			$("select").attr("disabled", true);
			
		}
	}
	//var server_type_select_inter= "<option value='0'>IMS</option><option value='1'>Soft Switch</option><option value='2'>H.248</option>";
	var server_type_select_inter= "<option value='1'>SIP</option><option value='2'>H.248</option>";
	var server_type_select_thai_true= "<option value='1'>SIP</option>";

	if(!gNewUiFlag){
	$("#ServerType_select").html(server_type_select_inter);
	
	$("#ServerType_select").html(server_type_select_thai_true);
	}
	if ( getdata )
	{
		voicedata = getdata;
		setsessionidstr();
		setServerType(getdata);
		setEnable(getdata);
	}
	if(voicedata.voice_port_num == 1){
		$("#port_2").hide();
		$("#port_3").hide();
		$("#port_4").hide();
	}else if (voicedata.voice_port_num == 2) {
	    $("#port_3").hide();
	    $("#port_4").hide();
	}
	else if (voicedata.voice_port_num == 4) {
	    $("#port_3").show();
	    $("#port_4").show();
	}
}

function setServerType(getdata){

	if ( getdata )
	{
		voicedata = getdata;
		setsessionidstr();
		
		setTimeout(function(){$("#ServerType_select").attr("disabled", false);},15000);
		$("#ServerType_select").val(getdata.ServerType);
	}
}

function setsessionidstr(){
	if ( voicedata.sessionid != undefined )
	{
		sessionidstr = voicedata.sessionid;
	}
	else
	{
		XHR.get("get_login_user", null, function(getdata){
			if ( getdata.sessionid != undefined )
			{
				sessionidstr = getdata.sessionid;
			}
		});
	}
}

function setEnable(getdata){

	if ( getdata )
	{
		voicedata = getdata;
		setsessionidstr();

		if (getdata.Enable1 == "disabled" || getdata.Enable1 == "Disabled"){
			$("input[name='voip_enable_1']:last").attr('checked', 'checked');
		}else if(getdata.Enable1 == "enabled" || getdata.Enable1 == "Enabled"){
			$("input[name='voip_enable_1']:first").attr('checked', 'checked');
		}

		if (getdata.Enable2 == "disabled" || getdata.Enable2 == "Disabled"){
			$("input[name='voip_enable_2']:last").attr('checked', 'checked');
		}else if(getdata.Enable2 == "enabled" || getdata.Enable2 == "Enabled"){
			$("input[name='voip_enable_2']:first").attr('checked', 'checked');
		}
		if (getdata.Enable3 == "disabled" || getdata.Enable3 == "Disabled"){
			$("input[name='voip_enable_3']:last").attr('checked', 'checked');
		}else if(getdata.Enable3 == "enabled" || getdata.Enable3 == "Enabled"){
			$("input[name='voip_enable_3']:first").attr('checked', 'checked');
		}

		if (getdata.Enable4 == "disabled" || getdata.Enable4 == "Disabled"){
			$("input[name='voip_enable_4']:last").attr('checked', 'checked');
		}else if(getdata.Enable4 == "enabled" || getdata.Enable4 == "Enabled"){
			$("input[name='voip_enable_4']:first").attr('checked', 'checked');
		}
	}
}

function cancelServerType(){
	setServerType(voicedata);
}

function cancelEnable(){
	setEnable(voicedata);
}

function saveServerType()
{
	show_shadow();
	var postdata = new Object();
	postdata.action = "typechange";
	postdata.ServerType = $("#ServerType_select").val();
	postdata.sessionid = sessionidstr;
	if(operator_name == "IDN_TELKOM")
		XHR.post("set_voice_base_info_idn", postdata, setServerType);
	else
		XHR.post("set_voice_base_info", postdata, setServerType);
}

function saveEnable(){
	show_shadow();
	var postdata = new Object();
	postdata.action = "enablechange";
	postdata.Enable1 = $("input[name='voip_enable_1']:checked").val();
	postdata.Enable2 = $("input[name='voip_enable_2']:checked").val();
	postdata.Enable3 = $("input[name='voip_enable_3']:checked").val();
	postdata.Enable4 = $("input[name='voip_enable_4']:checked").val();
	postdata.sessionid = sessionidstr;
	if(operator_name == "IDN_TELKOM")
		XHR.post("set_voice_base_info_idn", postdata, setServerType);
	else
		XHR.post("set_voice_base_info", postdata, setEnable);
}