# 使用 koa2 开发服务端

> Koa -- 基于 Node.js 平台的下一代 web 开发框架, 可查阅[Koa2 文档](https://koa.bootcss.com/), 项目参考了 [Lin-CMS-Koa](https://github.com/TaleLin/lin-cms-koa), 并且也大量使用了[慕课网](http://www.imooc.com)课程[Koa2 服务端开发](https://coding.imooc.com/class/342.html), 感谢**林间有风**团队, 特别是慕课网[七月](http://www.imooc.com/t/4294850)老师, 欢迎大家支持正版.

## 初始化与基本概念(init)

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

## 路由系统(Router)

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

```bash
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

### 增加初始化管理器(InitManager)

:::tip 小技巧
`process.cwd()`能显示当前项目的绝对路径, 例如`"D:\js_projects\my-koa2"`
:::

重构后的项目结构如下所示:

```bash
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

## 异常处理(HttpException)

### koa2 获取 4 种类型的参数

使用 post 传递参数, 一般使用 postman 进行发送, 传递 json 格式的参数, 在`postman`的[body]栏中应该选择`raw`, 格式为`JSONapplication/json`
![postman传递json参数](https://s1.ax1x.com/2020/04/25/JyC1Zq.png)

一般的参数传递有 4 种方式:

- 在 url 中包含参数, 例如`http://t.cn/3`表示第 3 页等
- url 中的?传参,`http://t.cn/test/?param=weiwei`
- body 传参, 在 body 中使用`application/json`格式
- heads 传参, 在 head 中以键值对的方式进行传参

一个包括上述所有参数的例如如下所示:
![postman模拟4种传参方式](https://s1.ax1x.com/2020/04/25/JyizGT.png)

为了获取 body 中的参数, 需要安装`koa-bodyparser`中间件, 它会自动把 body 的参数挂载到 request 对象的 body 属性中去, 修改后的`app.js`代码如下所示:

```js
const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')

const app = new Koa()

// 使用bodyParser, 以便解析body中的参数, 需要在初始化之前使用
// 会自动把body的参数挂载到request对象的body属性中去
app.use(parser())

// 将app传入到初始化类中
InitManager.initCore(app)

app.listen(3000)
console.log('Server Start in port 3000!')
```

我们在`user.js`尝试获取参数, 写法如下:

```js
const Router = require('koa-router')

const router = new Router() // 实例化router

router.post('/v1/:id/test', (ctx, next) => {
  const path = ctx.params // 获取到{id:"1"}
  const query = ctx.request.query // 获取到{param:"weiwei"}
  const headers = ctx.request.header // 对象包含很多属性, 其中token属性为12345678
  // 在使用路由之前, 使用了koa-bodyparser中间件
  // 才能在request的body属性中获取值
  const body = ctx.request.body // 获取到{test: 2}

  ctx.body = { key: '获取参数成功' }
})

module.exports = router
```

:::warning 注意
必须保证在使用路由**之前**, 在`app`中使用挂载 koa-bodyparser 中间件, 否则路由是无法获取到`body`属性的.
:::

### koa2 异常处理

函数中出现异常, 有 2 种处理方法, 一种是`return false`或者`return null`, 另外一种是`throw new Error`, 一般来说, 第二种方法更好一些, 因为返回 null 会丢失异常, 我们需要捕捉异常告诉开发者.
最好是定义全局异常处理, 在所有函数调用的最顶部, 能够监听到所有的异常, 方便操作.
异步操作时不太好捕捉异常的, 一般操作是在所有 promise 返回的对象都加上 async/await, 然后包裹 try/catch 即可, 示例代码如下:

```js
// 在另一个函数中利用async/await关键字使用try/catch捕获异常
async function func2() {
  try {
    await func3()
  } catch (error) {
    console.log('error')
  }
}

// 自己创建一个promise
function func3() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const r = Math.random()
      // 随机抛出异常
      if (r > 0.5) {
        reject('error')
      } else {
        resolve('success')
      }
    }, 1000)
  })
}

func2() // 调用函数执行
```

:::warning 注意
javascript 中`1/0`不会报错, 会返回一个值`Infinity`的值, 表示无限大.
如果 promise 的异常没有处理, 例如没有用 await 来接收, 则会报"UnhandledPromiseRejectionWarning"错误
:::

### 增加全局异常处理(catchError)

主要思想是增加一个中间件, 把所有函数都放到中间件的 try/catch 中去, 如果出现问题则修改 body.
新增中间件`middlewares`文件夹, 编写`exception.js`文件

```bash
my-koa2
 ├── app
 │   └── api
 │       ├── v1
 │       │   ├── deploy.js
 │       │   └── user.js
 │       └── v2
 ├── app.js
 ├── core
 │   └── init.js
 └── middlewares
     └── exception.js
```

`exception.js`文件内容如下:

```js
// 自己编写全局异常处理, 有点面向切面编程的感觉
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.body = { message: '服务器出现问题' }
  }
}

module.exports = catchError
```

再在 app.js 中增加处理调用中间件代码.

```js
const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
// 引入全局异常处理
const catchError = require('./middlewares/exception')

const app = new Koa()
// 首先进行全局异常处理
app.use(catchError)

// 解析body参数, 调用初始化类
app.use(parser())
InitManager.initCore(app)

app.listen(3000)
console.log('Server Start in port 3000!')
```

### 使用变量挂载方式完善全局异常处理

返回的异常一般有四种信息:

- status: 整型, Http 状态码, 例如 200, 301, 400, 500 等
- message: 字符串型, 给客户端的消息信息
- errorCode: 整型, 自定义的详细错误码信息
- requestUrl: 字符串型, 当前请求的 url 信息

但是比较麻烦的是怎么在全局异常处理中获得上述 4 种信息, 1 种是可以利用获得的 error 实例, 在 error 实例上挂载相应的信息, 修改后的 user.js 代码如下

```js
const Router = require('koa-router')

const router = new Router() // 实例化router

router.post('/v1/:id/test', (ctx, next) => {
  const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body

  // 如果query为空对象, 则抛出相应错误
  if (JSON.stringify(query) === '{}') {
    // 创建error对象之后, 在上面挂载相应的状态
    const error = new Error('错误信息')
    error.errorCode = 10001
    error.status = 400
    error.requestUrl = `${ctx.method} ${ctx.path}`
    throw error
  }
  // 如果没有错误发生, 则显示"获取参数成功"
  ctx.body = { key: '获取参数成功' }
})

module.exports = router
```

:::tip 小技巧
判断一个对象`obj`是不是空对象`{}`, 没法用`if(!obj){}`进行判断, 可以采用`JSON.stringify(obj) === '{}'`进行判断
:::

此时, 全局异常处理`exception.js`代码可以修改为:

```js
// 自己编写全局异常处理, 有点面向切面编程的感觉
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 如果含有errorCode, 表示是一类已知错误
    if (error.errorCode) {
      // 构造返回值
      ctx.body = {
        msg: error.message,
        errorCode: error.errorCode,
        requestUrl: error.requestUrl,
      }
      // http状态码直接写到ctx上
      ctx.status = error.status
    }
  }
}

module.exports = catchError
```

但是, 采用这种方式, 每次构造异常比较麻烦, 可以采用类的方式简化这种构建.

### 使用类的方式改进异常生成

在`core`文件夹下面新增`http-exception.js`, 写法如下:

```js
// 必须要继承内置类Error, 否则无法抛出自定义的这个类
class HttpException extends Error {
  // 设置默认值
  constructor(msg = '服务器错误', errorCode = 10000, code = 400) {
    super() // 调用父类的构造方法
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

// 使用对象的方式导出, 这样可以导出多个异常
module.exports = {
  HttpException,
}
```

然后在`user.js`中, 就可以使用这个异常类构建 `httpException`.

```js
const Router = require('koa-router')
// 导入自定义Http异常类
const { HttpException } = require('../../../core/http-exception')

const router = new Router() // 实例化router

router.post('/v1/:id/test', (ctx, next) => {
  const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body

  // 如果query为空对象, 则抛出相应错误
  if (JSON.stringify(query) === '{}') {
    // 创建error对象之后, 在上面挂载相应的状态
    const error = new HttpException('参数错误', 10001, 400)
    throw error
  }
  ctx.body = { key: '获取参数成功' }
})

module.exports = router
```

在全局异常处理`exception.js`里面, 对判断和 requestUrl 也进行了一定的改善, 代码如下:

```js
// 导入HttpException类, 以便进行判定
const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 如果是httpException, 则属于已知错误
    if (error instanceof HttpException) {
      // 构造返回值
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`,
      }
      // http状态码直接写到ctx上
      ctx.status = error.code
    } else {
      // 处理未知异常
      ctx.body = {
        msg: '服务器错误',
        errorCode: 999,
        requestUrl: `${ctx.method} ${ctx.path}`,
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
```

### 定义多种异常类方便使用

采用类的方式定义了`HttpException`类之后, 可以再次基础上进行继承和派生类, 方便使用, 这也是使用类的方式进行代码编写的好处, 例如我们可以针对参数错误类, 定义一个`ParameterException`, 这时候`http-exception.js`改写为:

```js
class HttpException extends Error {
  constructor(msg = '服务器错误', errorCode = 10000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

// 新定义参数错误类, 继承自HttpException
class ParameterException extends HttpException {
  constructor(msg = '参数错误', errorCode = 10000) {
    super()
    this.code = 400
    this.msg = msg
    this.errorCode = errorCode
  }
}

// 使用对象的方式导出多个异常
module.exports = { HttpException, ParameterException }
```

在`user.js`代码中使用的时候只需要创建该异常即可:

```js
// 如果query为空对象, 则抛出参数错误类
if (JSON.stringify(query) === '{}') {
  // 新建参数错误异常类并抛出
  const error = new ParameterException()
  throw error
}
```

### 区分生产环境和开发环境

在开发环境中, 对于未知异常, 我们期望程序抛出它并可以给我们查看, 但是在生产环境中则不需要这样, 因此需要新建配置文件来区分这两种开发环境.
在根目录中新建`config/config.js`, 写入配置:

```js
module.exports = {
  // 如果prod则是生产环境, 如果是dev则是开发环境
  enviroment: 'dev',
}
```

在项目初始化时将配置加载到全局变量`global`中, 需要改写`core/init.js`代码

```js
const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  // 初始化类
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
    // 初始化时加载全局配置
    InitManager.loadConfig()
  }
  // 加载路由
  static initLoadRouters() {...}

  // 在全局变量中加载config
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }
}

module.exports = InitManager

```

然后在`middlewares/exception.js`中, 加入当前代码环境的判断

```js
const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 区分开发环境和生产环境, 如果是开发环境, 而且不属于HttpException, 则提示错误信息
    const isHttpException = error instanceof HttpException
    const isDev = global.config.enviroment === 'dev'
    if (!isHttpException && isDev) {
      throw error
    }
    // 如果是httpException, 则属于已知错误
    if (isHttpException) {...} else {...}
  }
}

