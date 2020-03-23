# vuepress基本配置

## 基础路径（Base URL）

如果vuepress会被部署到一个非根路径，你将需要在`.vuepress/config.js` 中设置`base`，举例来说，如果你打算将你的网站部署到 `https://foo.github.io/bar/`，那么`base`的值就应该被设置为 `"/bar/"`(**应当总是以斜杠开始，并以斜杠结束**)。  
有了基础路径（Base URL），如果你希望引用一张放在`.vuepress/public`中的图片，你需要使用这样路径：`/bar/image.png`，但是一旦修改`base`则路径全部失效。为了解决这个问题，VuePress 提供了内置的一个helper函数`$withBase`（它被注入到了 Vue 的原型上），可以帮助你生成正确的路径, 可以在Vue组件和Markdown文件都使用下面的url写法。

```javascript
<img :src="$withBase('/foo.png')" alt="foo">
```

## config配置

`config.js`文件配置在`docs/.vuepress`目录下, 基本写法如下:

```javascript
module.exports = {
    // 设置基础路径
    base:'/blogs/',
    // 设置网页标题
    title: '贺小熊的技术Blog',
    // 设置网页描述
    description: '衣带渐宽终不悔',
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

```javascript
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

```javascript
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

**tips**: 你在config.js里配置的名字，要和你在文件夹下新建的名字一致，但是实际侧边栏的名字，是你在`文档.md`文件下写的第一个标题的名字.
重新启动，刷新浏览器，你会看到设置已经生效的，但是貌似还是有点问题，你在.md文件下生成的每一个标题都会生成一个二级的页面，设置config.js取消掉

```javascript
module.exports = {
  themeConfig: {
    sidebarDepth: '0',
  }
}
```

## 自定义页面

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
