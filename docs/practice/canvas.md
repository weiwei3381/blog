# canvas 绘制

## Konva

[Konva.js](https://konvajs.org/)是 Canvas 的一个非常好用的框架，很直观，适用于可视化图形和动画的开发, [文档](https://konvajs.org/docs/)也很详细, 关键是在 github 上他有对应的 react 包装类[React Konva](https://github.com/konvajs/react-konva), 下面是一个点击方块切换颜色的实例.

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Stage, Layer, Rect, Text } from 'react-konva'
import Konva from 'konva'

// 定义颜色矩形
class ColoredRect extends React.Component {
  state = {
    // 默认为绿色
    color: 'green'
  }
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    })
  }
  render() {
    return (
      <Rect
        x={20}
        y={20}
        width={50}
        height={50}
        fill={this.state.color}
        shadowBlur={5}
        onClick={this.handleClick}
      />
    )
  }
}

class App extends Component {
  render() {
    // Stage是一个div容器
    // Layer是真正的canvas元素(所以可以放置多个canvas到stage上)
    // 然后我们把canvas形状放到Layer中
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="点击变色" />
          <ColoredRect />
        </Layer>
      </Stage>
    )
  }
}

render(<App />, document.getElementById('root'))
```

显示效果如下:
![Konva示例效果](https://s1.ax1x.com/2020/04/05/GB9oe1.png)

如果要提高性能, 可以使用[react-spring](https://github.com/react-spring/react-spring), 这是一个基于弹簧物理的动画库，应满足您大多数与 UI 相关的动画需求。 它为您提供了足够灵活的工具，可以自信地将您的想法投射到不断变化的界面中。

## 使用Echarts绘制直方图

```JavaScript
const histogramChart = echarts.init(document.getElementById('histogram'));
// 年龄
var ages = [74, 75, 69, 67, 46, 78, 72, 63, 77, 80, 78, 85, 82, 69, 71, 89, 69, 81, 93, 69, 79, 69, 82, 82, 89, 72, 78, 78, 78, 84, 74, 88, 78, 87, 70, 85, 74, 86, 80, 76, 77, 90, 81, 74, 84, 71, 88, 85, 92, 89, 78, 84, 69, 76, 81, 67, 88];

// See https://github.com/ecomfe/echarts-stat
// 直方图提供了四种计算小区间间隔个数的方法，分别是 squareRoot, scott, freedmanDiaconis 和 sturges
var bins = ecStat.histogram(ages,'scott');
// 柱子间间隔的刻度
var interval;

var min = Infinity;
var max = -Infinity;

var data = echarts.util.map(bins.data, function (item, index) {
    // 左刻度
    var x0 = bins.bins[index].x0;
    // 右刻度
    var x1 = bins.bins[index].x1;
    interval = x1 - x0;
    // 获得数据集中最值
    min = Math.min(min, x0);
    max = Math.max(max, x1);
    // item[0]代表刻度的中间值，item[1]代表出现的次数
    return [x0, x1, item[1]];
});

// 自定义渲染效果
function renderItem(params, api) {
    // 这个根据自己的需求适当调节
    var yValue = api.value(2);
    var start = api.coord([api.value(0), yValue]);
    var size = api.size([api.value(1) - api.value(0), yValue]);
    var style = api.style();

    return {
        // 矩形及配置
        type: 'rect',
        shape: {
            x: start[0] + 1,
            y: start[1],
            width: size[0] - 2,
            height: size[1]
        },
        style: style
    };
}

option = {
    title: {
        text: '患者年龄分布直方图',
        left: 'center',
        top: 10
    },
    color: ['rgb(25, 183, 207)'],
    grid: {
        top: 80,
        containLabel: true
    },
    xAxis: [{
        name:"年龄",
        type: 'value',
        min: min,
        max: max,
        interval: interval
    }],
    yAxis: [{
        name:'出现次数',
        type: 'value',
    }],
    series: [{
        name: 'height',
        type: 'custom',
        renderItem: renderItem,
        label: {
            show: true,
            position: 'insideTop'
        },
        encode: {
            // 表示将data中的data[0]和data[1]映射到x轴
            x: [0, 1],
            // 表示将data中的data[2]映射到y轴
            y: 2,
            // 表示将data中的data[2]映射到tooltip
            tooltip: 2,
            // 表示将data中的data[2]映射到label
            label: 2
        },
        data: data
    }]
};
histogramChart.setOption(option)
```

最后的效果如下图所示。

![年龄分布直方图](https://pic.imgdb.cn/item/61227ad444eaada739f7c0ba.jpg)

意外发现百度开源的[ecStat](https://gitee.com/yunduanxing/echarts-stat)工具，它是ECharts的统计和数据挖掘工具。你可以把它当作一个工具库直接用来分析数据；你也可以将其与ECharts结合使用，用ECharts可视化数据分析的结果。

它的API主要有四类，分别是：

- 直方图
- 聚类
- 回归
- 基本统计方法

ps: 其实也可以用Python的**seaborn**来绘制直方图，不过调整起来没有那么方便，跟node.js不是一个技术栈，所以这次没怎么用。

