var urlfilter_mode;
var urlfilter_enable;
var template_addflag = "edit";
var url_filter_data;
var selfilterIndex = 1;
var urlflag = true;
var template_data;
var time_template_index;
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");	
	//extraValidCheck();
	$(".main_item_error_hint_extra").each(function (i){
		$(this).html('');
	});
    if(operator_name == "EG_TELECOM")
    {
        urlflag = false;
    }
	initValidate();
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/ipfilter_lan", initPage);
	}
	else
	{
		XHR.get("get_time_template_info", null, initPage);
	}
});



function initValidate()
{	
	$("#ip_filter_list_form").validate({
		debug: true,
		rules: {
            "template_name":{
            	required:true,
            	rangelength:[1, 32],
            	description:true
            	},
            "url_address": {required:true,url:urlflag,rangelength:[1, 255]},
			"url_start_hour":{required:true,number:true,range_int_time:[0,23],rangelength:[1, 2]},
			"url_start_min":{required:true,number:true,range_int_time:[0,59],rangelength:[1, 2]},
			"url_end_hour":{required:true,number:true,range_int_time:[0,23],rangelength:[1, 2]},
			"url_end_min":{required:true,number:true,range_int_time:[0,59],rangelength:[1, 2]},
            
		},
		errorPlacement: function(error, element) { //错误信息位置设置方法
			error.insertAfter(element.parent().parent());
		},
		messages: {
		},
		submitHandler: function(form){//校验成功回调
			fiberlog("validate mac filter ok.....");
		},
		invalidHandler: function(form, validator) {  //校验失败回调
			fiberlog("validate mac filter failed.....");
			return false;
		}
	}); 
}
function Showthisinfo(element,value) //选中当前行并改变背景色
{
    $("#fw_templete_form").show();
    addflag = "edit";
    $("#add_item").remove();
    if(operator_name == "EG_TELECOM")
    {
        $("#"+element).children().css("background-color","#DEC0DF");
        $("#"+element).siblings().children().css("background-color","#eef2f6");
        $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }else
    {
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
    }
    var index = element.split("_")[1];
    selfilterIndex = parseInt(value.split("_")[value.split("_").length - 1]);
    var mode = "old";
    var template_name = value.split("_")[0]

    displayFormHtml(mode, index);
    displayTemplateTimeTableHtml(template_name);
}

function Showthisinfotime(element,value) //选中当前行并改变背景色
{
   
    $("#fw_time_templete_form").show();
    addflag = "edit";
    $("#add_item").remove();
   // alert(element);
    console.log(element);
    $("#"+element).children().css("background-color","#b7e3e3");
    $("#"+element).siblings().children().css("background-color","#eef2f6");
    $("#"+element).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");

    var time_index = value.split("out_")[1];
    var mode = "old";

    displayFormtimeHtml(mode, time_index);
}

function displayFormtimeHtml(mode, index) //显示当前选中行的详细信息
{
    //alert(index);
    var template_index =  parseInt(index.split("_")[0]) - 1;
    time_template_index =  parseInt(index.split("_")[1]) - 1;
   // alert(template_index);
    var curdata =template_data[template_index];
    
    if (mode == "init") //页面无数据时显示addfilter
    {
        if (template_data.length > 0)
        {
            curdata = template_data[index];
        }
        else
        {
           // addfilter();
            return;
        }
    }
  
    $("#time_template_name").val(index.split("_")[0]);
     $("#time_template_name").attr("disabled",true);
     console.log(curdata);
    var repeatDays = curdata.time_template[time_template_index].RepeatDay;
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
    
    $("#start_hour").val((curdata.time_template[time_template_index].StartTime).split(":")[0]);
    $("#start_min").val((curdata.time_template[time_template_index].StartTime).split(":")[1]);
    $("#end_hour").val((curdata.time_template[time_template_index].EndTime).split(":")[0]);
    $("#end_min").val((curdata.time_template[time_template_index].EndTime).split(":")[1]);
}


function displayFormHtml(mode, index) //显示当前选中行的详细信息
{
    var curdata =template_data[index];

    if (mode == "init") //页面无数据时显示addfilter
    {
        if (template_data.length > 0)
        {
            curdata = template_data[index];
        }
        else
        {
           // addfilter();
            return;
        }
    }

    $("#template_name").val(curdata.Name);   
}

function displayTemplateTableHtml()//从后端获取 urlFilter Table中的数据并在表中显示
{
    var dynamicClsListHTML = '';
    
    for (var m=0; m < template_data.length; m++)
    {
        var single = template_data[m];
	
	var num = m + 1;
        dynamicClsListHTML += '<tr id="templatetable_'+m+'" style="cursor: pointer;" title="'+single.Name+'_'+single.template_index +'" onclick="Showthisinfo(this.id,this.title)">';
        dynamicClsListHTML += '<td align="center" class="out_Name">' + single.Name + '</td>';
        dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="delout_'+ single.template_index +'" name="fw_remove_template"></td>';
        dynamicClsListHTML += '</tr>';
    }
    $("#template_List").html(dynamicClsListHTML);
	$("#template_List tr:eq(0)").click();
}

