var sessionidstr = "";
var operator_name = gOperatorName;
var inOutValue = new Array(Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 9),Math.pow(2, 12));
var inOutName = new Array("LAN1", "LAN2", "LAN3", "LAN4", "PON","CPU");
var lan_port_num;
$(document).ready(function(){

	XHR.get( "get_base_info", null, parseBaseInfo);
	constructPage();
	
	showOrHideLoadingWindowFromIframe("show");
	
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/port_mirror", initPage);
	}
	else
	{
		XHR.get("get_port_mirror_inter", null, initPage);
	}
});
function parseBaseInfo(data){
	lan_port_num = data.lan_port_num
	var select = "";
	for( var i=1; i<=lan_port_num; i++ ){
		if(operator_name != "MY_TM" && gDevice_type != 1 && i ==lan_port_num && gModelName == "SR3141M")
			select += '<option value="'+i+'" id="lan'+i+'">WAN</option>'
		else
			select += '<option value="'+i+'" id="lan'+i+'">LAN'+i+'</option>'
	}
	$("#catch").html(select);
}
function constructPage()
{
	var dynamicMirrorHTML = '';
	if(gNewUiFlag){
		for( var i=0; i<inOutValue.length; i++ )
		{
			if(gDevice_type != 1){
				if(i == lan_port_num -1 && gModelName == "SR3141M"){
					inOutName[i] = "WAN"
				}else if(inOutName[i] == "PON"){
					continue
				}
			}

			if(inOutName[i] == "CPU"){
				continue
			}

			if(i>= lan_port_num && i<4){
				continue
			}

			dynamicMirrorHTML += "<input type='checkbox' name='mirrorport' id='mirrorport" + i + "' value=" + inOutValue[i] + " /><span class='port_band'>" + inOutName[i] +"&nbsp;&nbsp;</span>";
		}
	}else{
		for( var i=0; i<inOutValue.length; i++ )
		{
			/*除马来TM其余所有版本不要CPU选项 */
			if(operator_name != "MY_TM" && inOutName[i] == "CPU"){
				continue
			}

			if(i>= lan_port_num && i<4){
				continue
			}

			dynamicMirrorHTML += "<span><input type='checkbox' name='mirrorport' id='mirrorport" + i + "' value=" + inOutValue[i] + " />" + inOutName[i] + "&nbsp;&nbsp;</span>";
		}
	}
	$("#mirror").html(dynamicMirrorHTML);
}

function initPage(getdata)
{
	if ( getdata.sessionid != undefined )
	{
		sessionidstr = getdata.sessionid;
	}
	//清除上次的数据
	$("input[name='mirrorport']").each(function(){
		setCheckbox(this.id, 0);
	});
	$("#catch").val();
	$("#direction").val();
	showOrHideLoadingWindowFromIframe("hide");
	
	if ( getdata )
	{
		if(getdata.enableValue == 1){
			$("input[name='mirror_enable']:eq(0)").attr("checked", true);
		}else if(getdata.enableValue == 0){
			$("input[name='mirror_enable']:eq(1)").attr("checked", true);
		}
		if (getdata.mirrorValue != '' && getdata.mirrorValue != undefined)
		{
			var mirrorArray = parseInt(getdata.mirrorValue,10).toString(2).split("").reverse();
			for ( var i=0; i<mirrorArray.length; i++ )
			{
				if ( mirrorArray[i] != '' && mirrorArray[i] != undefined && mirrorArray[i] != '0')
				{	
					$("input[name='mirrorport']").each(function(){
						if ( $(this).val() == Math.pow(2,i) )
						{
							setCheckbox(this.id, 1);
						}
					});
				}
			}
		}
		$("#catch").val(getdata.catchValue);
		$("#direction").val(getdata.directionValue);
	}

	//所有版本均不支持CPU口镜像，且只有单端口镜像，无法叠加
	//阿根廷Clare与巴西TIM版本保持一致
	//巴西TIM版本不支持CPU口镜像，且只有单端口镜像，无法叠加
	//if(operator_name == "BZ_TIM" || operator_name == "ARG_CLARO")
	if(operator_name != "MY_TM")
	{
		$("input[name='mirrorport']").change(function(){
			var id = this.id;
			if(getCheckbox(id))
			{
				$("input[name='mirrorport']").each(function(){
					if(this.id != id)
					{
						setCheckbox(this.id, 0);
					}
				});
			}
		});
	}
}


function saveApply()
{	
	var postdata = new Object();
	show_shadow();
	postdata.enableValue = $("input[name='mirror_enable']:checked").val();
	var mirrorValue = 0;
	$("input[name='mirrorport']").each(function(){
		if ( getCheckbox(this.id) )
		{
			mirrorValue = parseInt(mirrorValue) + parseInt($(this).val());
		}
	});
	postdata.mirrorValue = parseInt(mirrorValue,10);
	postdata.catchValue = $("#catch").val();
	postdata.directionValue = $("#direction").val(); 
	postdata.sessionid = sessionidstr;
	XHR.post("set_port_mirror_inter", postdata, initPage);
	showOrHideLoadingWindowFromIframe("show");
}