module.exports = catchError

```

## 参数校验(Validator)

### 使用校验器

koa2 没有特别好的校验器, 目前使用的是[lin-mizar](https://github.com/hpmax00/lin-mizar)提供的 validator 类, lin-mizar 是[LinCms](https://github.com/TaleLin/lin-cms-koa)的核心库, 首先下载[lin-validator.zip](https://wws.lanzous.com/inTEFgja8cf), 解压之后放到`core`文件夹下, 然后在`app`目录新建`validators`目录及`validator.js`文件, 目录结构如下:

```bash
my_koa2
 ├── app
 │   ├── api
 │   │   └── v1
 │   │       ├── deploy.js
 │   │       └── user.js
 │   ├── lib
 │   └── validators
 │       └── validator.js
 ├── app.js
 ├── config
 │   └── config.js
 ├── core
 │   ├── http-exception.js
 │   ├── init.js
 │   ├── lin-validator.js
 │   └── util.js
 └── middlewares
     └── exception.js
```

`validator.js`中写校验器代码:

```js
const { LinValidator, Rule } = require('../../core/lin-validator')

// 正整数校验器
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    // this.id值表示校验的是id参数,
    // 由于是数组, 所以可以定义多个校验规则, 它们是"且"关系
    this.id = [new Rule('isInt', '需要正整数', { min: 1 })]
  }
}

