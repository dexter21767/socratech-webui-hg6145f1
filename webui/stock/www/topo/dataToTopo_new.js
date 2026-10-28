/*
 * @Author: scos_fx
 * @Date: 2020-06-12 16:02:18
 * @LastEditors: scos_fx
 * @Description:  topo 数据转换 
 */

function changename(e) {
    var change = []
    if (e !== undefined) {
        if(gNewUiFlag){
            if (e.length > 17) {
                change = e.substring(0, 17) + "...";
            } else {
                change.push(e)
            }
            return change
        }else{
            if (e.length > 10) {
                change = e.substring(0, 10) + "...";
            } else {
                change.push(e)
            }
            return change
        }
    }
}

let _maxWidth = 0 // 单个节点设备最大个数

function findNode(deep, crrNode) {
    if (deep > 2) {
        deep--
        crrNode = crrNode.children
        findNode(deep, crrNode)
    }
    return
}

function addTochildren(rootNode, node, e) {
    if (e.name === 'CtrlAgent') {// CtrlAgent不显示 只把sta 数据 加到Controller
        rootNode.sta = [].concat(rootNode.sta, e.sta)
    } else {
        if (Array.isArray(node)) {
            node.push({
                mac: e.mac,
                name: e.name || e.mac,
                ipv4: e.ipv4,
                deviceType: e.deviceType,
                accessType: e.accessType,
                nodeIndex: e.nodeIndex,
                rssi: e.rssi || "-110",
                linkSpeed: e.linkSpeed,
                OnlineTime: e.OnlineTime || 0,
                _80211mode: e._80211mode || '',
                sta: e.sta,
                downSpeed: e.downSpeed || '',
                UpSpeed: e.UpSpeed || '',
                Version: e.Version,
                version: e.version,
                security: e.security
            })
        }
    }
}


// 计算最大宽度
function maxWidth(d) {
    let maxStaAP = 0;
    if (typeof d.children != 'undefined' && d.sta.length > maxStaAP)
        maxStaAP = d.sta.length
    if (typeof d.children != 'undefined') {
        d.children.forEach(e => {
            if (e.sta.length > maxStaAP)
                maxStaAP = e.sta.length
        })
        maxStaAP += d.children.length
        if (maxStaAP > _maxWidth)
            _maxWidth = maxStaAP
        maxWidth(d.children)
    }

}

function dataToTopo(d) {
    var topoData = {}
    var crrNode = {}
    var deep = 2
    var maxDeep = 2

    d.topo.forEach(e => {
        if (e.nodeIndex >= maxDeep) {
            maxDeep = e.nodeIndex
            if (e.sta.length > 0 && e.name !== 'CtrlAgent') maxDeep += 1
        }

        if (e.nodeIndex === 1) {
            topoData = {
                mac: e.mac,
                name: e.name || e.mac,
                ipv4: e.ipv4,
                deviceType: e.deviceType,
                accessType: e.accessType,
                nodeIndex: e.nodeIndex,
                rssi: e.rssi || "-110",
                OnlineTime: e.OnlineTime || 0,
                linkSpeed: e.linkSpeed,
                _80211mode: e._80211mode || '',
                sta: e.sta,
                downSpeed: e.downSpeed || '',
                version: e.version,
                children: []
            }
            crrNode = topoData.children
        } else if (e.nodeIndex === deep) {
            if (!Array.isArray(crrNode)) {
                crrNode = crrNode.children
            }
            addTochildren(topoData, crrNode, e)
        } else if (e.nodeIndex > deep) {
            crrNode = crrNode[crrNode.length - 1]
            if (typeof crrNode.children === 'undefined') {
                crrNode.children = []
                crrNode = crrNode.children
            }
            addTochildren(topoData, crrNode, e)
            deep = e.nodeIndex
        } else if (e.nodeIndex < deep) {
            crrNode = topoData
            findNode(e.nodeIndex, crrNode)
            addTochildren(topoData, crrNode.children, e)
            deep = e.nodeIndex
        }
    })

    _maxWidth = 0
    maxWidth(topoData)
    return {
        data: topoData,
        deep: maxDeep,
        maxWidth: _maxWidth
    }
}