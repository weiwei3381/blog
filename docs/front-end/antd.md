# React 与 Antd 开发前端页面

## React 安装

React 生态: React + React-Router + Redux + Axios + Babel + Webpack
React 是声明式实现, 使用 yarn, 通过`npm install yarn -g`安装 yarn 最新稳定版本.

```js
// 初始化项目
yarn init
// 新增包
yarn add
// 删除包
yarn remove
// 安装项目所有依赖
yarn / yarn install
```

使用命令初始化项目`npx create-react-app my-antd`, 如果项目运行不起来, 考虑是不是上层文件夹有没有`node_modules`文件夹, 否则会报错.
默认 react 会启用严格模式 StrictMode,StrictMode 是一个用来突出显示应用程序中潜在问题的工具。严格模式检查仅在开发模式下运行, StrictMode 目前有助于：

- 识别不安全的生命周期
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API

## 首页开发

### 增加 less 支持

安装依赖:`yarn add react-router-dom@4.2.2 axios less@2.7.3 less-loader@4.1.0 --save`, 其中`less`和`less-loader`都需要安装.

然后运行`yarn eject`暴露原本的`webpack`设置, 暴露之前需要使用 git 保存当前情况, 否则运行 eject 会报错.
在`config/webpack.config.js`的配置文件汇总, 在`module.rules`下面的`oneOf:[]`数组中, 仿照`cssRegex`增加`less`解析器, 如下所示:

```js
{
  test: /\.less$/,
  exclude: cssModuleRegex,
  use: getStyleLoaders({
    importLoaders: 1,
    sourceMap: isEnvProduction && shouldUseSourceMap,
  }),
  // Don't consider CSS imports dead code even if the
  // containing package claims to have no side effects.
  // Remove this when webpack adds a warning or an error for this.
  // See https://github.com/webpack/webpack/issues/6571
  sideEffects: true,
},
```

由于`use`中调用的是`getStyleLoaders`函数, 因此还需要修改`getStyleLoaders`, 在`loaders`变量的最后增加

```js
{
  loader: require.resolve('less-loader'),
},
```

因为 loaders 是从后向前解析的, 所以需要加在最开头, 先解析 less, 然后在解析 css 等

### 实现按需加载

