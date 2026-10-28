(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
$.extend($.validator.messages, {
	required: "必须填写。&nbsp",
	remote: "请修正此栏位。&nbsp",
	email: "请输入有效的电子邮件。&nbsp",
	ipv4: "请输入有效的IPv4地址。&nbsp",
	ipv4_domain: "请输入有效的IPv4地址或者域名。&nbsp",
	subnetMask: "请输入有效的子网掩码。&nbsp",	
	ipv6: "请输入有效的IPv6地址。&nbsp",
	ipv6_mask: "请输入有效值。&nbsp",
	num_letter_: "请输入有效值。&nbsp",
	mac: "请输入有效的MAC地址。&nbsp",
	url: "请输入有效的网址。&nbsp",
	date: "请输入有效的日期。&nbsp",
	dateISO: "请输入有效的日期 (YYYY-MM-DD)。&nbsp",
	number: "请输入正确的数字。&nbsp",
	digits: "只可输入数字。&nbsp",
	creditcard: "请输入有效的信用卡号码。&nbsp",
	extension: "请输入有效的后缀。&nbsp",
	equalTo: "你的输入不相同。&nbsp",
	maxlength: $.validator.format("最多 {0} 个字。&nbsp"),
	minlength: $.validator.format("最少 {0} 个字。&nbsp"),
	rangelength: $.validator.format("请输入长度为 {0} 至 {1} 之间的字串。&nbsp"),
	range: $.validator.format("请输入 {0} 至 {1} 之间的数值。&nbsp"),
	range_int: $.validator.format("请输入 {0} 至 {1} 之间的整数。&nbsp"),
	range_int_equal: $.validator.format( "请输入 {0} 至 {1} 之间的数值。&nbsp" ),
	nocn: "不能包含中文。&nbsp",
	max: $.validator.format("请输入不大于 {0} 的数值。&nbsp"),
	min: $.validator.format("请输入不小于 {0} 的数值。&nbsp")
});

}));

var ssidRequiredHint = "请输入SSID。&nbsp";
var passwordRequiredHint = "请输入密码。&nbsp";

//common error message
var maxLength32 = "最长32位。&nbsp";