function displayTemplateTimeTableHtml(template_name)//从后端获取 urlFilter Table中的数据并在表中显示
{
    
    var dynamicClsListHTML = '';
   console.log(template_name);
   var template = template_data;
  // console.log(template.length);
   var num = 1;
    for (var m=0; m < template.length; m++)
    {
        var time_template = template[m].time_template;
        //alert(time_template.length);
        for(var n=0; n < time_template.length; n++)
        {
                console.log(time_template[n]);
                var single = time_template[n];
                if(template_name != template[m].Name )
                {
                    continue;
                }
                  dynamicClsListHTML += '<tr id="templatimetetable_'+num+'" style="cursor: pointer;" title="delout_'+  template[m].template_index+'_'+single.template_time_index+'" onclick="Showthisinfotime(this.id,this.title)">';
                  dynamicClsListHTML += '<td align="center" class="out_Name">' + template[m].Name + '</td>';
                  dynamicClsListHTML += '<td align="center" class="out_Name">' + single.StartTime+'-'+ single.EndTime+'</td>';
                   dynamicClsListHTML += '<td align="center" class="out_Name">' + single.RepeatDay+ '</td>';
                  dynamicClsListHTML += '<td align="center"><input type="checkbox"  value="delout_'+template[m].template_index+'_'+single.template_time_index+'" name="fw_remove_flag"></td>';
                  dynamicClsListHTML += '</tr>';
                 num++ ;
        }
      
    }
    $("#time_List").html(dynamicClsListHTML);
    $("#fw_time_templete_form").hide();
	//$("#time_List tr:eq(0)").click();
}

function add_templete()
{
    
    template_addflag = "add";
    $("#fw_templete_form").show(); 
    var addHtml = []; //新增一个占位标记行
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    
    addHtml += '<td></td>';
    addHtml += '</tr>';
	//$("#ipfilter_List").append(addHtml);
    if ($("#add_item").length == 0)//第一次添加数据时设置默认值
    {
		$("#template_List").append(addHtml);
        $(".input_text").each(function (i){
           $(this).val('');
        });

            $("#add_item").children().css("background-color","#b7e3e3");
            $("#add_item").siblings().children().css("background-color","#eef2f6");
            $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6"); 
    }    
        

    
}

function addtime_templete()//点击add后显示的页面
{
    addflag = "add";
    $("#fw_time_templete_form").show(); 
    $("#time_template_name").attr("disabled",false);
    var addHtml = []; //新增一个占位标记行
    addHtml += '<tr id="add_item">';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td align="center">--</td>';
    addHtml += '<td></td>';
    addHtml += '</tr>';
	$("#time_List").append(addHtml);
    if ($("#add_item").length == 0)//第一次添加数据时设置默认值
    {
		$("#time_List").append(addHtml);
        $(".input_text").each(function (i){
           $(this).val('');
        });
		$("#url_start_hour").val("00");
		$("#url_start_min").val("00");
		$("#url_end_hour").val("23");
		$("#url_end_min").val("59");
        if(operator_name == "EG_TELECOM")
        {
            $("#add_item").children().css("background-color","#DEC0DF");
            $("#add_item").siblings().children().css("background-color","#eef2f6");
            $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
            }
        }else{
            $("#add_item").children().css("background-color","#b7e3e3");
            $("#add_item").siblings().children().css("background-color","#eef2f6");
            $("#add_item").css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
        }    
        
        
}

function initPage(getdata)//从后端获取数据，初始化页面
{
    if (getdata != null && getdata.template_info)
	{
		template_data = getdata.template_info.template_data;
       // EnableCancel();	
       
        displayTemplateTableHtml();
        //displayTemplateTimeTableHtml();
        var template_select_all;
        for(var i = 0; i< template_data.length; i++)
        {
           var  template_select = '<option value='+template_data[i].template_index+'>'+template_data[i].Name+'</option>';
            template_select_all += template_select;
        }
        displayTemplateTimeTableHtml(template_data[0].Name);
        console.log(template_select);
        $("#time_template_name").html(template_select_all);
        displayFormHtml("init", 0);
         if(operator_name == "EG_TELECOM")
         {
             $("#ipfilter_List").children().eq(0).children().css("background-color","#DEC0DF");
             $("#ipfilter_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
             $("#ipfilter_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");
             
         }else{
          $("#ipfilter_List").children().eq(0).children().css("background-color","#b7e3e3");
          $("#ipfilter_List").children().eq(0).siblings().children().css("background-color","#eef2f6");
          $("#ipfilter_List").children().eq(0).css("background-color","#b7e3e3").siblings().css("background-color","#eef2f6");   
         }
        
	}
}

function doDeleteTime(index) //删除操作
{  
  //  alert(index);
    var postdata = new Object();
    postdata.action = "delete";
    postdata.template_index = parseInt(index.split("_")[0]);
    postdata.time_index =  parseInt(index.split("_")[1]);
  // alert(JSON.stringify(postdata));
    XHR.post("set_time_template_info", postdata, initPage);
	sleep(300);
}


function doDelete(index) //删除操作
{  
    var postdata = new Object();
    postdata.action = "delete";
    postdata.template_index = parseInt(index);
    XHR.post("set_template_info", postdata, initPage);
	sleep(300);
}

function extraValidCheck()
{	
	var start_hour = $("#url_start_hour").val();
	var start_min = $("#url_start_min").val();
	var end_hour = $("#url_end_hour").val(); 
	var end_min =  $("#url_end_min").val();
	var start = parseInt($("#url_start_hour").val()) * 60 + parseInt($("#url_start_min").val());
	var end = parseInt($("#url_end_hour").val()) * 60 + parseInt($("#url_end_min").val());
    if ( parseInt(start) > parseInt(end))
    {
        $("#Time-error").html("fw_timeErrorAlert".i18n());
        return false;
    }
	return true;
}

function remove_templete() //点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("input[name='fw_remove_template']");
    console.log(checkNodes.length);
    var is_checked;
    var value_temp;
    var index;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("input[name='fw_remove_template']").is(':checked'); //判断是否有选中

    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
   
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
        if(checkNodes[i].checked == true)
        {
           
            value_temp = checkNodes[i].value;
            index = value_temp.split("_")[1];
          //  alert(index);
            doDelete(index);
        }
    }
   window.location.reload();
    //XHR.get("get_url_filter_info", null, initPage); //删除操作后，重新刷新页面
}

