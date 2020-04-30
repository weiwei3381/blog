# 无人机仿真平台算法

## 无人机发现率计算

### 想法需求

查看雷达原理之后的想法:

1. 需要防御的区域内有较多数量的分散的重点目标位置需要覆盖；
2. 警戒雷达数量一定，均匀分布时能够覆盖整个空域，但需要进一步优化布置位置；

那么, 对于**每个真目标**而言, 需要达到下面的效果:

1. 不能被雷达覆盖范围遗漏
2. 尽量距离雷达近
3. 尽量不被不同雷达重复覆盖（不相互干扰）
4. 对于雷达探测或发现概率，往往和$e$的指数函数有关，一般很少直接等效成与距离成反比，也不直接相加。

:::warning 注意
由于**对于每个雷达而言，尽量覆盖较少目标**的要求与真目标的要求是有一定的冲突, 所以这里优先满足真目标要求.
:::

### 实际做法

考虑真目标的几个要求, 这里定义总暴露值`exposeNum`, 对于每个目标按如下方式进行处理:

1. 如果目标没有雷达覆盖, 则返回惩罚项, `exposeNum=100`
2. 目标仅被单个雷达覆盖, 则暴露值$N_e$计算公式为$N_e=e^{a(\frac{x}{r}-1)}$, 其中$a$为**暴露系数**, $x$为目标距雷达范围, $r$为雷达有效半径. 当真目标在雷达范围边缘, 即$x=r$时, $N_e=1$.
3. 当目标被多个雷达覆盖, 考虑到真目标要求 3: _尽量不被不同雷达重复覆盖（不相互干扰）_, 那这样进行处理:
   - 首先找到最近的雷达, 获得距离值$d_1$,
   - 找到除最近的雷达以外的所有雷达, 例如第二近的雷达到目标距离为$d_2$, 计算外推距离$N_p=b(r-d_2)$, 其中$b$为**外推系数**
   - 将所有外推距离$N_p$加到$d_1$上, 得到一个更大的距离值, 将这个值进行暴露距离的计算.

此时, 在`deploy/flock.js`中创建 `evaluateExposeIndex()`函数, 实现如下:

```js
this.evaluateExposeIndex = (solution) => {
  // 计算单个雷达对目标的隐藏率
  const _calcSoloExposeIndex = (dis, inter_range) => {
    const exposeLevel = 1 // 暴露率参数
    return Math.E ** (exposeLevel * (dis / inter_range - 1))
  }
  // 计算雷达群对目标的隐藏率
  const _getExposeIndex = (dis_list, interRange) => {
    // 获得所有在雷达有效范围的距离, 求得有效雷达数量
    const inRangeDis = dis_list.filter((dis) => dis < interRange)
    const radarNum = inRangeDis.length
    // 如果没有雷达, 则暴露值为0
    if (radarNum === 0) {
      return 100
    } else if (radarNum === 1) {
      // 如果只有一个雷达, 则直接计算
      return _calcSoloExposeIndex(inRangeDis[0], interRange)
    } else if (radarNum > 1) {
      // 如果不止一个雷达, 则找到最近的距离,再进行处理
      inRangeDis.sort((a, b) => a - b)
      // 找到最近的距离
      let nearestRadar = inRangeDis[0]
      inRangeDis.forEach((dis, index) => {
        if (index !== 0) {
          nearestRadar += interRange - dis
        }
      })
      return _calcSoloExposeIndex(nearestRadar, interRange)
    }
  }

  let ExposeNum = 0 // 总暴露值
  let len = solution.length
  // 干扰器个数
  let inter_num = Math.floor(len / 2)
  // 干扰器范围
  let interRange = document.getElementById('inter_range').value - 0
  // 所有干扰器的列表
  let interList = []
  for (let i = 0; i < inter_num; i++) {
    let inter = new Vector(solution[2 * i], solution[2 * i + 1])
    interList.push(inter)
  }

  for (let target of this.target_list) {
    // 获得目标到干扰物的最近距离
    let target_pos = target.pos
    // 获得每个干扰物到目标的距离
    let disList = interList.map((x) => x.euc2d(target_pos))
    // 将单个目标被发现的系数累加到总系数中
    ExposeNum += _getExposeIndex(disList, interRange)
  }
  return ExposeNum
}
```

实现的效果如下所示:

![无人机部署实现效果1](https://s1.ax1x.com/2020/04/30/Jbk7dJ.png)
