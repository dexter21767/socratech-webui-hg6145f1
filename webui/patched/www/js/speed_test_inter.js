var sessionidstr = "";
var operator_name = gOperatorName;
var mode;
var stopflag = 0;
var timeout;
var countval = 1;
$(document).ready(function(){
	XHR.get("get_allwan_info", null, initPage);
	$("#direction").bind("change", function() {

		if($("#direction").val() == "1")
		{
			$("#upload_size_div").show();
			$("#upload_mode_div").show();	
		}else{
			$("#upload_size_div").hide();	
			$("#upload_mode_div").hide();
		}

	});
});

function initPage(getdata)
{
	if ( getdata )
	{
		all_wan_info = getdata;
	}
	
	var wan_num = 0;
	var dynamicHtml = '';
	//var single_wan;
	if ( all_wan_info != '' && all_wan_info.wan )
	{
		wan_num = all_wan_info.wan.length;
	}
	dynamicHtml += '';
	if ( wan_num > 0 )
	{
		wan_info = all_wan_info.wan;
		if (all_wan_info != '' && all_wan_info.wan) {
			wan_num = all_wan_info.wan.length;
		}
		if (wan_num > 0) {
			for (i = 0; i < wan_num; i++) {
				var single_wan = all_wan_info.wan[i];
				var wan_path = single_wan.WAN_url;
				if (single_wan.Name.indexOf("_B_") == -1) {
					dynamicHtml += ' <option name= "single_wan" value="' + wan_path + '">' + single_wan.Name + '</option>';
				}
			}
		}
		$("#port_mapping_wan").html(dynamicHtml);
	}
	$("#wan_connect").html(dynamicHtml);
}


function saveApply()
{	
	showOrHideLoadingWindow("show");
	var postdata = new Object();
	//show_shadow();
	postdata.url = $("#url").val();
	postdata.interface = $("#wan_connect").val();
	mode = $("#direction").val();
	postdata.mode = $("#direction").val();
	if(postdata.mode == "1")
	{
		postdata.upload_size = $("#upload_size").val();
		postdata.upload_mode = $("#upload_mode").val();
		postdata.kernel = "2";
	}
	postdata.duration = $("#duration").val();
	postdata.speedtest_status = "Requested";
	$("#result_info").html("");
	XHR.post("set_speed_test", postdata, get_speedtest_reslut);
}

function get_speedtest_reslut()
{
	if(mode == "1")
	{
		Interval = setInterval(function(){XHR.get("get_uploadspeed_test", null, get_uploadspeed_test);}, 5000);
	}else{
		Interval = setInterval(function(){XHR.get("get_downloadspeed_test", null, get_downloadspeed_test);}, 5000);
	}
	
}

function get_uploadspeed_test(data)
{
	if(data.result_status != "Requested")
	{
		stopflag = 1;
		var result; 
		if (stopflag == 1){
			showOrHideLoadingWindow("hide");
			if(data.result_status == "Completed")
			{
			var start_time = new Date(data.start_time);
			var end_time = new Date(data.end_time);
			var time_result = (end_time - start_time)/1000;
			var speed_result = parseInt((data.speedtest_result)/1024/1024);
			var result =  parseInt(speed_result/time_result*8);
			var dynamicHTML = '<tr class="table_01" style="text-align: center;"><td>Upload</td><td>'+result+'Mb/s</td>'
			$("#result_info").html(dynamicHTML);
			clearInterval(Interval); 
			}else
			{
				result = "Fail";
				var dynamicHTML = '<tr class="table_01" style="text-align: center;"><td>Upload</td><td>'+result+'</td>'
				$("#result_info").html(dynamicHTML);
				clearInterval(Interval); 
			}
		}
	}
}

function get_downloadspeed_test(data)
{
	if(data.result_status!= "Requested")
	{

		stopflag = 1;
		var result; 
		if (stopflag == 1){
			showOrHideLoadingWindow("hide");
			if(data.result_status == "Completed")
			{
			var start_time = new Date(data.start_time);
			var end_time = new Date(data.end_time);
			var time_result = (end_time - start_time)/1000;
			var speed_result = parseInt((data.speedtest_result)/1024/1024);
			var result =  parseInt(speed_result/time_result*8);
			var dynamicHTML = '<tr class="table_01" style="text-align: center;"><td>Download</td><td>'+result+'Mb/s</td>'
			$("#result_info").html(dynamicHTML);
			clearInterval(Interval); 
			}else
			{
				result = "Fail";
				var dynamicHTML = '<tr class="table_01" style="text-align: center;"><td>Download</td><td>'+result+'</td>'
				$("#result_info").html(dynamicHTML);
				clearInterval(Interval); 
			}
		}
	}

}

