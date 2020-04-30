# vuepress 基本配置

> [vuepress](https://www.vuepress.cn/)是一个**Vue.js 驱动的静态网站生成器**，它以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。

## 基础路径（Base URL）

如果 vuepress 会被部署到一个非根路径，你将需要在`.vuepress/config.js` 中设置`base`，举例来说，如果你打算将你的网站部署到 `https://foo.github.io/bar/`，那么`base`的值就应该被设置为 `"/bar/"`(**应当总是以斜杠开始，并以斜杠结束**)。  
有了基础路径（Base URL），如果你希望引用一张放在`.vuepress/public`中的图片，你需要使用这样路径：`/bar/image.png`，但是一旦修改`base`则路径全部失效。为了解决这个问题，VuePress 提供了内置的一个 helper 函数`$withBase`（它被注入到了 Vue 的原型上），可以帮助你生成正确的路径，可以在 Vue 组件和 Markdown 文件都使用下面的 url 写法。

```javascript
<img :src="$withBase('/foo.png')" alt="foo">
<a :href="$withBase('/flappybird.zip')" >资源下载</a>
```

## config 配置

`config.js`文件配置在`docs/.vuepress`目录下，基本写法如下:

```js
module.exports = {
  // 设置基础路径
  base: '/blogs/',
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
          { text: '每天一本编程书', link: 'https://salttiger.com/' },
        ],
      },
    ],
    // 为以下路由添加侧边栏
    sidebar: {
      '/前端/': ['vuepress', 'babel'],
      '/通用/': ['vscode', 'guide'],
    },
  },
}
```

## 二级目录下的 README.md

在`docs`文件夹下新建目录，例如`/home`，然后在目录中新建文件`README.md`，这就相当于生成了`/home/index.html`，使用`http://localhost:8080/home`即可访问该文件。

## 配置导航栏与侧边栏

可以通过设置 themeConfig.nav 来添加导航链接，通过设置 themeConfig.sidebar 属性来添加侧边栏。如果您的导航是一个下拉列表，可以通过 items 属性来设置，示例代码如下。

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
          {
            text: 'focus-outside',
            link: 'https://github.com/txs1992/focus-outside',
          },
          {
            text: 'stylus-converter',
            link: 'https://github.com/txs1992/stylus-converter',
          },
        ],
      },
    ],
    // 为以下路由添加侧边栏
    sidebar: ['/', '/git', '/vue'],
  },
}
```

有些时候我们可能需要一个多级侧边栏，例如一个博客系统，将一些类似的文章放在相同的目录下方，我们希望为这些目录的所有文件都添加侧边栏，就像下面这样的一个目录。

```markdown
docs
├── README.md
├── vue
│ ├─ README.md
│ ├─ one.md
│ └─ two.md
└── css
├─ README.md
├─ three.md
└─ four.md
```

对于多级目录的侧边栏，我们需要用使用对象描述的写法，下面的`/git/` 表示在 git 目录，默认指向`/git/README.md` 文件。

```js
// dcos/.vuepress/config.js
module.exports = {
  themeConfig: {
    sidebar: {
      '/vue/': ['one', 'two'],
      '/css/': ['three', 'four'],
    },
  },
}
```

::: tip
你在 config.js 里配置的名字，要和你在文件夹下新建的名字一致，但是实际侧边栏的名字，是你在`文档.md`文件下写的第一个标题的名字.
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

默认的主题提供了一个首页（Homepage）的布局(用于这个网站的主页)。想要使用它，需要在你的根目录下`README.md`采用`home: true`，然后添加数据，示例代码如下：

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

## markdown 插件

### 提示框

输入

```markdown
// tip 后面加名称可以自定义标题
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

### Emoji 表情

输入`:tada:`，`:100:`，会输出:tada:，:100:，这是 VuePress 所有支持的 Emoji 表情[列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)

常用的表情有:

