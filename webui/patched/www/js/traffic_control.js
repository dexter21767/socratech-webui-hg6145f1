var sessionidstr = "";
var PHBArray = new Array("BE","CS1","CS2","CS3","CS4","CS5","CS6","CS7","AF11","AF12","AF13","AF21","AF22","AF23","AF31","AF32","AF33","AF41","AF42","AF43","AF51","AF52","AF53","AF61","AF62","AF63","AF71","AF72","AF73","EF"); 
var DSCPArray  = new Array("0","8","16","24","32","40","48","56","10","12","14","18","20","22","26","28","30","34","36","38","42","44","46","50","52","54","58","60","62","46");
var COSArray_ALL = new Array("0","1","2","3","4","5","6","7","1","1","1","2","2","2","3","3","3","4","4","4","5","5","5","6","6","6","7","7","7","5");
var COSArray = new Array("0","1","2","3","4","5","6","7");

$(document).ready(function(){

	generatHtml();

	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/qos_queue", initPageUpload);
	}
	else
	{
		XHR.get("get_traffic_control_up", null, initPageUpload);
		XHR.get("get_traffic_control_down", null, initPageDownload);
	}
	
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});	
});

function generatHtml(){
	var dynamicHTML = '';

	for (var i=1; i<=8; i++ )
	{
		dynamicHTML += '<tr>';
		dynamicHTML += '<td>Traffic Class' + eval(i) + '<input type="text" id="class'+ eval(i) +'"/></td>';
		dynamicHTML += '<td>PHB(L3)<select id="phb'+ eval(i) +'" class="select_in_table" onchange="changephb('+ eval(i) +')"></select></td>';
		dynamicHTML += '<td>DSCP(L3)<select id="dscp'+ eval(i) +'" class="select_in_table" onchange="changedscp('+ eval(i) +')"></select></td>';
		dynamicHTML += '<td>COS(L3)<select id="cos'+ eval(i) +'" class="select_in_table" onchange="changecos('+ eval(i) +')"></select></td>';
		dynamicHTML += '</tr>';	
		$("#traffic_table").html(dynamicHTML);								
	}

	for (var s=1; s<=8; s++ ){
		for(var j = 0; j < PHBArray.length; j++){
			$("#phb"+s).append("<option value='"+ PHBArray[j] +"'>"+ PHBArray[j] + "</option>");
		}
		
		for(var k = 0; k < DSCPArray.length; k++){
			$("#dscp"+s).append("<option value='"+ DSCPArray[k] +"'>"+ DSCPArray[k] + "</option>");
		}
		
		for(var t = 0; t < COSArray.length; t++){
			$("#cos"+s).append("<option value='"+ COSArray[t] +"'>"+ COSArray[t] + "</option>");
		}	
	}	
}

function changephb(id)
{
	var phb_curValue = $("#phb" + id).val();
	console.log(phb_curValue)
	for(var j = 0; j < PHBArray.length; j++)
	{
		if(phb_curValue == PHBArray[j])
		{
			$("#dscp" + id).val(DSCPArray[j]);
			$("#cos" + id).val(COSArray_ALL[j]);
		}
	}
}

function changecos(id)
{
	var cos_curValue = $("#cos" + id).val();
	console.log(cos_curValue)
	for(var t = 0; t < DSCPArray.length; t++)
	{
		if(cos_curValue == COSArray_ALL[t])
		{
			$("#phb" + id).val(PHBArray[t]);
			$("#dscp" + id).val(DSCPArray[t]);
			break;
		}
	}
}

function changedscp(id)
{
	var dscp_curValue = $("#dscp" + id).val();
	console.log(dscp_curValue)
	for(var k = 0; k < DSCPArray.length; k++)
	{
		if(dscp_curValue == DSCPArray[k])
		{
			$("#phb" + id).val(PHBArray[k]);
			$("#cos" + id).val(COSArray_ALL[k]);
		}
	}
}

function initPageDownload(getdata)
{
	if (getdata && getdata.traffic_down)
	{

		var traffic_downdata = getdata.traffic_down;
		for (var i=1; i<=8; i++ )
		{
			$("#class" + i).val(eval("traffic_downdata.Class" + i));
			$("#phb" + i).val(eval("traffic_downdata.PHB" + i));
			$("#dscp" + i).val(eval("traffic_downdata.DSCP" + i));
			$("#cos" + i).val(eval("traffic_downdata.COS" + i));
		}
	}
}

function saveApplyDown()
{	
	for (var i=1; i<=8; i++ )
	{
		if ( $("#class" + i).val() == "" ){
			alert("Traffic Class" + i + "rewrite_alert".i18n());
			return false;
		}
		if ( $("#class" + i).val().length > 32 ){
			alert("Traffic Class" + i + "length_alert".i18n());
			return false;
		}		
	}
	
	show_shadow();
	var postdata = new Object();
	for (var i=1; i<=8; i++ )
	{
		postdata["Class" + i] = $("#class" + i).val();
		postdata["PHB" + i] = $("#phb" + i).val();
		postdata["DSCP" + i] = $("#dscp" + i).val();
		postdata["COS" + i] = $("#cos" + i).val();
	console.log(postdata)
	}
	postdata.sessionid = sessionidstr;
	XHR.post("set_traffic_control_down", postdata, initPageDownload);
}


function initPageUpload(getdata)
{
	if (getdata && getdata.traffic_up)
	{
		console.log(getdata.traffic_up)
		var traffic_updata = getdata.traffic_up;
		$("#interface_select_LAN2").val(traffic_updata.Hi_priority_LAN2);
		$("#interface_select_LAN3").val(traffic_updata.Hi_priority_LAN3);
		$("#interface_select_SSID3").val(traffic_updata.Hi_priority_SSID3);
		$("#interface_select_SSID7").val(traffic_updata.Hi_priority_SSID7);
	}
}


function saveApplyUp()
{
	show_shadow();
	var postdata = new Object();
	console.log($("#interface_select_LAN2").val())
    postdata.Hi_priority_LAN2 = $("#interface_select_LAN2").val();
	postdata.Hi_priority_LAN3 = $("#interface_select_LAN3").val();
    postdata.Hi_priority_SSID3 = $("#interface_select_SSID3").val();
	postdata.Hi_priority_SSID7 = $("#interface_select_SSID7").val();	
	postdata.sessionid = sessionidstr;
	console.log(postdata)
	XHR.post("set_traffic_control_up", postdata, initPageUpload);
}