module.exports = {
  PositiveIntegerValidator,
}
```

在`user.js`中使用也比较简单

```js
const Router = require('koa-router')
// 导入正整数校验器
const { PositiveIntegerValidator } = require('../../validators/validator')

const router = new Router() // 实例化router

router.post('/v1/:id/test', (ctx, next) => {
  // 实例化校验器后, 校验时需传入ctx参数
  // 因为所有的参数都保存在ctx中,所以必须要传入ctx
  const v = new PositiveIntegerValidator().validate(ctx)

  ctx.body = { key: '获取参数成功' }
})

module.exports = router
```

这时, 使用 postman 发送请求`localhost:3000/v1/-1/test?param=weiwei`, 由于 id 给了-1, 则自动返回错误提示信息

```json
{
  "msg": ["id需要正整数"],
  "errorCode": 10000,
  "requestUrl": "POST /v1/-1/test"
}
```

:::warning 注意
由于我们要校验的是 id 参数, 所以在创建`PositiveIntegerValidator`时对`this.id`赋予了校验规则.
校验规则, 例如"isInt", 来自于[validator.js](https://github.com/validatorjs/validator.js)开源库.
:::

### 使用校验器获取参数

在`user.js`中使用校验器, 然后在校验器中获取定义的参数

```js
const Router = require('koa-router')
const { PositiveIntegerValidator } = require('../../validators/validator')

const router = new Router()

router.post('/v1/:id/test', (ctx, next) => {
  const v = new PositiveIntegerValidator().validate(ctx)
  // 如果校验器通过了, 可以利用校验器获取参数,
  // 分别用path,query,head,body代表路径,查询,head和body中的参数
  // 例如path.id代表获取路径中的id参数
  // validator会自动进行转型, 如果不需要转型则第2个参数传false
  // 也能获取嵌套层级, 例如'body.a.b'
  const id = v.get('path.id', false)

  ctx.body = { key: '获取参数成功' }
})

module.exports = router
```

## 数据持久化

### 安装 mysql 与 navicat

通过访问[XAMPP](https://www.apachefriends.org/zh_cn/index.html), 下载安装 XAMPP, 即自带 MariaDB. [MariaDB](https://mariadb.org/) 数据库管理系统是 MySQL 的一个分支，主要由开源社区在维护，采用 GPL 授权许可 MariaDB 的目的是完全兼容 MySQL，包括 API 和命令行，使之能轻松成为 MySQL 的代替品。

此外, 还需要安装[navicat for mysql](https://navicat.com.cn/), 他是一个数据库可视化管理工具.

安装 XAMPP 完毕后, 登陆 XAMPP 管理控制台, 开启 mysql 数据库.
![XAMPP管理控制台](https://s1.ax1x.com/2020/04/26/JcdLvV.png)
这时,我们需要使用 navicat 修改`root`用户的密码, 用 navicat 首次登陆不输入密码, 点击[用户]菜单, 修改所有 root 开头的用户名, 然后就可以按照新密码进行登陆了.
![navicat修改用户密码](https://s1.ax1x.com/2020/04/26/Jcd4Hg.png)

### 使用 Sequelize 创建 User 表

Sequlize 是 node.js 的一个 ORM 框架, 详细信息可以查阅[v5 版本中文 api 文档](https://github.com/demopark/sequelize-docs-Zh-CN/tree/v5),首先在配置文件中设置数据库用户名, 密码, 地址等参数:

```js
module.exports = {
  // 如果prod则是生产环境, 如果是dev则是开发环境
  enviroment: 'dev',
  database: {
    dbName: 'filemsg',
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
  },
}
```

在`core`文件夹下面新建`db.js`文件夹, 这里使用的 ORM 库是[sequelize](https://sequelize.org/v5/), 该文件主要完成配置数据库连接以及初始化等一系列操作:

```js
// 引入sequelize
const Sequelize = require('sequelize')

