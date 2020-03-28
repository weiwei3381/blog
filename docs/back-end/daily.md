# 每日冷知识

![每日冷知识封面](http://s1.ax1x.com/2020/03/26/8xLVM9.jpg)

## :sun_with_face: 2020年3月25日

### JSLinux

[JSLinux](http://bellard.org/jslinux/)是Fabrice Bellard用javascript写的模拟器，可以在上面跑x86 Linux:scream:. 那复古的页面确实无处不在地诠释他的牛逼:+1:.

### Utools软件

![utools截图](https://s1.ax1x.com/2020/03/26/8x0dZ6.jpg)
[Utools](https://u.tools/)是一个编程插件工具集合，里面有各种实用的插件，按[ctrl]+[空格]就可以唤出，基于中文字符做了很多优化，例如输入`jsb`就可以找到`记事本`功能，目前图床功能已经开始使用了.
安装后，主目录在`C:\Users\weiwe\AppData\Local\Programs\utools`下，辅助目录在`C:\Users\weiwe\AppData\Roaming\uTools`下，辅助目录下放置有各类插件.

### 图床

目前没有找到合适的图床，目前国内免费的图床用过一些，但是心里都没底，像[七牛云](https://www.qiniu.com/)速度不错，但是发现测试域名只有一个月时间，到期后就不能显示了，好在图片都还在云里. 一直在找免费而且靠谱的图床，后来发现有**聚合图床**，就是把一张图片上传到不同的免费图床上，降低风险，但是缺点是更换起来比较麻烦，但是总比没有了强，目前找到几个靠谱免费的图床有: [掘金](https://user-gold-cdn.xitu.io/2020/3/25/1711151ebefdcf24?w=1366&h=768&f=jpeg&s=269773)，[路过图床](https://imgchr.com/)，[网易严选](http://yanxuan.nosdn.127.net/79c51260d1548c52fd7095cbbf2659ea.jpg)，[搜狗](https://img04.sogoucdn.com/app/a/100520146/1896653dd2f5d297b6b6620394dab212)。

### UomgAPI

[UomgAPI](https://api.uomg.com/)提供了许多稳定、快速、免费的 API 接口服务，例如音乐，图床，短链接等. 比较有意思的有:

- 网易云音乐热门评论，[点击获取](https://api.uomg.com/api/comments.163)
- 随机土味情话，[点击获取](https://api.uomg.com/api/rand.qinghua)
- 获取LOFTER首页壁纸url，[点击获取](https://api.uomg.com/api/image.lofter?format=text)
- 随机输出竖版手机图片，[点击获取](https://api.uomg.com/api/rand.img2?sort=%E7%BE%8E%E5%A5%B3&format=text)

### RobotJS

[RobotJS](http://robotjs.io/)是一个优秀的自动化库，可以实现控制鼠标、键盘、获取屏幕信息等功能，可以实现很多自动化操作。可惜安装起来比较麻烦，需要编译才能使用.

## :sun_with_face: 2020年3月28日

### Zdog——伪3D设计页面

![Zdog图标](https://s1.ax1x.com/2020/03/28/GkDM0U.png)
github:star:: 7.5k
[Zdog](https://github.com/metafizzy/zdog)是圆形、扁平、设计友好的伪三维引擎，[主页](https://zzz.dog/)可以查看示例，[指南](https://zzz.dog/getting-started)可以进行学习，主要是构建设计用的动态3d展示图，示例demo如下所示:

```js
let isSpinning = true;

let illo = new Zdog.Illustration({
  element: '.zdog-canvas',
  dragRotate: true,
  // stop spinning when drag starts
  onDragStart: function() {
    isSpinning = false;
  },
});

// circle
new Zdog.Ellipse({
  addTo: illo,
  diameter: 80,
  translate: { z: 40 },
  stroke: 20,
  color: '#636',
});

// square
new Zdog.Rect({
  addTo: illo,
  width: 80,
  height: 80,
  translate: { z: -40 },
  stroke: 12,
  color: '#E62',
  fill: true,
});

function animate() {
  illo.rotate.y += isSpinning ? 0.03 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}
animate();
```

### python实现的按键精灵脚本——KeymouseGo

github:star:: 463

[KeymouseGo](https://github.com/taojy123/KeymouseGo)，主要用来记录用户的鼠标键盘操作，通过触发按钮自动执行之前记录的操作，可设定执行的次数，可以理解为`精简绿色版`的`按键精灵`。在进行某些操作简单、单调重复的工作时，使用本软件就可以很省力了,自己只要做一遍，然后接下来就让电脑来做。软件通过 Python 语言编写，已编译为 windows 平台可执行文件，未安装 Python 的用户可直接下载[安装版](https://github.com/taojy123/KeymouseGo/releases).

### Hilo - HTML5互动游戏引擎

> [Hilo](https://github.com/hiloteam/Hilo) 是阿里巴巴集团开发的一款HTML5跨终端游戏解决方案，可以帮助开发者快速创建HTML5游戏。

github:star:: 5.4k
[Hilo中文网](https://hiloteam.github.io/index.html)，提供了源码和API文档，并且提供了教程文档可以学习，与英文的canvas框架相比，中文版的上手比较快，可以一试，下面是作品展示情况：
![Hilo作品演示](https://s1.ax1x.com/2020/03/28/GkgXHx.png)

- [Flappy Bird](http://g.alicdn.com/tmapp/static/4.0.10/hilo/flappy/index.html)
- [2048](http://g.alicdn.com/tmapp/hilodemos/3.0.7/2048/index.html)
- [水果忍者](http://g.alicdn.com/tmapp/hilodemos/3.0.7/fruit-ninja/index.html)