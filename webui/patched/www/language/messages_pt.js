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
    required: "Este campo é obrigatório.&nbsp",  
    remote: "Corrija este campo.&nbsp",  
    email: "Insira um endereço de email válido.&nbsp",  
    ipv4: "Insira um endereço IPv4 válido.&nbsp",
    ipv4_domain: "Insira um endereço IPv4 ou um domínio.&nbsp",
    subnetMask: "Insira um endereço de máscara de rede.&nbsp",
    ipv6: "Insira um endereço IPv6 válido.&nbsp",
    ipv6_mask: "Insira um valor válido.&nbsp",
    num_letter_: "Insira apenas números e letras.&nbsp",
    mac: "Insira um endereço MAC.&nbsp",
    url: "Insira uma URL válida.&nbsp",  
    date: "Insira uma data válida.&nbsp",  
    dateISO: "Insira uma data válida (ISO).&nbsp",  
    number: "Insira um número válido.&nbsp",  
    digits: "Insira apenas dígitos.&nbsp",  
    creditcard: "Insira um número de cartão de crédito válido.&nbsp",
    equalTo: "Insira o mesmo valor novamente.&nbsp",  
    extension: "Insira um valor com uma extensão válida.&nbsp",
    maxlength: $.validator.format("Insira mais do que {0} caracteres.&nbsp"),  
    minlength: $.validator.format("Insira pelo menos {0} caracteres.&nbsp"),  
    rangelength: $.validator.format("Insira um valor com comprimento entre {0} e {1} caracteres.&nbsp"),  
    range: $.validator.format("Insira um valor entre {0} e {1}.&nbsp"), 
    range_int: $.validator.format( "Insira um valor inteiro entre {0} e {1}.&nbsp" ),
    range_int_equal: $.validator.format( "Insira um valor inteiro entre {0} e {1} ou {2}.&nbsp" ),
    nocn: "Neste campo não é permitido caracteres chineses.&nbsp",
    max: $.validator.format("Insira um valor igual ou menor à {0}.&nbsp"),
    min: $.validator.format("Insira um valor igual ou maior à {0}.&nbsp"),
    description: "Insira uma descrição válida!"
});

}));
var ssidRequiredHint = "Insira o SSID.&nbsp";
var passwordRequiredHint = "Por favor, introduza senha.&nbsp";

//common error message
var maxLength32 = "O comprimento máximo é 32.&nbsp";