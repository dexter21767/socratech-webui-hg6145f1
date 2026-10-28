var urlfilter_mode;
var urlfilter_enable;
var url_filter_data;
var selfilterIndex;
var limit_week;
var parental_control_info;
var parental_control_enable;
var parental_control_data;
var mac_html;
var data_mac_arr = [];
var parental_control_time;
var template_data;
var template_index ;
var time_index;
var url_index;
var mac_template_data;
var template_page_index;
var operaotr_name = gOperatorName;
var lan_host;

$(document).ready(function() {
	//优化滚动条，无需改动
	//customScrollBar("html");
	//extraValidCheck();
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});
	
	if(gNewUiFlag){
		$(".error-conter").each(function(i) {
			$(this).html('');
		});
	}

    if(operaotr_name == "PLE_PALTEL"){
      initValidate_ple_paltel(); 
    }else{
      initValidate();  
    }
	if (gDebug) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipfilter_lan", initPage);
	} else {
        XHR.get("get_lan_status", null, getLanHost);
		XHR.get("get_lan_mac_info", null, getMacAddress);
       
		XHR.get("get_parental_control_info", null, initPage);	
		
	}
	
	$("#network_user").bind("change", function(){
		if($("#network_user").val() != "1"){
			$("#mac_address").val("");
			$("#mac_address").prop("disabled", true);
		}else{
			$("#mac_address").prop("disabled", false);
		}
	});
	//初始化页面的时候 加载出所有的add、delete deleteAll Apply等等
	$("#doSave_url").show();
	 $("#doSave_enable").show();
	$("#tmplate_config").show();
	$("#template_save_delete").show(); 
	$("#time_save_delete").show();
	$("#time_add_remove").show();
	$("#url_add_remove").show();
	$("#create_template").hide();
    if(operaotr_name == "PLE_PALTEL")
    {
      console.log("0000");
      $("#url_config").hide();  
      $("#url_police").hide();
      
    }
});

function getLanHost(getdata)
{
	lan_host = getdata.lan_status
    
}

