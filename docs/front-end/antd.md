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
