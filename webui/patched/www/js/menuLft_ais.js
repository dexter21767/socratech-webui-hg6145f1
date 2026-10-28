/**
 * @description 左侧菜单渲染相关逻辑
 * @time 20190312
 * @author scos_fx
 */
var multiAP = "";
var band_steering = "";
var hide;
var DONT_ENUM =  "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
hasOwn = ({}).hasOwnProperty;
for (var i in {
	toString: 1
}){
	DONT_ENUM = false;
}

$(document).ready(function(){
	XHR.get("get_multiAP_enable", null, multiInfo);
	XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);
})

function bandsteeringInfo(data)
{
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function multiInfo(data)
{
	//alert(JSON.stringify(data));
	multiAP = data.multiAP_enable.Enable;
}

Object.keys = Object.keys || function(obj){//ecma262v5 15.2.3.14
	var result = [];
	for(var key in obj ) if(hasOwn.call(obj,key)){
		result.push(key) ;
	}
	if(DONT_ENUM && obj){
		for(var i = 0 ;key = DONT_ENUM[i++]; ){
			if(hasOwn.call(obj,key)){
				result.push(key);
			}
		}
	}
	return result;
};

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {//如果调用forEach方法的对象是null就抛错
            throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);//获取调用forEach的对象
        var len = O.length >>> 0;//手动转为32位整数
        if(typeof callback !== "function") {//callback检查
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {//第二参检查
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {//某个数组项是否在数组中
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

function CreateMenuLft(option) {
    this.firMenu = option.oneObj
    this.secMenu = option.towObj
    this.firDomNode = option.firDomNodeName
    this.secDomNode = option.secDomNodeName
    this.thisName = option.objName // new 出来的对象名称

    this.src = ''
    this.title = {}
    this.nowSecObj = {}
    this.hash = {}

    // 初始化
    this.createFirMenu()
    // 模拟点击效果 初始第一个一级菜单
    this.changeFirMenu($(this.firDomNode + '>li').get(0),Object.keys(this.firMenu)[0])
    // 模拟点击效果 初始第一个二级菜单
    this.changeSecMenu($('.sec-menu>li:first>span').get(0),Object.keys(this.firMenu)[0],0)
    // 模拟点击效果 初始第一个三级菜单
    this.changeThrMenu($('.sec-menu>li:first>span+ul>li:first').get(0),0)

}


// 渲染一级菜单
CreateMenuLft.prototype.createFirMenu = function(){
    var dynamicHTML = "";
    var menuObjName = this.thisName;
    $(this.firDomNode).empty();
	$.each(this.firMenu, function(name, content){
        var clickFun = menuObjName + ".changeFirMenu(this,'"+ name + "')"
		if (name != "awifi")
		{
			dynamicHTML += '<li  id="first_menu_' + name + '" ';
			dynamicHTML += 'onclick="'+ clickFun +'">' + content.title.i18n() + '</li>';
		}
		else if (name == "awifi")
		{
			if (awifi_switch == "1")
			{
				dynamicHTML += '<li  id="first_menu_' + name + '" ';
				dynamicHTML += 'onclick="'+ clickFun +'">' + content.title.i18n() + '</li>';
			}
		}
  })
    $(this.firDomNode).append(dynamicHTML);
    
    
}

// 一级菜单点击切换操作
CreateMenuLft.prototype.changeFirMenu = function(domNode,objName){
    $(".fir-menu-open").removeClass("fir-menu-open")
    $(domNode).addClass("fir-menu-open")
    this.createSecMenu(objName)
    this.title.firTitle = this.firMenu[objName].title.i18n()
    this.hash.menuObjName = objName
	if (this.secMenu[objName].childMenuPosition == "self") {
    var widthLen = parseFloat($(".left-meun").css("width")) + 920
		$(".left-meun").hide();
		$(".main_iframe").css("width",widthLen + "px");
		$(".main_iframe").css("min-height","697px");
    $(".main_iframe").css("margin-left","0px");
		console.log(this.secMenu[objName].src);
		$(".main_iframe").attr("src",this.secMenu[objName].src)
	}else {
		$(".left-meun").show();
		$(".main_iframe").css("width","900px");
		$(".main_iframe").css("min-height","697px");
    $(".main_iframe").css("margin-left","20px");
		this.changeSecMenu($('.sec-menu>li:first>span').get(0),objName,0)
		this.changeThrMenu($('.sec-menu>li:first>span+ul>li:first').get(0),0)
	}
}

// 渲染二级菜单
CreateMenuLft.prototype.createSecMenu = function(secObjName){
    if (this.secMenu[secObjName].childMenuPosition == "self") return;
	
    var initSecMenuArr = this.secMenu[secObjName].secondmenus;
    var initSecMenuName = secObjName;
    var partSecondMenuHTML = "";
    var menuObjName = this.thisName;
    var that = this
    $(this.secDomNode).empty();
    initSecMenuArr.forEach(function (e,index) {
        partSecondMenuHTML += "<li id='sec_" + e.title + "'" + "><span id='span_" + e.title + "'";
        partSecondMenuHTML +=  "onclick='"+ menuObjName + ".changeSecMenu(this,\""+ initSecMenuName + "\","+ index  +")'>";
        if(e.title.indexOf("Device_Information")>= 0 || e.title.indexOf("DLNA")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_basic_Routing_1.png'>";  
        }else if(e.title.indexOf("wireless")>= 0 || e.title.indexOf("wlan_settings")>=0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_status_wan_1.png'>";  
        }else if(e.title.indexOf("lan")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_status_lan_1.png'>";  
        }else if(e.title.indexOf("wan")>= 0 || e.title.indexOf("broadband")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-remote-1.png'>";  
        }else if(e.title.indexOf("VOIP")>= 0 || e.title.indexOf("voip_settings")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ico_voip_1.png'>";  
        }else if(e.title.indexOf("USB")>= 0 || e.title.indexOf("Telnet_Service")>= 0 || e.title.indexOf("FTP")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_ais_agent.png'>";
        }else if(e.title.indexOf("Optical_Power")>= 0 || e.title.indexOf("Samba")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_status_arp_1.png'>";  
        }else if(e.title.indexOf("auth_settings")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_status_m.png'>";  
        }else if(e.title.indexOf("route_settings")>= 0 || e.title.indexOf("ALG")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_status_statistics_1.png'>";  
        }else if(e.title.indexOf("traffic_settings")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_status_arp_1.png'>";  
        }else if(e.title.indexOf("firewall")>= 0 || e.title.indexOf("SSH_Service")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_basic_Security_1.png'>";  
        }else if(e.title.indexOf("DDOS")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_appli_DLNA_1.png'>";  
        }else if(e.title.indexOf("HTTPS")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-reboot-1.png'>";  
        }else if(e.title.indexOf("management")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-ont-1.png'>";  
        }else if(e.title.indexOf("VPN")>= 0 || e.title.indexOf("software")>=0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-ont-1.png'>";  
        }else if(e.title.indexOf("DDNS")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_appli_DDNS_1.png'>";  
        }else if(e.title.indexOf("Port_Mapping")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_appli_device_1.png'>";  
        }else if(e.title.indexOf("NAT")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_basic_NAT_1.png'>";  
        }else if(e.title.indexOf("UPNP")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_basic_Parental_1.png'>";  
        }else if(e.title.indexOf("DMZ")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_management_m.png'>";  
        }else if(e.title.indexOf("Web Port")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_wifi_tethering_1.png'>";  
        }else if(e.title.indexOf("Diagnosis")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-diagnosis-1.png'>"; 
        }else if(e.title.indexOf("operaotor_mode")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-ont-1.png'>";  
        }else if(e.title.indexOf("user_admin")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ico-user.png'>";  
        }else if(e.title.indexOf("device_admin")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-remote-1.png'>";  
        }else if(e.title.indexOf("log_admin")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_feature_m.png'>";  
        }else if(e.title.indexOf("standard_configuration")>= 0 || e.title.indexOf("MQTT")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_basic_m.png'>";    
        }else if(e.title.indexOf("NetLock")>= 0){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic-manage-diagnosis-1.png'>";  
        }else if(e.title.indexOf("AIS Agent")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_ais_agent.png'>";  
        }else if(e.title.indexOf("Parent")>= 0 ){
          partSecondMenuHTML += "<img src='../image/ais/icon/ic_ais_agent.png'>";  
        }
        partSecondMenuHTML += e.title.i18n() + "</span>";
        if(typeof e.thirdmenus !== 'undefined' && e.thirdmenus.length > 0)
            partSecondMenuHTML += that.createThrMenu(e.thirdmenus)
        partSecondMenuHTML += "</li>";
    });
    $(this.secDomNode).append(partSecondMenuHTML);
}

// 二级菜单点击切换操作
CreateMenuLft.prototype.changeSecMenu = function(domNode,objFirName,secIndex){

	if (this.secMenu[objFirName].childMenuPosition == "self") return;
	
    $(".thr-menu-open").removeClass("thr-menu-open")
    $(domNode).next("ul").addClass("thr-menu-open")
    this.nowSecObj = this.secMenu[objFirName].secondmenus[secIndex];
	while(this.nowSecObj == undefined)
	{
		if(secIndex > 20)
		{
			break;
		}
		secIndex++;
		this.nowSecObj = this.secMenu[objFirName].secondmenus[secIndex];
	}
    this.hash.secIndex = secIndex
    this.title.secTitle = this.secMenu[objFirName].secondmenus[secIndex].title.i18n()
    this.changeThrMenu($(domNode).next("ul").children("li").get(0),0)
}
// 渲染三级菜单
CreateMenuLft.prototype.createThrMenu = function(thrMenuObj){
    var partThrMenuHTML = ''
    var menuObjName = this.thisName;
    partThrMenuHTML += '<ul class="thr-menu">'
    thrMenuObj.forEach(function (e,index) {
		var hide="show-none";
		//具体需求：1 开启mesh和bandsteering的情况 隐藏2.4G/5GWiFi   2
		if (  multiAP == "1"){
			//console.log(e.title.i18n()); 
			if (e.title.i18n() == "2.4G Advanced" || e.title.i18n() == "5G Advanced" ){
				// if ( band_steering == "1"){
				// 	partThrMenuHTML += '<li id="sub_third_menu_'+ e.name + '" class="hide_or_not '+ hide +'" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
				// }else{
				 	partThrMenuHTML += '<li id="thr_'+ e.title + '" class="hide_or_not" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
				// }
			}
			/*else if (e.title.i18n() == "Topological Graph" ){
				partThrMenuHTML += '<li  id="sub_third_menu_'+ e.name + '"class="topological_graph" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
			}*/
			else{
				partThrMenuHTML += '<li  id="thr_'+ e.title  + '" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
			}
		}else {
			 /*if (e.title.i18n() == "Topological Graph"){
				partThrMenuHTML += '<li id="sub_third_menu_'+e.name + '" class="topological_graph '+ hide +'" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
			}else*/
			if (e.title.i18n() == "2.4G Advanced" || e.title.i18n() == "5G Advanced" ){
				partThrMenuHTML += '<li id="thr_'+ e.title + '" class="hide_or_not" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
			}else {
				partThrMenuHTML += '<li  id="thr_'+ e.title + '" style=":hover" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')"><span>|</span>' + e.title.i18n() +'</li>';
			}
		}	    
		
		
		// if (  multiAP == "1"){
		// 	if (e.title.i18n() == "2.4G Advanced" || e.title.i18n() == "5G Advanced"   ){
		// 		partThrMenuHTML += '<li class="hide_or_not '+ hide +'" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}else if (e.title.i18n() == "Topological Graph" && multiAP == "1"){
		// 		partThrMenuHTML += '<li class="topological_graph" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}else if (e.title.i18n() == "Topological Graph" && multiAP == "0"){
		// 		partThrMenuHTML += '<li class="topological_graph '+ hide +'" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}else{
		// 		partThrMenuHTML += '<li  onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}
		// }else {
		// 	if (e.title.i18n() == "2.4G Advanced" || e.title.i18n() == "5G Advanced"   ){
		// 		partThrMenuHTML += '<li class="hide_or_not " onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}else if (e.title.i18n() == "Topological Graph"){
		// 		partThrMenuHTML += '<li class="topological_graph '+ hide +'" onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}else {
		// 		partThrMenuHTML += '<li  onclick=" '+ menuObjName + '.changeThrMenu(this,' + index +')">' + e.title.i18n() +'</li>';
		// 	}
		// }	    
    })
    partThrMenuHTML += '</ul>'
    return partThrMenuHTML
}

// 三级菜单点击切换操作
CreateMenuLft.prototype.changeThrMenu = function(domNode,theIndex){
	
	if (!this.nowSecObj.thirdmenus) return;
	if ($(this).hasClass("hide_aaa")){
		return;
	}
    $(".thr-menu-select").removeClass("thr-menu-select")
    $(domNode).addClass("thr-menu-select")
	while(this.nowSecObj.thirdmenus[theIndex] == undefined) {
		theIndex++;
	}
    this.src = this.nowSecObj.thirdmenus[theIndex].src
    this.name = this.nowSecObj.thirdmenus[theIndex].name
    this.title.thrTitle = this.nowSecObj.thirdmenus[theIndex].title.i18n()
    //var title = this.title.firTitle + ' » ' + this.title.secTitle + ' » ' + this.title.thrTitle
   // $(".nav-title").text(title)
    $(".main_iframe").attr("src",this.src)
    this.hash.theIndex = theIndex
    //window.location.hash = '#' + this.hash.menuObjName + '/' + this.name.split("_")[1] + '/' + this.name.split("_")[2]
    gLastOperateTime = new Date().getTime()
}