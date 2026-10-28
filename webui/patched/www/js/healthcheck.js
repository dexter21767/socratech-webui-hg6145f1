var sessionidstr;
var operator_name = gOperatorName;
var basedata;
var wandata;	
$(document).ready(function(){
	//优化滚动条，无需改动
	//customScrollBar("html");
	XHR.get("get_login_user", null, function(getdata){
		if ( getdata.sessionid != undefined )
		{
			sessionidstr = getdata.sessionid;
		}
	});

	XHR.get( "get_allwan_info", null, function(data){
		wandata = data;
	});
});



function checkStatus()
{
	XHR.get( "get_base_info", null, function(data){
		basedata = data;
		//console.log(parseFloat(basedata.txpower));
		//Transmitted Power 1.5dBm ~ 4dBm
		var txpower = parseFloat(basedata.txpower);
		if(txpower >=1.5 && txpower <=4){
			$("#send_power").html("Good");
		}else{
			$("#send_power").html("Bad")
		}
		//console.log(parseFloat(basedata.rxpower))
		//Received Power ( -8dBm ~ -28dBm )
		var rxpower = parseFloat(basedata.rxpower);
		if(rxpower >=-28 && rxpower <=-8){
			$("#recv_power").html("Good");
		}else {
			$("#recv_power").html("Bad")
		}
		
		//( -10℃ ~ +85℃ )
		//console.log(parseFloat(basedata.transceivertemperature));
		var transceivertemperature = parseFloat(basedata.transceivertemperature);
		if(transceivertemperature>=-10 &&transceivertemperature <= 85){
			$("#tempreature").html("Good");
		}else{
			$("#tempreature").html("Bad");
		}
		//console.log(parseInt(basedata.cpu_usage))
		var cpu_usage = parseInt(basedata.cpu_usage);
		if(basedata.cpu_usage >=100){
			$("#cpu").html("Bad");
		}else{
			$("#cpu").html("Good");
		}

		var mem_usage = ((basedata.mem_total-basedata.mem_free)/basedata.mem_total*100).toFixed(2);
		//console.log(mem_usage);
		if (mem_usage > 95)
		{
			$("#memory").html("Bad");
		}
		else
		{
			$("#memory").html("Good");
		}

		var InternetWan = "Bad";
		var IPTVWan = "Bad";
		var ManagementWAN = "Bad";
		for(var i=0;i<wandata.wan.length; i++){
			if(wandata.wan[i].ServiceList.indexOf("INTERNET") >=0){
				if(wandata.wan[i].IPMode =="1"&&wandata.wan[i].ConnectionStatus == "Connected"||wandata.wan[i].IPMode =="2"&&wandata.wan[i].IPv6ConnStatus == "Connected"){
					InternetWan ="Good";
				}else if(wandata.wan[i].IPMode =="3"&&(wandata.wan[i].ConnectionStatus == "Connected"||wandata.wan[i].IPv6ConnStatus == "Connected")){
					InternetWan ="Good";
				}
				break;
			}
		}

		for(var i=0;i<wandata.wan.length; i++){

			if(wandata.wan[i].ServiceList.indexOf("IPTV") >=0){
				if(wandata.wan[i].IPMode =="1"&&wandata.wan[i].ConnectionStatus == "Connected"||wandata.wan[i].IPMode =="2"&&wandata.wan[i].IPv6ConnStatus == "Connected"){
					IPTVWan ="Good";
				}else if(wandata.wan[i].IPMode =="3"&&(wandata.wan[i].ConnectionStatus == "Connected"||wandata.wan[i].IPv6ConnStatus == "Connected")){
					IPTVWan ="Good";
				}
				break;
			}
		}

		for(var i=0;i<wandata.wan.length; i++){

			if(wandata.wan[i].ServiceList.indexOf("TR069") >=0){
				if(wandata.wan[i].IPMode =="1"&&wandata.wan[i].ConnectionStatus == "Connected"||wandata.wan[i].IPMode =="2"&&wandata.wan[i].IPv6ConnStatus == "Connected"){
					ManagementWAN ="Good";
				}else if(wandata.wan[i].IPMode =="3"&&(wandata.wan[i].ConnectionStatus == "Connected"||wandata.wan[i].IPv6ConnStatus == "Connected")){
					ManagementWAN ="Good";
				}
				break;
			}
		}



		$("#internet").html(InternetWan);
		$("#iptv").html(IPTVWan);
		$("#management").html(ManagementWAN);
		
		$("#health_table").show();
		$("#healthcheck_button").hide();
	});


    
}