function initPage(getdata) //从后端获取数据，初始化页面
{
    if(operaotr_name == "PLE_PALTEL"){
       $("#url_add_remove").hide();
       $("#doSave_url").hide();
    }else{
       $("#url_add_remove").show();
       $("#doSave_url").show();
    }
	$("#create_template").hide();
	$("#time_add_remove").show();
	$("#template_save_delete").show();
	$("#time_save_delete").show();
	$("#fw_mac_template_form").hide();
	
	if (getdata != null || getdata.parental_control_info.length != "undefined") {	
		parental_control_info = getdata.parental_control_info;
		var addHtml = "";
		for(var i = 0; i< getdata.parental_control_info.length; i++ ){
			addHtml += '<input type="radio" name="template_name" value='+parental_control_info[i].template_index+' /><font>'+parental_control_info[i].Name+'</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		}
		$("#template_num").html(addHtml);
		
		mac_template_data = getdata.parental_control_mac_template_info;
			for(var j  = 0; j < parental_control_info.length; j++ ){
				for(var k = 0; k < mac_template_data.length; k++){
					if(mac_template_data[k].TemplateInst  == parental_control_info[j].template_index){
						var name = parental_control_info[j].Name;
						$(".template_" + mac_template_data[k].TemplateInst).html(name);
					}
				}
			}
		
		
		
		EnableCancel();
		displayTableHtml();//加载模板列表
		displayTableHtml_mac_template(getdata);

		
			
		
		if (gOperatorName == "EG_TELECOM")
		{
         $("#ipfilter_List").children().eq(0).children().css("background-color", "#DEC0DF");
         $("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
         $("#ipfilter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
        }else{
            if(gNewUiFlag){
                $("#ipfilter_List").children().eq(0).children().css("background-color", "#686666");
                $("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#37373a");
                $("#ipfilter_List").children().eq(0).css("background-color", "#686666").siblings().css("background-color", "#37373a");  
            }else{
           $("#ipfilter_List").children().eq(0).children().css("background-color", "#b7e3e3");
           $("#ipfilter_List").children().eq(0).siblings().children().css("background-color", "#eef2f6");
           $("#ipfilter_List").children().eq(0).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
        }
        }
		$("#ipfilter_List").children().eq(0).click();	
		
	}
	
	if (getdata != null || getdata.parental_control_enable!= undefined) {	
			if(getdata.parental_control_enable.ParctlEnable == "1"){
				$("input[name='parent_control_enable']").eq(0).attr('checked','true');
			}else{
				$("input[name='parent_control_enable']").eq(1).attr('checked','true');
			}
		}
	
	
}



//从后端读取mac_template table的数据并在表中显示
function displayTableHtml_mac_template(getdata)
{
	var dynamicClsListHTML = '';
	 mac_template_data =  getdata.parental_control_mac_template_info;
	for (var m = 0; m < mac_template_data.length; m++) {
		var single = mac_template_data[m];
		var num = m + 1;
		dynamicClsListHTML += '<tr id="mac_template_' + m + '" style="cursor: pointer;" title=' + single.mac_template_index +'  onclick="showthisinfo_mac_template(this.id,this.title)">';
		dynamicClsListHTML += '<td align="center" class="out_Name">' + num + '</td>';
		dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.MACAddress + '</td>';
		dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.Description + '</td>';
		dynamicClsListHTML += '<td align="center" class="template_'+single.TemplateInst+'"></td>';		
		dynamicClsListHTML += '<td align="center"><input type="checkbox"  value=_' + single.mac_template_index +
			'" name="pc_mac_template"></td>';
		dynamicClsListHTML += '</tr>';
	}
	$("#mac_bind_template_List").html(dynamicClsListHTML);
    if(gNewUiFlag && mac_template_data.length != 0){
        $("#image_macBind").hide();
    }
	//将模板名字加载到列表中
	for(var j  = 0; j < parental_control_info.length; j++ ){
		for(var k = 0; k < mac_template_data.length; k++){
			if(mac_template_data[k].TemplateInst  == parental_control_info[j].template_index){
				var name = parental_control_info[j].Name;
				$(".template_" + mac_template_data[k].TemplateInst).html(name);
			}
		}
	}
	//$("#mac_bind_template_List tr:eq(0)").click();

}


function  getMacAddress(getdata){
	
	var data_mac = getdata.lan_status;
	if(data_mac.data!=null){
		// for(var i = 0; i < data_mac.data.length; i++){
		// 	data_mac.data[i].MACAddress = data_mac.data[i].MACAddress.toUpperCase();
		// }
		//mac_html =  '<option value="1">Other User</option>';
		mac_html =  '<option value="1">' + "other_user".i18n() + '</option>';
		for(var i = 0; i < data_mac.data.length; i++)
		{
            for(j = 0; j< lan_host.data.length; j++){
                var single_lan = lan_host.data[j];
                    if(single_lan.MACAddress == data_mac.data[i].MACAddress){
                        mac_html +=' <option name= "single_wan" value="' + single_lan.MACAddress + '">' +data_mac.data[i].MACAddress.toUpperCase()+"(&nbsp;"+ single_lan.HostName + ')</option>';   
                    }
            } 
			 // mac_html += '<option value="'+data_mac.data[i].MACAddress.toUpperCase()+'">'+data_mac.data[i].MACAddress.toUpperCase()+'</option>';
			  data_mac_arr.push(data_mac.data[i].MACAddress.toUpperCase());
		}
        
		$("#network_user").html(mac_html);
	}
	
}
function addfilter_url(flag){
	$("#fw_url_form").show();
    if(gNewUiFlag)
        $("#image_url").hide();
	var addHtml = []; //新增一个占位标记行
	addHtml += '<tr id="add_url_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';

	//$("#ipfilter_List").append(addHtml);
	if ($("#add_url_item").length == 0) //第一次添加数据时设置默认值
	{
		if (flag && flag == 1){
			$("#url_List").html(addHtml);
		}else{
			$("#url_List").append(addHtml);
			
		}
		$("#site").val("");
		$("#site").attr('data-src', template_index + "_add");
        if (gOperatorName == "EG_TELECOM")
        {
            $("#add_url_item").children().css("background-color", "#DEC0DF");
            $("#add_url_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_url_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }else{
            if(gNewUiFlag){
                $("#add_url_item").children().css("background-color", "#686666");
                $("#add_url_item").siblings().children().css("background-color", "#37373a");
                $("#add_url_item").css("background-color", "#686666").siblings().css("background-color", "#37373a");
            }else{
            $("#add_url_item").children().css("background-color", "#b7e3e3");
            $("#add_url_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_url_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }
        }
	}
	
}

//选中当前url行并改变背景色
function showthisinfo_url(element,value)
{
	$("#url_List").show();
	$("#fw_url_form").show();
	$("#add_item").remove();
    if(gOperatorName == "EG_TELECOM")
    {
     $("#" + element).children().css("background-color", "#DEC0DF");
     $("#" + element).siblings().children().css("background-color", "#eef2f6");
     $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
    }else{
        if(gNewUiFlag){
            $("#" + element).children().css("background-color", "#686666");
            $("#" + element).siblings().children().css("background-color", "#37373a");
            $("#" + element).css("background-color", "#686666").siblings().css("background-color", "#37373a");
        }else{
      $("#" + element).children().css("background-color", "#b7e3e3");
      $("#" + element).siblings().children().css("background-color", "#eef2f6");
      $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");     
    }
    }
	var template_index = value.split("_")[0];
	url_index = value.split("_")[1];
	 url_display_index = element.split("_")[1];
	var mode = "old";

	displayFormHtml_url(mode, template_index,url_display_index,url_index );
}


//显示url列表当前选中行的详细信息
function displayFormHtml_url(mode, index, value, url_index) 
{
	var curdata = parental_control_info[template_page_index];
	//selfilterIndex = value;//在显示某一条数据的时候，将selfilterIndex 切换
	if (mode == "init") //页面无数据时显示addfilter
	{
		if (parental_control_info[template_page_index].length > 0) {
			curdata = parental_control_info[template_page_index];
		} else {
			//addfilter();
			return;
		}
	}
	$("#site").val(curdata.url[value].UrlAddress);
	$("#site").attr('data-src', index +"_"+url_index);
}



function addfilter_time(flag){
    if (gNewUiFlag)
        $("#image_time").hide();
	$("#fw_time_form").show();
	var addHtml = []; //新增一个占位标记行
	addHtml += '<tr id="add_time_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';

	

	if ($("#add_time_item").length == 0) //第一次添加数据时设置默认值
	{
		if (flag && flag == 1){
			$("#time_List").html(addHtml);
		}else{
			$("#time_List").append(addHtml);
		}
		$("#start_hour").val('');
		$("#start_min").val('');
		$("#end_hour").val('');
		$("#end_min").val('');

		$("input[type = checkbox]").each(function(i) {
			$(this).prop('checked', false);
		});
		if(template_index != "undefined"){
			$("#end_min").attr('data-src', template_index + "_add");
		}
        if (gOperatorName == "EG_TELECOM")
        {
            $("#add_time_item").children().css("background-color", "#DEC0DF");
            $("#add_time_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_time_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            
        }else{
            if(gNewUiFlag){
                $("#add_time_item").children().css("background-color", "#686666");
                $("#add_time_item").siblings().children().css("background-color", "#37373a");
                $("#add_time_item").css("background-color", "#686666").siblings().css("background-color", "#37373a");
            }else{
        $("#add_time_item").children().css("background-color", "#b7e3e3");
        $("#add_time_item").siblings().children().css("background-color", "#eef2f6");
        $("#add_time_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");    
        }
        }
	}
	
}



function addfilter_macBind(){
	addflag = "add";
	$("#fw_mac_template_form").show();
    if (gNewUiFlag)
        $("#image_macBind").hide();
	var addHtml = []; //新增一个占位标记行
	addHtml += '<tr id="add_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';
	//$("#ipfilter_List").append(addHtml);
	if ($("#add_item").length == 0) //第一次添加数据时设置默认值
	{
		$("#mac_bind_template_List").append(addHtml);
		$("#profile").val("");
		$("#network_user").val(1);
		$("#mac_address").val("");
		if(template_index != "undefined"){
			$("#profile").attr('data-src',  "add");
		}
		if (gOperatorName == "EG_TELECOM")
        {
            $("#add_item").children().css("background-color", "#DEC0DF");
            $("#add_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            
            
        }else{
            if(gNewUiFlag){
                $("#add_item").children().css("background-color", "#686666");
                $("#add_item").siblings().children().css("background-color", "#37373a");
                $("#add_item").css("background-color", "#686666").siblings().css("background-color", "#37373a");
            }else{
         $("#add_item").children().css("background-color", "#b7e3e3");
         $("#add_item").siblings().children().css("background-color", "#eef2f6");
         $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
            
        }
        }
       
        $("input[name='template_name']:eq(0)").attr('checked', 'checked');
	}
	
	
}
//mac地址和模板进行绑定
function doSave_macBind(){
	show_shadow();
	var src = document.getElementById('profile').getAttribute('data-src');
	
    if( ! $("#parent_control_list_form").valid() ){
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
	     alert("illegal_value_alert".i18n());
	    return;
	}
    if( $("input[name='template_name']:checked").val() == undefined){
        if (gNewUiFlag)
            myAlert('Tip', '' + "no_template_alert".i18n() + '', function() { })
        else
         alert("no_template_alert".i18n());
           return;
    }
    
    
	if( $("input[name='template_name']:checked").val() == ""){
        if (gNewUiFlag)
            myAlert('Tip', '' + "parental_control_bindTemplateAlert".i18n() + '', function() { })
        else
		alert("parental_control_bindTemplateAlert".i18n());
		return;
	}
		
	var postdata = new Object();
	if ($("#network_user").val() == "1") {
			postdata.MACAddress = $("#mac_address").val().toUpperCase();
		} else {
			postdata.MACAddress = $("#network_user").val().toUpperCase();
		}

	if (src.indexOf("add") >= 0){
		
		postdata.action = "add";
	}else{
		var mac_template_index = src.split("_")[1];
		postdata.mac_template_index = mac_template_index;
		postdata.action = "edit";
		
		//校验该mac地址是否绑定过模板
			for(var i = 0; i < mac_template_data.length; i++){
				if(postdata.mac_template_index == mac_template_data[i].mac_template_index)
				{
					continue;
				}
				if(postdata.MACAddress == mac_template_data[i].MACAddress){
                if (gNewUiFlag)
                    myAlert('Tip', '' + "parental_control_macRepeatAlert".i18n() + '', function() { })
                else
					alert("parental_control_macRepeatAlert".i18n());
					return;
				}

			}
	}
	
	if (postdata.action == "add")
	{
		
	    if (mac_template_data.length >= 8)
	    {
            if (gNewUiFlag)
                myAlert('Tip', '' + "fw_most8RulesAlert".i18n() + '', function() { })
            else
	        alert("fw_most8RulesAlert".i18n());
	        return;
	    }   
		//校验该mac地址是否绑定过模板
				for(var i = 0; i < mac_template_data.length; i++){
					if(postdata.MACAddress == mac_template_data[i].MACAddress ){
                if (gNewUiFlag)
                    myAlert('Tip', '' + "parental_control_macRepeatAlert".i18n() + '', function() { })
                else
						alert("parental_control_macRepeatAlert".i18n());
						return;
					}
				}	
	}
	if($("#network_user").val() == "1" &&  $("#mac_address").val() == ""){
        if (gNewUiFlag)
            myAlert('Tip', '' + "mac_address_null".i18n() + '', function() { })
        else
		alert("mac_address_null".i18n());
		return;
	}
	
	postdata.Description  = $("#profile").val();
	
	postdata.TemplateInst = $("input[name='template_name']:checked").val();
	
	XHR.post("set_parental_mac_template_info", postdata, initPage);	

	
}


function showthisinfo_mac_template(element,value)//选中当前模板并改变背景色
{
	$("#fw_mac_template_form").show();
	$("#add_item").remove();
    if (gOperatorName == "EG_TELECOM")
    {
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
     }else{
        if(gNewUiFlag){
            $("#" + element).children().css("background-color", "#686666");
            $("#" + element).siblings().children().css("background-color", "#37373a");
            $("#" + element).css("background-color", "#686666").siblings().css("background-color", "#37373a");
        }else{
      $("#" + element).children().css("background-color", "#b7e3e3");
      $("#" + element).siblings().children().css("background-color", "#eef2f6");
      $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
     }
     }
	var index = element.split("_")[2];
	var value = parseInt(value);
	var mode = "old";
	displayFormHtml_mac_template(mode, index, value);
}


//显示模板列表当前选中行的详细信息
function displayFormHtml_mac_template(mode, index, value) 
{
	selfilterIndex = value;//在显示某一条数据的时候，将selfilterIndex 切换
	if (mode == "init") //页面无数据时显示addfilter
	{
		if (mac_template_data.length > 0) {
		var	curdata = mac_template_data[index];
		} else {
			return;
		}
	}

	$("#profile").val(mac_template_data[index].Description);
	if(data_mac_arr.indexOf(mac_template_data[index].MACAddress)> -1){
	
		$("#network_user").val(mac_template_data[index].MACAddress);
		$("#mac_address").val('');
		$("#mac_address").prop('disabled'.true);
        }else{
			$("#mac_address").val(mac_template_data[index].MACAddress);
			$("#network_user").val("1");
		}

	$('input[name=template_name]').each(function(){
	
		if($(this).val() == mac_template_data[index].TemplateInst){
			$(this).attr("checked","checked");
		}
	})
	
	$("#profile").attr('data-src', "_"+value);
	
}



function showthisinfo_template(element,value)//选中模板当前行并改变背景色
{
	$("#fw_template_form").show();
	$("#add_item").remove();
    if (gOperatorName == "EG_TELECOM")
    {
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    }else{
        if(gNewUiFlag){
            $("#" + element).children().css("background-color", "#686666");
            $("#" + element).siblings().children().css("background-color", "#37373a");
            $("#" + element).css("background-color", "#686666").siblings().css("background-color", "#37373a"); 
        }else{
      $("#" + element).children().css("background-color", "#b7e3e3");
      $("#" + element).siblings().children().css("background-color", "#eef2f6");
      $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");  
    }
    }

	var index = element.split("_")[1];
	template_page_index = index; //赋值模板的 页面序号
	template_index = value;
	var mode = "old";
	displayFormHtml_template(mode, index, value);
	displayForm_enable(value);
	displayTableHtml_time();
	displayTableHtml_url();
}
function displayForm_enable(value){
	for(var i = 0; i < parental_control_info.length; i++){
		if(value == parental_control_info[i].template_index){
			$("input[name='parent_control_url_enable']").attr('data-src', template_index);
			$("input[name='parent_control_urlfilter_mode']").attr('data-src', template_index);
			if(parental_control_info[i].UrlFilterRight == "1"){
				$("input[name='parent_control_url_enable']").eq(0).attr('checked','true');
			}else{
				$("input[name='parent_control_url_enable']").eq(1).attr('checked','true');
			}
			if(parental_control_info[i].UrlFilterPolicy == "1"){
				$("input[name='parent_control_urlfilter_mode']").eq(0).attr('checked','true');
				}else{
					$("input[name='parent_control_urlfilter_mode']").eq(1).attr('checked','true');
				}
			}
		}
	}
function addfilter_template_name(){
    if (gNewUiFlag)
        $("#image_template").hide();
	$("#doSave_url").hide();
	$("#doSave_enable").hide();
	$("#tmplate_config").show();
	$("#template_save_delete").hide();
	$("#time_save_delete").hide();
	$("#time_add_remove").hide();
	$("#url_add_remove").hide();
	$("#fw_time_form").show();
	$("#fw_url_form").show();
	$("#create_template").show();
	$("#fw_template_form").show();

	var addHtml = []; //新增一个占位标记行
	addHtml += '<tr id="add_template_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';
	$("#ipfilter_List").append(addHtml);
	if ($("#add_template_item").length == 0) //第一次添加数据时设置默认值
	{
		$("#template_list").append(addHtml);
		$("#template_name").val('');
	
        if (gOperatorName == "EG_TELECOM")
        {
          $("#add_template_item").children().css("background-color", "#DEC0DF");
          $("#add_template_item").siblings().children().css("background-color", "#eef2f6");
          $("#add_template_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");      
        }else{
            if (gNewUiFlag) {
                $("#add_template_item").children().css("background-color", "#686666");
                $("#add_template_item").siblings().children().css("background-color", "#37373a");
                $("#add_template_item").css("background-color", "#686666").siblings().css("background-color", "#37373a");
            }else{
        $("#add_template_item").children().css("background-color", "#b7e3e3");
        $("#add_template_item").siblings().children().css("background-color", "#eef2f6");
        $("#add_template_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");    
        }
        }
	}
	displayFormHtml_template("init");
	addfilter_time(1);
	addfilter_url(1);
	
}

//显示模板列表当前选中行的详细信息
function displayFormHtml_template(mode, index, value) 
{
	if (value)
		template_data = parental_control_info[index];
	else
		template_data = {};
		
		displayTableHtml_time();
		displayTableHtml_url();
			
		

	
	selfilterIndex = value;//在显示某一条数据的时候，将selfilterIndex 切换
	if (mode == "init") //页面无数据时显示addfilter
	{
		if (parental_control_info.length > 0) {
		var	curdata = parental_control_info[index];
		} else {
			return;
		}
	}
	
	$("#template_name").val(template_data.Name);
	$("#template_name").attr('data-src', index +"_"+value);
	
}

//保存模板名字和url相关配置信息
function doSave_template_name(){
	show_shadow();
	var postdata = new Object();
	var src = document.getElementById('template_name').getAttribute('data-src');
	var template_index = src.split("_")[1];
	postdata.template_index = template_index;
	postdata.template_name = $("#template_name").val();
    if(operaotr_name == "PLE_PALTEL"){
      postdata.UrlFilterRight = "1";
      postdata.UrlFilterPolicy = "1";    
    }else{
      postdata.UrlFilterRight = $("input[name='parent_control_url_enable']:checked").val();
      postdata.UrlFilterPolicy = $("input[name='parent_control_urlfilter_mode']:checked").val();  
    }
	XHR.post("set_template_name", postdata, initPage);	
		
}

function doSave_url()
{

	show_shadow();
	
	if (!extraValidCheck_url()) // 额外校验，如要需要再打开
		{
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
			alert("illegal_value_alert".i18n());
			return;
		}
	
	if( ! $("#parent_control_list_form").valid() )
	{
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
	     alert("illegal_value_alert".i18n());
	    return;
	}
	var src = document.getElementById('site').getAttribute('data-src')
	var template_index = src.split("_")[0];
	var url_index = src.split("_")[1];
	var postdata = new Object();
	
	if (url_index.indexOf("add") >= 0){
		postdata.action = "add";
	}else{
		postdata.url_index = url_index;
		postdata.action = "edit";
	}
	
	if (postdata.action == "add")
	{
		if (template_index == "undefined")
		{
            if (gNewUiFlag)
                myAlert('Tip', '' + "fw_timeRuleErrorAlert".i18n() + '', function() { })
            else
		    alert("fw_timeRuleErrorAlert".i18n());
		    return;
		}  

	    if (parental_control_info[template_page_index].url.length >= 128)
	    {
			if (gNewUiFlag)
                myAlert('Tip', '' + "fw_most128RulesAlert".i18n() + '', function() { })
            else
	        	alert("fw_most128RulesAlert".i18n());
	        return;
	    }       
	}
	
	postdata.UrlAddress = $("#site").val();
	postdata.template_index = template_index;

	XHR.post("set_parental_control_url_info", postdata, initPage);	
		
}

function initValidate() {
	$("#parent_control_list_form").validate({
		debug: true,
		rules: {
			"profile":{
				required:true,
				rangelength:[1, 32],
				description:true
				},
			
			"template_name":{
				required:true,
				rangelength:[1, 32],
				description:true
				},
			"mac_address":{
				mac:true
			},
			
			"start_hour": {
				number: true,
				required:true,
				range_int_time:[0,23],
				rangelength:[1, 2],
			},
			"start_min": {
				number: true,
				required:true,
				range_int_time:[0, 59],
				rangelength:[1, 2],
			},
			"end_hour": {
				number: true,
				required:true,
				range_int_time:[0, 23],
				rangelength:[1, 2],
			},
			"end_min": {
				number: true,
				required:true,
				range_int_time:[0, 59],
				rangelength:[1, 2],
			},
			"site": {
                required:true,
				url:true,
				rangelength:[1, 255],
			}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	});
}

function initValidate_ple_paltel() {
	$("#parent_control_list_form").validate({
		debug: true,
		rules: {
			"profile":{
				required:true,
				rangelength:[1, 32],
				description:true
				},
			
			"template_name":{
				required:true,
				rangelength:[1, 32],
				description:true
				},
			"mac_address":{
				mac:true
			},
			
			"start_hour": {
				number: true,
				required:true,
				range_int_time: [0, 23],
				rangelength:[1, 2],
			},
			"start_min": {
				number: true,
				required:true,
				range_int_time: [0, 59],
				rangelength:[1, 2],
			},
			"end_hour": {
				number: true,
				required:true,
				range_int_time: [0, 23],
				rangelength:[1, 2],
			},
			"end_min": {
				number: true,
				required:true,
				range_int_time: [0, 59],
				rangelength:[1, 2],
			},
			"site": {
				url:true,
				rangelength:[1, 255],
			}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	});
}

function initValidate_url() {
	$("#parent_control_list_form").validate({
		debug: true,
		rules: {
			"site": {
				required:true,
				url:true,
				rangelength:[1, 255],
			}
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {},
		submitHandler: function(form) { //校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) { //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	});
}


function showthisinfo_time(element,value)//选中当前时间行并改变背景色
{
	$("#time_List").show();
	$("#fw_time_form").show();
	$("#add_item").remove();
    if (gOperatorName == "EG_TELECOM")
    {
        $("#" + element).children().css("background-color", "#DEC0DF");
        $("#" + element).siblings().children().css("background-color", "#eef2f6");
        $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
    }else{
        if(gNewUiFlag){
            $("#" + element).children().css("background-color", "#686666");
            $("#" + element).siblings().children().css("background-color", "#37373a");
            $("#" + element).css("background-color", "#686666").siblings().css("background-color", "#37373a");  
        }else{
     $("#" + element).children().css("background-color", "#b7e3e3");
     $("#" + element).siblings().children().css("background-color", "#eef2f6");
     $("#" + element).css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
    }
    }

	var template_display_index = element.split("_")[1];
	//selfilterIndex = parseInt(value.split("_")[1]);
	template_index = value.split("_")[0];
	 time_display_index = element.split("_")[1];
	 time_index = value.split("_")[1];
	 var mode = "old";
	displayFormHtml_time(mode, template_index, time_display_index,time_index);
}

//显示time列表当前选中行的详细信息
function displayFormHtml_time(mode, index, value,time_index) 
{

	var curdata = parental_control_info[template_page_index].time;
	
	//selfilterIndex = value;//在显示某一条数据的时候，将selfilterIndex 切换
	if (mode == "init") //页面无数据时显示addfilter
	{
		if (parental_control_info[template_page_index].length > 0) {
			curdata = parental_control_info[template_page_index];
		} else {
			return;
		}
	}
	var repeatDays = curdata[value].RepeatDay;
	var strArray = repeatDays.split(',');
	$("input[name='portbind']").each(function(){
			$(this).prop('checked', false);
	})
		
	for (var i in strArray) {
		$("input[name='portbind']").each(function(){
			if($(this).val() == strArray[i]){
				$(this).prop('checked', true);
			}
		})
	}
	$("#start_hour").val((curdata[value].StartTime).split(":")[0]);
	$("#start_min").val((curdata[value].StartTime).split(":")[1]);
	$("#end_hour").val((curdata[value].EndTime).split(":")[0]);
	$("#end_min").val((curdata[value].EndTime).split(":")[1]);
	$("#end_min").attr('data-src', index +"_"+time_index);
	
}

function doSave_time(){
	show_shadow();
	if( ! $("#parent_control_list_form").valid() )
	{
        if (gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
	     alert("illegal_value_alert".i18n());
	    return;
	}
	if (!extraValidCheck()) // 额外校验，如要需要再打开
		{
        if(gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
			alert("illegal_value_alert".i18n());
			return;
		}
	
	var src = document.getElementById('end_min').getAttribute('data-src')
	var template_index = src.split("_")[0];
	var time_index = src.split("_")[1];
	var postdata = new Object();
	if (time_index.indexOf("add") >= 0){
		
		postdata.action = "add";
	}else{
		
		postdata.time_index = time_index;
		postdata.action = "edit";
	}
	
	if (postdata.action == "add")
	{
        if (template_index == "undefined")
        {
            if (gNewUiFlag)
                myAlert('Tip', '' + "fw_timeRuleErrorAlert".i18n() + '', function() { })
            else
                alert("fw_timeRuleErrorAlert".i18n());
            return;
        } 
        
	    if (parental_control_info[template_page_index].time.length >= 8)
	    {
            if(gNewUiFlag)
                myAlert('Tip', '' + "fw_most8RulesAlert".i18n() + '', function() { })
            else
	        alert("fw_most8RulesAlert".i18n());
	        return;
	    }       
	}
	
	week_limit = checkWeek();
	postdata.RepeatDay  = week_limit;
	time_start = switchto24time($("#start_hour").val()) + ":" + switchto24time($("#start_min").val());
	time_stop = switchto24time($("#end_hour").val()) + ":" + switchto24time($("#end_min").val());
	postdata.StartTime  = time_start;
	postdata.EndTime  = time_stop;
	postdata.template_index = template_index;

	XHR.post("set_parental_control_time_info", postdata, initPage);	
}



function EnableCancel() {
	if (parental_control_enable == '0') {
		$("input[name='parent_control_enable']:last").attr('checked', 'checked');
	} else if (parental_control_enable == '1') {
		$("input[name='parent_control_enable']:first").attr('checked', 'checked');
	}

}


function displayTableHtml() //从后端获取 template Table中的数据并在表中显示
{
	var dynamicClsListHTML = '';
	for (var m = 0; m < parental_control_info.length; m++) {
		var single = parental_control_info[m];
		var num = m + 1;
		var flag;
		dynamicClsListHTML += '<tr id="template_' + m + '" style="cursor: pointer;" title=' + single.template_index +'  onclick="showthisinfo_template(this.id,this.title)">';
		//dynamicClsListHTML += '<td align="center" class="out_Name">' + num + '</td>';
		dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.Name + '</td>';
		if(mac_template_data.length == 0 ){
			
			dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + "acl_no".i18n() + '</td>';
		}else{
			var bindHtml = "";
			for(var n = 0; n< mac_template_data.length; n++){
				if(single.template_index == mac_template_data[n].TemplateInst){
					bindHtml = '<td align="center" class="out_SourceIP">' + "acl_yes".i18n() + '</td>';	
					flag = 1;
					break;
				}
			}
			
			if (bindHtml == ""){
				bindHtml = '<td align="center" class="out_SourceIP">' + "acl_no".i18n() + '</td>';
				flag = 0;
			}

			dynamicClsListHTML += bindHtml;
		}
		if(mac_template_data == [] ){
			dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + "No" + '</td>';
		}
			
		dynamicClsListHTML += '<td align="center"><input type="checkbox"  value='+flag+'_' + single.template_index +
			' name=pc_template></td>';
		dynamicClsListHTML += '</tr>';
	}
    if(gNewUiFlag && parental_control_info.length !=0){
        $("#image_template").hide();
    }
	$("#template_list").html(dynamicClsListHTML);
	$("#template_list tr:eq(0)").click();

}









function displayTableHtml_time()//从后端读取time table的数据并在表中显示
{
	var dynamicClsListHTML = '';
	if (template_data.time){
		if(template_data.time.length != 0){
			parental_control_time = template_data.time;
			for (var m = 0; m < parental_control_time.length; m++) {	
				var single = parental_control_time[m];
				var num = m + 1;
				dynamicClsListHTML += '<tr id="time_' + m + '" style="cursor: pointer;" title=' + single.template_index + '_'+single.time_index+' onclick="showthisinfo_time(this.id,this.title)">';
				//dynamicClsListHTML += '<td align="center" class="out_Name">' + num + '</td>';
				
					var array = single.RepeatDay.split(",");
					var htmlArray = "";
					for(var j=0;j<array.length;j++){
						if(array[j] == "Mon"){
							htmlArray += "Mon".i18n()+","
						}else if(array[j] == "Tue"){
							htmlArray += "Tue".i18n()+","
						}else if(array[j] == "Wed"){
							htmlArray += "Wed".i18n()+","
						}else if(array[j] == "Thu"){
							htmlArray += "Thu".i18n()+","
						}else if(array[j] == "Fri"){
							htmlArray += "Fri".i18n()+","
						}else if(array[j] == "Sat"){
							htmlArray += "Sat".i18n()+","
						}else if(array[j] == "Sun"){
							htmlArray += "Sun".i18n()+","
						}
					}
					var newHtmlArray = htmlArray.slice(0,-1);
				dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + newHtmlArray + '</td>';
				 dynamicClsListHTML += '<td align="center" class="out_SourcePort">' + single.StartTime+ '--'+ single.EndTime +'</td>';
				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value='+single.template_index+'_' + single.time_index +
					'" name="pc_template_time"></td>';
				dynamicClsListHTML += '</tr>';
			}
			$("#time_List").html(dynamicClsListHTML);
			$("#time_List tr:eq(0)").click();
            if(gNewUiFlag)
                $("#image_time").hide();
		}else{
			$("#time_List").html("");
			$("#start_hour").val("");
			$("#start_min").val("");
			$("#end_hour").val("");
			$("#end_min").val("");
			$("input[name=portbind]").prop('checked', false);
		}
		
	}
}
function displayTableHtml_url()//从后端读取time table的数据并在表中显示
{
	var dynamicClsListHTML = '';
	if (template_data.url){
		if(template_data.url.length != 0){
			parental_control_url = template_data.url;
			for (var m = 0; m < parental_control_url.length; m++) {	
				var single = parental_control_url[m];
				var num = m + 1;
				dynamicClsListHTML += '<tr id="url_' + m + '" style="cursor: pointer;" title=' +single.template_index + '_'+single.url_index+'  onclick="showthisinfo_url(this.id,this.title)">';
				//dynamicClsListHTML += '<td align="center" class="out_Name">' + num + '</td>';
				dynamicClsListHTML += '<td align="center" class="out_SourceIP">' + single.UrlAddress + '</td>';
				dynamicClsListHTML += '<td align="center"><input type="checkbox"  value='+single.template_index+'_' + single.url_index +
					'" name="pc_template_url"></td>';
				dynamicClsListHTML += '</tr>';
			}
			
			$("#url_List").html(dynamicClsListHTML);
			$("#url_List tr:eq(0)").click();
            if(gNewUiFlag)
                $("#image_url").hide();
		}else{
			$("#url_List").html("");
			$("#site").val("");
		}
		
	}
	
}



function addfilter() //点击add后显示的页面
{
	addflag = "add";
	$("#fw_config_form").show();
	$("#network_user").val("1"); 
	$("#mac_address").prop("disabled", false);
	var addHtml = []; //新增一个占位标记行
	addHtml += '<tr id="add_item">';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td align="center">--</td>';
	addHtml += '<td></td>';
	addHtml += '</tr>';
	//$("#ipfilter_List").append(addHtml);
	if ($("#add_item").length == 0) //第一次添加数据时设置默认值
	{
		$("#ipfilter_List").append(addHtml);
		$(".input_text").each(function(i) {
			$(this).val('');
		});
		$("input[type = checkbox]").each(function(i) {
			$(this).prop('checked', false);
		});
        if (gOperatorName == "EG_TELECOM")
        {
            $("#add_item").children().css("background-color", "#DEC0DF");
            $("#add_item").siblings().children().css("background-color", "#eef2f6");
            $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");
        }else{
         $("#add_item").children().css("background-color", "#b7e3e3");
         $("#add_item").siblings().children().css("background-color", "#eef2f6");
         $("#add_item").css("background-color", "#b7e3e3").siblings().css("background-color", "#eef2f6");   
        }   
		
	}
}


function extraValidCheck_url() {
	if($("#site").val() == ""){
        if(gNewUiFlag)
            myAlert('Tip', '' + "fw_urlErrorAlert".i18n() + '', function() { })
        else
		alert("fw_urlErrorAlert".i18n())
		$("#url-error").html("fw_urlErrorAlert".i18n());
		return false;
	}
	return true;
}



function extraValidCheck() {
	var item = 0;
	$("input:checkbox[name='portbind']").each(function(){
	    if($(this).is(":checked") ){
			item++;
	       }
	   })
	   if(item <=0){
		if(gNewUiFlag)
			myAlert('Tip', "fw_dayErrorAlert".i18n())
		else
			$("#main_content-error").html("fw_dayErrorAlert".i18n());

	   	return false;
	   }
	
	var start_hour = $("#start_hour").val();
	var start_min = $("#start_min").val();
	var end_hour = $("#end_hour").val();
	var end_min = $("#end_min").val();
	var time_start = parseInt($("#start_hour").val()) * 60 + parseInt($("#start_min").val());
	var time_stop = parseInt($("#end_hour").val()) * 60 + parseInt($("#end_min").val());
	if (parseInt(time_start) > parseInt(time_stop)) {
		$("#Time-error").html("fw_timeErrorAlert".i18n());
		return false;
	}
	return true;
}

//检查当前mac地址和规则中mac地址是否重复
function checkMacRepeat(current_mac){
	for(var i = 0; i< parental_control_data.length; i++){
		if(current_mac == parental_control_data[i].MACAddress){
			
			return true;
		}
	}
}

function checkTime(){
	var day = checkWeek();
	var time_start = parseInt($("#start_hour").val()) * 60 + parseInt($("#start_min").val());
	var time_stop = parseInt($("#end_hour").val()) * 60 + parseInt($("#end_min").val());
	var current_mac;
	if($("#network_user").val() == "1" ){
		current_mac = $("#mac_address").val();
	}else{
		current_mac = $("#network_user").val();
	}

	//if(checkMacRepeat(current_mac)){
	var current_day = day.split(",");
	//校验星期重复
	for(var i = 0; i < parental_control_data.length; i++){//遍历所有规则
		if (current_mac != parental_control_data[i].MACAddress)
		{
			continue;
		}
		var repeatDay = parental_control_data[i].repeatDays.split(","); //取出规则中的星期
		if(selfilterIndex == parental_control_data[i].parental_cotrol_index) //修改 直接continue
		{
			continue;
		}
		
		for(var j = 0; j< repeatDay.length;j++){ //遍历规则中的所有星期
			for(var k = 0 ; k < current_day.length; k++ ){//遍历当前下发的这条规则中的所有星期
				if(repeatDay[j] == current_day[k]){
					var rule_startTime_arr = parental_control_data[i].startTime.split(":");
					var rule_startTime = parseInt(rule_startTime_arr[0]) * 60 + parseInt(rule_startTime_arr[1]);
					var rule_endTime_arr = parental_control_data[i].endTime.split(":");
					var rule_endTime = parseInt(rule_endTime_arr[0]) * 60 + parseInt(rule_endTime_arr[1]);
					if(!checkTimeRepeat(rule_startTime,rule_endTime,time_start,time_stop)){
						return false;
					}
					
				}
			}
		}
	}
	return true;
	
}

function checkTimeRepeat(rule_startTime,rule_endTime,time_start,time_stop){
	
	
	if(parseInt(time_start)  < parseInt(rule_endTime)  && parseInt(rule_startTime)  < parseInt(time_stop)){
        if(gNewUiFlag)
            myAlert('Tip', '' + "illegal_repeat_time_alert".i18n() + '', function() { })
        else
		alert("illegal_repeat_time_alert".i18n());
		return false;
	}
	return true;
}

function click_remove() //点击删除按钮，可以删除单个和多个
{
	var checkNodes = $("input[name='fw_remove_flag']");
	var is_checked;
	var value_temp;
	var index;

	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
		alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[name='fw_remove_flag']").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
        else
		alert("no_selected_rules_alert".i18n());
		return;
	}
    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
	for (var i = 0; i < checkNodes.length; i++) {
		if (checkNodes[i].checked == true) {
			value_temp = checkNodes[i].value;
			index = value_temp.split("_")[1];
			doDelete(index);
		}
	}
	window.location.reload();
            }
        });
    } else {
        if (confirm("delete_alert".i18n()) == false) //确认删除
        {
            return;
        }
        for (var i = 0; i < checkNodes.length; i++) {
            if (checkNodes[i].checked == true) {
                value_temp = checkNodes[i].value;
                index = value_temp.split("_")[1];
                doDelete(index);
            }
        }
        window.location.reload();
    }
}

function click_remove_all() {
	var checkNodes = $("input[name='fw_remove_flag']");
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
		alert("no_rules_alert".i18n());
		return;
	}
    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert_all".i18n() + '', function(r) {
            if (r) {
                for (var i = 0; i < checkNodes.length; i++) {
                    value_temp = checkNodes[i].value;
                    index = value_temp.split("_")[1];
                    doDelete(index);
                }
                window.location.reload();
            }
        });
    } else {
	if (confirm("delete_alert_all".i18n()) == false) {
		return;
	}
	for (var i = 0; i < checkNodes.length; i++) {
		value_temp = checkNodes[i].value;
		index = value_temp.split("_")[1];
		doDelete(index);
	}
	 window.location.reload();
    }
}


function EnableApply() {
	show_shadow();
	var postdata = new Object();
	postdata.action = "enable";
	postdata.parent_control_enable = $("input[name='parent_control_enable']:checked").val();
	XHR.post("set_parental_control_info", postdata, initPage);
}


function checkWeek() {
	var everyday =  $('#Everyday').prop('checked');
	if (everyday) {		
		return "Mon,Tue,Wed,Thu,Fri,Sat,Sun";
	} else {
		var str = "";
		$("input[name='portbind']").each(function() {
			if ($(this).is(":checked")) {
				str += $(this).val() + ",";
			}
		});
		str = str.substring(0, str.length - 1);
		return str;
	}

}


//创建模板
function create_template(){
	show_shadow();
	//清除自定义错误提示
	$(".main_item_error_hint_extra").each(function(i) {
		$(this).html('');
	});

	if(gNewUiFlag){
		$(".error-conter").each(function(i) {
			$(this).html('');
		});
	}
	
	if( ! $("#parent_control_list_form").valid() )
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
	     alert("illegal_value_alert".i18n());
	    return;
	}
	
	
	if (!extraValidCheck()) // 额外校验，如要需要再打开
		{
        if(gNewUiFlag)
            myAlert('Tip', '' + "illegal_value_alert".i18n() + '', function() { })
        else
			alert("illegal_value_alert".i18n());
			return;
		}
	
	var time_start;
	var time_stop;
	var postdata = new Object();
	postdata.action = "add";
	postdata.Name = $("#template_name").val();
	for(var i = 0; i < parental_control_info.length; i++)
	{
		if(postdata.Name == parental_control_info[i].Name)
		{
            if(gNewUiFlag)
                myAlert('Tip', '' + "template_name_repeat".i18n() + '', function() { })
            else
			alert("template_name_repeat".i18n());
			return;
		}
	}
	
	if (postdata.action == "add")
	{
	    if (parental_control_info.length >= 8)
	    {
            if(gNewUiFlag)
                myAlert('Tip', '' + "fw_most8RulesAlert".i18n() + '', function() { })
            else
	        alert("fw_most8RulesAlert".i18n());
	        return;
	    }       
	}
	
	week_limit = checkWeek();
	postdata.RepeatDay = week_limit;
	time_start = switchto24time($("#start_hour").val()) + ":" + switchto24time($("#start_min").val());
	time_stop = switchto24time($("#end_hour").val()) + ":" + switchto24time($("#end_min").val());
	postdata.StartTime  = time_start;
	postdata.EndTime  = time_stop;
	postdata.UrlFilterRight  = $("input[name='parent_control_url_enable']:checked").val();
	postdata.UrlFilterPolicy  = $("input[name='parent_control_urlfilter_mode']:checked").val();
	postdata.UrlAddress  = $("#site").val();	
	XHR.post("set_parental_control_template", postdata, initPage);
}

//删除模板
function click_remove_template()
{
	var checkNodes = $("input[name='pc_template']");
	var is_checked;
	var value_temp;
	var index;
	//console.log(JSON.stringify(checkNodes));
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
			alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[name='pc_template']").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
        else
			alert("no_selected_rules_alert".i18n());
		return;
	}

    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
                for (var i = 0; i < checkNodes.length; i++) {
                    if (checkNodes[i].checked == true) {
                        value_temp = checkNodes[i].value;
                        index = value_temp.split("_")[1];
                        var mac_template_flag = value_temp.split("_")[0];
                        if(doDelete_template(index, mac_template_flag) == 0)
                        	break;    
                    }
                }
                window.location.reload();
            }
        });
    } else {
	if (confirm("delete_alert".i18n()) == false) //确认删除
	{
		return;
	}
	
	
	for (var i = 0; i < checkNodes.length; i++) {
		if (checkNodes[i].checked == true) {
			value_temp = checkNodes[i].value;
			index = value_temp.split("_")[1];
			var mac_template_flag = value_temp.split("_")[0];
			if(doDelete_template(index, mac_template_flag) == 0)
			break;	
		}
	}
	window.location.reload();
    }
}

function doDelete_template(index,mac_template_flag) //删除模板操作
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.parental_control_index = parseInt(index);
	if(mac_template_flag == "1"){
        if(gNewUiFlag){
            myAlert('Tip', '' + "delete_template_unbind_mac_first".i18n() + '', function() { })
			sleep(300)
		}
        else
			alert("delete_template_unbind_mac_first".i18n());
		return 0;
	}
	XHR.post("set_parental_control_template", postdata, initPage);
	sleep(300);
}

