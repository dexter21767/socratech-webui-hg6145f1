/*
 * @Author: scos_fx
 * @Date: 2020-06-12 15:12:16
 * @LastEditors: scos_fx
 * @Description:  d3 tree topo
 */

const _default = {
    width: 2000,
    height: 700,
    boxWidth: 500,
    boxHeight: 500,
    nodeName: 'svg#d3',
    tipClassName: 'd3tip'
}

// d3 tree 构造函数
function TreeGraph(options) {
    options = options || _default
    this.width = options.width
    this.height = options.height
    this.boxWidth = options.boxWidth
    this.boxHeight = options.boxHeight
    this.nodeName = options.nodeName || 'svg#d3'
    this.tipClassName = options.tipClassName || 'd3tip'
}

// 初始化图表布局
TreeGraph.prototype.initLayout = function() {
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    const right = document.querySelector(this.nodeName);
    right.oncontextmenu = function(e) {
        e.preventDefault()
    }
    this.svg = d3.select(this.nodeName)
        .attr('class', 'tree-graph')
        .attr('width', this.height)
        .attr('height', this.width)
    this.chart = this.svg.append('g')
        .attr('class', 'chart-layer')
        .attr('transform', 'translate(50,60)')

    this.chart.append("g")
        .attr('class', 'links')

    this.chart.append('g')
        .attr('class', 'nodes')
    return this // 为了实现链式调用
}

// 数据预处理
TreeGraph.prototype.preprocessData = function() {
    this.treeData = d3.hierarchy(this.treeData, function(d) {
        var d1 = d.children || []
        var d2 = d.sta || []
        return [].concat(d1, d2)
    })
    var treeGenerator = d3.tree()
        .size([this.width - 100, this.height - 120]) // 树布局的尺寸
        .separation(function(a, b) {
            return a.parent == b.parent ? 1 : 1
        })

    treeGenerator(this.treeData)

    this.nodes = this.treeData.descendants() // 获取所有的节点数组
    this.links = this.treeData.links() // 获取所有的相连边
    return this
}

