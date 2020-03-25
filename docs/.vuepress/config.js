module.exports = {
  // 提交到gitee则开启base
  base: '/blogs/',
  title: '小熊的技术Blog',
  description: '衣带渐宽终不悔，为伊消得人憔悴',
  head: [
    // 增加自定义的 icon, 作为网页图标
    ['link', { rel: 'icon', href: '/fav.ico' }], 
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
    ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }]
  ],
  // 设置输出目录
  dest: './dist',
  // 设置主题配置项
  themeConfig: {
    // 将同时提取markdown中h2和h3标题，显示在侧边栏上。
    sidebarDepth: 2,
    // 文档更新时间：每个文件git最后提交的时间
    lastUpdated: '最近更新',
    // 添加导航栏
    nav: [
      { text: '🎨前端技术', link: '/front-end/' },
      { text: '💻后端编程', link: '/back-end/' },
      { text: '🏢高效办公', link: '/office/' },
      { text: '🍓通用知识', link: '/general/' },
      {
        text: '⭐️资源',
        // 这里是下拉列表展现形式。
        items: [
          { text: '小鸟搜索', link: 'https://www.birdiesearch.com/' },
          { text: '每天一本编程书', link: 'https://salttiger.com/' },
          { text: 'emoji表情大全', link: 'https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json' },
        ]
      }
    ],
    // 为以下路由添加侧边栏
    sidebar: {
      '/front-end/': [
        'javascript',
        'es6',
        'vuepress',
        'babel',
      ],
      '/office/':[
        'word'
      ],
      '/general/': [
        'git',
        'vscode',
        'latex',
        'guide'
      ]
    }
  },
  // 插件系统
  plugins: [
    ['@vuepress/search', {
      searchMaxSuggestions: 5
    }],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    }],
    ['@vuepress/back-to-top'],
  ],
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