var sessionidstr = "";
var bartimer;
// var register_timeout_time = 600; //register overtime, seconds, 10min
var register_timeout_time = 600; //register overtime, seconds, 10min
var register_starttime;
var isCu=false;
var isCM =false;
$(document).ready(function(){
	//check ok, do register
	/*var postdata = new Object();
	postdata.loid = $("#loid").val();
	postdata.password = $("#password").val();
	postdata.sessionid = sessionidstr;	
	XHR.post("do_loidregister", postdata, null);*/
	
	register_starttime = new Date().getTime(); //millisecond
	
	showRegisterResult();
});

function showRegisterResult()
{
	//show progress bar
	//$("#registergd_div").hide();
	$("#progressgd_div").show();
	
	//初始几秒钟使用假数据模拟注册到OLT的状态，以便后台进行处理。
	showFakeResultAtBegin();
	
	setTimeout(function(){
		//check register result every 2 seconds
		checkRegisterResult();
		bartimer = window.setInterval(function(){checkRegisterResult();},2000);
		},5000
	);
}

function showFakeResultAtBegin()
{
	var fakedata = {
		"progress_stop":0,
		"progress_value":20,
		"is_error":0,
		"error_type":-1,
		"stage":0,
		"services":"",
		"data_type":-1
	}
	
	parseRegisterData(fakedata);
}

function validCheck()
{
	if ( isCu != undefined && isCu == true )
	{
		return validCheckCu();
	}
	if ( isCM != undefined && isCM == true )
	{
		return validCheckCM();
	}
	if ( $("#loid").val() == '' )
	{
		$("#loid_hint").html("不能为空");
		return false;
	}
	if ( isCnInclude($("#loid").val()) )
	{
		$("#loid_hint").html("不能包含中文");
		return false;
	}
	if ( $("#password").val() != '' && isCnInclude($("#password").val()) )
	{
		$("#password_hint").html("不能包含中文");
		return false;
	}
	
	$("#loid_hint").html("");
	$("#password_hint").html("如无密码请留空");
	return true;
}

function validCheckCu()
{
	if ( $("#loid").val() == '' )
	{
		alert("逻辑ID不能为空");
		return false;
	}
	if ( isCnInclude($("#loid").val()) )
	{
		alert("逻辑ID不能包含中文");
		return false;
	}
	if ( $("#password").val() != '' && isCnInclude($("#password").val()) )
	{
		alert("密码不能包含中文");
		return false;
	}
	return true;
}

function validCheckCM()
{
	if ( $("#password").val() != '' && isCnInclude($("#password").val()) )
	{
		alert("密码不能包含中文");
		return false;
	}
	return true;
}

var gDoCheckRegisterResult = true;
function checkRegisterResult()
{
	if ( ! gDoCheckRegisterResult )
	{
		return;
	}
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/register_result", parseRegisterData);
	}
	else
	{
		XHR.get("get_register_gd_result", null, parseRegisterData);
	}
}

function parseRegisterData(data)
{
	if ( data.sessionid != undefined )
	{
		sessionidstr = data.sessionid;
	}
	if ( data )
	{
		setProcess( data );
	}
}

