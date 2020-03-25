# vuepress基本配置

> [vuepress](https://www.vuepress.cn/)是一个**Vue.js驱动的静态网站生成器**, 它以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。

## 基础路径（Base URL）

如果vuepress会被部署到一个非根路径，你将需要在`.vuepress/config.js` 中设置`base`，举例来说，如果你打算将你的网站部署到 `https://foo.github.io/bar/`，那么`base`的值就应该被设置为 `"/bar/"`(**应当总是以斜杠开始，并以斜杠结束**)。  
有了基础路径（Base URL），如果你希望引用一张放在`.vuepress/public`中的图片，你需要使用这样路径：`/bar/image.png`，但是一旦修改`base`则路径全部失效。为了解决这个问题，VuePress 提供了内置的一个helper函数`$withBase`（它被注入到了 Vue 的原型上），可以帮助你生成正确的路径, 可以在Vue组件和Markdown文件都使用下面的url写法。

```javascript
<img :src="$withBase('/foo.png')" alt="foo">
```

## config配置

`config.js`文件配置在`docs/.vuepress`目录下, 基本写法如下:

```js
module.exports = {
    // 设置基础路径
    base:'/blogs/',
    // 设置网页标题
    title: '贺小熊的技术Blog',
    // 设置网页描述
    description: '衣带渐宽终不悔',
    // 网站图标配置
    head: [
      ['link', { rel: 'icon', href: '/fav.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    // 设置输出目录, 默认为docs/.vuepress/dist目录, 改为根目录下的dist文件夹
    dest: './dist',
    // 主题配置
    themeConfig: {
        // 添加导航栏
        nav: [
          { text: '前端', link: '/front-end/' },
          { text: '后端', link: '/back-end/' },
          { text: '办公', link: '/office/' },
          { text: '通用', link: '/general/' },
          {
            text: '资源',
            // 这里是下拉列表展现形式。
            items: [
              { text: '小鸟搜索', link: 'https://www.birdiesearch.com/' },
              { text: '每天一本编程书', link: 'https://salttiger.com/' }
            ]
          }
        ],
        // 为以下路由添加侧边栏
        sidebar: {
          '/前端/': [
              'vuepress',
              'babel',
            ],
            '/通用/':[
              'vscode',
              'guide'
            ]
        }
      }
  }
```


## 二级目录下的README.md

在`docs`文件夹下新建目录, 例如`/home`, 然后在目录中新建文件`README.md`, 这就相当于生成了`/home/index.html`, 使用`http://localhost:8080/home`即可访问该文件.  

## 配置导航栏与侧边栏

可以通过设置 themeConfig.nav 来添加导航链接，通过设置 themeConfig.sidebar 属性来添加侧边栏。如果您的导航是一个下拉列表，可以通过 items 属性来设置。示例代码如下.  

```js
// dcos/.vuepress/config.js
module.exports = {
  themeConfig: {
    // 添加导航栏
    nav: [
      { text: 'vue', link: '/' },
      { text: 'css', link: '/blog/' },
      { text: 'js', link: '/zhihu/' },
      {
        text: 'github',
        // 这里是下拉列表展现形式。
        items: [
          { text: 'focus-outside', link: 'https://github.com/txs1992/focus-outside' },
          { text: 'stylus-converter', link: 'https://github.com/txs1992/stylus-converter' }
        ]
      }
    ],
    // 为以下路由添加侧边栏
    sidebar: ['/', '/git', '/vue']
  }
}
```

有些时候我们可能需要一个多级侧边栏，例如一个博客系统，将一些类似的文章放在相同的目录下方，我们希望为这些目录的所有文件都添加侧边栏，就像下面这样的一个目录。

```markdown
docs
 ├── README.md
 ├── vue
 │    ├─ README.md
 │    ├─ one.md
 │    └─ two.md
 └── css
      ├─ README.md
      ├─ three.md
      └─ four.md
```

对于多级目录的侧边栏，我们需要用使用对象描述的写法，下面的`/git/` 表示在git目录，默认指向`/git/README.md` 文件。  

```js
// dcos/.vuepress/config.js
module.exports = {
  themeConfig: {
    sidebar: {
      '/vue/': [
        'one',
        'two'
      ],
      '/css/': [
        'three',
        'four'
      ]
    }
  }
}
```  

::: tip
你在config.js里配置的名字，要和你在文件夹下新建的名字一致，但是实际侧边栏的名字，是你在`文档.md`文件下写的第一个标题的名字.
:::

设置侧边栏的层级显示和页面结尾显示[最后更新时间], 代码示例如下:

```js
  themeConfig: {
    // 将同时提取markdown中h2和h3标题，显示在侧边栏上
    sidebarDepth: 2,
    // 文档更新时间：每个文件git最后提交的时间
    lastUpdated: '最近更新',
  }
```

## 自定义首页

默认的主题提供了一个首页（Homepage）的布局(用于这个网站的主页)。想要使用它，需要在你的根目录下`README.md`采用`home: true`，然后添加数据, 示例代码如下

```markdown
---
home: true
heroImage: /hero.png
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You
---
```

## markdown增强

### 提示框

输入

```markdown
// tip后面加名称可以自定义标题
::: tip 注意
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: details
这是一个详情块，在 IE / Edge 中不生效
:::
```

会输出:
::: tip 注意
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: details
这是一个详情块，在 IE / Edge 中不生效
:::

### Emoji表情

输入`:tada:`, `:100:`, 会输出:tada:, :100:, 这是VuePress所有支持的Emoji表情[列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)

常用的表情有:

- 微笑(smile): :smile:
- 笑中带泪(joy): :joy:
- 无语(no_mouth): :no_mouth:
- 震惊(scream): :scream:
- 点赞(+1): :+1:
- 不推荐(-1): :-1:
- 狗狗(dog): :dog:
- 猫猫(cat): :cat:
- 灵感(bulb): :bulb:
- 钻石(gem): :gem:
- 手枪(gun): :gun:
- 药丸(pill): :pill:
- 钥匙(key): :key:
- 红心(heart): :heart:
- 问题(question): :question:
- 放大镜(mag): :mag:
- 备忘(memo): :memo:
- 邮件(email): :email:
- 礼物(gift): :gift:
- 火(fire): :fire:
- 电(zap): :zap:
- 炸了(boom): :boom:
- 晴天(sunny): :sunny:
- 彩虹(rainbow): :rainbow:
- 海浪(ocean): :ocean:

### 代码块增强

VuePress提供的代码块支持多种语言, 例如`java`, `html`, `xml`等, 其中有些语言可以简写, 例如`js`(javascript), `py`(python), `vb`(Visual Basic).
另外, 有些不常用语言也意外的支持:joy:, 例如: `git`(git代码),`batch`(批处理文件), `matlab`(Matlab), `yaml`(Yaml), 所有支持的语言可以访问[支持列表](https://prismjs.com/)查看.

## 插件使用

vuepress自带插件有2项:

- [@vuepress/plugin-last-updated](https://www.vuepress.cn/plugin/official/plugin-last-updated.html)
- [@vuepress/plugin-register-components](https://www.vuepress.cn/plugin/official/plugin-register-components.html)

默认主题自带的插件有:

- [@vuepress/plugin-active-header-links](https://www.vuepress.cn/plugin/official/plugin-active-header-links.html)
- [@vuepress/plugin-nprogress](https://www.vuepress.cn/plugin/official/plugin-nprogress.html)
- [@vuepress/plugin-search](https://www.vuepress.cn/plugin/official/plugin-search.html)
- [vuepress-plugin-container](https://vuepress.github.io/zh/plugins/container/)
- [vuepress-plugin-smooth-scroll](https://vuepress.github.io/zh/plugins/smooth-scroll/)

tips: 在[awesome-vuepress](https://github.com/vuepressjs/awesome-vuepress#plugins)项目上列举了许多vuepress的插件

### 搜索插件

默认主题自带搜索插件, 启用方法如下:

```js
// .vuepress/config.js or themePath/index.js
module.exports = {
  plugins: [
    ['@vuepress/search', {
      searchMaxSuggestions: 5
    }]
  ]
}
```

### 页面滚动时侧边栏自动激活

开启与配置选项:

```js
module.exports = {
  plugins: ['@vuepress/active-header-links', {
    sidebarLinkSelector: '.sidebar-link',
    headerAnchorSelector: '.header-anchor'
  }]
}
```

### 返回页面顶端插件

该插件默认不提供, 需要安装`npm install -D @vuepress/plugin-back-to-top`, 安装后开启选项:

```js
module.exports = {
  plugins: ['@vuepress/back-to-top']
}
```

## Latex公式支持

### 安装Latex公式增强

使用命令`npm install markdown-it-katex`安装**markdown-it-katex**, 在*config.js*中启用"markdown"增强:

```js
module.exports = {
  markdown: {
    extendMarkdown: md => {
      md.set({
        breaks: true,
        html: true,
      });
      md.use(require('markdown-it-katex'))
    }
  }
}
```

然后添加与katex相关的css属性, 需要在*config.js*中的`head`属性中增加相关配置:

```js
module.exports = {
  head: [
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
    ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }]
  ],
}
```

### Latex公式语法

Latex公式主要语法如下:

```tex
行内公式: $x^2+y^2=z$
段中公式:
$$a_1+a_2 = b_1$$
```

显示情况:
::: tip Latex公式效果
行内公式: $x^2+y^2=z$
段中公式:
$$a_1+a_2 = b_1$$
:::
