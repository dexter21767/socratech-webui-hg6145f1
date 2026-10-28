var sessionidstr = "";
var gData;
var wifi_5g_enable;
var lan_ge_num;
var gateway_type = "";
var lanportbindarr = new Array('dev.eth.1', 'dev.eth.2', 'dev.eth.3', 'dev.eth.4');
var wlanportbindarr = new Array('dev.wla.1', 'dev.wla.2', 'dev.wla.3', 'dev.wla.4', 'dev.wla.5', 'dev.wla.6', 'dev.wla.7', 'dev.wla.8', 'dev.wla.9', 'dev.wla.10', 'dev.wla.11', 'dev.wla.12', 'dev.wla.13', 'dev.wla.14', 'dev.wla.15', 'dev.wla.16');
var fttr_type = gFttr_type;


var gLanPortDescribeArarry = [];
gLanPortDescribeArarry = ["LAN 1", "LAN 2", "LAN 3", "LAN 4"];;


$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	initPage();
	initValidate();

});

function vlanbindChange(){
	//切换用户侧端口
	$("input[name='vlanbind']").bind("click", function(){
		$("input[name='vlanbind']").attr("checked", false);
		$(this).attr("checked", true);
		$("#Vlan_text").val("");
		$("#Vlan_text").attr("disabled", false);
		//PON口绑定
		if ($(this).val() == "pon4"){
			$(".PON_WanConnect_List").show();
			$(".Vlan_WanConnect_List").hide();
			if ($("#PON_WanConnect_select").html() == "")
			{
				$("#apply").attr('disabled', true);
			}
			else
			{
				$("#apply").attr('disabled', false);
			}
		}else{
			$("#apply").attr('disabled', false);
			$(".PON_WanConnect_List").hide();
			$(".Vlan_WanConnect_List").show();
		}
	});
}


function initPage()
{
	// gDebug = false;
	if(gDebug)
	{
		getDataByAjax("../fake/vlanbind", fillData);
	}else{
		XHR.get("vlanbind", null, fillData);
	}
	
	$(".delete-vlanbind").bind("click", function(){
		var deletePort = $(this).attr("data");
		var deleteVlanPart = $(this).parents("tr").find(".vlanPartTd").text();
		deleteApply(deletePort, deleteVlanPart);
	});
    $("#Vlan_text").val("");
	vlanbindChange();
	$("#fw_config_form").hide();
}


function deleteApply(port, vlanPart)
{
	var data = new Object;
	data.action = "delete";
	var portJsonObj;
	if(port.indexOf("eth") != -1){
		var arrayIndex = parseInt(port.charAt(3));
		portJsonObj = gData.lanVlanBindList[arrayIndex];
	}else if(port.indexOf("pon") != -1){
		portJsonObj = gData.ponVlanBindList[0];
	}else if(port.indexOf("wl0") != -1){
		var str = port.split('.');
		var arrayIndex = parseInt(str[1]);
		portJsonObj = gData.wlanVlanBindList[arrayIndex];
	}else{
		if (gNewUiFlag)
			myAlert('Tip', "port_selection_error".i18n())
		else
			alert("port_selection_error".i18n());
	}
	showOrHideLoadingWindowFromIframe("show");
	data.IfName = port;
	data.vlanPart = vlanPart;
	data.sessionid = sessionidstr;
	XHR.post("setVlanBind", data, reloadData);
}

function saveApply()
{
	if( ! $("#fw_config_form").valid())
	{
		fiberlog("validate vlanbind error.");
		return false;
	}
	else
	{
		var data = buildData();
		var repeatFlag = false;
        
		if(data.IfName.indexOf("eth") != -1){
			for(var i=0;i<gData.lanVlanBindList.length;i++)
			{
				if (repeatFlag) {
					break;
				}
				if(gData.lanVlanBindList[i].IfName == data.IfName){
					var vlanList = [];
					vlanList = gData.lanVlanBindList[i].X_CT_COM_VLAN.split(",");
					vlanList.forEach(function (e){
						if(e == data.vlanPart){
							alert("same_port_cannot_bound_same_vlan".i18n());
							repeatFlag = true;
						}
					})
				}
			}
		}else if(data.IfName.indexOf("pon") != -1){
			for(var i=0;i<gData.ponVlanBindList.length;i++)
			{
				if (repeatFlag) {
					break;
				}
				if(gData.ponVlanBindList[i].IfName == data.IfName){
					var vlanList = [];
					vlanList = gData.ponVlanBindList[i].X_CT_COM_VLAN.split(",");
					vlanList.forEach(function (e){
						if(e == data.vlanPart){
							if (gNewUiFlag)
								myAlert('Tip', "same_port_cannot_bound_same_vlan".i18n())
							else
								alert("same_port_cannot_bound_same_vlan".i18n());
							repeatFlag = true;
						}
					})
				}
			}
		}else if (gData.wifi_enable == 1 && data.IfName.indexOf("wl0") != -1){
			for(var i=0;i<gData.wlanVlanBindList.length;i++)
			{
				if (repeatFlag) {
					break;
				}
				if(gData.wlanVlanBindList[i].IfName == data.IfName){
					var vlanList = [];
					vlanList = gData.wlanVlanBindList[i].X_CT_COM_VLAN.split(",");
					vlanList.forEach(function (e){
						if(e == data.vlanPart){
							if (gNewUiFlag)
								myAlert('Tip', "same_port_cannot_bound_same_vlan".i18n())
							else
								alert("same_port_cannot_bound_same_vlan".i18n());
							repeatFlag = true;
						}
					})
				}
			}
		}

		if (!repeatFlag){
			showOrHideLoadingWindowFromIframe("show");
			if(gDebug)
			{
				postDataByAjax("../fake/post", JSON.stringify(data));
			}else{
				XHR.post("setVlanBind", data, reloadData);
			}
		}else{
			return false;
		}
	}
}

