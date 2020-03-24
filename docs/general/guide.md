# 搭建指南

> 大哉问。学习需要明师。但明师可遇不可求，所以退而求其次你需要好书，并尽早建立自修的基础。迷时师渡，悟了自渡，寻好书看好书，就是你的自渡法门。切记，徒学不足以自行，计算机是实作性很强的一门科技，你一定要动手做，最忌讳眼高手低。学而不思则罔，思而不学则殆，一定要思考、沉淀、整理。

1. 本项目部署在[github/blog](https://github.com/weiwei3381/blog)上, 提供自动部署脚本, 使用`git clone`命令后, 运行`npm install`即可安装相应依赖.
2. 更新并部署到github(默认), 则在终端运行`npm run deploy`即查看[github主页](https://weiwei3381.github.io/).  
3. 更新并部署到gitee(码云), 需要在`.vuepress\config.js`中增加一行`base:'/blogs/'`, 然后运行`npm run deploy:gitee`即自动部署,部署完毕后,需要手动登陆[myblogs配置页](https://gitee.com/weiwei3381/blogs/pages), 进行更新. 更新完毕后, 即可查看[gitee主页](http://weiwei3381.gitee.io/blogs/).  
4. 开发时, 使用命令`npm run dev`即可打开[开发服务器](http://localhost:8080/).

::: tip 致谢
本项目灵感来源于[Notes速查表](https://notes.itzkp.com/), 可以上[github项目页面](https://github.com/zhukunpenglinyutong/notes)查看源码, 感谢[朱昆鹏](https://github.com/zhukunpenglinyutong)同学.
:::