// 从配置文件中解构获取database参数
const {
  dbName,
  host,
  port,
  user,
  password,
} = require('../config/config').database
// 创建Sequelize实例
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', // 设置数据库语言别名为"mysql"
  host,
  port,
  logging: true, // 显示日志, 包括操作的SQL语句
  timezone: '+8:00',
  define: {
    // 是否显示createdAt和updateAt时间戳字段
    timestamps: true,
    paranoid: true, // 会增加deleteAt字段, 实现假删除
    // 下面3项是更改别名
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // 默认命名使用驼峰式命名，该配置则使用蛇型命名。
    underscored: true,
  },
})

// 将定义的模型同步到数据库上, force表示强制更新, 会丢失数据
sequelize.sync({
  force: true,
})
// 导出模型
module.exports = { sequelize }
```

在配置好`core/db.js`之后, 可以在`app`下新建`models`文件夹, 用来存放所有的数据库模型类, 这里新建`models/user.js`:

```js
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class User extends Model {}

User.init(
  {
    // 主键ID
    id: {
      type: Sequelize.INTEGER, // 整型
      primaryKey: true, // 是否主键
      autoIncrement: true, // 自增
    },
    nickname: Sequelize.STRING, // 昵称
    email: Sequelize.STRING, // 电子邮箱
    password: Sequelize.STRING, // 密码
    openid: {
      // 更加详细的设置每个属性, 包括长度, 是否唯一等
      type: Sequelize.STRING(64),
      unique: true,
    },
  },
  // 第二个参数传递sequelize实例, 以及表名称
  { sequelize, tableName: 'user' }
)
```

如果需要系统在运行之初执行数据代码的话, 还需要在`app.js`中引用`user.js`.

```js
// 在创建app之初, 先引用user.js
require('./app/models/user')

const app = new Koa()
```

### User 表注册功能验证相关信息

在`app/validators/validator.js`中增加用户注册的验证器:

```js
const { LinValidator, Rule } = require('../../core/lin-validator')

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [new Rule('isEmail', '不符合email规范')]
    // 密码1的校验规则
    this.password1 = [
      new Rule('isLength', '密码至少6个字符, 最多32个', { min: 6, max: 32 }),
      new Rule(
        'matches',
        '密码不符合规范',
        '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]'
      ),
    ]
    // 由于校验规则与pwd1相同,直接复制
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength', '昵称至少4个字符, 最多32个', { min: 4, max: 32 }),
    ]
  }

  // 自定义校验规则, 函数必须以validate开头
  // 判断两个密码是否相同
  validatePassword(vals) {
    const pw1 = vals.body.password1
    const pw2 = vals.body.password2
    if (pw1 !== pw2) {
      // 抛出普通异常, 由LinValidator来进行处理
      throw new Error('两个密码必须相同')
    }
  }
}

module.exports = {
  RegisterValidator,
}
```

修改`user.js`, 增加注册的接口:

```js
const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')

// 设定路由前缀, 这样写路由可以避免重复前面的地址
const router = new Router({
  prefix: '/v1/user',
})

// 注册, 不需要next, 所以没传
// 编写一个接口需要利用validator接收参数
router.post('/register', async (ctx) => {
  const v = new RegisterValidator().validate(ctx)
})

module.exports = router
```

### 增加 email 规则校验

为了保证用户提交的 email 与其他用户不相同, 因此在验证时增加了自定义的 email 校验, 这里需要注意的是由于需要在数据库中进行查询, 所以使用了 async/await.

```js
const { LinValidator, Rule } = require('../../core/lin-validator')
// 导入用户模块
const { User } = require('../models/user')

class PositiveIntegerValidator extends LinValidator {...}

class RegisterValidator extends LinValidator {
  constructor() {...}

  validatePassword(vals) {...}

  // 自定义email校验, 需要用validate开头, 保证email不与数据库中的值重复
  // 数据库操作都是异步, 所以都需要加async/await
  async validateEmail(vals) {
    const email = vals.body.email
    // 找到email相同的用户
    const user = await User.findOne({
      where: {
        email: email,
      },
    })
    if (user) {
      throw new Error('email已经存在')
    }
  }
}

module.exports = {...}

```

### User 表保存信息到数据库

拿到获取的到用户信息, 使用`User.create(user)`进行保存操作:

```js
const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
// 引入User模块
const { User } = require('../../models/user')

const router = new Router({
  prefix: '/v1/user',
})

router.post('/register', async (ctx) => {
  // 由于email操作是异步的, 所以需要加上await
  // 一般来说, 所有的validator都需要加上await
  // validate需要放到代码的第一行, 否则起不到守门的作用
  const v = await new RegisterValidator().validate(ctx)
  // 获取用户参数信息, 由于已经验证过了, 所以直接可以用
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    nickname: v.get('body.email'),
  }
  // 把用户保存至User表中, create是异步调用, 返回一个promise对象, 需要用await接收
  const newUser = await User.create(user)
})

module.exports = router
```

### 在模型中对 password 密码加密

在`models/user.js`的用户模型类中,利用 `password`中的`set()` 方法, 始终观察 password 情况,进行加密. 加密采用的是`bcryptjs`模块, 因为采用了加盐处理, 所以即使相同的密码, 保存到数据库中都不一样, 其中*How bcryptjs works*这篇文章详细解释了它的工作原理

```js
const bcrypt = require('bcryptjs') // 导入加密模块
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class User extends Model {}

