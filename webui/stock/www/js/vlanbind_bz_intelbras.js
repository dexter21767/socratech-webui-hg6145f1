var sessionidstr = "";
var gData;
var wifi_5g_enable;
var lan_ge_num;
var wifi_num_all;
var ssid_display_num;
var main_wifi_index_5g;
var ssid_num_per_band;
var gateway_type = "";
var lanportbindarr = new Array('dev.eth.1', 'dev.eth.2', 'dev.eth.3', 'dev.eth.4', 'dev.eth.5');
var wlanportbindarr = new Array('dev.wla.1', 'dev.wla.2', 'dev.wla.3', 'dev.wla.4', 'dev.wla.5', 'dev.wla.6', 'dev.wla.7', 'dev.wla.8', 'dev.wla.9', 'dev.wla.10', 'dev.wla.11', 'dev.wla.12', 'dev.wla.13', 'dev.wla.14', 'dev.wla.15', 'dev.wla.16');
var fttr_type = gFttr_type;


var gLanPortDescribeArarry = [];
gLanPortDescribeArarry = ["LAN 1", "LAN 2", "LAN 3", "LAN 4", "10G LAN"];

var gPortDescribeArarry_24G = [];
gPortDescribeArarry_24G = ["2.4G SSID1", "2.4G SSID2", "2.4G SSID3", "2.4G SSID4", "2.4G SSID5", "2.4G SSID6", "2.4G SSID7", "2.4G SSID8"];

var gPortDescribeArarry_5G = [];
gPortDescribeArarry_5G = ["5G SSID1", "5G SSID2", "5G SSID3", "5G SSID4", "5G SSID5", "5G SSID6", "5G SSID7", "5G SSID8"];


$(document).ready(function(){
	//‰ºòÂåñÊªöÂä®Êù°ÔºåÊó†ÈúÄÊîπÂä®
	customScrollBar("html");
	initPage();
	initValidate();

});

function vlanbindChange(){
	//ÂàáÊç¢Áî®Êà∑‰æßÁ´ØÂè£
	$("input[name='vlanbind']").bind("click", function(){
		$("input[name='vlanbind']").attr("checked", false);
		$(this).attr("checked", true);
		$("#Vlan_text").val("");
		$("#Vlan_text").attr("disabled", false);
		//PONÂè£ÁªëÂÆö
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
		XHR.get("getVlanBindCfg_BZ_INTELBRAS", null, fillData);
	}
	
	$(".delete-vlanbind").bind("click", function(){
		var deletePort = $(this).attr("data");
		var deleteVlanPart = $(this).parents("tr").find(".vlanPartTd").text();
		deleteApply(deletePort, deleteVlanPart);
	});
    $("#Vlan_text").val("");
	//vlanbindChange();
	$("#vlan_bind_form").hide();
}


function deleteApply(port, vlanPart)
{
	var data = new Object;
	data.action = "delete";
	var portJsonObj;
	//alert("port " + port);
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
		alert("port_selection_error".i18n());
	}
	showOrHideLoadingWindowFromIframe("show");
	data.IfName = port;
	data.vlanPart = vlanPart;
	data.sessionid = sessionidstr;
	XHR.post("setVlanBindCfg_BZ_INTELBRAS", data, reloadData);
}

function saveApply()
{
	if( ! $("#vlan_bind_form").valid())
	{
		fiberlog("validate vlanbind error.");
		return false;
	}
	else
	{
		var data = buildData();
		var repeatFlag = false;
        
		if(data.IfName.indexOf("eth") != -1){//LAN
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
		}else if(data.IfName.indexOf("pon") != -1){//PON
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
							alert("same_port_cannot_bound_same_vlan".i18n());
							repeatFlag = true;
						}
					})
				}
			}
		}else if (gData.wifi_enable == 1 && data.IfName.indexOf("wl0") != -1){//WLAN
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
				XHR.post("setVlanBindCfg_BZ_INTELBRAS", data, reloadData);
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
		alert("configure_failed".i18n());
		showOrHideLoadingWindowFromIframe("hide");
	}
}

