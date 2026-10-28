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
    required: "Este campo es obligatorio.&nbsp",  
    remote: "Por favor arregla este campo.&nbsp",  
    email: "Por favor, introduce una dirección de correo electrónico válida.&nbsp",  
    ipv4: "Ingrese una dirección ipv4 válida.&nbsp",
    ipv4_domain: "Ingrese una dirección o dominio ipv4.&nbsp",
    subnetMask: "Ingrese una dirección de máscara de subred.&nbsp",
    ipv6: "Ingrese una dirección ipv6 válida.&nbsp",
    ipv6_mask: "Por favor ingrese una cifra válida.&nbsp",
    num_letter_: "Por favor ingrese una cifra válida.&nbsp",
    mac: "Por favor ingrese una dirección MAC.&nbsp",
    url: "Por favor introduzca un URL válido.&nbsp",  
    date: "Por favor introduzca una fecha valida.&nbsp",  
    dateISO: "Introduce una fecha válida (ISO).&nbsp",  
    number: "por favor ingrese un número valido.&nbsp",  
    digits: "Por favor ingrese solo dígitos.&nbsp",  
    creditcard: "Por favor, introduzca un número de tarjeta de crédito válida.&nbsp",
    equalTo: "Por favor, introduzca el mismo valor de nuevo.&nbsp",  
    extension: "Introduzca un valor con una extensión válida.&nbsp",
    maxlength: $.validator.format("Por favor ingrese no más de {0} caracteres.&nbsp"),  
    minlength: $.validator.format("Introduzca al menos {0} caracteres.&nbsp"),  
    rangelength: $.validator.format("Introduzca un valor entre {0} y {1} caracteres de longitud.&nbsp"),  
    range: $.validator.format("Introduzca un valor entre {0} y {1}.&nbsp"), 
    range_int: $.validator.format( "Introduzca un número entero entre {0} y {1}.&nbsp" ),
    range_int_time:$.validator.format( "Introduzca un número entero entre {0} y {1}.&nbsp" ),
    range_int_equal: $.validator.format( "Introduzca un número entero entre {0} y {1} o {2}.&nbsp" ),
    nocn: "No puede incluir caracteres chinos.&nbsp",
    max: $.validator.format("Introduzca un valor inferior o igual a {0}.&nbsp"),
    min: $.validator.format("Ingrese un valor mayor o igual a {0}.&nbsp"),
	description: "¡Por favor ingrese una descripción válida!"
});

}));
var ssidRequiredHint = "Por favor ingrese SSID.&nbsp";
var passwordRequiredHint = "Por favor, ingrese contraseña.&nbsp";

//common error message
var maxLength32 = "La longitud máxima es 32.&nbsp";