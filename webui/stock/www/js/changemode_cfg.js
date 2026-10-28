var sessionidstr = "";
var g_data;
$(document).ready(function(){	
	XHR.get("get_mode_info", null, initPage);
});

function initPage(getdata)
{
	if (getdata != null && getdata.mode)
	{
		g_data = getdata.mode;
		displayHtml();
	}	
}

function displayHtml()
{
	if (g_data == "TH_3BB")
    {
		$("#TH_3BB_mode").prop('checked',true);
	}
    else if(g_data == "TH_AIS")
    {
		$("#TH_AIS_mode").prop('checked',true);
	}
}

function save_apply()
{
	var chosenmode = $("input[name='network_mode']:checked").val();
	if(chosenmode == g_data){
		window.location.reload();
	}else{
		if(confirm("reboot_confirm".i18n()))
		{
			var postdata = new Object();
			postdata.mode = chosenmode;
			XHR.post("set_mode_info", postdata, initPage);
		}
	}
}