1. **表情类**：微笑(smile): :smile: | 笑中带泪(joy): :joy: | 眨眼笑(wink): :wink: | 无语(no_mouth): :no_mouth: | 震惊(scream): :scream: | 睡着(zzz): :zzz:

2. **动物类**：狗狗(dog): :dog: | 猫猫(cat): :cat: | 老鼠(mouse): :mouse: | 兔子(rabbit): :rabbit: | 熊(bear): :bear: | 鱼(fish): :fish: | 青蛙(frog): :frog: | 猴子(monkey): :monkey: | 小鸟(bird): :bird: | 虫子(bug): :bug: | 蛇(snake): :snake:

3. **植物类**: 向日葵(sunflower): :sunflower: | 玫瑰(rose): :rose: | 草药(herb): :herb:

4. **水果类**: 苹果(apple): :apple: | 梨子(pear): :pear: | 柠檬(lemon): :lemon: | 香蕉(banana): :banana: | 西瓜(watermelon): :watermelon: | 草莓(strawberry): :strawberry: | 桃子(peach): :peach:

5. **食物类**: 便当(bento): :bento: | 米饭(rice): :rice: | 冰激凌(icecream): :icecream: | 啤酒(beer): :beer:

6. **物品类**: 钻石(gem): :gem: | 手枪(gun): :gun: | 药丸(pill): :pill: | 钥匙(key): :key: | 问题(question): :question: | 放大镜(mag): :mag: | 备忘(memo): :memo: | 邮件(email): :email: | 礼物(gift): :gift: | 脚印(feet): :feet: | 调色盘(art): :art: | 铅笔(pencil2): :pencil2:

7. **天气类**: 晴天(sunny): :sunny: | 晴有多云(partly_sunny): :partly_sunny: | 多云(cloud): :cloud: | 雨天(cloud_with_rain): :cloud_with_rain: | 彩虹(rainbow): :rainbow: | 雪花(snowflake): :snowflake: | 雪人(snowman): :snowman:

8. **景观类**: 月亮(moon): :moon: | 星星(star): :star: | 太阳(sun_with_face): :sun_with_face: | 海浪(ocean): :ocean:

9. **提醒类**: 警告(warning): :warning: | 问题(question): :question: | 注意(exclamation): :exclamation: | 叉叉(x): :x: | 圈圈(o): :o: | 救命(sos): :sos: | 放射性(radioactive): :radioactive: | 有毒(biohazard): :biohazard:

10. **状态类**: 点赞(+1): :+1: | 不推荐(-1): :-1: | 灵感(bulb): :bulb: | 红心(heart): :heart: | 火(fire): :fire: | 电(zap): :zap: | 炸了(boom): :boom: | 火箭(rocket): :rocket: | 正中靶心(dart): :dart: | 金牌(trophy): :trophy:

### 代码块增强