//删除mac地址与模板绑定关系
function click_remove_mac_template()
{
	var checkNodes = $("input[name='pc_mac_template']");
	var is_checked;
	var value_temp;
	var index;
	//console.log(JSON.stringify(checkNodes));
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
		alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[name='pc_mac_template']").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
        else
		alert("no_selected_rules_alert".i18n());
		return;
	}

    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
                for (var i = 0; i < checkNodes.length; i++) {
                    if (checkNodes[i].checked == true) {
                        value_temp = checkNodes[i].value;
                        index = value_temp.split("_")[1];
                        doDelete_mac_template(index);
                    }
                }
                window.location.reload();
            }
        });
    } else {
        if (confirm("delete_alert".i18n()) == false){
		return;
	}
	for (var i = 0; i < checkNodes.length; i++) {
		if (checkNodes[i].checked == true) {
			value_temp = checkNodes[i].value;
			index = value_temp.split("_")[1];
			doDelete_mac_template(index);
		}
	}
	window.location.reload();
}
}




//删除mac地址与模板之间的绑定关系操作
function doDelete_mac_template(index) 
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.mac_template_index = parseInt(index);
	XHR.post("set_parental_mac_template_info", postdata, initPage);
	sleep(300);
}

//删除当前模板中的时间
function click_remove_time()
{
	var checkNodes = $("input[name='pc_template_time']");
	var is_checked;
	var value_temp;
	var index;
	var template_index;
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
		alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[name='pc_template_time']").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
        else
		alert("no_selected_rules_alert".i18n());
		return;
	}

    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
                for (var i = 0; i < checkNodes.length; i++) {
                    if (checkNodes[i].checked == true) {
                        value_temp = checkNodes[i].value;
                        index = value_temp.split("_")[1];
                        template_index = value_temp.split("_")[0];
                        doDelete_time(index,template_index);
                    }
                }
                window.location.reload();
            }
        });
    } else {
        if (confirm("delete_alert".i18n()) == false){
		return;
	}
	for (var i = 0; i < checkNodes.length; i++) {
		if (checkNodes[i].checked == true) {
			value_temp = checkNodes[i].value;
			index = value_temp.split("_")[1];
			template_index = value_temp.split("_")[0];
			
			doDelete_time(index,template_index);
		}
	}
	window.location.reload();
    }
}