User.init(
  {
    id: {...},
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      // set函数会在给password赋值的时候调用
      // 这里相当于实现了一个观察者模式
      set(val) {
        // 传的参数表示生成盐的成本, 通常用10, 使用同步版本
        const salt = bcrypt.genSaltSync(10)
        // 两个用户密码即使一样, 加密后的密码也应该不一样, 以防止彩虹攻击
        const psw = bcrypt.hashSync(val, salt)
        // 将加密过后的密码存入数据库
        // setDataValue是Model模型中的方法, 第一个参数表示给哪个参数赋值
        this.setDataValue('password', psw)
      },
    },
    openid: {...},
  },
  { sequelize, tableName: 'user' }
)

module.exports = { User }
```

### 处理操作成功(Success)的返回情况

在`http-exception.js`中, 增加`Success`的异常类, 如果成功则直接由它返回.

```js
// 处理成功的信息
class Success extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || '操作成功'
    this.errorCode = errorCode || 0
  }
}
```

在 api 的`user.js`中, 处理成功后直接抛出成功的类

```js
router.post('/register', async (ctx) => {
  const v = await new RegisterValidator().validate(ctx)
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    nickname: v.get('body.email'),
  }
  // create是异步调用, 返回一个promise对象, 需要用await接收
  await User.create(user)
  // 抛出成功的情况
  throw new Success()
```

## 令牌发放

### 定义 Type 相关枚举类型(Enum)

在`app/lib`文件夹下新建一个枚举功能类`enum.js`, 内容如下:

```js
// 判断val是否存在各类Type中
function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true
    }
  }
  return false
}
// 定义登录类型
// 其中增加isThisType的判定,
// 例如用户传100, 通过这个方法即可判断是否为可用值
const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 200,
  isThisType,
}

module.exports = {
  LoginType,
}
```

### 验证用户邮箱和密码是否正确

在`app/api/v1`下新建`token.js`的令牌相关 api 类, 里面主要写颁布令牌的功能, 首先需要在`validator.js`中增加`TokenValidator.js`的验证类.这里的关键在于**可选值**的验证, 以及必须在枚举类型中的验证方法.

```js
class TokenValidator extends LinValidator {
  constructor() {
    super()
    // 账号传入校验
    this.account = [new Rule('isLength', '不符合账号规则', { min: 4, max: 32 })]
    // 密码是可选校验
    // isOptional表示可选参数, 这是lin-validator自带的
    // 如果传入了, 则需要保证`isLength`规定的校验规则
    // 如果不传 则默认值就是123456
    this.secret = [
      new Rule('isOptional', '', '123456'),
      new Rule('isLength', '至少6个字符', { min: 6, max: 128 }),
    ]
  }

  // 自定义验证器验证type情况, 需要保证在LoginType枚举中
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('type是必填项')
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type参数不合法')
    }
  }
}
```

使用`TokenValidator`验证之后, 根据`type`不同, 需要调用不同的处理函数, 如果都没有,则需要抛出异常.
以邮箱和密码验证为例, 这里需要验证邮箱对应的用户是否存在, 以及用户传入的密码是否正确, 这里由于跟数据库操作相关, 因此放到模型`User`中进行.

```js
const Router = require('koa-router')
const { TokenValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../models/user')
const { ParameterException } = require('../../../core/http-exception')

const router = new Router({
  prefix: '/v1/token',
})

// 颁布令牌
router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx)
  const account = v.get('body.account') // 用户账户名
  const secret = v.get('body.secret') // 用户密码
  const type = v.get('body.type') // 用户登录方式
  // 使用jwt令牌, 是随机字符串并可携带数据
  switch (type) {
    case LoginType.USER_EMAIL:
      await emailLogin(account, secret)
      break
    case LoginType.USER_MINI_PROGRAM:
      break
    default:
      // 如果都没有处理, 则抛出异常
      throw new ParameterException('没有相应的处理函数')
  }
})

async function emailLogin(account, secret) {
  // 校验用户email和密码的信息, 放到模型User类中
  const user = await User.verifyEmailPassword(account, secret)
}

module.exports = router
```

模型`User`中关于校验用户 email 和密码的信息, 之前`User`类只是继承`Model`类, 里面一直没有写方法, 这里加入邮箱密码是否正确的方法, 该方法为静态方法, 不需要实例化对象, 另外异常类由于内容都差不多, 这里就不展开了, `User`类中的写法如下:

```js
class User extends Model {
  // 验证用户密码是否正确, 静态方法, 方便调用
  static async verifyEmailPassword(email, plainPassword) {
    // 判断用户名是这个邮箱的用户存在否
    const user = await this.findOne({
      where: {
        email: email,
      },
    })
    if (!user) {
      throw new AuthFailed('账号不存在')
    }
    // 使用bcrypt进行密码比对
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if (!correct) {
      throw new AuthFailed('密码错误')
    }
    // 如果不出问题, 则返回该用户信息
    return user
  }
}
```

:::warning 注意
由于很多函数都需要异步进行数据库操作, 因此大量用到了`async/await`, 这块千万要注意!
:::

### 生成 jwt 令牌(token)

生成令牌需要用到私有 key 和过期时间, 这里我们配置到`config.js`中:

```js
module.exports = {
  enviroment: 'dev',
  database: {...},
  security: {
    // 生成令牌所需的私有key
    secretKey: 'asdc123dad',
    // 令牌的过期时间, 以秒为单位, 这里用1个小时
    expiresIn: 60 * 60,
  },
}
```

然后在`core/util.js`中增加生成令牌的`generateToken`方法, 在令牌中写入用户 id 和用户权限范围(scope)

```js
// 导入jsonwebtoken模块, 用以生成令牌
const jwt = require('jsonwebtoken')

