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

## 油猴脚本推荐

到[Greasy Fork](https://greasyfork.org/zh-CN)搜索并下载脚本，常用脚本有：

### 网易云音乐直接下载

[3046-网易云音乐直接下载](https://greasyfork.org/zh-CN/scripts/33046-%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD):在单曲页面显示歌词、翻译、封面、MV、歌曲下载链接并以高音质试听。同时支持歌单、专辑等页面直接下载单曲、封面、歌词(压缩包)。

### Bilibili Evolved

[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)主要是改善BiliBili的观看体验，能够提供下载弹幕、视频等功能，点击[此处](https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@master/bilibili-evolved.user.js)安装，设置如下。

![Bilibili Evolved预览](https://ftp.bmp.ovh/imgs/2021/09/c818d4d55c5e2173.png)

### 中国知网CNKI硕博论文PDF下载

[中国知网CNKI硕博论文PDF下载](https://greasyfork.org/zh-CN/scripts/389343-%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91cnki%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87pdf%E4%B8%8B%E8%BD%BD)，添加知网直接下载PDF的按钮。

### 全球安全网站模态框拦截

代码是自己写的，主要用途是在访问[全球安全](https://www.globalsecurity.org/military/library/)网站时，拦截登录模态框，源码如下：

```js
// ==UserScript==
// @name         全球安全模态框拦截
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.globalsecurity.org/*
// @run-at      document-end
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    function removeModal(){
        if($('#military').attr('class') === "tp-modal-open"){
            console.log("弹出模态框")
            $("#military").removeClass("tp-modal-open");  // 移除tp-modal-open类，使得鼠标能滚动
            $(".tp-backdrop.tp-active").css('opacity', 0)
            $(".tp-backdrop.tp-active").removeClass("tp-backdrop")
            $("div.tp-modal").remove()
        }
    }
    setTimeout(removeModal,2000)
    setTimeout(removeModal,4000)
    setTimeout(removeModal,6000)
    setTimeout(removeModal,8000)
    setTimeout(removeModal,10000)

})();
```

### 知乎网页助手

[知乎网页助手](https://greasyfork.org/zh-CN/scripts/384172-%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B)，功能介绍：1、知乎站外链接直接跳转至目标网址；2、自动展开问题全部信息，同时展示所有回答；3、去除知乎网页中的广告；4、知乎网页中短视频下载；5、解除知乎复制限制-划词复制（鼠标左键划词自动添加到剪切板）。

### VIP会员视频自动解析

[VIP会员视频自动解析](https://greasyfork.org/zh-CN/scripts/413063-%E7%94%B5%E8%84%91-%E6%89%8B%E6%9C%BA-%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E5%85%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC-vip%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90)，能够免费看各大视频网址视频。

### CSDN 去广告沉浸阅读模式

[CSDN 去广告沉浸阅读模式](https://greasyfork.org/zh-CN/scripts/373457-csdn-%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F)提供功能包括：沉浸式阅读 🌈 使用随机背景图片 🎬 重构页面布局 🎯 净化剪切板 🎨 屏蔽一切影响阅读的元素 🎧。

## 移动硬盘情况

### 2TB<新>-移动硬盘(黑薄)

移动硬盘名称为`2TB<新>`，共计2TB空间，盘符名为“**Entertainment**”，主要内容包括“动漫、纪录片、音乐、影视、游戏、2016年论文”。

### 2TB<旧>-移动硬盘(白厚)

移动硬盘名称为**2TB<旧>**，共计2TB空间，盘符名为`Study`，主要内容包括“软件、书籍 、其他技能视频 、慕课专栏 、掘金小册 、极客时间 、编程视频教程 、网易云课堂”。

### 4TB-移动硬盘(黑厚)

移动硬盘没有贴名字，共计4TB空间，盘符名为`Element SE`，主要内容包括“other 、PPT资料 、surface文件 、switch 升级备份 、其他视频教程 、历史存档资料 、多媒体制作 、学习 、宝宝资料 、小学资料 、得到 、手机备份 、操作系统原理 、机器人Linux 、樊登小读者 、汇编逆向 、爬虫数据 、电子书 、精选pdf电子书 、编程 、自然语言处理 、语料库、魔d广播剧”。

## B站视频下载(bilibili视频下载)

**方法1**: 下载[annie.exe](https://wwaz.lanzoum.com/iSPCn0n9ys0f)或者[lux.exe](https://github.com/iawia002/lux), 因为需要登录bilibili之后才能下载720p及以上清晰度的视频, 因此需要使用浏览器cookie, 在程序目录中创建`bilibili_cc.txt`文件, 然后登录[B站](https://www.bilibili.com/), 打开chrome浏览器的调试窗口, 在`网络`的请求中找到`www.bilibili.com`,查看`标头`的`cookie`属性, 如下图所示:

![cookie](https://pic.imgdb.cn/item/63e7990c4757feff330d13ed.jpg)

右键选中`复制值`之后, 在`bilibili_cc.txt`文件中粘贴, 里面的内容应该是`键=值;`模式。

准备好cookie之后, 在文件根目录输入`.\annie.exe -c .\bilibili_cc.txt -i "https://www.bilibili.com/video/BV1U84y167i3"`, 可以查看下载文件的类型和清晰度, 然后使用`.\annie.exe -c .\bilibili_cookie.txt -f 64 "https://www.bilibili.com/video/BV1U84y167i3?p=1"`进行下载。

**方法2**: 使用[高清视频下载](https://youtube.iiilab.com/), [yiuios视频解析](https://www.yiuios.com/tool/bilibili)等网站下载。
