/**
 * @description 左侧菜单渲染相关逻辑
 * @time 20190312
 * @author scos_fx
 */
var multiAP = "";
var band_steering = "";
var hide;
var operator_name = gOperatorName;
var area_code = gArea_code;
var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
	hasOwn = ({}).hasOwnProperty;
for (var i in {
	toString: 1
}) {
	DONT_ENUM = false;
}

$(document).ready(function() {
	if (operator_name == "BZ_INTELBRAS")// BZ_INTELBRAS
	{
		
		if(gLoginUser == "1")//admin
		{
			if(isFirstloginFlag == "1")
			{
				window.parent.location = "../html/admin_modifypwd_bz_intelbras.html";
			}
		}
		else if(gLoginUser == "0")//user
		{
			if(isFirstloginUserFlag == "1")
			{
				 window.parent.location = "../html/admin_modifypwd_bz_intelbras.html";
			}
		}
	}
	XHR.get("get_multiAP_enable", null, multiInfo);
	XHR.get("get_bandSteering_wlan", null, bandsteeringInfo);
})

function bandsteeringInfo(data) {
	band_steering = data.bandSteering.X_FH_BandSteeringEnable;
}

function multiInfo(data) {
	//alert(JSON.stringify(data));
	multiAP = data.multiAP_enable.Enable;
}

