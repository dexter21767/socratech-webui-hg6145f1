$(document).ready(function(){
    var bodyHtml = $("body").html();
    bodyHtml = bodyHtml.replace(/<fh-fo-rm/g,'<form').replace(/<\/fh-fo-rm/g,'</form');
    $("body").html(bodyHtml);
	if(gNewUiFlag){
		$(".input_text").bind("mouseenter",function(){
			if($("#tip_"+this.id).length > 0){
				document.getElementById("tip_"+this.id).style.visibility = "visible";
			}
		});
		$(".input_text").bind("mouseleave",function(){
			if($("#tip_"+this.id).length > 0){
				document.getElementById("tip_"+this.id).style.visibility = "hidden";
			}
		});
		$(".cancel_icon").bind("click",function(){
			$("#fw_config_form").hide()
			$("#loading_div").hide();
			$(window.parent.document).find("#loading_window_div4").hide();
			$(window.parent.document).find("#loading_window_div5").hide();
		});
		$(".add_button").bind("click",function(){
			$(".input_text").each(function(i) {
				$(this).removeClass("main_item_error_hint")
			});
			$(".main_item_error_hint").each(function(i) {
				$(this).remove()
			});
		});
	}
})
function isIE7Browser() {
	if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i) == "7.") {
		return true;
	} else {
		return false;
	}
}
function selectAll() {
    if($("#checkAll").prop("checked")){
        $("input[name='fw_remove_flag']").prop("checked",true)
    }else{
        $("input[name='fw_remove_flag']").prop("checked",false)
    }
}
function removeError() {
	$(".input_text").each(function(i) {
        $(this).removeClass("main_item_error_hint")
    });
    $(".main_item_error_hint").each(function(i) {
        $(this).remove()
    });
}

function judedNavation() {
	if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/6./i) == "6.") {
		return 6;
	} else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i) == "7.") {
		return 7;
	} else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.") {
		return 8;
	} else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == "9.") {
		return 9;
	} else {
		return 10;
	}
}

/*add by yjshao-----------------start---------------------------*/
function fiberlog() {
	if (window["console"] && arguments && arguments.length > 0) {
		var message = '';
		for (var i = 0; i < arguments.length; i++) {
			if (message == '') {
				message = arguments[i];
			} else {
				message = message + ' ' + arguments[i];
			}
		}
		console.log(message);
	}
}
/*add by yjshao-----------------end-----------------------------*/

function createInput(id, name, placeholder, maxlength, type, value) {
	var inputObj = "<input ";
	if (id != "" && id != "undefined") {
		inputObj += "id='" + id + "' ";
	}
	if (name != "" && name != "undefined") {
		inputObj += "name='" + name + "' ";
	}
	if (placeholder != "" && placeholder != "undefined") {
		inputObj += "placeholder='" + placeholder + "' ";
	}
	if (maxlength != "" && maxlength != "undefined") {
		inputObj += "maxlength='" + maxlength + "' ";
	}
	inputObj += "type='" + type + "' ";
	inputObj += "value='" + value + "' ";
	inputObj += ">";
	return inputObj;
}

function inputBindFocus() {
	$("input[type='password'], .password_content input[type='text']").bind("focusin", function() {
		$(this).eq(0).addClass("password_content_focus");
		if (!$(this).next().hasClass("password_switch_eyeon")) {
			$(this).next().addClass("password_switch_focus");
		}
	});
	$("input[type='password'], .password_content input[type='text']").bind("focusout", function() {
		$(this).eq(0).removeClass("password_content_focus");
		$(this).next().removeClass("password_switch_focus");
	});
}

function customSwitchInit() {
	$(".switch_content").bind("click", function() {
		if ($(this).hasClass("switch_content_on")) {
			$(this).removeClass("switch_content_on");
			$(this).addClass("switch_content_off");
			//$("#" + $(".switch_content").attr("id") + "_value").val(0);
			$(this).children("input").val(0);
		} else {
			$(this).addClass("switch_content_on");
			$(this).removeClass("switch_content_off");
			//$("#" + $(".switch_content").attr("id") + "_value").val(1);
			$(this).children("input").val(1);
		}
		fiberlog($(this).children("input").val());
	});
}

function customSelectInit() {
	$(".dropdown-select").bind("click", function() {
		if ($(this).hasClass("select-open")) {
			$(this).removeClass("select-open");
		} else {
			$(this).addClass("select-open");
		}
	});

	$(".dropdown-select").focusout(function() {
		if ($(this).hasClass("select-open")) {
			$(this).removeClass("select-open");
		}
	});

	$(".dropdown-menu-select li").click(function() {
		$(this).parent().siblings("label").first().text($(this).text());
		$("#" + $(this).parent().attr("id") + "_value").val($(this).attr("livalue"));
	});
}

function customPasswordInit() {
	inputBindFocus();
	$(".password_switch").bind("click", function() {
		if ($(this).css("background-image").indexOf("eye_close") > -1) {
			$(this).removeClass("password_switch_unfocus");
			$(this).removeClass("password_switch_focus");
			$(this).addClass("password_switch_eyeon");
		} else {
			$(this).removeClass("password_switch_eyeon");
			$(this).addClass("password_switch_unfocus");
		}

		if (9 > judedNavation()) {
			var $pwdInput = $(this).parent(".password_content").find("input");
			if ($pwdInput.attr("type").indexOf("password") != -1) {
				var inputStr = createInput($pwdInput.attr("id"), $pwdInput.attr("name"), $pwdInput.attr("placeholder"), $pwdInput
					.attr("maxlength"), "text", $pwdInput.val());
				$pwdInput.replaceWith($(inputStr));
			} else {
				var inputStr = createInput($pwdInput.attr("id"), $pwdInput.attr("name"), $pwdInput.attr("placeholder"), $pwdInput
					.attr("maxlength"), "password", $pwdInput.val());
				$pwdInput.replaceWith($(inputStr));
			}
		} else {
			var $pwd_input = $(this).parent(".password_content").find("input");
			if ($pwd_input.attr("type") == "password") {
				$pwd_input[0].type = "text";
			} else if ($pwd_input.attr("type") == "text") {
				$pwd_input[0].type = "password";
			} else {
				$pwd_input[0].type = "password";
			}
		}
		inputBindFocus();
	});
}

function customScrollBar(ele) {
	//todo, if cu ,just let go
	return;
	// 需要单独处理IE7的滚动
	// fiberlog(judedNavation());
	if (8 > judedNavation()) //IE7
	{
		$(ele).css("overflow-x", "hidden");
		$(ele).css("overflow-y", "auto");
		return;
	}

	$(ele).niceScroll({
		cursorcolor: "#f18e1f",
		cursoropacitymin: 1,
		cursoropacitymax: 1,
		touchbehavior: false,
		cursorwidth: "5px",
		cursorborder: "0",
		cursorborderradius: "5px"
	});
}

//显示loading框
function showOrHideLoadingWindow(action) {
	if (action == "show") {
		$("#loading_window_div").show();
	} else {
		$("#loading_window_div").hide();
	}
}

function showOrHideLoadingWindowFromIframe(action) {
	if (action == "show") {
		$("#loading_window_div", window.parent.document).show();
	} else {
		$("#loading_window_div", window.parent.document).hide();
	}
}

function isLetterornumber(s) { //是否为字母或者数字或者_
	if (s == "") {
		return false;
	}
	var re = /^[A-Za-z0-9\_]*$/g;
	return re.test(s);
}

//[floor,top]
function isValidNumberRange(number, floor, top) {
	if (!number)
		return false;

	if (0 != number % 1) //20140214 number must be an integer
		return false;
	if (isNaN(number) || number < floor || number > top)
		return false;

	return true;
}

function isValidAscii(val)
{
    for ( var i = 0 ; i < val.length ; i++ )
    {
        var ch = val.charAt(i);
        if ( ch < ' ' || ch > '~' )
        {
            return ch;
        }
    }
    return '';
}

function isHexaDigit(digit) {
	var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
		"A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
	var len = hexVals.length;
	var i = 0;
	var ret = false;

	for (i = 0; i < len; i++)
		if (digit == hexVals[i]) break;

	if (i < len)
		ret = true;

	return ret;
}

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1,
        -1, -1, -1, -1);
		
