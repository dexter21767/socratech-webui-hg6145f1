$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	show_shadow();
	setCheckbox("enable_energy", localStorage.getItem("enable_energy") || "0");
	setCheckbox("enable_usb", localStorage.getItem("enable_usb") || "0");
	setCheckbox("enable_lan", localStorage.getItem("enable_lan") || "0");
	setCheckbox("enable_wlan", localStorage.getItem("enable_wlan") || "0");
	setCheckbox("enable_voice", localStorage.getItem("enable_voice") || "0");
	setCheckbox("enable_remote", localStorage.getItem("enable_remote") || "0");
}


function save_apply(){
	show_shadow();
	localStorage.setItem("enable_energy", getCheckbox("enable_energy"));
	localStorage.setItem("enable_usb", getCheckbox("enable_usb"));
	localStorage.setItem("enable_lan", getCheckbox("enable_lan"));
	localStorage.setItem("enable_wlan", getCheckbox("enable_wlan"));
	localStorage.setItem("enable_voice", getCheckbox("enable_voice"));
	localStorage.setItem("enable_remote", getCheckbox("enable_remote"));
}