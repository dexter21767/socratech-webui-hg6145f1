var modelname = gModelName;

$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	$("#wifi_ap").append("<option value='0'>"+modelname+"</option>"); 
	getData();
});

function getData()
{
	show_shadow();
	setCheckbox("use_default_flag", localStorage.getItem("use_default_flag") || "0");
	setCheckbox("auto_switch_2access", localStorage.getItem("auto_switch_2access") || "0");
	document.getElementById("rssi_forced_switch").value = (localStorage.getItem("rssi_forced_switch") || "-79");
	document.getElementById("rssi_condition_switch").value = (localStorage.getItem("rssi_condition_switch") || "-75");
}

function save_apply(){
	var value1 = $("#rssi_forced_switch").val();
	var value2 = $("#rssi_condition_switch").val();
	if(!(value1 >= -100 && value1 <= -66 && /^-?\d+$/.test( value1 ))){
		alert("force_switching_value_invalid".i18n());
		$("#rssi_forced_switch").focus();
		return;
	}
	if(!(value2 >= -84 && value2 <= -60 && /^-?\d+$/.test( value2 ))){
		alert("conditioned_switching_value_invalid".i18n());
		$("#rssi_condition_switch").focus();
		return;
	}
	show_shadow();
	localStorage.setItem("use_default_flag", getCheckbox("use_default_flag"));
	localStorage.setItem("auto_switch_2access", getCheckbox("auto_switch_2access"));
	localStorage.setItem("rssi_forced_switch", document.getElementById("rssi_forced_switch").value);
	localStorage.setItem("rssi_condition_switch", document.getElementById("rssi_condition_switch").value);
}