//删除当前模板中的时间操作
function doDelete_time(index,template_index) 
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.template_index = parseInt(template_index);
	postdata.time_index = parseInt(index);
	XHR.post("set_parental_control_time_info", postdata, initPage);
	sleep(300);
}


//删除当前模板中的url
function click_remove_url()
{
	var checkNodes = $("input[name='pc_template_url']");
	var is_checked;
	var value_temp;
	var index;
	var template_index;
	
	if (0 == checkNodes.length) //如果沒有数据，则返回并报错
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
		alert("no_rules_alert".i18n());
		return;
	}

	is_checked = $("input[name='pc_template_url']").is(':checked'); //判断是否有选中

	if (!is_checked) //如果没有选中任何条目
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_selected_rules_alert".i18n() + '', function() { })
        else
		alert("no_selected_rules_alert".i18n());
		return;
	}

    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
                for (var i = 0; i < checkNodes.length; i++) {
                    if (checkNodes[i].checked == true) {
                        value_temp = checkNodes[i].value;
                        index = value_temp.split("_")[1];
                        template_index = value_temp.split("_")[0];
                        doDelete_url(index,template_index);
                    }
                }
                window.location.reload();
            }
        });
    } else {
        if (confirm("delete_alert".i18n()) == false){
		return;
	}
	for (var i = 0; i < checkNodes.length; i++) {
		if (checkNodes[i].checked == true) {
			value_temp = checkNodes[i].value;
			index = value_temp.split("_")[1];
			template_index = value_temp.split("_")[0];
			
			doDelete_url(index,template_index);
		}
	}
	window.location.reload();
    }
}

