var i18nResource = '';
// getDataByAjax("../language/i18n_zh-cn", runI18n);
var operator_name;
var gI18n = "";
var domain = "";
if ( gI18n == '' )
{
	if ( parent.gI18n != '' )
	{
		gI18n = parent.gI18n;
	}
	else
	{
        XHR.get("get_operator", null, get_operator);
        XHR.get("get_lang_info", null, parseI18n);
	}
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
/*	if ( data && data.i18n != undefined )
	{
		gI18n = data.i18n;
	}
	
	if ( gI18n == '' ) // if get i18n failed or i18n null, set to default
	{
		gI18n = "en"; //default
	}
	if(data.i18n == 'zh_cn'){
		gI18n = "en";
	}
	else
	{
		gI18n = "pt-br";	
	}
	if(data.operator_name == "BZ_CLARO")
	{
		gI18n = "en";
	}
	else
	{
		gI18n = "en";
	}*/
	
	if(operator_name == "MEX_TELMEX")
	{
		
		if(data.i18n == 'span')
		{
			gI18n = "span";	
			
		}
		else if(data.i18n == 'en')
		{
			gI18n = "en";
		}
	}
	else if(operator_name == "MEX_NETWEY")
	{
		
		if(data.i18n == 'span')
		{
			gI18n = "span_di";	
			
		}
		else if(data.i18n == 'en')
		{
			gI18n = "en";
		}
	}
	else if(operator_name == "BZ_INTELBRAS"){
		if(data.i18n == 'pt')
		{
			gI18n = "pt";	
			
		}
		else if(data.i18n == 'en')
		{
			gI18n = "en";
		}
	}
	else if(operator_name == "ES_DIGI"){
		if(data.i18n == 'span')
		{
			gI18n = "span_di";	
			
		}
		else if(data.i18n == 'en')
		{
			gI18n = "en";
		}
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
		
		
			
		if ( parent.i18nResource != '' )
		{
	//		i18nResource = parent.i18nResource;
		}
	//	else
		{
			$.ajax({
	//			url : '../language/i18n_' + gI18n,
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
	$(".main_config_body").show()
	if(gNewUiFlag){
		$(".header").show()
		$(".main_iframe").show()
		$(".home_page").show()
	}
	loadResource();
	runI18n(); //handle html
});

/**
 * 替换国际化消息
 * @param ms 消息对象
 */
function runI18n(){
	$("*[i18n]").each(function(){
		var o = $(this);
		var key = o.attr("i18n");//获取key
		var setTarget = o.attr("i18n-set");//获取消息设置目标
		var message = _getI18n(key);//取得消息
		switch(setTarget){//根据不同目标设置到不同的地方
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
				o.attr(val, message);
				break;
		}
		o.removeAttr("i18n");//移除属性，避免二次处理
		o.removeAttr("i18n-set");
	});
}

/**
 * 获取多语言值
 * @param key 多语言key
 * @returns value 多语言值
 */
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

/**
 * 为String提供i18n方法获取多语言消息
 * @return value 多语言值
 */
String.prototype.i18n = function(){
	return _getI18n(String(this));
}