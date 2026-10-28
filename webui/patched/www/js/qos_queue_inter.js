var sessionidstr = "";
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	$("#Plan").bind("click", function(){
		displayControl();
	});
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_queue", initPage);
	}
	else
	{
		XHR.get("get_qos_queue", null, initPage);
	}
});

var queue_num = 8;
var queuearray = new Array();

function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});
	showOrHideLoadingWindowFromIframe("hide");
	
	var dynamicHTMLPQ = '';
	var dynamicHTMLWRR = '';
	
	if (getdata && getdata.qos )
	{
		var qosdata = getdata.qos;
		$("#Plan").val(qosdata.Plan);
		$("#Bandwidth").val(qosdata.Bandwidth);
		$("#Enable8021P").val(qosdata.Enable8021P);
		setCheckbox("EnableDSCPMark", qosdata.EnableDSCPMark);
		
		addindex = '';
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				queuearray[i-1] = 1; 
				
				//priority_table
				dynamicHTMLPQ += '<tr>';
				dynamicHTMLPQ += '<td>Q' + eval(i) + '</td>';
				dynamicHTMLPQ += '<td><select id="priority'+ eval(i) +'" class="select_in_table"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select></td>';
				dynamicHTMLPQ += '<td><input type="checkbox" id="priority_enable'+ eval(i) +'" style="margin-top:0;" /></td>';
				dynamicHTMLPQ += '<td style="display:none"><input type="button" class="input_button input_button_heightwidth_unset" value="Delete" onclick=deletequeue(' + i + ') /></td>';
				dynamicHTMLPQ += '</tr>';
				
				//weight_table
				dynamicHTMLWRR += '<tr>';
				dynamicHTMLWRR += '<td>Q' + eval(i) + '</td>';
				dynamicHTMLWRR += '<td><input type="text" id="weight'+ eval(i) +'"/></td>';
				dynamicHTMLWRR += '<td><input type="checkbox" id="weight_enable'+ eval(i) +'" style="margin-top:0;" /></td>';
				dynamicHTMLWRR += '<td style="display:none"><input type="button" class="input_button input_button_heightwidth_unset" value="Delete" onclick=deletequeue(' + i + ') /></td>';
				dynamicHTMLWRR += '</tr>';

			}
			else
			{
				queuearray[i-1] = 0; 
				
				if ( addindex == '' )
				{
					addindex = i;
				}
			}
		}
		$("#priority_table2").html(dynamicHTMLPQ);
		$("#weight_table2").html(dynamicHTMLWRR);
		
		for (var i=1; i<=queue_num; i++ )
		{
			if ( eval("qosdata.Q" + i) == 1)
			{
				$("#priority" + i).val(eval("qosdata.Priority" + i));
				$("#weight" + i).val(eval("qosdata.Weight" + i));
				setCheckbox("priority_enable"+i, eval("qosdata.Enable" + i));
				setCheckbox("weight_enable"+i, eval("qosdata.Enable" + i));
			}
		}
	}
	
	displayControl();
}

function displayControl()
{
	if ($("#Plan").val() == "priority")
	{
		$("#priority_table").show();
		$("#priority_table2").show();
		$("#weight_table").hide();
		$("#weight_table2").hide();
	}
	else
	{
		$("#priority_table").hide();
		$("#priority_table2").hide();
		$("#weight_table").show();
		$("#weight_table2").show();
	}
	
	if ( addindex == '' )
	{
		$("#adddiv").hide();
	}
	else
	{
		$("#adddiv").show();
	}
}

function extraValidCheck()
{
	if ( $("#Bandwidth").val() == '' || ! isValidInteger($("#Bandwidth").val()) || $("#Bandwidth").val() < 0 )
	{
		//alert("总带宽应为大于等于0的整数，请重新填写");
		alert("qos_total_bandwith_invalid".i18n());
		return false;
	}
	
	if ($("#Plan").val() == "priority")
	{
		for ( var i=1; i<=queue_num; i++ )
		{
			if (queuearray[i-1] == 1)
			{
				for ( var j=1; j<=queue_num; j++ )
				{
					if (queuearray[j-1] == 1)
					{
						if ( j != i && $("#priority" + i).val() == $("#priority" + j).val() )
						{
							//alert("队列优先级不能相同，请重新选择");
							alert("formation_priority_cannot_same".i18n());
							return false;
						}
					}
				}
			}
			
		}
	}
	else
	{
		var totalweight = 0;
		for ( var i=1; i<=queue_num; i++ )
		{
			if (queuearray[i-1] == 1)
			{
				if ( ! isInValidNumRange($("#weight" + i).val(), 0, 100) )
				{
					//alert("单个队列的权重应在0-100之间，请重新填写");
					alert("single_formation_weight_invalid".i18n());
					return false;
				}
				totalweight += parseInt($("#weight" + i).val());
			}
		}
		if ( totalweight != 100 )
		{
			//alert("所有队列权重的和应该为100，请重新填写");
			alert("all_formation_weight_not_equal_100".i18n());
			return false;
		}
	}
	return true;
}

function deletequeue(index)
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.index = index;
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_queue", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
	
}

function addqueue()
{
	var postdata = new Object();
	postdata.action = "add";
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_queue", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

function saveApply()
{
	if ( ! extraValidCheck() )
	{
		return;
	}
	
	var postdata = new Object();
	postdata.action = "modify";
	postdata.Plan = $("#Plan").val();
	postdata.Bandwidth = $("#Bandwidth").val();
	postdata.Enable8021P = $("#Enable8021P").val();
	postdata.EnableDSCPMark = getCheckbox("EnableDSCPMark");
	for (var i=1; i<=8; i++ )
	{
		if (queuearray[i-1] == 1)
		{
			if ( $("#Plan").val() == "priority" )
			{
				postdata["Priority" + i] = $("#priority" + i).val();
				postdata["Enable" + i] = getCheckbox("priority_enable" + i);
			}
			else
			{
				postdata["Weight" + i] = $("#weight" + i).val();
				postdata["Enable" + i] = getCheckbox("weight_enable" + i);
			}
		}
	}
	postdata.sessionid = sessionidstr;
	XHR.post("set_qos_queue", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

