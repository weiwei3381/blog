# Hilo 使用记录

> [Hilo](https://github.com/hiloteam/Hilo) 是阿里巴巴集团开发的一款 HTML5 跨终端游戏解决方案，可以帮助开发者快速创建 HTML5 游戏。

## 使用记录

使用`npm install hilojs --save`进行安装

## 使用 Hilo 开发 Flappy Bird

Flappy Bird 是一款前不久风靡世界的休闲小游戏。虽然它难度超高，但是游戏本身却非常简单。下面我们就使用 Hilo 来快速开发 HTML5 版的 Flappy Bird。

### 源文件结构

大家可以先下载 [Flappy Bird 的项目源文件](https://wws.lanzous.com/iXpmKgja8oh)作为参考，以下是整个项目的文件结构：

```bash
flappybird/
├── index.html //游戏主页面
├── js/
│   ├── game.js //游戏主模块
│   ├── Asset.js //素材加载类
│   ├── ReadyScene.js //准备场景
│   ├── OverScene.js //结束场景
│   ├── Bird.js //小鸟类
│   ├── Holdbacks.js //障碍类
│   ├── hilo-standalone.js //hilo独立版
└── images/
```

### 预加载图片

为了让玩家有更流畅的游戏体验，图片素材一般需要预先加载。Hilo 提供了一个队列下载工具 LoadQueue，使用它可以预加载图片素材。如下所示，在 Asset 类中，我们定义了 load 方法：

```js
load: function(){
    var resources = [
        {id:'bg', src:'images/bg.png'},
        {id:'ground', src:'images/ground.png'},
        {id:'ready', src:'images/ready.png'},
        {id:'over', src:'images/over.png'},
        {id:'number', src:'images/number.png'},
        {id:'bird', src:'images/bird.png'},
        {id:'holdback', src:'images/holdback.png'}
    ];

    this.queue = new Hilo.LoadQueue();
    this.queue.add(resources);
    this.queue.on('complete', this.onComplete.bind(this));
    this.queue.start();
}
```

从上面代码中可以看到，resources 是我们要下载的图片素材列表，使用 queue.add() 方法把素材列表加入到下载队列中，再使用 queue.start() 方法来启动下载队列。

> **提示**：下载队列 LoadQueue 当前仅支持图片等资源的下载，其他资源文件可通过自定义扩展方式实现。具体可参考 API 文档。

为了获得下载情况，LoadQueue 提供了三个事件：

- `load` - 当单个资源下载完成时发生
- `complete` - 当所有资源下载完成时发生
- `error` - 当某一资源下载出错时发生

在这里我们仅监听了 complete 事件。

```js
onComplete: function(e){
    this.bg = this.queue.get('bg').content;
    this.ground = this.queue.get('ground').content;
    this.birdAtlas = new Hilo.TextureAtlas({
        image: this.queue.get('bird').content,
        frames: [
            [0, 120, 86, 60],
            [0, 60, 86, 60],
            [0, 0, 86, 60]
        ],
        sprites: {
            bird: [0, 1, 2]
        }
    });

    //删除下载队列的complete事件监听
    this.queue.off('complete');
    //发送complete事件
    this.fire('complete');
}
```

下载完成后会触发 onComplete 回调方法。我们可以通过 queue.get(id).content 来获取指定 id 的图片素材下载完成后的 Image 对象。 在这里我们创建了游戏中需要用到的素材以及精灵纹理集等。

其中纹理集 TextureAtlas 实例由三部分组成：

- `image` - 纹理集图片。
- `frames` - 纹理集图片帧序列。每个图片帧由图片在纹理集中的坐标 x/y 和宽高 width/height 组成，即 [x, y, width, height]。
- `sprites` - 精灵定义。sprites 可包含多个精灵定义。每个精灵由多个 frames 中的图片帧组成，其中数值代表图片帧在 frames 中的索引位置。比如 bird，则由索引为 0、1、2 的图片帧组成。

在 game.js 中使用 Asset 类来下载完图片素材后，再调用 initStage 方法初始化舞台：

```js
this.asset = new game.Asset()
this.asset.on(
  'complete',
  function(e) {
    this.asset.off('complete')
    this.initStage()
  }.bind(this)
)
this.asset.load()
```

### 初始化舞台

由于我们的图片素材是高清图片，且背景大小为 720x1280。因此，我们设定游戏舞台的大小为 720x1280，并设置其 x 和 y 轴的缩放比例均为 0.5，这样舞台实际的可见大小变为 360x640。最后，我们把 canvas 画布添加到 body 中。

```js
initStage: function(){
    this.width = 720;
    this.height = 1280;
    this.scale = 0.5;

    var stage = this.stage = new Hilo.Stage({
        width: this.width,
        height: this.height,
        scaleX: scale,
        scaleY: scale
    });

    document.body.appendChild(stage.canvas);
}
```

> **注意**：舞台是一个各种图形、精灵动画等的总载体。所有用 Hilo 创建的可见的对象都必须添加到舞台或其子容器后，才会被渲染和显示出来。

舞台创建好后，我们需要一个定时器来不断更新和渲染舞台。这里可以使用 Ticker 类：

```js
//设定舞台刷新频率为60fps
this.ticker = new Hilo.Ticker(60)
//把舞台加入到tick队列
this.ticker.addTick(this.stage)
//启动ticker
this.ticker.start()
```

### 场景分析

如果你玩过原版的 Flappy Bird，就知道此游戏的场景非常简单，大致可以划分以下几个部分：

背景 - 背景图和移动的地面是贯穿整个游戏，没有变化的。 准备场景 - 一个简单的游戏提示画面。游戏开始前和失败后重新开始都会进入此场景。 游戏场景 - 障碍物不断的从右往左移动，玩家控制小鸟的飞行。 结束场景 - 游戏失败后，显示得分以及相关按钮等。 接下来，我们就开始用 Hilo 来创建这 4 个场景。

### 游戏背景

由于背景是不变的，为了减少 canvas 的重复绘制，我们采用 DOM+CSS 来设置背景。先创建一个 div，设置其 CSS 背景为游戏背景图片，再把它加入到舞台的 canvas 后面。

```js
initBackground: function(){
    var bgWidth = this.width * this.scale;
    var bgHeight = this.height * this.scale;
    document.body.insertBefore(Hilo.createElement('div', {
      id: 'bg',
      style: {
          position: 'absolute',
          background: 'url(images/bg.png) no-repeat',
          backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
          width: bgWidth + 'px',
          height: bgHeight + 'px'
      }
    }), this.stage.canvas);
}
```

地面也是背景的一部分，处于画面最下端。地面我们使用可视对象 Bitmap 类。一般的，不需要使用精灵动画的普通图片对象都可使用此类。Bitmap 类只要传入相应的图片 image 参数即可。此外，为了方便查找对象，一般我们都为可视对象取一个合适的 id。

```js
initBackground: function(){
    /* all previous code here */

    this.ground = new Hilo.Bitmap({
      id: 'ground',
      image: this.asset.ground
    });

    //放置地面在舞台的最底部
    this.ground.y = this.height - this.ground.height;

    //循环移动地面
    Hilo.Tween.to(this.ground, {x:-60}, {duration:300, loop:true});
}
```

地面不是静止的。它是从右到左的不断循环的移动着的。我们注意到地面的图片素材比背景要宽一些，而地面图片本身也是一些循环的斜四边形组成的。这样的特性，意味着如果我们把图片从当前位置移动到下一个斜四边形的某一位置时，舞台上的地面会看起来是没有移动过一样。我们找到当地面的 x 轴坐标为 - 60 时，跟 x 轴为 0 时的地面的图形是没有差异的。这样，若地面在 0 到 - 60 之间不断循环变化时，地面就循环移动起来了。

Hilo 提供了缓动动画 Tween 类。它的使用也非常简单：

```js
Hilo.Tween.to(obj, newProperties, params)
```

- `obj` - 要缓动的对象。
- `newProperties` - 指定缓动后对象的属性改变后的新值。这里指定 x 为 - 60，也就是地面运动到 x 为 - 60 的位置。
- `params` - 指定缓动参数。这里指定了缓动时间 time 为 300 毫秒，loop 表示缓动是不断循环的。

Tween 类不会自动运行，也需要加入到 tick 队列才能运行：

```js
this.ticker.addTick(Hilo.Tween)
```

### 准备场景

准备场景很简单，由一个 Get Ready！的文字图片和 TAP 提示的图片组成。这里，我们创建一个 ReadyScene 的类，继承自容器类 Container。它的实现只需要把 getready 和 tap 这 2 个 Bitmap 对象创建好并放置在适当的位置即可。而它们的图片素材 image 会传给 ReadyScene 的构造函数。

```js
var ReadyScene = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor: function(properties) {
    ReadyScene.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  init: function(properties) {
    //准备Get Ready!
    var getready = new Hilo.Bitmap({
      image: properties.image,
      rect: [0, 0, 508, 158],
    })

    //开始提示tap
    var tap = new Hilo.Bitmap({
      image: properties.image,
      rect: [0, 158, 286, 246],
    })

    //确定getready和tap的位置
    tap.x = (this.width - tap.width) >> 1
    tap.y = (this.height - tap.height + 40) >> 1
    getready.x = (this.width - getready.width) >> 1
    getready.y = (tap.y - getready.height) >> 0

    this.addChild(tap, getready)
  },
})
```

在游戏主文件 game.js 中，实例化 ReadyScene 并添加到舞台 stage 上。

```js
this.readyScene = new game.ReadyScene({
  width: this.width,
  height: this.height,
  image: this.asset.ready,
}).addTo(this.stage)
```

### 结束场景

结束场景跟准备场景相似。

```js
var OverScene = (ns.OverScene = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor: function(properties) {
    OverScene.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  init: function(properties) {
    //Game Over图片文字
    var gameover = (this.gameover = new Hilo.Bitmap({
      id: 'gameover',
      image: properties.image,
      rect: [0, 298, 508, 158],
    }))

    //结束面板
    var board = (this.board = new Hilo.Bitmap({
      id: 'board',
      image: properties.image,
      rect: [0, 0, 590, 298],
    }))

    //开始按钮
    var startBtn = (this.startBtn = new Hilo.Bitmap({
      id: 'start',
      image: properties.image,
      rect: [590, 0, 290, 176],
    }))

    //等级按钮
    var gradeBtn = (this.gradeBtn = new Hilo.Bitmap({
      id: 'grade',
      image: properties.image,
      rect: [590, 176, 290, 176],
    }))

    //玩家当前分数
    var scoreLabel = (this.scoreLabel = new Hilo.BitmapText({
      id: 'score',
      glyphs: properties.numberGlyphs,
      scaleX: 0.5,
      scaleY: 0.5,
      letterSpacing: 4,
      text: 0,
    }))

    //玩家最好成绩
    var bestLabel = (this.bestLabel = new Hilo.BitmapText({
      id: 'best',
      glyphs: properties.numberGlyphs,
      scaleX: 0.5,
      scaleY: 0.5,
      letterSpacing: 4,
      text: 0,
    }))

    //白色的遮罩效果
    var whiteMask = (this.whiteMask = new Hilo.View({
      id: 'mask',
      width: this.width,
      height: this.height,
      alpha: 0,
    }).setBgFill('#fff'))

    //设置各个元素的坐标位置
    board.x = (this.width - board.width) >> 1
    board.y = (this.height - board.height) >> 1
    gameover.x = (this.width - gameover.width) >> 1
    gameover.y = board.y - gameover.height - 20
    startBtn.x = board.x - 5
    startBtn.y = (board.y + board.height + 20) >> 0
    gradeBtn.x = (startBtn.x + startBtn.width + 20) >> 0
    gradeBtn.y = startBtn.y
    scoreLabel.x = (board.x + board.width - 140) >> 0
    scoreLabel.y = board.y + 90
    bestLabel.x = scoreLabel.x
    bestLabel.y = scoreLabel.y + 105

    this.addChild(
      gameover,
      board,
      startBtn,
      gradeBtn,
      scoreLabel,
      bestLabel,
      whiteMask
    )
  },
}))
```

结束场景显示的时候，不仅需要显示玩家的得分，出现的时候还是带动画效果显示出来的。这里，我们可以使用之前介绍过的 Tween 缓动变化类来实现这个过场动画。

```js
show: function(score, bestScore){
    this.scoreLabel.setText(score);
    this.bestLabel.setText(bestScore);
    this.whiteMask.alpha = 1.0;

    Hilo.Tween.from(this.gameover, {alpha:0}, {duration:100});
    Hilo.Tween.from(this.board, {alpha:0, y:this.board.y+150}, {duration:200, delay:200});
    Hilo.Tween.from(this.scoreLabel, {alpha:0, y:this.scoreLabel.y+150}, {duration:200, delay:200});
    Hilo.Tween.from(this.bestLabel, {alpha:0, y:this.bestLabel.y+150}, {duration:200, delay:200});
    Hilo.Tween.from(this.startBtn, {alpha:0}, {duration:100, delay:600});
    Hilo.Tween.from(this.gradeBtn, {alpha:0}, {duration:100, delay:600});
    Hilo.Tween.to(this.whiteMask, {alpha:0}, {duration:400});
}
```

在游戏主文件 game.js 中，实例化 OverScene 并添加到舞台 stage 上，但结束场景只有游戏结束才显示，因此我们设置其 visible 默认为 false。

```js
this.gameOverScene = new game.OverScene({
  width: this.width,
  height: this.height,
  image: this.asset.over,
  numberGlyphs: this.asset.numberGlyphs,
  visible: false,
}).addTo(this.stage)
```

当点击开始游戏按钮后，游戏会重新回到准备场景。因此，我们需要为它绑定事件监听。而我们不准备显示玩家的等级排行，所以等级按钮无需绑定事件。

```js
this.gameOverScene.getChildById('start').on(
  Hilo.event.POINTER_START,
  function(e) {
    //阻止舞台stage响应后续事件
    e.stopImmediatePropagation()
    this.gameOverScene.visible = false
  }.bind(this)
)
```

### 创建小鸟

小鸟是游戏的主角，跟其他的对象不同的是，小鸟会扇动翅膀飞行。因此我们用精灵动画类 Sprite 来创建小鸟。这里我们实现一个 Bird 类，继承自 Sprite。

```js
var Bird = (ns.Bird = Hilo.Class.create({
  Extends: Hilo.Sprite,
  constructor: function(properties) {
    Bird.superclass.constructor.call(this, properties)

    //添加小鸟精灵动画帧
    this.addFrame(properties.atlas.getSprite('bird'))
    //设置小鸟扇动翅膀的频率
    this.interval = 6
    //设置小鸟的中心点位置
    this.pivotX = 43
    this.pivotY = 30
  },
}))
```

小鸟的精灵动画帧可由参数传入的精灵纹理集 atlas 获得。由于小鸟飞行时，身体会向上仰起，也就是会以身体中心点旋转。因此，我们需要设置小鸟的中心点位置 pivotX 和 pivotY，而小鸟的宽度和高度分别为 86 和 60，故 pivotX 和 pivotY 即为 43 和 30。

我们发现，在游戏中小鸟一共有以下三个状态：

- 准备状态 - 此时小鸟没有飞行，只是轻微的上下漂浮着。
- 开始飞行 - 每次玩家点击画面时，小鸟就会往上飞一段距离然后下坠。
- 飞行过程 - 在整个飞行过程中，我们需要控制小鸟的姿态和 y 轴坐标（x 轴是不变的）。

我们先定义准备状态的 getReady 方法：

```js
getReady: function(){
    //恢复小鸟飞行角度为平行向前
    this.rotation = 0;
    //减慢小鸟精灵动画速率
    this.interval = 6;
    //恢复小鸟精灵动画
    this.play();

    //小鸟上下漂浮的动画
    this.tween = Hilo.Tween.to(this, {y:this.y + 10, rotation:-8}, {duration:400, reverse:true, loop:true});
}
```

当玩家点击屏幕后，小鸟开始往上飞行，我们定义 startFly 方法：

```js
startFly: function(){
    //恢复小鸟状态
    this.isDead = false;
    //减小小鸟精灵动画间隔，加速小鸟扇动翅膀的频率
    this.interval = 3;
    //记录往上飞的起始y轴坐标
    this.flyStartY = this.y;
    //记录飞行开始的时间
    this.flyStartTime = +new Date();
    //停止之前的缓动动画
    if(this.tween) this.tween.stop();
}
```

在这里，我们只需要设置小鸟飞行的初始状态，而具体的飞行状态控制则由 doFly 方法来实现。

小鸟开始飞行后，我们需要一个方法来精确控制小鸟每时每刻的飞行的路径坐标，直至其落地死亡。这也是此游戏中最关键的地方之一。

我们要在每次游戏画面更新渲染小鸟的时候调用此方法来确定当前时刻小鸟的坐标位置。Hilo 的可视对象 View 提供了一个 onUpdate 方法属性，此方法会在可视对象每次渲染之前调用，于是，我们需要实现小鸟的 onUpdate 方法。

每次点击屏幕小鸟会往上飞，这是高中物理中典型的竖直上抛运动。我们发现，小鸟每次都是往上飞行一个固定的高度 flyHeight 后再下坠的。 根据我们以前所学的物理公式：初速度 2 = 2 \* 距离 \* 加速度，我们可以计算出小鸟往上飞的初速度：

```js
this.flyHeight = 80
this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity)
```

在这个公式里，flyHeight 已确定，现在要确定加速度 gravity。为简化计算，我们取重力加速 g 为 10m/s2。而在我们游戏里的时间单位是毫秒，我们需要把加速度转换为毫秒，即 10/1000，但实际游戏中并不需要那么大的加速度，比如取一半。因此我们的加速度设定为：

```js
this.gravity = (10 / 1000) * 0.3
```

有了初速度，我们就可以根据物理公式：位移 = 初速度 \* 时间 - 0.5 \* 加速度 \* 时间 2，计算出任一时刻 time 小鸟移动的距离：

```js
var distance = this.initVelocity * time - 0.5 * this.gravity * time * time
```

进而，我们就可以计算出小鸟在任一时刻所在的 y 轴位置：

```js
var y = this.flyStartY - distance
```

这样，飞行过程的方法 onUpdate 就容易实现了：

```js
onUpdate: function(){
    if(this.isDead) return;

    //飞行时间
    var time = (+new Date()) - this.flyStartTime;
    //飞行距离
    var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
    //y轴坐标
    var y = this.flyStart - distance;

    if(y <= this.groundY){
        //小鸟未落地
        this.y = y;
        if(distance > 0 && !this.isUp){
            //往上飞时，角度上仰20度
            this.tween = Hilo.Tween.to(this, {rotation:-20}, {duration:200});
            this.isUp = true;
        }else if(distance < 0 && this.isUp){
            //往下跌落时，角度往下90度
            this.tween = Hilo.Tween.to(this, {rotation:90}, {duration:this.groundY - this.y});
            this.isUp = false;
        }
    }else{
        //小鸟已经落地，即死亡
        this.y = this.groundY;
        this.isDead = true;
    }
}
```

其中，当小鸟往上飞的时候，有一个抬头往上仰的动作；而往下跌落的时候，则是会头部往下栽。我们使用 2 个缓动变换 tween 来分别实现。

### 创建障碍

障碍是游戏中另一个非常重要的角色。整个障碍是由许多成对的上下管子组成。因此我们用容器类来创建障碍类，它可以装下许多管子。这里我们实现一个 Holdbacks 类，继承自 Container。

```js
var Holdbacks = (ns.Holdbacks = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor: function(properties) {
    Holdbacks.superclass.constructor.call(this, properties)
    this.init(properties)
  },
}))
```

然后，我们准备构造这些障碍管子。一个事实是，这些管子是不间断的从右到左移动的，这些管子之间的水平距离是固定的，样式也是不变的。如果我们能重复利用这些管子，那么我们可以节省很多内存。这样，我们先初始化一些常量：

```js
//管子之间的水平间隔
this.hoseSpacingX = 300
//管子上下两部分之间的垂直间隔，即小鸟要穿越的空间大小
this.hoseSpacingY = 240
//管子的总数（一根管子分上下两部分）
this.numHoses = 4
//预设移出屏幕左侧的管子数量，一般设置为管子总数的一半
this.numOffscreenHoses = this.numHoses * 0.5
//管子的宽度（包括管子之间的间隔）
this.hoseWidth = 148 + this.hoseSpacingX

//初始化障碍的宽和高
this.width = this.hoseWidth * this.numHoses
this.height = properties.height
```

下面，我们创建所有的管子，包括用来缓存的。其中每根管子包括上下两部分，而每根管子都是静态图片，因此我们使用 Bitmap 类来创建管子。

```js
createHoses: function(image){
    for(var i = 0; i < this.numHoses; i++){
        //下部分管子
        var downHose = new Hilo.Bitmap({
            image: image,
            rect: [0, 0, 148, 820]
        }).addTo(this);

        //上部分管子
        var upHose = new Hilo.Bitmap({
            image: image,
            rect: [148, 0, 148, 820]
        }).addTo(this);

        this.placeHose(downHose, upHose, i);
    }
}
```

创建好管子后，我们需要放置在适当的位置上，从而产生随机可穿越的管子障碍。我们先来看管子的下半部分，如果我们能确定它在 y 轴上的最大值和最小值，那么就可以在此之间选择一个随机值。当下半部分管子的位置确定后，由于管子上下两部分的间隔 hoseSpacingY 是固定的。这样就很容易确定上部分管子的位置了。

由于下半部分管子的顶端不能没入地面之下，且不能离地面太近，因此很容易计算出其 y 轴的最大值为：

```js
var downMaxY = this.groundY - 180
```

同样下半部分管子的底端也不能脱离地面，且要预留间隔 hoseSpacingY 的高度，因此其 y 轴的最小值为：

```js
var downMinY = this.groundY - down.height + this.hoseSpacingY
```

在最大值和最小值之间随机选择一个位置：

```js
downHose.y = (downMinY + (downMaxY - downMinY) * Math.random()) >> 0
```

下半部分管子位置确定后，上半部分就好办了。完整的 placeHose 方法：

```js
placeHose: function(down, up, index){
    //y轴最大值
    var downMaxY = this.groundY - 180;
    //y轴最小值
    var downMinY = this.groundY - down.height + this.hoseSpacingY;
    //随机位置
    down.y = downMinY + (downMaxY - downMinY) * Math.random() >> 0;
    down.x = this.hoseWidth * index;

    //上部分管子位置
    up.y = down.y - this.hoseSpacingY - up.height;
    up.x = down.x;
}
```

障碍创建完成后，它最核心的状态就是从右至左不断的移动，管子也不断的产生。我们先初始化一个移动的缓动 moveTween，当缓动结束后，就会调用 resetHoses 方法来重新排序所有的管子，从而达到重复利用管子的目的。

```js
this.moveTween = new Hilo.Tween(this, null, {
  onComplete: this.resetHoses.bind(this),
})
```

resetHoses 方法要实现的就是，每当有 numOffscreenHoses 数量的管子移出屏幕左侧的时候，我们就把这些管子移动到管子队列的最右边，这样我们就可以利用移出的管子，不用重复创建新的管子。

```js
resetHoses: function(){
    var total = this.numChildren;

    //把已移出屏幕外的管子放到队列最后面，并重置它们的可穿越位置
    for(var i = 0; i < this.numOffscreenHoses; i++){
        var downHose = this.getChildAt(0);
        var upHose = this.getChildAt(1);
        this.setChildIndex(downHose, total - 1);
        this.setChildIndex(upHose, total - 1);
        this.placeHose(downHose, upHose, this.numOffscreenHoses + i);
    }

    //重新确定队列中所有管子的x轴坐标
    for(var i = 0; i < total - this.numOffscreenHoses * 2; i++){
        var hose = this.getChildAt(i);
        hose.x = this.hoseWidth * (i * 0.5 >> 0);
    }

    //重新确定障碍的x轴坐标
    this.x = 0;

    //更新穿过的管子数量
    this.passThrough += this.numOffscreenHoses;

    //继续移动
    this.startMove();
}
```

这样，移动障碍也就是重复不断的向左移出 `numOffscreenHoses` 数量的管子。

```js
startMove: function(){
    //设置缓动的x轴坐标
    var targetX = -this.hoseWidth * this.numOffscreenHoses;
    //设置缓动时间
    this.moveTween.time = (this.x - targetX) * 4;
    //设置缓动的变换属性，即x从当前坐标变换到targetX
    this.moveTween.setProps({x:this.x}, {x:targetX});
    //启动缓动变换
    this.moveTween.start();
}
```

停止移动障碍就只需停止缓动即可。

```js
stopMove: function(){
    if(this.moveTween) this.moveTween.pause();
}
```

### 碰撞检测和得分

当小鸟飞行穿越障碍的时候，我们需要检测小鸟与障碍是否发生了碰撞。这个可以利用 Hilo 内置的 `View.hitTestObject` 方法来检测。我们在障碍 Holdbacks 类中定义 checkCollision 方法，它可以循环检测小鸟是否与某一管子发生碰撞。

```js
checkCollision: function(bird){
    for(var i = 0, len = this.children.length; i < len; i++){
        if(bird.hitTestObject(this.children[i], true)){
            return true;
        }
    }
    return false;
}
```

得分，也就是计算出小鸟飞越的管子的数量。我们定义 calcPassThrough 方法，它传入一个参数 x（小鸟的坐标），根据障碍的宽度和已穿越的管子的数量，我们就可以统计出总的数量。

```js
calcPassThrough: function(x){
    var count = 0;

    x = -this.x + x;
    if(x > 0){
        var num = x / this.hoseWidth + 0.5 >> 0;
        count += num;
    }
    count += this.passThrough;

    return count;
}
```

然后，在 game.js 中计算得分：

```js
calcScore: function(){
    var count = this.holdbacks.calcPassThrough(this.bird.x);
    return this.score = count;
}
```

### 监控游戏过程

在游戏过程中，我们要时刻检测小鸟是否与障碍发生碰撞或飞越成功，是否已经落地，并判断游戏是否结束等。跟小鸟飞行过程类似，我们可以定义舞台的 onUpdate 方法来实现：

```js
onUpdate: function(){
    if(this.state === 'ready') return;

    if(this.bird.isDead){
        //如果小鸟死亡，则游戏结束
        this.gameOver();
    }else{
        //更新玩家得分
        this.currentScore.setText(this.calcScore());
        //碰撞检测
        if(this.holdbacks.checkCollision(this.bird)){
            this.gameOver();
        }
    }
}
```

### 场景切换

准备、游戏和结束三个场景的切换方法：

```js
gameReady: function(){
    this.state = 'ready';
    //重置分数为0
    this.score = 0;
    this.currentScore.visible = true;
    this.currentScore.setText(this.score);
    //显示准备场景
    this.gameReadyScene.visible = true;
    //重置障碍的位置
    this.holdbacks.reset();
    //准备小鸟
    this.bird.getReady();
},

gameStart: function(){
    this.state = 'playing';
    //隐藏准备场景
    this.gameReadyScene.visible = false;
    //开始从右至左移动障碍
    this.holdbacks.startMove();
},

gameOver: function(){
    if(this.state !== 'over'){
        //设置当前状态为结束over
        this.state = 'over';
        //停止障碍的移动
        this.holdbacks.stopMove();
        //小鸟跳转到第一帧并暂停，即停止扇动翅膀
        this.bird.goto(0, true);
        //隐藏屏幕中间显示的分数
        this.currentScore.visible = false;
        //显示结束场景
        this.gameOverScene.show(this.calcScore(), this.saveBestScore());
    }
}
```

### 玩家交互

在此游戏中，玩家只有一种交互方式，在 PC 端是点击鼠标，在移动端则是触碰屏幕。因此，首先我们需要让舞台 stage 能接受 mousedown 或 touchstart 事件：

```js
this.stage.enableDOMEvent(Hilo.event.POINTER_START, true)
```

Hilo 统一了事件的开始、移动和结束三个事件的映射名称，方便自动适配不同平台：

- `Hilo.event.POINTER_START` - mousedown/touchstart
- `Hilo.event.POINTER_MOVE` - mousemove/touchmove
- `Hilo.event.POINTER_END` - mouseup/touchend

然后，监听舞台的 POINTER_START 事件：

```js
this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this))
```

为了让 PC 玩家可以使用键盘空格键操作，我们增加如下兼容代码：

```js
document.addEventListener(
  'keydown',
  function(e) {
    if (e.keyCode === 32) this.onUserInput(e)
  }.bind(this)
)
```

事件监听器 onUserInput 的实现也简单，当游戏不在结束状态时，启动游戏，并控制小鸟往上飞。

```js
onUserInput: function(e){
    if(this.state !== 'over'){
        //启动游戏场景
        if(this.state !== 'playing') this.gameStart();
        //控制小鸟往上飞
        this.bird.startFly();
    }
}
```

### 小结

至此，整个 Flappy Bird 游戏所有的功能就基本开发完成了。我们用到了 Hilo 的大部分功能：

- 加载队列 - 用 LoadQueue 预加载图片等资源。
- 可视对象 - 用 View、Bitmap、Sprite、Container 等创建和管理各种游戏对象。
- 舞台 - 所有游戏对象都需要加入到舞台才能显示出来。
- 缓动动画 - 用 Tween 来创建各种缓动动画。
- 碰撞检测 - 用 View.hitTestObject 检测可视对象的是否发生碰撞。
- 更新对象 - 用 View.onUpdate 更新对象各种属性和状态。
- 事件交互 - 用 View.on 监听事件。
