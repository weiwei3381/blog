# 前端设计与可视化

## 色系搭配

### Antd色系

> Ant Design是阿里巴巴出的一款前端UI框架, [Antd色彩体系](https://ant.design/docs/spec/colors-cn)解读成两个层面：系统级色彩体系和产品级色彩体系.

#### Antd色系

Ant Design 的基础色板共计 120 个颜色，包含 12 个主色以及衍生色。这些颜色基本可以满足中后台设计中对于颜色的需求。
![Antd色系1](https://s1.ax1x.com/2020/03/30/GmmRfO.png)
![Antd色系2](https://s1.ax1x.com/2020/03/30/GmnWEq.png)
![Antd色系3](https://s1.ax1x.com/2020/03/30/GmK3OH.png)
中性色包含了黑、白、灰。在蚂蚁中后台的网页设计中被大量使用到，合理地选择中性色能够令页面信息具备良好的主次关系，助力阅读体验。Ant Design 的中性色板一共包含了从白到黑的 13 个颜色。
![Antd中性色板](https://s1.ax1x.com/2020/03/30/GmuDd1.png)

[AntV色板色彩值](https://www.yuque.com/docs/share/98fd436e-bf79-4242-9ccd-2eeb74234ce6?#)记录了很详细的色彩选取规则和颜色.  

#### 分类色板

分类色板用于描述分类数据，如苹果、香蕉、梨，常用一个颜色代表一个值以区分不同类型，取色时色相分布均衡，相邻颜色之间明暗需考虑差异性，常用于饼图的不同分类、填充地图中的不同国家、关系图中的不同角色等。
![Antd分类色板](https://s1.ax1x.com/2020/03/30/GmMZjg.png)
![10-20色分类面板](https://s1.ax1x.com/2020/03/30/GmQkZ9.png)

#### 单一顺序色板

最多支持8色，最少支持2色
![Antd单一顺序色板](https://s1.ax1x.com/2020/03/30/GmQaQS.png)

#### 邻近色色板

最多支持 9 色，最少支持 2 色
![Antd邻近色色板](https://s1.ax1x.com/2020/03/30/GmlNkR.png)

## Echarts技巧

> [Echarts](https://www.echartsjs.com/zh/index.html)是百度开源的图表可视化工具, 主要用于前端数据可视化, [官方实例](https://www.echartsjs.com/examples/zh/index.html)十分丰富, [配置项手册](https://www.echartsjs.com/zh/option.html#title)说明也很详细.

### 导出svg图片

Step1: 导出SVG图片需要先修改渲染器, 默认使用canvas渲染器, 需要改为SVG渲染器

```js
// 使用 Canvas 渲染器（默认）
var chart = echarts.init(containerDom, null, {renderer: 'canvas'});
// 等价于：
var chart = echarts.init(containerDom);

// 使用 SVG 渲染器
var chart = echarts.init(containerDom, null, {renderer: 'svg'});
```

Step2: 修改工具栏的保存图片格式
`toolbox.feature.saveAsImage.type`表示保存的图片格式。如果初始化图表时`renderer`类型是 'canvas'（默认），则支持 'png'（默认）和 'jpeg'；如`renderer` 的类型是 'svg'，则 type 只支持 'svg'。
