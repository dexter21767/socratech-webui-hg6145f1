$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	show_shadow();
	var sw_status = localStorage.getItem("indicator_switch") || "on";
	$("input[name='indicator_switch'][value="+sw_status+"]").attr("checked",true);
	
}


function save_apply(){
	show_shadow();
	var sw_status = $("input[name='indicator_switch']:checked").val();
	localStorage.setItem("indicator_switch",sw_status);
	var postdata = new Object();
	postdata.sw_status = sw_status;
	XHR.post("set_indicator_state_config", postdata, initPage);
}

function initPage(){
	
}