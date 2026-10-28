/***********************************************************************************
versionControl.js
wuxj
2011.5.17
 common JS functions
***********************************************************************************/

/* 
 * user can't access other login subpage except the page that matches the version
 * 
 */


function getAccessLoginPage(operators_code)
{
	var url;
	if(operators_code == "INTER")
	{
		url = "/html/login_inter.html"
	}
	else
	{
		url = "/html/login_inter.html"
	}
	return url;
}