function remove_templete_all()
{
    var checkNodes = $("input[name='fw_remove_template']");;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }
    if(confirm("delete_alert_all".i18n()) == false)
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
        value_temp = checkNodes[i].value;
        index = value_temp.split("_")[1];
        doDelete(index);   
    }
	window.location.reload();
    //XHR.get("get_url_filter_info", null, initPage);//删除操作后，重新刷新页面
}


function removetime_templete()//点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("input[name='fw_remove_flag']");
    var is_checked;
    var value_temp;
    var index;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    is_checked = $("input[name='fw_remove_flag']").is(':checked'); //判断是否有选中

    if(!is_checked) //如果没有选中任何条目
    {
        alert("no_selected_rules_alert".i18n());
        return ;
    }
   
    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
       
            value_temp = checkNodes[i].value.split("delout_")[1];
            doDeleteTime(value_temp);
        
    }
   window.location.reload();
    //XHR.get("get_url_filter_info", null, initPage); //删除操作后，重新刷新页面
}


function removetime_templete_all()//点击删除按钮，可以删除单个和多个
{
    var checkNodes = $("input[name='fw_remove_flag']");
    var is_checked;
    var value_temp;
    var index;
    if(0 == checkNodes.length) //如果沒有数据，则返回并报错
    {   
        alert("no_rules_alert".i18n());
        return;
    }

    if(confirm("delete_alert".i18n()) == false) //确认删除
    {
        return;
    }
    for(var i = 0; i < checkNodes.length; i++)
    {
       
            value_temp = checkNodes[i].value.split("delout_")[1];
            doDeleteTime(value_temp);
        
    }
   window.location.reload();
    //XHR.get("get_url_filter_info", null, initPage); //删除操作后，重新刷新页面
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

function doSaveTemplate()
{
   // show_shadow();
    if( ! $("#schedule_list_form").valid() )
    {
         alert("illegal_value_alert".i18n());
        return;
    }
    
    var postdata = new Object();
    postdata.action = template_addflag;
    if (template_addflag == "edit"){
        postdata.template_index = selfilterIndex;
    }
    
    if (postdata.action == "add")
    {
        // if (parental_control_info[template_page_index].time.length >= 8)
        // {
        //     alert("fw_most8RulesAlert".i18n());
        //     return;
        // }       
    }
    postdata.Name = $("#template_name").val();
    XHR.post("set_template_info", postdata, initPage);
    sleep(500);
    window.location.reload();  
    
    
}


function doSave()
{
	show_shadow();
	if( ! $("#schedule_list_form").valid() )
	{
	     alert("illegal_value_alert".i18n());
	    return;
	}
	if (!extraValidCheck()) // 额外校验，如要需要再打开
		{
			alert("illegal_value_alert".i18n());
			return;
		}
	
	var postdata = new Object();
    postdata.action = addflag;
    if (addflag == "edit"){
        postdata.time_index = parseInt(time_template_index)+1;
    }
	
	if (postdata.action == "add")
	{
	    // if (parental_control_info[template_page_index].time.length >= 8)
	    // {
	    //     alert("fw_most8RulesAlert".i18n());
	    //     return;
	    // }       
	}
	postdata.template_name = $("#template_name").val();
	week_limit = checkWeek();
	postdata.RepeatDay  = week_limit;
    postdata.RepeatDay  = week_limit;
	time_start = switchto24time($("#start_hour").val()) + ":" + switchto24time($("#start_min").val());
	time_stop = switchto24time($("#end_hour").val()) + ":" + switchto24time($("#end_min").val());
	postdata.StartTime  = time_start;
	postdata.EndTime  = time_stop;
	postdata.template_index = $("#time_template_name").val();
	XHR.post("set_time_template_info", postdata, initPage);	
}