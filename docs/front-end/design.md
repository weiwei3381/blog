# 前端设计与可视化

## 色系搭配

### Antd 色系

> Ant Design 是阿里巴巴出的一款前端 UI 框架, [Antd 色彩体系](https://ant.design/docs/spec/colors-cn)解读成两个层面：系统级色彩体系和产品级色彩体系.

#### Antd 色板

Ant Design 的基础色板共计 120 个颜色，包含 12 个主色以及衍生色。这些颜色基本可以满足中后台设计中对于颜色的需求。
![Antd色系1](https://s1.ax1x.com/2020/03/30/GmmRfO.png)
![Antd色系2](https://s1.ax1x.com/2020/03/30/GmnWEq.png)
![Antd色系3](https://s1.ax1x.com/2020/03/30/GmK3OH.png)
中性色包含了黑、白、灰。在蚂蚁中后台的网页设计中被大量使用到，合理地选择中性色能够令页面信息具备良好的主次关系，助力阅读体验。Ant Design 的中性色板一共包含了从白到黑的 13 个颜色。
![Antd中性色板](https://s1.ax1x.com/2020/03/30/GmuDd1.png)

[AntV 色板色彩值](https://www.yuque.com/docs/share/98fd436e-bf79-4242-9ccd-2eeb74234ce6?#)记录了很详细的色彩选取规则和颜色.

#### 分类色板

分类色板用于描述分类数据，如苹果、香蕉、梨，常用一个颜色代表一个值以区分不同类型，取色时色相分布均衡，相邻颜色之间明暗需考虑差异性，常用于饼图的不同分类、填充地图中的不同国家、关系图中的不同角色等。
![Antd分类色板](https://s1.ax1x.com/2020/03/30/GmMZjg.png)
![10-20色分类面板](https://s1.ax1x.com/2020/03/30/GmQkZ9.png)

```json
{
  // 基础十色系
  "color": [
    "#5B8FF9",
    "#5AD8A6",
    "#5D7092",
    "#F6BD16",
    "#E8684A",
    "#6DC8EC",
    "#9270CA",
    "#FF9D4D",
    "#269A99",
    "#FF99C3"
  ]
}
```

#### 单一顺序色板

最多支持 8 色，最少支持 2 色
![Antd单一顺序色板](https://s1.ax1x.com/2020/03/30/GmQaQS.png)

#### 邻近色色板

最多支持 9 色，最少支持 2 色
![Antd邻近色色板](https://s1.ax1x.com/2020/03/30/GmlNkR.png)

## Echarts 技巧

> [Echarts](https://www.echartsjs.com/zh/index.html)是百度开源的图表可视化工具, 主要用于前端数据可视化, [官方实例](https://www.echartsjs.com/examples/zh/index.html)十分丰富, [配置项手册](https://www.echartsjs.com/zh/option.html#title)说明也很详细.

### Echarts 常用概念

**(1) 系列（series）**
`系列`（series）是很常见的名词。在 echarts 里，`系列`（series）是指：一组数值以及他们映射成的图。“系列”这个词原本可能来源于“一系列的数据”，而在 echarts 中取其扩展的概念，不仅表示数据，也表示数据映射成为的图。所以，一个 `系列` 包含的要素至少有：一组数值、图表类型（`series.type`）、以及其他的关于这些数据如何映射成图的参数。

echarts 里系列类型（`series.type`）就是图表类型。系列类型（`series.type`）至少有：line（折线图）、bar（柱状图）、pie（饼图）、scatter（散点图）、graph（关系图）、tree（树图）、...如下图，右侧的 `option` 中声明了三个 `系列`（series）：pie（饼图系列）、line（折线图系列）、bar（柱状图系列），每个系列中有他所需要的数据（`series.data`）。
![series配置方式](https://s1.ax1x.com/2020/03/31/Gl8Pn1.png)

类同地，下图中是另一种配置方式，系列的数据从`dataset`中取：
![dataset配置方式](https://s1.ax1x.com/2020/03/31/GlGwxH.png)

**(2) 组件（component）**
在系列之上，echarts 中各种内容，被抽象为“组件”。例如，echarts 中至少有这些组件：xAxis（直角坐标系 X 轴）、yAxis（直角坐标系 Y 轴）、grid（直角坐标系底板）、angleAxis（极坐标系角度轴）、radiusAxis（极坐标系半径轴）、polar（极坐标系底板）、geo（地理坐标系）、dataZoom（数据区缩放组件）、visualMap（视觉映射组件）、tooltip（提示框组件）、toolbox（工具栏组件）、series（系列）、...

我们注意到，其实系列（series）也是一种组件，可以理解为：系列是专门绘制“图”的组件。

如下图，右侧的 option 中声明了各个组件（包括系列），各个组件就出现在图中。
![echarts组件分布](https://s1.ax1x.com/2020/03/31/GlJVQH.png)

**(3) 坐标系**
很多系列，例如 line（折线图）、bar（柱状图）、scatter（散点图）、heatmap（热力图）等等，需要运行在 “坐标系” 上。坐标系用于布局这些图，以及显示数据的刻度等等。例如 echarts 中至少支持这些坐标系：直角坐标系、极坐标系、地理坐标系（GEO）、单轴坐标系、日历坐标系 等。其他一些系列，例如 pie（饼图）、tree（树图）等等，并不依赖坐标系，能独立存在。还有一些图，例如 graph（关系图）等，既能独立存在，也能布局在坐标系中，依据用户的设定而来。

一个坐标系，可能由多个组件协作而成。我们以最常见的直角坐标系来举例。直角坐标系中，包括有 xAxis（直角坐标系 X 轴）、yAxis（直角坐标系 Y 轴）、grid（直角坐标系底板）三种组件。xAxis、yAxis 被 grid 自动引用并组织起来，共同工作。

我们来看下图，这是最简单的使用直角坐标系的方式：只声明了 xAxis、yAxis 和一个 scatter（散点图系列），echarts 暗自为他们创建了 grid 并关联起他们：
![简单散点图坐标系](https://s1.ax1x.com/2020/03/31/GlJRTx.png)

再来看下图，两个 yAxis，共享了一个 xAxis。两个 series，也共享了这个 xAxis，但是分别使用不同的 yAxis，使用 yAxisIndex 来指定它自己使用的是哪个 yAxis：
![多坐标系指定](https://s1.ax1x.com/2020/03/31/GlJXAP.png)

再来看下图，一个 echarts 实例中，有多个 grid，每个 grid 分别有 xAxis、yAxis，他们使用 xAxisIndex、yAxisIndex、gridIndex 来指定引用关系：
![多坐标多Grid图](https://s1.ax1x.com/2020/03/31/GlYG4K.png)

### 导出 svg 图片

(1) 导出 SVG 图片需要先修改渲染器, 默认使用 canvas 渲染器, 需要改为 SVG 渲染器

```js
// 使用 Canvas 渲染器（默认）
var chart = echarts.init(containerDom, null, { renderer: 'canvas' })
// 等价于：
var chart = echarts.init(containerDom)

// 使用 SVG 渲染器
var chart = echarts.init(containerDom, null, { renderer: 'svg' })
```

(2) 修改工具栏的保存图片格式
`toolbox.feature.saveAsImage.type`表示保存的图片格式。如果初始化图表时`renderer`类型是 'canvas'（默认），则支持 'png'（默认）和 'jpeg'；如`renderer` 的类型是 'svg'，则 type 只支持 'svg'。

## 甘特图创建

echarts 也可以做甘特图, 但是效果不好, 目前评价比较高的是[DHTMLX/gantt](https://github.com/DHTMLX/gantt), 可以在[官网](https://dhtmlx.com/docs/products/dhtmlxGantt/)进行下载.
![DHTMLX甘特图效果](https://s1.ax1x.com/2020/04/02/GYm8js.png)

[掘金甘特图教程](https://juejin.im/post/5e7ffd56f265da794e526102)详细介绍了在 react 中开发使用甘特图的过程.
