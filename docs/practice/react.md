# React + AntD 实战后台管理

## React Router

安装`react-router-dom`的 4.0 版本, 4.0 版本不需要路由配置, 一切皆组件.react-router 是基础包, dom 包会安装基础包.

`react-router-dom`核心用法有:

- `HashRouter`和`BrowserRouter`
- `Router`: `path`, `exact`, `component`, `render`, 加上 exact 表示精准匹配`<Router exact path="/`>
- `NavLink`, `Link` 导航用, 使用 to 属性可以跳转, to 也可以传对象
- `Switch`, 用`Switch`只会匹配到第一个, 否则会找到所有符合要求的 Link
- `Redirect`, 重定向

HashRouter 是用"#"开头, 没有#开头则是浏览器 Router, Router 是路由, Route 是下面的子节点.

![Router用法](https://s1.ax1x.com/2020/04/07/G6LGRg.png)

## 使用

1. 混合组件化开发, 组件和 link 都在同一页面

```jsx
import {HashRouter, Route, Link, Switch} from 'react-router-dom'
import Main from other

export Home = () => {
    return (
        <HashRouter>
            <Link to="/">Home</Link>
        </HashRouter>
    )
    // 混合组件化开发
    <Switch>
        <Route exact={true} path="/" component={Main}>
    </Switch>
}
```

也可以采用配置开发, 先配置导航, 然后在需要显示的地方用{this.props.children}代替, 然后在 Router 节点的子节点写上导航节点, 然后内容写上各个子节点.
![混合式开发导航页面写法](https://s1.ax1x.com/2020/04/07/GcCE7Q.png)
![混合式开发Router写法](https://s1.ax1x.com/2020/04/07/GcCSfI.png)

可以使用`/:value`获取变量, 然后在组件中使用`this.props.match.value`可以获取到值. 如果不加在`Route`中不加`path`属性, 则可以创建`NoMatch`页面保证所有访问不到的页面都路由到 404 页面, 一般这种路由放到最后一个, 保证找不到页面的时候才跳转。

实现主页面的平级关系, 将所有的路由都包裹在`<App>`中, App 中使用`this.props.children`显示所有内容.

路由嵌套一般使用`render`属性进行, `render`接收一个函数, 返回一个组件, 返回组件又可以再进行判断, 例如 `render={()=><Router></Router>}`。
