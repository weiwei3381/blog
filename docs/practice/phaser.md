# 使用phaser开发战旗游戏

## Demo需求

- 六角格地图
- 舰船在地图中进行移动，点击可以选中舰船，弹出操作面板
- 舰船可以移动、攻击
- 带有小地图
- 红蓝双方分步移动，具有战场迷雾

## 预先研究

### 六角格绘制

> 相关资料可以查询[网格思想(英文版)](http://www-cs-students.stanford.edu/~amitp/game-programming/grids/)、[六边形网格(英文版)](https://www.redblobgames.com/grids/hexagons/)、[六边形网格（中文翻译）](https://blog.csdn.net/boshuzhang/article/details/78059977)、[正六边形网格化(Hexagonal Grids)原理与实现](https://www.cnblogs.com/DHUtoBUAA/p/7192315.html)。

网格既可以用四边形，也可以用六边形，相比较而言，六角格提供的距离失真小于正方形网格，部分是因为每个六边形具有比正方形更多的非对角邻居。

六边形相比四边形，难点在于：（1）平面使用六角格划分更加复杂。由于六角格有六个边，内角为120度，划分麻烦；（2）每个网格的位置确定困难。六角格划分平面时可以使用两种划分方法，分别是使用上下平、左右平的网格进行划分，每种划分又有两种不同的坐标确定方式，如下图所示。

![两种六角格定位方法](https://img.imgdb.cn/item/60044d3c3ffa7d37b3ada368.jpg)

比较好的办法是采用“x-y-z”定位方式，即把六角格看成是三维坐标系中的格子，这样每个格子有唯一确定的坐标点。

![x-y-z定位](https://img.imgdb.cn/item/60044da83ffa7d37b3adda39.jpg)

### 小地图设置

phaser3中提供了垂直视角的游戏示例[thrust](http://phaser.io/examples/v3/view/physics/matterjs/thrust)以及带有小地图的游戏样式[minimap-camera](http://phaser.io/examples/v3/view/camera/minimap-camera)。

![垂直视角](https://img.imgdb.cn/item/6004525b3ffa7d37b3b060cb.jpg)

![小地图](https://img.imgdb.cn/item/6004522b3ffa7d37b3b04331.jpg)

### 舰船素材

素材可以到[爱给网-舰船游戏素材](https://www.aigei.com/view/73164.html)进行下载，已经下载的游戏素材照片有下面这些。

![游戏素材](https://img.imgdb.cn/item/600450b33ffa7d37b3af6f0b.jpg)