antd 官网提供了[按需加载](https://ant.design/docs/react/getting-started-cn#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)的说明, 首先需要安装`npm install babel-plugin-import --save-dev`, 然后修改配置, 这里我们直接在`webpack`中进行修改, 修改的地方位于系统调用`babel-loader`时, 即`loader: require.resolve('babel-loader')`, 此时在插件栏中加入`['import', { libraryName: 'antd', style: true }]`, 即可实现按需加载 css, 不需要在页面中再写`import css`

````js

{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  include: paths.appSrc,
  loader: require.resolve('babel-loader'),
  options: {
    customize: require.resolve(
      'babel-preset-react-app/webpack-overrides'
    ),
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent:
                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
            },
          },
        },
      ],
      // 下面是增加的, 实现按需导入
      ['import', { libraryName: 'antd', style: true }],
    ],
    cacheDirectory: true,
    cacheCompression: false,
    compact: isEnvProduction,
  },
}
            ```
### 使用 aliyun 主题

在`config/webpack.config.js`的 less-loader 配置中, 利用`modifyVars`修改相应变量, 即可改变主题颜色.

```js
{
  loader: 'less-loader',
  options: {
    modules: false,
    modifyVars: {
      '@font-size-sm': '12px',
      '@font-size-base': '12px',
      '@primary-color': '#0070cc',
      '@border-radius-base': '0',
      '@border-radius-sm': '0',
      '@text-color': 'fade(#000, 65%)',
      '@text-color-secondary': 'fade(#000, 45%)',
      '@background-color-base': 'hsv(0, 0, 96%)',
      '@success-color': '#1e8e3e',
      '@error-color': '#d93026',
      '@warning-color': '#ffc440',
      '@info-color': '@primary-color',
      '@danger-color': '@error-color',
      '@processing-color': '@primary-color',
      '@border-color-base': '#dedede',
      '@border-color-split': '#dedede',
      '@outline-width': '0',
      '@outline-color': '#737373',
      '@input-height-lg': '36px',
      '@input-height-base': '32px',
      '@input-height-sm': '24px',
      '@input-hover-border-color': '#737373',
      '@form-item-margin-bottom': '16px',
      '@btn-default-bg': '#fafafa',
      '@btn-default-border': '#dedede',
      '@btn-danger-color': '#fff',
      '@btn-danger-bg': '@error-color',
      '@btn-danger-border': '@error-color',
      '@switch-color': '@success-color',
      '@table-header-bg': '#fafafa',
      '@table-row-hover-bg': '#fafafa',
      '@table-padding-vertical': '15px',
      '@badge-color': '@error-color',
      '@breadcrumb-base-color': '@text-color',
      '@breadcrumb-last-item-color': '@text-color-secondary',
      '@slider-rail-background-color': '@background-color-base',
      '@slider-rail-background-color-hover': '#e1e1e1',
      '@slider-track-background-color': '@primary-color',
      '@slider-track-background-color-hover': '@primary-color',
      '@slider-handle-border-width': '1px',
      '@slider-handle-color': '#dedede',
      '@slider-handle-color-hover': '#dedede',
      '@slider-handle-color-focus': '#dedede',
      '@slider-handle-color-tooltip-open': '#ddd',
      '@slider-handle-color-focus-shadow': 'transparent',
      '@slider-handle-shadow': '1px 1px 4px 0 rgba(0,0,0,.13)',
      '@alert-success-border-color': '#dff4e5',
      '@alert-success-bg-color': '#dff4e5',
      '@alert-info-border-color': '#e5f3ff',
      '@alert-info-bg-color': '#e5f3ff',
      '@alert-error-border-color': '#fcebea',
      '@alert-error-bg-color': '#fcebea',
      '@alert-warning-border-color': '#fff7db',
      '@alert-warning-bg-color': '#fff7db',
      '@radio-button-bg': 'transparent',
      '@radio-button-checked-bg': 'transparent',
      '@progress-radius': '0',
      '@tabs-card-gutter': '-1px',
      '@tabs-card-tab-active-border-top': '2px solid @primary-color',
      '@layout-body-background': '#fafafa',
    },
  },
}
````

### 添加装饰器支持

首先安装 babel 的装饰器支持插件`yarn add @babel/plugin-proposal-decorators`

将项目中 package.json 中的 babel 依赖修改为：

```json
"babel": {
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ]
    ],
    "presets": [
      "react-app"
    ]
  },
```

这样就可以使用装饰器语法了.

## 使用状态管理 mobx 插件

> MobX 是一个简单、方便扩展、久经考验的状态管理解决方案.

### 核心思想

状态是每个应用程序的核心，没有比创建不一致的状态或与徘徊的局部变量不同步的状态更快的方法来创建有缺陷的，难以管理的应用程序。因此，许多状态管理解决方案试图限制修改状态的方式，例如通过使状态不可变。但这带来了新的问题。数据需要规范化，无法再确保参照完整性，因此使用功能强大的概念（例如原型）几乎变得不可能。

MobX 通过解决根本问题而使状态管理再次变得简单：它使得不可能产生不一致的状态。实现这一目标的策略很简单： 确保所有可以从应用程序状态派生的内容都将被自动派生。