function setProcess( data )
{
	var processbar = document.getElementById("progress_bar");
	var current_process_width = parseInt(processbar.style.width);
	var next_process_width = data.progress_value;
	
	//if register timeout
	var timenow = new Date().getTime();
	/*if ( parseInt(timenow - register_starttime)/1000 > register_timeout_time )
	{
		if ( current_process_width <= 22 )//still register to olt
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("在OLT上注册失败，请检查光纤是否已正常连接、宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("在OLT上注册失败，请检查光纤是否已正常连接、宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("在OLT上注册失败，请检查光纤是否已正常连接、宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10000");
			}
		}
		else if ( current_process_width <= 30 )// getting ip
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("到ITMS的通道不通，请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("到ITMS的通道不通，请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("到ITMS的通道不通，请联系客户经理或拨打10000");
			}
		}
		else if ( current_process_width <= 40 )// connecting to itms
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("到ITMS的通道不通，请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("到ITMS的通道不通，请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("到ITMS的通道不通，请联系客户经理或拨打10000");
			}
		}
		else if ( current_process_width >= 50 || current_process_width <= 99 )// getting data form itms
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("ITMS下发业务异常，请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("ITMS下发业务异常，请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("ITMS下发业务异常，请联系客户经理或拨打10000");
			}
		}
		else
		{
			$("#progressgd_hint").html("注册超时！");
		}
		$("#progressgd_hint").addClass("progressgd_hint_red");
		window.clearInterval(bartimer);
		$("#progressgd_div .return_tologin").show();
		return;
	}*/
	//if error, show result, hide progress bar
	if ( data.is_error == 1 )
	{
		// typedef enum
		// {
			// ERROR_OLT_REG_FAIL = 0,
			// ERROR_CANNOT_ACCESS_ITMS = 1,
			// ERROR_ITMS_REG_FIAL = 2,
			// ERROR_ITMS_REG_LIMIT = 3,
			// ERROR_ITMS_REG_TIMEOUT = 4,
			// ERROR_ITMS_ALREADY_REGED = 5,
			// ERROR_ITMS_SERVICE_UNUSUAL = 6,
			// ERROR_UNKNOWN = 7,
		// }ERROR_TYPE;
		if ( data.error_type == 7 )
		{
			$("#progressgd_hint").html("未知错误");
		}
		else if ( data.error_type == 8 )
		{
			$("#progressgd_hint").html("终端注册光信号丢失，请检查光线路的光功率是否正常，终端光模块是否正常。<font size=2 color=red><b>请点击返回,重新注册</b></font>");
			document.getElementById("returnbtn").style.display="";
		}
		else if ( data.error_type == 9 )
		{
			$("#progressgd_hint").html("ITMS平台无此LOID工单存在！请重试。请拨打支撑电话检查ITMS平台是否收到该注册的LOID业务工单，检查ITMS平台录入注册终端的型号、版本、OUI是否正确");			
		}		
		else if ( data.error_type == 2 )
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("在ITMS上注册失败！请检查宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("在ITMS上注册失败！请检查宽带识别码和密码是否正确，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("在ITMS上注册失败，请检查逻辑ID和密码是否正确或拨打10000");
			}
		}
		else if ( data.error_type == 3 )
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("在ITMS上注册失败！请3分钟后重试，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("在ITMS上注册失败！请3分钟后重试，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("在ITMS上注册失败，请3分钟后重试或联系客户经理或拨打10000");
			}
		}
		else if ( data.error_type == 4 )
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("在ITMS上注册超时！请检查线路后重试，如无法解决请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("在ITMS上注册超时！请检查线路后重试，如无法解决请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("注册超时！请检查线路后重试");
			}
		}
		else if ( data.error_type == 5 )
		{
			$("#progressgd_hint").html("已经注册成功，无需再注册");
		}
		else if ( data.error_type == 6 )
		{
			if (isCM == true)
			{
				$("#progressgd_hint").html("ITMS下发业务异常！请联系客户经理或拨打10086");
			}
			else if (isCu == true)
			{
				$("#progressgd_hint").html("ITMS下发业务异常！请联系客户经理或拨打10010");
			}
			else
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS成功，下发业务失败，请重试");
			}
		}
		
		$("#progressgd_hint").addClass("progressgd_hint_red");
		$(".progressgd_container").hide();
	}
	
	if ( next_process_width >= current_process_width )
	{
		doProcessIncreas(current_process_width, next_process_width, data);
	}
	
	
	if( parseInt(processbar.style.width) >= 100 || data.progress_stop == 1 || data.is_error == 1 )
	{
		window.clearInterval(bartimer);
		$("#progressgd_div .return_tologin").show();
	}
}

