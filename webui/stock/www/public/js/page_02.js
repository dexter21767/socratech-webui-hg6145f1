var sessionidstr = "";
$(function(){
	XHR.get("get_operator_test", null, function(data){
		if ( data )
		{
			sessionidstr = data.sessionid;
		}
	});
	$("#live_tim_residencia").click(function(){
		var postdata = new Object();
		postdata.vlanid = "100";
		postdata.sessionid = sessionidstr;
		XHR.post("timwizardwan_vlan", postdata, parseWizardData);	
	});
	$("#live_tim_empresas").click(function(){
		var postdata = new Object();
		postdata.vlanid = "150";
		postdata.sessionid = sessionidstr;
		XHR.post("timwizardwan_vlan", postdata, parseWizardData);	
	});
	function parseWizardData(data){
		if(data && data.result != undefined){
			var result = data.result;
			if(result == 0){
				window.location.href="page_03.html";
			}else{
				window.location.href="page_06.html";
			}
		}
	}
});