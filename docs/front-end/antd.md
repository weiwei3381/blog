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
