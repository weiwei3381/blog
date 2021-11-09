module.exports = {
  // 提交到gitee则开启base
  base: '/blogs/',
  title: '小熊的技术文档',
  description: '衣带渐宽终不悔，为伊消得人憔悴',
  head: [
    // 增加自定义的 icon, 作为网页图标
    ['link', { rel: 'icon', href: '/fav.ico' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href:
          '/css/katex.min.css',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href:
          '/css/github-markdown.min.css',
      },
    ],
  ],
  // 设置输出目录
  dest: './dist',
  // 设置主题配置项
  themeConfig: {
    // 将同时提取markdown中h2和h3标题，显示在侧边栏上。
    sidebarDepth: 2,
    // 文档更新时间：每个文件git最后提交的时间
    lastUpdated: '更新于',
    // 添加导航栏
    nav: [
      
      { text: '🎨前端', link: '/front-end/' },
      { text: '💻后端', link: '/back-end/' },
      { text: '🚀实战', link: '/practice/' },
      { text: '🏢办公', link: '/office/' },
      { text: '🍓通用', link: '/general/' },
      { text: '🐸论文', link: '/paper/' },
      { text: '⚡快速笔记', link: '/general/fast' },
      {
        text: '🦉近期重点',
        items: [
          { text: '🐇python常用模块', link: '/back-end/python' },
          { text: '🌹zrender源码解析', link: '/practice/zrender' },
        ],
      },
      {
        text: '⭐️资源',
        // 这里是下拉列表展现形式。
        items: [
          { text: '小鸟搜索', link: 'https://www.birdiesearch.com/' },
          { text: '每天一本编程书', link: 'https://salttiger.com/' },
          { text: '开发者边车', link: 'https://gitee.com/docmirror/dev-sidecar' },
        ],
      },
    ],
    // 为以下路由添加侧边栏
    sidebar: {
      // 前端
      '/front-end/': [
        'javascript', 'pattern', 'typescript', 'es6', 'css',
        'node', 'design', 'npm', 'vuepress', 'babel', 'vue', 'react'
      ],
      // 后端
      '/back-end/': ['daily', 'python', 'python-projects', 'koa2', 'numpy', 'docker'],
      // 实战
      '/practice/': ['Hilo', 'canvas', 'react', 'zrender', 'search', 'phaser', 'medicine'],
      // 办公
      '/office/': ['word', 'excel', 'other', 'software'],
      // 通用
      '/general/': ['fast', 'git', 'markdown', 'nexus', 'latex', 'vscode', 'guide', 'reg'],
      // 论文
      '/paper/': ['writing', 'search', 'defense', 'cover', '2020Auguest', 'daily', 'technology', 'strategy', 'mpc', 'MARL', 'UAV','clustering'],
    },
  },
  // vuepress插件系统
  plugins: [
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10,
      },
    ],
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor',
      },
    ],
    ['@vuepress/back-to-top'],
    ['vuepress-plugin-code-copy', true],
  ],
  // markdown增强
  markdown: {
    extendMarkdown: (md) => {
      md.set({
        breaks: true,
        html: true,
      })
      md.use(require('markdown-it-katex'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-mark'))
      md.use(require('markdown-it-ins'))
    },
  },
}
