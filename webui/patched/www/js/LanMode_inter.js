var g_data;
var operator_name = gOperatorName;
var lan1_bound = 0;//not bound
var lan2_bound = 0;
var lan3_bound = 0;
var lan4_bound = 0;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_base", initPage);
	}
	else
	{
		XHR.get("get_lanmode_info", null, initPage);
		XHR.get("get_allwan_info", null, disableLAN);
		if(operator_name == "BZ_INTELBRAS")
		{
			$("#lan_port_mode_Prompt").html("lan_port_mode_Prompt_ib".i18n());
			$("#lan_port_mode_enable_div").show();
		}
	}

	if(operator_name == "BZ_INTELBRAS"){
         $("input[name='lan_port_mode_enable']").bind("click", function(){
			var lan_port_mode_enable  = $("input[name='lan_port_mode_enable']:checked").val();
            if (lan_port_mode_enable == 0) {
                $("#lan1_checkbox").attr("disabled", true);
				$("#lan2_checkbox").attr("disabled", true);
				$("#lan3_checkbox").attr("disabled", true);
				$("#lan4_checkbox").attr("disabled", true);
			} else{
				$("#lan1_checkbox").attr("disabled", false);
				$("#lan2_checkbox").attr("disabled", false);
				$("#lan3_checkbox").attr("disabled", false);
				$("#lan4_checkbox").attr("disabled", false);
				unckecked_lan_port();
			}
        });
	}
	if(operator_name == "BZ_INTELBRAS" && $("input[name='lan_port_mode_enable']:checked").val() == "1"){
	 	unckecked_lan_port();
       
    }
});


function initPage(getdata)
{
	showOrHideLoadingWindowFromIframe("hide");
	if (getdata != null && getdata.lan_mode)
	{
		g_data = getdata.lan_mode;
		displayHTML();
	}
}

function displayHTML()
{
	if(operator_name == "BZ_INTELBRAS")
	{
		if (g_data.lan_port_mode_enable == "1")
	    {
			$("#lan_port_mode_enable").prop('checked',true);
			$("#lan1_checkbox").attr("disabled", false);
			$("#lan2_checkbox").attr("disabled", false);
			$("#lan3_checkbox").attr("disabled", false);
			$("#lan4_checkbox").attr("disabled", false);
		}
		else
		{
			$("#lan_port_mode_disable").prop('checked',true);
			$("#lan1_checkbox").attr("disabled", true);
			$("#lan2_checkbox").attr("disabled", true);
			$("#lan3_checkbox").attr("disabled", true);
			$("#lan4_checkbox").attr("disabled", true);
		}
	}
	setCheckbox("lan1_checkbox", g_data.LanMode_1);
	setCheckbox("lan2_checkbox", g_data.LanMode_2);
	setCheckbox("lan3_checkbox", g_data.LanMode_3);
	setCheckbox("lan4_checkbox", g_data.LanMode_4);
}

function cancelApply()
{
	show_shadow();
	displayHTML();
}

