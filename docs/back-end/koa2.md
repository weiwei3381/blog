# 使用 koa2 开发服务端

> Koa -- 基于 Node.js 平台的下一代 web 开发框架, 查阅[Koa2 文档](https://koa.bootcss.com/).

## 初始化与基本概念

依赖环境:

- koa2 版本为`2.7.0`
- node.js 版本为`12.14.0`

依赖的所有模块:

```json
"dependencies": {
    "axios": "^0.18.0",
    "basic-auth": "^2.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^8.4.0",
    "koa": "^2.7.0",
    "koa-bodyparser": "^4.2.1",
    "koa-router": "^7.4.0",
    "koa-static": "^5.0.0",
    "lodash": "^4.17.11",
    "module-alias": "^2.2.0",
    "mysql2": "^1.6.5",
    "npm-check": "^5.9.0",
    "require-directory": "^2.1.1",
    "sequelize": "^5.6.1",
    "validator": "^10.11.0"
  }
```

使用`npm init -y`后, 使用`npm install`安装所有模块.

### 代码修改后自动重启

安装`nodemon`, 建议全局安装, 使用`npm install nodemon -g`, 如果不是全局安装, 则可以使用`npx nodemon`运行或者编写`scripts`也行.
然后在命令行中输入`nodemon app.js`即可运行服务器, 并且监控文件修改情况, 一有文件修改则自动重启服务器.

在 vscode 中, 可以实现既能自动重启, 还能断点调试, 在 vscode 中点击[debug]菜单, 然后增加配置, 选择`nodemon安装程序`
![vscode中nodemon配置](https://s1.ax1x.com/2020/04/25/JsNWzF.png)
配置之后的`.vscode\launch.json`文件如下所示:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "nodemon运行",
      "runtimeExecutable": "nodemon",
      "program": "${workspaceFolder}/app.js",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}\\app.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "运行当前文件",
      "skipFiles": ["<node_internals>/**"],
      "program": "${file}"
    }
  ]
}
```

:::tip 小技巧
在 debug 时, 选中一段代码, 点击右键选中"调试求值",就可以在[调试控制台]看到结果了.
![调试求值](https://s1.ax1x.com/2020/04/25/Js0tgK.png)
:::

### 最简单服务器

koa2 服务器运行很简单, 下面代码运行最基本的 koa2 服务器, 在终端输入`node app.js`即可运行.

```js
const Koa = require('koa')
const app = new Koa()
app.listen(3000)
console.log('启动成功')
```

### 使用中间件

```js
const Koa = require('koa')
const app = new Koa()

// 实现中间件, 每次访问都会调用打印
// 在第一个中间件中调用第2个中间件
app.use((ctx, next) => {
  console.log('Hello World')
  next()
})

// 定义第2个中间件
app.use((ctx, next) => {
  console.log('Hello World2')
})

// 监听3000端口
app.listen(3000)
console.log('在3000端口服务端启动成功!')
```

### 洋葱模型

```js
const Koa = require('koa')
const app = new Koa()

// 第1个中间件, next调用使用await
app.use(async (ctx, next) => {
  console.log('1')
  await next() // 调用下个中间件
  console.log('2') // 下个中间件运行完毕后才会执行这个
})

// 第2个中间件, next调用使用await
app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

app.listen(3000)
console.log('在3000端口服务端启动成功!')
```

访问端口后, 代码运行结果是打印"1,3,4,2"
koa2 使用的是**洋葱模型**, 跟本代码相关的图例如下:
![洋葱模型.png](https://s1.ax1x.com/2020/04/25/Js9myn.png)
详细的洋葱模型是下图这样的:
![洋葱模型完整版.png](https://s1.ax1x.com/2020/04/25/Js98W4.png)
洋葱模型是以`await next()`为分界线, 例如要实现计时功能, 那么在 next 函数之后的代码能保证后续所有代码都已经执行完毕了.

### async 和 await 功能

中间件必须使用 async/await 关键词进行修饰, C#首次引用 async/await, 号称异步终极解决方案, 主要作用如下:

- 求值
- 阻塞线程, 等待返回结果

:::tip 小技巧
虽然 async/await 会阻塞线程, 但是它不会影响其他线程执行, 所以还是能保证代码高效.
:::

保证洋葱模型的例子

```js
const Koa = require('koa')
const app = new Koa()

// 第1个中间件
app.use(async (ctx, next) => {
  await next()
  // 在next之后,能保证后续代码已全部执行,才能拿到ctx.r
  const r = ctx.r
  console.log(r)
})

// 第2个中间件
app.use(async (ctx, next) => {
  const axios = require('axios')
  const res = await axios.get('https://api.uomg.com/api/rand.qinghua')
  // 将返回值挂载到ctx.r上
  ctx.r = res
  await next()
})

