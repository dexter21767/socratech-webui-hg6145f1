(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhongwen), 汉语, 漢語)
 */
$.extend($.validator.messages, {
    required: "This field is required.&nbsp",  
    remote: "Please fix this field.&nbsp",  
    email: "Please enter a valid email address.&nbsp",  
    ipv4: "Please enter a valid IPv4 address.&nbsp",
    ipv4_domain: "Please enter an IPv4 address or domain.&nbsp",
    subnetMask: "Please enter a subnetmask address.&nbsp",
    ipv6: "Please enter a valid IPv6 address.&nbsp",
    ipv6_mask: "Please enter a valid value.&nbsp",
    num_letter_: "Please enter a valid value.&nbsp",
    mac: "Please enter a MAC address.&nbsp",
    url: "Please enter a valid URL.&nbsp",  
    date: "Please enter a valid date.&nbsp",  
    dateISO: "Please enter a valid date (ISO).&nbsp",  
    number: "Please enter a valid number.&nbsp",  
    digits: "Please enter only digits.&nbsp",  
    creditcard: "Please enter a valid credit card number.&nbsp",
    equalTo: "Please enter the same value again.&nbsp",  
    extension: "Please enter a value with a valid extension.&nbsp",
    maxlength: $.validator.format("Please enter no more than {0} characters.&nbsp"),  
    minlength: $.validator.format("Please enter at least {0} characters.&nbsp"),  
    rangelength: $.validator.format("Please enter a value between {0} and {1} characters long.&nbsp"),  
    range: $.validator.format("Please enter a value between {0} and {1}.&nbsp"), 
    range_int: $.validator.format( "Please enter an integer between {0} and {1}.&nbsp" ),
    range_int_equal: $.validator.format( "Please enter an integer between {0} and {1} or {2}.&nbsp" ),
    nocn: "This field cannot include Chinese character.&nbsp",
    max: $.validator.format("Please enter a value less than or equal to {0}.&nbsp"),
    min: $.validator.format("Please enter a value greater than or equal to {0}.&nbsp"),
	description: "Please enter valid description!"
});

}));
var ssidRequiredHint = "Please enter SSID.&nbsp";
var passwordRequiredHint = "Please enter password.&nbsp";

//common error message
var maxLength32 = "Max length is 32.&nbsp";