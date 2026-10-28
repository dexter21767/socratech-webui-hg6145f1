/*
 * @Author: scos_fx
 * @Date: 2020-06-12 15:12:16
 * @LastEditors: scos_fx
 * @Description:  d3 tree topo
 */

const _default = {
    width: 2000,
    height: 700,
    boxWidth: 110,
    boxHeight: 110,
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
        .attr('width', this.width)
        .attr('height', this.height)
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
        .attr("stroke", "#03a9f4")
        .attr("stroke-width", 1)

    // 折线
    function linkGenerator(d) {
        let sourceX = d.source.x,
            sourceY = d.source.y,
            targetX = d.target.x,
            targetY = d.target.y;

        return "M" + sourceX + "," + sourceY +
            "V" + ((targetY - sourceY) / 2 + sourceY) +
            "H" + targetX +
            "V" + targetY;
    }

    //节点
    d3.select('.nodes')
        .selectAll('.node')
        .data(this.nodes)
        .enter().append('g')
        .attr('class', 'node icon')
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')'
        })
        .append('rect')
        .attr('width', this.boxWidth)
        .attr('height', this.boxHeight)
        .attr('transform', 'translate(' + (-this.boxWidth / 2) + ',' + (-this.boxHeight / 2) + ')')
        // 矩形左上角与标准位置对齐，所以要移到中心
        .style('stroke-width', '1')
        .style('fill', 'white') // 要有颜色，否则会把线条显示出来

    //图片
    d3.selectAll('.node')
        .append('image')
        .attr('xlink:href', function(d) {
            let imgPath = '../topo/img/ic_router.png'
            if (typeof d.data.deviceType != 'undefined') {
                switch (d.data.deviceType) {
                    case 0:
                        // imgPath = 'topo/img/ic_internet.png'
                        imgPath = '../topo/img/ic_none.png'
                        break;
                    case 1:
                        imgPath = '../topo/img/ic_router.png'
                        break;
                    case 2:
                        imgPath = '../topo/img/ic_phone.png'
                        break;
                    case 3:
                        imgPath = '../topo/img/ic_ipad.png'
                        break;
                    case 4:
                        imgPath = '../topo/img/ic_computer.png'
                        break;
                    case 5:
                        imgPath = '../topo/img/ic_wifi.png'
                        break;
                    case 6:
                        imgPath = '../topo/img/ic_wired.png'
                        break;
                    default:
                        break;
                }
            }

            return imgPath
        })
        .attr('x', (d) => {
            if (typeof d.data.deviceType != 'undefined' && d.data.deviceType > 1)
                return -this.boxWidth / 2 + 28
            else if (d.data.deviceType == 0 || d.data.deviceType == null)
                return -this.boxWidth / 2 + 30
            else
                return -this.boxWidth / 2 + 20
        })
        .attr('y', (d) => {
            if (typeof d.data.deviceType != 'undefined') {
                if (d.data.deviceType == 1)
                    return -this.boxWidth / 2 + 20
                else if (d.data.deviceType > 1)
                    return -this.boxWidth / 2 + 30
                else
                    return -this.boxWidth / 2 + 25
            }
        })
        .attr('width', (d) => {
            if (typeof d.data.deviceType != 'undefined' && d.data.deviceType == 1)
                return 68.4
            else
                return 50
        })
        .attr('height', (d) => {
            if (typeof d.data.deviceType != 'undefined' && d.data.deviceType == 1)
                return 68.4
            else
                return 50
        })

        .on('mousedown ', (d) => {
            // if (event.button === 0) {
            //     if (d.data.deviceType === 1 && d.data.accessType !== 0) {
            //         if (d.data.ipv4 !== '')
            //             subRouterUpgrade(d.data.ipv4)
            //         else
            //             $vm.$message.error(`subRouter IP Address is error!`)
            //     }
            // }
        })
        .on('mouseover', (d, i, n) => {
            this.nodeTip.hide()
            if (d.data.deviceType != 0 || (d.data.deviceType == 0 && d.data.ipv4 != ''))
                this.nodeTip.show(d, n[i])
        })
        .on('mouseout', this.nodeTip.hide)

    // 网络连接图标    
    d3.selectAll('.node')
        .filter(d => { return d.data.accessType != 0 })
        .append('image')
        .attr('class', 'network-icon')
        .attr('xlink:href', d => {
            if (d.data.accessType === 1 || d.data.accessType === 4)
                return '../topo/img/net_device_port.png'
            else
                return '../topo/img/WIFI.png'
        })
        .attr('width', 25)
        .attr('height', 25)
        .attr('x', -12)
        .attr('y', -60)


    // 文字
    d3.selectAll('.node')
        .append('text')
        .attr("dy", 45)
        .style('text-anchor', 'middle') // 文字的水平居中
        .style('dominant-baseline', 'middle')
        // .text(d => d.data.name || d.data.mac)
        .text(d => changename(d.data.name) || d.data.mac)
        .attr("fill", "black")

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
        .offset([150, 200])

        .html(function(d) {
            d.data.ipv4 = d.data.ipv4.replace(/_point_/g, ".");
            if (d.data.deviceType != 0) {
                if(glang == "pt")
                {
                    var returnHtml = `<p><strong class='title'>Hostname:</strong>${d.data.name || d.data.mac}</p>
                                  <p><strong class='title'>Endereço IP:</strong>${d.data.ipv4}</p>`
                }
                else
                {

                    var returnHtml = `<p><strong class='title'>Hostname:</strong>${d.data.name || d.data.mac}</p>
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
                if (gFttr_type != "fttr_main") {
                    if (d.data.accessType > 1 || d.data.deviceType > 1 || (d.data.deviceType === 1 && d.data.accessType !== 0)) {
                        console.log(d.data);
                        if (d.data.OnlineTime != 0 && d.data.OnlineTime != undefined
                            && d.data.OnlineTime != null && d.data.OnlineTime != '' &&
                            d.data.OnlineTime != NaN) {
							if(glang == "pt")
							{
								returnHtml += `<p><strong class='title'>Tempo online:</strong>${secondToDate(d.data.OnlineTime)}</p>`
							}
							else
							{
								returnHtml += `<p><strong class='title'>Online time:</strong>${secondToDate(d.data.OnlineTime)}</p>`
							} 
                        }


                        // 协商速率
                        if (!isNaN(d.data.linkSpeed)) {
                            if (gOperatorName == "IDN_TELKOM" && d.data.deviceType == 1 && d.data.accessType != 0) {

                            } else {
                                if ((d.data.linkSpeed == '' || d.data.linkSpeed == '0') && (gOperatorName == "TH_AIS")) {
									if(glang == "pt")
									{
										if (d.data.accessType == 1) {
											returnHtml += `<p><strong class='title'>Link Speed:</strong>1G bps</p>`
										} else if (d.data.accessType == 2) {
											returnHtml += `<p><strong class='title'>Link Speed:</strong>182 Mbps</p>`
										} else if (d.data.accessType == 3) {
											returnHtml += `<p><strong class='title'>Link Speed:</strong>325 Mbps</p>`
										}
									}
									else
									{
										if (d.data.accessType == 1) {
											returnHtml += `<p><strong class='title'>Link Speed:</strong>1G bps</p>`
										} else if (d.data.accessType == 2) {
											returnHtml += `<p><strong class='title'>Link Speed:</strong>182 Mbps</p>`
										} else if (d.data.accessType == 3) {
											returnHtml += `<p><strong class='title'>Link Speed:</strong>325 Mbps</p>`
										}
									} 

                                } else {
                                    if (d.data.linkSpeed != '' || d.data.linkSpeed != '0') {
                                        if(glang == "pt")
                                        {
                                            returnHtml += `<p><strong class='title'>Link Speed:</strong> ${getLinkSpeed(d.data.linkSpeed)}</p>`
                                        }
                                        else
                                        {
                                            returnHtml += `<p><strong class='title'>Link Speed:</strong> ${getLinkSpeed(d.data.linkSpeed)}</p>`
                                        } 
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
                            if(glang == "pt")
							{
								returnHtml += `<p><strong class='title'>Modo 802.11:</strong> ${d.data._80211mode}</p>`
							}
							else
							{
								returnHtml += `<p><strong class='title'>802.11 mode:</strong> ${d.data._80211mode}</p>`
							} 
                        }
                    }

                }

                // 下挂设备
                if (d.data.deviceType > 1) {
                    /*if(initConfig.G_DEVICE_CFG.area == 'AIS' || (initConfig.G_DEVICE_CFG.cpu_type != 'EN7562CT' && initConfig.G_DEVICE_CFG.cpu_type.indexOf('RTL') == -1))
                    {
                         // 上行实时速率
                        if(d.data.UpSpeed !== '' )
                        {
                            returnHtml += `<p><strong class='title'>`+ Up Speed:+`</strong> ${getSpeed(d.data.UpSpeed)}</p>`
                        }
                    
                        // 下行实时速率
                        if(d.data.DownSpeed !== '' )
                        {
                            returnHtml += `<p><strong class='title'>`+i18n.t('fh_topo.downSpeed')+`</strong> ${getSpeed(d.data.DownSpeed)}</p>`
                        }
                    }*/

                    // 无线下挂设备
                    if (gOperatorName != "IDN_TELKOM" && d.data.accessType > 1 && d.data.accessType != 4 && gFttr_type != "fttr_main") {
                        // 无线加密方式
                        if (typeof d.data.security != 'undefined' && d.data.security != '') {
                            if (d.data.security == "11i") {
                                if(glang == "pt")
                                {
                                    returnHtml += `<p><strong class='title'>Segurança:</strong> WPA2</p>`
                                }
                                else
                                {
                                    returnHtml += `<p><strong class='title'>Security:</strong> WPA2</p>`
                                } 
                            } else {
                                if(glang == "pt")
                                {
                                    returnHtml += `<p><strong class='title'>Segurança:</strong> ${d.data.security}</p>`
                                }
                                else
                                {
                                    returnHtml += `<p><strong class='title'>Security:</strong> ${d.data.security}</p>`
                                } 
                            }

                        }

                        if (gOperatorName == "TH_AIS") {

                            //无线模式
                            if (d.data.OperatingStandard != '' && d.data.OperatingStandard != '' && d.data.OperatingStandard != undefined) {
                                if(glang == "pt")
                                {
                                    returnHtml += `<p><strong class='title'>Modo 802.11:</strong> ${d.data.OperatingStandard}</p>`
                                }
                                else
                                {
                                    returnHtml += `<p><strong class='title'>802.11 mode:</strong> ${d.data.OperatingStandard}</p>`
                                } 
                            }
                        }
                    }
                    if (gOperatorName == "TH_AIS") {
                        if (d.data.downSpeed != undefined && d.data.downSpeed != '') {
                            var real_bandwidth = Math.floor(Number(d.data.downSpeed) / 1000);
                            if(glang == "pt")
                            {
                                returnHtml += `<p><strong class='title'> Largura de banda:</strong> ${real_bandwidth} KB/s</p>`
                            }
                            else
                            {
                                returnHtml += `<p><strong class='title'> Realtion Bandwidth:</strong> ${real_bandwidth} KB/s</p>`
                            } 
                        }
                    }


                }

                // 上行连接方式
                switch (d.data.accessType) {
                    case 1:
                        if(glang == "pt")
                        {
                            returnHtml += `<p><strong class='title'> Tipo de acesso:</strong> ETH</p>`
                        }
                        else
                        {
                            returnHtml += `<p><strong class='title'> Access Type:</strong> ETH</p>`
                        } 
                        break;
                    case 2:
                        if(glang == "pt")
                        {
                            returnHtml += `<p><strong class='title'> Frequência: </strong> 2.4G</p>`
                        }
                        else
                        {
                            returnHtml += `<p><strong class='title'> Frequency: </strong> 2.4G</p>`
                        } 
                        break;
                    case 3:
                        if(glang == "pt")
                        {
                            returnHtml += `<p><strong class='title'> Frequência:</strong> 5G</p>`
                        }
                        else
                        {
                            returnHtml += `<p><strong class='title'> Frequency:</strong> 5G</p>`
                        } 
                        break;
                    case 4:
                        if(glang == "pt")
                        {
                            returnHtml += `<p><strong class='title'> Tipo de acesso:</strong> PON</p>`
                        }
                        else
                        {
                            returnHtml += `<p><strong class='title'> Access Type:</strong> PON</p>`
                        } 
                        break;
                    default:
                        break;
                }

                // 子路由
                if (d.data.deviceType == 1 && d.data.accessType != 0 && gFttr_type != "fttr_main") {
                    if (d.data.Version !== undefined && d.data.Version != '') {
                        if(glang == "pt")
                        {
                            returnHtml += `<p><strong class='title'> Versão:</strong> ${d.data.Version}</p>`
                        }
                        else
                        {
                            returnHtml += `<p><strong class='title'> Version:</strong> ${d.data.Version}</p>`
                        } 
                    }

                    if (gOperatorName == "TH_AIS") {
                        if (d.data.downSpeed != undefined && d.data.downSpeed != '') {
                            var real_bandwidth = Math.floor(Number(d.data.downSpeed) / 8);
                            if(glang == "pt")
                            {
                                returnHtml += `<p><strong class='title'> Largura de banda:</strong> ${real_bandwidth} KB/s</p>`
                            }
                            else
                            {
                                returnHtml += `<p><strong class='title'> Realtion Bandwidth:</strong> ${real_bandwidth} KB/s</p>`
                            } 
                        }
                    }


                    /*if(GCONFIG.area !== 'AIS'){
                        returnHtml += `<p>`+i18n.t('fh_topo.tips')+`<strong>`+i18n.t('fh_topo.click')+`</p>`
                    }*/
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