// 颁发令牌
const generateToken = function(uid, scope) {
  // 从配置项中读取私有key和过期时间
  const secretKey = global.config.security.secretKey
  const expiresIn = global.config.security.expiresIn
  // 第1个参数放置我们需要令牌携带的内容,包括用户id和权限范围
  // 第2个参数传入私有key,
  // 第3个参数放置令牌的配置项, 这里传入了过期时间
  // 然后利用jwt进行签名生成令牌
  const token = jwt.sign({ uid, scope }, secretKey, { expiresIn })
  return token
}
```

最后, 在`api`的`token.js`中使用该方法生成令牌

```js
// 导入生成令牌的方法
const { generateToken } = require('../../../core/util')

// 颁布令牌
router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx)
  const account = v.get('body.account')
  const secret = v.get('body.secret')
  const type = v.get('body.type')
  let token // token默认为空

  switch (type) {
    case LoginType.USER_EMAIL:
      // 返回jwt令牌
      token = await emailLogin(account, secret)
      break
    default:
      throw new ParameterException('没有相应的处理函数')
  }
  // 将token传递给前端
  ctx.body = { token }
})

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret)
  // 获得用户后生成令牌
  return generateToken(user.id, 2)
}
```

### jwt 令牌校验与取值

因为令牌用的比较多, 所以可以采用中间件的形式进行编写, 在`middlewares`文件夹下新建`auth.js`文件, 这里采用 basicAuth 的授权方式, 用类的方式返回一个中间件函数.
返回的中间件函数使用 jwt 的`verify()`方法对令牌值进行验证, 验证通过则把解码后的值保存在`ctx.auth`属性上
:::warning 注意
类中的 m 是用`get`修饰, 因此它是一个**属性**, 只是在取`m`属性的时候会调用定义的 m()方法, 获取返回值. 返回值是一个中间件函数. 因此在用的时候, 应该是`new Auth().m`即可获取中间件函数
:::

```js
// 导入basicAuth相关的包
const basicAuth = require('basic-auth')
const { Forbbiden } = require('../core/http-exception')
const jwt = require('jsonwebtoken')

class Auth {
  constructor() {}

  // 注意,m是一个属性, 这里用get修饰符
  get m() {
    // token进行检查, 使用httpBasicAuth进行身份验证, 在username中传递令牌
    return async (ctx, next) => {
      // ctx.req获得的是node.js原生的request对象,
      // ctx.request获取的则是koa2中封装的request对象
      // 将request对象传入, 即可得到basicAuth的令牌
      // basicAuth的令牌包括2个部分,一个是name, 一个是pass
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      // 如果令牌不存在, 或者没有那么属性, 则抛出异常
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errMsg)
      }
      try {
        // 验证令牌是否合法, 其中userToken.name是令牌字符串, secretKey是用户私有key
        // 如果验证通过, 则会返回我们给令牌传的值
        // 这里decode需要用var关键词, 否则后续拿不到该值
        var decode = jwt.verify(
          userToken.name,
          global.config.security.secretKey
        )
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          errMsg = '令牌已过期'
        }
        throw new Forbbiden(errMsg)
      }
      // 将验证后的值统一保存到ctx的auth属性中
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      }
      // 调用后续的中间件函数
      await next()
    }
  }
}
module.exports = { Auth }
```

然后我们在`api`文件中新建`deploy.js`进行测试, 这里的 Auth 中间件需要放到我们自己使用的中间件前面, 先行进行调用, 如果不出问题, 则会在`ctx.auth`中找到传入值

```js
const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
  prefix: '/v1/deploy',
})

// 将Auth中间件加入到router中
router.get('/getSetting', new Auth().m, async (ctx) => {
  // 将保存的值显示出来
  ctx.body = ctx.auth
})

module.exports = router
```

利用 postman 进行测试的时候, 需要选择`Authorization` 的`Basic Auth` 选项, 然后在`username`上传递之前生成的令牌, 如下图所示:
![postman测试basicAuth令牌](https://s1.ax1x.com/2020/04/27/JR8z7j.png)

### 前端获取令牌 token

在前端使用 httpAuth 的方式传递令牌, 需要进行 base64 加密, 先在前端安装 base64.js, `npm i js-base64 --save`, 示例代码如下:

```js
// 导入base64包
import {Base64} from 'js-base64'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInNjb3BlIjo4LCJpYXQiOjE1ODgwNTg4OTQsImV4cCI6MTU4ODA2MjQ5NH0.kgU351Gvedl3gvPmvb4iW1UrsIKQUM9thWtbr7ltIsA
axios({
  method: 'POST',
  url: '/user/token',
  header:{
    Authorization:_encode(token)
  }
})
// 进行base64加密
const _encode = (token)=>{
  // 一般加密的是username:password字符串形式,
  // 但是因为这里只传递令牌, 所以把令牌放到username中, password部分为空
  const base64 = Base64.encode(`${token}:`)
  // 标准的basicAuth需要在前面增加`Basic `, 所以这里需要加上
  return "Basic " + base64
}
```

### 权限设计

权限设计其实可以很简单, 就是用户给定一个权限值, 例如普通用户为 8, 管理员为 16, 然后给每个 api 一个权限数字, 如果用户权限大于 api 权限, 则可以查看, 否则没有权限, 这里设置不同用户的权限, 以及给 API 设置权限都在`middlewares/auth.js`类中, 其中加上注释的代码就是这次新增的.

```js
const basicAuth = require('basic-auth')
const { Forbbiden } = require('../core/http-exception')
const jwt = require('jsonwebtoken')

