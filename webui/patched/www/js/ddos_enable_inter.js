var sessionidstr = "";
var g_data;
var operator_name =  gOperatorName;
var login_user = gLoginUser;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ddos", initPage);
	}
	else
	{
		if(operator_name == "ECU_CNT")
        		XHR.get("get_firewall_info", null, getaFirewall_info);
		
		XHR.get("get_ddos_attack_enable_info", null, initPage);   
	}
});

function getaFirewall_info(getdata)
{
  if (getdata != null && getdata.firewall)
  {
  	var g_data = getdata.firewall;
    if(operator_name == "ECU_CNT" && ((g_data.LEVEL != "4")  || login_user =="1") )
    {
       $("[type='checkbox']").attr("disabled", true); 
       $("#ddos_attack_apply").hide();
       $("#ddos_apply").attr("disabled", true); 
       $("#ddos_cancel").attr("disabled", true); 
    }
    
  }	  
}

function initPage(getdata)
{
	if (getdata != null && getdata.ddos_enable_info)
	{
		g_data = getdata.ddos_enable_info;
		set_check_list();
	}
}

function set_check_list()
{	
	var checked_ddos_value = new Array(1, 2, 4, 8, 16, 32, 64, 128); //新建一个权值表
	var ddos_attack_value = g_data.DOSFlag; //后端获取的数据,以1 0 4 8 0 0 0的形式得到, 当前是一个字符串
	var ddos_attack_bind_array = ddos_attack_value.split(" "); //用空格隔开，以数组的形式存储
	var ddos_box_node = $("input[name='ddos_attack_check']");
	var ddos_size = ddos_box_node.length; //获取判断框的数量
			
	for(var j = 0; j < ddos_size; j++) 
	{
		if(ddos_attack_bind_array[j] == checked_ddos_value[j])
		{
			ddos_box_node[j].checked = true;
		}
		else
		{
		    ddos_box_node[j].checked = false;	
		}
	}
}

function save_apply()
{
	show_shadow();
	var checkNodes = $("input[type='checkbox']");
	var sum_value = $("#submit_value").val();
	for(var i = 0; i < checkNodes.length; i++)
    {
    	if(checkNodes[i].checked == true)
        {
        	sum_value = sum_value + " " + checkNodes[i].value ;
        }
        else
        {
        	sum_value = sum_value + " " + 0 ;
        }
    }
	var postdata = new Object();
	postdata.DOSFlag = sum_value;
	XHR.post("set_ddos_attack_enable_info", postdata, initPage);
}

