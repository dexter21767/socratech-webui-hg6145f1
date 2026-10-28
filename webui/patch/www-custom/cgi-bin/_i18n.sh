# _i18n.sh - sourced by the WebUI Options CGIs (not a page itself).
# i18n_head prints an inline translator for the page's <head>: it reads the
# uilang cookie (en/fr/ar, same as the rest of the UI), loads
# /lang/<lang>/webui_options.xml and replaces every [data-i18n] element.
#   data-i18n="key"        -> textContent
#   data-i18n-html         -> innerHTML (template from our own lang file)
#   data-i18n-attr="name"  -> that attribute instead
#   data-arg / data-arg1.. -> fill {0} / {1}.. in the template
# English text stays in the markup, so a missing file/key just shows English.
# Inline (not a /js file) because the payload only mounts new files under
# cgi-bin/ and lang/.

i18n_head() {
cat <<'EOF'
<style>
	html[dir=rtl] code, html[dir=rtl] input[type=text], html[dir=rtl] input[type=password],
	html[dir=rtl] input[type=number] { direction:ltr; }
</style>
<script>
(function(){
	var m = document.cookie.match(/(?:^|;)\s*uilang=([^;]*)/);
	var lang = m ? decodeURIComponent(m[1]) : 'en';
	if (!/^(en|fr|ar)$/.test(lang)) lang = 'en';
	var root = document.documentElement;
	root.setAttribute('lang', lang);
	if (lang === 'ar') root.setAttribute('dir', 'rtl');

	// the router's httpd rewrites IPs in CGI output ("192.168.1.1" ->
	// "192_point_168_point_1_point_1"); undo it in text and attributes, like
	// the stock xhr.js does for its responses. Runs before translation so
	// data-arg values are already clean.
	function unpoint() {
		var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false), n;
		while ((n = w.nextNode()))
			if (n.nodeValue.indexOf('_point_') >= 0) n.nodeValue = n.nodeValue.replace(/_point_/g, '.');
		var els = document.getElementsByTagName('*');
		for (var i = 0; i < els.length; i++)
			for (var j = 0, a = els[i].attributes; j < a.length; j++)
				if (a[j].value.indexOf('_point_') >= 0) a[j].value = a[j].value.replace(/_point_/g, '.');
		document.title = document.title.replace(/_point_/g, '.');
	}
	document.addEventListener('DOMContentLoaded', unpoint);
	// pages re-run this after setting data-i18n on content they add later
	window.i18nApply = function(){};
	if (lang === 'en') return;

	var dict = null;
	try {
		var x = new XMLHttpRequest();
		x.open('GET', '/lang/' + lang + '/webui_options.xml', false);
		x.send();
		if (x.status == 200) dict = JSON.parse(x.responseText);
	} catch (e) {}
	if (!dict) return;

	function esc(s) {
		return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
	}
	// args are isolated (FSI..PDI) so IPs/ports keep their order inside RTL text
	function fill(t, el, html) {
		return t.replace(/\{(\d)\}/g, function(_, n){
			var a = el.getAttribute(n === '0' ? 'data-arg' : 'data-arg' + n);
			if (a == null) return '';
			return html ? esc(a) : '⁨' + a + '⁩';
		});
	}
	function apply() {
		var els = document.querySelectorAll('[data-i18n]');
		for (var i = 0; i < els.length; i++) {
			var el = els[i], t = dict[el.getAttribute('data-i18n')];
			if (t == null) continue;
			var attr = el.getAttribute('data-i18n-attr');
			if (attr) el.setAttribute(attr, fill(t, el, false));
			else if (el.hasAttribute('data-i18n-html')) el.innerHTML = fill(t, el, true);
			else el.textContent = fill(t, el, false);
		}
	}
	window.i18nApply = apply;
	document.addEventListener('DOMContentLoaded', apply);
})();
</script>
EOF
}
