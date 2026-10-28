var sessionidstr = "";
var g_data;
var operator_name = gOperatorName;
var loginUser = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
    if(operator_name == "ECU_CNT"){
        $("#custom_level").show();
        $("#firewall_spi_status_div").show();
        if(loginUser == 0 || loginUser == 1){
           $("#firewall_off").attr("disabled", true);  
           $("#firewall_custom").attr("disabled", true);
           $("#firewall_high").attr("disabled", true);
           $("#firewall_medium").attr("disabled", true);
           $("#firewall_low").attr("disabled", true);
           $("#save_button").hide();
           $("#save_button").attr("disabled", true);
        }
    }
    if(operator_name == "EG_TELECOM")
    {
      $("#firewall_eanble").show();
      $("input[type=radio][name=firewall_check]").change(function(){
              if($("input[name='firewall_check']:checked").val() == "1"){
                 $("#firewall_level_div").show();
              }else{
				 alert("not_security_not_recommended".i18n());
                 $("#firewall_level_div").hide(); 
              }    
      })
    }
    
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/firewall", initPage);
	}
	else
	{
		XHR.get("get_firewall_info", null, initPage);
	}
});

function initPage(getdata)
{
	if (getdata != null && getdata.firewall)
	{
		g_data = getdata.firewall;
		displayHtml();
	}	
}

function cancel()
{
	displayHtml();
}

function displayHtml()
{
    if(operator_name == "EG_TELECOM")
    {
        if (g_data.LEVEL != "0"){
           $("#firewall_enable").prop('checked',true); 
        }else{
           $("#firewall_disable").prop('checked',true);  
        }
    }
    
	if (g_data.LEVEL == "0")
    {
		$("#firewall_off").prop('checked',true);
	}
    else if(g_data.LEVEL == "1")
    {
		$("#firewall_low").prop('checked',true);
	}
	else if(g_data.LEVEL == "2")
    {
		$("#firewall_medium").prop('checked',true);
	}
    else if(g_data.LEVEL == "3")
    {
		$("#firewall_high").prop('checked',true);
	}
    else if(g_data.LEVEL == "4")
    {
    	$("#firewall_custom").prop('checked',true);
    }
}

function save_apply()
{
	show_shadow();
	var postdata = new Object();
    if(operator_name == "EG_TELECOM"){
        if($("input[name='firewall_check']:checked").val() == "0")
        {
          postdata.LEVEL = 0;  
        }else{
          postdata.LEVEL = $("input[name='firewall_enable']:checked").val();   
        }
    }else{
        postdata.LEVEL = $("input[name='firewall_enable']:checked").val();   
    }
        

	
	XHR.post("set_firewall_info", postdata, initPage);
}

