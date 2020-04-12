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