//删除当前模板中的时间操作
function doDelete_url(index,template_index) 
{
	var postdata = new Object();
	postdata.action = "delete";
	postdata.template_index = parseInt(template_index);
	postdata.url_index = parseInt(index);
	XHR.post("set_parental_control_url_info", postdata, initPage);
	sleep(300);
}


//全部删除模板和mac地址关联关系
function click_remove_mac_template_all()
{
    var checkNodes = $("input[name ='pc_mac_template']");
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
        alert("no_rules_alert".i18n());
        return;
    }
    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert".i18n() + '', function(r) {
            if (r) {
                for(var i = 0; i < checkNodes.length; i++)
    {
                    var value_temp = checkNodes[i].value;
                    var  index = value_temp.split("_")[1];
                    doDelete_mac_template(index);
                }
                window.location.reload();
            }
        });
    } else {
        if(confirm("delete_alert_all".i18n()) == false){
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
       var value_temp = checkNodes[i].value;
       var  index = value_temp.split("_")[1];
        doDelete_mac_template(index);
    }
	window.location.reload();
    }
}


//删除全部模板
function click_remove_template_all()
{
    var checkNodes = $("input[name ='pc_template']");
	var mac_template_flag;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
        alert("no_rules_alert".i18n());
        return;
    }
    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert_all".i18n() + '', function(r) {
            if (r) {
                for(var i = 0; i < checkNodes.length; i++)
                {
                    var value_temp = checkNodes[i].value;
                    var  index = value_temp.split("_")[1];
                    var mac_template_flag = value_temp.split("_")[0];
                    doDelete_template(index, mac_template_flag);
                }
                window.location.reload();
            }
        });
    } else {
    if(confirm("delete_alert_all".i18n()) == false)
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
       var value_temp = checkNodes[i].value;
       var  index = value_temp.split("_")[1];
	   var mac_template_flag = value_temp.split("_")[0];
        doDelete_template(index, mac_template_flag);
    }
	window.location.reload();
    }
}