// 画图
TreeGraph.prototype.renderGraph = function() {
    //连线
    d3.select('.links')
        .selectAll(".link")
        .data(this.links)
        .enter()
        .append("path")
        .attr('class', 'link')
        .attr("d", linkGenerator)
        .attr("fill", "none")
        .attr("stroke", "#58585a")
        .attr("stroke-width", 1)

    // 折线
    function linkGenerator(d) {
        let sourceX = d.source.y,
            sourceY = d.source.x,
            targetX = d.target.y,
            targetY = d.target.x;

        return "M" + sourceX + "," + (sourceY) +
            "H" + ((targetX - sourceX) / 2 + sourceX) +
            "V" + targetY +
            "H" + targetX;
    }

    //节点
    d3.select('.nodes')
        .selectAll('.node')
        .data(this.nodes)
        .enter().append('g')
        .attr('class', 'node icon')
        .attr('transform', function(d) {
            return 'translate(' + d.y + ',' + d.x + ')'
        })

        //节点显示相关topo信息
        .on('mouseover', (d, i, n) => {
            this.nodeTip.hide()
            if (d.data.deviceType != 0 || (d.data.deviceType == 0 && d.data.ipv4 != ''))
                this.nodeTip.show(d, n[i])
        })
        .on('mouseout', this.nodeTip.hide)

        .append('rect')
        .attr('height', 50)
        .attr('width', function(d) {
            if (d.data.deviceType == 0) {
                return 120
            }
            else {
                return 160
            }
        })
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('transform', function(d) {
            if (d.data.deviceType == 0) {
                return 'translate(' + (-50 / 2) + ',' + (-50 / 2) + ')'
            }
            else {
                return 'translate(' + (-200 / 2) + ',' + (-50 / 2) + ')'
            }
        })
        // 矩形左上角与标准位置对齐，所以要移到中心
        .style('stroke-width', '1')
        .style('fill', '#3e3e41') // 要有颜色，否则会把线条显示出来

    //图片背景
    d3.selectAll('.node')
        .append('rect')
        .attr('fill', '#656567')
        .attr('width', 36)
        .attr('height', 36)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('y', -18)
        .attr('x', function(d) {
            if (d.data.deviceType == 0)
                return -15
            else
                return -90

        })

    //图片
    d3.selectAll('.node')
        .append('image')
        .attr('xlink:href', function(d) {
            let imgPath = '../topo/img/ic_router.png'
            console.log(321)
            console.log(d.data.deviceType)
            if (typeof d.data.deviceType != 'undefined') {
                switch (d.data.deviceType) {
                    case 0:
                        imgPath = '../topo/img_new/onu.png'
                        break;
                    case 1:
                        imgPath = '../topo/img_new/ap.png'
                        break;
                    case 2:
                        imgPath = '../topo/img_new/wifi.png'
                        break;
                    case 3:
                        imgPath = '../topo/img_new/wifi.png'
                        break;
                    case 4:
                        imgPath = '../topo/img_new/wired.png'
                        break;
                    case 5:
                        imgPath = '../topo/img_new/wifi.png'
                        break;
                    case 6:
                        imgPath = '../topo/img_new/wired.png'
                        break;
                    default:
                        break;
                }
            }

            return imgPath
        })
        .attr('x', (d) => {
            if (typeof d.data.deviceType != 'undefined') {
                if (d.data.deviceType == 0)
                    return -5
                else
                    return -82
            }
        })
        .attr('y', -10)
        .attr('width', (d) => {
            if (typeof d.data.deviceType != 'undefined' && d.data.deviceType == 1)
                return 19
            else
                return 19
        })
        .attr('height', (d) => {
            if (typeof d.data.deviceType != 'undefined' && d.data.deviceType == 1)
                return 19
            else
                return 19
        })
        .on('mousedown ', (d) => {
        })

    // 网络连接图标背景 
    d3.selectAll('.node')
        .append('circle')
        .attr('fill', d => {
            if (d.data.deviceType == 0)
                return ""
            else if (d.data.accessType === 1 || d.data.accessType === 4)
                return "#02ddae"
            else
                return "rgba(20, 137, 232, 1)"
        })
        .attr('r', 8)
        .attr('cx', -100)
        .attr('cy', 0)


    // 网络连接图标    
    d3.selectAll('.node')
        .filter(d => { return d.data.accessType != 0 })
        .append('image')
        .attr('class', 'network-icon') //
        .attr('xlink:href', d => {
            if (d.data.deviceType == 0)
                return ""
            else if (d.data.accessType === 1 || d.data.accessType === 4)
                return '../topo/img_new/eth_connect.png'
            else
                return '../topo/img_new/wifi_connect.png'
        })
        .attr('width', 8)
        .attr('height', 10)
        .attr('y', -5)
        .attr('x', -104)

    // 文字
    d3.selectAll('.node')
        .append('text')
        .attr('dy', 2)
        .attr('dx', (d) => {
            if (d.data.deviceType == 0) 
                return 60
             else 
                return 5
            
        })
        .style('text-anchor', 'middle') // 文字的水平居中
        .style('dominant-baseline', 'middle')
        .style('font-size', '10px')
        // .text(d => d.data.name || d.data.mac)
        .text(d => changename(d.data.name) || d.data.mac)
        .attr("fill", "white")

}

TreeGraph.prototype.zoom = function() {
    this.zoomHandler = d3.zoom()
        .scaleExtent([0.1, 10]) // zoom limit
        .translateExtent([[-100, -100], [this.width + 90, this.height + 100]]) // translate limit
        .on('zoom', () => {
            this.chart.attr('transform', event.transform)
        })
    this.svg.call(this.zoomHandler)
    return this
}


// 协商速率
function getLinkSpeed(linkSpeed) {
    let _linkSpeedStr = ''
    const _linkSpeed = parseInt(linkSpeed)

    if (_linkSpeed == 1000) {
        _linkSpeedStr = '1Gbps'
    }
    else if (_linkSpeed == 2500) {
        _linkSpeedStr = '2.5Gbps'
    }
    else {
        _linkSpeedStr = `${_linkSpeed}Mbps`
    }
    return _linkSpeedStr
}

function secondToDate(second) {
    const oneHour = 60 * 60
    const oneDay = oneHour * 24
    const oneYear = oneDay * 365
    return [
        parseInt(second / oneDay) + 'd',
        parseInt(second % oneDay / oneHour) + 'h',
        parseInt(second % oneHour / 60) + 'm',
        parseInt(second % 60) + 's'
    ]
        .join(':')
        .replace(/\b(\d)\b/g, '0$1') // 自动补零
        .replace(/\b(\d+)\b/g, ' $1 ') // 数字两边加空格
        .replace(/(\s00\s([^\s]+))?/g, '') // 移除 00 时间
}