function initValidate()
{
	$("#vlan_bind_form").validate({
		debug: false,
		rules: {
			"data.userVlan": {required:¬†true,¬†range_int:[1,4094]},
			//"vlanbind": {required: true}
	    },
	    messages:{
	    	//"vlanbind": "ËØ∑ÈÄâÊã©‰∏Ä‰∏™Á´ØÂè£"
	    },
		errorPlacement: function(error, element) { //ÈîôËØØ‰ø°ÊÅØ‰ΩçÁΩÆËÆæÁΩÆÊñπÊ≥ï
			error.insertAfter(element.parent().parent());
		},
		  submitHandler: function(form){//Ê†°È™åÊàêÂäüÂõûË∞É
		  	fiberlog("validate vlanbind settings ok.....");
		  },
		  invalidHandler: function(form, validator) {  //Ê†°È™åÂ§±Ë¥•ÂõûË∞É
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
		//dynamicHTML += '<input type="radio" name="port_band_select" value="eth' + i + '">' + gLanPortDescribeArarry[i] + " ";		
		dynamicHTML += ' <option value="eth' + i + '">' + gLanPortDescribeArarry[i] + '</option>';		
	}
    
	//wifi port
	if (gData.wifi_enable == 0)
	{
		$("#port_band_select").html(dynamicHTML);
	}
	else
	{
		if(wifi_5g_enable == 0)//only 2.4G SSID1-4
		{
			if(wifi_num_all == 4 && ssid_num_per_band == 4)
			{
				for (i=0; i<4; i++)
				{
					dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_24G[i] + '</option>';
				}
			}
		}
		else//dual
		{

			if(wifi_num_all == 8)	
			{
			    if (ssid_display_num == 8)
				{
				    if (wifi_5g_enable == 1)
			    	{
			    		//main_wifi_index_5g = 5; //¥”µ⁄9∏ˆssidø™ º∂¡»° ˝æ› 
						//ssid_num_per_band = 4;

						for (i=0; i<4; i++)//2.4G SSID1-4 
						{
							dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_24G[i] + '</option>';
						}

						for (i=4; i<8; i++)//5G SSID5-8
						{
							dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_5G[i-4] + '</option>';
						}
			    	}
				}
				else if (ssid_display_num == 4) //2.4G SSID1-4
				{
					for (i=0; i<4; i++)
					{
						dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_24G[i] + '</option>';
					}
				}
			}
			else if(wifi_num_all == 16)
			{
				if (ssid_display_num == 16)
				{
				    if (wifi_5g_enable == 1)
			    	{
			    		//main_wifi_index_5g = 9; //¥”µ⁄9∏ˆssidø™ º∂¡»° ˝æ› 
						//ssid_num_per_band = 8;
						for (i=0; i<8; i++)//2.4G SSID1-8 
						{
							dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_24G[i] + '</option>';
						}

						for (i=8; i<16; i++)//5G SSID9-16
						{
							dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_5G[i-8] + '</option>';
						}
			    	}
				}
				else if (ssid_display_num == 8) 
				{
					if (wifi_5g_enable == 1)
			    	{
			    		//main_wifi_index_5g = 9; //¥”µ⁄9∏ˆssidø™ º∂¡»° ˝æ› 
						//ssid_num_per_band = 4;
						for (i=0; i<4; i++)//2.4G SSID1-4 
						{
							dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_24G[i] + '</option>';
						}

						for (i=8; i<12; i++)//5G SSID9-12
						{
							dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_5G[(i-8)] + '</option>';
						}
			    	}
				}
			}
			else if(wifi_num_all == 4)	
			{
				//main_wifi_index_5g = 0; //Œﬁ–ß ˝æ›
			    //ssid_num_per_band = 4;
			    for (i=0; i<4; i++)//2.4G SSID1-4 
				{
					dynamicHTML += ' <option value="wl0.' + i + '">' + gPortDescribeArarry_24G[i] + '</option>';
				}
			}
		}
		
		$("#port_band_select").html(dynamicHTML);
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

	if ( data.wifi_num_all != undefined )
	{
		wifi_num_all = data.wifi_num_all;
	}	

	if ( data.ssid_displaynum != undefined )
	{
		ssid_display_num = data.ssid_displaynum;
	}

	if ( data.main_wifi_index_5g != undefined )
	{
		main_wifi_index_5g = data.main_wifi_index_5g;
	}

	if ( data.lan_ge_num != undefined )
	{
		ssid_num_per_band = data.ssid_num_per_band;
	}
	
	showOrHideLoadingWindowFromIframe("hide");
	if(data.success != 'true')
	{	
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
		console.log("wlanVlanBindNum " + wlanVlanBindNum);
		//var index2g = 1;
		//var index5g = 1;
		for(i = 0; i < wlanVlanBindNum; i++)
		{
			var portstr;
			var singlewlanvlanbind = data.wlanVlanBindList[i];
			if(eval("singlewlanvlanbind.ssid" + eval(i+1)) == 1)//wifi ÂÆû‰æãÂ≠òÂú®
			{
				console.log("i " + i);

				//wifi port
				if (gData.wifi_enable == 0)
				{
					if(i>=0 && i < 4)//2.4G SSID1-4
					{
						portstr = "2.4G SSID" + eval(i+1);
					}
				}
				else
				{
					if(wifi_5g_enable == 0)//only 2.4G SSID1-4
					{
						if(wifi_num_all == 4 && ssid_num_per_band == 4)
						{
							if(i < 4)if(i>=0 && i < 4)//2.4G SSID1-4
							{
								portstr = "2.4G SSID" + eval(i+1);
							}
						}
					}
					else//dual
					{
						if(wifi_num_all == 8)	
						{
						    if (ssid_display_num == 8)
							{
							    if (wifi_5g_enable == 1)
						    	{
						    		//main_wifi_index_5g = 5; //¥”µ⁄5∏ˆssidø™ º∂¡»° ˝æ› 
									//ssid_num_per_band = 4;

									if(i < 4)//2.4G SSID1-4
									{
										portstr = "2.4G SSID" + eval(i+1);
									}

									if(i >= 4 && i < 8)//5G SSID1-4
									{
										portstr = "5G SSID" + eval(i-3);
									}
						    	}
							}
							else if (ssid_display_num == 4) //2.4G SSID1-4
							{
								if(i < 4)//2.4G SSID1-4
								{
									portstr = "2.4G SSID" + eval(i+1);
								}
							}
						}
						else if(wifi_num_all == 16)
						{
							if (ssid_display_num == 16)
							{
							    if (wifi_5g_enable == 1)
						    	{
						    		//main_wifi_index_5g = 9; //¥”µ⁄9∏ˆssidø™ º∂¡»° ˝æ› 
									//ssid_num_per_band = 8;
									if(i>=0 && i < 8)//2.4G SSID1-8 
									{
										portstr = "2.4G SSID" + eval(i+1);
									}
									if(i>=8 && i < 16)//5G SSID1-8
									{
										portstr = "5G SSID" + eval(i-7);
									}
						    	}
							}
							else if (ssid_display_num == 8) 
							{
								if (wifi_5g_enable == 1)
						    	{
						    		//main_wifi_index_5g = 9; //¥”µ⁄9∏ˆssidø™ º∂¡»° ˝æ› 
									//ssid_num_per_band = 4;
									if(i>=0 && i < 4)//2.4G SSID1-4
									{
										portstr = "2.4G SSID" + eval(i+1);
									}
									if(i>=8 && i < 12)//5G SSID1-4
									{
										portstr = "5G SSID" + eval(i-7);
									}
						    	}
							}
						}
						else if(wifi_num_all == 4)	
						{
							//main_wifi_index_5g = 0; //Œﬁ–ß ˝æ›
						    //ssid_num_per_band = 4;
						    if(i>=0 && i < 4)//2.4G SSID1-4
							{
								portstr = "2.4G SSID" + eval(i+1);
							}
						}
					}
				}
				console.log("portstr " + portstr);
				if(singlewlanvlanbind.X_CT_COM_Mode == '1')
				{
					fillTableByIndex(i, singlewlanvlanbind, portstr);
				}
				$("#vlanbind_List").children().eq(0).children().css("background-color","#b7e3e3");
       			$("#vlanbind_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
       			$("#vlanbind_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
				
				
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
			$("#vlan_bind_form").css("display", "none");
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

		htmlStr += '<td align="center">' + portstr + '</td>';

		htmlStr += '<td align="center" class="vlanPartTd">' + vlanRulesArray[i] +'</td>';
		var WanVlanName=getBindWanConnName(data.X_CT_COM_VLAN, vlanRulesArray[i].split("/")[1]);
		if(WanVlanName==","){
			WanVlanName="";
		}
		htmlStr += '<td align="center">' + WanVlanName + '</td>';
		htmlStr += "<td align='center'><input class='delete-vlanbind input_button input_button_heightwidth_unset' type='button' value='Delete' data='" + data.IfName +"'>" + "</td>";
		htmlStr += "</tr>";
	}
	//console.log(htmlStr)
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
	/*$("input[name='vlanbind']").each(function(){
		if($(this).attr("checked") == "checked"){
			bindPort = $(this).val();
		}
	});*/
	bindPort = $("#port_band_select").val();
	console.log("bindPort " + bindPort);
	var portJsonObj;
	//bindPort = "pon";
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
		alert("port_selection_error".i18n());
	}
	console.log("portJsonObj.IfName " + portJsonObj.IfName);
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

function addfilter() //Â¢ûÂä†ËøáÊª§Êù°ÁõÆ
{
    //addflag = "add";
    $("#vlan_bind_form").show(); 
    var addHtml = []; //Êñ∞Â¢û‰∏Ä‰∏™Âç†‰ΩçÊ†áËÆ∞Ë°å
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';

    if ($("#add_item").length == 0)//Á¨¨‰∏ÄÊ¨°Ê∑ªÂä†Êï∞ÊçÆÊó∂ËÆæÁΩÆÈªòËÆ§ÂÄº
    {
        $("#vlanbind_List").append(addHtml);
        $(".input_text").each(function (i){
           $(this).val('');
        });
        $("#add_item").children().css("background-color","#b7e3e3");
        $("#add_item").siblings().children().css("background-color","#eef2f6");
        $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
}

function Showthisinfo(element) //ÈÄâ‰∏≠ÂΩìÂâçË°åÂπ∂ÊîπÂèòËÉåÊôØËâ≤
{
	console.log(element)
	$("#add_item").remove();
	$("#vlan_bind_form").hide();
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
}


