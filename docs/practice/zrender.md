# ZRender 源码解析

> 无人机搜索项目打算使用百度 ECharts 团队开源的渲染框架[Zrender](https://ecomfe.github.io/zrender-doc/public/)，本着先从简单开始，找到的是 2013 年 zrender 的源码进行解析，注释都是中文，相对来说代码量少一些，方便阅读。

## 渲染流程

### 1.调用`animation.start()`方法

因为只有动画才会导致图形更新，因此更新方法在初始化动画中进行定义，`Zrender`类在构造函数中会调用`initAnimate()`方法，在`initAnimate()`方法内部, 会创建有动画变动的形状集合, 然后实例化`Animation`类，并调用它的`start()`方法。

```js
    // 动画控制
    initAnimate() {
        // 需要变动的形状集合, 不变动的形状则不进行更新
        this.animatingShapes = [];
        // stage是绘制类, 需要提供update接口
        this.animation = new Animation({
            stage: {
                // 必须使用箭头函数, 否则this绑定会出错
                update: () => {
                    this.update(this.animatingShapes);
                }
            }
        });
        this.animation.start();
    }
```

### 2.启动动画更新函数

`Animation`类的`start()`函数定义如下. 调用`start()`函数之后, 会进入, 主要是运行内部的`step()`函数, 最后一行`requrestAnimationFrame(step)`主要是为了启动, 在`requrestAnimationFrame`方法内部, 会再次调用`step()`方法, 达到不断运行`step()`的目的. 而在`step`中, **最重要的是调用了`update()`函数**.

```js
start: function () {
        const self = this;
        // 开始运行设置为true, 修改animation的_running可以停止
        this._running = true;
        // 下述方法只能保证每一帧运行完之后,间隔1000/60毫秒执行下一次,
        // 但是由于运行update()也需要时间, 所以并不能保证最后结果是60帧
        function step() {
            if (self._running) {
                self.update();
                requrestAnimationFrame(step);
            }
        }

        requrestAnimationFrame(step);
    }
```

`requrestAnimationFrame`函数定义

```js
// 需传入回调函数,保证每隔1000/60ms执行一次回调函数
const requrestAnimationFrame =
  window.requrestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60)
  }
```

### 3.每次动画更新函数

每次调用动画更新函数`Animation.update()`, 代码如下.由于有些动画是靠插值进行, 所以用了很多控制器进行控制, 但是最重要的更新代码还是中间的`stage.update()`方法, 该方法才是进行视图的更新, `stage.update()`方法是初始化`Animation`时传入的.

```js
// 动画更新函数, 每隔16ms运行一次
    update: function () {
        // 记录开始时间
        const time = new Date().getTime();
        // 控制池
        const cp = this._controllerPool;
        // 控制池大小
        let len = cp.length;
        // 设置插值的位置的大小
        const deferredEvents = [];
        const deferredCtls = [];
        for (let i = 0; i < len; i++) {
            const controller = cp[i];
            // 根据当前时间获得控制器
            const e = controller.step(time);
            // 需要在stage.update之后调用的事件，例如destroy
            if (e) {
                deferredEvents.push(e);
                deferredCtls.push(controller);
            }
        }
        // 调用stage的update方法
        if (this.stage && this.stage.update && this._controllerPool.length
        ) {
            this.stage.update();
        }
        // 删除动画完成的控制器
        const newArray = [];
        for (let i = 0; i < len; i++) {
            if (!cp[i]._needsRemove) {
                newArray.push(cp[i]);
                cp[i]._needsRemove = false;
            }
        }
        this._controllerPool = newArray;

        len = deferredEvents.length;
        for (var i = 0; i < len; i++) {
            deferredCtls[i].fire(deferredEvents[i]);
        }
        // 每次动画运行完的回调
        this.onframe();
    }
```

调用`stage.update()`方法时, 各个形状的属性已经被改变了, 像位置/方向/大小/颜色等, 然后调用的是`painter`实例中的`update()`方法进行绘图, 这个方法很简短:

```js
/**
 * 视图更新
 * @param {Array} shapeList 需要更新的图形元素列表,
 *                          不进入这个list的元素则不进行更新
 * @param {Function} callback  视图更新后回调函数
 */
function update(shapeList, callback) {
  var shape
  for (var i = 0, l = shapeList.length; i < l; i++) {
    shape = shapeList[i]
    storage.mod(shape.id, shape)
  }
  refresh(callback)
  return self
}
```

## 动画流程

在`src/index.js`文件中, `zrender`实例链式调用了`when`,`done`和`start`等一系列方法, 代码如下:

```js
zr.animate(uav.id, '')
  .when(1000, {
    position: [200, 0],
  })
  .when(
    2000,
    {
      position: [200, 200],
    },
    'BounceIn'
  )
  .when(3000, {
    position: [0, 200],
  })
  .when(4000, {
    position: [100, 100],
  })
  .done(function() {
    zr.animate(uav.id)
      .when(2000, {
        rotation: [Math.PI * 2, 0, 0],
      })
      .start()
  })
  .start()
```

下面详细分析一下这段代码内部的工作原理.

### zrender 实例的`.animate`方法

zrender 实例的.animate()方法实现很长, 源码如下所示, 输入参数有 3 个, `shapeId`必填, 代表形状的 id 值, 用于获取形状, 后面的`path`参数主要表示动画改变的属性地址, 例如该变动的是 `shape.style`(例如让他变大), 那么这里就填写`'style'`. 源码首先获取改变属性的对象`target`, 涉及到判断`path`是否存在来获取`shape`对应的属性. 找到`target`对象之后, 初始化对应形状的动画数量属性`__aniCount`, 将`shape.__aniCount`置为 0, 并将其加入到`zr.animatingShapes`中, 表明这个形状需要动画(不需要动画后期不更新, 以提升效率).

```js
animate(shapeId, path, loop) {
        // 获取形状
        const shape = this.storage.get(shapeId);
        if (shape) {
            // 要变更的目标,默认是shape, path存在则给其他属性
            let target = undefined;
            if (path) {
                const pathSplitted = path.split('.');
                let prop = shape;
                for (let i = 0, l = pathSplitted.length; i < l; i++) {
                    if (!prop) {
                        continue;
                    }
                    prop = prop[pathSplitted[i]];
                }
                if (prop) {
                    target = prop;
                }
            } else {
                target = shape;
            }
            if (!target) {
                logger.log(`Property ${path} is not existed in shape ${shapeId}`);//
                return;
            }
            // 动态给图形增加__aniCount的属性, 表示动画数
            if (typeof (shape.__aniCount) === 'undefined') {
                // 正在进行的动画记数
                shape.__aniCount = 0;
            }
            // 动画数为0则证明是刚开始, 则可以加入到需要变动的形状集合
            if (shape.__aniCount === 0) {
                this.animatingShapes.push(shape);
            }
            // 动画数加1
            shape.__aniCount++;
            // target是图形, loop是是否循环
            return this.animation.animate(target, loop)
                .done(()=> {
                    shape.__aniCount--;
                    if (shape.__aniCount === 0) {
                        // 从animatingShapes里移除
                        const idx = util.indexOf(this.animatingShapes, shape);
                        this.animatingShapes.splice(idx, 1);
                    }
                });
        } else {
            logger.log(`Shape ${shapeId} not existed`);
        }
    };
```

重点在于这个函数的返回值, 返回的是一个动画类`Animate`的`.animate()`返回值,生成的是一个`Deferred`对象, `Deferred`拥有整个 animate 实例, 因此可以利用`animate`控制`controller`, 具体函数实现如下:

```js
animate: function (target, loop, getter, setter) {
        // 新生成一个deferred类, 只需要传变动的目标即可.
        var deferred = new Deferred(target, loop, getter, setter);
        deferred.animation = this;
        return deferred;
    }
```

在返回的`deferred`实例的基础上, 又增加了`done()`方法, 传入了回调函数(这个回调函数是在动画销毁的时候进行调用的, 目的是把形状从`animatingShapes`中去掉, 不再进行更新渲染), 返回值依然是`defered`对象.

### 使用`when()`方法提供关键帧

下面用户就可以对`deferred`增加动画了, 这里`zrender`主要是采用关键帧绘制动画, 也就是用户只需要告诉元素在关键的那一秒需要出现在哪个位置, 那么`zrender`会自动将中间的部分进行补帧, 把中间需要的帧数给补齐, 这个提供关键帧的方法就是`when()`, 源码如下

```js
    // 使用when方法设置帧
    when: function (time /* ms */, props, easing) {
        for (var propName in props) {
            // 判断在_tracks中是否存在, 如果不存在, 先记录初始状态
            if (!this._tracks[propName]) {
                this._tracks[propName] = [];
                // 初始状态, 并没有easing(缓动)属性
                this._tracks[propName].push({
                    time: 0,
                    value: this._getter(this._target, propName)
                });
            }
            // 增加关键帧情况
            this._tracks[propName].push({
                time: time,
                value: props[propName],
                easing: easing
            });
        }
        return this;
    }
```

提供关键帧后, zrender 会在对应`Deferred`(Deferred 跟目标对象相对应, 一个目标对应一个`Deferred`)的`_tracks`属性中增加关键帧的时间, 需要达到的值和缓动函数, 从源码来看, `this._tracks[0]`表示的是 0 时刻的初始状态.

### `start()`方法运行关键帧

通过调用`deferred.start()`方法运行关键帧, 实现很简单, 就是根据`_track`中的信息, 在`deferred._controllerList`新增每个控制器, 每个控制器用来控制`_track`相邻两部分转换的状态, 所有的控制器都加到`animation`实例中, 由 `animation` 统一管理.

```js
start: function () {
        var self = this;
        var delay;
        var track;
        var trackMaxTime;

        for (var propName in this._tracks) {
            delay = 0;
            track = this._tracks[propName];
            // 获得的track是数组, 所以需要判断数组情况
            if (track.length) {
                // 获得最大时间, 不过这里只考虑用户按时间大小插入, 不考虑非线性情况
                trackMaxTime = track[track.length - 1].time;
            } else {
                continue;
            }
            for (var i = 0; i < track.length - 1; i++) {
                var now = track[i],
                    next = track[i + 1];

                var controller = new Controller({
                    target: self._target,
                    life: next.time - now.time,
                    delay: delay,
                    loop: self._loop,
                    // gap是循环的间隔时间,也就是loop如果为真的话,这一段下次多久开始
                    // 用整个这段时间 - 这个控制器用时, 就是等待时间
                    gap: trackMaxTime - (next.time - now.time),
                    easing: next.easing,
                    onframe: createOnframe(now, next, propName),
                    ondestroy: ondestroy
                });
                this._controllerList.push(controller);

                this._controllerCount++;
                delay = next.time;

                self.animation.add(controller);
            }
        }
        return this;
    }
```

加入 `animation` 实例的`controller`会被加入到控制器池`animation._controllerPool`中, 然后在 `animation` 的每次更新中, 根据用时来判断当前到那个程度 schedule, 然后发送`onframe`事件, 调用`controller`构造函数时传入的`onframe`函数进行处理.

## 无人机项目设计

参考 zrender 项目, 按照 mvc 框架分为 3 块, 分别是:

1. model 模型类,用来存储无人机和其他对象的相关数据,
2. view 视图类, 用来绘制无人机和其他环境对象
3. controller 控制类, 用来控制无人机策略

数据流向是 controller → model → view

### 项目结构设计

1. **/model**: 模型(model)类, 存放实体类文件
   1. `UAV.js`: 定义无人机的类, 包括旋翼无人机和固定翼无人机两类, 主要属性有 position(当前位置), angel(当前朝向), v(速度大小), 通过当前朝向和速度大小可以将速度分解为水平和垂直 2 个方向, 得到速度向量, 绘制时调用常用形状中的某个.内部有个`_forceList`, 每次更新时会把所有力加起来一并进行计算
   2. `Cell.js`: 单元格类, 每个搜索格的属性
   3. `Target.js`: 目标类, 搜索/打击的目标, 主要属性有: 目标价值, 移动速度, 初始移动方向, 是否随机改变速度,
   4. `Threat.js`: 威胁类, 包括障碍物, 反无人机雷达等, 主要属性有: 位置, 威胁范围
2. **/storage**: 存储类
   1. `flock.js`: 无人机群, 存储所有的无人机实例
   2. `Grid.js`: 区域类, 内部有个`_cellPool`属性, 用来放置每个网格, 每个网格有自己的默认属性(网格的颜色, 对角坐标, 网格初始参数), 也可以传入用户参数, 绘制时使用
   3. `influence.js`: 影响因素类, 存放所有实例化后的目标/威胁.
3. **/shape**: 存放常用形状
   1. `base.js`: 形状基类
   2. 其他形状类, 主要有矩形\三角形\多边形\五角星\椭圆形
4. **/handler**: 控制器(controller)类, 设置各种无人机相互之间, 和环境之间交互方法,
   1. `strategy.js`: 设置无人机的各类策略, 传入环境参数, 判断无人机下一个要去的地点
   2. `interaction.js`: 交互类, 威胁和其他无人机对当前无人机的影响, 增加力到`_forceList`中去, 更新网格/威胁/目标的各类情况, 这里主要修改`flock`和`environment`实例, 修改后的对象 id 都放到一个 list 中, `Painter.js`根据这修改后的对象内容再进行渲染
5. **/view**: 视图(view)类, 主要放初始化和绘制 canvas 类
   1. `Painter.js`: 绘制类
   2. `canvasManager`: canvas 管理类
6. **/calc**: 算法类
   1. `PSO.js`: 标准粒子群算法
   2. `CLPSO.js`: CLPSO 算法
   3. `BBO.js`: 生物地理学算法
7. **/util**: 工具类目录
   1. `logger.js`: 日志文件
   2. `vector.js`: 二维向量工具类
   3. `color.js`: 颜色辅助类
   4. `area.js`: 图形空间辅助类
   5. `math.js`: 数学计算辅助类
   6. `matrix.js`: 矩阵计算类
   7. `tool.js`: js 常用工具
8. **/event**: 事件相关目录
   1. `help.js`: 事件工具类
   2. `Dispatcher`: 事件分发类
9. /: 根目录
10. `simulation.js`: 仿真类, 主类, 提供 Simulation 类, 并实例化 simulation. 包含`emulate()`函数, 表示开始仿真, 内部有`flock`实例, `environment`实例, `Painter`实例和`interaction`实例
11. `config.js`: 配置项, (1) 无人机的各类配置, 有最大速度, 最小速度, 最大加速度, 最大转弯速度等.(2)网格配置: 网格尺寸.(3)支持的事件类型
