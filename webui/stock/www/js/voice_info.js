
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_status", parseGetData);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_voice_status", null, parseGetData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseGetData(data)
{
	var dynamicHTML = '';
	var voip_wan_exist = 0;

	XHR.get("get_allwan_name", null, function(data){
		if ( data && data.wan )
		{
			for (var i=0; i< data.wan.length; i++ )
			{
				var singlename = data.wan[i].Name.toUpperCase();
				if ( singlename.indexOf("VOIP") >= 0 || singlename.indexOf("VOICE") >= 0 )
				{
					voip_wan_exist = 1;
					break;
				}
			}
		}
	});
	
	if ( data && data.voice_status && data.voice_status.voice_port_num > 0 )
	{
		for (i=1; i<=data.voice_status.voice_port_num; i++)
		{
			dynamicHTML += '<tr>';
			dynamicHTML += '<td>' + i + '</td>';
			if ( data.voice_status.ServerType == 2 )
			{
				dynamicHTML += '<td>' + eval("data.voice_status.AuthUserName" + i) + '(' + ')' + '</td>';
			}
			else
			{
				dynamicHTML += '<td>' + eval("data.voice_status.AuthUserName" + i) + '(' + eval("data.voice_status.DirectoryNumber" + i) + ')' + '</td>';
			}
			
			if ( voip_wan_exist == 1 )
			{
				var lineenable = eval('data.voice_status.EnableLine' + i);
				if ( lineenable == "Disabled" )
				{
					dynamicHTML += '<td>未注册</td>';
					dynamicHTML += '<td></td>';
				}
				else
				{
					var regstatus = eval('data.voice_status.RegStatus' + i);
					if ( regstatus == "Unconfig" )
					{
						dynamicHTML += '<td>未完成配置</td>';
						dynamicHTML += '<td></td>';
					}
					else if ( regstatus == "Disabled" )
					{
						dynamicHTML += '<td>未启用</td>';
						dynamicHTML += '<td></td>';
					}
					else if ( regstatus == "Registering" )
					{
						dynamicHTML += '<td>注册中</td>';
						dynamicHTML += '<td></td>';
					}
					else if ( regstatus == "Online" )
					{
						dynamicHTML += '<td>注册成功</td>';
						dynamicHTML += '<td></td>';
					}
					else
					{
						dynamicHTML += '<td>注册失败</td>';
						if ( data.voice_status.ServerType == 2 ) //ServerType 0:IMS 1:SIP 2:H248
						{
							var reason248 = eval("data.voice_status.RegStatusReason" + i);
							if ( reason248 == 716 )
							{
								dynamicHTML += '<td>配置错误</td>';
							}
							else if ( reason248 == 702 )
							{
								dynamicHTML += '<td>服务器无响应</td>';
							}
							else
							{
								dynamicHTML += '<td>未知错误原因</td>';
							}
							
						}
						else
						{
							var reason = eval("data.voice_status.RegStatusReason" + i);
							if ( reason == 710 )
							{
								dynamicHTML += '<td>OLT注册失败</td>';
							}
							else if ( reason == 711 )
							{
								dynamicHTML += '<td>无语音通道</td>';
							}
							else if ( reason == 712 )
							{
								dynamicHTML += '<td>语音通道获取IP地址失败</td>';
							}
							else if ( reason == 702 )
							{
								dynamicHTML += '<td>服务器无响应</td>';
							}
							else if ( reason == 713 )
							{
								dynamicHTML += '<td>配置信息不全</td>';
							}
							else if ( reason == 714 )
							{
								dynamicHTML += '<td>用户被禁用</td>';
							}
							else if ( reason == 403 )
							{
								dynamicHTML += '<td>注册鉴权失败</td>';
							}
							else if ( reason == 715 )
							{
								dynamicHTML += '<td>注册超时</td>';
							}
							else if ( reason >= 300 && reason <= 600)
							{
								dynamicHTML += '<td>服务器返回错误响应</td>';
							}
							else
							{
								dynamicHTML += '<td>未知错误原因</td>';
							}
						}
					}
				}
			}
			else
			{
				dynamicHTML += '<td>注册失败</td>';
				dynamicHTML += '<td>没有语音连接</td>';
			}
			
			dynamicHTML += '</tr>';
		}
	}

	$("#voice_info").html(dynamicHTML);
}
