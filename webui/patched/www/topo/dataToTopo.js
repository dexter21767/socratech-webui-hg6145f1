/*
 * @Author: scos_fx
 * @Date: 2020-04-30 15:39:30
 * @LastEditors: scos_fx
 * @Description:  topo 数据转换
 */

// e.g. 原始数据
// {
// 	"topoList": "Controller(Agent_4A5A31,Agent_779981,CtrlAgent)",
// 	"topo": [
// 		{
// 			"mac": "02:3A:3B:3E:3F:02",
// 			"name": "Controller",
// 			"accessType": 1,
// 			"deviceType": 0,
// 			"nodeIndex": 1,
// 			"sta": []
// 		},
// 		{
// 			"mac": "02:41:51:4A:5A:31",
// 			"name": "Agent_4A5A31",
// 			"accessType": 1,
// 			"deviceType": 0,
// 			"nodeIndex": 2,
// 			"sta": []
// 		},
// 		{
// 			"mac": "02:55:66:77:99:81",
// 			"name": "Agent_779981",
// 			"accessType": 1,
// 			"deviceType": 0,
// 			"nodeIndex": 2,
// 			"sta": []
// 		},
// 		{
// 			"mac": "02:3A:3B:3E:3F:01",
// 			"name": "CtrlAgent",
// 			"accessType": 1,
// 			"deviceType": 0,
// 			"nodeIndex": 2,
// 			"sta": [
// 				{
// 					"mac": "00:42:51:4A:5A:34",
// 					"accessType": 1,
// 					"deviceType": 1
// 				},
// 				{
// 					"mac": "00:56:66:77:99:84",
// 					"accessType": 1,
// 					"deviceType": 1
// 				}
// 			]
// 		}
// 	],
// 	"ret": 0
// }

// topo data
// deviceType 0 = WAN
        //    1 = Ap
        //    2 = phone
        //    3 = ipad
        //    4 = pc
        //    5 = other
// accessType 0 = 有线
    //     1 = 2.4G
    //     2 = 5G


function changename(e){
 var change = []
 if(e !== undefined && e != ""){
  if(e.length > 7){
   change = e.substring(0,7)+"...";
  }else{
   change.push(e)
  }
  return change
 }
}

function changemac(e){
 var change = []
 if(e !== undefined && e != ""){
  if(e.length > 8){
   change = e.substring(0,8)+"...";
  }else{
   change.push(e)
  }
  return change
 }
}


function findNode(deep,crrNode){
    if(deep > 2){
        deep--
        crrNode = crrNode.children
        findNode(deep,crrNode)
    }
    return
}

function addTochildren(rootNode,node,e){
    if(e.name === 'CtrlAgent')
    {// CtrlAgent不显示 只把sta 数据 加到Controller
        rootNode.sta = [].concat(rootNode.sta,e.sta)
    }else
    {
        node.push({
            mac: e.mac,
            name: e.name || e.mac,
            ipv4:e.ipv4,
            accessType: e.accessType,
            deviceType: e.deviceType,
            nodeIndex: e.nodeIndex,
            rssi: e.rssi,
            LinkType: e.LinkType,
            linkSpeed: e.linkSpeed,
            wifi80211mode1: e.wifi80211mode1,
            wifi80211mode2: e.wifi80211mode2,
            sta: e.sta
        })
    }
}

function maxWidth(d){
    let maxStaAP = 0;
    if(typeof d.children != 'undefined' && d.sta.length > maxStaAP)
        maxStaAP = d.sta.length
    if(typeof d.children != 'undefined')
    {
        d.children.forEach(e => {
            if(e.sta.length > maxStaAP)
                maxStaAP = e.sta.length
        })
        maxStaAP += d.children.length
        if(maxStaAP > _maxWidth)
            _maxWidth = maxStaAP
        maxWidth(d.children)
    }
        
}

function dataToTopo(d){
    var topoData = {}
    var crrNode = {}
    var deep = 2
    var maxDeep = 2
    d.topo.forEach(e => {
       
        if(e.nodeIndex >= maxDeep)
        {
            maxDeep = e.nodeIndex
            if(e.sta.length > 0 && e.name !== 'CtrlAgent') maxDeep += 1
        }
        if(e.nodeIndex === 1){
            topoData =  {
                mac: e.mac,
                name: e.name || e.mac,
                ipv4:e.ipv4,
                deviceType: e.deviceType,
                accessType: e.accessType,
                nodeIndex: e.nodeIndex,
                rssi: e.rssi,
                LinkType: e.LinkType,
                PHYRate: e.PHYRate,
                wifi80211mode1: e.wifi80211mode1,
                wifi80211mode2: e.wifi80211mode2,
                sta: e.sta,
                children:[]
            }
            crrNode = topoData.children
        }else if(e.nodeIndex === deep){
            addTochildren(topoData,crrNode,e)
        }else if(e.nodeIndex > deep){
            crrNode = crrNode[crrNode.length - 1]
            if(typeof crrNode.children === 'undefined')
            {
                crrNode.children = []
                crrNode = crrNode.children
            }
            addTochildren(topoData,crrNode,e)
            deep = e.nodeIndex
        }else if(e.nodeIndex < deep){
            crrNode = topoData
            findNode(e.nodeIndex,crrNode)
            addTochildren(topoData,crrNode.children,e)
            deep = e.nodeIndex
        }
    })
    
	  _maxWidth = 0
	    maxWidth(topoData)
    return {
        data:topoData,
        deep:maxDeep,
		maxWidth:_maxWidth
		
    }
}