VuePress 提供的代码块支持多种语言，例如`java`、`html`、`xml`等，其中有些语言可以简写，例如`js`(javascript)、`py`(python)、`vb`(Visual Basic)。
另外，有些不常用语言也意外的支持:joy:，例如: `git`(git 代码)，`batch`(批处理文件)，`matlab`(Matlab)，`yaml`(Yaml), 所有支持的语言可以访问[支持列表](https://prismjs.com/)查看。

### 脚注、高亮、下划线与待办事项(markdown 增强)

[markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)插件为 vuepress 增加了高亮的语法, 首先使用命令`npm install markdown-it-mark --save`进行安装, 安装完毕后在`config.js`中启用该插件, 使用语法是用两个`=`包裹需要高亮的语句, 但是包裹对象需要跟前后用空格隔开, 实现的效果就像这样: ==注意, markdown 与 plugins 是平级的.==

```js
markdown: {
    extendMarkdown: (md) => {
      md.set({
        breaks: true,
        html: true,
      })
      md.use(require('markdown-it-katex'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-task-lists'))
      // 增加高亮
      md.use(require('markdown-it-mark'))
      md.use(require('markdown-it-ins'))
    },
  },
```

类似的还有脚注, 待办事项和下划线.

```md
1. 脚注:
   这里主要用到了 PSO 算法[^1], 以及相应的改进算法[^2]
   [^1]:PSO 算法情况，会自动拉到最后面排版
   [^2]:PSO 改进算法

2. 高亮共有两种写法：
   使用<mark>html 标签</mark>进行高亮  
   这是 ==一段高亮的句子==

3. 下划线共有两种写法:
   <ins>html 标签的下划线</ins>
   ++下划线++

4. 待办事项：

- [ ] 旅行准备
  - [x] 买好需要的衣服
```

**渲染为:**
这里主要用到了 PSO 算法[^1], 以及相应的改进算法[^2]  
[^1]:PSO 算法情况，会自动拉到最后面排版  
[^2]:PSO 改进算法

- [ ] 旅行准备
  - [x] 买好需要的衣服

使用<mark>html 标签</mark>进行高亮  
这是 ==一段高亮的句子==

<ins>html 标签的下划线</ins>
++下划线++
:::warning 注意
使用`+`或者`=`的高亮和下划线一般在单行中使用, 如果在同一行使用则需要 ==在两边增加空格== 与其他字符隔开, 否则不起效果!
:::

## 插件使用

vuepress 自带插件有 2 项:

- [@vuepress/plugin-last-updated](https://www.vuepress.cn/plugin/official/plugin-last-updated.html)
- [@vuepress/plugin-register-components](https://www.vuepress.cn/plugin/official/plugin-register-components.html)

默认主题自带的插件有:

- [@vuepress/plugin-active-header-links](https://www.vuepress.cn/plugin/official/plugin-active-header-links.html)
- [@vuepress/plugin-nprogress](https://www.vuepress.cn/plugin/official/plugin-nprogress.html)
- [@vuepress/plugin-search](https://www.vuepress.cn/plugin/official/plugin-search.html)
- [vuepress-plugin-container](https://vuepress.github.io/zh/plugins/container/)
- [vuepress-plugin-smooth-scroll](https://vuepress.github.io/zh/plugins/smooth-scroll/)

tips: 在[awesome-vuepress](https://github.com/vuepressjs/awesome-vuepress#plugins)项目上列举了许多 vuepress 的插件。

### 搜索插件

默认主题自带搜索插件，启用方法如下：

```js
// .vuepress/config.js or themePath/index.js
module.exports = {
  plugins: [
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 5,
      },
    ],
  ],
}
```

### 页面滚动时侧边栏自动激活

开启与配置选项：

```js
module.exports = {
  plugins: [
    '@vuepress/active-header-links',
    {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor',
    },
  ],
}
```

### 返回页面顶端插件

该插件默认不提供, 需要安装`npm install -D @vuepress/plugin-back-to-top`，安装后开启选项：

```js
module.exports = {
  plugins: ['@vuepress/back-to-top'],
}
```

## Latex 公式支持

### 安装 Latex 公式增强

使用命令`npm install markdown-it-katex`安装**markdown-it-katex**，在*config.js*中启用"markdown"增强：

```js
module.exports = {
  markdown: {
    extendMarkdown: (md) => {
      md.set({
        breaks: true,
        html: true,
      })
      md.use(require('markdown-it-katex'))
    },
  },
}
```

然后添加与 katex 相关的 css 属性，需要在*config.js*中的`head`属性中增加相关配置：

```js
module.exports = {
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css',
      },
    ],
  ],
}
```

### Latex 公式语法

Latex 公式主要语法如下：

```tex
行内公式: $x^2+y^2=z$
段中公式:
$$a_1+a_2 = b_1$$
```

显示情况:
::: tip Latex 公式效果
行内公式: $x^2+y^2=z$
段中公式:
$$a_1+a_2 = b_1$$
:::