function reloadData(responseData)
{
	if(responseData.success == "true")
	{
		fiberlog("post data success!");
		initPage();
	}
	else
	{
		if (gNewUiFlag)
			myAlert('Tip', "configure_failed".i18n())
		else
			alert("configure_failed".i18n());
		showOrHideLoadingWindowFromIframe("hide");
	}
}

function initValidate()
{
	$("#fw_config_form").validate({
		debug: false,
		rules: {
			"data.userVlan": {required: true, range_int:[1,4094]},
			"vlanbind": {required: true}
	    },
	    messages:{
	    	"vlanbind": "请选择一个端口"
	    },
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		  submitHandler: function(form){//校验成功回调
		  	fiberlog("validate vlanbind settings ok.....");
		  },
		  invalidHandler: function(form, validator) {  //校验失败回调
	   		fiberlog("validate vlanbind settings failed.....");
	   		return false;
	   	  }
	}); 
}

function constructPortHtml()
{
	var i;
	var dynamicHTML;
	
	//lan port
	dynamicHTML = '';
	for (i=0; i<gData.lan_port_num; i++)
	{
		dynamicHTML += '<input type="radio" name="vlanbind" value="eth' + i + '">' + gLanPortDescribeArarry[i] + " ";		
	}
    //PON口绑定
	if (fttr_type == "fttr_main")
	{
		dynamicHTML += '<input type="radio" name="vlanbind" value="pon4">PON';
	}
    
    
	$("#lan_div").html(dynamicHTML);
	
	//wifi port
	if (gData.wifi_enable == 0)
	{
		$("#wifi_div").parent().hide();
		$("#5g_wifi_div").parent().hide();
	}
	else
	{
		var index2g = 1;
		var index5g = 1;
		var dynamicHTML2g = '';
		var dynamicHTML5g = '';
		var wifinum = 0;
		var dynamicWifiHTML = '';
		for (i=0; i<16; i++)
		{
			var singlewlanvlanbind = gData.wlanVlanBindList[i];
			console.log(123)
			console.log(gData)
			console.log(456)
			console.log(singlewlanvlanbind)
			if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi 实例存在
			{
				wifinum++;
				var disablestr = '';
				//if ( (gData.wifi_obj_enable && eval("gData.wifi_obj_enable.ConfigActive" + eval(i+1)) == 0) || (eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) != "2.4G-1" && eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)) != "5G-1") )
				if ( gData.wifi_obj_enable && eval("gData.wifi_obj_enable.ConfigActive" + eval(i+1)) == 0 )
				{
					disablestr = 'disabled';
				}
				
				/*	if((wifi_5g_enable != 0) || (wifi_5g_enable == 0 && eval("singlewlanvlanbind.SSIDAlias" + eval(i+1)).indexOf("5G") < 0))
				{
				dynamicWifiHTML += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">SSID-' + eval(i+1) + " ";
				}*/
				
				if (singlewlanvlanbind.X_CT_COM_RFBand == "1")//5g
				{
					dynamicHTML5g += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">5G SSID' + index5g + " ";
					index5g++;
				}
				else //2.4g
				{
					dynamicHTML2g += '<input type="radio" ' + disablestr + ' name="vlanbind" value="wl0.' + i + '">2.4G SSID' + index2g + " ";
					index2g++;
				}

			}
			continue;
		}
		$("#2g_wifi_div").html(dynamicHTML2g);
		$("#5g_wifi_div").html(dynamicHTML5g);
		
		//$("#wifi_div").html(dynamicWifiHTML);
		
		/*if (wifinum<=4)
		{
			document.getElementById('wifi_div').style.height = 0 + 'px';
		}
		else if(wifinum<=8)
		{
			document.getElementById('wifi_div').style.height = 50 + 'px';
		}
		else if(wifinum<=12)
		{
			document.getElementById('wifi_div').style.height = 100 + 'px';
		}
		else
		{
			document.getElementById('wifi_div').style.height = 180 + 'px';
		}*/
		/*
		if (gData.wifi_5g_enable == 1)
		{
			$("#5g_wifi_div").html(dynamicHTML5g);
		}
		else
		{
			$("#5g_wifi_div").parent().hide();
		}*/
	}
}


