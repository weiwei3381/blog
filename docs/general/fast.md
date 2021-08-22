# 快速笔记

> 未分类笔记，主要用来记录一些想法。

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

## Excel的VB中使用正则表达式

需要处理的列大概长这样

```text
术前血压119/67mmHg     心率（99次／分）　　　血氧饱和度（99％） 
术中血压121/68mmHg     心率（101次／分）　　　血氧饱和度（98％）
术后血压113/64mmHg     心率（105次／分）　　　血氧饱和度（99％）
```

在excel中使用vb将其拆分为以下形式：

![excel拆分](https://pic.imgdb.cn/item/61227f1e44eaada739fa2e02.jpg)

所使用的vb语句如下：

```vb
Option Explicit

' 根据阶段和项目获取信息
Function getInfo(content As String, phase As String, item As String)
    Dim phaseString() As String, allInfo As String
    
    phaseString = VBA.Split(content, Chr(10))
    allInfo = ""
    If UBound(phaseString) = 3 Then
        If phase = "术前" Then
            allInfo = phaseString(1)
        ElseIf phase = "术中" Then
            allInfo = phaseString(2)
        ElseIf phase = "术后" Then
            allInfo = phaseString(3)
        End If
    ElseIf UBound(phaseString) = 2 Then
        If phase = "术前" Then
            allInfo = phaseString(0)
        ElseIf phase = "术中" Then
            allInfo = phaseString(1)
        ElseIf phase = "术后" Then
            allInfo = phaseString(2)
        End If
    End If
    
    Dim reg As Object, mc As Object, result As String
    Set reg = CreateObject("VBScript.RegExp")
    If item = "血压" Then
        reg.Pattern = "血[压](.+)?mm"
        Set mc = reg.Execute(allInfo)
        result = mc.item(0).submatches(0)
    ElseIf item = "心率" Then
        reg.Pattern = "（(\d+)?次／分"
        Set mc = reg.Execute(allInfo)
        result = mc.item(0).submatches(0)
    ElseIf item = "血氧饱和度" Then
        reg.Pattern = "（(\d+)?％"
        Set mc = reg.Execute(allInfo)
        result = mc.item(0).submatches(0)
    End If

    getInfo = result
End Function
```

## 英文专业书籍搜索（libgen）

使用[libgen](https://libgen.is/search.php)可以搜索很多英文专业书，最近的military balance 2021就是在这上面找到的。

![military balance搜索](https://pic.imgdb.cn/item/61227fff44eaada739faa3d8.jpg)