//删除当前模板中的所有时间
function click_remove_time_all()
{
	var checkNodes = $("input[name ='pc_template_time']");
	var index;
	var template_index;
	if(0 == checkNodes.length) //如果沒有数据，则返回并报错
	{   
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
	    alert("no_rules_alert".i18n());
	    return;
	}
    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert_all".i18n() + '', function(r) {
            if (r) {
                for(var i = 0; i < checkNodes.length; i++)
                {
                    var value_temp = checkNodes[i].value;
                    var  index = value_temp.split("_")[1];
                    var template_index = value_temp.split("_")[0];
                    doDelete_time(index,template_index);
                }
                window.location.reload();
            }
        });
    } else {
	if(confirm("delete_alert_all".i18n()) == false)
	{
	    return;
	}
	for(var i = 0; i < checkNodes.length; i++)
	{
	   var value_temp = checkNodes[i].value;
	   var  index = value_temp.split("_")[1];
	   var template_index = value_temp.split("_")[0];
	    doDelete_time(index,template_index);
	}
	window.location.reload();
    }
}

//删除当前模板中的所有url
function click_remove_url_all()
{
	var checkNodes = $("input[name ='pc_template_url']");
	var index;
	var template_index;
	if(0 == checkNodes.length) //如果沒有数据，则返回并报错
	{   
        if(gNewUiFlag)
            myAlert('Tip', '' + "no_rules_alert".i18n() + '', function() { })
        else
	    alert("no_rules_alert".i18n());
	    return;
	}
    if (gNewUiFlag) {
        myConfirm('Tip', '' + "delete_alert_all".i18n() + '', function(r) {
            if (r) {
                for(var i = 0; i < checkNodes.length; i++)
                {
                    var value_temp = checkNodes[i].value;
                    var  index = value_temp.split("_")[1];
                    var template_index = value_temp.split("_")[0];
                    doDelete_url(index,template_index);
                }
                window.location.reload();
            }
        });
    } else {
	if(confirm("delete_alert_all".i18n()) == false)
	{
	    return;
	}
	for(var i = 0; i < checkNodes.length; i++)
	{
	   var value_temp = checkNodes[i].value;
	   var  index = value_temp.split("_")[1];
	   var template_index = value_temp.split("_")[0];
	    doDelete_url(index,template_index);
	}
	window.location.reload();
    }
	//XHR.get("get_url_filter_info", null, initPage);//删除操作后，重新刷新页面
}