function fillData(data)
{
	if ( data.sessionid != undefined )
	{
		sessionidstr = data.sessionid;
	}
	
	if ( data.wifi_5g_enable != undefined )
	{
		wifi_5g_enable = data.wifi_5g_enable;
	}	

	if ( data.lan_ge_num != undefined )
	{
		lan_ge_num = data.lan_ge_num;
	}		
	
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success != 'true')
	{
		if (gNewUiFlag)
			myAlert('Tip', "get_vlanbind_failed".i18n())
		else
			alert("get_vlanbind_failed".i18n());
		return false;
	}
	gData = data;
	constructPortHtml();
	if((data.lanVlanBindList == "") || (data.lanVlanBindList == ""))
	{
		fiberlog("VLAN binding is not configured!");
	}else{
		var lanVlanBindNum = data.lanVlanBindList.length;
		$("#vlanbind_List").html("");
		var i = 0;
		for(; i < lanVlanBindNum; i++)
		{
			if(data.lanVlanBindList[i].X_CT_COM_Mode == '1'){
				var port = gLanPortDescribeArarry[parseInt(data.lanVlanBindList[i].IfName.substring(3))];			
				fillTableByIndex(i, data.lanVlanBindList[i], port);
			}
			continue;
		}
		if (data.ponVlanBindList != undefined)
		{
			var ponVlanBindNum = data.ponVlanBindList.length;
			for(i = 0; i < ponVlanBindNum; i++)
			{
				if(data.ponVlanBindList[i].X_CT_COM_Mode == '1')
				{
					var port = "PON";
					fillTableByIndex(i, data.ponVlanBindList[i], port);
				}
				continue;
			}
		}
		
		
		var wlanVlanBindNum = data.wlanVlanBindList.length;
		//var index2g = 1;
		//var index5g = 1;
		for(i = 0; i < wlanVlanBindNum; i++)
		{
			var portstr;
			var singlewlanvlanbind = data.wlanVlanBindList[i];
			if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi 实例存在
			{
				portstr = "SSID-" + eval(i+1);
				
				if(singlewlanvlanbind.X_CT_COM_Mode == '1')
				{
					fillTableByIndex(i, singlewlanvlanbind, portstr);
				}
				if(!gNewUiFlag){
				$("#vlanbind_List").children().eq(0).children().css("background-color","#b7e3e3");
       			$("#vlanbind_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
       			$("#vlanbind_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
				}
				
				
				/*if (singlewlanvlanbind.X_CT_COM_RFBand == "1")//5g
				{
					portstr = "5G-" + index5g;
					if(singlewlanvlanbind.X_CT_COM_Mode == '1')
					{
						fillTableByIndex(i, singlewlanvlanbind, portstr);
					}
					index5g++;
					continue;
				}
				else //2.4g
				{
					portstr = "2.4G-" + index2g;
					if(singlewlanvlanbind.X_CT_COM_Mode == '1')
					{
						fillTableByIndex(i, singlewlanvlanbind, portstr);
					}
					index2g++;
					continue;
				}*/
			}
			continue;
		}
		var wanConnum = data.wanConnList.length;
		var showNum = 0;
		$("#Vlan_WanConnect_select").html("");
    	$("#PON_WanConnect_select").html("");
		for(i = 0; i < wanConnum; i++)
		{
			var single_wan_name = data.wanConnList[i].Name;
			if ( single_wan_name.toUpperCase().indexOf("INTERNET") >=0
				|| single_wan_name.toUpperCase().indexOf("OTHER") >= 0 
				|| single_wan_name.toUpperCase().indexOf("MULTICAST") >= 0
				|| single_wan_name.toUpperCase().indexOf("IPTV") >= 0)
			{
				var optionStr = "<option value='" + single_wan_name + "'>";
				optionStr += single_wan_name + "</option>";
				$("#Vlan_WanConnect_select").append(optionStr);
				$("#PON_WanConnect_select").append(optionStr);
				showNum ++;
			}

		}
		if ( showNum <= 0 )
		{
			$("#fw_config_form").css("display", "none");
		}
	}
	
}


function fillTableByIndex(index, data, portstr)
{
	
	var vlanRulesArray = data.X_CT_COM_VLAN.split(',')
	var vlanRulesNum = vlanRulesArray.length;
	var htmlStr = "";
	for(var i = 0; i < vlanRulesNum; i++)
	{
		htmlStr += '<tr id="outtable_'+i+'" onclick="Showthisinfo(this.id)">';
		htmlStr += '<td align="center">' + 1 + '</td>';
		htmlStr += '<td align="center">' + portstr + '</td>';

		htmlStr += '<td align="center" class="vlanPartTd">' + vlanRulesArray[i] +'</td>';
		var WanVlanName=getBindWanConnName(data.X_CT_COM_VLAN, vlanRulesArray[i].split("/")[1]);
		if(WanVlanName==","){
			WanVlanName="";
		}
		htmlStr += '<td align="center">' + WanVlanName + '</td>';
		htmlStr += "<td><input class='delete-vlanbind input_button input_button_heightwidth_unset' type='button' value='delete' data='" + data.IfName +"'>" + "</td>";
		htmlStr += "</tr>";
	}
	console.log(htmlStr)
	$("#vlanbind_List").append(htmlStr);
}


function getBindWanConnName(CUVLANStr, VlanPort)
{
	var bindWanNameStr = ",";
	if (/^\d+\/(\d+|-1)/.test(CUVLANStr))
	{
		var CUVlanParts = CUVLANStr.split(','), UVlan;
		
		for (var i=0; i<CUVlanParts.length; i++)
		{
			UVlan = CUVlanParts[i].split('/')[1];
			for (var j=0; j<gData.wanConnList.length; j++)
			{
				if (UVlan == gData.wanConnList[j].vlanid
				&& (/INTERNET/i.test(gData.wanConnList[j].Name) || /Other/i.test(gData.wanConnList[j].Name) || /MULTICAST/i.test(gData.wanConnList[j].Name) || /IPTV/i.test(gData.wanConnList[j].Name))
				&& -1 == bindWanNameStr.indexOf("," + gData.wanConnList[j].Name + ",")  && UVlan == VlanPort)
				{
					bindWanNameStr += gData.wanConnList[j].Name + ",";
				}
			}
		}
	}
	
	return bindWanNameStr.substring(1, bindWanNameStr.length-1);
}



function buildData()
{
	var wanbindport = "";

	var data = new Object();

	var bindPort = "";
	$("input[name='vlanbind']").each(function(){
		if($(this).attr("checked") == "checked"){
			bindPort = $(this).val();
		}
	});
	var portJsonObj;
	bindPort = "pon";
	if(bindPort.indexOf("eth") != -1){
		var arrayIndex = parseInt(bindPort.charAt(3));
		portJsonObj = gData.lanVlanBindList[arrayIndex];
		wanbindport = lanportbindarr[arrayIndex];
	}else if(bindPort.indexOf("pon") != -1){
		portJsonObj = gData.ponVlanBindList[0];
	}else if(bindPort.indexOf("wl0") != -1){
		var str = bindPort.split('.');
		var arrayIndex = parseInt(str[1]);
		portJsonObj = gData.wlanVlanBindList[arrayIndex];
		wanbindport = wlanportbindarr[arrayIndex];

	}else{
		if (gNewUiFlag)
			myAlert('Tip', "port_selection_error".i18n())
		else
			alert("port_selection_error".i18n());
	}
	data.action = "add";
	data.IfName = portJsonObj.IfName;
	var userVlan = $("#Vlan_text").val();
    if (data.IfName == "pon4"){
		var wanSelect = $("#PON_WanConnect_select").val();
	}else{
		var wanSelect = $("#Vlan_WanConnect_select").val();
	}
	var wanConnum = gData.wanConnList.length;
	var i = 0;
	for(; i < wanConnum; i++){
		if(gData.wanConnList[i].Name == wanSelect)
		{
			break;
		}
	}

	data.vlanPart = userVlan + "/" + gData.wanConnList[i].vlanid;
	data.sessionid = sessionidstr;
	return data;
}

function cancel()
{
	//displayHtml();
}

function addfilter() //增加过滤条目
{
    //addflag = "add";
    $("#fw_config_form").show(); 
    var addHtml = []; //新增一个占位标记行
	if(!gNewUiFlag){
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';
	}

    if ($("#add_item").length == 0)//第一次添加数据时设置默认值
    {
        $("#vlanbind_List").append(addHtml);
        $(".input_text").each(function (i){
           $(this).val('');
        });
		if(!gNewUiFlag){
        $("#add_item").children().css("background-color","#b7e3e3");
        $("#add_item").siblings().children().css("background-color","#eef2f6");
        $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
		}
    }
}

function Showthisinfo(element) //选中当前行并改变背景色
{
	console.log(element)
	if(!gNewUiFlag){
	$("#add_item").remove();
		$("#fw_config_form").hide();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
	}
}


