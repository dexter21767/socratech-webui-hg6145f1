//do access control before load DOM elements
var operator_name = null;
var NewUiFlag = false;
(function() {
    //登录用户0:普通用户 1:管理员用户 2:超级管理员用户 
    /*页面接入权限列表，多用户可见相加
    -1:无需登录即可见
    1:普通用户可见
    2:管理员用户可见
    4:超级管理员用户可见
    */
    if(operator_name === null){
		XHR.get("get_operator", null, function(data) {
			if (data) {
				operator_name = data.operator_name;
                if(data.UI_flag == "1")
                    NewUiFlag = true;	
                
			}
		});
	}

    var accessLevelArray_PH_DITO = new Array(
        ["register_inter.html", "-1"],
    );

    function htmlAccessControl() {
        var herfArray = window.location.pathname.split("/");
        var htmlName = herfArray[herfArray.length - 1];
        if (htmlName == "") {
            return;
        }
        var singleAccessLevel; //default
        var accessArray = [];

        if (operator_name == "PH_DITO") {
            accessArray = accessLevelArray_PH_DITO;
        } 
       

        /*新UI不能访问老UI html文件夹下的页面*/
        var pathname =  herfArray[herfArray.length - 2];
        if(NewUiFlag && pathname == "html"){
            accessArray = accessArray.filter(function() {
                return false;
            });
        }else if(!NewUiFlag && pathname == "new_ui"){
            accessArray = accessArray.filter(function() {
                return false;
            });
        }

        if (!NewUiFlag) {
            accessArray = accessArray.filter(function(item) {
                return (item[0].indexOf("main_new_ui") == -1 && item[0].indexOf("home_new") == -1);
            });
        }else{
            accessArray = accessArray.filter(function(item) {
                return (item[0].indexOf("main_inter") == -1);
            });
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
