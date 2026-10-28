var CssName;
	if(gOperatorName == "TH_AIS" || gOperatorName == "MY_TM"){
		CssName = "main_style_th_ais.css";
	}else if(gOperatorName == "EG_TELECOM"){
		CssName = "main_style_eg.css";
	}else if(gOperatorName == "MAR_INWI"){
		CssName = "main_style_mar_imwi.css";
	}else if (gOperatorName == "BZ_INTELBRAS") {//BZ_INTELBRAS
		CssName = "main_style_bz_intelbras.css";
	}else if (gOperatorName == "MEX_NETWEY") {//MEX_NETWEY
		CssName = "main_style_mex_netwey.css";
	}else if (gOperatorName == "PH_PLDT") {//PH_PLDT
		CssName = "main_style_ph_pldt.css";
	}
	else if(gNewUiFlag){
		CssName = "new_ui_main_style.css";
	}else{
        CssName = "main_style.css";
    }

document.write('<link href=\"../css/' + CssName + '?'+new Date().getTime()+'\" rel=\"stylesheet\" type=\"text/css\"/>');

// if( gOperator_name == "BZ_CLARO" ){
	
// 	document.write('<style type="text/css"> .main_header {background-color: #FFFFFF;border: #D52B1E 1px solid;} '
// 		+'.table_bg{background-color:#D52B1E;}'
// 		+'table{border:0px}'
// 		+'.tabal_head{color:#FFFFFF;height:20px}'
// 		+'.table_title{color:#FFFFFF}'
// 		+'.table_left{background-color: #F0F0F0}'
// 		+'.main_item {background-color: #D52B1E}'
// 		+'.main_item_name{background-color: #F0F0F0}'
// 		+'.main_item_content{background-color: #F0F0F0}'
// 		+'.main_submit{background-color: #F0F0F0}'
// 		+'.table_head_title{background-color: #ffffff;color:#000000} </style>');
	
// }
