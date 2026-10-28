//do access control before load DOM elements
var login_user = gLoginUser;
var operator_name = gOperatorName;
var dev_info = gDeviceInfo;
var NewUiFlag  = gNewUiFlag;
var multiap_flag = gMultiapFlag;
var model_name = gModelName;
var area_code = gArea_code;
(function() {
    //登录用户0:普通用户 1:管理员用户 2:超级管理员用户 
    /*页面接入权限列表，多用户可见相加
    -1:无需登录即可见
    1:普通用户可见
    2:管理员用户可见
    4:超级管理员用户可见
    */
    var accessLevelArray = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["login_inter.html", "-1"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["dhcpv6_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );
    var accessLevelArray_MAR_IMWI = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["login_inter.html", "-1"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wifi_acl_inter.html","3"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "3"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        ["port_mirror_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_CHL_ENTEL = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["acs_status_inter.html","3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "2"],
        ["LanMode_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["alg_inter.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"],
        ["logSettings_inter.html", "2"]
    );

    var accessLevelArray_EG_TELECOM = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["login_ed.html", "-1"],
        ["fast_settings_wan.html", "2"],
        ["fast_settings_wifi.html", "2"],
        ["fast_settings_eg.html", "2"],
        ["admin_modifypwd_inter.html", "2"],
        ["admin_modifypwd_eg.html", "3"],
        ["fast_settings_menu_eg.html", "3"],
        ["fast_settings_wan_menu_eg.html", "3"],
        ["fast_settings_wifi_menu_eg.html", "3"],
        
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_eg.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["wifi_acl_inter.html", "2"],
        ["secdary_lan_inter.html", "2"],
        
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["content_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        ["parental_control_inter.html", "3"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["PortIsolation_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );


    var accessLevelArray_TH_AIS = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["main_ais.html", "3"],
        //Status
        ["home.html", "3"],
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        ["usb_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_th_ais.html", "3"],
        ["wlanControl_5G_inter.html", "3"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["lan_ipv4_ais_user.html", "1"],
        ["dhcp_lan_inter.html", "3"],
        ["dnssetting_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "3"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_advance_ais_user.html", "1"],
        ["voice_timer_inter.html", "3"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "3"],
        ["ipv4_static_route.html", "3"],
        ["wifi_acl_inter.html", "3"],
        ["traffic_control.html", "2"],
        ["qoslimit_inter.html", "3"],
        ["qos_base_th_ais.html", "2"],
        ["qos_queue_inter.html", "2"],
        ["qos_app_inter.html", "2"],
        ["qos_class_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "3"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "3"],
        ["url_filter_inter.html", "3"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["parental_control_inter.html", "3"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["samba_server.html", "3"],
        ["dlna_enable.html", "3"],
        ["telnet_enable.html", "2"],
        ["ssh_enable.html", "2"],
        ["vpn_through_inter.html", "3"],//application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "2"],
        ["alg_inter.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        ["port_mirror_inter.html", "2"],
        ["dns_lookup_inter.html", "3"],
        //management
        ["operator_mode_inter.html", "2"],
        ["operator_mode_ais_user.html", "1"],
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["status_netlock_inter.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["standard_backup_ais.html", "2"],
        ["standard_backup_ais_user.html", "1"],
        ["standard_restore_ais.html", "2"],
        ["standard_restore_ais_user.html", "1"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "3"],
        ["upstream_configure_ais_inter.html", "3"],
        ["upstream_configure_inter.html", "2"],
        ["schedule_reboot.html", "3"],
        ["logView.html", "2"],
        ["ais_agent_inter.html", "2"],
        ["software_sub_version.html", "2"],
        ["mqtt.html", "2"],
        ["system_log.html", "3"]
    );


    var accessLevelArray_paltel = new Array(
        ["login_paltel.html", "-1"],
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_neighbor_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "3"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["pppoe_wan_inter.html", "1"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "3"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "3"],
        ["url_filter_inter.html", "3"],
        ["port_scan_inter.html", "3"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["parental_control_inter.html", "3"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        ["PortIsolation_inter.html", "3"],
        //application
        ["vpn_through_inter.html", "3"],//application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["media_sharing_inter.html", "3"],
        ["nat.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["samba.html", "3"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],

        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_COL_CLARO = new Array(
        ["login_inter.html", "-1"],
        ["HTTPS_inter.html", "2"],
        ["speedtest_inter.html", "2"],
        ["dhcpv6_port_binding_inter.html", "2"],
        ["dhcpv4_port_binding_inter.html", "2"],
        ["wifi_acl_inter_mex_tp.html", "3"],
        ["wifi_acl_5G_inter_mex_tp.html", "3"]
    );

    var accessLevelArray_COL_MILLICOM = new Array(
        ["login_inter.html", "-1"],
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["dhcp_client_option_inter.html", "2"],

        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "3"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_pldt = new Array(
        ["index.html", "-1"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
       // ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["line_settings_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "3"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["parental_control_inter.html", "3"],
        ["remote_control_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["alg_inter.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["port_triggering_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"],
        ["login_pldt.html", "-1"],
        ["main_pldt.html", "-1"],
        ["default_pwdmodify_pldt.html", "3"],
        ["help.html", "-1"]
    );

    var accessLevelArray_TH_TRUE = new Array(
        ["login_inter.html", "-1"],
        ["wlanControl_inter.html", "3"],
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_neighbor_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "3"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "3"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_static_route.html", "3"],
        //Security
        ["firewall_enable_inter.html", "3"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "3"],
        ["url_filter_inter.html", "3"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "3"],
        //application
        ["vpn_through_inter.html", "3"],
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        //management
        ["user_management_thailand.html", "3"],
        ["admin_management_thailand.html", "2"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "3"],
        ["ftp_server.html", "3"],
        ["logView.html", "3"]
    );
    var accessLevelArray_TUR_TURKSAT = new Array(
        ["login_inter.html", "-1"],
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_tur_turksat.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wifi_acl_inter_mex_tp.html", "3"],
        ["wifi_acl_5G_inter_mex_tp.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_tur_turksat.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["parental_control_inter.html", "3"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_TH_3BB = new Array(

        ["login_3bb.html", "-1"],
        ["HTTPS_inter.html", "-1"],
        ["rmnt.html", "-1"],
        ["update.html", "-1"],
        ["tr069.html", "-1"],
        ["voice_call_history.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["portforwarding_inter.html", "2"],
        ["port_triggering_inter.html", "2"],
        ["3bb.html", "-1"],
        ["remote_control_inter.html", "2"],
        ["changemode_cfg.html", "2"],
        ["schedule_reboot.html", "2"],
        ["ddns_status_inter.html","2"],
        ["parental_control_inter.html","2"],
    );

    var accessLevelArray_BZ_TIM = new Array(
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],

        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],

        ["voice_info_inter.html", "3"],
        //Network 
        ["wlanBasicSettings_inter.html", "3"],
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "3"],
        ["wlanwps_inter.html", "3"],
        ["wifi_acl_inter.html", "3"],

        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "3"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],

        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "3"],
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["mac_filter_inter.html", "3"],
        ["parental_control_inter.html", "2"],
        ["remote_control_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //Application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["port_triggering_inter.html", "2"],
        ["nat.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        //Management
        ["restoreDefault.html", "3"],
        ["ledstate.html", "3"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "3"],
        ["ftp_server.html", "2"],
        ["local_management_inter.html", "2"],
        ["logView.html", "2"],

        //Wizard
        ["page_02.html", "2"],
        ["page_03.html", "2"],
        ["page_04.html", "2"],
        ["page_05.html", "2"],
        ["page_06.html", "2"],
        ["page_07.html", "2"],
        ["page_08.html", "2"]
    );
    var accessLevelArray_IDN_TELKOM = new Array(
        ["band_steering_idn_telkom.html", "3"],
        ["login_inter.html", "-1"],
        ["usb_info_inter.html", "3"],
        ["wlanAdvancedSettings_idn_telkom.html", "3"],
        ["wlanAdvancedSettings_5G_idn_telkom.html", "3"],
        ["logView_other.html", "2"],
        ["wifi_acl_inter.html", "2"],
        ["parental_control_inter.html", "2"],
        ["acs_config.html", "4"],
        ["voice_base_inter.html", "4"],
    );
    var accessLevelArray_PAK_PTCL = new Array(
        ["wlanAdvancedSettings_idn_telkom.html", "3"],
        ["wlanAdvancedSettings_5G_idn_telkom.html", "3"],
        ["band_steering_pck_ptcl.html", "3"],
        ["wlanGuest_inter.html", "3"],
    );
    var accessLevelArray_BZ_ALGAR = new Array(
        ["wifi_acl_inter.html", "3"],
        ["dhcpv6_info_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["parental_control_inter.html", "3"],
        ["restore_all.html", "2"],
        ["default_pwdmodify_bz_algar.html", "3"]
    );

    var accessLevelArray_BZ_WDC = new Array(
        ["ethernetPorts.html", "3"],
        ["parental_control_inter.html", "3"],
    );
    
    var accessLevelArray_OMN_OMANTEL = new Array(
        ["band_steering.html", "3"],
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        ["user_modifypw_omn_omantel.html", "1"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],

        ["voice_info_inter.html", "3"],
        //Network
        ["wlanBasicSettings_inter.html", "3"],
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],

        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],

        ["wlanwps_inter.html", "3"],

        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],

        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],

        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security 
        ["firewall_enable_inter.html", "2"],
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["parental_control_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //Application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //Management  
        ["user_management_inter.html", "3"],
        ["admin_management_inter.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_ARG_CLARO = new Array(
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],

        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],

        ["voice_info_inter.html", "3"],
        //Network
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],


        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],

        ["wlanwps_inter.html", "3"],

        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],

        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],

        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],
        //Security 
        ["firewall_enable_inter.html", "2"],
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["parental_control_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        //Application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        //Management  
        ["user_management_inter.html", "3"],
        ["admin_management_inter.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_CHL_MP = new Array(
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],

        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],

        ["voice_info_inter.html", "3"],
        //Network
        ["wlanBasicSettings_inter.html", "3"],
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],

        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],

        ["wlanwps_inter.html", "3"],

        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],

        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],

        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security 
        ["firewall_enable_inter.html", "2"],
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["ipv6_mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //Application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //Management  
        ["user_management_inter.html", "3"],
        ["admin_management_inter.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["catv_inter.html", "2"],
        ["logView.html", "2"]
    );
    var accessLevelArray_PRT_LIGAT = new Array(
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["ipconInfo_inter.html", "2"],
        ["ipconInfo_ligat.html", "1"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],

        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],

        ["voice_info_inter.html", "3"],
        //Network
        ["wlanBasicSettings_inter.html", "3"],
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["band_steering.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "3"],

        ["wlanwps_inter.html", "3"],

        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],

        ["voice_enable_inter.html", "3"],
        ["voice_base_inter.html", "3"],
        ["voice_advance_inter.html", "3"],
        ["voice_timer_inter.html", "3"],
        ["voice_codec_inter.html", "3"],
        ["bridge_mode.html", "1"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security 
        ["firewall_enable_inter.html", "3"],
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "3"],
        ["url_filter_inter.html", "3"],
        ["port_scan_inter.html", "3"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "2"],
        ["ddos_enable_inter.html", "3"],
        ["HTTPS_inter.html", "3"],
        //Application
        ["vpn_through_inter.html", "3"],
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "3"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        //Management  
        ["user_management_inter.html", "3"],
        ["admin_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "3"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "3"],
        ["ftp_server.html", "3"],
        ["catv_inter.html", "3"],
        ["logView.html", "3"]
    );
    var accessLevelArray_JOR_UMNIAH = new Array(
        ["admin_modifypwd_inter.html", "1"],
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],

        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_sta_info.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network
        ["wlanBasicSettings_inter.html", "3"],
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["band_steering.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wifi_acl_inter.html", "3"],
        ["wlanwps_inter.html", "3"],

        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],

        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],

        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security 
        ["firewall_enable_inter.html", "3"],
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "3"],
        ["url_filter_inter.html", "3"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //Application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portforwarding_inter.html", "3"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //Management  
        ["user_management_inter.html", "3"],
        ["admin_management_inter.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_MEX_TP = new Array(
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["remote_manage_inter.html", "2"],
        ["service_config_inter.html", "2"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["route_info_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["dhcpv6_info_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["battery_info_inter.html", "2"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering_mex_tp.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_mex_tp.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_mex_tp.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["wifi_coverage_config_inter.html", "3"],
        ["wifi_acl_inter_mex_tp.html", "3"],
        ["wifi_acl_5G_inter_mex_tp.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["dhcpv6_lan_inter.html", "3"],
        ["LanMode_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["dhcp_client_option_inter.html", "2"],
        ["dhcp_client_request_inter.html", "2"],
        ["acs_config.html", "2"],
        ["iot_config.html", "2"],
        ["snpwdauth_inter.html", "3"],
        ["qos_base_inter.html", "2"],
        ["qos_queue_inter.html", "2"],
        ["qos_app_inter.html", "2"],
        ["qos_class_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_mex_tp.html", "2"],
        ["voice_statistics_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],
        ["policy_route_config_inter.html", "2"],
        ["service_route_config_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "3"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "3"],
        ["dhcp_filter_inter.html", "2"],
        ["parental_control_inter.html", "3"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["port_triggering_inter.html", "3"],
        ["media_sharing_inter.html", "3"],
        ["nat.html", "2"],
        ["alg_inter.html", "2"],
        ["upnp.html", "3"],
        ["arp_config_inter.html", "2"],
        ["arp_aging_inter.html", "2"],
        ["portal_config_inter.html", "2"],
        ["dns_config_inter.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["samba.html", "2"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        ["port_mirror_inter.html", "2"],
        ["voip_diagnosis_inter.html", "2"],
        //management
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "3"],
        ["advance_power_config_inter.html", "2"],
        ["fault_info_collect_inter.html", "2"],
        ["indicator_state_config_inter.html", "2"],
        ["logView.html", "3"],
        ["logSettings_inter.html", "2"]
    );
    var accessLevelArray_SFU_MEX_TP = new Array(
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["remote_manage_inter.html", "2"],
        ["service_config_inter.html", "2"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["route_info_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["dhcpv6_info_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["battery_info_inter.html", "2"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_mex_tp.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_mex_tp.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["wifi_coverage_config_inter.html", "3"],
        ["wifi_acl_inter_mex_tp.html", "3"],
        ["wifi_acl_5G_inter_mex_tp.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["dhcpv6_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["dhcp_client_option_inter.html", "2"],
        ["dhcp_client_request_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "3"],
        ["qos_base_inter.html", "2"],
        ["qos_queue_inter.html", "2"],
        ["qos_app_inter.html", "2"],
        ["qos_class_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_mex_tp.html", "2"],
        ["voice_statistics_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],
        ["policy_route_config_inter.html", "2"],
        ["service_route_config_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "3"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "3"],
        ["dhcp_filter_inter.html", "2"],
        ["parental_control_inter.html", "3"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["port_triggering_inter.html", "3"],
        ["media_sharing_inter.html", "3"],
        ["nat.html", "2"],
        ["alg_inter.html", "2"],
        ["upnp.html", "3"],
        ["arp_config_inter.html", "2"],
        ["arp_aging_inter.html", "2"],
        ["portal_config_inter.html", "2"],
        ["dns_config_inter.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["samba.html", "2"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        ["port_mirror_inter.html", "2"],
        ["voip_diagnosis_inter.html", "2"],
        //management
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "3"],
        ["advance_power_config_inter.html", "2"],
        ["fault_info_collect_inter.html", "2"],
        ["indicator_state_config_inter.html", "2"],
        ["logView.html", "3"],
        ["logSettings_inter.html", "2"]
    );
    var accessLevelArray_telmex = new Array(
        ["admin_modifypwd_inter.html", "2"],
        ["index.html", "-1"],
        ["login_inter.html", "-1"],
        ["main_inter_telmex.html", "2"],

        //Status
        ["stateOverview_inter.html", "2"],
        ["remote_manage_inter.html", "2"],
        ["wifi_info_inter.html", "2"],
        ["wifi_info_inter5g.html", "2"],
        ["wifi_list_inter.html", "2"],
        ["ipconInfo_inter.html", "2"],
        ["route_info_inter.html", "2"],
        ["statslan_inter.html", "2"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "2"],
        ["dhcpv6_info_inter.html", "2"],
        ["pon_link_info_inter.html", "2"],
        ["voice_info_inter.html", "2"],
        ["pon_info.html", "2"],
        //Network 
        ["lan_port_work.html", "2"],
        ["band_steering.html", "2"],
        ["wlanBasicSettings_inter.html", "2"],//network
        ["wlanAdvancedSettings_mex_tp.html", "2"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "2"],
        ["wlanAdvancedSettings_5G_mex_tp.html", "2"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "2"],
        ["wifi_acl_inter.html", "2"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["dhcpv6_lan_inter.html", "2"],
        ["ethernet_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["voice_statistics_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],
        ["policy_route_config_inter.html", "2"],
        ["service_route_config_inter.html", "2"],
        ["qos_base_inter.html", "2"],
        ["qos_queue_inter.html", "2"],
        ["qos_app_inter.html", "2"],
        ["qos_class_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "3"],
        ["dhcp_filter_inter.html", "2"],
        ["parental_control_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],//application
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["port_triggering_inter.html", "2"],
        ["media_sharing_inter.html", "2"],
        ["nat.html", "2"],
        ["alg_mex_telmex.html", "2"],
        ["upnp.html", "2"],
        ["arp_config_inter.html", "2"],
        ["portal_config_inter.html", "2"],
        ["dns_config_inter.html", "3"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["samba.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        ["voip_diagnosis_inter.html", "2"],
        ["general_ping.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "2"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"],
        ["logSettings_inter.html", "2"]

    );
    var accessLevelArray_bz_claro = new Array(
        ["login_inter.html", "-1"],
        ["index.html", "-1"],
        ["main_inter.html", "1"],
        //Status
        ["stateOverview_inter.html", "1"],
        ["wifi_info_inter.html", "1"],
        ["wifi_info_inter5g.html", "1"],
        ["wifi_list_inter.html", "1"],
        ["ipconInfo_inter.html", "1"],
        ["statslan_inter.html", "1"],
        ["ethernetPorts.html", "1"],
        ["dhcp_user_list_inter.html", "1"],
        ["pon_link_info_inter.html", "1"],
        ["voice_info_inter.html", "1"],
        //Network 
        ["wlanBasicSettings_inter.html", "1"],//network
        ["wlanAdvancedSettings_inter.html", "1"],
        ["wlanControl_inter.html", "1"],
        ["wlanBasicSettings_5G_inter.html", "1"],
        ["wlanAdvancedSettings_5G_inter.html", "1"],
        ["wlanControl_5G_inter.html", "1"],
        ["wlanwps_inter.html", "1"],
        ["lan_ipv4_inter.html", "1"],
        ["broadband_brazil.html", "1"],
        ["snpwdauth_inter.html", "1"],
        ["ipv4_default_route.html", "1"],
        ["ipv4_static_route.html", "1"],
        //Security
        ["firewall_enable_inter.html", "1"],//firewall
        ["main_ipfilterv4_inter.html", "1"],
        ["main_ipfilterv6_inter.html", "1"],
        ["dhcp_filter_inter.html", "1"],
        ["url_filter_inter.html", "1"],
        ["port_scan_inter.html", "1"],
        ["mac_filter_inter.html", "1"],
        ["acl_setting.html", "1"],
        ["parental_control_inter.html", "1"],
        ["remote_control_inter.html", "1"],
        ["ddos_enable_inter.html", "1"],
        ["HTTPS_inter.html", "1"],
        //application
        ["vpn_through_inter.html", "1"],//application
        ["gre_tunnel_claro.html", "1"],
        ["ddns_new_inter.html", "1"],
        ["portmapping_inter.html", "1"],
        ["nat.html", "1"],
        ["upnp.html", "1"],
        ["dmz_inter.html", "1"],
        ["ping_inter.html", "1"],
        ["traceroute_inter.html", "1"],
        //management
        ["user_management_inter.html", "1"],
        ["restoreDefault.html", "1"],
        ["down_cfgfile.html", "1"],
        ["reboot.html", "1"],
        ["ntp_inter.html", "1"],
        ["ftp_server.html", "1"],
        ["logView.html", "1"]
    );
    var accessLevelArray_ECU_CNT = new Array(
        ["login_inter.html", "-1"],
        ["index.html", "-1"],
        ["main_inter.html", "7"],
        ["fast_settings_wan_ECU_CNT.html", "7"],
        ["fast_settings_wifi_ECU_CNT.html", "7"],
        ["fast_settings_voip_ECU_CNT.html", "7"],
        //Status
        ["stateOverview_inter.html", "7"],
        ["wifi_info_inter.html", "7"],
        ["wifi_info_inter5g.html", "7"],
        ["wifi_list_inter.html", "7"],
        ["ipconInfo_inter.html", "7"],
        ["statslan_inter.html", "7"],
        ["dhcp_user_list_inter.html", "7"],
        ["pon_link_info_inter.html", "7"],
        ["voice_info_inter.html", "7"],
        //Network 
        ["band_steering.html", "7"],
        ["wlanBasicSettings_inter.html", "7"],//network
        ["wlanAdvancedSettings_inter.html", "7"],
        ["wlanControl_inter.html", "6"],
        ["wlanBasicSettings_5G_inter.html", "7"],
        ["wlanAdvancedSettings_5G_inter.html", "7"],
        ["wlanControl_5G_inter.html", "6"],
        ["wifi_acl_inter.html", "6"],
        ["wlanwps_inter.html", "6"],
        ["lan_ipv4_inter.html", "6"],
        ["secdary_lan_inter.html", "6"],
        ["dnssetting_inter.html", "6"],
        ["LanMode_inter.html", "4"],
        ["broadband_inter.html", "6"],
        ["iptv_inter.html", "6"],
        ["acs_config.html", "6"],
        ["voice_enable_inter.html", "6"],
        ["voice_base_inter.html", "6"],
        ["voice_advance_inter.html", "6"],
        ["voice_timer_inter.html", "6"],
        ["voice_codec_inter.html", "6"],
        ["snpwdauth_inter.html", "6"],
        ["ipv4_default_route.html", "6"],
        ["ipv4_static_route.html", "6"],
        //Security
        ["firewall_enable_inter.html", "7"],//firewall
        ["main_ipfilterv4_inter.html", "7"],
        ["main_ipfilterv6_inter.html", "7"],
        ["url_filter_inter.html", "7"],
        ["port_scan_inter.html", "6"],
        ["mac_filter_inter.html", "7"],
        ["parental_control_inter.html", "7"],
        ["acl_setting.html", "4"],
        ["remote_control_inter.html", "6"],
        ["ddos_enable_inter.html", "6"],
        ["HTTPS_inter.html", "6"],
        //application
        ["ddns_new_inter.html", "6"],
        ["portmapping_inter.html", "6"],
        ["nat.html", "6"],
        ["upnp.html", "6"],
        ["arp_config_inter.html", "6"],
        ["dmz_inter.html", "6"],
        ["ping_inter.html", "7"],
        ["traceroute_inter.html", "7"],
        ["port_mirror_inter.html", "4"],
        //management
        ["admin_management_inter.html", "6"],
        ["user_management_inter.html", "7"],
        ["restoreDefault.html", "6"],
        ["ledstate.html", "6"],
        ["down_cfgfile.html", "6"],
        ["reboot.html", "7"],
        ["ntp_inter.html", "6"],
        ["ftp_server.html", "6"],
        ["logView.html", "7"],
        ["logSettings_inter.html", "4"]
    );

    var accessLevelArray_ROM_RCSRDS = new Array(
        ["user_modifypw_omn_omantel.html", "1"],
        ["main_inter.html", "3"],
        ["index.html", "-1"],
        ["login_romania.html", "-1"],
        ["main_romania.html", "3"],
        ["main_magyar_4ig.html", "3"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["dhcpv6_info_inter.html", "3"],
        ["pon_link_info_inter.html", "2"],
        ["voice_info_inter.html", "3"],
        ["pon_info.html", "2"],
        //Network 
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "3"],
        ["lan_ipv4_inter.html", "3"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "3"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["mac_filter_inter.html", "3"],
        ["acl_setting.html", "2"],
        ["alg_enable.html", "2"],
        ["HTTPS_inter.html", "3"],
        ["remote_control_inter.html", "2"],
        //application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );

    var accessLevelArray_FTTR_MAIN = new Array(
        ["vlanbind_inter.html", "2"],
        ["ponlink_status_inter.html", "3"],
        ["iot_config.html", "2"],
        ["sub_pon_link_info_inter.html", "3"],
        ["logSettings_inter.html", "2"],
        ["ethernetPorts.html", "3"],
        ["upstream_configure_inter.html", "2"],
    );
    var accessLevelArray_FTTR_SUB = new Array(
        ["uplink_setting.html", "2"],
        ["logSettings_inter.html", "2"]
    );
    var accessLevelArray_COL_EMCALI = new Array(
        ["wifi_acl_inter_mex_tp.html", "3"],
        ["wifi_acl_5G_inter_mex_tp.html", "3"]
    );
    var accessLevelArray_ARG_GIGARED = new Array(
        ["iot_config.html", "2"]
    );
    var accessLevelArray_ES_DIGI = new Array(
        ["parental_control_inter.html", "3"],
        ["samba.html", "2"],
        ["dlna_enable.html", "2"],
        ["wlanGuest_inter.html", "3"],
    );
    var accessLevelArray_MY_TM = new Array(
        ["parental_control_inter.html", "2"],
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["main_my_tm.html", "3"],
        ["wizard.html", "3"],

        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        ["usb_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "3"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_th_ais.html", "3"],
        ["wlanControl_5G_inter.html", "3"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["lan_ipv4_ais_user.html", "1"],
        ["dhcp_lan_inter.html", "3"],
        ["dnssetting_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "3"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_advance_ais_user.html", "1"],
        ["voice_timer_inter.html", "3"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "3"],
        ["ipv4_static_route.html", "3"],
        ["wifi_acl_inter.html", "3"],
        ["traffic_control.html", "2"],
        ["qoslimit_inter.html", "3"],
        ["qos_base_th_ais.html", "2"],
        ["qos_queue_inter.html", "2"],
        ["qos_app_inter.html", "2"],
        ["qos_class_inter.html", "2"],
        //Security
        ["firewall_enable_inter.html", "3"],//firewall
        ["main_ipfilterv4_inter.html", "3"],
        ["main_ipfilterv6_inter.html", "3"],
        ["dhcp_filter_inter.html", "3"],
        ["url_filter_my.html", "3"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_my.html", "3"],
        ["ipv6_mac_filter_my.html", "3"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        ["parentcontrol_my.html", "2"],
        
        //application
        ["dlna_enable.html", "3"],
        ["telnet_enable.html", "2"],
        ["ssh_enable.html", "2"],
        ["vpn_through_inter.html", "3"],//application
        ["ddns_new_inter.html", "3"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "2"],
        ["alg_inter.html", "3"],
        ["upnp.html", "3"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["ping_inter.html", "3"],
        ["traceroute_inter.html", "3"],
        ["port_mirror_inter.html", "2"],
        ["dns_lookup_inter.html", "3"],
        //management
        ["operator_mode_my.html", "3"],
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "3"],
        ["status_netlock_inter.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "3"],
        ["standard_backup_ais.html", "2"],
        ["standard_backup_ais_user.html", "1"],
        ["standard_restore_ais.html", "2"],
        ["standard_restore_ais_user.html", "1"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "3"],
        ["upstream_configure_ais_inter.html", "3"],
        ["logView.html", "2"],
        ["ais_agent_inter.html", "2"],
        ["software_sub_version.html", "2"],
        ["mqtt.html", "2"],
        ["system_log.html", "3"]
    );
    var accessLevelArray_PAK_CYBERNET = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["login_inter.html", "-1"],
        
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_sta_info.html", "3"],
        ["wifi_coverage_inter.html","3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "3"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_pak_cybernet.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portforwarding_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );
    var accessLevelArray_BZ_INTELBRAS = new Array(
        ["index.html", "-1"],
        ["main_bz_intelbras.html", "3"], 
        ["login_bz_intelbras.html", "-1"],
        ["intelbras_privacy_policy.html", "-1"],
        ["intelbras_privacy_policy_en.html", "-1"],
        ["terms_HG6145D2.html", "-1"],
        ["terms_HG6145F.html", "-1"],
        ["terms_HG6145F3.html", "-1"],
        ["terms_HG6145D2_en.html", "-1"],
        ["terms_HG6145F_en.html", "-1"],
        ["terms_HG6145F3_en.html", "-1"],
        ["admin_modifypwd_bz_intelbras.html", "3"],
        
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["gemport.html", "2"],
        ["voice_info_inter.html", "3"],
        ["loop_detection_status.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["lan_port_work.html", "3"],
        ["dhcp_lan_inter.html", "2"],
        ["dnssetting_inter.html", "2"],
        ["vlanbind_bz_intelbras.html", "2"],
        ["LanMode_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],
        ["wifi_acl_inter.html", "3"],

        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["parental_control_inter.html", "3"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        ["PortIsolation_inter.html", "3"],
        //application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["manual_inform.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["user_account_enable.html", "2"],
        ["preset.html", "2"],
        ["preconfigure.html", "2"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["schedule_reboot.html", "2"],
        ["led_switch.html", "3"],
        ["logView.html", "2"]
    );
    var accessLevelArray_MEX_MEGA = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["login_inter.html", "-1"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "2"],
        ["route_info_inter.html", "2"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "3"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],

        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],
        ["gre_tunnel_claro.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "3"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "3"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["ssl_certificate.html", "2"],
        ["open_source_software_notice.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["fault_info_collect_inter.html", "2"],
        ["logView.html", "2"],
        ["logSettings_inter.html", "2"]
    );
     var accessLevelArray_MEX_NETWEY = new Array(
        ["index.html", "-1"],
        ["main_mex_netwey.html", "7"],
        ["login_mex_netwey.html", "-1"],
        //Status
        ["stateOverview_inter.html", "7"],
        ["wifi_info_inter.html", "7"],
        ["wifi_info_inter5g.html", "7"],
        ["wifi_list_inter.html", "7"],
        ["ipconInfo_inter.html", "4"],
        ["statslan_inter.html", "7"],
        ["ethernetPorts.html", "7"],
        ["dhcp_user_list_inter.html", "7"],
        ["pon_link_info_inter.html", "7"],
        ["voice_info_inter.html", "7"],
        ["wifi_coverage_inter.html", "7"],
        ["dhcpv6_info_inter.html", "7"],
        //Network 
        ["band_steering.html", "7"],
        ["wlanBasicSettings_inter.html", "7"],//network
        ["wlanAdvancedSettings_inter.html", "7"],
        ["wlanControl_inter.html", "4"],
        ["wlanBasicSettings_5G_inter.html", "7"],
        ["wlanAdvancedSettings_5G_inter.html", "7"],
        ["wlanControl_5G_inter.html", "4"],
        ["wlanwps_inter.html", "7"],
        ["lan_ipv4_inter.html", "7"],
        ["dhcp_lan_inter.html", "4"],
        ["broadband_inter.html", "4"],
        ["iptv_inter.html", "4"],
        ["acs_config.html", "4"],
        ["snpwdauth_inter.html", "4"],
        ["voice_enable_inter.html", "4"],
        ["voice_base_inter.html", "4"],
        ["voice_advance_inter.html", "4"],
        ["voice_timer_inter.html", "4"],
        ["voice_codec_inter.html", "4"],
        ["ipv4_default_route.html", "4"],
        ["ipv4_static_route.html", "4"],
        //Security
        ["firewall_enable_inter.html", "4"],//firewall
        ["main_ipfilterv4_inter.html", "4"],
        ["main_ipfilterv6_inter.html", "4"],
        ["dhcp_filter_inter.html", "4"],
        ["url_filter_inter.html", "4"],
        ["port_scan_inter.html", "4"],
        ["mac_filter_inter.html", "4"],
        ["parental_control_inter.html", "7"],
        ["acl_setting.html", "4"],
        ["ipv6_acl_setting.html", "4"],
        ["ddos_enable_inter.html", "4"],
        ["HTTPS_inter.html", "4"],
        //application
        ["vpn_through_inter.html", "4"],
        ["ddns_new_inter.html", "4"],
        ["portmapping_inter.html", "4"],
        ["nat.html", "4"],
        ["upnp.html", "4"],
        ["dmz_inter.html", "4"],
        ["web_port.html", "4"],
        ["ping_inter.html", "6"],
        ["traceroute_inter.html", "6"],
        ["port_mirror_inter.html", "4"],
        ["speed_test_inter.html", "7"],
        //management
        ["superadmin_management_inter.html", "4"],
        ["admin_management_inter.html", "6"],
        ["user_management_inter.html", "7"],
        ["restoreDefault.html", "4"],
        ["ledstate.html", "4"],
        ["down_cfgfile.html", "7"],
        ["reboot.html", "7"],
        ["ntp_inter.html", "4"],
        ["catv_inter.html", "4"],
        ["ftp_server.html", "4"],
        ["logView.html", "4"]
    );
    var accessLevelArray_IDN_LINKNET = new Array(
        ["ipv4_static_route.html", "2"],
        ["ipv6_static_route.html", "2"],
        ["healthcheck.html","3"]
    );
    var accessLevelArray_COL_ETB = new Array(
        ["alg_inter.html", "2"],
        ["wlanGuest_inter.html","3"]
    );
    var accessLevelArray_ALB_AFT = new Array(
        ["alg_enable.html", "2"],
        ["dhcpv6_info_inter.html", "3"],
    );
    var accessLevelArray_ARM_GNC = new Array(
        ["HTTPS_inter.html", "4"],
        ["portmapping_inter.html", "4"],
        ["portforwarding_inter.html", "2"],
    );
    var accessLevelArray_IDN_IFORTE = new Array(
        ["ledstate.html", "4"],
    );

    var accessLevelArray_ESP_EMBOU = new Array(
        ["user_list_inter.html", "3"],
    );

    var accessLevelArray_IDN_IMI = new Array(
        ["parental_control_inter.html", "3"],
    );

    var accessLevelArray_PRY_NUCLEO = new Array(
        ["index.html", "-1"],
        ["main_inter.html", "3"],
        ["login_inter.html", "-1"],
        //Status
        ["stateOverview_inter.html", "3"],
        ["wifi_info_inter.html", "3"],
        ["wifi_info_inter5g.html", "3"],
        ["wifi_list_inter.html", "3"],
        ["ipconInfo_inter.html", "3"],
        ["statslan_inter.html", "3"],
        ["ethernetPorts.html", "2"],
        ["dhcp_user_list_inter.html", "3"],
        ["pon_link_info_inter.html", "3"],
        ["voice_info_inter.html", "3"],
        ["wifi_coverage_inter.html", "3"],
        ["dhcpv6_info_inter.html", "3"],
        //Network 
        ["band_steering.html", "3"],
        ["wlanBasicSettings_inter.html", "3"],//network
        ["wlanAdvancedSettings_inter.html", "3"],
        ["wlanControl_inter.html", "2"],
        ["wlanBasicSettings_5G_inter.html", "3"],
        ["wlanAdvancedSettings_5G_inter.html", "3"],
        ["wlanControl_5G_inter.html", "2"],
        ["wlanwps_inter.html", "3"],
        ["lan_ipv4_inter.html", "2"],
        ["dhcp_lan_inter.html", "2"],
        ["broadband_inter.html", "2"],
        ["iptv_inter.html", "2"],
        ["acs_config.html", "2"],
        ["snpwdauth_inter.html", "2"],
        ["voice_enable_inter.html", "2"],
        ["voice_base_inter.html", "2"],
        ["voice_advance_inter.html", "2"],
        ["voice_timer_inter.html", "2"],
        ["voice_codec_inter.html", "2"],
        ["ipv4_default_route.html", "2"],
        ["ipv4_static_route.html", "2"],
        //Security
        ["firewall_enable_inter.html", "2"],//firewall
        ["main_ipfilterv4_inter.html", "2"],
        ["main_ipfilterv6_inter.html", "2"],
        ["dhcp_filter_inter.html", "2"],
        ["url_filter_inter.html", "2"],
        ["port_scan_inter.html", "2"],
        ["mac_filter_inter.html", "2"],
        ["parental_control_inter.html","2"],
        ["acl_setting.html", "2"],
        ["ipv6_acl_setting.html", "2"],
        ["ddos_enable_inter.html", "2"],
        ["HTTPS_inter.html", "2"],
        //application
        ["vpn_through_inter.html", "2"],
        ["ddns_new_inter.html", "2"],
        ["portmapping_inter.html", "2"],
        ["nat.html", "2"],
        ["upnp.html", "2"],
        ["dmz_inter.html", "2"],
        ["web_port.html", "2"],
        ["ping_inter.html", "2"],
        ["traceroute_inter.html", "2"],
        ["port_mirror_inter.html", "2"],
        //management
        ["admin_management_inter.html", "2"],
        ["user_management_inter.html", "3"],
        ["restoreDefault.html", "2"],
        ["ledstate.html", "2"],
        ["down_cfgfile.html", "2"],
        ["reboot.html", "3"],
        ["ntp_inter.html", "2"],
        ["catv_inter.html", "2"],
        ["ftp_server.html", "2"],
        ["logView.html", "2"]
    );
    
    var accessLevelArray_ALGERIA_TELECOM = new Array(
        ["default_pwdmodify_inter.html", "1"]
    )
    if(model_name != "HG6145D2")
    {
      accessLevelArray_pldt.push(["band_steering_pldt.html", "3"]);
    }else{
      accessLevelArray_pldt.push(["band_steering.html", "3"]);
    }
    if(model_name == "HG8143F"){
        accessLevelArray_pldt.push(["lte_info_inter.html", "3"]);
    }
   // console.log(accessLevelArray_pldt);

    function htmlAccessControl() {
        var herfArray = window.location.pathname.split("/");
        var htmlName = herfArray[herfArray.length - 1];
        if (htmlName == "") {
            return;
        }
        var singleAccessLevel; //default
        var accessArray;

        if (operator_name == "BZ_TIM") {
            accessArray = accessLevelArray_BZ_TIM;
        } else if (operator_name == "IDN_TELKOM") {
            accessArray = accessLevelArray_IDN_TELKOM.concat(accessLevelArray);
        } else if (operator_name == "TH_3BB") {
            accessArray = accessLevelArray_TH_3BB.concat(accessLevelArray);
        } else if (operator_name == "PH_PLDT") {
            accessArray = accessLevelArray_pldt;
        } else if (operator_name == "TH_TRUE") {
            accessArray = accessLevelArray_TH_TRUE;
        } else if (operator_name == "OMN_OMANTEL") {
            accessArray = accessLevelArray_OMN_OMANTEL;
        } else if (operator_name == "ARG_CLARO") {
            accessArray = accessLevelArray_ARG_CLARO;
        } else if (operator_name == "CHL_MP") {
            if(area_code == "PRT_LIGAT"){
                accessArray = accessLevelArray_PRT_LIGAT;
            }else{
                accessArray = accessLevelArray_CHL_MP;
            }
            
        } else if (operator_name == "JOR_UMNIAH") {
            accessArray = accessLevelArray_JOR_UMNIAH;
        } else if (operator_name == "MEX_TP") {
            accessArray = accessLevelArray_MEX_TP;
        } else if (operator_name == "SFU_MEX_TP") {
            accessArray = accessLevelArray_SFU_MEX_TP;
        } else if (operator_name == "TUR_TURKSAT") {
            accessArray = accessLevelArray_TUR_TURKSAT;
        } else if (operator_name == "PLE_PALTEL") {
            accessArray = accessLevelArray_paltel;
        } else if (operator_name == "COL_CLARO") {
            accessArray = accessLevelArray_COL_CLARO.concat(accessLevelArray);
        } else if (operator_name == "COL_MILLICOM") {
            accessArray = accessLevelArray_COL_MILLICOM;
        } else if (operator_name == "MEX_TELMEX") {
            accessArray = accessLevelArray_telmex;
        } else if (operator_name == "BZ_CLARO") {
            accessArray = accessLevelArray_bz_claro;
        } else if (operator_name == "ECU_CNT") {
            accessArray = accessLevelArray_ECU_CNT;
        } else if (operator_name == "EG_TELECOM") {
            accessArray = accessLevelArray_EG_TELECOM;
        } else if (operator_name == "TH_AIS") {
            accessArray = accessLevelArray_TH_AIS;
        } else if (operator_name == "CHL_ENTEL") {
            accessArray = accessLevelArray_CHL_ENTEL;
        } else if (operator_name == "PAK_PTCL") {
            accessArray = accessLevelArray_PAK_PTCL.concat(accessLevelArray);
        } else if (operator_name == "ROM_RCSRDS" || operator_name == "MAGYAR_4IG") {
            accessArray = accessLevelArray_ROM_RCSRDS;
        } else if (operator_name == "BZ_ALGAR") {
            accessArray = accessLevelArray_BZ_ALGAR.concat(accessLevelArray);
        } else if (operator_name == "BZ_WDC") {
            accessArray = accessLevelArray_BZ_WDC.concat(accessLevelArray);
        } else if(operator_name == "COL_EMCALI"){
            accessArray = accessLevelArray_COL_EMCALI.concat(accessLevelArray);
        } else if(operator_name == "FTTR_SUB_COMMON"){
            accessArray = accessLevelArray_FTTR_SUB.concat(accessLevelArray);
        }else if(operator_name == "FTTR_MAIN_SFU_COMMON"){
            accessArray = accessLevelArray_FTTR_MAIN.concat(accessLevelArray);
        }else if(operator_name == "ARG_GIGARED"){
            accessArray = accessLevelArray_ARG_GIGARED.concat(accessLevelArray);
        }else if(operator_name == "MY_TM"){
            accessArray = accessLevelArray_MY_TM;
        }else if(operator_name == "PAK_CYBERNET"){
            accessArray = accessLevelArray_PAK_CYBERNET;
        }else if(operator_name == "BZ_INTELBRAS"){
            accessArray = accessLevelArray_BZ_INTELBRAS;
        }else if(operator_name == "MEX_MEGA"){
            accessArray = accessLevelArray_MEX_MEGA;
        }else if(operator_name == "MAR_INWI"){
            accessArray = accessLevelArray_MAR_IMWI;
        }else if(operator_name == "MEX_NETWEY"){
            accessArray = accessLevelArray_MEX_NETWEY;
        }else if(operator_name == "ES_DIGI"){
            accessArray = accessLevelArray_ES_DIGI.concat(accessLevelArray);
        }else if(operator_name == "IDN_LINKNET"){
            accessArray = accessLevelArray_IDN_LINKNET.concat(accessLevelArray);
        }else if(operator_name == "PRY_NUCLEO"){
            accessArray = accessLevelArray_PRY_NUCLEO;
        }else if(operator_name == "ALB_AFT"){
            accessArray = accessLevelArray_ALB_AFT.concat(accessLevelArray);
        }else if(operator_name == "COL_ETB"){
            accessArray = accessLevelArray_COL_ETB.concat(accessLevelArray);
        }else if(operator_name == "ARM_GNC"){
            accessArray = accessLevelArray_ARM_GNC.concat(accessLevelArray);
        }else if(operator_name == "IDN_IFORTE"){
            accessArray = accessLevelArray_IDN_IFORTE.concat(accessLevelArray);
        }else if(operator_name == "ESP_EMBOU"){
            accessArray = accessLevelArray_ESP_EMBOU.concat(accessLevelArray);
        }else if(operator_name == "IDN_IMI"){
            accessArray = accessLevelArray_IDN_IMI.concat(accessLevelArray);
        }else if(operator_name == "ALGERIA_TELECOM"){
            accessArray = accessLevelArray_ALGERIA_TELECOM.concat(accessLevelArray);
        }
        else {
            accessArray = accessLevelArray;
        }

        /*功能页面根据设备能力添加 */
        var accessArrayMultiAP = new Array(
            ["multi_ap_enable.html", "7"], 
            ["topo_new.html", "7"]
        );
        var accessArrayNewUI = new Array(
            ["main_new_ui.html", "3"],
            ["restore_reboot.html", "2"],
            ["home_new.html", "3"],
        );

        var accessArrayFttrMain = new Array(
            ["ponlink_status_inter.html", "3"],
            ["sub_pon_link_info_inter.html", "3"],
            ["vlanbind_inter.html", "2"],
            ["iot_config.html", "2"],
            ["upstream_configure_inter.html", "2"],
        );

        var accessArrayFttrSub = new Array(
            ["uplink_setting.html", "2"],
        );

        if (multiap_flag == "1") {
            accessArray = accessArray.concat(accessArrayMultiAP)
        }

        if (NewUiFlag == "1") {
            accessArray = accessArray.concat(accessArrayNewUI)
        }

        if (gFttr_type == "fttr_main") {
            accessArray = accessArray.concat(accessArrayFttrMain)
        }

        if (gFttr_type == "fttr_sub") {
            accessArray = accessArray.concat(accessArrayFttrSub)
        }

        //子网关不显示语音相关页面
        if (dev_info.voice_port_num == 0 || operator_name == "FTTR_SUB_COMMON") {
            accessArray = accessArray.filter(function(item) {
                return item[0].indexOf("voice") == -1;
            });
        }
        if (dev_info.wifi_enable == 0) {
            accessArray = accessArray.filter(function(item) {
                return ((item[0].indexOf("wifi") == -1) && (item[0].indexOf("wlan") == -1));
            });
        } else if (dev_info.wifi_5g_enable == 0) {
            accessArray = accessArray.filter(function(item) {
                return ((item[0].indexOf("5g") == -1) && (item[0].indexOf("5G") == -1));
            });
        }

        if (dev_info.usb_port_num == 0) {
            accessArray = accessArray.filter(function(item) {
                return item[0].indexOf("ftp_server") == -1;
            });
        }

        //巴西algar支持bandsteering页面
        /*if (operator_name == "BZ_ALGAR") {
            accessArray = accessArray.filter(function(item) {
                return item[0].indexOf("band_steering") == -1;
            });
        }*/

        if (operator_name == "FTTR_SUB_COMMON" || operator_name == "FTTR_MAIN_SFU_COMMON" ) {
            accessArray = accessArray.filter(function(item) {
                return (item[0].indexOf("parental_control_inter") == -1);
            });
        }
        
  

        /*新UI不能访问老UI html文件夹下的页面*/
        var pathname =  herfArray[herfArray.length - 2];
        if(gNewUiFlag && pathname == "html"){
            accessArray = accessArray.filter(function() {
                return false;
            });
        }else if(!gNewUiFlag && pathname == "new_ui"){
            accessArray = accessArray.filter(function() {
                return false;
            });
        }

        if (!gNewUiFlag) {
            accessArray = accessArray.filter(function(item) {
                return (item[0].indexOf("main_new_ui") == -1 && item[0].indexOf("home_new") == -1);
            });
        }else{
            accessArray = accessArray.filter(function(item) {
                return (item[0].indexOf("main_inter") == -1);
            });
        }

        if (operator_name == "BZ_INTELBRAS")// BZ_INTELBRAS
        {
            if(gLoginUser == "1")//admin
            {
                if(isFirstloginFlag == "1" && htmlName.indexOf("admin_modifypwd_bz_intelbras.html") == -1)
                {
                    var protocol = window.location.protocol;
                    var host = window.location.host;
                    window.location.href = protocol + "//" + host + "/RequestUnauthorized";
                }
            }
            else if(gLoginUser == "0")//user
            {
                if(isFirstloginUserFlag == "1" && htmlName.indexOf("admin_modifypwd_bz_intelbras.html") == -1)
                {
                      var protocol = window.location.protocol;
                      var host = window.location.host;
                      window.location.href = protocol + "//" + host + "/RequestUnauthorized";
                }
            }
        }

        for (var i = 0; i < accessArray.length; i++) {
            if (htmlName == accessArray[i][0]) {
                singleAccessLevel = accessArray[i][1];
                break;
            }
        }
        if (singleAccessLevel >= 0) {

            var requestURL = '../cgi-bin/is_logined.cgi?_=' + Math.random();
            //requestURL += '&token=' + navigator.userAgent;
            $.ajax({
                url: requestURL,
                dataType: 'json',
                type: "POST",
                async: false,
                success: function(returndata, textStatus, jqXHR) {
                    //console.log("returndata.result = " + returndata.result);
                    if (returndata.result == 0) {
                        //alert("not login");
                        if (operator_name == "BZ_TIM") {
                            window.parent.location = "../html/login_inter.html";
                        } else if (operator_name == "PH_PLDT") {
                            window.parent.location = "../html/login_pldt.html";
                        } else {
                            window.parent.location = "../index.html";
                        }
                    }
                    else {
                        //alert("login");
                        //XHR.get("get_heartbeat", null, null);

                        var userAccessLevel =  parseInt(returndata.user);
                        if (userAccessLevel != (userAccessLevel & singleAccessLevel)) {
                            if (operator_name == "BZ_TIM") {
                                window.parent.location = "../html/login_inter.html";
                            } else if (operator_name == "PH_PLDT") {
                                window.parent.location = "../html/login_pldt.html";
                            } else {
                                window.parent.location = "../index.html";
                            }
                        }
                        else {
                            XHR.get("get_heartbeat", null, null);
                        }

                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    fiberlog("do is_logined.cgi failed");
                }
            });
        } else if (singleAccessLevel == -1) {
        }
        else {
            //window.parent.location = "../index.html";
            var protocol = window.location.protocol;
            var host = window.location.host;
            window.location.href = protocol + "//" + host + "/BadRequest";
        }
        //else do nothing
    }
    htmlAccessControl();
})(jQuery);