TreeGraph.prototype.tip = function() {
    d3.select('.' + this.tipClassName).remove()
    // d3Tip
    this.nodeTip = d3.tip()
        .attr('class', this.tipClassName)
        .attr('id', 'd3-tip')
        .style('font-size', '12px')
        .offset([150, 200])

        .html(function(d) {
            d.data.ipv4 = d.data.ipv4.replace(/_point_/g, ".");
            //if (d.data.deviceType != 0) 
            {
                let returnHtml;
                if(glang == "span"){
                     returnHtml = `<p><strong class='title'>Host:</strong>${d.data.name || d.data.mac}</p>
                    <p><strong class='title'>Dirección IP:</strong>${d.data.ipv4}</p>`
                }else{
                    returnHtml = `<p><strong class='title'>Hostname:</strong>${d.data.name || d.data.mac}</p>
                    <p><strong class='title'>IP address:</strong>${d.data.ipv4}</p>`
                }
                

                if (gOperatorName == "TH_AIS" && d.data.name == "HG6145F3" && d.data.deviceType == 1) {
                    var mac_init = d.data.mac.replace(/:/g, '');
                    var mac = parseInt(mac_init, 16);
                    var aa = mac + 1;
                    var mac_16 = aa.toString(16);
                    var mac_upper = mac_16.toUpperCase();
                    var mac_complete = mac_upper.substr(0, 2) + ":" + mac_upper.substr(2, 2) + ":" + mac_upper.substr(4, 2) + ":" + mac_upper.substr(6, 2) + ":" +
                        mac_upper.substr(8, 2) + ":" + mac_upper.substr(10, 2);
                    returnHtml += `<p><strong class='title'>MAC:</strong> ${mac_complete} </p>`
                } else {
                    returnHtml += `<p><strong class='title'>MAC:</strong> ${d.data.mac} </p>`
                }

                //除去主路由的所有设备
                if ( gFttr_type != "fttr_main") {
                    if (d.data.accessType > 1 || d.data.deviceType > 1 || (d.data.deviceType === 1 && d.data.accessType !== 0)) {
                        console.log(d.data);
                        if (d.data.OnlineTime != 0 && d.data.OnlineTime != undefined
                            && d.data.OnlineTime != null && d.data.OnlineTime != '' &&
                            d.data.OnlineTime != NaN) {
                            if(glang == "span")
                                returnHtml += `<p><strong class='title'>Tiempo en línea:</strong>${secondToDate(d.data.OnlineTime)}</p>`
                            else 
                                returnHtml += `<p><strong class='title'>Online time:</strong>${secondToDate(d.data.OnlineTime)}</p>`
                        }


                        // 协商速率
                        if (!isNaN(d.data.linkSpeed)) {
                            if (gOperatorName == "IDN_TELKOM" && d.data.deviceType == 1 && d.data.accessType != 0) {

                            } else {
                                if ((d.data.linkSpeed == '' || d.data.linkSpeed == '0') && (gOperatorName == "TH_AIS")) {
                                    if (d.data.accessType == 1) {
                                        returnHtml += `<p><strong class='title'>Link Speed:</strong>1G bps</p>`
                                    } else if (d.data.accessType == 2) {
                                        returnHtml += `<p><strong class='title'>Link Speed:</strong>182 Mbps</p>`
                                    } else if (d.data.accessType == 3) {
                                        returnHtml += `<p><strong class='title'>Link Speed:</strong>325 Mbps</p>`
                                    }

                                } else {
                                    if (d.data.linkSpeed != '' || d.data.linkSpeed != '0') {
                                        if(glang == "span")
                                            returnHtml += `<p><strong class='title'>Velocidad:</strong> ${getLinkSpeed(d.data.linkSpeed)}</p>`
                                        else
                                            returnHtml += `<p><strong class='title'>Link Speed:</strong> ${getLinkSpeed(d.data.linkSpeed)}</p>`
                                    }

                                }
                            }
                        }
                    }
                }


                // 无线设备
                if (d.data.accessType > 1 && d.data.accessType != 4 && gFttr_type != "fttr_main") {
                    //信号强度
                    if (d.data.rssi != '' && d.data.rssi != '-110' && d.data.rssi != '-100' && d.data.rssi != '0') {
                        returnHtml += `<p><strong class='title'> RSSI:</strong> ${d.data.rssi} dBm </p>`
                    }

                    if (gOperatorName == "TH_AIS") {

                        //无线模式
                        if (d.data.deviceType == "1" && d.data._80211mode != '' && d.data._80211mode != '' && d.data._80211mode != undefined) {
                            returnHtml += `<p><strong class='title'>802.11 mode:</strong> ${d.data._80211mode}</p>`
                        }
                    }

                }

                // 下挂设备
                if (d.data.deviceType > 1) {

                    // 无线下挂设备
                    if (d.data.accessType > 1 && d.data.accessType != 4 && gFttr_type != "fttr_main") {
                        // 无线加密方式
                        if (typeof d.data.security != 'undefined' && d.data.security != '') {
                            if (d.data.security == "11i") {
                                returnHtml += `<p><strong class='title'>Security:</strong> WPA2</p>`
                            } else {
                                returnHtml += `<p><strong class='title'>Security:</strong> ${d.data.security}</p>`
                            }

                        }
                    }
                }

                // 上行连接方式
                switch (d.data.accessType) {
                    case 1:
                        if(glang == "span")
                            returnHtml += `<p><strong class='title'> Acceso:</strong> ETH</p>`
                        else
                            returnHtml += `<p><strong class='title'> Access Type:</strong> ETH</p>`
                        break;
                    case 2:
                        if(glang == "span")
                            returnHtml += `<p><strong class='title'> Frecuencia:</strong> ETH</p>`
                        else
                            returnHtml += `<p><strong class='title'> Frequency: </strong> 2.4G</p>`
                        break;
                    case 3:
                        if(glang == "span")
                            returnHtml += `<p><strong class='title'> Frecuencia:</strong> ETH</p>`
                        else
                            returnHtml += `<p><strong class='title'> Frequency:</strong> 5G</p>`
                        break;
                    case 4:
                        if(glang == "span")
                            returnHtml += `<p><strong class='title'> Acceso:</strong> ETH</p>`
                        else
                            returnHtml += `<p><strong class='title'> Access Type:</strong> PON</p>`
                        break;
                    default:
                        break;
                }

                // 子路由
                if (d.data.deviceType == 1 && d.data.accessType != 0 && gFttr_type != "fttr_main") {
                    if (d.data.Version !== undefined && d.data.Version != '') {
                        returnHtml += `<p><strong class='title'> Version:</strong> ${d.data.Version}</p>`
                    }

                    if (gOperatorName == "TH_AIS") {
                        if (d.data.downSpeed != undefined && d.data.downSpeed != '') {
                            var real_bandwidth = Math.floor(Number(d.data.downSpeed) / 8);
                            returnHtml += `<p><strong class='title'> Realtion Bandwidth:</strong> ${real_bandwidth} KB/s</p>`
                        }
                    }
                }

                return returnHtml;
            }

            return ''

        });
    this.svg.call(this.nodeTip);
    return this
}

// 整合逻辑
TreeGraph.prototype.init = function(data, options) {
    this.treeData = data
    if (typeof options !== 'undefined') {
        this.width = options.width || _default.width
        this.height = options.height || _default.height
        this.boxWidth = options.boxWidth || _default.boxWidth
        this.boxHeight = options.boxHeight || _default.boxHeight
        this.nodeName = options.nodeName || _default.nodeName
        this.tipClassName = options.tipClassName || _default.tipClassName
    }
    console.log(this.treeData);
    d3.selectAll("svg > *").remove();
    this.initLayout()
        .tip()
        .preprocessData()
        .renderGraph()

}

TreeGraph.prototype.updata = function(data, options) {
    this.treeData = data
    if (typeof options !== 'undefined') {
        this.width = options.width || _default.width
        this.height = options.height || _default.height
        this.boxWidth = options.boxWidth || _default.boxWidth
        this.boxHeight = options.boxHeight || _default.boxHeight

    }
    this.nodeTip.hide()
    d3.selectAll("svg > *").remove();

    this.initLayout()
        .tip()
        .preprocessData()
        .renderGraph()
}