function Base64Encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function Base64Decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function ConvertHexToBase64(value)
{
    var hexstr;
    var hexvalue;
    var inflow;
    inflow = "";
    var temp;    
   
    if ((value.length)%2 == 1)
    {
	temp = '0' + value;
    }
    else
    {
        temp = value;
    }
    for(var i = 0; i < temp.length/2; i++)
    {
        hexstr = temp.substr(i*2, 2);
        hexvalue = parseInt(hexstr, 16);
        inflow += String.fromCharCode(hexvalue);  
    }
    
    var out = Base64Encode(inflow);
    
    return out;      
}


function ConvertBase64ToHex(value)
{
    var inflow = Base64Decode(value);
    var out;
    out = "";
    
    for (var i = 0; i < inflow.length; i++)
    {
        var temp = inflow.charCodeAt(i).toString(16);
        if (temp.length == 1)
        {
            out += '0' + temp;
        }
        else
        {
           out += temp;
        }     
    }
    
    return out;
}

function isValidBase64(value)
{
	if((value.length)%4 != 0 )
	{
		return false;
	}
	
	var List = value.split('=');
	if(List.length > 3)
	{
		return false;
	}
	if(List.length == 2)
	{
		if(!(List[1] == ""))
		{
			return false;
		}
	}
	if(List.length == 3)
	{
		if(!(List[1] == "" && List[2] == ""))
		{
			return false;
		}
	}
	
    for (var i = 0; i < value.length; i++)
    {
    	var ch = value.charAt(i);
    	
    	var find = false;
    	for (var j = 0; j < base64EncodeChars.length; j++)
    	{
    	    if ((ch == base64EncodeChars.charAt(j)) || (ch == '='))
    	    {
    	        find = true;
    	        break;
    	    }
    	}
    	
    	if (find == false)
    	    return false;
    
    }
	
	var TempHex;
	var TempBase64;
	TempHex = ConvertBase64ToHex(value);
	TempBase64 = ConvertHexToBase64(TempHex);
	if(TempBase64 != value)
	{
		return false;
	}
    
    return true;
}

function isValidKey(val, size) {
	var ret = false;
	var len = val.length;
	var dbSize = size * 2;

	if (len == size)
		ret = true;
	else if (len == dbSize) {
		for (i = 0; i < dbSize; i++)
			if (isHexaDigit(val.charAt(i)) == false)
				break;
		if (i == dbSize)
			ret = true;
	} else
		ret = false;

	return ret;
}


function isValidHexKey(val, size) {
	var ret = false;
	if (val.length == size) {
		for (i = 0; i < val.length; i++) {
			if (isHexaDigit(val.charAt(i)) == false) {
				break;
			}
		}
		if (i == val.length) {
			ret = true;
		}
	}

	return ret;
}


function isNameUnsafe(compareChar) {
	var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.: \t";

	if (unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32 &&
		compareChar.charCodeAt(0) < 123)
		return false; // found no unsafe chars, return false
	else
		return true;
}

// Check if a name valid
function isValidName(name) {
	var i = 0;

	for (i = 0; i < name.length; i++) {
		if (isNameUnsafe(name.charAt(i)) == true)
			return false;
	}

	return true;
}

// same as is isNameUnsafe but allow spaces
function isCharUnsafe(compareChar) {
	var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.:\t";

	if (unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) >= 32 &&
		compareChar.charCodeAt(0) < 123)
		return false; // found no unsafe chars, return false
	else
		return true;
}

function isValidNameWSpace(name) {
	var i = 0;

	for (i = 0; i < name.length; i++) {
		if (isCharUnsafe(name.charAt(i)) == true)
			return false;
	}

	return true;
}

function isSameSubNet(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {

	var count = 0;

	lan1a = lan1Ip.split('.');
	lan1m = lan1Mask.split('.');
	lan2a = lan2Ip.split('.');
	lan2m = lan2Mask.split('.');

	for (i = 0; i < 4; i++) {
		l1a_n = parseInt(lan1a[i]);
		l1m_n = parseInt(lan1m[i]);
		l2a_n = parseInt(lan2a[i]);
		l2m_n = parseInt(lan2m[i]);
		if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
			count++;
	}
	if (count == 4)
		return true;
	else
		return false;
}

function isSameSubNetVer2(srcaddr1, mask, endsrcaddr1, mask) {
	pArray1 = srcaddr1.split(".");
	pArray2 = endsrcaddr1.split(".");
	if ((pArray1[0] == pArray2[0]) && (pArray1[1] == pArray2[1]) && (pArray1[2] == pArray2[2])) {
		return true;
	} else {
		return false;
	}
}

function valid_Range_Int(val, min, max) {
	if (val >= min && val <= max && /^-?\d+$/.test(val) && !/^-0/.test(val) && !/^0\d+$/.test(val)) {
		return true;
	}

	return false;
}

function isValidIpAddress(address) {
	if (address == "0.0.0.0") {
		return false;
	}
	if(address.indexOf(" ") >= 0){
		return false;
	}
	ipParts = address.split('/');
	if (ipParts.length > 2) return false;
	if (ipParts.length == 2) {
		num = parseInt(ipParts[1]);
		if (num <= 0 || num > 32)
			return false;
	}

	addrParts = ipParts[0].split('.');
	if (addrParts.length != 4) return false;

	for (i = 0; i < 4; i++) {
		if(addrParts[i].indexOf("0") == 0 && addrParts[i].length > 1)
			return false;
		if (isNaN(addrParts[i]) || addrParts[i] == "")
			return false;
		num = parseInt(addrParts[i]);
		if (num < 0 || num > 255)
			return false;
	}

	return true;
}

/*add by zhangbin,20201117,reason:check ip address last value is 0 or 255*/
function check_ip_last_value(ipvalue)
{
	var lanipArray = new Array();
	for (var i = 0; i < 4; i++)
   	{
        lanipArray[i] = ipvalue.split(".")[i];
	}
	
	if(lanipArray[3] == 0 || lanipArray[3] == 255)
	{
		return false;
	}
	return true;
}


function isValidIpv6PrefixAddress(address) {
	return /([0-9a-fA-F]{1,4}:){1,7}:/.test(address);
}

//将IPv6地址分割成容量为8的数组，::省略的部分用0填充
function splitIPv6AddressToArray(addr) 
{
    var parts = new Array(8);
	var len = 0;
    if (-1 == addr.indexOf('::')) {
        parts = addr.split(':');
        for (var i = 0; i < 8; i++) {
            if (isNullString(parts[i])) {
                parts[i] = '0';
            }
        }
    } else {
        var twopart = addr.split('::');
        var parts1 = twopart[0].split(':');
        var parts2 = twopart[1].split(':');
        var index = 0;
        for (var i = 0; i < parts1.length; i++) {
            parts[index] = parts1[i];
            index++;
        }
        for (var m = 0; m < (8 - parts1.length - parts2.length); m++) {
            parts[index] = '0';
            index++;
        }
        var startIndex = 8 - parts2.length;
        for (var j = startIndex; j < 8; j++) {
            parts[index] = parts2[j - startIndex];
            index++;
        }
    }
    return parts;
}

function isValidIPv6AddressRange(minAddr, maxAddr) 
{
    var minAddrParts = splitIPv6AddressToArray(minAddr);
    var maxAddrParts = splitIPv6AddressToArray(maxAddr);
    var sameCount = 0;
    for (var i = 0; i < 8; i++) {
        var minPart = parseInt(minAddrParts[i], 16);
        var maxPart = parseInt(maxAddrParts[i], 16);
        if (minPart < maxPart) {
            return true;
        } else if (minPart == maxPart) {
            sameCount++;
        } else {
            return false;
        }
    }
    return sameCount >= 8;
}

//校验IPV6地址池里IP合法性（addrFieldNum为地址池IP段数）
function isValidIPv6AddrOfPool(addr, addrFieldNum) 
{
    var parts = new Array();
	var len = 0;
	var num = 0;
	var space = 0;
    if (-1 == addr.indexOf('::')) {
        parts = addr.split(':');
		len = parts.length;
        if(len != addrFieldNum)
			return false;
		else
		{
			for (var i = 0; i < len; i++)
			{
				if (parts[i] != "" && isValidHexKey(parts[i], parts[i].length))
					num = parseInt(parts[i], 16);
				else {
					space++;
					if (space > 1)
						return false;
					continue;
				}

				if (num > 0xffff || num < 0) {
					return false;
				}
			}
			return true;
		}
    } else {
        return false;
    }
}
//校验验IPV6地址池里IP范围合法性（addrFieldNum为地址池IP段数）
function isValidIPv6AddrPoolRange(minAddr, maxAddr, addrFieldNum) 
{	
    var minAddrParts = minAddr.split(':');
    var maxAddrParts = maxAddr.split(':');

    for (var i = 0; i < addrFieldNum; i++) {
        var minPart = parseInt(minAddrParts[i], 16);
        var maxPart = parseInt(maxAddrParts[i], 16);
        if (minPart < maxPart) {
            return true;
        } else if (minPart > maxPart) {
            return false;
        }
    }
	return true;
}

function isValidIpv6AddressRegexp(str) {
	if (null == str.match(/:/g))
		return false;

	return str.match(/:/g).length <= 7 &&
		/::/.test(str) ?
		/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str) :
		/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
}