class Auth {
  // 设置Auth的不同用户的常量权限, 以及传入api的权限等级
  constructor(level) {
    this.level = level || 1 // api的权限等级, 默认为1
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }

  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errMsg)
      }
      try {
        var decode = jwt.verify(
          userToken.name,
          global.config.security.secretKey
        )
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          errMsg = '令牌已过期'
        }
        throw new Forbbiden(errMsg)
      }
      // 进行权限管理
      // 如果用户权限小于当前api的权限范围, 则抛出权限不足的错误
      if (decode.scope < this.level) {
        errMsg = '权限不足'
        throw new Forbbiden(errMsg)
      }
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      }
      await next()
    }
  }
}
module.exports = { Auth }
```

使用过程中,首先颁布令牌的时候,对于普通用户就要赋予`Auth.USER`的权限, 在`api/token.js`中,验证身份后, 生成令牌就可以填写`Auth.USER`值.

```js
const { Auth } = require('../../../middlewares/auth')

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret)
  // 获得用户后生成令牌
  return generateToken(user.id, Auth.USER)
}
```

用的时候也很简单, 在`deploy.js`中, 增加`Auth()`类实例化时传参即可.

```js
// Auth中可以传入api的权限等级, 等级越高, 所需的权限就越高
router.get('/getSetting', new Auth(12).m, async (ctx) => {
  ctx.body = ctx.auth
})

module.exports = router
```

### 业务逻辑编写位置

业务逻辑可以在 API 接口或者 Model 模型中: 如果业务**很简单**, 可以写到 api 中, 否则应该写到 model 层中. 如果业务很复杂, 则可以分为三层, 分别是 api(controller)/services/model, 其中 services 存放业务比较复杂的代码.

node.js 提供了一个帮助工具`util`, [util 文档](https://nodejs.org/docs/latest-v12.x/api/util.html)里面提供了很多帮助函数, 其中有本文格式化的函数, 还有类似于深比较`util.isDeepStrictEqual(val1, val2)`,`util.types`提供各种类型的内置对象的类型检查,字符编码`util.TextDecoder`和`util.TextEncoder`, `util.inspect()`方法返回`object`用于调试的字符串表示形式。

```js
const util = require('util')
// 文本格式化
const url = util.format('测试%s', id)
```

但是如果跟数据交互相关, 代码应该写到`model`模型类中, 例如微信小程序提供了 openId, 我们要查询 openId 是否已经存在, 那么这个方法应该写到模型类`User`当中.

## 数据库(database)操作

### 实体表和业务表概念

实体表是实体, 而业务表是虚表, 通过与实体的联系并附加一些信息, 从而方便业务操作.

使用概括的单词来描述一些实体类, 这样可以方便文件命名, 例如`classic.js`用来包括`sentence`, `music`等, 这样 classic 可以作为基类.

但是 javascript 中的 orm 框架中不能使用继承来实现.因此只能采用折中的办法进行设计, 例如`classic.js`写法如下:

```js
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

// 由于sequelize不能采用类属性的方式定义字段
// 所以这里单独声明一个classic字段对象
const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  favNums: Sequelize.INTEGER,
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}
// 定义电影的模型类
class Movie extends Model {}

// 电影模型类进行初始化, 第1个参数是classic模型的属性,使用classicFields
// 第2个参数传递一些参数, 包括sequelize实例和表名
Movie.init(classicFields, {
  sequelize,
  tableName: 'movie',
})

// 与电影一样, 定义名句的模型类
class Sentence extends Model {}
// 初始化电影
Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence',
})

// 与电影一样, 定义音乐的模型类
class Music extends Model {}

// 需要注意的是, 音乐多了一个字段, 叫做musicUrl
// 使用Object.assign在classicFields的基础上增加url字段
const musicFields = Object.assign({ url: Sequelize.STRING }, classicFields)
Music.init(musicFields, {
  sequelize,
  tableName: 'music',
})

module.exports = {
  Movie,
  Sentence,
  Music,
}
```

而相关的业务表`flow.js`写法如下:

```js
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Flow extends Model {}

Flow.init(
  {
    index: Sequelize.INTEGER,
    artId: Sequelize.INTEGER,
    // type是表示每天展现的形式
    // 100表示电影,200表示句子,300表示音乐
    type: Sequelize.INTEGER,
    fav_num: {
      type: Sequelize.INTEGER,
      // 可以设置默认值
      default: 0,
    },
  },
  {
    sequelize,
    tableName: 'flow',
  }
)

