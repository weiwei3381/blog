# Vue项目实战

## 环境搭建

### 初始化项目之 Vite 模式

Vite 是尤雨溪又一力作，号称下一代开发构建工具，由于其支持原生 ES 模块导入方法，所以它允许快速提供代码，使得开发效率大大提高。使用 Vite 启动一个项目，打开命令行工具输入：

```javascript
// 兼容性注意，Vite 需要 Node.js 版本 >= 12.0.0。
npm init @vitejs/app
```

::: tip 延伸扩展
`npm init @vitejs/app`[究竟做了什么](https://juejin.cn/post/6948202986573135908)？npm init 对于我们来说应该非常熟悉了，通常我们使用 npm init 初始化一个 package.json 文件来起手一个项目。[npm-init文档](https://docs.npmjs.com/cli/v7/commands/npm-init)显示这个命令后面是可以携带参数。

简单来说，`npm init <initializer>` 通常被用于创建一个新的或者已经存在的 npm 包。`initializer` 在这里是一个名为 `create-<initializer>` 的 npm 软件包，该软件包将由 npx 来安装，然后执行其 `package.json` 中 bin 属性对应的脚本，会创建或更新 `package.json` 并运行一些与初始化相关的操作。

`npm init @vitejs/app`命令等同于：`npx @vitejs/create-app`。

查看 ViteJs 源码发现 packages 文件夹中确实存在一个 create-app 目录。
:::

根据提示输入项目名称和需要选择的模板（这里我们选择 vue 模板），并通过下列指令启动项目：

```batch
cd vue3-vite
npm install (or `yarn`)
npm run dev (or `yarn dev`)
```

和 Vue CLI 启动项目有所区别的是，配置文件变成了 vite.config.js，可以通过[官方文档](https://cn.vitejs.dev/)查看相应的属性，如 port、base、plugins 等等。