function isIPv6(str) {
	return str.match(/:/g).length <= 7 &&
		/::/.test(str) ?
		/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str) :
		/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
}

function isValidIpv6PrefixAddressV2(prefix) {
	return /([0-9a-fA-F]{1,4}:){1,4}:\/64/.test(prefix);
}


//判断一个字符串中每个字符是否都在0~9或者a~f或者A~F之间
function isHexStr(str){
	var newStr = "";
	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);
		if ((c <= 9 && c >= 0) || (c <= 'f' && c >= 'a') || (c <= 'F' && c >= 'A')) {
			newStr += c;
		}
	}
	return str == newStr;
}

function isValidIpAddress6(address) {
	if(address.indexOf(" ") == 0){
		return false;
	}
	ipParts = address.split('/');
	if (ipParts.length > 2) return false;
	if (ipParts.length == 2) {
		num = parseInt(ipParts[1]);
		if (num <= 0 || num > 128)
			return false;
	}

	addrParts = ipParts[0].split(':');
	if (addrParts.length < 3 || addrParts.length > 8)
		return false;
	for (i = 0; i < addrParts.length; i++) {
		if (addrParts[i] != ""){
			if(isHexStr(addrParts[i])){
				num = parseInt(addrParts[i], 16);
			}else{
				return false;
			}
		}
		if (i == 0) {
			//         if ( (num & 0xf000) == 0xf000 )
			//            return false;	//can not be link-local, site-local or multicast address
		} else if ((i + 1) == addrParts.length) {
			if (num == 0 || num == 1)
				return false; //can not be unspecified or loopback address
		}
		if (num != 0)
			break;
	}
	return true;
}

function isValidPrefixLength(prefixLen) {
	var num;

	num = parseInt(prefixLen);
	if (isNaN(num) || num <= 0 || num > 128)
		return false;
	return true;
}

function areSamePrefix(addr1, addr2) {
	var i, j;
	var a = [0, 0, 0, 0, 0, 0, 0, 0];
	var b = [0, 0, 0, 0, 0, 0, 0, 0];

	addr1Parts = addr1.split(':');
	if (addr1Parts.length < 3 || addr1Parts.length > 8)
		return false;
	addr2Parts = addr2.split(':');
	if (addr2Parts.length < 3 || addr2Parts.length > 8)
		return false;
	j = 0;
	for (i = 0; i < addr1Parts.length; i++) {
		if (addr1Parts[i] == "") {
			if ((i != 0) && (i + 1 != addr1Parts.length)) {
				j = j + (8 - addr1Parts.length + 1);
			} else {
				j++;
			}
		} else {
			a[j] = parseInt(addr1Parts[i], 16);
			j++;
		}
	}
	j = 0;
	for (i = 0; i < addr2Parts.length; i++) {
		if (addr2Parts[i] == "") {
			if ((i != 0) && (i + 1 != addr2Parts.length)) {
				j = j + (8 - addr2Parts.length + 1);
			} else {
				j++;
			}
		} else {
			b[j] = parseInt(addr2Parts[i], 16);
			j++;
		}
	}
	//only compare 64 bit prefix
	for (i = 0; i < 4; i++) {
		if (a[i] != b[i]) {
			return false;
		}
	}
	return true;
}

function getLeftMostZeroBitPos(num) {
	var i = 0;
	var numArr = [128, 64, 32, 16, 8, 4, 2, 1];

	for (i = 0; i < numArr.length; i++)
		if ((num & numArr[i]) == 0)
			return i;

	return numArr.length;
}

function getRightMostOneBitPos(num) {
	var i = 0;
	var numArr = [1, 2, 4, 8, 16, 32, 64, 128];

	for (i = 0; i < numArr.length; i++)
		if (((num & numArr[i]) >> i) == 1)
			return (numArr.length - i - 1);

	return -1;
}

function isValidSubnetMask(mask) {
	reg =
		/^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/;
	return reg.test(mask);
}

function isValidSubnetMask2(mask) {
	reg =
		/^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/;
	return reg.test(mask);
}


function isValidPortRange(port) {
	var fromport = 0;
	var toport = 100;

	portrange = port.split(':');
	if (portrange.length < 1 || portrange.length > 2) {
		return false;
	}
	if (isNaN(portrange[0]))
		return false;
	fromport = parseInt(portrange[0]);

	if (portrange.length > 1) {
		if (isNaN(portrange[1]))
			return false;
		toport = parseInt(portrange[1]);
		if (toport <= fromport)
			return false;
	}

	if (fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535)
		return false;

	return true;
}

function isValidNatPort(port) {
	var fromport = 0;
	var toport = 100;

	portrange = port.split('-');
	if (portrange.length < 1 || portrange.length > 2) {
		return false;
	}
	if (isNaN(portrange[0]))
		return false;
	fromport = parseInt(portrange[0]);

	if (portrange.length > 1) {
		if (isNaN(portrange[1]))
			return false;
		toport = parseInt(portrange[1]);
		if (toport <= fromport)
			return false;
	}

	if (fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535)
		return false;

	return true;
}

function isValidMacAddress(macAddress) {
	var pattMac = /^([0-9a-fA-F]{2})(([:][0-9a-fA-F]{2}){5})$/;
	return pattMac.test(macAddress);
}

/*function isValidMacAddress(address) {
   var c = '';
   var num = 0;
   var i = 0, j = 0;
   var zeros = 0;

   addrParts = address.split(':');
   if ( addrParts.length != 6 ) return false;

   for (i = 0; i < 6; i++) {
      if ( addrParts[i] == '' )
         return false;
      for ( j = 0; j < addrParts[i].length; j++ ) {
         c = addrParts[i].toLowerCase().charAt(j);
         if ( (c >= '0' && c <= '9') ||
              (c >= 'a' && c <= 'f') )
            continue;
         else
            return false;
      }

      // num = parseInt(addrParts[i], 16);
      // if ( num == NaN || num < 0 || num > 255 )
         // return false;
      // if ( num == 0 )
         // zeros++;
   }
   // if (zeros == 6)
      // return false;
      
   // if ( parseInt(addrParts[0], 16) & 1 )	  
      // return false;

   return true;
}*/

var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"A", "B", "C", "D", "E", "F");
var unsafeString = "\"<>%\\^[]`\+\$\,'#&";
// deleted these chars from the include list ";", "/", "?", ":", "@", "=", "&" and #
// so that we could analyze actual URLs

function isUnsafe(compareChar)
// this function checks to see if a char is URL unsafe.
// Returns bool result. True = unsafe, False = safe
{
	if (unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32 &&
		compareChar.charCodeAt(0) < 123)
		return false; // found no unsafe chars, return false
	else
		return true;
}

