var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/get_lanSpeedLimit", initPage);
	}
	else
	{
		XHR.get("get_lanSpeedLimit", null, initPage);
	}
});


function initPage(getdata)
{
	var dynamicHTML = '';
	showOrHideLoadingWindowFromIframe("hide");
	if(getdata){
		var LanData = getdata.data;
	
		    switch(LanData.SpeedLimitModeUP)
			{
					case "0":
							dynamicHTML += "<td>"+"lan_speed_limit_close".i18n()+"</td><td></td>";
							break;
					case "1":
							dynamicHTML += "<td>"+"lan_speed_limit_port".i18n()+"</td>";
						    dynamicHTML += '<td>'+LanData.InterfaceLimitUP+'</td>';
							break;
					case "2":
							dynamicHTML += "<td>"+"lan_speed_limit_lan".i18n()+"</td>";
							dynamicHTML += '<td>'+LanData.VlanTagLimitUP+'</td>';
							break;
					case "3":
							dynamicHTML += "<td>"+"lan_speed_limit_ip".i18n()+"</td>";
							dynamicHTML += '<td>'+LanData.IPLimitUP+'</td>';
							break;
					default:
							dynamicHTML += "<td></td><td></td>";
			}
	
	};
   
	$("#apps").html(dynamicHTML);
}