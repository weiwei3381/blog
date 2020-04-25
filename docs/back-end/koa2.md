# 使用 koa2 开发服务端

## 初始化

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

使用`npm init -y`后, 安装所有模块使用`npm install`

### 最简单服务器

koa2 服务器运行很简单, 下面代码运行最基本的 koa2 服务器

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