function decToHex(num, radix)
// part of the hex-ifying functionality
{
	var hexString = "";
	while (num >= radix) {
		temp = num % radix;
		num = Math.floor(num / radix);
		hexString += hexVals[temp];
	}
	hexString += hexVals[num];
	return reversal(hexString);
}

/*****************************************************************************
check_Special_char
fengshuo20191204
*****************************************************************************/
function check_Special_char(char, str) {
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) == char) {
			return true;
		}
	}
	return false;
}

/*****************************************************************************
checkSpecialChar
fengshuo20191204
检查密码中是否有8,B,I,l,0,O,L,i,1
*****************************************************************************/
function check_password_special_char(str) {
	var arr = ["8", "B", "I", "l", "0", "O", "L", "i", "1"];
	for (var i = 0; i < str.length; i++) {
		for (var j = 0; j < arr.length; j++) {
			if (str.charAt(i) == arr[j]) {
				return false;
			}
		}
	}
	return true;
}

function reversal(s)
// part of the hex-ifying functionality
{
	var len = s.length;
	var trans = "";
	for (i = 0; i < len; i++)
		trans = trans + s.substring(len - i - 1, len - i);
	s = trans;
	return s;
}

function convert(val)
// this converts a given char to url hex form
{
	return "%" + decToHex(val.charCodeAt(0), 16);
}


function encodeUrl(val) {
	var len = val.length;
	var i = 0;
	var newStr = "";
	var original = val;

	for (i = 0; i < len; i++) {
		if (val.substring(i, i + 1).charCodeAt(0) < 255) {
			// hack to eliminate the rest of unicode from this
			if (isUnsafe(val.substring(i, i + 1)) == false)
				newStr = newStr + val.substring(i, i + 1);
			else
				newStr = newStr + convert(val.substring(i, i + 1));
		} else {
			// woopsie! restore.
			alert("Found a non-ISO-8859-1 character at position: " + (i + 1) + ",\nPlease eliminate before continuing.");
			newStr = original;
			// short-circuit the loop and exit
			i = len;
		}
	}

	return newStr;
}

var markStrChars = "\"'";

// Checks to see if a char is used to mark begining and ending of string.
// Returns bool result. True = special, False = not special
function isMarkStrChar(compareChar) {
	if (markStrChars.indexOf(compareChar) == -1)
		return false; // found no marked string chars, return false
	else
		return true;
}

// use backslash in front one of the escape codes to process
// marked string characters.
// Returns new process string
function processMarkStrChars(str) {
	var i = 0;
	var retStr = '';

	for (i = 0; i < str.length; i++) {
		if (isMarkStrChar(str.charAt(i)) == true)
			retStr += '\\';
		retStr += str.charAt(i);
	}

	return retStr;
}

// Web page manipulation functions

function showhide(element, sh) {
	var status;
	if (sh == 1) {
		status = "block";
	} else {
		status = "none";
	}

	if (document.getElementById) {
		// standard
		document.getElementById(element).style.display = status;
	} else if (document.all) {
		// old IE
		document.all[element].style.display = status;
	} else if (document.layers) {
		// Netscape 4
		document.layers[element].display = status;
	}
}

// Load / submit functions

function getSelect(item) {
	var idx;
	if (item.options.length > 0) {
		idx = item.selectedIndex;
		return item.options[idx].value;
	} else {
		return '';
	}
}

function setSelect(item, value) {
	for (i = 0; i < item.options.length; i++) {
		if (item.options[i].value == value) {
			item.selectedIndex = i;
			break;
		}
	}
}

function setDisable(item, value) {
	if (value == 1 || value == '1') {
		item.disabled = true;
	} else {
		item.disabled = false;
	}
}

function isHexaDigit(digit) {
	var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
		"A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
	var len = hexVals.length;
	var i = 0;
	var ret = false;

	for (i = 0; i < len; i++)
		if (digit == hexVals[i]) break;

	if (i < len)
		ret = true;

	return ret;
}

function isInValidDhcpPool(lan1StartIp, lan1EndIp, lan2StartIp, lan2EndIp) {
	lan1addrEnd = lan1EndIp.split('.');
	lan1addrStart = lan1StartIp.split('.');
	lan2addrEnd = lan2EndIp.split('.');
	lan2addrStart = lan2StartIp.split('.');
	E1 = parseInt(lan1addrEnd[3]) + 1;
	S1 = parseInt(lan1addrStart[3]) + 1;
	E2 = parseInt(lan2addrEnd[3]) + 1;
	S2 = parseInt(lan2addrStart[3]) + 1;

	if (E1 > S2 && E1 < E2)
		return false;
	if (S1 > S2 && S1 < E2)
		return false;
	if (S2 > S1 && S2 < E1)
		return false;
	if (E2 > S1 && E2 < E1)
		return false;
	return true;
}

function isValidIpAddress_dhcpDevice(address) {
	var i = 0;

	if (address == '255.255.255.255')
		return false;

	addrParts = address.split('.');
	if (addrParts.length != 4) return false;
	for (i = 0; i < 4; i++) {
		if (isNaN(addrParts[i]) || addrParts[i] == "")
			return false;
		num = parseInt(addrParts[i]);
		if (num < 0 || num > 255)
			return false;
	}
	return true;
}

function isValidDigit(digit) {
	var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
	var len = hexVals.length;
	var i = 0;
	var ret = false;

	for (i = 0; i < len; i++)
		if (digit == hexVals[i]) break;

	if (i < len)
		ret = true;

	return ret;
}

function isValidServerPort(val) {
	var ret = false;
	var max = 65535;
	var min = 0;
	var i = 0;

	if ((val.length > 1) && (val.charAt(0) == '0')) {
		return false;
	}

	for (i; i < val.length; i++) {
		if (isValidDigit(val.charAt(i)) == false)
			break;
	}
	if (i == val.length) {
		ret = true;
	}

	if (ret == true) {
		if ((val <= max) && (val >= min))
			ret = true;
		else
			ret = false;
	}

	return ret;
}

function isValidValue(val) {
	var ret = false;
	var min = 0;
	var i = 0;

	if ((val.length > 1) && (val.charAt(0) == '0')) {
		return false;
	}

	for (i; i < val.length; i++) {
		if (isValidDigit(val.charAt(i)) == false)
			break;
	}
	if (i == val.length) {
		ret = true;
	}

	if (ret == true) {
		if (val > min) {
			ret = true;
		} else {
			ret = false;
		}
	}
	return ret;
}

