
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
		getDataByAjax("../fake/get_interface_info", parseBaseInfo);
	}
	else
	{
		XHR.poll(gStatusFreshInterval, "get_interface_info", null, parseBaseInfo);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

function parseBaseInfo(data)
{
	//alert(JSON.stringify(data));
	//loadInterfaceInfo(data.interfaceInfo);
	generateRouteData(data);
	
	//fillRouteInfo("interfaceInfoTable1", data.DNS1);
	//fillRouteInfo("interfaceInfoTable2", data.DNS2);
	loadDataByTableId("execResultTable", data);
	/*if(data.interfaceInfo["BUCPE"] != undefined){
		if(data.interfaceInfo.BUCPE != "" || data.interfaceInfo.BUCPE != undefined){
			var dnsAddr = data.interfaceInfo.BUCPE.Interface.DNS1;
			if(dnsAddr){
				$("#DNSInfoTable1").find("[name='DNS1']").text(dnsAddr);
			}else{
				$("#DNSInfoTable1").find("[name='DNS1']").text("--");
			}

			dnsAddr = data.interfaceInfo.BUCPE.Interface.DNS2;
			if(dnsAddr){
				$("#DNSInfoTable1").find("[name='DNS2']").text(dnsAddr);
			}else{
				$("#DNSInfoTable1").find("[name='DNS2']").text("--");
			}	
		}		
	}*/
	
	var dnsAddr1 = data.DNS1;
	if(dnsAddr1)
	{
		$("#DNSInfoTable1").find("[name='DNS1']").text(dnsAddr1);
	}else
	{
		$("#DNSInfoTable1").find("[name='DNS1']").text("--");
	}

	dnsAddr2 = data.DNS2;
	if(dnsAddr2)
	{
		$("#DNSInfoTable1").find("[name='DNS2']").text(dnsAddr2);
	}else
	{
		$("#DNSInfoTable1").find("[name='DNS2']").text("--");
	}	

	InterfaceAddr = data.InterfaceTable.split(";");
	
	$("#interfaceInfoTable1").find("[name='Name']").text(InterfaceAddr[0]);
	$("#interfaceInfoTable1").find("[name='PhyAddr']").text(InterfaceAddr[1]);
	$("#interfaceInfoTable1").find("[name='LocalIP']").text(InterfaceAddr[2]);
	$("#interfaceInfoTable1").find("[name='RemoteIP']").text(InterfaceAddr[3]);
	$("#interfaceInfoTable1").find("[name='Mask']").text(InterfaceAddr[4]);
	$("#interfaceInfoTable1").find("[name='MTU']").text(InterfaceAddr[5]);
}

function generateRouteData(data)
{
	if(data.RouteTable == "" || data.RouteTable == undefined){
		return;
	}
	routeNum = data.RouteTable.split(";");
	
	routeParams = data.RouteTable.replace(/NULL/g, '').split(';');
	routeParamNum = 6;
	routeNum = parseInt(routeParams.length/routeParamNum);	
	var dymanicHTML1 = '';
	var num = 1;
	for (var i=0; i < routeNum; i++)
	{
		if ((routeParams[(i*routeParamNum)+1] != ''))
		{
			dymanicHTML1 += '<tr>';
			dymanicHTML1 += '<td align=\'center\' id=\'Table_route_' + num + '_table\'>' + routeParams[(i*routeParamNum)+0] + '</td>';
			dymanicHTML1 += '<td align=\'center\' id=\'Table_route_' + num + '_table\'>' + routeParams[(i*routeParamNum)+1] + '</td>';	
			dymanicHTML1 += '<td align=\'center\' id=\'Table_route_' + num + '_table\'>' + routeParams[(i*routeParamNum)+2] + '</td>';	
			dymanicHTML1 += '<td align=\'center\' id=\'Table_route_' + num + '_table\'>' + routeParams[(i*routeParamNum)+3] + '</td>';	
			dymanicHTML1 += '<td align=\'center\' id=\'Table_route_' + num + '_table\'>' + routeParams[(i*routeParamNum)+4] + '</td>';	
			dymanicHTML1 += '<td align=\'center\' id=\'Table_route_' + num + '_table\'>' + routeParams[(i*routeParamNum)+5] + '</td>';		
			dymanicHTML1 += '</tr>';
		}
		num++;
	}
	
	$("#routeInfotab").html(dymanicHTML1);
	
	
	/*routeData = data.RouteTable.Interface.RouteTable;

	for(var i = 0; i < routeNum; i++)
	{
		if(routeData[i].Iface == "" || routeData[i].Iface == undefined)
		{
			break;
		}
		if(routeData[i].Iface == interfaceName1)
		{
			routeData1.push(routeData[i]);
		}else{
			routeData2.push(routeData[i]);
		}
	}*/
}


function loadDataByTableId(tableId, data)
{
	if(data == "" || data == undefined){
		return;
	}
	$("#"+tableId).find("td").each(function(){
		if(($(this).attr("name") != '') && ($(this).attr("name") != undefined))
		{
			var _this = $(this);
			$.each(data, function(name, value){
				if(_this.attr("name") == name)
				{
					if(value == "" || value ==undefined)
					{
						_this.text("0");
					}else{
						_this.text(value);
					}
				}
			});
		}		
	});
}

function fillRouteInfo(tableId, data)
{
	if(tableId == "" || tableId == undefined){
		return;
	}
	if(data == "" || data == undefined){
		return;
	}
	var routeNum = data.length;
	for(var i = 0; i < routeNum; i++){
		if(i == 0)
		{
			$("#"+tableId).find(".routeInfo").each(function(){
				var _this = $(this);
				$.each(data[i], function(name, value){
					if(name == _this.attr("name")){
						_this.text(value);
					}
				})
			});
		}
		else{//新增tr
			var newTr = $(".routeInfoTr:eq(0)").clone();
			$(newTr).find(".routeInfo").each(function(){
				var _this = $(this);
				
				$.each(data[i], function(name, value){
					if(name == _this.attr("name")){
						_this.text(value);
					}
				})
			});
			$("#"+tableId).append(newTr);
		}
	}
}


function loadInterfaceInfo(data)
{
	if(data["BUCPE"] == undefined){
		return;
	}
	if(data.BUCPE.Interface == "" || data.BUCPE.Interface == undefined){
		return;
	}
	var interfaceNum = data.BUCPE.Interface.InterfaceTable.length;
	if(interfaceNum > 0)
	{
		for(var i = 0; i < interfaceNum; i++)
		{
			$("#infoContainer"+((i+1).toString())).show();
			var interfaceData = data.BUCPE.Interface.InterfaceTable[i];
			if(i == 0){
				interfaceName1 = interfaceData.Name;
			}else{
				interfaceName2 = interfaceData.Name;
			}
			
			fillInfo("interfaceInfoTable"+((i+1).toString()), interfaceData, "interfaceInfo");
		}
	}
}

function fillInfo(tableId, infoData, dataTypeClass)
{
	if(tableId == "" || tableId == undefined){
		return;
	}
	if(infoData == "" || infoData == undefined){
		return;
	}
	$("#"+tableId).find("."+dataTypeClass).each(function(){
		var _this = $(this);
		$.each(infoData, function(name, value){
			if(_this.attr("name") == name){
				if(value){
					_this.text(value);
				}else{
					_this.text("--");
				}
				return false;
			}
		})
	});
}