function saveApply()
{

	var postdata = new Object();
	if(operator_name == "BZ_INTELBRAS")
	{
		postdata.lan_port_mode_enable = $("input[name='lan_port_mode_enable']:checked").val();
		if( $("input[name='lan_port_mode_enable']:checked").val() == "1")
		{
			postdata.LanMode_1 = getCheckbox("lan1_checkbox");
			postdata.LanMode_2 = getCheckbox("lan2_checkbox");
			postdata.LanMode_3 = getCheckbox("lan3_checkbox");
			postdata.LanMode_4 = getCheckbox("lan4_checkbox");
		}
	}
	else
	{
		postdata.LanMode_1 = getCheckbox("lan1_checkbox");
		postdata.LanMode_2 = getCheckbox("lan2_checkbox");
		postdata.LanMode_3 = getCheckbox("lan3_checkbox");
		postdata.LanMode_4 = getCheckbox("lan4_checkbox");
	}
	

		//alert("takes_effect_after_restart".i18n());
	XHR.post("set_lanmode_info", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}



function unckecked_lan_port()
{
	$("#lan1_checkbox").bind("click", function() {
        if (lan1_bound == 1 && g_data.LanMode_1 == 1 && getCheckbox("lan1_checkbox") == 0) {
            alert("unckecked_lan_port_alert".i18n());
			setCheckbox("lan1_checkbox", 1);
		} 
    });

	$("#lan2_checkbox").bind("click", function() {
        if (lan2_bound == 1 && g_data.LanMode_2 == 1 && getCheckbox("lan2_checkbox") == 0) {
            alert("unckecked_lan_port_alert".i18n());
			setCheckbox("lan2_checkbox", 1);
		} 
    });

	$("#lan3_checkbox").bind("click", function() {
        if (lan3_bound == 1 && g_data.LanMode_3 == 1 && getCheckbox("lan3_checkbox") == 0) {
             alert("unckecked_lan_port_alert".i18n());
			setCheckbox("lan3_checkbox", 1);
		} 
    });

	$("#lan4_checkbox").bind("click", function() {
        if (lan4_bound == 1 && g_data.LanMode_4 == 1 && getCheckbox("lan4_checkbox") == 0) {
            alert("unckecked_lan_port_alert".i18n());
			setCheckbox("lan4_checkbox", 1);
		} 
    });
}

function disableLAN(getdata)
{
	var wan_num = 0;
	var lan_arr = [];
	
	if (getdata != null && getdata.wan) {
		all_wan_info = getdata;
		wan_info = all_wan_info.wan;
		if(all_wan_info != '' && all_wan_info.wan)
		{
			wan_num = all_wan_info.wan.length;
		}
		
		if (wan_num > 0)
		{
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var LanInterface = single_wan.LanInterface;
				if(lan_arr.indexOf("dev.eth.1") == -1 && LanInterface.indexOf("dev.eth.1") > -1){
					lan_arr.push("dev.eth.1");
				}
				if(lan_arr.indexOf("dev.eth.2") == -1 && LanInterface.indexOf("dev.eth.2") > -1){
					lan_arr.push("dev.eth.2");
				}
				if(lan_arr.indexOf("dev.eth.3") == -1 && LanInterface.indexOf("dev.eth.3") > -1){
					lan_arr.push("dev.eth.3");
				}
				if(lan_arr.indexOf("dev.eth.4") == -1 && LanInterface.indexOf("dev.eth.4") > -1){
					lan_arr.push("dev.eth.4");
				}
			}
			
		}
	}
	if(lan_arr.indexOf("dev.eth.1") > -1){
		if(operator_name != "BZ_INTELBRAS")
		{
			$("#lan1_checkbox").attr("disabled", true);
		}
		lan1_bound = 1;
	}else{
		if(!(operator_name == "BZ_INTELBRAS" && $("input[name='lan_port_mode_enable']:checked").val() == "0"))
		{
			$("#lan1_checkbox").attr("disabled", false);	
		}	
		lan1_bound = 0;
	}
	
	if(lan_arr.indexOf("dev.eth.2") > -1){
		if(operator_name != "BZ_INTELBRAS")
		{
			$("#lan2_checkbox").attr("disabled", true);
		}
		lan2_bound = 1;
	}else{
		if(!(operator_name == "BZ_INTELBRAS" && $("input[name='lan_port_mode_enable']:checked").val() == "0"))
		{
			$("#lan2_checkbox").attr("disabled", false);	
		}
		lan2_bound = 0;
	}
	
	if(lan_arr.indexOf("dev.eth.3") > -1){
		if(operator_name != "BZ_INTELBRAS")
		{
			$("#lan3_checkbox").attr("disabled", true);
		}
		lan3_bound = 1;
	}else{
		if(!(operator_name == "BZ_INTELBRAS" && $("input[name='lan_port_mode_enable']:checked").val() == "0"))
		{
			$("#lan3_checkbox").attr("disabled", false);	
		}
		lan3_bound = 0;
	}
	
	if(lan_arr.indexOf("dev.eth.4") > -1){
		if(operator_name != "BZ_INTELBRAS")
		{
			$("#lan4_checkbox").attr("disabled", true);
		}
		lan4_bound = 1;
	}else{
		if(!(operator_name == "BZ_INTELBRAS" && $("input[name='lan_port_mode_enable']:checked").val() == "0"))
		{
			$("#lan4_checkbox").attr("disabled", false);	
		}
		lan4_bound = 0;
	}
}