module.exports = {
  Flow,
}
```

### 数据排序(order), 删除(destory), 高级查找(find)

排序使用 order 属性进行排序操作:

```js
// flow按照index进行倒序, 取第一个
const flow = Flow.findOne({
  order: [['index', 'DESC']],
})
```

利用事务进行删除操作, 分为硬删除和软删除两种模式:

```js
await flow.destory({
  // 表明是硬删除还是软删除, 如果true表示硬删除,
  // false表示只是增加了一个delete_time, 数据还在
  force: false,
  // 传递的事务t
  transaction: t,
})
```

高级查找功能:

```js
const { Op } = require('sequelize')
// 找到所有年龄在16,17,18, 且type值不等于400的值, 并按照art_id进行分组
Favor.findAll({
  where: {
    ages: {
      [Op.in]: [16, 17, 18],
    },
    type: {
      // [Op.not]会转成一个字符串, 也就是说a可以是表达式进行运算,[a]会变为一个字符串
      [Op.not]: 400,
    },
  },
  // 分组情况
  group: ['art_id'],
  // 返回的属性
  attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']],
})
```

### 模型序列化

首先添加`增加电影`和`读取电影`的 api, 由于返回给用户的信息需要增加或者删除某些字段, 因此这里对返回属性进行了一定的修改

```js
// 增加电影情况
router.post('/movie/add', new Auth(2).m, async (ctx) => {
  const v = await new MovieAddValidator().validate(ctx)
  const movie = {
    title: v.get('body.title'),
    content: v.get('body.content'),
  }
  await Movie.create(movie)
  throw new Success()
})

// 返回指定id的电影
router.get('/movie/:id', new Auth(2).m, async (ctx) => {
  const v = await new MovieGetValidator().validate(ctx)
  const queryId = v.get('path.id')
  const movie = await Movie.getMovieById(queryId)
  // 在返回结果中增加某个属性, 需要加到dataValues中去
  // movie.dataValues.addAttrib = '增加的属性'
  // 但是不推荐这种写法, sequlize提供了增加属性的方法时
  movie.setDataValue('addAttrib', '增加的属性')
  ctx.body = movie
})
```

通过在电影模型的序列化时指定导出的属性, 可以有效控制前端展现的情况:

```js
// 定义电影的模型类
class Movie extends Model {
  static async getMovieById(id) {
    const movie = await Movie.findOne({
      where: { id },
    })
    if (!movie) {
      throw new NotFound('未能找到指定id的电影')
    }
    return movie
  }

  // 利用toJson方法, 返回指定数据
  // 如果想排除某些数据, 可以先拷贝this.dataValue的所有值, 然后删除指定属性
  toJSON() {
    return {
      title: this.getDataValue('title'),
      content: this.getDataValue('content'),
    }
  }
}
```

因此, 可以在 Model 基类上定义 toJSON, 可以全局排除

```js
// 导入lodash中的去除属性和浅拷贝方法
const { unset, clone } = require('lodash')

// 在Model基类上定义toJSON方法排除3个日期字段
Model.prototype.toJSON = function() {
  let data = clone(this.dataValues)
  unset(data, 'updated_at')
  unset(data, 'created_at')
  unset(data, 'deleted_at')
  // 如果对象有exclude数组, 则在序列化的时候排除指定属性
  if (isArray(this.exclude)) {
    this.exclude.forEach((value) => unset(data, value))
  }

  return data
}
```

使用的时候也很简单,在 api 最终调用的时候, 对于模型返回的 sequelize 对象增加 exclude 数组, 即可排除指定属性, 例如`movie.exclude = ['pubdate']`

### 数据库事务(Transaction)

默认情况下，Sequelize 不使用事务。但是，对于 Sequelize 的生产使用，应该将 Sequelize 配置为使用事务, [示例说明文档](https://sequelize.org/master/manual/transactions.html)叙述的非常详细.
Sequelize 支持两种使用事务的方式：

- 非托管事务：提交和回滚事务应由用户手动完成（通过调用适当的 Sequelize 方法）。
- 托管事务：如果引发任何错误，Sequelize 将自动回滚事务，否则将提交事务。

```js
return sequelize.transaction(async (t) => {
  await Favor.create({ art_id, type, uid }, { transaction: t })
  const art = await Art.getData(art_id, type)
  // 利用increment方法可以给某个值增加一个数, 后面传的by后面就是增加的值
  // decrement表示减去一个数
  await art.increment('fav_num', { by: 1, transaction: t })
})
```

## 其他需要注意的问题

### 常见问题

1. `axios`库对于中文不会自动进行编码, 因此需要用 node.js 内置的`encodeURI()`将可能为中文的字段进行转码.
2. mysql 对于形如`%sql%`的模糊搜索, 会执行全表扫描, 不走索引, 所以速度比较慢.
3. 在 Model 上不要定义构造函数, 否则会出错.

### 增加跨域中间件(cross-domain)

在`middlewares`文件夹下新增`cross-domain.js`文件, 主要处理与前端项目的跨域请求问题, 前端项目的地址写到全局配置`config.js`中, 增加一行`frontServer: 'http://localhost:3000'`, `cross-domain.js`主要内容如下:

```js
const crossDomain = async (ctx, next) => {
  const frontServer = global.config.frontServer
  ctx.set('Access-Control-Allow-Origin', frontServer) // 配置跨域范围
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  // 保证OPTIONS能返回200
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
}

module.exports = crossDomain
```

然后在 app.js 中增加跨域中间件

```js
const crossDomain = require('./middlewares/cross-domain')

const app = new Koa()
app.use(catchError)
// 配置跨域设置
app.use(crossDomain)
app.use(parser())
InitManager.initCore(app)

app.listen(8080)
console.log('Server Start in port 8080!')
```
