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
    // 区分开发环境和生产环境, 如果是开发环境则抛出错误信息
    if (global.config.enviroment === 'dev') {
      throw error
    }
    // 处理错误代码, 这里省略了
    if (error instanceof HttpException) {...} else {...}
  }
}

module.exports = catchError

```

## 参数校验(Validator)

### 使用校验器

koa2 没有特别好的校验器, 目前使用的是[lin-mizar](https://github.com/hpmax00/lin-mizar)提供的 validator 类, lin-mizar 是[LinCms](https://github.com/TaleLin/lin-cms-koa)的核心库, 首先下载<a :href="$withBase('/lin-validator.zip')" >lin-validator.zip</a>, 解压之后放到`core`文件夹下, 然后在`app`目录新建`validators`目录及`validator.js`文件, 目录结构如下:

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