function doProcessIncreas(current_process_width, next_process_width, data)
{
	var dvalue = parseInt(next_process_width - current_process_width);
	var processbar = document.getElementById("progress_bar");
	
	if ( dvalue > 0 )
	{
		gDoCheckRegisterResult = false;
		current_process_width = current_process_width + 1;
		if ( parseInt(document.getElementById("progress_bar").style.width) < current_process_width )
		{
			processbar.style.width = current_process_width + "%";
			processbar.innerHTML = processbar.style.width;
		}
		setTimeout(function(){doProcessIncreas(current_process_width, next_process_width, data);},200);
	}
	else //when progress bar when to next_process_width, refresh progressgd_hint
	{
		gDoCheckRegisterResult = true;
		if ( data.is_error == 0 )
		{
			// typedef enum
			// {
				// STAGE_REGGING_OLT = 0,
				// STAGE_GETTING_IP = 1,
				// STAGE_CONNECTING_ITMS = 2,
				// STAGE_WATTING_ITMS_DATA = 3,
				// STAGE_ITMS_SENDING_DATA = 4,
				// STAGE_ITMS_DATA_SUCCESS_NEEDREBOOT = 5,
				// STAGE_ITMS_DATA_SUCCESS_NONEEDREBOOT = 6,
			// }STAGE_TYPE;
			if ( data.stage == 0 )
			{
				$("#progressgd_hint").html("终端正在向OLT注册,请等待");
			}
			else if ( data.stage == 7 )
			{
				$("#progressgd_hint").html("终端注册OLT失败,LOID不存在,请重试");
			}			
			else if ( data.stage == 8 )
			{
				$("#progressgd_hint").html("终端注册OLT失败,LOID冲突,请重试");
			}
			else if ( data.stage == 9 )
			{
				$("#progressgd_hint").html("终端注册OLT超时，请确认PON接入方式和LOID是否与施工单一致，如果都正常，请拨打支撑电话检查OLT的PON板卡是否正常，PON口预部署数据配置是否正常");
			}
			else if ( data.stage == 10 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址失败，请拨打支撑电话检查终端到BRAS通道及BRAS地址池配置是否正常。");
			}	
			else if ( data.stage == 13 )
			{
				$("#progressgd_hint").html("终端注册OLT成功");
			}
			else if ( data.stage == 12 )
			{
				$("#progressgd_hint").html("终端注册OLT成功,正在获取管理地址,请等待");
			}			
			else if ( data.stage == 14 )
			{
				$("#progressgd_hint").html("终端注册OLT成功,获取管理地址成功");
			}
			else if ( data.stage == 15 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，正在向ITMS发送注册请求，请等待");
			}
			else if ( data.stage == 16 )
			{
				$("#progressgd_hint").html("终端向ITMS注册失败，正在Ping上层链路是否正常，请等待");
			}
			else if ( data.stage == 17 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS失败，上层链路正常，请拨打支撑电话查询ITMS平台终端是否在线，并重新注册，跟踪终端注册报文");
			}	
			else if ( data.stage == 18 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS失败，上层链路不通，请拨打支撑电话检查终端到ITMS路由是否正常，ITMS平台是否正常");
			}
			else if ( data.stage == 19 )
			{
				$("#progressgd_hint").html("ITMS下发业务超时,请重试");
			}			
			else if ( data.stage == 3 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS成功");
			}
			else if ( data.stage == 20 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS成功，下发业务失败，请重试");
			}			
			else if ( data.stage == 4 )
			{
				$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS成功，正在下发业务，请等待");
			}
			/*else if ( data.stage == 4 )
			{
				// typedef enum
				// {
					// ITMS_DATA_INTERNET = 0,
					// ITMS_DATA_IPTV,
					// ITMS_DATA_VOICE,
					// ITMS_DATA_OTHER,
				// }ITMS_DATA_TYPE;
				if ( data.data_type > -1 )
				{
					var data_str = '';
					if ( data.data_type == 0 )
					{
						data_str = '上网';
					}
					else if ( data.data_type == 1 )
					{
						data_str = 'iTV';
					}
					else if ( data.data_type == 2 )
					{
						data_str = '语音';
					}
					else if ( data.data_type == 3 )
					{
						data_str = '其它';
					}
					$("#progressgd_hint").html("ITMS平台正在下发" + data_str + "业务数据，请勿断电或拨光纤");
				}
				else
				{
					$("#progressgd_hint").html("ITMS平台正在下发业务数据，请勿断电或拨光纤");
				}
			}*/
			else if ( data.stage == 5 || data.stage == 6 )
			{
				var servicelist = '';
				var servicenum = 0;
				var reboothint = '';
				if ( data.stage == 5 )
				{
					reboothint = "，网关需要重启，请等待";
				}
				if ( data.services != '' )
				{
					if ( data.services.toUpperCase().indexOf("INTERNET") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "宽带";
						}
						else
						{
							servicelist = servicelist + "、宽带";
						}
					}
					if ( data.services.toUpperCase().indexOf("VOIP") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "语音";
						}
						else
						{
							servicelist = servicelist + "、语音";
						}
					}
					if ( data.services.toUpperCase().indexOf("IPTV") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "iTV";
						}
						else
						{
							servicelist = servicelist + "、iTV";
						}
					}
					if ( data.services.toUpperCase().indexOf("OTHER") >= 0 )
					{
						servicenum = servicenum + 1;
						if (servicelist == "")
						{
							servicelist = "其它";
						}
						else
						{
							servicelist = servicelist + "、其它";
						}
					}
				}
				if ( servicenum == 0 )
				{
					$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS成功，下发业务成功" + reboothint);
				}
				else
				{
					$("#progressgd_hint").html("终端注册OLT成功，获取管理地址成功，注册ITMS成功，下发业务成功，完成" + servicelist + servicenum + "个业务下发" + reboothint);
				}
				
			}
		}
	}
}