function isSameSubNet(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {

	var count = 0;

	lan1a = lan1Ip.split('.');
	lan1m = lan1Mask.split('.');
	lan2a = lan2Ip.split('.');
	lan2m = lan2Mask.split('.');

	for (i = 0; i < 4; i++) {
		var l1a_n = parseInt(lan1a[i], 10);
		var l1m_n = parseInt(lan1m[i], 10);
		var l2a_n = parseInt(lan2a[i], 10);
		var l2m_n = parseInt(lan2m[i], 10);

		if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
			count++;
	}
	if (count == 4)
		return true;
	else
		return false;
}

function isNumber(val) {
	var len = val.length;
	var sign = 0;

	for (var i = 0; i < len; ++i) {
		if ((val.charAt(i) == '-') && (sign == 0)) {
			sign = 1;
			continue;
		}

		if ((val.charAt(i) > '9') ||
			(val.charAt(i) < '0')) {
			return false;
		}
		sign = 1;
	}

	return true;
}

function IsNotDigit(fData) {
	var i;

	for (i = 0; i < fData.length; i++) {
		if (!(fData.charAt(i) >= '0' && fData.charAt(i) <= '9'))
			return true;
	}

	return false;
}

function isValidNetMask(address) {

	ipParts = address.split('/');
	if (ipParts.length > 2) return false;
	if (ipParts.length == 2) {
		num = parseInt(ipParts[1]);
		if (num <= 0 || num > 32)
			return false;
	}

	if (ipParts[0] == '0.0.0.0' ||
		ipParts[0] == '255.255.255.255')
		return false;

	addrParts = ipParts[0].split('.');
	if (addrParts.length != 4) return false;
	for (i = 0; i < 4; i++) {
		if (isNaN(addrParts[i]) || addrParts[i] == "")
			return false;
		num = parseInt(addrParts[i]);
		if (num < 0 || num > 255)
			return false;
	}
	return true;
}

function checkIPorURL(str) {
	if (str != "") //IP地址或域名
	{
		if (!isValidIpAddress(str) && !validateDomain(str)) {
			return false;
		} else {
			return true;
		}
	}
	return true;
}

function checkIPv6orURL(str){
	if (str != "") //IP地址或域名
	{
		if (!isValidIpv6Address(str) && !validateDomain(str)) {
			return false;
		} else {
			return true;
		}
	}
	return true;
}

function validate_ipv6_url(str)
{
	 var strRegex = "^((https|http)?://)"
				+ "(\\[)" //[
				+ "(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))"
				+ "|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|"
				+ "((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|"
				+ "((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|"
				+ "((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|"
				+ "((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)"
				+ "(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)" //IPv6 IP
				+ "(\\])"// ]
				+ "(:[0-9]{1,5})?" // port  :80
				+ "((/?)|" // a slash isn't required if there is no file name
				+ "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";
	var re=new RegExp(strRegex);
	if (re.test(str))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function checkIPorURL_PLDT(str) {
	var url_list = ["qcysbc.ftth.pldt.net", "lcnsbc.ftth.pldt.net", "dvosbc.ftth.pldt.net", "spcsbc.ftth.pldt.net",
		"jupc5.ftth.pldt.net", "spcc5.ftth.pldt.net", "dvoc5.ftth.pldt.net"
	];
	if (str != "") //IP地址或域名
	{
		if (url_list.indexOf(str) > -1) {
			return true;
		}
		if (!isValidIpAddress(str) && !validateDomain(str)) {
			return false;
		} else {
			return true;
		}
	}
	return true;
}

function validateURL(url) {
	var strRegex = "^((https|http|ftp|rtsp|mms)?://){0,1}"
		/* modify by wuxj, 20110617, URL must start with:// */
		//        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"  //ftp user@
		+
		"(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //ftp user@
		+
		"(([0-9]{1,3}.){3}[0-9]{1,3}" // IP kind of URL- 199.194.52.184
		+
		"|" // 允许IP和DOMAIN
		+
		"([0-9a-zA-Z_!~*'()-]+.)*" // domain - www.
		+
		"([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]." // second level domain
		+
		"[a-zA-Z]{2,6})" // first level domain- .com or .museum
		+
		"(:[0-9]{1,5})?" // port  :80
		+
		"((/?)|" // a slash isn't required if there is no file name
		+
		"(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";
	var re = new RegExp(strRegex);

	if (re.test(url)) {
		return true;
	} else {
		return false;
	}
}

function ip2int(ip) {
	var num = 0;
	ip = ip.split(".");
	num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
	num = num >>> 0;
	return num;
}

function isValidIpAddress_dhcpDevice(address) {
	var i = 0;

	if (address == '255.255.255.255')
		return false;

	addrParts = address.split('.');
	if (addrParts.length != 4) return false;
	for (i = 0; i < 4; i++) {
		if (IsNotDigit(addrParts[i]) || addrParts[i] == "")
			return false;

		num = parseInt(addrParts[i]);
		if (i == 0 && num == 0) {
			return false;
		}
		if (num < 0 || num >= 255)
			return false;
	}
	if (parseInt(addrParts[3]) == 0)
		return false;
	return true;
}

function isValidPrefixAddress(address) {
	var i = 0,
		num = 0;
	var space = 0;
	addrParts = address.split(':');
	if (addrParts.length < 3 || addrParts.length > 8)
		return false;
	for (i = 0; i < addrParts.length; i++) {
		if (addrParts[i] != "" && isValidHexKey(addrParts[i], addrParts[i].length))
			num = parseInt(addrParts[i], 16);
		else {
			space++;
			if (space > 1 && (i + 1) != addrParts.length)
				return false;
			continue;
		}
		if (i == 0) {
			if ((num & 0xf000) == 0xf000)
				return false;
		}
		if (num > 0xffff || num < 0)
			return false;
	}
	return true;
}

function getIpMaskBit(mask) {
	var i = 0,
		num = 0;
	var oneBitPos = 0;

	if (isValidSubnetMask(mask) == false)
		return -1;

	maskParts = mask.split('.');
	for (i = 0; i < 4; i++) {
		num = parseInt(maskParts[i]);
		oneBitPos = getRightMostOneBitPos(num);
		if (oneBitPos < 7) {
			return i * 8 + oneBitPos + 1;
		}
	}
	return 32;
}

function markDscpToName(mark) {
	var i;
	var dscpMarkDesc = new Array('auto', 'default', 'AF13', 'AF12', 'AF11', 'CS1',
		'AF23', 'AF22', 'F21', 'S2',
		'AF33', 'AF32', 'AF31', 'CS3',
		'AF43', 'AF42', 'AF41', 'CS4',
		'EF', 'CS5', 'CS6', 'CS7', '');
	var dscpMarkValues = new Array(-2, 0x00, 0x38, 0x30, 0x28, 0x20,
		0x58, 0x50, 0x48, 0x40,
		0x78, 0x70, 0x68, 0x60,
		0x98, 0x90, 0x88, 0x80,
		0xB8, 0xA0, 0xC0, 0xE0);
	if (mark == -1)
		return '';
	for (i = 0; dscpMarkDesc[i] != ''; i++) {
		if (mark == dscpMarkValues[i])
			return dscpMarkDesc[i];
	}
	return dscpMarkDesc[0];
}

function String_Replace(expression, find, replacewith, start) {
	var index = expression.indexOf(find, start);
	if (index == -1)
		return expression;

	var findLen = find.length;
	var newexp = "";
	newexp = expression.substring(0, index) + (replacewith) + (expression.substring(index + findLen));

	return String_Replace(newexp, find, replacewith, index + 1 + findLen);
}


function SsidisIncludeInvalidChar(val) {
	var len = val.length;

	for (i = 0; i < len; i++) {
		if (val.charAt(i) == '&') {
			return false;
		}
	}

	return true;
}

function isPppNameUnsafe(compareChar) {
	var unsafeString = "\"\\`\,=' \t";

	if (unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32 &&
		compareChar.charCodeAt(0) < 123)
		return false; // found no unsafe chars, return false
	else
		return true;
}

// Check if a ppp name or password valid
function isValidPppName(pppname) {
	var i = 0;

	for (i = 0; i < pppname.length; i++) {
		if (isPppNameUnsafe(pppname.charAt(i)) == true)
			return false;
	}

	return true;
}

function setElementAttr(elementArr, statuArr, attrName) {
	for (var i = 0; i != elementArr.length; i++)
		$(elementArr[i]).attr(attrName, statuArr[i])
}

function setElementCss(elementArr, cssArry, cssName) {
	for (var i = 0; i != elementArr.length; i++)
		$(elementArr[i]).css(cssName, cssArry[i])
}

function setElementsDisabled(elementArr, statusArr) {
	for (var i = 0; i != elementArr.length; i++) {
		document.getElementById(elementArr[i]).disabled = statusArr[i];
	}
}

function isInValidNumRange(num, floor, top) {
	if (isNaN(num) || num < floor || num > top)
		return false;
	return true;
}

function isValidPort(port) {
	return isInValidNumRange(port, 0, 65535);
}

function isNullString(checkText) {
	if (checkText == null || checkText == "" || checkText.length == 0)
		return true;
	else
		return false;
}

function Entry(key, value) {
	this.key = key;
	this.value = value;
}

//设置input:checkbox的选中状态
function setCheckbox(elementId, status) {
	if (status == '1' || status == true || status == 'Enabled') {
		$("#" + elementId).prop("checked", true);
	} else {
		$("#" + elementId).prop("checked", false);
	}
}
//获取input:checkbox的选中状态
function getCheckbox(elementId) {
	if ($("#" + elementId).attr("checked")) {
		return 1;
	} else {
		return 0;
	}
}

function isValidNetIpAddress(address) {
	var i = 0;

	if (address == '0.0.0.0' ||
		address == '127.0.0.1' ||
		address == '255.255.255.255')
		return false;

	addrParts = address.split('.');
	if (addrParts.length != 4) return false;
	for (i = 0; i < 4; i++) {
		if (isNaN(addrParts[i]) || addrParts[i] == "")
			return false;
		num = parseInt(addrParts[i]);
		if (isNaN(num) || num < 0 || num > 255)
			return false;
	}

	if (parseInt(addrParts[0]) < 1 || parseInt(addrParts[0]) > 223)
		return false;


	return true;
}

function isValidIpAddressRange(startAddr, endAddr) {

	if (!isValidIpAddress(startAddr) || !isValidIpAddress(endAddr))
		return false;

	var i;
	var startAddrParts = startAddr.split('.');
	var endAddrParts = endAddr.split('.');

	for (i = 0; i < 4; i++) {
		if (parseInt(startAddrParts[i]) < parseInt(endAddrParts[i]))
			return true;
		else if (parseInt(startAddrParts[i]) > parseInt(endAddrParts[i]))
			return false;
	}

	return false;
}

function getDataByAjax(url, callback) {
	$.ajax({
		type: "GET",
		url: url,
		dataType: 'json',
		cache: false,
		async: false,
		timeout: 30000,
		success: function(returnData, status) {
			if ((returnData != null) && (returnData != undefined)) {
				if (returnData.success == "true") {
					callback(returnData);
					return returnData;
				}
				// fiberlog("Retuen yet?");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (textStatus == "timeout") {
				// fiberlog("get data timeout....");
			} else {
				// fiberlog("get data error....");
			}
			callback(null);
			return null;
		}
	});
}

function postDataByAjax(url, data, options) {
	$.ajax({
		type: "POST",
		data: data,
		url: url,
		dataType: 'json',
		cache: false,
		async: true,
		timeout: 30000,
		success: function(returnData, status) {
			if ((returnData != null) && (returnData != undefined)) {
				return returnData;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (textStatus == "timeout") {
				// fiberlog("get data timeout....");
			} else {
				// fiberlog("get data error....");
			}
		}
	});
}

function setSwitchValue(id, enable) {
	if ((id != null) && (id != undefined)) {
		if (enable == "1") {
			$("#" + id).removeClass("switch_content_off").addClass("switch_content_on");

		} else {
			$("#" + id).removeClass("switch_content_on").addClass("switch_content_off");
		}
	}
}

//给定的string是否包含中文，包含返回true，不包含返回false
function isCnInclude(string) {
	for (var i = 0; i < string.length; i++) {
		var singlechar = string.substr(i, 1);
		var char_escape = escape(singlechar);
		if (char_escape.substring(0, 2) == "%u") {
			return true;
		}
	}
	return false;
}

// by yjshao-----------------start---------------------------
// 给定string，解析出如下Aarray对应的值
// 如string为'INTERNET,TR069'，解析出的值为9
// var modeArray = new Array('TR069', 'VOIP', 'IPTV', 'INTERNET', 'OTHER'); //1 2 4 8 16
function parseValueByString(string, arrayName) {
	var chooseValue = 0;
	for (var i = 0; i < arrayName.length; i++) {
		if (string.toUpperCase().indexOf(arrayName[i]) >= 0) {
			chooseValue += Math.pow(2, i);
		}
	}
	return chooseValue;
}

// 给定value，解析出如下Aarray对应的string
// 如value值为9，解析出的string为'INTERNET,TR069'
// var modeArray = new Array('TR069', 'VOIP', 'IPTV', 'INTERNET', 'OTHER'); //1 2 4 8 16
function parseStringByValue(value, arrayName) {
	var string = '';
	for (var i = 0; i < arrayName.length; i++) {
		var j = Math.pow(2, i);
		if (j == (j & value)) {
			if (string == '') {
				string = arrayName[i];
			} else {
				string += ',' + arrayName[i];
			}
		}
	}
	return string;
}

function cleanPopWindowContentFromIframe() {
	$("#pop_window_icon", window.parent.document).html('');
	$("#pop_window_title", window.parent.document).html('');
	$("#pop_window_message", window.parent.document).html('');
	$("#pop_window_option", window.parent.document).show();
}

function showOrHidePopWindowFromIframe(action) {
	if (action == "show") {
		$("#pop_window_div", window.parent.document).show();
	} else {
		$("#pop_window_div", window.parent.document).hide();
	}
}

//name: radio元素的name
//value: 想要选中的radio元素的值
function setRadio(name, value) {
	$("input[name='" + name + "']").each(function() {
		if ($(this).val() == value) {
			$(this).attr("checked", "checked");
			return;
		}
	});
}

//获取选中raido元素的取值，name: radio元素的name
function getRadio(name) {
	return $("input[name='" + name + "']:checked").val();
}

function jumpToLoginPage(isFormIframe)
{
	var interval = window.setInterval(function() {
		var img = new Image();
		img.onload = function() {
			window.clearInterval(interval);
			if (isFormIframe)
			{
 
				window.parent.location = "../index.html";
			}
			else
			{
				window.location = "../index.html";
			}
		};

		img.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host + "/image/loading.gif" ;
	}, 10000);
}


function isValidInteger(value) {
	return /^-?\d+$/.test(value);
}
// by yjshao-----------------end-----------------------------


//显示或者隐藏多个元素
function hide() {
	for (var i = 0; i < arguments.length; i++) {
		$("#" + arguments[i]).css("display", "none");
	}
}
//显示多个元素
function show() {
	for (var i = 0; i < arguments.length; i++) {
		$("#" + arguments[i]).css("display", "");
	}
}
//隐藏表单元素的父级div
function hideItem() {
	for (var i = 0; i < arguments.length; i++) {
		$("#" + arguments[i]).parents(".main_item").css("display", "none");
	}

}
//隐藏表单元素的父级div
function showItem() {
	for (var i = 0; i < arguments.length; i++) {
		$("#" + arguments[i]).parents(".main_item").css("display", "");
	}
}

//检查密码强度
function checkPasswordStrength(sValue, tipElementId) {
	var levelStr = ["Weak", "Medium", "High", "Excellent"];
	var pwdLevel = 0;
	var modes = 0;
	if (sValue.length <= 6) {
		pwdLevel = 1;
	} else {
		if (/\d/.test(sValue)) modes++; //数字
		if (/[a-z]/.test(sValue)) modes++; //小写
		if (/[A-Z]/.test(sValue)) modes++; //大写  
		if (/\W/.test(sValue)) modes++; //特殊字符
		switch (modes) {
			case 1:
				pwdLevel = 1;
				break;
			case 2:
				pwdLevel = 2;
				break;
			case 3:
			case 4:
				if (sValue.length < 12) {
					pwdLevel = 3;
				} else {
					pwdLevel = 4;
				}
				break;
		}
	}

	$("#" + tipElementId).removeClass().addClass("level" + pwdLevel);
	$("#" + tipElementId).find("span").removeClass().text("");
	$("#" + tipElementId).find("span").eq(pwdLevel - 1).addClass("active").text(levelStr[pwdLevel - 1]);

	return pwdLevel;
}

//check the validation of WEPKey
function isValidKey(variable, digit) {
	var val = String(variable);
	if (val.length == digit)
		return true;
	else
		return false;
}

function isValidHex(hexNum, hexNumLength) {
	if (hexNum.length > hexNumLength) {
		return false;
	}
	var pattHexnum = /^[a-f0-9A-F]+$/;
	return pattHexnum.test(hexNum);
}

//获取运营商CT CU CM
function getOperator() {
	var operator;
	if (parent.gOperator != undefined && parent.gOperator != '') {
		operator = parent.gOperator;
	} else {
		if (gDebug) {
			getDataByAjax("../fake/operator", function(data) {
				if (data) {
					operator = data.operator;
				}
			});
		} else {
			XHR.get("get_operator_test", null, function(data) {
				if (data) {
					operator = data.operator;
				}
			});
		}
	}

	if (operator == '') {
		operator = "CT"; //default
	}

	return operator;
}

function isValidURL(ipAddress) {
	var urlPat = /(?:(?:http[s]?|ftp):\/\/)?[^\/\.]+?\.[^\.\\\/]+?\.\w{2,}$/i;
	var matchArray = ipAddress.match(urlPat);
	if (matchArray != null) {
		return true;
	} else {
		return false;
	}
}

function isValidIpv6Address(s) //校验是否为IPv6地址
{
    if (null == s.match(/:/g)) {
        return false;
    }
    var re = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/;
    return re.test(s);
}

/*****************************************************************************
get operatorName and login_user
王洪磊20191223
获取用户权限（admin/common）和地区名（th_true/Algar）
*****************************************************************************/
function get_operatorName() {
	var operator_name;
	XHR.get("get_operator_test", null, function(data) {
		if (data) {
			operator_name = data.operator_name;
		}
	});

	return operator_name;
}



if (gOperatorName == "BZ_CLARO") {
	document.write('<script src="..\/js\/validate.js"><\/script>');
	//document.write('<script src="..\/language\/messages_pt.js"><\/script>');
	document.write('<script src="..\/language\/messages_en.js"><\/script>');
} else if((gOperatorName == "MEX_TELMEX" ||gOperatorName == "MEX_NETWEY"||gOperatorName == "ES_DIGI")&& glang == "span" ){
	document.write('<script src="..\/js\/validate.js"><\/script>');
	document.write('<script src="..\/language\/messages_span.js"><\/script>');
} else if(gOperatorName == "BZ_INTELBRAS" && glang == "pt"){
	document.write('<script src="..\/js\/validate_pt.js"><\/script>');
	document.write('<script src="..\/language\/messages_pt.js"><\/script>');
}else {
	document.write('<script src="..\/js\/validate.js"><\/script>');
	document.write('<script src="..\/language\/messages_en.js"><\/script>');
}

function change_css_style_inside() {
	if (gOperatorName == "BZ_CLARO") {
		// document.write('<style type="text/css"> .main_header {background-color: #FFFFFF;border: #D52B1E 1px solid;} '
		// 			+'.table_bg{background-color:#D52B1E;}'
		// 			+'table{border:0px}'
		// 			+'.tabal_head{color:#FFFFFF;height:20px}'
		// 			+'.table_title{color:#FFFFFF}'
		// 			+'.table_left{background-color: #F0F0F0}'
		// 			+'.main_item {background-color: #D52B1E}'
		// 			+'.main_item_name{background-color: #F0F0F0}'
		// 			+'.main_item_content{background-color: #F0F0F0}'
		// 			+'.main_submit{background-color: #F0F0F0}'
		// 			+'.table_head_title{background-color: #ffffff;color:#000000} </style>');
	}
}

function change_css_style() {
	var operator_name = gOperatorName;

	if (operator_name == "BZ_CLARO") {
		// $("body").prepend('<style id = "append_css" type="text/css"> .sec-menu>li>span {background-color: #901A11;}  .sec-menu{border-top:3px solid #901A11;}</style>');
		// $("#append_css").prepend('.thr-menu>li {background-color: #FAFAFA; color:#D52B1E}');
		// $("#append_css").prepend('.thr-menu .thr-menu-select {color: #D52B1E;}');
		// $("#append_css").prepend('.fir-menu-open {background-color: #901A11;}');
		// //$("#append_css").prepend('.eidt-button {background-color: #D52B1E;border-color: #D52B1E;}');
		// $("#append_css").prepend('.nav-title {background-color: #D52B1E; color:#FFFFFF; border-top:3px solid #901A11;}');
		// $("#append_css").prepend('.footer {background-color: #D52B1E;}');
	}
}


function get_loginUser() {
	var login_user;

	XHR.get("get_login_user", null, function(data) {
		if (data) {
			login_user = data.login_user;
		}
	});
	return login_user;
}
/*****************************************************************************
createCode
王洪磊20200217
生成验证码
泰国3BB验证码需求：Generate a string of 5 random characters in 0-9 and A-Z to combine complex. (not use letter “O”, “I” (i upper case), “l” (L lower case) and number “0”, “1”)
*****************************************************************************/
function createCode() {
	zkzcode = "";
	var zkzcodeLength = 5; //验证码的长度  
	var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm',
		'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'); //所有候选组成验证码的字符，当然也可以用中文的 
	for (var i = 0; i < zkzcodeLength; i++) {
		var charIndex = Math.floor(Math.random() * 56);
		zkzcode += selectChar[charIndex];
	}
	return zkzcode;

}

/*****************************************************************************
sleep
王洪磊20200414
延时
通用需求：设置延时
*****************************************************************************/

function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime) {
			return;
		}

	}
}