Object.keys = Object.keys || function(obj) {//ecma262v5 15.2.3.14
	var result = [];
	for (var key in obj) if (hasOwn.call(obj, key)) {
		result.push(key);
	}
	if (DONT_ENUM && obj) {
		for (var i = 0; key = DONT_ENUM[i++];) {
			if (hasOwn.call(obj, key)) {
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
		if (typeof callback !== "function") {//callback检查
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
function change_menu_css() {
	$(".sec-menu > li > span").css("background-color","#3C205C")
	$(".fir-menu-open").css("background-color","#3C205C")
	$(".nav-title").css("border-top","3px solid #3C205C")
	$(".sec-menu").css("border-top","3px solid #3C205C")
	$(".fir-menu ul > li").css("background-color","")
	$(".fir-menu-open").css("background-color","#3C205C")
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
	this.changeFirMenu($(this.firDomNode + '>li').get(0), Object.keys(this.firMenu)[0])
	// 模拟点击效果 初始第一个二级菜单
	this.changeSecMenu($('.sec-menu>li:first>span').get(0), Object.keys(this.firMenu)[0], 0)
	// 模拟点击效果 初始第一个三级菜单
	this.changeThrMenu($('.sec-menu>li:first>span+ul>li:first').get(0), 0)

	if(operator_name == "CHL_MP" && area_code == "PRT_LIGAT")
		change_menu_css();
   	

}


// 渲染一级菜单
CreateMenuLft.prototype.createFirMenu = function() {
	var dynamicHTML = "";
	var menuObjName = this.thisName;
	$(this.firDomNode).empty();
	$.each(this.firMenu, function(name, content) {
		var clickFun = menuObjName + ".changeFirMenu(this,'" + name + "')"
		if (name != "awifi") {
			dynamicHTML += '<li  id="first_menu_' + name + '" ';
			dynamicHTML += 'onclick="' + clickFun + '">' + content.title.i18n() + '</li>';
		}
		else if (name == "awifi") {
			if (awifi_switch == "1") {
				dynamicHTML += '<li  id="first_menu_' + name + '" ';
				dynamicHTML += 'onclick="' + clickFun + '">' + content.title.i18n() + '</li>';
			}
		}
	})
	$(this.firDomNode).append(dynamicHTML);


}

// 一级菜单点击切换操作
CreateMenuLft.prototype.changeFirMenu = function(domNode, objName) {
	$(".fir-menu-open").removeClass("fir-menu-open")
	$(domNode).addClass("fir-menu-open")
	this.createSecMenu(objName)
	this.title.firTitle = this.firMenu[objName].title.i18n()
	this.hash.menuObjName = objName
	this.changeSecMenu($('.sec-menu>li:first>span').get(0), objName, 0)
	this.changeThrMenu($('.sec-menu>li:first>span+ul>li:first').get(0), 0)
	if(operator_name == "CHL_MP" && area_code == "PRT_LIGAT")
		change_menu_css()

}

// 渲染二级菜单
CreateMenuLft.prototype.createSecMenu = function(secObjName) {
	var initSecMenuArr = this.secMenu[secObjName].secondmenus;
	var initSecMenuName = secObjName;
	var partSecondMenuHTML = "";
	var menuObjName = this.thisName;
	var that = this
	$(this.secDomNode).empty();
	initSecMenuArr.forEach(function(e, index) {
		partSecondMenuHTML += "<li id='sec_" + e.title + "'" + ">";
		partSecondMenuHTML += "<span id='span_" + e.title + "'";
		partSecondMenuHTML += "onclick='" + menuObjName + ".changeSecMenu(this,\"" + initSecMenuName + "\"," + index + ")'>";
		partSecondMenuHTML += e.title.i18n() + "</span>";
		if (typeof e.thirdmenus !== 'undefined' && e.thirdmenus.length > 0)
			partSecondMenuHTML += that.createThrMenu(e.thirdmenus)
		partSecondMenuHTML += "</li>";
	});
	$(this.secDomNode).append(partSecondMenuHTML);
}

// 二级菜单点击切换操作
CreateMenuLft.prototype.changeSecMenu = function(domNode, objFirName, secIndex) {
	if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
		$(".sec-menu-select").removeClass("sec-menu-select");
		$(domNode).addClass("sec-menu-select");
	}
	$(".thr-menu-open").removeClass("thr-menu-open")
	$(domNode).next("ul").addClass("thr-menu-open")
	this.nowSecObj = this.secMenu[objFirName].secondmenus[secIndex];
	while (this.nowSecObj == undefined) {
		if (secIndex > 20) {
			break;
		}
		secIndex++;
		this.nowSecObj = this.secMenu[objFirName].secondmenus[secIndex];
	}
	this.hash.secIndex = secIndex
	this.title.secTitle = this.secMenu[objFirName].secondmenus[secIndex].title.i18n()
	this.changeThrMenu($(domNode).next("ul").children("li").get(0), 0)
	
	if(operator_name == "CHL_MP" && area_code == "PRT_LIGAT")
		change_menu_css();
   	
}
// 渲染三级菜单
CreateMenuLft.prototype.createThrMenu = function(thrMenuObj) {
	var partThrMenuHTML = ''
	var menuObjName = this.thisName;
	partThrMenuHTML += '<ul class="thr-menu">'
	thrMenuObj.forEach(function(e, index) {
		var hide = "show-none";
		//具体需求：1 开启mesh和bandsteering的情况 隐藏2.4G/5GWiFi   2
		if (multiAP == "1") {
			if (e.name == "status_topo_info") {
				partThrMenuHTML += '<li id="thr_' + e.title + '" ';
				partThrMenuHTML += 'class="topological_graph" onclick=" ' + menuObjName + '.changeThrMenu(this,' + index + ')">' + e.title.i18n() + '</li>';
			} else {
				partThrMenuHTML += '<li id="thr_' + e.title + '" ';
				partThrMenuHTML += 'onclick=" ' + menuObjName + '.changeThrMenu(this,' + index + ')">' + e.title.i18n() + '</li>';
			}

		} else {
			if (e.name == "status_topo_info") {
				partThrMenuHTML += '<li id="thr_' + e.title + '" ';
				partThrMenuHTML += 'class="topological_graph ' + hide + '" onclick=" ' + menuObjName + '.changeThrMenu(this,' + index + ')">' + e.title.i18n() + '</li>';
			} else {
				partThrMenuHTML += '<li  id="thr_' + e.title + '" ';
				partThrMenuHTML += 'onclick=" ' + menuObjName + '.changeThrMenu(this,' + index + ')">' + e.title.i18n() + '</li>';
			}
		}
	})
	partThrMenuHTML += '</ul>'
	return partThrMenuHTML
}

// 三级菜单点击切换操作
CreateMenuLft.prototype.changeThrMenu = function(domNode, theIndex) {
	if ($(this).hasClass("hide_aaa")) {
		return;
	}
	$(".thr-menu-select").removeClass("thr-menu-select")
	$(domNode).addClass("thr-menu-select")
	while (this.nowSecObj.thirdmenus[theIndex] == undefined) {
		theIndex++;
	}
	this.src = this.nowSecObj.thirdmenus[theIndex].src
	this.name = this.nowSecObj.thirdmenus[theIndex].name
	this.title.thrTitle = this.nowSecObj.thirdmenus[theIndex].title.i18n()
	var title = this.title.firTitle + ' » ' + this.title.secTitle + ' » ' + this.title.thrTitle
	$(".nav-title").text(title)
	$(".main_iframe").attr("src", this.src)
	this.hash.theIndex = theIndex
	//window.location.hash = '#' + this.hash.menuObjName + '/' + this.name.split("_")[1] + '/' + this.name.split("_")[2]
	gLastOperateTime = new Date().getTime()
	if(operator_name == "CHL_MP" && area_code == "PRT_LIGAT")
		change_menu_css();
   	
}