从概念上讲，MobX 将您的应用程序视为电子表格。
![mobx核心思想](https://s1.ax1x.com/2020/05/03/YpSR8H.png)

1. 首先，存在应用程序状态。对象，数组，基元，引用的图形构成了应用程序的模型。这些值是应用程序的“数据单元”。
2. 其次是推导。基本上，任何可以根据应用程序状态自动计算的值。这些派生值或计算值的范围从简单的值（例如待办事项的数量）到复杂的东西（如待办事项的可视 HTML 表示）。用电子表格术语：这些是您的应用程序的公式和图表。
3. 反应与推导非常相似。主要区别在于这些函数不会产生值。相反，它们会自动运行以执行某些任务。通常，这与 I / O 有关。他们确保 DOM 更新或在正确的时间自动发出网络请求。
4. 最后有动作。行动是改变状态的一切。MobX 将确保由您的操作引起的对应用程序状态的所有更改都将被所有派生和反应自动处理。同步且无故障。

### 待办事项示例

在没有用 mobx 的时候实现待办事项的储存, 示例代码如下

```js
class TodoStore {
  todos = [] // 内部属性, 存储所有的待办事项

  // 获得已经完成的待办事项数量
  get completedTodosCount() {
    return this.todos.filter((todo) => todo.completed === true).length
  }
  // 报告当前的待办事项情况
  report() {
    if (this.todos.length === 0) return '<无>'
    const nextTodo = this.todos.find((todo) => todo.completed === false)
    return (
      `下一个事项: "${nextTodo ? nextTodo.task : '<无>'}". ` +
      `当前进度: ${this.completedTodosCount}/${this.todos.length}`
    )
  }
  // 增加待办事项, 默认completed(完成)为否,assignee(委托人)为空
  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null,
    })
  }
}
// 新建待办事项储存实例
const todoStore = new TodoStore()
```

我们刚刚创建了一个 带有 `todos`集合的`todoStore`的实例。是时候用一些对象填充`todoStore`了。为了确保我们看到更改的效果，我们 `todoStore.report`方法在每次更改后调用并记录下来。请注意，报表有意始终仅打印第一个任务。它使该示例有些虚假，但是正如您将在下面看到的那样，它很好地证明了 MobX 的依赖项跟踪是动态的。

```js
todoStore.addTodo('read MobX tutorial')
console.log(todoStore.report())
// 输出:下一个事项: "read MobX tutorial". 当前进度: 0/1

todoStore.addTodo('try MobX')
console.log(todoStore.report())
// 输出:下一个事项: "read MobX tutorial". 当前进度: 0/2

todoStore.todos[0].completed = true
console.log(todoStore.report())
// 输出: 下一个事项: "try MobX". 当前进度: 1/2

todoStore.todos[1].task = 'try MobX in own project'
console.log(todoStore.report())
// 输出: 下一个事项: "try MobX in own project". 当前进度: 1/2

todoStore.todos[0].task = 'grok MobX tutorial'
console.log(todoStore.report())
// 输出: 下一个事项: "try MobX in own project". 当前进度: 1/2
```

### 变成响应式

到目前为止，此代码没有什么特别的。但是，如果我们不必显式调用`report()` ，而可以声明我们希望在每次状态更改时调用它呢？这将使我们免于从代码库中可能影响报告的任何位置进行调用`report()`的责任。我们希望确保已打印最新报告。但是我们不想被组织起来打扰。

幸运的是，这正是 `MobX` 可以为您做的。自动执行仅取决于状态的代码。这样我们的` report()``功能就可以自动更新，就像电子表格中的图表一样。为此，TodoStore ` 必须变得可观察，以便 `MobX` 可以跟踪所有正在进行的更改。让我们更改类以使其达到目的。

同样，该 `completedTodosCount` 属性可以自动从待办事项列表中派生。通过使用`@observable` 和`@computed` 装饰器，我们可以在对象上引入可观察的属性：

```js
class ObservableTodoStore {
  @observable todos = []
  @observable pendingRequests = 0

  constructor() {
    mobx.autorun(() => console.log(this.report))
  }

  @computed get completedTodosCount() {
    return this.todos.filter((todo) => todo.completed === true).length
  }

  @computed get report() {
    if (this.todos.length === 0) return '<无>'
    const nextTodo = this.todos.find((todo) => todo.completed === false)
    return (
      `下一个待办事项: "${nextTodo ? nextTodo.task : '<无>'}". ` +
      `当前进度: ${this.completedTodosCount}/${this.todos.length}`
    )
  }

  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null,
    })
  }
}

const observableTodoStore = new ObservableTodoStore()
```

这就可以了！我们将一些属性标记为`@observable` 向 MobX 发出信号，这些值可以随时间变化。用`@computed` 装饰计算式, 计算状态变化后的值。

目前还未使用`pendingRequests`与`assignee`属性，但将在本教程后面使用。为简洁起见，此页面上的所有示例均使用 ES6，JSX 和装饰器。但是不用担心，MobX 中的所有装饰器都有对应的 ES5。

在构造函数中，我们创建了一个小函数，用于打印 report 并将其包装在`autorun`函数中。`autorun`函数会创建一个响应，该响应运行一次，然后在该函数内部使用的任何可观察数据发生更改时自动重新运行。因为 report 使用了 observable todos 属性，它将在适当的时候打印报告。在下一个清单中将证明这一点。只需按下运行按钮：

```js
observableTodoStore.addTodo('读三体1')
// 输出:下一个待办事项: "读三体1". 当前进度: 0/1
observableTodoStore.addTodo('写代码')
// 输出: 下一个待办事项: "读三体1". 当前进度: 0/2
observableTodoStore.todos[0].completed = true
// 输出: 下一个待办事项: "写代码". 当前进度: 1/2
observableTodoStore.todos[1].task = '将三体1改为三体2'
// 输出: 下一个待办事项: "将三体1改为三体2". 当前进度: 1/2
observableTodoStore.todos[0].task = '将写代码改为读代码'
// 没有输出
```

纯粹的乐趣吧？在 report 没有自动打印，同步，无泄漏中间值。如果仔细调查日志，您将看到第五行没有产生新的日志行。因为重命名实际上并没有改变报告，但是支持数据却改变了。另一方面，更改第一个待办事项的名称确实会更新报告，因为该名称已在报告中积极使用。这很好地证明了不仅 todos 数组正在被观察 autorun，还有待办事项中的各个属性。

### 使 React 反应

好的，到目前为止，我们做出了一个愚蠢的报告。是时候在这家同一个商店周围建立反应式用户界面了。尽管有它们的名字，React 组件却是无反应的。包中的@observer 装饰器 mobx-react 通过将 React 组件 render 方法包装在中来修复此问题，该方法 autorun 自动使您的组件与状态保持同步。从概念上讲，这与我们 report 之前所做的没什么不同。

下一个清单定义了一些 React 组件。那里唯一的 MobX 东西是@observer 装饰器。这足以确保在相关数据更改时每个组件都单独重新渲染。您无需再调用 setState，也不必弄清楚如何使用选择器或需要配置的高阶组件来订阅应用程序状态的适当部分。基本上，所有组件都变得智能。然而，它们是以愚蠢的声明性方式定义的。

按运行代码按钮以查看下面的代码。该列表是可编辑的，因此可以随意使用。例如，尝试删除所有@observer 呼叫，或者仅删除装饰的呼叫 TodoView。每次渲染组件时，右侧预览中的数字都会突出显示。

```js
@observer
class TodoList extends React.Component {
  render() {
    const store = this.props.store
    return (
      <div>
        {store.report}
        <ul>
          {store.todos.map((todo, idx) => (
            <TodoView todo={todo} key={idx} />
          ))}
        </ul>
        {store.pendingRequests > 0 ? <marquee>Loading...</marquee> : null}
        <button onClick={this.onNewTodo}>New Todo</button>
        <small> (double-click a todo to edit)</small>
        <RenderCounter />
      </div>
    )
  }

  onNewTodo = () => {
    this.props.store.addTodo(prompt('Enter a new todo:', 'coffee plz'))
  }
}

@observer
class TodoView extends React.Component {
  render() {
    const todo = this.props.todo
    return (
      <li onDoubleClick={this.onRename}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={this.onToggleCompleted}
        />
        {todo.task}
        {todo.assignee ? <small>{todo.assignee.name}</small> : null}
        <RenderCounter />
      </li>
    )
  }

  onToggleCompleted = () => {
    const todo = this.props.todo
    todo.completed = !todo.completed
  }

  onRename = () => {
    const todo = this.props.todo
    todo.task = prompt('Task name', todo.task) || todo.task
  }
}

ReactDOM.render(
  <TodoList store={observableTodoStore} />,
  document.getElementById('reactjs-app')
)
```

### 常用 api

1. `@observable`装饰器, 装饰器可以在 ES7 或者 TypeScript 类属性中属性使用，将其转换成可观察的。@`observable`可以在实例字段和属性`getter`上使用。对于对象的哪部分需要成为可观察的，`@observable`提供了细粒度的控制。

2. `@computed`装饰器来声明式的创建计算属性。计算值(computed values)是可以根据现有的状态或其它计算值衍生出的值。概念上来说，它们与 excel 表格中的公式十分相似。不要低估计算值，因为它们有助于使实际可修改的状态尽可能的小。此外计算值还是高度优化过的，所以尽可能的多使用它们。**不要把`computed`和`autorun`搞混**。它们都是响应式调用的表达式，但是，_如果你想响应式的产生一个可以被其它 observer 使用的值，请使用 `@computed`_，如果你*不想产生一个新值，而想要达到一个效果，请使用 `autorun`*。举例来说，效果是像打印日志、发起网络请求等这样命令式的副作用。如果任何影响计算值的值发生变化了，计算值将根据状态自动进行衍生。计算值在大多数情况下可以被 MobX 优化的，因为它们被认为是纯函数。例如，如果前一个计算中使用的数据没有更改，计算属性将不会重新运行。如果某个其它计算属性或 reaction 未使用该计算属性，也不会重新运行。在这种情况下，它将被暂停。

3. `Autorun`自动运行。当你想创建一个响应式函数，而该函数本身永远不会有观察者时，可以使用`mobx.autorun`。 这通常是当你需要从反应式代码桥接到命令式代码的情况，例如打印日志、持久化或者更新 UI 的代码。 当使用 `autorun` 时，所提供的函数总是**立即被触发一次**，然后**每次它的依赖关系改变时会再次被触发**。 相比之下，`computed(function)` 创建的函数只有当它有自己的观察者时才会重新计算，否则它的值会被认为是不相关的。 经验法则：**如果你有一个函数应该自动运行，但不会产生一个新的值，请使用`autorun`。 其余情况都应该使用 `computed`**。 Autoruns 是关于启动效果 (initiating effects) 的，而不是产生新的值。 如果字符串作为第一个参数传递给 autorun，它将被用作调试名。

4. `@observer`装饰器可以用来将 React 组件转变成响应式组件。 它用 `mobx.autorun` 包装了组件的 `render` 函数以确保任何组件渲染中使用的数据变化时都可以强制刷新组件。 `observer` 是由单独的 `mobx-react` 包提供的，所以需要这样导入它`import {observer} from "mobx-react"`

5. `(@)action`动作,任何应用都有动作。动作是任何用来**修改状态**的东西。 使用 MobX 你可以在代码中显式地标记出动作所在的位置。 动作可以有助于更好的组织代码。它接收一个函数并返回具有同样签名的函数，但是用 transaction、untracked 和 allowStateChanges 包裹起来，尤其是 transaction 的自动应用会产生巨大的性能收益， 动作会分批处理变化并只在(最外层的)动作完成后通知计算值和反应。 这将确保在动作完成之前，在动作期间生成的中间值或未完成的值对应用的其余部分是不可见的。