/*****************************************************************************
validateURL
wuxj
2011.5.3
check whether url is legal
*****************************************************************************/
function validateURL(url) {
	var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
		/* modify by wuxj, 20110617, URL must start with:// */
		//				+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" 	//ftp user@
		+
		"(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //ftp user@
		+
		"(([0-9]{1,3}.){3}[0-9]{1,3}" // IP kind of URL- 199.194.52.184
		+
		"|" // allow IP and DOMAIN
		+
		"([0-9a-zA-Z_!~*'()-]+.)*" // domain - www.
		+
		"([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]." // second level domain
		+
		"[a-zA-Z]{2,6})" // first level domain- .com or .museum
		+
		"(:[0-9]{1,5})?" // port  :80
		+
		"((/?)|" // a slash isn't required if there is no file name
		+
		"(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";
	var re = new RegExp(strRegex);

	if (re.test(url)) {
		return true;
	} else {
		return false;
	}
}

/*****************************************************************************
validateIP
wuxj
2011.5.3
check whether IP is legal
*****************************************************************************/
function validateIP(ip) {
	var obj = ip;
	var exp = /^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/;

	var reg = obj.match(exp);
	if (reg == null) {
		return false;
	} else {
		return true;
	}
}
/*****************************************************************************
validateDomain
chenpeng
2019.08.23
check whether validateDomain is legal
*****************************************************************************/
function validateDomain(domain) //www.
{
	var strRegex = /^(?=^.{1,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
	var re = new RegExp(strRegex);

	if (re.test(domain)) {
		return true;
	} else {
		return false;
	}
}

function htmlencode(s) {
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(s));
	return div.innerHTML;
}

function htmldecode(s) {
	var div = document.createElement('div');
	div.innerHTML = s;
	return div.innerText || div.textContent;
}

/*****************************************************************************
checkCommDescription
wanghonglei
2020.06.29
check whether Description is legal
*****************************************************************************/

function checkCommDescription(dom) {
	var reg = /^[\w-]{0,31}$/; //number letter _ -
	if (!reg.test(dom)) {
		return false;
	}
	return true;
}

function description(s) { //是否为字母或者数字或者_或者-
	if (s == "") {
		return false;
	}
	if (s.indexOf("--") > -1) {
		return false;
	}
	var re = /^[A-Za-z0-9\-_]*$/g;
	return re.test(s);
}

//判断IP与网关是否在同一个网段
function is_same_network_segment(ipaddr, gateway, submask) {
	var ip_arr = ipaddr.split(".");
	var gw_arr = gateway.split(".");
	var mask_arr = submask.split(".");

	var res0 = parseInt(ip_arr[0]) & parseInt(mask_arr[0]);
	var res1 = parseInt(ip_arr[1]) & parseInt(mask_arr[1]);
	var res2 = parseInt(ip_arr[2]) & parseInt(mask_arr[2]);
	var res3 = parseInt(ip_arr[3]) & parseInt(mask_arr[3]);

	var res0_gw = parseInt(gw_arr[0]) & parseInt(mask_arr[0]);
	var res1_gw = parseInt(gw_arr[1]) & parseInt(mask_arr[1]);
	var res2_gw = parseInt(gw_arr[2]) & parseInt(mask_arr[2]);
	var res3_gw = parseInt(gw_arr[3]) & parseInt(mask_arr[3]);

	if (res0 == res0_gw && res1 == res1_gw && res2 == res2_gw && res3 == res3_gw) {
		return true;
	} else {
		return false;
	}
}



//IPv4比较，比较两个ip的大小,如果大于，返回1，等于返回0，小于返回-1
function compareIP(ipBegin, ipEnd) {
	var temp1 = ipBegin.split(".");
	var temp2 = ipEnd.split(".");
	for (var i = 0; i < 4; i++) {
		if (parseInt(temp1[i]) > parseInt(temp2[i])) {
			return 1;
		} else if (parseInt(temp1[i]) < parseInt(temp2[i])) {
			return -1;
		}
	}
	return 0;
}

//ipv6地址简写补全
function convert2CompleteIpV6(ip) {

	var ipV6 = ip;

	var index = ip.indexOf("::");

	if (index > 0) {

		var size = 8 - (ip.split(":").length - 1);

		var tmp = "";

		for (var i = 0; i < size; i++) {

			tmp += ":0000";

		}

		tmp += ":";

		ipV6 = ip.replace("::", tmp);

	} else if (index == 0) {

		if (ip == "::") {

			ipV6 = "0000:0000:0000:0000:0000:0000:0000:0000";

		} else {

			ipV6 = ip.replace("::", "0000:0000:0000:0000:0000:0000:0000:");

		}

	}

	return ipV6;

}
//IPv6比较，比较两个ip的大小,如果大于，返回1，等于返回0，小于返回-1
    function compareIPv6(addr1,addr2){
        var addr1 = convert2CompleteIpV6(addr1).split(":");
        var addr2 = convert2CompleteIpV6(addr2).split(":");
        for(var i = 0; i < 8; i++){

            if(parseInt(addr1[i], 16) != parseInt(addr2[i], 16)){

                if(parseInt(addr1[i], 16) > parseInt(addr2[i], 16)){//addr1 > addr2
                    return 1;

                }else if(parseInt(addr1[i], 16) < parseInt(addr2[i], 16)){//addr1 < addr2
                    return -1;

                }

            } 

        }

        return 0;//地址相等

    }
	
		
/*****************************************************************************
check_pwd_strength
wanghonglei
2020.09.15
check  password wherther contain digital Uppercase english letters Lowercase english letters and special letters
*****************************************************************************/
	function check_pwd_strength(str)
	{
        console.log(str);
	    var reg = new RegExp(/\d+/,"g");
	    var str1 = str.replace(reg,"");
	    	if(str == str1) 
	    	{
	    		return false;
	    	}
	    var reg= new RegExp(/[\a-z]+/,"g");
	    var str2= str1.replace(reg,"");
	    	if(str1 == str2) 
	    	{
	    		return false;
	    	}
	    var reg = new RegExp(/[\A-Z]+/,"g");
	    var str3 = str2.replace(reg,"");
	    	if(str2 == str3) 
	    	{
	    		return false;
	    	}
	    //!"#$%&'()*+,-./:<=>?@[\]^_`{|}~
	    var reg = new RegExp(/["'!#\$%&\(\)\*\+,-\./:;<=>\?@\[\]\^_`\{\|\}~\\\\]+/,"g");
	    var str4 = str3.replace(reg,"");
	    	if(str4 == str3)
	    	{
	    		return false;
	    	}
	        if("" == str4)
	        {
	            return true;
	        }
	        else
	        {
	    	    return false;
	        }
	    }
//墨西哥telmex版本密码必须包含数字和大小写字母
function check_pwd_telmex(str)
	{
	    var reg = new RegExp(/\d+/,"g");
	    var str1 = str.replace(reg,"");
	    	if(str == str1) 
	    	{
	    		return false;
	    	}
	    var reg= new RegExp(/[\a-z]+/,"g");
	    var str2= str1.replace(reg,"");
	    	if(str1 == str2) 
	    	{
	    		return false;
	    	}
	    var reg = new RegExp(/[\A-Z]+/,"g");
	    var str3 = str2.replace(reg,"");
	    	if(str2 == str3) 
	    	{
	    		return false;
	    	}
			 if("" == str3)
	        {
	            return true;
	        }
	        else
	        {
	    	    return false;
	        }
	    
	}

/*智利MP版本NTP夏令时校验函数*/	
function checkNumberLegal(dom, min, max)
{
	var exp = /^\d+$/;
	if(exp.test(dom))
	{
		if(min <= dom && dom <= max)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}
	
function checkYearLegal(dom)
{
	return checkNumberLegal(dom, 0, 9999);
}	
function checkMonthLegal(dom)
{
	if(checkNumberLegal(dom, 1, 12))
	{
		if(dom < 10)
			dom = '0' + dom;
		return true;
	}
	else
		return false;
}		
function checkDateLegal(dom, month)
{
	var max;
	var m = month;
	if(m == 1 || m == 3 || m == 5 
		|| m == 7 || m == 8 || m == 10 || m == 12)
		max = 31;
	else if(m == 2)
		max = 28;
	else
		max = 30;
	
	if(checkNumberLegal(dom, 1, max))
	{
		if(dom < 10)
			dom = '0' + dom;
		return true;
	}
	else
		return false;
}	
function checkHourLegal(dom)
{
	if(checkNumberLegal(dom, 0, 23))
	{
		if(dom == 0)
			dom = '00';
		else if(dom < 10)
			dom = '0' + dom;
		return true;
	}
	else
		return false;
}
function checkMinLegal(dom)
{
	if(checkNumberLegal(dom, 0, 59))
	{
		if(dom == 0)
			dom = '00';
		else if(dom < 10)
			dom = '0' + dom;
		return true;
	}
	else
		return false;
}	

function checkNTPYear(dom)
{
	if(dom == 0 && dom.length == 1)
	{	
		dom = '0000';
	}
	else if(dom < 10 && dom.length == 1)
	{
		dom = '000' + dom;
	}
	else if(dom < 100 && dom.length == 2)
	{
		dom = '00' + dom;
	}
	else if(dom < 1000 && dom.length == 3)
	{
		dom = '0' + dom;
	}	
	return dom;
}

function checkNTPMD(dom)
{
	if(dom < 10 && dom.length == 1)
	{
		dom = '0' + dom;
	}
	return dom;
}

function checkNTPHMS(dom)
{
	if(dom == 0 && dom.length == 1)
	{	
		dom = '00';
	}
	else if(dom < 10 && dom.length == 1)
	{
		dom = '0' + dom;
	}
	return dom;
}

function isIPv6Address(s){ //校验是否为IPv6地址
    if (null == s.match(/:/g)) return false;
    var res1 = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/.test(s);
    var res2 = s.match(/:/g).length<=7 && /::/.test(s) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(s) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(s);

    if (res1 || res2) 
        return true
    else
        return false
}function wifiType(type)//判断设备类型是wifi5还是wifi6
{
	
	if(gModelName == "HG6145D2" || gModelName == "HG6543D"){
		return 0; // 0 表示wifi5
	}else{
		return 1; //1 表示wifi6
	}
}
/*add by zhangbin,20221025,24小时制个位数字显时要加0*/
function switchto24time(time)
{
	if(time < 10 && time.length == 1){
		time = "0"+time;
	}
	return time;
}

function repeatThreeTimesTheck(str)
{
	
	const regRepeat = /([0-9a-zA-Z])\1{2}/;
	return regRepeat.test(str);
}

function continuousCharaCheck(str)
{
	console.log("str " + str);
	var arr = str.split("");
	var flag = false;
	for(var i = 1;i < arr.length - 1;i++)
	{
		var firstIndex = arr[i-1].charCodeAt();
		var secondIndex = arr[i].charCodeAt();
		var thirdIndex = arr[i+1].charCodeAt();
		if((thirdIndex - secondIndex == 1 && secondIndex - firstIndex == 1)//����
			|| (secondIndex - thirdIndex == 1 && firstIndex - secondIndex == 1)//����
			|| (thirdIndex - secondIndex == 0 && secondIndex - firstIndex == 0))//�ظ�
		{
			flag = true;
			break;
		}
	}
	if(flag == true)
	{
		return true;
	}
	
}

function regularpwdTheck(str)
{
	if(str == "P@55w0rd!" || str == "qwer1234" || str =="administrator" || str == "12345678"
	|| str == "q1w2e3r4" || str == "11111111" || str == "Aa123456!" || str == "user1234"
	|| str == "unknown" || str == "admin123")
	{
		return true;
	}
}