//保存url enable 和黑白名单信息
function doSave_enable()
{
	//console.log(document.getElementById('site').getAttribute('data-src'));
	show_shadow();
	
	var src = document.getElementsByName('parent_control_url_enable')[0].getAttribute('data-src');
	var template_index = src;
	
	if (template_index == "undefined" || template_index == null )
	{
        if(gNewUiFlag)
            myAlert('Tip', '' + "fw_timeRuleErrorAlert".i18n() + '', function() { })
        else
	    alert("fw_timeRuleErrorAlert".i18n());
	    return;
	}  
	var postdata = new Object();
	postdata.template_index = template_index;
	postdata.UrlFilterRight = $("input[name='parent_control_url_enable']:checked").val();
	postdata.UrlFilterPolicy = $("input[name='parent_control_urlfilter_mode']:checked").val();
	//console.log(postdata);
	XHR.post("set_parental_control_url_enable", postdata, initPage);	
}
function selectAllParent(){
        if($("#checkAllTime").prop("checked")){
            $("input[name='pc_template_time']").prop("checked",true)
        }else{
            $("input[name='pc_template_time']").prop("checked",false)
        }
        if($("#checkAllUrl").prop("checked")){
            $("input[name='pc_template_url']").prop("checked",true)
        }else{
            $("input[name='pc_template_url']").prop("checked",false)
        }
        if($("#checkAll").prop("checked")){
            $("input[name='pc_template']").prop("checked",true)
        }else{
            $("input[name='pc_template']").prop("checked",false)
        }
        if($("#checkAllMac").prop("checked")){
            $("input[name='pc_mac_template']").prop("checked",true)
        }else{
            $("input[name='pc_mac_template']").prop("checked",false)
        }
}