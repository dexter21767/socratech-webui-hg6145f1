var operator_name = gOperatorName;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	getData();
});

function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/voice_status", parseGetData);
	}
	else
	{
		var dynamicHTML = [];
		
	    dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"iptables"+'</td>';
		dynamicHTML += '<td>'+"1.4.21"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"https://www.netfilter.org"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"json-c"+'</td>';
		dynamicHTML += '<td>'+"0.15"+'</td>';
		dynamicHTML += '<td>'+"LGPLv2.1"+'</td>';
		dynamicHTML += '<td>'+"https://github.com/DaveGamble/cJSON"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"uci"+'</td>';
		dynamicHTML += '<td>'+"2014-04-11"+'</td>';
		dynamicHTML += '<td>'+"LGPL v2.1"+'</td>';
		dynamicHTML += '<td>'+"git://git.openwrt.org/project/uci.git"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"libiconv"+'</td>';
		dynamicHTML += '<td>'+"1.11.1"+'</td>';
		dynamicHTML += '<td>'+"GPL 2"+'</td>';
		dynamicHTML += '<td>'+"http://savannah.gnu.org/projects/libiconv/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"json-c"+'</td>';
		dynamicHTML += '<td>'+"0.15"+'</td>';
		dynamicHTML += '<td>'+"MIT"+'</td>';
		dynamicHTML += '<td>'+"https://github.com/json-c/json-c"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"nginx"+'</td>';
		dynamicHTML += '<td>'+"1.20.1"+'</td>';
		dynamicHTML += '<td>'+"BSD"+'</td>';
		dynamicHTML += '<td>'+"http://nginx.org/en/download.html"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"cJSON"+'</td>';
		dynamicHTML += '<td>'+"2009"+'</td>';
		dynamicHTML += '<td>'+"MIT"+'</td>';
		dynamicHTML += '<td>'+"https://github.com/DaveGamble/cJSON"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"radvd"+'</td>';
		dynamicHTML += '<td>'+"1.8.3"+'</td>';
		dynamicHTML += '<td>'+"BSD"+'</td>';
		dynamicHTML += '<td>'+"http://www.litech.org/radvd/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"vsftpd"+'</td>';
		dynamicHTML += '<td>'+"3.0.5"+'</td>';
		dynamicHTML += '<td>'+"GPL v2"+'</td>';
		dynamicHTML += '<td>'+"http://vsftpd.beasts.org"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"ffmpeg-0.5"+'</td>';
		dynamicHTML += '<td>'+"0.5"+'</td>';
		dynamicHTML += '<td>'+"GPL v2"+'</td>';
		dynamicHTML += '<td>'+"http://ffmpeg.org/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"libdlna-0.2.3"+'</td>';
		dynamicHTML += '<td>'+"0.2.3"+'</td>';
		dynamicHTML += '<td>'+"GPL v2.1"+'</td>';
		dynamicHTML += '<td>'+"https://libdlna.geexbox.org/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"libupnp-1.6.21"+'</td>';
		dynamicHTML += '<td>'+"1.6.21"+'</td>';
		dynamicHTML += '<td>'+"BSD"+'</td>';
		dynamicHTML += '<td>'+"https://sourceforge.net/projects/pupnp/files/pupnp/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"ushare-1.1a"+'</td>';
		dynamicHTML += '<td>'+"1.1a"+'</td>';
		dynamicHTML += '<td>'+"GPL v2"+'</td>';
		dynamicHTML += '<td>'+"https://ushare.geexbox.org/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"inadyn"+'</td>';
		dynamicHTML += '<td>'+"2.5"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"https://github.com/troglobit/inadyn"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"ntp-4.2.8p15"+'</td>';
		dynamicHTML += '<td>'+"4.2.4"+'</td>';
		dynamicHTML += '<td>'+"MIT"+'</td>';
		dynamicHTML += '<td>'+"http://www.ntp.org/index.html"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"wide-dhcpv6"+'</td>';
		dynamicHTML += '<td>'+"20080615"+'</td>';
		dynamicHTML += '<td>'+"BSD"+'</td>';
		dynamicHTML += '<td>'+"https://sourceforge.net/projects/wide-dhcpv6/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"pppd"+'</td>';
		dynamicHTML += '<td>'+"2.4.7"+'</td>';
		dynamicHTML += '<td>'+"BSD"+'</td>';
		dynamicHTML += '<td>'+"http://www.roaringpenguin.com/pppoe"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"wget"+'</td>';
		dynamicHTML += '<td>'+"1.10.1"+'</td>';
		dynamicHTML += '<td>'+"GPL v2"+'</td>';
		dynamicHTML += '<td>'+"http://www.gnu.org/software/wget/"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"curl"+'</td>';
		dynamicHTML += '<td>'+"7.81.0"+'</td>';
		dynamicHTML += '<td>'+"GPL/GPLV2/GPLV2+"+'</td>';
		dynamicHTML += '<td>'+"https://curl.haxx.se/download.html"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"tcpdump"+'</td>';
		dynamicHTML += '<td>'+"4.3.0"+'</td>';
		dynamicHTML += '<td>'+"BSD"+'</td>';
		dynamicHTML += '<td>'+"git://bpf.tcpdump.org/tcpdump"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"ip"+'</td>';
		dynamicHTML += '<td>'+"4.4.0/4.3.0"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"git://git.kernel.org/pub/scm/linux/kernel/git/shemminger/iproute2.git	"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"ebtables"+'</td>';
		dynamicHTML += '<td>'+"2.0.10-4"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"http://git.netfilter.org"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"openssl"+'</td>';
		dynamicHTML += '<td>'+"	1.0.2a"+'</td>';
		dynamicHTML += '<td>'+"BSD/APLv2"+'</td>';
		dynamicHTML += '<td>'+"https://www.openssl.org"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"ipset"+'</td>';
		dynamicHTML += '<td>'+"6.38/7.15"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"https://ipset.netfilter.org"+'</td></tr>';
		
		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"pptp"+'</td>';
		dynamicHTML += '<td>'+"1.10.0"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"https://sourceforge.net"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"xl2tpd"+'</td>';
		dynamicHTML += '<td>'+"1.3.18"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"https://sourceforge.net"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"wolfssl"+'</td>';
		dynamicHTML += '<td>'+"5.5.4"+'</td>';
		dynamicHTML += '<td>'+"GPLv2"+'</td>';
		dynamicHTML += '<td>'+"https://www.wolfssl.com"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"dosfstools"+'</td>';
		dynamicHTML += '<td>'+"3.0.27"+'</td>';
		dynamicHTML += '<td>'+"GPL v3"+'</td>';
		dynamicHTML += '<td>'+"github.com/dosfstools"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"busybox"+'</td>';
		dynamicHTML += '<td>'+"1.26.2"+'</td>';
		dynamicHTML += '<td>'+"GPL v2"+'</td>';
		dynamicHTML += '<td>'+"https://busybox.net"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"kernel"+'</td>';
		dynamicHTML += '<td>'+"4.4.115"+'</td>';
		dynamicHTML += '<td>'+"GPL v2"+'</td>';
		dynamicHTML += '<td>'+"kernel.org"+'</td></tr>';

		dynamicHTML +='<tr class="table_01" style="text-align: center;">';
		dynamicHTML += '<td>'+"dropbear"+'</td>';
		dynamicHTML += '<td>'+"2022.82"+'</td>';
		dynamicHTML += '<td>'+"MIT like"+'</td>';
		dynamicHTML += '<td>'+"http://matt.ucc.asn.au/dropbear/dropbear.html"+'</td></tr>';

		$("#voice_info").html(dynamicHTML);
	}
}
