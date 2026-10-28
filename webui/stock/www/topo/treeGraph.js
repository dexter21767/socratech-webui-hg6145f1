/*
 * @Author: scos_fx
 * @Date: 2020-03-13 15:20:01
 * @LastEditors: scos_fx
 */

const _default = {
    width:600,
    height:700,
    boxWidth: 110,
    boxHeight: 110
}

let nodeTip
// d3 tree 构造函数
function TreeGraph(data,options) {
    options = options || _default
    // this.treeData = data || {}
   // console.log(options);
	this.width = options.width
    this.height = options.height
    this.boxWidth = options.boxWidth
    this.boxHeight = options.boxHeight
}

// 初始化图表布局
TreeGraph.prototype.initLayout = function() {
    this.svg = d3.select('svg#d3')
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
TreeGraph.prototype.preprocessData = function () {
    this.treeData = d3.hierarchy(this.treeData, function (d) { 
        var d1 = d.children || []
        var d2 = d.sta || []
        return  [].concat(d1,d2) 
    })
    var treeGenerator = d3.tree()
                        .size([this.width - 100, this.height -120]) // 树布局的尺寸
                        .separation(function (a, b) {
                            return a.parent == b.parent ? 1 : 1
                        })

    treeGenerator(this.treeData)

    this.nodes = this.treeData.descendants() // 获取所有的节点数组
    this.links = this.treeData.links() // 获取所有的相连边

    return this
}

// 画图
TreeGraph.prototype.renderGraph = function () {


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
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')' 
        })
        .append('rect')
        .attr('width', this.boxWidth)
        .attr('height', this.boxHeight)
        .attr('transform', 'translate('+ (-this.boxWidth/2) +','+ (-this.boxHeight/2) +')') 
    // 矩形左上角与标准位置对齐，所以要移到中心
        .style('stroke-width', '1')
        .style('fill', 'white') // 要有颜色，否则会把线条显示出来
    
    //图片
    d3.selectAll('.node')
        .append('image')
        .attr('xlink:href',function(d) {
            let imgPath = '../topo/img/ic_equipment.png'
            if(typeof d.data.deviceType != 'undefined')
            {
                switch (d.data.deviceType) {
                    case 0:
                        imgPath = '../topo/img/ic_internet.png'
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
                    default:
                        break;
                }
            }

            return imgPath
        })
        .attr('x',(d) =>{

            if(typeof d.data.deviceType != 'undefined' && d.data.deviceType > 1)
                return -this.boxWidth/2 + 28
            else
                return -this.boxWidth/2 + 20
            
        })
        .attr('y',(d) =>{
            if(typeof d.data.deviceType != 'undefined')
            {
                if(d.data.deviceType == 1)
                    return -this.boxWidth/2 + 20
                else if(d.data.deviceType > 1)
                    return -this.boxWidth/2 + 30
                else
                    return -this.boxWidth/2 

            }
        })
        .attr('width',(d) =>{
            if(typeof d.data.deviceType != 'undefined' && d.data.deviceType == 1)
                return 68.4
        })
        .attr('height',(d) =>{
            if(typeof d.data.deviceType != 'undefined' && d.data.deviceType == 1)
                return 68.4
        })
        .on('mouseover',function(d){
            nodeTip.hide
            if(d.data.deviceType != 0)
                nodeTip.show.apply(this, arguments)
        })
        .on('mouseout',nodeTip.hide)
        
    // 网络连接图标    
    d3.selectAll('.node')
        .filter(d => {return typeof d.data.accessType != 'undefined'})
        .append('image')
        .attr('class','network-icon')
        .attr('xlink:href',d => {
            if(d.data.accessType === 1)
                return '../topo/img/net_device_port.png'
            else
             return '../topo/img/WIFI.png'
        })
        .attr('width',25)
        .attr('height',25)
        .attr('x',-12)
        .attr('y',-60)
    
    // 文字
    d3.selectAll('.node')
        .append('text')
        .attr("dy", 45)
        .style('text-anchor', 'middle') // 文字的水平居中
        .style('dominant-baseline', 'middle')
        .text(d => changename(d.data.name) ||changemac(d.data.mac) )
        .attr("fill", "black")
}

TreeGraph.prototype.tip = function(){
    nodeTip = d3.tip()
                    .attr('class', 'tooltip')
                    .offset([50, 150])
                    .html(function(d) {
                        if(d.data.deviceType != 0)
                        {
                            var returnHtml = `<p><strong class='title'>Name:</strong>${d.data.name || d.data.mac}</p>
                                              <p><strong class='title'>Ip:</strong>${d.data.ipv4}</p>
                                              <p><strong class='title'>MAC:</strong> ${d.data.mac } </p>`;
                            if(d.data.nodeIndex != undefined && d.data.nodeIndex != 1){ //ap     
                                returnHtml += `<p><strong class='title'>Rssi:</strong> ${d.data.rssi} dBm</p>`;
                                returnHtml += `<p><strong class='title'>Link Speed:</strong> ${d.data.linkSpeed} Mbps</p>`;
                            }else if(d.data.accessType == 1){    
                                returnHtml += `<p><strong class='title'>Rssi:</strong> ${"N/A"} dBm</p>`;
                                returnHtml += `<p><strong class='title'>Link Speed:</strong> ${d.data.linkSpeed} Mbps</p>`;
                                returnHtml += `<p><strong class='title'>802.11 mode:</strong> ${"N/A"} </p>`;
                            }else if(d.data.accessType == 2 || d.data.accessType == 3){
                                returnHtml += `<p><strong class='title'>Rssi:</strong> ${d.data.rssi} dBm</p>`;
                                returnHtml += `<p><strong class='title'>Link Speed:</strong> ${d.data.linkSpeed} Mbps</p>`;
                                returnHtml += `<p><strong class='title'>802.11 mode:</strong> ${d.data._80211mode} </p>`;
                            }

                            return returnHtml;
                        }
                        
                    });
    this.svg.call(nodeTip);
    return this
}

// 整合逻辑
TreeGraph.prototype.init = function (data,options) {
    this.treeData = data
    if(typeof options !== 'undefined')
    {
        this.width = options.width || _default.width
        this.height = options.height || _default.height
        this.boxWidth = options.boxWidth || _default.boxWidth
        this.boxHeight = options.boxHeight || _default.boxHeight
    }
    
    this.initLayout()
        .tip()
        .preprocessData()
        .renderGraph()
    
}

TreeGraph.prototype.updata = function (data,options) {
    this.treeData = data
    if(typeof options !== 'undefined')
    {
        this.width = options.width || _default.width
        this.height = options.height || _default.height
        this.boxWidth = options.boxWidth || _default.boxWidth
        this.boxHeight = options.boxHeight || _default.boxHeight
    }
    nodeTip.hide()
    d3.selectAll("svg > *").remove();
    
    this.initLayout()
        .tip()
        .preprocessData()
        .renderGraph()
}