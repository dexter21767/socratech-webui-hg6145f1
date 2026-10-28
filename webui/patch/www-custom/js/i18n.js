var i18nResource = '';
// getDataByAjax("../language/i18n_zh-cn", runI18n);
var operator_name;
var gI18n = "";
var domain = "";

// --- custom: user-selectable UI language via a cookie (en / fr / ar) ---
function _getCookie(n){ try { var m = document.cookie.match('(?:^|;)\\s*' + n + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : ''; } catch(e){ return ''; } }
function setUiLang(v){ try { document.cookie = 'uilang=' + v + ';path=/;max-age=31536000'; } catch(e){} try { (window.top || window).location.reload(); } catch(e){ location.reload(); } }
var _uilang = _getCookie('uilang');

if ( gI18n == '' )
{
	if ( _uilang != '' )
	{
		gI18n = _uilang;
	}
	else if ( parent.gI18n != '' )
	{
		gI18n = parent.gI18n;
	}
	else
	{
        XHR.get("get_operator", null, get_operator);
        XHR.get("get_lang_info", null, parseI18n);
	}
}

// custom: mirror the float-based form layouts of the iframe pages for Arabic
// (real <table>s flip with dir=rtl on their own; floats and left paddings don't)
if ( gI18n == 'ar' && window.top !== window.self )
{
	try { document.documentElement.setAttribute('dir','rtl'); } catch(e){}
	document.write('<style type="text/css">'
		+ 'html[dir=rtl] .main_item div,html[dir=rtl] .main_item_name,html[dir=rtl] .main_item_name_lan,'
		+ 'html[dir=rtl] .main_item_content,html[dir=rtl] .main_item_content_tip,html[dir=rtl] .main_item_content_lan,'
		+ 'html[dir=rtl] .main_item_content div,html[dir=rtl] .main_submit,html[dir=rtl] .table_left_item,'
		+ 'html[dir=rtl] .table_left_item2,html[dir=rtl] .table_left_item_sub,html[dir=rtl] .float_left,'
		+ 'html[dir=rtl] .float_right,html[dir=rtl] .input_text_lan,html[dir=rtl] .network_segment,'
		+ 'html[dir=rtl] .select-value,html[dir=rtl] .password_content input,html[dir=rtl] #password_tips,'
		+ 'html[dir=rtl] #password_tips span{float:right}'
		+ 'html[dir=rtl] .select-arrow,html[dir=rtl] .password_switch{float:left}'
		+ 'html[dir=rtl] .main_item_name,html[dir=rtl] .main_item_name_lan,html[dir=rtl] .main_submit,'
		+ 'html[dir=rtl] .table_left,html[dir=rtl] .table_right{padding-left:0;padding-right:5px}'
		+ 'html[dir=rtl] .main_item_content,html[dir=rtl] .main_item_content_tip,html[dir=rtl] .main_item_content_lan'
		+ '{padding-left:0;padding-right:5px;margin-left:1px;margin-right:0}'
		+ 'html[dir=rtl] .password_content input{padding-left:0;padding-right:10px}'
		+ 'html[dir=rtl] #password_tips{margin:2px 20px 0 0}'
		+ 'html[dir=rtl] #password_tips span{margin-right:0;margin-left:2px}'
		+ 'html[dir=rtl] .table_title,html[dir=rtl] .main_header_hint,html[dir=rtl] [align=left]{text-align:right}'
		+ 'html[dir=rtl] [style*="float:left"],html[dir=rtl] [style*="float: left"]{float:right!important}'
		+ 'html[dir=rtl] [style*="float:right"],html[dir=rtl] [style*="float: right"]{float:left!important}'
		+ '</style>');
}
domain = "menu";
function setDomain(data)
{
	domain = data;
}

function get_operator(getdata)
{
	if ( getdata.operator_name != undefined )
	{
		operator_name = getdata.operator_name;
	}
}

function parseI18n(data)
{
	if ( _uilang != '' ) { gI18n = _uilang; return; }   // custom: honour the user's choice

	if(operator_name == "MEX_TELMEX")
	{
		if(data.i18n == 'span') { gI18n = "span"; }
		else if(data.i18n == 'en') { gI18n = "en"; }
	}
	else if(operator_name == "MEX_NETWEY")
	{
		if(data.i18n == 'span') { gI18n = "span_di"; }
		else if(data.i18n == 'en') { gI18n = "en"; }
	}
	else if(operator_name == "BZ_INTELBRAS"){
		if(data.i18n == 'pt') { gI18n = "pt"; }
		else if(data.i18n == 'en') { gI18n = "en"; }
	}
	else if(operator_name == "ES_DIGI"){
		if(data.i18n == 'span') { gI18n = "span_di"; }
		else if(data.i18n == 'en') { gI18n = "en"; }
	}
	else
	{
		gI18n = "en";
	}
}

function loadResource()
{
	//get i18n resource
	if ( i18nResource == '' )
	{
		{
			$.ajax({
				url : '../lang/' + gI18n + '/' + domain + '.xml',
				dataType : 'json',
				type : "GET",
				async: false,
				success : function(returndata, textStatus, jqXHR){
					i18nResource = returndata;
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					fiberlog("get i18n resource failed");
				}
			});
		}
	}
}

$(document).ready(function(){
	// custom: right-to-left for Arabic
	if ( gI18n == 'ar' ) { try { document.documentElement.setAttribute('dir','rtl'); if(document.body) document.body.setAttribute('dir','rtl'); } catch(e){} }
	$(".main_config_body").show()
	if(gNewUiFlag){
		$(".header").show()
		$(".main_iframe").show()
		$(".home_page").show()
	}
	loadResource();
	runI18n(); //handle html
});

function runI18n(){
	$("*[i18n]").each(function(){
		var o = $(this);
		var key = o.attr("i18n");
		var setTarget = o.attr("i18n-set");
		var message = _getI18n(key);
		switch(setTarget){
			case undefined:
				o.html(message);
				break;
			case "append":
				o.html(o.html() + message);
				break;
			case "html":
				o.html(message);
				break;
			case "value":
				o.val(message);
				break;
			default:
				o.attr(setTarget, message);
				break;
		}
		o.removeAttr("i18n");
		o.removeAttr("i18n-set");
	});
}

function _getI18n(key){
	var message = '';
	if ( i18nResource[key] != undefined && i18nResource[key] != '' )
	{
		message = i18nResource[key];
	}
	else
	{
		message = key;
	}
	return message;
}

String.prototype.i18n = function(){
	return _getI18n(String(this));
}
