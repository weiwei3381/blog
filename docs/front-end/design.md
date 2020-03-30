# 前端设计与可视化

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