// 监听3000端口
app.listen(3000)
console.log('在3000端口服务端启动成功!')
```

## 改造路由系统

### 不使用路由的 koa2

如果不适用路由,则需要各种判断 ctx.path 和 ctx.method, api 列表一多,则特别不方便维护

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  //查阅官网文档, 找到Request的路径和访问方式
  // 为了简化操作, 官网文档说下面访问器和 Request 别名等效,所以可以直接在ctx上取
  console.log(ctx.path)
  console.log(ctx.method)
  // 下面其实是完成路由功能, 如果api多则需要很多判断
  if (ctx.path === '/api/v1/login' && ctx.method === 'GET') {
    // 返回值必须要放到ctx.body中才能显示, 不能直接return, 传入js对象可直接转换json
    ctx.body = { key: '登录失败' }
  }
})

// 监听3000端口
app.listen(3000)
console.log('在3000端口服务端启动成功!')
```

### Koa-router 用法

koa-router 是基于 koa 路由的中间件, 可在[koa-router 文档](https://github.com/ZijianHe/koa-router)中进行查阅, 基本用法有 3 步:

```js
var Koa = require('koa')
var Router = require('koa-router')

var app = new Koa()
// 第1步 实例化router
var router = new Router()

// 第2步 编写路由函数
router.get('/', (ctx, next) => {
  // ctx.router available
})

// 第3步 在app中使用中间件
app.use(router.routes()).use(router.allowedMethods())
```

使用 koa-router 将原有代码进行改造

```js
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router() // 实例化router

// 编写路由
router.get('/api/v1/login', (ctx, next) => {
  ctx.body = { key: '登录失败' }
})

// 注册
app.use(router.routes())

app.listen(3000)
console.log('在3000端口服务端启动成功!')
```

### 路由拆分

将原本在 app.js 中的路由放到 api 文件中,整体代码结构如下所示:

```batch
my-koa2
 ├── api
 │   ├── v1
 │   │   ├── deploy.js
 │   │   └── user.js
 │   └── v2
 └── app.js
```

app.js 中的代码

```js
const Koa = require('koa')
// 把路由分布到不同的文件中去
const user = require('./api/v1/user')
const deploy = require('./api/v1/deploy')

const app = new Koa()

// 统一在app.js中注册路由
app.use(user.routes())
app.use(deploy.routes())

app.listen(3000)
console.log('在3000端口服务端启动成功!')
```

在每个模块代码中导入 `koa-router`, 实例化路由并编写路由代码后再并将其导出, `user.js` 中代码如下:

```js
const Router = require('koa-router')
// 实例化router
const router = new Router()
// 编写路由
router.get('/api/v1/login', (ctx, next) => {
  ctx.body = { key: '登录失败' }
})
// 导出路由
module.exports = router
```

### 自动加载所有路由模块

使用`require-directory`可以自动加载目录下所有模块, 查看[require-directory 文档](https://www.npmjs.com/package/require-directory), app.js 中改写为下面的代码样式

```js
const Koa = require('koa')
const Router = require('koa-router')
const requireDirectory = require('require-directory')

const app = new Koa()

// requireDirectory的第3个参数传入一个对象
// 对象的visit属性可以传入一个回调函数,
// 就是对每个模块进行导入成功后的操作
// 需要确保路由模块都是采用default形式进行导出, 即module.exports = router
requireDirectory(module, './api', {
  visit: (obj) => {
    // 如果是router对象,则在app上进行注册
    if (obj instanceof Router) {
      app.use(obj.routes())
    }
  },
})

app.listen(3000)
console.log('Server Start in port 3000!')
```

:::warning 注意
需要确保路由模块都是采用 default 形式进行导出, 即`module.exports = router`.
:::

### 增加初始化管理器,并使用绝对路径

:::tip 小技巧
`process.cwd()`能显示当前项目的绝对路径, 例如`"D:\js_projects\my-koa2"`
:::

重构后的项目结构如下所示:

```batch
my-koa2
 ├── app
 │   └── api
 │       ├── v1
 │       │   ├── deploy.js
 │       │   └── user.js
 │       └── v2
 ├── app.js
 └── core
     └── init.js
```

增加初始化管理器类`InitManager`位于`init.js`中

```js
const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  /**
   * 入口方法
   * @param {Koa} app
   */
  static initCore(app) {
    InitManager.app = app
    // 使用静态方法需要用`类名.方法()`进行调用
    InitManager.initLoadRouters()
  }

  /**
   *  导入路由方法
   */
  static initLoadRouters() {
    // 使用绝对路径引用api, 这样无论怎么修改init.js文件位置都没关系,
    // 前提是api位置不能有变化
    const apiDir = `${process.cwd()}/app/api`
    requireDirectory(module, apiDir, {
      visit: whenLoadModule,
    })

    // 当加载路由模块后的方法
    function whenLoadModule(obj) {
      // 如果是router对象,则在app上进行注册
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager
```

`app.js`可以轻装上阵:

```js
const Koa = require('koa')
const InitManager = require('./core/init')

const app = new Koa()

// 将app传入到初始化类中
InitManager.initCore(app)

app.listen(3000)
console.log('Server Start in port 3000!')
```

:::warning 注意
由于`process.cwd()`能显示当前项目的绝对路径, 通过与绝对路径修改 api 文件夹位置, 这样无论怎么修改`init.js`文件位置都没关系,但是**必须保证**`api`文件夹的位置始终位于项目工程根目录的`./app/api`中.
:::
