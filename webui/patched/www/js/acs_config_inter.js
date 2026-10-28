$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	
	getData();
});

function getData()
{
	show_shadow();
	XHR.get( "get_acs_status_info", null, initPage);
}

function initPage(data){
	if(data){
		var connect_acs_status = data.acs_status;
		var connect_request_status = data.acs_request_status;
		if(connect_acs_status == 0){
			$("#acs_connect_status_").html("startup");
		}else if(connect_acs_status == 1)
		{
			$("#acs_connect_status_").html("wanconnection loss");
		}else if(connect_acs_status == 2)
		{
			$("#acs_connect_status_").html("wanconnection disable");
		}else if(connect_acs_status == 3)
		{
			$("#acs_connect_status_").html("dns loss");
		}else if(connect_acs_status == 4)
		{
			$("#acs_connect_status_").html("acs param loss");
		}else if(connect_acs_status == 5)
		{
			$("#acs_connect_status_").html("acs domain err");
		}else if(connect_acs_status == 6)
		{
			$("#acs_connect_status_").html("tcp err");
		}else if(connect_acs_status == 7)
		{
			$("#acs_connect_status_").html("inform fail");
		}else if(connect_acs_status == 8)
		{
			$("#acs_connect_status_").html("inform success");
		}else if(connect_acs_status == 9)
		{
			$("#acs_connect_status_").html("inform resp timeout");
		}

		if(connect_request_status == 0){
			$("#acs_connect_request_status").html("connection request loss");
		}else if(connect_request_status == 1)
		{
			$("#acs_connect_request_status").html("connection request loss");
		}else if(connect_request_status == 2){
			$("#acs_connect_request_status").html("connection request success");
		}
	}
}