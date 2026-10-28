var first_time_login = gFirstFlag;
$(document).ready(function() {
    if(first_time_login != "1"){
        window.parent.location = "../index.html";
    }
});
function skip()
    {
         XHR.get("set_web_config", null, null);
    }

