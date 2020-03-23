module.exports = {
    // 提交到gitee则开启base
    base:'/blogs/',
    title: '贺小熊的技术Blog',
    description: '衣带渐宽终不悔',
    // 设置输出目录
    dest: './dist',
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
              { text: '掘金', link: 'https://juejin.im/' },
            ]
          }
        ],
        // 为以下路由添加侧边栏
        sidebar: {
            '/front-end/': [
              'vuepress',
              'babel',
            ],
            '/general/':[
              'vscode',
              'guide'
            ]
          }
      }
  }